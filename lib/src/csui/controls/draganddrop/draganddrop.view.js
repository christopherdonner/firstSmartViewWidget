/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  "csui/lib/backbone", "csui/utils/log", "i18n!csui/controls/draganddrop/impl/nls/lang",
  'csui/controls/globalmessage/globalmessage', 'csui/controls/fileupload/fileupload',
  "hbs!csui/controls/draganddrop/impl/draganddrop",
  "css!csui/controls/draganddrop/impl/draganddrop", 'csui/lib/jquery.when.all'
], function (module, $, _, Marionette, Backbone, log, lang, GlobalMessage,
    fileUploadHelper, template) {

  var config = _.defaults({}, module.config(), {
    detectLeaveDelay: 100
  });

  var DragAndDropView = Marionette.ItemView.extend({

    template: template,
    className: "csui-dropMessage",

    ui: {
      message: '.csui-messageBox'
    },

    templateHelpers: function () {
      return {
        message: this._getDropPossibleMessage()
      };
    },

    constructor: function DragAndDropView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);

      this.collection = options.collection;
      this.container = options.container;
      this.addableTypes = options.addableTypes;
      this.wantDragAndDrop = true;
      this.visible = false;
      this.listenTo(this.options.container, "change:name", this._restMessage);
    },

    setDragParentView: function (parentView, selector) {
      this.parentView = parentView;
      this._parentEl = _.isString(selector) && parentView.$(selector) ||
                       selector.length !== undefined && selector ||
                       selector && $(selector) ||
                       parentView.$el;
      this.render();
      this._parentEl.append(this.el);
      if (this.shouldDragAndDrop()) {
        this.disable();
        this._setDragEvents();
      }
      return true;
    },

    onDestroy: function () {
      if (this.shouldDragAndDrop()) {
        if (this._parentEl) {
          this._parentEl
              .off("dragover", this.dragOver)
              .off("dragleave", this.dragLeave)
              .off("drop", this.dragDrop);
        }
      }
    },

    _setDragEvents: function () {
      this.dragOver = _.bind(this.onOverView, this);
      this.dragLeave = _.bind(this.onLeaveView, this);
      this.dragDrop = _.bind(this.onDropView, this);
      this._parentEl
          .on("dragover", this.dragOver)
          .on("dragleave", this.dragLeave)
          .on("drop", this.dragDrop);
    },

    getSupportedSubType: function () {
      var supportedType = {
        type: 144,
        type_name: "Document"
      };
      return supportedType;
    },

    enable: function (triggerEvent) {
      if (!this.visible) {
        if (triggerEvent !== false) {
          this.trigger('drag:over');
        }
        this.$el.show();
        this.visible = true;
      }
      if (this.canAdd()) {
        var node = this.getSupportedSubType();
        this.options.addableType = node.type;
        this.options.addableTypeName = node.type_name;
      }
    },

    disable: function () {
      this.$el.hide();
      this.trigger('drag:leave');
      this.visible = false;
    },

    shouldDragAndDrop: function () {
      var browserSupported = false,
          sampleDiv        = document.createElement('div');
      if ((window.File && window.FileReader && window.FileList && window.Blob) &&
          (('draggable' in sampleDiv) ||
           ('ondragstart' in sampleDiv && 'ondrop' in sampleDiv))) {
        browserSupported = true;
      }

      return browserSupported && this.wantDragAndDrop;
    },

    canAdd: function () {
      return !this.addableTypes || !!this.addableTypes.get(144);
    },

    onOverView: function (currentEvent) {

      currentEvent.preventDefault();
      currentEvent.stopPropagation();

      if (this.leaveViewTimeout) {
        clearTimeout(this.leaveViewTimeout);
        this.leaveViewTimeout = undefined;
      }
      else {
        this.enable(false);
      }
      var dataTransfer   = currentEvent.originalEvent &&
                           currentEvent.originalEvent.dataTransfer,
          items          = dataTransfer.items,
          validItems     = items && items.length && _.all(items, function (item) {
                return item.kind === 'file';
              }),
          types          = dataTransfer && dataTransfer.types,
          validTypes     = types && types.length && _.any(types, function (type) {
                return type === 'Files';
              }),
          valid          = items && validItems || validTypes,
          invalidMessage = lang.dropInvalid;

      if (!this.canAdd()) {
        valid = false;
        invalidMessage = lang.dropNotPermitted;
      }

      if (valid) {
        if (this.$el.hasClass('csui-disabled')) {
          this._restMessage();
          this.$el.removeClass('csui-disabled');
        }
        this.trigger('drag:over', this, {disabled: false});
      } else {
        if (!this.$el.hasClass('csui-disabled')) {
          this.ui.message.text(invalidMessage);
          this.$el.addClass('csui-disabled');
        }
        this.trigger('drag:over', this, {disabled: true});
      }
    },

    onLeaveView: function (currentEvent) {
      currentEvent.preventDefault();
      currentEvent.stopPropagation();
      if (!this.leaveViewTimeout) {
        this.leaveViewTimeout = setTimeout(_.bind(function () {
          this.leaveViewTimeout = undefined;
          this.disable();
        }, this), config.detectLeaveDelay);
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
              if (self.canAdd()) {
                var fileUploadModel = fileUploadHelper.newUpload(
                    _.extend({
                      originatingView: self.parentView
                    }, _.clone(self.options)), self.options);
                fileUploadModel.addFilesToUpload(files, {
                  collection: self.collection
                });
              } else {
                var nodeName = self.container.get('name');
                GlobalMessage.showMessage('error', _.str.sformat(lang.addTypeDenied, nodeName));
              }
            } else {
              GlobalMessage.showMessage('error', lang.noFiles);
            }
          });
      this.disable();
    },

    _selectFiles: function (dataTransfer) {
      var filesFromItems = false,
          wrongEntries   = false,
          items          = dataTransfer.items,
          files          = items && items.length && _.chain(items)
                  .map(function (item) {
                    var entry  = item.webkitGetAsEntry && item.webkitGetAsEntry(),
                        isFile = entry && entry.isFile;
                    if (isFile) {
                      filesFromItems = true;
                      return item.getAsFile();
                    } else {
                      wrongEntries = true;
                    }
                  })
                  .compact()
                  .value() || dataTransfer.files;
      if (filesFromItems) {
        var resolveMethod = wrongEntries ? 'reject' : 'resolve';
        return $
            .Deferred()
            [resolveMethod](files)
            .promise();
      }
      files = dataTransfer.files;
      if (files) {
        return $.whenAll
            .apply($, _.map(files, checkFile))
            .then(function (results) {
              return results;
            }, function (files) {
              return $
                  .Deferred()
                  .reject(files)
                  .promise();
            });
      }
      return $
          .Deferred()
          .reject([])
          .promise();

      function checkFile(file) {
        var reader   = new FileReader(),
            deferred = $.Deferred(),
            aborted;
        reader.addEventListener('load', function () {
          deferred.resolve(file);
          aborted = true;
          reader.abort();
        });
        reader.addEventListener('error', function () {
          if (!aborted) {
            var error = new Error('No file');
            error.file = file;
            deferred.reject(error);
          }
        });
        reader.readAsArrayBuffer(file);
        return deferred.promise();
      }
    },

    _restMessage: function () {
      if (this._isRendered) {
        this.ui.message.text(this._getDropPossibleMessage());
      }
    },

    _getDropPossibleMessage: function () {
      var fileName = this.options.container.get('name'),
          message  = '';
      if (fileName) {
        message = _.str.sformat(lang.dropMessage, fileName);
      }
      return message;
    }

  });

  return DragAndDropView;

});
