/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
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
  'use strict';

  var Activity = Marionette.LayoutView.extend({

    className: 'workflow-activity',

    template: template,
    tagName: 'li',

    templateHelpers: function () {
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
        return base.formatFriendlyDateTime(this.model.get('date'));
      } else {
        return base.formatExactDateTime(this.model.get('date'));
      }
    },

    _getAuditAction: function () {
      var props;
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
      return (this.nodeModel && this.nodeModel.actions.get('open'));
    },

    _getAttachmentInfo: function () {
      var ret = {
        isAttachmentAction: this._isAttachmentAction()
      };
      if (ret.isAttachmentAction === true) {
        var props = this.model.get('action_properties').node;
        if (!_.isUndefined(props)) {
          ret.id = props.id;
          ret.name = props.name;
          ret.description = props.description;
          ret.type = props.type;
          ret.mime_type = props.mime_type;
          ret.url = DefaultActionBehavior.getDefaultActionNodeUrl(
              new Backbone.Model(props, {connector: this.model.connector}));
        }
      }
      return ret;
    },

    _getReassignLabel: function () {
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
      return label;
    },

    regions: {
      userRegion: '.activity-item .user',
      reassignUserRegion: '.activity-item .reassign-user',
      attachmentIconRegion: '.activity-item .attachment-icon'
    },

    constructor: function Activity(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    onDownloadAttachment: function (event) {
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
      var userdef = $.Deferred();
      var userId = this.model.get('user_id');
      if (userId && userId !== 0) {
        var auditUser = new MemberModel({id: userId}, {connector: self.options.connector});
        userdef = auditUser.fetch();
      } else {
        userdef.resolve({data: {display_name: lang.anonymousUserName}});
      }
      $.when(userdef).then(function (data) {
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
        self.listenTo(view, 'render', function () {
          var label = view.$('a.esoc-user-container').attr('aria-label');
          view.$('a.esoc-user-container').attr('aria-label', lang.actionAriaLabel + label);
          view.$('a.esoc-user-container').attr('aria-describedby', this.activityAriaDescribedById);
        });
        if (self.userRegion) {
          self.userRegion.show(view);
        }
      });
      if (this._isReassignAction() === true) {
        var reassigndef = $.Deferred();
        var reassignId = this.model.get('action_properties').user_id;
        if (reassignId && reassignId !== 0) {
          var reassignUser = new MemberModel({id: reassignId}, {connector: self.options.connector});
          reassigndef = reassignUser.fetch();
        } else {
          reassigndef.resolve({data: {display_name: lang.anonymousUserName}});
        }
        $.when(reassigndef).then(function (data) {
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
          self.listenTo(view, 'render', function () {
            var label = view.$('a.esoc-user-container').attr('aria-label');
            var reassignLabel = this._getReassignLabel();
            view.$('a.esoc-user-container').attr('aria-label', reassignLabel.substring(0,reassignLabel.length-1) + label);
          });
          self.reassignUserRegion.show(view);
        });
      }
      if (this._isAttachmentAction() === true) {
        self.nodeModel = new NodeModel(this._getAttachmentInfo(), {
          connector: this.options.connector,
          expand: {
            properties: ['original_id']
          },
          commands: ['open'],
          defaultActionCommands: ['open']
        });
        self.nodeModel.fetch().then(function () {
          var view = new NodeTypeIconView({node: self.nodeModel});
          self.attachmentIconRegion.show(view);
          if (!self._hasAttachmentOpenAction()) {
            self.$('.attachment > div').addClass('disabled');
          }
          var exactNodeSprite = NodeSpriteCollection.findByNode(self.nodeModel) || {},
              mimeTypeFromNodeSprite;
          if (exactNodeSprite.attributes) {
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