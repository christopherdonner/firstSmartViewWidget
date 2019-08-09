// A view rendering single node information
define([
  'csui/lib/underscore',                          // Cross-browser utility belt
  'csui/lib/marionette',                          // MVC application support
  'csui/utils/base',                              // Common utility methods, like formatting
  'hbs!samples/widgets/node.info/impl/node/node', // Template to render the HTML
  'css!samples/widgets/node.info/impl/node/node'  // Stylesheet needed for this view
], function (_, Marionette, base, template) {

  // An application widget is a view, because it should render a HTML fragment
  var NodeView = Marionette.ItemView.extend({

    // Template method rendering the HTML for the view
    template: template,

    // Override the data serialization to export both node and volume
    serializeData: function () {
      // Date/time attributes are tra stored as strings in the ISO format;
      // render friendly formatted value and show the full value in the tooltip
      var createDate = this.model.get('create_date'),
          modifyDate = this.model.get('modify_date');
      return _.defaults({
        title: this.options.title, // in the upper right corner
        create_date_text: createDate && base.formatDateTime(createDate),
        create_date_tooltip: createDate && base.formatExactDateTime(createDate),
        modify_date_text: modifyDate && base.formatDateTime(modifyDate),
        modify_date_tooltip: modifyDate && base.formatExactDateTime(modifyDate)
      }, this.model.attributes);
    },

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function NodeView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);

      // Whenever properties of the model change, re-render the view
      this.listenTo(this.model, 'change', this.render);
    }

  });

  return NodeView;

});
