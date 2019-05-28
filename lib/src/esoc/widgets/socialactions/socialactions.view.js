/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define([
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
      if (!options.model) {
        options.model = new SocialActionsModel(undefined, {
          connector: options.connector,
          rockey: options.rockey,
          roid: options.roid,
          csid: options.csid
        });
        options.model.fetch();
      }
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.model.on('change', this.render, this);
      this.model.on('error', this.errorHandle, this);
    },
    errorHandle: function (model, response) {
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
