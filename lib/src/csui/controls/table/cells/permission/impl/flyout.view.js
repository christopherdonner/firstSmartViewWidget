/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/tree/tree.view',
  'hbs!csui/controls/table/cells/permission/impl/flyout', 'i18n'
], function ($, _, Marionette, base, TreeView, FlyOutTemplate, i18n) {

  var FlyOutView = Marionette.LayoutView.extend({
    className: "csui-flyout-container",
    regions: {
      treeRegion: ".csui-flyout-items"
    },
    template: FlyOutTemplate,

    constructor: function FlyOutView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this);
      this.options = options;

      this.windowResizeHandler = _.bind(this._onWindowResize, this);
      $(window).on('resize', this.windowResizeHandler);

      this.render();
    },

    onRender: function () {
      if (base.isTouchBrowser()) {
        var viewportHeight = $('.csui-table-row').length > 0 ?
                             $('.csui-table-row').innerHeight() :
                             $('.cs-permissions').innerHeight();
        this.$el.css({'max-height': viewportHeight - 100});
      }

      var treeView = new TreeView({
        collection: this.options.collection
      });

      this.treeRegion.show(treeView);
      this.flyoutTarget = this.options.targetEl;
      this.flyoutTarget.binf_popover({
        content: this.el,
        html: true,
        placement: function (tip, element) {
          var position = (i18n && i18n.settings.rtl) ? 'right' : 'left';
          return position;
        },
        trigger: 'manual'
      });
      this.flyoutTarget.binf_popover('show');
    },

    _onWindowResize: function () {
      this.flyoutTarget.binf_popover('destroy');
      this.flyoutTarget.parents('.csui-normal-scrolling').css('overflow', 'auto');
    },

    onDestroy: function () {
      if (!!this.windowResizeHandler) {
        $(window).off('resize', this.windowResizeHandler);
      }
    }

  });
  return FlyOutView;
});