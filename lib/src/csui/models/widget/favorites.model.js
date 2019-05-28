/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin',
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns',
  'csui/models/node/node.model', 'i18n!csui/models/widget/nls/lang',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, CommandableV2Mixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin, NodeChildrenColumnModel,
    NodeChildrenColumnCollection, NodeModel, lang) {
  'use strict';

  var FavoriteColumnModel = NodeChildrenColumnModel.extend({

    constructor: function FavoriteColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'fav_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var FavoriteColumnCollection = NodeChildrenColumnCollection.extend({

    model: FavoriteColumnModel,
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'modify_date' ||
            columnKey === 'parent_id' || columnKey == 'size') {
          column.sort = true;
        }
      });
      return columns;
    }

  });

  var FavoriteModel = NodeModel.extend({

    parse: function (response, options) {
      var fav, fav_version;
      if (response.data && response.data.properties) {
        fav = response.data.properties;
        fav_version = response.data.versions;
      } else {
        fav = response;
        fav_version = response.versions;
      }
      fav.short_name = fav.name; // fav.name.length > 20 ? fav.name.substr(0, 20) + '...' : fav.name;
      if (!fav.size) {
        if (fav.container) {
          fav.size = fav.container_size;
        } else if (fav_version) {
          fav.size = fav_version.file_size;
        }
      }
      if (!fav.mime_type && fav_version && fav_version.mime_type) {
        fav.mime_type = fav_version.mime_type;
      }
      return NodeModel.prototype.parse.call(this, response, options);
    }

  });

  var FavoriteCollection = Backbone.Collection.extend({

    model: FavoriteModel,

    constructor: function FavoriteCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);

      this.columns = new FavoriteColumnCollection();
    },

    clone: function () {
      var clone = new this.constructor(this.models, this.options);
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    url: function () {
      var url = this.connector.connection.url.replace('/v1', '/v2'),
          query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery(),
              this.getBrowsableUrlQuery()
          );
      url = Url.combine(url, '/members/favorites');
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      this.parseBrowsedState(response, options);
      this.columns && this.columns.resetColumnsV2(response, this.options);
      return this.parseBrowsedItems(response, options);
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
    }

  });

  ClientSideBrowsableMixin.mixin(FavoriteCollection.prototype);
  BrowsableV2ResponseMixin.mixin(FavoriteCollection.prototype);
  ConnectableMixin.mixin(FavoriteCollection.prototype);
  FetchableMixin.mixin(FavoriteCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(FavoriteCollection.prototype);
  FieldsV2Mixin.mixin(FavoriteCollection.prototype);
  ExpandableV2Mixin.mixin(FavoriteCollection.prototype);
  CommandableV2Mixin.mixin(FavoriteCollection.prototype);

  return FavoriteCollection;

});
