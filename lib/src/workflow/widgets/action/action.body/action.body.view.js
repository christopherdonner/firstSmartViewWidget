/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
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
  'use strict';
  var ActionBodyCommentView = Marionette.LayoutView.extend({
    className: 'action-comment',
    template: templateComment,
    templateHelpers: function () {
      return {
        label: this.labelText,
        placeholder: this.placeholderText,
        ariaLabel: this.ariaLabel
      };
    },
    ui: {
      textbox: '.comment-input'
    },
    events: {
      'keyup @ui.textbox': 'onKeyUpTextBox'
    },
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },
    constructor: function ActionBodyCommentView(options) {
      this.options = (options || {});
      this.labelText = this.options.commentLabel || lang.commentTextFieldLabel;
      this.ariaLabel = this.options.commentAriaLabel || lang.commentTextFieldLabel;
      this.placeholderText = this.options.commentPlaceholder || lang.commentTextFieldPlaceholder;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },
    onKeyUpTextBox: function () {
      this.triggerMethod('comment:changed', {text: this.ui.textbox.val()});
    },
    currentlyFocusedElement: function () {
      return $(this.ui.textbox);
    }
  });

  var ActionBodyAuthenticateView = Marionette.LayoutView.extend({

    className: 'action-authenticate',

    template:  templateAuthenticate,
    templateHelpers: function () {
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
      return $(this.ui.textbox);
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    }
  });
  var AssigneeTypeSelector = Marionette.LayoutView.extend({
    className: 'assignee-options-select',
    template: templateSelector,
    templateHelpers: function () {
      return {
        lang: lang
      };
    },
    regions: {
      selectField: '.assignee-type-selector-region'
    },
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },
    constructor: function AssigneeTypeSelector(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var collection = new Backbone.Collection([
        {id: lang.assigneeOptionOneMember, name: lang.assigneeOptionOneMember},
        {id: lang.assigneeOptionAllMembers, name: lang.assigneeOptionAllMembers}
      ]);
      this.assingeeOptions = new SelectFieldView({
        id: 'assigneeOptionSelector', //field id
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
      this.assingeeOptions.alpacaField = {
        options: {mode: 'create'},
        schema: {readonly: false},
        setValueAndValidate: function () { return true; },
        setValue: function () { return; },
        parent: {}
      };
      this.selectField.show(this.assingeeOptions);
      this.listenTo(this.assingeeOptions, "field:changed", _.bind(function (event) {
        this.triggerMethod('assigneeOption:changed', {option: event.fieldvalue});
      }, this));
    },
    currentlyFocusedElement: function () {
      if (this.$el.is(':visible')) {
        return this.$('.binf-dropdown-toggle');
      }
      return;
    }

  });
  var ActionBodyView = Marionette.LayoutView.extend({
    className: 'workitem-action-body',
    template: template,
    templateHelpers: function () {
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
    constructor: function ActionBodyView(options) {
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
      this.texts = options.model.get('texts') || {};
      if (this.showAssigneeReadOnly) {
        this.texts.commentAriaLabel = _.str.sformat(lang.commentAriaLabelReply, this.texts.commentLabel,
            this.assigneeAttributes.display_name);
      }
        else{
        this.texts.commentAriaLabel = this.texts.commentLabel;
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions();
    },
    onRender: function () {
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
            if(!this.showAuthenticate) {
              user.$('input').focus();
            }
          });
        this.assigneeRegion.show(user);
        this.listenTo(user, 'item:change', this.onUserChanged);
        this.listenTo(user, 'item:remove', this.onUserRemoved);
      }
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
      if (this.showAssigneeOptionsSelector) {
        var assigneeOptions = new AssigneeTypeSelector({
          context: this.options.context
        });
        this.listenTo(assigneeOptions, 'assigneeOption:changed', this.onAssigneeOptionChanged);
        this.assigneeTypeRegion.show(assigneeOptions);
        this._hideAssigneeOptions(true);
      }
      if (this.showAuthenticate) {
        var authenticate = new ActionBodyAuthenticateView(this.currentUser);
        this.listenTo(authenticate, 'dom:refresh', function()
        {
          authenticate.$('input').focus();
        });
        this.listenTo(authenticate, 'authenticate:changed', this.onAuthenticateChanged);
        this.authenticateInputRegion.show(authenticate);
      }
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
    onAssigneeOptionChanged: function (data) {
      if (data.option === lang.assigneeOptionAllMembers) {
        this.model.set('assigneeOption', 2);
      }
      else{
        this.model.set('assigneeOption', 0);
      }
    },
    onUserChanged: function (e) {
      var assignee = e.item;
      if (assignee.get('disabled')) {
        var picker = this.assigneeRegion.currentView;
        if (picker) {
          picker.ui.searchbox.val('');
        }
        assignee = undefined;
      }
      this.model.set('assignee', assignee);
      if ((assignee && assignee.get('type') === 0) || _.isUndefined(assignee) ){
        this._hideAssigneeOptions(true);
      } else {
        this._hideAssigneeOptions(false);
      }
    },
    onUserRemoved: function (e) {
      this.model.set('assignee', undefined);
      this._hideAssigneeOptions(true);
    },
    onRetrieveMembers: function (args) {
      var self = this;
      if (this.userId) {
        args.collection.each(function (current) {
          if (current.get('id') === self.userId) {
            current.set('disabled', true);
          }
        });
      }
    },
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
  _.extend(ActionBodyView.prototype, LayoutViewEventsPropagationMixin);
  return ActionBodyView;
});
