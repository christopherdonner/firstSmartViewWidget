/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone'
], function (_, $, Marionette, Backbone) {

  var DragAndDropItemBehaviour = Marionette.Behavior.extend({
    constructor: function DragAndDropItemBehaviour(options, view) {
      this.view = view;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this._registerListeners();
    },

    _registerListeners: function () {
      this.listenTo(this.view, 'render', this._initDnD);
    },

    _initDnD: function () {
      this.$el.addClass('csui-draggable-item');
      this.$el.attr('data-csui-draggable-item', this.view.model.cid);
    }
  });

  return DragAndDropItemBehaviour;
});