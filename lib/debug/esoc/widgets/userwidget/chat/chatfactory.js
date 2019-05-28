csui.define([
  'module',
  'require',
  "csui/lib/jquery",
  'csui/lib/underscore',
  "csui/lib/backbone",
  'esoc/widgets/userwidget/chat/skype/skypeucwa.model',
  'esoc/widgets/userwidget/chat/skype/skypeplugin.model',
  'esoc/widgets/userwidget/chat/realtime/realtime.model',
  'esoc/widgets/userwidget/chat/skype/skypeucwa.attribute.model',
  'esoc/factory/pulsesettingsfactory',
  'csui/utils/contexts/factories/user'
], function (module, require, $, _, Backbone, SkypeUCWAModel, SkypePluginModel, RealTimeModel,
    skypeAttributeModel, PulseSettingsFactory, UserModelFactory) {

  var ChatFactory = Backbone.Model.extend({
    constructor: function ChatFactory(options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    initializeApplication: function (options) {
      this.options = options;
      var that = this;
      var dfd             = $.Deferred(),
          deferredOptions = {
            deferredObj: dfd
          };
      options.context.getModel(PulseSettingsFactory,
          {attributes: {id: "chat"}, options: {chat: true}, permanent: true}).ensureFetched().done(
          function (response) {
            var chatSettings = response.results && response.results.chatSettings;
            if (chatSettings && chatSettings.chatEnabled && chatSettings.presenceEnabled) {
              skypeAttributeModel.setChatEnabled(chatSettings.chatEnabled);
              skypeAttributeModel.setPresenceEnabled(chatSettings.presenceEnabled);
              skypeAttributeModel.setChatDomain(chatSettings.chatDomain);
              skypeAttributeModel.setInternalServerURL(chatSettings.internalServerUrl);
              skypeAttributeModel.setExternalServerURL(chatSettings.externalServerUrl);
              skypeAttributeModel.setServerURL(chatSettings.chatDomain);
              if (SkypePluginModel.getNameCtrl() == null) {
                var nameCtrl = that.getNameCtrl();

                // Calling method to check GetStatus method is available or not.
                try {
                  nameCtrl.GetStatus("", "");
                } catch (exception) {
                  nameCtrl = null;
                }

                if (nameCtrl != null) {
                  skypeAttributeModel.pluginEnabled = true;
                  skypeAttributeModel.setNameCtrl(nameCtrl);
                  var user = that.options.context.getModel(UserModelFactory);
                  var userid = user.get("name") + "@" + chatSettings.chatDomain;
                  skypeAttributeModel.setLoginUserSIP(userid);

                  // Assuming user not logged in
                  if (that.isPlugInLoggedInUser() === false) {

                    skypeAttributeModel.pluginEnabled = false;
                    SkypeUCWAModel.initializeApplication(deferredOptions);
                  }
                } else {
                  skypeAttributeModel.pluginEnabled = false;
                  SkypeUCWAModel.initializeApplication(deferredOptions);
                  dfd.resolve();
                }
              } else {
                skypeAttributeModel.pluginEnabled = true;
                skypeAttributeModel.setNameCtrl(nameCtrl);
                dfd.resolve();
              }

            }
            else {
              dfd.resolve();
            }

          });
      return dfd;
    },
    isPlugInLoggedInUser: function () {

      var nameCtrl   = skypeAttributeModel.getNameCtrl(),
          userid     = skypeAttributeModel.getLoginUserSIP(),
          status     = 1,
          isLoggedIn = false,
          i          = 0;

      if (nameCtrl == null) {
        return isLoggedIn;
      }
      // work around to get the actual status.
      for (i = 0; i < 20; i++) {
        status = nameCtrl.GetStatus(userid, "test");

        if (status !== 1) {
          isLoggedIn = true;
          break;
        }
      }

      return isLoggedIn;

    },
    getProvider: function (chatType) {
      var nameCtrl = null;
      if (chatType === "realtime") {
        return RealTimeModel;
      } else {
        // Condition to check, if user logged in once again.
        if (this.isPlugInLoggedInUser() === true) {
          skypeAttributeModel.pluginEnabled = true;
        }

        if (skypeAttributeModel.pluginEnabled) {
          // Assuming user not logged in
          if (this.isPlugInLoggedInUser() === false) {

            skypeAttributeModel.pluginEnabled = false;
            SkypeUCWAModel.initializeApplication();
            return SkypeUCWAModel;
          }
          SkypePluginModel.setNameCtrl(skypeAttributeModel.getNameCtrl());
          SkypePluginModel.attachLyncPresenceChangeEvent();
          return SkypePluginModel;
        } else {
          return SkypeUCWAModel;
        }
      }
    },
    getNameCtrl: function () {
      var nameCtrl = null;
      try {
        try {
          if (this.isCompatibleMSIEVersion()) {
            nameCtrl = new window.ActiveXObject("Name.NameCtrl");
          }
        } catch (ex) {
          nameCtrl = null
        }

        if (nameCtrl == null) {
          nameCtrl = this.createNPApiOnWindowsPlugin("application/x-sharepoint-uc");
          if (nameCtrl.GetStatus === undefined) {
            nameCtrl = null
          }
        }

      } catch (ex) {
        nameCtrl = null
      }
      return nameCtrl;
    },
    isNPAPIOnWinPluginInstalled: function (a) {
      return Boolean(navigator.mimeTypes) && navigator.mimeTypes[a] &&
             navigator.mimeTypes[a].enabledPlugin;
    },
    createNPApiOnWindowsPlugin: function (b) {
      var c = null;
      try {
        c = document.getElementById(b);
        if (!Boolean(c) && this.isNPAPIOnWinPluginInstalled(b)) {
          var a = document.createElement("object");
          a.id = b;
          a.type = b;
          a.width = "0";
          a.height = "0";
          a.style.setProperty("visibility", "hidden", "");
          document.body.appendChild(a);
          c = document.getElementById(b)
        }
      } catch (d) {
        c = null
      }
      return c
    },
    isCompatibleMSIEVersion: function () {

      var ua = window.navigator.userAgent;
      var msie = ua.indexOf("MSIE ");

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { // If Internet Explorer, return version number
        return true
      } else {  // If another browser, return 0
        return false;
      }
    }

  });
  return new ChatFactory;
});
