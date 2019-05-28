/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/favorites2', 'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ResourceMixin, UploadableMixin,
   Favorite2Collection) {
  'use strict';

  var Favorite2GroupModel = Backbone.Model.extend({
    mustRefreshAfterPut: false,

    idAttribute: 'tab_id',

    constructor: function Favorite2GroupModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options);
      this.makeUploadable(options);
      attributes || (attributes = {});

      this.favorites = new Favorite2Collection(attributes.favorites, {
        connector: options.connector,
        autoreset: true,
        tab_id: this.get('tab_id'),
        columns: attributes.favorite_columns,
        commands: options && options.commands
      });
    },

    urlRoot: function () {
      var v2Url = this.connector.connection.url.replace('/v1', '/v2');
      var url = Url.combine(v2Url, "/members/favorites/tabs/");
      return url;
    },

    parse: function (resp, options) {
      if (resp.results && resp.results.data) {
        return {tab_id: resp.results.data.tab_id};
      } else {
        return resp;
      }
    }
  });

  ResourceMixin.mixin(Favorite2GroupModel.prototype);
  UploadableMixin.mixin(Favorite2GroupModel.prototype);

  return Favorite2GroupModel;
});
