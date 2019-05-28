/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/controls/globalmessage/globalmessage',
  'csui/models/actions',
  'workflow/testutils/base.test.utils',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromCS',
  'workflow/widgets/workitem/workitem.body/workitem.body.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.controller',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'csui/lib/jquery.simulate'
], function (_, $, GlobalMessage, ActionCollection, BaseTestUtils,
    WorkItemAttachmentsView, AddFromContentServerCommand, WorkItemBodyView, AttachmentExtensionController, lang) {
  'use strict';

  describe('The WorkItemAttachmensView', function () {

    beforeEach(function () {
      BaseTestUtils.workItemMock.enable();
    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
    });

    describe('is rendering', function () {
      var attachmentsView, workitembodyView;
      beforeEach(function (done) {
        var context                            = BaseTestUtils.getContext(),
            attachmentFolder                   = BaseTestUtils.getWorkflowAttachmentFolder(context),
            workItem                           = BaseTestUtils.getSimpleWorkItemModel(context, 1),
            viewRendered                       = false,
            downloadPropertiesActions          = BaseTestUtils.getActions().downloadProperties_301422,
            downloadPropertiesActionCollection = new ActionCollection(downloadPropertiesActions),
            shortcutActions                    = BaseTestUtils.getActions().shortcut_301425,
            shortcutActionCollection           = new ActionCollection(shortcutActions),
            allactions                         = BaseTestUtils.getActions().allActions_301424,
            allActionCollection                = new ActionCollection(allactions),
            actions                            = BaseTestUtils.getActions().allActions_301423,
            actionCollection                   = new ActionCollection(actions),
            allActionsEdit                     = BaseTestUtils.getActions().allActionsEdit_301423,
            allActionsEditCollection           = new ActionCollection(allActionsEdit);



            workitembodyView = new WorkItemBodyView({
          context: context,
          model: workItem,
          extensions: [ new AttachmentExtensionController({context: context}) ]
        });
        workitembodyView.render();
        attachmentsView = new WorkItemAttachmentsView({
          model: attachmentFolder,
          context: context,
          view: workitembodyView
        });
        attachmentsView.render();
        BaseTestUtils.waitUntil(function () {
          if ((attachmentsView.$el.length === 1) &&
              (attachmentsView.$('.csui-dropMessage').length === 1 )) {
            attachmentsView.attachmentCollection.models[0].actions = downloadPropertiesActionCollection;
            attachmentsView.attachmentCollection.models[1].actions = actionCollection;
            attachmentsView.attachmentCollection.models[2].actions = allActionCollection;
            attachmentsView.attachmentCollection.models[3].actions = shortcutActionCollection;
            attachmentsView.attachmentCollection.models[4].actions = allActionsEditCollection;
            viewRendered = true;
          }
          return viewRendered;
        }, 5000).always(done);
      });

      afterEach(function () {
        attachmentsView.destroy();
        workitembodyView.destroy();
        $('body').empty();
      });

      it('the attachments toolbar', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");
        var toolbar = attachmentsView.$el.find('.workitem-attachment-toolbar');
        expect(toolbar.length).toEqual(1);
        var addButton = $(toolbar).find('.icon-toolbarAdd');
        expect(addButton.length).toEqual(1);

        var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
        expect(toolbarMenu.length).toEqual(3);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromDesktopLabel + ')').length).toEqual(1);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromContentServerLabel + ')').length).
        toEqual(1);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddShortcutLabel + ')').length).toEqual(1);

      });

      it('the attachments folder with 5 attachments', function () {
        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[0];
        var icon = $(element).find('.csui-icon.mime_paper');
        expect(icon.length).toEqual(1);
        var name = $(element).find('.workitem-attachments-name > div');
        expect(name.length).toEqual(1);
        expect(name.text()).toEqual('Document 1');
        var description = $(element).find('.workitem-attachments-description-ro');
        expect(description.length).toEqual(1);
        expect(description.text()).toEqual('Description of Document 1');
        element = elements[1];
        icon = $(element).find('.csui-icon.mime_paper');
        expect(icon.length).toEqual(1);
        name = $(element).find('.workitem-attachments-name > div');
        expect(name.length).toEqual(1);
        expect(name.text()).toEqual('Document 2');
        description = $(element).find('.workitem-attachments-description-ro');
        expect(description.length).toEqual(1);
        expect(description.text()).toEqual('Description of Document 2');
        element = elements[2];
        icon = $(element).find('.csui-icon.mime_paper');
        expect(icon.length).toEqual(1);
        name = $(element).find('.workitem-attachments-name > div');
        expect(name.length).toEqual(1);
        expect(name.text()).toEqual('Document 3');
        description = $(element).find('.workitem-attachments-description-ro');
        expect(description.length).toEqual(1);
        expect(description.text()).toEqual('Description of Document 3, save returns an error');

      });

      it('the attachments inline actions with different actions', function () {
        attachmentsView.$el.appendTo(document.body);
        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[0];
        $(element).trigger('mouseenter');

        var actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var actions = $(actionbar).find('li');
        expect(actions.length).toEqual(2);
        $(element).trigger('mouseleave');
        actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(0);
        element = elements[1];
        $(element).trigger('mouseenter');
        actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        actions = $(actionbar).find('li');
        expect(actions.length).toEqual(4);
        $(element).trigger('mouseleave');
        actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(0);
      });

      it('the attachments inline actions for Office document', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[4];
        $(element).trigger('mouseenter');
        var actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var actions = $(actionbar).find('li');
        expect(actions.length).toEqual(6);
        var editIcon = $(element).find('.icon-toolbar-edit');
        expect(editIcon.length).toEqual(1);
        var dropdownIcon = $(element).find('.binf-dropdown-toggle');
        expect(dropdownIcon.length).toEqual(1);
        var dropdownMenu = $(element).find('.binf-dropdown-menu.binf-dropdown-menu-right');
        expect(dropdownMenu.length).toEqual(1);
        var dropdownMenuItems = $(element).find('.binf-dropdown-menu.binf-dropdown-menu-right > li > a');
        expect(dropdownMenuItems.length).toEqual(2);
        expect(dropdownMenuItems[0].innerHTML).toEqual("Rename");
        expect(dropdownMenuItems[1].innerHTML).toEqual("Delete");

      });


      it('the attachments inline actions with delete action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[1];
        $(element).trigger('mouseenter');
        var actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var deleteIcon = $(element).find('.icon-toolbar-delete');
        expect(deleteIcon.length).toEqual(1);

      });

      it('the attachments inline actions with download action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[0];
        $(element).trigger('mouseenter');
        var actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var downloadIcon = $(element).find('.icon-toolbar-download');
        expect(downloadIcon.length).toEqual(1);

      });

      it('the shortlink attachment inline actions with openshortlink action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[3];
        $(element).trigger('mouseenter');
        var actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var openshortlink = $(element).find('.icon-toolbar-shortcut');
        expect(openshortlink.length).toEqual(1);

      });

      it('the attachments inline actions with rename action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[1];
        $(element).trigger('mouseenter');
        var actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var renameIcon = $(element).find('.icon-toolbar-rename');
        expect(renameIcon.length).toEqual(1);

      });

      it('the attachments inline actions with properties action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(5);
        var element = elements[1];
        $(element).trigger('mouseenter');
        var actionbar = $(element).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var propertiesIcon = $(element).find('.icon-toolbar-metadata');
        expect(propertiesIcon.length).toEqual(1);

      });

    });

    describe('is rendering', function () {
      var attachmentsView, workitembodyView;
      beforeEach(function (done) {
        var context          = BaseTestUtils.getContext(),
            attachmentFolder = BaseTestUtils.getWorkflowAttachmentFolder(context,
                1704), /*attachment folder only add from contentserver permission*/
            workItem         = BaseTestUtils.getSimpleWorkItemModel(context, 1),
            viewRendered     = false,
            actions          = BaseTestUtils.getActions().propertiesRename_301422,
            actionCollection = new ActionCollection(actions);
        workitembodyView = new WorkItemBodyView({
          context: context,
          model: workItem
        });
        workitembodyView.render();
        attachmentsView = new WorkItemAttachmentsView({
          model: attachmentFolder,
          context: context,
          view: workitembodyView
        });
        attachmentsView.render();
        BaseTestUtils.waitUntil(function () {
          if ((attachmentsView.$el.length === 1) &&
              (attachmentsView.$('.csui-dropMessage').length === 1 )) {
            attachmentsView.attachmentCollection.models[0].actions = actionCollection;
            viewRendered = true;
          }
          return viewRendered;
        }, 5000).always(done);
      });

      afterEach(function () {
        attachmentsView.destroy();
        workitembodyView.destroy();
        $('body').empty();
      });

      it('the attachments toolbar only with "Add from ContentServer"', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");
        var toolbar = attachmentsView.$el.find('.workitem-attachment-toolbar');
        expect(toolbar.length).toEqual(1);
        var addButton = $(toolbar).find('.icon-toolbarAdd');
        expect(addButton.length).toEqual(1);

        var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
        expect(toolbarMenu.length).toEqual(1);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromContentServerLabel + ')').length).
        toEqual(1);
        expect($(toolbar).find('li .csui-toolitem:contains(' + lang.AddFromDesktopLabel + ')').length).
        toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddShortcutLabel + ')').length).toEqual(0);

      });

      it('the attachments inline actions with out delete action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(1);

        $(elements).trigger('mouseenter');
        var actionbar = $(elements).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var deleteIcon = $(elements).find('.icon-toolbar-delete');
        expect(deleteIcon.length).toEqual(0);

      });

      it('the attachments inline actions with out download action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(1);

        $(elements).trigger('mouseenter');
        var actionbar = $(elements).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var downloadIcon = $(elements).find('.icon-toolbar-download');
        expect(downloadIcon.length).toEqual(0);

      });

      it('the attachments inline actions with out openshortlink action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(1);

        $(elements).trigger('mouseenter');
        var actionbar = $(elements).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var openshortlink = $(elements).find('.icon-toolbar-shortcut');
        expect(openshortlink.length).toEqual(0);

      });

    });

    describe('is rendering', function () {
      var attachmentsView, workitembodyView;
      beforeEach(function (done) {
        var context          = BaseTestUtils.getContext(),
            attachmentFolder = BaseTestUtils.getWorkflowAttachmentFolder(context,
                1705), /*attachment folder with only shortcut permission*/
            workItem         = BaseTestUtils.getSimpleWorkItemModel(context, 1),
            viewRendered     = false;

        workitembodyView = new WorkItemBodyView({
          context: context,
          model: workItem
        });
        workitembodyView.render();
        attachmentsView = new WorkItemAttachmentsView({
          model: attachmentFolder,
          context: context,
          view: workitembodyView
        });
        attachmentsView.render();
        BaseTestUtils.waitUntil(function () {
          if ((attachmentsView.$el.length === 1) &&
              (attachmentsView.$('.csui-dropMessage').length === 1 )) {
            viewRendered = true;
          }
          return viewRendered;
        }, 5000).always(done);
      });

      afterEach(function () {
        attachmentsView.destroy();
        $('body').empty();
      });

      it('the attachments toolbar only with "Add shortcut"', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");
        var toolbar = attachmentsView.$el.find('.workitem-attachment-toolbar');
        expect(toolbar.length).toEqual(1);
        var addButton = $(toolbar).find('.icon-toolbarAdd')
        expect(addButton.length).toEqual(1);

        var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
        expect(toolbarMenu.length).toEqual(1);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromContentServerLabel + ')').length).
        toEqual(0);
        expect($(toolbar).find('li .csui-toolitem:contains(' + lang.AddFromDesktopLabel + ')').length).
        toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddShortcutLabel + ')').length).toEqual(1);

      });
    });

    describe('is rendering', function () {
      var attachmentsView, workitembodyView;
      beforeEach(function (done) {
        var context          = BaseTestUtils.getContext(),
            attachmentFolder = BaseTestUtils.getWorkflowAttachmentFolder(context,
                1706), /*attachment folder only document permission*/
            workItem         = BaseTestUtils.getSimpleWorkItemModel(context, 1),
            viewRendered     = false;

        workitembodyView = new WorkItemBodyView({
          context: context,
          model: workItem
        });
        workitembodyView.render();
        attachmentsView = new WorkItemAttachmentsView({
          model: attachmentFolder,
          context: context,
          view: workitembodyView
        });
        attachmentsView.render();
        BaseTestUtils.waitUntil(function () {
          if ((attachmentsView.$el.length === 1) &&
              (attachmentsView.$('.csui-dropMessage').length === 1 )) {
            viewRendered = true;
          }
          return viewRendered;
        }, 5000).always(done);
      });

      afterEach(function () {
        attachmentsView.destroy();
        $('body').empty();
      });

      it('the attachments toolbar only with "Add from Desktop"', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");
        var toolbar = attachmentsView.$el.find('.workitem-attachment-toolbar');
        expect(toolbar.length).toEqual(1);
        var addButton = $(toolbar).find('.icon-toolbarAdd');
        expect(addButton.length).toEqual(1);

        var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
        expect(toolbarMenu.length).toEqual(1);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromContentServerLabel + ')').length).
        toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromDesktopLabel + ')').length).toEqual(1);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddShortcutLabel + ')').length).toEqual(0);

      });
    });

    describe('is rendering', function () {
      var attachmentsView, workitembodyView;
      beforeEach(function (done) {
        var context          = BaseTestUtils.getContext(),
            attachmentFolder = BaseTestUtils.getWorkflowAttachmentFolder(context,
                815), /*attachment folder without permission*/
            workItem         = BaseTestUtils.getSimpleWorkItemModel(context, 1),
            viewRendered     = false,
            actions          = BaseTestUtils.getActions().downloadDelete_301422,
            actionCollection = new ActionCollection(actions);

        workitembodyView = new WorkItemBodyView({
          context: context,
          model: workItem
        });
        workitembodyView.render();
        attachmentsView = new WorkItemAttachmentsView({
          model: attachmentFolder,
          context: context,
          view: workitembodyView
        });
        attachmentsView.render();
        BaseTestUtils.waitUntil(function () {
          if ((attachmentsView.$el.length === 1) &&
              (attachmentsView.$('.csui-dropMessage').length === 1 )) {
            attachmentsView.attachmentCollection.models[0].actions = actionCollection;
            viewRendered = true;
          }
          return viewRendered;
        }, 5000).always(done);
      });

      afterEach(function () {
        attachmentsView.destroy();
        workitembodyView.destroy();
        $('body').empty();
      });

      it('the attachments toolbar not shown', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");
        var toolbar = attachmentsView.$el.find('.workitem-attachment-toolbar.binf-hidden');
        expect(toolbar.length).toEqual(1);
        var addButton = $(toolbar).find('.icon-toolbarAdd');
        expect(addButton.length).toEqual(0);

        var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
        expect(toolbarMenu.length).toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromDesktopLabel + ')').length).toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromContentServerLabel + ')').length).
        toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddShortcutLabel + ')').length).toEqual(0);

      });

      it('the attachments inline actions with out rename action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(1);

        $(elements).trigger('mouseenter');
        var actionbar = $(elements).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var renameIcon = $(elements).find('.icon-toolbar-rename');
        expect(renameIcon.length).toEqual(0);

      });

      it('the attachments inline actions with out properties action', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");

        var elements = attachmentsView.$el.find('.workitem-attachment-properties');
        expect(elements.length).toEqual(1);

        $(elements).trigger('mouseenter');
        var actionbar = $(elements).find('.csui-table-actionbar.csui-state-full');
        expect(actionbar.length).toEqual(1);
        var propertiesIcon = $(elements).find('.icon-toolbar-metadata');
        expect(propertiesIcon.length).toEqual(0);

      });

    });

    describe('is rendering', function () {
      var attachmentsView, workitembodyView;
      beforeEach(function (done) {
        var context          = BaseTestUtils.getContext(),
            attachmentFolder = BaseTestUtils.getWorkflowAttachmentFolder(context,
                9999), /*invalid attachment folder */
            workItem         = BaseTestUtils.getSimpleWorkItemModel(context, 1),
            viewRendered     = false;
        spyOn(GlobalMessage, "showMessage");
        workitembodyView = new WorkItemBodyView({
          context: context,
          model: workItem
        });
        workitembodyView.render();
        attachmentsView = new WorkItemAttachmentsView({
          model: attachmentFolder,
          context: context,
          view: workitembodyView
        });
        attachmentsView.render();
        BaseTestUtils.waitUntil(function () {
          if (attachmentsView.$el.length === 1) {
            viewRendered = true;
          }
          return viewRendered;
        }, 5000).always(done);
      });

      afterEach(function () {
        attachmentsView.destroy();
        workitembodyView.destroy();
        $('body').empty();
      });

      it('the attachments could not be loaded error message', function () {
        attachmentsView.$el.appendTo(document.body);
        attachmentsView.trigger("dom:refresh");
        expect(GlobalMessage.showMessage).toHaveBeenCalledWith('error',
            'Workflow attachments could not be loaded.');
        var toolbar = attachmentsView.$el.find('.workitem-attachment-toolbar.hidden');
        expect(toolbar.length).toEqual(0);
        var addButton = $(toolbar).find('.icon-toolbarAdd');
        expect(addButton.length).toEqual(0);

        var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
        expect(toolbarMenu.length).toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromDesktopLabel + ')').length).toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromContentServerLabel + ')').length).
        toEqual(0);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddShortcutLabel + ')').length).toEqual(0);

      });
    });
  });
});