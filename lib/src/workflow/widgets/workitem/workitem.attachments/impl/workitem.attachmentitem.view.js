/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/log',
  'csui/controls/globalmessage/globalmessage',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachment.tableactionbar',
  'csui/controls/node-type.icon/node-type.icon.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.toolbaritems',
  'workflow/commands/open.shortlink/open.shortlink',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function (_, $, Marionette, DefaultActionBehavior, log, GlobalMessage,
    TableActionBarView, NodeTypeIconView, toolbarItems, OpenShortlinkCommand, template, lang) {
  'use strict';
  var WorkItemAttachmentItemView = Marionette.ItemView.extend({
    className: 'workitem-attachment-properties',
    template: template,
    tagName: 'li',
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    templateHelpers: function () {
      var attachmentNodeId;
      if (this.model.attributes.id) {
        attachmentNodeId = this.model.attributes.id;
      }
      else if (this.model.attributes.original_id) {
        attachmentNodeId = this.model.attributes.original_id;
      }
      return {
        name: this.model.get('name'),
        description: this.model.get('description'),
        defaultActionUrl: DefaultActionBehavior.getDefaultActionNodeUrl(this.model),
        descriptionPlaceholder: lang.DescriptionPlaceholder,
        namePlaceholder: lang.NamePlaceholder,
        nodeId: attachmentNodeId,
        cancel: lang.Cancel
      };
    },

    ui: {
      attachmentItem: '.workitem-attachments-item',
      attachmentIcon: '.workitem-attachments-icon',
      attachmentAction: 'a.workitem-attachments-name',
      attachmentDescription: 'div.workitem-attachments-description',
      attachmentDescriptionRO: 'span.workitem-attachments-description-ro',
      attachmentDescriptionInput: '.workitem-attachments-description-input',
      attachmentDescriptionCancel: '.workitem-attachments-description-cancel',
      attachmentNameInput: '.workitem-attachments-name-input',
      attachmentName: '.workitem-attachment-name',
      attachmentErrorMsg: '.workitem-attachments-error-message',
      attachmentNameCancel: '.workitem-attachments-name-cancel',
      attachmentEmptyDescriptionRO: '.workitem-attachments-empty-description-ro'
    },

    events: {
      'keydown': 'onKeyDown',
      'mouse:enter': 'onMouseEnter',
      'mouse:leave': 'onMouseLeave',
      'focusin @ui.attachmentAction': 'onFocusIn',
      'focusout @ui.attachmentItem': 'onFocusOutItem',
      'click @ui.attachmentAction': 'onClickItem'
    },
    triggers: {
      'mouseenter': 'mouse:enter',
      'mouseleave': 'mouse:leave',
      'click @ui.attachmentDescriptionRO, @ui.attachmentEmptyDescriptionRO': 'click:description',
      'click @ui.attachmentDescriptionCancel,@ui.attachmentNameCancel': 'click:cancel'
    },
    constructor: function WorkItemAttachmentItemView(options) {
      this.options = options;
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.iconView = new NodeTypeIconView({node: this.model});
      this.listenTo(this.model, "change:csuiInlineFormErrorMessage", this.onRenameMode);
      this.listenTo(this.model, 'change:ActionBarShortcutOpenCommand', this.openShortlink);
    },

    onKeyDown: function (event) {
      var keyCode = event.keyCode,
          target  = $(event.target),
          retVal  = true;
      switch (keyCode) {
      case 9: //Tab
        if (target.hasClass('workitem-attachments-description-input') &&
            this.ui.attachmentDescriptionCancel.hasClass("binf-hidden")) {
          this.ui.attachmentNameInput.focus();
          retVal = false;
        }
        if (target.hasClass('workitem-attachments-name-input')) {
          this.ui.attachmentDescriptionInput.focus();
          retVal = false;
        }
        if (target.hasClass('workitem-attachments-description-input') &&
            this.ui.attachmentNameCancel.hasClass("binf-hidden")) {
          this.ui.attachmentDescriptionInput.focus();
          retVal = false;
        }
        break;
      case 27: //Esc
        if (target.hasClass('cs-input') || target.hasClass('edit-cancel')) {
          this._cancelEdit();
          retVal = false;
        }
        break;
      case 32: //Enter and space
      case 13:
        if (target.hasClass('cs-input')) {
          if (keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            retVal = false;
            if (this.validateFileName() && !this._parent.errorCase) {
              this._submitDescription();
              this._cancelEdit();
            }
          }
        } else if (target.hasClass('edit-cancel')) {
          event.preventDefault();
          event.stopPropagation();
          retVal = false;
          this._cancelEdit();
        }
        break;
      case 113:
        if (!this.ui.attachmentDescriptionRO.hasClass('binf-hidden') ||
            !this.ui.attachmentEmptyDescriptionRO.hasClass('binf-hidden')) {
          this.onRenameMode();
        }
        if (target.hasClass('cs-input')) {
          event.preventDefault();
          event.stopPropagation();
          retVal = false;
          if (this.validateFileName() && !this._parent.errorCase) {
            this._submitDescription();
            this._cancelEdit();
          }
        }
        break;
      }
      return retVal;
    },

    onFocusIn: function (view) {
      this._showActionBar({
        view: view,
        model: view.model
      });
    },

    onMouseEnter: function (view) {
      this._showActionBar({
        view: view,
        model: view.model
      });
    },

    onMouseLeave: function (view) {
      this._destroyActionBar();
    },

    onClickItem: function (event) {
      event.preventDefault();
      this.cancelPrevEdit();
      this.triggerMethod('execute:defaultAction', this.model);
    },

    onClickDescription: function (e) {
      this._editDescription();
    },
    onClickCancel: function (e) {
      this._cancelEdit();
    },
    onFocusOutItem: function (event) {
      var relatedTarget = $(event.relatedTarget);
      if (!relatedTarget.hasClass('cs-input') && !relatedTarget.hasClass('edit-cancel') &&
          !$(event.target).hasClass('edit-cancel') && !$(event.target).hasClass('needsclick')) {
        if (this.isEditMode() && this.validateFileName() && !this._parent.errorCase) {
          this._submitDescription();
          var flag           = false,
              activeElements = ($(':active').length) ? $(':active') : $(':hover'),
              activeElement  = $(activeElements[activeElements.length - 1]);
          if (activeElement.hasClass('workitem-attachment-description') ||
              activeElement.hasClass('workitem-attachment-name') ||
              activeElement.hasClass('icon icon-toolbar-rename')) {
            flag = true;
          }
          if (!flag) {
            this._cancelEdit();
          }
        }
        else {
          if ((relatedTarget.hasClass('csui-toolitem') === false) &&
              (relatedTarget.hasClass('workitem-expand-icon') === false)) {
            this._destroyActionBar();
            this.$(".workitem-attachments-name").prop('tabindex', '0');
          }
        }
      }
    },
    _editDescription: function () {
      var commandCS = this.model.actions.findWhere({signature: 'Rename'});
      var commandCI = this.model.actions.findWhere({signature: 'rename'});
      if (!_.isUndefined(commandCS) || !_.isUndefined(commandCI) && !this._parent.errorCase) {
        this.cancelPrevEdit();
        this._destroyActionBar();

        if (!this.ui.attachmentDescriptionRO.hasClass('binf-hidden') ||
            !this.ui.attachmentEmptyDescriptionRO.hasClass('binf-hidden')) {
          var desc = this.model.get('description');
          this.ui.attachmentDescriptionInput.val(desc);

          if (this.model.get('description')) {
            this.ui.attachmentDescriptionRO.addClass('binf-hidden');
          } else {
            this.ui.attachmentEmptyDescriptionRO.addClass('binf-hidden');
          }

          this.ui.attachmentDescriptionInput.removeClass('binf-hidden');
          this.ui.attachmentDescriptionCancel.removeClass('binf-hidden');
          this.ui.attachmentItem.addClass('workitem-attachments-description-edit');
          this.ui.attachmentDescriptionInput.focus();
          this._parent.editMode = this.model.get('id');
          this.triggerMethod('editmode:item', this);
        }
      }
    },

    _submitDescription: function () {
      if (this.ui.attachmentDescriptionRO.hasClass('binf-hidden')) {
        var newDesc = this.ui.attachmentDescriptionInput.val().trim();
        var oldDesc = this.model.get('description');
        var newName = this._checkName();
        var oldName = this.model.get('name');
        if (newName.length === 0) {
          this._cancelEdit();
        } else {
          this.model.set({'name': newName, 'description': newDesc});
          this.model.save({'name': newName, 'description': newDesc},
              {wait: true, patch: true, includeActions: true})
              .done(_.bind(function () {
                var tempNode = this.model.clone();
                tempNode.collection = this.model.collection;
                tempNode.fetch()
                    .then(_.bind(function () {
                      this.model.set(tempNode.attributes);
                      if (tempNode.original) {
                        this.model.original = tempNode.original;
                      }
                      if (this.$(".workitem-attachments-actions>div>ul>li>a.csui-toolitem").length > 0) {
                        this._updateActionBarAndPrepareKeyboardAccess();
                      }
                    }, this));
              }, this))
              .fail(_.bind(function (error) {
                GlobalMessage.showMessage('error', error.responseJSON.error);
                this.model.set({'name': oldName, 'description': oldDesc});
                this.model.fetch();
                this.render();
              }, this));
          this._parent.errorCase = false;
        }
      }
    },

    _checkName: function () {
      return this.ui.attachmentName.hasClass("binf-hidden") &&
             this.ui.attachmentDescriptionRO.hasClass("binf-hidden") ?
             this.ui.attachmentNameInput.val().trim() : this.model.get("name");
    },
    _cancelEdit: function () {
      if (this.ui.attachmentDescriptionRO.hasClass('binf-hidden')) {
        this.ui.attachmentErrorMsg.text('');
        this.ui.attachmentErrorMsg.attr('title', '');
        this.ui.attachmentErrorMsg.addClass("binf-hidden");
        this.$el.find("#workitem-attachments-name-input-" + this.model.attributes.id).removeClass(
            "workitem-attachments-error-display");
        this.ui.attachmentItem.removeClass('workitem-attachments-edit-error');
        this.ui.attachmentDescriptionInput.addClass('binf-hidden');
        this.ui.attachmentDescriptionCancel.addClass('binf-hidden');
        if (this.model.get('description')) {
          this.ui.attachmentDescriptionRO.removeClass('binf-hidden');
        } else {
          this.ui.attachmentEmptyDescriptionRO.removeClass('binf-hidden');
        }
        this.ui.attachmentName.removeClass('binf-hidden');
        this.ui.attachmentNameInput.addClass("binf-hidden");
        this.ui.attachmentNameCancel.addClass('binf-hidden');
        this.ui.attachmentItem.removeClass('workitem-attachments-actions-display');
        this.ui.attachmentItem.removeClass('workitem-attachments-description-edit');

        var name        = this.model.get('name'),
            description = this.model.get('description');
        this.ui.attachmentName.text(name);
        this.ui.attachmentName.attr('title', name);
        this.ui.attachmentDescriptionRO.text(description);
        this.ui.attachmentDescriptionRO.attr('title', description);
        delete this._parent.editMode;
        this.triggerMethod('editmode:item', this);
        this._parent.errorCase = false;
      }
    },
    isEditMode: function () {
      if (this._parent.editMode && ( this.model.get('id') === this._parent.editMode )) {
        return true;
      } else {
        return false;
      }
    },

    onRender: function () {
      this.iconView.render();
      this.ui.attachmentIcon.prepend(this.iconView.$el);
      if (this.model.get('description')) {
        this.ui.attachmentDescriptionRO.removeClass('binf-hidden');
      } else {
        var mapsList = this.options.view.model.get('mapsList');
        if (((mapsList && mapsList.length === 1) || !this.options.view.model.get('isDoc')) &&
            !this.options.view.model.get('isWFStatusItemAttachment')) {
          this.ui.attachmentEmptyDescriptionRO.removeClass('binf-hidden');
        }
      }
      if (this.options.defaultActionController &&
          !this.options.defaultActionController.hasAction(this.model)) {
        var inactiveClass = 'workitem-attachment-inactive';
        this.$el.find(".workitem-attachments-icon").addClass(inactiveClass);
        this.$el.find(".workitem-attachments-name").addClass(inactiveClass);
      }
      if (this.model.isLocallyCreated && this.model.collection.singleFileUpload) {
        _.delay(_.bind(function () {
          this._editDescription();
          this.model.isLocallyCreated = undefined;
          this.model.collection.singleFileUpload = undefined;
        }, this), 500);
      }

      if (this.model.attributes) {
        var mimeTypeFromModel = this.model.get("mime_type");
      }
      var title = mimeTypeFromModel || this.model.get("type_name") || this.model.get("type");
      if (this.model.get("name") && title) {
        var linkTitleAria = _.str.sformat(lang.linkTitleAria, this.model.get("name"), title);
        this.$el.find(".workitem-attachments-name").attr("aria-label", linkTitleAria);
      }
    },

    _updateActionBarAndPrepareKeyboardAccess: function () {
      this.tableActionBarView.$el.find(".binf-dropdown-menu").addClass('binf-dropdown-menu-right');
      this.tableActionBarView.$el.find(".binf-dropdown-toggle").addClass('workitem-expand-icon');
      var that = this;
      this._parent.inlineItemIndex = 0;
      this._parent.inlineItemDropDownIndex = -1;
      this._parent.$inlineItems = this.$(".workitem-attachments-name");
      var $toolItems = this.$(".workitem-attachments-actions>div>ul>li>a.csui-toolitem");
      $toolItems.prop('tabindex', '-1');
      var $expandIcon = this.$(".workitem-attachments-actions .binf-dropdown-toggle");
      $expandIcon.prop('tabindex', '-1');
      _.each($toolItems, function ($toolItem) {
        that._parent.$inlineItems.push($toolItem);
      });
      _.each($expandIcon, function ($expandIconSolo) {
        that._parent.$inlineItems.push($expandIconSolo);
      });
      this._parent.inlineDropDownIsOpenSelector = "li.binf-dropdown.binf-open";
      var $dropDownMenus = this.$(".workitem-attachments-actions .binf-dropdown-menu a");
      $dropDownMenus.prop('tabindex', '-1');

      this._parent.$inlineItemsDropDown = [];
      _.each($dropDownMenus, function ($dropDownMenu) {
        that._parent.$inlineItemsDropDown.push($dropDownMenu);
      });
      that._parent.$inlineItemsDropDown = this.$(that._parent.$inlineItemsDropDown);
    },

    _showActionBar: function (args) {
      if (this.isEditMode()) {
        return;
      }
      this._destroyActionBar();
      if (this.defaultActionController && this.defaultActionController.hasAction(this.model)) {
        this.defaultActionController.commands.add(new OpenShortlinkCommand());
      } else {
        this.defaultActionController.commands.remove([{id: "OpenShortlink"}]);
      }
      this.tableActionBarView = new TableActionBarView(_.extend({
            context: this.options.context,
            commands: this.defaultActionController.commands,
            collection: toolbarItems.inlineActionbar,
            model: this.model,
            container: this.options.container,
            originatingView: this.options.view,
            containerCollection: this.model.collection //attachment collection
          }, toolbarItems.inlineActionbar.options, {
            inlineActionBarStyle: 'csui-table-actionbar-bubble'
          })
      );
      this.tableActionBarView.actionState.set('state', 'full');
      this.tableActionBarView.render();
      this.tableActionBarView.triggerMethod("before:show");
      this.tableActionBarView.triggerMethod("show");
      var container = this.$el.find('.workitem-attachments-actions');
      container.append(this.tableActionBarView.$el);
      container.addClass('workitem-attachments-actions-full');
      this.tableActionBarView.triggerMethod("after:show");
      this._updateActionBarAndPrepareKeyboardAccess();
    },

    openShortlink: function () {
      this._destroyActionBar();
      this.triggerMethod('execute:defaultAction', this.model);
    },

    _destroyActionBar: function (args) {
      if (this.tableActionBarView) {
        var actionBarDiv = this.$el;
        actionBarDiv.removeClass('workitem-attachments-actions-full');
        this.tableActionBarView.destroy();
        this.tableActionBarView = null;
      }
    },

    onRenameMode: function () {
      var commandCS = this.model.actions.findWhere({signature: 'Rename'});
      var commandCI = this.model.actions.findWhere({signature: 'rename'});
      if (!_.isUndefined(commandCS) || !_.isUndefined(commandCI) && !this._parent.errorCase) {

        if (!this.ui.attachmentName.hasClass('binf-hidden')) {
          this.cancelPrevEdit();
          this._destroyActionBar();

          var fileName = this.model.get("name");
          this.ui.attachmentNameInput.val(fileName);

          this.ui.attachmentName.addClass('binf-hidden');
          this.ui.attachmentErrorMsg.addClass('binf-hidden');
          this.ui.attachmentNameInput.removeClass("binf-hidden");
          this.ui.attachmentItem.addClass('workitem-attachments-actions-display');

          var desc = this.model.get('description');
          this.ui.attachmentDescriptionInput.val(desc);

          if (this.model.get('description')) {
            this.ui.attachmentDescriptionRO.addClass('binf-hidden');
          } else {
            this.ui.attachmentEmptyDescriptionRO.addClass('binf-hidden');
          }
          this.ui.attachmentDescriptionInput.removeClass('binf-hidden');
          this.ui.attachmentNameCancel.removeClass('binf-hidden');
          this.ui.attachmentNameInput.focus();

          var selEnd = (fileName !== undefined && fileName !== '') ? fileName.length : 0;
          if (fileName.lastIndexOf('.') > 0 && fileName.lastIndexOf('.') < fileName.length - 1) {
            selEnd = fileName.lastIndexOf('.');
          }
          document.getElementById(
              "workitem-attachments-name-input-" + this.model.attributes.id).setSelectionRange(0,
              selEnd);
          this._parent.editMode = this.model.get('id');
          this.triggerMethod('editmode:item', this);

        }
      }
    },

    validateFileName: function () {
      var that                 = this,
          validFileName        = true,
          maxLength            = 248,
          maxLengthMsg         = lang.MaxLengthReached,
          fileAlreadyExistsMsg = lang.FileAlreadyExists,
          fileName;
      that._parent.errorCase = false;
      if (that.ui.attachmentName.hasClass('binf-hidden') &&
          that.ui.attachmentDescriptionRO.hasClass('binf-hidden')) {
        fileName = that.ui.attachmentNameInput.val();
        if (fileName.length > maxLength) {
          validFileName = that.setErrorMessage(maxLengthMsg);
        } else {
          that.model.collection.forEach(function (model) {
            if (fileName && fileName !== that.model.get('name') &&
                fileName.toLowerCase() === (model.attributes.name).toLowerCase()) {
              fileAlreadyExistsMsg = _.str.sformat(fileAlreadyExistsMsg, fileName);
              validFileName = that.setErrorMessage(fileAlreadyExistsMsg);
            }
          });
        }
      }
      return validFileName;
    },
    setErrorMessage: function (message) {
      this.$el.find("#workitem-attachments-name-input-" + this.model.attributes.id).addClass(
          "workitem-attachments-error-display");
      this.ui.attachmentItem.addClass('workitem-attachments-edit-error');
      this.ui.attachmentErrorMsg.text(message);
      this.ui.attachmentErrorMsg.attr('title', message);
      if (this.ui.attachmentErrorMsg.hasClass("binf-hidden")) {
        this.ui.attachmentErrorMsg.removeClass("binf-hidden");
      }
      this._parent.errorCase = true;
      return false;
    },
    cancelPrevEdit: function () {
      var edit, editItem;
      if (this._parent.$el.find(
              '.workitem-attachments-item.workitem-attachments-actions-display').length) {
        edit = 'workitem-attachments-actions-display';
      }
      else if (this._parent.$el.find(
              '.workitem-attachments-item.workitem-attachments-description-edit').length) {
        edit = 'workitem-attachments-description-edit';
      }
      editItem = this._parent.$el.find('.' + edit);

      if (editItem.length) {
        editItem.removeClass(edit);
        editItem.find('.workitem-attachments-description-input').addClass('binf-hidden');
        editItem.find('.edit-cancel').addClass('binf-hidden');
        editItem.find('.workitem-attachment-name').removeClass('binf-hidden');
        editItem.find('.workitem-attachments-name-input').addClass("binf-hidden");
        editItem.find('.workitem-attachments-error-message').addClass("binf-hidden");

        var that                          = this,
            name,
            description,
            attachmentNameEle             = editItem.find('.workitem-attachment-name'),
            attachmentDescriptionEle      = editItem.find(
                'span.workitem-attachments-description-ro'),
            attachmentEmptyDescriptionEle = editItem.find(
                'span.workitem-attachments-empty-description-ro');

        _.each(this._parent.collection.models, function (model) {
          if (model.get('id') === that._parent.editMode) {
            name = model.get('name');
            description = model.get('description');
            if (description) {
              editItem.find('span.workitem-attachments-description-ro').removeClass('binf-hidden');
              attachmentDescriptionEle.text(description);
              attachmentDescriptionEle.attr('title', description);
            } else {
              editItem.find('span.workitem-attachments-empty-description-ro').removeClass(
                  'binf-hidden');
              attachmentEmptyDescriptionEle.text(lang.DescriptionPlaceholder);
              attachmentEmptyDescriptionEle.attr('title', lang.DescriptionPlaceholder);
            }
            attachmentNameEle.text(name);
            attachmentNameEle.attr('title', name);
            if (that._parent.errorCase === true) {
              that._parent.errorCase = false;
              delete that._parent.editMode;
              editItem.find("#workitem-attachments-name-input-" + model.attributes.id).removeClass(
                  "workitem-attachments-error-display");
            }
          }
        });
      }
    }
  });

  return WorkItemAttachmentItemView;

});
