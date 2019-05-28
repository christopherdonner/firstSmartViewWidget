/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/underscore",
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/controls/dialog/dialog.view",
  "i18n!csui/controls/conflict.resolver/impl/nls/lang",
  "csui/utils/log",
  "csui/controls/conflict.resolver/impl/conflict.dialog/conflict.dialog",
  "csui/models/namequery",
  "csui/utils/base",
  'csui/models/fileuploads',
  "css!csui/controls/conflict.resolver/impl/conflict.resolver"
], function (
  _,
  $,
  Backbone,
  DialogView,
  lang,
  log,
  ConflictDialog,
  NameQuery,
  base,
  UploadFileCollection) {
  "use strict";

  function ConflictResolver(options) {
    this.options = options || {};
    this.deferred = $.Deferred();
    this.container = options.container;
    this.actionBtnLabel = options.actionBtnLabel || lang.upload;
    this.excludeAddVersion = options.excludeAddVersion || false;
    this.files = options.files instanceof UploadFileCollection? options.files:
      new UploadFileCollection(options.files);
    this.deferred.then(_.bind(this.destroy, this), _.bind(this.destroy, this));
  }

  _.extend(ConflictResolver.prototype, {

    destroy: function(){
      if (this._dialog) {
        this._dialog.destroy();
      }
    },
    run: function (options) {
      var self = this;

      _.extend(this.options, options);
      this.queryNames(this.files)
        .done(function (nonConflictfiles, conflictFiles) {
          self._resolveConflicts(nonConflictfiles, conflictFiles);
        })
        .fail(function (resp) {
          var msgResp = self.getMsgResponse(resp);
          self.deferred.reject(new Error(msgResp));
        });

      return this.deferred.promise();
    },


    queryNames: function (files) {
      var deferred = $.Deferred(),
        nameQuery = new NameQuery({containerId: this.container.get('id')}, {connector: this.container.connector});

      nameQuery.queryNames(files)
        .done(function (cleanFiles, conflictFiles) {
          deferred.resolve(cleanFiles, conflictFiles);
        })
        .fail(function (resp) {
          var error = new base.Error(resp);
          deferred.reject(error);
        });
      return deferred;
    },

    getMsgResponse: function (response) {
      var errorMsg = lang.fileNameQueryFailed;

      if (response) {
        errorMsg = new base.RequestErrorMessage(response);
        errorMsg = errorMsg.message;
      }

      return errorMsg;
    },




    showBatchResolve: function (conflictFiles) {
      var deferred = $.Deferred(),
        bodyMessage = lang.batchMessage,
        buttons = [
          {
            id: 'versions',
            label: lang.addVersion,
            toolTip: lang.addVersion,
            click: function (args) {
              deferred.resolve('versions', args.dialog);
            }
          },
          {
            id: 'skip',
            label: lang.skipConflicts,
            toolTip: lang.skipConflicts,
            click: function (args) {
              deferred.resolve('skip', args.dialog);
            }
          },

          {
            id: 'individual',
            label: lang.resolveIndividual,
            toolTip: lang.resolveIndividual,
            click: function (args) {
              deferred.resolve('individual', args.dialog);
            }
          }
        ];

      if (this.excludeAddVersion) {
        buttons.shift();
      }
      this._createDialog('csui-conflict-dialog csui-batch', conflictFiles, buttons, bodyMessage);
      return deferred;
    },

    showIndividualResolve: function (conflictFiles) {
      var self = this;
      var conflictDialog;

      _.each(conflictFiles, function(file) {
        file.excludeAddVersion = self.excludeAddVersion;
      });

      conflictDialog = this._conflictDialog = new ConflictDialog({
        parentId: this.container.get('id'),
        connector: this.container.connector,
        totalNumFiles: this.options.files.length,
        conflictFiles: conflictFiles,
        actionBtnLabel: this.actionBtnLabel,
        h1Label: this.options.h1Label
      });

      conflictDialog.show()
        .done(function (resolvedFiles, removedFiles) {
          self._removeDeletedFiles(removedFiles);
          self._returnFiles();
        })
        .fail(function () {
          self.deferred.reject({ userAction: "cancelResolveNamingConflicts" });
        });

      return conflictDialog;
    },

    _createDialog: function (className, conflictFiles, buttons, bodyMessage, view) {
      var h2Label = _.str.sformat(lang.conflictCount, conflictFiles.length),
        dialogTxtAria = this.options.h1Label + ". " + h2Label + ". " + bodyMessage,
        dialog = this._dialog = new DialogView({
        bodyMessage: bodyMessage,
        standardHeader: false,
        view: view,
        className: className,
        attributes:{
          'data-backdrop': "static"
        },
        headers: [
          {
            id: 'h1',
            label: this.options.h1Label,
            class: 'csui-numUploads'
          },
          {
            id: 'h2',
            label: h2Label,
            class: 'csui-numConflicts'
          }],
        buttons: buttons,
        dialogTxtAria: dialogTxtAria
      });

      dialog.listenTo(dialog, 'hide', _.bind(this.deferred.reject, this));

      dialog.show();
      return dialog;
    },


    _resolveConflicts: function (nonConflictFiles, conflictFiles) {
      var self = this;
      this.nonConflictFiles = nonConflictFiles;

      if (conflictFiles && conflictFiles.length > 0) {
        if (conflictFiles.length > 1) {
          this.showBatchResolve(conflictFiles)
            .then(function (resolveOption, dialog) {
              dialog.kill();
              switch (resolveOption) {
                case 'versions':
                  self._addVersions(conflictFiles);
                  self._returnFiles();
                  break;
                case 'individual':
                  self.showIndividualResolve(conflictFiles);
                  break;
                case 'skip':
                  self._removeConnflicts(conflictFiles);
                  self._returnFiles();
                }
              });
        }
        else {
          this.showIndividualResolve(conflictFiles);
        }
      }
      else {
        this.deferred.resolve(this.options.files, conflictFiles.length > 0);
      }

      return true;
    },

    _returnFiles: function () {
      if (this.options.files.length && this.options.files instanceof UploadFileCollection) {
        this.deferred.resolve(this.files);
      }
      else if (this.files.length) {
        var files = [];
        _.each(this.files.models, function (file) {
          files.push(file.attributes);
        });
        this.deferred.resolve(files);
      }
      else {
        this.deferred.reject();
      }
    },
    _removeConnflicts: function(conflictFiles){
      var completeFileList = this.files;
      _.each(conflictFiles, function(file){
        completeFileList.remove(file);
      });
    },
    _addVersions: function (files) {
      _.each(files, function (file) {
        file.set('newVersion', true);
      });
    },

    _removeDeletedFiles: function (removedFiles) {

      _.each(removedFiles, function (item) {

        this.files.remove(item);
      }, this);

    },
    _getArrayOfFileNames: function(files){
      var fileNames = [];
      _.each(files, function(file){
        var name = file.newName || file.name;
        fileNames.push({name:name});
      });
      return fileNames;
    }

  });

  ConflictResolver.version = '1.0';
  return ConflictResolver;

});
