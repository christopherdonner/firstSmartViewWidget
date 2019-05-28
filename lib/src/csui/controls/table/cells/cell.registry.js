/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'], function (_) {

  function CellViewRegistry() {
    this._columnKeys = {};
    this._columnOtherKeys = {};
    this._dataTypes = {};
  }

  _.extend(CellViewRegistry.prototype, {

    hasCellViewByOtherKey: function (columnKey) {
      return !!this._columnOtherKeys[columnKey];
    },

    getCellView: function (columnDefinition) {
     var columnTypeIdentifier = columnDefinition.get('column_type_identifier');
     if (columnTypeIdentifier !== 'type') {
       var columnKey = columnDefinition.get('column_key'),
           CellView = columnKey && this._columnKeys[columnKey];
       if (CellView) {
         return CellView;
       }
     }
     var dataType = columnDefinition.get('type');
     return dataType && this._dataTypes[dataType.toString()];
    },

    registerByColumnKey: function (columnKey, handlerClass) {
      if (!(_.isString(columnKey) && columnKey)) {
        throw new Error('Column key must be a non-empty string');
      }
      this._registerCellView(this._columnKeys, columnKey, handlerClass);
    },

    registerByOtherColumnKey: function(columnKey, handlerClass) {
      if (!(_.isString(columnKey) && columnKey)) {
        throw new Error('Column key must be a non-empty string');
      }
      this._registerCellView(this._columnOtherKeys, columnKey, handlerClass);
    },

    registerByDataType: function (dataType, handlerClass) {
      if (!(_.isNumber(dataType) && dataType)) {
        throw new Error('Data type must be a non-zero number');
      }
      this._registerCellView(this._dataTypes, dataType.toString(),
          handlerClass);
    },

    _registerCellView: function (handlerMap, handlerKey, handlerClass) {
      if (typeof handlerClass !== 'function') {
        throw new Error('Column handler must be a function object');
      }
      handlerMap[handlerKey] = handlerClass;
    }

  });

  return new CellViewRegistry();

});
