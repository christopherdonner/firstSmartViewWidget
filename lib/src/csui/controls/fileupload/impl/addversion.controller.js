/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'i18n!csui/controls/fileupload/impl/nls/lang',
  'csui/controls/fileupload/impl/upload.controller',
  'csui/models/fileupload',
  'csui/controls/globalmessage/globalmessage',
  'csui/models/fileuploads'
], function (_,
    $,
    lang,
    UploadController,
    FileUploadModel,
    GlobalMessage,
    UploadFileCollection) {
  'use strict';

  function AddVersionController(options) {
    this.view = options.view;
    this.selectedNode = options.selectedNode;

    this.uploadController = new UploadController();
  }

  _.extend(AddVersionController.prototype, {

    uploadFile: function (file) {
      this._blockActions();
      var fileModel = new FileUploadModel({
            file: file
          }, {
            node: this.selectedNode
          }),
          uploadFiles = new UploadFileCollection([fileModel]);
      this.uploadController.scheduleFileForUpload(fileModel);
      GlobalMessage.showFileUploadProgress(uploadFiles);
      return fileModel
          .promise()
          .always(_.bind(this._unblockActions, this))
          .done(function (fileUploadModel) {
            GlobalMessage.hideFileUploadProgress();
            GlobalMessage.showMessage('success', lang.MessageVersionAdded);
          });
    },

    _blockActions: function () {
      this.view && this.view.blockActions && this.view.blockActions();
    },

    _unblockActions: function () {
      this.view && this.view.unblockActions && this.view.unblockActions();
    }

  });

  return AddVersionController;

});
