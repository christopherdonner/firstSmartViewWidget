/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log', "i18n!csui/controls/fileupload/impl/nls/lang",
  'csui/controls/fileupload/impl/upload.controller',
  'csui/models/fileuploads', 'csui/controls/globalmessage/globalmessage',
  'csui/controls/conflict.resolver/conflict.resolver',
  'csui/dialogs/modal.alert/modal.alert', 'csui/utils/page.leaving.blocker'
], function (require, module, $, _, Backbone, log, lang, UploadController,
    UploadFileCollection, GlobalMessage, ConflictResolver, ModalAlert,
    PageLeavingBlocker) {
  'use strict';

  var FileUploadModel = Backbone.Model.extend({
    defaults: {
      parentCollection: null,
      container: null
    },

    constructor: function FileUploadModel(attributes, options) {
      attributes || (attributes = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      var container = this.container = this.get('container'),
          parentCollection = this.get('parentCollection');
      this.uploadFiles = new UploadFileCollection();
      this.controller = new UploadController({
        container: container
      });
      if (parentCollection) {
        this.originalCollectionUrl = parentCollection.url();
        this.listenTo(parentCollection, 'reset', this._stopCollectionUpdate); //stop collection update after a collection reset
        this.listenTo(parentCollection.node, 'request', this._stopCollectionUpdate); //stop collection update after node change
      }

      this._uploadCounts = {failed: 0, success: 0, complete: 0};
    },

    close: function () {
      this.onDestroy();
      this.trigger('destroy');
      return true;
    },

    onDestroy: function () {
      this.uploadView && this.uploadView.destroy();
      return true;
    },

    onUploadFileAdded: function (fileUpload) {
      fileUpload.promise()
          .done(_.bind(this.onFileUploadProcessed, this))
          .fail(_.bind(this.onFileUploadFailed, this));
    },

    addFilesToUpload: function (files, options) {
      var self = this;
      if (this._validateFileList(files)) {
        var originatingView = this.setBlocker();
        this.addFilesToUploadCollection(files, options);
        this.resolveNamingConflicts(options)
            .then(_.bind(this.checkAndHandleRequiredMetadata, this, options))
            .then(_.bind(this.addToUpload, this))
            .fail(function (args) {
              if (args) {
                if (args.error) {
                  GlobalMessage.showMessage('error', args.error.message);
                }
                else if (args.userAction && args.userAction === "cancelAddOneItemWithRequiredMetadata") {
                  self.trigger("metadata:cancelled");
                }
                else if (args.userAction && args.userAction === "closeMetadataActionView") {
                  self.trigger("metadata:closed");
                }
                else if (args.userAction && args.userAction === "cancelResolveNamingConflicts") {
                  self.trigger("resolve:naming:conflicts:cancelled");
                }
              }
            })
            .always(function () {
              if (originatingView) {
                originatingView.unblockActions();
              }
              self.close();
            });
        return true;
      }

      this.close();
      return false;
    },

    addFilesToUploadCollection: function (files, options) {
      _.each(files, function (file) {
        var parameters = file,
            container = parameters.container ||
                        options && options.container ||
                        this.container,
            collection = options && options.collection ||
                         this.get('parentCollection');
        parameters.file && (file = parameters.file);
        var newName = parameters.newName || file.newName;
        this.uploadFiles.add({
              file: file,
              newName: newName,
              name: newName || file.name,
              extended_data: parameters.data || {},
              collection: collection,
              subType: this.get('addableType')
            },
            {
              container: container,
              connector: container.connector,
              enforcedRequiredAttrs: true
            });
      }, this);
    },

    setBlocker: function () {
      var originatingView = this.get('originatingView');
      if (!(originatingView && originatingView.blockActions)) {
        originatingView = undefined;
      }
      if (originatingView) {
        originatingView.blockActions();
      }
      return originatingView;
    },

    resolveNamingConflicts: function (options) {
      var uploadCollection = this.uploadFiles;
      var h1 = uploadCollection.length === 1 ? lang.uploadCount : lang.uploadCounts,
          conflictResolver = new ConflictResolver({
            h1Label: _.str.sformat(h1, uploadCollection.length),
            container: options && options.container || this.container,
            files: uploadCollection
          });
      return conflictResolver.run();
    },

    _validateFileList: function (files) {
      if (!files || files.length === 0) {
        log.debug("No upload files selected")
        && console.log(log.last);
        return false;
      }
      var firstFile = files[0],
          name = firstFile.name || firstFile.file && firstFile.file.name ||
                 firstFile.get && firstFile.get('name');
      if (!name) {
        GlobalMessage.showMessage('error', lang.invalidFileList);
        return false;
      }
      return true;
    },

    checkAndHandleRequiredMetadata: function (options, fileCollection) {
      var self = this,
          deferred = $.Deferred();
      require(['csui/widgets/metadata/metadata.add.document.controller'
      ], function (MetadataAddDocumentController) {
        var metadataController = new MetadataAddDocumentController();
        metadataController
            .addItemsRequiredMetadata(fileCollection, {
              container: options && options.container || self.container,
              addableType: 144,
              context: self.get('context')
            })
            .then(function () {
              return fileCollection;
            })
            .done(deferred.resolve)
            .fail(deferred.reject);
      }, function (error) {
        log.warn('Failed to load MetadataAddDocumentController. {0}', error)
        && console.warn(log.last);
        deferred.reject(error);
      });
      return deferred.promise();
    },

    addToUpload: function (files) {
      if (files && files.length > 0) {
        var fileAdded;
        _.each(files.models, function (file) {
          if (!file.get('id') || file.get('newName') || file.get('newVersion')) {
            var name = file.get('newName') || file.get('file').name;
            file.set('mime_type', file.get('file').type);
            log.debug("Object was added - {0}", name)
            && console.log(log.last);
            if (!fileAdded) {
              fileAdded = true;
              var pageLeavingWarning = this.get('pageLeavingWarning') ||
                                       lang.pageLeavingWarning;
              PageLeavingBlocker.enable(pageLeavingWarning);
            }
            this.controller.scheduleFileForUpload(file);
            this.onUploadFileAdded(file);
          }
          else {
            log.debug("Object was skipped - {0}", file.name);
          }
        }, this);
      }
      else {
        log.debug("No files were upload. All have naming conflict")
        && console.log(log.last);
      }

      this.showProgress(files);
    },

    onFileUploadProcessed: function (file) {
      if (!this.stopParentUpdate) {
        var collection = file.get('collection'),
            parentCollection = this.get('parentCollection');
        collection || (collection = parentCollection);
        if (collection !== parentCollection ||
            parentCollection && parentCollection.url() == this.originalCollectionUrl) {
          var newFile = !file.get('newVersion');
          if (newFile) {
            file.node.isLocallyCreated = true;
            collection.unshift(file.node);
            $(".csui-new-item").closest("tbody").scrollTop(0);
          }
        }
      }
      this._increaseUploadCount('success');
    },

    onFileUploadFailed: function (file, errorMsg) {
      this._increaseUploadCount('failed');
    },

    showProgress: function (files) {
      this.uploadView && this.uploadView.destroy();
      var options = {
        originatingView: this.get('originatingView')
      };
      GlobalMessage.showFileUploadProgress(files, options);
    },

    _stopCollectionUpdate: function () {
      this.stopParentUpdate = false;
    },

    _increaseUploadCount: function (status) {
      var totalUpload = this.uploadFiles.length,
          uploadCounts = this._uploadCounts;

      if (status === 'failed') {
        uploadCounts.failed++;
      }
      else {
        uploadCounts.success++;
      }

      if (++(uploadCounts.complete) === totalUpload) {
        PageLeavingBlocker.disable();
        if (uploadCounts.failed === 0) {
          GlobalMessage.hideFileUploadProgress();
          var langMessage = (totalUpload === 1) ? lang.OneFileSuccessfullyUploaded :
                            lang.AllFilesSuccessfullyUploaded;
          GlobalMessage.showMessage("success",
              _.str.sformat(langMessage, totalUpload));
        }
      }

      this.close();
    }

  });

  var FileUploadCollection = Backbone.Collection.extend({
    model: FileUploadModel
  });

  return FileUploadCollection;

});
