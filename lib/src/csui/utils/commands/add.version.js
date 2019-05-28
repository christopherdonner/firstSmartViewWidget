/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/jquery', 'csui/lib/underscore',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/models/command', 'csui/utils/commandhelper',
  'csui/models/node/node.model',
  'csui/models/actions', 'csui/dialogs/file.open/file.open.dialog',
  'csui/utils/types/date', 'csui/utils/types/number',
  'csui/utils/types/member', 'csui/lib/moment'
], function (require, $, _, lang, CommandModel, CommandHelper,
    NodeModel, ActionCollection, FileOpenDialog, date, number, member,
    moment) {
  'use strict';
  var ConnectorFactory;
  var AddVersionCommand = CommandModel.extend({
    defaults: {
      signature: "AddVersion",
      command_key: "addversion",
      name: lang.CommandNameAddVersion,
      scope: "single"
    },

    execute: function (status, options) {
      status || (status = {});
      var deferred              = $.Deferred(),
          currentModel          = status.nodes.models[0],
          recentVersionOwnerId  = currentModel.get('versions').owner_id,
          currentLoggedInUserId = status.context.getModel('user').id,
          self                  = this;

      this.trigger('close:dialogView:form');
      require([
        'csui/utils/contexts/factories/connector',
      ], function () {
        ConnectorFactory = arguments[0];

        if (!!status.tableView) {
          status.tableView.lockedForOtherContols = false;
        }

        status.connector = status.context.getObject(ConnectorFactory);

        if ((!!status.nodes.models[0].versions && !!status.nodes.models[0].versions.allModels)) {
          var allModels     = status.nodes.models[0].versions.allModels,
              recentVersion = allModels[allModels.length - 1];
          recentVersionOwnerId = recentVersion.get('owner_id').id || recentVersion.get('owner_id');
        }
        if (currentLoggedInUserId === recentVersionOwnerId || !!currentModel.get('reserved')) {
          self._fileOpenDialog(status, options);
        } else {
          self._showWarnDialog(status, options, self);
        }

        deferred.resolve();
        status.suppressSuccessMessage = true;
        var file = status.file;

        if (file) {
          this
              ._uploadFiles(file, status)
              .done(deferred.resolve)
              .fail(deferred.reject);
        }
      });

      return deferred.promise();
    },

    _getBodyMessage: function (versionInfo) {
      var currentDate   = moment(),
          versDate      = date.deserializeDate(versionInfo.create_date),
          difference    = currentDate.diff(versDate, 'days'),
          version_owner = member.formatMemberName(versionInfo.owner_id_expanded || versionInfo.owner_id);

      if (difference >= 4) {
        versDate = date.formatExactDate(versDate);
      } else if (difference >= 2) {
        versDate = date.formatFriendlyDateTimeNow(versDate) + " " + date.formatExactTimeOnly(versDate);
      } else {
        versDate = date.formatDateTime(versDate);
      }

      return _.str.sformat(lang.warnMessage, version_owner, lang.grammer, versDate);
    },

    _fileOpenDialog: function (status, options) {
      var fileOpenDialog = new FileOpenDialog({multiple: false}),
          self           = this;
      fileOpenDialog
          .listenTo(fileOpenDialog, 'add:files', function (files) {
            self._uploadFiles(files[0], status, options)
                .always(function () {
                  fileOpenDialog.destroy();
                });
          })
          .show();
    },

    _showWarnDialog: function (status, options, self) {

      this._getOwnerInfoOfLatestVersion(status).done(_.bind(function (resp) {
        require([
          'csui/controls/dialog/dialog.view',
          'css!csui/controls/globalmessage/impl/messagedialog'
        ], function (DialogView) {
          self._dialog = new DialogView({
            iconLeft: 'notification_warning',
            title: lang.warnTitle,
            bodyMessage: self._getBodyMessage(resp.data),
            status: status,
            showTitleIcon: true,
            className: self.dialogClassName(),
            buttons: [
              {
                id: 'Version',
                label: lang.yesButton,
                'default': true,
                disabled: false,
                click: _.bind(self._onClickSelectButton, self, status)
              },
              {
                label: lang.noButton,
                click: _.bind(self.onClickCancelButton, self)

              }
            ]
          });
          self._dialog.show();
        }, self);

      }, this)).fail(function (resp) {
      });
    },

    _getOwnerInfoOfLatestVersion: function (status) {
      var deferred    = $.Deferred(),
          node        = status.nodes.models[0],
          connector   = status.connector,
          versionInfo = connector.extendAjaxOptions({
            url: connector.connection.url + '/nodes/' + node.get("id") +
                 '/versions/latest?expand=member',
            type: 'GET'
          });

      $.ajax(versionInfo).done(function (resp) {
        deferred.resolve(resp);
      }).fail(function (resp) {
        deferred.reject(resp);
      });
      return deferred.promise();
    },

    dialogClassName: function () {
      var className = 'addversion-fornonreserve';
      return className;
    },

    onClickCancelButton: function () {
      this._dialog.destroy();

    },

    _onClickSelectButton: function (self, dialogView) {
      if (!!dialogView) {
        dialogView.dialog.destroy();
      }
      self = this;
      self._fileOpenDialog(dialogView.dialog.options.status, {});
    },

    _uploadFiles: function (file, status) {
      var node = CommandHelper.getJustOneNode(status);

      return this._dialogProgressUpload(node, file, status);
    },

    _dialogProgressUpload: function (node, file, status) {
      var deferred = $.Deferred();

      require([
        'csui/controls/fileupload/impl/addversion.controller',
        'csui/models/version'
      ], function (AddVersionController, VersionModel) {
        var node = CommandHelper.getJustOneNode(status);
        var addVersionController = new AddVersionController({
          view: status.originatingView,
          selectedNode: node
        });

        addVersionController
            .uploadFile(file)
            .then(function (fileUploadModel) {
              return fileUploadModel.version
                  .fetch()
                  .then(function (response) {
                    return fileUploadModel.version;
                  });
            })
            .then(function (version) {
              if (node.versions || (!!node.attributes && !!node.attributes.versions)) {
                var sizeinbytes = version.get('file_size'),
                    sizeinkb    = number.formatFileSize(sizeinbytes);
                version.set('file_size_formatted', sizeinkb);
                version.isLocallyCreated = true;
                fakeActions(node, version);
                !!node.versions && node.versions.add(version, {at: 0});
                if (Array.isArray(node.get('versions'))) {
                  !!node.attributes && !!node.attributes.versions &&
                  node.attributes.versions.push(version.attributes);
                }

              }
            })
            .then(function () {
             return true;
            })
            .then(function () {
              return true;
            })
            .done(deferred.resolve)
            .fail(deferred.reject);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }
  });
  function fakeActions(node, version) {
    var actions = [];
    if (node.actions.findRecursively('download') || node.actions.findRecursively('Download')) {
      actions.push({signature: 'versions_download'}, {signature: 'versions_open'});
    }
    if (node.actions.findRecursively('delete') || node.actions.findRecursively('Delete')) {
      actions.push({signature: 'versions_delete'});
    }
    if (node.actions.findRecursively('properties') || node.actions.findRecursively('Properties')) {
      actions.push({signature: 'versions_properties'});
    }
    version.actions.reset(actions);
  }

  return AddVersionCommand;
});
