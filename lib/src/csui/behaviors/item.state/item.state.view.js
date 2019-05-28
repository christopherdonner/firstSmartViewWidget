/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/behaviors/item.state/impl/item.state'
], function (_, Marionette, template) {
  'use strict';

  var ItemStateView = Marionette.ItemView.extend({

    className: 'csui-item-state',

    template: template,

    constructor: function ItemStateView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change:state', this.render)
          .listenTo(this, 'render', this._updateClasses);
    },

    serializeData: function () {
      return _.extend(this.model.toJSON(), {
        message: this.options.stateMessages[this.model.get('state')]
      });
    },

    _updateClasses: function () {
      this.$el
          .removeClass('csui-state-loading csui-state-failed')
          .addClass('csui-state-' + this.model.get('state'));
    }

  });

  return ItemStateView;
});
