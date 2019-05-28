/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "csui/lib/jquery", "csui/lib/underscore",
  "i18n!csui/utils/commands/nls/localized.strings",
  "csui/utils/log", "csui/utils/base", "csui/utils/commandhelper",
  "csui/models/command", 'csui/models/node/node.model',
  'csui/dialogs/file.open/file.open.dialog'
], function (require, $, _, lang, log, base, CommandHelper, CommandModel,
    NodeModel, FileOpenDialog) {
  'use strict';

  var AddCommand = CommandModel.extend({

    defaults: {
      signature: "Add"
    },

    enabled: function (status) {
      status || (status = {});
      if (status.container && status.container.get('container')) {
        if (status.container.get("type") === 298) {
          return false;
        }
        status.data || (status.data = {});
        var addableTypes = status.data.addableTypes;
        return addableTypes && _.any([0, 1, 140, 144, 298], function (type) {
              return !!addableTypes.get(type);
            });
      }
      return false;
    },

    execute: function (status, options) {
      if (options && options.addableType === undefined) {
        throw new Error('Missing options.addableType');
      }
      var newNode, promise,
          addableTypeName = this._getAddableTypeName(status, options);
      switch (options.addableType) {
      case 0: // folder
      case 298: // collection
        status.forwardToTable = true;
        newNode = new NodeModel({
          "type": options.addableType,
          "type_name": addableTypeName,
          "container": true,
          "name": "" // start with empty name
        }, {
          connector: status.container.connector,
          collection: status.collection
        });
        promise = $.Deferred().resolve(newNode).promise();
        break;
      case 140: // url (Content Server SubType)
        status.forwardToTable = true;
        newNode = new NodeModel({
          "type": options.addableType,
          "type_name": addableTypeName,
          "container": false,
          "name": "" // start with empty name
        }, {
          connector: status.container.connector,
          collection: status.collection
        });
        promise = $.Deferred().resolve(newNode).promise();
        break;
      case 1: // short-cut (Content Server SubType)
        status.forwardToTable = true;
        promise = this._selectShortcutTarget(status, options);
        break;
      case 144: // document (Content Server SubType)
        status.suppressSuccessMessage = true;
        promise = this._selectFilesForUpload(status, options);
        break;
      default :
        var errMsg = "The \"Add\" action for the addableType " +
                     options.addableType + " is not implemented";
        log.debug(errMsg) && console.log(log.last);
        promise = $.Deferred().reject({
          error: errMsg,
          commandSignature: this.signature
        }).promise();
      }
      return promise;
    },

    _selectFilesForUpload: function (status, options) {
      var deferred       = $.Deferred(),
          fileOpenDialog = new FileOpenDialog({multiple: true});
      deferred.resolve(); // resolve immediately because fileOpenDialog can't trigger anything
      fileOpenDialog
          .listenTo(fileOpenDialog, 'add:files', function (files) {
            require(['csui/controls/fileupload/fileupload'
            ], function (fileUploadHelper) {
              deferred.resolve();
              var uploadController = fileUploadHelper.newUpload(status, options);
              uploadController.addFilesToUpload(files, {
                collection: status.collection
              });
              uploadController.listenTo(uploadController, 'destroy', function () {
                fileOpenDialog.destroy();
              });
            });
          })
          .show();
      return deferred.promise();
    },

    _selectShortcutTarget: function (status, options) {
      var self     = this,
          deferred = $.Deferred();
      require(['csui/dialogs/node.picker/node.picker'
      ], function (NodePicker) {
        var pickerOptions   = {
              dialogTitle: lang.ShortcutPickerTitle,
              connector: status.container.connector,
              context: options.context,
              initialContainer: status.container,
              globalSearch: true,
              startLocation: 'recent.containers',
              unselectableTypes: [141, 142, 133],
              resolveShortcuts: true,
              resultOriginalNode: true
            },
            addableTypeName = self._getAddableTypeName(status, options);
        self.nodePicker = new NodePicker(pickerOptions);
        return self.nodePicker
            .show()
            .then(function (args) {
              var node = args.nodes[0];
              var newNode = new NodeModel({
                "type": 1,
                "type_name": addableTypeName,
                "container": false,
                "name": node.get('name'),
                "original_id": node.get('id'),
                "original_id_expand": node.attributes
              }, {
                connector: status.container.connector,
                collection: status.collection
              });
              return newNode;
            })
            .done(function () {
              deferred.resolve.apply(deferred, arguments);
            })
            .fail(function () {
              deferred.reject.apply(deferred, arguments);
            });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },
    _getAddableTypeName: function (status, options) {
      if (options.addableTypeName) {
        return options.addableTypeName;
      }
      var addableType = status.data.addableTypes.findWhere({
        type: options.addableType
      });
      return addableType.get('type_name');
    }

  }, {
    _getAddableTypesWithoutInlineFormAsMap: function () {
      return {
        144: true // document is handled by FileUploadController
      };
    },

    isAddableTypeWithoutInlineForm: function (addableType) {
      var x = this._getAddableTypesWithoutInlineFormAsMap();
      return x[addableType] === true;
    }

  });

  return AddCommand;

});
