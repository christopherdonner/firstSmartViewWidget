/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/log',
  'hbs!csui/controls/item.title/impl/name/name',
  'i18n!csui/controls/item.title/impl/nls/localized.strings',
  'csui/utils/commandhelper', 'csui/behaviors/item.name/item.name.behavior',
  'csui/utils/contexts/factories/ancestors',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'css!csui/controls/item.title/impl/name/name'
], function ($, _, Backbone, Marionette, log, template, lang,
    CommandHelper, ItemNameBehavior, AncestorCollectionFactory,
    ViewEventsPropagationMixin) {

  var ItemTitleNameView = Marionette.ItemView.extend({

    className: 'csui-item-name',
    template: template,

    templateHelpers: function () {
      return {
        name: this.model.get("name"),
        edit_name_tooltip: lang.editNameTooltip,
        cancel_edit_name_tooltip: lang.cancelEditNameTooltip,
        placeholderName: lang.placeHolderName
      };
    },

    ui: {
      name: '.csui-item-name-readonly', // for compatibility with item.name.behavior
      nameReadonly: '.csui-item-name-readonly',
      nameEdit: '.csui-item-name-edit',
      nameEditDiv: '.csui-item-name-edit',  // for compatibility with item.name.behavior
      nameInput: '.csui-item-name-edit>input',
      inputName: '.csui-item-name-edit>input',  // for compatibility with item.name.behavior
      nameEditCancelIcon: '.csui-item-name-edit>.edit-cancel',
      titleError: '.csui-item-name-error'
    },

    modelEvents: {
      'change': 'render'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    behaviors: {
      ItemName: {
        behaviorClass: ItemNameBehavior
      }
    },

    constructor: function ItemTitleNameView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      this.editing = false;
      this.ui.nameEdit.addClass('binf-hidden');
    },

    _validateAndSave: function () {
      var currentValue = this.model.get('name');
      var inputValue = this.getInputBoxValue();
      inputValue = inputValue.trim();

      if (currentValue !== inputValue) {

        var success = this.validate(inputValue);
        if (success === true) {
          var self = this;
          this.setInputBoxValue(inputValue);
          this.setValue(inputValue);

          self._blockActions();
          var attributes = {name: inputValue};
          var context = this.options.context;
          var node = self.options.model;
          node.save(attributes, {
                wait: true,
                patch: true,
                silent: !!attributes.name
              })
              .then(function () {
                node.fetch()
                    .done(function (resp) {
                      if (context) {
                        context.trigger('current:folder:changed', node);
                      }
                      self._unblockActions();
                      self.options.originatingView.unblockActions();
                    })
                    .fail(function (error) {
                      self._unblockActions();
                      var errorMsg = self._getErrorMessageFromResponse(error);
                      log.error('Saving failed. ', errorMsg) && console.error(errorMsg);
                    });
                self._toggleEditMode(false);
              })
              .fail(function (err) {
                self._unblockActions();
                var errorMessage = self._getErrorMessageFromResponse(err);
                self.setValue(currentValue);
                self._toggleEditMode(true);
                self.showInlineError(errorMessage);
              });
        }
      } else {
        this.clearInlineError();
        this._toggleEditMode(false);
      }
    },

    _blockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.blockActions && origView.blockActions();
    },

    _unblockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.unblockActions && origView.unblockActions();
    },
    onKeyInView: function (event) {
      return this.ItemNameBehavior.onKeyInView(event);
    },

    _toggleEditMode: function (edit) {
      this.ItemNameBehavior._toggleEditMode(edit);
    },

    onClickName: function (event) {
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
    }

  });

  _.extend(ItemTitleNameView.prototype, ViewEventsPropagationMixin);

  return ItemTitleNameView;

});
