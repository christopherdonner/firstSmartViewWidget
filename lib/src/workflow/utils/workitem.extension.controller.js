/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/log'
], function (_, $, Backbone, log) {
  'use strict';
  function WorkItemExtensionController(options) {
    this.context = options.context;
  }
  _.extend(WorkItemExtensionController.prototype, {
    initialize: function () {},
    validate: function (type, sub_type) {
      return false;
    },
    execute: function (options) {
      var deferred = $.Deferred();
      deferred.resolve();
      return deferred.promise();
    },
    executeAction: function (options) {
      var deferred = $.Deferred();
      deferred.resolve();
      return deferred.promise();
    }
  });

  WorkItemExtensionController.extend = Backbone.Model.extend;
  WorkItemExtensionController.ExtensionPoints = {
    AddSidebar: 1,
    AddForm: 2,
    FullView: 3
  };

  return WorkItemExtensionController;
});
