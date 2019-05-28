/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector', 'csui/models/authenticated.user'
], function (module, _, $, Backbone, ModelFactory, ConnectorFactory,
    AuthenticatedUserModel) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var UserModelFactory = ModelFactory.extend({
    propertyPrefix: 'user',

    constructor: function UserModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var user = this.options.authentication || this.options.user || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = user.initialResponse || config.initialResponse;
      }
      if (!(user instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options);
        user = new AuthenticatedUserModel(user.attributes || config.attributes,
            _.defaults({
              connector: connector
            }, user.options, config.options));
      }
      this.property = user;
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return UserModelFactory;
});
