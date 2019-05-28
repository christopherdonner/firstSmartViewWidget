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

  var MyAssignmentColumnModel = NodeChildrenColumnModel.extend({

    constructor: function MyAssignmentColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'ma_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options);
    }

  });

  var MyAssignmentColumnCollection = NodeChildrenColumnCollection.extend({

    model: MyAssignmentColumnModel,
    getColumnModels: function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions);
      _.each(columns, function (column) {
        var columnKey = column['column_key'];
        if (columnKey === 'type' || columnKey === 'name' || columnKey === 'location_id' ||
            columnKey === 'date_due' || columnKey === 'priority' || columnKey === 'status' ||
            columnKey === 'from_user_name') {
          column.sort = true;
          if (columnKey === 'location_id') {
            column.sort_key = 'location_name';
          }
        }
      });
      return columns;
    },
    getV2Columns: function (response) {

      var definitions = (response.results && response.results[0] &&
                         response.results[0].metadata &&
                         response.results[0].metadata.assignments) || {};
      if (!definitions.location_id_expand && definitions.name) {
        definitions.location_id_expand = _.clone(definitions.name);
        definitions.location_id_expand.key = 'location_id_expand';
        definitions.location_id_expand.name = 'Location';
      }
      if (!definitions.from_user_id_expand && definitions.name) {
        definitions.from_user_id_expand = _.clone(definitions.name);
        definitions.from_user_id_expand.key = 'from_user_id_expand';
        definitions.from_user_id_expand.name = 'From';
      }
      if (!definitions.location_name && definitions.name) {
        definitions.location_name = _.clone(definitions.name);
        definitions.location_name.key = 'location_name';
        definitions.location_name.name = 'Location Name';
      }
      if (!definitions.from_user_name && definitions.name) {
        definitions.from_user_name = _.clone(definitions.name);
        definitions.from_user_name.key = 'from_user_name';
        definitions.from_user_name.name = 'From';
      }

      var columnKeys = _.keys(definitions);

      return this.getColumnModels(columnKeys, definitions);
    }

  });

  var MyAssignmentModel = NodeModel.extend({

    parse: function (response, options) {
      var assignments = response.data.assignments;
      assignments.short_name = assignments.name;

      var location_expand;
      if (assignments.location_id_expand) {
        location_expand = assignments.location_id_expand;
      } else if (assignments.workflow_subworkflow_id_expand) {
        location_expand = assignments.workflow_subworkflow_id_expand;
      } else if (assignments.workflow_id_expand) {
        location_expand = assignments.workflow_id_expand;
      } else if (assignments.workflow_subworkflow_task_id_expand) {
        location_expand = assignments.workflow_subworkflow_task_id_expand;
      }
      assignments.location_name = (location_expand && location_expand.name) || '';

      var from_user_id_expand = assignments.from_user_id_expand || {};
      var name = from_user_id_expand.first_name || '';
      name = name + ' ' + (from_user_id_expand.last_name || '');
      if (!name.length || (name.length === 1 && name === ' ')) {
        name = from_user_id_expand.name;
      }
      assignments.from_user_name = name;

      if (response.data && response.data.assignments) {
        response.data.properties = response.data.assignments;
      }

      var node = NodeModel.prototype.parse.call(this, response, options);
      return node;
    }

  });

  var MyAssignmentCollection = Backbone.Collection.extend({

    model: MyAssignmentModel,

    constructor: function MyAssignmentCollection(attributes, options) {
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

      this.columns = new MyAssignmentColumnCollection();
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
              this.getRequestedCommandsUrlQuery()
          );
      url = Url.combine(url, '/members/assignments');
      return query ? url + '?' + query : url;
    },

    parse: function (response, options) {
      response.results = _.filter(response.results, function (item) {
        return item.data.assignments.type != 398; //pstage
      });

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

  ClientSideBrowsableMixin.mixin(MyAssignmentCollection.prototype);
  var originalCompareValues = MyAssignmentCollection.prototype._compareValues;
  MyAssignmentCollection.prototype._compareValues = function (property, left, right) {
    if (property.indexOf('date') >= 0) {
      if (left === null) {
        return 1;
      }
      if (right === null) {
        return -1;
      }
    }
    return originalCompareValues.apply(this, arguments);
  };

  BrowsableV2ResponseMixin.mixin(MyAssignmentCollection.prototype);
  ConnectableMixin.mixin(MyAssignmentCollection.prototype);
  FetchableMixin.mixin(MyAssignmentCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(MyAssignmentCollection.prototype);
  FieldsV2Mixin.mixin(MyAssignmentCollection.prototype);
  ExpandableV2Mixin.mixin(MyAssignmentCollection.prototype);
  CommandableV2Mixin.mixin(MyAssignmentCollection.prototype);

  return MyAssignmentCollection;

});
