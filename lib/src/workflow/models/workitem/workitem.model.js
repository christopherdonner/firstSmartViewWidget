/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/base',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/contexts/factories/connector'
], function (Backbone, Url, base, _, $, ConnectorFactory) {
  'use strict';

  var ActionModel = Backbone.Model.extend({

    defaults: {
      id: "",
      key: "",
      label: "",
      custom: false
    },
    constructor: function ActionModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    parse: function (response, options) {
      var key = response.key;
      var label = response.label;
      var id = options.custom ? "custom-" + key : "standard-" + key;
      return {key: key, label: label, id: id, custom: options.custom};
    }

  });

  var ActionsCollection = Backbone.Collection.extend({
    model: ActionModel,

    constructor: function ActionsCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  var FormModel = Backbone.Model.extend({

    constructor: function FormModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    _saveChanges: function (changes, formView) {
      var connector = formView.options.context.getObject(ConnectorFactory),
          baseUrl   = connector.connection.url.replace('/v1', '/v2'),
          formUrl   = (formView.alpaca.options.form.attributes.action).split("v1"),
          putUrl    = Url.combine(baseUrl, formUrl[1]),
          dfd       = $.Deferred(),
          callAsync = true;
      if (formView.mode === "create") {
        callAsync = false;
      }
      $.ajax(connector.extendAjaxOptions({
            type: 'PUT',
            url: putUrl,
            async: callAsync,
            data: {body: JSON.stringify(changes)}
          }))
          .done(_.bind(function () {
            dfd.resolve();
          }, this))
          .fail(_.bind(function (jqxhr) {
            var error = new base.Error(jqxhr);
            dfd.reject(error);
          }, this));
      return dfd;
    }
  });

  var FormsCollection = Backbone.Collection.extend({
    model: FormModel,

    constructor: function FormsCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });
  var WorkItemModel = Backbone.Model.extend({

    defaults: {
      process_id: 0,
      subprocess_id: 0,
      task_id: 0,
      isDraft: false,
      title: "",
      instructions: "",
      doc_id: 0,
      mapsList: []
    },
    constructor: function WorkItemModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {

      var baseUrl = this.connector.connection.url;

      var isDraft   = this.get('isDraft'),
          mapsList  = this.get('mapsList'),
          draftId   = this.get('draft_id'),
          processId = draftId ? draftId : this.get('process_id');

      if (isDraft || this.get('isDocDraft') || (mapsList && mapsList.length === 1)) {
        return Url.combine(baseUrl,
            '/forms/draftprocesses/update?draftprocess_id=' + processId);
      } else {
        return Url.combine(baseUrl,
            '/forms/processes/tasks/update?process_id=' + this.get('process_id') +
            '&subprocess_id=' +
            this.get('subprocess_id') + '&task_id=' + this.get('task_id'));
      }
    },

    parse: function (response) {
      this.forms = new FormsCollection(response.forms);
      this.actions = new ActionsCollection(response.data.actions, {parse: true, custom: false});
      delete response.data.actions; //remove action property, so that it is not part of the general model

      this.customActions = new ActionsCollection(response.data.custom_actions, {
        parse: true,
        custom: true
      });
      delete response.data.custom_actions;//remove action property, so that it is not part of the general model
      return response.data;

    },

    isFetchable: function () {
      var docId = this.get('doc_id');
      return docId ? docId : !!this.get('process_id');
    },
    reset: function (options) {
      this.clear(options);
      if (!_.isUndefined(this.actions)) {
        this.actions.reset();
      }
      if (!_.isUndefined(this.customActions)) {
        this.customActions.reset();
      }
      if (!_.isUndefined(this.forms)) {
        this.forms.reset();
      }
    },

    title: function () {
      return this.get('title');
    },
    sendAction: function (action) {
      var baseUrl   = this.connector.connection.url.replace('/v1', '/v2'),
          putUrl    = Url.combine(baseUrl, 'processes', this.get('process_id'), 'subprocesses',
              this.get('subprocess_id'), 'tasks', this.get('task_id')),
          dfd       = $.Deferred(),
          isDraft   = this.get('isDraft'),
          mapsList  = this.get('mapsList'),
          draftId   = this.get('draft_id'),
          processId = draftId ? draftId : this.get('process_id');
      if (isDraft || this.get('isDocDraft') || (mapsList && mapsList.length === 1)) {
        putUrl = Url.combine(baseUrl, 'draftprocesses', processId);
      }
      var content = {};
      if (action.get('custom')) {
        content.custom_action = action.get('key');
      } else {
        content.action = action.get('key');
      }
      if (this.get('comment') !== undefined && this.get('comment').length > 0) {
        content.comment = this.get('comment');
      }
      if (action.get('key') === 'Delegate') {
        content.assignee = this.get('assignee').toString();
      }
      if (action.get('key') === 'Review') {
        content.assignee = this.get('assignee').toString();
        if (_.isNumber(this.get('assigneeOption'))) {
          content.assigneeOption = this.get('assigneeOption').toString();
        } else {
          content.assigneeOption = '0';
        }
      }
      if (this.get('authentication') === true) {
        content.authentication_info = this.get('authentication_info');
      }

      var formData = new FormData();
      formData.append('body', JSON.stringify(content));

      var ajaxOptions = {
        type: 'PUT',
        url: putUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector && this.connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function (resp) {
            dfd.resolve(resp.results);
            this.trigger('workitem:sendon');
          }, this))
          .fail(_.bind(function (resp) {
            dfd.reject(resp);
          }, this));

      return dfd;
    },
    sendMemberAcceptAction: function (acceptStatus) {
      var baseUrl = this.connector.connection.url.replace('/v1', '/v2');
      var putUrl = Url.combine(baseUrl, 'processes', this.get('process_id'), 'subprocesses',
          this.get('subprocess_id'), 'tasks', this.get('task_id'));
      acceptStatus = acceptStatus ? acceptStatus : "accept";
      var content = {action: acceptStatus};
      var formData = new FormData();
      var dfd = $.Deferred();
      formData.append('body', JSON.stringify(content));

      var ajaxOptions = {
        type: 'PUT',
        url: putUrl,
        data: formData,
        contentType: false,
        processData: false
      };
      this.connector && this.connector.extendAjaxOptions(ajaxOptions);

      $.ajax(ajaxOptions)
          .done(_.bind(function () {
            dfd.resolve();
          }, this))
          .fail(_.bind(function (resp) {
            var response = JSON.parse(resp.responseText);
            dfd.reject(response);
          }, this));
      return dfd;
    }

  });

  return WorkItemModel;

});
