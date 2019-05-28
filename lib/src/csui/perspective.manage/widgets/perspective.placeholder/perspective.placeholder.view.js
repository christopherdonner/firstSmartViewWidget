/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/perspective.manage/widgets/perspective.placeholder/impl/nls/lang',
  'hbs!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder',
  'css!csui/perspective.manage/widgets/perspective.placeholder/impl/perspective.placeholder'
], function (_, Backbone, Marionette, lang, template) {
  var PerspectivePlaceholderView = Marionette.ItemView.extend({
    className: 'csui-perspective-placeholder',
    template: template,
    templateHelpers: function () {
      return {
        dndWidgetsHere: lang.dndWidgetsHere
      }
    },

    constructor: function (options) {
      Marionette.ItemView.apply(this, arguments);
    },

    onShow: function() {
      this.$el.parent().addClass('csui-pman-placeholder-container');
    },

    onDestroy: function() {
      this.$el.parent().removeClass('csui-pman-placeholder-container');
    }

  });
  return PerspectivePlaceholderView;
});