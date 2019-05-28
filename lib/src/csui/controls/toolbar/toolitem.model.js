/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';

  var ToolItemModel = Backbone.Model.extend({
    idAttribute: null,

    isSeparator: function () {
      return this.get('signature') == ToolItemModel.separator_signature;
    }
  });

  ToolItemModel.createSeparator = function () {
    return new ToolItemModel({signature: ToolItemModel.separator_signature});
  };

  ToolItemModel.separator_signature = '-';

  return ToolItemModel;
});
