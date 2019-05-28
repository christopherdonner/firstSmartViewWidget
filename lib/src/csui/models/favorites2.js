/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url', 'csui/utils/base',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/browsable/client-side.mixin',
  'csui/models/browsable/v2.response.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/favorite2',
  'csui/models/favorite2columns',
  'csui/models/server.adaptors/favorites2.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, base,
    ConnectableMixin,
    FetchableMixin,
    AdditionalResourcesV2Mixin,
    FieldsV2Mixin,
    ExpandableV2Mixin,
    CommandableV2Mixin,
    ClientSideBrowsableMixin,
    BrowsableV2ResponseMixin,
    DelayedCommandableV2Mixin,
    Favorite2Model,
    Favorite2ColumnCollection,
    ServerAdaptorMixin) {
  'use strict';

  var Favorite2Collection = Backbone.Collection.extend({

    model: Favorite2Model,

    constructor: function Favorite2Collection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.callCounter = 0;
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options)
          .makeDelayedCommandableV2(options)
          .makeServerAdaptor(options);

      this.columns = new Favorite2ColumnCollection(options.columns);
    },

    clone: function () {
      var clone = new this.constructor(this.models, {
        connector: this.connector,
        fields: _.deepClone(this.fields),
        expand: _.deepClone(this.expand),
        includeResources: _.clone(this._additionalResources),
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        commands: _.clone(this.commands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands
      });
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
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

  ClientSideBrowsableMixin.mixin(Favorite2Collection.prototype);
  BrowsableV2ResponseMixin.mixin(Favorite2Collection.prototype);
  ConnectableMixin.mixin(Favorite2Collection.prototype);
  FetchableMixin.mixin(Favorite2Collection.prototype);
  AdditionalResourcesV2Mixin.mixin(Favorite2Collection.prototype);
  FieldsV2Mixin.mixin(Favorite2Collection.prototype);
  ExpandableV2Mixin.mixin(Favorite2Collection.prototype);
  CommandableV2Mixin.mixin(Favorite2Collection.prototype);
  DelayedCommandableV2Mixin.mixin(Favorite2Collection.prototype);
  ServerAdaptorMixin.mixin(Favorite2Collection.prototype);

  return Favorite2Collection;

});
