/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/widgets/permissions/impl/header/rightview/header.rightbar',
  'i18n!csui/widgets/permissions/impl/nls/lang', 'csui/controls/form/fields/booleanfield.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui-ext!csui/widgets/permissions/impl/header/rightview/header.rightbar.view',
  'css!csui/widgets/permissions/impl/header/rightview/header.rightbar'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin, template, lang,
    BooleanFieldView, TabableRegionBehavior, extraHeaderItems) {

  var PermissionsHeaderRightBarView = Marionette.LayoutView.extend({

    className: 'permissions-header-right-bar',

    template: template,

    templateHelpers: function () {
      return {
        headerItems: this.headerItems
      };
    },

    regions: {
      permissionHeaderRegion: '.csui-permission-header-data'
    },

    initialize: function () {
      var self = this;
      this.headerItems = headerRightBarViews;
    },

    constructor: function PermissionsHeaderRightBarView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var self = this;
      if (this.headerItems.length > 0) {
        _.each(this.headerItems, function (headerExtraView, index) {
          var region = "csui-header-right-view" + index;
          self.addRegion(region, "#" + region).show(new headerExtraView());
        });
      }
    }

  });

  var headerRightBarViews = [];

  if (extraHeaderItems) {
    _.each(extraHeaderItems, function (headerItems) {
      headerRightBarViews.push(headerItems);
    });
  }

  _.extend(PermissionsHeaderRightBarView.prototype, ViewEventsPropagationMixin);

  return PermissionsHeaderRightBarView;

});