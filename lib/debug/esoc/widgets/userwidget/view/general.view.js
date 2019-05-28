/**
 *  This is to get user's general information
 */
csui.define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'esoc/widgets/userwidget/model/extended.model',
  'esoc/widgets/userwidget/util',
  'esoc/widgets/userwidget/view/extendedinfotextfield.view',
  'esoc/widgets/userwidget/view/extendedinfolinkfield.view',
  'esoc/widgets/userwidget/chat/view/presence.view',
  'esoc/widgets/userwidget/chat/chatfactory',
  'hbs!esoc/widgets/userwidget/impl/general',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior'
], function ($, _, Backbone, Handlebars, Marionette, ConnectorFactory, UserExtendedInfoModel, Util,
    ExtendedInfoTextFieldView, ExtendedInfoLinkFieldView, PresenceView, ChatFactory,
    GeneralTemplate, Lang,
    PerfectScrollingBehavior) {
  var self = null;
  var GeneralView = Marionette.ItemView.extend({
    tagName: "div",
    className: 'esoc-general-tab binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: GeneralTemplate,
    util: Util,
    templateHelpers: function () {
      var extendedInfo = this.options.model.attributes.extendedInfo,
          canEdit      = !this.options.model.attributes.otherUser &&
                         (!!extendedInfo && extendedInfo.isEditable);
      return {
        messages: {
          phone: Lang.phone,
          fax: Lang.fax,
          timezone: Lang.timezone,
          showFacebookLink: canEdit || (!!extendedInfo && !!extendedInfo.facebookLink),
          showLinkedinLink: canEdit || (!!extendedInfo && !!extendedInfo.linkedinLink),
          showTwitterLink: canEdit || (!!extendedInfo && !!extendedInfo.twitterLink),
          showReportsTo: canEdit || (!!extendedInfo && !!extendedInfo.reportsTo),
          showLangSpoken: canEdit || (!!extendedInfo && !!extendedInfo.languagesSpoken),
          showAboutMe: canEdit || (!!extendedInfo && !!extendedInfo.bio),
          statusPost: false,
          showJobDesc: canEdit || (!!extendedInfo && !!extendedInfo.jobDescription),
          showExpertise: canEdit || (!!extendedInfo && !!extendedInfo.expertise),
          showPastPositions: canEdit || (!!extendedInfo && !!extendedInfo.pastPositions),
          showDegrees: canEdit || (!!extendedInfo && !!extendedInfo.degree),
          showAwards: canEdit || (!!extendedInfo && !!extendedInfo.awardsHonours),
          time_zone: !!this.options.model.attributes.time_zone &&
                     this.options.model.attributes.time_zone !== -1
        }
      };
    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        contentParent: ".esoc-general-tab-content",
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      }
    },
    initialize: function (options) {
      var childViews = [];
      this.options = options;
      if (!this.options.connector) {
        this.options.connector = this.options.context.getObject(ConnectorFactory);
      }

      if (!this.options.model.attributes.isError) {
        var self         = this,
            ExtendedInfo = Backbone.Model.extend({}),
            messages     = this.templateHelpers().messages,
            extdInfo     = this.model.attributes.extendedInfo,
            defaultAttrs = {
              userid: this.model.attributes.userid,
              connector: this.options.connector,
              isEditable: !this.model.attributes.otherUser && !!extdInfo &&
                          extdInfo.isEditable
            };

        if (messages.showFacebookLink) {
          this.facebookLinkInfo = new ExtendedInfo(_.extend({
            label: Lang.facebookLink,
            content: this.util.getValidLink(extdInfo.facebookLink),
            formField: "facebookLink",
            defaultMessage: Lang.defaultfacebookMessage,
            linkClass: "esoc-user-facebook-link"
          }, defaultAttrs));
          this.facebookLinkView = new ExtendedInfoLinkFieldView({
            model: this.facebookLinkInfo,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.facebookLinkView);
        }

        if (messages.showLinkedinLink) {
          this.linkedLinkInfo = new ExtendedInfo(_.extend({
            label: Lang.linkedinLink,
            content: this.util.getValidLink(extdInfo.linkedinLink),
            formField: "linkedinLink",
            defaultMessage: Lang.defaultLinkedInMessage,
            linkClass: "esoc-user-linkedin-link"
          }, defaultAttrs));
          this.linkedInLinkView = new ExtendedInfoLinkFieldView({
            model: this.linkedLinkInfo,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.linkedInLinkView);
        }

        if (messages.showTwitterLink) {
          this.twitterLinkInfo = new ExtendedInfo(_.extend({
            label: Lang.twitterLink,
            content: this.util.getValidLink(extdInfo.twitterLink),
            formField: "twitterLink",
            defaultMessage: Lang.defaulttwitterLinkMessage,
            linkClass: "esoc-user-twitter-link"
          }, defaultAttrs));
          this.twitterLinkView = new ExtendedInfoLinkFieldView({
            model: this.twitterLinkInfo,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.twitterLinkView);
        }

        if (messages.showReportsTo) {
          this.reportsInfo = new ExtendedInfo(_.extend({
            label: Lang.manager,
            content: extdInfo.reportsToID,
            reportsTo: !!extdInfo.reportsTo && extdInfo.reportsTo.trim() ? extdInfo.reportsTo : "",
            formField: "reportsTo",
            defaultMessage: Lang.defaultManagerMessage,
            userInputField: true,
            extendedLabelClass: 'esoc-user-extended-label'
          }, defaultAttrs));
          this.reportsView = new ExtendedInfoTextFieldView({
            model: this.reportsInfo,
            context: this.options.context,
            parentView: self,
            tabIndex: this.options.tabIndex
          });
          childViews.push(this.reportsView);
        }

        if (messages.showLangSpoken) {
          this.langSpokenInfo = new ExtendedInfo(_.extend({
            label: Lang.languagesSpoken,
            content: !!extdInfo.languagesSpoken && extdInfo.languagesSpoken.trim() ?
                     extdInfo.languagesSpoken : "",
            formField: "languagesSpoken",
            defaultMessage: Lang.defaultLanguagesMessage,
            extendedLabelClass: 'esoc-user-extended-label'
          }, defaultAttrs));
          this.langSpokenView = new ExtendedInfoTextFieldView({
            model: this.langSpokenInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.langSpokenView);
        }
        if (messages.statusPost) {
          this.statusPostInfo = new ExtendedInfo(_.extend({
            label: Lang.statusPost,
            content: !!extdInfo.status && extdInfo.status.trim() ? extdInfo.status : "",
            formField: "status",
            defaultMessage: Lang.defaultStatusPost
          }, defaultAttrs));
          this.statusPostView = new ExtendedInfoTextFieldView({
            model: this.statusPostInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.statusPostView);
        }

        if (messages.showAboutMe) {
          this.aboutMeInfo = new ExtendedInfo(_.extend({
            label: Lang.aboutMe,
            content: !!extdInfo.bio && extdInfo.bio.trim() ? extdInfo.bio : "",
            formField: "bio",
            defaultMessage: Lang.defaultAboutMeMessage
          }, defaultAttrs));
          this.aboutMeView = new ExtendedInfoTextFieldView({
            model: this.aboutMeInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.aboutMeView);
        }

        if (messages.showJobDesc) {
          this.jobDescriptionInfo = new ExtendedInfo(_.extend({
            label: Lang.jobDescription,
            content: !!extdInfo.jobDescription && extdInfo.jobDescription.trim() ?
                     extdInfo.jobDescription : "",
            formField: "jobDescription",
            defaultMessage: Lang.defaultJobDesc
          }, defaultAttrs));
          this.jobDescriptionView = new ExtendedInfoTextFieldView({
            model: this.jobDescriptionInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.jobDescriptionView);
        }

        if (messages.showExpertise) {
          this.expertiseInfo = new ExtendedInfo(_.extend({
            label: Lang.expertiseAreas,
            content: !!extdInfo.expertise && extdInfo.expertise.trim() ? extdInfo.expertise : "",
            formField: "expertise",
            defaultMessage: Lang.defaultExpertise
          }, defaultAttrs));
          this.expertiseView = new ExtendedInfoTextFieldView({
            model: this.expertiseInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.expertiseView);
        }

        if (messages.showPastPositions) {
          this.pastPositionsInfo = new ExtendedInfo(_.extend({
            label: Lang.pastPositions,
            content: !!extdInfo.pastPositions && extdInfo.pastPositions.trim() ?
                     extdInfo.pastPositions : "",
            formField: "pastPositions",
            defaultMessage: Lang.defaultPastPositions
          }, defaultAttrs));
          this.pastPositionsView = new ExtendedInfoTextFieldView({
            model: this.pastPositionsInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.pastPositionsView);
        }

        if (messages.showDegrees) {
          this.degreeInfo = new ExtendedInfo(_.extend({
            label: Lang.degrees,
            content: !!extdInfo.degree && extdInfo.degree.trim() ? extdInfo.degree : "",
            formField: "degree",
            defaultMessage: Lang.defaultDegreeMessage
          }, defaultAttrs));
          this.degreeView = new ExtendedInfoTextFieldView({
            model: this.degreeInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.degreeView);
        }

        if (messages.showAwards) {
          this.awardsInfo = new ExtendedInfo(_.extend({
            label: Lang.awards,
            content: !!extdInfo.awardsHonours && extdInfo.awardsHonours.trim() ?
                     extdInfo.awardsHonours : "",
            formField: "awardsHonours",
            defaultMessage: Lang.defaultAwardMessage
          }, defaultAttrs));
          this.awardsView = new ExtendedInfoTextFieldView({
            model: this.awardsInfo,
            parentView: self,
            tabIndex: this.options.tabIndex,
            connector: this.options.connector
          });
          childViews.push(this.awardsView);
        }
        this.childViews = childViews;
      }
    },
    constructor: function GeneralView(options) {
      options = options || {};
      var generalOptions = _.extend({}, options);
      generalOptions.model = new UserExtendedInfoModel(generalOptions);
      generalOptions.model.fetch({
        success: generalOptions.model.fetchSuccess,
        error: generalOptions.model.fetchError,
        async: false
      })
      Marionette.ItemView.prototype.constructor.call(this, generalOptions);
    },
    errorHandle: function (model, response) {
    },
    onShow: function (e) {

      if (this.model.attributes.chatSettings && this.model.attributes.chatSettings.chatEnabled &&
          this.model.attributes.chatSettings.presenceEnabled) {
        var presenceOptions = {
          id: this.model.attributes.id,
          context: this.options.context,
          username: this.model.attributes.name,
          subscribeEvent: true
        };
        var presenceRegion = new Marionette.Region({
          el: $("#esoc-user-profile-presence-indicator")
        });

        var presenceView = new PresenceView(presenceOptions);
        presenceRegion.show(presenceView);
      }
      var messages = this.templateHelpers().messages;
      var that = this;
      if (!this.options.model.attributes.isError) {
        var count=0;
        _.each(this.childViews, function (view) {
          that.listenToOnce(view, 'view:shown', function () {
            count++;
            if (count === that.childViews.length) {
              that.trigger("view:shown");
            }
          });
          that.listenTo(view, 'change:content', function (eventName) {
            that.trigger("view:shown", "contentChanged");
            if (eventName === "userInputChanged") {
              view.$el.find("a.esoc-user-container").focus();
            }
          });
        });
        if (messages.showFacebookLink) {
          var facebookLink = new Marionette.Region({el: ".esoc-user-facebook-link"});
          facebookLink.show(this.facebookLinkView);
        }
        if (messages.showLinkedinLink) {
          var linkedInLink = new Marionette.Region({el: ".esoc-user-linked-link"});
          linkedInLink.show(this.linkedInLinkView);
        }
        if (messages.showTwitterLink) {
          var twitterLink = new Marionette.Region({el: ".esoc-user-twitter-link"});
          twitterLink.show(this.twitterLinkView);
        }
        if (messages.showReportsTo) {
          var reports = new Marionette.Region({el: ".esoc-user-reports-to"});
          reports.show(this.reportsView);
        }
        if (messages.showLangSpoken) {
          var languagesSpoken = new Marionette.Region({el: ".esoc-user-languages-spoken"});
          languagesSpoken.show(this.langSpokenView);
        }
        if (messages.statusPost) {
          var statusPost = new Marionette.Region({el: ".esoc-user-status-post"});
          statusPost.show(this.statusPostView);
        }
        if (messages.showAboutMe) {
          var aboutMe = new Marionette.Region({el: ".esoc-user-about-me"});
          aboutMe.show(this.aboutMeView);
        }
        if (messages.showJobDesc) {
          var jobDescription = new Marionette.Region({el: ".esoc-user-job-description"});
          jobDescription.show(this.jobDescriptionView);
        }
        if (messages.showExpertise) {
          var expertise = new Marionette.Region({el: ".esoc-user-expertise"});
          expertise.show(this.expertiseView);
        }
        if (messages.showPastPositions) {
          var pastPositions = new Marionette.Region({el: ".esoc-user-past-positions"})
          pastPositions.show(this.pastPositionsView);
        }
        if (messages.showDegrees) {
          var degree = new Marionette.Region({el: ".esoc-user-degree"});
          degree.show(this.degreeView);
        }
        if (messages.showAwards) {
          var awards = new Marionette.Region({el: ".esoc-user-awards"});
          awards.show(this.awardsView);
        }
      }
      this.$el.find(".esoc-user-links.esoc-user-email").each(function (i) {
        if ($(this).innerWidth() < $(this)[0].scrollWidth) {
          that.$el.find(".esoc-user-email a").addClass("esoc-user-links-ellipsis-onfocus");
        }
      });
    }
  });
  return GeneralView;
});
