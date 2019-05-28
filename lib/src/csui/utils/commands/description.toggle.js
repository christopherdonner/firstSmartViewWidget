/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  "i18n!csui/utils/commands/nls/localized.strings",
  "csui/utils/commandhelper", "csui/utils/commands/node",
  'csui/utils/command.error'
], function (require, $, base, _, lang, CommandHelper, NodeCommand, CommandError) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  var DescriptionToggleCommand = NodeCommand.extend({

    defaults: {
      signature: "ToggleDescription",
      command_key: ['description', 'description'],
      scope: "single",
      name: lang.CommandDescriptionToggle
    },
    enabled: function (status, options) {
      if (!accessibleTable && status.collection && !status.thumbnailViewState) {
        if (status.originatingView && status.originatingView.options.showDescriptions) {
          status.toolItem.attributes.icon = "icon icon-description-toggle icon-description-shown";
          status.toolItem.attributes.name = lang.CommandHideDescription;
        }
        var nodeWithDescription = status.collection.find(function (node) {
          var descr = node.get('description');
          return !!descr;
        });
        return nodeWithDescription !== undefined;
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      var originatingView = status.originatingView;
      var langStr;
      var menuSelector = '.csui-configuration-view .binf-dropdown-menu li[data-csui-command="toggledescription"] a';
      if (originatingView.options.showDescriptions) {
        originatingView.options.showDescriptions = false;
        langStr = lang.CommandShowDescription;
        originatingView.$el.find('.icon-description-toggle').addClass('icon-description-hidden')
            .removeClass('icon-description-shown')
            .parent().attr('title', langStr).attr('aria-label', langStr);
      } else {
        originatingView.options.showDescriptions = true;
        langStr = lang.CommandHideDescription;
        originatingView.$el.find('.icon-description-toggle').removeClass('icon-description-hidden')
            .addClass('icon-description-shown')
            .parent().attr('title', langStr).attr('aria-label', langStr);
      }
      originatingView.$el.find(menuSelector).attr('title', langStr)
          .contents().first().replaceWith(langStr);  // after the text, there can be right arrow
      originatingView.trigger('csui.description.toggled',
          {showDescriptions: originatingView.options.showDescriptions});
    }
  });

  return DescriptionToggleCommand;

});
