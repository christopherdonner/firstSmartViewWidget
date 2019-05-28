/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/base',
  'csui/utils/log',
  'i18n!csui/controls/table/inlineforms/inlineform/impl/nls/lang',
  "csui/lib/marionette",
  'csui/models/nodechildren',
  'csui/utils/commands/add.item.metadata',
  'csui/utils/commands/properties',
  'csui/models/nodes',
  'csui/utils/commandhelper',
  'csui/behaviors/keyboard.navigation/tabkey.behavior',
  'csui/lib/jsonpath',
  'css!csui/controls/table/inlineforms/inlineform/impl/inlineform'
], function ($,
    _,
    base,
    log,
    lang,
    Marionette,
    NodeChildrenCollection,
    AddItemMetadataCommand,
    PropertiesCommand,
    NodeCollection,
    CommandHelper,
    TabKeyBehavior, jsonPath) {

  var InlineFormView = Marionette.ItemView.extend({

        className: "csui-inlineform",

        ui: {
          inputFieldName: '.csui-inlineform-input-name',
          cancelButton: '.csui-btn-cancel',
          editCancelButton: '.csui-btn-edit-cancel',
          saveButton: '.csui-btn-save',
          metadataButton: '.csui-btn-metadata'
        },

        events: {
          'keyup @ui.inputFieldName': 'keyReleased',
          'paste @ui.inputFieldName': 'mouseRightCicked',
          'cut @ui.inputFieldName': 'mouseRightCicked',
          'focusin @ui.inputFieldName': 'onFocusInWrite',
          'keydown @ui.editCancelButton': 'cancelEditKeyPressed',
          'submit form': "saveClicked",
          'click @ui.saveButton': 'saveClicked',
          'click @ui.cancelButton': 'cancelClicked',
          'click @ui.editCancelButton': 'cancelClicked',
          'click @ui.metadataButton': _.debounce(function (event) {
            this.metadataIconClicked(event);
          }, 500),
          'keydown': 'onKeyInView'
        },

        behaviors: {
          TabKeyBehavior: {
            behaviorClass: TabKeyBehavior
          }
        },

        _templateHelpers: function () {
          var errorMessage   = this.model.get('csuiInlineFormErrorMessage'),
              disableSavebtn = false,
              objType        = this.model.get("type");
          disableSavebtn = !(!!this.model.get("name"));

          disableSavebtn = disableSavebtn || this.checkCustomFieldsModel();

          var data = {
            name: this.model.get('name'),
            EditCancelTooltip: lang.EditCancelTooltip,
            CancelButtonLabel: lang.CancelButtonLabel,
            disableSavebtn: disableSavebtn,
            SaveButtonLabel: this._isEditMode() ? lang.SaveButtonLabel :
                             lang.AddButtonLabel,
            formModeIsEdit: this._isEditMode(),
            haveErrorMessage: errorMessage ? true : false,
            extendedAdd: lang.ExtendedAdd,
            extendedAddAria: lang.ExtendedAddAria
          };
          if (data.haveErrorMessage) {
            data.errorMessage = errorMessage;
          }
          return data;
        },

        constructor: function InlineFormView(options) {
          this.options = options || {};
          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },

        onDomRefresh: function () {
          this.refershTabableElements();
          var errorMessage = this.model.get('csuiInlineFormErrorMessage');
          !!this.tabableElements && !!this.tabableElements[0] && this.tabableElements[0].focus();
          if (this.ui.metadataButton.length) {
            this.ui.metadataButton.attr('title', this.options.ExtendedAdd || lang.ExtendedAdd);
            this.ui.metadataButton.attr('aria-label',
                this.options.ExtendedAddAria || lang.ExtendedAddAria);
            if (this.options.AriaHasPopUp === undefined) {
              this.ui.metadataButton.attr('aria-haspopup', true);
            } else {
              this.ui.metadataButton.attr('aria-haspopup', this.options.AriaHasPopUp);
            }
          }
          !!errorMessage && this.addInlineRole(errorMessage);
        },

        cancelClicked: function (event) {
          event.preventDefault();
          event.stopPropagation();
          this.cancel();
        },

        onKeyInView: function (event) {
          this.clearInlineRole();
          if (event.keyCode === 9) {
            this._moveTab(event);
            return true;
          }
        },

        refershTabableElements: function () {
          this.tabableElements = this.$el.find('input:not([disabled]),  button:not([disabled])').filter(
              ':visible').toArray();
        },

        _moveTab: function (event) {
          this.currentlyFocusedElementIndex = this.tabableElements.indexOf(event.target);
          if (event.shiftKey) {
            if (this.currentlyFocusedElementIndex > 0) {
              this.currentlyFocusedElementIndex -= 1;
              $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
            } else {
              this.currentlyFocusedElementIndex = this.tabableElements.length - 1;
              $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
            }
          } else {
            if (this.currentlyFocusedElementIndex < this.tabableElements.length - 1) {
              this.currentlyFocusedElementIndex += 1;
              $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
            } else {
              this.currentlyFocusedElementIndex = 0;
              $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
            }
          }
          event.stopPropagation();
          event.preventDefault();
        },

        saveClicked: function (event) {
          event.preventDefault();
          event.stopPropagation();
          this.clearInlineRole();
          if (!!this.model.get('id')) { // in edit mode
            this._saveIfOk();
          } else { // in create mode
            var self = this;
            self.required = false;
            self._getCategoryID().done(function () { // return true if required fields found in container
              if (self.required) {
                self._openMetadataPage();
              } else {
                self._saveIfOk();
              }
            });
          }
        },

        _getCategoryID: function () {
          var self           = this,
              nId            = self.options.model.collection.node.get('id'),
              type           = this.model.get('type'),
              connector      = self.options.model.connector,
              fullUrl        = connector.connection.url + '/forms/nodes/create?parent_id=' + nId +
                               '&type=' +
                               type,
              deferredObject = $.Deferred(),
              ajaxOptions    = {
                type: 'GET',
                url: fullUrl
              },
              that           = this;
          connector.extendAjaxOptions(ajaxOptions);
          var xhr = $.ajax(ajaxOptions).done(_.bind(function (resp) {

            _.any(resp["forms"], function (form) {
              if (form.role_name == 'categories') {
                var requiredFilled = self._checkForAlpacaRequiredFields(form),
                    reqFields      = jsonPath(form.schema.properties, "$..[?(@.required===true)]");
                if (_.isArray(reqFields) && reqFields.length > 0 && !requiredFilled) {
                  self.required = true;

                }

              }
            });

            self.model.attributes.forms = resp;
            self.model.attributes.xhr = xhr;

            deferredObject.resolve();
          })).fail(function (resp) {
            deferredObject.reject();
          });
          return deferredObject.promise();
        },
        _checkForAlpacaRequiredFields: function (form) {
          var valid             = true,
              data              = form.data || form.get('data'),
              options           = form.options || form.get('options'),
              schema            = form.schema || form.get('schema'),
              reqArray          = [],
              requiredFields    = jsonPath(schema, "$..[?(@.required===true)]", {resultType: "PATH"}),
              nonValidateFields = jsonPath(options, "$..[?(@.validate===false)]", {resultType: "PATH"});
          var nonValidateFieldsIds = [];
          _.each(nonValidateFields, function (nvField) {
            var matches = nvField.toString().match(/(\'[\w]*\')/g);
            if (!!matches) {
              nonValidateFieldsIds.push(matches[matches.length - 1].replace(/'/g, ""));
            }
          });
          var reqFieldId = [];
          _.each(requiredFields, function (reqField) {
            var matches = reqField.toString().match(/(\'[\w]*\')/g);
            if (!!matches) {
              reqFieldId.push(matches[matches.length - 1].replace(/'/g, ""));
            }
          });
          var removeNonValidateFields = function (nvFields, rFields) {
            var rFields_ = nvFields.filter(function (n) {
              return rFields.indexOf(n) != -1;
            });
            return rFields_.length > 0 ? rFields_ : rFields;
          };

          var filteredRequiredFieldsIds = removeNonValidateFields(nonValidateFieldsIds, reqFieldId);

          if (!!filteredRequiredFieldsIds) {
            var nullCount = false;
            _.each(filteredRequiredFieldsIds, function (arrayElement) {
              reqArray = jsonPath(data, "$.." + arrayElement.toString(), {resultType: "PATH"}.toArray);
              _.each(reqArray, function (arrayElement) {
                var checkNull = function (element) {
                  if (element instanceof Array && (element !== null || element !== "")) {
                    _.each(element, function (childElement) {
                      checkNull(childElement);
                    });
                  } else if (element === null || element === "") {
                    nullCount = true;
                    return;
                  }
                };
                if (!nullCount) {
                  checkNull(arrayElement);
                } else {
                  valid = false;
                  return;
                }
              });
              if (nullCount) {
                valid = false;
                return;
              }
            });
          }

          return valid;
        },
        _openMetadataPage: function () {

          var MN = '{0}:metadataIconClicked {1}';

          var self = this;
          self.viewToModelData();
          var nodes = new NodeCollection();
          nodes.push(self.options.model);

          var status = {
            nodes: nodes,
            container: self.options.model.collection.node,
            collection: self.options.model.collection
          };

          var options = {context: self.options.context};

          options = _.extend(options, {
            addableType: self.constructor.CSSubType // get subtype from static property
          });
          var addItemMetadataCmd = new AddItemMetadataCommand();
          addItemMetadataCmd.execute(status, options)
              .then(function (args) {
                delete self.model.inlineFormView;
                self.model.unset('csuiInlineFormErrorMessage', {silent: true});
                self.trigger('editEnded', this);
                if (args.name) {
                  return self.model.fetch();
                }
              }).fail(function (err) {
            self.cancel();
          });

        },

        cancelEditKeyPressed: function (event) {
          this.clearInlineRole();
          if (event.keyCode === 9) {  // tab key
            if (!event.shiftKey) {
              event.preventDefault();
              event.stopPropagation();
              this._saveIfOk();
            }
          }
        },

        onFocusInWrite: function (event) {
          var currentInputElement    = $(event.target)[0],
              currentInputElementVal = currentInputElement.value,
              selEnd                 = !!currentInputElementVal ? currentInputElementVal.length : 0;
          if (this.model.get("type") === 144 && currentInputElementVal.lastIndexOf('.') > 0 &&
              currentInputElementVal.lastIndexOf('.') < currentInputElementVal.length - 1) {
            selEnd = currentInputElementVal.lastIndexOf('.');
          }
          currentInputElement.selectionEnd = selEnd;
        },

        toggleButton: function (event) {
          if (this.ui.saveButton.length) {
            var currentInputElementVal = this.ui.inputFieldName.val().trim(),
                enableAddButton        = false;
            enableAddButton = currentInputElementVal.length !== 0;

            enableAddButton = enableAddButton && this.checkCustomFieldsInputVal();

            if (enableAddButton) {
              this.ui.saveButton.removeAttr("disabled").addClass("binf-btn-default");
            } else {
              this.ui.saveButton.attr("disabled", "disabled").removeClass("binf-btn-default");
            }
          }
          this.refershTabableElements();
        },
        checkCustomFieldsModel: function () {
          return false;
        },
        checkCustomFieldsInputVal: function () {
          return true;
        },

        mouseRightCicked: function (event) {
          this.clearInlineRole();
          var that = this;
          setTimeout(function () {
            that.toggleButton(event);
          }, 100);
        },

        keyReleased: function (event) {
          if (this.leftInputFieldTimer) {
            clearTimeout(this.leftInputFieldTimer);
          }

          if (event.keyCode === 27) {  // escape key
            this.cancel();
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          this.toggleButton(event);
        },

        cancel: function (options) {
          options || (options = {});
          this.destroy();
          if (this.model.get('id') === undefined) {
            this.model.destroy();
          } else {
            delete this.model.inlineFormView;
            this.model.set('csuiInlineFormErrorMessage', 'dummy', {silent: true});
            this.model.unset('csuiInlineFormErrorMessage', {silent: options.silent});
          }
        },

        _isEditMode: function () {
          return this.model.get('id') !== undefined;
        },
        viewToModelData: function () {
          this._viewToModelData();
          this._viewToModelDataExtended();
        },
        _viewToModelData: function () {
          this.model.set('name', this._getInputName(), {silent: true});
        },
        _viewToModelDataExtended: function () {
        },

        _getInputName: function () {
          var elInput = this.ui.inputFieldName;
          var name = elInput.val();
          name = name.trim();
          return name;
        },

        _saveIfOk: function () {
        },

        _save: function (attributes) {
          var blockableView = this.options.originatingView;
          if (blockableView && blockableView.blockActions) {
            blockableView.blockActions();
          }
          var method  = this.model.get('id') === undefined ?
                        '_saveNewModel' : '_updateModel',
              promise = this[method](attributes);
          if (blockableView && blockableView.unblockActions) {
            promise.always(_.bind(blockableView.unblockActions, blockableView));
          }
          promise.done(_.bind(this.destroy, this));
          return promise;
        },

        _updateModel: function (attributes) {
          var MN = '{0}:_updateModel {1}';
          var inlineForm = this.model.inlineFormView; // save in case the sync fails
          delete this.model.inlineFormView; // let row render normally when model changes after save
          var data = this.model.mustRefreshAfterPut !== false ? attributes : undefined;
          var saveAttr = this.model.mustRefreshAfterPut !== false ? undefined : attributes;

          var self = this,
              isThumbnailView = self.options.originatingView && self.options.originatingView.thumbnailView;
          return this.model
              .save(saveAttr, {
                data: data,
                patch: true,  // let form data be 'body:{"name":"Pictures"}' and uploadable
                wait: true,
                silent: true,
                skipSetValue: isThumbnailView // to stop re-rendering entire thumbnail item
              })
              .then(function () {
                self.model.set(attributes, {silent: true});
                if (self.model.mustRefreshAfterPut !== false) {
                  return self.model.fetch();
                }
                self.model.set('csuiInlineFormErrorMessage', 'dummy', {silent: true});
                self.model.unset('csuiInlineFormErrorMessage'); // this lets the model be
              })
              .fail(function (err) {
                self.model.inlineFormView = inlineForm; // use the form again
                var attributeKeys = _.keys(attributes);
                var cloneAttributes = _.pick(_.clone(self.model.attributes), attributeKeys);
                self.model.set(attributes, {silent: true});
                var errorMessage = self._getErrorMessageFromResponse(err);
                self.model.set('csuiInlineFormErrorMessage', errorMessage);
                log.error('Saving failed. ', errorMessage) && console.error(log.last);
                self.model.set(cloneAttributes, {silent: true});
              });
        },

        _saveNewModel: function (attributes) {
          var MN = '{0}:_saveNewModel {1}';
          var inlineForm = this.model.inlineFormView; // save in case the save fails
          delete this.model.inlineFormView; // let row render normally when model changes after save

          this.model.set(attributes, {silent: true});
          var data = _.clone(this.model.attributes);
          delete data.hasMetadataRow;
          delete data.csuiInlineFormErrorMessage;
          var self = this;
          return this.model
              .save(undefined, {
                data: data,
                wait: true,
                silent: true
              })
              .then(function () {
                if (self.model.mustRefreshAfterPut !== false) {
                  return self.model.fetch();
                }
                self.model.set('csuiInlineFormErrorMessage', 'dummy', {silent: true});
                self.model.unset('csuiInlineFormErrorMessage'); // this lets the model be
              })
              .fail(function (err) {
                self.model.inlineFormView = inlineForm; // use the form again
                self.model.trigger('error', self.model); // need sync for blocking view
                var errorMessage = self._getErrorMessageFromResponse(err);
                self.model.set('csuiInlineFormErrorMessage', errorMessage);
                log.error('Saving failed. ', errorMessage) && console.error(log.last);
              });
        },

        _getErrorMessageFromResponse: function (err) {
          var errorMessage;
          if (err && err.responseJSON && err.responseJSON.error) {
            errorMessage = err.responseJSON.error;
          } else {
            var errorHtml = base.MessageHelper.toHtml();
            base.MessageHelper.reset();
            errorMessage = $(errorHtml).text();
          }
          return errorMessage;
        },

        metadataIconClicked: function (event) {
          var MN = '{0}:metadataIconClicked {1}';
          event.preventDefault();
          event.stopPropagation();
          this.clearInlineRole();
          this.viewToModelData();

          var self = this;
          var nodes = new NodeCollection();
          nodes.push(this.model);
          var status = {
            nodes: nodes,
            container: this.model.collection.node,
            collection: this.model.collection
          };
          var options = {context: this.options.context};
          if (this.model.get('id') === undefined) {
            options = _.extend(options, {
              addableType: this.constructor.CSSubType // get subtype from static property
            });

            var addItemMetadataCmd = new AddItemMetadataCommand();
            addItemMetadataCmd.execute(status, options)
                .then(function (args) {
                  delete self.model.inlineFormView;
                  self.model.unset('csuiInlineFormErrorMessage', {silent: true});
                  self.trigger('editEnded', this);
                  if (args.name) {
                    return self.model.fetch();
                  }
                }).done(function () {
                  self.options.originatingView.$el.find(
                      '.csui-nodetable .csui-new-item a.csui-table-cell-name-value').first().focus();
                })
                .fail(function (err) {
                  self.cancel();
                  self.options.originatingView.$el.find(
                      '.csui-addToolbar .binf-dropdown-toggle').focus();
                });

          } else {
            status = _.extend(status, {originatingView: this.options.originatingView});
            var propertiesCmd = new PropertiesCommand();
            propertiesCmd.execute(status, options)
                .always(function (args) {
                  self.cancel();
                });
          }
        },

        addInlineRole: function (errorMessage) {
          this.ui.inputFieldName.attr('title', lang.ActionFailedMessage + errorMessage);
          this.ui.inputFieldName.attr('role', 'alert');
        },

        clearInlineRole: function () {
          var errorMessage = !!this.model.get('csuiInlineFormErrorMessage');
          if (errorMessage) {
            this.ui.inputFieldName.attr('title', '');
            this.ui.inputFieldName.removeAttr('role');
          }
        },

      },
      {
        CSSubType: undefined  // Content Server Subtype of this base class is undefined
      }
  );

  return InlineFormView;

});
