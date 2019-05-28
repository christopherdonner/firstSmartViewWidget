/* Copyright (C) Microsoft 2014. All rights reserved. */
csui.define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper',
      'esoc/widgets/userwidget/chat/skype/lib/Mime'],
    function (module, _require, $, _, Backbone, GeneralHelper, Mime) {

      var _generalHelper = GeneralHelper.attributes,
          mime           = Mime.attributes;

      /// <summary>
      /// Batch is responsible for packaging multiple HTTP requests into a single
      /// request that is sent with a this.transport object.
      /// </summary>
      /// <param name="this.cache">this.cache object used during batching.</param>
      /// <param name="this.transport">this.transport object used during batching.</param>
      /// <param name="timerLimit">Timer limit in milliseconds (ms) until outstanding requests are sent.</param>
      /// <remarks>
      /// For more information about multipart, see the RFC:
      ///     https://www.ietf.org/rfc/rfc2046
      /// It has a queuing mechanism that stores up to 20 requests before sending.
      /// The queue can also be sent as a result of a timer elapsing (defaults to three seconds)
      /// or explicitly with a call.
      /// </remarks>
      var Batch = Backbone.Model.extend({

        // The default content type for each batch part
        _defaultType: "application/json",
        // The current queue of requests to be sent as a batch
        _batchQueue: [],
        // The size of the batch queue
        _batchSize: 20,
        // The ID of the timer object created by setTimeout()
        _timerId: null,
        // The default amount of the time, in ms, before a batch is sent (three seconds)
        _defaultTimerLimit: 3000,

        /// <summary>
        /// Builds an HTTP request based on supplied content.
        /// </summary>
        /// <param name="content">Object containing HTTP request data.</param>
        /// <remarks>
        /// content should be an object in the form of:
        /// {
        ///     url: "myLink" (HTTP request URL),
        ///     type: "get" (get, post, put, delete),
        ///     acceptType: "application/json" (default, can be omitted),
        ///     data: "hello world" (any kind of JSON data),
        /// }
        /// </remarks>
        /// <returns>
        /// Message object based on supplied content in the form of:
        /// {
        ///     request: "GET https://www.example.com HTTP/1.1",
        ///     Host: "https://www.example.com",
        ///     Accept: "application/json",
        ///     data: "hello world" (any kind of JSON data)
        /// }
        ///</returns>
        constructor: function Batch(cache, transport, timerLimit) {
          this.cache = cache;
          this.transport = transport;
          this.timerLimit = timerLimit;
          Backbone.Model.prototype.constructor.apply(this, arguments);
        },
        buildMessage: function (content) {
          var host           = null,
              request        = null,

              // Determine if the URL is absolute or relative
              index          = content.url.indexOf("://"),
              isAbsolutePath = index !== -1;

          if (isAbsolutePath) {
            index += 3;

            // Grab the host portion of the URL - [char 0 to the third slash]
            // [https://example.com/]path/to/file.html
            host = content.url.slice(index).split("/", 1)[0];
            request = content.type.toUpperCase() + " " + content.url.slice(index + host.length) +
                      " " + "HTTP/1.1";
          } else {
            index = this.transport.getDomain().indexOf("://");

            if (index !== -1) {
              host = this.transport.getDomain().slice(index + 3);
            } else {
              host = this.transport.getDomain();
            }

            request = content.type.toUpperCase() + " " + content.url + " " + "HTTP/1.1";
          }

          var message = {
            Request: request,
            Host: host,
            Accept: content.acceptType,
            Data: content.data
          };

          return message;
        },

        /// <summary>
        /// Sends a batch request using the previously supplied this.transport object.
        /// </summary>
        /// <remarks>
        /// Builds up a multipart/batching message to be sent as an HTTP request
        /// using the this.transport library. It creates a listing of callbacks
        /// to be executed when the response is returned from the request by using
        /// Mime.js to parse the response and then passing the specific result to
        /// the correct caller.
        /// </remarks>
        sendBatch: function (url) {
          var boundary    = _generalHelper.generateUUID(),
              contentType = "multipart/batching;boundary=" + boundary,
              parts       = [],
              callbacks   = [];

          for (var item in this._batchQueue) {
            parts.push(this.createDataPart(this._batchQueue[item].message, boundary));
            callbacks.push(this._batchQueue[item].callback);
          }

          var method = function (data) {
            var results = mime.processMessage(data);

            for (var i = 0; i < results.length; i++) {
              _generalHelper.safeCallbackExec({
                callback: callbacks[i],
                params: [
                  results[i]
                ],
                error: "Encountered error executing batch callback"
              });
            }
          }

          var data = parts.join("\r\n"),
              that = this;
          data += "\r\n\r\n--" + boundary + "--\r\n";

          this.cache.read({
            id: "main"
          }).done(function (cacheData) {
            that.transport.clientRequest({
              url: url,
              type: "post",
              data: data,
              acceptType: "multipart/batching",
              contentType: contentType,
              callback: method
            });
          });
        },

        /// <summary>
        /// Creates a multipart message object based on the supplied data
        /// and boundary.
        /// </summary>
        /// <param name="part">Message object containing data.</param>
        /// <param name="boundary">Boundary that separates messages.</param>
        /// <remarks>
        /// Builds a message with the correct line endings so it can be
        /// interpreted correctly as a multipart message.
        /// </remarks>
        /// <returns>String representing the Message object.</returns>
        createDataPart: function (part, boundary) {
          var dataPart = "\r\n--" + boundary;
          dataPart += "\r\nContent-Type: application/http; msgtype=request\r\n";
          dataPart += "\r\n" + part.Request;
          dataPart += "\r\n" + "Host: " + part.Host;
          dataPart += "\r\n" + "Accept: " + part.Accept;

          if (part.Data) {
            dataPart += "\r\n" + "Data: " + JSON.stringify(part.Data);
          }

          dataPart += "\r\n";

          return dataPart;
        },

        /// <summary>
        /// Queues an HTTP request to be sent at a later time.
        /// </summary>
        /// <param name="request">HTTP request object (like that from the this.transport library).</param>
        /// <remarks>
        /// The request parameter should an object in the form of:
        /// {
        ///     url: "myLink" (HTTP request URL),
        ///     type: "get" (get, post, put, delete),
        ///     acceptType: "application/json" (default, can be omitted),
        ///     data: "hello world" (any kind of JSON data),
        ///     callback: function(data) {...} (a callback function)
        /// }
        /// Not all parameters are shown. See Tranport's clientRequest for the
        /// full set of parameters. The request object will be changed into a
        /// Message object and put on the batch queue. If the queue grows past
        /// its limit, it will trigger the immediate processing of the
        /// outstanding requests. If not, a timer will start, helping to facilitate
        /// batch processing.
        /// </remarks>
        queueRequest: function (request) {
          var message = this.buildMessage({
            url: request.url,
            type: request.type,
            acceptType: _generalHelper.getValue(this._defaultType, request.acceptType),
            data: request.data
          });

          if (message) {
            this._batchQueue.push({
              message: message,
              callback: request.callback
            });

            if (this._batchQueue.length >= this._batchSize) {
              this.processBatch();
            } else if (!this._timerId) {
              var scope = this;

              this._timerId = window.setTimeout(function () {
                scope.processBatch();
              }, _generalHelper.getValue(this._defaultTimerLimit, this.timerLimit));
            }
          }
        },

        /// <summary>
        /// Begins immediate processing of the batch queue, regardless of timer or queue size.
        /// </summary>
        /// <remarks>
        /// Checks to see if the batch queue has any outstanding requests.
        /// If so, it begins immediate processing. If a timer was active,
        /// it will be cleared. After the batch request is sent, the queue
        /// is cleared.
        /// </remarks>
        processBatch: function (url) {
          if (this._batchQueue.length !== 0) {
            if (this._timerId) {
              window.clearTimeout(this._timerId);
              this._timerId = null;
            }

            this.sendBatch(url);
            this._batchQueue.length = 0;
          }
        }

      });
      return Batch;

    });