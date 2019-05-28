/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/models/node.actions',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin', 'csui/utils/promoted.actionitems',
  'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, NodeActionCollection, CommandableV2Mixin, promotedActionItems) {
  'use strict';

  var DelayedCommandableV2Mixin = {
    mixin: function (prototype) {
      CommandableV2Mixin.mixin(prototype);

      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {
        makeDelayedCommandableV2: function (options) {
          options || (options = {});
          var defaultActionCommands = options.defaultActionCommands;
          var promotedActionCommands = promotedActionItems.getPromotedCommandsSignatures();
          var nonPromotedActionCommands = [];
          if (typeof defaultActionCommands === 'string') {
            defaultActionCommands = defaultActionCommands.split(',');
          }
          this.defaultActionCommands = defaultActionCommands || [];
          this.promotedActionCommands = promotedActionCommands;
          this.nonPromotedActionCommands = nonPromotedActionCommands || [];
          this.delayedActions = new NodeActionCollection(undefined, {
            connector: options.connector
          });

          this.nonPromotedActions = new NodeActionCollection(undefined, {
            isNonPromoted: true,
            connector: options.connector
          });

          this.setEnabledDelayRestCommands(options.delayRestCommands);

          this.delayRestCommandsForModels = options.delayRestCommandsForModels;

          this.promotedActionItemsFromControler = promotedActionItems;

          return this.makeCommandableV2(options);
        },

        setEnabledDelayRestCommands: function (enable) {
          if (enable) {
            this._enableDelayRestCommands();
          } else {
            this._disableDelayRestCommands();
          }
        },

        setEnabledLazyActionCommands: function (enable) {
          var deferred = $.Deferred();
          if (enable) {
            this._enableNonPromotedRestCommands();
            this._requestsNonPromotedRestActions().done(function (node) {
              deferred.resolve(node);
            }).fail(function () {
                  deferred.reject();
                }
            );

          } else {
            this._disableNonPromotedRestCommands();
          }
          return deferred.promise();
        },

        _enableDelayRestCommands: function () {
          if (!this.delayRestCommands) {
            this.delayRestCommands = true;
            this.on('sync', this._requestRestActions, this);
          }
        },

        _disableDelayRestCommands: function () {
          if (this.delayRestCommands) {
            this.delayRestCommands = false;
            this.off('sync', this._requestRestActions, this);
          }
        },

        _enableNonPromotedRestCommands: function () {
          if (!this.enableNonPromotedCommands) {
            this.enableNonPromotedCommands = true;
            this.on('sync', this._requestsNonPromotedRestActions, this);
          }
        },

        _disableNonPromotedRestCommands: function () {
          this.enableNonPromotedCommands = false;
          this.off('sync', this._requestsNonPromotedRestActions, this);
        },

        _requestRestActions: function (model, resp, options) {
          if (model !== this || this instanceof Backbone.Collection && !this.length) {
            return;
          }
          if (options.xhr && options.xhr.settings.type !== 'GET') {
            return;
          }
          var defaultActionCommands  = this.defaultActionCommands,
              promotedActionCommands = this.promotedActionCommands;
          var restCommands        = _.reject(this.commands, function (command) {
                return _.contains(defaultActionCommands, command);
              }),
              promotedCommands    = [],
              nonPromotedCommands = [];
          _.each(restCommands, function (command) {
            if (_.contains(promotedActionCommands, command)) { //CurrentPromotedActions
              promotedCommands.push(command); // Delay Commands
            }
            else {
              nonPromotedCommands.push(command); // nonpromoted Commands
            }
          });

          this.promotedActionCommands = promotedCommands;
          this.nonPromotedActionCommands = nonPromotedCommands;
          if (promotedCommands.length) {
            var delayedActions = this.delayedActions;
            delayedActions.resetCommands();
            delayedActions.setCommands(promotedCommands);
            delayedActions.resetNodes();
            if (this instanceof Backbone.Collection) {
              var restNodes = [];
              this.each(function (model) {
                model.nonPromotedActionCommands = nonPromotedCommands;
                model.promotedActionCommands = promotedCommands;
                if (!model.get('csuiDelayedActionsRetrieved')) {
                  restNodes.push(model.get('id'));
                }
              });
              delayedActions.setNodes(restNodes);
            } else {
              model.nonPromotedActionCommands = nonPromotedCommands;
              model.promotedActionCommands = promotedCommands;
              delayedActions.setNodes([this.get('id')]);
            }
            delayedActions.parent_id = !!this.node ? this.node.get("id") : this.get("id");
            if (delayedActions.nodes.length > 0) {
              if (!delayedActions.connector) {
                this.connector.assignTo(delayedActions);
              }
              delayedActions
                  .fetch({
                    reset: true,
                    success: _.bind(this._updateOriginalActions, this)
                  });
            }
          } else {
            if (this instanceof Backbone.Collection) {
              this.each(function (model) {
                model.nonPromotedActionCommands = nonPromotedCommands;
                model.promotedActionCommands = promotedCommands;
              });
            } else {
              model.nonPromotedActionCommands = nonPromotedCommands;
              model.promotedActionCommands = promotedCommands;
            }
          }
        },

        _requestsNonPromotedRestActions: function () {
          var deferred = $.Deferred();
          var nonPromotedActions        = this.nonPromotedActions,
              nonPromotedActionCommands = this.nonPromotedActionCommands.length ?
                                          this.nonPromotedActionCommands :
                                          this.collection.nonPromotedActionCommands;
          nonPromotedActions.resetCommands();
          nonPromotedActions.setCommands(nonPromotedActionCommands);
          nonPromotedActions.resetNodes();
          if (this instanceof Backbone.Collection) {
            var restNodes = [];
            this.each(function (model) {
              if (!model.get('csuiLazyActionsRetrieved') && !model.isLocallyCreated) {
                restNodes.push(model.get('id'));
              }
            });
            nonPromotedActions.parent_id = this.length && this.models[0].get("reference_id");
            nonPromotedActions.setNodes(restNodes);
          } else {
            nonPromotedActions.setNodes([this.get('id')]);
            nonPromotedActions.parent_id = this.get("reference_id");
          }

          if (!nonPromotedActions.connector) {
            this.connector.assignTo(nonPromotedActions);
          }
          if (nonPromotedActions.commands.length && nonPromotedActions.nodes.length) {
            nonPromotedActions
                .fetch({
                  reset: true,
                  success: _.bind(function () {
                    this._updateOriginalActionsAfterLazyActions();
                    deferred.resolve(this);
                  }, this),
                  fail: function () {
                    this.attributes.csuiLazyActionsRetrieved = true;
                    deferred.reject();
                  }
                });
          } else {
            this.set('csuiLazyActionsRetrieved', true);
            deferred.resolve(this);
          }
          return deferred.promise();
        },

        _updateOriginalActions: function () {
          var delayedActions = this.delayedActions;

          function updateNodeActions(node) {
            var actionNode = delayedActions.get(node.get('id'));
            if (actionNode) {
              node.actions.add(actionNode.actions.models);
              node.set('csuiDelayedActionsRetrieved', true);
            }
          }

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        _updateOriginalActionsAfterLazyActions: function () {
          var nonPromotedActions = this.nonPromotedActions,
              updateNodeActions  = function (node) {
                node.attributes.csuiLazyActionsRetrieved = true;
                var actionNode = nonPromotedActions.get(node.get('id'));
                if (actionNode) {
                  _.each(actionNode.actions.models, function (action) {
                    action.attributes.csuiNonPromotedAction = true;
                  });
                  node.actions.add(actionNode.actions.models);
                }
              };

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        setDefaultActionCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(',');
          }
          _.each(name, function (name) {
            if (!_.contains(this.defaultActionCommands, name)) {
              this.defaultActionCommands.push(name);
            }
          }, this);
        },

        resetDefaultActionCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(',');
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.defaultActionCommands, name);
              if (index >= 0) {
                this.defaultActionCommands.splice(index, 1);
              }
            }, this);
          } else {
            this.defaultActionCommands.splice(0, this.defaultActionCommands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          var commands = this.delayRestCommands ?
                         this.defaultActionCommands : this.commands;
          return commands.length && {actions: commands};
        },

        getAllCommandsUrlQuery: function () {
          var commands = this.commands;
          return commands.length && {actions: commands};
        },
        _prepareModel: function (attrs, options) {
          var delayRestCommands, delayRestCommandsForModels;
          options || (options = {});
          if (this.delayedActions) {
            delayRestCommands = options.delayRestCommands;
            if (delayRestCommands === undefined) {
              delayRestCommands = this.delayRestCommands;
            }
            delayRestCommandsForModels = options.delayRestCommandsForModels;
            if (delayRestCommandsForModels === undefined) {
              delayRestCommandsForModels = this.delayRestCommandsForModels;
            }
          } else {
            delayRestCommands = options.delayRestCommands;
            delayRestCommandsForModels = options.delayRestCommandsForModels;
          }
          options.delayRestCommands = delayRestCommandsForModels;
          options.delayRestCommandsForModels = false;
          var model = originalPrepareModel.call(this, attrs, options);
          options.delayRestCommands = delayRestCommands;
          options.delayRestCommandsForModels = delayRestCommandsForModels;
          return model;
        }
      });
    }
  };

  return DelayedCommandableV2Mixin;
});
