/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', "csui/lib/backbone", 'csui/lib/jquery',
  'csui/utils/base',
  'csui/models/command', 'csui/utils/commandhelper', 'csui/utils/command.error',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, Backbone, $, base, CommandModel,
    CommandHelper, CommandError, lang) {
  'use strict';

  var config = _.extend({}, module.config());

  var EditPermissionCommand = CommandModel.extend({
    defaults: {
      signature: 'EditPermission'
    },

    enabled: function (status) {
      var permissionModel = status.model,
          collection      = permissionModel && permissionModel.collection,
          right_id        = permissionModel && permissionModel.get('right_id'),
          permissionType  = permissionModel && permissionModel.get('type'),
          filterId        = status.filterId;

      return !filterId && permissionType && (right_id || permissionType === "public") &&
             collection &&
             collection.options && collection.options.node && !!collection.options.node.get('id') &&
             (collection.options.authenticatedUserPermissions &&
              collection.options.authenticatedUserPermissions.hasEditPermissionRights() ||
              status.admin_permissions);
    },

    execute: function (status, options) {
      var self            = this,
          deferred        = $.Deferred(),
          permissionModel = status.model,
          collection      = permissionModel.collection,
          targetView      = status.targetView;

      self.targetView = targetView;
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

      var failureMsg = this._getMessageWithUserDisplayName(lang.EditPermissionCommandFailMessage,
          permissionModel);
      if (collection) {
        permissionModel.nodeId = collection.options && collection.options.node &&
                                 collection.options.node.get('id');

        require(
            ['csui/widgets/permissions/impl/edit/edit.permission.helper',
              'csui/utils/contexts/factories/user', 'csui/controls/globalmessage/globalmessage'
            ], function (EditPermissionHelper, UserModelFactory, GlobalMessage) {
              var user = status.originatingView.context.getModel(UserModelFactory);
              self.loginUserId = user.get('id');
              self.editPermissionHelper = new EditPermissionHelper({
                permissionModel: permissionModel,
                popoverPlacement: "left",
                popoverAtBodyElement: status.originatingView ?
                                      !status.originatingView.options.isExpandedView : true,
                popoverTragetElement: status.targetView.permissions.$el,
                readonly: false,
                originatingView: status.originatingView,
                applyTo: status.applyTo
              });

              self.editPermissionHelper.listenTo(self.editPermissionHelper,
                  "permissions:selected", function (userSelection) {
                    var saveAttr = {
                      "permissions": userSelection.permissions,
                      "apply_to": userSelection.apply_to,
                      "include_sub_types": userSelection.apply_to > 0 ?
                          [204, 207, 215, 298, 3030202] : []
                    };
                    if (userSelection.right_id) {
                      saveAttr.right_id = userSelection.right_id;
                    }
                    permissionModel.save(saveAttr, {
                      patch: true,  // let form data be 'body:{"name":"Pictures"}' and uploadable
                      wait: true,
                      silent: true
                    }).done(function (response) {
                      collection.options.authenticatedUserPermissions.fetch()
                          .done(function () {
                            permissionModel.set(saveAttr, {silent: true});
                            self.editPermissionHelper.destroy();
                            self.editPermissionHelper.unblockActions();
                            deferred.resolve();
                          })
                          .fail(function (error) {
                            var commandError = error ? new CommandError(error, permissionModel) :
                                               error;
                            deferred.reject(permissionModel, commandError);
                          });
                      var message;
                      if (response.results.success > 0 && response.results.failure === 0) {
                        message = _.str.sformat(
                            response.results.success === 1 ? lang.AppliedPermissionsOneSuccess :
                            lang.AppliedPermissionsOnlySuccess,
                            response.results.success);
                      } else if (response.results.success > 0 && response.results.failure > 0) {
                        message = _.str.sformat(lang.AppliedPermissionsSuccessAndFailure,
                            response.results.success, response.results.failure);
                      } else if (response.results.success === 0 && response.results.failure > 0) {
                        message = _.str.sformat(
                            response.results.failure === 1 ? lang.AppliedPermissionsOneFailure :
                            lang.AppliedPermissionsOnlyFailure,
                            response.results.failure);
                      }
                      var errObject  = Backbone.Model.extend({
                            defaults: {
                              name: "",
                              state: 'pending',
                              commandName: 'ViewPermission'
                            }
                          }),
                          errObjects = [];

                      var failedfilesCollection = Backbone.Collection.extend({
                        model: errObject
                      });
                      var errCollection = new failedfilesCollection();

                      for (var i = 0;
                           response.results.failure > 0 && i < response.results.data.length; i++) {
                        errObjects[i] = new errObject({
                          name: response.results.data[i].name,
                          mime_type: '',
                          state: 'rejected'
                        });
                        errCollection.add(errObjects[i]);
                      }
                      var succesfull_count = (response.results.success > 0 &&
                                              response.results.failure > 0) ?
                                             response.results.success : '',
                          succes_msg       = '';
                      var langTitle = _.str.sformat(lang.ApplyingManyItemsSuccessMessage,
                          succesfull_count);
                      var success_msg = succesfull_count > 0 ? langTitle : ' ';

                      response.results.failure > 0 ?
                      GlobalMessage.showPermissionApplyingProgress(errCollection, {
                        oneFileFailure: success_msg + lang.ApplyingOneItemFailMessage,
                        someFileFailure: success_msg +
                                         _.str.sformat(lang.ApplyingManyItemsFailMessage2,
                                             errObjects.length),
                        multiFileFailure: success_msg +
                                          _.str.sformat(lang.ApplyingManyItemsFailMessage2,
                                              errObjects.length)
                      }) : '';

                      (response.results.success > 0 &&
                       response.results.failure <= 0) ?
                      GlobalMessage.showMessage('success',
                          message ? message : lang.AppliedPermissions) : '';
                    }).fail(function (error) {
                      var commandError = error ? new CommandError(error, permissionModel) :
                                         error;
                      GlobalMessage.showMessage('error', commandError);
                      deferred.reject(permissionModel, commandError);
                    });
                  });

              self.editPermissionHelper.listenTo(self.editPermissionHelper,
                  "closed:permission:level:popover", function () {
                    deferred.reject(permissionModel);
                  });
            });
      } else {
        return deferred.reject(
            new CommandError(failureMsg, {errorDetails: lang.undefinedCollection}));
      }
      return deferred.promise();
    },

    _getMessageWithUserDisplayName: function (unformattedMsg, permissionModel) {
      var displayName;
      if (permissionModel.get("right_id_expand")) {
        displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
      } else if (permissionModel.get("type") === "public") {
        displayName = lang.publicAccess;
      }
      var msg = _.str.sformat(unformattedMsg, displayName);
      return msg;
    }
  });

  return EditPermissionCommand;
});
