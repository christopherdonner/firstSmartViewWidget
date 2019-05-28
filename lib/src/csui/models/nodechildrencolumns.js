/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/models/nodechildrencolumn"
], function (module, _, Backbone,
             log, NodeChildrenColumnModel) {
  "use strict";
  var NodeChildrenColumnCollection = Backbone.Collection.extend({

    model: NodeChildrenColumnModel,

    constructor: function NodeChildrenColumnCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.fetched = false;
    },
    resetCollection: function (models, options) {
      if (this.cachedColumns && _.isEqual(models, this.cachedColumns)) {
        return;
      }
      this.cachedColumns = _.map(models, function (model) {
        return _.clone(model);
      });

      this.reset(models, options);
      this.fetched = true;
    },
    getColumnModels: function (columnKeys, definitions) {
      var columns = _.reduce(columnKeys, function (colArray, column) {
        if (column.indexOf('_formatted') >= 0) {
          var shortColumnName = column.replace(/_formatted$/, '');
          if (definitions[shortColumnName]) {
            return colArray;
          }
        } else {
          var definition_short = definitions[column];
          if (definition_short && !definition_short.definitions_order) {
            var definition_formatted = definitions[column + '_formatted'];
            if (definition_formatted && definition_formatted.definitions_order) {
              definition_short.definitions_order = definition_formatted.definitions_order;
            }
          }
        }
        var definition = definitions[column];
        switch (column) {
          case "name":
            definition = _.extend(definition, {
              default_action: true,
              contextual_menu: false,
              editable: true,
              filter_key: "name"
            });
            break;
          case "type":
            definition = _.extend(definition, {
              default_action: true
            });
            break;
          case "modify_date":
            definition = _.extend(definition, {
              initialSortingDescending: true
            });
            break;
        }

        colArray.push(_.extend({column_key: column}, definition));
        return colArray;
      }, []);
      return columns;
    },
    resetColumns: function (response, options) {
      this.resetCollection(this.getV1Columns(response, options), options);
    },
    getV1Columns: function (response, options) {
      var definitions = response.definitions,
        columnKeys = options && options.columnsFromDefinitionsOrder ?
          response.definitions_order : _.keys(definitions);
      if (response.definitions_order) {
        for (var idx = 0; idx < response.definitions_order.length; idx++) {
          var column_key = response.definitions_order[idx],
              definition = definitions[column_key];
          if (definition) {
            definition.definitions_order = 500 + idx;
          }
        }
      }

      return this.getColumnModels(columnKeys, definitions);
    },
    resetColumnsV2: function (response, options) {
      this.resetCollection(this.getV2Columns(response), options);
    },
    getV2Columns: function (response) {

      var definitions = (response.results &&
        response.results[0] &&
        response.results[0].metadata &&
        response.results[0].metadata.properties) || {};
      if (!definitions.size &&
        (definitions.container_size ||
        (definitions.versions && definitions.versions.file_size))) {
        definitions.size = definitions.container_size || definitions.versions.file_size;
        definitions.size.align = 'right';
        definitions.size.key = 'size';
        definitions.size.name = 'Size';
      }

      var columnKeys = _.keys(definitions);

      return this.getColumnModels(columnKeys, definitions);
    }

  });
  NodeChildrenColumnCollection.version = '1.0';

  return NodeChildrenColumnCollection;

});
