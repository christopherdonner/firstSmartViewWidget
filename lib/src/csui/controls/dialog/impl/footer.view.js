/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior'
], function (Marionette, TabableRegion) {

  var ButtonView = Marionette.ItemView.extend({

    tagName: 'button',

    className: 'binf-btn',

    template: false,

    triggers: {
      'click': 'click'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    constructor: function ButtonView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    isTabable: function () {
      return this.$el.is(':not(:disabled)') && this.$el.is(':not(:hidden)');
    },
    currentlyFocusedElement: function () {
      if (this.$el.prop('tabindex') === -1) {
        this.$el.prop('tabindex', 0);
      }
      return this.$el;
    },

    onRender: function () {
      var button     = this.$el,
          attributes = this.model.attributes;
      button.text(attributes.label);
      button.addClass(
          attributes['default'] ? 'binf-btn-primary cs-add-button' : 'binf-btn-default');
      if (attributes.toolTip) {
        button.attr('title', attributes.toolTip);
      }
      if (attributes.separate) {
        button.addClass('cs-separate');
      }
      this.updateButton(attributes);
    },

    updateButton: function (attributes) {

      var $button = this.$el;
      attributes || (attributes = {});
      if (attributes.hidden !== undefined) {
        if (attributes.hidden) {
          $button.addClass('binf-hidden');
        } else {
          $button.removeClass('binf-hidden');
        }
      }
      if (attributes.disabled !== undefined) {
        $button.prop('disabled', attributes.disabled);
      }
    }

  });

  var DialogFooterView = Marionette.CollectionView.extend({

    childView: ButtonView,

    constructor: function DialogFooterView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },
    onDomRefresh: function () {
      this.children.each(function (buttonView) {
        buttonView.trigger('dom:refresh');
      });
    },

    getButtons: function () {
      return this.children.toArray();
    },

    updateButton: function (id, attributes) {
      var button = this.collection.get(id);
      if (button) {
        this.children
            .findByModel(button)
            .updateButton(attributes);
      } else {
        ButtonView.updateButton(this.$('[data-cs-id="' + id + '"]'), attributes);
      }
    }

  });

  return DialogFooterView;
});
