/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/widgets/permissions/impl/header/leftview/header.leftbar.view',
  'csui/widgets/permissions/impl/header/rightview/header.rightbar.view',
  'hbs!csui/widgets/permissions/impl/header/permissions.header',
  'i18n!csui/widgets/permissions/impl/nls/lang',
  'css!csui/widgets/permissions/impl/header/permissions.header'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin,
    PermissionsHeaderLeftBarView, PermissionsHeaderRightBarView, template, lang) {

  var PermissionsHeaderView = Marionette.ItemView.extend({

    className: 'permissions-content-header',
    template: template,
    ui: {
      leftbar: '.permissions-header-left-bar-container',
      rightbar: '.permissions-header-right-bar-container'
    },

    constructor: function PermissionsHeaderView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      Marionette.ItemView.prototype.constructor.call(this, options);

      this._createPermissionsHeaderLeftBarView();
      this._createPermissionsHeaderRightBarView();
    },

    _createPermissionsHeaderLeftBarView: function () {
      if (this.leftbarView) {
        this.cancelEventsToViewsPropagation(this.leftbarView);
        this.leftbarView.destroy();
      }
      var lbv = this.leftbarView = new PermissionsHeaderLeftBarView(this.options);
      this.listenTo(lbv, 'permissions:close', function (args) {
        this.trigger('permissions:close', args);
      });

      this.propagateEventsToViews(this.leftbarView);
    },

    _createPermissionsHeaderRightBarView: function (viewNode) {
      if (this.rightbarView) {
        this.cancelEventsToViewsPropagation(this.rightbarView);
        this.rightbarView.destroy();
      }

      var node = viewNode || this.node;
      var rbv = this.rightbarView = new PermissionsHeaderRightBarView(
          _.extend({}, this.options, {model: node})
      );
      this.listenTo(rbv, 'permissions:close', function (args) {
        this.trigger('permissions:close', args);
      });

      this.propagateEventsToViews(this.rightbarView);
    },

    onRender: function () {
      var lbv = this.leftbarView.render();
      Marionette.triggerMethodOn(lbv, 'before:show', lbv, this);
      this.ui.leftbar.append(lbv.el);

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
      Marionette.triggerMethodOn(rbv, 'show', rbv, this);
    },

    onBeforeDestroy: function () {
      if (this.leftbarView) {
        this.cancelEventsToViewsPropagation(this.leftbarView);
        this.trigger('permissions:close');
        this.leftbarView.destroy();
      }
    },

    onClickHeader: function (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  _.extend(PermissionsHeaderView.prototype, ViewEventsPropagationMixin);

  return PermissionsHeaderView;
});