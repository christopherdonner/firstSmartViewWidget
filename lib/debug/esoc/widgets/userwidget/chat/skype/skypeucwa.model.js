csui.define([
  'require',
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/utils/base",
  'esoc/widgets/userwidget/chat/chatutil',
  'esoc/widgets/userwidget/chat/skype/lib/Cache',
  'esoc/widgets/userwidget/chat/skype/lib/Transport',
  'esoc/widgets/userwidget/chat/skype/lib/Batch',
  'esoc/widgets/userwidget/chat/skype/lib/Events',
  'esoc/widgets/userwidget/chat/skype/skype.model',
  'esoc/widgets/userwidget/chat/skype/skypeucwa.application',
  'esoc/widgets/userwidget/chat/skype/skypeucwa.attribute.model',
  'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper'
], function (_require, $, Backbone, Base, ChatUtil, Cache, Transport, Batch, Events, SkypeModel,
    skypeUCWAApplication,
    skypeAttributeModel, GeneralHelper) {
  var _generalHelper = GeneralHelper.attributes;
  var SkypeUCWAModel = SkypeModel.extend({
    constructor: function SkypeUCWAModel(options) {
      $("body").append("<span style=\"display:none\" class=\"esoc-user-chat-xFrame\"></span>");
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    initialize: function () {
    },
    initializeApplication: function (options) {
      if (skypeAttributeModel.internalServerURL.length > 0) {
        skypeUCWAApplication.getXframe($(".esoc-user-chat-xFrame"),
            skypeAttributeModel.internalServerURL + "/xframe");
        skypeUCWAApplication.getRESTServiceURL(options);
      }
    },
    showUserPresence: function (options) {
      //For batch request, list of email ids are passed as array
      //For user email address is passed, otherwise "me" is set in the request
      options.autoDiscoverURL = skypeAttributeModel.getAutoDiscoverURL();
      if (options.email instanceof Array) {
        var domain       = skypeAttributeModel.getServerURL(),
            targetOrigin = skypeAttributeModel.getAutoDiscoverURL(),
            timerLimit   = 4000,
            xFrameEle    = document.getElementById("xFrame"),
            cache        = Cache.attributes,
            transport    = new Transport(targetOrigin),
            batch        = new Batch(cache, transport, timerLimit),
            id           = 0,
            element;

        cache.create({
          id: "main",
          data: {}
        });

        if (!!xFrameEle) {
          element = xFrameEle.contentWindow;
          transport.setElement(element, domain);
        }

        transport.setAuthorization(skypeAttributeModel.getAccessToken(), "Bearer");

        if (!!options.email && options.email.length > 0) {
          for (id = 0; id < options.email.length; id++) {
            batch.queueRequest({
              url: skypeAttributeModel.getAutoDiscoverURL() +
                   options.email[id],
              type: "get",
              callback: function (data) {
                var code = JSON.parse(data.responseText).subcode;
                if (data.status === 401) {
                  var appNotFoundOptions = {
                    appNotFound: true
                  };
                  skypeUCWAApplication.authenticate(options.autoDiscoverURL, appNotFoundOptions);
                } else {
                  var selfUrl = JSON.parse(data.responseText)._links.self.href;
                  if (options.models) {
                    for (var i = 0; i < options.models.length; i++) {
                      if (selfUrl.indexOf(options.models[i].get("screen_name").toLowerCase()) >
                          0) {
                        var presence = {status: JSON.parse(data.responseText).availability};
                        //Commenting lastActive time calculations as the timestamp from the server is coming wrong
                        /*var lastActive = JSON.parse(data.responseText).lastActive;
                        if (lastActive) {
                          lastActive = Base.formatFriendlyDateTimeNow(lastActive);
                          presence.lastActive = lastActive;
                        }*/
                        presence.activity = JSON.parse(data.responseText).activity;
                        if (options.models) {
                          options.models[i].trigger("presence:update", presence);
                        }
                      }
                    }
                  }
                }
              }
            });
          }
        }
        batch.processBatch(targetOrigin + skypeAttributeModel.getBatchURL());
      } else {
        var url       = skypeAttributeModel.getAutoDiscoverURL() +
                        skypeAttributeModel.getApplicationsURL(),
            xFrameVal = document.getElementById("xFrame");
        url = url + "/people/" + options.email + "/presence";

        this.handlePresenceCallback(options);

        if (!!xFrameVal) {
          var presenceArgs = {
            type: 'get',
            messageId: this.messageId,
            url: url,
            headers: {
              "Accept": "application/json",
              "Authorization": "Bearer " + skypeAttributeModel.getAccessToken()
            }
          };
          document.getElementById("xFrame").contentWindow.postMessage(
              JSON.stringify(presenceArgs), _generalHelper.getValue("*", targetOrigin));
        }
      }
    },
    handlePresenceCallback: function (options) {
      var method = function (data) {
        var result;
        try {
          result = JSON.parse(data.data);
        } catch (e) {}
        if (!!result.responseText) {
          var code;
          try {
            code = JSON.parse(result.responseText).subcode;
          } catch (e) {}
          if ((result.status === 404 && code === "ApplicationNotFound") ||
              (result.status === 401)) {
            var appNotFoundOptions = {
              appNotFound: true
            };
            skypeUCWAApplication.authenticate(options.autoDiscoverURL, appNotFoundOptions);
          } else {
            var availability;
            try {
              availability = JSON.parse(result.responseText).availability;
            } catch (e) {}
            var chatOptions = {};
            //Commenting lastActive time calculations as the timestamp from the server is coming wrong
            /*var lastActive = JSON.parse(result.responseText).lastActive;
            if (lastActive) {
              lastActive = Base.formatFriendlyDateTimeNow(lastActive);
              chatOptions.lastActive = lastActive;
            }*/
            chatOptions.status = availability;
            try {
              chatOptions.activity = JSON.parse(result.responseText).activity;
            } catch (e) {}
            ChatUtil.updatePresenceModel(options, chatOptions);

            ChatUtil.removeHandler(method);
          }

        }
      };
      ChatUtil.addHandler(method);

    },
    updateEventPresence: function (options) {
      var domain                 = skypeAttributeModel.getServerURL(),
          targetOrigin           = skypeAttributeModel.getAutoDiscoverURL(),
          xFrameEle              = document.getElementById("xFrame"),
          currentSubscriptionUrl = skypeAttributeModel.getCurrentSubscriptionURL(),
          cache                  = Cache.attributes,
          transport              = new Transport(targetOrigin),
          events                 = new Events(cache, transport),
          SkypeUCWAModel         = !!SkypeUCWAModel ? SkypeUCWAModel :
                                   _require("esoc/widgets/userwidget/chat/skype/skypeucwa.model"),
          element;

      if (!!currentSubscriptionUrl) {
        this.deleteSubscription(currentSubscriptionUrl, options);
      }

      else {
        this.sendSubscription(options);
      }
      cache.create({
        id: "main",
        data: {}
      });
      if (!!xFrameEle) {
        element = xFrameEle.contentWindow;
        transport.setElement(element, domain);
      }

      transport.setAuthorization(skypeAttributeModel.getAccessToken(), "Bearer");

      events.addEventHandlers({
            rel: "contactPresence"
          },
          {
            updated: function (data) {
              if (options.email instanceof Array) {
                var eventOptions = {
                  email: data,
                  models: options.models
                };
                SkypeUCWAModel.showUserPresence(eventOptions);
              } else {
                SkypeUCWAModel.showUserPresence(options);
              }
            }
          });
    },
    sendAckRequest: function () {
      var targetOrigin = skypeAttributeModel.getAutoDiscoverURL(),
          eventURL     = targetOrigin + skypeAttributeModel.getEventURL(),
          xFrameEle    = document.getElementById("xFrame"),
          messageId    = ChatUtil.getMessageId();
      if (xFrameEle !== null && !skypeAttributeModel.eventHandling) {
        skypeAttributeModel.eventHandling = true;
        this.handleEventCallback();
        var request = {
          type: 'get',
          url: eventURL,
          contentType: "application/x-www-form-urlencoded;charset='utf-8'",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset='utf-8'",
            "Authorization": "Bearer " + skypeAttributeModel.getAccessToken()
          },
          messageId: messageId
        };
        xFrameEle.contentWindow.postMessage(JSON.stringify(request),
            _generalHelper.getValue("*", targetOrigin));
      }
    },
    handleEventCallback: function () {
      var targetOrigin = skypeAttributeModel.getAutoDiscoverURL(),
          responseData,
          that         = this;
      var eventMethod = function (data) {
        var result = JSON.parse(data.data);
        if (!!result.responseText) {
          responseData = JSON.parse(result.responseText);
          if (responseData.status === 401 || responseData.subcode === "ApplicationNotFound") {
            var appNotFoundOptions = {
              appNotFound: true
            };
            skypeUCWAApplication.authenticate(targetOrigin, appNotFoundOptions);
          } else {
            if (!!responseData.sender) {
              that.processEvents(result);
            }
            ChatUtil.removeHandler(eventMethod);
          }

        }
      };
      ChatUtil.addHandler(eventMethod);
    },
    processEvents: function (result) {
      var domain         = skypeAttributeModel.getServerURL(),
          targetOrigin   = skypeAttributeModel.getAutoDiscoverURL(),
          xFrameEle      = document.getElementById("xFrame"),
          cache          = Cache.attributes,
          transport      = new Transport(targetOrigin),
          events         = new Events(cache, transport),
          SkypeUCWAModel = !!SkypeUCWAModel ? SkypeUCWAModel :
                           _require("esoc/widgets/userwidget/chat/skype/skypeucwa.model"),
          data           = JSON.parse(result.responseText),
          element;
      if (skypeAttributeModel.eventHandling) {
        if (!!xFrameEle) {
          element = xFrameEle.contentWindow;
          transport.setElement(element, domain);
        }

        transport.setAuthorization(skypeAttributeModel.getAccessToken(), "Bearer");

        if (data && data._links) {
          if (data._links.resync) {
            transport.clientRequest({
              url: targetOrigin + data._links.resync.href,
              type: "get",
              acceptType: 'application/json',
              callback: SkypeUCWAModel.processEvents,
              notifyAction: false
            });
          } else if (data._links.next) {
            transport.clientRequest({
              url: targetOrigin + data._links.next.href,
              type: "get",
              acceptType: 'application/json',
              callback: SkypeUCWAModel.processEvents,
              notifyAction: false
            });
          }
        }
        events.processEvents(data);
      }
    },
    sendSubscription: function (options) {
      var domain          = skypeAttributeModel.getServerURL(),
          targetOrigin    = skypeAttributeModel.getAutoDiscoverURL(),
          subscriptionURL = targetOrigin + skypeAttributeModel.getpresenceSubscriptionURL(),
          xFrameEle       = document.getElementById("xFrame"),
          transport       = new Transport(targetOrigin),
          element;
      if (!!xFrameEle) {
        element = xFrameEle.contentWindow;
        transport.setElement(element, domain);
      }

      transport.setAuthorization(skypeAttributeModel.getAccessToken(), "Bearer");
      var sips = [];
      if (options.email instanceof Array) {

        for (var id = 0; id < options.email.length; id++) {
          sips[id] = "sip:" + options.email[id];
        }
      } else {
        sips[0] = "sip:" + options.email;
      }

      var data = {
        "duration": 30,
        "uris": sips
      };
      if (sips.length > 0) {
        var that = this;
        transport.clientRequest({
          url: subscriptionURL,
          type: "post",
          contentType: "application/json",
          data: data,
          callback: function (data) {
            var responseData = JSON.parse(data.responseText);
            if (responseData.status === 401 || responseData.subcode === "ApplicationNotFound") {
              var appNotFoundOptions = {
                appNotFound: true
              };
              skypeUCWAApplication.authenticate(targetOrigin, appNotFoundOptions);
            } else {
              skypeAttributeModel.setCurrentSubscriptionURL(
                  JSON.parse(data.responseText)._links.self.href);
              that.processEvents(data);
              if (options.subscribeEvent) {
                that.sendAckRequest();
              }
            }
          }
        });
      }
    },
    deleteSubscription: function (url, options) {
      var domain       = skypeAttributeModel.getServerURL(),
          targetOrigin = skypeAttributeModel.getAutoDiscoverURL(),
          xFrameEle    = document.getElementById("xFrame"),
          cache        = Cache.attributes,
          transport    = new Transport(targetOrigin),
          events       = new Events(cache, transport),
          element;
      if (!!xFrameEle) {
        element = xFrameEle.contentWindow;
        transport.setElement(element, domain);
      }
      transport.setAuthorization(skypeAttributeModel.getAccessToken(), "Bearer");
      var that = this;
      transport.clientRequest({
        url: targetOrigin + url,
        type: "delete",
        callback: function (data) {
          skypeAttributeModel.setCurrentSubscriptionURL(null);
          if (!!data.responseText) {
            var responseData = JSON.parse(data.responseText);
            if (responseData.status === 401 || responseData.subcode === "ApplicationNotFound") {
              var dfd = $.Deferred();
              var appNotFoundOptions = {
                appNotFound: true,
                deferredObj: dfd
              };
              skypeUCWAApplication.authenticate(targetOrigin, appNotFoundOptions);
              dfd.promise().done(function () {
                if (!!options) {
                  that.sendSubscription(options);
                } else {
                  events.removeEventHandlers("contactPresence");
                  skypeAttributeModel.eventHandling = false;
                }
              });
            }
          } else {
            if (!!options) {
              that.sendSubscription(options);
            } else {
              events.removeEventHandlers("contactPresence");
              skypeAttributeModel.eventHandling = false;
            }
          }
        }
      });
    }
  });

  return new SkypeUCWAModel;
});