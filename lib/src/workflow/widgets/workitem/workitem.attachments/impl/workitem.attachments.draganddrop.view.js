/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/draganddrop/draganddrop.view',
  'csui/controls/fileupload/fileupload',
  'csui/controls/globalmessage/globalmessage',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (_, Marionette, DragAndDrop, fileUploadHelper, GlobalMessage, lang) {
  'use strict';
  var WorkItemDragDropView = DragAndDrop.extend({
    constructor: function WorkItemDragDropView(options) {
      DragAndDrop.prototype.constructor.call(this, options);
    },
    templateHelpers: function () {
      var messages = DragAndDrop.prototype.templateHelpers.apply(this, arguments),
          dropMsg  = lang.DropMessage;
      if (messages.message !== undefined && messages.message !== "") {
        messages.message = dropMsg;
        return {
          message: messages.message
        };
      }
      else {
        return {
          message: dropMsg
        };
      }
    },
    onDropView: function (currentEvent) {
      currentEvent.preventDefault();
      currentEvent.stopPropagation();
      var self         = this,
          dataTransfer = currentEvent.originalEvent &&
                         currentEvent.originalEvent.dataTransfer ||
              {
                files: currentEvent.originalEvent &&
                       currentEvent.originalEvent.target &&
                       currentEvent.originalEvent.target.files || []
              };
      this._selectFiles(dataTransfer)
          .always(function (files) {
            files = _.reject(files, function (file) {
              return file instanceof Error;
            });
            if (files.length) {
              if (files.length === 1) {
                self.collection.singleFileUpload = true;
              }
              if (self.canAdd()) {
                var fileUploadModel = fileUploadHelper.newUpload(
                    _.extend({
                      originatingView: self.parentView
                    }, _.clone(self.options))
                );
                fileUploadModel.addFilesToUpload(files, {
                  collection: self.collection
                });
              } else {
                var nodeName = self.container.get('name');
                GlobalMessage.showMessage('error',
                    lang.AddTypeDenied.replace('{1}', nodeName));
              }
            } else {
              GlobalMessage.showMessage('error', lang.NoFiles);
            }
          });
      this.disable();

    }
  });
  return WorkItemDragDropView;
});
