/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var ActiveTabModel = Backbone.Model.extend({

    defaults: {
      tabIndex: 0
    }

  });

  var ActiveTabModelFactory = ModelFactory.extend({

    propertyPrefix: 'activeTab',

    constructor: function ActiveTabModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var activeTab = this.options.activeTab || {};
      if (!(activeTab instanceof Backbone.Model)) {
        var config = module.config();
        activeTab = new ActiveTabModel(activeTab.models, _.extend({},
            activeTab.options, config.options));
      }
      this.property = activeTab;
    }

  });

  return ActiveTabModelFactory;

});
