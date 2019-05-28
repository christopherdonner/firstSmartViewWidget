/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'], function (_) {

  function ContentViewRegistry() {
    this._contentKeys = {};
    this._dataTypes = {};
  }

  _.extend(ContentViewRegistry.prototype, {

    getContentView: function (contentDefinition) {
      var columnTypeIdentifier = contentDefinition.get('column_type_identifier');
      if (columnTypeIdentifier !== 'type') {
        var columnKey   = contentDefinition.get('key'),
            ContentView = columnKey && this._contentKeys[columnKey];
        if (ContentView) {
          return ContentView;
        }
      }
      var dataType = contentDefinition.get('type');
      return dataType && this._dataTypes[dataType.toString()];
    },

    registerByKey: function (key, handlerClass) {
      if (!(_.isString(key) && key)) {
        throw new Error('Key must be a non-empty string');
      }
      this._registerContentView(this._contentKeys, key, handlerClass);
    },

    registerByDataType: function (dataType, handlerClass) {
      if (!(_.isNumber(dataType) && dataType)) {
        throw new Error('Data type must be a non-zero number');
      }
      this._registerContentView(this._dataTypes, dataType.toString(),
          handlerClass);
    },

    _registerContentView: function (handlerMap, handlerKey, handlerClass) {
      if (typeof handlerClass !== 'function') {
        throw new Error('Column handler must be a function object');
      }
      handlerMap[handlerKey] = handlerClass;
    }
  });
  return new ContentViewRegistry();
});