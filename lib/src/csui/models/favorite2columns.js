/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/favorite2column'
], function (_, Backbone, Favorite2ColumnModel) {
  'use strict';

  var Favorite2ColumnCollection = Backbone.Collection.extend({

    model: Favorite2ColumnModel,
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

    resetFavoritesCollection: function (response, options) {
      var models;
      if (response && response.columns && response.columns instanceof Array) {
        models = _.map(response.columns, function (column) {
          return new Favorite2ColumnModel(column);
        });
      } else {
        models = [
          new Favorite2ColumnModel({
            "default_action": true,
            "column_key": "type",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Type",
            "required": false,
            "type": 2,
            "type_name": "Integer"
          }),
          new Favorite2ColumnModel({
            "default_action": true,
            "column_key": "favorite_name",
            "max_length": null,
            "min_length": null,
            "multi_value": false,
            "multiline": false,
            "multilingual": false,
            "name": "Name",
            "password": false,
            "required": false,
            "type": -1,
            "type_name": "String"
          }),
          new Favorite2ColumnModel({
            "column_key": "reserved",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Reserved",
            "required": false,
            "type": 5,
            "type_name": "Boolean"
          }),
          new Favorite2ColumnModel({
            "column_key": "parent_id",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Parent ID",
            "required": false,
            "type": 2,
            "type_name": "Integer"
          }),
          new Favorite2ColumnModel({
            "column_key": "favorite",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Favorite",
            "required": false,
            "type": 5,
            "type_name": "Boolean"
          })
        ];
      }

      this.resetCollection(models, options);
    }

  });

  return Favorite2ColumnCollection;
});
