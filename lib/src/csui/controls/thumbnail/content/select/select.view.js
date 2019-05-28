/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/thumbnail/content/content.registry',
  'i18n!csui/controls/thumbnail/impl/nls/lang',
  'hbs!csui/controls/thumbnail/content/select/impl/select',
  'css!csui/controls/thumbnail/content/select/impl/select'
], function (_, Backbone, Marionette, ContentRegistry, lang, template) {
  'use strict';

  var SelectContentView = Marionette.ItemView.extend({
        template: template,

        templateHelpers: function () {
          return {
            selectable: this.model.get('selectable') !== false,
            checked: this.model.get(SelectContentView.isSelectedModelAttributeName) === true,
            selectItemName: _.str.sformat(lang.selectItem, this.model.get('name')),
            selectItemAria: _.str.sformat(lang.selectItemAria, this.model.get('name'))
          };
        },

        events: {
          keydown: 'onKeyInView'
        },

        constructor: function (options) {
          Marionette.ItemView.prototype.constructor.apply(this, arguments);
          this.rowIndex = options.rowIndex;
          this.listenTo(this.model, 'change:' + SelectContentView.isSelectedModelAttributeName,
              this.render);
          this.listenTo(this, 'before:render', this._detachClickHandler)
              .listenTo(this, 'before:destroy', this._detachClickHandler);
        },

        onKeyInView: function (event) {
          if (event.keyCode === 32 || event.keyCode === 13) {
            this._toggleCheckbox(event);
          }
        },

        _attachClickHandler: function () {
          var self = this;
          var $cbEl = this.$el.find('input[type="checkbox"]');
          var $labelEl = this.$el.find('.csui-selectlabel');
          $labelEl.on('click.' + this.cid, function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (self.options.thumbnailView && self.options.thumbnailView._isSelectCheckBoxBlocked) {
              return;
            }
            $cbEl.prop("checked", !$cbEl.prop("checked")).change();
            self.triggerMethod('clicked:checkbox', event);
          });

          $cbEl.on('change.' + this.cid, function (event) {
            Backbone.trigger('closeToggleAction');
            var checked = $cbEl.prop("checked");
            self.triggerMethod('clicked:checkbox', {view: self, checked: checked});
          });
        },

        _detachClickHandler: function () {
          var $cbEl = this.$el.find('input[type="checkbox"]');
          var $labelEl = this.$el.find('.csui-selectlabel');
          $cbEl.off('change.' + this.cid);
          $labelEl.off('click.' + this.cid);
          this.$el.off('click.' + this.cid);
        },
        _toggleCheckbox: function (event) {
          var $cbEl = this.$el.find('input[type="checkbox"]');

          $cbEl.prop("checked", !$cbEl.prop("checked")).change();  // invert checked state and
          this.$el.attr("aria-checked", $cbEl.prop("checked"));
          event.preventDefault();
          event.stopPropagation();
          return $cbEl.prop("checked");
        },

        onRender: function () {
          this._ensureViewIsIntact();
          this.triggerMethod('before:render', this);
          this.$el.attr('aria-label', lang.selectItemAria);
          this.$el.attr('role', 'checkbox');
          var $cbEl = this.$el.find('input[type="checkbox"]');
          var checkedState = $cbEl.prop("checked");
          this.$el.attr('aria-checked', checkedState);
          this._attachClickHandler();
          return this;
        }
      },
      {
        columnClassName: 'csui-table-cell-_select',
        isSelectedModelAttributeName: 'csuiIsSelected'
      }
  );
  ContentRegistry.registerByKey('_select', SelectContentView);

  return SelectContentView;
});
