/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette'
], function (_, Backbone, Marionette) {
  "use strict";

  var LimitingBehavior = Marionette.Behavior.extend({

    defaults: {
      limit: 6,
      filterByProperty: 'name'
    },

    collectionEvents: {'reset': 'enableMoreLink'},

    events: {
      'click .cs-more': 'onMoreLinkClick',
      'click .tile-expand': 'onMoreLinkClick',
    },

    ui: {moreLink: '.cs-more'},

    constructor: function LimitingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
    },
    initialize: function (options, view) {
      if (view.options.limited !== false) {
        var completeCollection = view.collection,
            completeCollectionOptions;
        if (!completeCollection) {
          completeCollection = this.getOption('completeCollection');
          if (!(completeCollection instanceof Backbone.Collection)) {
            completeCollectionOptions = this.getOption('completeCollectionOptions');
            if (completeCollection.prototype instanceof Backbone.Collection) {
              completeCollection = new completeCollection(undefined, completeCollectionOptions);
            } else {
              completeCollection = completeCollection.call(view);
              if (!(completeCollection instanceof Backbone.Collection)) {
                completeCollection = new completeCollection(undefined, completeCollectionOptions);
              }
            }
          }
        }
        if (view.options.orderBy) {
          completeCollection.setOrder(view.options.orderBy, false);
        }

        this.listenTo(completeCollection, 'sync', _.bind(function (object) {
          if (object instanceof Backbone.Collection) {
            this.synchronizeCollections();
          }
        }, this));
        this.listenTo(completeCollection, 'reset', this.enableMoreLink);
        view.completeCollection = completeCollection;
        var ViewCollection = Backbone.Collection.extend(
            completeCollection ? {model: completeCollection.model} : {}
        );
        view.collection = new ViewCollection();
        this.listenTo(view, 'change:filterValue', this.synchronizeCollections);
      }
    },

    synchronizeCollections: function () {
      var models;
      if (this.view.options.filterValue && this.view.options.filterValue.length > 0) {
        var keywords = this.view.options.filterValue.toLowerCase().split(' ');
        var filterByProperty = getOption(this.options, 'filterByProperty', this.view);

        this.view.currentFilter = {};
        this.view.currentFilter[filterByProperty] = this.view.options.filterValue.toLowerCase();

        models = this.view.completeCollection.filter(function (item) {
          var name = item.get(filterByProperty),
              isMatch;
          if (name) {
            name = name.trim().toLowerCase();
            isMatch = _.reduce(keywords, function (result, keyword) {
              return result && name.indexOf(keyword) >= 0;
            }, true);
          }
          return isMatch;
        });
      } else {
        this.view.currentFilter = undefined;
        models = this.view.completeCollection.models;
      }
      this.view.collection.reset(models);
    },

    enableMoreLink: function () {
      var limit  = getOption(this.options, 'limit', this.view),
          enable = this.view.completeCollection &&
                   this.view.completeCollection.length > limit;
      this.ui.moreLink[enable ? 'removeClass' : 'addClass']('binf-hidden');
    },

    onMoreLinkClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.view.triggerMethod('expand');
    }

  });
  function getOption(object, property, context) {
    if (object == null) {
      return void 0;
    }
    var value = object[property];
    return _.isFunction(value) ? object[property].call(context) : value;
  }

  return LimitingBehavior;

});
