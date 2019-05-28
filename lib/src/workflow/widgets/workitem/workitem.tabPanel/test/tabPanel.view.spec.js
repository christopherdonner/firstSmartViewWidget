/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/globalmessage/globalmessage',
  'workflow/testutils/base.test.utils',
  'workflow/testutils/tabable.test.dialog/tabable.test.view',
  'workflow/widgets/workitem/workitem/workitem.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.controller',
  'workflow/widgets/workitem/workitem.activities/workitem.activities.controller',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (_, Marionette, $, ToolbarView, GlobalMessage, BaseTestUtils,
    TabableTestView, WorkItemView, AttachmentExtensionController, WorkItemActivitiesController,
    attachmentsLang) {
  'use strict';

  describe('The TabPanelView', function () {

    beforeEach(function () {
      BaseTestUtils.workItemMock.enable();

    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
    });

    describe('contains no Attachment package', function () {

      var widget,
          tabable;

      beforeEach(function (done) {
        BaseTestUtils.workItemMock.enable();

        var context  = BaseTestUtils.getContext(),
            workItem = BaseTestUtils.getSimpleWorkItemModel(context, 4), // load work item with no package activated
            options  = {
              model: workItem,
              context: context,
              viewExtensions: [AttachmentExtensionController, WorkItemActivitiesController]
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
            if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workflow-activities-container')) {
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
      });

      it('and is not loaded', function () {
        var attachmentsElement;
        attachmentsElement = widget.$el.find(".workitem-attachment-properties");
        expect(attachmentsElement.length).toBe(0);
      });

    });

    describe('contains Attachment package with Error', function () {

      var widget,
          tabable;

      beforeEach(function (done) {
        BaseTestUtils.workItemMock.enable();

        var context  = BaseTestUtils.getContext(),
            workItem = BaseTestUtils.getSimpleWorkItemModel(context, 6), // due to invalid
            options  = {
              model: workItem,
              context: context,
              viewExtensions: [AttachmentExtensionController, WorkItemActivitiesController]
            };
        spyOn(GlobalMessage, "showMessage");

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
            if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workflow-activities-container')) {
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
      });

      it('and shows Global Error Message', function () {
        var attachmentsElement;
        attachmentsElement = widget.$el.find(".workitem-attachment-properties");
        expect(attachmentsElement.length).toBe(0);
        expect(GlobalMessage.showMessage).toHaveBeenCalled();//With('error', 'Workflow attachments could not be loaded.');

      });

    });

    describe('is rendering ', function () {

      var widget,
          tabable;

      beforeEach(function (done) {
        BaseTestUtils.workItemMock.enable();

        var context  = BaseTestUtils.getContext(),
            workItem = BaseTestUtils.getSimpleWorkItemModel(context, 1),
            options  = {model: workItem, context: context, viewExtensions: [AttachmentExtensionController, WorkItemActivitiesController]};

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
            var elems = widget.$(':tabbable');
            var toolbar = widget.$('.workitem-attachment-toolbar-add');
            if (BaseTestUtils.isWorkItemRendered(widget.$el, '.workitem-attachment-properties'))  {
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
      });

      it('tabpanel', function () {
        expect(widget.$el.find("div[role='tabpanel']").length).toBe(3);
        expect(widget.$el.find("li[role='tab']").length).toBe(2);
        expect(widget.$el.find("ul[role='tablist']").length).toBe(1);
        expect(widget.$el.find("a[title='Attachments']").length).toBe(1);
        expect(widget.$el.find("a[title='Activities']").length).toBe(1);
        var attachmentsTab =widget.$el.find("a[title='Attachments']").parent();
        expect(attachmentsTab.filter(".binf-active").length).toBe(1);
      });

      it('attachments', function () {
        expect(widget.$el.find(".workitem-attachment-properties").length).toBeGreaterThan(0);
        expect(widget.$el.find(".workitem-attachment-toolbar").length).toBeGreaterThan(0);
        expect(widget.$el.find(".workitem-attachment-list").length).toBeGreaterThan(0);
        expect(widget.$el.find(".workitem-attachment-properties").length).toBeGreaterThan(0);


      });

      it('activities', function () {
        expect(widget.$el.find(".workflow-activities-container").length).toBeGreaterThan(0);

      });


    });

  });
});
