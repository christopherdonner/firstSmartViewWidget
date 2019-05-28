/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';
  var ActionDialogModel = Backbone.Model.extend({
    defaults: {
      title: undefined,
      action: undefined,
      requireComment: false,
      comment: undefined,
      requireAssignee: false,
      readonlyAssignee: false,
      assigneeOptions: false,
      assignee: undefined,
      texts: {},
      authentication: false,
      currentUser: undefined,
      authentication_info: undefined
    },
    constructor: function ActionDialogModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });
  return ActionDialogModel;
});