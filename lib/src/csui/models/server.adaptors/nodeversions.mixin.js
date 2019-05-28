/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var query = Url.combineQueryString(
            this.getExpandableResourcesUrlQuery(),
            {
              extra: false,
              commands: this.options.commands || []
            }
          );
          return Url.combine(this.node.urlBase(), '/versions?' + query);
        },

        parse: function (response) {
          var definitions = response.definitions;
          var columnKeys = _.keys(definitions);  // use all columns not only those in definitions_order

          if (!this.options.onlyClientSideDefinedColumns) {
            if (response.definitions_order) {
              for (var idx = 0; idx < response.definitions_order.length; idx++) {
                var column_key = response.definitions_order[idx];
                definitions[column_key].definitions_order = 500 + idx;
              }
            }
          }

          this.columns.reset(this.getColumnModels(columnKeys, definitions));

          if (response.data) {
            _.each(response.data, function (version) {
              version.id_expand = {};
              version.id_expand.type = this.node.get('type');
              if (!(version.commands || version.actions)) {
                fakeActions(this.node, version);
              }
            }, this);
          }

          return response.data;
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
              if (!definition_short.definitions_order) {
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
            }

            definition.sort = true;

            colArray.push(_.extend({column_key: column}, definition));
            return colArray;
          }, []);
          return columns;
        }

      });
    }
  };
  function fakeActions(node, version) {
    var actions = [];
    if (node.actions.findRecursively('download') || node.actions.findRecursively('Download')) {
      actions.push({signature: 'versions_download'}, {signature: 'versions_open'});
    }
    if (node.actions.findRecursively('delete') || node.actions.findRecursively('Delete')) {
      actions.push({signature: 'versions_delete'});
    }
    if (node.actions.findRecursively('properties') || node.actions.findRecursively('Properties')) {
      actions.push({signature: 'versions_properties'});
    }
    version.actions = actions;
  }

  return ServerAdaptorMixin;
});
