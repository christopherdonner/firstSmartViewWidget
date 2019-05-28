/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/base',
  'csui/utils/url', 'csui/controls/form/form.view', 'csui/controls/form/pub.sub',
  'csui/controls/globalmessage/globalmessage'
], function (_, $, Backbone, base, Url, FormView, PubSub, GlobalMessage) {

  var CategoryFormView = FormView.extend({

    constructor: function CategoryFormView(options) {
      FormView.prototype.constructor.call(this, options);

      this.node = this.options.node;
      this.listenTo(this, 'change:field', this._saveField);
      this.listenTo(this, 'disable:active:item', this._disableItem);
    },

    _disableItem: function (args) {
      this.options.metadataView && this.options.metadataView.trigger('disable:active:item');
    },

    _saveField: function (args) {
      if (this.mode === 'create') {
        return;
      }
      var values = this.getValues();
      this._saveChanges(values);
    },

    _saveChanges: function (changes) {
      if (!this.node) {
        throw new Error('Missing node to save the categories to.');
      }
      if (_.keys(changes).length) {
        if (this._validate(changes)) {
          this._blockActions();
          return $
              .ajax(this.node.connector.extendAjaxOptions({
                type: 'PUT',
                url: Url.combine(this.node.urlBase(), 'categories', this.model.get('id')),
                data: {body: JSON.stringify(changes)}
              }))
              .done(_.bind(function () {
                this.trigger('forms:sync');
                var event = $.Event('tab:content:field:changed');
                this.options.metadataView &&
                this.options.metadataView.trigger('enable:active:item');
                this.$el.trigger(event);
              }, this))
              .fail(_.bind(function (jqxhr) {
                var preValues = this.model.get('data');
                this.form.children.forEach(function (formField) {
                  formField.setValue(preValues[formField.propertyId]);
                  formField.refresh();
                });
                var error = new base.Error(jqxhr);
                GlobalMessage.showMessage('error', error.message);
                this.trigger('forms:error');
              }, this))
              .always(_.bind(function () {
                this._unblockActions();
              }, this));
        }
        return $.Deferred().reject().promise();
      }
      return $.Deferred().resolve().promise();
    }

  });

  return CategoryFormView;
});
