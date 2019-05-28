// Lists explicit locale mappings and fallbacks

csui.define('workflow/toolbars/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/toolbars/impl/nls/root/lang',{
  NodesTableToolbarInitiateLabel: 'Start workflow'
});



csui.define('css!workflow/toolbars/impl/workflow.nodestable.toolbaritems',[],function(){});
csui.define('workflow/toolbars/workflow.nodestable.toolbaritems',['i18n!workflow/toolbars/impl/nls/lang',
        'css!workflow/toolbars/impl/workflow.nodestable.toolbaritems'
], function (lang) {
  

  return {
    tableHeaderToolbar: [
      {
        signature: 'InitiateWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        icon: 'icon icon-toolbar-wfinitiate',
        group: 'main'
      },
      {
        signature: 'InitiateDocumentWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        group: 'main'
      }

    ],
    inlineActionbar: [
      {
        signature: 'InitiateWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        icon: 'icon icon-toolbar-wfinitiate',
        group: 'other'
      },
      {
        signature: 'InitiateDocumentWorkflow',
        name: lang.NodesTableToolbarInitiateLabel,
        icon: 'icon icon-toolbar-wfinitiate',
        group: 'other'
      }
    ]
  };

});

csui.define('workflow/utils/workitem.extension.controller',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/log'
], function (_, $, Backbone, log) {
  

  /**
   * Work item extensions controller.
   * Base object for other extension controller for the workflow Smart UI.
   *
   * @param options
   * @constructor
   */
  function WorkItemExtensionController(options) {
    this.context = options.context;
  }

  // Attach all inheritable methods to the Controller prototype.
  _.extend(WorkItemExtensionController.prototype, {

    /**
     * Initialize is an empty function by default. Override it with your own
     * initialization logic.
     */
    initialize: function () {},

    /**
     * Validates the controller for the given data package type and sub type
     * @param type Type of the data package
     * @param sub_type Sub type of the data package
     * @returns {boolean} true when this controller can handle this data package, false if not
     */
    validate: function (type, sub_type) {
      return false;
    },

    /**
     * Execute method for the controller.
     * It does the main work for the controller and returns a promise object
     * which is resolved when the controller work is done (e.g. a model is loaded)
     * The parameter of the promise done method contains an member viewToShow
     * this is the view which has to be shown in the work item view.
     * @param options Parameters for the execution method, integration point, model, data package data, parent view, ...
     * @return {promise} Returns a promise which will be resolved when the necessary actions are done.
     *                   The argument of the done method has to contain the view which has to be displayed in the property viewToShow
     */
    execute: function (options) {
      var deferred = $.Deferred();

      // resolve the dummy promise
      deferred.resolve();

      // return the dummy promise
      return deferred.promise();
    },

    /**
     * ExcuteAction function for the controller.
     *
     * @param options Parameters for the function, including workitem model, executed action, ...
     * @returns {*}
     */
    executeAction: function (options) {
      var deferred = $.Deferred();

      // resolve the dummy promise
      deferred.resolve();

      // return the dummy promise
      return deferred.promise();
    }
  });

  WorkItemExtensionController.extend = Backbone.Model.extend;

  // Definitions of the possible extension points
  WorkItemExtensionController.ExtensionPoints = {
    // Show an additional side bar view
    AddSidebar: 1,
    // Show an additional view in the forms area
    AddForm: 2,
    // Show extension view instead of the workitem view
    FullView: 3
  };

  return WorkItemExtensionController;
});

csui.define('workflow/models/activity/activity.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone'
], function (_, $, Backbone) {
  

  var ActivityModel = Backbone.Model.extend({

    constructor: function ActivityModel(attributes, options) {
      // initialize options
      options || (options = {});

      // get the connector
      this.connector = options.connector || options.collection.connector;

      // initialize model
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });

  return ActivityModel;

});
csui.define('workflow/models/activity/activity.collection.model',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'workflow/models/activity/activity.model'
], function (_, $, Backbone, Url, ActivityModel) {
  

  var ActivityCollection = Backbone.Collection.extend({

    // the model
    model: ActivityModel,

    url: function () {
      var url = this.connector.connection.url.replace('/v1', '/v2');
      return Url.combine(url,
          'processes', this._processId,
          'subprocesses', this._subprocessId,
          'activities');
    },

    parse: function (response) {
      return response.results.data;
    },

    constructor: function ActivityCollection(context, options) {
      // initialize type
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // connect model
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    isFetchable: function () {
      if (this._processId !== undefined && this._subprocessId !== undefined) {
        return true;
      } else {
        return false;
      }
    },

    setData: function (data) {
      this._processId = data.processId;
      this._subprocessId = data.subprocessId;
    }
  });

  // return type
  return ActivityCollection;
});

csui.define('workflow/models/activity/activity.collection.model.factory',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'workflow/models/activity/activity.collection.model'
], function ($, _, ModelFactory, ConnectorFactory, ActivityCollectionModel) {
  

  var ActivityCollectionModelFactory = ModelFactory.extend({

    // Unique prefix of the default model instance, when this model is placed
    // to a context to be shared by multiple widgets
    propertyPrefix: 'activities',

    constructor: function ActivityCollectionModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;

      // Expose the model instance in the `property` key on this factory
      // instance to be used by the context
      this.property = new ActivityCollectionModel(undefined, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return ActivityCollectionModelFactory;
});

// Lists explicit locale mappings and fallbacks

csui.define('workflow/widgets/workitem/workitem.activities/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)
csui.define('workflow/widgets/workitem/workitem.activities/impl/nls/root/lang',{
  actionLabel: 'Action taken',
  actionAriaLabel: 'Action taken by',
  actionTextAttachmentAttach: 'Attach',
  actionTextAttachmentUpdate: 'Update',
  actionTextForward: 'Forward',
  actionTextReassign: 'Re-assign',
  actionTextReview: 'Send for review',
  actionTextReply: 'Reply',
  actionTextSendOn: 'Send on',
  actionTextStart: 'Start',
  actionTextForwardTo: 'Forwarded to:',
  actionTextReassignTo: 'Reassigned to:',
  actionTextReviewTo: 'Sent to:',
  viewTitle: 'Activities',
  anonymousUserName: 'Anonymous User',
  dateAria: '{0}: Date of Activity',
  activityAria: '{0}:{1} at {2}:{3}',
  linkTitleAria: '{0} of type {1}'
});



/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.activities/impl/activity.item',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"attachment\">\r\n      <div class=\"attachment-icon\">"
    + this.escapeExpression(((helper = (helper = helpers.attachmentIcon || (depth0 != null ? depth0.attachmentIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"attachmentIcon","hash":{}}) : helper)))
    + "</div>\r\n      <div class=\"attachment-name\">\r\n        <a href=\""
    + this.escapeExpression(((helper = (helper = helpers.attachmentUrl || (depth0 != null ? depth0.attachmentUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"attachmentUrl","hash":{}}) : helper)))
    + "\" aria-describedby=\""
    + this.escapeExpression(((helper = (helper = helpers.attachmentDescID || (depth0 != null ? depth0.attachmentDescID : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"attachmentDescID","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.attachmentName || (depth0 != null ? depth0.attachmentName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"attachmentName","hash":{}}) : helper)))
    + "</a>\r\n      </div>\r\n    </div>\r\n    <p id=\""
    + this.escapeExpression(((helper = (helper = helpers.attachmentDescID || (depth0 != null ? depth0.attachmentDescID : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"attachmentDescID","hash":{}}) : helper)))
    + "\" class=\"attachment-desc\">"
    + this.escapeExpression(((helper = (helper = helpers.attachmentDesc || (depth0 != null ? depth0.attachmentDesc : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"attachmentDesc","hash":{}}) : helper)))
    + "</p>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.comment : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.reassign : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "      <p class=\"comment\" title =\""
    + this.escapeExpression(((helper = (helper = helpers.commentText || (depth0 != null ? depth0.commentText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"commentText","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.commentText || (depth0 != null ? depth0.commentText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"commentText","hash":{}}) : helper)))
    + "</p>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"reassign\">\r\n        <p class=\"reassign-label\">"
    + this.escapeExpression(((helper = (helper = helpers.reassignLabel || (depth0 != null ? depth0.reassignLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"reassignLabel","hash":{}}) : helper)))
    + "</p>\r\n        <div class=\"reassign-user\"></div>\r\n      </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"activity-item\">\r\n  <div class=\"header\">\r\n    <div hidden id="
    + this.escapeExpression(((helper = (helper = helpers.ariaDescribedById || (depth0 != null ? depth0.ariaDescribedById : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaDescribedById","hash":{}}) : helper)))
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.activityAriaDescription || (depth0 != null ? depth0.activityAriaDescription : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"activityAriaDescription","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"details\">\r\n      <div class=\"user\"></div>\r\n      <p class=\"date\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.dateAria || (depth0 != null ? depth0.dateAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dateAria","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.exactDate || (depth0 != null ? depth0.exactDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"exactDate","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"date","hash":{}}) : helper)))
    + "</p>\r\n    </div>\r\n    <p class=\"action\">\r\n      <span class=\"action-label\">"
    + this.escapeExpression(((helper = (helper = helpers.actionLabel || (depth0 != null ? depth0.actionLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"actionLabel","hash":{}}) : helper)))
    + "</span>\r\n      <span class=\"action-text\">"
    + this.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"action","hash":{}}) : helper)))
    + "</span>\r\n    </p>\r\n  </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.attachment : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0)})) != null ? stack1 : "")
    + "</div>\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.activities_impl_activity.item', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!workflow/widgets/workitem/workitem.activities/impl/activity.item',[],function(){});
csui.define('workflow/widgets/workitem/workitem.activities/impl/activity.item.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/controls/form/fields/userfield.view',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/models/member',
  'csui/models/node/node.model',
  'csui/utils/base',
  'csui/utils/commands/open',
  'csui/utils/nodesprites',
  'i18n!workflow/widgets/workitem/workitem.activities/impl/nls/lang',
  'hbs!workflow/widgets/workitem/workitem.activities/impl/activity.item',
  'css!workflow/widgets/workitem/workitem.activities/impl/activity.item'
], function (_, $, Backbone, Marionette, DefaultActionBehavior, UserFieldView, NodeTypeIconView,
    MemberModel, NodeModel, base, OpenCommand, NodeSpriteCollection, lang, template) {
  

  var Activity = Marionette.LayoutView.extend({

    className: 'workflow-activity',

    template: template,
    tagName: 'li',

    templateHelpers: function () {
      // get attachment infomation
      this.activityAriaDescribedById = _.uniqueId('ActivityDescID_');
      var info = this._getAttachmentInfo();
      var comment = this.model.get('comment');
      var activityDate = this._getAuditDate(true);
      var activityAction = this._getAuditAction();
      var ariaComment;
      if (comment && comment.length !== 0){
        ariaComment = comment;
      }
      else{
        ariaComment = "";
      }
      var activityAriaDescription = _.str.sformat(lang.activityAria, lang.actionLabel, activityAction, activityDate, ariaComment);
      // return the JSON for the template
      return {
        date: activityDate,
        exactDate: this._getAuditDate(false),
        actionLabel: lang.actionLabel,
        action: activityAction,
        comment: (comment && comment.length !== 0),
        commentText: comment,
        reassign: this._isReassignAction(),
        reassignLabel: this._getReassignLabel(),
        attachment: info.isAttachmentAction,
        attachmentUrl: info.url,
        attachmentName: info.name,
        attachmentDesc: info.description,
        attachmentDisabled: this._hasAttachmentOpenAction(),
        dateAria: lang.dateAria.replace('{0}', activityDate),
        attachmentDescID:_.uniqueId('descID_'),
        activityAriaDescription:activityAriaDescription,
        ariaDescribedById: this.activityAriaDescribedById
      };
    },

    events: {
      'click .attachment-name > a': 'onDownloadAttachment'
    },

    _getAuditDate: function (friendly) {
      if (friendly === true) {
        // convert the audit date to a user friendly date
        return base.formatFriendlyDateTime(this.model.get('date'));
      } else {
        // convert the audit date to exact date/time representation
        return base.formatExactDateTime(this.model.get('date'));
      }
    },

    _getAuditAction: function () {
      var props;
      // get the action type
      var action = this.model.get('action');
      switch (action) {
      case 'start':
        action = lang.actionTextStart;
        break;
      case 'sendon':
        action = lang.actionTextSendOn;
        break;
      case 'forward':
        action = lang.actionTextForward;
        break;
      case 'review':
        action = lang.actionTextReview;
        break;
      case 'reassign':
        action = lang.actionTextReassign;
        break;
      case 'reply':
        action = lang.actionTextReply;
        break;
      case 'disposition':
        props = this.model.get('action_properties');
        action = props.label || props.event;
        break;
      case 'attachment':
        props = this.model.get('action_properties');
        switch (props.event) {
        case 'create':
          action = lang.actionTextAttachmentAttach;
          break;
        case 'addversion':
          action = lang.actionTextAttachmentUpdate;
          break;
        }
        break;
      }
      // return localized action
      return action;
    },

    _isReassignAction: function () {
      var action = this.model.get('action');
      return action === 'forward' || action === 'review' || action === 'reassign';
    },

    _isAttachmentAction: function () {
      var action = this.model.get('action');
      return action === 'attachment';
    },

    _hasAttachmentOpenAction: function () {
      // attachment has open action
      return (this.nodeModel && this.nodeModel.actions.get('open'));
    },

    _getAttachmentInfo: function () {
      // initialize return
      var ret = {
        isAttachmentAction: this._isAttachmentAction()
      };
      // add attachment information
      if (ret.isAttachmentAction === true) {
        var props = this.model.get('action_properties').node;
        if (!_.isUndefined(props)) {
          // prepare return
          ret.id = props.id;
          ret.name = props.name;
          ret.description = props.description;
          ret.type = props.type;
          ret.mime_type = props.mime_type;
          ret.url = DefaultActionBehavior.getDefaultActionNodeUrl(
              new Backbone.Model(props, {connector: this.model.connector}));
        }
      }
      // return
      return ret;
    },

    _getReassignLabel: function () {
      // get the reassgn action label
      var label = this.model.get('action');
      switch (label) {
      case 'forward':
        label = lang.actionTextForwardTo;
        break;
      case 'reassign':
        label = lang.actionTextReassignTo;
        break;
      case 'review':
        label = lang.actionTextReviewTo;
        break;
      }
      // return localized label
      return label;
    },

    regions: {
      userRegion: '.activity-item .user',
      reassignUserRegion: '.activity-item .reassign-user',
      attachmentIconRegion: '.activity-item .attachment-icon'
    },

    constructor: function Activity(options) {
      // initialize options
      options || (options = {});

      // initialize parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    onDownloadAttachment: function (event) {
      // instead executing the link, execute the 'open' command.
      event.preventDefault();
      if (this._hasAttachmentOpenAction()) {
        new OpenCommand().execute({
          nodes: new Backbone.Collection([this.nodeModel])
        }, {
          context: this.options.context
        });
      }
    },

    onRender: function () {
      var self = this;

      // retrieve the audit user
      var userdef = $.Deferred();
      var userId = this.model.get('user_id');
      if (userId && userId !== 0) {
        // load the user
        var auditUser = new MemberModel({id: userId}, {connector: self.options.connector});
        userdef = auditUser.fetch();
      } else {
        // anonymous user rendered when the users are suppressed by the audit
        userdef.resolve({data: {display_name: lang.anonymousUserName}});
      }
      $.when(userdef).then(function (data) {
        // render the user
        var view = new UserFieldView({
          context: self.options.context,
          mode: 'readonly',
          model: new Backbone.Model({
            data: data.data,
            schema: {
              readonly: true
            }
          }),
          alpaca: {
            options: {}
          }
        });
        //with this the aria-label is changed and an aria-describedby added inside the UserFieldView
        self.listenTo(view, 'render', function () {
          var label = view.$('a.esoc-user-container').attr('aria-label');
          view.$('a.esoc-user-container').attr('aria-label', lang.actionAriaLabel + label);
          view.$('a.esoc-user-container').attr('aria-describedby', this.activityAriaDescribedById);
        });
        if (self.userRegion) {
          self.userRegion.show(view);
        }
      });

      // retrieve the forward-to user
      if (this._isReassignAction() === true) {
        var reassigndef = $.Deferred();
        var reassignId = this.model.get('action_properties').user_id;
        if (reassignId && reassignId !== 0) {
          var reassignUser = new MemberModel({id: reassignId}, {connector: self.options.connector});
          reassigndef = reassignUser.fetch();
        } else {
          // anonymous user rendered when the users are suppressed by the audit
          reassigndef.resolve({data: {display_name: lang.anonymousUserName}});
        }
        $.when(reassigndef).then(function (data) {
          // render the user
          var view = new UserFieldView({
            context: self.options.context,
            mode: 'readonly',
            model: new Backbone.Model({
              data: data.data,
              schema: {
                readonly: true
              }
            }),
            alpaca: {
              options: {}
            }
          });
          //with this the aria-label is changed inside the UserFieldView
          self.listenTo(view, 'render', function () {
            var label = view.$('a.esoc-user-container').attr('aria-label');
            var reassignLabel = this._getReassignLabel();
            //get rid of the ":" in the reassignLabel
            view.$('a.esoc-user-container').attr('aria-label', reassignLabel.substring(0,reassignLabel.length-1) + label);
          });
          self.reassignUserRegion.show(view);
        });
      }
      // attachment mime-type icon
      if (this._isAttachmentAction() === true) {

        // fetch the attachment node
        self.nodeModel = new NodeModel(this._getAttachmentInfo(), {
          connector: this.options.connector,
          expand: {
            properties: ['original_id']
          },
          commands: ['open'],
          defaultActionCommands: ['open']
        });
        self.nodeModel.fetch().then(function () {
          // initialize and show the icon view
          var view = new NodeTypeIconView({node: self.nodeModel});
          self.attachmentIconRegion.show(view);
          // enable / disable link behavior
          if (!self._hasAttachmentOpenAction()) {
            self.$('.attachment > div').addClass('disabled');
          }
          var exactNodeSprite = NodeSpriteCollection.findByNode(self.nodeModel) || {},
              mimeTypeFromNodeSprite;
          if (exactNodeSprite.attributes) {
            //For type document the mimetype has to be get here
            mimeTypeFromNodeSprite = exactNodeSprite.get('mimeType');
          }
          var title = mimeTypeFromNodeSprite || self.nodeModel.get("type_name") || self.nodeModel.get("type");
          if (self.nodeModel.get("name") && title) {
            var linkTitleAria = _.str.sformat(lang.linkTitleAria, self.nodeModel.get("name"), title);
            self.$(".attachment-name a").attr("aria-label", linkTitleAria);
          }
        });
      }
    }
  });

  return Activity;
});
csui.define('workflow/widgets/workitem/workitem.activities/impl/activity.list.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'workflow/models/activity/activity.collection.model.factory',
  'workflow/widgets/workitem/workitem.activities/impl/activity.item.view',
  'i18n!workflow/widgets/workitem/workitem.activities/impl/nls/lang'
], function (_, $, Marionette, TabableRegionBehavior, ActivityCollectionModelFactory, ActivityView,
    lang) {
  

  var ActivityList = Marionette.CollectionView.extend({

    className: 'workflow-activity-list',

    childView: ActivityView,

    tagName: 'ul',

    //holds the list of the focusable items for all activities items
    //that is 1 or 2 User links and 0 or 1 attachment link
    focusableElements: [],

    childViewOptions: function () {
      return {
        context: this.options.context,
        connector: this.collection.connector
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },

    // storage for the selected index for KEyboard Accessibility
    selectedIndex: 0,

    // support up/down navigation,
    onKeyDown: function (e) {
      var $preElem;
      switch (e.keyCode) {
      case 38: // up
        // previous listitem is selected
        $preElem = this.currentlyFocusedElement();
        this._moveTo(e, this._selectPrevious(), $preElem);
        break;
      case 40: // down
        // next listitem is selected
        $preElem = this.currentlyFocusedElement();
        this._moveTo(e, this._selectNext(), $preElem);
        break;
      }
    },

    _moveTo: function (event, $elem, $preElem) {
      event.preventDefault();
      event.stopPropagation();

      setTimeout(_.bind(function () {
        $elem.focus();
        $preElem.prop('tabindex', '-1');
        $elem.prop('tabindex', '0');
      }, this), 50);
    },

    _selectNext: function () {
      if (this.selectedIndex < this.focusableElements.length - 1) {
        this.selectedIndex++;
      }
      return this.currentlyFocusedElement();
    },

    _selectPrevious: function () {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return this.currentlyFocusedElement();
    },

    currentlyFocusedElement: function () {
      //empty the focusableElements lists
      this.focusableElements = [];
      var $collection = this.$('li');
      var that = this;
      //fill the focusableElements lists
      _.each($collection, function ($item) {
        //create list with user link, this can be 2 in case of e.g. send for review...
        var $focusableUserLinks = $($item).find('.esoc-user-container');
        _.each($focusableUserLinks, function ($focusableUserLink) {
          that.focusableElements.push($focusableUserLink);
        });
        //in case of an attachment activity add the attachment link
        var $focusableAttachmentLinks = $($item).find('.attachment-name > a');
        _.each($focusableAttachmentLinks, function ($focusableAttachmentLink) {
          that.focusableElements.push($focusableAttachmentLink);
        });
      });
      //return the selected element of the list
      var elementOfFocus = (this.focusableElements.length > this.selectedIndex) ?
                           this.$(this.focusableElements[this.selectedIndex]) : null;
      return elementOfFocus;
    },

    constructor: function ActivityList(options) {
      // initialize options
      options || (options = {});
      options.collection = options.collection ? options.collection :
                           options.context.getModel(ActivityCollectionModelFactory);

      // apply the process id
      if (options.processId !== undefined && options.subprocessId !== undefined) {
        options.collection.setData({
          processId: options.processId,
          subprocessId: options.subprocessId
        });
      }

      // initialize parent
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    }
  });

  // return the list
  return ActivityList;
});

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.activities/impl/workitem.activities',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workflow-activities\" tabindex=\"-1\"></div>\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.activities_impl_workitem.activities', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!workflow/widgets/workitem/workitem.activities/impl/workitem.activities',[],function(){});
csui.define('workflow/widgets/workitem/workitem.activities/workitem.activities.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'workflow/widgets/workitem/workitem.activities/impl/activity.list.view',
  'hbs!workflow/widgets/workitem/workitem.activities/impl/workitem.activities',
  'css!workflow/widgets/workitem/workitem.activities/impl/workitem.activities'
], function (_, $, Marionette, PerfectScrollingBehavior, LayoutViewEventsPropagationMixin, ActivitiesListView, template) {
  

  var WorkflowActivitiesView = Marionette.LayoutView.extend({

    className: 'workflow-activities-container',

    template: template,

    regions: {
      activitiesListRegion: '.workflow-activities'
    },

    constructor: function WorkflowActivitiesView(options) {
      // initialize options
      this.options = options || (options = {});
      // initialize view
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    behaviors: {
      ScrollingBehavior: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.workflow-activities',
        suppressScrollX: true,
      }
    },

    onRender: function () {
      // initialize view
      var listView = new ActivitiesListView(this.options);
      // show
      this.activitiesListRegion.show(listView);
    }
  });

  _.extend(WorkflowActivitiesView.prototype, LayoutViewEventsPropagationMixin);
  return WorkflowActivitiesView;
});

// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.activities/workitem.activities.controller',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/utils/contexts/factories/node',
  'workflow/utils/workitem.extension.controller',
  'workflow/models/activity/activity.collection.model.factory',
  'workflow/widgets/workitem/workitem.activities/workitem.activities.view',
  'i18n!workflow/widgets/workitem/workitem.activities/impl/nls/lang'
], function (_, $, Backbone, Marionette, log, NodeModelFactory, WorkItemExtensionController,
    ActivityCollectionModelFactory, ActivityView, lang) {
  

  /**
   * Workitem integration controller
   * @param options Initialization options like context, data, parent view
   * @constructor
   */
  var WorkItemActivitiesController = WorkItemExtensionController.extend({

    // Type of the activities package
    type: 100,
    // Sub type of the activities package
    sub_type: 100,
    //This defines the tab order
    position: 2,

    constructor: function WorkItemActivitiesController(attributes, options) {
      WorkItemExtensionController.prototype.constructor.apply(this, arguments);

      options || (options = {});

      this.context = attributes.context;
    },

    /**
     * Validates the data package
     * @param type
     * @param sub_type
     * @returns {boolean}
     */
    validate: function (type, sub_type) {
      //only return true when this isn't draft only when not draft the tab should be displayed
      if (type === this.type && sub_type === this.sub_type) {
        //Activities data package
        return true;
      }
      // other data packages
      return false;
    },

    // Execute the controller action
    execute: function (options) {

      // Deferred object to control the model loading
      var deferred = $.Deferred();

      // Check the current requested extension point
      //activities view isn't visible in Draft
      if (options.extensionPoint === WorkItemExtensionController.ExtensionPoints.AddSidebar &&
          !options.model.get("isDraft") && (options.model.get("isDoc") === undefined) &&
          (options.model.get("isDocDraft") === undefined)) {

        // initialize the activities collection
        var activities = this.context.getModel(ActivityCollectionModelFactory);
        activities.setData({
          processId: options.model.get('process_id'),
          subprocessId: options.model.get('subprocess_id')
        });
        activities.fetch();

        // this is the model necessary for the tabPanel it must contain a title, viewToRender and 
        // viewToRenderOptions and a position which defins the order of  the tabs        
        var args = {
          title: lang.viewTitle,
          position: this.position,
          viewToRender: ActivityView,
          viewToRenderOptions: {
            context: this.context,
            collection: activities
          }
        };
        // return the promise
        deferred.resolve(args);
        return deferred.promise();
      } else {
        // this extension point is not supported from this integration, don't return a view
        deferred.resolve({});
        return deferred.promise();
      }
    }
  });

  return WorkItemActivitiesController;
});

csui.define('workflow/behaviors/list.keyboard.behavior',[
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette'
], function (module, _, $, Marionette) {
  

  var ListKeyboardBehavior = Marionette.Behavior.extend({

    defaults: {
      'currentlyFocusedElementSelector': 'li:nth-child({0})'
    },

    constructor: function ListKeyboardBehavior(options, view) {
      // apply marionette behavior implementation
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      // extend the views
      _.extend(view, {

        // storage for the selected index
        selectedIndex: 0,
        //necessary variables for the inline actions behavior
        $inlineItems: undefined,
        inlineItemIndex: 0,
        inlineDropDownIsOpenSelector: "",
        $inlineItemsDropDown: undefined,
        inlineItemDropDownIndex: -1,

        // support up/down navigation
        onKeyDown: function (e) {
          var $preElem;
          switch (e.keyCode) {
          case 27: //escape
            //with escape reset in any case the inlineItemDropDownIndex
            this.inlineItemDropDownIndex = -1;
            break;
          case 38: // up
            //in case there is a $inlineItemsDropDown defined and it is open, the 'key up' and
            // 'key down' should move inside the menuitems
            if ((this.$inlineItemsDropDown !== undefined) && (this.$inlineItemsDropDown.length !== 0) && (this.$(this.inlineDropDownIsOpenSelector).length > 0 )){
              this._moveInlineMenu(e, this._selectPreviousInlineElementMenu());
            }else {
              // previous listitem is selected
              $preElem = this.currentlyFocusedElement();
              this._moveTo(e, this._selectPrevious(), $preElem);
            }
            break;
          case 40: // down
            //in case there is a $inlineItemsDropDown defined and it is open, the 'key up' and
            // 'key down' should move inside the menuitems
            if ((this.$inlineItemsDropDown !== undefined) && (this.$inlineItemsDropDown.length !== 0) && (this.$(this.inlineDropDownIsOpenSelector).length > 0 )){
              this._moveInlineMenu(e, this._selectNextInlineElementMenu());
            }else {
              // next listitem is selected
              $preElem = this.currentlyFocusedElement();
              this._moveTo(e, this._selectNext(), $preElem);
            }
            break;
          case 39: //key right
            //only if this isn't in edit mode , move right inside the inline actions of this item
            if (!($(e.target).hasClass('cs-input'))) {
              if ((this.$inlineItems.length !== 0) &&
                  (this.$(this.inlineDropDownIsOpenSelector).length === 0 )) {
                this._moveInline(e, this._selectNextInlineElement());
              }
            }
            break;
          case 37: //key left
            //only if this isn't in edit mode, move left inside the inline actions of this item
            if (!($(e.target).hasClass('cs-input'))) {
              if ((this.$inlineItems.length !== 0) && (this.$(this.inlineDropDownIsOpenSelector).length === 0 )) {
                this._moveInline(e, this._selectPreviousInlineElement());
              }
            }
            break;
          }
        },

        _moveInlineMenu: function (event, $elem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            //set all inlinelements to -1
            this.$inlineItemsDropDown.prop('tabindex', '-1');
            $elem.focus();
            $elem.prop('tabindex', '0');
          }, this), 50);
        },

        _selectNextInlineElementMenu: function () {
          if (this.inlineItemDropDownIndex < this.$inlineItemsDropDown.length - 1) {
            this.inlineItemDropDownIndex++;
          }
          return this.$(this.$inlineItemsDropDown[this.inlineItemDropDownIndex]);
        },

        _selectPreviousInlineElementMenu: function () {
          if (this.inlineItemDropDownIndex > 0) {
            this.inlineItemDropDownIndex--;
          }
          return this.$(this.$inlineItemsDropDown[this.inlineItemDropDownIndex]);
        },

        _moveInline: function (event, $elem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            //set all inlinelements to -1
            this.$inlineItems.prop('tabindex', '-1');
            $elem.focus();
            $elem.prop('tabindex', '0');
          }, this), 50);
        },

        _selectNextInlineElement: function () {
          if (this.inlineItemIndex < this.$inlineItems.length - 1) {
            this.inlineItemIndex++;
          }
          return this.$(this.$inlineItems[this.inlineItemIndex]);
        },

        _selectPreviousInlineElement: function () {
          if (this.inlineItemIndex > 0) {
            this.inlineItemIndex--;
          }
          return this.$(this.$inlineItems[this.inlineItemIndex]);
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            $elem.focus();
            $preElem.prop('tabindex', '-1');
            $elem.prop('tabindex', '0');
          }, this), 50);
        },

        _selectNext: function () {
          var collection = this.collection || this.model;
          if (this.selectedIndex < collection.length - 1) {
            this.selectedIndex++;
          }
          return this.currentlyFocusedElement();
        },

        _selectPrevious: function () {
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.currentlyFocusedElement();
        },

        currentlyFocusedElementSelector: this.options.currentlyFocusedElementSelector,

        currentlyFocusedElement: function () {
          // reset the focused list index whenever the previous index is larger than the
          // currently rendered elements
          var collection = this.collection || this.model;
          if ((this.selectedIndex !== 0) && (this.selectedIndex >= collection.length)) {
            this.selectedIndex = collection.length - 1;
          }
          //find all items
          var $item = this.$(this.currentlyFocusedElementSelector);
          //return the selected element of the list
          var elementOfFocus = ($item.length > this.selectedIndex) ?
                               this.$($item[this.selectedIndex]) : null;
          return elementOfFocus;
        }
      });
    } // constructor
  });

  return ListKeyboardBehavior;
});


// Lists explicit locale mappings and fallbacks

csui.define('workflow/widgets/workitem/workitem.attachments/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/widgets/workitem/workitem.attachments/impl/nls/root/lang',{
  TabTitle: 'Attachments',
  AddToolbarItemLabel: 'Add attachment',
  AddFromContentServerLabel: 'Add from Content Server',
  AddFromDesktopLabel: 'Add from Desktop',
  AddShortcutLabel: 'Add shortcut',
  AddDocumentLabel: 'Add document(s)',
  ButtonLabelAdd: 'Add',
  CommandNameAdd: 'Add',
  CommandVerbAdd: 'add',
  CommandDoneVerbAdd: 'copied',
  AddPageLeavingWarning: 'If you leave the page now, pending items will not be added.',
  AddingOneFile: 'Adding file',
  AddFilesSucceeded: '{0} files succeeded.',
  AddOneFileSucceeded: 'Add succeeded.',
  AddFiles: 'Adding {0} files',
  AddFilesFailed: '{2} files failed to add.',
  AddFilesOneFailed: '1 file failed to add.',
  CopyOneFileFailed: 'Copy failed',

  CopyingNodes: 'Copying {0} nodes',
  CopyingNode: 'Copying 1 node',
  DropMessage: 'Drop your item(s) here',
  EmptyDragAndDropMessage: 'Drag and drop files here',
  MessageItemCopied: '{0} item copied.',
  MessageItemsCopied: '{0} items copied.',
  AddingNodes: 'Adding {0} nodes',
  AddingNode: 'Adding 1 node',
  MessageItemAdded: '{0} item Added.',
  MessageItemsAdded: '{0} items Added.',

  ErrorMessageLoadAttachments: 'Workflow attachments could not be loaded.',

  DescriptionPlaceholder: 'Add description',
  NamePlaceholder: 'Enter file name',
  FileAlreadyExists: 'An item with the name \'{0}\' already exists',
  MaxLengthReached: 'This field must contain at most 248 numbers or characters.',
  Cancel: 'Cancel',
  NoFiles: 'No files were dropped.',
  AddTypeDenied: 'Cannot add documents to {1}.',
  AttachmentsFailMessageTitle: 'Unable to start the workflow',
  AttachmentsFailMessage: 'An error prevented {0} from being attached to the workflow.',

  linkTitleAria: '{0} of type {1}'

});


csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.draganddrop.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/draganddrop/draganddrop.view',
  'csui/controls/fileupload/fileupload',
  'csui/controls/globalmessage/globalmessage',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (_, Marionette, DragAndDrop, fileUploadHelper, GlobalMessage, lang) {
  
  var WorkItemDragDropView = DragAndDrop.extend({
    constructor: function WorkItemDragDropView(options) {
      DragAndDrop.prototype.constructor.call(this, options);
    },
    templateHelpers: function () {
      var messages = DragAndDrop.prototype.templateHelpers.apply(this, arguments),
          dropMsg  = lang.DropMessage;
      // overriding drag and drop templateHelper message
      if (messages.message !== undefined && messages.message !== "") {
        messages.message = dropMsg;
        return {
          message: messages.message
        };
      }
      else {
        return {
          message: dropMsg
        };
      }
    },
    onDropView: function (currentEvent) {
      currentEvent.preventDefault();
      currentEvent.stopPropagation();
      var self         = this,
          dataTransfer = currentEvent.originalEvent &&
                         currentEvent.originalEvent.dataTransfer ||
              {
                files: currentEvent.originalEvent &&
                       currentEvent.originalEvent.target &&
                       currentEvent.originalEvent.target.files || []
              };
      this._selectFiles(dataTransfer)
          .always(function (files) {
            files = _.reject(files, function (file) {
              return file instanceof Error;
            });
            if (files.length) {
              if (files.length === 1) {
                self.collection.singleFileUpload = true;
              }
              if (self.canAdd()) {
                var fileUploadModel = fileUploadHelper.newUpload(
                    _.extend({
                      originatingView: self.parentView
                    }, _.clone(self.options))
                );
                fileUploadModel.addFilesToUpload(files, {
                  collection: self.collection
                });
              } else {
                var nodeName = self.container.get('name');
                GlobalMessage.showMessage('error',
                    lang.AddTypeDenied.replace('{1}', nodeName));
              }
            } else {
              GlobalMessage.showMessage('error', lang.NoFiles);
            }
          });
      this.disable();

    }
  });
  return WorkItemDragDropView;
});

csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachment.tableactionbar',[
  'csui/lib/backbone',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/models/nodes',
  'csui/utils/commandhelper',
  'csui/utils/commands/properties'
], function (Backbone, TableActionBarView, NodeCollection, CommandHelper, PropertiesCommand) {
  

  var WorkItemAttachmentActionbar = TableActionBarView.extend({
    // This method is triggered as a nested 'childview:...' event; such
    // events always get the childView as the first argument.
    onChildviewToolitemAction: function (toolItemView, args) {

      var signature = args.toolItem.get("signature");
      var promisesFromCommands;
      var command = this.commands.findWhere({signature: signature});

      var status = {
        nodes: new NodeCollection([this.model]),
        container: this.container,
        collection: this.containerCollection,
        originatingView: this.originatingView, // use the workitem view as originating view, so that the full view is replaced.
        context: this.options.context
      };
      Backbone.trigger('closeToggleAction');
      if (signature === "Properties") {
		//executing custom property command because csui property command only replacing view of dialog not header and footer
        this.originatingView.collection.propertiesAction = true;
        this.propertiesCommand = new PropertiesCommand();
        promisesFromCommands = this.propertiesCommand.execute(status);

      } else {
        // a command must be found because otherwise the toolbar item would not be in this bar
        promisesFromCommands = command.execute(status);
      }
      CommandHelper.handleExecutionResults(promisesFromCommands,
          {command: command, suppressSuccessMessage: status.suppressSuccessMessage});
    }

  });

  return WorkItemAttachmentActionbar;

});


csui.define('workflow/widgets/workitem/workitem.attachments/workitem.attachments.toolbaritems',[
  'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings'
], function (_, ToolItemsFactory, ToolItemModel, lang) {
  

  var toolbarItems = {

    // inline action bar
    inlineActionbar: new ToolItemsFactory({
          other: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata"
            },
            {
              signature: "Edit",
              name: lang.ToolbarItemEdit,
              icon: "icon icon-toolbar-edit"
            },
            {
              signature: "Download",
              name: lang.ToolbarItemDownload,
              icon: "icon icon-toolbar-download"
            },
            {
              signature: "OpenShortlink",
              name: lang.ToolbarItemOpen,
              icon: "icon icon-toolbar-shortcut"
            },
            {
              signature: "InlineEdit",
              name: lang.ToolbarItemRename,
              icon: "icon icon-toolbar-rename"
            },
            {
              signature: "Delete",
              name: lang.ToolbarItemDelete,
              icon: "icon icon-toolbar-delete"
            }
          ]
        },
        {
          maxItemsShown: 4,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more"
        })
  };

  return toolbarItems;
});

csui.define('workflow/commands/open.shortlink/open.shortlink',["module", "csui/lib/underscore", "csui/lib/jquery", "csui/utils/commandhelper",
  "csui/models/command"
], function (module, _, $, CommandHelper,
    CommandModel) {
  

  var OpenShortlinkCommand = CommandModel.extend({

    defaults: {
      signature: "OpenShortlink",
      command_key: ['openshortlink', 'OpenShortlink'],
      name: 'OpenShortlink',
      verb: 'OpenShortlink',
      doneVerb: 'OpenShortlink',
      scope: "single"
    },

    execute: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      var deferred = $.Deferred();
      node.set('ActionBarShortcutOpenCommand', true, {silent: true});
      node.unset('ActionBarShortcutOpenCommand');
      deferred.resolve();
      return deferred.promise();

    },

  });

  return OpenShortlinkCommand;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"workitem-attachments-item\">\r\n  <div class=\"workitem-attachments-icon\"></div>\r\n  <div class=\"workitem-attachments-info\">\r\n    <a class=\"workitem-attachments-name\" href=\""
    + this.escapeExpression(((helper = (helper = helpers.defaultActionUrl || (depth0 != null ? depth0.defaultActionUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"defaultActionUrl","hash":{}}) : helper)))
    + "\">\r\n      <div class=\"workitem-attachment-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</div>\r\n    </a>\r\n\r\n    <input id=\"workitem-attachments-name-input-"
    + this.escapeExpression(((helper = (helper = helpers.nodeId || (depth0 != null ? depth0.nodeId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"nodeId","hash":{}}) : helper)))
    + "\" class=\"workitem-attachments-name-input\r\n    binf-form-control cs-input rename-field binf-hidden\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.namePlaceholder || (depth0 != null ? depth0.namePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"namePlaceholder","hash":{}}) : helper)))
    + "\"\r\n           tabindex=\"-1\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.namePlaceholder || (depth0 != null ? depth0.namePlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"namePlaceholder","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n    <span class=\"workitem-attachments-name-cancel csui-undo edit-cancel inline-edit-icon\r\n      rename-field binf-hidden\" tabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\"></span>\r\n\r\n    <div id=\"workitem-attachments-error-message-"
    + this.escapeExpression(((helper = (helper = helpers.nodeId || (depth0 != null ? depth0.nodeId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"nodeId","hash":{}}) : helper)))
    + "\"\r\n         class=\"workitem-attachments-error-message binf-hidden\"></div>\r\n\r\n    <div class=\"workitem-attachments-description\">\r\n        <textarea id=\"workitem-attachments-description-input-"
    + this.escapeExpression(((helper = (helper = helpers.nodeId || (depth0 != null ? depth0.nodeId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"nodeId","hash":{}}) : helper)))
    + "\" class=\"workitem-attachments-description-input binf-form-control cs-input rename-field\r\n      binf-hidden\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.descriptionPlaceholder || (depth0 != null ? depth0.descriptionPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"descriptionPlaceholder","hash":{}}) : helper)))
    + "\" tabindex=\"-1\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.descriptionPlaceholder || (depth0 != null ? depth0.descriptionPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"descriptionPlaceholder","hash":{}}) : helper)))
    + "\" rows=\"2\"></textarea>\r\n      <span class=\"workitem-attachments-description-cancel csui-undo edit-cancel inline-edit-icon\r\n      rename-field binf-hidden\" tabindex=\"-1\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\"></span>\r\n\r\n      <div class=\"wrap\">\r\n        <div>\r\n\r\n        <span\r\n            class=\"workitem-attachment-description workitem-attachments-description-ro binf-hidden\"\r\n            title=\""
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"description","hash":{}}) : helper)))
    + "</span>\r\n\r\n          <span\r\n              class=\"workitem-attachment-description workitem-attachments-empty-description-ro binf-hidden\"\r\n              title=\""
    + this.escapeExpression(((helper = (helper = helpers.descriptionPlaceholder || (depth0 != null ? depth0.descriptionPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"descriptionPlaceholder","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.descriptionPlaceholder || (depth0 != null ? depth0.descriptionPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"descriptionPlaceholder","hash":{}}) : helper)))
    + "</span>\r\n\r\n        </div>\r\n      </div>\r\n\r\n    </div>\r\n  </div>\r\n  <div class=\"workitem-attachments-actions\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.attachments_impl_workitem.attachmentitem', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments',[],function(){});
// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/utils/log',
  'csui/controls/globalmessage/globalmessage',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachment.tableactionbar',
  'csui/controls/node-type.icon/node-type.icon.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.toolbaritems',
  'workflow/commands/open.shortlink/open.shortlink',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function (_, $, Marionette, DefaultActionBehavior, log, GlobalMessage,
    TableActionBarView, NodeTypeIconView, toolbarItems, OpenShortlinkCommand, template, lang) {
  

  // An application widget is a view, because it should render a HTML fragment
  var WorkItemAttachmentItemView = Marionette.ItemView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'workitem-attachment-properties',

    // Template method rendering the HTML for the view
    template: template,
    tagName: 'li',
    // view behaviors
    // - the default action behavior is required for the default action and the action bar.
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    // Return JSON object used in the handlebars template
    templateHelpers: function () {
      var attachmentNodeId;
      //id is undefined for 'Initiate from Document with more WFs for initiation active'
      //then original_id is set
      if (this.model.attributes.id) {
        attachmentNodeId = this.model.attributes.id;
      }
      else if (this.model.attributes.original_id) {
        attachmentNodeId = this.model.attributes.original_id;
      }
      return {
        name: this.model.get('name'),
        description: this.model.get('description'),
        defaultActionUrl: DefaultActionBehavior.getDefaultActionNodeUrl(this.model),
        descriptionPlaceholder: lang.DescriptionPlaceholder,
        namePlaceholder: lang.NamePlaceholder,
        nodeId: attachmentNodeId,
        cancel: lang.Cancel
      };
    },

    ui: {
      attachmentItem: '.workitem-attachments-item',
      attachmentIcon: '.workitem-attachments-icon',
      attachmentAction: 'a.workitem-attachments-name',
      attachmentDescription: 'div.workitem-attachments-description',
      attachmentDescriptionRO: 'span.workitem-attachments-description-ro',
      attachmentDescriptionInput: '.workitem-attachments-description-input',
      attachmentDescriptionCancel: '.workitem-attachments-description-cancel',
      attachmentNameInput: '.workitem-attachments-name-input',
      attachmentName: '.workitem-attachment-name',
      attachmentErrorMsg: '.workitem-attachments-error-message',
      attachmentNameCancel: '.workitem-attachments-name-cancel',
      attachmentEmptyDescriptionRO: '.workitem-attachments-empty-description-ro'
    },

    events: {
      'keydown': 'onKeyDown',
      'mouse:enter': 'onMouseEnter',
      'mouse:leave': 'onMouseLeave',
      'focusin @ui.attachmentAction': 'onFocusIn',
      'focusout @ui.attachmentItem': 'onFocusOutItem',
      'click @ui.attachmentAction': 'onClickItem'
    },

    // triggers on the child view are handled on the parent collection view
    triggers: {
      'mouseenter': 'mouse:enter',
      'mouseleave': 'mouse:leave',
      'click @ui.attachmentDescriptionRO, @ui.attachmentEmptyDescriptionRO': 'click:description',
      'click @ui.attachmentDescriptionCancel,@ui.attachmentNameCancel': 'click:cancel'
    },

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function WorkItemAttachmentItemView(options) {
      this.options = options;
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.iconView = new NodeTypeIconView({node: this.model});
      this.listenTo(this.model, "change:csuiInlineFormErrorMessage", this.onRenameMode);
      this.listenTo(this.model, 'change:ActionBarShortcutOpenCommand', this.openShortlink);
    },

    onKeyDown: function (event) {
      var keyCode = event.keyCode,
          target  = $(event.target),
          retVal  = true;
      switch (keyCode) {
      case 9: //Tab
        if (target.hasClass('workitem-attachments-description-input') &&
            this.ui.attachmentDescriptionCancel.hasClass("binf-hidden")) {
          this.ui.attachmentNameInput.focus();
          retVal = false;
        }
        if (target.hasClass('workitem-attachments-name-input')) {
          this.ui.attachmentDescriptionInput.focus();
          retVal = false;
        }
        if (target.hasClass('workitem-attachments-description-input') &&
            this.ui.attachmentNameCancel.hasClass("binf-hidden")) {
          this.ui.attachmentDescriptionInput.focus();
          retVal = false;
        }
        break;
      case 27: //Esc
        if (target.hasClass('cs-input') || target.hasClass('edit-cancel')) {
          this._cancelEdit();
          retVal = false;
        }
        break;
      case 32: //Enter and space
      case 13:
        if (target.hasClass('cs-input')) {
          if (keyCode === 13) {
            //enter in the input field, save the new description
            event.preventDefault();
            event.stopPropagation();
            retVal = false;
            if (this.validateFileName() && !this._parent.errorCase) {
              this._submitDescription();
              this._cancelEdit();
            }
          }
          /* space in the input field, no action here */
        } else if (target.hasClass('edit-cancel')) {
          //space or enter on the cancel button, cancel the edit mode
          event.preventDefault();
          event.stopPropagation();
          retVal = false;
          this._cancelEdit();
        }
        break;
      case 113:
        //F2 switch to edit mode for name and description
        if (!this.ui.attachmentDescriptionRO.hasClass('binf-hidden') ||
            !this.ui.attachmentEmptyDescriptionRO.hasClass('binf-hidden')) {
          this.onRenameMode();
        }
        //F2 in the input field , save the new name and description
        if (target.hasClass('cs-input')) {
          event.preventDefault();
          event.stopPropagation();
          retVal = false;
          if (this.validateFileName() && !this._parent.errorCase) {
            this._submitDescription();
            this._cancelEdit();
          }
        }
        break;
      }
      return retVal;
    },

    onFocusIn: function (view) {
      this._showActionBar({
        view: view,
        model: view.model
      });
    },

    onMouseEnter: function (view) {
      this._showActionBar({
        view: view,
        model: view.model
      });
    },

    onMouseLeave: function (view) {
      this._destroyActionBar();
    },

    onClickItem: function (event) {
      // Do not navigate to the URL; it is there to bookmarking only
      event.preventDefault();
      this.cancelPrevEdit();
      // Trigger the default action execution handler registered in the
      // DefaultActionBehavior; if the action is disabled, it does nothing
      this.triggerMethod('execute:defaultAction', this.model);
    },

    onClickDescription: function (e) {
      this._editDescription();
    },

    /**
     * Click on the cancel button
     * @param e
     */
    onClickCancel: function (e) {
      this._cancelEdit();
    },

    /**
     * Item has lost the focus, cancel the edit mode
     * @param e
     */
    onFocusOutItem: function (event) {
      var relatedTarget = $(event.relatedTarget);
      if (!relatedTarget.hasClass('cs-input') && !relatedTarget.hasClass('edit-cancel') &&
          !$(event.target).hasClass('edit-cancel') && !$(event.target).hasClass('needsclick')) {
        //validate the filename if the file already exists or exceeds the limit
        if (this.isEditMode() && this.validateFileName() && !this._parent.errorCase) {
          this._submitDescription();
          var flag           = false,
              activeElements = ($(':active').length) ? $(':active') : $(':hover'),
              activeElement  = $(activeElements[activeElements.length - 1]);
          //checking weather the user clicked any of the below elements
          if (activeElement.hasClass('workitem-attachment-description') ||
              activeElement.hasClass('workitem-attachment-name') ||
              activeElement.hasClass('icon icon-toolbar-rename')) {
            flag = true;
          }
          if (!flag) {
            //Cancel the edit mode when clicking outside except on attachment item area
            this._cancelEdit();
          }
        }
        else {
          //in case the focus is set outside of the attachment item => destroy action bar but
          // only then
          if ((relatedTarget.hasClass('csui-toolitem') === false) &&
              (relatedTarget.hasClass('workitem-expand-icon') === false)) {
            this._destroyActionBar();
            this.$(".workitem-attachments-name").prop('tabindex', '0');
          }
        }
      }
    },

    /**
     * Switch to the edit mode for the description
     * @private
     */
    _editDescription: function () {
      //check for the Rename action, it indicates the permission to change the description
      //due to inconsistencies between the load calls for the collection and the model we have to check for Rename and rename action.
      var commandCS = this.model.actions.findWhere({signature: 'Rename'});
      var commandCI = this.model.actions.findWhere({signature: 'rename'});
      // if error case don't switch to edit mode
      if (!_.isUndefined(commandCS) || !_.isUndefined(commandCI) && !this._parent.errorCase) {


        //cancel previous editing fileds
        this.cancelPrevEdit();
        //destroy the bar if it exists
        this._destroyActionBar();

        if (!this.ui.attachmentDescriptionRO.hasClass('binf-hidden') ||
            !this.ui.attachmentEmptyDescriptionRO.hasClass('binf-hidden')) {
          var desc = this.model.get('description');
          this.ui.attachmentDescriptionInput.val(desc);

          if (this.model.get('description')) {
            this.ui.attachmentDescriptionRO.addClass('binf-hidden');
          } else {
            this.ui.attachmentEmptyDescriptionRO.addClass('binf-hidden');
          }

          this.ui.attachmentDescriptionInput.removeClass('binf-hidden');
          this.ui.attachmentDescriptionCancel.removeClass('binf-hidden');
          this.ui.attachmentItem.addClass('workitem-attachments-description-edit');
          this.ui.attachmentDescriptionInput.focus();

          // toggle the edit mode flag
          this._parent.editMode = this.model.get('id');
          this.triggerMethod('editmode:item', this);
        }
      }
    },

    _submitDescription: function () {
      if (this.ui.attachmentDescriptionRO.hasClass('binf-hidden')) {

        //get the new name and description and store it in the model, save it and render the view
        var newDesc = this.ui.attachmentDescriptionInput.val().trim();
        var oldDesc = this.model.get('description');
        var newName = this._checkName();
        var oldName = this.model.get('name');
        if (newName.length === 0) {
          this._cancelEdit();
        } else {
          this.model.set({'name': newName, 'description': newDesc});
          this.model.save({'name': newName, 'description': newDesc},
              {wait: true, patch: true, includeActions: true})
              .done(_.bind(function () {
                var tempNode = this.model.clone();
                tempNode.collection = this.model.collection;
                tempNode.fetch()
                    .then(_.bind(function () {
                      this.model.set(tempNode.attributes);
                      if (tempNode.original) {
                        this.model.original = tempNode.original;
                      }
                      //in case the enter was pressed, the actionbar is rerendered by the this.model.set
                      //but has not the necessary classes and Keyboard Accessiblity settings
                      if (this.$(".workitem-attachments-actions>div>ul>li>a.csui-toolitem").length > 0) {
                        this._updateActionBarAndPrepareKeyboardAccess();
                      }
                    }, this));
              }, this))
              .fail(_.bind(function (error) {
                GlobalMessage.showMessage('error', error.responseJSON.error);
                this.model.set({'name': oldName, 'description': oldDesc});
                this.model.fetch();
                this.render();
              }, this));
          // toggle the error flag
          this._parent.errorCase = false;
        }
      }
    },

    _checkName: function () {
      return this.ui.attachmentName.hasClass("binf-hidden") &&
             this.ui.attachmentDescriptionRO.hasClass("binf-hidden") ?
             this.ui.attachmentNameInput.val().trim() : this.model.get("name");
    },

    /**
     * Cancel the edit mode for the description, by hiding the edit box and showing the old text
     * @private
     */
    _cancelEdit: function () {
      if (this.ui.attachmentDescriptionRO.hasClass('binf-hidden')) {
        this.ui.attachmentErrorMsg.text('');
        this.ui.attachmentErrorMsg.attr('title', '');
        this.ui.attachmentErrorMsg.addClass("binf-hidden");
        this.$el.find("#workitem-attachments-name-input-" + this.model.attributes.id).removeClass(
            "workitem-attachments-error-display");
        this.ui.attachmentItem.removeClass('workitem-attachments-edit-error');
        this.ui.attachmentDescriptionInput.addClass('binf-hidden');
        this.ui.attachmentDescriptionCancel.addClass('binf-hidden');
        if (this.model.get('description')) {
          this.ui.attachmentDescriptionRO.removeClass('binf-hidden');
        } else {
          this.ui.attachmentEmptyDescriptionRO.removeClass('binf-hidden');
        }
        this.ui.attachmentName.removeClass('binf-hidden');
        this.ui.attachmentNameInput.addClass("binf-hidden");
        this.ui.attachmentNameCancel.addClass('binf-hidden');
        this.ui.attachmentItem.removeClass('workitem-attachments-actions-display');
        this.ui.attachmentItem.removeClass('workitem-attachments-description-edit');

        var name        = this.model.get('name'),
            description = this.model.get('description');
        this.ui.attachmentName.text(name);
        this.ui.attachmentName.attr('title', name);
        this.ui.attachmentDescriptionRO.text(description);
        this.ui.attachmentDescriptionRO.attr('title', description);
        // unsetting the editmode flag
        delete this._parent.editMode;
        this.triggerMethod('editmode:item', this);
        // toggle the error flag
        this._parent.errorCase = false;
      }
    },

    /**
     * Returns true if the item is in edit mode and not action bar should be shown.
     * @returns {boolean}
     */
    isEditMode: function () {
      //checking the current attachment is in edit mode or not
      if (this._parent.editMode && ( this.model.get('id') === this._parent.editMode )) {
        return true;
      } else {
        return false;
      }
    },

    onRender: function () {
      this.iconView.render();
      this.ui.attachmentIcon.prepend(this.iconView.$el);
      if (this.model.get('description')) {
        this.ui.attachmentDescriptionRO.removeClass('binf-hidden');
      } else {
        var mapsList = this.options.view.model.get('mapsList');
        if (((mapsList && mapsList.length === 1) || !this.options.view.model.get('isDoc')) &&
            !this.options.view.model.get('isWFStatusItemAttachment')) {
          this.ui.attachmentEmptyDescriptionRO.removeClass('binf-hidden');
        }
      }
      //show grayed out items when there is no default action
      if (this.options.defaultActionController &&
          !this.options.defaultActionController.hasAction(this.model)) {
        var inactiveClass = 'workitem-attachment-inactive';
        this.$el.find(".workitem-attachments-icon").addClass(inactiveClass);
        this.$el.find(".workitem-attachments-name").addClass(inactiveClass);
      }
      //show description in edit mode after adding single attachment
      if (this.model.isLocallyCreated && this.model.collection.singleFileUpload) {
        //delay the switch to the edit mode, so that the item is already rendered and the focus could be set
        _.delay(_.bind(function () {
          this._editDescription();
          //remove the temporarily new flag
          this.model.isLocallyCreated = undefined;
          this.model.collection.singleFileUpload = undefined;
        }, this), 500);
      }

      if (this.model.attributes) {
        //For type document the mimetype has to be get here
        var mimeTypeFromModel = this.model.get("mime_type");
      }
      var title = mimeTypeFromModel || this.model.get("type_name") || this.model.get("type");
      if (this.model.get("name") && title) {
        var linkTitleAria = _.str.sformat(lang.linkTitleAria, this.model.get("name"), title);
        this.$el.find(".workitem-attachments-name").attr("aria-label", linkTitleAria);
      }
    },

    _updateActionBarAndPrepareKeyboardAccess: function () {

      //add Class so that the menu is on the left side
      this.tableActionBarView.$el.find(".binf-dropdown-menu").addClass('binf-dropdown-menu-right');
      //Add Class so that it is clear that this is inside the action item
      // necessary for the keyboard Accessibility
      this.tableActionBarView.$el.find(".binf-dropdown-toggle").addClass('workitem-expand-icon');

      //Fill the inlineitemslist and reset the inlineItemIndex for keyboard navigation
      var that = this;
      this._parent.inlineItemIndex = 0;
      this._parent.inlineItemDropDownIndex = -1;
      this._parent.$inlineItems = this.$(".workitem-attachments-name");

      //For keyboard navigation set tabindex of all toolitems icons to -1
      //Find all toolitems which aren't in the dropdownlist
      var $toolItems = this.$(".workitem-attachments-actions>div>ul>li>a.csui-toolitem");
      $toolItems.prop('tabindex', '-1');

      //Find expand Icon if available
      var $expandIcon = this.$(".workitem-attachments-actions .binf-dropdown-toggle");
      $expandIcon.prop('tabindex', '-1');

      //create list with the visible icons
      _.each($toolItems, function ($toolItem) {
        that._parent.$inlineItems.push($toolItem);
      });
      _.each($expandIcon, function ($expandIconSolo) {
        that._parent.$inlineItems.push($expandIconSolo);
      });
      this._parent.inlineDropDownIsOpenSelector = "li.binf-dropdown.binf-open";

      //find menuitems of dropdownlist if available
      var $dropDownMenus = this.$(".workitem-attachments-actions .binf-dropdown-menu a");
      $dropDownMenus.prop('tabindex', '-1');

      this._parent.$inlineItemsDropDown = [];
      _.each($dropDownMenus, function ($dropDownMenu) {
        that._parent.$inlineItemsDropDown.push($dropDownMenu);
      });
      that._parent.$inlineItemsDropDown = this.$(that._parent.$inlineItemsDropDown);
    },

    _showActionBar: function (args) {

      // is view in edit mode?
      if (this.isEditMode()) {
        return;
      }

      //destroy the bar if it exists
      this._destroyActionBar();
      //Adding openshortlinkcommand to commands when the default action is enabled
      if (this.defaultActionController && this.defaultActionController.hasAction(this.model)) {
        this.defaultActionController.commands.add(new OpenShortlinkCommand());
      } else {
        this.defaultActionController.commands.remove([{id: "OpenShortlink"}]);
      }

      // initialize the action bar
      // TODO: the action bar style should be configurable with the module config
      this.tableActionBarView = new TableActionBarView(_.extend({
            context: this.options.context,
            commands: this.defaultActionController.commands,
            collection: toolbarItems.inlineActionbar,
            model: this.model,
            container: this.options.container,
            originatingView: this.options.view,
            containerCollection: this.model.collection //attachment collection
          }, toolbarItems.inlineActionbar.options, {
            inlineActionBarStyle: 'csui-table-actionbar-bubble'
          })
      );

      // set the action state, without this the css class 'csui-state-undefined' is added to toolbar action bar
      this.tableActionBarView.actionState.set('state', 'full');

      // render the action bar
      this.tableActionBarView.render();
      this.tableActionBarView.triggerMethod("before:show");
      this.tableActionBarView.triggerMethod("show");

      // append to DOM
      var container = this.$el.find('.workitem-attachments-actions');
      container.append(this.tableActionBarView.$el);
      container.addClass('workitem-attachments-actions-full');

      // trigger after:show event
      this.tableActionBarView.triggerMethod("after:show");
      this._updateActionBarAndPrepareKeyboardAccess();
    },

    openShortlink: function () {
      //destroy action bar
      this._destroyActionBar();

      // Trigger the default action execution handler registered in the
      // DefaultActionBehavior; if the action is disabled, it does nothing
      this.triggerMethod('execute:defaultAction', this.model);
    },

    _destroyActionBar: function (args) {
      if (this.tableActionBarView) {
        // remove action bar from DOM
        var actionBarDiv = this.$el;
        actionBarDiv.removeClass('workitem-attachments-actions-full');
        // destroy the view
        this.tableActionBarView.destroy();
        this.tableActionBarView = null;
      }
    },

    onRenameMode: function () {
      //check for the Rename action, it indicates the permission to change the description
      //due to inconsistencies between the load calls for the collection and the model we have to check for Rename and rename action.
      var commandCS = this.model.actions.findWhere({signature: 'Rename'});
      var commandCI = this.model.actions.findWhere({signature: 'rename'});
      if (!_.isUndefined(commandCS) || !_.isUndefined(commandCI) && !this._parent.errorCase) {

        if (!this.ui.attachmentName.hasClass('binf-hidden')) {

          //cancel previous editing fileds
          this.cancelPrevEdit();
          //destroy the bar if it exists
          this._destroyActionBar();

          var fileName = this.model.get("name");
          this.ui.attachmentNameInput.val(fileName);

          this.ui.attachmentName.addClass('binf-hidden');
          this.ui.attachmentErrorMsg.addClass('binf-hidden');
          this.ui.attachmentNameInput.removeClass("binf-hidden");
          this.ui.attachmentItem.addClass('workitem-attachments-actions-display');

          var desc = this.model.get('description');
          this.ui.attachmentDescriptionInput.val(desc);

          if (this.model.get('description')) {
            this.ui.attachmentDescriptionRO.addClass('binf-hidden');
          } else {
            this.ui.attachmentEmptyDescriptionRO.addClass('binf-hidden');
          }
          this.ui.attachmentDescriptionInput.removeClass('binf-hidden');
          this.ui.attachmentNameCancel.removeClass('binf-hidden');
          this.ui.attachmentNameInput.focus();

          var selEnd = (fileName !== undefined && fileName !== '') ? fileName.length : 0;

          // for documents, highlight text till last dot.
          if (fileName.lastIndexOf('.') > 0 && fileName.lastIndexOf('.') < fileName.length - 1) {
            selEnd = fileName.lastIndexOf('.');
          }
          document.getElementById(
              "workitem-attachments-name-input-" + this.model.attributes.id).setSelectionRange(0,
              selEnd);
          // setting editMode to the current editing attachment id
          this._parent.editMode = this.model.get('id');
          this.triggerMethod('editmode:item', this);

        }
      }
    },

    validateFileName: function () {
      var that                 = this,
          validFileName        = true,
          maxLength            = 248,
          maxLengthMsg         = lang.MaxLengthReached,
          fileAlreadyExistsMsg = lang.FileAlreadyExists,
          fileName;
      that._parent.errorCase = false;
      if (that.ui.attachmentName.hasClass('binf-hidden') &&
          that.ui.attachmentDescriptionRO.hasClass('binf-hidden')) {
        fileName = that.ui.attachmentNameInput.val();
        if (fileName.length > maxLength) {
          validFileName = that.setErrorMessage(maxLengthMsg);
        } else {
          that.model.collection.forEach(function (model) {
            if (fileName && fileName !== that.model.get('name') &&
                fileName.toLowerCase() === (model.attributes.name).toLowerCase()) {
              fileAlreadyExistsMsg = _.str.sformat(fileAlreadyExistsMsg, fileName);
              validFileName = that.setErrorMessage(fileAlreadyExistsMsg);
            }
          });
        }
      }
      return validFileName;
    },
    setErrorMessage: function (message) {
      this.$el.find("#workitem-attachments-name-input-" + this.model.attributes.id).addClass(
          "workitem-attachments-error-display");
      this.ui.attachmentItem.addClass('workitem-attachments-edit-error');
      this.ui.attachmentErrorMsg.text(message);
      this.ui.attachmentErrorMsg.attr('title', message);
      if (this.ui.attachmentErrorMsg.hasClass("binf-hidden")) {
        this.ui.attachmentErrorMsg.removeClass("binf-hidden");
      }
      // set the error flag
      this._parent.errorCase = true;
      return false;
    },
    // this method exits the edit mode of attachment item
    cancelPrevEdit: function () {
      var edit, editItem;
      if (this._parent.$el.find(
              '.workitem-attachments-item.workitem-attachments-actions-display').length) {
        edit = 'workitem-attachments-actions-display';
      }
      else if (this._parent.$el.find(
              '.workitem-attachments-item.workitem-attachments-description-edit').length) {
        edit = 'workitem-attachments-description-edit';
      }
      editItem = this._parent.$el.find('.' + edit);

      if (editItem.length) {
        editItem.removeClass(edit);
        editItem.find('.workitem-attachments-description-input').addClass('binf-hidden');
        editItem.find('.edit-cancel').addClass('binf-hidden');
        editItem.find('.workitem-attachment-name').removeClass('binf-hidden');
        editItem.find('.workitem-attachments-name-input').addClass("binf-hidden");
        editItem.find('.workitem-attachments-error-message').addClass("binf-hidden");

        var that                          = this,
            name,
            description,
            attachmentNameEle             = editItem.find('.workitem-attachment-name'),
            attachmentDescriptionEle      = editItem.find(
                'span.workitem-attachments-description-ro'),
            attachmentEmptyDescriptionEle = editItem.find(
                'span.workitem-attachments-empty-description-ro');

        _.each(this._parent.collection.models, function (model) {
          if (model.get('id') === that._parent.editMode) {
            name = model.get('name');
            description = model.get('description');
            if (description) {
              editItem.find('span.workitem-attachments-description-ro').removeClass('binf-hidden');
              attachmentDescriptionEle.text(description);
              attachmentDescriptionEle.attr('title', description);
            } else {
              editItem.find('span.workitem-attachments-empty-description-ro').removeClass(
                  'binf-hidden');
              attachmentEmptyDescriptionEle.text(lang.DescriptionPlaceholder);
              attachmentEmptyDescriptionEle.attr('title', lang.DescriptionPlaceholder);
            }
            attachmentNameEle.text(name);
            attachmentNameEle.attr('title', name);
            // if error case exists in previous edit then it sets false and delete's editMode
            if (that._parent.errorCase === true) {
              that._parent.errorCase = false;
              // unsetting the editmode flag
              delete that._parent.editMode;
              editItem.find("#workitem-attachments-name-input-" + model.attributes.id).removeClass(
                  "workitem-attachments-error-display");
            }
          }
        });
      }
    }
  });

  return WorkItemAttachmentItemView;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.emptyDragAndDrop',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class='work-item-attachments-draganddrop'>"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.dragAndDropEmptyMsg : stack1), depth0))
    + "</div>";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.attachments_impl_workitem.attachments.emptyDragAndDrop', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.emptyDragAndDrop.view',['csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.emptyDragAndDrop',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function (_, Marionette, lang, WorkItemDragAndDropTemplate) {
  
  var EmptyDragAndDropView = Marionette.ItemView.extend({
    template: WorkItemDragAndDropTemplate,
    className: 'workitem-attachments-emptylist',
    templateHelpers: function () {
      return {
        messages: {
          dragAndDropEmptyMsg: lang.EmptyDragAndDropMessage
        }
      };
    },
    constructor: function EmptyDragAndDropView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return EmptyDragAndDropView;
});

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentlist',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-attachments-scrolling\" tabindex=\"-1\">\r\n  <ul class=\"workitem-attachments-itemlist\">\r\n  </ul>\r\n</div>";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.attachments_impl_workitem.attachmentlist', t);
return t;
});
/* END_TEMPLATE */
;
// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentlist.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/node/node.addable.type.collection',
  'csui/utils/log',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'workflow/behaviors/list.keyboard.behavior',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.draganddrop.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.emptyDragAndDrop.view',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentlist',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function (_, Marionette, TabableRegionBehavior, AddableTypeCollection, log,
    PerfectScrollingBehavior, DefaultActionBehavior, ListKeyboardBehavior, DragAndDrop,
    WorkItemAttachmentItemView, WorkItemDragAndDropEmptyView, template) {
  

  // A collection of Attachments to show some details for Attachments
  var WorkItemAttachmentListView = Marionette.CompositeView.extend({

    childViewContainer: '.workitem-attachments-itemlist',

    // defines the child view
    childView: WorkItemAttachmentItemView,

    //defines the empty view
    emptyView: WorkItemDragAndDropEmptyView,

    // sets options for child view
    childViewOptions: function () {
      var options         = this.options,
          originatingView = options.view;
      originatingView.collection = this.collection;
      return {
        defaultActionController: this.defaultActionController,
        context: options.context,
        view: originatingView,
        container: options.container
      };
    },
    // listen to child view events
    childEvents: {
      'editmode:item': 'onEditModeItem'
    },

    events: {
      'keydown': 'onKeyDown'
    },

    // view behaviors
    // - the default action behavior is required for the default action and the action bar.
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior,
        currentlyFocusedElementSelector: '.workitem-attachments-name'
      },
      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.workitem-attachments-scrolling',
        suppressScrollX: true,
        scrollYMarginOffset: 16
      }
    },

    // each form element should have a parent class
    className: 'workflow-attachmentlist-form',
    template: template,
    ui: {
      dragAndDropArea: 'div.workitem-attachments-scrolling'
    },

    constructor: function WorkItemAttachmentListView(options) {
      // apply properties to parent
      this.options = options;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    onShow: function () {
      var mapsList = this.options.view.model.get('mapsList');
      if (!this.options.view.model.get('isDoc') || (mapsList && mapsList.length === 1)) {
        this.setDragNDrop();
      }
    },

    //after adding new items the tabindex has to be refreshed,focus is set to first item LPAD-64451
    onAddChild:function () {
      this.selectedIndex = 0;
      this.trigger('refresh:tabindexes');
    },

    //after removing items the tabindex has to be refreshed,focus is set to first item LPAD-63151
    onRemoveChild:function () {
      this.selectedIndex = 0;
      this.trigger('refresh:tabindexes');
    },

    /**
     * Item switches the edit mode
     * @param view
     */
    onEditModeItem: function (view) {
      // is view in edit mode?
      if (_.isFunction(view.isEditMode) && !view.isEditMode()) {
        //if the edit mode is ended, refresh tabindexes, so that hte focus is set properly
        this.trigger('refresh:tabindexes');
      }
    },
    setDragNDrop: function () {
      // load the addable types for the attachment folder
      this.addableTypes = new AddableTypeCollection(undefined, {node: this.collection.node});
      this.addableTypes.fetch().done(_.bind(function () {
        // create the drag and drop view
        this.dragNDrop = new DragAndDrop({
          container: this.collection.node,
          collection: this.collection,
          context: this.options.context,
          addableTypes: this.addableTypes
        });
        // listen to drag and drop events
        this.listenTo(this.dragNDrop, 'drag:over', this._addDragDropBorder, this);
        this.listenTo(this.dragNDrop, 'drag:leave', this._removeDragDropBorder, this);
        // set the parent view when choosing the drop-active area
        this.dragNDrop.setDragParentView(this, '.workitem-attachments-scrolling');
      }, this));

    },

    _addDragDropBorder: function () {
      this.ui.dragAndDropArea.addClass('drag-over');
    },

    _removeDragDropBorder: function () {
      if (this.ui.dragAndDropArea.hasClass && this.ui.dragAndDropArea.hasClass('drag-over')) {
        this.ui.dragAndDropArea.removeClass('drag-over');
      }
    },
    onDomRefresh: function () {
      //re-rendering children when the domrefresh triggers from metadataview to reflect data changes
      if (this.collection.propertiesAction) {
        Marionette.CollectionView.prototype._renderChildren.call(this);
        this.collection.propertiesAction = false;
      }
    }
  });

  return WorkItemAttachmentListView;

});

csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromDesktop',['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/commands/add',
  'csui/dialogs/file.open/file.open.dialog'
], function (module, require, _, $, AddCommand, FileOpenDialog) {
  
  var AddFromFileSystem = AddCommand.extend({
    _selectFilesForUpload: function (status, options) {
      var deferred       = $.Deferred(),
          fileOpenDialog = new FileOpenDialog({multiple: true});
      fileOpenDialog
          .on('add:files', function (files) {
            csui.require(['csui/controls/fileupload/fileupload'
            ], function (fileUploadHelper) {
              deferred.resolve();
              var uploadController = fileUploadHelper.newUpload(status, options);
              uploadController.addFilesToUpload(files, {
                collection: status.collection
              });
              if (files.length === 1) {
                status.collection.singleFileUpload = true;
              }
            });
          })
          .on('cancel', function () {
            deferred.reject();
          })
          .show();
      return deferred.promise();
    }
  });

  return AddFromFileSystem;

});
csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromCS',['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/log',
  'csui/utils/url',
  'csui/models/command',
  'csui/utils/commandhelper',
  'csui/utils/command.error',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (module, require, _, $, log, Url, CommandModel,
    CommandHelper, CommandError, lang) {
  

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  // Dependencies loaded in the execute method first
  var GlobalMessage, ConflictResolver, TaskQueue,
      ApplyPropertiesSelectorView, UploadFileCollection, PageLeavingBlocker;

  var CopyCommand = CommandModel.extend({

    defaults: {
      signature: "Add",
      name: lang.CommandNameAdd,
      verb: lang.CommandVerbAdd,
      doneVerb: lang.CommandDoneVerbAdd,
      pageLeavingWarning: lang.AddPageLeavingWarning
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      var collection = status.collection;

      status.suppressSuccessMessage = true;
      csui.require(['csui/controls/globalmessage/globalmessage',
        'csui/controls/conflict.resolver/conflict.resolver',
        'csui/utils/taskqueue',
        'csui/dialogs/node.picker/impl/header/apply.properties.selector/apply.properties.selector.view',
        'csui/models/fileuploads',
        'csui/utils/page.leaving.blocker'
      ], function () {
        GlobalMessage = arguments[0];
        ConflictResolver = arguments[1];
        TaskQueue = arguments[2];
        ApplyPropertiesSelectorView = arguments[3];
        UploadFileCollection = arguments[4];
        PageLeavingBlocker = arguments[5];

        self._selectCopyOptions(status)
            .done(function (selectedOptions) {
              var selectedNodes = selectedOptions.nodes;
              //Workflow attachment folder
              var targetFolder = collection.node;
              var applyProperties = selectedOptions.applyProperties;

              // note: for workflow attachments it is always a copy into the current container
              var copyToCurrentFolder = true;

              //start blocking view
              self._announceOperationStart(status.originatingView);

              var namesToResolve = _.map(selectedNodes, function (node) {
                var returnObj = {
                  id: node.get('id'),
                  name: node.get('name'),
                  container: node.get('container'),
                  mime_type: node.get('mime_type'),
                  original_id: node.get('original_id'),
                  original: node.original,
                  type: node.get('type'),
                  size: node.get('size'),
                  type_name: node.get('type_name'),
                  state: 'pending',
                  count: 0,
                  total: 1,
                  enableCancel: false
                };
                if (node.get('type') === (144 || 749 || 30309)) {
                  returnObj.size_formatted = node.get('size_formatted');
                }
                return returnObj;
              });
              var copyNamesToResolve = _.map(namesToResolve, function (name) {
                return _.clone(name);
              });
              self._resolveNamingConflicts(targetFolder, copyNamesToResolve)
                  .done(function (copyInstructions) {

                    _.each(copyInstructions, function (instruction) {
                      if (instruction.id === undefined) {
                        instruction.id = _.findWhere(namesToResolve,
                            {name: instruction.name}).id;
                      }
                    });

                    self._metadataHandling(copyInstructions,
                        _.extend(selectedOptions, {context: context, targetFolder: targetFolder}))
                        .done(function () {
                          var uploadCollection = new UploadFileCollection(copyInstructions);

                          var connector = collection.connector;

                          self._copySelectedNodes(uploadCollection, connector,
                              targetFolder, applyProperties, copyToCurrentFolder,
                              status.collection)
                              .done(function () {
                                GlobalMessage.hideFileUploadProgress();
                                var msg = (copyInstructions.length === 1) ?
                                          lang.MessageItemCopied : lang.MessageItemsCopied;
                                msg = _.str.sformat(msg, copyInstructions.length);
                                GlobalMessage.showMessage('success', msg);
                                deferred.resolve();
                              })
                              .always(function () {
                                self._announceOperationEnd(status.originatingView,
                                    copyToCurrentFolder);
                              })
                              .fail(function (/*copyResults*/) {
                                deferred.reject();
                              });

                        })
                        .fail(function (error) {
                          self._announceOperationEnd(status.originatingView, copyToCurrentFolder);
                          deferred.reject(error);
                        });

                  })
                  .fail(function (error) {
                    self._announceOperationEnd(status.originatingView, copyToCurrentFolder);
                    deferred.reject(error);
                  });
            });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _announceOperationStart: function (view) {
      var collectionView = view.resultsView || view.tableView;
      if (collectionView) {
        collectionView.blockActions();
      }
      PageLeavingBlocker.enable(this.get('pageLeavingWarning'));
    },

    _announceOperationEnd: function (view, copyToCurrentFolder) {
      PageLeavingBlocker.disable();
      var collectionView = view.resultsView || view.tableView;
      if (collectionView) {
        if (copyToCurrentFolder) {
          collectionView.collection.fetch();
        }
        collectionView.unblockActions();
      }
    },

    _selectCopyOptions: function (status) {
      var self = this;
      var deferred = $.Deferred();

      csui.require(['csui/dialogs/node.picker/node.picker'],
          function (NodePicker) {
            var pickerOptions = _.extend({
              selectableTypes: status.validTypes,
              showAllTypes: true,
              dialogTitle: lang.AddDocumentLabel,
              selectButtonLabel: lang.ButtonLabelAdd,
              initialContainer: status.container,
              startLocation: 'enterprise.volume',
              propertiesSeletor: true,
              globalSearch: true,
              startLocations: ['enterprise.volume', 'current.location', 'personal.volume',
                'favorites', 'recent.containers']
            }, status);

            self.nodePicker = new NodePicker(pickerOptions);

            self.nodePicker
                .show()
                .done(function () {
                  deferred.resolve.apply(deferred, arguments);
                })
                .fail(function () {
                  deferred.reject.apply(deferred, arguments);
                });
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    },

    _resolveNamingConflicts: function (targetFolder, nodeNames) {
      var h1 = (nodeNames.length === 1) ? lang.CopyingNode : lang.CopyingNodes;
      var conflictResolver = new ConflictResolver({
        h1Label: _.str.sformat(h1, nodeNames.length),
        actionBtnLabel: 'Add',
        excludeAddVersion: true,
        container: targetFolder,
        files: nodeNames
      });
      return conflictResolver.run();
    },

    _metadataHandling: function (items, options) {
      var deferred = $.Deferred();

      csui.require(['csui/widgets/metadata/metadata.copy.move.items.controller'
      ], function (MetadataCopyMoveItemsController) {
        var openMetadata = options.openSelectedProperties;
        var applyProperties = options.applyProperties;
        var metadataController = new MetadataCopyMoveItemsController();
        var controllerFunction;

        // open the metadata view
        if (openMetadata) {
          controllerFunction = metadataController.CopyMoveItemsWithMetadata;
        } else if (applyProperties === ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES ||
                   applyProperties === ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES) {
          // check for required metadata
          controllerFunction = metadataController.CopyMoveItemsRequiredMetadata;
        } else {
          return deferred.resolve();
        }

        if (applyProperties === ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES) {
          options.inheritance = 'original';
        } else if (applyProperties === ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES) {
          options.inheritance = 'destination';
        } else if (applyProperties === ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES) {
          options.inheritance = 'merged';
        }

        options.action = 'copy';
        controllerFunction.call(metadataController, items, options)
            .done(function () {
              deferred.resolve();
            })
            .fail(function (error) {
              deferred.reject(error);
            });

      }, function (error) {
        log.warn('Failed to load MetadataCopyMoveItemsController. {0}', error);
        deferred.reject(error);
      });

      return deferred.promise();
    },

    _copySelectedNodes: function (uploadCollection, connector, targetFolder, applyProperties,
        copyToCurrentFolder, targetCollection) {
      var self     = this,
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          promises = _.map(uploadCollection.models, function (model) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                var attributes = model.attributes,
                    targetId   = targetFolder.get('id');

                self._getCategories(attributes, connector, targetId, applyProperties)
                    .done(function (categories) {
                      self._copyNode(categories, attributes, connector, targetId, model.node)
                          .done(function () {
                            model.set('count', 1);
                            model.deferred.resolve(model);
                            copyToCurrentFolder &&
                            self._addToCurrentTable(model.node, targetCollection, uploadCollection);
                            deferred.resolve(attributes);
                          })
                          .fail(function (cause) {
                            model.deferred.reject(model, new CommandError(cause));
                            deferred.reject();
                          });
                    })
                    .fail(function (cause) {
                      model.deferred.reject(model, new CommandError(cause));
                      deferred.reject();
                    });
                return deferred.promise();
              }
            });
            return deferred.promise();
          });
      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.AddingOneFile,
        oneFileSuccess: lang.AddOneFileSucceeded,
        multiFileSuccess: lang.AddFilesSucceeded,
        oneFilePending: lang.AddingOneFile,
        multiFilePending: lang.AddFiles,
        oneFileFailure: lang.AddFilesOneFailed,
        multiFileFailure: lang.AddFilesFailed,
        oneFailure: lang.AddFilesOneFailed,
        enableCancel: false
      });

      return $.whenAll.apply($, promises);
    },

    _addToCurrentTable: function (node, targetCollection, uploadCollection) {

      node.isLocallyCreated = true;
      if (uploadCollection.length === 1) {
        targetCollection.singleFileUpload = true;
      }
      CommandHelper
          .refreshModelAttributesFromServer(node, targetCollection)
          .done(function () {
            // clear the original property, otherwise a shortcut icon is shown
            if (node.original) {
              node.attributes.original_id = 0;
              node.original = undefined;
            }
            targetCollection.unshift(node);
          });

    },

    _copyNode: function (categories, instruction, connector, targetFolderID, node) {

      var nodeAttr = {
        "original_id": instruction.id,
        "parent_id": targetFolderID,
        "name": instruction.newName ? instruction.newName : instruction.name,
        "roles": categories
      };
      // FileUploadModel should be created with a container or connector
      // to make its node cloneable.  But if not needed, use the default
      // container of the upload controller to provide the connector.
      if (!node.connector) {
        connector.assignTo(node);
      }

      return node.save(nodeAttr, {
        data: nodeAttr,
        url: connector.connection.url + '/nodes'
      });
    },

    _getCategories: function (attributes, connector, targetFolderID, applyProperties) {
      var deferred = $.Deferred();
      if (attributes.extended_data && attributes.extended_data.roles) {
        deferred.resolve(attributes.extended_data.roles);
      }
      else {
        var getCategoriesOptions = connector.extendAjaxOptions({
          url: connector.connection.url + '/forms/nodes/copy',
          method: 'get',
          data: {
            id: attributes.id,
            parent_id: targetFolderID
          }
        });

        $.ajax(getCategoriesOptions)
            .then(function (response/*, statusText, jqxhr*/) {
              var data = response.forms[1].data;
              var categoryGroupMapping;
              categoryGroupMapping = {};
              categoryGroupMapping[ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES] = 'original';
              categoryGroupMapping[ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES] = 'destination';
              categoryGroupMapping[ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES] = 'merged';
              var categories = data[categoryGroupMapping[applyProperties]];
              deferred.resolve({"categories": categories});
            })
            .fail(function (error) {
              deferred.reject(error);
            });
      }
      return deferred.promise();
    }

  });

  return CopyCommand;

});

csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addShortcut',['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/models/command',
  'csui/utils/commandhelper',
  'csui/utils/command.error',
  'csui/models/node/node.model',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (module, require, _, $, CommandModel,
    CommandHelper, CommandError, NodeModel, lang) {
  

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  // Dependencies loaded in the execute method first
  var GlobalMessage, ConflictResolver, TaskQueue,
      ApplyPropertiesSelectorView, UploadFileCollection, PageLeavingBlocker;

  var AddCommand = CommandModel.extend({

    defaults: {
      signature: "Add",
      name: lang.CommandNameAdd,
      verb: lang.CommandVerbAdd,
      doneVerb: lang.CommandDoneVerbAdd,
      pageLeavingWarning: lang.AddPageLeavingWarning
    },

    execute: function (status, options) {
      this.options = options;
      var self = this;
      var deferred = $.Deferred();
      var collection = status.collection;

      status.suppressSuccessMessage = true;
      csui.require(['csui/controls/globalmessage/globalmessage',
        'csui/controls/conflict.resolver/conflict.resolver',
        'csui/utils/taskqueue',
        'csui/dialogs/node.picker/impl/header/apply.properties.selector/apply.properties.selector.view',
        'csui/models/fileuploads',
        'csui/utils/page.leaving.blocker'
      ], function () {
        GlobalMessage = arguments[0];
        ConflictResolver = arguments[1];
        TaskQueue = arguments[2];
        ApplyPropertiesSelectorView = arguments[3];
        UploadFileCollection = arguments[4];
        PageLeavingBlocker = arguments[5];

        self._selectShortCutCreateOptions(status)
            .done(function (selectedOptions) {
              var selectedNodes = selectedOptions.nodes;
              //Workflow attachment folder
              var targetFolder = collection.node;
              var applyProperties = selectedOptions.applyProperties;

              //  create workflow attachments into the current container
              var createToCurrentFolder = true;

              //start blocking view
              self._announceOperationStart(status.originatingView);

              var namesToResolve = _.map(selectedNodes, function (node) {
                var returnObj = {
                  id: node.get('id'),
                  name: node.get('name'),
                  container: node.get('container'),
                  mime_type: node.get('mime_type'),
                  original_id: node.get('original_id'),
                  original_id_expand: node.get('original_id_expand'),
                  type: node.get('type'),
                  size: node.get('size'),
                  type_name: node.get('type_name'),
                  state: 'pending',
                  count: 0,
                  total: 1,
                  enableCancel: false
                };
                return returnObj;
              });
              var createNamesToResolve = _.map(namesToResolve, function (name) {
                return _.clone(name);
              });
              self._resolveNamingConflicts(targetFolder, createNamesToResolve)
                  .done(function (createInstructions) {

                    _.each(createInstructions, function (instruction) {

                      //re-assign shortcut-subtype(1) type as ConflictResolver always returning
                      // document-subtype(144) based on the file extension.
                      instruction.type = _.findWhere(namesToResolve,
                          {name: instruction.name}).type;

                    });

                    var uploadCollection = new UploadFileCollection(createInstructions);
                    var connector = collection.connector;

                    self._createSelectedNodes(uploadCollection, connector,
                        targetFolder, applyProperties, createToCurrentFolder,
                        status.collection)
                        .done(function () {
                          GlobalMessage.hideFileUploadProgress();
                          var msg = (createInstructions.length === 1) ?
                                    lang.MessageItemAdded : lang.MessageItemsAdded;
                          msg = _.str.sformat(msg, createInstructions.length);
                          GlobalMessage.showMessage('success', msg);
                          deferred.resolve();
                        })
                        .always(function () {
                          self._announceOperationEnd(status.originatingView,
                              createToCurrentFolder);
                        })
                        .fail(function () {
                          deferred.reject();
                        });

                  })
                  .fail(function (error) {
                    self._announceOperationEnd(status.originatingView, createToCurrentFolder);
                    deferred.reject(error);
                  });
            });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _announceOperationStart: function (view) {
      var collectionView = view.resultsView || view.tableView;
      if (collectionView) {
        collectionView.blockActions();
      }
      PageLeavingBlocker.enable(this.get('pageLeavingWarning'));
    },

    _announceOperationEnd: function (view, createToCurrentFolder) {
      PageLeavingBlocker.disable();
      var collectionView = view.resultsView || view.tableView;
      if (collectionView) {
        if (createToCurrentFolder) {
          collectionView.collection.fetch();
        }
        collectionView.unblockActions();
      }
    },

    _selectShortCutCreateOptions: function (status) {
      var self = this;
      var deferred = $.Deferred();

      csui.require(['csui/dialogs/node.picker/node.picker'],
          function (NodePicker) {
            var pickerOptions = _.extend({
              showAllTypes: true,
              dialogTitle: lang.AddDocumentLabel,
              selectButtonLabel: lang.ButtonLabelAdd,
              initialContainer: status.container,
              startLocation: 'enterprise.volume',
              propertiesSeletor: true,
              globalSearch: true,
              startLocations: ['enterprise.volume', 'current.location', 'personal.volume',
                'favorites', 'recent.containers']
            }, status);

            self.nodePicker = new NodePicker(pickerOptions);

            self.nodePicker
                .show()
                .then(function (args) {
                  var nodes = [];
                  _.each(args.nodes, function (node) {
                    var newNode = new NodeModel({
                      "type": self.options.type,
                      "icon": node.get('icon'),
                      "type_name": self.options.type_name,
                      "container": false,
                      "name": node.get('name'),
                      "original_id": node.get('id'),
                      // Show the right icon for this not-yet-saved node
                      "original_id_expand": node.attributes
                    }, {connector: status.container.connector});
                    nodes.push(newNode);
                  });
                  args.nodes = nodes;
                  return args;
                })
                .done(function () {
                  deferred.resolve.apply(deferred, arguments);
                })
                .fail(function () {
                  deferred.reject.apply(deferred, arguments);
                });
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    },

    _resolveNamingConflicts: function (targetFolder, nodeNames) {
      var h1 = (nodeNames.length === 1) ? lang.AddingNode : lang.AddingNodes;
      var conflictResolver = new ConflictResolver({
        h1Label: _.str.sformat(h1, nodeNames.length),
        actionBtnLabel: 'Add',
        excludeAddVersion: true,
        container: targetFolder,
        files: nodeNames
      });
      return conflictResolver.run();
    },

    _createSelectedNodes: function (uploadCollection, connector, targetFolder, applyProperties,
        createToCurrentFolder, targetCollection) {
      var self     = this,
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          promises = _.map(uploadCollection.models, function (model) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                var attributes = model.attributes,
                    targetId   = targetFolder.get('id');
                self._getCategories(attributes, connector, targetId, applyProperties)
                    .done(function (categories) {
                      self._createNode(categories, attributes, connector, targetId, model.node)
                          .done(function () {
                            model.set('count', 1);
                            model.deferred.resolve(model);
                            createToCurrentFolder &&
                            self._addToCurrentTable(model.node, targetCollection, uploadCollection);
                            deferred.resolve(attributes);
                          })
                          .fail(function (cause) {
                            model.deferred.reject(model, new CommandError(cause));
                            deferred.reject();
                          });
                    })
                    .fail(function (cause) {
                      model.deferred.reject(model, new CommandError(cause));
                      deferred.reject();
                    });
                return deferred.promise();
              }
            });
            return deferred.promise();
          });
      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.AddingOneFile,
        oneFileSuccess: lang.AddOneFileSucceeded,
        multiFileSuccess: lang.AddFilesSucceeded,
        oneFilePending: lang.AddingOneFile,
        multiFilePending: lang.AddFiles,
        oneFileFailure: lang.AddFilesOneFailed,
        multiFileFailure: lang.AddFilesFailed,
        oneFailure: lang.AddFilesOneFailed,
        enableCancel: false
      });

      return $.whenAll.apply($, promises);
    },

    _addToCurrentTable: function (node, targetCollection, uploadCollection) {

      node.isLocallyCreated = true;
      if (uploadCollection.length === 1) {
        targetCollection.singleFileUpload = true;
      }
      CommandHelper
          .refreshModelAttributesFromServer(node, targetCollection)
          .done(function () {
            targetCollection.unshift(node);
          });

    },

    _createNode: function (categories, instruction, connector, targetFolderID, node) {

      var nodeAttr = {
        "original_id": instruction.original_id,
        "parent_id": targetFolderID,
        "name": instruction.newName ? instruction.newName : instruction.name,
        "roles": categories,
        "action": 'create',
        "type": instruction.type,
        "original_id_expand": instruction.original_id_expand
      };
      // FileUploadModel should be created with a container or connector
      // to make its node cloneable.  But if not needed, use the default
      // container of the upload controller to provide the connector.
      if (!node.connector) {
        connector.assignTo(node);
      }

      return node.save(nodeAttr, {
        data: nodeAttr,
        url: connector.connection.url + '/nodes'
      });
    },

    _getCategories: function (attributes, connector, targetFolderID, applyProperties) {
      var deferred = $.Deferred();
      if (attributes.extended_data && attributes.extended_data.roles) {
        deferred.resolve(attributes.extended_data.roles);
      }
      else {
        var getCategoriesOptions = connector.extendAjaxOptions({
          url: connector.connection.url + '/forms/nodes/create',
          method: 'get',
          data: {
            type: attributes.type,
            parent_id: targetFolderID
          }
        });

        $.ajax(getCategoriesOptions)
            .then(function (response) {
              var data = response.forms[0].data;
              var categoryGroupMapping;
              categoryGroupMapping = {};
              categoryGroupMapping[ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES] = 'original';
              categoryGroupMapping[ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES] = 'destination';
              categoryGroupMapping[ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES] = 'merged';
              var categories = data[categoryGroupMapping[applyProperties]];
              deferred.resolve({"categories": categories});
            })
            .fail(function (error) {
              deferred.reject(error);
            });
      }
      return deferred.promise();
    }

  });

  return AddCommand;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmenttoolbar',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-attachment-toolbar-view tile-nav\">\r\n  <div class=\"workitem-attachment-toolbar-add\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.attachments_impl_workitem.attachmenttoolbar', t);
return t;
});
/* END_TEMPLATE */
;
// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmenttoolbar.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/globalmessage/globalmessage',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/toolbar/toolbar.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.toolbaritems',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromDesktop',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromCS',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addShortcut',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmenttoolbar',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function ($, _, Marionette, log, GlobalMessage, TabableRegionBehavior,
    LayoutViewEventsPropagationMixin, ToolbarView, toolbarItems, AddFromFileSysCommand,
    AddFromContentServerCommand, AddShortCutServerCommand, template, lang) {
  

  var WorkItemAttachmentsToolbarView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      addToolbarRegion: '.workitem-attachment-toolbar-add' // add toolbar
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    toolbarItemSelector: 'a.' + TabableRegionBehavior.accessibilityFocusableClass,

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {

      var toolbarElements = this.$(this.toolbarItemSelector);
      //Since jquery returns an init object for $(undefined), a check is made first to
      //see if there are any toolbar elements.
      var elementOfFocus = toolbarElements.length ?
                           $(toolbarElements[this.accNthToolbarItemFocused]) : null;
      return elementOfFocus;
    },

    constructor: function WorkItemAttachmentsToolbarView(options) {
      options || (options = {});

      this.context = options.context;
      this.toolbarCollection = options.toolbarCollection;
      this.originatingView = options.originatingView;
      this.addableTypes = options.addableTypes;
      this.container = options.container;
      this.attachmentCollection = options.attachmentCollection;
      this.accNthToolbarItemFocused = 0;

      Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
    },

    initialize: function () {

      // create the toolbar with the necessary menu entries
      this.toolbarView = new ToolbarView({
        collection: this.toolbarCollection,
        maxItemsShown: 0,
        dropDownText: lang.AddToolbarItemLabel,
        dropDownIcon: 'icon icon-toolbarAdd'
      });

      //create the command objects
      this.addFromCSCommand = new AddFromContentServerCommand();
      this.addFromFileSysCommand = new AddFromFileSysCommand();
      this.addShortCutCommand = new AddShortCutServerCommand();

      // listen to the toolbar action
      this.listenTo(this.toolbarView, 'childview:toolitem:action', this._toolbarItemClicked);

      // Cause the show events triggered on the parent view re-triggered
      // on the views placed in the inner regions
      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.addToolbarRegion.show(this.toolbarView);
    },

    _closeMenu: function (event, prevent) {
      var dropDownEl = this.$el.find('li.binf-dropdown.binf-open');
      if (dropDownEl.length > 0) {
        var dropDownToggel = this.$el.find('li.binf-dropdown.binf-open > a');
        //remove the open classes, so that the menu closes
        dropDownEl.removeClass('binf-open');
        dropDownToggel.attr('aria-expanded', 'false');
        if (prevent) {
          //prevent the default event, so that the dialog doesn't close
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },

    /**
     * Check for the ESC (27) and TAB (9) key.
     * Both should close the menu and ESC should not close the dialog in the case the menu is open.
     * @param event
     */
    onKeyInView: function (event) {
      switch (event.keyCode) {
        /* currently we have only one toolbar item, no need for the other key codes from tabeltoolbar view*/
      case 27:
        // ESC key > close menu
        this._closeMenu(event, true);
        break;
      case 9:
        // Tab key > close menu
        this._closeMenu(event, false);
        break;
      }
    },

    /**
     * Toolbar action event
     * @param event Event information, e.g. the model of the toolbar item
     * @private
     */
    _toolbarItemClicked: function (event) {

      switch (event.model.get('id')) {
      case 'copy':
        // call the add from ContentServer command
        var validTypes = this.addableTypes.map(function (model) {
          return model.get('type');
        });
        this.addFromCSCommand.execute({
          originatingView: this.originatingView,
          context: this.context,
          container: this.container,
          collection: this.attachmentCollection,
          validTypes: validTypes
        });
        break;
      case 'filesystem':
        // call the add from FileSystem command
        var status = {
          originatingView: this.originatingView,
          context: this.context,
          container: this.container,
          collection: this.attachmentCollection,
          data: this.addableTypes
        };
        var fileSysOptions = {
          context: this.context,
          addableType: event.model.get('type'),
          addableTypeName: event.model.get('name')
        };
        this.addFromFileSysCommand.execute(status, fileSysOptions);
        break;
      case 'shortcut':
        // call the add shortcut command
        this.addShortCutCommand.execute({
          originatingView: this.originatingView,
          context: this.context,
          container: this.container,
          collection: this.attachmentCollection
        }, {
          type: 1, //shortcut subtype
          type_name: 'shortcut'
        });
        break;
      default:
        // FixMe: wraning should be removed in production
        GlobalMessage.showMessage("warning", "not implemented");
      }
    }

  });

  _.extend(WorkItemAttachmentsToolbarView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemAttachmentsToolbarView;
});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-attachment-toolbar\"></div>\r\n<div class=\"workitem-attachment-list\"></div>";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.attachments_impl_workitem.attachments', t);
return t;
});
/* END_TEMPLATE */
;
// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.attachments/workitem.attachments.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/utils/log',
  'csui/models/nodechildren',
  'csui/models/node/node.addable.type.collection',
  'csui/controls/progressblocker/blocker',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/toolbar/toolitem.model',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentlist.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmenttoolbar.view',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function (_, Marionette, Backbone, $, ModalAlert, log, NodeChildrenCollection,
    AddableTypeCollection,
    BlockingView, GlobalMessage, LayoutViewEventsPropagationMixin,
    TabableRegionBehavior, ToolbarModel, WorkItemAttachmentList, WorkItemAttachmentToolbar,
    template, lang) {
  

  var WorkItemAttachmentsView = Marionette.LayoutView.extend({

    className: 'workitem-attachments',

    template: template,

    regions: {
      toolbar: '.workitem-attachment-toolbar',
      list: '.workitem-attachment-list'
    },

    constructor: function WorkItemAttachmentsView(options) {
      options || (options = {});

      this.context = options.context;

      // apply properties to parent
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    _prepareAttachmentActions: function () {

      // initialize deferred object to return
      var deferred = $.Deferred();

      // initialize toolbar collection
      this.toolbarCollection = new Backbone.Collection();

      // load the addable types for the attachment folder
      this.addableTypes = new AddableTypeCollection(undefined, {node: this.model});
      this.addableTypes.fetch().done(_.bind(function () {
        var shortcut, others, fileDoc;
        this.addableTypes.forEach(function (type) {
          switch (type.get('type')) {
          case 1:
            //shortcut
            shortcut = new ToolbarModel({
              name: lang.AddShortcutLabel,
              id: 'shortcut'
            });
            break;
          case 144:
            //document
            fileDoc = new ToolbarModel({
              name: lang.AddFromDesktopLabel,
              id: 'filesystem',
              type: type.get('type')
            });
            break;
          default:
            //other types
            if (!others) {
              others = new ToolbarModel({name: lang.AddFromContentServerLabel, id: 'copy'});
            }
          }
        });

        // fill only the set toolbar actions into the collection (order is important!)
        if (fileDoc) {
          this.toolbarCollection.add(fileDoc);
        }
        if (others) {
          this.toolbarCollection.add(others);
        }
        if (shortcut) {
          this.toolbarCollection.add(shortcut);
        }
      }, this)).always(function(){
        // resolve the promise
        deferred.resolve();
      });

      // return deferred promise
      return deferred.promise();
    },

    initialize: function () {

      // initialize blocking view & block actions until finished with all the loading.
      // unblocking is done in success, error callbacks
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
      this.blockActions();

      // prepare the toolbar actions based on the addable node types
      var mapsList = this.options.view.model.get('mapsList');
      var isDoc = this.options.view.model.get('isDoc');
      if (isDoc !== true || (mapsList && mapsList.length === 1)) {

        // prepare attachment actions and wait until finished
        var promise = this._prepareAttachmentActions();
        promise.done(_.bind(function () {

          // load the children from the attachment folder
          this.attachmentCollection = new NodeChildrenCollection(undefined, {
            node: this.model,
            includeActions: false,
            delayRestCommands: true, // For getting all the actions to show metadata view
            expand: ['node'],
            commands: ['openshortlink', 'download', 'properties', "rename", "delete",
              "default", "addcategory", "open", "edit"]
          });

          // create and show the toolbar with the appropriate items or hide it completely
          this.toolbarView = new WorkItemAttachmentToolbar({
            context: this.context,
            originatingView: this,
            toolbarCollection: this.toolbarCollection,
            addableTypes: this.addableTypes,
            container: this.model,
            attachmentCollection: this.attachmentCollection
          });
          this.toolbar.show(this.toolbarView);

          // hide the toolbar if empty
          if (this.toolbarCollection.length <= 0) {
            this.toolbar.$el.addClass('binf-hidden');
          }

          var docModels = this.options.view.model.get("docModels");
          if (docModels) {
            //adding document(s) to the attachmentcollection if the workflow is triggered from a
            // document
            var checkNodes     = [],
                loadedDocCount = 0,
                that           = this,
                errorDocs      = [];
            _.each(docModels, function (docModel) {
              var docAttributes = docModel.attributes,
                  nodeAttr      = {
                    "original_id": docAttributes.original_id,
                    "parent_id": that.model.get("id"),
                    "name": docAttributes.newName ? docAttributes.newName : docAttributes.name,
                    "action": 'create',
                    "type": docAttributes.type,
                    "original_id_expand": docAttributes.original_id_expand
                  },
                  tmpCheckNode  = {
                    "name": nodeAttr.name,
                    "promise": docModel.save(nodeAttr, {
                      data: nodeAttr,
                      url: that.model.connector.connection.url + '/nodes'
                    })
                  };
              checkNodes.push(tmpCheckNode);
            });
            _.each(checkNodes, function (checkNode) {
              checkNode.promise.fail(_.bind(function (error) {
                    errorDocs.push(' ' + checkNode.name);
                  }, that))
                  .always(_.bind(function (resp) {
                    if (loadedDocCount === docModels.length - 1) {
                      if (errorDocs.length === 0) {
                        that.showAttachments();
                      } else {
                        this.unblockActions();
                        var title     = lang.AttachmentsFailMessageTitle
                            , message = _.str.sformat(lang.AttachmentsFailMessage, errorDocs)
                            , promise = ModalAlert.showError(message, title);
                        promise.always(function () {
                          that.options.view.parentView._navigateToDocParentNode();
                        });
                      }
                    }
                    loadedDocCount++;
                  }, that));

            });
          } else {
            this.showAttachments();
          }

          if (!this.options.view.model.get("isDraft")) {
            $('<input>').attr({
              type: 'hidden',
              id: 'attachmentFolderId',
              name: 'attachmentFolderId',
              value: this.model.get("id")
            }).appendTo('.workitem-view');
          }

          // create the attachment list view
          this.attachments = new WorkItemAttachmentList({
            context: this.context,
            container: this.model,
            collection: this.attachmentCollection,
            view: this.options.view
          });

          // Cause the show events triggered on the parent view re-triggered
          // on the views placed in the inner regions
          this.propagateEventsToRegions();
        }, this));

      } else {

        var docModels = this.options.view.model.get("docModels");
        if (docModels) {
          this.attachmentCollection = new NodeChildrenCollection(docModels, {});
          this.attachments = new WorkItemAttachmentList({
            context: this.context,
            collection: this.attachmentCollection,
            view: this.options.view
          });
          this.attachments.render();
        }
      }
    },

    showAttachments: function () {
      this.attachmentCollection.fetch()
          .done(_.bind(function () {
            if (this.attachmentCollection.length > 0) {
              this.attachmentCollection.delayedActions.fetch()
                  .done(_.bind(function () {
                    // show the attachment list when the collection is loaded
                    this.list.show(this.attachments);
                  }, this));
            } else if (this.toolbarCollection.length > 0) {
              // Show drag and drop message only if user has permission to add attachment
              this.list.show(this.attachments);
            }
          }, this))
          .fail(_.bind(function () {
            //show error message
            GlobalMessage.showMessage('error', lang.ErrorMessageLoadAttachments);
          }, this))
          .always(_.bind(function () {
            // unblock actions
            this.unblockActions();
          }, this));
    }
  });

  _.extend(WorkItemAttachmentsView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemAttachmentsView;

});

// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.attachments/workitem.attachments.controller',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/log',
  'csui/utils/contexts/factories/node',
  'workflow/utils/workitem.extension.controller',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.view',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
], function (_, $, log, NodeModelFactory, WorkItemExtensionController, WorkItemAttachmentsView, lang) {
  

  /**
   * Workitem integration controller
   * @param options Initialization options like context, data, parent view
   * @constructor
   */
  var WorkItemAttachmentsController = WorkItemExtensionController.extend({

    // Type of the attachment package
    type: 1,
    // Sub type of the attachment package
    sub_type: 1,
    //This defines the tab order
    position: 1,

    constructor: function WorkItemAttachmentsController(attributes, options) {
      WorkItemExtensionController.prototype.constructor.apply(this, arguments);

      options || (options = {});

      this.context = attributes.context;
    },

    /**
     * Validates the data package
     * @param type
     * @param sub_type
     * @returns {boolean}
     */
    validate: function (type, sub_type) {
      if (type === this.type && sub_type === this.sub_type) {
        //attachment data package
        return true;
      }
      // other data packages
      return false;
    },

    // Execute the controller action
    // In this case load the attachments folder model
    // and when it is loaded create and initialize the attachment view
    // the view is sent as viewToShow property to the done method of the promise.
    // The promise is resolved when the view is created.
    execute: function (options) {

      var extensionPoint = options.extensionPoint;
      var data = options.data;
      var parentView = options.parentView;

      // Deferred object to control the model loading
      var deferred = $.Deferred();

      // Check the current requested extension point
      if (extensionPoint === WorkItemExtensionController.ExtensionPoints.AddSidebar) {

        // load the node model for the attachment folder
        var model = this.context.getModel(NodeModelFactory,
            {attributes: {id: data.attachment_folder_id}});

        model.fetch()
            .done(_.bind(function (args) {
              //this is the model necessary for the tabPanel it must contain a title,
              // viewToRender and viewToRenderOptions and a position which defins the order of
              // the tabs

              args.title = lang.TabTitle;
              args.position = this.position;
              args.viewToRender = WorkItemAttachmentsView;
              args.viewToRenderOptions = {context: this.context, model: model, view: parentView};
              //loading successful, resolve the promise
              deferred.resolve(args);
            }, this))
            .fail(_.bind(function (args) {
              //loading failed, set the error message and reject the promise
              args.errorMsg = lang.ErrorMessageLoadAttachments;
              deferred.reject(args);
            }, this));

        // return a promise
        return deferred.promise();
      } else {
        // this extension point is not supported from this integration, don't return a view
        deferred.resolve({});
        return deferred.promise();
      }
    }

  });

  return WorkItemAttachmentsController;
});

csui.define('workflow/controls/userpicker/userpicker.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/userpicker/userpicker.view'
], function (_, $, Marionette, TabableRegionBehavior, UserPickerView) {
  

  // extend the Core UI User-Picker to add keyboard navigation
  // capabilities.
  var TabableUserPickerView = UserPickerView.extend({

    events: {
      'keydown @ui.searchbox': 'onKeyDown',
      'change @ui.searchbox': 'onChange'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function TabableUserPickerView(options) {
      // pass options to the parent constructor
      UserPickerView.prototype.constructor.call(this, options);
      // listen to the userpicker item:change event.
      this.listenTo(this, 'item:change', this.onItemChanged);
    },

    // searchbox is the focused element
    currentlyFocusedElement: function () {
      return $(this.ui.searchbox);
    },

    // on TAB we select the currently selected item
    onKeyDown: function (e) {
      // TAB
      if (e.keyCode === 9) {
        var elem = this.$el.find('li.binf-active');
        if (elem.is(':visible')) {
          // select the currently focused element
          elem.click();
        }
      }
    },

    // whenever the searchbox is changed, we trigger 'item:remove'.
    onChange: function (e) {
      var name = this.model ? this.model.get('name_formatted') : '';
      if (name !== this.ui.searchbox.val()) {
        // clear the text
        this.ui.searchbox.val('');
        // clear the model
        this.model = undefined;
        this.triggerMethod('item:remove');
      }
    },

    onItemChanged: function (e) {
      // refresh model
      this.model = e.item;
    }
  });

  // return
  return TabableUserPickerView;

});

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/action/action.body/impl/action.body',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "  <!-- Authenticate Area -->\r\n  <div class=\"workitem-action-authenticate\">\r\n    <!--Here renders the authentication control-->\r\n  </div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\"workitem-action-assignee-selector\">\r\n    <div class=\"workitem-action-assignee\">\r\n      <div class=\"assignee-label\">\r\n        <span class=\"binf-glyphicon binf-glyphicon-star\"></span>\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.assigneePickerLabel || (depth0 != null ? depth0.assigneePickerLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"assigneePickerLabel","hash":{}}) : helper)))
    + "\r\n      </div>\r\n      <div class=\"assignee-picker\">\r\n        <!-- Here renders the assignee user picker -->\r\n      </div>\r\n    </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showAssigneeOptionsSelector : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <div class=\"workitem-action-assignee-options\">\r\n        <div class=\"assignee-label\">\r\n          "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.assigneeOptionLabel : stack1), depth0))
    + "\r\n        </div>\r\n        <div class=\"assignee-options\">\r\n          <!-- Here render the assignee type selector -->\r\n        </div>\r\n      </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showAssigneeReadOnly : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"workitem-action-assignee-label\">\r\n      <div class=\"assignee-label\">\r\n        "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.lang : depth0)) != null ? stack1.assigneeLabelLabel : stack1), depth0))
    + "\r\n      </div>\r\n      <div class=\"assignee-name\"></div>\r\n    </div>\r\n";
},"9":function(depth0,helpers,partials,data) {
    return "  <!-- Comment Area -->\r\n  <div class=\"workitem-action-comment\">\r\n    <!-- Here renders the commenting control -->\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showAuthenticate : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "<!-- Assignee area -->\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showAssigneeSelector : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(6, data, 0)})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showComment : depth0),{"name":"if","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('workflow_widgets_action_action.body_impl_action.body', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/action/action.body/impl/action.body.comment',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"comment-label\">"
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "</div>\r\n<textarea class=\"comment-input\" rows=\"6\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholder","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaLabel || (depth0 != null ? depth0.ariaLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaLabel","hash":{}}) : helper)))
    + "\"></textarea>\r\n\r\n";
}});
Handlebars.registerPartial('workflow_widgets_action_action.body_impl_action.body.comment', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/action/action.body/impl/action.body.authenticate',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"authenticate-description\">\r\n  "
    + this.escapeExpression(((helper = (helper = helpers.authenticateDescLabelAndUser || (depth0 != null ? depth0.authenticateDescLabelAndUser : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"authenticateDescLabelAndUser","hash":{}}) : helper)))
    + "\r\n</div>\r\n<div class=\"authenticate-description\">\r\n  "
    + this.escapeExpression(((helper = (helper = helpers.authenticateEnterPassword || (depth0 != null ? depth0.authenticateEnterPassword : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"authenticateEnterPassword","hash":{}}) : helper)))
    + "\r\n</div>\r\n<div class=\"authenticate-label\">\r\n<span class=\"binf-glyphicon binf-glyphicon-star\"></span>\r\n  "
    + this.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{}}) : helper)))
    + "\r\n</div>\r\n<input type=\"password\" class=\"authenticate-input\" placeholder=\""
    + this.escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"placeholder","hash":{}}) : helper)))
    + "\"\r\n          aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaLabel || (depth0 != null ? depth0.ariaLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaLabel","hash":{}}) : helper)))
    + "\" aria-required=\"true\"></input>";
}});
Handlebars.registerPartial('workflow_widgets_action_action.body_impl_action.body.authenticate', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/action/action.body/impl/assigneetypeselector',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"assignee-type-selector-region\"></div>";
}});
Handlebars.registerPartial('workflow_widgets_action_action.body_impl_assigneetypeselector', t);
return t;
});
/* END_TEMPLATE */
;
// Lists explicit locale mappings and fallbacks

csui.define('workflow/widgets/action/action.body/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)
csui.define('workflow/widgets/action/action.body/impl/nls/root/lang',{
  assigneePickerLabel: 'Forward to',
  assigneeOptionLabel: 'Options to accept',
  assigneePickerPlaceholder: 'Enter user name',
  assigneeCurrentUserMessage: 'You are the current user',
  commentTextFieldLabel: 'Add comments',
  commentTextFieldPlaceholder: 'Add message',
  commentAriaLabelReply: '{0}: {1}',
  assigneeOptionOneMember: 'One group member',
  assigneeOptionAllMembers: 'All group members',
  assigneeLabelLabel: 'To',
  authenticateTextFieldLabel: 'Password',
  authenticateTextFieldPlaceholder: 'Enter password',
  authenticateDescriptionLabel: 'Additional user authentication is required.',
  authenticateEnterPassword: 'Enter password for user {0}.'
});



csui.define('css!workflow/widgets/action/action.body/impl/action.body',[],function(){});
csui.define('workflow/widgets/action/action.body/action.body.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/form/fields/selectfield.view',
  'csui/controls/form/fields/userfield.view',
  'workflow/controls/userpicker/userpicker.view',
  'hbs!workflow/widgets/action/action.body/impl/action.body',
  'hbs!workflow/widgets/action/action.body/impl/action.body.comment',
  'hbs!workflow/widgets/action/action.body/impl/action.body.authenticate',
  'hbs!workflow/widgets/action/action.body/impl/assigneetypeselector',
  'i18n!workflow/widgets/action/action.body/impl/nls/lang',
  'css!workflow/widgets/action/action.body/impl/action.body'
], function ($, _, Backbone, Marionette, TabableRegionBehavior, LayoutViewEventsPropagationMixin,
    SelectFieldView, UserFieldView, UserPicker, template, templateComment, templateAuthenticate, templateSelector, lang) {
  

  // Action-Body Commenting Control
  var ActionBodyCommentView = Marionette.LayoutView.extend({

    //
    className: 'action-comment',

    //
    template: templateComment,

    // template helper to prepare the model for the view
    templateHelpers: function () {
      // return the prepared object with the necessary properties
      return {
        label: this.labelText,
        placeholder: this.placeholderText,
        ariaLabel: this.ariaLabel
      };
    },

    //
    ui: {
      textbox: '.comment-input'
    },

    //
    events: {
      'keyup @ui.textbox': 'onKeyUpTextBox'
    },

    //
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    //
    constructor: function ActionBodyCommentView(options) {
      // initialize options
      this.options = (options || {});
      this.labelText = this.options.commentLabel || lang.commentTextFieldLabel;
      this.ariaLabel = this.options.commentAriaLabel || lang.commentTextFieldLabel;
      this.placeholderText = this.options.commentPlaceholder || lang.commentTextFieldPlaceholder;
      // initialize parent
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    //
    onKeyUpTextBox: function () {
      this.triggerMethod('comment:changed', {text: this.ui.textbox.val()});
    },

    //
    currentlyFocusedElement: function () {
      // return comment control textbox
      return $(this.ui.textbox);
    }
  });

  var ActionBodyAuthenticateView = Marionette.LayoutView.extend({

    className: 'action-authenticate',

    template:  templateAuthenticate,


    // template helper to prepare the model for the view
    templateHelpers: function () {
      // return the prepared object with the necessary properties
      return {
        lang: lang,
        label: this.labelText,
        placeholder: this.placeholderText,
        ariaLabel: this.ariaLabel,
        authenticateDescLabelAndUser: this.authenticateDescLabel,
        authenticateEnterPassword: this.authenticateEnterPassword
      };
    },


    constructor: function ActionBodyAuthenticateView(options) {
      this.options = (options || {});
      this.labelText = lang.authenticateTextFieldLabel;
      this.ariaLabel = lang.authenticateTextFieldLabel;
      this.placeholderText = lang.authenticateTextFieldPlaceholder;
      this.authenticateDescLabel = lang.authenticateDescriptionLabel;
      var user = options || "";
      this.authenticateEnterPassword = _.str.sformat(lang.authenticateEnterPassword, user);

      // initialize parent
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    ui: {
      textbox: '.authenticate-input'
    },
    events: {
      'keyup @ui.textbox': 'onKeyUpTextBox'
    },

    onKeyUpTextBox: function () {
      this.triggerMethod('authenticate:changed', {text: this.ui.textbox.val()});
    },

    currentlyFocusedElement: function () {
      // return comment control textbox
      return $(this.ui.textbox);
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    }
  });

  // Action-Body Assignee type selector control
  var AssigneeTypeSelector = Marionette.LayoutView.extend({
    //
    className: 'assignee-options-select',

    //
    template: templateSelector,

    // template helper to prepare the model for the view
    templateHelpers: function () {
      // return the prepared object with the necessary properties
      return {
        lang: lang
      };
    },

    // view regions
    regions: {
      selectField: '.assignee-type-selector-region'
    },

    //
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    //
    constructor: function AssigneeTypeSelector(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      // create collection with all assignee options
      var collection = new Backbone.Collection([
         //SelectField expects as id the same as in name, the id is used in the aria-label as value
        {id: lang.assigneeOptionOneMember, name: lang.assigneeOptionOneMember},
        {id: lang.assigneeOptionAllMembers, name: lang.assigneeOptionAllMembers}
      ]);

      // create SelectFieldView object and provide all needed parameters
      this.assingeeOptions = new SelectFieldView({
        id: 'assigneeOptionSelector', //field id
        //SelectField needs the label for the aria-label
        model: new Backbone.Model({options: {isMultiFieldItem: false, label: lang.assigneeOptionLabel}}),
        selected: collection.get(lang.assigneeOptionOneMember), // show first item selected
        collection: collection,
        alpaca: {
          options: {
            setRequiredFieldsEditable: true
          },
          schema: {readonly: false}
        }
      });
      // add required fields and methods to the object, because we are using a form object not in a form
      this.assingeeOptions.alpacaField = {
        options: {mode: 'create'},
        schema: {readonly: false},
        setValueAndValidate: function () { return true; },
        setValue: function () { return; },
        parent: {}
      };
      this.selectField.show(this.assingeeOptions);

      // listen to the change event
      this.listenTo(this.assingeeOptions, "field:changed", _.bind(function (event) {
        this.triggerMethod('assigneeOption:changed', {option: event.fieldvalue});
      }, this));
    },

    //
    currentlyFocusedElement: function () {
      if (this.$el.is(':visible')) {
        // return dropdown box
        return this.$('.binf-dropdown-toggle');
      }
      //
      return;
    }

  });

  // An application widget is a view, because it should render a HTML fragment
  var ActionBodyView = Marionette.LayoutView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'workitem-action-body',

    // Template method rendering the HTML for the view
    template: template,

    // template helper to prepare the model for the view
    templateHelpers: function () {
      // return the prepared object with the necessary properties
      return {
        lang: lang,
        showAssigneeSelector: this.showAssigneeSelector,
        showAssigneeOptionsSelector: this.showAssigneeOptionsSelector,
        showAssigneeReadOnly: this.showAssigneeReadOnly,
        showComment: this.showComment,
        showAuthenticate: this.showAuthenticate,
        assigneePickerLabel: this.texts.assigneeLabel || lang.assigneePickerLabel
      };
    },

    // view regions
    regions: {
      assigneeRegion: '.workitem-action-assignee .assignee-picker',
      assigneeTypeRegion: '.workitem-action-assignee-options .assignee-options',
      assigneeLabelRegion: '.workitem-action-assignee-label .assignee-name',
      commentRegion: '.workitem-action-comment',
      authenticateInputRegion: '.workitem-action-authenticate'
    },

    ui: {
      assigneeOptionsLabel: '.workitem-action-assignee-options .assignee-label',
      assigneeOptionsSelector: '.workitem-action-assignee-options .assignee-options'
    },

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function ActionBodyView(options) {

      // initialize members
      this.showAssigneeSelector = options.model.get('requireAssignee');
      this.showAssigneeReadOnly = !this.showAssigneeSelector &&
                                  options.model.get('readonlyAssignee');
      this.showAssigneeOptionsSelector = options.model.get('assigneeOptions');
      this.showComment = options.model.get('requireComment');
      if (options.model.get('assignee')) {
        this.userId = options.model.get('assignee').get('id');
        this.assigneeAttributes = options.model.get('assignee').attributes;
      }

      this.showAuthenticate = options.model.get('authentication');
      if(options.model.get('currentUser')){
        this.currentUser = options.model.get('currentUser');
      }

      // initialize texts
      this.texts = options.model.get('texts') || {};
      if (this.showAssigneeReadOnly) {
        //then the aria-label for the comment contains Username
        this.texts.commentAriaLabel = _.str.sformat(lang.commentAriaLabelReply, this.texts.commentLabel,
            this.assigneeAttributes.display_name);
      }
        else{
        this.texts.commentAriaLabel = this.texts.commentLabel;
      }

      // initialize parent
      Marionette.LayoutView.prototype.constructor.call(this, options);

      // propagate events to regions
      this.propagateEventsToRegions();
    },

    //
    onRender: function () {
      // show user picker if required
      if (this.showAssigneeSelector) {
        var user = new UserPicker({
          context: this.options.context,
          limit: 20,
          clearOnSelect: false,
          placeholder: this.texts.assigneePlaceholder || lang.assigneePickerPlaceholder,
          ariaLabel: this.texts.assigneeLabel || lang.assigneePickerLabel,
          disabledMessage: lang.assigneeCurrentUserMessage,
          onRetrieveMembers: _.bind(this.onRetrieveMembers, this),
          prettyScrolling: true,
          initialActivationWeight: 100,
          isRequired: true
        });
        this.listenTo(user, 'dom:refresh', function () {
          //set focus in input field
            if(!this.showAuthenticate) {
              user.$('input').focus();
            }
          });
        this.assigneeRegion.show(user);
        this.listenTo(user, 'item:change', this.onUserChanged);
        this.listenTo(user, 'item:remove', this.onUserRemoved);
      }

      // show assignee label if required
      if (this.showAssigneeReadOnly) {
        var label = new UserFieldView({
          context: this.options.context,
          mode: 'readonly',
          model: new Backbone.Model({
            data: this.assigneeAttributes,
            schema: {
              readonly: true
            }
          }),
          alpaca: {
            options: {}
          }
        });
        this.assigneeLabelRegion.show(label);
      }

      // show assignment options if required
      if (this.showAssigneeOptionsSelector) {
        var assigneeOptions = new AssigneeTypeSelector({
          context: this.options.context
        });
        this.listenTo(assigneeOptions, 'assigneeOption:changed', this.onAssigneeOptionChanged);
        this.assigneeTypeRegion.show(assigneeOptions);

        //initially hide the assigne options
        this._hideAssigneeOptions(true);
      }

      // show authentication control if required
      if (this.showAuthenticate) {
        var authenticate = new ActionBodyAuthenticateView(this.currentUser);
        this.listenTo(authenticate, 'dom:refresh', function()
        {
          authenticate.$('input').focus();
        });
        this.listenTo(authenticate, 'authenticate:changed', this.onAuthenticateChanged);
        this.authenticateInputRegion.show(authenticate);
      }

      // show commenting control if required
      if (this.showComment) {
        var comment = new ActionBodyCommentView(this.texts);
        this.listenTo(comment, 'comment:changed', this.onCommentChanged);
        this.commentRegion.show(comment);
      }
    },

    onAuthenticateChanged: function (e) {
      this.model.set('authentication_info', {password: e.text});
    },

    onCommentChanged: function (data) {
      this.model.set('comment', data.text);
    },

    //
    onAssigneeOptionChanged: function (data) {
      //the Workitem needs the specific number as assigneeOption
      if (data.option === lang.assigneeOptionAllMembers) {
        this.model.set('assigneeOption', 2);
      }
      else{
        this.model.set('assigneeOption', 0);
      }
    },

    //
    onUserChanged: function (e) {
      // if member is disabled prevent from being added
      var assignee = e.item;
      if (assignee.get('disabled')) {
        // remove assignee and reset the picker control
        var picker = this.assigneeRegion.currentView;
        if (picker) {
          picker.ui.searchbox.val('');
        }
        assignee = undefined;
      }
      // update assignee
      this.model.set('assignee', assignee);

      // hide or show the assignee options depending on the select object
      // only for groups we need these options
      if ((assignee && assignee.get('type') === 0) || _.isUndefined(assignee) ){
        this._hideAssigneeOptions(true);
      } else {
        this._hideAssigneeOptions(false);
      }
    },

    //
    onUserRemoved: function (e) {
      // update assignee
      this.model.set('assignee', undefined);
      // hide teh assignee options when no user is selected
      this._hideAssigneeOptions(true);
    },

    //
    onRetrieveMembers: function (args) {
      var self = this;
      // check if collection contains current user and disable it.
      if (this.userId) {
        args.collection.each(function (current) {
          if (current.get('id') === self.userId) {
            // check whether user is current user
            current.set('disabled', true);
          }
        });
      }
    },

    /**
     * Hides or shows the assignee options
     * @param hide True hide the options, false show them
     * @private
     */
    _hideAssigneeOptions: function (hide) {
      if (hide) {
        this.ui.assigneeOptionsLabel.addClass('binf-hidden');
        this.ui.assigneeOptionsSelector.addClass('binf-hidden');
      } else {
        this.ui.assigneeOptionsLabel.removeClass('binf-hidden');
        this.ui.assigneeOptionsSelector.removeClass('binf-hidden');
      }
    }
  });

  // add mixin
  _.extend(ActionBodyView.prototype, LayoutViewEventsPropagationMixin);

  // return
  return ActionBodyView;
});

// Lists explicit locale mappings and fallbacks

csui.define('workflow/dialogs/action.dialog/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/dialogs/action.dialog/impl/nls/root/lang',{
  submitButtonLabel: 'Submit',
  cancelButtonLabel: 'Cancel',
  ActionFailMessageTitle: 'Action "{0}" failed',
  ActionFailMessage: 'Action "{0}" failed. \n\n{1}',
  DialogDefaultTitle: '{0}: Workflow step'
});



csui.define('css!workflow/dialogs/action.dialog/impl/action.dialog',[],function(){});
csui.define('workflow/dialogs/action.dialog/action.dialog',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/dialog/dialog.view',
  'csui/dialogs/modal.alert/modal.alert',
  'workflow/widgets/action/action.body/action.body.view',
  'i18n!workflow/dialogs/action.dialog/impl/nls/lang',
  'css!workflow/dialogs/action.dialog/impl/action.dialog'
], function (_, $, Marionette, DialogView, ModalAlert, ActionBodyView, lang) {
  

  var ActionDialog = DialogView.extend({

    // this is the workflow specific action dialog
    className: 'workflow-action-dialog',

    constructor: function ActionDialog(options) {
      var self = this;

      // prepare members
      this.options = options || {};
      this.model = this.options.model;
      this.action = this.model.get('action');

      // backup original user
      if (this.model.get('assignee')) {
        this.userId = this.model.get('assignee').get('id');
      }

      // initialize texts
      this.texts = options.model.get('texts') || {};

      // prepare buttons ...
      var buttonArray = [];
      // ... submit
      buttonArray.push({
        id: self.action.get('id'),
        label: this.texts.submitLabel || lang.submitButtonLabel,
        toolTip: this.texts.submitLabel || lang.submitButtonLabel,
        disabled: !this._isValidAuthInfoAndValidAssignee(),
        default: true,
        click: function () {
          self.onClickAction();
        }
      })
      ;
      // ... cancel
      buttonArray.push({
        label: this.texts.cancelLabel || lang.cancelButtonLabel,
        toolTip: this.texts.cancelLabel || lang.cancelButtonLabel,
        close: true,
        click: function () {
          self.model.set('comment', '');
        }
      });

      // set dialog properties
      var title = this.model.get('title');
      if (_.isUndefined(title)) {
        title = _.str.sformat(lang.DialogDefaultTitle, this.action.get('label'));
      }

      _.defaults(options, {
        title: title,
        buttons: buttonArray
      });

      // add work item body view
      var actionBodyView = new ActionBodyView(options);
      _.extend(options, {
        view: actionBodyView
      });

      // initialze parent type
      DialogView.prototype.constructor.call(this, options);

      // listen to dialog model changes
      this.listenTo(this.model, 'change:assignee', this.onChangedAssignee);

      this.listenTo(this.model, 'change:authentication_info', this.onChangedAuthenticationInfo);
    },

    onChangedAuthenticationInfo: function(){
        this.updateButton(this.action.get('id'), {disabled: !this._isValidAuthInfoAndValidAssignee()});
    },

    onClickAction: function () {
      // execute the action callback function
      if (_.isFunction(this.options.callback)) {
        this.options.callback(this.model);
      }
      // close dialog
      this.destroy();
    },

    onChangedAssignee: function () {
      // update the button state
        this.updateButton(this.action.get('id'), {disabled: !this._isValidAuthInfoAndValidAssignee()});
    },

    _isValidAuthInfo:function (){
      //do we need to authenticate the user
      var ret = false;
      if(this.model.get('authentication')) {
        if ((this.model.get('authentication_info')) && (this.model.get('authentication_info').password !== "")) {
           ret = true;
        }
      }
      else{
        ret = true;
      }
      return ret;
    },

    _isValidAssignee: function () {
      // do we need an assignee and if so, is it set correctly
      var ret = false;
      if (this.model.get('requireAssignee')) {
        // check whether the user is set or has changed
        if (this.model.get('assignee')) {
          if (this.model.get('assignee').get('id') !== this.userId) {
            ret = true;
          }
        }
      } else{
        ret = true;
      }
      return ret;
    },

    _isValidAuthInfoAndValidAssignee: function(){
      var ret = false;
      if(this._isValidAssignee() && this._isValidAuthInfo()){
        ret = true;
      }
      return ret;
    }

  });

  return ActionDialog;

});

csui.define('workflow/dialogs/action.dialog/action.dialog.model',[
  'csui/lib/underscore',
  'csui/lib/backbone'
], function (_, Backbone) {
  

  // model holds the action dialog properties and results
  var ActionDialogModel = Backbone.Model.extend({

    // defaults
    defaults: {
      // title
      title: undefined,
      // action
      action: undefined,
      // comment
      requireComment: false,
      comment: undefined,
      // assignee
      requireAssignee: false,
      readonlyAssignee: false,
      assigneeOptions: false,
      assignee: undefined,
      // dialog label texts
      texts: {},
      authentication: false,
      currentUser: undefined,
      authentication_info: undefined
    },

    // initializes the model
    constructor: function ActionDialogModel(attributes, options) {
      // apply properties to parent
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });

  // return
  return ActionDialogModel;
});
csui.define('workflow/models/wfstatus/wfstatus.model',[
  'csui/lib/underscore', 
  'csui/lib/jquery', 
  'csui/lib/backbone', 
  'csui/utils/url'
], function (_, $, Backbone, Url) {
   

  var WFStatusModel = Backbone.Model.extend( {

    constructor:function WFStatusModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments); 

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this); 
      }
    }, 

    url:function () {

      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'), 
          getUrl = Url.combine(baseUrl, 'workflows/status/widget'), 
          filterWorkflowtype = this.get("filterWorkflowtype"), 
          retention = this.get("retention"),
          selectionType = this.get("selectionType"),
          wfstatusfilter = this.get("wfstatusfilter");

      if (!filterWorkflowtype) {
        var isFilterInitiated = this.get("filterWorkflows") ?
                                this.get("filterWorkflows").filterInitiated : true;
        var isFilterManaged = this.get("filterWorkflows") ?
                              this.get("filterWorkflows").filterManaged : true;
        filterWorkflowtype = 'Both';
        if (isFilterInitiated && isFilterManaged) {
          filterWorkflowtype = 'Both';
        } else if (isFilterInitiated) {
          filterWorkflowtype = 'Initiated';
        } else if (isFilterManaged) {
          filterWorkflowtype = 'Managed';
        }
      }
      getUrl += "?selectionType=" + selectionType; 

      if(wfstatusfilter && wfstatusfilter!=='')
      {
        getUrl += "&wfstatusfilter=" + wfstatusfilter; 
      }
      else
      {
        getUrl += "&wfretention=" + retention; 
        getUrl += "&kind=" + filterWorkflowtype; 
      }

      return getUrl; 

    }, 

    parse:function (response) {

      return response.results; 

    }, 

    isFetchable:function () {

      return true; 
    }, 
    sendReAssignAction:function (acceptStatus) {
      // URL of the REST call to reassign user
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'), 
          postUrl = Url.combine(baseUrl, 'workflows', 'status'), 
          formData = new FormData(), content =  {
            workid:acceptStatus.wfData.process_id || acceptStatus.wfData.processId, 
            subworkid:acceptStatus.wfData.subprocess_id || acceptStatus.wfData.subProcessId, 
            taskid:acceptStatus.wfData.task_id || acceptStatus.wfData.taskId, 
            newuserid:acceptStatus.model.get('assignee'), 
            comment:acceptStatus.model.get('comment')
          }, 
          dfd = $.Deferred(); 
      formData.append('body', JSON.stringify(content)); 
      var ajaxOptions =  {
        type:'POST', 
        url:postUrl, 
        data:formData, 
        contentType:false, 
        processData:false
      }; 
      this.connector && this.connector.extendAjaxOptions(ajaxOptions); 

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            dfd.resolve(resp); 
          }, this))
          .fail(_.bind(function (resp) {
            var responseMsg = ""; 
            if (resp.responseText) {
               responseMsg = JSON.parse(resp.responseText); 
            }
            dfd.reject(responseMsg); 
          }, this)); 
      return dfd; 
    }
  }); 

  return WFStatusModel; 

}); 

csui.define('workflow/models/wfstatus/wfstatus.model.factory',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',   // Factory base to inherit from
  'csui/utils/contexts/factories/connector', // Factory for the server connector
  'workflow/models/wfstatus/wfstatus.model'     // Model to create the factory for
], function ($, _, Backbone, ModelFactory, ConnectorFactory, WfstatusModel) {
  

  var WFStatusModelFactory = ModelFactory.extend({

    // Unique prefix of the default model instance, when this model is placed
    // to a context to be shared by multiple widgets
    propertyPrefix: 'wfstatus',

    constructor: function WFStatusModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;

      // Expose the model instance in the `property` key on this factory
      // instance to be used by the context
      this.property = new WfstatusModel(options, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);

    }
  });

  return WFStatusModelFactory;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/controls/usercards/impl/usercard',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div\r\n      class=\"wfstatus-mini-profile-user binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n    <div class=\"wfstatus-mini-profile-details\">\r\n      <div class=\"wfstatus-group-profile-img\">\r\n            <span class=\"wfstatus-mini-profile-avatar\">\r\n                <a href=\"javascript:void(0);\" class=\"wfstatus-group-profile-pic\">\r\n                    <span\r\n                        class=\"wfstatus-miniprofile-default-avatar-show default-group-avatar image_group_placeholder\"\r\n                        title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"></span>\r\n                </a>\r\n            </span>\r\n      </div>\r\n\r\n      <div\r\n          class=\"wfstatus-mini-profile-userinfo binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n        <div class=\"wfstatus-mini-profile-user-displayname\">\r\n          <a href=\"javascript:void(0);\" class=\"wfstatus-mini-profile-group-name\"\r\n             title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n        </div>\r\n      </div>\r\n      <div class=\"wfstatus-usercard-wfstatus\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "\">\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "\r\n      </div>\r\n    </div>\r\n    <div class=\"wfstatus-usercard-actions\">\r\n      <div class=\"wfstatus-reassignButton\">\r\n            <span><button class=\"csui-btn binf-btn binf-btn-primary wfstatus-reassign-btn\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.ReassignLabel || (depth0 != null ? depth0.ReassignLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ReassignLabel","hash":{}}) : helper)))
    + "\"\r\n                          tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.ReassignLabel || (depth0 != null ? depth0.ReassignLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ReassignLabel","hash":{}}) : helper)))
    + "</button>\r\n            </span>\r\n      </div>\r\n    </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.MultiUser : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.notLastUser : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    return "        <hr>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "\r\n  <div\r\n      class=\"wfstatus-mini-profile-user binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n    <div class=\"wfstatus-mini-profile-details\">\r\n      <div class=\"wfstatus-user-profile-img\">\r\n            <span class=\"wfstatus-mini-profile-avatar\">\r\n                <a href=\"javascript:void(0);\" class=\"wfstatus-user-profile-pic\">\r\n                    <span\r\n                        class=\"image_user_placeholder wfstatus-miniprofile-default-avatar-"
    + this.escapeExpression(((helper = (helper = helpers.displayDefaultPic || (depth0 != null ? depth0.displayDefaultPic : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"displayDefaultPic","hash":{}}) : helper)))
    + "\"\r\n                        title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\"></span>\r\n                    <img id=\"wfstatus-mini-profile-pic-"
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" class=\"wfstatus-userprofile-img\r\n                         binf-img-circle-"
    + this.escapeExpression(((helper = (helper = helpers.displayPic || (depth0 != null ? depth0.displayPic : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"displayPic","hash":{}}) : helper)))
    + "\" src=\""
    + this.escapeExpression(((helper = (helper = helpers.photoUrl || (depth0 != null ? depth0.photoUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"photoUrl","hash":{}}) : helper)))
    + "\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">\r\n                </a>\r\n            </span>\r\n      </div>\r\n\r\n      <div\r\n          class=\"wfstatus-mini-profile-userinfo binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12\">\r\n        <div class=\"wfstatus-mini-profile-user-displayname\">\r\n          <a href=\"javascript:void(0);\" class=\"wfstatus-mini-profile-user-name\"\r\n             title=\""
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{}}) : helper)))
    + "</a>\r\n        </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.business_email : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.business_phone : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      </div>\r\n      <div class=\"wfstatus-usercard-wfstatus\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "\">\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "\r\n      </div>\r\n    </div>\r\n    <div class=\"wfstatus-usercard-actions\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isChatEnabled : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.displayReassign : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.MultiUser : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "          <div class=\"wfstatus-mini-profile-user-displayemail\">\r\n            <a class=\"wfstatus-mini-profile-user-email\" href=\"mailto:"
    + this.escapeExpression(((helper = (helper = helpers.business_email || (depth0 != null ? depth0.business_email : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"business_email","hash":{}}) : helper)))
    + "\"\r\n               title=\""
    + this.escapeExpression(((helper = (helper = helpers.business_email || (depth0 != null ? depth0.business_email : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"business_email","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.business_email || (depth0 != null ? depth0.business_email : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"business_email","hash":{}}) : helper)))
    + "</a>\r\n          </div>\r\n";
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "          <div class=\"wfstatus-mini-profile-user-phone\"\r\n               title=\""
    + this.escapeExpression(((helper = (helper = helpers.business_phone || (depth0 != null ? depth0.business_phone : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"business_phone","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.PhoneLabel || (depth0 != null ? depth0.PhoneLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"PhoneLabel","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(((helper = (helper = helpers.business_phone || (depth0 != null ? depth0.business_phone : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"business_phone","hash":{}}) : helper)))
    + "</div>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "        <div class=\"wfstatus-chatButton\">\r\n            <a href='"
    + this.escapeExpression(((helper = (helper = helpers.chatURI || (depth0 != null ? depth0.chatURI : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"chatURI","hash":{}}) : helper)))
    + "' class='wfstatus-chat-icon'>\r\n                <span><button class=\"csui-btn binf-btn binf-btn-secondary wfstatus-chat-btn\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.ChatLabel || (depth0 != null ? depth0.ChatLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ChatLabel","hash":{}}) : helper)))
    + "\"\r\n                              tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.ChatLabel || (depth0 != null ? depth0.ChatLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ChatLabel","hash":{}}) : helper)))
    + "</button>\r\n                </span></a>\r\n        </div>\r\n";
},"12":function(depth0,helpers,partials,data) {
    var helper;

  return "        <div class=\"wfstatus-reassignButton\">\r\n            <span><button class=\"csui-btn binf-btn binf-btn-primary wfstatus-reassign-btn\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.ReassignLabel || (depth0 != null ? depth0.ReassignLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ReassignLabel","hash":{}}) : helper)))
    + "\"\r\n                          tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.ReassignLabel || (depth0 != null ? depth0.ReassignLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ReassignLabel","hash":{}}) : helper)))
    + "</button>\r\n            </span>\r\n        </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<!-- Here if the assigneeType '1' is for group and '0' for user and handlebars considering '1' as true and '0' as false-->\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.assigneeType : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(5, data, 0)})) != null ? stack1 : "");
}});
Handlebars.registerPartial('workflow_controls_usercards_impl_usercard', t);
return t;
});
/* END_TEMPLATE */
;
// Lists explicit locale mappings and fallbacks

csui.define('workflow/controls/usercards/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('workflow/controls/usercards/nls/root/lang',{
  PhoneLabel: 'Phone:',
  ChatButtonLabel: 'Chat',
  ReassignButtonLabel: 'Reassign',
  ReassignTo: 'Reassign to',
  SuccessMessage: ' Workflow step was successfully reassigned',
  ErrorMessage: 'Could not reassign step',
  DialogHeaderMessage: 'Reassign workflow step',
  commentPlaceholder: 'Type a message'
});



csui.define('css!workflow/controls/usercards/impl/usercard',[],function(){});
csui.define('workflow/controls/usercards/usercard.view',['require', 'csui/lib/jquery', 'csui/utils/url', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/globalmessage/globalmessage',
  'workflow/dialogs/action.dialog/action.dialog',
  'workflow/dialogs/action.dialog/action.dialog.model',
  'workflow/models/wfstatus/wfstatus.model.factory',
  'hbs!workflow/controls/usercards/impl/usercard',
  'i18n!workflow/controls/usercards/nls/lang',
  'css!workflow/controls/usercards/impl/usercard'
], function (require, $, Url, _, Backbone, Marionette, ConnectorFactory, ToolbarView, GlobalMessage,
    ActionDialogView,ActionDialogModel, WFstatusModelFactory, Template, Lang) {
  

  var UserCardView = Marionette.ItemView.extend({

    template: Template,

    className: 'wfstatus-usercard',

    constructor: function WFStatusUserCardView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.model.connector = this.options.context.getObject(ConnectorFactory, this.options);
    },

    events: {
      'mouseenter .wfstatus-mini-profile-user': 'showActions',
      'mouseleave .wfstatus-mini-profile-user': 'hideActions',
      'click .wfstatus-mini-profile-user-name, .wfstatus-user-profile-img': 'showUserProfileDialog',
      'click .wfstatus-reassignButton': 'showReassignDialogView'
    },

    templateHelpers: function () {

      var WFStatusCollectionFactory                   = require('workflow/models/wfstatus/wfstatus.collection.factory'),
          Utils                                       = require('workflow/utils/workitem.util'),
          firstName                                   = this.model.get('first_name') === null ? "" :
                          this.model.get('first_name'),
          lastName                                    = this.model.get('last_name') === null ? "" :
                          this.model.get('last_name'),
          displayName                                 =  firstName + " " + lastName,
          loginName                                   = this.model.get('name'),
          phone                                       = this.model.get('business_phone'),
          email                                       = this.model.get('business_email'),
          photo                                       = this.model.get('photo_url'),
          userId                                      = this.model.get('id'),
          lastUserModel                               = this.model.collection.at(this.model.collection.length - 1),
          lastUser                                    = (lastUserModel.get("id") === this.model.get("id")) ? true : false,
          status                                      = this.options.status,
          name                                        = this.model.get('name'),
          wfStatusCollection                          = this.options.context.getCollection(WFStatusCollectionFactory),
          chatSettings                                = wfStatusCollection.options.chatSettings,
          isChatEnabled                               = chatSettings ? chatSettings.chatEnabled : false,
          assigneeType                                = this.model.get('type'),
          data = {},
          options = {},
          chatURI = '';

      //getting the chat uri
      options.domain = chatSettings.chatDomain;
      options.tguser = name;
      chatURI = Utils.getChatURI(options);

      //checking for the type either group or user and returning the data accordingly
      if (assigneeType === 1) {
        data = {
          "name": name,
          "id": userId,
          "MultiUser": !this.model.get("singleUser"),
          "notLastUser": !lastUser
        };
      } else if (assigneeType === 0) {
        data = {
          "name": displayName === " " ? loginName : displayName ,
          "business_phone": phone ? phone : "",
          "business_email": email ? email : "",
          "photoUrl": photo === null ? null : photo,
          "id": userId,
          "displayPic": photo === null ? 'hide' : 'show',
          "displayDefaultPic": photo === null ? 'show' : 'hide',
          "ChatLabel": Lang.ChatButtonLabel,
          "PhoneLabel": Lang.PhoneLabel,
          "MultiUser": !this.model.get("singleUser"),
          "notLastUser": !lastUser,
          "displayReassign" : status !== 'completed' ? true : false
        };
      }
      _.extend(data,
          {ReassignLabel: Lang.ReassignButtonLabel, status: status, assigneeType: assigneeType, isChatEnabled: isChatEnabled, chatURI: chatURI});
      return data;
    },

    showActions: function () {
      if (!this.model.get("singleUser")) {

        this.$el.find('.wfstatus-usercard-actions').addClass('wfstatus-usercard-footer');
        this.$el.find(".wfstatus-chatButton").show();
        this.$el.find(".wfstatus-reassignButton").show();
      }
    },

    hideActions: function () {

      if (!this.model.get("singleUser")) {

        this.$el.find(".wfstatus-chatButton").hide();
        this.$el.find(".wfstatus-reassignButton").hide();
        this.$el.find('.wfstatus-usercard-actions').removeClass('wfstatus-usercard-footer');
      }
    },

    onRender: function () {
      var Utils = require('workflow/utils/workitem.util'),
          self  = this;
      Utils.showProfilePic(this.model).always(function (response) {
        var photoUrl     = URL.createObjectURL(response),
            photoElement = $("#wfstatus-mini-profile-pic-" + self.model.get("id"));
        self.model.attributes.photoUrl = photoUrl;
        photoElement.attr("src", photoUrl);
      });

      this.firstUser = (this.model.collection.at(0).get("id") === this.model.get("id")) ? true :
                       false;

      var showActions = this.model.get("singleUser") ? false : this.firstUser;
      this.$el.find('.wfstatus-usercard-actions').addClass('wfstatus-usercard-footer');
      if (!showActions) {
        this.hideActions();
      }
    },

    showReassignDialogView: function (event) {

      var action        = this.model.set({id: 'Reassign'}),
          actionOptions = {
            requireAssignee: true,
            assigneeOptions: false,
            texts: {
              assigneeLabel: Lang.ReassignTo,
              commentPlaceholder: Lang.commentPlaceholder
            }
          };

      // prepare dialog model
      var dialogModel = new ActionDialogModel(_.extend({
        title: Lang.DialogHeaderMessage,
        requireComment: this.getOption('wfData').comments_on ?
                        this.getOption('wfData').comments_on :
                        this.getOption('originatingView').model.get('comments_on'),
        action: action
      }, actionOptions));

      // show the dialog
      var actionDialog = new ActionDialogView({
        context: this.options.context,
        model: dialogModel,
        callback: _.bind(this.reAssignUser, this)
      });
      actionDialog.show();
    },

    reAssignUser: function (dialogModel, options) {

      var comment = dialogModel.get('comment');

      if (!_.isUndefined(comment) && comment.length !== 0) {
        this.model.set('comment', comment, {silent: true});
      }

      var assignee = dialogModel.get('assignee');
      if (!_.isUndefined(assignee)) {
        this.model.set('assignee', assignee.get('id'), {silent: true});
      }

      
        this.wfstatusmodel = this.options.context.getModel(WFstatusModelFactory);
      
      var that = this;
      that.wfstatusmodel.sendReAssignAction(that.options)
          .done(_.bind(function (response) {
            var Utils       = require('workflow/utils/workitem.util'),
                cellView    = that.options.originatingView,
                cellModel   = cellView.model,
                resp        = response.results,
                tableView   = cellView.options.tableView,
                stepCardModel = that.options.nodeModel,
                isStepTypeNext  = that.options.stepType === "next" ? true : false,
                listOfUsers = {},
                userName;
            listOfUsers.assignedto = resp.assignedto;
            listOfUsers.assignees = resp.assignee;
            userName = Utils.getAssignee(listOfUsers);

              if (that.options.stepCardsListView) {
                  var selectedTaskID = that.options.nodeModel.get("task_id"),
                      lists = that.options.stepCardsListView.options.step_list;
                  _.each(lists, function (list) {
                      if (list.task_id === selectedTaskID) {
                          list.task_assignees = resp;
                      }
                  });
              }

              // Updating tableView and stepCardView when we reassigned a step from
              // tableView,
              // stepCard if it's an nextStep ,
              // currentStep if it's not an parellel step

              if (isStepTypeNext || !selectedTaskID || lists.length === 1) {
                  that.updatingView(that, cellModel, resp, tableView, userName, isStepTypeNext);
              } else {
                  //Updating table view when we reassign a step which is in parallel state.
                  var reassignedModel = cellModel.collection.where({
                      process_id: cellModel.get("process_id"),
                      subprocess_id: cellModel.get("subprocess_id"),
                      task_id: selectedTaskID
                  });
                  if (reassignedModel && reassignedModel.length > 0) {
                    that.updatingView(that, reassignedModel[0], resp, tableView, userName, isStepTypeNext);
                  }
              }
              //Updating stepCardView when we reassigned from stepCard
              if (stepCardModel) {
                  stepCardModel.set("task_assignees", resp);
              }
            GlobalMessage.showMessage('success', Lang.SuccessMessage);
          }, this)).fail(_.bind(function (response) {
        GlobalMessage.showMessage('error',
            response.error === "" ? Lang.ErrorMessage : response.error);
      })).always(_.bind(function () {
        var Utils = require('workflow/utils/workitem.util');
        Utils.unbindPopover(options);
      }, that));
    },

      //Updating cellModel, tableView and widget Model based on the conditions.
      updatingView:function (that, cellModel, resp, tableView, userName, isStepTypeNext) {

        if (!isStepTypeNext) {
          if (_.has(resp, "assignedto")) {
            resp.assignedto.assignees = resp.assignee;

            cellModel.set("assignedto", resp.assignedto);
            cellModel.set("userId", resp.assignedto.groupId);

            if (resp.assignee.length > 0) {
              cellModel.set("assignee", userName);
            } else {
              cellModel.set("assignee", "");
            }
          } else if (resp.assignee.length === 1) {
            cellModel.unset("assignedto");
            cellModel.set("assignee", userName);
            cellModel.set("userId", resp.assignee[0].userId);
          }

          //updating the table row with cellModel
          tableView.updateRow(cellModel);
          //updating wfstatusmodel to render standard status view
          if (cellModel.collection.length === 1) {

            if (cellModel.collection.wfstatus) {
              cellModel.collection.wfstatus.get('data').assignee = resp.assignee;
              cellModel.collection.wfstatus.trigger('change', cellModel.collection.wfstatus);
            }
            else {
              that.wfstatusmodel.get('data').assignee = resp.assignee;
              that.wfstatusmodel.trigger('change');
            }
          }
        }
      },

    showUserProfileDialog: function (e) {

      var connector         = this.model.connector,
          context           = this.options.context,
          wfstatusExpandEle = $(".wfstatus.csui-expanded"),
          that              = this;
      this.model.attributes.display_name = this.model.get('name_formatted');

      csui.require([
        'esoc/controls/userwidget/userwidget.view'
      ], function (UserWidgetView) {
        var options = {};
        options.model = that.model;
        options.connector = connector;
        options.userid = that.model.get('id');
        options.context = context;
        options.baseElement = undefined;
        options.showUserProfileLink = true;
        options.loggedUserId = that.model.get('id');
        options.dialogClassName = 'wfstatus-user-profile-dialog';
        options.dialogiconLeft = 'arrow_back wfstatus-user-widget-dialog-back';
        options.dialogiconRight = "wfstatus-no-righticon";

        bindUserWidgetEvents(UserWidgetView, options, true);

        function bindUserWidgetEvents(UserWidget, options, create) {

          var userWidgetInstace;
          if (create) {
            userWidgetInstace = new UserWidgetView(options);
          } else {
            userWidgetInstace = UserWidget;
          }
          userWidgetInstace.showUserProfileDialog();

          userWidgetInstace.off('userwidgetview.show.user.dialog').on(
              'userwidgetview.show.user.dialog',
              function (event) {
                // open new user widget on clicking viewprofile from userwidte's followers or
                // following tabs
                var widgetOptions = _.extend({}, options);
                event.options.userid = event.options.model.id;

                var updatedOptions = _.extend(widgetOptions, event.options);
                delete updatedOptions["model"];
                updatedOptions.display_name = event.options.model.attributes.display_name;
                bindUserWidgetEvents(UserWidgetView, updatedOptions, true);
              });

          var esocUserProfileWidgetBackButtonEle = $('.wfstatus-user-profile-dialog' +
                                                     ' .esoc-user-widget-dialog-back');
          esocUserProfileWidgetBackButtonEle.off("click").on("click", function () {
            var prevUserview = userWidgetInstace.util.userStack.pop();
            //perform pop operation if previous user is current user.
            if (prevUserview.model.id === userWidgetInstace.model.id) {
              prevUserview = userWidgetInstace.util.userStack.pop();
            }
            bindUserWidgetEvents(prevUserview, undefined, false);

          });

          var workflowUserProfileWidgetBackButtonEle = $(".wfstatus-user-widget-dialog-back");

          workflowUserProfileWidgetBackButtonEle.off("click").on("click", function () {

            if ($(".esoc-user-widget-dialog").is(':visible') ||
                $('.wfstatus-user-profile-dialog').is(':visible')) {
              $(".wfstatus-user-profile-dialog .cs-close").trigger('click');
            }
            wfstatusExpandEle.show();
          });

          var esocUserProfileWidgetCloseButtonEle = $('.esoc-user-widget-dialog' + ' .cs-close');
          esocUserProfileWidgetCloseButtonEle.off("click").on("click", function () {
            userWidgetInstace.util.userStack = [];
            wfstatusExpandEle.show();
          });

          if (userWidgetInstace.util.userDialog) {
            userWidgetInstace.util.userDialog.listenTo(userWidgetInstace.util.userDialog, 'destroy',
                function () {
                  wfstatusExpandEle.show();
                });
          }

        }
      });
    }
  });

  return UserCardView;

})
;
csui.define('workflow/models/wfstatus/usercard.model',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'workflow/controls/usercards/usercard.view'
], function ($, _, Backbone, Url, UserCardView) {

  

  var UserCardModel = Backbone.Model.extend({

    constructor: function UserCardModel(options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {

      var baseUrl        = this.connector.connection.url.replace('/v1', '/v2'),
          membersRestUrl = Url.combine(baseUrl, '/members/'),
          assigneeUrl    = Url.combine(membersRestUrl, this.get('userId'));

      return assigneeUrl;

    }
  });
  return UserCardModel;
});

csui.define('workflow/controls/usercards/usercards.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/controls/usercards/usercard.view',
  'css!workflow/controls/usercards/impl/usercard'
], function (_, Marionette, PerfectScrollingBehavior, UsercardView) {
  

  var UsercardCollectionView = Marionette.CollectionView.extend({

    childView: UsercardView,

    className: 'wfstatus-usercard-list',

    constructor: function UsercardCollectionView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    childViewOptions: function () {
      return {
        options:this,
        status: this.options.status,
        context: this.options.context,
        originatingView: this.options.originatingView,
        nodeModel: this.options.nodeModel,
        stepCardsListView: this.options.stepCardsListView,
        wfData: this.options.wfData,
        stepType: this.options.stepType
      };
    }
  });

  return UsercardCollectionView;
});

/* START_TEMPLATE */
csui.define('hbs!workflow/controls/usercards/impl/usercards.list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wfstatus-usercard-list\"> </div>";
}});
Handlebars.registerPartial('workflow_controls_usercards_impl_usercards.list', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/controls/usercards/usercards.list.view',[
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/models/member/member.model',
  'csui/models/member/membercollection',
  'workflow/controls/usercards/usercard.view',
  'workflow/models/wfstatus/usercard.model',
  'workflow/controls/usercards/usercards.view',
  'workflow/utils/workitem.util',
  'hbs!workflow/controls/usercards/impl/usercards.list',
  'css!workflow/controls/usercards/impl/usercard'
], function (require, $, _, Backbone, Marionette, Url, PerfectScrollingBehavior, MemberModel,
    UserCollectionFactory, UsercardView, UserCardModel, UsercardCollectionView, WorkitemUtil,
    template) {
  
  var UsercardsView = Marionette.LayoutView.extend({

    childView: UsercardView,
    className: 'wfstatus-usercard-layout',
    template: template,
    tagName: 'div',

    regions: {
      usercardLayout: ".wfstatus-usercard-list"
    },

    constructor: function UsercardsView(options) {
      options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var self = this;

      if (this.model.get('assignedto')) {
        var memberModel = new MemberModel({
          groupId: this.model.get('assignedto').groupId
        }, {connector: this.model.connector});

        new UserCollectionFactory(undefined, {
          member: memberModel,
          autofetch: true,
          connector: this.model.connector
        }).fetch().done(function (response) {
          //Sorting the member collection based on type i.e group member models will be deposited at bottom
          var userData = _.sortBy(response.results, 'type');
          self.renderUserCards(userData);
        });

      } else {

        new UserCardModel({
          userId: this.model.get('userId'),
          connector: this.model.connector
        }).fetch().done(function (response) {
          var userData = response.results.data.properties;
          userData.singleUser = true;
          self.renderUserCards(userData);

        });
      }
    },

    renderUserCards: function (userData) {

      var options = {
            dueDate: this.model.get('task_due_date') ? this.model.get('task_due_date')  : this.model.get('due_date') ,
            status: this.model.get('task_status') ? this.model.get('task_status') : this.model.get('status_key')
          },
          utils = require('workflow/utils/workitem.util'),
          result  = utils.formatStatus(options);
      this.Usercollection = new UserCollectionFactory(userData, {});
      this.usercardCollectionView = new UsercardCollectionView({
        collection: this.Usercollection,
        status: result.status,
        context: this.options.context,
        options: this,
        originatingView: this.options.originatingView,
        nodeModel: this.options.nodeModel,
        stepCardsListView: this.options.stepCardsListView,
        wfData:this.options.wfData,
        stepType: this.options.stepType
      });
      this.completeCollection = new UserCollectionFactory(userData, {});
      this.usercardLayout.show(this.usercardCollectionView);

    }

  });
  return UsercardsView;
});


/* START_TEMPLATE */
csui.define('hbs!workflow/controls/usercards/impl/usercards.popover',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class = \"wfstatus-usercard-list-header\">\r\n    <div class=\"wfstatus-usercard-popover-header-labels\">\r\n        <div class = \"wfstatus-usercard-popover-header-group-label\"\r\n             title=\""
    + this.escapeExpression(((helper = (helper = helpers.groupName || (depth0 != null ? depth0.groupName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"groupName","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.groupName || (depth0 != null ? depth0.groupName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"groupName","hash":{}}) : helper)))
    + "</div>\r\n        <div class = \"wfstatus-usercard-popover-header-group-status\"\r\n             title=\""
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "</div>\r\n    </div>\r\n        <input class=\"search wfstatus-user-input\" type=\"search\" title=\"Search by Group User\" style=\"display: none\" >\r\n        <div class=\"cs-search-icon icon icon-search csui-acc-focusable-active wfstatus-user-search-icon\" title=\"Search by Group User\" ></div>\r\n</div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isGroup : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "<div class = \"popover wfstatus-usercard-popover-scrolling\r\n     wfstatus-usercard-popover-content large\"></div>\r\n";
}});
Handlebars.registerPartial('workflow_controls_usercards_impl_usercards.popover', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/controls/usercards/usercards.popover.view',[
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/controls/usercards/usercards.list.view',
  'hbs!workflow/controls/usercards/impl/usercards.popover',
  'css!workflow/controls/usercards/impl/usercard'
], function (require, $, _, Backbone, Marionette, PerfectScrollingBehavior, UsercardsListView, template) {
  

  var PopOverView = Marionette.LayoutView.extend({

    className: 'wfstatus-usercard-popover-class',
    template: template,
    tagName: 'div',

    constructor: function PopOverView(options) {

      options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.userCardListView = new UsercardsListView(this.options);
    },

    regions: {
      usercardPopover: ".wfstatus-usercard-popover-content"
    },

    events: {
      'click .wfstatus-user-search-icon': 'toggleSearchInput',
      'keyup .wfstatus-user-input': 'searchUser'
    },

    ui: {
      wfstatusUserInput: '.wfstatus-user-input'
    },

    behaviors: {

      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.wfstatus-usercard-popover-scrolling',
        suppressScrollX: true,
        scrollYMarginOffset: 16
      }
    },

    templateHelpers: function () {
      var utils           = require('workflow/utils/workitem.util'),
          groupDetails    = this.model.get('assignedto') ? this.model.get('assignedto') :
                            this.model.get('task_assignees') ?
                            this.model.get('task_assignees').assignedto : undefined,
          isGroup         = groupDetails !== undefined ? true : false,
          dueDate         = this.model.get('task_due_date') === null ? "" :
                            this.model.get('task_due_date'),
          status          = this.model.get('task_status') === null ? "" :
                            this.model.get('task_status'),
          statusOptions   = {
            dueDate: dueDate,
            status: status
          },
          formattedStatus = utils.formatStatus(statusOptions);

      return {
        groupName: isGroup === true ? groupDetails.groupName : '',
        isGroup: isGroup,
        status: formattedStatus.status
      };
    },

    onRender: function () {

      this.setPopoverSize();
      this.usercardPopover.show(this.userCardListView);
    },

    searchUser: function (e) {
      var searchVal      = e.currentTarget.value,
          userCollection = this.userCardListView.completeCollection,
          models;

      if (searchVal && searchVal.length > 0) {
        var keywords = searchVal.toLowerCase().split(' ');
        models = userCollection.filter(function (item) {
          var name      = item.get("name"),
              firstname = item.get("first_name"),
              lastname  = item.get("last_name");

          name = name ? name.trim().toLowerCase() : "";
          firstname = firstname ? firstname.trim().toLowerCase() : "";
          lastname = lastname ? lastname.trim().toLowerCase() : "";

          var isMatch = _.reduce(keywords, function (result, keyword) {
            return result && (name.indexOf(keyword) >= 0 || firstname.indexOf(keyword) >= 0 ||
                              lastname.indexOf(keyword) >= 0);
          }, true);
          return isMatch;
        });
      } else {
        // no filtering
        models = this.userCardListView.completeCollection.models;
      }
      this.userCardListView.Usercollection.reset(models);
    },

    toggleSearchInput: function () {
      if (this.ui.wfstatusUserInput.hasClass('binf-active')) {
        $('.wfstatus-user-input').hide();
        $('.wfstatus-usercard-popover-header-labels').show();
        this.ui.wfstatusUserInput.removeClass('binf-active');
      } else {
        $('.wfstatus-user-input').show();
        $('.wfstatus-usercard-popover-header-labels').hide();
        this.ui.wfstatusUserInput.addClass('binf-active');
      }
    },

    setPopoverSize: function () {

      var PopOverContentEle = this.$el.find(".wfstatus-usercard-popover-content.popover");
      if (this.model.get('assignedto')) {
        var assignees = this.model.get('assignedto').assignees ?
                        this.model.get('assignedto').assignees :
                        this.model.get('task_assignees').assignees;
        if (assignees) {
          switch (assignees.length) {
          case 1 :
            PopOverContentEle.addClass("small");
            break;
          case 2:
            PopOverContentEle.addClass("medium");
            break;
          }
        }
      } else {
        PopOverContentEle.addClass("small");
      }
    }
  });

  /**
   * Showing user card popover
   *
   * @param options - delegateTarget
   *                - UserCardviewOptions
   *                    - StatusModel
   *                    - context: context,
   *                    - originatingView,
   *                    - wfData: ('process_id', 'subprocess_id','task_id','userId')
   *
   */

  function ShowPopOver(options) {
    var Utils        = require('workflow/utils/workitem.util');
    Utils.unbindPopover(options);
    var globalConfig = initializePopover(options);
    bindEvents(options);
    setPopoverPointer(globalConfig);

  }

  /**
   * initilizing user card popover
   *
   * @param options - delegateTarget
   *                - UserCardviewOptions
   *                    - StatusModel
   *                    - context: context,
   *                    - originatingView,
   *                    - wfData: ('process_id', 'subprocess_id','task_id','userId')
   *
   */
  function initializePopover(options) {

    var userDialog,
        userDialogPointer,
        userDialogMask,
        parentNodeId,
        globalConfig     = {},
        uniqueID     = _.uniqueId(3),
        defaultContainer = $.fn.binf_modal.getDefaultContainer();

    userDialog = document.createElement('div');
    userDialog.id = 'wfstatus-usercard-popover_' + uniqueID;
    parentNodeId = "#wfstatus-usercard-popover_" + uniqueID;
    userDialog.setAttribute("class", "wfstatus-usercard-popover");

    userDialogPointer = document.createElement('div');
    userDialogPointer.id = 'wfstatus-usercard-popover-pointer_' + uniqueID;

    userDialogMask = document.createElement('div');
    userDialogMask.id = 'wfstatus-usercard-popover-mask_' + uniqueID;

    $(options.delegateTarget).css("overflow", "hidden");
    globalConfig.widgetDialog = userDialog;
    globalConfig.widgetDialogPointer = userDialogPointer;
    globalConfig.widgetDialogMask = userDialogMask;
    globalConfig.placeholder = options.delegateTarget;
    globalConfig.widgetBaseElement = options.delegateTarget;

    $(defaultContainer).append(userDialogMask).append(userDialog).append(
        userDialogPointer);

    var UserCardPopoverRegion = new Marionette.Region({
      el: parentNodeId
    });

    var popoverView = new PopOverView(options.UserCardviewOptions);
    UserCardPopoverRegion.show(popoverView);

    $(parentNodeId).css({display: "block"}).animate({opacity: 1.0});

    return globalConfig;
  }

  function bindEvents(options) {
    var Utils        = require('workflow/utils/workitem.util');
    $(".binf-modal-header").bind('keydown click',
        {callbackFun: Utils.unbindPopover, popoverOptions: options}, handlePopoverDialog);
    $(".binf-modal-backdrop").bind('keydown click',
        {callbackFun: Utils.unbindPopover, popoverOptions: options}, handlePopoverDialog);
    $(window).bind('resize.onUserCardPopOver', function () {
      Utils.unbindPopover(options);
    });
    $(window).bind('popstate.onUserCardPopOver', function () {
      Utils.unbindPopover(options);
    });
    $(window).bind('hashchange.onUserCardPopOver', function () {
      Utils.unbindPopover(options);
    });

    $(".wfstatus-table tbody").scroll(function() {
      Utils.unbindPopover(options);
    });
    $(document).off('focusin.binf.modal');
  }

  /**
   * Hnadling keyboard events when usercard popover is open
   * params event
   */
  function handlePopoverDialog(event) {

    var unbindWidgetFromBody = false,
        _e                   = event || window.event,
        options              = _e.data.popoverOptions;

    if (_e.type === 'popstate' || _e.type === 'hashchange') {
      unbindWidgetFromBody = true;
    }
    else if ((_e.type === 'keyup' || _e.type === 'keydown')) {

      if ((_e.keyCode === 27 || _e.which === 27)) {
        if ($('.wfstatus-usercard-popover').is(':visible') && $('.cs-dialog').is(':visible')) {
          unbindWidgetFromBody = true;
        }
        setFocusOnTargetEle();
      }
    }
    else if (_e.type === "resize") {
      if ($('.wfstatus-usercard-popover').is(':visible') && $('.cs-dialog').is(':visible')) {
        unbindWidgetFromBody = true;
      }
      setFocusOnTargetEle();
    } else {
      if (!$(_e.target).closest('.wfstatus-usercard-popover').length && _e.type === 'click') {
        if (!($(_e.target).closest('[id*=wfstatus-usercard-popover]').length &&
            !$(_e.target).closest('[id*=wfstatus-usercard-popover-mask_]').length) &&
            !$(_e.target).closest('[class*=ui-autocomplete]').length) {
          unbindWidgetFromBody = true;
        }
      }

    }
    unbindWidgetFromBody ? _e.data.callbackFun(options) : "";

    function setFocusOnTargetEle() {
      if (options) {
        var element = options.popoverOptions;
        if (_e.type === 'keydown') {
          $(element).on('keyup', function (e) {
            if ($(element).is(':focus')) {
              $(element).off('keyup');
              e.stopPropagation();
            }
          });
        }
        if (element) {
          element.focus();
          setTimeout(function () {
            element.focus();
          }, 1);
        }
      }
    }
  }

  /**
   * Below function used for auto Adjustment of usercard popover pointer.
   *
   * @param globalConfig - widgetDialog
   *                     - widgetDialogPointer
   *                     - widgetBaseElement
   *
   */
  function setPopoverPointer(globalConfig) {

    var widgetDialog        = $(globalConfig.widgetDialog),
        widgetDialogPointer = $(globalConfig.widgetDialogPointer),
        widgetBaseElement   = $(globalConfig.widgetBaseElement),
        setDialogCenter     = false;

    globalConfig.widgetBaseElement = $(globalConfig.widgetBaseElement).width() === 0 ?
                                     $("[data-value=" +
                                       $(globalConfig.widgetBaseElement).attr("data-value") +
                                       "]") : globalConfig.widgetBaseElement;

    widgetDialog.css({"position": "absolute", "left": "0", "top": "0"});
    widgetDialogPointer.css({"position": "absolute", "left": "0", "top": "0"})
        .addClass("wfstatus-usercard-popover-arrow-left");

    var leftPos = parseInt(widgetBaseElement.outerWidth() + 10, 10);
    widgetDialog.position({
      my: "left top",
      at: "left+" + leftPos + " top -" + (widgetBaseElement.parent().height() / 2),
      of: globalConfig.widgetBaseElement,
      collision: "flipfit flipfit"
    });

    var widgetDialogLeftPos  = widgetDialog.offset().left,
        widgetDialogRightPos = widgetDialog.offset().left + widgetDialog.width(),
        targetElementLeftPos = widgetBaseElement.offset().left,
        targetElementTopPos  = widgetBaseElement.offset().top + 10,
        baseWrapsParent      = widgetBaseElement.parent().height() ===
                               widgetBaseElement.height();
    if (baseWrapsParent) {
      // if the assignee's cell height and it's parent element's heights are equal,
      // then usercard popover's top should consider wrapper element's height
      targetElementTopPos = widgetBaseElement.offset().top +
                            Math.ceil(widgetBaseElement.height() / 4) + 2;
    }
    if (widgetDialogLeftPos < targetElementLeftPos) {
      widgetDialogPointer.css({
        "position": "absolute",
        "left": widgetDialogRightPos,
        "top": targetElementTopPos
      });

      widgetDialogPointer.removeClass("wfstatus-usercard-popover-arrow-left").addClass(
          "wfstatus-usercard-popover-arrow-right");

      setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                        1 > widgetBaseElement.offset().left;
    } else {
      widgetDialogPointer.css({
        "position": "absolute",
        "left": widgetDialogLeftPos - 10,
        "top": targetElementTopPos
      });
      widgetDialogPointer.removeClass("wfstatus-usercard-popover-arrow-right").addClass(
          "wfstatus-usercard-popover-arrow-left");

      setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                        1 < (widgetBaseElement.offset().left + widgetBaseElement.width());
    }

    var widgetDialogBottomPos        = widgetDialog.offset().top + widgetDialog.height(),
        widgetDialogPointerBottomPos = widgetDialogPointer.offset().top + 25;
    if (widgetDialogBottomPos < widgetDialogPointerBottomPos) {
      widgetDialog.css("top",
          parseInt(widgetDialog.offset().top + (baseWrapsParent ? 0 : 20), 10));
    } else if (widgetDialogBottomPos - widgetDialogPointerBottomPos > 20) {
      widgetDialog.css("top",
          parseInt(widgetDialog.offset().top - (baseWrapsParent ? 0 : 20), 10));
    }
    if (setDialogCenter) {
      widgetDialog.css({"left": $(window).width() / 2 - widgetDialog.width() / 2});
      widgetDialogPointer.css({"opacity": "0"});
    } else {
      widgetDialogPointer.css({"opacity": "1"});
    }
  }

  return {
    ShowPopOver: ShowPopOver
  };
});


/* START_TEMPLATE */
csui.define('hbs!workflow/controls/stepcards/impl/stepcard',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"wfstatus-step-assignee\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.assignee || (depth0 != null ? depth0.assignee : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"assignee","hash":{}}) : helper)))
    + "\">\r\n      "
    + this.escapeExpression(((helper = (helper = helpers.assignee || (depth0 != null ? depth0.assignee : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"assignee","hash":{}}) : helper)))
    + "\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"wfstatus-step-info\" taskId=\""
    + this.escapeExpression(((helper = (helper = helpers.task_id || (depth0 != null ? depth0.task_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"task_id","hash":{}}) : helper)))
    + "\">\r\n  <div class=\"wfstatus-type-icon\">\r\n    <span class=\"wfstatus-title-icon wfstatus-"
    + this.escapeExpression(((helper = (helper = helpers.stepIcon || (depth0 != null ? depth0.stepIcon : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stepIcon","hash":{}}) : helper)))
    + "-step-icon\" aria-hidden=\"true\"></span>\r\n  </div>\r\n  <div class=\"wfstatus-step-header\">\r\n    <div class=\"wfstatus-step-name\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.stepName || (depth0 != null ? depth0.stepName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stepName","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.stepName || (depth0 != null ? depth0.stepName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"stepName","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"wfstatus-step-duedate\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.dueDate || (depth0 != null ? depth0.dueDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDate","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.dueDate || (depth0 != null ? depth0.dueDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDate","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.assignee : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  <div class=\"wfstatus-stepcard-action\">\r\n    <div class=\"wfstatus-open-workflow-button\">\r\n            <span><button class=\"binf-btn binf-btn-default\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.OpenWorkflowLabel || (depth0 != null ? depth0.OpenWorkflowLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"OpenWorkflowLabel","hash":{}}) : helper)))
    + "\"\r\n                          tabindex=\"0\">"
    + this.escapeExpression(((helper = (helper = helpers.OpenWorkflowLabel || (depth0 != null ? depth0.OpenWorkflowLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"OpenWorkflowLabel","hash":{}}) : helper)))
    + "</button>\r\n            </span>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n";
}});
Handlebars.registerPartial('workflow_controls_stepcards_impl_stepcard', t);
return t;
});
/* END_TEMPLATE */
;
// Lists explicit locale mappings and fallbacks

csui.define('workflow/controls/stepcards/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('workflow/controls/stepcards/nls/root/lang',{
  OpenWorkflow: 'Open Workflow',
  NoStepAvailable: 'The next step is dependent on the user action in the Current Step or there are multiple steps possible'
});



csui.define('css!workflow/controls/stepcards/impl/stepcard',[],function(){});
csui.define('workflow/controls/stepcards/stepcard.view',['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'workflow/controls/usercards/usercards.popover.view',
  'hbs!workflow/controls/stepcards/impl/stepcard',
  'i18n!workflow/controls/stepcards/nls/lang',
  'css!workflow/controls/stepcards/impl/stepcard'
], function (require, $, _, Backbone, Marionette, ConnectorFactory, UsercardsPopoverView, Template,
    Lang) {
  

  var StepCardView = Marionette.ItemView.extend({

    template: Template,

    className: 'wfstatus-stepcard',

    constructor: function WFStatusStepCardView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.stepCardsListView = this.options.stepCardsListView;
      this.model.connector = this.options.context.getObject(ConnectorFactory, this.options);
      this.listenTo(this.model, 'change', this.render);
    },

    templateHelpers: function () {

      var data         = {},
          assigneeData = this.model.get('task_assignees'),
          utils        = require('workflow/utils/workitem.util');

      var stepName        = this.model.get('task_name') === null ? "" :
                            this.model.get('task_name'),
          dueDate         = this.model.get('task_due_date') === null ? "" :
                            this.model.get('task_due_date'),
          status          = this.model.get('task_status') === null ? "" :
                            this.model.get('task_status'),
          assignee        = '',
          taskId          =  this.model.get('task_id'),
          statusOptions         = {
            dueDate: dueDate,
            status: status
          },
          formattedStatus = utils.formatStatus(statusOptions);
      if (assigneeData !== null) {
        assigneeData.assignees = assigneeData.assignee;
        assignee = utils.getAssignee(assigneeData);
      }

      data = {
        taskId: taskId,
        dueDate: formattedStatus.status,
        stepName: stepName,
        assignee: assignee,
        stepIcon: status
      };

      _.extend(data, {OpenWorkflowLabel: Lang.OpenWorkflow});
      return data;
    },

    events: {
      'click .wfstatus-step-assignee': 'showUserPopOver'
    },

    showUserPopOver:function () {
      var taskAssignees = this.model.get("task_assignees"),
          assignees      = taskAssignees.assignee,
          context        = this.options.context,
          userCardOffset = $('.wfstatusitem-step-cards').position().top;

      if (userCardOffset) {
        $('.wfstatusitem-user-cards').css({"top": userCardOffset});
      }

      this.model.unset("userId");
      this.model.unset("assignedto");

      if (assignees.length === 1) {
        this.model.set("userId", assignees[0].userId);
      } else {
        this.model.set("assignedto", taskAssignees.assignedto);
      }

      var assigneeOptions = {
        model: this.model,
        nodeModel: this.model,
        context: context,
        originatingView: this.options.cellView,
        currentView: this,
        stepCardsListView: this.stepCardsListView,
        stepType: this.options.stepType,
        wfData: _.pick(this.model.attributes, 'process_id', 'subprocess_id', 'task_id', 'userId')
      };

      var popoverOptions      = {
            delegateTarget: this.$el,
            UserCardviewOptions: assigneeOptions
          };
      if (assignees.length !== 0) {
        UsercardsPopoverView.ShowPopOver(popoverOptions);
      }

    }

  });

  return StepCardView;

})
;

/* START_TEMPLATE */
csui.define('hbs!workflow/controls/stepcards/impl/stepcard.empty',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"wfstatus-step-info\">\r\n\r\n  <div class=\"wfstatus-step-header\">\r\n    <div class=\"wfstatus-empty-message\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.NoStepAvailable : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.messages : depth0)) != null ? stack1.NoStepAvailable : stack1), depth0))
    + "</div>\r\n  </div>\r\n\r\n</div>\r\n\r\n\r\n";
}});
Handlebars.registerPartial('workflow_controls_stepcards_impl_stepcard.empty', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/controls/stepcards/stepcard.empty.view',['csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!workflow/controls/stepcards/nls/lang',
  'hbs!workflow/controls/stepcards/impl/stepcard.empty',
  'css!workflow/controls/stepcards/impl/stepcard'
], function (_, Marionette, lang, StepCardEmptyTemplate) {
  
  var EmptyStepCardView = Marionette.ItemView.extend({
    template: StepCardEmptyTemplate,
    className: 'wfstatus-stepcard',
    templateHelpers: function () {
      return {
        messages: {
          NoStepAvailable: lang.NoStepAvailable
        }
      };
    },
    constructor: function EmptyStepCardView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return EmptyStepCardView;
});

/* START_TEMPLATE */
csui.define('hbs!workflow/controls/stepcards/impl/stepcards',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wfstatus-stepcards\"></div>\r\n";
}});
Handlebars.registerPartial('workflow_controls_stepcards_impl_stepcards', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/controls/stepcards/stepcards.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'workflow/controls/stepcards/stepcard.view',
  'workflow/controls/stepcards/stepcard.empty.view',
  'hbs!workflow/controls/stepcards/impl/stepcards',
  'css!workflow/controls/stepcards/impl/stepcard'
], function (_, Marionette, StepcardView, StepCardsEmptyView, template) {
  

  var StepcardCollectionView = Marionette.CompositeView.extend({

    childView: StepcardView,
    childViewOptions: function () {
      return {
        context: this.options.context,
        cellView: this.options.cellView,
        wfStatusInfoModel: this.options.wfStatusInfoModel,
        stepCardsListView: this.options.stepCardsListView,
        stepType: this.options.stepType
      };
    },
    emptyView: StepCardsEmptyView,
    className: 'wfstatus-stepcards-view binf-col-md-12 binf-col-sm-9 binf-col-xs-12',
    template: template,

    constructor: function StepcardCollectionView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    }

  });

  return StepcardCollectionView;
});


/* START_TEMPLATE */
csui.define('hbs!workflow/controls/stepcards/impl/stepcards.list',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wfstatus-stepcard-list\"></div>";
}});
Handlebars.registerPartial('workflow_controls_stepcards_impl_stepcards.list', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/controls/stepcards/stepcards.list.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/models/nodes',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/controls/stepcards/stepcard.view',
  'workflow/controls/stepcards/stepcards.view',
  'hbs!workflow/controls/stepcards/impl/stepcards.list',
  'css!workflow/controls/stepcards/impl/stepcard'
], function ($, _, Backbone, Marionette,
    NodeCollection, PerfectScrollingBehavior, StepcardView, StepcardCollectionView,
    template) {
  
  var StepcardsListView = Marionette.LayoutView.extend({

    childView: StepcardView,
    className: 'wfstatus-stepcard-layout',
    template: template,
    tagName: 'div',

    behaviors: {
      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.wfstatus-stepcard-list',
        suppressScrollX: true
      }
    },

    regions: {
      stepcardLayout: ".wfstatus-stepcard-list"
    },

    constructor: function StepcardsListView(options) {
      options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
        this.stepcollection = new NodeCollection(this.options.step_list, {});
        this.stepcardCollectionView = new StepcardCollectionView({
          collection: this.stepcollection,
          context: this.options.context,
          cellView: this.options.cellView,
          stepCardsListView : this,
          wfStatusInfoModel: this.options.wfStatusInfoModel,
          stepType: this.options.stepType
        });
        this.stepcardLayout.show(this.stepcardCollectionView);
      }

  });
  return StepcardsListView;
});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/wfstatus/impl/wfstatusitem.body',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "      <span class=\"wfstatusitem-enddate\">"
    + this.escapeExpression(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startDate","hash":{}}) : helper)))
    + "</span> - <span\r\n        class=\"wfstatusitem-enddate\">"
    + this.escapeExpression(((helper = (helper = helpers.endDate || (depth0 != null ? depth0.endDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"endDate","hash":{}}) : helper)))
    + "</span>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"wfstatusitem-step\">\r\n      <div class=\"wfstatusitem-step-row\">\r\n        <span class=\"wfstatusitem-step-left-label\">  </span>\r\n        <div type=\"next\" class=\"wfstatusitem-step-circle wfstatusitem-link\r\n      wfstatusitem-next-step-icon\"></div>\r\n        <span type=\"next\" class=\"wfstatusitem-step-right-label wfstatusitem-next-step-label\">\r\n          "
    + this.escapeExpression(((helper = (helper = helpers.nextStepLabel || (depth0 != null ? depth0.nextStepLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"nextStepLabel","hash":{}}) : helper)))
    + "</span>\r\n      </div>\r\n      <div class=\"wfstatusitem-bar\"></div>\r\n    </div>\r\n    <div class=\"wfstatusitem-step\">\r\n      <div class=\"wfstatusitem-step-row\">\r\n        <span class=\"wfstatusitem-step-left-label\">"
    + this.escapeExpression(((helper = (helper = helpers.currentStepDate || (depth0 != null ? depth0.currentStepDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"currentStepDate","hash":{}}) : helper)))
    + " </span>\r\n        <div type=\"current\" class=\"wfstatusitem-step-circle wfstatusitem-link\r\n      wfstatusitem-current-step-icon\"></div>\r\n        <span type=\"current\" class=\"wfstatusitem-step-right-label wfstatusitem-current-step-label\">\r\n          "
    + this.escapeExpression(((helper = (helper = helpers.currentStepLabel || (depth0 != null ? depth0.currentStepLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"currentStepLabel","hash":{}}) : helper)))
    + " </span>\r\n      </div>\r\n      <div class=\"wfstatusitem-bar\"></div>\r\n    </div>\r\n";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"wfstatusitem-step\">\r\n      <div class=\"wfstatusitem-step-row\">\r\n        <span class=\"wfstatusitem-step-left-label\"> </span>\r\n        <div type=\"completed\" class=\"wfstatusitem-step-circle wfstatusitem-link\r\n      wfstatusitem-completed-step-icon\"></div>\r\n        <span type=\"completed\"\r\n              class=\"wfstatusitem-step-right-label wfstatusitem-completed-step-label\">\r\n          "
    + this.escapeExpression(((helper = (helper = helpers.completedStepLabel || (depth0 != null ? depth0.completedStepLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"completedStepLabel","hash":{}}) : helper)))
    + "</span>\r\n      </div>\r\n      <div class=\"wfstatusitem-bar\"></div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"wfstatusitem-progressbar\">\r\n\r\n  <div class=\"wfstatusitem-date\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showDateHeader : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "  </div>\r\n  <div class=\"wfstatusitem-step\">\r\n    <div class=\"wfstatusitem-step-row\">\r\n      <span class=\"wfstatusitem-step-left-label\"> "
    + this.escapeExpression(((helper = (helper = helpers.panelEndDate || (depth0 != null ? depth0.panelEndDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"panelEndDate","hash":{}}) : helper)))
    + " </span>\r\n      <div class=\"wfstatusitem-step-circle\"></div>\r\n      <span class=\"wfstatusitem-step-right-label\"> "
    + this.escapeExpression(((helper = (helper = helpers.endLabel || (depth0 != null ? depth0.endLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"endLabel","hash":{}}) : helper)))
    + " </span>\r\n    </div>\r\n    <div class=\"wfstatusitem-bar\"></div>\r\n  </div>\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showCurrent : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showCompleted : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  <div class=\"wfstatusitem-step\">\r\n    <div class=\"wfstatusitem-step-row\">\r\n      <span class=\"wfstatusitem-step-left-label\"> "
    + this.escapeExpression(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startDate","hash":{}}) : helper)))
    + " </span>\r\n      <div class=\"wfstatusitem-step-circle\"></div>\r\n      <span class=\"wfstatusitem-step-right-label\"> "
    + this.escapeExpression(((helper = (helper = helpers.startLabel || (depth0 != null ? depth0.startLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startLabel","hash":{}}) : helper)))
    + " </span>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n<div class=\"wfstatusitem-step-cards\"></div>\r\n<div class=\"wfstatusitem-user-cards\"></div>\r\n";
}});
Handlebars.registerPartial('workflow_widgets_wfstatus_impl_wfstatusitem.body', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/widgets/wfstatus/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('workflow/widgets/wfstatus/impl/nls/root/lang',{
  months: ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"],
  dialogTitle: 'Workflow Tracking',
  emptyListText: 'There are no items to display',
  totalMsg: 'Total',
  onTime: 'On time',
  completed: 'Completed',
  late: 'Late',
  expandLabel: 'Expand',
  dueDateLabel: 'Due date',
  currentStepNameLabel: 'Current step',
  assignedToLabel: 'Assigned to',
  startDateLabel: 'Start date',
  startedLabel: 'Started',
  statusLabel:'Status',
  initiatorLabel:'Initiator',
  wfNameLabel: 'Workflow name',
  NameLabel:'Name',
  allFilterLabel: 'All',
  completedFilterLabel: 'Completed',
  lateFilterLabel: 'Late',
  ontimeFilterLabel: 'On Time',
  headerFilterTitle: 'Refine by',
  headerFilterLabel: 'Show items with status',
  days: 'days',
  day: 'day',
  dueInLabel: 'due in',
  dueLabel: 'due',
  todayLabel: 'today',
  details:'Details',
  attachments:'Attachments',
  startLabel: 'Start',
  endLabel: 'End',
  currentStepLabel: 'Current Step',
  nextStepLabel: 'Next Step',
  completedStepLabel: 'Completed Step',
  currentStepsLabel: 'Current Steps',
  completedStepsLabel: 'Completed Steps'
});



csui.define('css!workflow/widgets/wfstatus/impl/wfstatus.progress',[],function(){});
csui.define('workflow/widgets/wfstatus/impl/wfstatusitem.body.view',[
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'workflow/controls/stepcards/stepcards.list.view',
  'hbs!workflow/widgets/wfstatus/impl/wfstatusitem.body',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'css!workflow/widgets/wfstatus/impl/wfstatus.progress'
], function (require, $, _, Marionette, StepcardsListView,
    template, lang) {
  

  var WFStatusItemBodyView = Marionette.LayoutView.extend({

    template: template,

    className: 'wfstatusitem-content',

    constructor: function WFStatusItemBodyView(options) {
      this.options = options;
      this.model = options.model;
      this.defaults =  {
         currentStepPosition : 191
      };
      $(window).bind("resize.app", this.adjustStepCardPosition);
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    ui: {
      nodeIcon: '.wfstatusitem-step-circle',
      nodeLabel: '.wfstatusitem-step-right-label',
      currentStepIcon: '.wfstatusitem-current-step-icon',
      completedStepIcon: '.wfstatusitem-completed-step-icon',
      nextStepIcon: '.wfstatusitem-next-step-icon',
      currentStepLabel: '.wfstatusitem-current-step-label',
      completedStepLabel: '.wfstatusitem-completed-step-label',
      nextStepLabel: '.wfstatusitem-next-step-label',
      stepCard: '.wfstatus-step-info'
    },

    events: {
      'click @ui.currentStepIcon, @ui.currentStepLabel,@ui.completedStepIcon,@ui.completedStepLabel, @ui.nextStepIcon, @ui.nextStepLabel': 'onClickStep',
      'click .wfstatus-stepcard': 'makeStepCardActive'
    },

    regions: {
      progressbar: '.wfstatusitem-progressbar',
      stepcards: '.wfstatusitem-step-cards'
    },

    templateHelpers: function () {

      var utils             = require('workflow/utils/workitem.util'),
          details           = this.model.get('details'),
          showDateHeader    = details.date_initiated && details.end_date,
          stepList          = this.model.get('step_list'),
          currentStepList   = stepList && stepList.current,
          completedStepList = stepList && stepList.completed,
          currentStepDate   = (currentStepList && currentStepList.length >= 1) ?
                              utils.dateConversion(currentStepList[0].task_start_date, 'Month DD') :
                              '',
          panelDate         = showDateHeader ?
                              this.getDateHeader(details.start_date, details.end_date) : "";

      return {
        "startLabel": lang.startLabel,
        "endLabel": lang.endLabel,
        "currentStepLabel": (currentStepList && currentStepList.length > 1) ?
                            lang.currentStepsLabel : lang.currentStepLabel,
        "nextStepLabel": lang.nextStepLabel,
        "completedStepLabel": (completedStepList && completedStepList.length > 1) ?
                              lang.completedStepsLabel : lang.completedStepLabel,
        "wfName": details.wf_name,
        "startDate": panelDate ? panelDate.startDate : "",
        "panelStartDate": details.date_initiated,
        "currentStepDate": currentStepDate,
        "endDate": panelDate ? panelDate.endDate : "",
        "panelEndDate": details.end_date === "" ? "" : utils.dateConversion(details.end_date, 'Month DD'),
        "dueDate": details.due_date,
        "status": details.status_key,
        "assignee": details.assignee,
        "userId": details.userId,
        "showDateHeader": showDateHeader,
        "showCompleted":(completedStepList && completedStepList.length !== 0) ? true : false,
        "showCurrent":(currentStepList && currentStepList.length !== 0) ? true : false
      };
    },

    getDateHeader: function (startDate, endDate) {
      var startDateValue = new Date(startDate),
          endDateValue   = new Date(endDate),
          utils          = require('workflow/utils/workitem.util'),
          dateHeader     = {};
      dateHeader.endDate = utils.dateConversion(endDate);

      if (startDateValue.getFullYear() === endDateValue.getFullYear()) {
        dateHeader.startDate = utils.dateConversion(startDate, 'Month DD');
      } else {
        dateHeader.startDate = utils.dateConversion(startDate);
      }
      return dateHeader;
    },
    makeStepCardActive:function(event){

      if ($('.wfstatus-stepcard.active').length > 0) {
        $($('.wfstatus-stepcard-layout .wfstatus-title-icon')[0]).removeClass('active');
        var $prevActiveEle = $('.wfstatus-stepcard.active')[0];
        $($prevActiveEle).removeClass('active');
      }

      $(event.currentTarget).addClass('active');
    },

    onClickStep: function (event) {
      var Utils = require('workflow/utils/workitem.util');
      Utils.unbindPopover();
      this.removeFocusIcons();
      var currentAction = (event && event.currentTarget) ?
                          event.currentTarget.getAttribute('type') : event,
          position, top, stepList, stepOptions, stepCardHeight;
      this.currentAction = currentAction;

      if(currentAction){
        switch(currentAction){
        case 'current':
          this.showArrow(this.ui.currentStepIcon, this.ui.currentStepLabel);
          position = this.ui.currentStepLabel.position();
          break;
        case 'completed':
          this.showArrow(this.ui.completedStepIcon, this.ui.completedStepLabel);
          position = this.ui.completedStepLabel.position();
          break;
        case 'next':
          this.showArrow(this.ui.nextStepIcon, this.ui.nextStepLabel);
          position = this.ui.nextStepLabel.position();
          break;
        }

        stepList    = this.model.get('step_list')[currentAction];
        stepOptions = {
              "step_list": stepList,
              "context": this.options.context,
              "cellView":this.options.cellView,
              "wfStatusInfoModel": this.model,
              "stepType": currentAction
            };

        this.stepcardsListView = new StepcardsListView(stepOptions);
        this.stepcards.show(this.stepcardsListView);
        top = position.top ;
        stepCardHeight = $('.wfstatus-stepcard').height();
        if(top !== 0) {
          top = top -( stepCardHeight / 2 ) + 14;
        }else{
          top = this.defaults.currentStepPosition;
        }
        $('.wfstatusitem-step-cards').css({"top": top});

        var stepCardListHeight = (top / 16) + 13;
        $('.wfstatus-stepcard-list').css({"height": "calc(100vh - " + stepCardListHeight + "rem)"});
        this.makeDefaultStepCardActive();
      }
    },

    makeDefaultStepCardActive: function () {
      if ($('.wfstatusitem-focus-arrow').length > 0) {
        $($('.wfstatus-stepcard')[0]).addClass('active');
        $($('.wfstatus-stepcard-layout .wfstatus-title-icon')[0]).addClass('active');
      }
    },

    adjustStepCardPosition: function (noOfNodes) {
   
      var progressNodeHeight = $($('.wfstatusitem-body'))[0].offsetHeight;
      if(typeof(noOfNodes) === "object"){
          noOfNodes = $('.wfstatusitem-bar').length;
      }
      $('.wfstatusitem-progressbar .wfstatusitem-bar').css({"height":(progressNodeHeight - 250)/ noOfNodes});
      $('.wfstatusitem-step-cards').css({'top': $('.wfstatusitem-focus-arrow')[0].offsetTop - 30});
      $('.wfstatus-progress-view').css({"opacity": '1'});
      var top = $('.wfstatusitem-focus-arrow')[0].offsetTop - 30;
      var stepCardListHeight = (top / 16) + 13;
      $('.wfstatus-stepcard-list').css({"height": "calc(100vh - " + stepCardListHeight + "rem)"});
    },

    removeFocusIcons: function () {
      if (this.stepcardsListView) {
        this.stepcardsListView.destroy();
      }

      this.ui.nodeIcon.removeClass("wfstatusitem-focus-icon");
      this.ui.nodeLabel.removeClass("wfstatusitem-focus-arrow");
    },

    showArrow: function (stepIcon, stepLabel) {
      if (stepIcon && stepLabel) {
        stepIcon.addClass("wfstatusitem-focus-icon");
        stepLabel.addClass("wfstatusitem-focus-arrow");
      }
    }
  });

  return WFStatusItemBodyView;

});


csui.define('workflow/models/wfstatus/tabpanel.model',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone'
   
  ], function ($, _, Backbone) {
  

  var TabpanelModel = Backbone.Model.extend({

    constructor: function TabpanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var TabpanelCollection = Backbone.Collection.extend({
    model: TabpanelModel,

    constructor: function TabpanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  return TabpanelCollection;

});

// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/wfstatus/impl/wfstatusitem.tabpanel.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/utils/contexts/factories/node',
  'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.view'
], function (_, $, Backbone, Marionette, log, NodeModelFactory, TabpanelView, TabLinkCollectionViewExt) {
  

  var WFStatusItemTabPanelView = TabpanelView.extend({

    contentView: function (model) {
      return model.get('viewToRender');
    },

    contentViewOptions: function (model) {
      return model.get('viewToRenderOptions');
    },

    constructor: function WFStatusItemTabPanelView(options){
      _.defaults(options, {
        tabType: 'binf-nav-pills',
        delayTabContent: false,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt
      });

      // initialize parent
      TabpanelView.prototype.constructor.apply(this, arguments);

    }
  });


  return WFStatusItemTabPanelView;
});



/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/wfstatus/impl/wfstatusitem.details',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class='wfstatusitem-details'>\r\n\r\n  <div class=\"wfstatusitem-details-rec\">\r\n    <div class=\"wfstatusitem-details-label\">"
    + this.escapeExpression(((helper = (helper = helpers.NameLabel || (depth0 != null ? depth0.NameLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"NameLabel","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"wfstatusitem-details-value\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.wfName || (depth0 != null ? depth0.wfName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"wfName","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.wfName || (depth0 != null ? depth0.wfName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"wfName","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n\r\n  <div class=\"wfstatusitem-details-rec\">\r\n    <div class=\"wfstatusitem-details-label\">"
    + this.escapeExpression(((helper = (helper = helpers.dueDateLabel || (depth0 != null ? depth0.dueDateLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDateLabel","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"wfstatusitem-details-value\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.dueDate || (depth0 != null ? depth0.dueDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDate","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.dueDate || (depth0 != null ? depth0.dueDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDate","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n\r\n  <div class=\"wfstatusitem-details-rec\">\r\n    <div class=\"wfstatusitem-details-label\">"
    + this.escapeExpression(((helper = (helper = helpers.statusLabel || (depth0 != null ? depth0.statusLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"statusLabel","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"wfstatusitem-details-value\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"status","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n\r\n  <div class=\"wfstatusitem-details-rec\">\r\n    <div class=\"wfstatusitem-details-label\">"
    + this.escapeExpression(((helper = (helper = helpers.initiatorLabel || (depth0 != null ? depth0.initiatorLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"initiatorLabel","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"wfstatusitem-details-value\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.initiator || (depth0 != null ? depth0.initiator : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"initiator","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"wfstatusitem-mini-profile-avatar\">\r\n         <span class=\"wfstatus-mini-profile-pic\">\r\n             <div class=\"image_user_placeholder wfstatusitem-userprofile-default-avatar binf-hidden\"\r\n                  title=\""
    + this.escapeExpression(((helper = (helper = helpers.initiator || (depth0 != null ? depth0.initiator : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"initiator","hash":{}}) : helper)))
    + "\"></div>\r\n             <img id=\"wfstatusitem-mini-profile-pic-"
    + this.escapeExpression(((helper = (helper = helpers.userId || (depth0 != null ? depth0.userId : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"userId","hash":{}}) : helper)))
    + "\"\r\n                  class=\"wfstatusitem-userprofile-img\r\n             binf-img-circle-show binf-hidden\" >\r\n         </span>\r\n      </span>\r\n      "
    + this.escapeExpression(((helper = (helper = helpers.initiator || (depth0 != null ? depth0.initiator : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"initiator","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n\r\n  <div class=\"wfstatusitem-details-rec\">\r\n    <div class=\"wfstatusitem-details-label\">"
    + this.escapeExpression(((helper = (helper = helpers.startedLabel || (depth0 != null ? depth0.startedLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startedLabel","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"wfstatusitem-details-value\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startDate","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startDate","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n\r\n</div>\r\n";
}});
Handlebars.registerPartial('workflow_widgets_wfstatus_impl_wfstatusitem.details', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/widgets/wfstatus/impl/wfstatusitem.details.view',[
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/url',
  'workflow/models/wfstatus/usercard.model',
  'hbs!workflow/widgets/wfstatus/impl/wfstatusitem.details',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (require, $, _, Marionette, Url, UserCardModel, template, lang) {

  

  var WFStatusItemDetailsView = Marionette.LayoutView.extend({

    template: template,

    ui: {
      userIcon: '.wfstatusitem-userprofile-img',
      defaultUserIcon: '.wfstatusitem-userprofile-default-avatar'
    },

    constructor: function WFStatusItemDetailsView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, arguments);
      this.model = options.model;
      this.details = options.model.get('details');
      this.photoUrl = null;
      var self = this;
      if (this.details.userId) {
        new UserCardModel({
          userId: this.details.userId,
          connector: this.model.connector
        }).fetch().done(function (response) {
          var Utils    = require('workflow/utils/workitem.util'),
              userData = response.results.data.properties,
              photoElement = $("#wfstatusitem-mini-profile-pic-" + userData.id);

          if (userData.photo_url === null) {
            self.ui.defaultUserIcon.removeClass('binf-hidden');
          } else {
            self.model.set('photo_url', userData.photo_url);
            Utils.showProfilePic(self.model).done(function (response) {
              var photoUrl     = URL.createObjectURL(response);
              self.ui.userIcon.removeClass('binf-hidden');
              photoElement.attr("src", photoUrl);
            }).fail(function () {
              self.ui.userIcon.addClass('binf-hidden');
            });
          }
        });
      }
    },

    templateHelpers: function () {

      var details = this.details;
      return {
        "NameLabel": lang.NameLabel,
        "dueDateLabel": lang.dueDateLabel,
        "statusLabel": lang.statusLabel,
        "initiatorLabel": lang.initiatorLabel,
        "startedLabel": lang.startedLabel,
        "wfName": details.wf_name,
        "startDate": details.date_initiated,
        "dueDate": details.due_date,
        "status": details.status_key,
        "initiator": details.initiator,
        "userId": details.userId
      };
    }

  });

  return WFStatusItemDetailsView;

});

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/wfstatus/impl/wfstatusitem.attachments',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class='wfstatusitem-attachments'></div>";
}});
Handlebars.registerPartial('workflow_widgets_wfstatus_impl_wfstatusitem.attachments', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/widgets/wfstatus/impl/wfstatusitem.attachments.view',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/models/nodechildren',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/contexts/factories/node',
  'csui/controls/progressblocker/blocker',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentlist.view',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'hbs!workflow/widgets/wfstatus/impl/wfstatusitem.attachments',
  'css!workflow/widgets/wfstatus/impl/wfstatus.progress'
], function ($, _, Marionette, NodeChildrenCollection, GlobalMessage, NodeModelFactory, BlockingView,
    PerfectScrollingBehavior, WorkItemAttachmentList, lang, AttachmentsLang, template) {
  

  var WFStatusItemAttachmentsView = Marionette.LayoutView.extend({

    template: template,

    ui: {
      wfAttachments: '.wfstatusitem-attachments'
    },

    regions: {
      attachmentsRegion: '.wfstatusitem-attachments'
    },

    constructor: function WFStatusItemAttachmentsView(options) {
      this.options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.model = options.model ? options.model : {};
    },

    behaviors: {
      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.wfstatusitem-attachments',
        suppressScrollX: true
      }
    },

    onRender: function () {

      //Block this view until all attachements completely loaded, unblocking is done in
      // success, error callbacks
      BlockingView.imbue(this);
      this.blockActions();
      this.model.set("isWFStatusItemAttachment", true);
      this.renderAttachments();

    },
    renderAttachments: function () {

      var attachments         = this.model.get('attachments'),
          attachmentFolderNode = this.options.context.getModel(NodeModelFactory,
              {attributes: {id: attachments.attachment_folder_id}});

      this.attachmentCollection = new NodeChildrenCollection(undefined, {
        node: attachmentFolderNode,
        includeActions: false,
        delayRestCommands: true,
        expand: ['node'],
        commands: ["default", "open"]
      });

      this.attachmentCollection.fetch()
          .done(_.bind(function () {
            if (this.attachmentCollection.length > 0) {
              var attachmentCount = this.attachmentCollection.length;
              $('li').has('a[title="Attachments"]').append( "<span class='cs-tablink-text'>" + attachmentCount + "</span>" );
              this.attachments = new WorkItemAttachmentList({
                context: this.options.context,
                collection: this.attachmentCollection,
                view: this
              });
              this.attachments.render();
              this.attachmentCollection.delayedActions.fetch()
                  .done(_.bind(function () {
                    this.attachmentsRegion.show(this.attachments);
                  }, this));
            }
          }, this))
          .fail(_.bind(function () {
            //show error message
            GlobalMessage.showMessage('error', AttachmentsLang.ErrorMessageLoadAttachments);
          }, this))
          .always(_.bind(function () {
            this.unblockActions();
          }, this));

    }
  });

  return WFStatusItemAttachmentsView;

});

csui.define('workflow/models/wfstatus/wfstatusinfo.model',[
  'csui/lib/backbone',
  'csui/lib/underscore',
  'csui/utils/url',
  'csui/models/node/node.model'
], function (Backbone, _, Url, NodeModel) {
  

  var WFStatusInfoModel = Backbone.Model.extend({

    constructor: function WFStatusInfoModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {
      var baseUrl      = this.connector.connection.url.replace('/v1', '/v2'),
          getUrl       = Url.combine(baseUrl, 'workflows/status'),
          processId    = this.get('process_id');
      getUrl += "/processes/" + processId ;
      return getUrl;
    },

    parse: function (response) {

      return response.results;

    },

    reset: function (options) {
      this.clear(options);

      //reset the different collections
      if (!_.isUndefined(this.wfStatusInfo)) {
        this.wfStatusInfo.reset();
      }
    },

    isFetchable: function () {
      return true;
    }
  });

  return WFStatusInfoModel;

});

csui.define('workflow/models/wfstatus/wfstatusinfo.model.factory',[
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'workflow/models/wfstatus/wfstatusinfo.model'
], function ($, _, Backbone, ModelFactory, ConnectorFactory, WFStatusInfoModel) {
  

  var WFStatusInfoModelFactory = ModelFactory.extend({

    propertyPrefix: 'wfstatusinfo',

    constructor: function WFStatusInfoModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      // Obtain the server connector from the application context to share
      // the server connection with the rest of the application; include
      // the options, which can contain settings for dependent factories
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;
      this.property = new WFStatusInfoModel(options, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return WFStatusInfoModelFactory;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/wfstatus/impl/wfstatus.progress',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wfstatusitem-progress-panel\">\r\n  <div class=\"wfstatusitem-body binf-col-md-9 binf-col-sm-9 binf-col-xs-12\" ></div>\r\n  <div class=\"wfstatusitem-tabpanel binf-col-md-3 binf-col-sm-3 binf-hidden-xs\"></div>\r\n</div>";
}});
Handlebars.registerPartial('workflow_widgets_wfstatus_impl_wfstatus.progress', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/widgets/wfstatus/impl/wfstatus.progress.view',[
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'workflow/widgets/wfstatus/impl/wfstatusitem.body.view',
  'workflow/models/wfstatus/tabpanel.model',
  'workflow/widgets/wfstatus/impl/wfstatusitem.tabpanel.view',
  'workflow/widgets/wfstatus/impl/wfstatusitem.details.view',
  'workflow/widgets/wfstatus/impl/wfstatusitem.attachments.view',
  'workflow/models/wfstatus/wfstatusinfo.model.factory',
  'hbs!workflow/widgets/wfstatus/impl/wfstatus.progress',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'css!workflow/widgets/wfstatus/impl/wfstatus.progress'

], function (require, $, _, Backbone, Marionette, WFStatusItemBodyView, TabpanelCollection,
    WFStatusItemTabPanelView, WFStatusItemDetailsView, WFStatusItemAttachmentsView,
    WFStatusInfoModelFactory, template, lang) {
  

  var WFStatusProgressView = Marionette.LayoutView.extend({

    className: 'wfstatus-progress-view',

    template: template,

    regions: {
      body: '.wfstatusitem-body',
      tabPanel: '.wfstatusitem-tabpanel'
    },
    events: {
      'click .wfstatusitem-body, .wfstatusitem-tabpanel': 'destroyUserCardPopovers'
    },
    constructor: function WFStatusProgressView(options) {

      var Utils        = require('workflow/utils/workitem.util'),
          cellModel    = options.model,
          processId    = cellModel.get('process_id') ? cellModel.get('process_id') : 0,
          subProcessId = cellModel.get('subprocess_id') ? cellModel.get('subprocess_id') : 0,
          taskId       = cellModel.get('task_id') ? cellModel.get('task_id') : 0,
          wfStatusInfo = options.context.getModel(WFStatusInfoModelFactory);

      wfStatusInfo.set({'process_id': processId, 'subprocess_id': subProcessId, 'task_id': taskId});
      this.dataFetched = false;

      wfStatusInfo.fetch()
          .done(_.bind(function () {
            this.dataFetched = true;
            var wfDetails = wfStatusInfo.get('wf_details'),
                displayName = wfDetails.initiator.firstName + " " + wfDetails.initiator.lastName,
                loginName = wfDetails.initiator.loginName,
                dueDateVal = wfDetails.due_date,
                startDateVal = wfDetails.date_initiated,
                statusResult = Utils.formatStatus({
                  dueDate: dueDateVal,
                  status: wfDetails.status
                }),
                details = {
                  wf_name: wfDetails.wf_name,
                  due_date: (dueDateVal) ? Utils.dateConversion(dueDateVal) : '',
                  status_key: statusResult.status,
                  initiator: displayName === " " ? loginName : displayName,
                  date_initiated: (startDateVal) ? Utils.dateConversion(startDateVal) : '',
                  userId: wfDetails.initiator.userId,
                  end_date: dueDateVal,
                  start_date: startDateVal
                };
            wfStatusInfo.set('details', details);//Once backend ready with details,we can remove
            this.model = wfStatusInfo;
            this.viewOptions = {model: this.model, context: this.options.context, cellView: this.options.cellView};

            this.tabpanelCollection = new TabpanelCollection([{
              title: lang.details,
              viewToRender: WFStatusItemDetailsView,
              viewToRenderOptions: this.viewOptions,
              id: _.uniqueId('wfstatusitem-tab')
            }]);
            if (!_.isEmpty(this.model.get("attachments"))) {
              this.tabpanelCollection.add({
                title: lang.attachments,
                viewToRender: WFStatusItemAttachmentsView,
                viewToRenderOptions: this.viewOptions,
                id: _.uniqueId('wfstatusitem-tab')
              });
            }
            this.render();
          }, this));

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

    },
    onRender: function () {
      if (this.dataFetched) {
        // render the progresspanel body
        this._renderBody();

        // render the progresspanel TabPanel
        this._renderTabPanel();
      }
    },

    destroyUserCardPopovers: function (e) {
      if($(".wfstatus-usercard-popover").length > 0){
        var Utils = require('workflow/utils/workitem.util');
        Utils.unbindPopover();
      }
    },
    onDomRefresh: function () {

      if ($('.wfstatusitem-bar').length > 0 && ($('.wfstatus-progress-view')[0].offsetHeight) > 0) {
        var stepList = this.model.get('step_list'),
                       currentStepListLength   = (stepList && stepList.current)? stepList.current.length : 0,
                       completedStepListLength = (stepList && stepList.completed)? stepList.completed.length : 0,
                       type = 'current',
                       noOfNodes;
                      
                if (currentStepListLength === 0) {
                    noOfNodes = 2;
                    type = 'completed';
                } else {
                    if (completedStepListLength === 0) {
                        noOfNodes = 3;
                    } else {
                        noOfNodes = 4;
                    }
                }     
 
        this.body.currentView.onClickStep(type);
        this.body.currentView.adjustStepCardPosition(noOfNodes);
      }
    },

    _renderBody: function () {
      this.body.show( new WFStatusItemBodyView(this.viewOptions ));
    },

    _renderTabPanel: function () {

      if (this.tabpanelCollection.models.length > 0) {
        var wfStatusItemTabPanelView = new WFStatusItemTabPanelView({
          collection: this.tabpanelCollection
        });
        this.tabPanel.show(wfStatusItemTabPanelView);
      }
    },
    onBeforeDestroy : function(){
      $(window).unbind("resize.app");
      this.model.reset();
      var Utils = require('workflow/utils/workitem.util');
      Utils.unbindPopover();
    }

  });

  return WFStatusProgressView;
});

csui.define('workflow/utils/workitem.util',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/log',
  'csui/utils/commands/open.node.perspective',
  'csui/models/nodes',
  'csui/utils/commandhelper',
  'csui/utils/contexts/factories/node',
  'csui/controls/dialog/dialog.view',
  'workflow/widgets/wfstatus/impl/wfstatus.progress.view',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (_, $, Backbone, Url, log, OpenNodePerspective, NodeCollection, CommandHelper,
    NodeModelFactory, DialogView, WFStatusProgressView, lang) {
  
  var Utils = {
    constants: {
      WFSTATUS_ONTIME: "ontime",
      WFSTATUS_COMPLETED: "completed",
      WFSTATUS_LATE: "workflowlate",
      URI_DELIMITER: ":",
      AT_SIGN_SYMBOL: "@",
      URI_PREFIX: "sip"
    },

    dateConversion: function (date, format) {
      var dateValue = new Date(date),
          formatedDate;
      switch (format) {
      case 'Month DD':
        formatedDate = lang.months[dateValue.getMonth()] + " " + dateValue.getDate();
        break;
      default:
        formatedDate = lang.months[dateValue.getMonth()] + " " + dateValue.getDate() + ", " +
                       dateValue.getFullYear();
        break;
      }
      return formatedDate;
    },

    getAssignee: function (options) {

      var assignees = options.assignees,
          assignee  = '',
          fullName  = '';

      if (assignees && assignees.length > 1) {
        fullName = (assignees[0].firstName + " " + assignees[0].lastName).trim();
        if (fullName !== "") {
          assignee = fullName + " +" + (assignees.length - 1);
        } else if (options.assignedto) {
          assignee = options.assignedto.groupName + " + " + assignees.length;
        }
      } else if (assignees.length === 1) {
        if (options.assignedto && options.assignedto.groupName !== '') {
          fullName = (assignees[0].firstName + " " + assignees[0].lastName).trim();
          if (fullName !== "") {
            assignee = fullName;
          } else {
            assignee = options.assignedto.groupName;
          }
        } else {
          assignee = (assignees[0].firstName + " " + assignees[0].lastName).trim();
          assignee = assignee === "" ? assignees[0].loginName : assignee;
        }

      }
      return assignee;

    },

    displayWfstatusItemProgresspanel: function (options) {
      this.unbindPopover();
      this.progressDialog = new DialogView();
      var expanadedViewEle = $('.wfstatus.csui-expanded');
      //hiding the wfstatus list view
      expanadedViewEle.hide();
      this.progressDialog.options.title = options.model.get('wf_name');
      this.progressDialog.options.iconRight = 'wfstatusitem-no-icon-right';
      this.progressDialog.options.iconLeft = 'title-icon mime_workflow_status';
      this.progressDialog.options.className = 'wfstatus-progress-view-dialog';
      this.progressDialog.options.actionIconLeft = "arrow_back wfstatus-progress-view-dialog-back";
      this.progressDialog.options.largeSize = true;
      this.progressDialog.options.view = new WFStatusProgressView(options);
      this.progressDialog.show();
      var that = this;

      this.progressDialog.listenTo(this.progressDialog, 'destroy', function () {
        expanadedViewEle.show();
      });
      // Back button
      var progressViewBackButtonEle = $(".wfstatus-progress-view-dialog-back").attr("tabindex", "0");
      progressViewBackButtonEle.on("click", function () {
        that.progressDialog.options.view.destroy();
        that.progressDialog.remove();
        expanadedViewEle.show();
      });

      $(window).unbind("resize.app");

      // Close button
      var progressViewCloseButtonEle = $(".wfstatusitem-no-icon-right");
      progressViewCloseButtonEle.hide();
    },

    unbindPopover: function (options) {
      if (options) {
        $(options.delegateTarget).css("overflow", "");
      }
      if ($(".wfstatus-usercard-popover").length > 0) {
        $(window).unbind('resize.onUserCardPopOver');
        $(window).unbind('popstate.onUserCardPopOver');
        $(window).unbind('hashchange.onUserCardPopOver');
        $(".wfstatus-table tbody").off('scroll');
        $(".binf-modal-backdrop").unbind('keydown click');
        $(".binf-modal-header").unbind('keydown click');

        $("[id*=wfstatus-usercard-popover]").remove();
        $("[id*=wfstatus-usercard-popover-pointer]").remove();
        $("[id*=wfstatus-usercard-popover-mask]").remove();
      }
    },

    formatStatus: function (options) {

      var value        = options.status,
          dueDate      = options.dueDate,
          styleclass   = "wfstatus-" + value + "-icon",
          current_date = new Date(Date.now()),
          date_difference,
          status,
          due_date;

      if (value === this.constants.WFSTATUS_ONTIME) {
        due_date = dueDate ? new Date(dueDate) : '';
        date_difference = (due_date !== '') ? Math.round(
            due_date.getDifference(current_date) / 1000 /
            60 / 60 / 24) : undefined;
        if (date_difference === 0) {
          status = lang.dueLabel + ' ' + lang.todayLabel;
        } else if (date_difference === 1) {
          status = lang.dueInLabel + ' ' + date_difference + ' ' + lang.day;
        } else if (date_difference <= 5) {
          status = lang.dueInLabel + ' ' + date_difference + ' ' + lang.days;
        } else {
          status = (lang.onTime).toLowerCase();
        }

      } else if (value === this.constants.WFSTATUS_COMPLETED) {
        status = (lang.completed).toLowerCase();
      } else if (value === this.constants.WFSTATUS_LATE) {
        due_date = dueDate ? new Date(dueDate) : '';
        date_difference = (due_date !== '') ?
                          Math.round(current_date.getDifference(due_date) / 1000 / 60 / 60 / 24) :
                          undefined;
        if (date_difference === 1) {
          status = date_difference + ' ' + lang.day + ' ' + lang.lateFilterLabel.toLowerCase();
        } else if (date_difference > 1 && date_difference <= 5) {
          status = date_difference + ' ' + lang.days + ' ' +
                   lang.lateFilterLabel.toLowerCase();
        } else {
          status = (lang.late).toLowerCase();
        }
      }

      return {
        status: status,
        styleclass: styleclass
      };
    },

    showProfilePic: function (model) {
      var deferred = $.Deferred();
      if (model.get("photo_url")) {
        var userData = model.get("photo_url");
        var picUrl               = userData.substring(6),
            photoUrl             = Url.combine(
                (model.connector.connection.url), picUrl),
            getCategoriesOptions = model.connector.extendAjaxOptions({
              url: photoUrl,
              method: 'GET',
              dataType: 'binary'
            });
        $.ajax(getCategoriesOptions)
            .done(function (response) {
              deferred.resolve(response);
            }).fail(function (response) {
              deferred.reject(response);
            });
      }
      return deferred.promise();
    },

    getChatURI: function (options) {

      var uriPrefix = options.uriPrefix ? options.uriPrefix :
                      this.constants.URI_PREFIX,
          uri       = uriPrefix +
                      this.constants.URI_DELIMITER + options.tguser +
                      this.constants.AT_SIGN_SYMBOL + options.domain;
      return uri;
      
    },

    getWorkflowtype: function (filterWorkflows) {
      var isFilterInitiated = true;
      var isFilterManaged = true;
      var filterWorkflowtype = 'Both';
      if (filterWorkflows) {
        isFilterInitiated = filterWorkflows.filterInitiated;
        isFilterManaged = filterWorkflows.filterManaged;
      }
      if (isFilterInitiated && isFilterManaged) {
        filterWorkflowtype = 'Both';
      } else if (isFilterInitiated) {
        filterWorkflowtype = 'Initiated';
      } else if (isFilterManaged) {
        filterWorkflowtype = 'Managed';
      }
      return filterWorkflowtype;
    },
    
    validateURL: function (surl) {  
        var url = this.parseURL(surl);  
        var urlHostname = url.hostname.trim();  

        if (urlHostname === '') {  
            return surl;  
        }  
        else {  
            if (urlHostname.toUpperCase() === location.hostname.trim().toUpperCase()) {  
                return surl;  
            }  
            else
            {  
                return "";
            }  
        }  
    } , 

    parseURL: function(url) {  
        
        var a =document.createElement('a');  
        a.href = url;  
        
        return {  
            source: url,  
            protocol: a.protocol.replace(':', ''),  
            hostname: a.hostname,  
            host: a.host,  
            port: a.port,  
            query: a.search,  
            params: (function () {  
                var ret = {},  
                    seg = a.search.replace(/^\?/, '').split('&'),  
                    len = seg.length, i = 0, s;  
                for (; i < len; i++) {  
                    if (!seg[i]) { continue; }  
                    s = seg[i].split('=');  
                    ret[s[0]] = s[1];  
                }  
                return ret;  
            })(),  
           
            hash: a.hash.replace('#', ''),  
           
            segments: a.pathname.replace(/^\//, '').split('/')  
        };  
    }  
  };
  return Utils;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem/impl/header',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showIcon : depth0),{"name":"if","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.multiMaps : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.program(13, data, 0)})) != null ? stack1 : "")
    + "\r\n  </div>\r\n\r\n\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.iconLeft : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.program(5, data, 0)})) != null ? stack1 : "");
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "      <span class=\"tile-type-icon cs-icon-left "
    + this.escapeExpression(((helper = (helper = helpers.iconLeft || (depth0 != null ? depth0.iconLeft : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"iconLeft","hash":{}}) : helper)))
    + "\"></span>\r\n      <div class=\"tile-title\">\r\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.imageLeftUrl : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.program(8, data, 0)})) != null ? stack1 : "");
},"6":function(depth0,helpers,partials,data) {
    var helper;

  return "          <div class=\"tile-type-image "
    + this.escapeExpression(((helper = (helper = helpers.imageLeftClass || (depth0 != null ? depth0.imageLeftClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageLeftClass","hash":{}}) : helper)))
    + "\">\r\n            <img src=\""
    + this.escapeExpression(((helper = (helper = helpers.imageLeftUrl || (depth0 != null ? depth0.imageLeftUrl : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"imageLeftUrl","hash":{}}) : helper)))
    + "\" aria-hidden=\"true\">\r\n          </div>\r\n        <div class=\"tile-title\">\r\n";
},"8":function(depth0,helpers,partials,data) {
    return "        <div class=\"tile-title cs-text-only\">\r\n";
},"10":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "      <div class=\"cs-formfield cs-selectfield binf-dropdown\">\r\n        <div class=\"cs-field-write\">\r\n          <div class=\"cs-field-write-inner cs-drop-down\">\r\n            <button id=\"select-workflow-type\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.MultipleMapsSelectPlaceholder || (depth0 != null ? depth0.MultipleMapsSelectPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"MultipleMapsSelectPlaceholder","hash":{}}) : helper)))
    + "\"\r\n                    type=\"button\" class=\"binf-btn binf-btn-default binf-dropdown-toggle\r\n                    "
    + this.escapeExpression(((helper = (helper = helpers.shadowClass || (depth0 != null ? depth0.shadowClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"shadowClass","hash":{}}) : helper)))
    + "\" data-binf-toggle=\"dropdown\" aria-haspopup=\"true\"\r\n                    aria-expanded=\"false\">\r\n              <span class=\"cs-label select-workflow-label\">"
    + this.escapeExpression(((helper = (helper = helpers.MultipleMapsSelectPlaceholder || (depth0 != null ? depth0.MultipleMapsSelectPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"MultipleMapsSelectPlaceholder","hash":{}}) : helper)))
    + "</span>\r\n              <span class=\"cs-icon icon-caret-down\"></span>\r\n            </button>\r\n            <ul class=\"binf-dropdown-menu ps-container\" role=\"menu\"\r\n                aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.MultipleMapsSelectPlaceholder || (depth0 != null ? depth0.MultipleMapsSelectPlaceholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"MultipleMapsSelectPlaceholder","hash":{}}) : helper)))
    + "\">\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.maps : depth0),{"name":"each","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "            </ul>\r\n          </div>\r\n        </div>\r\n      </div>\r\n";
},"11":function(depth0,helpers,partials,data) {
    return "                <li><a role=\"menuitem\" class=\"cs-menu-option\" href=\"#\" data-wfid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.DataID : depth0), depth0))
    + "\" tabindex=\"-1\" data-cstabindex=\"-1\" >\r\n              <span class=\"cs-label\" data-wfid=\""
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.DataID : depth0), depth0))
    + "\">"
    + this.escapeExpression(this.lambda((depth0 != null ? depth0.Name : depth0), depth0))
    + "</span>\r\n                </a>\r\n                </li>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var helper;

  return "      <h2 title=\""
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{}}) : helper)))
    + "</h2>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.expandedHeader : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem_impl_header', t);
return t;
});
/* END_TEMPLATE */
;
// Lists explicit locale mappings and fallbacks

csui.define('workflow/widgets/workitem/workitem/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/widgets/workitem/workitem/impl/nls/root/lang',{
  CloseButtonLabel: 'Close',
  CancelButtonLabel: 'Cancel',
  StartButtonLabel: 'Start',
  ActionFailMessageTitle: 'Action "{0}" failed',
  ActionFailMessage: 'Action "{0}" failed. \n\n{1}',
  AssigneePickerLabelTo: 'To',
  AssigneePickerLabelSendTo: 'Send to',
  CommentTextFieldLabelInstructions: 'Instructions',
  CommentTextFieldPlaceholderInstructions: 'Add instructions',
  CommentTextFieldLabelReply: 'Reply',
  CommentTextFieldPlaceholderReply: 'Add reply',
  SubmitLabelSend: 'Send',
  SuccessSendOnMessage: 'One workflow submitted by you.',
  SuccessInitiateMessage: 'Start workflow action was successful.',
  ErrorMessageLoadExtension: 'Workflow could not load extension.',
  MultipleMapsSelectPlaceholder: 'Select workflow type',
  ChangeWorkflowTypeTitle: 'Changing Workflow Type',
  ChangeWorkflowTypeMessage: 'Any changes you have made to this step will be lost.',
  ReserveDocumentMessageTitle: 'Document reserved',
  ReserveDocumentMessageText: 'The document {0} is reserved. \nDo you want to continue anyway?',
  MemberAcceptDialogTitle: 'Workflow sent to a group',
  MemberAcceptDialogMessage: 'Click Accept to work on this Workflow. It will be removed from the My Assignments tile of the other group members. It will be available on your My Assignments tile.',
  MemberAcceptAcceptButtonLabel: 'Accept',
  MemberAcceptCloseButtonLabel: 'Close',
  MemberAcceptedMessage: 'This workflow has been accepted by you',
  MemberAcceptErrorDescription: 'This Workflow was accepted by another group member.',
  MemberAcceptErrorTitle: 'Workflow no longer available',
  DialogModelTitle: '{0}: {1}',
  WorkflowStepTitle: 'Workflow Step : {0}'
});




csui.define('css!workflow/widgets/workitem/workitem/impl/workitem',[],function(){});
csui.define('workflow/widgets/workitem/workitem/impl/header.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/node',
  'csui/models/nodes',
  'csui/utils/commandhelper',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/globalmessage/globalmessage',
  'workflow/models/workflow/workflow.model',
  'workflow/commands/initiate.workflow/initiate.workflow',
  'hbs!workflow/widgets/workitem/workitem/impl/header',
  'i18n!workflow/widgets/workitem/workitem/impl/nls/lang',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem/impl/workitem'
], function (_, $, Marionette, TabableRegion, NodeModelFactory, NodeCollection, CommandHelper,
    ModalAlert, GlobalMessage, WorkflowModel, InitiateWorkflowCommand, headerTemplate, Lang, LangCoreUI) {
  

  var HeaderView = Marionette.ItemView.extend({

    template: headerTemplate,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion,
        initialActivationWeight: 100
      }
    },
    ui: {
      titleWorkflow: '.tile-title>h2'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .cs-menu-option': 'onMapSelectionChanged'
    },

    templateHelpers: function () {
      var maps = this.options.maps;
      var documentTitle ='';
      for (var map in maps) {
        var name = maps[map].Name.split(":");
        this.options.maps[map].Name = name[name.length - 1];
      }
      var selectedMapTitle = Lang.MultipleMapsSelectPlaceholder;
      var shadowClass = "";
      var showIcon = true;
      if (this.model && this.model.attributes.isDocDraft) {
        selectedMapTitle = this.model.attributes.title;
      }
      //with this the Page title of the Webpage is set, which is displayed on
      //the browser tab
      if (this.options.multiMaps === true) {
        documentTitle = selectedMapTitle;
      }
      else {
        documentTitle = this.options.title;
      }

      document.title = _.str.sformat(Lang.WorkflowStepTitle, documentTitle);

      return {
        iconLeft: this.options.iconLeft,
        imageLeftUrl: this.options.imageLeftUrl,
        imageLeftClass: this.options.imageLeftClass,
        title: this.options.title,
        expandedHeader: true,
        multiMaps: this.options.multiMaps,
        maps: this.options.maps,
        MultipleMapsSelectPlaceholder: selectedMapTitle,
        shadowClass: shadowClass,
        showIcon: showIcon
      };
    },

    constructor: function HeaderView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    isTabable: function () {
       return true;
    },

    currentlyFocusedElement: function () {
      //In case the '#select-workflow-type' is found this is 'start WF from Document' scenario
      //then this is the currentlyFocusedElement else WF title
      var tabButton = this.$('#select-workflow-type');
      if (tabButton.length > 0) {
        return $(tabButton[0]);
      }
      else {
        return this.ui.titleWorkflow ;
      }
    },

    onSetFocus:function () {
      this.ui.titleWorkflow.focus();
    },

    onDomRefresh:function () {
      //Soemtimes the tabable region behavior is to early to try to set
      //the focus, therefore here manual setting of the focus after DomRefresh
      var tabButton = this.$('#select-workflow-type');
      if (tabButton.length > 0) {
        tabButton[0].focus();
      }
      else {
        this.triggerMethod("setFocus");
      }
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;

      //to enable space this is necessary, to do this for enter as well leads to occasional
      //error because the event is triggered two times
      if (keyCode === 32) {
        $(event.target).click();
      }
    },
    onMapSelectionChanged: function(event){
      var self = this;
      if(this.model && this.model.attributes.isDocDraft){
        var options={};
        options.buttons = ModalAlert.buttons.OkCancel;
        var promise = ModalAlert.confirmWarning( Lang.ChangeWorkflowTypeMessage, Lang.ChangeWorkflowTypeTitle, options);
        promise.then(function () {
          self.mapSelected(event);
        });
      } else {
        this.mapSelected(event);
      }
    },
    mapSelected: function (event) {
      var mapId = parseInt(event.target.getAttribute("data-wfid"));
      if (mapId) {

        this.propertiesCommand = new InitiateWorkflowCommand();
        this.mapModel = this.options.context.getModel(NodeModelFactory,
            {attributes: {id: mapId}});

        this.mapModel.fetch()
            .done(_.bind(function (args) {
              var model = this.options.model;
              var status = {};
              status.context = this.options.context;
              status.nodes = new NodeCollection([this.mapModel]);
              status.isDoc = true;
              status.doc_id = model.get('doc_id');
              status.parent_id = model.get('parent_id');
              status.docNames = model.get('doc_names');
              var defaults = model.defaults;
              model.reset({silent: true});
              model.set(defaults, {silent: true});
              var promisesFromCommands = this.propertiesCommand.execute(status);
              CommandHelper.handleExecutionResults(promisesFromCommands,
                  {
                    command: this.propertiesCommand,
                    suppressSuccessMessage: status.suppressSuccessMessage
                  });
            }, this))
            .fail(_.bind(function (args) {
              GlobalMessage.showMessage('error', args.responseJSON.error);
            }, this));
      }
    },

  });

  return HeaderView;
});

csui.define('workflow/widgets/workitem/workitem/impl/footer.view',['csui/lib/marionette'], function (Marionette) {
  

  /**
   * View for a single button in the FooterView
   */
  var ButtonView = Marionette.ItemView.extend({

    tagName: 'button',

    className: 'binf-btn',

    template: false,

    triggers: {
      'click': 'click'
    },

    constructor: function ButtonView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      var button     = this.$el,
          attributes = this.model.attributes;
      button.text(attributes.label);

      if (attributes.id === "standard-Review") {
        button.addClass(attributes['default'] ? 'binf-btn-primary' : 'binf-btn-default-review');
      }

      button.addClass(attributes['default'] ? 'binf-btn-primary' : 'binf-btn-default');

      if (attributes.toolTip) {
        button.attr('title', attributes.toolTip);
      }
      if (attributes.separate) {
        button.addClass('cs-separate');
      }
      this.updateButton(attributes);
    },

    updateButton: function (attributes) {
      var $button = this.$el;
      attributes || (attributes = {});
      if (attributes.hidden !== undefined) {
        if (attributes.hidden) {
          $button.addClass('binf-hidden');
        } else {
          $button.removeClass('binf-hidden');
        }
      }
      if (attributes.disabled !== undefined) {
        $button.prop('disabled', attributes.disabled);
      }
    }
  });

  /**
   * Footer view which shows a list of buttons
   */
  var FooterView = Marionette.CollectionView.extend({

    childView: ButtonView,

    constructor: function FooterView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);

    },
    onDomRefresh: function () {
      this.children.each(function (buttonView) {
        buttonView.trigger('dom:refresh');
      });
    },

    getButtons: function () {
      return this.children.toArray();
    },

    updateButton: function (id, attributes) {
      var button = this.collection.get(id);
      if (button) {
        this.children
            .findByModel(button)
            .updateButton(attributes);
      } else {
        // If the footer comes from the dialog template including the buttons,
        // the collection of dynamically created buttons is empty.
        // The template has to provide correct initial classes for the buttons
        // and their identifiers must be present in the "data-cs-id" attribute.
        ButtonView.updateButton(this.$('[data-cs-id="' + id + '"]'), attributes);
      }
    }

  });

  return FooterView;
});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/message/impl/message',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"message-head\">\r\n  <div class=\"message-subject\">\r\n    <div class=\"subject-pre\">"
    + this.escapeExpression(((helper = (helper = helpers.subjectPre || (depth0 != null ? depth0.subjectPre : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"subjectPre","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"subject-sender\">"
    + this.escapeExpression(((helper = (helper = helpers.sender || (depth0 != null ? depth0.sender : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"sender","hash":{}}) : helper)))
    + "</div>\r\n    <div class=\"subject-post\">"
    + this.escapeExpression(((helper = (helper = helpers.subjectPost || (depth0 != null ? depth0.subjectPost : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"subjectPost","hash":{}}) : helper)))
    + "</div>\r\n  </div>\r\n  <div class=\"message-toggle\">\r\n    <div hidden id="
    + this.escapeExpression(((helper = (helper = helpers.ariaDescribedById || (depth0 != null ? depth0.ariaDescribedById : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaDescribedById","hash":{}}) : helper)))
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.subjectAria || (depth0 != null ? depth0.subjectAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"subjectAria","hash":{}}) : helper)))
    + "</div>\r\n    <a class=\"toggle-button\" role=\"button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.seeLess || (depth0 != null ? depth0.seeLess : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"seeLess","hash":{}}) : helper)))
    + "\" data-binf-toggle=\"collapse\"\r\n       href=\".message-body\" aria-describedby="
    + this.escapeExpression(((helper = (helper = helpers.ariaDescribedById || (depth0 != null ? depth0.ariaDescribedById : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaDescribedById","hash":{}}) : helper)))
    + "\r\n           aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.seeLessMessages || (depth0 != null ? depth0.seeLessMessages : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"seeLessMessages","hash":{}}) : helper)))
    + "\">\r\n      <span class=\"csui-button-icon icon-expandArrowUp\"></span>\r\n    </a>\r\n  </div>\r\n</div>\r\n<div class=\"message-body binf-collapse binf-in\">\r\n  <div class=\"message-text\">"
    + this.escapeExpression(((helper = (helper = helpers.messageText || (depth0 != null ? depth0.messageText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"messageText","hash":{}}) : helper)))
    + "</div>\r\n</div>";
}});
Handlebars.registerPartial('workflow_widgets_message_impl_message', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/widgets/message/impl/nls/lang',{
  "root": true,
  "en-us": false,
  "en": false
});

csui.define('workflow/widgets/message/impl/nls/root/lang',{
  delegateMessage: 'Message from {0} who forwarded the workflow step to a new approver.',
  delegateMessageNoComment: '{0} forwarded the workflow step to a new approver without a message.',
  reassignMessage: 'Message from {0} who reassigned the workflow step.',
  reassignMessageNoComment: '{0} reassigned the workflow step without a message.',
  reviewMessage: 'Message from {0} who sent you a workflow step for review. Please add a comment' +
                 ' and reply.',
  reviewMessageNoComment: '{0} sent you a workflow step for review. Please add a comment and' +
                          ' reply.',
  reviewReturnMessage: 'Message from {0} who reviewed your workflow step.',
  reviewReturnMessageNoComment: '{0} reviewed your workflow step without a message.',
  seeLess : 'See less',
  seeMore : 'See more',
  seeLessMessages : 'See less messages',
  seeMoreMessages : 'See more messages',
  anonymousUserName: 'Anonymous User'
});



csui.define('css!workflow/widgets/message/impl/message',[],function(){});
csui.define('workflow/widgets/message/message.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/member',
  'hbs!workflow/widgets/message/impl/message',
  'i18n!workflow/widgets/message/impl/nls/lang',
  'css!workflow/widgets/message/impl/message'
], function (_, $, Marionette, TabableRegionBehavior, MemberModel, template, lang) {
  

  var MessageTypeConstants = {

    // converts a message type into a previously defined message constant. if the type is 
    // not found, the type or message is returned as result.
    //  subject:  contains the message subject. if the subject is a known type
    //            like 'delegate' it is replaced with the appropriate text key
    //            constant.
    //  body:     in case the message text is empty, it could be necessary to return
    //            another text constant.
    //  return:   in case the subject is a defined text key the appropriate message
    //            constant is returned, otherwise the subject is returned as is.
    message: function (subject, body) {
      // initialize subject
      var ret = subject;
      // replace message subject with appropriate message
      switch (subject) {
      case 'delegate':
        ret = body ? lang.delegateMessage : lang.delegateMessageNoComment;
        break;
      case 'reassign':
        ret = body ? lang.reassignMessage : lang.reassignMessageNoComment;
        break;
      case 'review':
        ret = body ? lang.reviewMessage : lang.reviewMessageNoComment;
        break;
      case 'review_return':
        ret = body ? lang.reviewReturnMessage : lang.reviewReturnMessageNoComment;
        break;
      }
      // return
      return ret;
    }
  };

  // The message view is capable to display a collapsible message 
  // containing a sender, subject and body.
  var MessageView = Marionette.ItemView.extend({

    className: 'workflow-message',

    template: template,

    templateHelpers: function () {
      return {
        subjectPre: this.subjectPre,
        subjectPost: this.subjectPost,
        sender: this.sender,
        subjectAria: this.subjectPre + this.sender + this.subjectPost + this.messageText,
        ariaDescribedById: _.uniqueId("id_"),
        messageText: this.messageText,
        seeMore: lang.seeMore,
        seeLess: lang.seeLess,
        seeMoreMessages: lang.seeMoreMessages,
        seeLessMessages: lang.seeLessMessages
      };
    },

    ui: {
      toggleButton: '.toggle-button',
      toggleIcon: '.toggle-button > span',
      messageBody: '.message-body'
    },

    events: {
      'click @ui.toggleButton': 'onClickToggle'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function MessageView(options) {
      // verify options
      if (_.isUndefined(options) || _.isUndefined(options.model)) {
        throw new Error('Message model is missing!');
      }

      // initialize members
      var model = options.model;
      var connector = options.connector;

      // message text
      this.messageText = model.get('text');

      // message subject
      var subject = model.get('subject');
      if (!_.isUndefined(subject)) {
        // find message from type or use current
        subject = MessageTypeConstants.message(subject, this.messageText);
        // split message to insert sender information. due to the fact that
        // the subject contains different styles, we cannot only format the
        // message using _.str.sformat().
        var parts = subject.split('{0}');
        if (parts.length === 2) {
          this.subjectPre = subject.split('{0}')[0];
          this.subjectPost = subject.split('{0}')[1];
        } else {
          this.subjectPre = null;
          this.subjectPost = subject;
        }
      }

      // message sender
      var sender = model.get('sender');
      if (_.isNumber(sender)) {
        var self = this;
        var member = new MemberModel({id: sender}, {connector: connector});
        member.fetch().done(function (data, result) {
          if (result === 'success') {
            self.sender = data.data.display_name;
            self.render();
          }
        });
      } else if (_.isString(sender)) {
        this.sender = sender;
      } else {
        this.sender = lang.anonymousUserName;
      }

      // initialize the marionette base view
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onClickToggle: function (e) {
      // change toggle button icon
      if (this.ui.messageBody.hasClass('binf-in')) {
        this.ui.toggleIcon.removeClass('icon-expandArrowUp');
        this.ui.toggleIcon.addClass('icon-expandArrowDown');
        if (this.ui.toggleButton &&
            this.ui.toggleButton.hasClass('toggle-button csui-acc-focusable-active')) {
          this.ui.toggleButton[0].title = lang.seeMore;
          this.ui.toggleButton.attr('aria-label', lang.seeMoreMessages);
        }
      }
      else {
        this.ui.toggleIcon.removeClass('icon-expandArrowDown');
        this.ui.toggleIcon.addClass('icon-expandArrowUp');
        if (this.ui.toggleButton &&
            this.ui.toggleButton.hasClass('toggle-button csui-acc-focusable-active')) {
          this.ui.toggleButton[0].title = lang.seeLess;
          this.ui.toggleButton.attr('aria-label', lang.seeLessMessages);
        }
      }
    },

    currentlyFocusedElement: function () {
      // return comment control textbox
      return $(this.ui.toggleButton);
    }
  });

  // return
  return MessageView;
});

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.properties/impl/workitem.instructions',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "  <div class=\" workitem-instructions-scrolling\">\r\n    <div class=\"workitem-extended-view-mode workitem-see-less-content\r\n      workitem-see-less-instruction\">\r\n      <div id=\""
    + this.escapeExpression(((helper = (helper = helpers.id_instructions || (depth0 != null ? depth0.id_instructions : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id_instructions","hash":{}}) : helper)))
    + "\"\r\n           class=\"workitem-instructions-text csui-acc-focusable-active \">"
    + ((stack1 = this.lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.instructions : stack1), depth0)) != null ? stack1 : "")
    + "</div>\r\n      <a href=\"javascript:void(0);\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.seeLess || (depth0 != null ? depth0.seeLess : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"seeLess","hash":{}}) : helper)))
    + "\" role=\"button\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.seeLessInstructions || (depth0 != null ? depth0.seeLessInstructions : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"seeLessInstructions","hash":{}}) : helper)))
    + "\"\r\n         aria-describedby=\""
    + this.escapeExpression(((helper = (helper = helpers.id_instructions || (depth0 != null ? depth0.id_instructions : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id_instructions","hash":{}}) : helper)))
    + "\" class=\"instruction-see-less\r\n         workitem-see-less-instruction\">\r\n      <span class=\"csui-button-icon icon-expandArrowUp\"></span></a>\r\n      <a href=\"javascript:void(0);\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.seeMore || (depth0 != null ? depth0.seeMore : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"seeMore","hash":{}}) : helper)))
    + "\" role=\"button\"\r\n         aria-describedby=\""
    + this.escapeExpression(((helper = (helper = helpers.id_instructions || (depth0 != null ? depth0.id_instructions : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id_instructions","hash":{}}) : helper)))
    + "\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.seeMoreInstructions || (depth0 != null ? depth0.seeMoreInstructions : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"seeMoreInstructions","hash":{}}) : helper)))
    + "\"\r\n         class=\"instruction-see-more workitem-see-more-instruction workitem-hide-element\">\r\n      <span class=\"csui-button-icon icon-expandArrowDown\"></span></a>\r\n    </div>\r\n  </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.instructions : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "");
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.properties_impl_workitem.instructions', t);
return t;
});
/* END_TEMPLATE */
;
// Lists explicit locale mappings and fallbacks

csui.define('workflow/widgets/workitem/workitem.properties/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/widgets/workitem/workitem.properties/impl/nls/root/lang',{
  FormValidationErrorMessage: 'Required fields must be filled',
  HideValidationErrorMessageIconTooltip: 'Hide validation error',
  SeeMore : 'See more',
  SeeLess : 'See less',
  SeeMoreInstructions : 'See more instructions',
  SeeLessInstructions : 'See less instructions',
  multiMapSelectMessage: 'Select the workflow you want to initiate from the drop-down list'
});



csui.define('css!workflow/widgets/workitem/workitem.properties/impl/workitem.instructions',[],function(){});
csui.define('workflow/widgets/workitem/workitem.properties/impl/workitem.instructions.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!workflow/widgets/workitem/workitem.properties/impl/workitem.instructions',
  'i18n!workflow/widgets/workitem/workitem.properties/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.properties/impl/workitem.instructions'
], function (_, $, Marionette, log, LayoutViewEventsPropagationMixin,
    TabableRegionBehavior, template, lang) {
  

  // An application widget is a view, because it should render a HTML fragment
  var WorkItemInstructionsView = Marionette.LayoutView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'workflow-workitem-properties-instructions',

    ui: {
      instructions: '.workitem-instructions-text',
      InstructionElement: '.workitem-extended-view-mode',
      seeLessIcon: 'a.workitem-see-less-instruction',
      seeMoreIcon: 'a.workitem-see-more-instruction'
    },

    events: {
      'keydown': 'onKeyDown',
      "click @ui.seeMoreIcon": "showMoreContent",
      "click @ui.seeLessIcon": "showLessContent",
      "keydown @ui.seeMoreIcon": "onKeyDownShowMoreContent",
      "keydown @ui.seeLessIcon": "onKeyDownShowLessContent",
    },

    // Template method rendering the HTML for the view
    template: template,

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function WorkItemInstructionsView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);

      // Cause the show events triggered on the parent view re-triggered
      // on the views placed in the inner regions
      this.propagateEventsToRegions();
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      var instructions = this.model.get('instructions');
      if (instructions) {
        return $(".workitem-instructions a");
      }
      else {
        $(".cs-form.cs-form-update:first").addClass("workitem-with-empty-instructions");
      }
    },
    contentTypeElement: ".workitem-extended-view-mode",

    showMoreContent: function (e) {

      if (window.getSelection().toString() === "") {
        var _lessIcon    = $(this.$el.find(".instruction-see-less")[0]),
            _moreIcon    = $(this.$el.find(".instruction-see-more")[0]),
            _textElement = this.ui.InstructionElement[0];
        /* Generally .show() method appends the default style
        of the element's DISPLAY property as a inline css. If the element is set to DISPLAY:NONE
        it will append DISPLAY:BLOCK as a inline css, which will make the element
        wraps to next line, so removing style attribute which has DISPLAY: NONE property
        and allowing external css take charge with DISPLAY : INLINE. */
        $(_lessIcon).removeAttr("style");
        $(_lessIcon).show();
        $(_moreIcon).hide();
        this.ui.seeLessIcon.focus();
        $(_textElement).removeClass("workitem-see-more-content");
        $(_textElement).removeClass("workitem-see-more-instruction");
        $(_textElement).addClass("workitem-see-less-instruction");
      }
    },

    showLessContent: function (e) {
      if (window.getSelection().toString() === "") {
        var _lessIcon    = $(this.$el.find(".instruction-see-less")[0]),
            _moreIcon    = $(this.$el.find(".instruction-see-more")[0]),
            _textElement = this.ui.InstructionElement[0];
        $(_lessIcon).hide();
        /* Generally .show() method appends the default style
        of the element's DISPLAY property as a inline css. If the element is set to DISPLAY:NONE
        it will append DISPLAY:BLOCK as a inline css, which will make the element
        wraps to next line, so removing style attribute which has DISPLAY: NONE property
        and allowing external css take charge with DISPLAY : INLINE. */
        $(_moreIcon).removeAttr("style");
        $(_moreIcon).show();
        this.ui.seeMoreIcon.focus();
        $(_textElement).addClass("workitem-see-more-content");
        $(_textElement).addClass("workitem-see-more-instruction");
        $(_textElement).removeClass("workitem-see-less-instruction");
      }
    },

    onKeyDownShowMoreContent: function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        this.showMoreContent(e);
      }

    },
    onKeyDownShowLessContent: function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        this.showLessContent(e);
      }
    },
    onKeyDown: function (e) {
      //keyboard scrolling if mouse is not over the element
      var handled = false;
      var deltaY = 0;
      switch (e.keyCode) {
      case 38: // up
        deltaY = -30;
        handled = true;
        break;
      case 40: // down
        deltaY = 30;
        handled = true;
        break;
      }
      if (handled) {
        e.preventDefault();
        e.stopPropagation();

        var parent = this.$el.find('.workitem-instructions-scrolling');
        parent.scrollTop(parent.scrollTop() + deltaY);
      }
    },

    // template helper to prepare the model for the view
    templateHelpers: function () {
      // return the prepared object with the necessary properties
      return {
        seeMore: lang.SeeMore,
        seeLess: lang.SeeLess,
        seeMoreInstructions: lang.SeeMoreInstructions,
        seeLessInstructions: lang.SeeLessInstructions,
        model: this.model.toJSON(),
        id_instructions: _.uniqueId("id_")
      };
    }
  });

  _.extend(WorkItemInstructionsView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemInstructionsView;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.properties/impl/workitem.properties',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-multimap-select-message\"></div>\r\n<div class=\"workitem-message\"></div>\r\n<div class=\"workitem-instructions\"></div>\r\n<div class=\"workitem-forms\"></div>\r\n<div class=\"workitem-extension\"></div>\r\n\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.properties_impl_workitem.properties', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!workflow/widgets/workitem/workitem.properties/impl/workitem.properties',[],function(){});
csui.define('workflow/controls/form/fields/alpaca/alpcsuirealfield',[
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/models/form',
  'csui/controls/form/fields/textfield.view',
  'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, FormModel, TextFieldView, base) {
  

  Alpaca.Fields.CsuiRealField = Alpaca.Fields.NumberField.extend({

    constructor: function CsuiRealField(container, data, options, schema, view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'text';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
    },

    showField: function () {

      var id = this.id;
      this.options.id = "lbl" + _.uniqueId(id);

      // add an id to the <label> element like alpaca23Label
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length === 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }

      this.fieldView = new TextFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
        }),
        id: _.uniqueId(id),
        alpacaField: this,
        labelId: id4Label,
        value: this.data,
        readonly: true,
        dataId: this.name,
        path: this.path,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        }
      });

      // replace alpaca control with empty div having same classes as control
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);

      // show our field in div
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);

      return;
    },

    getValue: function () {
      var val = $(this.control).val();
      if (val === null || val === '') {
        return null;
      }
      return Number(val);
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      }
      return bIsValid;
    },

    focus: function () {
      this.fieldView.setFocus();
    },

    handleValidate: function () {
      var ret = this.base();
      if (!ret) {
        var arrayValidations = this.validation;
        if (this.fieldView.ui.writeField.val() !== "") {
          arrayValidations["notOptional"]["status"] = true;
          arrayValidations["notOptional"]["message"] = "";
          return ret;
        }
        for (var validation in arrayValidations) {
          if (arrayValidations[validation]["status"] === false) {
            if (validation !== "notOptional") {
              arrayValidations[validation]["status"] = true;
              arrayValidations[validation]["message"] = "";
            }
          }
        }
      }
      return ret;
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }

  });

  Alpaca.registerFieldClass('number', Alpaca.Fields.CsuiRealField, 'bootstrap-csui');
  Alpaca.registerFieldClass('number', Alpaca.Fields.CsuiRealField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiRealField;
});



csui.define('workflow/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',
  'csui/behaviors/default.action/default.action.behavior',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang'
], function (_, $, Marionette, BreadCrumbItemView, DefaultActionBehavior, lang) {
  
  var BreadcrumbItemView = BreadCrumbItemView.extend({

    templateHelpers: function () {
      var that      = this,
          subCrumbs = _.map(this.model.get('subcrumbs'), function (crumb) {
            return _.extend(crumb.toJSON(), {url: that.getAncestorUrl(crumb)});
          });
      return {
        inactive: this.model.get('inactive'),
        hasSubCrumbs: subCrumbs.length > 0,
        subcrumbs: subCrumbs,
        url: this.getAncestorUrl(this.model),
        subcrumbTooltip: lang.subcrumbTooltip
      };
    },
    getAncestorUrl: function (crumb) {
      return crumb.get('id') > 0 && crumb.connector &&
             DefaultActionBehavior.getDefaultActionNodeUrl(crumb);
    }

  });
  return BreadcrumbItemView;
});

csui.define('workflow/controls/breadcrumbs/breadcrumbs.view',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/commands', 'csui/utils/defaultactionitems',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'csui/models/node/node.model',
  'csui/behaviors/default.action/default.action.behavior',
  'workflow/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view'
], function (_, $, Marionette, Commands, DefaultActionItems, BreadcrumbsView, NodeModel,
    DefaultActionBehavior,
    BreadCrumbItemView) {
  
  var BreadcrumbItemView = BreadcrumbsView.extend({
    childView: BreadCrumbItemView,
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    onClickAncestor: function (model, node) {

      var that    = this,
          args    = {node: node},
          newnode = new NodeModel({
            id: node.get('id')
          }, {
            connector: node.connector,
            autoreset: true,
            // Ensure, that at least permitted actions for default actions
            // are available
            commands: DefaultActionItems.getAllCommandSignatures(Commands)
          });
      newnode.fetch()
          .done(function () {
            if (that.defaultActionController.hasAction(newnode)) {
              that.triggerMethod('execute:defaultAction', newnode);
            } else {
              that.trigger('before:defaultAction', args);
              if (!args.cancel) {
                that._nextNode.set('id', node.get('id'));
              }

              that.$el.trigger('setCurrentTabFocus');
            }

          });
    }
  });

  return BreadcrumbItemView;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/controls/form/impl/fields/itempicker/itempicker',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(depth0,helpers,partials,data) {
    var helper;

  return "aria-labelledby=\""
    + this.escapeExpression(((helper = (helper = helpers.idBtnLabel || (depth0 != null ? depth0.idBtnLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"idBtnLabel","hash":{}}) : helper)))
    + "\" ";
},"5":function(depth0,helpers,partials,data) {
    var helper;

  return " aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.multiFieldLabel || (depth0 != null ? depth0.multiFieldLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"multiFieldLabel","hash":{}}) : helper)))
    + "\"";
},"7":function(depth0,helpers,partials,data) {
    var helper;

  return "        <button class=\"btn-container inline-clear-itempicker-button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.remove || (depth0 != null ? depth0.remove : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"remove","hash":{}}) : helper)))
    + "\" tabindex=\"0\"\r\n                data-cstabindex=\"0\" aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.remove || (depth0 != null ? depth0.remove : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"remove","hash":{}}) : helper)))
    + "\">\r\n          <span class=\"inline-clear-itempicker formfield_clear\" ></span>\r\n        </button>\r\n";
},"9":function(depth0,helpers,partials,data) {
    var helper;

  return "      <div class=\"icon-container\">\r\n        <div class=\"csui-icon-edit inline-edit-icon edit-cancel\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"cancel","hash":{}}) : helper)))
    + "\"></div>\r\n      </div>\r\n";
},"11":function(depth0,helpers,partials,data) {
    var helper;

  return "      <button class=\"btn-container inline-edit-more-button\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.toggleTitle || (depth0 != null ? depth0.toggleTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toggleTitle","hash":{}}) : helper)))
    + "\"\r\n        aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.toggleTitle || (depth0 != null ? depth0.toggleTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"toggleTitle","hash":{}}) : helper)))
    + "\" aria-expanded=\"false\">\r\n        <span class=\"inline-edit-more-icon icon-toolbar-more\"></span>\r\n      </button>\r\n";
},"13":function(depth0,helpers,partials,data) {
    var stack1;

  return "      <a "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.schema : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " href=\""
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.url : stack1), depth0))
    + "\"\r\n         class=\"item-reference-link "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.disabledClass : stack1), depth0))
    + "\"\r\n         title=\""
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.anchorTitle : stack1), depth0))
    + "\"\r\n        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.multiFieldLabel : depth0),{"name":"if","hash":{},"fn":this.program(16, data, 0),"inverse":this.program(18, data, 0)})) != null ? stack1 : "")
    + ">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.itemName : stack1), depth0))
    + "\r\n      </a>\r\n";
},"14":function(depth0,helpers,partials,data) {
    return " aria-disabled=\"true\" ";
},"16":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return " aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.readModeMultiFieldAria || (depth0 != null ? depth0.readModeMultiFieldAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"readModeMultiFieldAria","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitleShort : stack1), depth0))
    + "\"\r\n        ";
},"18":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return " aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.readModeAria || (depth0 != null ? depth0.readModeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"readModeAria","hash":{}}) : helper)))
    + " "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitleShort : stack1), depth0))
    + "\" ";
},"20":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.errorCase : stack1),{"name":"if","hash":{},"fn":this.program(21, data, 0),"inverse":this.program(28, data, 0)})) != null ? stack1 : "");
},"21":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <button "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.schema : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " class=\"itempicker item-reference-link\"\r\n          "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.multiFieldLabel : depth0),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.program(24, data, 0)})) != null ? stack1 : "")
    + "\r\n          "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttonDisabled : stack1),{"name":"if","hash":{},"fn":this.program(26, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ">\r\n          <span class=\"placeholder error-placeholder\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\">\r\n              "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\r\n          </span>\r\n        </button>\r\n";
},"22":function(depth0,helpers,partials,data) {
    var helper;

  return " aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.readModeMultiFieldAria || (depth0 != null ? depth0.readModeMultiFieldAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"readModeMultiFieldAria","hash":{}}) : helper)))
    + "\"\r\n          ";
},"24":function(depth0,helpers,partials,data) {
    var helper;

  return " aria-label=\""
    + this.escapeExpression(((helper = (helper = helpers.readModeAria || (depth0 != null ? depth0.readModeAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"readModeAria","hash":{}}) : helper)))
    + "\" ";
},"26":function(depth0,helpers,partials,data) {
    return "disabled";
},"28":function(depth0,helpers,partials,data) {
    var stack1;

  return "        <button "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.schema : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " class=\"itempicker item-reference-link\"\r\n          "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.multiFieldLabel : depth0),{"name":"if","hash":{},"fn":this.program(22, data, 0),"inverse":this.program(24, data, 0)})) != null ? stack1 : "")
    + "\r\n          "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttonDisabled : stack1),{"name":"if","hash":{},"fn":this.program(26, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ">\r\n          <span class=\"placeholder\" title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\">\r\n            "
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\r\n          </span>\r\n        </button>\r\n";
},"30":function(depth0,helpers,partials,data) {
    var stack1;

  return " "
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.errorMsg : stack1), depth0))
    + " ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"cs-field-write\">\r\n  <div class=\"cs-field-write-inner\">\r\n    <div hidden id=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaDescribedById || (depth0 != null ? depth0.ariaDescribedById : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaDescribedById","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.fieldWriteDescribedByAria || (depth0 != null ? depth0.fieldWriteDescribedByAria : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"fieldWriteDescribedByAria","hash":{}}) : helper)))
    + "</div>\r\n    <input type=\""
    + this.escapeExpression(((helper = (helper = helpers.inputType || (depth0 != null ? depth0.inputType : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"inputType","hash":{}}) : helper)))
    + "\" id=\""
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{}}) : helper)))
    + "\" role=\"button\" aria-describedby=\""
    + this.escapeExpression(((helper = (helper = helpers.ariaDescribedById || (depth0 != null ? depth0.ariaDescribedById : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ariaDescribedById","hash":{}}) : helper)))
    + "\"\r\n        "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.idBtnLabel : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n        "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.multiFieldLabel : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n        value=\""
    + ((stack1 = this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.itemName : stack1), depth0)) != null ? stack1 : "")
    + "\" title=\""
    + ((stack1 = this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.anchorTitle : stack1), depth0)) != null ? stack1 : "")
    + "\" />\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.itemName : stack1),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "      <button class=\"binf-btn binf-btn-primary invoke-picker\" tabindex=\"0\" data-cstabindex=\"0\"\r\n              title=\""
    + this.escapeExpression(((helper = (helper = helpers.browse || (depth0 != null ? depth0.browse : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"browse","hash":{}}) : helper)))
    + "\">\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.browse || (depth0 != null ? depth0.browse : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"browse","hash":{}}) : helper)))
    + "\r\n      </button>\r\n"
    + ((stack1 = (helpers.xif || (depth0 && depth0.xif) || helpers.helperMissing).call(depth0,"this.mode !== 'writeonly'",{"name":"xif","hash":{},"fn":this.program(9, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n  </div>\r\n</div>\r\n\r\n<div class=\"cs-field-read\">\r\n  <div class=\"cs-field-read-inner\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.anchorTitle : stack1),{"name":"if","hash":{},"fn":this.program(11, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    <div class=\"btn-container\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.anchorTitle : stack1),{"name":"if","hash":{},"fn":this.program(13, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers.unless.call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.anchorTitle : stack1),{"name":"unless","hash":{},"fn":this.program(20, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"icon-container\">\r\n      <div class=\"csui-icon-edit inline-edit-icon icon-edit\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.edit || (depth0 != null ? depth0.edit : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"edit","hash":{}}) : helper)))
    + "\"></div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"breadcrumb-inner id-"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.nodeId : stack1), depth0))
    + " binf-hidden\"></div>\r\n<div class=\"item-reference-error-msg\"> "
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.item : stack1)) != null ? stack1.errorCase : stack1),{"name":"if","hash":{},"fn":this.program(30, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + " </div>\r\n";
}});
Handlebars.registerPartial('workflow_controls_form_impl_fields_itempicker_itempicker', t);
return t;
});
/* END_TEMPLATE */
;
// Lists explicit locale mappings and fallbacks

csui.define('workflow/controls/form/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/controls/form/impl/nls/root/lang',{
  alpacaPlaceholderItemReferencePicker: 'Add a Content Server item',
  browse: 'Browse',
  nodePickerDialogTitle: 'Select {0}',
  originalNodeUnavailable: 'Referenced item can not be accessed anymore',
  originalNodeUnavailableTooltip: 'The original node is unavailable or you do not have' +
                                  ' permission to access it.',
  remove: "Remove",
  cancel: "Cancel",
  edit: "Edit",
  toggleTitle: "{0}:Toggle breadcrumb",
  fieldEditAria: '{0}:{1}, Press Enter or F2 to Edit',
  fieldWriteDescribedByAria: "Press Space to Open Select Dialog"
});



csui.define('css!workflow/controls/form/impl/fields/itempicker/itempicker',[],function(){});
csui.define('workflow/controls/form/fields/itempickerfield.view',['csui/lib/underscore', 'csui/lib/jquery',
      'csui/lib/backbone', 'csui/lib/marionette',
      'csui/models/node/node.model',
      'csui/utils/contexts/factories/node',
      'csui/controls/form/fields/nodepickerfield.view',
      'csui/behaviors/default.action/default.action.behavior',
      'csui/dialogs/node.picker/node.picker',
      'i18n!csui/controls/form/impl/nls/lang',
      'workflow/controls/breadcrumbs/breadcrumbs.view',
      'hbs!workflow/controls/form/impl/fields/itempicker/itempicker',
      'i18n!workflow/controls/form/impl/nls/lang',
      'css!workflow/controls/form/impl/fields/itempicker/itempicker'
    ], function (_, $, Backbone, Marionette, NodeModel, NodeModelFactory, NodePickerFieldView,
        DefaultActionBehavior, NodePicker, langFormcsui,
        BreadcrumbsView, template, lang) {
      

      var ItemPickerFieldView = NodePickerFieldView.extend({
        template: template,
        templateHelpers: function () {
          var multiFieldLabel        = "",
              data                   = langFormcsui.noValue,
              readModeAria           = "", // better default value?
              readModeMultiFieldAria = "", // better default value?;
              isRequired             = false,
              isReadOnly             = this.mode === "readonly",
              requiredTxt            = "",
              toggleAria             = "",
              isMultiField           = false;

          isRequired = this.options.alpacaField && this.options.alpacaField.isRequired();
          requiredTxt = isRequired ? langFormcsui.requiredField : "";

          //data is just used for aria label, contains either noValue text, the name of the document
          //or the error message originalNodeUnavailable
          if (this.ancestors.pluck('name').length > 0) {
            var ancestors = this.ancestors.pluck('name');
            data = ancestors[ancestors.length - 1];
          }

          if (this.node.get('nodeError')) {
            data = lang.originalNodeUnavailable;
          }

          if (this.alpacaField && this.alpacaField.options &&
              this.alpacaField.options.isMultiFieldItem) {
            multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                              this.alpacaField.parent.options.label : "";
            isMultiField = this.alpacaField.options.isMultiFieldItem;
          }
          //readModeAria and readModeMultiFieldAria are used for aria-labels
          if (isMultiField) {
            readModeMultiFieldAria = isReadOnly ?
                                     langFormcsui.fieldReadOnlyAria.replace('{0}',
                                         multiFieldLabel).replace('{1}',
                                         data) + requiredTxt :
                                     lang.fieldEditAria.replace('{0}',
                                         multiFieldLabel).replace(
                                         '{1}',
                                         data) + requiredTxt;
            toggleAria = lang.toggleTitle.replace('{0}', multiFieldLabel);
          }
          else {
            if ((this.model.get('options')) && (this.model.get('options').label)) {
              readModeAria = isReadOnly ? langFormcsui.fieldReadOnlyAria.replace('{0}',
                  this.model.get('options').label).replace('{1}', data) +
                                          requiredTxt :
                             lang.fieldEditAria.replace('{0}',
                                 this.model.get('options').label).replace(
                                 '{1}', data) + requiredTxt;
              toggleAria = lang.toggleTitle.replace('{0}', this.model.get('options').label);
            }
          }

          return {
            inputType: 'text',
            idBtnLabel: this.options.labelId,
            ariaDescribedById: _.uniqueId("id_"),
            fieldWriteDescribedByAria: lang.fieldWriteDescribedByAria,
            readModeAria: readModeAria,
            readModeMultiFieldAria: readModeMultiFieldAria,
            multiFieldLabel: multiFieldLabel,
            browse: lang.browse,
            remove: lang.remove,
            cancel: lang.cancel,
            toggleTitle: toggleAria,
            edit: lang.edit
          };
        },

        ui: {
          readArea: '.cs-field-read',
          readField: '.cs-field-read .item-reference-link',
          writeArea: '.cs-field-write',
          writeField: '.cs-field-write input',
          anchor: '.cs-field-read a',
          more: '.inline-edit-more-button',
          buttonMore: '.inline-edit-more-button',
          breadCrumbs: '.breadcrumb-inner',
          clear: '.inline-clear-itempicker-button',
          errMsg: '.item-reference-error-msg',
          writeBrowseButton: '.cs-field-write .invoke-picker',
          cancelIcon: '.edit-cancel',
          browseButton: '.invoke-picker',
          placeHolder: 'span.placeholder',
          placeHolderButton: 'button.itempicker'
        },
        events: {
          'focusin @ui.anchor': 'onFocusInAnchor',
          'focusin @ui.writeField': 'onFocusInWriteField',
          'mousedown @ui.writeField': 'onClickWriteField',
          'keydown @ui.writeField': 'onKeydownWriteField',
          'keydown @ui.writeArea': 'onKeydownWriteArea',
          'click @ui.browseButton': 'onClickBrowse',
          'keydown @ui.browseButton': 'onKeydownBrowse',
          'click @ui.anchor': 'onClickButton',
          'keydown @ui.anchor': 'onKeydownButton',
          'click @ui.more': 'onClickMore',
          'keydown @ui.buttonMore': 'onKeydownMore',
          'click @ui.clear': 'clearFieldvalue',
          'keydown @ui.clear': 'clearFieldvalueKeydown',
          'mousedown @ui.writeBrowseButton, @ui.clear ': 'onMouseDownWriteElements',
          'click @ui.cancelIcon': 'onCancelClicked',
          'click @ui.placeHolder': 'onClickPlaceHolder',
          'keypress @ui.placeHolderButton': 'onKeypressPlaceHolder',
          'keydown @ui.placeHolderButton': 'onKeydownPlaceHolder'
        },

        onFocusInWriteField: function (event) {
          //used to set focus after render
          this.changedKey = false;
        },

        onClickPlaceHolder: function (event) {
          //click on empty field nothing happens, use edit icon to set in edit mode
          //without this a coreui code tries to open the empty link
          event.preventDefault();
          event.stopPropagation();
        },

        onKeydownPlaceHolder: function (event) {
          if ((event.keyCode === 32) && !(this.alpacaField.options.isMultiFieldItem)) {
            //with space in empty field nothing happens
            //without this a coreui code tries to open the empty link
            event.preventDefault();
            event.stopPropagation();
          }
        },

        onKeypressPlaceHolder: function (event) {
          //Enter on empty field stop propagation to onKeyPress of csformfield.editable.behavior.js
          //and call own function
          if (((event.keyCode === 13) || (event.keyCode === 32)) &&
              !(this.alpacaField.options.isMultiFieldItem)) {
            event.preventDefault();
            event.stopPropagation();
            if (event.keyCode === 13) {
              if (this.getStatesBehavior().isStateRead()) {
                event.preventDefault();
                event.stopPropagation();
                this.getEditableBehavior().setViewStateWriteAndEnterEditMode();
              }
            }
          }
        },

        //overwrite onKeyPress of nodepickerfield.view.js which would show the NodePicker
        onKeyPress: function (event) {
          //just let any key (especially 'enter') bubble to onKeyPress of
          // csformfield.editable.behavior.js
        },

        // overwrite false in nodepicker
        allowEditOnEnter: function () {
          return true;
        },

        onMouseDownWriteElements: function (e) {
          // when clicked on browse button and clear icon
          // the field should be in edit mode and
          // should not save the field
          this._isReadyToSave = false;
        },

        //anchor behavior in read mode
        onKeydownButton: function (event) {
          //with space Execute the default action for the attachment - open or download, or...
          var formView = this.options.formView;
          if (event.keyCode === 32) {
            event.preventDefault();
            event.stopPropagation();
            this.onClickButton(event);
          }
          if ((event.keyCode === 13) && !(this.alpacaField.options.isMultiFieldItem)) {
            // Enter set into edit mode
            if (this.getStatesBehavior().isStateRead()) {
              event.preventDefault();
              event.stopPropagation();
              this.getEditableBehavior().setViewStateWriteAndEnterEditMode();
            }
          }
          if ((event.keyCode === 13) && (this.alpacaField.options.isMultiFieldItem) &&
              (formView.mode === 'create') && (this.getStatesBehavior().isStateRead())) {
            // when there is a readonly mulitvalue field in draft mode enter should do nothing
            event.preventDefault();
            event.stopPropagation();
          }
        },

        //behavior in write mode when focus is on input field
        onKeydownWriteField: function (event) {
          //with 'Enter' and 'F2' set changedkey which sets later on the correct focus
          if ((event.keyCode === 13) || (event.keyCode === 113)) {
            this.changedKey = true;
          }
          //With Escape do the same as with click on cancel icon
          else if (event.keyCode === 27) {
            this.onCancelClicked(event);
          }
          //with space Execute the default action, same as with onClickWriteField
          else if (event.keyCode === 32) {
            event.preventDefault();
            event.stopPropagation();
            this.onClickWriteField(event);
          }
          //for all other keys (except the tab) don't let anything happen, no typing allowed in this
          // field, the 'tab or 'shift tab' will be handled by another function
          else if (event.keyCode !== 9) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
        ,

        //behavior in write mode when focus is on any field
        onKeydownWriteArea: function (event) {
          //with 'F2' set changedkey which sets later on the correct focus
          if (event.keyCode === 113) {
            this.changedKey = true;
          }
          //With Escape do the same as with click on cancel icon
          if (event.keyCode === 27) {
            this.onCancelClicked(event);
          }
        }
        ,

        onKeydownBrowse: function (event) {
          //With Enter do the same as with clikc
          if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.onClickBrowse(event);
          }
        }
        ,

        onClickBrowse: function (event) {
          this._isReadyToSave = true;
          event.preventDefault();
          this.$el.find("#" + this.model.get('id')).focus();
          this._showNodePicker();
        }
        ,

        clearFieldvalueKeydown: function (event) {
          //with enter clear value, same as clearFieldvalue
          if (event.keyCode === 13) {
            this.clearFieldvalue(event);
          }
        }
        ,

        clearFieldvalue: function (event) {
          this._isReadyToSave = true;
          //updating the write field with empty
          this.ui.writeField.val("");
          this.clearField = true;
          this.editVal = "";
          event.preventDefault();
          event.stopPropagation();
          this.ui.writeField.focus();
        }
        ,

        //overwrite the function in nodepickerfield.view because of readonly behavior in Draft mode
        onClickButton: function (event) {
          event.preventDefault();
          var formView = this.options.formView;
          // Execute the default action only in the form is not in the creation
          // mode and if the field points to a real node
          if (formView.mode !== 'create' && this.node.get('id')) {
            this.triggerMethod('execute:defaultAction', this.node);
          }
          // when there is a readonly field in draft mode with a default value default action should work
          if (formView.mode === 'create' && this.node.get('id') &&
              this.getStatesBehavior().isStateRead()) {
            this.triggerMethod('execute:defaultAction', this.node);
          }
        }
        ,

        setStateRead: function (validate, focus) {

          if (this.fieldsave) {
            this.fieldsave = undefined;

            //deleting the error messages
            if (this.$el.parents(".binf-form-group.alpaca-field") &&
                this.$el.parents(".binf-form-group.alpaca-field").find(".alpaca-message")) {
              this.$el.parents(".binf-form-group.alpaca-field").find(".alpaca-message").val("");
            }
            if (this.$el.hasClass('cs-formfield-invalid')) {
              this.$el.removeClass('cs-formfield-invalid');
            }

            if (this.newNode) {
              //updating the node to show the ancestor paths
              this.node.set(this.newNode.attributes);
              this.newNode = undefined;
              this.clearField = undefined;
            }
            if (this.clearField) {
              this.clearField = undefined;
              if (this.setValue(null, true)) {
                //clearing the node and ancestors path when clicked on clear icoon and rendering the node
                this.node.clear();
                this.ancestors._reset();

                this._renderNode();
              }
            }

          }
          else {
            if (this.ui.errMsg.hasClass('binf-hidden')) {
              this.ui.errMsg.removeClass('binf-hidden');

            }
            this.ui.writeArea.addClass('binf-hidden');
            this.ui.readArea.removeClass('binf-hidden');

            this.setValue(this.curVal, validate);
          }
          return false;
        }
        ,
        /*
         * overridden to avoid selection of field text
         */
        setStateWrite: function (validate, focus) {
          if (!this.ui.breadCrumbs.hasClass('binf-hidden')) {
            this.ui.breadCrumbs.addClass('binf-hidden');
            this.ui.more.attr('aria-expanded', 'false');
          }
          if (!this.ui.errMsg.hasClass('binf-hidden')) {
            this.ui.errMsg.addClass('binf-hidden');
          }
          if (this.getStatesBehavior().isWriteOnly() || this.getStatesBehavior().isStateWrite()) {
            this.ui.readArea.addClass('binf-hidden');
            this.ui.writeArea.removeClass('binf-hidden');
          } else {
            this._showNodePicker();
          }
          this.setValue(this.curVal, validate);
          this.ui.browseButton.focus();
          return true;
        }
        ,

        onKeydownMore: function (event) {
          //with enter on more button, show breadcrumbs
          if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();
            this.showHideBreadcrumbs();
          }
        }
        ,

        showHideBreadcrumbs: function () {
          this.breadcrumbs = new BreadcrumbsView({
            context: this.options.context,
            collection: this.ancestors,
            node: this.ancestors.node
          });
          this.listenTo(this.breadcrumbs.completeCollection, 'sync', this.breadcrumbsChanged);
          this.listenTo(this.breadcrumbs, 'after:synchronized', this.onAfterBreadcrumbsSynchronized);

          var collections = this.ancestors;
          collections.unbind('sync');
          this.breadcrumbs.updateCompleteCollection(collections);

          var breadcrumbds = new
              Marionette.Region({el: '.breadcrumb-inner.id-' + this.id});

          breadcrumbds.show(this.breadcrumbs);
          if (this.ui.breadCrumbs.hasClass('binf-hidden')) {
            this.ui.breadCrumbs.removeClass('binf-hidden');
            this.ui.more.attr('aria-expanded', 'true');
          } else {
            this.ui.breadCrumbs.addClass('binf-hidden');
            this.ui.more.attr('aria-expanded', 'false');
          }
        }
        ,

        onClickMore: function (event) {
          event.preventDefault();
          this.showHideBreadcrumbs();
        }
        ,

        onAfterBreadcrumbsSynchronized: function () {
          this.breadcrumbs._shrinkToFit(0.8 * this.$el.find(".breadcrumb-inner").outerWidth());
        }
        ,
        breadcrumbsChanged: function () {
          this.triggerMethod('change:breadcrumbs',
              {isBreadcrumbsEmpty: this.breadcrumbs.completeCollection.size() === 0});
        }
        ,
        _onWindowResize: function () {
          if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
          }
          this.resizeTimer = setTimeout(_.bind(function () {
            this._isReadyToSave = false;
            // FIXME: When resizing the window, the failure about fetching the
            // previously selected node will be lost.  Shouldn't it stay there
            // until another node is not selected?

            var options = {};
            options.url = DefaultActionBehavior.getDefaultActionNodeUrl(this.node);
            options.enabled = this.defaultActionController.hasAction(this.node);
            options.anchorTitle = this.ancestors.pluck('name').join(' > ');
            options.anchorShortTitle = this._prepareFieldText();
            var ancestors = this.ancestors.pluck('name');
            options.anchorName = ancestors[ancestors.length - 1];
            this._renderField(options);

            this.getStatesBehavior().setStateRead(false, true);
            this._isReadyToSave = true;
          }, this), 200);
        }
        ,
        _renderNode: function () {
          var options = {};
          options.url = DefaultActionBehavior.getDefaultActionNodeUrl(this.node);
          options.enabled = this.defaultActionController.hasAction(this.node);
          options.anchorTitle = this.ancestors.pluck('name').join(' > ');
          options.anchorShortTitle = this._prepareFieldText();
          var ancestors = this.ancestors.pluck('name');
          options.anchorName = ancestors[ancestors.length - 1];
          this.node.unset('nodeError');
          this._renderField(options);
          //this is only true when the _renderNode is called after a change of the item
          // reference and the change was submitted by 'F2' or 'Enter' in this case set focus()
          if ((this.$el.width() > 0) && (ancestors.length > 0) && (this.mode !== "readonly") &&
              (this.changedKey)) {
            this.ui.readField.focus();
          }
        }
        ,

        _renderField: function (options) {
          var errorCase, errorMsg;
          if (this.node.get('nodeError')) {
            errorCase = true;
            errorMsg = lang.originalNodeUnavailable;
            options.url = '#';
            options.enabled = false;
            options.anchorName = "";
            options.anchorShortTitle = "";
            options.anchorTitle = "";
          } else {
            errorCase = false;
          }
          // update model with ancestor data
          this.model.attributes.options.item = {};
          _.extend(this.model.attributes.options.item, {
                url: options.url,
                buttonDisabled: !options.enabled,
                disabledClass: options.enabled ? '' : 'binf-disabled',
                anchorTitle: options.anchorTitle,
                itemName: options.anchorName,
                anchorTitleShort: options.anchorShortTitle,
                nodeId: options.id ? options.id : this.id,
                errorCase: errorCase,
                errorMsg: errorMsg
              }
          );
          this.render();
        }
        ,

        _getNodePicker: function () {
          var alpOptions = this.model.get('options') || {},
              alpSchema  = this.model.get('schema') || {},
              label      = alpOptions.label || alpSchema.title,
              selectableTypes,
              parent;
          var attachmentFolderVal = $("#attachmentFolderId").val();
          if (attachmentFolderVal) {
            var attachmentFolderId = parseInt(attachmentFolderVal);
          }
          // Parent node should be passed in the field options to save
          // UI from having to fetch the node from the server; if not,
          // fall back to the expanded property of the fetched node

          if (this.model.get('multiFiedsItem')) {
            var type_control = this.model.get('typeControl');
            if (type_control) {
              selectableTypes = type_control.parameters.select_types;
              parent = attachmentFolderId || type_control.parameters.parent ||
                       this.node.parent && this.node.parent.attributes
                       || undefined;
            } else {
              selectableTypes = alpOptions.select_types;
              parent = attachmentFolderId || undefined;
            }

          } else {
            selectableTypes = alpOptions.type_control.parameters.select_types;
            parent = attachmentFolderId || alpOptions.type_control.parameters.parent ||
                     this.node.parent && this.node.parent.attributes
                     || undefined;
          }
          this.nodePicker = new NodePicker({
            connector: this.connector,
            dialogTitle: _.str.sformat(lang.nodePickerDialogTitle, label),
            selectableTypes: selectableTypes,
            globalSearch: true,
            context: this.options.context,
            initialContainer: {
              // parent is either an object with node properties from the
              // fetched node, or a number (parent_id) from the field options,
              // or undefined
              id: parent && parent.id || parent
            },
            initialSelection: [this.node]
          });
          return this.nodePicker;
        }
        ,

        _showNodePicker: function () {
          if (!this._isReadyToSave) {
            return;
          }
          this._isReadyToSave = false;

          var nodePicker = this._getNodePicker();
          nodePicker.show()
              .done(_.bind(function (args) {
                var newNode = args.nodes[0],
                    newId   = newNode.get('id');

                if (this.getStatesBehavior().isWriteOnly() ||
                    this.getStatesBehavior().isStateWrite()) {
                  // in create scenario remember new value
                  this.editVal = newId;
                } else {
                  // in update scenario immediately save change to read state
                  this.getStatesBehavior().setStateRead(false, true);
                }

                // Update the field to show the new node
                if (this.model.get("multiFiedsItem")) {
                  this.$el.find("#" + this.model.get('id')).val(newNode.get('name'));
                } else {
                  this.ui.writeField.val(newNode.get('name'));
                }
                this.newNode = newNode;
                // Expose the selected node information, in case someone would need it;
                // it is important also for re-creating of this view, which causes the
                // form reload after mofifying the original_id property; the constructor
                // tries to complete the node from the context and it would be empty
                var sharedNode = this.options.context.getModel(NodeModelFactory, {
                  attributes: {id: newId},
                  temporary: true
                });
                sharedNode.set(newNode.attributes);
              }, this))
              .fail(_.bind(function () {
              }, this))
              .always(_.bind(function () {
                //setting the focus the writefield
                this.ui.writeField.focus();

                this._isReadyToSave = true;

              }, this));
        }
        ,

        trySetValue: function () {

          var editVal               = this.getEditValue(), // new value
              curVal                = this.getValue(),  // old value
              bIsValid              = true,
              isReadyToSaveView     = this.isReadyToSave(),
              isFirstEditValueEmpty = (curVal === null && editVal === ""); // to stop server
          // call when user does not enter any value for empty field

          if (isReadyToSaveView && (editVal !== curVal || !isFirstEditValueEmpty)) {
            bIsValid = this.setValue(editVal, true);
            //setting the flag after saving the field value
            this.fieldsave = true;
          }

          return bIsValid;
        }
        ,

        onCancelClicked: function () {
          if (this.clearField) {
            //reset the editval to oldval
            this.editVal = this.oldVal;
          }
          //clearing fields
          this.clearField = undefined;
          this.newNode = undefined;
          // reset old value
          this.ui.writeField.val(this.node.get('name'));
        }
        ,

        _renderError: function () {
          this.node.set('nodeError', true);
          var options = {};
          this._renderField(options);
        }
      });

      return ItemPickerFieldView;
    }
)
;

csui.define('workflow/controls/form/fields/alpaca/alpcsuiitemreferencefield',['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  "csui/models/node/node.model",
  'workflow/controls/form/fields/itempickerfield.view',
  'i18n!workflow/controls/form/impl/nls/lang'
], function (module, _require, _, $, Backbone, Marionette, Alpaca, NodeModel, NodePickerFieldView,
    Lang) {
  

  Alpaca.Fields.CsuiItemReferenceField = Alpaca.Fields.IntegerField.extend({
    constructor: function ItemPickerField(container, data, options, schema,
        view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
      this.on("showNodePickerDialog", this.actionTriggerShowNodePickerDialog);
    },

    getFieldType: function () {
      return 'item_reference_picker';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
    },

    showField: function () {

      var id = this.id,
          type_control;

      this.options.id = "lbl" + _.uniqueId(id);

      // add an id to the <label> element like alpaca23Label
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length === 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }

      if (this.options.isMultiFieldItem) {
        var name       = this.name,
            childField = parseInt(name.substr(name.length - 1));
        type_control = this.options.type_control[Object.keys(
            this.options.type_control)[childField]];

        // This "Item" will be added to Item Reference field options onRender
        //In case of adding new fields in multiVale
        //the options will get from the field options where add icon is clicked
        //so the deleting the 'item'
        delete this.options["item"];
      }
      this.options.placeholder = Lang.alpacaPlaceholderItemReferencePicker;
      this.options.customField = true;

      this.fieldView = new NodePickerFieldView({
        context: this.connector.config.context,
        formView: this.connector.config.formView,
        model: new Backbone.Model({
          data: this.data ? this.data : null,
          options: this.options,
          schema: this.schema,
          typeControl: type_control,
          multiFiedsItem: this.options.isMultiFieldItem,
          id: id
        }),
        id: _.uniqueId(id),
        alpacaField: this,
        labelId: id4Label,
        value: this.data,
        readonly: true,
        dataId: this.name,
        path: this.path,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        }
      });

      // replace alpaca control with empty div having same classes as control
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);

      // show our field in div
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);

      return;
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      }
      return bIsValid;
    },

    focus: function () {
      this.fieldView.$el.focus();
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }

  });

  Alpaca.registerFieldClass('item_reference_picker', Alpaca.Fields.CsuiItemReferenceField,
      'bootstrap-csui');
  Alpaca.registerFieldClass('item_reference_picker', Alpaca.Fields.CsuiItemReferenceField,
      'bootstrap-edit-horizontal');

  return $.alpaca.Fields.ItemPickerField;
});

// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.properties/workitem.properties.view',[
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/utils/log',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/form/form.view',
  'csui/controls/globalmessage/globalmessage',
  'workflow/widgets/message/message.view',
  'workflow/widgets/workitem/workitem.properties/impl/workitem.instructions.view',
  'workflow/utils/workitem.extension.controller',
  'hbs!workflow/widgets/workitem/workitem.properties/impl/workitem.properties',
  'i18n!workflow/widgets/workitem/workitem/impl/nls/lang',
  'i18n!workflow/widgets/workitem/workitem.properties/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.properties/impl/workitem.properties',
  'workflow/controls/form/fields/alpaca/alpcsuirealfield',
  'workflow/controls/form/fields/alpaca/alpcsuiitemreferencefield'
], function (_, Backbone, Marionette, $, log, LayoutViewEventsPropagationMixin,
    PerfectScrollingBehavior, FormView, GlobalMessage, MessageView,
    WorkItemInstructionsView, WorkItemExtensionController, template, lang, WorkItemPropertiesLang) {
  

  // A collection of form views to show the detail information about a workitem
  var FormsView = Marionette.CollectionView.extend({

    // core-ui forms as child views
    childView: FormView,

    // each form element should have a parent div element
    tagName: 'div',

    // each form element should have a parent class
    className: 'workflow-workitem-form',

    childViewOptions: function (model, index) {
      var columns = model.get('Columns');
      var doubleCol = columns > 1 ? 'doubelCol' : 'singleCol';
      var options = _.extend({layoutMode: doubleCol}, this.options);
      return options;
    },

    onShow: function () {
      var that = this;
      if (this.options.mode) {
        _.each(this.children._views, function (formView) {
          if ((that.options.mode === "create")) {
            //for draft process the event is added, to refresh the same definition fields when
            // one of the fields modified.
            that.listenTo(formView, 'change:field', that.refreshSameDefFields);
          } else {
            //only when this is not a draft process the event is added, because for draft
            //save is only done when the process is started
            that.listenTo(formView, 'change:field', that._saveField);
          }
        });
      }
    },

    _addValidationErrorElement: function () {

      var views = this.children._views;
      views[Object.keys(views)[0]].$el.before('<div class="metadata-validation-error"></div>');
      this.validationErrorElem = $(this.$el.find('.metadata-validation-error')[0]);

      this.validationErrorElem.append(
          '<button class="icon notification_error cs-close-error-icon" title="' +
          WorkItemPropertiesLang.HideValidationErrorMessageIconTooltip +
          '" aria-label="' + WorkItemPropertiesLang.HideValidationErrorMessageIconTooltip + '" ></button>');
      this.validationErrorElem.append('<span class="validation-error-message">' +
                                      WorkItemPropertiesLang.FormValidationErrorMessage +
                                      '</span>');
      this.validationErrorElem.hide();

      var closeIcon = $(this.$el.find('.metadata-validation-error .cs-close-error-icon')[0]);
      closeIcon && closeIcon.on('click', _.bind(function (event) {
        event.preventDefault();
        event.stopPropagation();
        this._hideValidationError();
      }, this));

    },

    _validateForm: function () {
      var formValid = true, currentForm;
      _.each(this.children._views, function (formView) {
        var bValidateChildren = true;
        if (formView.form)
        {
          formView.form.refreshValidationState(bValidateChildren);
          currentForm = formView.form.isValid(bValidateChildren);
          formValid = formValid && currentForm;
        }
      });
      return formValid;
    },

    _saveForms: function () {
      //this function is called when for a draft process start is clicked, to save the data of
      // the forms
      _.each(this.children._views, function (formView) {
        // saving form data
        var values = formView.form.getValue();
        if (_.keys(values).length) {
          var options = {
            action: "formUpdate",
            values: values
          };
          formView._blockActions();
          formView.model._saveChanges(options, formView).fail(_.bind(function (error) {
            GlobalMessage.showMessage('error', error.message);
            formView.trigger('forms:error');
          }, this))
              .always(_.bind(function () {
                formView._unblockActions();
              }, this));
        }
      });
    },

    _showValidationError: function () {

      if (this.validationErrorElem === undefined) {
        this._addValidationErrorElement();
      }
      if (this.$el.find('.alpaca-message-notOptional').length > 0) {
        this.validationErrorElem && this.validationErrorElem.show();
      } else {
        this.validationErrorElem && this.validationErrorElem.hide();
      }

    },

    _hideValidationError: function () {
      this.validationErrorElem && this.validationErrorElem.hide();
    },

    _clearValidationError: function () {
      if (this.validationErrorElem) {
        this.validationErrorElem.remove();
        delete this.validationErrorElem;
      }
    },

    _saveField: function (args) {
      this._showValidationError();
      // get the form values
      var values = args.view.form.getValue();
      this.args = args;
      this.values = values;
      this.name = args.parentField ? args.parentField.name : args.name;
      var formView = args.view;
      if (_.keys(values).length) {
        if (formView._validate(values)) {
          var options = {
            action: "formUpdate",
            values: values
          };
          formView._blockActions();
          // saving form data
          args.model._saveChanges(options, formView).done(_.bind(function () {
            //setting the saved field value to the alpaca form model
            formView.model.attributes.data[this.name] = this.values[this.name];
            var draftProcess = false;
            this.checkSameDefField(this.args, draftProcess);
            formView.trigger('forms:sync');
            // event for keyboard navigation
            var event = $.Event('tab:content:field:changed');
            formView.$el.trigger(event);
          }, this))
              .fail(_.bind(function (error) {
                GlobalMessage.showMessage('error', error.message);
                formView.trigger('forms:error');
              }, this))
              .always(_.bind(function () {
                formView._unblockActions();
              }, this));
        }
      }
    },

    refreshSameDefFields: function (args) {
      var draftProcess = args.draftProcess ? args.draftProcess : true;
      this.checkSameDefField(args, draftProcess);
    },

    parseSection: function (model, obj) {

      var viewId    = this.children._indexByModel[model.cid],
          fieldView = this.children._views[viewId].form ?
                      this.children._views[viewId].form.childrenByPropertyId[obj.name] : "",
          formView  = this.children._views[viewId];

      if (fieldView) {
        //If the field view is multivalued view
        if (fieldView.type === "array") {

          var fieldsArrayLength = fieldView.children.length,
              valueArrayLength  = obj.currentfieldValue.length,
              length            = 0;
          
          if (fieldsArrayLength !== valueArrayLength) {  
            
            // stop listening events for add and remove item in formview
            this.stopListening(formView, 'change:field');
            if (fieldsArrayLength > valueArrayLength) {
  
              for (length = valueArrayLength; length < fieldsArrayLength; length++) {
  
                //removing item in multivalue field view if the items are greater than actual item
                // values
                fieldView.removeItem(0, function () {});
              }
            } else if (fieldsArrayLength < valueArrayLength) {
              for (length = fieldsArrayLength; length < valueArrayLength; length++) {
                var itemData    = "",
                    itemOptions = fieldView.children[0].options,
                    itemSchema  = fieldView.children[0].schema;
  
                //adding item in multivalue field view if the items are less than actual item
                // values
                fieldView.addItem(1, itemSchema, itemOptions, itemData, function () {});
              }
            }
            
            // restarting listener for add and remove item in form view
            if ((this.options.mode === "create")) {
              //for draft process refresh the same definition fields when one of the fields is modified.
              this.listenTo(formView, 'change:field', this.refreshSameDefFields);
            } else {
              //if not draft process save the fields on modification
              this.listenTo(formView, 'change:field', this._saveField);
            }
          }

          if (!obj.draftprocess) {
            //only when this is not a draft process, all fields should be in read mode
            fieldView._showItemsInReadMode();
          }

          _.each(fieldView.children, function (view, Index) {
            if (view.data !== obj.currentfieldValue[Index]) {
              view.setValueAndValidate(obj.currentfieldValue[Index], true);
              view.refresh();
            }
          });
        } else {
          //If the view is single value view
          fieldView.setValueAndValidate(obj.currentfieldValue, true);
          fieldView.refresh();
        }
      }
    },

    checkSameDefField: function (args, draftprocess) {
      var formView = args.view,
          that     = this,
          obj      = {};
      obj.values = args.view.form.getValue();
      obj.name = args.parentField ? args.parentField.name : args.name;
      obj.draftprocess = draftprocess;
      obj.currentfieldValue = obj.values[obj.name];

      //parsing the sections to find the same definition fields or set the performer id for the
      // current form views model
      _.each(formView.collection.models, function (model) {
        if (model !== formView.model && obj.name in model.attributes.data
            && model.attributes.data[obj.name] !== obj.currentfieldValue) {
          model.attributes.data[obj.name] = obj.currentfieldValue;
          that.parseSection(model, obj);
        } else if (model === formView.model && args.changePerformer) {
          var viewId    = that.children._indexByModel[model.cid],
              fieldView = that.children._views[viewId].form ?
                          that.children._views[viewId].form.childrenByPropertyId[obj.name] : "";
          if (fieldView) {
            fieldView.setValueAndValidate(obj.currentfieldValue, true);
            fieldView.refresh();
          }
        }
      });
    },
  });

  // An application widget is a view, because it should render a HTML fragment
  var WorkItemContentView = Marionette.LayoutView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'workflow-workitem-properties',

    // Template method rendering the HTML for the view
    template: template,

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function WorkItemContentView(options) {
      options || (options = {});

      this.context = options.context;
      this.parentView = options.parentView;
      //passing workflow extensions to the view
      this.extensions = options.extensions;

      Marionette.LayoutView.prototype.constructor.call(this, options);

      // Cause the show events triggered on the parent view re-triggered
      // on the views placed in the inner regions
      this.propagateEventsToRegions();
    },

    regions: {
      message: '.workitem-message',
      instructions: '.workitem-instructions',
      forms: '.workitem-forms',
      extension: '.workitem-extension'
    },

    ui: {
      selectMultiMap: '.workitem-multimap-select-message'
    },
    behaviors: {
      ScrollingProperties: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    onRender: function () {
      // show work item model as body, use default layout for now
      if (this.model) {
        var mapsList = this.model.get('mapsList');
        if (this.model.get('isDoc') === true && mapsList && mapsList.length !== 1) {
          this.ui.selectMultiMap.text(WorkItemPropertiesLang.multiMapSelectMessage);
          this.ui.selectMultiMap.show();
        }
        // message view
        var msg = this.model.get('message');
        this.model.attributes.id = this.model.get('process_id');
        if (msg) {
          this.message.show(new MessageView({
            connector: this.model.connector,
            model: new Backbone.Model({
              subject: msg.type,
              sender: msg.performer,
              text: msg.text
            })
          }));
        }
        // instructions view
        this.instructions.show(new WorkItemInstructionsView({
          context: this.context,
          model: this.model
        }));
        // form view

        var FormView = new FormsView({
          context: this.options.context,
          collection: this.model.forms,
          node: this.model,
          mode: (this.model.get('isDraft') || this.model.get('isDocDraft') ||
                 (mapsList && mapsList.length === 1 )) ?
                'create' : 'update'
        });
        this.forms.show(FormView);
        this.listenTo(this.model, 'form:saveForms', function () {
          FormView._saveForms();
        });

        this.listenTo(this.model, 'form:isValid', function (workitem) {
          //checking validation of the form fields
          if (FormView._validateForm()) {
            workitem.validate = true;
            FormView._clearValidationError();
          } else {
            FormView._showValidationError();
          }
        });
        //check the extensions for a view to show here
        var dataPackages = this.model.get('data_packages');
        _.each(dataPackages, function (dataPackage) {
          var controller = _.find(this.extensions, function (ext) {
            return ext.validate(dataPackage.type, dataPackage.sub_type);
          });
          if (controller) {
            controller.execute({
              extensionPoint: WorkItemExtensionController.ExtensionPoints.AddForm,
              model: this.model,
              data: dataPackage.data,
              parentView: this //passing in the parent view
            }).done(_.bind(function (args) {
              //add package type and sub_Type
              args.type = dataPackage.type;
              args.sub_type = dataPackage.sub_type;
              //show the attachments view when the node model is loaded
              if (args.viewToShow) {
                this.extension.show(args.viewToShow);
              }
            }, this))
                .fail(_.bind(function (args) {
                  //show error message
                  var errMsg = args.errorMsg || lang.ErrorMessageLoadExtension;
                  GlobalMessage.showMessage('error', errMsg);
                }, this));
          }

        }, this);
      } else {
        log.warn('Form view cannot displayed without data');
      }
    }
  });

  _.extend(WorkItemContentView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemContentView;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem.body/impl/workitem.body',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-body-row binf-row\">\r\n  <div class=\"workitem-properties\"></div>\r\n</div>\r\n\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem.body_impl_workitem.body', t);
return t;
});
/* END_TEMPLATE */
;
// Lists explicit locale mappings and fallbacks

csui.define('workflow/widgets/workitem/workitem.body/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

// Defines localizable strings in the default language (English)

csui.define('workflow/widgets/workitem/workitem.body/impl/nls/root/lang',{
  NoModelWarning: 'Form view cannot displayed without data'
});



csui.define('css!workflow/widgets/workitem/workitem.body/impl/workitem.body',[],function(){});
// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.body/workitem.body.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/progressblocker/blocker',
  'csui/controls/globalmessage/globalmessage',
  'workflow/widgets/workitem/workitem.properties/workitem.properties.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.view',
  'hbs!workflow/widgets/workitem/workitem.body/impl/workitem.body',
  'i18n!workflow/widgets/workitem/workitem.body/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.body/impl/workitem.body'
], function (_, Marionette, log, LayoutViewEventsPropagationMixin, BlockingView, GlobalMessage,
    WorkItemPropertiesView, WorkItemAttachmentsView, template, lang) {
  

  // An application widget is a view, because it should render a HTML fragment
  var WorkItemBodyView = Marionette.LayoutView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'workflow-workitem-body',

    // Template method rendering the HTML for the view
    template: template,

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function WorkItemBodyView(options) {
      options || (options = {});

      this.context = options.context;
      //passing workitemView to child views to hide header and footer of dialog when it is replaced by metadataview in child view
      this.parentView = options.parentView;
      //passing workflow extensions to the view
      this.extensions = options.extensions;

      Marionette.LayoutView.prototype.constructor.call(this, options);

      // Cause the show events triggered on the parent view re-triggered
      // on the views placed in the inner regions
      this.propagateEventsToRegions();

      // initialize blocking view
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
    },

    regions: {
      properties: '.workitem-properties'
    },

    onRender: function () {

      // show work item model as body, use default layout for now
      if (this.model) {
        this.properties.show(new WorkItemPropertiesView({
          context: this.context,
          model: this.model,
          extensions: this.extensions,
          parentView: this
        }));
      } else {
        log.warn(lang.NoModelWarning);
      }
    }

  });

  _.extend(WorkItemBodyView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemBodyView;

});

// An application widget is exposed via a RequireJS module
csui.define('workflow/widgets/workitem/workitem.tabPanel/workitem.tabPanel.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/utils/contexts/factories/node',
  'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin'
], function (_, $, Backbone, Marionette, log, NodeModelFactory, TabPanelView,
    TabLinkCollectionViewExt, TabLinksScrollMixin) {
  

  /**
   * Workitem integration controller
   * @param options Initialization options like context, data, parent view
   * @constructor
   */
  var WorkItemTabPanelView = TabPanelView.extend({

    contentView: function (model) {
      return model.get('viewToRender');
    },

    contentViewOptions: function (model) {
      return model.get('viewToRenderOptions');
    },

    constructor: function WorkItemTabPanelView(options) {
      _.defaults(options, {
        tabType: 'binf-nav-pills',
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
      });

      // initialize parent
      TabPanelView.prototype.constructor.apply(this, arguments);

    },

    render: function () {
      TabPanelView.prototype.render.apply(this);

      this._initializeToolbars();
      this._listenToTabEvent();

      // delay this a bit since the initial dialog fade in makes the tab to be hidden
      setTimeout(_.bind(this._enableToolbarState, this), 500);
      return this;
    }
  });

  // add the mixin functionality to the tab view implementation and return
  _.extend(WorkItemTabPanelView.prototype, TabLinksScrollMixin);
  return WorkItemTabPanelView;
});



/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem/impl/workitem',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-row binf-row\">\r\n  <div class=\"workitem-view-left binf-col-md-8 binf-col-sm-8 binf-col-xs-12\">\r\n    <div class=\"workitem-header\">\"></div>\r\n    <div class=\"workitem-body\"></div>\r\n  </div>\r\n  <aside role=\"complementary\">\r\n  <div class=\"workitem-tabpanel binf-col-md-4 binf-col-sm-4\">\r\n    <div class=\"workitem-tabpanel-header\"></div>\r\n    <div class=\"workitem-tabpanel-content\"></div>\r\n  </div>\r\n  </aside>\r\n</div>\r\n<footer role=\"contentinfo\">\r\n<div class=\"workitem-footer cs-dialog binf-modal-footer\"></div>\r\n</footer>\r\n\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem_impl_workitem', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem/impl/workitem.nopackages',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-header\"></div>\r\n<div class=\"workitem-body\"></div>\r\n<div class=\"workitem-footer cs-dialog binf-modal-footer\"></div>\r\n\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem_impl_workitem.nopackages', t);
return t;
});
/* END_TEMPLATE */
;

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/workitem/workitem/impl/workitem.fullview',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"workitem-extension-fullview\"></div>\r\n\r\n";
}});
Handlebars.registerPartial('workflow_widgets_workitem_workitem_impl_workitem.fullview', t);
return t;
});
/* END_TEMPLATE */
;

/**
 * Workitem view widget, used by the workflow perspective
 */
csui.define('workflow/widgets/workitem/workitem/workitem.view',[
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/models/member',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/node',
  'csui/utils/commands/open.node.perspective',
  'csui/models/nodes',
  'csui/models/nodechildren',
  'csui/utils/commandhelper',
  'workflow/commands/open.workitem/open.workitem',
  'workflow/widgets/workitem/workitem.activities/workitem.activities.controller',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.controller',
  'workflow/utils/workitem.extension.controller',
  'workflow/utils/workitem.util',
  'workflow/models/workitem/workitem.model.factory',
  'workflow/dialogs/action.dialog/action.dialog',
  'workflow/dialogs/action.dialog/action.dialog.model',
  'workflow/widgets/workitem/workitem/impl/header.view',
  'workflow/widgets/workitem/workitem/impl/footer.view',
  'workflow/widgets/workitem/workitem.body/workitem.body.view',
  'workflow/widgets/workitem/workitem.tabPanel/workitem.tabPanel.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.view',
  'i18n!workflow/widgets/workitem/workitem/impl/nls/lang',
  'hbs!workflow/widgets/workitem/workitem/impl/workitem',
  'hbs!workflow/widgets/workitem/workitem/impl/workitem.nopackages',
  'hbs!workflow/widgets/workitem/workitem/impl/workitem.fullview',
  'csui-ext!workflow/widgets/workitem/workitem.view',
  'css!workflow/widgets/workitem/workitem/impl/workitem'
], function (_, $, Backbone, Marionette, ModalAlert, GlobalMessage,
    LayoutViewEventsPropagationMixin, TabPanelView, TabLinkCollectionViewExt, MemberModel,
    UserModelFactory, ApplicationScopeModelFactory, NodeModel, NodeModelFactory,
    OpenNodePerspective, NodeCollection, NodeChildrenCollection, CommandHelper, OpenWorkItemCommand,
    WorkItemActivitiesController, WorkItemAttachmentsController, WorkItemExtensionController, Utils,
    WorkItemModelFactory, ActionDialogView, ActionDialogModel, HeaderView, FooterView,
    WorkItemBodyView, WorkItemTabPanelView, WorkItemAttachmentsView, lang, template,
    templatenopackages, templateextfullview, viewExtensions) {
  

  var TabPanelCollection = Backbone.Collection.extend({
    //this is sorting the collection by 'position'
    comparator: function (a) {
      return a.get('position');
    }
  });

  var WorkitemView = Marionette.LayoutView.extend({

    // Outermost parent element should contain a unique widget-specific class
    className: 'workitem-view',

    // Template method rendering the HTML for the view
    template: template,

    regions: {
      header: '.workitem-header',
      body: '.workitem-body',
      tabPanel: '.workitem-tabpanel-content',
      footer: '.workitem-footer',
      fullview: '.workitem-extension-fullview'
    },

    ui: {
      tabPanelHeader: '.workitem-tabpanel-header',
      tabPanelContent: '.workitem-tabpanel-content'
    },

    // flag indicating that the view is currently sending the work item
    _isSending: false,

    // Constructor gives an explicit name to the object in the debugger and
    // can update the options for the parent view, which `initialize` cannot
    constructor: function WorkitemView(options) {

      //Collection to display on sidebar
      this.tabPanelCollection = new TabPanelCollection();

      // Obtain the model with the data shown by this view; using the model
      // factory with the context makes the model instance not only shareable
      // with other widgets through the context, but also fetched at the same
      // moment as the other models.
      options.model = options.model ? options.model :
                      options.context.getModel(WorkItemModelFactory);

      // get the current user in order to prevent forwarding the
      // workitem to the processing user again.
      this.user = options.context.getModel(UserModelFactory);

      // Models and collections passed via options to the parent constructor
      // are wired to
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions();

      // Whenever properties of the model change, re-render the view
      this.listenTo(this.model, 'change', this.onModelChange);

      // Load the extensions
      var ext = viewExtensions;
      // if provided on the options use it, necessary for the Unit Tests.
      if (options.viewExtensions) {
        ext = options.viewExtensions;
      }
      this.extensions = _.chain(ext)
          .flatten(true)
          .map(function (ViewExtension) {
            return new ViewExtension(options);
          }).value();
    },

    tabNextRegion: function () {
      this.trigger('changed:focus');
    },

    onModelChange: function () {
      // collect promises that have to be executed before the view is rendered
      var promises = [];
      promises.push(this.getTabPanelCollection());
      promises.push(this.getFullViewExtension());

      // when all promises are resolved we can continue
      $.when.apply($, promises).done(_.bind(function (args) {

        // return in case the workflow is initiated by item or data is unfetched
        if ((this.model.get("isDoc") || this.model.get("isDocDraft")) &&
            this.model.get('datafetched') !== true) {
          return;
        }

        // load the Reply To user
        this.replyPerformer = undefined;
        var self = this;
        var replyPerformerId = this.model.get('reply_performer_id');
        if (replyPerformerId && replyPerformerId !== 0) {
          var replyPerformer = new MemberModel({id: replyPerformerId}, {connector: this.model.connector});
          replyPerformer.fetch().done(function (data, result) {
            if (result === 'success') {
              self.replyPerformer = replyPerformer;
            }
          });
        }

        if ((this.model.get("isDoc") || this.model.get("isDocDraft")) &&
            !this.model.get('docModels') && this.model.get('doc_id')) {
          var docIds       = this.model.get('doc_id').split(','),
              docModels    = [],
              that         = this,
              docNamesList = {};

          _.each(docIds, function (docId) {
            var tmpDocModel = that.options.context.getModel(NodeModelFactory,
                {attributes: {id: parseInt(docId)}}, {silent: true});
            tmpDocModel.fetch()
                .done(_.bind(function (args) {
                  var docModelProperties = args.results.data.properties,
                      docModel           = new NodeModel({
                        "type": 1,
                        "type_name": "Shortcut",
                        "container": false,
                        "name": docModelProperties.name,
                        "original_id": docModelProperties.id,
                        "original_id_expand": docModelProperties
                      }, {connector: that.model.connector});
                  docModels.push(docModel);
                  that.model.set({docModels: docModels}, {silent: true});
                  docNamesList[docId] = docModelProperties.name;
                }, that))
                .always(_.bind(function (args) {
                  if (docIds.length === that.model.get('docModels').length) {
                    this.model.set('doc_names', docNamesList);
                    // render the view with the event, so that 'getTemplate' is called again
                    this.render();
                  }
                }, that))
                .fail(_.bind(function (error) {
                  GlobalMessage.showMessage('error', error.responseJSON.error);
                }, that));
          });

        } else {
          // render the view with the event, so that 'getTemplate' is called again
          this.render();
        }
      }, this));
    },

    extensionsExecuteAction: function (action, options, model) {
      // extension data
      var data;
      // all promises
      var promises = [];
      _.each(this.extensions, function (ext) {

        // add extension promise
        var deferred = $.Deferred();
        promises.push(deferred.promise());

        // execute extension
        ext.executeAction({"action": action, "options": options, "model": model})
            .done(_.bind(function (args) {
              // save return
              if (!_.isUndefined(args)) {
                data = args;
              }
              deferred.resolve();
            }, this))
            .fail(_.bind(function (args) {
              deferred.reject();
            }, this));
      });

      // resolve the promise when all controller are executed
      var ret = $.Deferred();
      $.when.apply($, promises).done(_.bind(function () {
        ret.resolve(data);
      }, this))
        .fail(_.bind(function (args) {
          ret.reject();
        }, this));

      return ret.promise();
    },

    getTabPanelCollection: function () {

      // reset the tab panel collection
      this.tabPanelCollection.reset();
      //this local variable is necessary, because when there are 2 onmodelchange in a row, the
      // global variable could be filled double
      var TabPanelCollectionLocal = new TabPanelCollection();

      // add the activities package manually on the client-side as we want to reuse the
      // extension mechanism for the package, but it's only an internal client side package.
      var dataPackages = this.model.get('data_packages');
      if (dataPackages === undefined) {
        dataPackages = [];
      }
      dataPackages.push({
        type: WorkItemActivitiesController.prototype.type,
        sub_type: WorkItemActivitiesController.prototype.sub_type,
        data: {}
      });

      // browse packages to evaluate & execute them.
      var allPackagesExecuted = [];
      _.each(dataPackages, function (dataPackage) {

        // create a deferred object and add it to the promises list
        var packageExecuted = $.Deferred();
        allPackagesExecuted.push(packageExecuted.promise());

        // find the first extension controller supporting the current package
        var controller = _.find(this.extensions, function (ext) {
          return ext.validate(dataPackage.type, dataPackage.sub_type);
        });

        // execute the controller with sidebar extension point target
        if (controller) {
          controller.execute({
            extensionPoint: WorkItemExtensionController.ExtensionPoints.AddSidebar,
            model: this.model,
            data: dataPackage.data,
            parentView: this
          }).done(_.bind(function (args) {
            //add package type and sub_Type for the tabpanelcollection
            args.type = dataPackage.type;
            args.sub_type = dataPackage.sub_type;

            // the sidebar integrations requires the view type / options instead of the
            // already instantiated view object.
            if (args.viewToRender) {
              // add to the tab panel collection
              TabPanelCollectionLocal.add(_.extend(args, {id: _.uniqueId('workflow-tab')}));
            }
            packageExecuted.resolve();
          }, this)).fail(_.bind(function (args) {
            // show error message
            GlobalMessage.showMessage('error', args.errorMsg || lang.ErrorMessageLoadExtension);
            packageExecuted.resolve();
          }, this));
        }
        else {
          // resolve the promise
          packageExecuted.resolve();
        }
      }, this);

      // resolve the promise when all controller are executed
      var ret = $.Deferred();
      $.when.apply($, allPackagesExecuted).done(_.bind(function () {
        this.tabPanelCollection = TabPanelCollectionLocal;
        ret.resolve();
      }, this));
      return ret.promise();
    },

    getFullViewExtension: function () {
      // holds the list of promises
      var promises = [];

      // reset the full view
      this.fullViewExtension = undefined;

      // browse data packages
      var pkgs = this.model.get('data_packages');
      _.each(pkgs, function (pkg) {

        // do we have a matching controller
        var controller = _.find(this.extensions, function (extension) {
          return extension.validate(pkg.type, pkg.sub_type);
        });

        // execute the controller
        if (controller) {
          // add a promise to be resolved later when the extension is evaluate
          var deferred = $.Deferred();
          promises.push(deferred.promise());
          // if we have a controller we have to determine whether it wants to display in full-view
          controller.execute({
            extensionPoint: WorkItemExtensionController.ExtensionPoints.FullView,
            model: this.model,
            data: pkg.data,
            parentView: this
          }).done(_.bind(function (args) {
            //add package type and sub_Type
            args.type = pkg.type;
            args.sub_type = pkg.sub_type;
            if (args.viewToShow) {
              // flip the template and set the global full-view
              this.extensionsFullView = args.viewToShow;
            }
            deferred.resolve();
          }, this)).fail(_.bind(function (args) {
            // show error message
            GlobalMessage.showMessage('error', args.errorMsg || lang.ErrorMessageLoadExtension);
            deferred.resolve();
          }, this));
        }
      }, this);

      // resolve the returned promise when all extensions are evaluated
      var ret = $.Deferred();
      $.when.apply($, promises).done(function () {
        ret.resolve();
      });
      return ret.promise();
    },

    onBeforeRender: function () {
      // determine template to render
      if (this.extensionsFullView !== undefined) {
        // render the full-view template
        this.template = templateextfullview;
      } else if (this.tabPanelCollection.models.length === 0) {
        // render the template without packages
        this.template = templatenopackages;
      } else {
        // render the standard template
        this.template = template;
      }
    },

    onRender: function () {

      if ((this.model.get("isDoc") || this.model.get("isDocDraft")) &&
          this.model.get('datafetched') !== true) {
        return;
      }

      if (this._isSending) {
        //prevent rendering during sending
        return;
      }

      if (this.extensionsFullView !== undefined) {
        // render extension full-view
        this.fullview.show(this.extensionsFullView);
      } else {
        // render the workitem header view
        this._renderHeader();
        // render the workitem body
        this._renderBody();
        // render the tabpanel
        this._renderTabPanel();
        // render the workitem footer view with the action buttons
        this._renderFooter();

        // show the member accept dialog if required
        if (this.model.attributes.member_accept) {
          this._confirmMemberAccept();
        }
      }
    },

    _renderHeader: function () {
      var options = {
        iconLeft: 'title-icon assignment-workflow',
        title: this.model.title()
      };

      if ((this.model.get("isDoc") || this.model.get("isDocDraft")) && this.model.get('mapsList') &&
          this.model.get('mapsList').length > 1) {
        options.multiMaps = true;
        options.context = this.options.context;
        options.maps = this.model.get("mapsList");
        options.model = this.model;
      }
      var headerView = this.headerView = new HeaderView(options);
      this.header.show(headerView);
    },

    _renderBody: function () {
      this.options.parentView = this;
      this.options.extensions = this.extensions;
      // Add work item body view
      var bodyView = this.bodyView = new WorkItemBodyView(this.options);
      this.body.show(bodyView);
    },

    _renderTabPanel: function () {
      var mapsList = this.model.get('mapsList');

      //if this WF is started from document and there are more than one WF to select do this
      //before this was also only done when document packages are active, might be necessary to
      // consider again - ToDo
      if (this.model.get('isDoc') && this.model.get('datafetched') && mapsList &&
          mapsList.length !== 1) {
        this.viewToShow = new WorkItemAttachmentsView({
          context: this.options.context,
          view: this
        });
        this.viewToShow.render();
        if (this.viewToShow) {
          this.tabPanel.show(this.viewToShow);
          this.ui.tabPanelHeader.addClass("workitem-doc-initiate");
          this.ui.tabPanelContent.addClass("workitem-doc-initiate");
          if (this.viewToShow.attachments) {
            var that     = this,
                interval = setInterval(function () {
                  //Load attachments only when attachment area completed loading
                  //So that if the attachments are more scroll bar will come
                  if ($(".workitem-attachments").length > 0) {
                    clearInterval(interval);
                    that.viewToShow.unblockActions();
                    that.viewToShow.list.show(that.viewToShow.attachments);
                  }
                }, 500);
          }
        }
      }
      else {
        //show the sidebar
        if (this.tabPanelCollection.models.length > 0) {
          var workItemTabPanelView = new WorkItemTabPanelView({
            collection: this.tabPanelCollection
          });
          this.tabPanel.show(workItemTabPanelView);
        }
      }
    },

    _renderFooter: function () {
      var buttonArray = [];
      var button = {};

      if ((!this.model.actions || !this.model.customActions) && this.model.get('isDoc') !== true) {
        return; // model not completely loaded
      }

      if (this.model.actions && this.model.customActions) {
        var actions = this.model.actions.models;
        var customActions = this.model.customActions.models;

        _.each(actions, function (action) {
          button = {
            label: action.get('label'),
            toolTip: action.get('label'),
            id: action.get('id')
          };
          buttonArray.push(button);
        });

        _.each(customActions, function (customAction) {
          button = {
            label: customAction.get('label'),
            toolTip: customAction.get('label'),
            id: customAction.get('id'),
            default: true
          };
          buttonArray.push(button);
        });
      }

      var mapsList = this.model.get('mapsList');
      //Start WF from document with more WF's activated scenario
      // in this case no model is loaded, since no WF is selected yet => 'Start Button'
      // is added manuel
      if (this.model.get('isDoc') === true && mapsList && mapsList.length !== 1) {
        button = {
          label: lang.StartButtonLabel,
          disabled: true,
          default: true
        };
        buttonArray.push(button);
      }

      //add close Button, for a draft work item it should be cancel

      if (this.model.get('isDraft') || this.model.get('isDocDraft') || this.model.get('isDoc')) {
        button = {
          label: lang.CancelButtonLabel,
          toolTip: lang.CancelButtonLabel,
          close: true
        };
      } else {
        button = {
          label: lang.CloseButtonLabel,
          toolTip: lang.CloseButtonLabel,
          close: true
        };

      }
      buttonArray.push(button);

      var footerView = this.footerView = new FooterView({
        collection: new Backbone.Collection(buttonArray)
      });
      this.listenTo(footerView, 'childview:click', this.onClickButton);
      this.footer.show(footerView);
    },

    _confirmMemberAccept: function () {
      // confirm accepting of group assignment workitem
      var self = this;
      ModalAlert.confirmQuestion(lang.MemberAcceptDialogMessage, lang.MemberAcceptDialogTitle, {
        centerVertically: false,
        buttons: {
          showYes: true,
          labelYes: lang.MemberAcceptAcceptButtonLabel,
          showNo: true,
          labelNo: lang.MemberAcceptCloseButtonLabel
        }
      }).always(function (result) {
        if (result) {
          // exited with 'accept'
          self._acceptWorkitem();
          //trigger setfocus in headerview
          self.headerView.triggerMethod("setFocus");
        } else {
          // exited with 'close'
          self._rejectWorkitem();
        }
      });
    },

    _acceptWorkitem: function () {
      // accept workitem
      var self = this;
      this.model.sendMemberAcceptAction().done(function () {
        // update the performer fields
        self._updateWorkitemPerformer();
        // show success message
        GlobalMessage.showMessage('success', lang.MemberAcceptedMessage);
      }).fail(function (response) {
        // evaluate error
        var error;
        if (response.errorDetail && response.errorDetail === "ErrCode_Accept_Task") {
          error = lang.MemberAcceptErrorDescription;
        } else {
          error = response.error;
        }
        // show error and leave workitem
        ModalAlert.showWarning(error, lang.MemberAcceptErrorTitle).always(function () {
          self._leaveWorkitemPerspective();
        });
      });
    },

    _rejectWorkitem: function () {
      // leave workitem perspective
      this._leaveWorkitemPerspective();
    },

    _updateWorkitemPerformer: function () {
      //listing out the form views which contains performer system field
      var filteredFormViewsList = [],
          contentView           = this.options.parentView.bodyView.properties.currentView,
          formView              = contentView.forms.currentView;
      if (formView && formView.children) {
        var childFormViews = formView.children._views;
        _.each(childFormViews, function (formView) {
          var model      = formView.model,
              attributes = model.attributes.data,
              matchedKey = _.has(attributes, "WorkflowForm_Performer");
          // checking forms if any one of the form sections contains at performer system fiels
          // attribute
          if (matchedKey) {
            filteredFormViewsList.push(formView);
          }
        });
        if (filteredFormViewsList.length > 0) {
          //Preparing input data for the refreshSameDefFields
          var args         = {},
              loggedUserId = this.options.parentView.user.get('id'),
              targetField  = {
                name: "WorkflowForm_Performer",
                path: "/WorkflowForm_Performer",
                value: loggedUserId
              };
          args.view = filteredFormViewsList[0];
          args.model = filteredFormViewsList[0].model;
          args.changePerformer = true;
          args.draftProcess = false;
          _.extend(args, {
            name: "WorkflowForm_Performer",
            path: "/WorkflowForm_Performer",
            value: loggedUserId,
            targetField: targetField
          });
          args.view.form.setValue({WorkflowForm_Performer: args.value});
          formView.refreshSameDefFields(args, args.draftProcess);
        }
        // update performer on extension views
        var extensionView = contentView.getChildView("extension");
        if (extensionView) {
          extensionView.triggerMethod('change:performer');
        }
      }
    },

    getTemplate: function () {
      if ((this.model.get('isDoc') && this.model.get('docModels'))) {
        return template;
      }
      else {
        //necessary to return the correct template either templatenopackages or template
        return this.template;
      }
    },

    getUrl: function () {
      //Constructing the url to navigate to the classic ui
      var vars = {};
      //Extracting the query string values from the url
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
          function (m, key, value) {
            vars[key] = value;
          });
      var originIndex = vars["origin_index"],
          nextUrl     = vars["nexturl"],
          base_url    = this.model.connector.connection.url.replace("/api/v1", ""),
          strURLArray = ["func=Personal.Assignments", "func=work.Workflows&tabname=Assignments"];
      if (originIndex >= 0 && originIndex <= strURLArray.length - 1) {
        return base_url + "?" + strURLArray[originIndex];
      } else if (nextUrl) {
        return decodeURIComponent(nextUrl);
      } else if (document.referrer) {
        return document.referrer;
      } else {
        return base_url + "/app/nodes/2000";
      }
    },

    /**
     * Click on one of the buttons in the footer.
     * The click is forwarded to the button click action or
     * it triggers a history back if it is the close button.
     * The back action will show the last view on the history stack.
     * @param view
     */
    onClickButton: function (view) {

      var model = view.model;
      if (model.get('close')) {
        // leave workitem perspective
        this._leaveWorkitemPerspective();
      } else {
        var workItem = {validate: false};
        this.model.trigger('form:isValid', workItem);
        //checking the form validation
        if (workItem.validate) {
          //save the Forms\Data in case of draft, because with draft the Data isn't
          //saved yet (see LPAD-55309)
          if (this.model.get('isDraft') || this.model.get('isDocDraft') ||
              this.model.get('isDoc')) {
            this.model.trigger('form:saveForms');
          }
          // execute the requested workitem action
          this._ExecuteAction(model.get('id'), view);
        }
      }
    },

    /**
     * Executes the requested workitem action
     * @param idButton Action id
     * @private
     */
    _ExecuteAction: function (idButton, buttonView) {

      // get the action either from the default actions
      // or from the custom actions.
      var action = this.model.actions.get(idButton);
      if (_.isUndefined(action)) {
        action = this.model.customActions.get(idButton);
      }

      // depending on the action performed, initialize the dialog model
      var actionOptions = {};
      switch (action.get('key')) {
      case 'Delegate':
      {
        // in the case of delegate, we require an assignee
        actionOptions = {
          requireAssignee: true,
          assignee: this.user
        };
        break;
      }
      case 'Review':
      {
        // in the case of review, we require an assignee, the
        // assignment options and different labels
        actionOptions = {
          requireAssignee: true,
          assignee: this.user,
          assigneeOptions: true,
          texts: {
            assigneeLabel: lang.AssigneePickerLabelSendTo,
            commentLabel: lang.CommentTextFieldLabelInstructions,
            commentPlaceholder: lang.CommentTextFieldPlaceholderInstructions,
            submitLabel: lang.SubmitLabelSend
          }
        };
        break;
      }
      case 'Reply':
      {
        // in the case of reply, we display the original user readonly
        // and use different comment labels
        actionOptions = {
          readonlyAssignee: true,
          assignee: this.replyPerformer,
          texts: {
            assigneeLabel: lang.AssigneePickerLabelTo,
            commentLabel: lang.CommentTextFieldLabelReply,
            commentPlaceholder: lang.CommentTextFieldPlaceholderReply,
            submitLabel: lang.SubmitLabelSend
          }
        };
        break;
      }
      }

      // execute extensions
      this.extensionsExecuteAction(action, actionOptions, this.model)
          .done(_.bind(function (args) {
            if (args && (args.scope === 'custom')) {
              // send on workitem with custom model
              var customModel = new Backbone.Model(args.data);
              this._sendOnWorkitem(customModel);
            } else {
              // standard processing
              //if there is an Attachment added, check on Server wether one of the Attachments is reserved
              //when an attachment is reserved. Warn User, but allow sendOn anyway
              if ((this.tabPanelCollection !== undefined) && (this.tabPanelCollection.length > 0)) {
                //find attachment tabpanel model
                var nodeModelFromTabPanelCollection = _.filter(this.tabPanelCollection.models,
                    function (tabPanelModel) {
                      if ((tabPanelModel.get("type") === 1) &&
                          (tabPanelModel.get("sub_type") === 1)) {
                        return true;
                      }
                    });
                //only when attachemnt tabpanelmodel avaialble use the nodemodel ot the attachments to fetch
                // children\attachments new
                if (nodeModelFromTabPanelCollection.length > 0) {
                  var attachmentCollection = new NodeChildrenCollection(undefined, {
                    node: nodeModelFromTabPanelCollection[0].get("viewToRenderOptions").model,
                    fields: {
                      properties: ['id', 'reserved', 'name']
                    }
                  });
                  attachmentCollection.fetch()
                      .done(_.bind(function (args) {
                        //check which one are reserved
                        var reservedAttachments = _.filter(args.data, function (attachment) {
                          return attachment.reserved;
                        });
                        var that = this;
                        //only when there are reserved attachments open dialog
                        if (reservedAttachments.length > 0) {
                          var options = {};
                          options.buttons = ModalAlert.buttons.OkCancel;
                          var documentListText = "";
                          _.each(reservedAttachments, function (attachment) {
                            documentListText = documentListText + " " + attachment.name;
                          });

                          var reserveDocumentMessageTextLocalized = _.str.sformat(
                              lang.ReserveDocumentMessageText, documentListText);

                          var promise = ModalAlert.confirmWarning(
                              reserveDocumentMessageTextLocalized,
                              lang.ReserveDocumentMessageTitle, options);
                          promise.then(function () {
                            that._sendOnWorkitem_check(action, actionOptions, buttonView);
                          });
                        }
                        else {
                          that._sendOnWorkitem_check(action, actionOptions, buttonView);
                        }
                      }, this));
                }
                else {
                  this._sendOnWorkitem_check(action, actionOptions, buttonView);
                }
              }
              else {
                this._sendOnWorkitem_check(action, actionOptions, buttonView);
              }
            }
          }, this))
          .fail(_.bind(function (args) {
            //in this case no sendon is done
            return;
          }, this));
    },

    _sendOnWorkitem_check: function (action, actionOptions, buttonView) {
      var dialogModel = new ActionDialogModel(_.extend({
        title: _.str.sformat(lang.DialogModelTitle, action.get('label'),
            this.model.get('title')),
        requireComment: this.model.get('comments_on'),
        authentication: this.model.get('authentication'),
        currentUser: this.user.get('display_name'),
        action: action
      }, actionOptions));

      // either show action dialog or send-on immediately
      if (dialogModel.get('requireComment') || dialogModel.get('requireAssignee') || dialogModel.get('authentication')) {
        // show the dialog
        var actionDialog = new ActionDialogView({
          context: this.options.context,
          model: dialogModel,
          callback: _.bind(this._sendOnWorkitem, this)
        });
        //with this the focus is set to the button which opened the dialog
        this.listenTo(actionDialog, 'destroy', _.bind(function () {
          this.$el.focus();
        }, buttonView));
        actionDialog.show();
      } else {
        // comments are disabled, no dialog is displayed, but we
        // use the dialog model as it contains the action.
        this._sendOnWorkitem(dialogModel);
      }
    },

    /**
     * Gets the error message from a response to show it.
     * @param resp AJAX response
     * @returns {string} Error message
     * @private
     */
    _getRespError: function (resp) {
      var error = '';
      if (resp && resp.responseJSON && resp.responseJSON.error) {
        error = resp.responseJSON.error;
      } else if (resp && resp.responseText) {
        error = resp.responseText;
      }
      return error;
    },

    _navigateToDocParentNode: function () {

      var nodesCommand = new OpenNodePerspective(),
          parentNode   = this.options.context.getModel(NodeModelFactory,
              {attributes: {id: this.model.get('parent_id')}}),
          status       = {};
      status.context = this.options.context;
      status.nodes = new NodeCollection([parentNode]);
      var promisesFromCommands = nodesCommand.execute(status);
      CommandHelper.handleExecutionResults(promisesFromCommands,
          {
            command: this.nodesCommand,
            suppressSuccessMessage: status.suppressSuccessMessage
          });

    },

    /**
     * Sends the workitem on
     * @param model Workitem mdel
     * @param options Additional options
     * @private
     */
    _sendOnWorkitem: function (model, options) {

      // mark the widget as sending
      this._isSending = true;

      // get the action from the action dialog model
      var action = model.get('action');

      // update the workitem and send on
      var comment = model.get('comment');
      if (!_.isUndefined(comment) && comment.length !== 0) {
        this.model.set('comment', comment, {silent: true});
      }

      var assignee = model.get('assignee');
      if (!_.isUndefined(assignee)) {
        // use silent mode to prevent rendering, because the work item is sent on.
        this.model.set('assignee', assignee.get('id'), {silent: true});
      }

      var assigneeOption = model.get('assigneeOption');
      if (!_.isUndefined(assigneeOption)) {
        // use silent mode to prevent rendering, because the work item is sent on.
        this.model.set('assigneeOption', assigneeOption, {silent: true});
      }

      var authentication_info = model.get('authentication_info');
      if (!_.isUndefined(authentication_info)) {
        // use silent mode to prevent rendering, because the work item is sent on.
        this.model.set('authentication_info', authentication_info, {silent: true});
      }

      this.model.sendAction(action)
          .done(_.bind(function (results) {
            //the urlOrg and url_org are used to remember what the original URL is
            var urlOrg = "";
            if (window.location.href.indexOf("reload_classic_ui=true") > 0) {
              //there are now 2 cases either the url created for origin_index or the nexturl (in
              // case there is autodisplay active) is returned
              urlOrg = this.getUrl();
              this.model.set({url_org: urlOrg}, {silent: true});
            }
            else {
              urlOrg = this.model.get('url_org');
            }
            //when the autodisplay is activated in cs, then this object is available
            if ((results) && (results.auto_display)) {
              if (results.auto_display.workflow_open_in_smart_ui === true) {
                //here the new WF is loaded in smartUI
                this.model.reset({silent: true});
                this._isSending = false;
                this.model.set({
                  process_id: results.auto_display.process_id,
                  subprocess_id: results.auto_display.subprocess_id,
                  task_id: results.auto_display.task_id,
                  url_org: urlOrg
                });
              }
              else {
                //here the new WF is loaded in classicUI
                //the openWorkitemCommand has to be extended because the getUrlQueryParameters
                //has to be overwritten
                var OpenWorkItemViewCommand = OpenWorkItemCommand.extend({ // URL for
                  // open in same tab, new tab isn't possible here because of popup restrictions
                  openInNewTab: false,
                  getUrlQueryParameters: function (node, options) {
                    return {
                      func: 'work.EditTask',
                      workid: node.get('process_id'),
                      subworkid: node.get('subprocess_id'),
                      taskid: node.get('task_id'),
                      nexturl: node.get('url_org')
                    };
                  }
                });
                var openWorkItemViewCommand = new OpenWorkItemViewCommand();
                this.model.set({
                  process_id: results.auto_display.process_id,
                  subprocess_id: results.auto_display.subprocess_id,
                  task_id: results.auto_display.task_id,
                  url_org: urlOrg
                }, {silent: true});
                var node = this.model;
                openWorkItemViewCommand._navigateTo(node);
              }
            }

            else {
              // close view and show global success message
              this._leaveWorkitemPerspective();
              // provide success message
              if (results && results.custom_message) {
                // show custom message if provided
                GlobalMessage.showMessage('success', results.custom_message);
              } else {
                if (this.model.get('isDraft') || this.model.get('isDocDraft') ||
                    this.model.get('isDoc')) {
                  // show standard message for initiation of a draft work item
                  GlobalMessage.showMessage('success', lang.SuccessInitiateMessage);
                } else {
                  // show standard message for a send on
                  GlobalMessage.showMessage('success', lang.SuccessSendOnMessage);
                }
              }
            }

          }, this))
          .fail(_.bind(function (response) {
            // show the error
            var serverError = this._getRespError(response);
            var title = _.str.sformat(lang.ActionFailMessageTitle, action.get('label'));
            var message = _.str.sformat(lang.ActionFailMessage, action.get('label'), serverError);
            ModalAlert.showError(message, title);

            // reset the sending flag
            this._isSending = false;
          }, this));
    },

    _leaveWorkitemPerspective: function () {
      // there are several options to close the workitem perspective
      // - back to classic ui
      // - back from 'initiate from document' scenario
      // - back to user landing page if history stack is empty
      // - back in history
      if (window.location.href.indexOf("reload_classic_ui=true") > 0) {
        // reload classic my assignment list
        var url = Utils.validateURL(this.getUrl());
        if (url && url !== '') {
          window.open(url, "_self");
        }
        else {
          this._navigateBack();
        }
      } else if (this.model && this.model.get('isDocDraft') === true) {
        // reload document parent node
        this._navigateToDocParentNode();
      } else if (this.model.get('url_org')) {
        // if this attribute is defined go back to the original url
        location.href = this.model.get('url_org');
      }
      else {
        // back in history
        this._navigateBack();
      }
    },

    _navigateBack: function () {
      // navigate back or go to landing page
      if (history.length > 1) {
        // either navigate back in history ...
        history.back();
      } else {
        // ... or landing page
        this.options.context.getModel(ApplicationScopeModelFactory).set('id', '');
      }
    }

  });

  _.extend(WorkitemView.prototype, LayoutViewEventsPropagationMixin);
  return WorkitemView;
});


csui.define('workflow/models/wfstatus/wfstatus.table.model',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url', 
  'csui/models/mixins/connectable/connectable.mixin', 
  'csui/models/mixins/fetchable/fetchable.mixin', 
  'csui/models/fetchable', 
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin', 
  'csui/models/mixins/v2.fields/v2.fields.mixin', 
  'csui/models/mixins/v2.expandable/v2.expandable.mixin', 
  'csui/models/mixins/v2.commandable/v2.commandable.mixin', 
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin', 
  'csui/models/nodechildrencolumn', 'csui/models/nodechildrencolumns', 
  'csui/models/node/node.model', 
  'workflow/utils/workitem.util', 
  'i18n!csui/models/widget/nls/lang', 
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ConnectableMixin, FetchableMixin, FetchableModel, 
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, CommandableV2Mixin, 
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin, NodeChildrenColumnModel, 
    NodeChildrenColumnCollection, NodeModel, WorkItemUtil, lang) {
   

  var WFStatusColumnModel = NodeChildrenColumnModel.extend( {

    constructor:function WFStatusColumnModel(attributes, options) {

      NodeChildrenColumnModel.prototype.constructor.call(this, attributes, options); 
    }

  }); 

  var WFStatusColumnCollection = NodeChildrenColumnCollection.extend( {

    model:WFStatusColumnModel, 

    // private
    getColumnModels:function (columnKeys, definitions) {
      var columns = NodeChildrenColumnCollection.prototype.getColumnModels.call(
          this, columnKeys, definitions); 
      _.each(columns, function (column) {
        var columnKey = column['column_key'], 
            columns = ['status_key', 'due_date', 'wf_name', 'step_name', 'assignee', 
              'date_initiated']; 
        if (columns.indexOf(columnKey) >= 0) {
          column.sort = true; 
        }
      }); 
      return columns; 
    }, 

    getV2Columns:function (response) {

      var definitions = (response.results && response.results[0] && 
                         response.results[0].definitions && 
                         response.results[0].definitions.wfstatus) ||  {}; 

      var columnKeys = _.keys(definitions); 

      return this.getColumnModels(columnKeys, definitions); 
    }

  }); 

  var WFStatusModel = NodeModel.extend( {

        parse:function (response, options) {

          if (response.data && response.data.wfstatus) {
            var assigneeData =  {}, userId = 0; 
            assigneeData.assignees = response.data.wfstatus.assignee; 
            if (assigneeData.assignees.length === 1) {
              userId = assigneeData.assignees[0].userId; 
            }
            if (response.data.wfstatus.assignedto) {
              response.data.wfstatus.assignedto.assignees = assigneeData.assignees; 
            }
            assigneeData.assignedto = response.data.wfstatus.assignedto; 
            response.data.wfstatus.userId = userId; 
            response.data.wfstatus.assignee = WorkItemUtil.getAssignee(assigneeData); 
            response.data.properties = response.data.wfstatus; 
          }

            var node = NodeModel.prototype.parse.call(this, response, options); 
            return node; 
        }

  }); 

  var WFStatusCollection = Backbone.Collection.extend(_.extend( {}, FetchableModel(Backbone.Collection),  {

    model:WFStatusModel, 

    constructor:function WFStatusCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments); 

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset', 
          'includeResources', 'fields', 'expand', 'commands', 'status', 'retention', 'wfstatusfilter',
          'filterWorkflowtype', 'filterWorkflows', 'selectionType', 'isFilterVisible', 'statusListCount', 'chatSettings']);
      }


      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options); 

      this.columns = new WFStatusColumnCollection(); 
    }, 

    clone:function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, this.options); 
      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON()); 
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount; 
      clone.wfstatus = this.model; 
      clone.totalCount = this.totalCount; 
      clone.filteredCount = this.filteredCount; 
      return clone; 
    }, 

    url:function () {

      var baseUrl = this.connector.connection.url.replace('/v1', '/v2'), 
      getUrl = Url.combine(baseUrl, '/workflows/status'), 
      filterWorkflowtype = this.options.filterWorkflowtype, 
      retention = this.options.retention,
      selectionType = this.options.selectionType,
      wfstatusfilter = this.options.wfstatusfilter;

      if (!filterWorkflowtype) {
        filterWorkflowtype = WorkItemUtil.getWorkflowtype(this.options.filterWorkflows);
      }
      
      getUrl += "?selectionType=" + selectionType; 
      
      if(wfstatusfilter && wfstatusfilter!=='')
      {
        getUrl += "&wfstatusfilter=" + wfstatusfilter; 
      }
      else
      {
        getUrl += "&wfretention=" + retention; 
        getUrl += "&kind=" + filterWorkflowtype; 
      }
     
      
      return getUrl; 
    }, 

    parse:function (response, options) {

      this.parseBrowsedState(response, options); 
      this.columns && this.columns.resetColumnsV2(response, this.options); 
      return this.parseBrowsedItems(response, options); 
    }, 

    getResourceScope:function () {
      return _.deepClone( {
        fields:this.fields, 
        expand:this.expand, 
        includeResources:this._additionalResources, 
        commands:this.commands
      }); 
    }, 
    fetchdata:function (options) {
      if (options) {
        this.options = options; 
      }
      //Backbone.Collection.prototype.fetch.apply( this, arguments );
      return this.Fetchable.fetch.apply(this, arguments); 
    }, 
    setResourceScope:function (scope) {
      this.excludeResources(); 
      scope.includeResources && this.includeResources(scope.includeResources); 
      this.resetFields(); 
      scope.fields && this.setFields(scope.fields); 
      this.resetExpand(); 
      scope.expand && this.setExpand(scope.expand); 
      this.resetCommands(); 
      scope.commands && this.setCommands(scope.commands); 
    }

  })); 

  ClientSideBrowsableMixin.mixin(WFStatusCollection.prototype); 
  // when due_date is null, put the record at the bottom for ascending sort as PM and CWS request
  var originalCompareValues = WFStatusCollection.prototype._compareValues; 
  WFStatusCollection.prototype._compareValues = function (property, left, right) {
    if (property.indexOf('date') >= 0) {
      if (left === null) {
        return 1; 
      }
      if (right === null) {
        return-1; 
      }
    }
    return originalCompareValues.apply(this, arguments); 
  }; 

  BrowsableV2ResponseMixin.mixin(WFStatusCollection.prototype); 
  ConnectableMixin.mixin(WFStatusCollection.prototype); 
  FetchableMixin.mixin(WFStatusCollection.prototype); 
  AdditionalResourcesV2Mixin.mixin(WFStatusCollection.prototype); 
  FieldsV2Mixin.mixin(WFStatusCollection.prototype); 
  ExpandableV2Mixin.mixin(WFStatusCollection.prototype); 
  CommandableV2Mixin.mixin(WFStatusCollection.prototype); 

  return WFStatusCollection; 

}); 

csui.define('workflow/models/wfstatus/wfstatus.collection.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'workflow/models/wfstatus/wfstatus.table.model', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, WFStatusCollection) {
  

  var WFStatusCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'wfstatus-list',

    constructor: function WFStatusCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var wfstatus = this.options.wfstatus || {};
      if (!(wfstatus instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        wfstatus = new WFStatusCollection(wfstatus.models, _.extend(
            {connector: connector}, this.options, config.options,
            WFStatusCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = wfstatus;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    },

    isFetchable: function () {
      if (window.csui && window.csui.mobile) {
        return !this.property.fetched;
      }
      return true;
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        // So far, all properties are includes in the wfstatus fields
        fields: {
          wfstatus: []
        },
        // Get property definitions to support table columns or similar
        // and actions to support clickability and others
        includeResources: ['metadata']
      });
    }

  });

  return WFStatusCollectionFactory;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/controls/visualdata/impl/wfdonut',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wf-status-visual-data-container\"></div>";
}});
Handlebars.registerPartial('workflow_controls_visualdata_impl_wfdonut', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!workflow/controls/visualdata/impl/wfdonut',[],function(){});
// Shows the Shortcut widget of a specific node
csui.define('workflow/controls/visualdata/visual.data.donut.view',[
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/lib/d3',
  'hbs!workflow/controls/visualdata/impl/wfdonut',
  'css!workflow/controls/visualdata/impl/wfdonut'
], function (_, Marionette, $, d3, template) {

  

  var WFStatusView = Marionette.ItemView.extend({

    className: 'wf-status-donut-piechart',

    template: template,

    rootElementType: "svg",

    defaults: {
      marginTop: 10,
      marginTopp: 60,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 20,
      groupAfter: 0
    },

    ui: {
      dataVisContainer: '.wf-status-visual-data-container',
    },

    //Unbinding the events registered to the window.
    //Tooltips are adding directly to DOM.So removing them from DOM.
    onDestroy: function () {
      $(window).unbind('resize.app', this.render);
      $('.wfstatus-donut-chart-tooltip.toolTip').remove();
    },

    constructor: function WFStatusView(options) {
      this.options = options;
      this.parentEle = this.options.parent.$el;
      Marionette.ItemView.prototype.constructor.call(this, options);
      $(window).bind("resize.app", this.render);
    },
    onRender: function () {

      var minPadding           = -30;
      this.uniqueID = _.uniqueId('vis_');

      var width  = (this.width() > 0) ? this.width() : $(this.$el).width() - this.marginLeft()
                                                       - this.marginRight(),
          height = (this.height() > 0) ? this.height() : $(this.$el).height() -
                                                         this.marginTop() - this.marginBottom();

      this.visElement = d3.select(this.ui.dataVisContainer[0]).append(this.rootElementType)
          .attr("id", this.uniqueID)
          .attr("focusable", false)
          .attr("width", width + this.marginLeft() + this.marginRight())
          .attr("height", height - this.marginTopp());

      this.visElement.append('g')
          .attr('transform', 'translate(' + this.marginLeft() + ',' + '-' + 40 + ')')
          .attr('class', 'vis-wrapper');

      this.visElement.select('.vis-wrapper')
          .append('g')
          .attr('class', 'pie-chart')
          .attr('transform', 'translate(' + this.width() / 4 + ',' + this.height() / 2 + ')'); // center at 1/3

      this.visElement.select('.vis-wrapper')
          .append('g')
          .attr('class', 'pie-legend-container')
          .attr('transform',
              'translate(' + ((this.width() / 3 ) * 2 + minPadding - 30) + ',' + this.height() / 2 +
              ')'); // center at 2/3 + padding

      var tooltip = d3.select('body')
          .append("div")
          .attr("class", "wfstatus-donut-chart-tooltip toolTip");

      var contentView  = this,
          visElement   = contentView.visElement,
          colors       = ['#09bcef', '#8cc53e', '#f3794e'],
          color        = d3.scaleOrdinal(colors),
          chartData    = this.options.dataset,

          donutWidth   = 1.35, // thickness of donut ring
          radius       = Math.min(width / 4, height / 3) + 10,
          colorOpacity = 0.9,
          outlineStrokeWidth   = 1,
          outlineStrokeColor   = "#ffffff",
          outlineStrokeOpacity = "0.7";

      width = this.width() - this.marginLeft() - this.marginRight();
      height = this.width() - this.marginTop() - this.marginBottom();

      var arc = d3.arc()
          .innerRadius(radius / donutWidth)
          .outerRadius(radius);

      var pie = d3.pie()
          .sort(null)
          .value(function (d) {
            return d.count;
          });

      var segments = visElement.select('.pie-chart').selectAll('.arc')
          .data(pie(chartData))
          .enter().append('g')
          .attr('class', 'arc')
          .style('cursor', 'pointer');

      segments.append('path')
          .attr('d', arc)
          .attr('tabindex', function (d, i) {
            return d.data.count ? 0 : -1;
          })
          .attr('focusable', function (d, i) {
            return d.data.count ? true : false;
          })
          .attr('fill-opacity', colorOpacity)
          .style('fill', function (d, i) {
            return color(i);
          })
          .on("keyup", function (d) {
            //tab key
            if (d3.event.keyCode === 9) {
              visElement.select('.pie-chart').selectAll('.arc')
                  .filter(function (d2, i2) {
                    return (d2.data.status === d.data.status);
                  })
                  .attr("stroke", outlineStrokeColor)
                  .attr("stroke-opacity", outlineStrokeOpacity)
                  .transition()
                  .duration(0)
                  .attr("stroke-width", outlineStrokeWidth);
            }
          })
          .on("focusout", function (d) {
            visElement.select('.pie-chart').selectAll('.arc')
                .filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "none");
          })
          .on("keydown", function (d) {
            //Enter key
            if (d3.event.keyCode === 13) {
              d3.event.data = {status: d.data.status};
              contentView.options.parent.triggerMethod('click:segment', d3.event);
            }
          })
          .on("mouseover", function (d) {
            tooltip.text(d.data.count + ' ' + contentView.options.statusArray[d.data.status]);
            return tooltip.style("visibility", "visible");
          })
          .on("mousemove", function (d) {
            tooltip.text(d.data.count + ' ' + contentView.options.statusArray[d.data.status]);
            var mousePos = d3.mouse(d3.select("body").node());
            return tooltip.style("top", mousePos[1] - 25 + "px").style("left", mousePos[0] - 10 + "px");
          })
          .on("mouseout", function (d) {
            tooltip.text(d.data.count + ' ' + contentView.options.statusArray[d.data.status]);
            return tooltip.style("visibility", "hidden");
          })
          .on("click", function (d) {
            //setting segment data in the event data attribute
            d3.event.data = {status: d.data.status};
            contentView.options.parent.triggerMethod('click:segment', d3.event);
          });

      var donutTotal = visElement.select('.pie-chart')
          .append('g')
          .attr('class', 'pie-total-container')
          .style('cursor', 'pointer');

      var minFontSize      = 10,
          valueFontSize    = minFontSize,
          valueOffsetRatio = 10;

      donutTotal.append('text')
          .attr('tabindex', '0')
          .attr('class', 'total-count')
          .attr('transform', 'translate(0,' + (-(valueFontSize / valueOffsetRatio) - 10) + ')')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('fill', "#cccccc")
          .text(this.totalCount(chartData))
          .on("focusout", function (d) {
            donutTotal.attr("stroke", "none");
          })
          .on("keydown", function (d) {
            if (d3.event.keyCode === 13) {
              contentView.options.parent.triggerMethod('click:segment', d3.event);
            }
          })
          .on("keyup", function (d) {
            //tab key
            if (d3.event.keyCode === 9) {
              donutTotal.attr("stroke", outlineStrokeColor)
                  .attr("stroke-opacity", outlineStrokeOpacity)
                  .transition()
                  .duration(0)
                  .attr("stroke-width", outlineStrokeWidth);
            }
          });

      donutTotal.append('text')
          .attr('class', 'total-text')
          .attr('transform', 'translate(0,' + (valueFontSize / valueOffsetRatio + 30) + ')')
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .attr('fill', "#cccccc")
          .text('Total');

      var legendHeight = calculateLegendHeight() + 12;
      var pieLegendContainer = visElement.select('.pie-legend-container');
      pieLegendContainer.style('font-size', (legendHeight / 2) + 'px');
      var legends = pieLegendContainer.selectAll('.pie-legend')
          .data(pie(chartData))
          .enter().append('g')
          .attr('class', 'pie-legend')
          .on('mouseover', function (d) {
            visElement.select('.pie-chart').selectAll('.arc')
                .filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "red")
                .transition()
                .duration(1000)
                .attr("stroke-width", 2);
          })
          .on('mouseout', function (d) {
            visElement.select('.pie-chart').selectAll('.arc')
                .filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "none");
          })
          .on("click", function (d) {
            //setting legend data in the event data attribute
            d3.event.data = {status: d.data.status};
            contentView.options.parent.triggerMethod('click:segment', d3.event);
          });
      // Add the legend to the pie chart
      legends.append('text')
          .attr('class', 'pie-legend-text wf-legend-text')
          .attr('tabindex', function (d, i) {
            return d.data.count ? 0 : -1;
          })
          .attr('focusable', function (d, i) {
            return d.data.count ? true : false;
          })
          .on("keydown", function (d) {
            //Enter key
            if (d3.event.keyCode === 13) {
              d3.event.data = {status: d.data.status};
              contentView.options.parent.triggerMethod('click:segment', d3.event);
            }
          })
          .attr('dy', '1.2em') // individual offset to center text vertically
          .attr('transform', function (d, i) {
            var offset = (legendHeight * totalSegments(chartData) / 2) - 10,
                x      = getTextWidth(d, i) + legendHeight + 24,
                y      = (calculateYindex(i) * legendHeight) - offset;
            return 'translate(' + x + ',' + y + ')';
          })
          .attr('fill', "#cccccc")
          .text(function (d, i) {
            return d.data.count ? contentView.options.statusArray[d.data.status] : "";
          })
          .on("keyup", function (d) {
            //tab key
            if (d3.event.keyCode === 9) {
              legends.filter(function (d2, i2) {
                    return (d2.data.status === d.data.status);
                  })
                  .attr("stroke", outlineStrokeColor)
                  .attr("stroke-opacity", outlineStrokeOpacity)
                  .transition()
                  .duration(0)
                  .attr("stroke-width", outlineStrokeWidth);
            }
          })
          .on("focusout", function (d) {
            legends.filter(function (d2, i2) {
                  return (d2.data.status === d.data.status);
                })
                .attr("stroke", "none");
          });

      legends.append('text')
          .attr('class', 'pie-legend-text wf-legend-count')
          .attr('dy', '1.2em')
          .attr('transform', function (d, i) {
            var offset = legendHeight * totalSegments(chartData) / 2,
                x      = 36,
                y      = (calculateYindex(i) * legendHeight) - offset;
            return 'translate(' + x + ',' + y + ')';
          })
          .text(function (d, i) {
            return d.data.count ? d.data.count : "";
          })
          .attr('fill', function (d, i) {
            return color(i);
          });
      legends.style('cursor', 'pointer');
      function calculateYindex(i) {
        if (i === 0) {
          return 0;
        } else {
          var totalCount = 0;
          _.each(chartData, function (set) {
            if (i > 0 && set.count !== 0) {
              totalCount++;
            }
            i--;
          });
          return totalCount;
        }

      }

      function calculateLegendHeight() {
        // returns a dynamic height for each legend swatch, according to how many swatches are needed
        var n             = chartData.length || 1,
            minSwatchSize = 14, // smallest legible size (font is half this size)
            maxSwatchSize = 24,
            swatchSize;

        swatchSize = ((height * 2) / n) / 2;
        swatchSize = (swatchSize < minSwatchSize) ? minSwatchSize : swatchSize;
        swatchSize = (swatchSize > maxSwatchSize) ? maxSwatchSize : swatchSize;

        return swatchSize;
      }

      function totalSegments(data) {
        var totalSegments = 0;
        _.each(data, function (set) {
          if (set.count !== 0) {
            totalSegments++;
          }
        });
        return totalSegments;
      }

      function getTextWidth(d, i) {
        var textWidth     = 0,
            measuringSpan = document.createElement("span");
        measuringSpan.innerText = d.data.count;
        measuringSpan.style.visibility = 'hidden';
        $('body')[0].appendChild(measuringSpan);
        textWidth = $(measuringSpan).width();
        $('body')[0].removeChild(measuringSpan);
        return textWidth;
      }
    },

    marginTop: function () {
      return this.defaults.marginTop;
    },

    marginBottom: function () {
      return this.defaults.marginBottom;
    },

    marginLeft: function () {
      return this.defaults.marginLeft;
    },

    marginRight: function () {
      return this.defaults.marginRight;
    },

    marginTopp: function () {
      return this.defaults.marginTopp;
    },

    width: function () {

      return this.parentEle.width() - this.marginLeft() - this.marginRight();
    },

    height: function () {
      return this.parentEle.height() - this.marginTop() - this.marginBottom();

    },

    totalCount: function (data) {
      var totalCount = 0;
      _.each(data, function (set) {
        totalCount = totalCount + set.count;
      });
      return totalCount;
    }

  });

  return WFStatusView;

});

csui.define('workflow/controls/behaviors/wfstatus.infinite.scrolling.behavior',[ "csui/lib/jquery", 'csui/controls/tile/behaviors/infinite.scrolling.behavior'
], function ( $,InfiniteScrollingBehavior) {
  

  var WfInfiniteScrollingBehavior = InfiniteScrollingBehavior.extend({
    _checkScrollPosition: function () {

      var container = $(this.options.contentParent);
      var containerHeight = container.height();
      var containerScrollHeight = container[0].scrollHeight;
      var containerScrollTop = container.scrollTop();
      if ((containerScrollTop + 30) >= (containerScrollHeight - containerHeight)) {
       $('#footerview').trigger("click");
      }
    }

  });

  return WfInfiniteScrollingBehavior;

});
csui.define('workflow/controls/infinite.table/infinite.table.view',["require",
  "csui/lib/jquery",
  "csui/lib/underscore",
  'csui/lib/moment',
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/controls/table/table.view",
  'csui/utils/commands',
  'csui/utils/defaultactionitems',
  "workflow/controls/behaviors/wfstatus.infinite.scrolling.behavior",
  "csui/controls/tile/behaviors/perfect.scrolling.behavior",
  'csui/lib/perfect-scrollbar'
], function (require, $, _, moment, Backbone, Marionette,
    TableView,
    commands,
    defaultActionItems,
    InfiniteScrollingBehavior,
    PerfectScrollingBehavior) {
  

  var InfiniteScrollingTableView = TableView.extend({
        constructor: function InfiniteScrollingTableView(options) {
          InfiniteScrollingTableView.__super__.constructor.apply(this, arguments);
        },

        behaviors: {
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: 'tbody',
            suppressScrollX: true
          },
          InfiniteScrolling: {
            behaviorClass: InfiniteScrollingBehavior,
            // selector for scrollable area
            contentParent: 'tbody',
            content: 'tbody>tr:visible',
            fetchMoreItemsThreshold: 10
          }
        }

      }
  );

  return InfiniteScrollingTableView;
});


csui.define('workflow/widgets/wfstatus/wfstatus.columns',["csui/lib/backbone"], function (Backbone) {
  
  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  // Fixed (system) columns have sequence number < 100, dynamic columns
  // have sequence number > 1000

  var MyAssignmentsTableColumns = new TableColumnCollection([
    {
      key: 'status_key',
      sequence: 10
    },
    {
      key: 'due_date',
      sequence: 20
    },
    {
      key: 'wf_name',
      sequence: 30
    },
    {
      key: 'step_name',
      sequence: 40
    },
    {
      key: 'assignee',
      sequence: 50
    },
    {
      key: 'date_initiated',
      sequence: 60
    }
  ]);

  return MyAssignmentsTableColumns;

});

csui.define('workflow/models/wfstatus/wfstatus.column.factory',['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',   'workflow/models/wfstatus/wfstatus.collection.factory'
], function (module, _, Backbone, CollectionFactory, WFStatusCollectionFactory) {

  

  var WFStatusColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'wfstatus_columns',

    constructor: function WFStatusColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(WFStatusCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return WFStatusColumnsCollectionFactory;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/wfstatus/impl/wfstatuslist',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"wfstatus-table\">\r\n  <div id=\"tableview\"></div>\r\n  <div id=\"footerview\"></div>\r\n</div>\r\n";
}});
Handlebars.registerPartial('workflow_widgets_wfstatus_impl_wfstatuslist', t);
return t;
});
/* END_TEMPLATE */
;

csui.define('css!workflow/widgets/wfstatus/impl/wfstatus',[],function(){});
csui.define('workflow/widgets/wfstatus/impl/wfstatus.list.view',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/lib/marionette", "csui/utils/log",
  'csui/controls/table/rows/description/description.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/nodestable/nodestable.view',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/tableactionbar/tableactionbar.view',
  'workflow/controls/infinite.table/infinite.table.view',
  'workflow/widgets/wfstatus/wfstatus.columns',
  'workflow/models/wfstatus/wfstatus.column.factory',
  'workflow/models/wfstatus/wfstatus.collection.factory',
  'workflow/models/wfstatus/wfstatus.model.factory',
  'workflow/controls/usercards/usercards.popover.view',
  'workflow/utils/workitem.util',
  'hbs!workflow/widgets/wfstatus/impl/wfstatuslist',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang',
  'css!workflow/widgets/wfstatus/impl/wfstatus'
], function (module, $, _, Backbone, Marionette, log,
    DescriptionRowView, LayoutViewEventsPropagationMixin, NodesTable,
    DelayedToolbarView, ToolbarView, TableActionBarView, InfiniteScrollingTableView,
    WFStatusTableColumns, WFStatusColumnCollectionFactory, WFStatusCollectionFactory,
    WFStatusModelFactory, UsercardsPopoverView, WorkItemUtil, template, lang) {
  

  var WFStatusTableView = NodesTable.extend({

    template: template,

    className: '',

    regions: {
      tableRegion: '#tableview',
      footerRegion: '#footerview'
    },
    events: {
      'click #footerview': 'fetchMoreItems',
      'click #tableview': 'performStatusItemAction'
    },

    constructor: function WFStatusTableView(options) {
      options.separateDescription = false;
      NodesTable.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    initialize: function () {
      this.collection = this.options.collection ||
                        this.context.getCollection(WFStatusCollectionFactory);
      this.columns = this.collection.columns ||
                     this.context.getCollection(WFStatusColumnCollectionFactory);

      _.defaults(this.options, {
        orderBy: 'status_key desc',
        tableColumns: WFStatusTableColumns
      });

      this.setTableView();

      if (this.options.collection) {
        this.collection.fetched = false;
      }
      this.collection.page = 1;
    },

    fetchMoreItems: function () {
      this.collection.fetched = false;
      var model      = this.collection.wfstatus,
          statusList = this.collection.options.status,
          length     = 0;
      if (statusList.length > 0) {
        _.each(statusList, function (status) {
          status = (status === "workflowlate") ? "late" : status;
          for (var index = 0; index < model.changed.data.length; index++) {
            if (status === model.changed.data[index].status) {
              length += model.changed.data[index].count;
              break;
            }
          }
        });
      }
      if ((statusList.length === 0 && model.changed.count > this.collection.allModels.length) ||
          (length > this.collection.allModels.length)) {
        this.collection.page = this.collection.page + 1;
        this.onRender(this.collection.page);
      }

    },

    setTableView: function () {
      this.tableView = new InfiniteScrollingTableView({
        context: this.options.context,
        connector: this.connector,
        collection: this.collection,
        columns: this.columns,
        tableColumns: this.options.tableColumns,
        pageSize: this.options.pageSize,
        originatingView: this,
        columnsWithSearch: ["wf_name"],
        orderBy: this.options.orderBy,
        filterBy: this.options.filterBy,
        nameEdit: false,
        selectRows: 'None',
        selectColumn: false,
        favoritesTableOptions: this.favoritesTableOptions,
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        blockingParentView: this,
        tableTexts: {
          zeroRecords: lang.emptyListText
        },
        alternativeHeader: {
          viewClass: this.collection.delayedActions ? DelayedToolbarView : ToolbarView,
          options: {
            toolbarItems: this.options.toolbarItems,
            toolbarItemsMask: this.options.toolbarItemsMasks.toolbars.tableHeaderToolbar,
            toolbarCommandController: this.commandController
          }
        },
        inlineBar: {
          viewClass: TableActionBarView,
          options: _.extend({
            collection: this.options.toolbarItems.inlineActionbar,
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineActionbar,
            delayedActions: this.collection.delayedActions,
            container: this.collection.node,
            containerCollection: this.collection,
            commandExecutionOptions: {nameAttribute: 'wf_name'}
          }, this.options.toolbarItems.inlineActionbar.options, {
            inlineBarStyle: this.options.inlineActionBarStyle,
            forceInlineBarOnClick: this.options.forceInlineActionBarOnClick,
            showInlineBarOnHover: this.options.showInlineActionBarOnHover
          })
        }
      });
      this.listenTo(this, 'render', function () {
        this.tableRegion.show(this.tableView);
      });
      this.listenTo(this.tableView, "clicked:cell", this.performStatusItemAction);
    },

    onDestroy: function () {
      // If the collection was passed from outside and might be of a limited scope
      if (this.options.collection) {
        // Restore the scope of the response
        this.collection.setResourceScope(this._originalScope);
      }
      NodesTable.prototype.onDestroy.call(this);
    },

    onRender: function (page) {
      // If the collection was passed from outside and might be of a limited scope
      if (this.options.collection && !this.collection.fetched) {
        // Cancel limiting the scope of the response
        this._originalScope = this.collection.getResourceScope();
        this.collection.setResourceScope(WFStatusCollectionFactory.getDefaultResourceScope());

        var options = {},
            data    = '';
        if (this.collection.options && this.collection.options.status) {
          var delim      = '',
              statusList = this.collection.options.status;
          _.each(statusList, function (status) {
            if (status !== '') {
              data += delim + 'wstatus=' + status;
              delim = '&';
            }
          });
        }
        options.reload = true;
        options.data = data;
        //Modifying the width of the list view based on the filter visibility
        if ((this.collection.options.status.length > 0 ) ||
            (this.collection.options.isFilterVisible === true)) {
          this.$el.find('.wfstatus-table').addClass('wfstatus-filter-width');
        }
        if (page > 1) {
          options.data = options.data ? (options.data + "&page=" + page) : "page=" + page;
          options.remove = false;
          options.reset = false;
          options.reload = false;
          options.retention = this.collection.options.retention;
          options.selectionType = this.collection.options.selectionType;
          options.wfstatusfilter = this.collection.options.wfstatusfilter;
          options.status = this.collection.options.status;
          var filterWorkflowtype = this.collection.options.filterWorkflowtype;
          if (!filterWorkflowtype) {
            filterWorkflowtype = WorkItemUtil.getWorkflowtype(this.collection.options.filterWorkflows);
          }
          options.filterWorkflowtype = filterWorkflowtype;
          this.collection.fetchdata(_.extend({remove: false}, options));
        } else {
          this.collection.fetch(options);
        }
      }

      this.tableRegion.show(this.tableView);
      this.listenTo(this.collection, "reset", this.unbindPopover);
    },

    unbindPopover: function(){
      WorkItemUtil.unbindPopover();
    },

    performStatusItemAction: function (data) {

      if (data && data.target && data.target.className.indexOf("csui-perfect-scrolling") >= 0) {
        this.unbindPopover();
        return;
      }

      if (data.colIndex === 4) {

        //open user card popover if assignee column is clicked
        var AssigneeCellViewEle = data.cellView.$el,
            context             = data.cellView.options.context,
            options             = {
              model: data.model,
              context: context,
              originatingView: data.cellView,
              wfData: _.pick(data.model.attributes, 'process_id', 'subprocess_id', 'task_id',
                  'userId','comments_on')
            },
            popoverOptions      = {
              delegateTarget: AssigneeCellViewEle,
              UserCardviewOptions: options
            };
        if (data.model.get("assignee").length !== 0) {
          UsercardsPopoverView.ShowPopOver(popoverOptions);
        }

        if (!$(AssigneeCellViewEle).hasClass("csui-acc-focusable-active")) {
          $(AssigneeCellViewEle).addClass('csui-acc-focusable-active');
          $(AssigneeCellViewEle).attr("tabindex", 0);
          $(AssigneeCellViewEle).focus();
        }

      } else if (data.model && data.cellView) {
          //open wfstatus item dialog view if click event is not from assignee column
          var dialogOptions = {
            model: data.model,
            cellView: data.cellView,
            context: data.cellView.options.context
          };
          WorkItemUtil.displayWfstatusItemProgresspanel(dialogOptions);
        }
    }

  });

  _.extend(WFStatusTableView.prototype, LayoutViewEventsPropagationMixin);

  return WFStatusTableView;

});


/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/wfstatus/impl/wfstatus.extended',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"wfstatus-filter-view\">\r\n\r\n  <div class=\"wfstatus-panel-heading\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.headerFilterTitle || (depth0 != null ? depth0.headerFilterTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerFilterTitle","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.headerFilterTitle || (depth0 != null ? depth0.headerFilterTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerFilterTitle","hash":{}}) : helper)))
    + "\r\n  </div>\r\n  <div class=\"binf-wfstatus-heading\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.headerFilterLabel || (depth0 != null ? depth0.headerFilterLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerFilterLabel","hash":{}}) : helper)))
    + "\">\r\n    "
    + this.escapeExpression(((helper = (helper = helpers.headerFilterLabel || (depth0 != null ? depth0.headerFilterLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"headerFilterLabel","hash":{}}) : helper)))
    + "\r\n  </div>\r\n\r\n  <div class=\"wfstatus-header csui-selected-checkbox csui-checkbox-primary\">\r\n    <input id=\"selectAll\" type=\"checkbox\" class=\"All\" tabindex=\"-1\"\r\n      "
    + this.escapeExpression(((helper = (helper = helpers.checkedAll || (depth0 != null ? depth0.checkedAll : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"checkedAll","hash":{}}) : helper)))
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.allFilterLabel || (depth0 != null ? depth0.allFilterLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"allFilterLabel","hash":{}}) : helper)))
    + "</br></input>\r\n    <span class=\"wfstatus-allcount\">"
    + this.escapeExpression(((helper = (helper = helpers.allWFStatusCount || (depth0 != null ? depth0.allWFStatusCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"allWFStatusCount","hash":{}}) : helper)))
    + "</span>\r\n  </div>\r\n\r\n  <div class=\"wfstatus-body\">\r\n    <div class=\"csui-selected-checkbox csui-checkbox-primary\">\r\n      <input id=\"wfstatus-late\" type=\"checkbox\" class=\"wfstatus-late\" tabindex=\"-1\"\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.checkedLate || (depth0 != null ? depth0.checkedLate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"checkedLate","hash":{}}) : helper)))
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.lateFilterLabel || (depth0 != null ? depth0.lateFilterLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"lateFilterLabel","hash":{}}) : helper)))
    + "</input>\r\n      <span class=\"wfstatus-latecount\">"
    + this.escapeExpression(((helper = (helper = helpers.lateCount || (depth0 != null ? depth0.lateCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"lateCount","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n    </br>\r\n\r\n    <div class=\"csui-selected-checkbox csui-checkbox-primary\">\r\n      <input id=\"wfstatus-ontime\" type=\"checkbox\" class=\"wfstatus-ontime\" tabindex=\"-1\"\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.checkedOnTime || (depth0 != null ? depth0.checkedOnTime : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"checkedOnTime","hash":{}}) : helper)))
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.ontimeFilterLabel || (depth0 != null ? depth0.ontimeFilterLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ontimeFilterLabel","hash":{}}) : helper)))
    + "</input>\r\n      <span class=\"wfstatus-ontimecount\">"
    + this.escapeExpression(((helper = (helper = helpers.ontimeCount || (depth0 != null ? depth0.ontimeCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"ontimeCount","hash":{}}) : helper)))
    + "</span>\r\n    </div>\r\n    </br>\r\n    <div class=\"csui-selected-checkbox csui-checkbox-primary\">\r\n      <input id=\"wfstatus-completed\" type=\"checkbox\" class=\"wfstatus-completed\" tabindex=\"-1\"\r\n        "
    + this.escapeExpression(((helper = (helper = helpers.checkedCompleted || (depth0 != null ? depth0.checkedCompleted : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"checkedCompleted","hash":{}}) : helper)))
    + ">"
    + this.escapeExpression(((helper = (helper = helpers.completedFilterLabel || (depth0 != null ? depth0.completedFilterLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"completedFilterLabel","hash":{}}) : helper)))
    + "</input>\r\n      <span class=\"wfstatus-completedcount\">"
    + this.escapeExpression(((helper = (helper = helpers.completedCount || (depth0 != null ? depth0.completedCount : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"completedCount","hash":{}}) : helper)))
    + "</span>\r\n      </br>\r\n    </div>\r\n  </div>\r\n</div></div>\r\n\r\n<div class=\"wfstatus-list-view\"></div>\r\n\r\n";
}});
Handlebars.registerPartial('workflow_widgets_wfstatus_impl_wfstatus.extended', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/widgets/wfstatus/impl/wfstatus.extended.view',[
  'csui/lib/marionette',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/controls/table/table.view',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'workflow/models/wfstatus/wfstatus.collection.factory',
  'workflow/widgets/wfstatus/impl/wfstatus.list.view',
  'workflow/utils/workitem.util',
  'hbs!workflow/widgets/wfstatus/impl/wfstatus.extended',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (Marionette, _, $, TableView, LayoutViewEventsPropagationMixin,
    WFStatusCollectionFactory, WFStatusListView, WorkItemUtil,
    template, lang) {

  

  var WFStatusExtendedView = Marionette.LayoutView.extend({

    className: 'wfstatus-extended-view',

    template: template,

    events: {
      'click #selectAll': 'toggleCheckBoxAll',
      'click #wfstatus-late ,#wfstatus-ontime ,#wfstatus-completed': 'toggleCheckBoxSelection'
    },

    regions: {
      filterRegion: '.wfstatus-filter-view',
      listRegion: '.wfstatus-list-view'
    },

    templateHelpers: function () {
      var checkedAll         = '', checkedLate = '', checkedOnTime = '', checkedCompleted = '', checked = "checked",
          completeCollection = this.options.context.getCollection(WFStatusCollectionFactory),
          statusList         = completeCollection.options.status,
          wfstatusData       = completeCollection.model.get('data');
      if (statusList && statusList.length > 0) {
        _.each(statusList, function (status) {
          if (status === 'ontime') {
            checkedOnTime = checked;
          } else if (status === 'workflowlate') {
            checkedLate = checked;
          } else if (status === 'completed') {
            checkedCompleted = checked;
          }
        });
      } else {
        checkedAll = checked;
        checkedOnTime = checked;
        checkedLate = checked;
        checkedCompleted = checked;
      }

      return {
        completedFilterLabel: lang.completedFilterLabel,
        lateFilterLabel: lang.lateFilterLabel,
        ontimeFilterLabel: lang.ontimeFilterLabel,
        headerFilterTitle: lang.headerFilterTitle,
        headerFilterLabel: lang.headerFilterLabel,
        allFilterLabel: lang.allFilterLabel,
        allWFStatusCount: completeCollection.model.get('count'),
        ontimeCount: wfstatusData[0] ? wfstatusData[0].count : wfstatusData.status === 'ontime' ? 1 : 0,
        completedCount:wfstatusData[0] ?wfstatusData[1].count : wfstatusData.status === 'completed'? 1 : 0,
        lateCount: wfstatusData[0] ? wfstatusData[2].count : wfstatusData.status === 'workflowlate' ? 1 : 0,
        checkedAll: checkedAll,
        checkedLate: checkedLate,
        checkedOnTime: checkedOnTime,
        checkedCompleted: checkedCompleted

      };

    },

    constructor: function WFStatusExtendedView(options) {
      this.options = options;
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'click:actionIcon', this.onClickFilter);
      this.listenTo(this, 'destroy', this.destroyUserCardPopovers);
      this.propagateEventsToRegions();
    },

    onRender: function () {

      if (this.collection.options.isFilterVisible !== true) {
        this.collection.add({});
      }
      var that = this;
      setTimeout(function () {
        that.listRegion.show(new WFStatusListView({
          context: that.options.context,
          collection: that.collection
        }));
      }, 1);
      if (this.collection.options.status.length > 0) {
        this.$el.find('.wfstatus-filter-view').addClass('wfstatus-show-filter-view');
      }
    },

    onClickFilter: function () {
      WorkItemUtil.unbindPopover();
      if (this.$el.find('.wfstatus-show-filter-view').length === 0) {
        this.$el.find('.wfstatus-table').addClass('wfstatus-filter-width');
        this.$el.find('.wfstatus-filter-view').addClass('wfstatus-show-filter-view');
      } else {
        this.$el.find('.wfstatus-table').removeClass('wfstatus-filter-width');
        this.$el.find('.wfstatus-filter-view').removeClass('wfstatus-show-filter-view');
      }
      $(window).trigger("resize.tableview", TableView.onTableWinResize);
    },

    toggleCheckBoxAll: function (event) {
      WorkItemUtil.unbindPopover();
      if (this.$el.find("[id='selectAll']:checked").length === 1) {
        $('.csui-selected-checkbox input:not(:checked)').each(function () {
          $(this).prop("checked", true).trigger('change');
        });
      } else {
        $('.csui-selected-checkbox input:checked').each(function () {
          $(this).prop("checked", false).trigger('change');
        });
      }
      this.collection.options.isFilterVisible = true;
      this.getStatusList(event);
    },

    toggleCheckBoxSelection: function (event) {
      WorkItemUtil.unbindPopover();
      var statusList = [];
      if ($('.wfstatus-body .csui-selected-checkbox input:not(:checked)').length > 0) {
        $('.wfstatus-body .csui-selected-checkbox input:checked').each(function () {
          var id = this.id;
          if (id === "wfstatus-late") {
            statusList.push("workflowlate");
          } else if (id === "wfstatus-ontime") {
            statusList.push("ontime");
          } else if (id === "wfstatus-completed") {
            statusList.push("completed");
          }
        });
        event.data = statusList;
        $('#selectAll').prop("checked", false).trigger('change');
      } else if ($('.wfstatus-body .csui-selected-checkbox input:checked').length === 3) {
        $('#selectAll').prop("checked", true).trigger('change');
      }
      //used to set filter width in the expand status list view
      this.collection.options.isFilterVisible = true;
      this.getStatusList(event);
    },

    getStatusList: function (event) {

      this.collection.options.status = event.data ? event.data : [];
      event.stopPropagation();
      this.onRender();
    },
    destroyUserCardPopovers: function () {
      WorkItemUtil.unbindPopover();
    }
  });

  _.extend(WFStatusExtendedView.prototype, LayoutViewEventsPropagationMixin);

  return WFStatusExtendedView;
});

/* START_TEMPLATE */
csui.define('hbs!workflow/widgets/wfstatus/impl/wfstatus',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"wfstatus-empty-list\"> "
    + this.escapeExpression(((helper = (helper = helpers.emptyListText || (depth0 != null ? depth0.emptyListText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"emptyListText","hash":{}}) : helper)))
    + "</div>\r\n";
},"3":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "    <div class=\"wfstatus-single\">\r\n      <div class=\"wfstatus-single-details\">\r\n\r\n        <!-- 1 total -->\r\n        <div class=\"wfstatus-status-info\">\r\n            <span class=\"wfstatus-count-"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.data : stack1)) != null ? stack1.status : stack1), depth0))
    + "\"\r\n                  title=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.count : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.count : stack1), depth0))
    + "</span>\r\n          <span class=\" wfstatus-msg\">"
    + this.escapeExpression(((helper = (helper = helpers.totalMsg || (depth0 != null ? depth0.totalMsg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"totalMsg","hash":{}}) : helper)))
    + "</span>\r\n          <span class=\"wfstatus-"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.data : stack1)) != null ? stack1.status : stack1), depth0))
    + "-icon\"></span>\r\n          <span class=\"wfstatus-info\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.statusInfo || (depth0 != null ? depth0.statusInfo : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"statusInfo","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.statusInfo || (depth0 != null ? depth0.statusInfo : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"statusInfo","hash":{}}) : helper)))
    + "</span>\r\n\r\n        </div>\r\n\r\n        <!-- status and due date -->\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.dueDate : depth0),{"name":"if","hash":{},"fn":this.program(4, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <!-- Workflow name -->\r\n        <div class=\"wfstatus-wfname-details\">\r\n          <div class=\"wfstatus-wfname-label\">"
    + this.escapeExpression(((helper = (helper = helpers.wfNameLabel || (depth0 != null ? depth0.wfNameLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"wfNameLabel","hash":{}}) : helper)))
    + "</div>\r\n          <div class=\"wfstatus-workflow-name\"\r\n               title=\""
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.data : stack1)) != null ? stack1.wfname : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.data : stack1)) != null ? stack1.wfname : stack1), depth0))
    + "</div>\r\n        </div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.data : stack1)) != null ? stack1.stepname : stack1),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        <div class=\"wfstatus-assignee-startdate\">\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.assignee : depth0),{"name":"if","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.startDate : depth0),{"name":"if","hash":{},"fn":this.program(10, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "          <div class=\"wfstatus-detail\">\r\n            <span class=\"wfstatus-duedate-label\">"
    + this.escapeExpression(((helper = (helper = helpers.dueDateLabel || (depth0 != null ? depth0.dueDateLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDateLabel","hash":{}}) : helper)))
    + "</span>\r\n\r\n            <div class=\"wfstatus-duedate\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.dueDate || (depth0 != null ? depth0.dueDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDate","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.dueDate || (depth0 != null ? depth0.dueDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dueDate","hash":{}}) : helper)))
    + "</div>\r\n          </div>\r\n";
},"6":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "          <!-- Step name -->\r\n          <div class=\"wfstatus-currentstep-details\">\r\n            <span class=\"wfstatus-currentstep-label\">"
    + this.escapeExpression(((helper = (helper = helpers.currentStepNameLabel || (depth0 != null ? depth0.currentStepNameLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"currentStepNameLabel","hash":{}}) : helper)))
    + "</span>\r\n\r\n            <div class=\"wfstatus-step-name\"\r\n                 title=\""
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.data : stack1)) != null ? stack1.stepname : stack1), depth0))
    + "\">"
    + this.escapeExpression(this.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.model : depth0)) != null ? stack1.data : stack1)) != null ? stack1.stepname : stack1), depth0))
    + "</div>\r\n          </div>\r\n";
},"8":function(depth0,helpers,partials,data) {
    var helper;

  return "            <div class=\"wfstatus-assignee-details\">\r\n              <div class=\"wfstatus-assignee-label\">"
    + this.escapeExpression(((helper = (helper = helpers.assignedToLabel || (depth0 != null ? depth0.assignedToLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"assignedToLabel","hash":{}}) : helper)))
    + "</div>\r\n              <div class=\"wfstatus-assignee\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.assignee || (depth0 != null ? depth0.assignee : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"assignee","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.assignee || (depth0 != null ? depth0.assignee : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"assignee","hash":{}}) : helper)))
    + "</div>\r\n            </div>\r\n";
},"10":function(depth0,helpers,partials,data) {
    var helper;

  return "            <div class=\"wfstatus-startdate-details\">\r\n              <div class=\"wfstatus-startdate-label\">"
    + this.escapeExpression(((helper = (helper = helpers.startDateLabel || (depth0 != null ? depth0.startDateLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startDateLabel","hash":{}}) : helper)))
    + "</div>\r\n              <div class=\"wfstatus-start-date\" title=\""
    + this.escapeExpression(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startDate","hash":{}}) : helper)))
    + "\">"
    + this.escapeExpression(((helper = (helper = helpers.startDate || (depth0 != null ? depth0.startDate : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"startDate","hash":{}}) : helper)))
    + "</div>\r\n            </div>\r\n";
},"12":function(depth0,helpers,partials,data) {
    return "    <div class=\"wfstatus-donut-chart\"></div>\r\n";
},"14":function(depth0,helpers,partials,data) {
    var helper;

  return "    <div class=\"tile-footer\">\r\n      <div id=\"cs-more\" class=\"tile-expand\" title="
    + this.escapeExpression(((helper = (helper = helpers.expandLabel || (depth0 != null ? depth0.expandLabel : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"expandLabel","hash":{}}) : helper)))
    + " role=\"button\" tabindex=\"0\">\r\n        <div class=\"icon circular icon-tileExpand\"></div>\r\n      </div>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"tile-header\" tabindex=\"0\">\r\n  <div class=\"tile-type-icon\">\r\n    <span class=\"icon title-icon mime_workflow_status\" aria-hidden=\"true\"></span>\r\n  </div>\r\n  <div class=\"tile-title\">\r\n    <h2 class=\"csui-heading\">"
    + this.escapeExpression(((helper = (helper = helpers.dialogTitle || (depth0 != null ? depth0.dialogTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"dialogTitle","hash":{}}) : helper)))
    + "</h2>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"tile-content\">\r\n<div class=\"wfstatus-scrolling\">\r\n  <div class=\"cs-emptylist-placeholder\"></div>\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.emptyTextRequired : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isSingleStatus : depth0),{"name":"if","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.donutChart : depth0),{"name":"if","hash":{},"fn":this.program(12, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "\r\n\r\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.showExpand : depth0),{"name":"if","hash":{},"fn":this.program(14, data, 0),"inverse":this.noop})) != null ? stack1 : "")
    + "</div></div>";
}});
Handlebars.registerPartial('workflow_widgets_wfstatus_impl_wfstatus', t);
return t;
});
/* END_TEMPLATE */
;
// Shows the Shortcut widget of a specific node
csui.define('workflow/widgets/wfstatus/wfstatus.view',[
  'csui/lib/marionette', 
  'csui/lib/backbone', 
  'csui/lib/underscore', 
  'csui/lib/jquery', 
  'csui/utils/contexts/factories/connector', 
  'csui/behaviors/expanding/expanding.behavior', 
  'csui/controls/tile/behaviors/perfect.scrolling.behavior', 
  'workflow/models/wfstatus/wfstatus.collection.factory', 
  'workflow/models/wfstatus/wfstatus.model.factory', 
  'workflow/controls/visualdata/visual.data.donut.view', 
  'workflow/widgets/wfstatus/impl/wfstatus.extended.view', 
  'workflow/utils/workitem.util', 
  'hbs!workflow/widgets/wfstatus/impl/wfstatus', 
  'i18n!workflow/widgets/wfstatus/impl/nls/lang', 
  'css!workflow/widgets/wfstatus/impl/wfstatus'
], function (Marionette, Backbone, _, $, ConnectorFactory, ExpandingBehavior, 
    PerfectScrollingBehavior, WFStatusCollectionFactory, WFStatusModelFactory, 
    VisualDataDonutContentView, WFStatusExtendedView, WorkItemUtil, template, lang) {

   

  var WFStatusView = Marionette.LayoutView.extend( {

    className:'cs-list tile content-tile csui-acc-tab-region wf-wfstatus', 
    widgetTitle : lang.dialogTitle,
    template:template, 

    regions: {
      donut:'.wfstatus-donut-chart'
    }, 

    templateHelpers:function () {
      var count = this.model.get("count"); 
      var singleStatus = count === 1?true:false; 
      if (singleStatus) {
        var data = this.model.get("data"), 
            status = data.status, 
            startDate = (data.dateinitiated)?WorkItemUtil.dateConversion(data.dateinitiated):
                           '', 
            dueDate = (data.duedate)?WorkItemUtil.dateConversion(data.duedate):'', 
            statusInfo, 
            assignees = data.assignee, 
            assignee = '', 
            assigneeData =  {}; 

        assigneeData.assignees = assignees; 
        assigneeData.assignedto = data.assignedto; 
        assignee = WorkItemUtil.getAssignee(assigneeData); 

        if (status === WorkItemUtil.constants.WFSTATUS_ONTIME) {
          statusInfo = lang.onTime; 
        }else if (status === WorkItemUtil.constants.WFSTATUS_COMPLETED) {
          statusInfo = lang.completed; 
        }else if (status === WorkItemUtil.constants.WFSTATUS_LATE) {
          statusInfo = lang.late; 
        }
      }
      return {
        dialogTitle:this.widgetTitle, 
        totalMsg:lang.totalMsg, 
        emptyListText:lang.emptyListText, 
        expandLabel:lang.expandLabel, 
        dueDateLabel:lang.dueDateLabel, 
        currentStepNameLabel:lang.currentStepNameLabel, 
        assignedToLabel:lang.assignedToLabel, 
        startDateLabel:lang.startDateLabel, 
        emptyTextRequired:count === 0?true:false, 
        isSingleStatus:singleStatus, 
        statusInfo:statusInfo, 
        donutChart:count > 1?true:false, 
        showExpand:count > 0?true:false, 
        model:this.model.toJSON(), 
        startDate:startDate, 
        dueDate:dueDate, 
        wfNameLabel:lang.wfNameLabel, 
        assignee:assignee
      }; 
    }, 
    behaviors: {

      ScrollingInstructions: {
        behaviorClass:PerfectScrollingBehavior, 
        contentParent:'.wfstatus-scrolling', 
        suppressScrollX:true, 
        scrollYMarginOffset:16
      }, 
      ExpandableList: {
        behaviorClass:ExpandingBehavior, 
        expandedView:WFStatusExtendedView, 
        orderBy:'status_key desc', 
        actionTitleBarIcon:"icon-toolbarFilter", 
        dialogTitle: function () { return this.widgetTitle; },
        dialogTitleIconRight:"icon-tileCollapse", 
        dialogClassName:'wfstatus'
      }

    }, 

    constructor:function WFStatusView(options) {

      
      ///To call WFStatus factory uniquely for each widget we have to
      /// assign unique property of options to unique id as like below
      
      options.unique = _.uniqueId(); 
      options.data.unique = _.uniqueId(); 
      
      options.data.selectionType = 100; //Task level , 
      //It would be useful in case of widget configuration  if we provide workflow level or task level data retreival.
      //Currently default considering it as task level
      //In future it would be coming from perspective manager widget configuration

      options.model = options.context.getModel(WFStatusModelFactory, options.data);

      // Updating widgetTitle only when widgetTitle value is not empty or blank string.
      if (options.model.get("widgetTitle") && _.str.trim(options.model.get("widgetTitle")).length > 0) {
        this.widgetTitle = options.model.get("widgetTitle");
      }

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.listenTo(this.model, 'change', this.onModelChange); 
      this.listenTo(this, 'click:segment', this.getExpandStatusList); 
      options = options.data?_.extend(options, options.data):options; 
      delete options["data"]; 
      options["detached"] = true; 

      options.unique = _.uniqueId(); 

      var completeCollection = this.options.context.getCollection(WFStatusCollectionFactory, options); 
      this.completeCollection = completeCollection; 
      options["detached"] = true; 
      options["internal"] = false; 

     
    }, 

    events: {
      'click #cs-more,.tile-expand,.pie-total-container,.tile-header':'getExpandStatusList'
    }, 

    //gets the list based on event fired from the segments or total
    getExpandStatusList:function (event) {
      if (this.model.get('count') > 0) {
        var statusList = []; 
        if (event.data) {
          var status = event.data.status === "late"?"workflowlate":event.data.status; 
          statusList.push(status); 
        }

        //The model is being used in extended view to render filter section
        this.completeCollection.model = this.model; 
        this.completeCollection.options.retention = this.model.get("retention");
        this.completeCollection.options.selectionType = this.model.get("selectionType");
        this.completeCollection.options.wfstatusfilter = this.model.get("wfstatusfilter");
        this.completeCollection.options.status = statusList; 
        this.completeCollection.options.chatSettings = this.model.get('chatSettings');
        var filterWorkflowtype = this.model.get("filterWorkflowtype");
        if (!filterWorkflowtype) {
          filterWorkflowtype = WorkItemUtil.getWorkflowtype(this.model.get("filterWorkflows"));
        }
        this.completeCollection.options.filterWorkflowtype = filterWorkflowtype;
        event.preventDefault(); 
        event.stopPropagation(); 
        this.triggerMethod('expand'); 
      }
    }, 

    isSearchOpen:function () {
      return false; 
    }, 

    onModelChange:function () {
      this.render(); 
    }, 

    onKeyDown:function (event) {
      var keyCode = event.keyCode, 
          target = $(event.target), 
          retVal = true; 
      if (keyCode === 13 && (target.hasClass('tile-header') || target.hasClass('tile-expand'))) {
        event.preventDefault(); 
        event.stopPropagation(); 
        this.getExpandStatusList(event); 
        retVal = false; 
      }
      return retVal; 
    }, 
    onRender:function () {
      this.$el.on('keydown', _.bind(this.onKeyDown, this)); 
      //setInterval is a temporary fix. Currently we don't have any event to check
      //Weather the perspective is loading is completed.
      //Need to discuss with CSUI to fix the issue..
      if (this._isRendered && this._isShown &&
          this.model.get('count') > 0) {
        this.collection = new Backbone.Collection(this.model.get('data'));

        if (this.model.get('count') > 1) {
          var that     = this,
              interval = setInterval(function () {
                if ($('.wf-wfstatus').length > 0) {
                  var options = {};
                  options.dataset = that.model.get('data');
                  var statusArray = {};
                  statusArray.ontime = lang.onTime;
                  statusArray.late = lang.late;
                  statusArray.completed = lang.completed;
                  options.statusArray = statusArray;
                  options.parent = that;
                  var donutView = new VisualDataDonutContentView(options);
                  that.donut.show(donutView);
                  clearInterval(interval);
                }
              }, 500);
        }
      }
    },
    onDestroy: function () {
      $(".wfstatus-progress-view-dialog-back").click();
    }
  });

  return WFStatusView;

});

csui.define('workflow/widgets/wfmonitor/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('workflow/widgets/wfmonitor/impl/nls/root/lang',{
   dialogTitle: 'Workflow Monitoring'
});


// Shows the Shortcut widget of a specific node
csui.define('workflow/widgets/wfmonitor/wfmonitor.view',[
  
  'workflow/widgets/wfstatus/wfstatus.view', 
   'i18n!workflow/widgets/wfmonitor/impl/nls/root/lang'
  
], function (WFStatusView, wfmonitorlang) {

   

  var WFMonitorView = WFStatusView.extend( {

    widgetTitle : wfmonitorlang.dialogTitle,

    constructor:function WFMonitorView(options) {


      WFStatusView.prototype.constructor.call(this, options); 
      
    }

  });

  return WFMonitorView;

});

csui.define('workflow/controls/table/cells/status.cell',['csui/lib/jquery', 'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry',
  'workflow/utils/workitem.util',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function ($, CellView, cellViewRegistry, WorkItemUtil, lang) {
  

  var StatusCellView = CellView.extend({

    renderValue: function () {

      var result = WorkItemUtil.formatStatus({
        dueDate: this.model.get('due_date'),
        status: this.model.get('status_key')
      });

      this.$el.html('<div class="wfstatus-status"><span' +
                    ' class="wfstatus-status-icon-col ' + result.styleclass +
                    '"></span><span class="wfstatus-status-col-value">' + result.status +
                    '</span></div>');
    }

  });

  cellViewRegistry.registerByColumnKey('status_key', StatusCellView);

  return StatusCellView;
});

csui.define('workflow/controls/table/cells/date.cell',['csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry',
  'workflow/utils/workitem.util'
], function (CellView, cellViewRegistry, WorkItemUtil) {
  

  var DateCellView = CellView.extend({

    renderValue: function () {

      var value = this.getValueText(),
          dateValue = (value) ? WorkItemUtil.dateConversion(value) : '';
      this.$el.text(dateValue);

    }
  });

  cellViewRegistry.registerByColumnKey('due_date', DateCellView);
  cellViewRegistry.registerByColumnKey('date_initiated', DateCellView);


  return DateCellView;
});


/* START_TEMPLATE */
csui.define('hbs!workflow/controls/table/cells/impl/assignee',['module','hbs','csui/lib/handlebars'], function( module, hbs, Handlebars ){ 
var t = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<span class=\"wfstatus-assigneeName\">"
    + this.escapeExpression(((helper = (helper = helpers.formattedValue || (depth0 != null ? depth0.formattedValue : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"formattedValue","hash":{}}) : helper)))
    + "</span>\r\n";
}});
Handlebars.registerPartial('workflow_controls_table_cells_impl_assignee', t);
return t;
});
/* END_TEMPLATE */
;
csui.define('workflow/controls/table/cells/assignee.cell',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/table/cells/cell.registry',
  'csui/controls/table/cells/templated/templated.view',
  'workflow/controls/usercards/usercards.list.view',
  'workflow/models/wfstatus/usercard.model',
  'workflow/utils/workitem.util',
  'hbs!workflow/controls/table/cells/impl/assignee'
], function ($, _, Backbone, Marionette, cellViewRegistry, TemplatedCellView, UsercardsLayoutView,
    UserCardModel, WorkItemUtil, Template) {
  

  var AssigneeCellView = TemplatedCellView.extend({

    template: Template,

    renderValue: function () {
      var data = this.getValueData(),
          // Making the entire data object undefined renders nothing; if the object
          // contains undefined value the template should be prepared for it
          html = data ? this.template(data) : '';
      this.$el.html(html);
    },

    getValueData: function () {
      var model          = this.model,
          column         = this.options.column,
          columnName     = column.name,
          formattedValue = model.get(columnName);
      // Make sure that the formattedValue is always a string
      if (formattedValue == null) {
        formattedValue = '';
      }
      formattedValue = formattedValue.toString();
      return {
        formattedValue: formattedValue
      };
    }
  });
  cellViewRegistry.registerByColumnKey('assignee', AssigneeCellView);

  return AssigneeCellView;
});
csui.define('workflow/perspective/context/plugins/workflow.perspective.context.plugin',['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/application.scope.factory',
  'workflow/models/workitem/workitem.model.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin'
], function (_, Backbone, ApplicationScopeModelFactory,
    WorkItemModelFactory, PerspectiveContextPlugin) {
  

  var WorkflowPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function WorkflowPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.workItem = this.context
          .getModel(WorkItemModelFactory, {
            permanent: true
          })
          .on('change:process_id', this._fetchWorkflowPerspective, this)
          .on('change:doc_id', this._fetchWorkflowPerspective, this);
    },

    /**
     * Is called when a model is changed.
     * The method checks for the current context and if it is workflows it loads
     * a new perspective definition.
     *
     * @private
     */
    _fetchWorkflowPerspective: function () {
      // Skip scopes handled by other plugin
      var processId = this.workItem.get('process_id'),
          docId     = this.workItem.get('doc_id');
      if (!!processId && !!docId) {
        return;
      }
      if (!(processId || docId ) && this.applicationScope.id !== 'workflow') {
        return;
      }
      // Two perspective driving models used above can generate two change
      // events quickly after each other; process only the first one
      if (this.loadingPerspective) {
        return;
      }

      // set the current application scope to workflow
      this.applicationScope.set('id', 'workflow');

      // load the hard coded workflow perspective
      var perspectivePath   = 'json!workflow/perspective/context/plugins/impl/perspectives/',
          perspectiveModule = 'workflow.json';
      this.context.loadPerspective(perspectivePath + perspectiveModule);
    }

  });

  return WorkflowPerspectiveContextPlugin;

});

csui.define('json!workflow/perspective/context/plugins/impl/perspectives/workflow.json',{
  "type": "grid",
  "options": {
    "rows": [
      {
        "columns": [
          {
            "sizes": {
              "md": 12
            },
            "heights": {
              "xs": "full"
            },
            "widget": {
              "type": "workflow/widgets/workitem/workitem",
              "options": {
              }
            }
          }
        ]
      }
    ]
  }
});


csui.define( 'json!workflow/widgets/wfstatus/wfstatus.manifest.json',{
"$schema":"http://opentext.com/cs/json-schema/draft-04/schema#",
"title":"{{title}}", 
  "description":"{{description}}", 
  "kind":"tile", 
  "schema": {
    "type":"object", 
    "required":false, 
    "properties": {
      
      "widgetTitle": {
        "title":"{{workflowtrackingwidgetTitle}}", 
        "description":"{{workflowtrackingwidgetTitleDescription}}", 
        "readonly":false, 
        "required":true, 
        "default":"{{title}}", 
        "type":"string"
      }, 
     
      "retention": {
          "title":"{{displayCompletedWorkflows}}", 
          "description":"{{displayCompletedWorkflowsDescription}}", 
          "readonly":false, 
          "required":false, 
          "default":30, 
          "type":"integer"
        }, 
      "filterWorkflowtype": {
          "title":"{{workflowTypeTitle}}", 
          "description":"{{workflowTypeDescription}}", 
          "type":"string", 
          "enum":[
                "Managed", 
                "Initiated", 
                "Both"
          ], 
          "default":"Both"
        }

    }
  }, 
    "options": {
        "fields": {
                   
            "widgetTitle": {
              "type":"text"
            }, 

            "retention": {
              "type":"number"
            }, 

            "filterWorkflowtype": {
              "type":"select", 
              "optionLabels":[                  
                  "{{workflowTypeManaged}}", 
                  "{{workflowTypeInitiated}}", 
                  "{{workflowTypeBoth}}"
                  ]
              }
           }
           
    }
  });


csui.define( 'json!workflow/widgets/wfmonitor/wfmonitor.manifest.json',{
"$schema":"http://opentext.com/cs/json-schema/draft-04/schema#",
"title":"{{title}}", 
  "description":"{{description}}", 
  "kind":"tile", 
  "schema": {
    "type":"object", 
    "required":false, 
    "properties": {

      "widgetTitle": {
        "title":"{{workflowmonitorwidgetTitle}}", 
        "description":"{{workflowmonitorwidgetTitleDescription}}", 
        "readonly":false, 
        "required":true, 
        "default":"{{title}}", 
        "type":"string"
      }, 

      "wfstatusfilter": {
        "title": "{{workflowStatusTitle}}",
        "description": "{{workflowStatusDescription}}",
        "required":true, 
        "type": "integer"
      }
      
    }
  }, 
    "options": {
        "fields": {                
                  
          "widgetTitle": {
            "type":"text"
          }, 

          "wfstatusfilter": 
            {
              "type": "otcs_node_picker",
              "type_control": {
                "parameters": {
                  "select_types": [190]
                }
              }
            }
        }  
    }
  });

csui.define('workflow/widgets/wfstatus/impl/nls/wfstatus.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('workflow/widgets/wfstatus/impl/nls/root/wfstatus.manifest',{
  "title": "Workflow Tracking",
  "description": "Shows the status of workflows for the current user.",
  "displayCompletedWorkflows": "Days Completed Workflows Display",
  "displayCompletedWorkflowsDescription": "Number of days completed workflows display",
  "workflowTypeTitle" : "Workflow Type",
  "workflowTypeDescription" : "Select the Workflow Types to display",
  "workflowTypeBoth" : "Both",
  "workflowTypeInitiated" : "Initiated",
  "workflowTypeManaged" : "Managed",
  "workflowStatusTitle" : "Workflow Status",
  "workflowStatusDescription" : "Workflow Status Selection",
  "workflowtrackingwidgetTitle" :"Title",
  "workflowtrackingwidgetTitleDescription" :"Workflow Tracking Widget Title"
});

csui.define('workflow/widgets/wfmonitor/impl/nls/wfmonitor.manifest',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('workflow/widgets/wfmonitor/impl/nls/root/wfmonitor.manifest',{
  "title": "Workflow Monitoring",
  "description": "Shows the status of workflows selected via a filter (which is configured in Classic UI).",
  "workflowStatusTitle" : "Workflow Status Filter",
  "workflowStatusDescription" : "Expression created in Classic UI to showcase the status of specific Workflows",
  "workflowmonitorwidgetTitle" : "Title",
  "workflowmonitorwidgetTitleDescription" : "Workflow Monitoring Widget Title"
 });

// Placeholder for the build target file; the name must be the same,
// include public modules from this component

csui.define('bundles/workflow-all',[
  // Toolbars
  'workflow/toolbars/workflow.nodestable.toolbaritems',

  // Application widgets
  'workflow/widgets/workitem/workitem/workitem.view',
  'workflow/widgets/wfstatus/wfstatus.view',
  'workflow/widgets/wfmonitor/wfmonitor.view',
   //Cell Extentions
  'workflow/controls/table/cells/status.cell',
  'workflow/controls/table/cells/date.cell',
  'workflow/controls/table/cells/assignee.cell',

  // Perspective
  'workflow/perspective/context/plugins/workflow.perspective.context.plugin',
  'json!workflow/perspective/context/plugins/impl/perspectives/workflow.json',

  // Extension controller
  'workflow/utils/workitem.extension.controller',

  // Application widgets manifests
  'json!workflow/widgets/wfstatus/wfstatus.manifest.json',
  'json!workflow/widgets/wfmonitor/wfmonitor.manifest.json',
  // Application widgets nls manifest files
  'i18n!workflow/widgets/wfstatus/impl/nls/wfstatus.manifest',
  'i18n!workflow/widgets/wfmonitor/impl/nls/wfmonitor.manifest'
], {});

csui.require(['require', 'css'], function (require, css) {
  

  css.styleLoad(require, 'workflow/bundles/workflow-all', true);

});

