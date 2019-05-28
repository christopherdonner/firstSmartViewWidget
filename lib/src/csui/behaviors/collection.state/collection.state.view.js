/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/behaviors/collection.state/impl/collection.state'
], function (_, Marionette, template) {
  'use strict';

  var CollectionStateView = Marionette.ItemView.extend({

    className: 'csui-collection-state',

    template: template,

    constructor: function CollectionStateView() {
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
          .removeClass('csui-state-empty csui-state-loading csui-state-failed')
          .addClass('csui-state-' + this.model.get('state'));
    }

  });

  return CollectionStateView;
});
