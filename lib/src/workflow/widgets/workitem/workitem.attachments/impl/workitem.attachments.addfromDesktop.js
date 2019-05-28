/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/commands/add',
  'csui/dialogs/file.open/file.open.dialog'
], function (module, require, _, $, AddCommand, FileOpenDialog) {
  'use strict';
  var AddFromFileSystem = AddCommand.extend({
    _selectFilesForUpload: function (status, options) {
      var deferred       = $.Deferred(),
          fileOpenDialog = new FileOpenDialog({multiple: true});
      fileOpenDialog
          .on('add:files', function (files) {
            require(['csui/controls/fileupload/fileupload'
            ], function (fileUploadHelper) {
              deferred.resolve();
              var uploadController = fileUploadHelper.newUpload(status, options);
              uploadController.addFilesToUpload(files, {
                collection: status.collection
              });
              if (files.length === 1) {
                status.collection.singleFileUpload = true;
              }
            });
          })
          .on('cancel', function () {
            deferred.reject();
          })
          .show();
      return deferred.promise();
    }
  });

  return AddFromFileSystem;

});