csui.define(['module',
      'csui/lib/underscore',
      'csui/lib/backbone',
      'csui/utils/contexts/factories/factory',
      'csui/utils/contexts/factories/connector',
      'esoc/model/pulsesettings.model'],
    function (module, _, Backbone, ModelFactory, ConnectorFactory, PulseSettingsModel) {
      var PulseSettingsFactory = ModelFactory.extend({
        propertyPrefix: 'pulsesettings',
        constructor: function PulseSettingsFactory(context, options) {
          ModelFactory.prototype.constructor.apply(this, arguments);
          var pulsesettings = this.options.pulsesettings || {};
          if (!(pulsesettings instanceof Backbone.Model)) {
            var connector = context.getObject(ConnectorFactory, options),
                config    = module.config();
            pulsesettings = new PulseSettingsModel(pulsesettings.attributes ||
                                                   config.attributes, _.defaults(
                {connector: connector}, pulsesettings.options, config.options));
          }
          this.property = pulsesettings;
        },
        isFetchable: function () {
          return this.property.isFetchable();
        },
        fetch: function (options) {
          return this.property.fetch(options);
        }
      });
      return PulseSettingsFactory;
    });
