/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!csui/utils/commands/versions/nls/localized.strings',
  'csui/utils/commandhelper', 'csui/utils/commands/delete',
], function (require, module, _, $, versionLang, CommandHelper, DeleteCommand) {
  'use strict';

  var VersionDeleteCommand = DeleteCommand.extend({
    defaults: {
      signature: 'VersionDelete',
      command_key: ['versions_delete'],
      name: versionLang.CommandNameVersionDelete,
      verb: versionLang.CommandVerbVersionDelete,
      pageLeavingWarning: versionLang.DeleteVersionPageLeavingWarning,
      scope: 'multiple',
      successMessages: {
        formatForNone: versionLang.DeleteVersionItemsNoneMessage,
        formatForOne: versionLang.DeleteVersionOneItemSuccessMessage,
        formatForTwo: versionLang.DeleteVersionSomeItemsSuccessMessage,
        formatForFive: versionLang.DeleteVersionManyItemsSuccessMessage
      },
      errorMessages: {
        formatForNone: versionLang.DeleteVersionItemsNoneMessage,
        formatForOne: versionLang.DeleteVersionOneItemFailMessage,
        formatForTwo: versionLang.DeleteVersionSomeItemsFailMessage,
        formatForFive: versionLang.DeleteVersionManyItemsFailMessage
      }
    },

    enabled: function (status, options) {
      if (!VersionDeleteCommand.__super__.enabled.apply(this, arguments)) {
        return false;
      }
      var selectedVersions = CommandHelper.getAtLeastOneNode(status);
      return selectedVersions.length > 0 &&
             status.container && status.container.versions && status.container.versions.allModels &&
             selectedVersions.length < status.container.versions.allModels.length;
    },

    _getConfirmData: function (status, options) {
      var versions = CommandHelper.getAtLeastOneNode(status);
      status.originatingView.blockActions = false;
      return {
        title: versionLang.DeleteCommandConfirmDialogTitle,
        message: versions.length === 1 ?
                 _.str.sformat(versionLang.VersionDeleteCommandConfirmDialogSingleMessage,
                     versions.at(0).get('version_number_name'),
                     status.container.get('name')) :
                 _.str.sformat(versionLang.VersionDeleteCommandConfirmDialogMultipleMessage,
                     versions.length)
      };
    },

    startGlobalMessage: function (uploadCollection) {
      require([
        'csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        GlobalMessage.showFileUploadProgress(uploadCollection, {
          oneFileTitle: versionLang.DeletingOneVersion,
          oneFileSuccess: versionLang.DeleteVersionOneItemSuccessMessage,
          multiFileSuccess: versionLang.DeleteVersionManyItemsSuccessMessage,
          oneFilePending: versionLang.DeletingOneVersion,
          multiFilePending: versionLang.DeleteVersions,
          oneFileFailure: versionLang.DeleteVersionOneItemFailMessage,
          multiFileFailure: versionLang.DeleteVersionManyItemsFailMessage2,
          someFileSuccess: versionLang.DeleteVersionSomeItemsSuccessMessage,
          someFilePending: versionLang.DeletingSomeVersions,
          someFileFailure: versionLang.DeleteVersionSomeItemsFailMessage2,
          enableCancel: false
        });
      });
    }
  });

  return VersionDeleteCommand;
});
