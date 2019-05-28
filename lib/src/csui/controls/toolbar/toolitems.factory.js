/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/toolbar/toolitem.model'
], function (_, Backbone, Marionette, base, ToolItemModel) {
  'use strict';
  var ToolItemsFactory = Marionette.Object.extend({
    constructor: function ToolItemsFactory(toolItemDefinitions, options) {
      this.collection = new Backbone.Collection([], {model: ToolItemModel});
      this.runsInTouchBrowser = options && options.runsInTouchBrowser !== undefined ?
                                options.runsInTouchBrowser : base.isTouchBrowser();

      this.set(toolItemDefinitions);
      Marionette.Object.prototype.constructor.call(this, options);
    },

    set: function (tooItemDefinitions) {
      if (_.isArray(tooItemDefinitions)) {
        _.each(tooItemDefinitions, function (toolItemDefinition) {
          this._setToolItemDefinition(toolItemDefinition);
        }, this);
      } else {
        this._setToolItemDefinition(tooItemDefinitions);
      }
    },

    addItem: function (newToolItem) {
      var group = newToolItem.get('group');
      var foundGroup = false;
      var prevToolItemIndex;

      if (newToolItem.get('onlyInTouchBrowser')) {
        if (this.runsInTouchBrowser) {
          return;
        }
      }

      this.collection.find(function (toolItem, index) {
        if (toolItem.get('group') === group) {
          foundGroup = true;
        } else {
          if (foundGroup) {
            prevToolItemIndex = index;
            return true;  // stop loop because we found it and now it's different again
          }
        }
      });

      if (foundGroup && prevToolItemIndex) {
        this.collection.add(newToolItem, {at: prevToolItemIndex});
      } else {
        this.collection.add(newToolItem);
      }
    },

    reset: function (models) {
      this.collection.reset(models);
    },

    getCollection: function () {
      return this.collection;
    },
    _setToolItemDefinition: function (toolItemDefinition) {
      var runsInTouchBrowser = this.runsInTouchBrowser;
      if (this.collection.length === 0) {
        var toolItemsFlat = [];
        _.each(toolItemDefinition, function (toolItems, key) {
          toolItemsFlat.push({
            signature: 'disabled',
            group: key
          });
          _.each(toolItems, function (toolItem) {
            if (!toolItem.onlyInTouchBrowser || runsInTouchBrowser) {
              _.extend(toolItem, {group: key});
              toolItemsFlat.push(toolItem);
            }
          });
        });
        this.collection.reset(toolItemsFlat);
      } else {
      }
    }
  });

  return ToolItemsFactory;
});
