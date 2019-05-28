/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command','csui/utils/commandhelper',
  'csui/utils/node.links/node.links',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, $, CommandModel,
    CommandHelper, NodeLinks, lang) {
  'use strict';

  var config = _.extend({}, module.config());

  var CopyLinkCommand = CommandModel.extend({
    defaults: {
      signature: 'CopyLink',
      name: lang.CommandNameCopyLink
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return !!node;
    },

    execute: function (status, options) {
      var deferred = $.Deferred(),
          node     = CommandHelper.getJustOneNode(status),
          nodeLink = status.url ? NodeLinks.completeUrl(node, status.url) : NodeLinks.getUrl(node),
          success  = this._copyToClipboard(nodeLink);
      require([
        'csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        if (success) {
          deferred.resolve();
          GlobalMessage.showMessage('success', lang.CopyLinkSuccessMessage);
        } else {
          deferred.reject();
          GlobalMessage.showMessage('error', lang.CopyLinkFailMessage);
        }
      }, deferred.reject);
      return deferred.promise();
    },

    _copyToClipboard: function (nodeLink) {
      if (window.clipboardData) { /*Workaround for IE*/
        window.clipboardData.setData('Text', nodeLink);
        return true;
      } else {
        var success  = false,
            element  = document.createTextNode(nodeLink),
            elParent = document.createElement('span');
        elParent.style.color = 'black';
        elParent.style.background = 'tranparent';
        elParent.style.backgroundColor = 'white';

        elParent.appendChild(element);
        document.body.appendChild(elParent);
        if (window.getSelection) { // moz, opera, webkit, ie11
          var selection = window.getSelection();
          selection.removeAllRanges();
          var range = document.createRange();
          range.selectNodeContents(element);
          selection.addRange(range);
          success = document.execCommand("copy");
          selection.removeAllRanges();
        }
        document.body.removeChild(elParent);
        return success;
      }
    }
  });

  return CopyLinkCommand;
});
