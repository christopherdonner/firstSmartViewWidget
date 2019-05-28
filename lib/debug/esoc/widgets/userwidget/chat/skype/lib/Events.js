/* Copyright (C) Microsoft 2014. All rights reserved. */
csui.define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone'],
    function (module, _require, $, _, Backbone) {
      /// <summary>
      /// Events functions can be used to automatically issue event channel requests and
      /// process the resulting responses.
      /// </summary>
      /// <remarks>
      /// These functions also provide a way for business logic to register event handlers.
      /// These handlers are invoked when relevant data is found during response processing.
      /// </remarks>
      /// <param name="cache">Cache object used during eventing.</param>
      /// <param name="transport">Transport object used during eventing.</param>
      /// <param name="options">Object for configuring rate at which events are polled.</param>
      var Events = Backbone.Model.extend({

        _handlingEvents: false,
        // The handlers registered to listen for events
        _handlers: {},

        // The state of the event processing pipeline

        /// <summary>
        /// Continues the event cycle by requesting the next event response.
        /// </summary>
        /// <param name="data">Data to check for event resources.</param>
        /// <remarks>
        /// Check the supplied data object to see if it is non-null and that
        /// _links exists. If it sees either a resync or next resource on
        /// the _links property, make an HTTP request on it to continue the
        /// event cycle. Note that resync is given precedence over next.
        /// </remarks>
        constructor: function Events(cache, transport, options) {
          this.cache = cache;
          this.transport = transport;
          this.options = options;
          Backbone.Model.prototype.constructor.apply(this, arguments);
        },

        /// <summary>
        /// Normalizes event type for easier processing.
        /// </summary>
        /// <param name="eventType">The type of the event being processed.</param>
        /// <remarks>
        /// Noramlize added to started and deleted to completed.
        /// </remarks>
        normalizeEventType: function (eventType) {
          var normalizedEventType = eventType;

          if (normalizedEventType === 'added') {
            normalizedEventType = 'started';
          }

          if (normalizedEventType === 'deleted') {
            normalizedEventType = 'completed';
          }

          return normalizedEventType;
        },

        /// <summary>
        /// Determines whether there are any listeners for this event.
        /// </summary>
        /// <param name="cachedData">The event being checked.</param>
        /// <remarks>
        /// Check for listeners based on operationId, rel, or href.
        /// Also check the global handler, *.
        /// For ease of use, this will fetch a non-embedded resource
        /// and pass it to the handler. Advanced applications might choose to omit
        /// this behavior and decide to fetch in the business logic.
        /// </remarks>
        checkHrefOrOperationListeners: function (cachedData, parts) {
          var tempEventType = this.normalizeEventType(cachedData.type),
              opId          = null,
              localHandlers = [];

          if (cachedData._embedded) {
            opId = cachedData._embedded[cachedData.link.rel].operationId || null;
          }

          localHandlers.push(this._handlers[opId]);
          localHandlers.push(this._handlers[cachedData.link.rel]);
          localHandlers.push(this._handlers[cachedData.link.href]);
          localHandlers.push(this._handlers['*']);
          for (var i = 0; i < localHandlers.length; i++) {
            if (localHandlers[i] && localHandlers[i][tempEventType]) {
              var handler = localHandlers[i][tempEventType];
              try {
                handler(cachedData, parts);
              } catch (e) {
                window.console.log(
                    "Encountered error executing event handler callback: " + e.message);
              }
            }
          }
        },

        /// <summary>
        /// Process event data and notify any subscribed handlers.
        /// </summary>
        /// <param name="data">Event data to process.</param>
        /// <remarks>
        /// Determine whether event handling is already active. If so, iterate over
        /// each event in the response, caching each and
        /// seeing if any match one or more registered handlers.
        /// </remarks>

        processEvents: function (results) {
          var presenceEventLinks = [],
              handler            = [],
              id                 = 0;

          if (results && results.sender && results.sender.length > 0 && results.sender[0]) {
            for (var item in results.sender) {
              var ref = results.sender[item].events;
              for (var subItem in ref) {
                if (!!ref[subItem].link.rel && ref[subItem].link.rel === "contactPresence") {
                  presenceEventLinks[id] = ref[subItem].link.href;
                  handler[id] = ref[subItem].type;
                  id += 1;
                }
              }
            }
            if (handler.length > 0 && !!this._handlers && !!this._handlers.contactPresence) {
              this._handlers.contactPresence.updated(presenceEventLinks);
            }
          }
        },

        /// <summary>
        /// Determine if events href should include additional query parameters.
        /// </summary>
        /// <param name="href">Initial href to events</param>
        /// <remarks>
        /// Events has an internal options object that describe the rate at which
        /// low and medium events (in seconds, 5 minimum / 1800 maximum), priority
        /// for event requests (0 minimum), and timeout when no events are received
        /// (in seconds, 180 minimum, 1800 maximum).
        /// </remarks>
        /// <returns>Href with the appropriate query parameter additions.</returns>
        getEventsHref: function (href) {
          if (this.options) {
            if (this.options.low) {
              if (this.options.low < 5) {
                this.options.low = 5;
              } else if (this.options.low > 1800) {
                this.options.low = 1800
              }

              href += "&low=" + this.options.low;
            }

            if (this.options.medium) {
              if (this.options.medium < 5) {
                this.options.medium = 5;
              } else if (this.options.medium > 1800) {
                this.options.medium = 1800
              }

              href += "&medium=" + this.options.medium;
            }

            if (this.options.priority) {
              if (this.options.priority < 0) {
                this.options.priority = 0;
              }

              href += "&priority=" + this.options.priority;
            }

            if (this.options.timeout) {
              if (this.options.timeout < 180) {
                this.options.timeout = 180;
              } else if (this.options.timeout > 1800) {
                this.options.timeout = 1800
              }

              href += "&timeout=" + this.options.timeout;
            }
          }

          return href;
        },

        /// <summary>
        /// Starts listening to the event channel.
        /// </summary>
        /// <remarks>
        /// Determines whether event handling is already active. If not, it makes
        /// the initial request to start receiving data via the event channel.
        /// </remarks>
        startEvents: function (url) {
          var that = this;
          if (!that._handlingEvents) {
            that._handlingEvents = true;
          }
          return that._handlingEvents;
        },

        /// <summary>
        /// Stops listening to the event channel.
        /// </summary>
        /// <remarks>
        /// Stops listening to the event channel and clears the event handler array.
        /// </remarks>
        stopEvents: function () {
          this._handlingEvents = false;
          this._handlers.length = 0;
        },

        /// <summary>
        /// Adds an event handler.
        /// </summary>
        /// <param name="raiser">The raiser of the event that will trigger the handlers.</param>
        /// <param name="handlers">The set of handlers, one for each event type.</param>
        /// <remarks>
        /// raiser should be an object containing one of the following:
        /// {
        ///     href: "myLink" (relative URL of the resource provided by the server),
        ///     rel: "people" (relation type),
        ///     operationId: "1918-bf83" (unique, client-supplied ID for tracking operation resources on the event channel)
        /// }
        /// handlers should be an object containing one or more of the following:
        /// {
        ///     started : function(data) {...},
        ///     updated : function(data) {...},
        ///     completed : function(data) {...},
        /// }
        /// </remarks>
        addEventHandlers: function (raiser, handlers) {
          var specificRaiser;

          if (raiser) {
            if (raiser.href) {
              specificRaiser = raiser.href;
            } else if (raiser.rel) {
              specificRaiser = raiser.rel;
            } else {
              specificRaiser = raiser.operationId;
            }
          }

          this._handlers[specificRaiser] = handlers;
        },

        /// <summary>
        /// Removes event handlers.
        /// </summary>
        /// <param name="raiser">The raiser of the event to be removed along with handlers.</param>
        /// <remarks>
        /// If a raiser for the event is not found, a console message will indicate as such.
        /// </remarks>
        removeEventHandlers: function (raiser) {
          if (this._handlers[raiser]) {
            delete this._handlers[raiser];
          } else {
            window.console.log("Event handler not found, unable to remove: " + raiser);
          }
        },

        /// <summary>
        /// Updates the local this.options object with new values.
        /// </summary>
        /// <param name="value">Object to update local this.options with.</param>
        /// <remarks>
        /// value comes in the form of:
        /// {
        ///     low - number in seconds (5 - 1800)
        ///     medium - number in seconds (5 - 1800)
        ///     priority - number indicating event priority
        ///     timeout - number in seconds (180 - 1800)
        /// }
        /// </remarks>
        updateEventOptions: function (value) {
          if (!this.options) {
            this.options = {};
          }

          if (value) {
            if (value.low) {
              this.options.low = value.low;
            }

            if (value.medium) {
              this.options.medium = value.medium;
            }

            if (value.priority) {
              this.options.priority = value.priority;
            }

            if (value.timeout) {
              this.options.timeout = value.timeout;
            }
          }
        }

      });
      return Events;
    });