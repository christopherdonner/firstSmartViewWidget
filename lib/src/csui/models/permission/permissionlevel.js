/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone'
], function (module, $, _, Backbone) {
  'use strict';

  var PermissionLevelNode = Backbone.Model.extend({
    initialize: function(){
      var nodes = this.get("nodes");
      if (nodes){
        this.nodes = new PermissionLevelCollection(nodes);
        this.unset("nodes");
      }
    }
  });

  var PermissionLevelCollection = Backbone.Collection.extend({
    model: PermissionLevelNode
  });

  return PermissionLevelCollection;
});