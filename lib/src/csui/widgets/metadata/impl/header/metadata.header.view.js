/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/widgets/metadata/impl/header/item.name/metadata.item.name.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/metadata/impl/header/leftbar/header.leftbar.view',
  'csui/widgets/metadata/impl/header/rightbar/header.rightbar.view',
  'hbs!csui/widgets/metadata/impl/header/metadata.header',
  'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/utils/log',
  'csui/controls/form/fields/booleanfield.view',
  'css!csui/widgets/metadata/impl/header/metadata.header'
], function (_, $, Backbone, Marionette, MetadataItemNameView, ViewEventsPropagationMixin,
    MetadataHeaderLeftBarView, MetadataHeaderRightBarView, template, lang, log,
    BooleanFieldView) {

  var MetadataHeaderView = Marionette.ItemView.extend({

    className: 'metadata-content-header',
    template: template,
    templateHelpers: function () {
      var templateValues = {
        back_button: this.options.showBackIcon,
        show_close_icon: this.options.showCloseIcon,
        close_metadata_button_tooltip: lang.closeMetadataButtonTooltip,
        show_only_required_fields_switch: this.options.showRequiredFieldsSwitch,
        only_required_fields_label: lang.onlyRequiredFieldsLabel
      };
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        var right_static_label = lang.viewOriginalMessage;
        if (this.options.shortcutNode.original === this.node) {
          right_static_label = lang.viewShortcutMessage;
        }
        return _.extend(templateValues, {
          is_shortcut: true,
          right_label: right_static_label
        });
      } else {
        return templateValues;
      }
    },

    ui: {
      leftbar: '.metadata-header-left-bar-container',
      header: '.metadata-header',
      rightbar: '.metadata-header-right-bar-container'
    },

    events: {
      'click .metadata-header': 'onClickHeader'
    },

    constructor: function MetadataHeaderView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      this.originatingView = options.originatingView;
      Marionette.ItemView.prototype.constructor.call(this, options);

      this._createMetadataHeaderLeftBarView();
      this._createMetadataItemNameView();
      this._createMetadataHeaderRightBarView();
    },

    _createMetadataHeaderLeftBarView: function () {
      if (this.leftbarView) {
        this.cancelEventsToViewsPropagation(this.leftbarView);
        this.leftbarView.destroy();
      }

      var lbv = this.leftbarView = new MetadataHeaderLeftBarView(this.options);
      this.listenTo(lbv, 'metadata:close', function (args) {
        this.trigger('metadata:close', args);
      });

      this.propagateEventsToViews(this.leftbarView);
    },

    _createMetadataItemNameView: function (viewNode) {
      if (this.metadataItemNameView) {
        this.cancelEventsToViewsPropagation(this.metadataItemNameView);
        this.metadataItemNameView.destroy();
      }

      var node = viewNode || this.node;
      var inv = this.metadataItemNameView = new MetadataItemNameView({
        model: node,
        container: this.options.container,
        containerCollection: this.options.containerCollection,
        collection: this.options.collection,
        context: this.options.context,
        nameSchema: this._getNameSchema(),
        commands: this.options.commands,
        originatingView: this.options.originatingView,
        showDropdownMenu: this.options.showDropdownMenu,
        metadataScenario: this.options.metadataScenario,
        showPermissionView: this.options.showPermissionView,
        mode: this.options.action
      });
      this.listenTo(inv, 'metadata:item:name:save', function (args) {
        this.trigger('metadata:item:name:save', args);
      });
      this.listenTo(inv, 'metadata:item:before:delete', _.bind(function (args) {
        this.trigger('metadata:item:before:delete', args);
      }, this));
      this.listenTo(inv, 'metadata:item:before:move', _.bind(function (args) {
        this.trigger('metadata:item:before:move', args);
      }, this));
      this.listenTo(inv, 'metadata:item:deleted', _.bind(function (args) {
        this.trigger('metadata:item:deleted', args);
      }, this));
      this.listenTo(inv, 'update:button', _.bind(function (args) {
        this.trigger('update:button', args);
      }, this));

      this.propagateEventsToViews(this.metadataItemNameView);
    },

    _createMetadataHeaderRightBarView: function (viewNode) {
      if (this.rightbarView) {
        this.cancelEventsToViewsPropagation(this.rightbarView);
        this.rightbarView.destroy();
      }

      var node = viewNode || this.node;
      var rbv = this.rightbarView = new MetadataHeaderRightBarView(
          _.extend({}, this.options, {model: node})
      );
      this.listenTo(rbv, 'shortcut:switch', this.onClickShortcutSwitch);
      this.listenTo(rbv, 'metadata:close', function (args) {
        this.trigger('metadata:close', args);
      });

      this.propagateEventsToViews(this.rightbarView);
    },

    onRender: function () {
      var lbv = this.leftbarView.render();
      Marionette.triggerMethodOn(lbv, 'before:show', lbv, this);
      this.ui.leftbar.append(lbv.el);

      var inv = this.metadataItemNameView.render();
      Marionette.triggerMethodOn(inv, 'before:show', inv, this);
      this.ui.header.append(inv.el);

      var rbv = this.rightbarView.render();
      Marionette.triggerMethodOn(rbv, 'before:show', rbv, this);
      this.ui.rightbar.append(rbv.el);

      if (this.options.showCloseIcon) {
        this.$el.addClass('with-close-icon');
      }
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        this.$el.addClass('shortcut-object');
      }

      Marionette.triggerMethodOn(lbv, 'show', lbv, this);
      Marionette.triggerMethodOn(inv, 'show', inv, this);
      Marionette.triggerMethodOn(rbv, 'show', rbv, this);
    },

    onBeforeDestroy: function () {
      if (this.leftbarView) {
        this.cancelEventsToViewsPropagation(this.leftbarView);
        this.leftbarView.destroy();
      }
      if (this.metadataItemNameView) {
        this.cancelEventsToViewsPropagation(this.metadataItemNameView);
        this.metadataItemNameView.destroy();
      }
      if (this.requiredFieldSwitchView) {
        this.requiredFieldSwitchView.destroy();
      }
    },

    onClickHeader: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    onClickShortcutSwitch: function () {
      var viewNode = this.model;
      if (this.options.shortcutNode && this.options.shortcutNode.original === this.node) {
        viewNode = this.node = this.options.shortcutNode;
      } else {
        viewNode = this.node = this.node.original;
      }

      this._createMetadataItemNameView(viewNode);
      var inv = this.metadataItemNameView.render();
      Marionette.triggerMethodOn(inv, 'before:show', inv, this);
      this.ui.header.append(inv.el);
      Marionette.triggerMethodOn(inv, 'show', inv, this);

      this._createMetadataHeaderRightBarView(viewNode);
      var rbv = this.rightbarView.render();
      Marionette.triggerMethodOn(rbv, 'before:show', rbv, this);
      this.ui.rightbar.append(rbv.el);
      Marionette.triggerMethodOn(rbv, 'show', rbv, this);
      var $elem = rbv.currentlyFocusedElement();
      $elem && $elem.focus();

      this.trigger('shortcut:switch', {node: viewNode});
    },

    getNameInputBoxValue: function () {
      return this.metadataItemNameView.getInputBoxValue();
    },

    validateName: function () {
      var inputValue = this.metadataItemNameView.getInputBoxValue();
      return this.metadataItemNameView.validate(inputValue);
    },

    getNameValue: function () {
      return this.metadataItemNameView.getValue();
    },

    setNameEditModeFocus: function () {
      this.metadataItemNameView.setEditModeFocus();
    },

    _getNameSchema: function () {
      var generalForm = this.options.collection && this.options.collection.first(),
          formSchema  = generalForm && generalForm.get('schema'),
          nameSchema  = formSchema && formSchema.properties && formSchema.properties.name;
      if (this.options.collection && formSchema && !nameSchema) {
        log.warn('Form collection lacks name field in the first form.');
      }
      return nameSchema || {};
    }

  });

  _.extend(MetadataHeaderView.prototype, ViewEventsPropagationMixin);

  return MetadataHeaderView;

});
