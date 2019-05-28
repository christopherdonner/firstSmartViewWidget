/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/base',
  'csui/utils/url', 'csui/models/server.adaptors/favorite.model.mixin', 'i18n!csui/models/impl/nls/lang'
], function ($, _, Backbone, base, Url, ServerAdaptorMixin, lang) {
  "use strict";

  var FavoriteModel = Backbone.Model.extend({

    constructor: function FavoriteModel(attributes, options) {
      options || (options = {});
      this.options = options;
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeServerAdaptor(options);
    },

    isNew: function () {
      return this.get('id') === undefined;
    },

    addToFavorites: function () {
      var deferred = $.Deferred();
      this._serverCallUpdateFavorite('POST', deferred, true);
      return deferred.promise();
    },

    removeFromFavorites: function () {
      var deferred = $.Deferred();
      this._serverCallUpdateFavorite('DELETE', deferred, false);
      return deferred.promise();
    }

  });

  ServerAdaptorMixin.mixin(FavoriteModel.prototype);
  return FavoriteModel;

});
