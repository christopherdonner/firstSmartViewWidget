/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/controls/toolbar/toolitem.model',
  'csui/controls/toolbar/toolitems.factory', 'csui/utils/commands'
], function (require, _, $, Backbone, ToolItemModel, ToolItemsFactory,
    commands) {
  'use strict';

  var FilteredToolItemsCollection = Backbone.Collection.extend({
    constructor: function FilteredToolItemsCollection(models, options) {
      if (_.isArray(models)) {
        this.unfilteredModels = models; // save for re-filter
      } else {
        if (models instanceof ToolItemsFactory) {
          this.addTrailingDivider = models.options.addTrailingDivider;
          this.addGroupSeparators = models.options.addGroupSeparators !== false;
          this.suppressGroupSeparators = models.options.suppressGroupSeparators;
          var collection = models.getCollection();
          this.unfilteredModels = collection.models;
          this.listenTo(collection, 'add', this.refilter, this)
              .listenTo(collection, 'remove', this.refilter, this)
              .listenTo(collection, 'reset', function () {
                this.unfilteredModels = collection.models;
                this.refilter();
              }, this);
        } else {
          if (models instanceof Backbone.Collection &&
              models.model instanceof ToolItemModel) {
            this.unfilteredModels = models.models;
          }
        }
      }

      options || (options = {});
      this.commands = options.commands || commands;
      this.setStatus(options.status);
      this.delayedActions = options.delayedActions;
      this.mask = options.mask;
      this._filtering = 0;

      Backbone.Collection.prototype.constructor.call(this,
          this.unfilteredModels, options);

      if (this.delayedActions) {
        this.listenTo(this.delayedActions, 'sync', this.refilter)
            .listenTo(this.delayedActions, 'error', this.refilter);
      }
      if (this.mask) {
        this.listenTo(this.mask, 'update', this.refilter);
      }
    },

    sort: function(options) {
      options || (options = {});
      var array = this.models,
          comparator = function (leftIndex, rightIndex) {
            var thisLazy = !!array[leftIndex].get('csuiNonPromotedItem'),
              otherLazy = !!array[rightIndex].get('csuiNonPromotedItem');
            if (!thisLazy && otherLazy) {
              return -1;
            } else if (thisLazy && !otherLazy) {
              return 1;
            }
            return (leftIndex - rightIndex);
          };
      this.models = array
                      .map(function (item, index) {
                        return index;
                      })
                      .sort(comparator)
                      .map(function (index) {
                        return array[index];
                      });
      if (!options.silent) {
        this.trigger('sort', this, options);
      }
      return this;
    },

    destroy: function () {
      this.stopListening();
    },

    refilter: function () {
      if (!this._filtering) {
        ++this._filtering;
        var resolving = this._resolveCustomViews();
        if (resolving) {
          resolving.always(updateCollection.bind(this));
        } else {
          updateCollection.call(this);
        }
      }

      function updateCollection() {
        var filteredModels = this.filterModels(this.unfilteredModels);
        this.reset(filteredModels, {silent: !!this.silentFetch});
        this.silentFetch = false;
        --this._filtering;
      }
    },
    set: function (models, options) {
      if (!this._filtering) {
        models = this.filterModels(models);
      }
      return Backbone.Collection.prototype.set.call(this, models, options);
    },

    setStatus: function (status) {
      if (status) {
        if (this.status) {
          if (this.status.nodes) {
            this.status.nodes.remove(this.status.container);
            this.stopListening(this.status.nodes);
          }
          this.status.container && this.stopListening(this.status.container);
        }
        this.status = status;

        if (status.nodes) {
          var listenEvents = ['change', 'reset'];
          listenEvents = _.union(listenEvents, status.listenEvents);
          var events = listenEvents.join(' ');

          this.listenTo(status.nodes, events, this.refilter);
        }
        if (status.container) {
          this.listenTo(status.container, 'change', this.refilter);
        }
      }
    },

    filterModels: function (models) {
      if (this.delayedActions && (this.delayedActions.fetching ||
                                  this.delayedActions.error) ||
          !this.status) {
        return [];
      }
      ++this._filtering;
      var filteredModels = this._filterToolItems(models);
      filteredModels = _.reject(filteredModels, function (model) {
        return model.get('flyout') && model.get('promoted') === false && !model.toolItems.length;
      });
      _.each(filteredModels, function (model) {
        if (model.get('flyout') && model.toolItems.length === 1 &&
            model.toolItems.first().get('promoted')) {
          var name = model.get('name');
          model.set(model.toolItems.first().attributes);
          if (name) {
            model.set('name', name);
          }
        }
      });
      --this._filtering;
      return filteredModels;
    },

    _filterToolItems: function (models) {
      var filteredModels = new Backbone.Collection(undefined,
          {model: ToolItemModel});
      _.each(models, function (model) {
        if (this.mask && !this.mask.passItem(model)) {
          return;
        }
        model = model.clone();
        var flyout = model.get('flyout'),
            toolItems = filteredModels;
        if (flyout) {
          var flyoutItem = filteredModels.findWhere({flyout: flyout});
          if (!flyoutItem) {
            model.toolItems = new Backbone.Collection(undefined,
                {model: ToolItemModel}); 
          } else {
            toolItems = flyoutItem.toolItems;
          }
        }
        var command = this.commands.get(model.get('signature')),
            forceEnabled = model.get('enabled');
        if (command) {
          var data = _.extend({}, this.status.data, model.get('commandData')),
              status = _.defaults({
                toolItem: model,
                data: data
              }, this.status);
          if (command.isNonPromoted && !!command.isNonPromoted(status)) {
            model.set('csuiNonPromotedItem', true);
          }
          if (command.enabled && !command.enabled(status, {data: model.get('commandData')}) && !forceEnabled) {
            model = null;
          } else if (flyout) {
            var actions = model.get('actions');
            if (actions) {
              actions = new Backbone.Collection(actions,
                  {model: ToolItemModel});
              actions = this._filterToolItems(actions.models);
              model.toolItems.reset(actions);
            }
          }
        } else if (!model.toolItems && !forceEnabled) {
          model = null;
        }
        if (model) {
          var group = model.get('group'),
              index = toolItems.findLastIndex(function (model) {
                return model.get('group') === group;
              });
          if (index < 0) {
            if (toolItems.length > 0 && this.addGroupSeparators &&
                (!this.suppressGroupSeparators || this.suppressGroupSeparators.indexOf(group) === -1)) {
              toolItems.push(ToolItemModel.createSeparator());
            }
            toolItems.push(model);
          } else {
            toolItems.add(model, {at: index + 1});
          }
          model.status = this.status;
        }
      }, this);
      return filteredModels.models;
    },

    _resolveCustomViews: function () {
      var customToolItems = this.unfilteredModels.filter(function (toolItem) {
        return typeof toolItem.get('customView') === 'string';
      });
      if (!customToolItems.length) {
        return;
      }
      var customModules = customToolItems.map(function (toolItem) {
            return toolItem.get('customView');
          }),
          deferred      = $.Deferred();
      require(customModules,
          function () {
            for (var i = 0, count = customModules.length; i < count; ++i) {
              customToolItems[i].set('customView', arguments[i]);
            }
            deferred.resolve();
          }, function (error) {
            for (var i = 0, count = customModules.length; i < count; ++i) {
              customToolItems[i].set('customView', error);
            }
            deferred.reject(error);
          });
      return deferred.promise();
    }
  });

  return FilteredToolItemsCollection;
});
