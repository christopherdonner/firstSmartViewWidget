/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
      'require',
      'csui/lib/jquery',
      'csui/lib/underscore',
      'i18n!esoc/widgets/userwidget/nls/lang',
      'css!esoc/widgets/userwidget/chat/chat.css'
    ],
    function (module, _require, $, _, Lang) {
      var ChatUtil = {

        updatePresenceModel: function (options, presence) {
          options.model.attributes.status = "Unknown";
          var presenceOptions = this.getPresenceStatus(presence);
          options.model.attributes.status = presenceOptions.statusCode;
          options.model.attributes.tooltipText = presenceOptions.status;
          options.model.trigger("change.presencestatus");
        },
        setIconColor: function (presence, presenceEle) {
          presenceEle.removeClass("esoc-chat-presence-Away");
          presenceEle.removeClass("esoc-chat-presence-Online");
          presenceEle.removeClass("esoc-chat-presence-Busy");
          presenceEle.removeClass("esoc-chat-presence-IdleBusy");
          presenceEle.removeClass("esoc-chat-presence-Offline");
          presenceEle.removeClass("esoc-chat-presence-donotdisturb");
          presenceEle.removeClass("esoc-user-profile-default-presence");

          var presenceOptions = this.getPresenceStatus(presence);
          presenceEle.addClass(presenceOptions.statusIconClass).attr("title",
              presenceOptions.status);
        },
        getPresenceStatus: function (presence) {
          var presenceOptions = {
            status: "",
            statusIconClass: "",
            statusCode: ""
          };
          var status;
          if (_.isNumber(presence.status)) {
            status = presence.status;
          } else {
            status = !!presence.activity ? presence.activity : presence.status;
          }
          switch (status) {
          case 0 :
          case "Online":
            presenceOptions.status = Lang.presenceOnlineTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Online";
            presenceOptions.statusCode = "Online";
            break;
          case 1:
          case "Offline":
            presenceOptions.status = Lang.presenceOfflineTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Offline";
            presenceOptions.statusCode = "Offline";
            break;
          case 2:
          case "Off work":
          case "Away":
            presenceOptions.status = Lang.presenceAwayTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Away";
            presenceOptions.statusCode = "Away";
            break;
          case 3:
          case "Busy":
            presenceOptions.status = Lang.presenceBusyTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Busy";
            presenceOptions.statusCode = "Busy";
            break;
          case 4:
          case "BeRightBack":
            presenceOptions.status = Lang.presenceBeRightBackTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Away";
            presenceOptions.statusCode = "Away";
            break;
          case 5:
          case "on-the-phone":
            presenceOptions.status = Lang.presenceInaCallTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Busy";
            presenceOptions.statusCode = "Busy";
            break;
          case 7:
          case "in-a-meeting":
            presenceOptions.status = Lang.presenceInaMeetingTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Busy";
            presenceOptions.statusCode = "Busy";
            break;
          case 8:
          case "out-of-office":
            presenceOptions.status = Lang.presenceOutOfOfficeTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Away";
            presenceOptions.statusCode = "Away";
            break;
          case 9:
          case "DoNotDisturb":
            presenceOptions.status = Lang.presenceDoNotDisturbTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-donotdisturb";
            presenceOptions.statusCode = "DoNotDisturb";
            break;
          case 10:
          case "in-a-conference":
            presenceOptions.status = Lang.presenceInaConferenceCallTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Busy";
            presenceOptions.statusCode = "Busy";
            break;
          case 18:
          case "Presenting":
            presenceOptions.status = Lang.presencePresentingTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-donotdisturb";
            presenceOptions.statusCode = "DoNotDisturb";
            break;
          case 16:
          case "IdleOnline":
            presenceOptions.status = Lang.presenceIdleOnlineTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Away";
            presenceOptions.statusCode = "Away";
            break;
          case "IdleBusy":
            presenceOptions.status = Lang.presenceIdleBusyTooltipText;
            presenceOptions.statusIconClass = "esoc-chat-presence-Busy";
            presenceOptions.statusCode = "Busy";
            break;
          default:
            presenceOptions.status = Lang.presenceUnknownTooltipText;
            presenceOptions.statusIconClass = "esoc-user-profile-default-presence";
            presenceOptions.statusCode = "Unknown";
          }
          return presenceOptions;
        },
        getNameCtrl: function () {
          var nameCtrl = null;
          var ActiveXObject = {};
          try {
            try {
              if (this.isCompatibleMSIEVersion()) {
                nameCtrl = new ActiveXObject("Name.NameCtrl");
              }
            } catch (ex) {
              nameCtrl = null
            }

            if (nameCtrl == null) {
              var a = "application/x-sharepoint-uc";
              nameCtrl = Boolean(navigator.mimeTypes) && navigator.mimeTypes[a] &&
                         navigator.mimeTypes[a].enabledPlugin;
            }

          } catch (ex) {
            nameCtrl = null
          }

          return nameCtrl;
        },
        getMessageId: function () {
          var endpointId = ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g,
              function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : r & 0x3 | 0x8;

                return v.toString(16);
              }
          );
          return endpointId;
        },
        addHandler: function (method) {
          if (window.attachEvent) {
            window.attachEvent("onmessage", method)
          } else {
            window.addEventListener("message", method);
          }
        },
        removeHandler: function (method) {
          if (window.detachEvent) {
            window.detachEvent("onmessage", method);
          } else {
            window.removeEventListener("message", method);
          }
        }
      };
      return ChatUtil;
    });