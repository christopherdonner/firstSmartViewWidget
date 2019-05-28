/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/node', 'csui/models/node.columns2',
  'csui/utils/log'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeColumn2Collection, log) {
  'use strict';

  log = log(module.id);

  var Column2CollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'columns2',

    constructor: function Column2CollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns2 || {};
      if (!(columns instanceof Backbone.Collection)) {
        var node = columns.options && columns.options.node ||
                   context.getModel(NodeModelFactory, options);
        this.property = new NodeColumn2Collection();
        this.node = node;
        node.columns.on('reset', this._resetColumns, this);
        this._resetColumns();
      } else {
        this.property = columns;
      }
    },

    _resetColumns: function () {
      var node          = this.node,
          definitionMap = {},
          definitions   = node.definitions.map(function (definition) {
            definition = definition.toJSON();
            var key = definition.key;
            definition.column_key = key;
            switch (key) {
            case 'name':
              definition.default_action = true;
              definition.contextual_menu = false;
              definition.editable = true;
              definition.filter_key = key;
              break;
            case 'type':
              definition.default_action = true;
              break;
            case 'modify_date':
              definition.initialSortingDescending = true;
              break;
            }
            definitionMap[key] = definition;
            if (definition.sort_key) {
              definition.sort = true;
              delete definition.sort_key;
            }
            return definition;
          });
      node.columns.each(function (column, index) {
        var columnKey      = column.get('key'),
            formattedIndex = columnKey.lastIndexOf('_formatted'),
            order          = 500 + index,
            definition;
        if (formattedIndex >= 0) {
          var realColumnKey = columnKey.substr(0, columnKey.length - 10);
          definition = definitionMap[realColumnKey];
          if (definition) {
            definition.definitions_order = order;
            return;
          }
        }
        definition = definitionMap[columnKey];
        if (definition) {
          definition.definitions_order = order;
        } else {
          log.warn('No definition found for the column "{0}".', columnKey);
        }
      });

      if (areDifferent(this.property, definitions)) {
        this.property.reset(definitions);
      }
    }
  });

  var columnProperties = [
    'description', 'key', 'multi_value', 'name', 'type', 'type_name'];

  function areDifferent(collection, objects) {
    return collection.length !== objects.length ||
           collection.some(function (model, index) {
             var expected = _.pick(objects[index], columnProperties),
                 actual = _.pick(model.attributes, columnProperties);
             return !_.isEqual(expected, actual);
           });
  }

  return Column2CollectionFactory;
});
