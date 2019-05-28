/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'i18n!csui/utils/commands/nls/localized.strings', 'csui/utils/log',
  'csui/models/command', 'csui/utils/command.error'
], function (module, require, _, $, base, lang, log, CommandModel, CommandError) {
  'use strict';
  var GlobalMessage, ModalAlert;

  var AddUserOrGroupCommand = CommandModel.extend({
    defaults: {
      signature: "adduserorgroup",
      name: lang.CommandNameAddUserorGroup
    },

    enabled: function () {
      return true;
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      status.suppressSuccessMessage = true;
      require(['csui/models/permission/nodepermission.model',
        'csui/controls/globalmessage/globalmessage',
        'csui/dialogs/modal.alert/modal.alert'
      ], function (NodePermissionModel) {
        GlobalMessage = arguments[1];
        ModalAlert = arguments[2];

        self._selectAddUserOrGroupOptions(status, options)
            .done(function (selectedOptions) {
              var selectedMember      = selectedOptions.members,
                  selectedPermissions = selectedOptions.permissions,
                  permissionModelData = {
                    right_id: selectedMember.get('id'),
                    permissions: selectedPermissions,
                    apply_to: selectedOptions.apply_to,
                    include_sub_types: selectedOptions.apply_to > 0 ?
                        [204, 207, 215, 298, 3030202] : []
                  },
                  nodePermissionModel = new NodePermissionModel(permissionModelData, status);

              nodePermissionModel.nodeId = status.nodeId;
              if (status.originatingView && status.originatingView.blockActions) {
                status.originatingView.blockActions();
              }
              nodePermissionModel.save(permissionModelData, {
                silent: true,
                wait: true
              }).done(function () {
                nodePermissionModel.set({
                      right_id_expand: _.clone(selectedMember.attributes),
                      type: 'custom'
                    },
                    {silent: true});
                GlobalMessage.showMessage('success',
                    self._getMessageWithUserDisplayName(nodePermissionModel));
                if (status.originatingView && status.originatingView.unblockActions) {
                  status.originatingView.unblockActions();
                }
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
            })
            .fail(function (error) {
              deferred.reject(error);
            });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _selectAddUserOrGroupOptions: function (status, options) {
      var self = this;
      var deferred = $.Deferred();

      require(['csui/dialogs/members.picker/members.picker.wizard'],
          function (MembersPickerDialog) {
            var unSelectableMembers = status.originalCollection &&
                                      status.originalCollection.models &&
                                      status.originalCollection.models.length > 0 ?
                                      status.originalCollection.models :
                                      status.permissionCollection.models;
            unSelectableMembers = _.filter(unSelectableMembers, function (member) {
              return (member.get("type") === "custom");
            });
            var membersPickerDialog = new MembersPickerDialog({
              command: 'adduserorgroup',
              context: status.context,
              connector: status.connector,
              dialogClass: 'cs-permission-group-picker',
              displayName: lang.allUsersAndGroups,
              dialogTitle: lang.addUsersAndGroups,
              startLocation: 'all.members',
              adduserorgroup: true,
              nodeModel: status.nodeModel,
              addButtonLabel: lang.AddButtonLabel,
              availablePermissions: status.permissionCollection.availablePermissions,
              startLocations: ['all.members', 'member.groups'],
              unselectableMembers: unSelectableMembers,
              applyTo: status.applyTo
            });
            membersPickerDialog
                .show()
                .done(function () {
                  deferred.resolve.apply(deferred, arguments);
                }).fail(function (error) {
              deferred.reject.apply(deferred, arguments);
            });
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    },

    _getMessageWithUserDisplayName: function (permissionModel) {
      var displayName;
      if (permissionModel.get("right_id_expand")) {
        displayName = base.formatMemberName(permissionModel.get("right_id_expand"));
      }
      var msg;
      if (permissionModel.get('results') && permissionModel.get('results').success > 0) {
        msg = _.str.sformat(lang.AddUserOrGroupSuccessWithCount, displayName,
            base.formatMessage(permissionModel.get('results').success, lang));
      } else {
        msg = _.str.sformat(lang.AddUserOrGroupSuccess, displayName);
      }
      return msg;
    }
  });

  return AddUserOrGroupCommand;
});