/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
      'require',
      'csui/lib/jquery',
      'csui/lib/underscore',
      'esoc/widgets/common/util',
      'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/Cache',
      'esoc/widgets/userwidget/chat/skype/lib/Transport',
      'esoc/widgets/userwidget/chat/skype/lib/Batch',
      'esoc/widgets/userwidget/chat/skype/skypeucwa.attribute.model',
      'esoc/widgets/userwidget/chat/chatutil',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper'
    ],
    function (module, _require, $, _, CommonUtil, Backbone, Cache, Transport,
        Batch, skypeAttributeModel, ChatUtil, GeneralHelper) {
      var xFrame  = null,
          xFrameUrl,
          count   = 0,
          batchid = 0,
          _generalHelper = GeneralHelper.attributes,
          targetOrigin = skypeAttributeModel.getAutoDiscoverURL();
      var SkypeUCWAApplication = {
        getXframe: function (xFrameEle, xFrameUrl) {
          xFrameEle.html("");
          var xFrame = $("<iframe></iframe>").attr("src", xFrameUrl).attr("id", "xFrame");
          xFrameEle.html(xFrame);
          $('body').append(xFrameEle);
        },
        getRESTServiceURL: function (options) {
          var messageId = ChatUtil.getMessageId(),
              xFrameVal = document.getElementById("xFrame"),
              that      = this;
          that.handleRESTServiceURL(options);
          that.sendRequest(messageId, xFrameVal, skypeAttributeModel.internalServerURL);
        },
        handleRESTServiceURL: function (options) {
          var that = this,
              iframeURL;
          var handleRESTMethod = function (data) {
            if (skypeAttributeModel.getAutoDiscoverURL() === null) {
              var responseData;
              try {
                responseData = JSON.parse(data.data);
              } catch (e) {}
              if (!!responseData) {
                if (responseData.status !== 200 && !!options.deferredObj) {
                  options.deferredObj.resolve();
                } else {
                  try {
                    iframeURL = JSON.parse(responseData.responseText)._links.xframe.href;
                  } catch (e) {}
                  skypeAttributeModel.setIFrameURL(iframeURL);
                  that.getXframe($(".esoc-user-chat-xFrame"), iframeURL);
                  var autoDiscoveryURL = iframeURL.split("/Autodiscover")[0];
                  that.authenticate(autoDiscoveryURL, options);
                  skypeAttributeModel.setAutoDiscoverURL(autoDiscoveryURL);
                }
              }
            }
            ChatUtil.removeHandler(handleRESTMethod);
          }
          ChatUtil.addHandler(handleRESTMethod);
          var method = function () {
            window.clearTimeout(loadId);
            if (iframeURL === undefined && skypeAttributeModel.externalServerURL.length > 0) {
              var externalServerUrl = skypeAttributeModel.externalServerURL;
              that.getXframe($(".esoc-user-chat-xFrame"), externalServerUrl + "/xframe");
              var messageId = ChatUtil.getMessageId(),
                  xFrameVal = document.getElementById("xFrame");
              that.handleExternalRESTServiceURL(options);
              that.sendRequest(messageId, xFrameVal, externalServerUrl);
            }
          }
          var loadId = window.setTimeout(method, 5000);
        },
        handleExternalRESTServiceURL: function (options) {
          var that = this,
              iframeURL;
          var handleExternalRESTMethod = function (data) {
            if (skypeAttributeModel.getAutoDiscoverURL() === null) {
              var responseData;
              try {
                responseData = JSON.parse(data.data);
              } catch (e) {}
              if (!!responseData) {
                if (responseData.status !== 200 && !!options.deferredObj) {
                  options.deferredObj.resolve();
                } else {
                  try {
                    iframeURL = JSON.parse(responseData.responseText)._links.xframe.href;
                  } catch (e) {}
                  skypeAttributeModel.setIFrameURL(iframeURL);
                  that.getXframe($(".esoc-user-chat-xFrame"), iframeURL);
                  var autoDiscoveryURL = iframeURL.split("Autodiscover")[0];
                  that.authenticate(autoDiscoveryURL, options);
                  skypeAttributeModel.setAutoDiscoverURL(autoDiscoveryURL);
                }
              }
            }
            ChatUtil.removeHandler(handleExternalRESTMethod);
          }
          ChatUtil.addHandler(handleExternalRESTMethod);
        },
        authenticate: function (autoDisoverURL, options) {
          var that = this;
          if (!!options && options.appNotFound) {
            skypeAttributeModel.eventHandling = false;
            that.sendAuthRequest(autoDisoverURL, options);
          }
          else {
            $('iframe').load(function () {
              that.sendAuthRequest(autoDisoverURL, options);
            });
          }
        },
        handleAuthenticationCallback: function (options) {

          var that = this;
          var method = function (data) {
            var result = JSON.parse(data.data);
            var access_token = null;
            if (result.status !== 200 && !!options.deferredObj) {
              options.deferredObj.resolve();
            }
            else {
              if (!!JSON.parse(result.responseText).access_token) {
                access_token = JSON.parse(result.responseText).access_token;
                skypeAttributeModel.setAccessToken(access_token);
                that.createApplication(skypeAttributeModel.getAutoDiscoverURL(), access_token,
                    options);
              }

              ChatUtil.removeHandler(method);
            }
          };
          ChatUtil.addHandler(method);

        },

        createApplication: function (autoDisoverURL, access_token, options) {
          this.handleCreateApplicationCallback(options);
          if (!!access_token) {
            var messageId       = ChatUtil.getMessageId(),
                applicationArgs = {
                  type: 'post',
                  data: "{\r\n  \"userAgent\":\"esocial1\",\r\n  \"endpointId\":\"" + messageId +
                        "\",\r\n  \"culture\":\"en-US\"\r\n}\r\n",
                  contentType: "application/json",
                  url: autoDisoverURL + "/ucwa/oauth/v1/applications",
                  headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + access_token
                  }
                };
            document.getElementById("xFrame").contentWindow.postMessage(
                JSON.stringify(applicationArgs), _generalHelper.getValue("*", targetOrigin));
          }
        },

        handleCreateApplicationCallback: function (options) {

          var that = this;
          var method = function (data) {

            var result       = JSON.parse(data.data),
                responseData = JSON.parse(result.responseText),
                applicationsURL,
                batchURL,
                eventURL,
                presenceSubscriptionURL;
            if (result.status !== 201 && !!options.deferredObj) {
              options.deferredObj.resolve();
            } else {
              if (!!responseData._links) {
                applicationsURL = responseData._links.self.href;
                batchURL = responseData._links.batch.href;
                eventURL = responseData._links.events.href;

              }
              if (!!responseData._embedded) {
                presenceSubscriptionURL = responseData._embedded.people._links.presenceSubscriptions.href;
              }
              skypeAttributeModel.setApplicationsURL(applicationsURL);
              skypeAttributeModel.setBatchURL(batchURL);
              skypeAttributeModel.setEventURL(eventURL);
              skypeAttributeModel.setpresenceSubscriptionURL(presenceSubscriptionURL);
              if (!!options.deferredObj) {
                options.deferredObj.resolve();
              }

              ChatUtil.removeHandler(method);

            }
          };

          ChatUtil.addHandler(method);

        },
        sendRequest: function (messageId, xFrameVal, url) {
          $('iframe').load(function () {
            if (!!xFrameVal) {
              var request = {
                type: 'get',
                url: url,
                contentType: "application/x-www-form-urlencoded;charset='utf-8'",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/x-www-form-urlencoded;charset='utf-8'"
                },
                messageId: messageId
              };
              xFrameVal.contentWindow.postMessage(JSON.stringify(request),
                  _generalHelper.getValue("*", targetOrigin));
            }
          });
        },
        sendAuthRequest: function (autoDisoverURL, options) {
          var messageId = ChatUtil.getMessageId(),
              xFrameVal = document.getElementById("xFrame"),
              that      = this;
          if (xFrameVal !== null) {
            that.handleAuthenticationCallback(options);
            var request = {
              type: 'post',
              url: autoDisoverURL + '/WebTicket/oauthtoken',
              contentType: "application/x-www-form-urlencoded;charset='utf-8'",
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded;charset='utf-8'"
              },
              data: {
                "grant_type": "urn:microsoft.rtc:windows"
              },
              messageId: messageId
            };
            xFrameVal.contentWindow.postMessage(JSON.stringify(request),
                _generalHelper.getValue("*", targetOrigin));
          }
        }
      }
      return SkypeUCWAApplication;
    });
