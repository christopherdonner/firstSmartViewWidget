/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/controls/tile/impl/tile',
  'css!csui/controls/list/impl/list',
  'css!csui/controls/tile/impl/tile'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin, template) {

  var TileView = Marionette.LayoutView.extend({

    className: 'cs-tile cs-list tile content-tile',

    template: template,

    regions: {
      headerControls: '.tile-controls',
      content: '.tile-content',
      footer: '.tile-footer'
    },

    constructor: function TileView() {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'render', this._renderContentView);
    },

    serializeData: function () {
      return _.reduce(['icon', 'imageUrl', 'imageClass', 'title'],
          function (result, property) {
            result[property] = getOption.call(this, property);
            return result;
          }, {}, this);
    },

    _renderContentView: function () {
      var ContentView = getOption.call(this, 'contentView');
      if (!ContentView) {
        throw new Marionette.Error({
          name: 'NoContentViewError',
          message: 'A "contentView" must be specified'
        });
      }
      var contentViewOptions = getOption.call(this, 'contentViewOptions');
      this.contentView = new ContentView(contentViewOptions);
      this.propagateEventsToViews(this.contentView);
      this.content.show(this.contentView);
    }

  });

  _.extend(TileView.prototype, ViewEventsPropagationMixin);
  function getOption(property, source) {
    var value;
    if (source) {
      value = source[property];
    } else {
      value = getOption.call(this, property, this.options || {});
      if (value === undefined) {
        value = this[property];
      }
    }
    return _.isFunction(value) && !(value.prototype instanceof Backbone.View) ?
           value.call(this) : value;
  }

  return TileView;

});
