/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
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
  'use strict';

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
            GlobalMessage.showMessage('error', AttachmentsLang.ErrorMessageLoadAttachments);
          }, this))
          .always(_.bind(function () {
            this.unblockActions();
          }, this));

    }
  });

  return WFStatusItemAttachmentsView;

});
