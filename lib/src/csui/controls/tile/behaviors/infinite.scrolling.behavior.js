/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette'
], function (require, $, _, Marionette) {
  "use strict";

  var InfiniteScrollingBehavior = Marionette.Behavior.extend({

    defaults: {
      content: null,
      contentParent: null,
      fetchMoreItemsThreshold: 95
    },

    constructor: function ScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._bindScrollingEvents);
      this.listenTo(view, 'before:destroy', this._unbindScrollingEvents);
    },

    _bindScrollingEvents: function () {
      var contentParent = getOption.call(this, 'contentParent');
      this._contentParent = contentParent ? this.view.$(contentParent) : this.view.$el;
      this._contentParent.on('scroll.' + this.view.cid, _.bind(this._checkScrollPosition, this));
      var content = getOption.call(this, 'content');
      this._content = content ? this.view.$(content) :
                      contentParent ? this._contentParent.children().first() : this.view.$el;
    },

    _checkScrollPosition: function () {
      var fetchMoreItemsThreshold = getOption.call(this, 'fetchMoreItemsThreshold');
      var contentH;
      if (this._content.length === 1) {
        contentH = this._content.height();
      } else {
        contentH = _.reduce(this._content, function (sum, el) {return sum + $(el).height()}, 0);
      }
      var scrollableHeight     = contentH - this._contentParent.height(),
          scrollablePercentage = this._contentParent.scrollTop() * 100 / scrollableHeight;
      if (scrollablePercentage >= fetchMoreItemsThreshold) {
        this._checkScrollPositionFetch();
      }
    },

    _checkScrollPositionFetch: function () {
      var collection = this.view.collection;
      if (collection.length < collection.totalCount && !collection.fetching &&
          collection.skipCount < collection.length) {
        var self = this;
        this.view.trigger('before:collection:scroll:fetch');
        collection.setSkip(collection.length, false);
        collection.fetch({
          reset: false,
          remove: false,
          merge: false,
          success: function () {
            self.view.trigger('collection:scroll:fetch');
          }
        });
      }
    },

    _unbindScrollingEvents: function () {
      if (this._contentParent) {
        this._contentParent.off('scroll.' + this.view.cid);
      }
    }

  });
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return InfiniteScrollingBehavior;

});
