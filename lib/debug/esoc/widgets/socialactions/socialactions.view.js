/**
 * Verify whether the social actions on the perticular ROI is enable or not,
 * based on this, render respective social action HTML fragment.
 */

csui.define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'esoc/widgets/socialactions/socialactions.model',
  'i18n!esoc/widgets/socialactions/nls/lang',
  'hbs!esoc/widgets/socialactions/socialactions',
  'esoc/widgets/socialactions/commentscollectionwidget',
  'css!esoc/widgets/socialactions/socialactions.css'
], function ($, _, Handlebars, Marionette, SocialActionsModel, lang,
    SocialActionsItemsTemplate, CommentsCollectionWidget) {
  var self = null;
  var SocialActionsItemView = Marionette.ItemView.extend({
    // Outermost parent element should contain a unique widget-specific class
    className: 'esoc-socialactions-wrapper panel panel-default',
    template: SocialActionsItemsTemplate,
    templateHelpers: function () {
      return {
        messages: {
          comments: lang.comments
        }
      };
    },
    initialize: function (options) {
      this.options = options;
      self = this;
      $(document).bind('keydown click', this.closeCommentDialog);
    },
    events: {
      "click .esoc-socialactions-getcomments": "getComments",
      "click .esoc-socialactions-getlikes": "getLikes", //Can be used later when working on Like and Tags Widgets...
      "click .esoc-socialactions-gettags": "getTags"
    },
    constructor: function SocialActionsItemView(options) {
      options = options || {};
      // If the model has not been passed to the view, application widgets
      // should create their models automatically from options
      if (!options.model) {
        options.model = new SocialActionsModel(undefined, {
          connector: options.connector,
          rockey: options.rockey,
          roid: options.roid,
          csid: options.csid
        });
        // Ensure that the data will are fresh at the beginning
        options.model.fetch();
      }
      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.ItemView.prototype.constructor.call(this, options);
      // Whenever the properties of the model change, re-render the view
      this.model.on('change', this.render, this);
      this.model.on('error', this.errorHandle, this);
    },
    errorHandle: function (model, response) {
      //TODO: this is a temporary fix for this error handling, LA will decide where and how to render this error message.
      this.$el.find(".esoc-error-socialactions").show();
      this.$el.find(".binf-panel-title").html(response.responseJSON.error);
    },
    getComments: function (e) {
      var commentConfig            = {
            baseElement: this.$el.find(".esoc-socialactions-getcomments"),
            socialActionsInstanse: this,
            maxMessageLength: this.options.maxMessageLength,
            context: this.options.context
          },
          commentsCollectionWidget = new CommentsCollectionWidget(commentConfig);
      commentsCollectionWidget.show();
    }
  });
  return SocialActionsItemView;
});
