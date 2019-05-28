/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/dialog/dialog.view', 'csui/behaviors/expanding/expanding.behavior'
], function (_, Backbone, Marionette, DialogView, ExpandingBehavior) {

  var ServerExpandingBehavior = ExpandingBehavior.extend({

    constructor: function ServerExpandingBehavior(options, view) {
      ExpandingBehavior.prototype.constructor.apply(this, arguments);
    },
    onExpand: function () {
      var collection = this.view.collection.clone();

      var expandedViewValue = this.getOption('expandedView'),
          expandedViewClass = expandedViewValue.prototype instanceof Backbone.View ?
                              expandedViewValue :
                              expandedViewValue.call(this.view),
          expandedViewOptions = getOption(this.options, 'expandedViewOptions', this.view);
      this.expandedView = new expandedViewClass(_.extend({
        context: this.view.options.context,
        collection: collection,
        orderBy: getOption(this.options, 'orderBy', this.view),
        limited: false
      }, expandedViewOptions));
      this.dialog = new DialogView({
        iconLeft: getOption(this.options, 'titleBarIcon', this.view) ||
                  getOption(this.view.options, 'titleBarIcon', this.view),
        imageLeftUrl: getOption(this.options, 'titleBarImageUrl', this.view),
        imageLeftClass: getOption(this.options, 'titleBarImageClass', this.view),
        title: getOption(this.options, 'dialogTitle', this.view),
        iconRight: getOption(this.options, 'dialogTitleIconRight', this.view),
        className: getOption(this.options, 'dialogClassName', this.view),
        largeSize: true,
        view: this.expandedView
      });
      this.listenTo(this.dialog, 'before:hide', this._expandOtherView);
      this.listenTo(this.dialog, 'hide', this.view._onCollapseExpandedView);  // Workaround until LPAD-53271 is implemented:  callback on original view when the expandedview is collapsed
      this._expandOtherView(false);
      this.dialog.show();
    }

  });
  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  return ServerExpandingBehavior;

});
