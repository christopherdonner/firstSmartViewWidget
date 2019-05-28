/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/utils/base', 'csui/lib/underscore',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/utils/commandhelper', 'csui/models/command'
], function (require, $, base, _, lang, CommandHelper, CommandModel) {
  'use strict';

  var GoToLocationCommand = CommandModel.extend({

    defaults: {
      signature: "goToLocation",
      scope: "single"
    },

    enabled: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      return node && this._isSupported(node);
    },

    _isSupported: function (node) {
      var supportedObjects = [144], //this may be extend in future for other object types also
          support          = $.inArray(node.get('type'), supportedObjects) !== -1;
      return support;
    },

    execute: function (status, options) {
      var deferred = $.Deferred(),
          node     = CommandHelper.getJustOneNode(status),
          nodeModel;
      if (node && this._isSupported(node)) {
        nodeModel = node.parent;
        if (nodeModel && nodeModel.get('type') === undefined) {
          nodeModel.fetch().done(function () {
            status.originatingView && this.executeDefaultAction(nodeModel, status.originatingView);
          }).fail(function (resp) {
            require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
              var error = new base.Error(resp);
              ModalAlert.showError(error.message);
            });

          });
          deferred.resolve();
        }     
      else {
        status.originatingView && this.executeDefaultAction(nodeModel, status.originatingView); 
        deferred.resolve();
        }
      }
      return deferred.promise();
    },

    executeDefaultAction: function (node, originatingView) {
      var args = {node: node};
      originatingView.trigger('before:defaultAction', args);
      if (!args.cancel) {
        var self = originatingView;
        originatingView.defaultActionController && originatingView.defaultActionController
            .executeAction(node, {
              context: originatingView.context,
              originatingView: originatingView
            })
            .done(function () {
              self.trigger('executed:defaultAction', args);
            });
      }
    }

  });

  return GoToLocationCommand;

});
