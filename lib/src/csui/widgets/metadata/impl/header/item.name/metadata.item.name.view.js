/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/node-type.icon/node-type.icon.view',
  'hbs!csui/widgets/metadata/impl/header/item.name/metadata.item.name',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu.view',
  'csui/widgets/metadata/header.dropdown.menu.items',
  'csui/widgets/metadata/header.dropdown.menu.items.mask',
  'csui/models/version', 'csui/behaviors/item.name/item.name.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'i18n', 'css!csui/widgets/metadata/impl/metadata',
  'css!csui/widgets/metadata/impl/header/item.name/metadata.item.name'
], function ($, _, Backbone, Marionette, NodeTypeIconView, template, lang,
    DropdownMenuView, dropdownMenuItems, DropdownMenuItemsMask, VersionModel,
    ItemNameBehavior, TabableRegionBehavior, ViewEventsPropagationMixin, i18n) {
  'use strict';

  var MetadataItemNameView = Marionette.ItemView.extend({

        className: 'cs-metadata-item-name-container',
        template: template,

        templateHelpers: function () {
          return {
            name: this.modelHasEmptyName ? (this.readonly ? this.placeHolderName : '') :
                  this.options.model.get("name"),
            edit_name: this.modelHasEmptyName ? '' : this.options.model.get("name"),
            edit_name_id: _.uniqueId('cs-metadata-edit-name'),
            placeholder_text: this.placeHolderName,
            nameAria: this.options.model.get("name") || lang.emptyObjectNameAria,
            edit_name_tooltip: lang.editNameTooltip,
            cancel_edit_name_tooltip: lang.cancelEditNameTooltip,
            switch_language_tooltip: lang.switchLanguageTooltip,
            show_dropdown_menu: this.options.showDropdownMenu ? true : false,
            read_only: this.options.model instanceof VersionModel || this.readonly,
            goBack: lang.goBackTooltip,
            sidebarToggleTitle: lang.expand,
            hideCancelButton: this.options.mode && this.options.mode === 'create'
          };
        },

        ui: {
          name: '.title',
          nameEditIconDiv: '.title-edit-icon-div',
          nameEditIcon: '.csui-icon-edit',
          nameEditDiv: '.title-edit-div',
          nameInput: '.title-input',
          nameEditCancelIcon: '.edit-cancel',
          titleError: '.title-error',
          toggleIcon: '.csui-metadata-listview',
          toggleWrapper: '.csui-toggle-wrapper',
          backEle: '.arrow_back'
        },

        modelEvents: {
          'change': 'render'
        },

        events: {
          'keydown': 'onKeyInView',
          'mouseenter': 'onMouseEnterName',
          'mouseleave': 'onMouseLeaveName',
          'click @ui.nameEditIcon': 'onClickName',
          'keydown @ui.nameInput': 'onKeyDown',
          'click @ui.toggleIcon': 'toggleSideBar',
          'click @ui.backEle': 'goBack',
          'keydown @ui.toggleIcon': 'toggleSideBar',
          'keydown @ui.backEle': 'goBack',
          'keydown @ui.toggleWrapper': '_onKeyInView'
        },

        behaviors: function () {
          return {
            ItemName: {
              behaviorClass: ItemNameBehavior,
              nameSchema: this._nameSchema,
              mode: this.options.mode
            },
            TabableRegionBehavior: {
              behaviorClass: TabableRegionBehavior
            }
          };
        },

        toggleSideBar: function (event) {
          if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
            this.toggleSideBarEvent();
            event.preventDefault();
            event.stopPropagation();
          }
        },

        toggleSideBarEvent: function () {
          if (this.leftBar && this.leftBar.length > 0) {
            var parentWrapper = this.leftBar.closest(".metadata-navigation");
            if (!!parentWrapper) {
              if (parentWrapper.length > 0) {
                var sideBarEle = this.leftBar;
                if (sideBarEle.length > 0) {
                  if (parentWrapper.hasClass('csui-hide-side-bar')) {
                    parentWrapper.toggleClass("csui-hide-side-bar");
                    $(sideBarEle).show('blind', {direction: this.direction}, '200', function () {
                      $(window).trigger("resize.tableview");
                    });
                    $(this.ui.backEle).hide();
                    $(this.ui.toggleIcon).attr('title', lang.collapse).attr('aria-label',
                        lang.collapse);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-collapse-icon').removeClass(
                        'csui-metadata-listview-expand-icon');
                    this.sideBarHidden = false;
                  } else {
                    var that = this;
                    $(sideBarEle).hide('blind', {direction: this.direction}, '200', function () {
                      parentWrapper.toggleClass("csui-hide-side-bar");
                      $(window).trigger("resize.tableview");
                    });
                    $(that.ui.backEle).show().focus();
                    this.sideBarHidden = true;
                    $(this.ui.toggleIcon).attr('title', lang.expand).attr('aria-label', lang.expand);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-expand-icon').removeClass(
                        'csui-metadata-listview-collapse-icon');
                  }
                  $(sideBarEle).promise().done(function () {
                    var event = $.Event('toggled:navigationbar');
                    this.closest('.metadata-navigation').find('.cs-metadata').trigger(event);
                  });
                }
              }
            }
          }
        },
        ensureTitleLabelIcon: function () {
          if (this.leftBar && this.leftBar.length > 0) {
            var parentWrapper = this.leftBar.closest(".metadata-navigation");
            if (!!parentWrapper) {
              if (parentWrapper.length > 0) {
                var sideBarEle = this.leftBar;
                if (sideBarEle.length > 0) {
                  if (parentWrapper.hasClass('csui-hide-side-bar')) {
                    $(this.ui.toggleIcon).attr('title', lang.expand).attr('aria-label', lang.expand);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-expand-icon').removeClass(
                        'csui-metadata-listview-collapse-icon');
                  } else {
                    $(this.ui.toggleIcon).attr('title', lang.collapse).attr('aria-label',
                        lang.collapse);
                    $(this.ui.toggleIcon).addClass('csui-metadata-listview-collapse-icon').removeClass(
                        'csui-metadata-listview-expand-icon');
                  }
                }
              }
            }
          }
        },

        constructor: function MetadataItemNameView(options) {
          options || (options = {});
          this._nameSchema = _.extend({
            required: true,
            readonly: false
          }, options.nameSchema);
          this.listenTo(options.model, "change:name", this._updateName);

          this.direction = !!i18n.settings.rtl ? 'right' : 'left';

          Marionette.ItemView.prototype.constructor.call(this, options);

          this.readonly = this._nameSchema.readonly;
          this.placeHolderName = lang.addItemPlaceHolderName;
          var name = this.model.get("name");
          this.modelHasEmptyName = name ? false : true;
          this._createDropdownMenu();

          $(window).bind('resize', {view: this}, this._onWindowResize);

        },

        goBack: function (event) {
          if (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click') {
            this.options.originatingView.triggerMethod('metadata:close');
            event.preventDefault();
            event.stopPropagation();
          }
        },

        _applyToggle: function () {
          if (!!this.sideBarHidden) {} else {
            this.ui.toggleWrapper instanceof Object &&
            this.ui.toggleWrapper.removeClass('binf-hidden');
            this.$el.addClass("csui-metadata-header-with-toggle");
            if (this.options.originatingView && !!this.options.originatingView.mdn &&
                !!this.options.originatingView.mdn.$el.is(":visible")) {
              if (this.ui.backEle instanceof Object) {
                this.ui.backEle.hide();
              }
            }
          }
        },

        _removeToggle: function () {
          if (this.ui.toggleWrapper instanceof Object) {
            this.ui.toggleWrapper.addClass('binf-hidden');
            this.$el.removeClass("csui-metadata-header-with-toggle");
          }
          if (!!this.sideBarHidden) {
            this.toggleSideBarEvent();
          }
        },

        onDestroy: function () {
          this._destroyDropdownMenu();
        },

        _updateName: function () {
          var name = this.model.get("name");
          this.modelHasEmptyName = name ? false : true;
          this.render();
          var focus = $(this.ui.nameInput).is(":focus");
          this._toggleEditMode(focus || this.modelHasEmptyName || false, false);
          this.validate();
        },

        _destroyDropdownMenu: function () {
          if (this.dropdownMenuView) {
            this.cancelEventsToViewsPropagation(this.dropdownMenuView);
            this.dropdownMenuView.destroy();
          }
        },

        _createDropdownMenu: function () {
          if (this.options.showDropdownMenu) {
            var oView = this.options.originatingView;
            var toolItems,
                toolItemsMask = this.options.toolbarItemsMask;
            if (oView && oView.options && oView.options.toolbarItems &&
                oView.options.toolbarItems.dropdownMenuListInProperties) {
              toolItems = oView.options.toolbarItems.dropdownMenuListInProperties;
            } else {
              toolItems = dropdownMenuItems.dropdownMenuList;
            }
            if (!toolItemsMask) {
              toolItemsMask = new DropdownMenuItemsMask();
            }
            if (this.options.showPermissionView) {
              toolItems = toolItems.collection.filter(
                  function (command) {
                    return (command.get("signature") != "permissions");
                  });
            } else {
              toolItems = toolItems.collection.filter(
                  function (command) {
                    return (command.get("signature") != "Properties");
                  });
            }
            this._destroyDropdownMenu();
            var ddm = this.dropdownMenuView = new DropdownMenuView({
              model: this.options.model,
              container: this.options.container,
              containerCollection: this.options.collection || this.options.containerCollection,
              toolItems: toolItems,
              toolItemsMask: toolItemsMask,
              originatingView: this.options.originatingView,
              context: this.options.context,
              commands: this.options.commands,
              metadataScenario: this.options.metadataScenario
            });
            this.listenTo(ddm, 'rename', _.bind(this._toggleEditMode, this, true));
            this.listenTo(ddm, 'metadata:item:before:delete', _.bind(function (args) {
              this.trigger('metadata:item:before:delete', args);
            }, this));
            this.listenTo(ddm, 'metadata:item:before:move', _.bind(function (args) {
              this.trigger('metadata:item:before:move', args);
            }, this));
            this.listenTo(ddm, 'metadata:item:deleted', _.bind(function (args) {
              this.trigger('metadata:item:deleted', args);
            }, this));
            ddm.$el.bind('keydown', _.bind(function (event) {
              if (event.keyCode === 9 && event.shiftKey) {
                if (this.ui.backEle.is(':visible') || this.ui.toggleIcon.is(':visible')) {
                  this.ui.name.prop('tabindex', 0);
                  event.stopPropagation();
                }
              }
            }, this));
            this.propagateEventsToViews(this.dropdownMenuView);
          }
        },

        _onWindowResize: function (event) {
          if (event && event.data && event.data.view) {
            var self = event.data.view;
            if (self.resizeTimer) {
              clearTimeout(self.resizeTimer);
            }

            self.resizeTimer = setTimeout(function () {
              self._setHideShowToggleButton();

            }, 200);
          }
        },

        _setHideShowToggleButton: function (event) {

          var isLandscape = window.matchMedia("(orientation: landscape)").matches,
              isPortrait  = window.matchMedia("(orientation: portrait)").matches,
              self        = !!event && !!event.data && !!event.data.view ? event.data.view : this;

          self.leftBar = self.options.originatingView &&
                         self.options.originatingView.$el.find(".metadata-sidebar");

          if (self.leftBar && self.leftBar.length > 0) {
            var navBar = self.leftBar.closest(".metadata-navigation");
            if (isLandscape) {
              if (window.innerWidth <= 1280) {
                if (!!self.sideBarHidden) {
                  self.ui.toggleWrapper instanceof Object &&
                  self.ui.toggleWrapper.removeClass('binf-hidden');
                  if (self.ui.backEle instanceof Object) {
                    self.ui.backEle.css({display: "inline-block", positin: "relative"});
                    self.ui.backEle.attr("tabindex", 0);
                  }
                  this.ensureTitleLabelIcon();
                } else {
                  self._applyToggle(event);
                  self.leftBar.removeClass('binf-hidden');
                  if (navBar.hasClass('csui-hide-side-bar')) {
                    self.leftBar.show();
                    navBar.toggleClass("csui-hide-side-bar");
                    if (self.ui.backEle instanceof Object) {
                      self.ui.backEle.hide();
                    }
                    $(window).trigger("resize.tableview");
                  }
                  this.ensureTitleLabelIcon();
                }
              } else {
                this.sideBarHidden = false;
                self._removeToggle(event);
                if (navBar.hasClass('csui-hide-side-bar')) {
                  self.leftBar.show();
                  navBar.toggleClass("csui-hide-side-bar");
                  if (self.ui.backEle instanceof Object) {
                    self.ui.backEle.hide();
                  }
                }
                $(window).trigger("resize.tableview");
                this.ensureTitleLabelIcon();
              }
            } else if (isPortrait) {
              self._applyToggle(event);
              if (self.leftBar.length > 0) {
                if (!navBar.hasClass('csui-hide-side-bar')) {
                  self.leftBar.hide();
                  navBar.toggleClass("csui-hide-side-bar");
                  $(window).trigger("resize.tableview");
                }
                if (self.ui.backEle instanceof Object) {
                  self.ui.backEle.css({display: "inline-block", positin: "relative"});
                  self.ui.backEle.attr("tabindex", 0);
                }
              }
              this.ensureTitleLabelIcon();
            }
          }
        },

        currentlyFocusedElement: function () {
          if (!!this.ui.backEle && $(this.ui.backEle).is(':visible')) {
            return this.ui.backEle;
          } else if (!!this.ui.toggleIcon && $(this.ui.toggleIcon).is(':visible')) {
            return this.ui.toggleIcon;
          } else if (!!this.options.mode && this.options.mode === 'create') {
            return $(this.ui.nameInput);
          } else {
            return $(this.ui.name);
          }
        },

        onRender: function () {
          this.editing = false;
          this.ui.nameEditIcon.addClass('binf-hidden');
          this.ui.nameEditDiv.addClass('binf-hidden');

          if (this._nodeIconView) {
            this._nodeIconView.destroy();
          }
          this._nodeIconView = new NodeTypeIconView({
            el: this.$('.csui-type-icon').get(0),
            node: this.options.model
          });
          if(this.model.get('type') === 1){
            this._nodeIconView.$el.addClass('csui-metadata-shortcut-overlay');
          }
          this._nodeIconView.render();

          if (!this.readonly && this.options.showDropdownMenu && this.dropdownMenuView) {
            this.dropdownMenuView.render();
            Marionette.triggerMethodOn(this.dropdownMenuView, 'before:show', this.dropdownMenuView,
                this);
            this.ui.nameEditIconDiv.append(this.dropdownMenuView.el);
            Marionette.triggerMethodOn(this.dropdownMenuView, 'show', this.dropdownMenuView, this);
          }

          if (this.modelHasEmptyName) {
            this.ui.nameInput.addClass('csui-empty-with-placeholder');
            this.ui.nameInput.attr('placeholder', this.placeHolderName);
            if (this.readonly) {
              this.ui.name.addClass('csui-empty-with-placeholder');
            }
          }

          this._setHideShowToggleButton();

        },

        onMouseEnterName: function (event) {
          if (this.readonly) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();

          if (this.editing !== true) {
            this.ui.nameEditIcon.removeClass('binf-hidden');
          }
        },

        onMouseLeaveName: function (event) {
          if (this.readonly) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();

          if (this.editing !== true) {
            this.ui.nameEditIcon.addClass('binf-hidden');
          }
        },

        onKeyDown: function (event) {
          if (this.$el.parents(".cs-item-action-metadata").find(
                  "div[class='load-container']").length >
              0) {
            return false;
          }
          if (this.readonly) {
            return;
          }
          if (this.modelHasEmptyName && this.inputBoxNameChange !== true) {
            this.setInputBoxValue('');
            this.inputBoxNameChange = true;
            this.ui.nameInput.removeClass('csui-empty-with-placeholder');
          }
        },

        _validateAndSave: function () {
          var currentValue = this.getValue().trim();
          var inputValue = this.getInputBoxValue();
          inputValue = inputValue.trim();

          if (inputValue.length === 0 || currentValue !== inputValue) {
            var success = this.validate(inputValue);
            if (success === true) {
              var self = this;
              this.setInputBoxValue(inputValue);
              this.setValue(inputValue);
              this.modelHasEmptyName = false;
              this.trigger("metadata:item:name:save", {
                sender: this,
                success: function () {
                  self._toggleEditMode(false, false);
                },
                error: function (error) {
                  self.setValue(currentValue);
                  self._toggleEditMode(true);
                  self.showInlineError(error);
                }
              });
            }
          } else {
            this.clearInlineError();
            this._toggleEditMode(false, false);
          }
        },

        _onKeyInView: function (event) {
          if (event.keyCode === 9 && !event.shiftKey) {
            if ($(event.target).is(this.ui.backEle)) {
              this.ui.toggleIcon.focus();
              event.stopPropagation();
              event.preventDefault();
            } else if ($(event.target).is(this.ui.toggleIcon)) {
              this.ui.name.focus();
              event.stopPropagation();
              event.preventDefault();
            }
          }
        },
        onKeyInView: function (event) {
          if (this.readonly) {
            return;
          }
          if (!!this.options.mode && this.options.mode === 'create') {
            return true;
          }
          if (event.keyCode === 9 && event.shiftKey) {
            event.stopPropagation();
          }
          return this.ItemNameBehavior.onKeyInView(event);
        },

        _toggleEditMode: function (edit, setFocus) {
          if (this.options.mode != 'create') {
            return this.ItemNameBehavior._toggleEditMode(edit, setFocus);
          }
        },

        onClickName: function (event) {
          if (this.readonly) {
            return;
          }
          return this.ItemNameBehavior.onClickName(event);
        },

        getValue: function () {
          return this.ItemNameBehavior.getValue();
        },

        setValue: function (value) {
          return this.ItemNameBehavior.setValue(value);
        },

        getInputBoxValue: function () {
          return this.ItemNameBehavior.getInputBoxValue();
        },

        setInputBoxValue: function (value) {
          return this.ItemNameBehavior.setInputBoxValue(value);
        },

        validate: function (iName) {
          return this.ItemNameBehavior.validate(iName);
        },

        setEditModeFocus: function () {
          return this.ItemNameBehavior.setEditModeFocus();
        },

        showInlineError: function (error) {
          return this.ItemNameBehavior.showInlineError(error);
        },

        clearInlineError: function () {
          return this.ItemNameBehavior.clearInlineError();
        },

        _getErrorMessageFromResponse: function (err) {
          return this.ItemNameBehavior._getErrorMessageFromResponse(err);
        },
        setReadOnly: function (mode) {
          mode = mode ? true : false;
          var focus;
          if ((this.readonly ? true : false) !== mode) {
            this.readonly = mode;
            this.render();
            focus = $(this.ui.nameInput).is(":focus");
            this._toggleEditMode(focus || this.modelHasEmptyName || false, false);
            this.validate();
          } else {
            focus = $(this.ui.nameInput).is(":focus");
            if (!focus) {
              this.validate();
            }
          }
        },

        setPlaceHolder: function (placeHolderName) {
          placeHolderName || (placeHolderName = lang.addItemPlaceHolderName);
          if (this.placeHolderName !== placeHolderName) {
            this.placeHolderName = placeHolderName;
            this.render();
          }
        },

        updateNameSchema: function (nameSchema) {
          if (this.modelHasEmptyName && this.ui.nameInput.val() === "" && !nameSchema.readonly) {
            nameSchema.required = true;
          }
          this._nameSchema = _.extend({
            required: true,
            readonly: false
          }, nameSchema);
          this.readonly = this._nameSchema.readonly;
          this.render();
          this.ui.nameInput[0].placeholder = this.placeHolderName;
          var focus = $(this.ui.nameInput).is(":focus");
          this._toggleEditMode(focus || this.modelHasEmptyName || false, false);
          return this.ItemNameBehavior.updateNameSchema(nameSchema);
        }

      }
  );

  _.extend(MetadataItemNameView.prototype, ViewEventsPropagationMixin);

  return MetadataItemNameView;

});
