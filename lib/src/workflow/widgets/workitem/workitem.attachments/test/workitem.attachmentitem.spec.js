/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/models/actions',
  'csui/controls/globalmessage/globalmessage',
  'workflow/testutils/base.test.utils',
  'workflow/testutils/tabable.test.dialog/tabable.test.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem.view',
  'csui/lib/jquery.simulate'
], function (_, $, Backbone, ActionCollection, GlobalMessage, BaseTestUtils, TabableTestView,
    WorkItemAttachmentItem) {
  'use strict';

  describe('The WorkItemAttachmenItem', function () {

    beforeEach(function () {
      BaseTestUtils.workItemMock.enable();
    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
    });

    describe('is rendering', function () {
      var attachmentItem;
      var tabable;
      beforeEach(function (done) {
        var context              = BaseTestUtils.getContext(),
            attachmentFolder     = BaseTestUtils.getWorkflowAttachmentFolder(context),
            attachmentCollection = BaseTestUtils.getWorkflowAttachments(context),
            viewRendered         = false,
            actions              = BaseTestUtils.getActions().allActions_301423,
            actionCollection     = new ActionCollection(actions);

        attachmentCollection.fetch().done(function () {
          attachmentItem = new WorkItemAttachmentItem({
            context: context,
            model: attachmentCollection.findWhere({id: 301423})
          });
          tabable = new TabableTestView({
            view: attachmentItem
          });
          tabable.show();
          BaseTestUtils.waitUntil(function () {
            if (attachmentItem.$el.length === 1) {
              attachmentItem.model.actions = actionCollection;
              viewRendered = true;
            }
            return viewRendered;
          }, 5000).always(done);
        });

      });

      afterEach(function () {
        attachmentItem.destroy();
        tabable.destroy();
        $('body').empty();
      });

      it('the attachments item', function () {
        var item = attachmentItem.$el.find('.workitem-attachments-item');
        expect(item.length).toEqual(1);

        var itemName = attachmentItem.$el.find('a.workitem-attachments-name');
        expect(itemName.length).toEqual(1);

        var itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
        expect(itemNameInput.length).toEqual(1);
        expect(itemNameInput.hasClass('binf-hidden')).toBeTruthy();

        var itemDescription = attachmentItem.$el.find('div.workitem-attachments-description');
        expect(itemDescription.length).toEqual(1);

        var itemDescriptionText = attachmentItem.$el.find(
            'span.workitem-attachments-description-ro');
        expect(itemDescriptionText.length).toEqual(1);
        expect(itemDescriptionText.hasClass('binf-hidden')).toBeFalsy();

        var itemDescriptionInput = attachmentItem.$el.find(
            '.workitem-attachments-description-input');
        expect(itemDescriptionInput.length).toEqual(1);
        expect(itemDescriptionInput.hasClass('binf-hidden')).toBeTruthy();

        var itemDescriptionCancelBtn = attachmentItem.$el.find(
            '.workitem-attachments-description-cancel');
        expect(itemDescriptionCancelBtn.length).toEqual(1);
        expect(itemDescriptionCancelBtn.hasClass('binf-hidden')).toBeTruthy();
      });

      it('the attachments item with file name and description in edit mode', function () {
        var item = attachmentItem.$el.find('.workitem-attachments-item');
        expect(item.length).toEqual(1);

        var itemName = attachmentItem.$el.find('a.workitem-attachments-name');
        expect(itemName.length).toEqual(1);

        var itemDescription = attachmentItem.$el.find('div.workitem-attachments-description');
        expect(itemDescription.length).toEqual(1);
        var e = $.Event("keydown");
        e.keyCode = 113;
        e.which = 113;
        e.target = attachmentItem.el;
        attachmentItem.$el.trigger(e);

        var itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
        expect(itemNameInput.length).toEqual(1);
        expect(itemNameInput.hasClass('binf-hidden')).toBeFalsy();
        expect(itemNameInput.val()).toEqual('Document 2');

        var itemDescriptionText = attachmentItem.$el.find(
            'span.workitem-attachments-description-ro');
        expect(itemDescriptionText.length).toEqual(1);
        expect(itemDescriptionText.hasClass('binf-hidden')).toBeTruthy();
        expect(itemDescriptionText.text()).toEqual('Description of Document 2');

        var itemDescriptionInput = attachmentItem.$el.find(
            '.workitem-attachments-description-input');
        expect(itemDescriptionInput.length).toEqual(1);
        expect(itemDescriptionInput.hasClass('binf-hidden')).toBeFalsy();
        expect(itemDescriptionInput.val()).toEqual('Description of Document 2');

        var itemNameCancelBtn = attachmentItem.$el.find('.workitem-attachments-name-cancel');
        expect(itemNameCancelBtn.length).toEqual(1);
        expect(itemNameCancelBtn.hasClass('binf-hidden')).toBeFalsy();
        e = $.Event("keydown");
        e.keyCode = 27;
        e.which = 27;
        e.target = itemDescriptionInput[0];
        attachmentItem.$el.trigger(e);

        itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
        expect(itemNameInput.length).toEqual(1);
        expect(itemNameInput.hasClass('binf-hidden')).toBeTruthy();

        itemDescriptionText = attachmentItem.$el.find('span.workitem-attachments-description-ro');
        expect(itemDescriptionText.length).toEqual(1);
        expect(itemDescriptionText.hasClass('binf-hidden')).toBeFalsy();
        expect(itemDescriptionText.text()).toEqual('Description of Document 2');

        itemDescriptionInput = attachmentItem.$el.find('.workitem-attachments-description-input');
        expect(itemDescriptionInput.length).toEqual(1);
        expect(itemDescriptionInput.hasClass('binf-hidden')).toBeTruthy();

        itemNameCancelBtn = attachmentItem.$el.find('.workitem-attachments-name-cancel');
        expect(itemNameCancelBtn.length).toEqual(1);
        expect(itemNameCancelBtn.hasClass('binf-hidden')).toBeTruthy();
      });

      it('the attachments item with name and description edit mode and save', function () {

        spyOn(GlobalMessage, "showMessage");
        var item = attachmentItem.$el.find('.workitem-attachments-item');
        expect(item.length).toEqual(1);

        var itemName = attachmentItem.$el.find('a.workitem-attachments-name');
        expect(itemName.length).toEqual(1);

        var itemDescription = attachmentItem.$el.find('div.workitem-attachments-description');
        expect(itemDescription.length).toEqual(1);
        var e = $.Event("keydown");
        e.keyCode = 113;
        e.which = 113;
        e.target = attachmentItem.el;
        attachmentItem.$el.trigger(e);

        var itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
        expect(itemNameInput.length).toEqual(1);
        expect(itemNameInput.hasClass('binf-hidden')).toBeFalsy();
        expect(itemNameInput.val()).toEqual('Document 2');

        var itemNameText = attachmentItem.$el.find('div.workitem-attachment-name');
        expect(itemNameText.length).toEqual(1);
        expect(itemNameText.hasClass('binf-hidden')).toBeTruthy();
        expect(itemNameText.text()).toEqual('Document 2');

        var itemDescriptionText = attachmentItem.$el.find(
            'span.workitem-attachments-description-ro');
        expect(itemDescriptionText.length).toEqual(1);
        expect(itemDescriptionText.hasClass('binf-hidden')).toBeTruthy();
        expect(itemDescriptionText.text()).toEqual('Description of Document 2');

        var itemDescriptionInput = attachmentItem.$el.find(
            '.workitem-attachments-description-input');
        expect(itemDescriptionInput.length).toEqual(1);
        expect(itemDescriptionInput.hasClass('binf-hidden')).toBeFalsy();
        expect(itemDescriptionInput.val()).toEqual('Description of Document 2');

        var itemNameCancelBtn = attachmentItem.$el.find('.workitem-attachments-name-cancel');
        expect(itemNameCancelBtn.length).toEqual(1);
        expect(itemNameCancelBtn.hasClass('binf-hidden')).toBeFalsy();
        itemDescriptionInput.val('some test description');
        itemNameInput.val('testfile.txt');
        e = $.Event("keydown");
        e.keyCode = 13;
        e.which = 13;
        e.target = itemDescriptionInput[0];
        attachmentItem.$el.trigger(e);

        itemNameText = attachmentItem.$el.find('div.workitem-attachment-name');
        expect(itemNameText.length).toEqual(1);
        expect(itemNameText.hasClass('binf-hidden')).toBeFalsy();
        expect(itemNameText.text()).toEqual('testfile.txt');

        itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
        expect(itemNameInput.length).toEqual(1);
        expect(itemNameInput.hasClass('binf-hidden')).toBeTruthy();

        itemDescriptionText = attachmentItem.$el.find('span.workitem-attachments-description-ro');
        expect(itemDescriptionText.length).toEqual(1);
        expect(itemDescriptionText.hasClass('binf-hidden')).toBeFalsy();
        expect(itemDescriptionText.text()).toEqual('some test description');

        itemDescriptionInput = attachmentItem.$el.find('.workitem-attachments-description-input');
        expect(itemDescriptionInput.length).toEqual(1);
        expect(itemDescriptionInput.hasClass('binf-hidden')).toBeTruthy();

        itemNameCancelBtn = attachmentItem.$el.find('.workitem-attachments-name-cancel');
        expect(itemNameCancelBtn.length).toEqual(1);
        expect(itemNameCancelBtn.hasClass('binf-hidden')).toBeTruthy();
        expect(GlobalMessage.showMessage).not.toHaveBeenCalled();
      });

      it('the attachments item with edit mode event', function () {
        var item = attachmentItem.$el.find('.workitem-attachments-item');
        expect(item.length).toEqual(1);

        var itemName = attachmentItem.$el.find('a.workitem-attachments-name');
        expect(itemName.length).toEqual(1);

        var itemDescription = attachmentItem.$el.find('div.workitem-attachments-description');
        expect(itemDescription.length).toEqual(1);

        var editModeEvent = 0;
        tabable.listenTo(attachmentItem, 'editmode:item', function () {
          editModeEvent = editModeEvent + 1;
        });
        var e = $.Event("keydown");
        e.keyCode = 113;
        e.which = 113;
        e.target = attachmentItem.el;
        attachmentItem.$el.trigger(e);

        expect(editModeEvent).toEqual(1);
        expect(attachmentItem.isEditMode()).toBeTruthy();

        var itemDescriptionInput = attachmentItem.$el.find(
            '.workitem-attachments-description-input');
        e = $.Event("keydown");
        e.keyCode = 27;
        e.which = 27;
        e.target = itemDescriptionInput[0];
        attachmentItem.$el.trigger(e);

        expect(editModeEvent).toEqual(2);
        expect(attachmentItem.isEditMode()).toBeFalsy();
      });
    });

    describe('is rendering readonly', function () {
      var attachmentItem;
      var tabable;
      beforeEach(function (done) {
        var context              = BaseTestUtils.getContext(),
            attachmentFolder     = BaseTestUtils.getWorkflowAttachmentFolder(context),
            attachmentCollection = BaseTestUtils.getWorkflowAttachments(context),
            viewRendered         = false;

        attachmentCollection.fetch().done(function () {
          attachmentItem = new WorkItemAttachmentItem({
            context: context,
            model: attachmentCollection.findWhere({id: 301422})
          });
          tabable = new TabableTestView({
            view: attachmentItem
          });
          tabable.show();
          BaseTestUtils.waitUntil(function () {
            if (attachmentItem.$el.length === 1) {
              viewRendered = true;
            }
            return viewRendered;
          }, 5000).always(done);
        });
      });

      afterEach(function () {
        attachmentItem.destroy();
        tabable.destroy();
        $('body').empty();
      });

      it('the attachments item not switching to edit mode', function () {
        var item = attachmentItem.$el.find('.workitem-attachments-item');
        expect(item.length).toEqual(1);

        var itemName = attachmentItem.$el.find('a.workitem-attachments-name');
        expect(itemName.length).toEqual(1);

        var itemDescription = attachmentItem.$el.find('div.workitem-attachments-description');
        expect(itemDescription.length).toEqual(1);

        var itemDescriptionText = attachmentItem.$el.find(
            'span.workitem-attachments-description-ro');
        expect(itemDescriptionText.length).toEqual(1);
        expect(itemDescriptionText.hasClass('binf-hidden')).toBeFalsy();
        expect(itemDescriptionText.text()).toEqual('Description of Document 1');
        var e = $.Event("keydown");
        e.keyCode = 113;
        e.which = 113;
        e.target = attachmentItem.el;
        attachmentItem.$el.trigger(e);
        var itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
        expect(itemNameInput.length).toEqual(1);
        expect(itemNameInput.hasClass('binf-hidden')).toBeTruthy();

        itemDescriptionText = attachmentItem.$el.find('span.workitem-attachments-description-ro');
        expect(itemDescriptionText.length).toEqual(1);
        expect(itemDescriptionText.hasClass('binf-hidden')).toBeFalsy();
        expect(itemDescriptionText.text()).toEqual('Description of Document 1');

        var itemDescriptionInput = attachmentItem.$el.find(
            '.workitem-attachments-description-input');
        expect(itemDescriptionInput.length).toEqual(1);
        expect(itemDescriptionInput.hasClass('binf-hidden')).toBeTruthy();

        var itemNameCancelBtn = attachmentItem.$el.find('.workitem-attachments-name-cancel');
        expect(itemNameCancelBtn.length).toEqual(1);
        expect(itemNameCancelBtn.hasClass('binf-hidden')).toBeTruthy();
      });
    });

    describe('is rendering without enough permissions', function () {
      var attachmentItem;
      var tabable;
      beforeEach(function (done) {
        var context              = BaseTestUtils.getContext(),
            attachmentFolder     = BaseTestUtils.getWorkflowAttachmentFolder(context),
            attachmentCollection = BaseTestUtils.getWorkflowAttachments(context),
            viewRendered         = false,
            actions              = BaseTestUtils.getActions().allActions_301424,
            actionCollection     = new ActionCollection(actions);

        attachmentCollection.fetch().done(function () {
          attachmentItem = new WorkItemAttachmentItem({
            context: context,
            model: attachmentCollection.findWhere({id: 301424})
          });
          tabable = new TabableTestView({
            view: attachmentItem
          });
          tabable.show();
          BaseTestUtils.waitUntil(function () {
            if (attachmentItem.$el.length === 1) {
              attachmentItem.model.actions = actionCollection;
              viewRendered = true;
            }
            return viewRendered;
          }, 5000).always(done);
        });
      });

      afterEach(function () {
        attachmentItem.destroy();
        tabable.destroy();
        $('body').empty();
      });

      it('the attachments item in edit mode and save without permission',
          function (done) {

            spyOn(GlobalMessage, "showMessage");
            var item = attachmentItem.$el.find('.workitem-attachments-item');
            expect(item.length).toEqual(1);

            var itemName = attachmentItem.$el.find('a.workitem-attachments-name');
            expect(itemName.length).toEqual(1);

            var itemDescription = attachmentItem.$el.find('div.workitem-attachments-description');
            expect(itemDescription.length).toEqual(1);
            var e = $.Event("keydown");
            e.keyCode = 113;
            e.which = 113;
            e.target = attachmentItem.el;
            attachmentItem.$el.trigger(e);

            var itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
            expect(itemNameInput.length).toEqual(1);
            expect(itemNameInput.hasClass('binf-hidden')).toBeFalsy();
            expect(itemNameInput.val()).toEqual('Document 3');

            var itemNameText = attachmentItem.$el.find('div.workitem-attachment-name');
            expect(itemNameText.length).toEqual(1);
            expect(itemNameText.hasClass('binf-hidden')).toBeTruthy();
            expect(itemNameText.text()).toEqual('Document 3');

            var itemDescriptionText = attachmentItem.$el.find(
                'span.workitem-attachments-description-ro');
            expect(itemDescriptionText.length).toEqual(1);
            expect(itemDescriptionText.hasClass('binf-hidden')).toBeTruthy();
            expect(itemDescriptionText.text()).toEqual(
                'Description of Document 3, save returns an error');

            var itemDescriptionInput = attachmentItem.$el.find(
                '.workitem-attachments-description-input');
            expect(itemDescriptionInput.length).toEqual(1);
            expect(itemDescriptionInput.hasClass('binf-hidden')).toBeFalsy();
            expect(itemDescriptionInput.val()).toEqual(
                'Description of Document 3, save returns an error');

            var itemNameCancelBtn = attachmentItem.$el.find('.workitem-attachments-name-cancel');
            expect(itemNameCancelBtn.length).toEqual(1);
            expect(itemNameCancelBtn.hasClass('binf-hidden')).toBeFalsy();
            itemDescriptionInput.val('some test description');
            itemNameInput.val("testfile.txt");
            e = $.Event("keydown");
            e.keyCode = 13;
            e.which = 13;
            e.target = itemDescriptionInput[0];
            attachmentItem.$el.trigger(e);
            itemNameInput = attachmentItem.$el.find('.workitem-attachments-name-input');
            expect(itemNameInput.length).toEqual(1);
            expect(itemNameInput.hasClass('binf-hidden')).toBeTruthy();

            itemNameText = attachmentItem.$el.find('div.workitem-attachment-name');
            expect(itemNameText.length).toEqual(1);
            expect(itemNameText.hasClass('binf-hidden')).toBeFalsy();
            expect(itemNameText.text()).toEqual('testfile.txt');

            itemDescriptionText = attachmentItem.$el.find(
                'span.workitem-attachments-description-ro');
            expect(itemDescriptionText.length).toEqual(1);
            expect(itemDescriptionText.hasClass('binf-hidden')).toBeFalsy();
            expect(itemDescriptionText.text()).toEqual('some test description');

            itemDescriptionInput = attachmentItem.$el.find(
                '.workitem-attachments-description-input');
            expect(itemDescriptionInput.length).toEqual(1);
            expect(itemDescriptionInput.hasClass('binf-hidden')).toBeTruthy();

            itemNameCancelBtn = attachmentItem.$el.find('.workitem-attachments-name-cancel');
            expect(itemNameCancelBtn.length).toEqual(1);
            expect(itemNameCancelBtn.hasClass('binf-hidden')).toBeTruthy();
            var promise = BaseTestUtils.waitUntil(function () {
              var itemDescriptionText = attachmentItem.$el.find(
                  'span.workitem-attachments-description-ro');
              return (itemDescriptionText.text() ===
                      'Description of Document 3, save returns an error');
            }, 2000).done(function () {
              expect(GlobalMessage.showMessage).toHaveBeenCalled();
            }).always(done);
          });
    });
  });
});
