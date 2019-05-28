/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore",
  "csui/lib/jquery",
  "csui/utils/log",
  "csui/utils/base",
  "csui/lib/marionette",
  "csui/utils/non-emptying.region/non-emptying.region",
  "csui/lib/binf/js/binf"
], function (_, $, log, base, Marionette, NonEmptyingRegion) {
  'use strict';

  var IconPreloadView = Marionette.ItemView.extend({
    id: "csui-icon-preload",
    template: false,
    onRender: function () {
      this._preloadIcons();
    },
    constructor: function IconPreloadView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    _preloadIcons: function () {
      var that  = this,
          icons = [
            'icon-toolbar-copy',
            'icon-toolbarAdd',
            'icon-toolbarFilter',
            'icon-toolbar-share',
            'icon-toolbar-download',
            'icon-toolbar-metadata',
            'icon-toolbar-shortcut',
            'icon-toolbar-add-version',
            'icon-toolbar-copy',
            'icon-toolbar-delete',
            'icon-toolbar-edit',
            'icon-toolbar-more',
            'icon-toolbar-move',
            'icon-toolbar-rename',
            'icon-toolbar-reserve',
            'icon-toolbar-unreserve',
            'icon-publish_status',
            'icon-waiting_for_approval_status',
            'icon-in_draft_status',
            'icon-socialFav',
            'icon-socialFavOpen',
            'icon-reserved_other',
            'icon-reserved_other_mo',
            'icon-reserved_other_md',
            'icon-reserved_self',
            'icon-reserved_self_mo',
            'icon-reserved_self_md',
            'icon-toolbar-permissions'
          ];
      _.each(icons, function (icon) {
        that.$el.append('<span class="csui-icon ' + icon +
                        '" style="position:fixed;top:-100px;left:-100px;"></span>');
      });
    }
  });
  IconPreloadView.ensureOnThePage = function () {
    if (base.isIE11()) {
      if (!$("#csui-icon-preload").length) {
        var iconPreloadView = new IconPreloadView(),
            binfContainer   = $.fn.binf_modal.getDefaultContainer(),
            region          = new NonEmptyingRegion({el: binfContainer});
        region.show(iconPreloadView);
      }
    }
  };
  return IconPreloadView;
});