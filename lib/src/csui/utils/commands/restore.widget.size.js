/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/utils/commandhelper', 'csui/models/command'
], function (require, $, base, _, lang, CommandHelper, CommandModel) {
  'use strict';

  var NormalizeNodestableViewCommand = CommandModel.extend({

    defaults: {
      signature: "RestoreWidgetViewSize",
      scope: "single"
    },

    enabled: function (status, options) {

      var isMaximizeMode = this.checkMaximizeMode(status);

      if (isMaximizeMode) {
        return false; //When showWidgetInMaxMode then disable the RestoreWidgetView
      } else {
        var supportMaximizeWidget = $("body").hasClass("csui-support-maximize-widget");
        return (supportMaximizeWidget && $("body").hasClass("csui-maximized-widget-mode") === true);
      }

    },

    checkMaximizeMode: function (status) {
      return status && status.context && status.context.perspective &&
             status.context.perspective.get("showWidgetInMaxMode");
    },

    execute: function (status, options) {
      status.context.trigger("restore:widget:size", {widgetView: status.originatingView});
    }
  });

  return NormalizeNodestableViewCommand;

});
