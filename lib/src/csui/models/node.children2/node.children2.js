/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/url', 'csui/models/node/node.model',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/node.children2/server.adaptor.mixin',
  'csui/models/utils/v1tov2', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, Url, NodeModel, NodeResourceMixin,
    BrowsableMixin, AdditionalResourcesV2Mixin, FieldsV2Mixin,
    ExpandableV2Mixin, DelayedCommandableV2Mixin, ServerAdaptorMixin,
    v1tov2) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30
  });

  var NodeChildren2Collection = Backbone.Collection.extend({
    model: NodeModel,

    constructor: function NodeChildren2Collection(models, options) {
      options = _.defaults({}, options, {
        top: config.defaultPageSize
      }, options);

      Backbone.Collection.prototype.constructor.call(this, models, options);

      this.makeNodeResource(options)
          .makeBrowsable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeDelayedCommandableV2(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      var clone = new this.constructor(this.models, {
        node: this.node,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        fields: _.deepClone(this.fields),
        expand: _.deepClone(this.expand),
        includeResources: _.clone(this._additionalResources),
        commands: _.clone(this.commands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands,
        autofetch: this.autofetch,
        autofetchEvent: this._autofetchEvent
      });
      clone.fetching = this.fetching;
      clone.fetched = this.fetched;
      clone.error = this.error;
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    isFetchable: function () {
      return this.node.isFetchable();
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    }
  });

  BrowsableMixin.mixin(NodeChildren2Collection.prototype);
  AdditionalResourcesV2Mixin.mixin(NodeChildren2Collection.prototype);
  FieldsV2Mixin.mixin(NodeChildren2Collection.prototype);
  ExpandableV2Mixin.mixin(NodeChildren2Collection.prototype);
  DelayedCommandableV2Mixin.mixin(NodeChildren2Collection.prototype);
  NodeResourceMixin.mixin(NodeChildren2Collection.prototype);
  ServerAdaptorMixin.mixin(NodeChildren2Collection.prototype);
  var prototype = NodeChildren2Collection.prototype;

  var makeExpandableV2 = prototype.makeExpandableV2,
      setExpand = prototype.setExpand,
      resetExpand = prototype.resetExpand;
  prototype.makeExpandableV2 = function (options) {
    var expand = options && options.expand;
    if (Array.isArray(expand)) {
      options.expand = v1tov2.includeExpandsV1toV2(expand);
    }
    return makeExpandableV2.call(this, options);
  };

  prototype.setExpand = function (role, names) {
    if (!names) {
      role = v1tov2.includeExpandsV1toV2(role);
    }
    return setExpand.call(this, role, names);
  };

  prototype.resetExpand = function (role, names) {
    if (!names) {
      role = v1tov2.excludeExpandsV1toV2(role);
    }
    return resetExpand.call(this, role, names);
  };

  var makeCommandableV2 = prototype.makeCommandableV2;
  prototype.makeCommandableV2 = function (options) {
    makeCommandableV2.call(this, options);
    this.includeCommands = this.commands;
    return this;
  };

  return NodeChildren2Collection;
});
