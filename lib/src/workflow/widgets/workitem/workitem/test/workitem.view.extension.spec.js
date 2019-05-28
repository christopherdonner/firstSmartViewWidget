/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/controls/toolbar/toolbar.view',
  'workflow/testutils/base.test.utils',
  'workflow/testutils/tabable.test.dialog/tabable.test.view',
  'workflow/widgets/workitem/workitem/workitem.view',
  'workflow/widgets/workitem/workitem/test/form.extension.controller',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.controller',
  'workflow/widgets/workitem/workitem.activities/workitem.activities.controller',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (_, Marionette, $, ToolbarView, BaseTestUtils,
    TabableTestView, WorkItemView, TestFormExtensionController, AttachmentExtensionController, WorkItemActivitiesController, attachmentsLang) {
  'use strict';

  describe('The WorkItemView with extension', function () {

    var widget,
        cancelButton,
        sendOnButton,
        approveButton,
        rejectButton,
        tabable;

    beforeEach(function (done) {
      BaseTestUtils.workItemMock.enable();

      var context  = BaseTestUtils.getContext(),
          workItem = BaseTestUtils.getSimpleWorkItemModel(context, 9),
          options  = {
            model: workItem,
            context: context,
            viewExtensions: [TestFormExtensionController, AttachmentExtensionController, WorkItemActivitiesController]
          };
      workItem.fetch().then(function () {
        widget = new WorkItemView(options);
        tabable = new TabableTestView({
          view: widget
        });
        tabable.show();
        spyOn(ToolbarView.prototype, '_handleWindowResize').and.callFake(function () {

        });
        widget.model.trigger('change', widget.model);

        BaseTestUtils.waitUntil(function () {
          var toolbar = widget.$('.workitem-attachment-toolbar-add');
          if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workitem-attachment-properties') && toolbar.length === 1) {
            sendOnButton = widget.$el.find(".binf-modal-footer .binf-btn")[0];
            approveButton = widget.$el.find(".binf-modal-footer .binf-btn")[1];
            rejectButton = widget.$el.find(".binf-modal-footer .binf-btn")[2];
            cancelButton = widget.$el.find(".binf-modal-footer .binf-btn")[3];

            return true;
          }

          return false;
        }, 5000).then(done);
      });
    });

    afterEach(function () {
      widget.destroy();
      tabable.destroy();
      $('body').empty();

      BaseTestUtils.workItemMock.disable();
    });
    it('contains the workitem-extension container', function () {
      expect(widget.$el.find(".workflow-workitem-properties .workitem-extension").length).toBe(1);
    });
    it('contains the extensiontest-view container from the controller', function () {
      expect(widget.$el.find(".workflow-workitem-properties .workitem-extension .extensiontest-view").length).toBe(1);
    });
    it('contains the extensiontest-view Text from the controller', function () {
      var expectedText = "This is the Text for ExtensionPoints Test";
      expect(widget.$el.find(".workitem-extension .extensiontest-view")[0].textContent).toBe(expectedText);
    });
    it('shows title', function () {
      expect(widget.$el.find(
          ".workitem-header .tile-title > h2")[0].textContent).toBe("<Initiator>");
    });

    it('Send On', function () {
      expect(sendOnButton.textContent).toBe("Send On");
    });

    it('shows Approve button', function () {
      expect(approveButton.textContent).toBe("Approve");
    });

    it('sends on process with task extension', function (done) {
      expect(widget.$el.find('.workitem-header .tile-title').length === 1).toBeTruthy();
      approveButton.click();
      BaseTestUtils.waitUntil(function () {
        if (document.getElementsByClassName('tile-title binf-modal-title').item(0).textContent ===
            "Approve: <Initiator>") {
          return true;
        }
      }, 2000).fail(function () {expect(true).toBeTruthy('Dialog was not opened as expected');})
          .always(done);
      expect(document.getElementsByClassName('csui-text')[0].innerText
             === "This is the executeAction Dialog.").toBeTruthy
      ("executeAction Dialog isn't displayed");
      BaseTestUtils.waitUntil(function () {
        if ($('.workitem-view').length === 0) {
          return true;
        }
      }, 2000).fail(function () {expect(false).toBeTruthy('Workitem was not sent.');})
          .always(done);
    }, 5000);

    it('shows Reject button', function () {
      expect(rejectButton.textContent).toBe("Reject");
    });

    it('shows cancel button', function () {
      expect(cancelButton.textContent).toBe("Close");
    });

    it('has key accessibility "Move down" for Attachments', function (done) {
      var selected,
          selectRendered = false;

      widget.$el.appendTo(document.body);

      var attachments = widget.$el.find('.workitem-attachments-name');
      var attachment = attachments[0];
      var e = $.Event("keydown");
      e.keyCode = 40;
      e.which = 40;
      $(attachment).trigger(e);

      BaseTestUtils.waitUntil(function () {
        if (($(attachment).filter('[tabindex=0]')).length === 0) {
          selectRendered = true
        }
        if (selectRendered) {
          selected = $(attachment).filter('[tabindex=0]');
          expect(selected.length).toEqual(0, 'for the first Attachment tabindex is not set to -1');
          selected = $(attachments[1]).filter('[tabindex=0]');
          expect(selected.length).toEqual(1, 'for the second Attachment tabindex is not set to 0');
          return true
        }
      }, 2000).fail(function () {expect(false).toBeTruthy('tabindex was not moved in time');})
          .always(done);
    });

    it('has key accessibility "Move up" for Attachments', function (done) {
      var selected,
          selectRendered = false;

      var attachments = widget.$el.find('.workitem-attachments-name');
      var attachment = attachments[1];
      var e = $.Event("keydown");
      e.keyCode = 38;
      e.which = 38;
      $(attachment).trigger(e);

      BaseTestUtils.waitUntil(function () {
        if (($(attachment).filter('[tabindex=0]')).length === 0) {
          selectRendered = true
        }
        if (selectRendered) {
          selected = $(attachment).filter('[tabindex=0]');
          expect(selected.length).toEqual(0,
              'for the second Attachment the tabindex is not set to -1');
          selected = $(attachments[0]).filter('[tabindex=0]');
          expect(selected.length).toEqual(1, 'for the first Attachment tabindex is not set to 0');
          return true
        }
      }, 2000).fail(function () {expect(false).toBeTruthy('tabindex was not moved in time');})
          .always(done);
    });
  });

});
