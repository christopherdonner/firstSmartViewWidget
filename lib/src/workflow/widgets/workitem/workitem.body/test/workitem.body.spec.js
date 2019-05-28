/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/controls/globalmessage/globalmessage',
  'workflow/testutils/base.test.utils',
  'workflow/testutils/tabable.test.dialog/tabable.test.view',
  'workflow/widgets/workitem/workitem.body/workitem.body.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.controller'
], function (_, $, GlobalMessage, BaseTestUtils, TabableTestView, WorkItemBodyView, AttachmentExtensionController) {
  'use strict';

  describe('The WorkItemBodyView', function () {

    beforeEach(function () {
      BaseTestUtils.workItemMock.enable();
    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
    });

    describe('is rendering', function () {
      var workItemBodyView;
      var tabable;
      beforeEach(function (done) {
        var context      = BaseTestUtils.getContext(),
            workItem     = BaseTestUtils.getSimpleWorkItemModel(context), // load work item with instruction and attachments activated
            viewRendered = false;

        workItem.fetch().done(function () {
          workItemBodyView = new WorkItemBodyView({
            context: context,
            model: workItem
          });
          tabable = new TabableTestView({
            view: workItemBodyView
          });
          tabable.show();

        BaseTestUtils.waitUntil(function () {
          if (BaseTestUtils.isWorkItemFetched(workItemBodyView.model)) {
            if (BaseTestUtils.isWorkItemRendered($(workItemBodyView.$el))) {
                viewRendered = true;
            }
          }
          return viewRendered;

        }, 5000).always(done);
        });
      });

      it('the description', function () {
        var descriptionText = "Hi all,",
            instructionElement,
            instructionTextElement;
        instructionElement = $(workItemBodyView.$el).find("div.workitem-instructions")[0];
        expect(instructionElement).not.toBe(undefined);
        instructionTextElement = $(workItemBodyView.$el).find("div.workitem-instructions-text")[0];
        expect(instructionTextElement).not.toBe(undefined);
        expect(instructionTextElement.textContent).toContain(descriptionText);
      });
    });

    describe('is not rendering', function () {
      var workItemBodyView;
      var tabable;
      beforeEach(function (done) {
        var context      = BaseTestUtils.getContext(),
            workItem     = BaseTestUtils.getSimpleWorkItemModel(context, 2), // load work item with no instructions set
            viewRendered = false;

        workItem.fetch().done(function () {
          workItemBodyView = new WorkItemBodyView({
            context: context,
            model: workItem,
            extensions: [ new AttachmentExtensionController({context: context}) ]
          });
          tabable = new TabableTestView({
            view: workItemBodyView
          });
          tabable.show();

          BaseTestUtils.waitUntil(function () {
            if (BaseTestUtils.isWorkItemFetched(workItemBodyView.model)) {
              if (BaseTestUtils.isWorkItemRendered($(workItemBodyView.$el))) {
                viewRendered = true;
              }
            }
            return viewRendered;

          }, 5000).always(done);
        });
      });

      it('the description', function () {
        var instructionElement,
            instructionTextElement;
        instructionElement = $(workItemBodyView.$el).find("div.workitem-instructions")[0];
        expect(instructionElement).not.toBe(undefined);
        instructionTextElement = $(workItemBodyView.$el).find("div.workitem-instructions-text")[0];
        expect(instructionTextElement).toBe(undefined);
      });
    });

  });
});
