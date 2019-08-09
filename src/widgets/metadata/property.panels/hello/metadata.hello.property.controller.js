define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'i18n!greet/widgets/metadata/impl/nls/lang',
  'greet/widgets/metadata/property.panels/hello/metadata.hello.property.view'
], function (_, $, Backbone, Marionette, lang, MetadataHelloPropertyView) {

  var MetadataHelloPropertyController = Marionette.Controller.extend({

    constructor: function MetadataHelloPropertyController(options) {
      Marionette.Controller.prototype.constructor.apply(this, arguments);
    },

    getPropertyPanels: function (options) {
      return this._getCommonPropertyPanels();
    },

    getPropertyPanelsForCreate: function (options) {
      return this._getCommonPropertyPanels();
    },

    getPropertyPanelsForMove: function (options) {
      return this._getCommonPropertyPanels();
    },

    getPropertyPanelsForCopy: function (options) {
      return this._getCommonPropertyPanels();
    },

    _getCommonPropertyPanels: function () {
      var panelModel = new Backbone.Model(_.extend({
        title: lang.helloTabTitle
      }, this.options.model.attributes));
      return $
          .Deferred()
          .resolve([
            {
              model: panelModel,
              contentView: MetadataHelloPropertyView
            }
          ])
          .promise();
    }

  });

  return MetadataHelloPropertyController;

});
