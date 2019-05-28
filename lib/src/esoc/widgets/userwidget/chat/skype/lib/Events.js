/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone'],
    function (module, _require, $, _, Backbone) {
      var Events = Backbone.Model.extend({

        _handlingEvents: false,
        _handlers: {},
        constructor: function Events(cache, transport, options) {
          this.cache = cache;
          this.transport = transport;
          this.options = options;
          Backbone.Model.prototype.constructor.apply(this, arguments);
        },
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
        startEvents: function (url) {
          var that = this;
          if (!that._handlingEvents) {
            that._handlingEvents = true;
          }
          return that._handlingEvents;
        },
        stopEvents: function () {
          this._handlingEvents = false;
          this._handlers.length = 0;
        },
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
        removeEventHandlers: function (raiser) {
          if (this._handlers[raiser]) {
            delete this._handlers[raiser];
          } else {
            window.console.log("Event handler not found, unable to remove: " + raiser);
          }
        },
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