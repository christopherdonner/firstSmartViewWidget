/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/utils/base',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/favorite2group', 'csui/models/favorites2',
  'csui/models/server.adaptors/favorite2groups.mixin',
  'i18n!csui/models/impl/nls/lang'
], function ($, _, Backbone, Url, base, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, SyncableFromMultipleSources,
    Favorite2GroupModel, Favorite2Collection, ServerAdaptorMixin, lang) {
  'use strict';

  var Favorite2GroupsCollection = Backbone.Collection.extend({
    model: Favorite2GroupModel,

    constructor: function Favorite2GroupsCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand' /*, 'commands'*/]);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeServerAdaptor(options);

      if (options) {
        this.favorites = options.favorites;
        this.commands = options.commands;
      }
      if (!this.favorites) {
        this.favorites = new Favorite2Collection(undefined, {
          connector: this.connector,
          autoreset: true,
          commands: this.commands
        });
      }
      this.on('sync', this._setupEventPropagation, this);
      this.on('add', this._propagateFavorite2CollectionOptions, this);
      this.on('reset', function (groups, options) {
        var self = this;
        groups.each(function (group) {
          self._propagateFavorite2CollectionOptions(group, groups, options);
        });
      }, this);
    },

    _fetch: function (options) {
      options || (options = {});
      options.originalSilent = options.silent;
      options.silent = true;

      return this.originalFetch.call(this, options);
    },

    _prepareModel: function (attrs, options) {
      options || (options = {});
      options.commands = this.commands;
      return Backbone.Collection.prototype._prepareModel.call(this, attrs, options);
    },

    _setupEventPropagation: function () {
      var self = this;
      this.each(function (group) {
        group.favorites.listenTo(group.favorites, "reset update",
            function (favoritesCollection, options) {
              self.trigger('update', self, options);
            });

      }, this);
    },
    _propagateFavorite2CollectionOptions: function (group, collection, options) {
      group.favorites.setFilter(_.deepClone(this.favorites.filters), false);
      group.favorites.setOrder(this.favorites.orderBy, false);
      group.favorites.setExpand(_.deepClone(this.favorites.expand));
      if (this.favorites.commands) {
        group.favorites.setCommands(this.favorites.commands);
      }
    },

    clone: function () {
      var clone = new this.constructor(this.models, {
        connector: this.connector,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        expand: _.clone(this.expand),
        commands: _.clone(this.commands),
        favorites: this.favorites.clone()
      });

      return clone;
    },

    getSortByOrderUrlQuery: function () {
      return {sort: 'order'};
    },
    resetCollection: function (models, options) {
      this.reset(models, options);
      this.fetched = true;
    },

    saveAll: function () {
      var self = this;
      var tabs = this.map(function (group) {
        var groupName;
        var groupId = group.get('tab_id');
        if (groupId == -1) {
          groupName = null; // the ungrouped group has no name
        } else {
          groupName = group.get('name');
        }
        return {
          name: groupName, tab_id: groupId, favorites: group.favorites.map(function (favorite) {
            return {
              id: favorite.get('id'),
              name: favorite.get('favorite_name')
            };
          })
        };
      });
      var putUrl = this.connector.connection.url.replace('/v1', '/v2');
      putUrl = Url.combine(putUrl, '/csui/favorites');
      this.callCounter++;

      var options = {
        type: 'PUT',
        url: putUrl,
        data: {body: JSON.stringify(tabs)},
        beforeSend: function (request, settings) {
          request.counter = self.callCounter;
        }
      };
      this.connector.extendAjaxOptions(options);  // among others, add OTCS ticket to options

      var deferred = Backbone.$.Deferred();
      var jqxhr = Backbone.ajax(options);
      jqxhr.then(function (response) {
        if (jqxhr.counter < self.callCounter) {
          deferred.reject();
        } else {
          options = {
            type: 'GET',
            url: self.url()
          };
          self.connector.extendAjaxOptions(options);  // among others, add OTCS ticket to options
          var jqxhrTabs = Backbone.ajax(options)
              .then(function (tabsResp) {
                if (tabsResp.results && tabsResp.results instanceof Array) {

                  tabsResp.results.forEach(function (elem, index) {
                    if (elem.data) {
                      var group = self.at(index);
                      self.remove(group, {silent: true});
                      group.set('tab_id', elem.data.tab_id, {silent: true});
                      self.add(group, {at: index, silent: true});

                      group.set('order', elem.data.order, {silent: true});
                      for (var i = 0; i < group.favorites.length; i++) {
                        var favorite = group.favorites.at(i);
                        group.favorites.remove(favorite, {silent: true});
                        favorite.set('favorite_tab_id', elem.data.tab_id, {silent: true});
                        group.favorites.add(favorite, {at: i, silent: true});
                      }
                    }
                  });

                }
                deferred.resolve(response);
                self.trigger('bulk:update:succeed');
              }, function (jqxhrTabs, statusText) {
                var errorTabs = new base.RequestErrorMessage(jqxhrTabs);
                deferred.reject(errorTabs);
                self.trigger('bulk:update:fail');
              });
        }
      }, function (jqxhr, statusText) {
        if (jqxhr.counter < self.callCounter) {
          deferred.reject();
        } else {
          var error = new base.RequestErrorMessage(jqxhr);
          deferred.reject(error);
        }
        self.trigger('bulk:update:fail');
      });
      return deferred.promise();
    }
  });

  ConnectableMixin.mixin(Favorite2GroupsCollection.prototype);
  FetchableMixin.mixin(Favorite2GroupsCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(Favorite2GroupsCollection.prototype);
  FieldsV2Mixin.mixin(Favorite2GroupsCollection.prototype);
  ExpandableV2Mixin.mixin(Favorite2GroupsCollection.prototype);
  SyncableFromMultipleSources.mixin(Favorite2GroupsCollection.prototype);
  ServerAdaptorMixin.mixin(Favorite2GroupsCollection.prototype);

  return Favorite2GroupsCollection;
});
