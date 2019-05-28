/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/backbone", "csui/utils/log", "csui/models/version"
], function (module, Backbone, log, VersionModel) {
  'use strict';

  var VersionCollection = Backbone.Collection.extend({

    model: VersionModel,

    constructor: function VersionCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
      if (this.options.connector) {
        this.options.connector.assignTo(this);
      }
    },

    setOrder: function (attributes, fetch) {
      if (this.orderBy !== attributes) {
        this.orderBy = attributes;
        return true;
      }
    },

    resetOrder: function (fetch) {
      if (this.orderBy) {
        this.orderBy = undefined;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    setLimit: function (skip, top, fetch) {
      if (this.skipCount !== skip || this.topCount !== top) {
        this.skipCount = skip;
        this.topCount = top;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    },

    resetLimit: function (fetch) {
      if (this.skipCount) {
        this.skipCount = 0;
        if (fetch !== false) {
          this.fetch();
        }
        return true;
      }
    }

  });
  VersionCollection.version = '1.0';

  return VersionCollection;

});
