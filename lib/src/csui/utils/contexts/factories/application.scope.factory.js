/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var ApplicationScopeModel = Backbone.Model.extend({});

  var ApplicationScopeModelFactory = ModelFactory.extend({

    propertyPrefix: 'applicationScope',

    constructor: function ApplicationScopeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var applicationScope = this.options.applicationScope || {};
      if (!(applicationScope instanceof Backbone.Model)) {
        var config = module.config();
        applicationScope = new ApplicationScopeModel(applicationScope.models, _.extend({},
            applicationScope.options, config.options));
      }
      this.property = applicationScope;
    }

  });

  return ApplicationScopeModelFactory;

});
