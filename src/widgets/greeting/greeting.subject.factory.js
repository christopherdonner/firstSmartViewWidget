define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var GreetingSubjectModelFactory = ModelFactory.extend({

    propertyPrefix: 'greetingSubject',

    constructor: function GreetingSubjectModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var greetingSubject = this.options.greetingSubject || {};
      if (!(greetingSubject instanceof Backbone.Model)) {
        var config = module.config();
        greetingSubject = new Backbone.Model(greetingSubject.attributes, _.extend({},
            greetingSubject.options, config.options));
      }
      this.property = greetingSubject;
    }

  });

  return GreetingSubjectModelFactory;

});
