/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
      'csui/lib/backbone', 'csui/lib/marionette',
      'csui/models/node/node.model',
      'csui/utils/contexts/factories/node',
      'csui/controls/form/fields/nodepickerfield.view',
      'csui/behaviors/default.action/default.action.behavior',
      'csui/dialogs/node.picker/node.picker',
      'i18n!csui/controls/form/impl/nls/lang',
      'workflow/controls/breadcrumbs/breadcrumbs.view',
      'hbs!workflow/controls/form/impl/fields/itempicker/itempicker',
      'i18n!workflow/controls/form/impl/nls/lang',
      'css!workflow/controls/form/impl/fields/itempicker/itempicker'
    ], function (_, $, Backbone, Marionette, NodeModel, NodeModelFactory, NodePickerFieldView,
        DefaultActionBehavior, NodePicker, langFormcsui,
        BreadcrumbsView, template, lang) {
      'use strict';

      var ItemPickerFieldView = NodePickerFieldView.extend({
        template: template,
        templateHelpers: function () {
          var multiFieldLabel        = "",
              data                   = langFormcsui.noValue,
              readModeAria           = "", // better default value?
              readModeMultiFieldAria = "", // better default value?;
              isRequired             = false,
              isReadOnly             = this.mode === "readonly",
              requiredTxt            = "",
              toggleAria             = "",
              isMultiField           = false;

          isRequired = this.options.alpacaField && this.options.alpacaField.isRequired();
          requiredTxt = isRequired ? langFormcsui.requiredField : "";
          if (this.ancestors.pluck('name').length > 0) {
            var ancestors = this.ancestors.pluck('name');
            data = ancestors[ancestors.length - 1];
          }

          if (this.node.get('nodeError')) {
            data = lang.originalNodeUnavailable;
          }

          if (this.alpacaField && this.alpacaField.options &&
              this.alpacaField.options.isMultiFieldItem) {
            multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                              this.alpacaField.parent.options.label : "";
            isMultiField = this.alpacaField.options.isMultiFieldItem;
          }
          if (isMultiField) {
            readModeMultiFieldAria = isReadOnly ?
                                     langFormcsui.fieldReadOnlyAria.replace('{0}',
                                         multiFieldLabel).replace('{1}',
                                         data) + requiredTxt :
                                     lang.fieldEditAria.replace('{0}',
                                         multiFieldLabel).replace(
                                         '{1}',
                                         data) + requiredTxt;
            toggleAria = lang.toggleTitle.replace('{0}', multiFieldLabel);
          }
          else {
            if ((this.model.get('options')) && (this.model.get('options').label)) {
              readModeAria = isReadOnly ? langFormcsui.fieldReadOnlyAria.replace('{0}',
                  this.model.get('options').label).replace('{1}', data) +
                                          requiredTxt :
                             lang.fieldEditAria.replace('{0}',
                                 this.model.get('options').label).replace(
                                 '{1}', data) + requiredTxt;
              toggleAria = lang.toggleTitle.replace('{0}', this.model.get('options').label);
            }
          }

          return {
            inputType: 'text',
            idBtnLabel: this.options.labelId,
            ariaDescribedById: _.uniqueId("id_"),
            fieldWriteDescribedByAria: lang.fieldWriteDescribedByAria,
            readModeAria: readModeAria,
            readModeMultiFieldAria: readModeMultiFieldAria,
            multiFieldLabel: multiFieldLabel,
            browse: lang.browse,
            remove: lang.remove,
            cancel: lang.cancel,
            toggleTitle: toggleAria,
            edit: lang.edit
          };
        },

        ui: {
          readArea: '.cs-field-read',
          readField: '.cs-field-read .item-reference-link',
          writeArea: '.cs-field-write',
          writeField: '.cs-field-write input',
          anchor: '.cs-field-read a',
          more: '.inline-edit-more-button',
          buttonMore: '.inline-edit-more-button',
          breadCrumbs: '.breadcrumb-inner',
          clear: '.inline-clear-itempicker-button',
          errMsg: '.item-reference-error-msg',
          writeBrowseButton: '.cs-field-write .invoke-picker',
          cancelIcon: '.edit-cancel',
          browseButton: '.invoke-picker',
          placeHolder: 'span.placeholder',
          placeHolderButton: 'button.itempicker'
        },
        events: {
          'focusin @ui.anchor': 'onFocusInAnchor',
          'focusin @ui.writeField': 'onFocusInWriteField',
          'mousedown @ui.writeField': 'onClickWriteField',
          'keydown @ui.writeField': 'onKeydownWriteField',
          'keydown @ui.writeArea': 'onKeydownWriteArea',
          'click @ui.browseButton': 'onClickBrowse',
          'keydown @ui.browseButton': 'onKeydownBrowse',
          'click @ui.anchor': 'onClickButton',
          'keydown @ui.anchor': 'onKeydownButton',
          'click @ui.more': 'onClickMore',
          'keydown @ui.buttonMore': 'onKeydownMore',
          'click @ui.clear': 'clearFieldvalue',
          'keydown @ui.clear': 'clearFieldvalueKeydown',
          'mousedown @ui.writeBrowseButton, @ui.clear ': 'onMouseDownWriteElements',
          'click @ui.cancelIcon': 'onCancelClicked',
          'click @ui.placeHolder': 'onClickPlaceHolder',
          'keypress @ui.placeHolderButton': 'onKeypressPlaceHolder',
          'keydown @ui.placeHolderButton': 'onKeydownPlaceHolder'
        },

        onFocusInWriteField: function (event) {
          this.changedKey = false;
        },

        onClickPlaceHolder: function (event) {
          event.preventDefault();
          event.stopPropagation();
        },

        onKeydownPlaceHolder: function (event) {
          if ((event.keyCode === 32) && !(this.alpacaField.options.isMultiFieldItem)) {
            event.preventDefault();
            event.stopPropagation();
          }
        },

        onKeypressPlaceHolder: function (event) {
          if (((event.keyCode === 13) || (event.keyCode === 32)) &&
              !(this.alpacaField.options.isMultiFieldItem)) {
            event.preventDefault();
            event.stopPropagation();
            if (event.keyCode === 13) {
              if (this.getStatesBehavior().isStateRead()) {
                event.preventDefault();
                event.stopPropagation();
                this.getEditableBehavior().setViewStateWriteAndEnterEditMode();
              }
            }
          }
        },
        onKeyPress: function (event) {
        },
        allowEditOnEnter: function () {
          return true;
        },

        onMouseDownWriteElements: function (e) {
          this._isReadyToSave = false;
        },
        onKeydownButton: function (event) {
          var formView = this.options.formView;
          if (event.keyCode === 32) {
            event.preventDefault();
            event.stopPropagation();
            this.onClickButton(event);
          }
          if ((event.keyCode === 13) && !(this.alpacaField.options.isMultiFieldItem)) {
            if (this.getStatesBehavior().isStateRead()) {
              event.preventDefault();
              event.stopPropagation();
              this.getEditableBehavior().setViewStateWriteAndEnterEditMode();
            }
          }
          if ((event.keyCode === 13) && (this.alpacaField.options.isMultiFieldItem) &&
              (formView.mode === 'create') && (this.getStatesBehavior().isStateRead())) {
            event.preventDefault();
            event.stopPropagation();
          }
        },
        onKeydownWriteField: function (event) {
          if ((event.keyCode === 13) || (event.keyCode === 113)) {
            this.changedKey = true;
          }
          else if (event.keyCode === 27) {
            this.onCancelClicked(event);
          }
          else if (event.keyCode === 32) {
            event.preventDefault();
            event.stopPropagation();
            this.onClickWriteField(event);
          }
          else if (event.keyCode !== 9) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
        ,
        onKeydownWriteArea: function (event) {
          if (event.keyCode === 113) {
            this.changedKey = true;
          }
          if (event.keyCode === 27) {
            this.onCancelClicked(event);
          }
        }
        ,

        onKeydownBrowse: function (event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.onClickBrowse(event);
          }
        }
        ,

        onClickBrowse: function (event) {
          this._isReadyToSave = true;
          event.preventDefault();
          this.$el.find("#" + this.model.get('id')).focus();
          this._showNodePicker();
        }
        ,

        clearFieldvalueKeydown: function (event) {
          if (event.keyCode === 13) {
            this.clearFieldvalue(event);
          }
        }
        ,

        clearFieldvalue: function (event) {
          this._isReadyToSave = true;
          this.ui.writeField.val("");
          this.clearField = true;
          this.editVal = "";
          event.preventDefault();
          event.stopPropagation();
          this.ui.writeField.focus();
        }
        ,
        onClickButton: function (event) {
          event.preventDefault();
          var formView = this.options.formView;
          if (formView.mode !== 'create' && this.node.get('id')) {
            this.triggerMethod('execute:defaultAction', this.node);
          }
          if (formView.mode === 'create' && this.node.get('id') &&
              this.getStatesBehavior().isStateRead()) {
            this.triggerMethod('execute:defaultAction', this.node);
          }
        }
        ,

        setStateRead: function (validate, focus) {

          if (this.fieldsave) {
            this.fieldsave = undefined;
            if (this.$el.parents(".binf-form-group.alpaca-field") &&
                this.$el.parents(".binf-form-group.alpaca-field").find(".alpaca-message")) {
              this.$el.parents(".binf-form-group.alpaca-field").find(".alpaca-message").val("");
            }
            if (this.$el.hasClass('cs-formfield-invalid')) {
              this.$el.removeClass('cs-formfield-invalid');
            }

            if (this.newNode) {
              this.node.set(this.newNode.attributes);
              this.newNode = undefined;
              this.clearField = undefined;
            }
            if (this.clearField) {
              this.clearField = undefined;
              if (this.setValue(null, true)) {
                this.node.clear();
                this.ancestors._reset();

                this._renderNode();
              }
            }

          }
          else {
            if (this.ui.errMsg.hasClass('binf-hidden')) {
              this.ui.errMsg.removeClass('binf-hidden');

            }
            this.ui.writeArea.addClass('binf-hidden');
            this.ui.readArea.removeClass('binf-hidden');

            this.setValue(this.curVal, validate);
          }
          return false;
        }
        ,
        setStateWrite: function (validate, focus) {
          if (!this.ui.breadCrumbs.hasClass('binf-hidden')) {
            this.ui.breadCrumbs.addClass('binf-hidden');
            this.ui.more.attr('aria-expanded', 'false');
          }
          if (!this.ui.errMsg.hasClass('binf-hidden')) {
            this.ui.errMsg.addClass('binf-hidden');
          }
          if (this.getStatesBehavior().isWriteOnly() || this.getStatesBehavior().isStateWrite()) {
            this.ui.readArea.addClass('binf-hidden');
            this.ui.writeArea.removeClass('binf-hidden');
          } else {
            this._showNodePicker();
          }
          this.setValue(this.curVal, validate);
          this.ui.browseButton.focus();
          return true;
        }
        ,

        onKeydownMore: function (event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.showHideBreadcrumbs();
          }
        }
        ,

        showHideBreadcrumbs: function () {
          this.breadcrumbs = new BreadcrumbsView({
            context: this.options.context,
            collection: this.ancestors,
            node: this.ancestors.node
          });
          this.listenTo(this.breadcrumbs.completeCollection, 'sync', this.breadcrumbsChanged);
          this.listenTo(this.breadcrumbs, 'after:synchronized', this.onAfterBreadcrumbsSynchronized);

          var collections = this.ancestors;
          collections.unbind('sync');
          this.breadcrumbs.updateCompleteCollection(collections);

          var breadcrumbds = new
              Marionette.Region({el: '.breadcrumb-inner.id-' + this.id});

          breadcrumbds.show(this.breadcrumbs);
          if (this.ui.breadCrumbs.hasClass('binf-hidden')) {
            this.ui.breadCrumbs.removeClass('binf-hidden');
            this.ui.more.attr('aria-expanded', 'true');
          } else {
            this.ui.breadCrumbs.addClass('binf-hidden');
            this.ui.more.attr('aria-expanded', 'false');
          }
        }
        ,

        onClickMore: function (event) {
          event.preventDefault();
          this.showHideBreadcrumbs();
        }
        ,

        onAfterBreadcrumbsSynchronized: function () {
          this.breadcrumbs._shrinkToFit(0.8 * this.$el.find(".breadcrumb-inner").outerWidth());
        }
        ,
        breadcrumbsChanged: function () {
          this.triggerMethod('change:breadcrumbs',
              {isBreadcrumbsEmpty: this.breadcrumbs.completeCollection.size() === 0});
        }
        ,
        _onWindowResize: function () {
          if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
          }
          this.resizeTimer = setTimeout(_.bind(function () {
            this._isReadyToSave = false;

            var options = {};
            options.url = DefaultActionBehavior.getDefaultActionNodeUrl(this.node);
            options.enabled = this.defaultActionController.hasAction(this.node);
            options.anchorTitle = this.ancestors.pluck('name').join(' > ');
            options.anchorShortTitle = this._prepareFieldText();
            var ancestors = this.ancestors.pluck('name');
            options.anchorName = ancestors[ancestors.length - 1];
            this._renderField(options);

            this.getStatesBehavior().setStateRead(false, true);
            this._isReadyToSave = true;
          }, this), 200);
        }
        ,
        _renderNode: function () {
          var options = {};
          options.url = DefaultActionBehavior.getDefaultActionNodeUrl(this.node);
          options.enabled = this.defaultActionController.hasAction(this.node);
          options.anchorTitle = this.ancestors.pluck('name').join(' > ');
          options.anchorShortTitle = this._prepareFieldText();
          var ancestors = this.ancestors.pluck('name');
          options.anchorName = ancestors[ancestors.length - 1];
          this.node.unset('nodeError');
          this._renderField(options);
          if ((this.$el.width() > 0) && (ancestors.length > 0) && (this.mode !== "readonly") &&
              (this.changedKey)) {
            this.ui.readField.focus();
          }
        }
        ,

        _renderField: function (options) {
          var errorCase, errorMsg;
          if (this.node.get('nodeError')) {
            errorCase = true;
            errorMsg = lang.originalNodeUnavailable;
            options.url = '#';
            options.enabled = false;
            options.anchorName = "";
            options.anchorShortTitle = "";
            options.anchorTitle = "";
          } else {
            errorCase = false;
          }
          this.model.attributes.options.item = {};
          _.extend(this.model.attributes.options.item, {
                url: options.url,
                buttonDisabled: !options.enabled,
                disabledClass: options.enabled ? '' : 'binf-disabled',
                anchorTitle: options.anchorTitle,
                itemName: options.anchorName,
                anchorTitleShort: options.anchorShortTitle,
                nodeId: options.id ? options.id : this.id,
                errorCase: errorCase,
                errorMsg: errorMsg
              }
          );
          this.render();
        }
        ,

        _getNodePicker: function () {
          var alpOptions = this.model.get('options') || {},
              alpSchema  = this.model.get('schema') || {},
              label      = alpOptions.label || alpSchema.title,
              selectableTypes,
              parent;
          var attachmentFolderVal = $("#attachmentFolderId").val();
          if (attachmentFolderVal) {
            var attachmentFolderId = parseInt(attachmentFolderVal);
          }

          if (this.model.get('multiFiedsItem')) {
            var type_control = this.model.get('typeControl');
            if (type_control) {
              selectableTypes = type_control.parameters.select_types;
              parent = attachmentFolderId || type_control.parameters.parent ||
                       this.node.parent && this.node.parent.attributes
                       || undefined;
            } else {
              selectableTypes = alpOptions.select_types;
              parent = attachmentFolderId || undefined;
            }

          } else {
            selectableTypes = alpOptions.type_control.parameters.select_types;
            parent = attachmentFolderId || alpOptions.type_control.parameters.parent ||
                     this.node.parent && this.node.parent.attributes
                     || undefined;
          }
          this.nodePicker = new NodePicker({
            connector: this.connector,
            dialogTitle: _.str.sformat(lang.nodePickerDialogTitle, label),
            selectableTypes: selectableTypes,
            globalSearch: true,
            context: this.options.context,
            initialContainer: {
              id: parent && parent.id || parent
            },
            initialSelection: [this.node]
          });
          return this.nodePicker;
        }
        ,

        _showNodePicker: function () {
          if (!this._isReadyToSave) {
            return;
          }
          this._isReadyToSave = false;

          var nodePicker = this._getNodePicker();
          nodePicker.show()
              .done(_.bind(function (args) {
                var newNode = args.nodes[0],
                    newId   = newNode.get('id');

                if (this.getStatesBehavior().isWriteOnly() ||
                    this.getStatesBehavior().isStateWrite()) {
                  this.editVal = newId;
                } else {
                  this.getStatesBehavior().setStateRead(false, true);
                }
                if (this.model.get("multiFiedsItem")) {
                  this.$el.find("#" + this.model.get('id')).val(newNode.get('name'));
                } else {
                  this.ui.writeField.val(newNode.get('name'));
                }
                this.newNode = newNode;
                var sharedNode = this.options.context.getModel(NodeModelFactory, {
                  attributes: {id: newId},
                  temporary: true
                });
                sharedNode.set(newNode.attributes);
              }, this))
              .fail(_.bind(function () {
              }, this))
              .always(_.bind(function () {
                this.ui.writeField.focus();

                this._isReadyToSave = true;

              }, this));
        }
        ,

        trySetValue: function () {

          var editVal               = this.getEditValue(), // new value
              curVal                = this.getValue(),  // old value
              bIsValid              = true,
              isReadyToSaveView     = this.isReadyToSave(),
              isFirstEditValueEmpty = (curVal === null && editVal === ""); // to stop server

          if (isReadyToSaveView && (editVal !== curVal || !isFirstEditValueEmpty)) {
            bIsValid = this.setValue(editVal, true);
            this.fieldsave = true;
          }

          return bIsValid;
        }
        ,

        onCancelClicked: function () {
          if (this.clearField) {
            this.editVal = this.oldVal;
          }
          this.clearField = undefined;
          this.newNode = undefined;
          this.ui.writeField.val(this.node.get('name'));
        }
        ,

        _renderError: function () {
          this.node.set('nodeError', true);
          var options = {};
          this._renderField(options);
        }
      });

      return ItemPickerFieldView;
    }
)
;
