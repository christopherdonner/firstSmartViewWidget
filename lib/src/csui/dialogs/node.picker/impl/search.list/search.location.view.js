/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/dialogs/node.picker/impl/nls/lang',
  'hbs!csui/dialogs/node.picker/impl/search.list/search.location.item',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/models/node/node.model',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/node.links/node.links',
  'css!csui/dialogs/node.picker/impl/search.list/search.list'
], function (_, $, Backbone, Marionette, lang, searchLocationTemplate,
    TabableRegion, DefaultActionBehavior, NodeModel, NodeTypeIconView,
    nodeLinks) {
  'use strict';

  var SearchLocationItemView = Marionette.ItemView.extend({
    constructor: function SearchLocationItemView(options) {
      options || (options = {});
      Marionette.View.prototype.constructor.apply(this, arguments); // apply (modified) options to this
    },

    triggers: {
      'click': 'click:location'
    },

    tagName: 'a',
    template: searchLocationTemplate,
    className: 'search-location-name',

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    templateHelpers: function () {
      return {
        name: this.model.parent.get("name") ? this.model.parent.get("name") : lang.noValue
      };
    },

    onRender: function (e) {
      if (this.model.parent) {
        var node                     = new NodeModel(this.model.get(
            "parent_id_expand"), {connector: this.model.connector}),
            defaultLocationActionUrl = nodeLinks.getUrl(node);
        this.$el.prop("href", defaultLocationActionUrl);
        this._nodeIconViewLocation = new NodeTypeIconView({
          el: this.$('.csui-type-location-icon').get(0),
          node: this.model.parent
        });
        this._nodeIconViewLocation.render();
      }
    }
  });

  var SearchLocationView = Marionette.CollectionView.extend({
    childView: SearchLocationItemView,

    childEvents: {
      'click:location': 'onLocationClick'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    onAddChild: function (child) {
      child.$el.addClass('csui-acc-focusable');
    },

    childViewOptions: function () {
      return {
        notTabableRegion: this.options.notTabableRegion
      };
    },

    updateChildOptions: function (flag) {
      this.childViewOptions.notTabableRegion = true;
    },

    constructor: function SearchLocationView(options) {
      options || (options = {});
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.focusIndex = 0;
      this.on('render', function () {
        var that = this;
        setTimeout(function () {that.trigger("dom:refresh");}, 100);
      });
    },

    onLocationClick: function (node) {
      this.trigger("click:location", node.model.parent);
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    isTabable: function () {
      return this.children.find(function (view) {
        var $el = view.$el;
        return ($el.is(':visible') && !$el.is(':disabled'));
      });
    },

    currentlyFocusedElement: function () {
      var focusables = this.$el.find('.search-location-name.csui-acc-focusable');
      if (focusables.length) {
        return $(focusables[this.focusIndex]);
      }
    },

    setFocus: function () {
      var focusables = this.$el.find('.search-location-name.csui-acc-focusable');
      $(focusables[this.focusIndex]).focus();
    },

    onKeyInView: function (event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('.search-location-name.csui-acc-focusable');

      switch (keyCode) {
      case 38:
      case 40:
        if (keyCode === 38) {
          this.focusIndex > 0 && --this.focusIndex;
        }
        else {
          this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
        }
        if (document.activeElement.classList.contains("search-location-name")) {
          focusables = this.$el.find('.search-location-name.csui-acc-focusable');
        }
        this.trigger('changed:focus');
        $(focusables[this.focusIndex]).focus();
        break;
      }
    }
  });

  return SearchLocationView;
});