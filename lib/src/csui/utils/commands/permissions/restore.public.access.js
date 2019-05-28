/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!csui/utils/commands/nls/localized.strings', 'csui/utils/base',
  'csui/utils/log', 'csui/models/command', 'csui/utils/command.error'
], function (module, require, _, $, lang, base, log, CommandModel,
    CommandError) {
  'use strict';

  var GlobalMessage;

  var RestorePublicAccess = CommandModel.extend({
    defaults: {
      signature: 'restorepublicaccess',
      name: lang.CommandNameRestorePublicAccess
    },

    enabled: function (status) {
      var collection = status.originalCollection ? status.originalCollection :
                       status.permissionCollection,
          userRights = collection && collection.options
                       && collection.options.authenticatedUserPermissions;

      return collection && userRights && userRights.hasEditPermissionRights() &&
             (!collection.findWhere({type: 'public'}));
    },

    execute: function (status) {
      var self       = this,
          deferred   = $.Deferred(),
          collection = status.permissionCollection,
          nodePermissionModel, saveAttr;

      require([
        'csui/models/permission/nodepermission.model',
        'csui/widgets/permissions/impl/edit/apply.permission/apply.permission.view',
        'csui/widgets/permissions/impl/edit/apply.permission/impl/header/apply.permission.header.view',
        'csui/controls/progressblocker/blocker',
        'csui/controls/dialog/dialog.view',
        'csui/controls/globalmessage/globalmessage'
      ], function (NodePermissionModel, ApplyPermissionView, ApplyPermissionHeaderView,
          BlockingView, DialogView, localGlobalMessage) {
        GlobalMessage = localGlobalMessage;
        if (status.originatingView && status.originatingView.model &&
            status.originatingView.model.get("container")) {
          self._executeApplyPermission(status, ApplyPermissionHeaderView,
              ApplyPermissionView, BlockingView, DialogView, NodePermissionModel)
              .then(deferred.resolve, deferred.reject);
        } else {
          nodePermissionModel = new NodePermissionModel({type: 'public'}, status);
          saveAttr = {'permissions': NodePermissionModel.getReadPermissions()};
          nodePermissionModel.nodeId = status.nodeId;
          if (status.originatingView && status.originatingView.blockActions) {
            status.originatingView.blockActions();
          }
          nodePermissionModel.save(saveAttr, {
            patch: true,  // let form data be 'body:{"name":"Pictures"}' and uploadable
            wait: true
          }).done(function () {
            nodePermissionModel.set({publicAccess: true}, {silent: true});
            if (status.originatingView && status.originatingView.unblockActions) {
              status.originatingView.unblockActions();
            }
            var successMsg = self._getMessageWithUserDisplayName(
                nodePermissionModel.get('results') && nodePermissionModel.get('results').success > 0 ?
                lang.RestorePublicAccessSuccessMessageWithCount :
                lang.RestorePublicAccessSuccessMessage, nodePermissionModel);
            GlobalMessage.showMessage('success', successMsg);
            deferred.resolve(nodePermissionModel);
          }).fail(function (error) {
            var commandError = error ? new CommandError(error, nodePermissionModel) :
                               error;
            if (status.originatingView && status.originatingView.unblockActions) {
              status.originatingView.unblockActions();
            }
            GlobalMessage.showMessage('error', commandError);
            deferred.reject(nodePermissionModel, commandError);
          });
        }
      });
      return deferred.promise();
    },

    _executeApplyPermission: function (status, ApplyPermissionHeaderView,
        ApplyPermissionView, BlockingView, DialogView, NodePermissionModel) {
      var deferred = $.Deferred();
      this.originatingView = status.originatingView;
      var headerView = new ApplyPermissionHeaderView({'restorePublicAccess': true});
      this._view = new ApplyPermissionView({
        context: status.context,
        model: status.originatingView.model,
        permissionModel: new NodePermissionModel({type: 'public'}, status),
        permissions: NodePermissionModel.getReadPermissions(),
        removePermission: true,
        collection: status.permissionCollection,
        applyTo: status.applyTo,
        originatingView: status.originatingView
      });
      var dialog = new DialogView({
        headerView: headerView,
        view: this._view,
        className: "csui-permissions-apply-dialog",
        midSize: true,
        buttons: [
          {
            id: 'apply',
            label: lang.applyButtonLabel,
            'default': true,
            click: _.bind(this._performActions, this)
          },
          {
            label: lang.cancelButtonLabel,
            close: true
          }
        ]
      });
      dialog.listenTo(dialog, 'hide', _.bind(this.onHideDialog, this));
      BlockingView.imbue(dialog);
      dialog.show();
      return deferred.promise();
    },

    onHideDialog: function () {
      var origView = this.originatingView;
      origView && origView.trigger("unblock:view:actions");
    },

    _performActions: function (status, options) {
      var self                = this,
          deferred            = $.Deferred(),
          permissionModel     = status.dialog ? status.dialog.options.view.options.permissionModel :
                                status.model,
          permissions         = status.dialog && status.dialog.options.view.options.permissions,
          originatingView     = status.dialog && status.dialog.options.view.options.originatingView,
          nodeModel           = status.dialog.options.view.model,
          collection          = status.dialog && status.dialog.options.view.options.collection,
          container           = nodeModel && nodeModel.get("container"),
          permissionModelType = nodeModel && nodeModel.get("permissions_model"), saveAttr;
      self.originatingView = originatingView;
      if (status.dialog) {
        permissionModel.apply_to = (container && permissionModelType === "advanced") &&
                                   status.dialog.options.view.subFolderSelected ? 2 :
                                   (container && permissionModelType === "advanced") ? 3 : 0;
        permissionModel.include_sub_types = permissionModel.apply_to > 0 ?
            [204, 207, 215, 298, 3030202] : [];
      }
      saveAttr = {
        'permissions': permissions,
        'apply_to': permissionModel.apply_to,
        'include_sub_types': permissionModel.include_sub_types
      };
      permissionModel.nodeId = nodeModel.get("id");
      if (self.originatingView && self.originatingView.blockActions) {
        self.originatingView.blockActions();
      }
      permissionModel.save(saveAttr, {
        patch: true,  // let form data be 'body:{"name":"Pictures"}' and uploadable
        wait: true
      }).done(function () {
        permissionModel.set({publicAccess: true}, {silent: true});
        self.destroyDialog(status);
        collection.addPublicAccess(permissionModel);
        if (self.originatingView && self.originatingView.unblockActions) {
          self.originatingView.unblockActions();
        }
        var successMsg = self._getMessageWithUserDisplayName(
            permissionModel.get('results') && permissionModel.get('results').success > 0 ?
            lang.RestorePublicAccessSuccessMessageWithCount :
            lang.RestorePublicAccessSuccessMessage, permissionModel);
        GlobalMessage.showMessage('success', successMsg);
        deferred.resolve(permissionModel);
      }).fail(function (error) {
        var commandError = error ? new CommandError(error, permissionModel) :
                           error;
        self.destroyDialog(status);
        if (self.originatingView && self.originatingView.unblockActions) {
          self.originatingView.unblockActions();
        }
        GlobalMessage.showMessage('error', commandError);
        deferred.reject(permissionModel, commandError);
      });
    },

    _getMessageWithUserDisplayName: function (unformattedMsg, permissionModel) {
      var displayName;
      if (permissionModel.get("type") === "public") {
        displayName = lang.publicAccess;
      }
      var msg;
      if (permissionModel.get('results') && permissionModel.get('results').success > 0) {
        msg = _.str.sformat(unformattedMsg, displayName,
            base.formatMessage(permissionModel.get('results').success, lang));
      } else {
        msg = _.str.sformat(unformattedMsg, displayName);
      }
      return msg;
    },

    destroyDialog: function (status) {
      status.dialog && status.dialog.destroy();
    }
  });

  return RestorePublicAccess;
});
