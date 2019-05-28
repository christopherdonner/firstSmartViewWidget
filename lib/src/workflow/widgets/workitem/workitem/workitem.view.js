/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
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
  'use strict';

  var TabPanelCollection = Backbone.Collection.extend({
    comparator: function (a) {
      return a.get('position');
    }
  });

  var WorkitemView = Marionette.LayoutView.extend({
    className: 'workitem-view',
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
    _isSending: false,
    constructor: function WorkitemView(options) {
      this.tabPanelCollection = new TabPanelCollection();
      options.model = options.model ? options.model :
                      options.context.getModel(WorkItemModelFactory);
      this.user = options.context.getModel(UserModelFactory);
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions();
      this.listenTo(this.model, 'change', this.onModelChange);
      var ext = viewExtensions;
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
      var promises = [];
      promises.push(this.getTabPanelCollection());
      promises.push(this.getFullViewExtension());
      $.when.apply($, promises).done(_.bind(function (args) {
        if ((this.model.get("isDoc") || this.model.get("isDocDraft")) &&
            this.model.get('datafetched') !== true) {
          return;
        }
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
                    this.render();
                  }
                }, that))
                .fail(_.bind(function (error) {
                  GlobalMessage.showMessage('error', error.responseJSON.error);
                }, that));
          });

        } else {
          this.render();
        }
      }, this));
    },

    extensionsExecuteAction: function (action, options, model) {
      var data;
      var promises = [];
      _.each(this.extensions, function (ext) {
        var deferred = $.Deferred();
        promises.push(deferred.promise());
        ext.executeAction({"action": action, "options": options, "model": model})
            .done(_.bind(function (args) {
              if (!_.isUndefined(args)) {
                data = args;
              }
              deferred.resolve();
            }, this))
            .fail(_.bind(function (args) {
              deferred.reject();
            }, this));
      });
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
      this.tabPanelCollection.reset();
      var TabPanelCollectionLocal = new TabPanelCollection();
      var dataPackages = this.model.get('data_packages');
      if (dataPackages === undefined) {
        dataPackages = [];
      }
      dataPackages.push({
        type: WorkItemActivitiesController.prototype.type,
        sub_type: WorkItemActivitiesController.prototype.sub_type,
        data: {}
      });
      var allPackagesExecuted = [];
      _.each(dataPackages, function (dataPackage) {
        var packageExecuted = $.Deferred();
        allPackagesExecuted.push(packageExecuted.promise());
        var controller = _.find(this.extensions, function (ext) {
          return ext.validate(dataPackage.type, dataPackage.sub_type);
        });
        if (controller) {
          controller.execute({
            extensionPoint: WorkItemExtensionController.ExtensionPoints.AddSidebar,
            model: this.model,
            data: dataPackage.data,
            parentView: this
          }).done(_.bind(function (args) {
            args.type = dataPackage.type;
            args.sub_type = dataPackage.sub_type;
            if (args.viewToRender) {
              TabPanelCollectionLocal.add(_.extend(args, {id: _.uniqueId('workflow-tab')}));
            }
            packageExecuted.resolve();
          }, this)).fail(_.bind(function (args) {
            GlobalMessage.showMessage('error', args.errorMsg || lang.ErrorMessageLoadExtension);
            packageExecuted.resolve();
          }, this));
        }
        else {
          packageExecuted.resolve();
        }
      }, this);
      var ret = $.Deferred();
      $.when.apply($, allPackagesExecuted).done(_.bind(function () {
        this.tabPanelCollection = TabPanelCollectionLocal;
        ret.resolve();
      }, this));
      return ret.promise();
    },

    getFullViewExtension: function () {
      var promises = [];
      this.fullViewExtension = undefined;
      var pkgs = this.model.get('data_packages');
      _.each(pkgs, function (pkg) {
        var controller = _.find(this.extensions, function (extension) {
          return extension.validate(pkg.type, pkg.sub_type);
        });
        if (controller) {
          var deferred = $.Deferred();
          promises.push(deferred.promise());
          controller.execute({
            extensionPoint: WorkItemExtensionController.ExtensionPoints.FullView,
            model: this.model,
            data: pkg.data,
            parentView: this
          }).done(_.bind(function (args) {
            args.type = pkg.type;
            args.sub_type = pkg.sub_type;
            if (args.viewToShow) {
              this.extensionsFullView = args.viewToShow;
            }
            deferred.resolve();
          }, this)).fail(_.bind(function (args) {
            GlobalMessage.showMessage('error', args.errorMsg || lang.ErrorMessageLoadExtension);
            deferred.resolve();
          }, this));
        }
      }, this);
      var ret = $.Deferred();
      $.when.apply($, promises).done(function () {
        ret.resolve();
      });
      return ret.promise();
    },

    onBeforeRender: function () {
      if (this.extensionsFullView !== undefined) {
        this.template = templateextfullview;
      } else if (this.tabPanelCollection.models.length === 0) {
        this.template = templatenopackages;
      } else {
        this.template = template;
      }
    },

    onRender: function () {

      if ((this.model.get("isDoc") || this.model.get("isDocDraft")) &&
          this.model.get('datafetched') !== true) {
        return;
      }

      if (this._isSending) {
        return;
      }

      if (this.extensionsFullView !== undefined) {
        this.fullview.show(this.extensionsFullView);
      } else {
        this._renderHeader();
        this._renderBody();
        this._renderTabPanel();
        this._renderFooter();
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
      var bodyView = this.bodyView = new WorkItemBodyView(this.options);
      this.body.show(bodyView);
    },

    _renderTabPanel: function () {
      var mapsList = this.model.get('mapsList');
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
      if (this.model.get('isDoc') === true && mapsList && mapsList.length !== 1) {
        button = {
          label: lang.StartButtonLabel,
          disabled: true,
          default: true
        };
        buttonArray.push(button);
      }

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
          self._acceptWorkitem();
          self.headerView.triggerMethod("setFocus");
        } else {
          self._rejectWorkitem();
        }
      });
    },

    _acceptWorkitem: function () {
      var self = this;
      this.model.sendMemberAcceptAction().done(function () {
        self._updateWorkitemPerformer();
        GlobalMessage.showMessage('success', lang.MemberAcceptedMessage);
      }).fail(function (response) {
        var error;
        if (response.errorDetail && response.errorDetail === "ErrCode_Accept_Task") {
          error = lang.MemberAcceptErrorDescription;
        } else {
          error = response.error;
        }
        ModalAlert.showWarning(error, lang.MemberAcceptErrorTitle).always(function () {
          self._leaveWorkitemPerspective();
        });
      });
    },

    _rejectWorkitem: function () {
      this._leaveWorkitemPerspective();
    },

    _updateWorkitemPerformer: function () {
      var filteredFormViewsList = [],
          contentView           = this.options.parentView.bodyView.properties.currentView,
          formView              = contentView.forms.currentView;
      if (formView && formView.children) {
        var childFormViews = formView.children._views;
        _.each(childFormViews, function (formView) {
          var model      = formView.model,
              attributes = model.attributes.data,
              matchedKey = _.has(attributes, "WorkflowForm_Performer");
          if (matchedKey) {
            filteredFormViewsList.push(formView);
          }
        });
        if (filteredFormViewsList.length > 0) {
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
        return this.template;
      }
    },

    getUrl: function () {
      var vars = {};
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
    onClickButton: function (view) {

      var model = view.model;
      if (model.get('close')) {
        this._leaveWorkitemPerspective();
      } else {
        var workItem = {validate: false};
        this.model.trigger('form:isValid', workItem);
        if (workItem.validate) {
          if (this.model.get('isDraft') || this.model.get('isDocDraft') ||
              this.model.get('isDoc')) {
            this.model.trigger('form:saveForms');
          }
          this._ExecuteAction(model.get('id'), view);
        }
      }
    },
    _ExecuteAction: function (idButton, buttonView) {
      var action = this.model.actions.get(idButton);
      if (_.isUndefined(action)) {
        action = this.model.customActions.get(idButton);
      }
      var actionOptions = {};
      switch (action.get('key')) {
      case 'Delegate':
      {
        actionOptions = {
          requireAssignee: true,
          assignee: this.user
        };
        break;
      }
      case 'Review':
      {
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
      this.extensionsExecuteAction(action, actionOptions, this.model)
          .done(_.bind(function (args) {
            if (args && (args.scope === 'custom')) {
              var customModel = new Backbone.Model(args.data);
              this._sendOnWorkitem(customModel);
            } else {
              if ((this.tabPanelCollection !== undefined) && (this.tabPanelCollection.length > 0)) {
                var nodeModelFromTabPanelCollection = _.filter(this.tabPanelCollection.models,
                    function (tabPanelModel) {
                      if ((tabPanelModel.get("type") === 1) &&
                          (tabPanelModel.get("sub_type") === 1)) {
                        return true;
                      }
                    });
                if (nodeModelFromTabPanelCollection.length > 0) {
                  var attachmentCollection = new NodeChildrenCollection(undefined, {
                    node: nodeModelFromTabPanelCollection[0].get("viewToRenderOptions").model,
                    fields: {
                      properties: ['id', 'reserved', 'name']
                    }
                  });
                  attachmentCollection.fetch()
                      .done(_.bind(function (args) {
                        var reservedAttachments = _.filter(args.data, function (attachment) {
                          return attachment.reserved;
                        });
                        var that = this;
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
      if (dialogModel.get('requireComment') || dialogModel.get('requireAssignee') || dialogModel.get('authentication')) {
        var actionDialog = new ActionDialogView({
          context: this.options.context,
          model: dialogModel,
          callback: _.bind(this._sendOnWorkitem, this)
        });
        this.listenTo(actionDialog, 'destroy', _.bind(function () {
          this.$el.focus();
        }, buttonView));
        actionDialog.show();
      } else {
        this._sendOnWorkitem(dialogModel);
      }
    },
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
    _sendOnWorkitem: function (model, options) {
      this._isSending = true;
      var action = model.get('action');
      var comment = model.get('comment');
      if (!_.isUndefined(comment) && comment.length !== 0) {
        this.model.set('comment', comment, {silent: true});
      }

      var assignee = model.get('assignee');
      if (!_.isUndefined(assignee)) {
        this.model.set('assignee', assignee.get('id'), {silent: true});
      }

      var assigneeOption = model.get('assigneeOption');
      if (!_.isUndefined(assigneeOption)) {
        this.model.set('assigneeOption', assigneeOption, {silent: true});
      }

      var authentication_info = model.get('authentication_info');
      if (!_.isUndefined(authentication_info)) {
        this.model.set('authentication_info', authentication_info, {silent: true});
      }

      this.model.sendAction(action)
          .done(_.bind(function (results) {
            var urlOrg = "";
            if (window.location.href.indexOf("reload_classic_ui=true") > 0) {
              urlOrg = this.getUrl();
              this.model.set({url_org: urlOrg}, {silent: true});
            }
            else {
              urlOrg = this.model.get('url_org');
            }
            if ((results) && (results.auto_display)) {
              if (results.auto_display.workflow_open_in_smart_ui === true) {
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
                var OpenWorkItemViewCommand = OpenWorkItemCommand.extend({ // URL for
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
              this._leaveWorkitemPerspective();
              if (results && results.custom_message) {
                GlobalMessage.showMessage('success', results.custom_message);
              } else {
                if (this.model.get('isDraft') || this.model.get('isDocDraft') ||
                    this.model.get('isDoc')) {
                  GlobalMessage.showMessage('success', lang.SuccessInitiateMessage);
                } else {
                  GlobalMessage.showMessage('success', lang.SuccessSendOnMessage);
                }
              }
            }

          }, this))
          .fail(_.bind(function (response) {
            var serverError = this._getRespError(response);
            var title = _.str.sformat(lang.ActionFailMessageTitle, action.get('label'));
            var message = _.str.sformat(lang.ActionFailMessage, action.get('label'), serverError);
            ModalAlert.showError(message, title);
            this._isSending = false;
          }, this));
    },

    _leaveWorkitemPerspective: function () {
      if (window.location.href.indexOf("reload_classic_ui=true") > 0) {
        var url = Utils.validateURL(this.getUrl());
        if (url && url !== '') {
          window.open(url, "_self");
        }
        else {
          this._navigateBack();
        }
      } else if (this.model && this.model.get('isDocDraft') === true) {
        this._navigateToDocParentNode();
      } else if (this.model.get('url_org')) {
        location.href = this.model.get('url_org');
      }
      else {
        this._navigateBack();
      }
    },

    _navigateBack: function () {
      if (history.length > 1) {
        history.back();
      } else {
        this.options.context.getModel(ApplicationScopeModelFactory).set('id', '');
      }
    }

  });

  _.extend(WorkitemView.prototype, LayoutViewEventsPropagationMixin);
  return WorkitemView;
});
