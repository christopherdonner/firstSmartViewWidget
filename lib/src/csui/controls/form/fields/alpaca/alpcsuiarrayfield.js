/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jsonpath',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca',
  'csui/models/form', 'csui/controls/form/fields/textfield.view', 'csui/utils/base',
  'csui/lib/jsonpath', 'i18n!csui/controls/form/impl/nls/lang', 'csui/controls/form/pub.sub', 'i18n'
], function (module, _, $, jsonpath, Backbone, Marionette, Alpaca, FormModel, TextFieldView, base,
    jsonPath, lang, PubSub, i18n) {

  Alpaca.Fields.CsuiArrayField = Alpaca.Fields.ArrayField.extend({

    constructor: function CsuiArrayField(container, data, options, schema, view, connector,
        onError) {

      if (!data) {
        data = new Array(schema.maxItems);
      }
      if (_.has(schema.items, "properties")) {
        var bAllFieldsReadonly = false;
        _.each(schema.items.properties, function (property) {
          if (_.has(property, "readonly")) {
            bAllFieldsReadonly = property.readonly;
          }
        });
        if (bAllFieldsReadonly) {
          schema.readonly = true;
        }
      }
      if (schema.required && _.has(schema, "items")) {
        schema.items.required = true;
      }
      if (schema.readonly && _.has(schema, "items")) {
        schema.items.readonly = true;
      }
      if (schema.disabled && _.has(schema, "items")) {
        schema.items.disabled = true;
      }

      this.base(container, data, options, schema, view, connector, onError);

      this.tabContentSelectors = 'input, button:not(:disabled), textarea, .icon-date_picker';
      this.tabableRegions = [];
      this.tabableElements = [];
      this.currentTabPosition = 0;
      this.isWriteMode = false;
      this.turnToReadMode = true;
    },

    addItem: function (itemIndex, itemSchema, itemOptions, itemData, callback) {

      if (!this.options.prevChildData) {
        this.options.prevChildData = !!this.children && this.children.slice();
      }
      this.options.isBlockModified = true;
      if (this.options.isSetType) {
        itemData = !!this.parent.options.defaultData ?
                   JSON.parse(JSON.stringify(this.parent.options.defaultData[this.name])) : "";
        var rgArrayFields = jsonPath(itemData,
            "$..[?(@.toolbarSticky===true)]");
        _.each(rgArrayFields, function (cur) {
          _.extend(cur, {
            "actionbar": {
              "actions": [
                {
                  "action": "remove", "enabled": true,
                  "iconClass": "csui-icon circle_delete_grey" +
                               " csui-array-icon-delete-" + cur.uniqueId
                },
                {
                  "action": "add", "enabled": true,
                  "iconClass": "csui-icon circle_add_grey csui-array-icon-add-" + cur.uniqueId
                },
                {"action": "up", "enabled": false},
                {"action": "down", "enabled": false}
              ]
            }
          });
        });
      }
      else if (this.children.length > 0 &&
               this.field.parents('.cs-form-set-container .csui-scrollablecols').length === 1) {
        this.adjustPartiallyVisibleElement();
      }
      this.base(itemIndex, itemSchema, itemOptions, itemData, _.bind(function () {
        if (this.options.mode === "create") {
          this._raiseValueChanged(this.getValue(), this.name, this.path,
              this.getValue(), this.name, this.path);
        }
        callback();

        if (this.options.isSetType) {
          this.parent.restructureSetContainer(this.$(this.field[0]).find(".cs-form-set-container"),
              this.parent, itemIndex);
          this._hideSetActionIcon();
          this._showItemsInWriteMode(itemIndex, this.parent.options.isSetType);
          itemOptions.isArraySchemaChanged = true;
        }
      }, this));
      if (!this.options.isSetType) {
        this._showItemsInWriteMode(itemIndex);
        itemOptions.isArraySchemaChanged = true;
      }

      if ((this.children[0] && this.children[0].parent.parent &&
           this.children[0].parent.parent.options.isSetType) ||
          (this.parent.parent && this.parent.parent.options.isSetType)) {
        this.showApplyAll(true);
      } else {
        this.showApplyAll(false);
      }
      return;
    },

    removeItem: function (itemIndex, callback) {
      if (!this.options.prevChildData) {
        this.options.prevChildData = !!this.children && this.children.slice();
      }
      this.options.isBlockModified = true;
      if (this.options.isSetType) {
        this.deletedItemCount = !!this.deletedItemCount ? (this.deletedItemCount + 1) : 1;
      }
      if (this.children.length > 0) {
        if (this.children[0].type === 'tkl') {
          this.children[itemIndex].fieldView.changeChildrenValues(
              this.children[itemIndex].fieldView.children);
        } else {
          this.children[itemIndex].fieldView &&
          this.children[itemIndex].fieldView.getEditableBehavior().changeChildrenValues(
              this.childRelations);
        }
      }
      else if (this.children.length > 0 &&
               this.field.parents('.cs-form-set-container .csui-scrollablecols').length === 1) {
        this.adjustPartiallyVisibleElement();
      }

      if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length) {
        PubSub.tklHelpers.viewsInWriteMode.splice(
            PubSub.tklHelpers.viewsInWriteMode.indexOf(this.children[itemIndex].fieldView), 1);
      }
      this.base(itemIndex, _.bind(function () {
        if (this.options.mode === "create") {
          this._raiseValueChanged(this.getValue(), this.name, this.path,
              this.getValue(), this.name, this.path);
        }
        var minItems        = this.view.field.schema.items.minItems !== undefined ?
                              this.view.field.schema.items.minItems : 1,
            currentElements = this.getFieldEl().find('.cs-pull-left .cs-field-write');
        if (currentElements.length === minItems &&
            this.options.fields.item.type === "otcs_node_picker") {
          this._raiseValueChanged(this.getValue(), this.name, this.path,
              this.getValue(), this.name, this.path);
        }
        if (callback) {
          callback();
        }
      }, this));

      if (!!this.parent.options && this.parent.options.isSetType) {
        this.parent.restructureSetContainer(this.$(this.field[0]).find(".cs-form-set-container"),
            this.parent);
        this._hideSetActionIcon();
      }

      var currentContainer = (this.container.parent().find(
              ".cs-form-set-container-" + this.propertyId))[0].children,
          targetIndex      = itemIndex === currentContainer.length ? itemIndex - 1 : itemIndex;

      this._showItemsInWriteMode(targetIndex,
          this.parent.options.isSetType || this.parent.options.isMultiFieldItem);

      this.options.isArraySchemaChanged = true;

      if ((this.children[0] && this.children[0].parent.parent &&
           this.children[0].parent.parent.options.isSetType) ||
          (this.parent.parent && this.parent.parent.options.isSetType)) {
        this.showApplyAll(true);
        if (!!this.children[itemIndex - 1] &&
            this.children[itemIndex - 1].field.closest('.cs-array').hasClass(
                'alpaca-container-item-last')) {
          if (this.$(this.children[itemIndex - 1].getFieldEl().find(
                  '.cs-field-write-inner:first input')).length > 0) {
            this.$(this.children[itemIndex - 1].getFieldEl().find(
                '.cs-field-write-inner:first input')).focus();
          } else {
            this.$(this.children[itemIndex - 1].getFieldEl().find(
                '.cs-field-write-inner:first').children()[0]).focus();
          }
        }
      } else {
        this.showApplyAll(false);
      }

      return;
    },

    adjustPartiallyVisibleElement: function () {
      var isRtl          = i18n && i18n.settings.rtl,
          element        = this.field.find(".cs-formfield").first(),
          scrollEl       = element.parents(".csui-scrollablecols").parents(
              ".cs-form-set-container").find
          (".ps-container.ps-active-x"),
          elementLeft    = element.offset().left,
          leftShadow     = element.parents(".csui-scrollablecols").siblings(
              ".csui-lockedcols").find(".csui-shadowleft-container"),
          leftShadowLeft = leftShadow.offset().left,
          currentLeft,
          scrollUpdate;
      if (isRtl) {
        var leftShadowRight = leftShadowLeft + leftShadow.outerWidth(),
            elementRight    = elementLeft + element.outerWidth();
        scrollUpdate = elementRight - leftShadowRight;
      }
      else {
        scrollUpdate = leftShadowLeft - elementLeft;
      }
      if (scrollUpdate > 0) {
        if (isRtl) {
          currentLeft = scrollEl.scrollLeftRtl();
          scrollEl.scrollLeftRtl(currentLeft + scrollUpdate);
        }
        else {
          currentLeft = scrollEl.scrollLeft();
          scrollEl.scrollLeft(currentLeft - scrollUpdate);
        }
      }
      return;
    },

    postRender: function (callback) {
      this.base(callback);
      this.$ = $;
      this.field.bind('field:changed', _.bind(this._onFieldChanged, this));
      this.container.bind('click', _.bind(this._doEditActions, this));
      this.container.bind('mouseenter', _.bind(this._mouseInArrayBlock, this));
      this.container.bind('mouseleave', _.bind(this._mouseOutArrayBlock, this));
      this.container.parent().bind('focusout', _.bind(this._mouseOutArrayBlock, this));
      this.container.bind('focusin', _.bind(this._hideApplyAll, this));
      this.container.find(".cs-pull-right").find(".circle_add_grey").parent().addClass(
          "binf-hidden");
      this.container.find(".cs-pull-right").find(".circle_delete_grey").parent().addClass(
          "binf-hidden");
      this.container.find(".csui-icon.apply-all.block").bind("click",
          _.bind(this.onClickApplyAll, this));
      this.container.find(".csui-icon.apply-all.block").bind("keypress",
          _.bind(this.onClickApplyAll, this));
      if (!this.parent.parent || (this.options.mode === 'create' && this.parent.parent)) {
        this.registered = true;
        this._registerBulkSubmitAction();
      } else if (this.parent.parent && this.parent.parent.options.isSetType === undefined) {
        this._registerBulkSubmitAction();
      } else if (this.parent.parent && this.parent.parent.options.isSetType === true &&
                 !!this.parent.options.isMultiField) { // for locked sets contains MV fields.
        this.registered = true;
        this._registerBulkSubmitAction();
      }

      if (this.schema.required) {
        var label = this.getFieldEl().find("label.alpaca-container-label");
        $('<span class="alpaca-icon-required binf-glyphicon binf-glyphicon-star"></span>').prependTo(
            label);
      }
      if (this.options.setRequiredFieldsEditable) {
        this.getFieldEl().find('.cs-pull-right').removeClass('binf-hidden');
      }
      if (this.options.isSetType) {
        var arrWriteObjElements = this.getFieldEl().find('.cs-pull-left .cs-field-write');
        if (arrWriteObjElements.length === 0) {
          this.getFieldEl().find('.cs-pull-right .circle_add_grey').parent().addClass(
              "binf-hidden");
          this.getFieldEl().find('.cs-pull-right .circle_delete_grey').parent().addClass(
              "binf-hidden");
          this.getFieldEl().find(".csui-bulk-edit").addClass("binf-hidden");
        }
      } else {
        this.getFieldEl().find(".cs-array").addClass("cs-form-multi-action-container");
      }

      this.tabableRegions.push(this.container);
      var that = this;
      _.each(this.container.find(this.tabContentSelectors),
          function (element) {
            that.tabableElements.push(element);
      });
      if (this.options.mode !== 'create') {
        this.container.focusin(function () {
          var btnEdit = that.field.find(".csui-array-bulk-edit");
          btnEdit.removeClass("binf-hidden");
        });
      }
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    _showActionIcons: function (event) {
      var containerLst = event.currentTarget.parentElement.children;
      for (var i = 0; i < containerLst.length; i++) {
        if (containerLst[i].className.indexOf("cs-pull-right") >= 0) {
          if (this.$(containerLst[i]).find(".circle_add_grey").parent().hasClass("binf-hidden")) {
            this.$(containerLst[i]).find(".circle_add_grey").parent().removeClass("binf-hidden");
          }
          if (this.$(containerLst[i]).find(".circle_delete_grey").parent().hasClass(
                  "binf-hidden")) {
            this.$(containerLst[i]).find(".circle_delete_grey").parent().removeClass("binf-hidden");
          }
        }
      }
    },

    _showActionIconsForSets: function (event) {
      var parentElement = event.currentTarget.parentElement,
          containerLst  = event.currentTarget.parentElement.children;
      for (var i = 0; i < containerLst.length; i++) {
        if (containerLst[i].className.indexOf("cs-pull-right") >= 0) {
          if (this.$(containerLst[i]).find(".circle_add_grey").parent().hasClass("binf-hidden")) {
            this.$(containerLst[i]).find(".circle_add_grey").parent().removeClass("binf-hidden");
          }
          if (this.$(containerLst[i]).find(".circle_delete_grey").parent().hasClass(
                  "binf-hidden")) {
            this.$(containerLst[i]).find(".circle_delete_grey").parent().removeClass("binf-hidden");
          }
          if (this.options.isSetType &&
              !parentElement.classList.contains("cs-form-multi-action-container")) {
            if (!(this.$(containerLst[i]).find(".circle_add_grey").parent().hasClass(
                    "alpaca-button-disabled") &&
                  this.$(containerLst[i]).find(".circle_delete_grey").parent().hasClass(
                      "alpaca-button-disabled"))) {
              this.$(containerLst[i]).addClass("csui-set-action-bar");
            }
          }
        }
      }
    },

    _hideActionIcons: function (event) {
      if (this.$(event.currentTarget).find(document.activeElement).length === 0) {
        var containerLst = event.currentTarget.parentElement.children;
        for (var i = 0; i < containerLst.length; i++) {
          if (containerLst[i].className.indexOf("cs-pull-right") >= 0) {
            if (!this.$(containerLst[i]).find(".circle_add_grey").parent().hasClass(
                    "binf-hidden")) {
              this.$(containerLst[i]).find(".circle_add_grey").parent().addClass("binf-hidden");
            }
            if (!this.$(containerLst[i]).find(".circle_delete_grey").parent().hasClass(
                    "binf-hidden")) {
              this.$(containerLst[i]).find(".circle_delete_grey").parent().addClass("binf-hidden");
            }
            this.$(containerLst[i]).removeClass("csui-set-action-bar");
          }
        }
      }
    },

    _hideActions: function (event) {
      if (this.$(document.activeElement).parent().closest(".cs-pull-left").siblings(
              ".cs-pull-right").find(this.$(event.target).closest(".cs-pull-right").find(
              ".circle_add_grey")).length === 0) {
        this.$(event.target).closest(".cs-pull-right").find(
            ".circle_add_grey").parent().addClass("binf-hidden");
      }
      if (this.$(document.activeElement).parent().closest(".cs-pull-left").siblings(
              ".cs-pull-right").find(this.$(event.target).closest(".cs-pull-right").find(
              ".circle_delete_grey")).length === 0) {
        this.$(event.target).closest(".cs-pull-right").find(
            ".circle_delete_grey").parent().addClass("binf-hidden");
      }
    },

    onShow: function (event) {
      if (this.options.mode === 'create') {
        var setContainerParent = this.getFieldEl().find(".cs-form-set-container").parents(
            ".cs-form-set-container");
        if (this.options.isSetType && setContainerParent.length === 0) {
          setContainerParent = this.getFieldEl().find(".cs-form-set-container");
        }
        if (this.options.isSetType && this.data[0] === undefined) {
          $(this.domEl).find('.cs-pull-left').addClass('csui-emptyset');
          $(this.domEl).find(".cs-pull-right").removeClass("cs-pull-right");
        }
        if (setContainerParent.length > 0) {
          setContainerParent.find(".cs-array >.cs-pull-left").bind('mouseenter',
              _.bind(this._showActionIconsForSets, this));
          setContainerParent.find(".cs-array >.cs-pull-left").bind('mouseleave',
              _.bind(this._hideActionIcons, this));
          setContainerParent.find(".cs-array >.cs-pull-right").bind('mouseenter',
              _.bind(this._showActionIconsForSets, this));
          setContainerParent.find(".cs-array >.cs-pull-right").bind('mouseleave',
              _.bind(this._hideActions, this));
        } else {
          var multiValueContainerParent = this.getFieldEl().find(".cs-form-set-container");
          if (multiValueContainerParent.length > 0) {
            multiValueContainerParent.find(".cs-array >.cs-pull-right").bind('mouseenter',
                _.bind(this._showActionIcons, this));
            multiValueContainerParent.find(".cs-array >.cs-pull-right").bind('mouseleave',
                _.bind(this._hideActions, this));
          }
        }
      }
      if (this.options.mode === 'update') {
        if (this.options.isSetType && this.data[0] === undefined) {
          $(this.domEl).find('.cs-pull-left').addClass('csui-emptyset');
        }
      }
    },
    _registerBulkSubmitAction: function () {
      var multiFieldBlock = this.container.parent(),
          that            = this;
      that.focusedOnDocument = false;
      multiFieldBlock.off('keydown').off("focusout").on('focusout', function (event) {
        if ($(event.relatedTarget).hasClass('csui-bulk-edit-cancel') ||
            that.isRelatedFieldInFocus(event.relatedTarget)) {
          return;
        }
        setTimeout(function () {
          if (multiFieldBlock.find(":focus").length === 0 &&
              multiFieldBlock.find(document.activeElement).length === 0) {
            that.focusedOnDocument = document.activeElement ?
                                     (document.activeElement.tagName === "BODY") ||
                                     (document.activeElement.tagName === "DIV") : false;
            if (that.getFieldEl().find('.cs-pull-left .cs-field-write:not(.csui-unedited)').is(
                    ":visible")) {
              var booleanEdited = that.getFieldEl().find(
                  '.cs-formfield.cs-booleanfield .cs-field-write:not(.csui-unedited)');
              if (booleanEdited.length > 0) {
                booleanEdited.addClass('csui-unedited');
              }
              if (that.children.length > 0 && that.children[0].type === 'tkl') {
                if (!!PubSub.tklHelpers) {
                  var cancelClicked = false;
                  for (var i = PubSub.tklHelpers.viewsInWriteMode.length - 1;
                       !cancelClicked && i >= 0; i--) {
                    cancelClicked = PubSub.tklHelpers.viewsInWriteMode[i].getEditableBehavior().mouseDownCancel;
                  }
                  if (!cancelClicked) {
                    that._doBulkSubmitActionTKL();
                  }
                }
              } else {
                that._doBulkSubmitAction();
              }
              if (that.options.mode === "create") {
                that.hideApplyAll(that.getFieldEl());
                that._hideInlineAddIcon();
                that._hideInlineDeleteIcon();
              }
            } else if (that.view.field.schema.items.minItems === 0 &&
                       !_.isEqual(that.getPreviousData(), that.getValue())) {
              that._doBulkSubmitAction(true);
            } else if (that.getFieldEl().find('.cs-pull-left .cs-field-write').length ===
                       that.getFieldEl().find(
                           '.cs-formfield.cs-booleanfield .cs-field-write').length) {
              if (multiFieldBlock.find('.csui-bulk-edit-cancel.binf-hidden').length === 0) {
                that._showItemsInReadMode();
                that._showBulkEditAction();
                that._hideInlineAddIcon();
                that._hideInlineDeleteIcon();
              }
              else if (that.options.mode === "create") {
                that.hideApplyAll(that.getFieldEl());
                that._hideInlineAddIcon();
                that._hideInlineDeleteIcon();
              }
            }
          } else {
          }
          var coloutContainer = that.$(".cs-form-set-container").find(
              ".binf-popover .csui-colout-formitems");
          var popoverContainer = coloutContainer.parents(".cs-form-set-container");
          if (coloutContainer.find(document.activeElement).length > 0) {
            popoverContainer.focus();
          }//&&document.activeElement.id===
          if (document.activeElement.tagName === "BODY" ||
              (document.activeElement !== popoverContainer[0] &&
               ((popoverContainer.find(document.activeElement).hasClass('csui-colout-icon') &&
                 !$(document.activeElement).data('binf.popover')) ||
                popoverContainer.find(document.activeElement).length <
                1
               ))) {
            that.hidePopover();
          }
        }, 50);
      }).on('keydown', $, function (event) {
        var userfieldFocusFix = function (event) {
          if (that.schema.items.type === 'otcs_user_picker' ||
              that.schema.items.type === 'otcs_member_picker') {
            var arrReadElements = that.getFieldEl().find('.cs-pull-left .cs-field-read');
            event.arrayFieldIndex = $(arrReadElements).index(
                $(event.target).closest(".cs-field-read"));
          }
        }, fieldView;
        if (!that.options.readonly) {
          if (event.keyCode === 27) { // Escape: reset the block
            if (that.options.mode !== 'create') {
              if ($(document.activeElement).hasClass('cs-search') && (that.schema.items.type ===
                                                                      'otcs_member_picker' ||
                                                                      that.schema.items.type ===
                                                                      'otcs_user_picker')) {
                that._changeBlockToWriteMode(event, true);
              } else {
                that._changeBlockToWriteMode(event, false);
              }
            } else {
              return false;
            }
          } else if (event.keyCode === 13) { // Enter: open the block in edit mode
            that.turnToReadMode = true;
            if ($(document.activeElement).is(".binf-btn:not(.binf-dropdown-toggle)") ||
                that.$(".cs-form-set-container").find(
                    ".binf-popover .csui-colout-formitems").length >
                0) {
              return;
            } else if ($(document.activeElement).hasClass('cs-form-set-container') &&
                       !that.isWriteMode) {
              $(document.activeElement).siblings(".csui-array-bulk-edit").find(
                  ".csui-bulk-edit").trigger("click");
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            if (!that.options.isSetType) {
              var childView = that.view.field.children[0].fieldView;
              if (childView.alpacaField.type === "select") {
                var index = event.data.inArray(event.target,
                    event.data(event.target).closest(".cs-form-set-container").find(
                        "button.binf-dropdown-toggle"));
                if (index !== -1) {
                  childView = that.view.field.children[index].fieldView;
                  if (childView.isDropdownOpen()) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.data(document.activeElement).trigger("click");
                  } else {
                    event.preventDefault();
                    event.stopPropagation();
                    setTimeout(function () {
                      (that.children.length > 0 && that.children[0].type === 'tkl') ?
                      that._doBulkSubmitActionTKL(true, event) : that._doBulkSubmitAction(true);
                    }, 20);
                  }
                }
              } else {
                if (childView.getStatesBehavior().isStateRead() && childView.allowEditOnEnter()) {
                  userfieldFocusFix(event);
                  if (that.options.mode !== 'create' &&
                      !$(event.target).hasClass("esoc-user-container esoc-user-mini-profile")) {
                    that._changeBlockToWriteMode(event, true);
                  }
                } else if (childView.getStatesBehavior().isStateWrite() &&
                           childView.allowSaveOnEnter()) {
                  if (event.data(".csui-user-picker-no-results")) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                  if (event.target.classList.contains("apply-all")) {
                    that.onClickApplyAll(event);
                  }
                  if (that.children.length > 0 && that.children[0].type !== 'tkl') {
                    fieldView = that.children[that._getFieldIndex(event.target)].fieldView;
                    if (fieldView.getOldValue() !== fieldView.getEditValue()) {
                      fieldView.changeChildrenValues(that.childRelations);
                    }
                  }
                  setTimeout(function () {
                    if (that.children.length > 0 && that.children[0].type === 'tkl') {
                      that._doBulkSubmitActionTKL(true, event);
                    } else {
                      if (that.container.find('ul.typeahead:visible').length === 0) {
                        that._doBulkSubmitAction(true);
                      }
                    }
                  }, 20);
                }
              }
            } else {
              if (!$(event.target).hasClass("esoc-user-container esoc-user-mini-profile")) {
                event.preventDefault();
                event.stopPropagation();
              }
              var arrReadObjElements = that.getFieldEl().find('.cs-pull-left .cs-field-read');
              if (arrReadObjElements.hasClass("binf-hidden")) {
                if (event.data(".cs-field-write-inner.binf-open").length > 0) {
                  event.data(document.activeElement).trigger("click");
                } else {
                  if (event.data(".csui-user-picker-no-results")) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                  if (event.target.classList.contains("apply-all")) {
                    that.onClickApplyAll(event);
                  }
                  setTimeout(function () {
                    (that.children.length > 0 && that.children[0].type === 'tkl') ?
                    that._doBulkSubmitActionTKL(true, event) : that._doBulkSubmitAction(true);
                  }, 20);
                }
              } else {
                userfieldFocusFix(event);
                if (that.options.mode !== 'create' &&
                    !$(event.target).hasClass("esoc-user-container esoc-user-mini-profile")) {
                  that._changeBlockToWriteMode(event, true);
                }
              }
            }
          } else if (event.keyCode === 9) {  //tab
            if (that.isWriteMode || that.options.mode === 'create') {
              if (that.options.mode === 'create') {
                var e = $.Event('tab:content:field:changed');
                that.field.trigger(e);
              }
              if (that.options.isSetType) {
                var child = that.children[0].children[0];
                child.fieldView ? child.fieldView.getEditableBehavior().moveTab(event) :
                child.children[0].fieldView.getEditableBehavior().moveTab(event);
              } else {
                that.children[0].fieldView.getEditableBehavior().moveTab(event);
              }
            } else {
              that.getFieldEl().find(".csui-array-bulk-edit").addClass("binf-hidden");
            }
          } else if (event.keyCode === 113) { // F2: submit the form.
            that.turnToReadMode = true;
            if (!that.isWriteMode) {
              userfieldFocusFix(event);
              if (that.options.mode !== 'create') {
                that._changeBlockToWriteMode(event, true);
              }
              return;
            }
            event.stopPropagation();
            event.preventDefault();
            if (that.children.length > 0 && !that.options.isSetType &&
                that.children[0].type !== 'tkl') {
              fieldView = that.children[that._getFieldIndex(event.target)] &&
                          that.children[that._getFieldIndex(event.target)].fieldView;
              if (fieldView && (fieldView.getOldValue() !== fieldView.getEditValue())) {
                fieldView.getEditableBehavior() &&
                fieldView.getEditableBehavior().changeChildrenValues(that.childRelations);
              }
            }
            (that.children.length && that.children[0].type === "tkl") ?
            that._doBulkSubmitActionTKL(true, event) :
            that._doBulkSubmitAction(true);

            if (!!that.childRelations && that.childRelations.length > 0) {
              that.childRelations.forEach(function (childView) {
                if (that.isMultiFieldView(childView)) {
                  childView._doBulkSubmitActionTKL(true, event);
                } else {
                  if (childView.getStatesBehavior().state === "write") {
                    childView.getEditableBehavior().trySetValueAndLeaveEditMode(true, false);
                  }
                }
              });
            } // FOR Turning/Submitting TKL CHILDREN to read mode

          } else if (event.keyCode === 32) { //space
            if (!that.isWriteMode) {
              userfieldFocusFix(event);
              if (that.options.mode !== 'create') {
                that._changeBlockToWriteMode(event, true);
              }
            }
          }
        }
      });
    },

    _moveTab: function (event, element, previous) {
      this._updateTabableElements();
      this.currentTabPosition = $(this.tabableElements).index(element);
      if (this.options.mode === 'create') {
        if (this.currentTabPosition === (this.tabableElements.length - 1) ||
            this.currentTabPosition === -1) {
          return;
        }
      } else {
        if (this.currentTabPosition === -1) {
          return;
        }
      }
      if (previous) {
        if (this.currentTabPosition > 0) {
          this.currentTabPosition -= 1;
        } else {
          this.currentTabPosition = (this.tabableElements.length - 1);
        }
      } else {

        if (this.currentTabPosition >= (this.tabableElements.length - 1)) { //last element of array
          this.currentTabPosition = 0;
        } else {
          this.currentTabPosition += 1;
        }
      }
      this.tabableElements[this.currentTabPosition].focus();
      event.preventDefault();
      event.stopPropagation();
    },

    _updateTabableElements: function () {
      this.tabableElements.length = 0;
      var that = this;
      var region;
      if (this.options.mode && this.options.mode === 'create') {
        $(this.domEl.closest(".alpaca-container-item").length > 0 ?
          this.domEl.closest(".alpaca-container-item") : this.domEl).find(
            this.tabContentSelectors).each(
            function () {
              if ($(this).is(':visible')) {
                that.tabableElements.push(this);
              }
            });
      } else {
        $(this.tabableRegions).each(function () {
          $(this).find(that.tabContentSelectors).each(
              function () {
                if ($(this).is(':visible')) {
                  that.tabableElements.push(this);
                }
              });
        });
      }
    },

    _updateTabablePositionOnApplyAllClick: function (event, self) {
      self._updateTabableElements();
      self.currentTabPosition = $(self.tabableElements).index(event.target);
      var elems, arrElm, elm, elemLength, focusPosition, previous;
      previous = event.shiftKey;
      if (self.options.mode === 'create') {

        if (self.currentTabPosition === (self.tabableElements.length - 1) ||
            self.currentTabPosition === -1) {

          elems = $(document.querySelectorAll('.binf-tab-content')).children();
          arrElm = elems.find(self.tabContentSelectors);
          self.tabableElements = arrElm;
          self.tabableRegions = $(self.tabableElements);
          elemLength = arrElm.length;
          focusPosition = 0;
          while (focusPosition < elemLength) {
            elm = self.tabableElements[focusPosition];
            if (elm && $(elm).is(event.target)) {
              break;
            }
            focusPosition++;
          }
          if (focusPosition >= 0 && focusPosition < elemLength) {
            self.currentTabPosition = focusPosition;
          }
        }
      } else {
        if (self.currentTabPosition === -1) {

          elems = $(document.querySelectorAll('.binf-tab-content')).children();
          arrElm = elems.find(self.tabContentSelectors);
          self.tabableElements = arrElm;
          self.tabableRegions = $(self.tabableElements);
          elemLength = arrElm.length;
          focusPosition = 0;
          while (focusPosition < elemLength) {
            elm = self.tabableElements[focusPosition];
            if (elm && $(elm).is(event.target)) {
              break;
            }
            focusPosition++;
          }
          if (focusPosition >= 0 && focusPosition < elemLength) {
            self.currentTabPosition = focusPosition;
          }
        }
      }
      if (previous) {
        if (self.currentTabPosition > 0) {
          self.currentTabPosition -= 1;
        } else {
          self.currentTabPosition = (self.tabableElements.length - 1);
        }
      } else {

        if (self.currentTabPosition >= (self.tabableElements.length - 1)) {
          self.currentTabPosition = 0;
        } else {
          self.currentTabPosition += 1;
        }
      }

      $(self.tabableElements[self.currentTabPosition]).prop("tabindex", "0").focus();
    },
    _changeBlockToWriteMode: function (event, toWriteMode) {
      if (toWriteMode) { // change to write mode
        if (this.field.find(".csui-bulk-edit-cancel:visible").length === 0) {
          event.preventDefault();
          event.stopPropagation();
          if (this.field.find(".csui-array-bulk-edit-set").length > 0) {
            $(this.field.find(".csui-array-bulk-edit-set .csui-bulk-edit")).trigger("click");
          } else {
            $(this.field.find(".csui-bulk-edit")).trigger("click");
            $(this.field.find(".csui-array-bulk-edit")).removeClass("binf-hidden");
          }
          var index = 0;
          if (this.schema.items.type === 'otcs_user_picker' ||
              this.schema.items.type === 'otcs_member_picker') {
            index = event.arrayFieldIndex;
          } else {
            var arrReadElements = this.getFieldEl().find('.cs-pull-left .cs-field-read,' +
                                                         ' .cs-booleanfield .cs-field-write');
            index = $(arrReadElements).index($(event.target).closest(".cs-field-read"));
          }
          var arrWriteElements = this.getFieldEl().find('.cs-pull-left .cs-field-write');
          $(arrWriteElements[index]).find(':input').focus();
        }
      } else { // change to read mode
        if (this.children.length > 0 && this.children[0].type === 'tkl' &&
            this.getFieldEl().is(':visible')) {
          this.parentRelations && this.parentRelations.map(function (parent) {
            $(parent.field.find(".csui-bulk-edit-cancel:visible")).trigger("click");
          });

          this.childRelations && this.childRelations.map(function (child) {
            $(child.field.find(".csui-bulk-edit-cancel:visible")).trigger("click");
          });
        }
        $(this.field.find(".csui-bulk-edit-cancel:visible")).trigger("click");
      }
    },

    _showAddIconForLastElement: function () {
      this.container.find(".cs-pull-right").find(".circle_add_grey").parent().addClass(
          "binf-hidden");
      this.container.find(".cs-pull-right").find(".circle_add_grey").last().parent().removeClass(
          "binf-hidden");
    },

    _hideInlineAddIcon: function () {
      this.container.find(".cs-pull-right").find(".circle_add_grey").parent().addClass(
          "binf-hidden");
    },

    _hideInlineDeleteIcon: function () {
      this.container.find(".cs-pull-right").find(".circle_delete_grey").parent().addClass(
          "binf-hidden");
    },

    _showSetDeleteIcon: function () {
      this.container.find(".cs-pull-right").find(".circle_delete_grey").removeClass(
          "binf-hidden").parent().removeClass("binf-hidden");
    },

    _hideSetActionIcon: function () {
      var iconContainerEle = $(this.container[0]).find(".cs-array .cs-pull-right");
      iconContainerEle.find(".circle_delete_grey").parent().addClass("binf-hidden");
      iconContainerEle.find(".circle_add_grey").parent().addClass("binf-hidden");
    },
    _doEditActions: function (event, editFlag) {
      var arrWriteObjElements,
          data;
      if (editFlag || (!!event && $(event.target).hasClass("csui-bulk-edit"))) {
        if ($(".cs-form .cs-formfield-invalid").length === 0) {
          this.getFieldEl().find('.csui-array-bulk-edit').removeClass('binf-hidden');
          this.getFieldEl().find(".csui-bulk-edit-cancel").removeClass("binf-hidden");
          this.getFieldEl().find(".csui-bulk-edit-submit").removeClass("binf-hidden");
          this.getFieldEl().find(".csui-bulk-edit").addClass("binf-hidden");
          if (!this.registered && (this.parent.parent || this.parent.options.isSetType)) {
            this._registerBulkSubmitAction();
          }
          if ((this.children.length > 0)) {
            var toWriteMode = function (children) {
              !!children && children.map(function (child) {
                if (!child.alpacaField) {
                  !!child.childRelations && toWriteMode(child.childRelations);
                  var fieldEl = child.getFieldEl();
                  if (fieldEl.is(':visible')) {
                    fieldEl.find('.icon-container.csui-array-bulk-edit').removeClass(
                        'binf-hidden');
                    fieldEl.find(".csui-bulk-edit-cancel").removeClass("binf-hidden");
                    fieldEl.find(".csui-bulk-edit-submit").removeClass("binf-hidden");
                    fieldEl.find(".csui-bulk-edit").addClass("binf-hidden");
                    if (!child.registered &&
                        (child.parent.parent || child.parent.options.isSetType)) {
                      child._registerBulkSubmitAction();
                    }
                    child._showItemsInWriteMode();
                  }
                } else {
                  if (child.getStatesBehavior().state === "read") {
                    child.getEditableBehavior().setViewStateWriteAndEnterEditMode();
                  }
                }
              });
            };
            toWriteMode(this.childRelations);
          }
          this._showItemsInWriteMode();
          arrWriteObjElements = this.getFieldEl().find('.cs-pull-left .cs-field-write');
          if (arrWriteObjElements.length > 0) {
            $(arrWriteObjElements.first()).find(":input").focus().focus();
          }
        } else {
          $($(".cs-form .cs-formfield-invalid")[0]).find(":input").focus().focus();
          return;
        }
      } else if (!!event && $(event.target).hasClass("csui-bulk-edit-cancel")) {
        this.cancelClicked = true;
        if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length > 0 &&
            !this.options.isSetType) {
          for (var i = PubSub.tklHelpers.viewsInWriteMode.length - 1; !!PubSub.tklHelpers && i >= 0;
               i--) {
            var view = PubSub.tklHelpers.viewsInWriteMode[i];
            if (view) {
              if (view.getStatesBehavior().state === 'write') {
                if (view.getEditableBehavior().isMultiFieldView(view)) {
                  view = view.alpacaField.parent;
                  var fieldEl = view.getFieldEl();
                  if (fieldEl.find('.csui-bulk-edit-cancel').is(':visible')) {
                    fieldEl.find(".csui-bulk-edit").removeClass("binf-hidden");
                    fieldEl.find(".csui-bulk-edit-cancel").addClass("binf-hidden");
                    fieldEl.find(".csui-bulk-edit-submit").addClass("binf-hidden");
                    view._hideInlineDeleteIcon();
                    view._hideInlineAddIcon();
                    if (!!view.options.prevChildData) {
                      view.children = {};
                      view.children = view.options.prevChildData;
                    }
                    data = view.getPreviousData();
                    view.refreshContainer(data, _.bind(function () {
                      this.options.prevChildDom = undefined;
                      this.options.prevData = undefined;
                      this.isWriteMode = false;
                      var that = this;
                      if (this.options.mode !== 'create') {
                        setTimeout(_.bind(function () {
                          var e = $.Event('tab:content:field:changed');
                          that.field.trigger(e);
                        }, that), 300);
                      }
                    }, view));
                  }
                } else {
                  if (view.getStatesBehavior().state === 'write') {
                    if (view.isTKLField) {
                      view.setValue(view.getOldValue());
                      view.ui.writeField.val(view.getOldValue());
                      view.isValidTKLState = true;
                    } else {
                      view.ui.writeField.val(view.getValue());
                    }
                    view.alpacaField.refreshValidationState();
                    view.$el.removeClass('cs-formfield-invalid');
                    view.getEditableBehavior().setViewReadOnlyAndLeaveEditMode(false, false);
                  }
                }
              }
            }

          }

        } else {
          this.getFieldEl().find(".csui-bulk-edit").removeClass("binf-hidden");
          this.getFieldEl().find(".csui-bulk-edit-cancel").addClass("binf-hidden");
          this.getFieldEl().find(".csui-bulk-edit-submit").addClass("binf-hidden");
          var adjustWidth = false;
          if (this.getFieldEl().hasClass("cs-adjust-width")) {
            adjustWidth = true;
          }
          this._hideInlineDeleteIcon();
          this._hideInlineAddIcon();
          var that = this;
          that.$ = $;
          if (!!this.options.prevChildData) {
            this.children = {};
            this.children = this.options.prevChildData;
          }
          data = this.getPreviousData();
          this.refreshContainer(data, function () {
            that.container.focus();
            that.options.prevChildDom = undefined;
            that.options.prevData = undefined;
            if (adjustWidth) {
              that.getFieldEl().addClass("cs-adjust-width");
            }
            that.parent.restructureSetContainer(
                that.$(that.field[0]).find(".cs-form-set-container"),
                that.parent);
            setTimeout(_.bind(function () {
              var e = $.Event('tab:content:field:changed');
              that.field.trigger(e);
              that.field.find(".csui-array-bulk-edit").removeClass("binf-hidden");
            }, that), 300);
            that.isWriteMode = false;
          });
        }
      }
    },
    getPreviousData: function () {
      var data = {};
      if (this.options.submittedData && this.options.submittedData.length) {
        if (!!this.children[0] && this.children[0].type === "select" && !this.options.isSetType) {
          var arrObj = [];
          $.each(this.options.submittedData, function (idx, val) {
            if (val instanceof Object) {
              arrObj.push(parseInt(val.get("id")));
            } else if (val === "" || val === null) {
              arrObj.push("");
            } else {
              arrObj.push(val);
            }
          });
          data = JSON.parse(JSON.stringify(arrObj.slice()));
        } else {
          data = JSON.parse(JSON.stringify(this.options.submittedData));
        }
        this.options.submitArray = false;
      } else {
        if (!!this.options.prevData) {
          data = this.options.prevData;
          this.options.prevData = undefined;
        } else {
          data = JSON.parse(JSON.stringify(this.data.slice()));
        }
      }
      return data;
    },

    showAppliedTick: function (e, callback, view) {
      var toggleIcon = e.target;
      toggleIcon.callback = callback;
      toggleIcon.eve = e;
      $(toggleIcon).fadeOut(100, function () {
        $(this).removeClass();
        $(this).addClass("csui-icon block applied_done");
        $(this).fadeIn(100, function () {
          setTimeout(function (self) {
            $(self).fadeOut(800, function () {
              $(this).removeClass();
              $(this).addClass("csui-icon apply-all block binf-hidden");
              $(this).parent().addClass("binf-hidden");
              this.callback(this.eve, view);
            });
          }, 1000, this);
        });
      });
      $(".metadata-sidebar .metadata-sidebar-fadeout").fadeOut(2000, function () {
        $(".metadata-sidebar .cs-list-group .arrow-overlay").removeClass(
            "metadata-sidebar-arrow-overlay");
        $(".metadata-sidebar .cs-list-group").removeClass("metadata-sidebar-cs-list-group");
        $(this).remove();
      });
    },

    onClickApplyAll: function (e) {
      this._doBulkSubmitAction();
      if ($(e.currentTarget).parents(".alpaca-container-item") &&
          $(e.currentTarget).parents(".alpaca-container-item").find(
              ".cs-formfield-invalid").length === 0) {
        this.updateData(this.data);
        var originalData = JSON.parse(JSON.stringify(this.data.slice()));
        var editedData = this.updateData(originalData);
        var data = {
          fieldvalue: editedData,
          fieldpath: this.name,
          action: this.showAppliedTick,
          fieldevent: e,
          callback: this._updateTabablePositionOnApplyAllClick,
          view: this
        };
        $(".metadata-sidebar .cs-list-group").addClass("metadata-sidebar-cs-list-group");
        $(".metadata-sidebar .cs-list-group .arrow-overlay").addClass(
            "metadata-sidebar-arrow-overlay");
        $("<div/>", {class: 'metadata-sidebar-fadeout'}).appendTo(
            $(".metadata-sidebar .cs-list-group"));
        var event = $.Event('click:applyAll');
        _.extend(event, data);
        this.field.trigger(event);

        var that = this;
        var tklViews = _.where(this.children, {type: "tkl"});
        if (tklViews.length > 0) {
          var checkChildren = function (_view) {
            if (_view.children.length > 0) {
              _.each(_view.children, function (child) {
                if (tklViews[0].fieldView.isMultiFieldView(child)) {
                  data.fieldpath = child.propertyId;
                  data.fieldvalue = child.getValue();
                  _.extend(event, data);
                  that.field.trigger(event);
                  checkChildren(child.children[0].fieldView);
                } else {
                  data.fieldpath = !!child.alpacaField ? child.alpacaField.name :
                                   child.view.field.name;
                  data.fieldvalue = child.getValue().toString();
                  _.extend(event, data);
                  that.field.trigger(event);
                  checkChildren(child);
                }
              });
            }
            return;
          };
          checkChildren(tklViews[0].fieldView);

          var checkParents = function (_view) {
            if (_view.parentViews.length > 0) {
              _.each(_view.parentViews, function (parent) {
                if (tklViews[0].fieldView.isMultiFieldView(parent)) {
                  data.fieldpath = parent.propertyId;
                  data.fieldvalue = parent.getValue();
                  _.extend(event, data);
                  that.field.trigger(event);
                  checkParents(parent.children[0].fieldView);
                }
                else {
                  data.fieldpath = !!parent.alpacaField ? parent.alpacaField.name :
                                   parent.view.field.name;
                  data.fieldvalue = parent.getValue().toString();
                  _.extend(event, data);
                  that.field.trigger(event);
                  checkParents(parent);
                }
              });
            }
            return;
          };
          checkParents(tklViews[0].fieldView);
        }
      }
    },

    showApplyAll: function (isSetFlag) {
      if (this.options.mode === "create") {
        var iconEl = this.getFieldEl().find('.csui-icon.apply-all'), setIconEl;
        if (isSetFlag) {
          setIconEl = this.getFieldEl().find(">.apply-set").length > 0 ?
                      this.getFieldEl().find(">.apply-set").children() :
                      this.container.parents(".cs-form-set-container").siblings(".apply-set").find(
                          '.csui-icon.apply-all');
          iconEl = setIconEl.length > 0 ? setIconEl : iconEl;
        }
        var displayedApplyButton = this.getFieldEl().parents('.cs-metadata-properties').find(
            '.csui-icon.apply-all').not('.binf-hidden');
        displayedApplyButton = displayedApplyButton.filter(
            function (index, applybutton) {
              applybutton = (applybutton !== iconEl[0]) ? applybutton : undefined;
              return applybutton;
            });
        if (!!displayedApplyButton && displayedApplyButton.length > 0) {
          displayedApplyButton['addClass']('binf-hidden');
          displayedApplyButton.parent().addClass('binf-hidden');
        }
        if (iconEl.hasClass('binf-hidden')) {
          iconEl.removeAttr('style');
          iconEl.removeClass('binf-hidden');
          iconEl.prop('tabindex', "0");
          if (iconEl.parent().hasClass('binf-hidden')) {
            iconEl.parent().removeClass('binf-hidden');
          }
          var tabEvent = $.Event('tab:content:field:changed');
          this.field.trigger(tabEvent);
        }
      }
    },

    hideApplyAll: function (element) {
      var applyEl = element.find('.apply-all:first');
      if (element.find('.alpaca-message').length === 0) {
        if (!applyEl.hasClass('binf-hidden')) {
          applyEl.addClass('binf-hidden');
        }
        if (!applyEl.parent().hasClass('binf-hidden')) {
          setTimeout(function () { applyEl.parent().addClass('binf-hidden'); }, 1100);
        }
      }
    },

    _hideApplyAll: function (event) {
      if (!!this.parent.parent && this.parent.parent.options.isSetType) {
        return;
      }
      if (this.options.mode === 'create' &&
          this.getFieldEl().find(".apply-all").not(".binf-hidden").length === 0) {
        var applyAllElem = $(".cs-form .apply-all").not(".binf-hidden");
        if (applyAllElem.length > 0) {
          applyAllElem.addClass("binf-hidden");
        }
      }
    },

    updateData: function (eleData) {
      var that = this;
      $.each(eleData, function (idx, val) {
        if (val instanceof Object) {
          for (var key in val) {
            if (val.hasOwnProperty(key)) {
              if (val[key] instanceof Object && val[key].id !== undefined) {
                val[key] = '' + val[key].id;
              }
            }
          }
        }
      });
      return eleData;
    },

    _showItemsInReadMode: function () {
      this._showBulkEditAction();
      this.showInReadMode(this.children);
      if (!!this.focusedOnDocument) {
        if (this.container.parent().find('.cs-form-set-container').length > 0) {
          this.container.parent().find('.cs-form-set-container')[0].focus();
        } else if (this.container.parents(".cs-form").find(".cs-form-set-container").length > 0) {
          this.container.parents(".cs-form").find(".cs-form-set-container")[0].focus();
        }
      }

      this._adjustScrollContainerWidth(false);
      this.isWriteMode = false;
    },
    showInReadMode: function (elements) {
      var that = this;
      $.each(elements, function (indx, child) {
            if (!!child.fieldView) {
              if (!$.isEmptyObject(child.fieldView._behaviors) &&
                  !!child.fieldView.getStatesBehavior() && child.options.mode !== "create") {
                child.fieldView.getStatesBehavior().setStateRead(false);
              }
            } else if (!!child.children) {
              that.showInReadMode(child.children);
            }
          }
      );
    },
    _showItemsInWriteMode: function (itemIndex, setFlag) {
      if (!this.options.prevData) {
        if (this.options.isSetType) {
          var clonedArray = $.map(this.data.slice(), function (obj) {
            return $.extend(true, {}, obj);
          });
          this.options.prevData = clonedArray;
        } else {
          this.options.prevData = this.data.slice();
        }
      }
      if (!this.options.isSetType) {
        this.field.find(".cs-form-set-container .cs-array").removeClass(
            "cs-form-multi-action-container").addClass("cs-form-multi-action-container");
      }
      if (this.options.mode !== "create") {
        this._hideBulkEditAction();
      }
      this.showInWriteMode(this.children,itemIndex);
      var arrWriteObjElements = this.getFieldEl().find('.cs-pull-left .cs-field-write');
      if (!!setFlag && itemIndex !== undefined && itemIndex !== null) {
        var currentContainer = this.container.parent().find(".cs-form-set-container").first();
        $($(currentContainer).children().get(itemIndex)).find(
            '.cs-pull-left .cs-field-write').first().find(":input").focus();
      } else if (itemIndex !== undefined && itemIndex !== null) {
        $(arrWriteObjElements.get(itemIndex)).find(":input").focus();
      }

      if (this.field.find('.csui-set-scroll-container-parent').length > 0) {
        $(this.field).find('.csui-set-scroll-container-child').perfectScrollbar('update');
        $(this.field).find('.cs-form-set-container').addClass('csui-hoveredScrollable');
      }
      this._adjustScrollContainerWidth(true);
      this.isWriteMode = true;
    },

    _adjustScrollContainerWidth: function (toWriteMode) {

      var scrollContainer = this.container.parent().find(".csui-set-scroll-container-parent");
      if ((!this.isWriteMode || !toWriteMode) && scrollContainer.length > 0 &&
          this.options.mode !== "create") {
        if (!this.isWriteMode && !toWriteMode) {
          return;
        }
        var lockedcolsWidth = this.container.find(".csui-lockedcols").width();
        if (toWriteMode) {
          if (i18n && i18n.settings.rtl) {
            this.container.parent().find(".csui-set-scroll-container-parent").css('padding-Right',
                lockedcolsWidth + "px");
            this.container.parent().find(".csui-set-scroll-container-parent").css('padding-Left',
                0 + "px");
          } else {
            this.container.parent().find(".csui-set-scroll-container-parent").css('padding-Left',
                lockedcolsWidth + "px");
          }
        }
        this.container.parent().find(".csui-set-scroll-container-child").perfectScrollbar('update');
      } else {
        return;
      }
    },
    showInWriteMode: function (elements,itemIndex) {
      var that = this;
      $.each(elements, function (index, child) {
        if (!!child.fieldView) {
          if (child.options.customField || child.schema.type === "otcs_user_picker" ||
              child.schema.type === "otcs_member_picker" ||
              child.schema.type === "otcs_node_picker") {
            (!!child.fieldView && !!itemIndex && !$.isEmptyObject(child.fieldView._behaviors) && itemIndex !== index) ?
            child.fieldView.getEditableBehavior().trySetValue() : "";
          }
          if (!$.isEmptyObject(child.fieldView._behaviors) &&
              !!child.fieldView.getStatesBehavior() && !this.schema.readonly) {
            child.fieldView.getStatesBehavior().setStateWrite(false, false);
            if (child.fieldView.childTKLViews.length || child.fieldView.parentViews.length
                || !!child.fieldView.children || child.parentRelations || child.childRelations) {
              if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length > 0) {
                that._updateViewsInWriteMode(child.fieldView);
              }
            }
          }
        } else if (!!child.children) {
          that.showInWriteMode(child.children);
        }
      });
      if (!!this.options.fields.item.isMultiFieldItem) {
        this.field.find(".cs-form-set-container.csui-multivalue-block").removeClass(
            "csui-multivalue-read-block");

        var setContainer = this.field.children('.cs-form-set-container').is("visible");
        if (setContainer.length > 0) {
          setContainer.addClass("csui-multivalue-set-write-mode");
        }
      }
      this.hideColout();
    },
    hideColout: function () {
      this.container.parent().find(".cs-form-set-container").find(".csui-show-colout").addClass(
          "binf-hidden");
      this.container.parent().find(".cs-form-set-container").find(".csui-show-colout").parent(
          '.csui-lockedcols').removeClass('csui-colout-visible');
      this.container.parent().find(".csui-scrollablecols").addClass('csui-scrollable-writemode');
      this.hidePopover();
    },
    hidePopover: function () {
      $('.csui-colout-icon').each(function () {
        if ($(this).data('binf.popover')) {
          $(this).binf_popover('destroy');
        }
      });
    },
    validateContainer: function (elements) {
      var that         = this,
          isFieldValid = true;
      $.each(elements, function (indx, child) {
            if (!!child.fieldView) {
              if (!$.isEmptyObject(child.fieldView._behaviors) &&
                  !!child.fieldView.getStatesBehavior()) {
                if (child.fieldView.alpacaField.type === "select") {
                  if (child.fieldView.getEditValue().get("id") !==
                      child.fieldView.getOldValue().get("id")) {
                    that.options.isBlockModified = true;
                  }
                  isFieldValid = child.fieldView.trySetValue();
                  child.fieldView.ui.writeField.select();
                } else if (child.schema.type === "otcs_user_picker" ||
                           child.schema.type === "otcs_member_picker") {
                  if (child.fieldView.getEditValue().id !== child.fieldView.getValue().id) {
                    if (!(child.fieldView.getEditValue().id === "" &&
                          child.fieldView.getValue().id === null)) {
                      that.options.isBlockModified = true;
                    }
                  }
                  if (!child.fieldView.userPicked) {
                    child.fieldView.alpacaField.refreshValidationState(false);
                    isFieldValid = false;
                  } else {
                    isFieldValid = child.fieldView.setValue(child.fieldView.getEditValue(), true);
                  }
                } else if (child.options.customField || child.schema.type === "otcs_node_picker") {
                  if ((child.fieldView.getEditValue() !== child.fieldView.getOldValue() ||
                       (child.fieldView.getEditValue() === ''))) {
                    that.options.isBlockModified = true;
                    isFieldValid = child.fieldView.setValue(child.fieldView.getEditValue(), true);
                  }
                } else if (child.fieldView.alpacaField.type === "tkl") {
                  if (child.fieldView.getEditValue() !== child.fieldView.getOldValue()) {
                    that.options.isBlockModified = true;
                  }
                  isFieldValid = child.fieldView.trySetValue();
                  if (child.fieldView.needRerender) {
                    child.fieldView.render();
                    delete child.fieldView.needRerender;
                  }
                } else {
                  if (child.fieldView.getEditValue() !== child.fieldView.getValue()) {
                    if (!(child.fieldView.getEditValue() === "" &&
                          child.fieldView.getValue() === null)) {
                      that.options.isBlockModified = true;
                    }
                  }
                  isFieldValid = child.fieldView.setValue(child.fieldView.getEditValue(), true);
                }
                if (isFieldValid) {
                  child.fieldView.$el.removeClass('cs-formfield-invalid');
                  that.isContainerValid = true;
                } else {
                  child.fieldView.$el.addClass('cs-formfield-invalid');
                  that.isContainerValid = false;
                }
              }
            } else if (!!child.children && isFieldValid) {
              that.validateContainer(child.children);
            }
          }
      );
    },

    isMultiFieldView: function (view) {
      return (!view.isTKLField && !view.isNonTKLField) ||
             (view.alpacaField.options.isMultiFieldItem && !!view.alpacaField.parent &&
              !!view.alpacaField.parent.schema.maxItems &&
              view.alpacaField.parent.schema.maxItems > 1);
    },

    validateChildRelations: function (children) {
      if (children) {
        this.validateContainer(children);
        children.map(function (child) {
          if (child.childRelations && child.childRelations.length) {
            this.validateChildRelations(child.childRelations);
          }
        }, this);
      }
    },

    _getFieldIndex: function (el) {
      var index = this.containerItemEl.find('input').index(el);
      if (index === -1) {
        index = this.containerItemEl.find('.cs-field-write button').index(el);
      }
      return index;
    },
    _doBulkSubmitAction: function (isKeyEvent) {
      var triggerEvent = false, lockedcolsWidth, showColoutWidth;
      this.isContainerValid = true;

      this.validateContainer(this.children);
      this.validateChildRelations(this.childRelations);
      if (this.options.mode === "create") {
        if (document.querySelectorAll('.binf-has-error').length === 0) {
          $(".metadata-validation-error").hide();
          $("div").removeClass("show-validation-error");
        }
      }
      if ($(".cs-form .cs-formfield-invalid").length === 0) {
        var arrObjElements = this.getFieldEl().find('.cs-pull-left .cs-field-write'),
            minItems       = this.view.field.schema.items.minItems !== undefined ?
                             this.view.field.schema.items.minItems : 1;
        if (arrObjElements.length >= minItems) {
          if (this.options.isSetType) {
            if (_.flatten(_.map(this.data, _.values)).length !== arrObjElements.length) {
              triggerEvent = true;
            }
          } else {
            if (this.data.length !== arrObjElements.length) {
              triggerEvent = true;
            }
          }
        }

        if (this.isRelatedFieldInFocus(document.activeElement) && !isKeyEvent) {
          return;
        }
        if (this.isContainerValid) {
          if (triggerEvent || !!this.options.isBlockModified) {
            var data = {
              fieldvalue: this.getValue(),
              fieldid: this.name || this.id,
              fieldpath: this.path,
              targetfieldvalue: this.getValue(),
              targetfieldid: this.name,
              targetfieldpath: this.path
            };
            this.options.submitArray = true;
            this.options.submittedData = this.getValue().slice();
            this.options.prevData = undefined;
            this.options.prevChildData = undefined;
            var newEvent = $.Event('field:changed');
            _.extend(newEvent, data);
            this._onFieldChanged(newEvent);
          }
        } else {
          var event = $.Event('field:invalid');
          this.$el.trigger(event);
        }

        if (!!PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.length > 0) {
          var focus = false,
              fieldView;
          for (var i = PubSub.tklHelpers.viewsInWriteMode.length - 1; !!PubSub.tklHelpers && i >= 0;
               i--) {
            fieldView = PubSub.tklHelpers.viewsInWriteMode[i];
            if (fieldView) {
              focus = fieldView === this.view;
              if (!!fieldView) {
                if (fieldView.getEditableBehavior().isMultiFieldView(fieldView)) {
                  if (fieldView.getStatesBehavior().state === 'write') {
                    fieldView = fieldView.alpacaField.parent;
                    fieldView.options.submittedData = fieldView.getValue().slice();
                    fieldView._showItemsInReadMode();
                    fieldView._hideInlineDeleteIcon();
                    fieldView._hideInlineAddIcon();
                    fieldView._showBulkEditAction();
                  }
                } else {
                  fieldView.getEditableBehavior().setViewReadOnlyAndLeaveEditMode(true, false);
                }
              }
            }
          }
        }

        if (this.options.mode !== 'create') {
          this.focusedOnDocument = true;
          this._showItemsInReadMode();
          this._hideInlineDeleteIcon();
          this._hideInlineAddIcon();
          this._showBulkEditAction();
          if (!this.options.isSetType &&
              !$(document.activeElement).closest('.csui-multivalue-block') &&
              !$(document.activeElement).closest('.cs-form-set')) {
            this.containerItemEl.find('.csui-multivalue-block').focus();
          }
        }
        if (this.options.mode !== "create") {
          this.container.parent().find(".cs-form-set-container").find(
              ".csui-show-colout").removeClass("binf-hidden");
          this.container.parent().find(".cs-form-set-container").find(".csui-show-colout").parent(
              '.csui-lockedcols').addClass('csui-colout-visible');
          lockedcolsWidth = this.container.find(".csui-lockedcols").width();
          if (this.container.find(".csui-lockedcols").find(".csui-show-colout").length > 0) {
            showColoutWidth = 0;
          } else {
            showColoutWidth = this.container.find(".csui-show-colout").width();
          }

          if (i18n && i18n.settings.rtl) {
            this.container.parent().find(".csui-set-scroll-container-parent").css('padding-Right',
                (lockedcolsWidth + showColoutWidth) + "px");
            this.container.parent().find(".csui-set-scroll-container-parent").css('padding-Left',
                0 + "px");
          } else {
            this.container.parent().find(".csui-set-scroll-container-parent").css('padding-Left',
                (lockedcolsWidth + showColoutWidth) + "px");
          }
          this.container.parent().find(".csui-set-scroll-container-child").perfectScrollbar(
              'update');

          if (this.container.parent().find('.cs-form-set-container').hasClass(
                  'csui-hoveredScrollable')) {
            this.container.parent().find('.cs-form-set-container').removeClass(
                'csui-hoveredScrollable');
          }
        }
      } else {
        this.hideColout();
      }
      if (this.options.mode !== 'create') {
        if (!this.options.isBlockModified && !this.options.isSetType &&
            !$(document.activeElement).closest('.csui-multivalue-block') &&
            !$(document.activeElement).closest('.cs-form-set')) { //prevent focus as it is
          this.containerItemEl.find('.csui-multivalue-block').focus();
        }
      }
      this.options.isBlockModified = false;
      this.options.submitArray = undefined;
    },

    _doBulkSubmitActionTKL: function (flag, event) {
      var self = this,
          e    = (event === undefined) ? false : event;
      setTimeout(function () {
        var validTKL      = true,
            isTKLModified = false,
            isReadyToSave = self.children[0] && self.children[0].fieldView.isReadyToSave(),
            viewState, curView;

        if (!flag && isReadyToSave) {  //current focus is on another tkl, for tkl it is invert condition
          return;
        }

        if (!flag && self.isRelatedFieldInFocus(document.activeElement) &&
            (!e || e.keyCode !== 113)) {
          return;
        }
        if (PubSub.tklHelpers) {
          for (var i = PubSub.tklHelpers.viewsInWriteMode.length - 1; !!PubSub.tklHelpers && i >= 0;
               i--) {
            if (PubSub.tklHelpers.viewsInWriteMode[i]) {
              viewState = PubSub.tklHelpers.viewsInWriteMode[i].isNonTKLField ?
                          PubSub.tklHelpers.viewsInWriteMode[i].getEditableBehavior() :
                          PubSub.tklHelpers.viewsInWriteMode[i];
              if (validTKL) {
                validTKL = viewState.trySetValue();
              } else {
                viewState.trySetValue();  //validate remaining tkls
              }
              if (!isTKLModified) {
                curView = PubSub.tklHelpers.viewsInWriteMode[i];
                if (self.isMultiFieldView(curView)) {
                  curView = curView.alpacaField.parent;
                  isTKLModified = !_.isEqual(curView.getPreviousData(), curView.getValue());
                } else {
                  isTKLModified = PubSub.tklHelpers.viewsInWriteMode[i].getOldValue() !==
                                  PubSub.tklHelpers.viewsInWriteMode[i].getValue();
                }
              }
            } else {
              return;
            }
          }
        }

        if (validTKL) {
          if (isTKLModified) {
            var data = {
              fieldvalue: self.getValue(),
              fieldid: self.id,
              fieldpath: self.path,
              targetfieldvalue: self.getValue(),
              targetfieldid: self.name,
              targetfieldpath: self.path
            };
            self.options.submitArray = true;
            self.options.submittedData = self.getValue().slice();
            self.options.prevData = undefined;
            self.options.prevChildData = undefined;
            var newEvent = $.Event('field:changed');
            _.extend(newEvent, data);
            self._onFieldChanged(newEvent);
          }

          if (self.options.mode !== 'create' && !!PubSub.tklHelpers) {

            var view;
            for (var j = PubSub.tklHelpers.viewsInWriteMode.length - 1;
                 j >= 0 && !!PubSub.tklHelpers; j--) {
              view = PubSub.tklHelpers.viewsInWriteMode[j];
              if (!!view) {
                if (!view.getEditableBehavior().isMultiFieldView(view)) {
                  if (view.isTKLField) {
                    self.focusedOnDocument = true;
                    view.getEditableBehavior().trySetValueAndLeaveEditMode(false, false);
                  } else {
                    view.setValue(view.getEditValue(), true, true);
                    view.render();
                    if (view.getStatesBehavior().state === 'write') {
                      view.getStatesBehavior().setStateRead(false);
                    }
                  }
                } else {
                  view = view.alpacaField.parent;
                  view.children.map(function(child) {
                    if (!!child.fieldView.needRerender) {
                      child.fieldView.render();
                    }
                  });
                  if (view.isWriteMode) {
                    view.options.submittedData = view.getValue().slice();
                    self.focusedOnDocument = $(e.currentTarget).find(
                            '.csui-multivalue-container')[0] === view.container[0];
                    view._showItemsInReadMode();
                    view._hideInlineDeleteIcon();
                    view._hideInlineAddIcon();
                    view._showBulkEditAction();
                  }
                }
              }
            }

          }
          self.options.submitArray = undefined;
          if (self.options.mode !== 'create' && !!PubSub.tklHelpers &&
              PubSub.tklHelpers.viewsInWriteMode.length === 0) {
            delete PubSub.tklHelpers;
          }
        }
      }, 50);

    },

    _updateViewsInWriteMode: function (view) {
      setTimeout(function () {
        if (!PubSub.tklHelpers) {
          PubSub.tklHelpers = {};
          PubSub.tklHelpers.viewsInWriteMode = [];
        }
        if (!view.isCustomView && PubSub.tklHelpers.viewsInWriteMode.indexOf(view) === -1 &&
            view.$el.is(':visible')) {
          view.cancelClicked = false; // fix for hybrid tkl switching between sa to mv
          if (view.alpacaField.parent) {
            view.alpacaField.parent.cancelClicked = false;
          }
          PubSub.tklHelpers.viewsInWriteMode.push(view);
        }
        if (!PubSub.tklHelpers.tabInView) {
          PubSub.tklHelpers.tabInView = view;
        }
      }, 101);
    },

    isRelatedFieldInFocus: function (relTarget) {
      return PubSub.tklHelpers && PubSub.tklHelpers.viewsInWriteMode.some(function (fieldView) {
            return fieldView.ui.writeField[0] === relTarget;
          });
    },

    _showBulkEditAction: function () {
      this.getFieldEl().find(".csui-bulk-edit").removeClass("binf-hidden");
      this.getFieldEl().find(".csui-bulk-edit-cancel").addClass("binf-hidden");
      this.getFieldEl().find(".csui-array-bulk-edit").addClass("binf-hidden");
    },

    _hideBulkEditAction: function () {
      if (this.getFieldEl().find('.csui-array-bulk-edit').hasClass('binf-hidden')) {
        this.getFieldEl().find('.csui-array-bulk-edit').removeClass('binf-hidden');
      }
      this.getFieldEl().find(".csui-bulk-edit-cancel").removeClass("binf-hidden");
      this.getFieldEl().find(".csui-bulk-edit").addClass("binf-hidden");
    },

    _mouseInArrayBlock: function (event) {
      if (this.options.mode !== 'create' && !this.schema.readonly &&
          $(".cs-form .cs-formfield-invalid").length === 0) {
        this.getFieldEl().find(".csui-array-bulk-edit").removeClass("binf-hidden");
      }
    },

    _mouseOutArrayBlock: function (event) {
      if (this.getFieldEl().find(".csui-bulk-edit-cancel").hasClass("binf-hidden")) {
        this.getFieldEl().find(".csui-array-bulk-edit").addClass("binf-hidden");
      }
      this.getFieldEl().find(".csui-set-action-bar").removeClass("csui-set-action-bar");
    },

    updateToolbars: function () {
      this.base();

      if (this.schema.readonly) {
        this.getFieldEl().find('.cs-pull-right').hide();
      }

      if (base.isTouchBrowser()) {
        this.field.find('.cs-pull-left').click(function () {
          return;
        }); // do nothing
      }

      var ab = this.field.find('.cs-alp-array-buttons').parent()
          .width('2.5em')
          .css('min-width', 0);

      if (!!this.parent.options && !this.parent.options.isSetType) {
        this.field.find('.alpaca-field-otcs_array_buttons').parent().css('min-width', '3em');
      }
      if (this.field.find('.cs-alp-array-buttons').length === 0) {
        this.field.find('.cs-pull-right').attr('title', '');
      }

      return;
    },
    _onFieldChanged: function (event) {
      event.stopPropagation();
      if (!this.options.submitArray) {
        var regExp = /\[([^\]]+)\]\/?([^\]]*)$/;
        var matches = regExp.exec(event.fieldpath);

        if (!!matches && matches.length === 4 && matches[2]) {
          this.data[parseInt(matches[1])][matches[2]] = event.fieldvalue;
        } else {
          this.data[parseInt(matches[1])] = event.fieldvalue;
        }
      }
      if (this.options.submitArray || this.options.mode === 'create') {
        this._raiseValueChanged(this.options.mode === 'create' ? this.getValue() : event.fieldvalue,
            this.name, this.path,
            event.fieldvalue, event.fieldid, event.fieldpath);
        this.options.submitArray = false;
        this._updateSet();
      }

    },

    _updateSet: function () {
      var arrayElem = this.containerItemEl.alpaca('get');
      if (!!arrayElem && !!arrayElem.options.isSetType && !!arrayElem.deletedItemCount) {
        var alpacaForm = arrayElem.parent;  //Get reference of alpaca form
        if (!!alpacaForm) {
          var start = arrayElem.children.length,
              end   = start + arrayElem.deletedItemCount;
          arrayElem.deletedItemCount = 0;
          for (var j = start + 1; j <= end; j++) {
            var itemToRemove = alpacaForm.childrenByPropertyId[arrayElem.propertyId + '_' + j];
            if (!!itemToRemove) {
              alpacaForm.removeItem(itemToRemove.id);
            } else {
              break;
            }
          }
        }
      }
    },

    _raiseValueChanged: function (fieldvalue, fieldid, fieldpath,
        targetfieldvalue, targetfieldid, targetfieldpath) {
      var data = {
        fieldvalue: fieldvalue,
        fieldid: fieldid,
        fieldpath: fieldpath,
        targetfieldvalue: targetfieldvalue,
        targetfieldid: targetfieldid,
        targetfieldpath: targetfieldpath
      };
      var newEvent = $.Event('field:changed');
      _.extend(newEvent, data);
      this.containerItemEl.trigger(newEvent);
      if (this.options.mode === "create") {
        this.parent.data[this.propertyId] = this.getValue();
        this.data = fieldvalue;
      }
      else {
        this.parent.data[this.propertyId] = fieldvalue;
        this.data = fieldvalue.slice();
        if (!!this.options && !!this.options.isSetType) {
          if (this.children.length === this.data.length) {
            for (var i = 0; i < this.children.length; i++) {
              this.children[i].data = this.data[i];
            }
          }
        }
      }

      return;
    },

    _validateAllFieldsFilled: function () {
      var bAllFieldsFilled = true;
      if (this.schema.required) {
        _.each(this.data, function (curFieldValue) {
          if (!curFieldValue) {
            bAllFieldsFilled = false;
          }
        });
      }

      return bAllFieldsFilled;
    },

    getFieldType: function () {
      return 'array';
    }

  });

  Alpaca.registerFieldClass('array', Alpaca.Fields.CsuiArrayField, 'bootstrap-csui');
  Alpaca.registerFieldClass('array', Alpaca.Fields.CsuiArrayField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiArrayField;
});
