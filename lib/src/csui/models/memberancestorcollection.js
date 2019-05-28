/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (module, _, $, Backbone) {
  'use strict';

  var MemberAncestorCollection = Backbone.Collection.extend({

    constructor: function MemberAncestorCollection(model, options, context) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.context = context;
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    isFetchable: function () {
      return false;
    },

    add: function( models, options ) {
      Backbone.Collection.prototype.add.apply(this, arguments); // (this, models, options) doesn't work
      this.trigger('sync', this);
    },

    findByIndex: function(id){
      for (var i = 0; i < this.models.length; i++) {
        if( this.models[i].id === id ) {
          return i;
        }
      }
      return -1;
    }

  });

  return MemberAncestorCollection;

});

