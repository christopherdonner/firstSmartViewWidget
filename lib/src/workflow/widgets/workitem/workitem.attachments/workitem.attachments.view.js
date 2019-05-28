/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
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
  'use strict';

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
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },

    _prepareAttachmentActions: function () {
      var deferred = $.Deferred();
      this.toolbarCollection = new Backbone.Collection();
      this.addableTypes = new AddableTypeCollection(undefined, {node: this.model});
      this.addableTypes.fetch().done(_.bind(function () {
        var shortcut, others, fileDoc;
        this.addableTypes.forEach(function (type) {
          switch (type.get('type')) {
          case 1:
            shortcut = new ToolbarModel({
              name: lang.AddShortcutLabel,
              id: 'shortcut'
            });
            break;
          case 144:
            fileDoc = new ToolbarModel({
              name: lang.AddFromDesktopLabel,
              id: 'filesystem',
              type: type.get('type')
            });
            break;
          default:
            if (!others) {
              others = new ToolbarModel({name: lang.AddFromContentServerLabel, id: 'copy'});
            }
          }
        });
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
        deferred.resolve();
      });
      return deferred.promise();
    },

    initialize: function () {
      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
      this.blockActions();
      var mapsList = this.options.view.model.get('mapsList');
      var isDoc = this.options.view.model.get('isDoc');
      if (isDoc !== true || (mapsList && mapsList.length === 1)) {
        var promise = this._prepareAttachmentActions();
        promise.done(_.bind(function () {
          this.attachmentCollection = new NodeChildrenCollection(undefined, {
            node: this.model,
            includeActions: false,
            delayRestCommands: true, // For getting all the actions to show metadata view
            expand: ['node'],
            commands: ['openshortlink', 'download', 'properties', "rename", "delete",
              "default", "addcategory", "open", "edit"]
          });
          this.toolbarView = new WorkItemAttachmentToolbar({
            context: this.context,
            originatingView: this,
            toolbarCollection: this.toolbarCollection,
            addableTypes: this.addableTypes,
            container: this.model,
            attachmentCollection: this.attachmentCollection
          });
          this.toolbar.show(this.toolbarView);
          if (this.toolbarCollection.length <= 0) {
            this.toolbar.$el.addClass('binf-hidden');
          }

          var docModels = this.options.view.model.get("docModels");
          if (docModels) {
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
          this.attachments = new WorkItemAttachmentList({
            context: this.context,
            container: this.model,
            collection: this.attachmentCollection,
            view: this.options.view
          });
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
                    this.list.show(this.attachments);
                  }, this));
            } else if (this.toolbarCollection.length > 0) {
              this.list.show(this.attachments);
            }
          }, this))
          .fail(_.bind(function () {
            GlobalMessage.showMessage('error', lang.ErrorMessageLoadAttachments);
          }, this))
          .always(_.bind(function () {
            this.unblockActions();
          }, this));
    }
  });

  _.extend(WorkItemAttachmentsView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemAttachmentsView;

});
