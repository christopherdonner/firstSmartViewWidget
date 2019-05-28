/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/toolbar/toolitem.model',
  'workflow/testutils/base.test.utils',
  'workflow/testutils/tabable.test.dialog/tabable.test.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmenttoolbar.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromCS',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'csui/lib/jquery.simulate'
], function (_, $, Backbone, GlobalMessage, ToolbarModel, BaseTestUtils, TabableTestView,
    WorkItemAttachmentToolbar, AddFromContentServerCommand, lang) {
  'use strict';

  describe('The WorkItemAttachmenToolbar', function () {

    beforeEach(function () {
      BaseTestUtils.workItemMock.enable();
    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
    });

    describe('is rendering', function () {
      var attachmentToolbar;
      var tabable;
      beforeEach(function (done) {
        var context              = BaseTestUtils.getContext(),
            attachmentFolder     = BaseTestUtils.getWorkflowAttachmentFolder(context),
            attachmentCollection = BaseTestUtils.getWorkflowAttachments(context),
            addableTypes         = BaseTestUtils.getWorkflowAttachmentAddableTypes(),
            toolbarCollection    = new Backbone.Collection(),
            viewRendered         = false;

        var fileDoc = new ToolbarModel({name: lang.AddFromDesktopLabel, id: 'filesystem'});
        var shortcut = new ToolbarModel({name: lang.AddShortcutLabel, id: 'shortcut'});
        var others = new ToolbarModel({name: lang.AddFromContentServerLabel, id: 'copy'});
        toolbarCollection.add(fileDoc);
        toolbarCollection.add(shortcut);
        toolbarCollection.add(others);
        attachmentToolbar = new WorkItemAttachmentToolbar({
          context: context,
          originatingView: undefined, //only needed when an actions is executed
          toolbarCollection: toolbarCollection,
          addableTypes: addableTypes,
          container: attachmentFolder,
          attachmentCollection: attachmentCollection
        });
        tabable = new TabableTestView({
          view: attachmentToolbar
        });
        tabable.show();
        BaseTestUtils.waitUntil(function () {
          if (attachmentToolbar.$el.length === 1) {
            attachmentToolbar.toolbarView._adjusting = true;
            tabable.trigger('dom:refresh');
            attachmentToolbar.toolbarView._adjusting = false;
            viewRendered = true;
          }
          return viewRendered;
        }, 5000).always(done);
      });

      afterEach(function () {
        attachmentToolbar.destroy();
        tabable.destroy();
        $('body').empty();
      });

      it('the attachments toolbar', function () {
        var toolbar = attachmentToolbar.$el.find('.workitem-attachment-toolbar-view');
        expect(toolbar.length).toEqual(1);
        var addButton = $(toolbar).find('.icon-toolbarAdd');
        expect(addButton.length).toEqual(1);

        var toolbarMenu = $(toolbar).find('.binf-dropdown-menu li .csui-toolitem');
        expect(toolbarMenu.length).toEqual(3);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddFromDesktopLabel + ')').length).toEqual(1);
        expect(
            $(toolbar).find(
                'li .csui-toolitem:contains(' + lang.AddFromContentServerLabel + ')').length).
        toEqual(1);
        expect($(toolbar).find(
            'li .csui-toolitem:contains(' + lang.AddShortcutLabel + ')').length).toEqual(1);
      });

      it('the attachments toolbar keyboard access', function () {

        var elems = attachmentToolbar.$(':tabbable');
        expect(elems.length).toEqual(1, 'tabbable elements count is not correct');
        var focusedElems = attachmentToolbar.$('[tabindex=0]');
        expect(focusedElems.length).toEqual(1, 'tabindex = 0 elements count is not correct');

        expect(attachmentToolbar.$('li.binf-dropdown.binf-open').length).toEqual(0, 'menu is not collapsed');
        attachmentToolbar.$('.binf-dropdown-toggle')[0].click();
        expect(attachmentToolbar.$('li.binf-dropdown.binf-open').length).toEqual(1, 'menu is not expanded');
        var e = $.Event("keydown");
        e.keyCode = 27;
        e.which = 27;
        attachmentToolbar.$el.trigger(e);

        expect(attachmentToolbar.$('li.binf-dropdown.binf-open').length).toEqual(0, 'menu is not collapsed');
        attachmentToolbar.$('.binf-dropdown-toggle')[0].click();
        expect(attachmentToolbar.$('li.binf-dropdown.binf-open').length).toEqual(1, 'menu is not expanded');
        e = $.Event("keydown");
        e.keyCode = 9;
        e.which = 9;
        attachmentToolbar.$el.trigger(e);

        expect(attachmentToolbar.$('li.binf-dropdown.binf-open').length).toEqual(0, 'menu is not collapsed');

      });
    });
  });
});
