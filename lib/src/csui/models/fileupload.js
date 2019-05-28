/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/log', 'csui/models/node/node.model', 'csui/models/version'
], function (module, _, $, Backbone, log, NodeModel, VersionModel) {
  'use strict';

  var config = _.extend({
    idAttribute: null
  }, module.config());

  var FileUploadModel = Backbone.Model.extend({

    defaults: {
      state: "pending",
      count: 0,
      total: 0,
      errorMessage: ""
    },

    idAttribute: config.idAttribute,

    constructor: function FileUploadModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      options || (options = {});

      this.node = options.node;
      if (this.node) {
        this.set('newVersion', true, {silent: true});
        this.version = new VersionModel({
          id: this.node.get('id')
        }, {
          connector: options.connector || this.node.connector
        });
      } else {
        this.container = options.container;
        this.node = new NodeModel(undefined, _.extend({
          connector: options.connector ||
                     this.container && this.container.connector
        }, options, {
          collection: this.get('collection')
        }));
      }

      this.deferred = $.Deferred();
      this.deferred
          .progress(_.bind(this.onStateChange, this))
          .done(_.bind(this.onStateChange, this))
          .fail(_.bind(this.onStateChange, this));

      this._updateFileAttributes(true);
      this.listenTo(this, 'change:file',
          _.bind(this._updateFileAttributes, this, false));
    },

    abort: function (reason) {
      this.deferred.reject(this, reason);
    },

    promise: function () {
      return this.deferred.promise();
    },

    onStateChange: function (fileUpload, options) {
      var state = this.deferred.state();
      if (state == "pending") {
        state = "processing";
      } else if (state === "rejected") {
        if (options) {
          this.set("errorMessage", options.message);
        } else {
          state = "aborted";
        }
      }
      var values = {state: state};
      if (options && options.type === "progress") {
        var loaded = options.loaded,
            total = this.get("total");
        if (options.lengthComputable && options.total > total) {
          total = options.total;
          values.total = total;
        }
        if (this.get("count") < loaded && loaded <= total) {
          values.count = loaded;
        }
      }
      this.set(values);
    },

    _updateFileAttributes: function (silent) {
      var file = this.get("file");
      if (file) {
        this.set({
          name: file.name,
          total: file.size
        }, silent ? {silent: true} : {});
      }
    }

  });

  return FileUploadModel;

});
