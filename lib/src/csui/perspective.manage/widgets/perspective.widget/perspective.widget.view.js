/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/perspective.manage/widgets/perspective.widget/impl/nls/lang',
  'hbs!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget',
  'css!csui/perspective.manage/widgets/perspective.widget/impl/perspective.widget'
], function (_, Backbone, Marionette, lang, template) {
  var PerspectiveWidgetView = Marionette.ItemView.extend({
    className: 'csui-pman-widget',
    template: template,
    templateHelpers: function () {
      var wConfig = this.widget.get("manifest");
      var noConfig = !wConfig || !wConfig.schema || !wConfig.schema.properties ||
                     _.isEmpty(wConfig.schema.properties);
      return {
        widgetTitle: this.widget.get('title'),
        widgetMessage: noConfig ? lang.noConfig : lang.clickToConfig
      }
    },

    constructor: function (options) {
      Marionette.ItemView.apply(this, arguments);
      this.widget = options.data.widget;
    }
  });
  return PerspectiveWidgetView;
});