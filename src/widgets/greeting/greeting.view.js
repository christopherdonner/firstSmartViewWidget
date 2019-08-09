// An application widget is exposed via a RequireJS module
define([
  'csui/lib/underscore',                             // Cross-browser utility belt
  'csui/lib/marionette',                             // MVC application support
  'greet/widgets/greeting/greeting.subject.factory', // Factory for the data model
  'i18n!greet/widgets/greeting/impl/nls/lang',       // Use localizable texts
  'hbs!greet/widgets/greeting/impl/greeting',        // Template to render the HTML
  'css!greet/widgets/greeting/impl/greeting'         // Stylesheet needed for this view
], function (_, Marionette, GreetingSubjectModelFactory, lang, template) {

  // An application widget is a view, because it should render a HTML fragment
  var GreetingView = Marionette.ItemView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'greet-greeting panel panel-default',

    // Template method rendering the HTML for the view
    template: template,

    // Pass different content to the template, than the model JSON
    serializeData: function () {
      // Say hello to the model content
      return {
        message: _.str.sformat(lang.helloMessage, this.model.get('id'))
      };
    },

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function GreetingView(options) {
      // Obtain the model with the data shown by this view; using the model
      // factory with the context makes the model instance not only shareable
      // with other widgets through the context, but also fetched at the same
      // moment as the other models.
      options.model = options.context.getModel(GreetingSubjectModelFactory);

      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.ItemView.prototype.constructor.call(this, options);

      // Whenever properties of the model change, re-render the view
      this.listenTo(this.model, 'change', this.render);
    }

  });

  return GreetingView;

});
