/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "require", 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/lib/underscore',
  'csui/models/command',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, $, backbone, Marionette, _, CommandModel, lang) {
  'use strict';
  var config = module.config();
  _.defaults(config, {
    enableGridView: false
  });
  var TaskQueue, Thumbnail,
      ThumbnailCommand = CommandModel.extend({

        defaults: {
          signature: "Thumbnail",
          command_key: ['thumbnail', 'thumbnail'],
          scope: "single",
          name: 'Thumbnail'
        },
        enabled: function (status, options) {
          if (status.collection && config.enableGridView) {
            if (status.thumbnailViewState) {
              status.toolItem.attributes.icon = "icon icon-switch_list";
              status.toolItem.attributes.name = lang.ListViewTitle;
              status.toolItem.attributes.title = lang.ListViewTitle;
            }
            return true;
          } else {
            return false;
          }
        },

        execute: function (status, options) {
          var originatingView = status.originatingView || (options && options.originatingView);
          var langStr;
          var menuSelector = '.csui-configuration-view .binf-dropdown-menu li[data-csui-command="thumbnail"] a';
          if (originatingView.thumbnailViewState) {
            langStr = lang.ThumbnailTitle;
            originatingView.$el.find('.binf-glyphicon-th-list').removeClass(
                "binf-glyphicon-th-list").addClass("binf-glyphicon-th-large");
            originatingView.$el.find('.binf-glyphicon-th-large')
                .parent().attr('title', langStr).attr('aria-label', langStr);
          } else {
            langStr = lang.ListViewTitle;
            originatingView.$el.find('.binf-glyphicon-th-large').addClass(
                "binf-glyphicon-th-list").removeClass("binf-glyphicon-th-large");
            originatingView.$el.find('.binf-glyphicon-th-list')
                .parent().attr('title', langStr).attr('aria-label', langStr);
          }
          originatingView.$el.find(menuSelector).attr('title', langStr)
              .contents().first().replaceWith(langStr);  // after the text, there can be right arrow
        }
      });

  return ThumbnailCommand;
});
