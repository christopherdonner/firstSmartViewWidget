define(['csui/lib/marionette',
  'hbs!greet/widgets/metadata/property.panels/hello/metadata.hello.property',
  'css!greet/widgets/metadata/property.panels/hello/metadata.hello.property'
], function (Marionette, template) {

  var MetadataHelloPropertyView = Marionette.ItemView.extend({

    className: 'greet-metadata-property-hello',

    template: template,

    templateHelpers: function () {
      return {
        action: this.options.action || 'update'
      };
    },

    constructor: function MetadataHelloPropertyView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    // This view is being shown during the node creation too;
    // because a form view is expected, this view implements
    // a partial FormView interface too

    validate: function () {
      return true;
    },

    getValues: function () {
      // These values will be merged into the creational object posted
      // to the server; if the model has 'role_name' property defined,
      // the properties will be posted nested in that role
      return {};
    }

  });

  return MetadataHelloPropertyView;

});
