/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper',
      'esoc/widgets/userwidget/chat/skype/lib/Mime'],
    function (module, _require, $, _, Backbone, GeneralHelper, Mime) {

      var _generalHelper = GeneralHelper.attributes,
          mime           = Mime.attributes;
      var Batch = Backbone.Model.extend({
        _defaultType: "application/json",
        _batchQueue: [],
        _batchSize: 20,
        _timerId: null,
        _defaultTimerLimit: 3000,
        constructor: function Batch(cache, transport, timerLimit) {
          this.cache = cache;
          this.transport = transport;
          this.timerLimit = timerLimit;
          Backbone.Model.prototype.constructor.apply(this, arguments);
        },
        buildMessage: function (content) {
          var host           = null,
              request        = null,
              index          = content.url.indexOf("://"),
              isAbsolutePath = index !== -1;

          if (isAbsolutePath) {
            index += 3;
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