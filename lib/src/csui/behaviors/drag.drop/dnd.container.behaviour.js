/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'i18n', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/lib/backbone'
], function (require, i18n, _, $, Marionette, Backbone) {

  var DragAndDropContainerBehaviour = Marionette.Behavior.extend({

    defaults: {
      placeholder: undefined, // a class or function. Undefined represents close of original element
      handle: undefined, // Restricts sort start click to the specified element.
      draggableItem: '.csui-draggable-item',
      disableDraggable: '.csui-draggable-item-disable',
      over: false,
      receive: false
    },

    constructor: function DragAndDropContainerBehaviour(options, view) {
      this.view = view;
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(this.view, 'render', this._initSorting);
    },

    _getPlaceholder: function (currentItem) {
      var placeholder = this.options.placeholder;
      if (!placeholder || _.isString(placeholder)) {
        var className = placeholder;
        placeholder = function () {
          var nodeName = currentItem[0].nodeName.toLowerCase(),
              element  = $("<" + nodeName + ">");

          element.addClass("ui-sortable-placeholder")
              .addClass(className || currentItem[0].className)
              .removeClass("ui-sortable-helper");
          return element;
        };
      }
      return placeholder.call(this, currentItem);
    },

    _initSorting: function () {
      var self = this;
      this.view.$el.addClass('csui-dnd-container');
      this.$el.sortable({
        items: this.options.draggableItem,
        cancel: this.options.disableDraggable,
        handle: this.options.handle,
        placeholder: {
          element: this._getPlaceholder.bind(this),
          update: function () {}
        },
        start: this._onSortStart.bind(this),
        stop: this._onSortStop.bind(this),
        over: this.options.over,
        receive: this.options.receive
      });
    },

    _onSortStart: function (event, ui) {
      this.$el.addClass('csui-drag-start');
    },
    _onSortStop: function (event, ui) {
      this.$el.removeClass('csui-drag-start');
      var dragItemId = ui.item.attr('data-csui-draggable-item');
      var model = this.view.collection.get(dragItemId);
      var modelIndex = this.view.collection.indexOf(model);
      var updatedIndex = this.$el.find('[data-csui-draggable-item=' + dragItemId + ']').index();
      if (modelIndex === updatedIndex) {
        return;
      }
      this.view.collection.remove(model, {silent: true});
      this.view.collection.add(model, {at: updatedIndex, silent: true});
    }
  });

  return DragAndDropContainerBehaviour;
});