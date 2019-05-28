/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper'],
    function (module, _require, $, _, Backbone, GeneralHelper) {

      var _generalHelper = GeneralHelper.attributes;
      var Transport = Backbone.Model.extend({
        _domain: null,
        _xframe: null,
        _defaultType: "application/json",
        _container: null,
        _element: null,
        _accessToken: null,
        _tokenType: null,
        _requestStart: null,
        _requestStop: null,
        _requestCounter: 0,
        _methods: [],
        _failedAllowedList: false,
        _scope: this,

        constructor: function Transport(targetOrigin) {
          this.targetOrigin = targetOrigin;
          Backbone.Model.prototype.constructor.apply(this, arguments);
        },
        createClientTransportData: function (request) {
          var accessToken = request.accessToken || this._accessToken,
              result      = {
                type: request.type,
                url: request.url,
                headers: {
                  Accept: request.acceptType,
                  Authorization: this._tokenType + " " + accessToken
                }
              };

          if (request.messageId) {
            result.messageId = request.messageId;
          }

          if (!accessToken) {
            delete result.headers.Authorization;
          }

          switch (request.type) {
          case "get":
            break;
          case "post":
          case "put":
            if (request.data && request.data.etag) {
              result.headers["If-Match"] = '"' + request.data.etag + '"';
            }

            if (request.data) {
              if (request.contentType.indexOf("json") !== -1) {
                request.data = JSON.stringify(request.data);
              }

              result.headers["Content-Type"] = request.contentType;
            } else {
              request.data = "";
              result.headers["Content-Type"] = "";
            }

            result.data = request.data;
            break;
          case "delete":
            result.headers = {
              Authorization: this._tokenType + " " + accessToken
            };
            break;
          }

          return JSON.stringify(result);
        },
        handleUrl: function (url) {
          var targetUrl,
              index          = url ? url.indexOf("://") : "",
              isAbsolutePath = index !== -1;

          if (isAbsolutePath) {
            targetUrl = url;
          } else {
            if (url) {
              targetUrl = this._domain + url;
            } else {
              targetUrl = this._domain;
            }
          }

          return targetUrl;
        },
        findReasonString: function (headerString) {
          var obj = _generalHelper.parseHeaders(headerString);

          for (var item in obj["X-Ms-diagnostics"]) {
            return obj["X-Ms-diagnostics"][item].reason;
          }

          return null;
        },
        handleAllowedList: function (result) {
          if (result.status === 403 && !this._failedAllowedList) {
            var reasonString = this.findReasonString(result.headers);

            if (reasonString !== null) {
              window.console.log(reasonString);
              console.log(reasonString);
              this._failedAllowedList = true;
            }
          }
        },
        handleCallback: function (callback, messageId, requestUrl) {
          var that = this;
          var method = function (data) {
            var result = JSON.parse(data.data);
            that.handleAllowedList(result);
            if (result.messageId === messageId) {
              if (that._requestStop) {
                that._requestCounter--;

                if (that._requestCounter <= 0) {
                  that._requestStop();
                }
              }

              try {
                var headers = _generalHelper.parseHeaders(result.headers);

                if (headers["Content-Type"] && headers["Content-Type"].length &&
                    headers["Content-Type"].indexOf(this._defaultType) !== -1) {
                  try {
                    result.results = JSON.parse(result.responseText);

                    var changed = that.testForDomainChanges(result.results, function () {
                      _generalHelper.safeCallbackExec({
                        callback: callback,
                        params: [
                          result
                        ],
                        error: "Encountered error executing transport callback"
                      });

                      that.removeHandler(method);
                    });

                    if (changed) {
                      return;
                    }
                  } catch (e) {
                    window.console.error("Encountered error parsing response: " + e.message);
                  }
                }
              } catch (e) {
                window.console.error("Encountered error handling response: " + e.message);
              }

              _generalHelper.safeCallbackExec({
                callback: callback,
                params: [
                  result
                ],
                error: "Encountered error executing transport callback"
              });

              that.removeHandler(method);
            }
          }

          that.addHandler(method);

          return method;
        },
        addHandler: function (method) {
          if (window.attachEvent) {
            window.attachEvent("onmessage", method)
          } else {
            window.addEventListener("message", method);
          }

          this._methods.push(method);
        },
        removeHandler: function (method) {
          if (window.detachEvent) {
            window.detachEvent("onmessage", method);
          } else {
            window.removeEventListener("message", method);
          }

          var index = this._methods.indexOf(method);

          if (index !== -1) {
            this._methods.splice(index, 1);
          }
        },
        testForDomainChanges: function (request, callback) {
          if (request._links && request._links.xframe) {
            if (this._xframe !== request._links.xframe.href) {
              this._xframe = request._links.xframe.href;
              this._scope.injectFrame(this._xframe, this._container, callback);

              return true;
            }
          }

          return false;
        },
        getDomain: function () {
          return this._domain;
        },
        setElement: function (element, xframe) {
          if (element) {
            this._element = element;
            this._domain = _generalHelper.extractOriginFromAbsoluteUrl(xframe);
          }
        },
        setAuthorization: function (accessToken, tokenType) {
          this._accessToken = accessToken;
          this._tokenType = tokenType;
        },
        getAuthorization: function () {
          return {
            accessToken: this._accessToken,
            tokenType: this._tokenType
          };
        },
        setRequestCallbacks: function (callbacks) {
          if (callbacks) {
            if (callbacks.start) {
              this._requestStart = callbacks.start;
            }

            if (callbacks.stop) {
              this._requestStop = callbacks.stop;
            }
          }
        },
        clientRequest: function (request) {
          if (this._element && this._domain) {
            var messageId = _generalHelper.generateUUID(),
                handler   = this.handleCallback(request.callback, messageId, request.url);

            if (this._requestStart && request.notifyAction !== false) {
              this._requestStart();
              this._requestCounter++;
            }

            try {
              this._element.postMessage(this.createClientTransportData({
                url: this.handleUrl(request.url),
                type: request.type.toLocaleLowerCase(),
                data: request.data,
                acceptType: _generalHelper.getValue(this._defaultType, request.acceptType),
                contentType: _generalHelper.getValue(this._defaultType, request.contentType),
                messageId: messageId,
                accessToken: request.accessToken
              }), _generalHelper.getValue("*", this.targetOrigin));
            } catch (e) {
              window.console.log("Encountered error with clientRequest: " + e.message);

              var response = {
                messageId: messageId,
                headers: "",
                status: 400
              };

              handler({
                data: JSON.stringify(response)
              });
            }
          }
        },
        injectFrame: function (xframe, container, callback) {
          this._container = container;

          var method = function () {
            window.clearTimeout(loadId);

            var id = window.setTimeout(function () {
              window.console.log("Frame location not found within timeout (10000): " + xframe);

              _generalHelper.safeCallbackExec({
                callback: callback,
                params: [
                  {
                    status: 408,
                    link: xframe
                  }
                ],
                error: "Encountered error executing frame injection callback"
              });
            }, 10000);

            this._scope.setElement(frame[0].contentWindow, xframe);
            this._scope.clientRequest({
              url: xframe,
              type: "get",
              acceptType: "text/html",
              notifyAction: false,
              callback: function (data) {
                window.clearTimeout(id);

                _generalHelper.safeCallbackExec({
                  callback: callback,
                  params: [
                    data
                  ],
                  error: "Encountered error executing frame injection callback"
                });
              }
            });
          };

          var frame  = $("<iframe></iframe>").load(method).attr("src", xframe),
              loadId = window.setTimeout(method, 10000);

          this._container.html(frame);
        },
        cleanup: function () {
          for (var i = 0; i < this._methods.length; i++) {
            this.removeHandler(this._methods[i]);
          }
        }

      });
      return Transport;

    });