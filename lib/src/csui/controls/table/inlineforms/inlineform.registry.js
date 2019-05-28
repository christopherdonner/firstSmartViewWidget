/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'], function (_) {

  function InlineFormViewRegistry() {
    this._addableTypes = {};
  }

  _.extend(InlineFormViewRegistry.prototype, {

    getInlineFormView: function(addableType){
      return this._addableTypes[addableType];
    },

    registerByAddableType: function (addableType, InlineFormViewClass) {
      if (!(_.isNumber(addableType))) {
        throw new Error('addableType key must be a number');
      }
      this._addableTypes[addableType] = InlineFormViewClass;
    }
  });

  return new InlineFormViewRegistry();
});
