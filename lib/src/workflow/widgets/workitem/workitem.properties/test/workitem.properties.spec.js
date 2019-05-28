/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'workflow/testutils/base.test.utils',
  'workflow/widgets/workitem/workitem.properties/workitem.properties.view'
], function (_, $, BaseTestUtils, WorkItemPropertiesView) {
  'use strict';

  describe('The WorkItemPropertiesView', function () {

    beforeEach(function () {
      BaseTestUtils.workItemMock.enable();
      BaseTestUtils.membersMock.enable({
        id: 1002,
        type: 0,
        name: 'bwillis',
        business_email: 'bwillis@elink.loc',
        office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
        title: 'New York Police Officer (Retired)',
        display_name: 'Bruce Willis',
        name_formatted: 'Bruce Willis',
        group_id: 101
      });
    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
      BaseTestUtils.membersMock.disable();
    });

    describe('is rendering', function () {
      var workItemPropertiesView;
      beforeEach(function (done) {
        var context      = BaseTestUtils.getContext(),
            workItem     = BaseTestUtils.getSimpleWorkItemModel(context, 7),
            viewRendered = false,
            modelLoaded  = false;
        var promise = workItem.fetch();

        promise.always(function () {
          workItemPropertiesView = new WorkItemPropertiesView({
            context: context,
            model: workItem
          });
          workItemPropertiesView.render();

          BaseTestUtils.waitUntil(function () {
            if (BaseTestUtils.isWorkItemFetched(workItemPropertiesView.model)) {
              if (BaseTestUtils.isWorkItemRendered($(workItemPropertiesView.$el),
                      '.workitem-instructions')) {
                viewRendered = true;
              }
            }
            return viewRendered;

          }, 5000).always(done);
        });
      });

      it('the instructions', function () {
        var instructionText = "Hi all,",
            instructionElement;
        instructionElement = $(workItemPropertiesView.$el).find(".workitem-instructions-text");
        expect(instructionElement.length).toBe(1);
        expect(instructionElement[0].textContent).toContain(instructionText);
      });

      it('the forward message', function () {
        var message = workItemPropertiesView.$el.find('.workflow-message');
        expect(message.length).toBe(1);
        var subject = workItemPropertiesView.$el.find('.message-subject');
        expect(subject.find('.subject-pre').text().trim()).toEqual('Message from');
        expect(subject.find('.subject-sender').text().trim()).toEqual('Bruce Willis');
        expect(subject.find('.subject-post').text().trim())
            .toEqual('who forwarded the workflow step to a new approver.');
        var body = workItemPropertiesView.$el.find(".message-body");
        expect(body.text().trim()).toEqual('Please work on this task!');
      });
    });

    describe('is not rendering', function () {
      var workItemPropertiesView;
      beforeEach(function (done) {
        var context      = BaseTestUtils.getContext(),
            workItem     = BaseTestUtils.getSimpleWorkItemModel(context, 2),
            viewRendered = false,
            modelLoaded  = false;

        var promise = workItem.fetch();

        promise.always(function () {
          workItemPropertiesView = new WorkItemPropertiesView({
            context: context,
            model: workItem
          });

          workItemPropertiesView.render();

          BaseTestUtils.waitUntil(function () {
            if (BaseTestUtils.isWorkItemFetched(workItemPropertiesView.model)) {
              if (BaseTestUtils.isWorkItemRendered($(workItemPropertiesView.$el),
                      '.workitem-instructions')) {
                viewRendered = true;
              }
            }
            return viewRendered;

          }, 5000).always(done);
        });
      });

      it('the instructions', function () {
        var instructionElement;
        instructionElement = $(workItemPropertiesView.$el).find(".workitem-instructions-text");
        expect(instructionElement.length).toBe(0);
      });

      it('the forward message', function () {
        var message = workItemPropertiesView.$el.find('.workflow-message');
        expect(message.length).toBe(0);
      });
    });

    describe('is not rendering', function () {
      var workItemPropertiesView;
      beforeEach(function (done) {
        var context      = BaseTestUtils.getContext(),
            workItem     = BaseTestUtils.getSimpleWorkItemModel(context, 4),
            viewRendered = false;

        var promise = workItem.fetch();

        promise.always(function () {
          workItemPropertiesView = new WorkItemPropertiesView({
            context: context,
            model: workItem
          });

          workItemPropertiesView.render();
        });

        BaseTestUtils.waitUntil(function () {
          if (BaseTestUtils.isWorkItemFetched(workItemPropertiesView.model)) {
            if (BaseTestUtils.isWorkItemRendered($(workItemPropertiesView.$el),
                    '.workitem-forms')) {
              viewRendered = true;
            }
          }
          return viewRendered;

        }, 5000).always(done);
      });

      it('the form section is not rendering', function () {
        var formElement;
        formElement = $(workItemPropertiesView.$el).find(".cs-form");
        expect(formElement.length).toBe(0);
      });

    });

    describe('is rendering', function () {
      var workItemPropertiesView;
      beforeEach(function (done) {
        var context      = BaseTestUtils.getContext(),
            workItem     = BaseTestUtils.getSimpleWorkItemModel(context, 3),
            viewRendered = false;

        var promise = workItem.fetch();

        promise.always(function () {
          workItemPropertiesView = new WorkItemPropertiesView({
            context: context,
            model: workItem
          });

          workItemPropertiesView.render();
          BaseTestUtils.waitUntil(function () {
            if (BaseTestUtils.isWorkItemFetched(workItemPropertiesView.model)) {
              if (BaseTestUtils.isWorkItemRendered($(workItemPropertiesView.$el),
                      '.workitem-forms') &&
                  workItemPropertiesView.$el.find('.alpaca-container-item').length > 0) {
                viewRendered = true;
              }
            }
            return viewRendered;

          }, 5000).always(done);
        });
      });

      it('the form section is rendering', function () {
        var formElement, leftCloumn, rightColumn, firstFormEle, SecondFormEle;
        formElement = $(workItemPropertiesView.$el).find(".cs-form");
        expect(formElement.length).toBe(2);
        firstFormEle = $(formElement[0]).find(".cs-form-doublecolumn");
        expect(firstFormEle.length).toBe(2);
        leftCloumn = $(formElement[0]).find(".cs-form-leftcolumn");
        expect(leftCloumn.length).toBe(1);
        rightColumn = $(formElement[0]).find(".cs-form-rightcolumn");
        expect(rightColumn.length).toBe(1);
        SecondFormEle = $(formElement[1]).find(".cs-form-doublecolumn");
        expect(SecondFormEle.length).toBe(1);
      });

      it('the form field in edit mode and save', function () {
        workItemPropertiesView.$el.appendTo(document.body);
        workItemPropertiesView.trigger("dom:refresh");

        var textField, formElement, inputEle, e;
        formElement = $(workItemPropertiesView.$el).find(".cs-form").not('.alpaca-hidden');
        textField = $(formElement[0]).find('.alpaca-field-text');
        expect(textField.hasClass("alpaca-required")).toBeTruthy();
        inputEle = $(textField[1]).find(
            "input[id = " + textField[1].getAttribute("data-alpaca-field-id") + "]");
        $(textField[1]).find(".icon-edit").click();
        inputEle.val("some edited text");
        e = $.Event("keydown");
        e.keyCode = 113;
        e.which = 113;
        inputEle.trigger(e);
        expect($(textField[1]).find(".cs-field-write").hasClass("binf-hidden")).toBeTruthy();
        expect(inputEle.val()).toEqual('some edited text');
      });

      it('the form field in edit mode and Esc', function () {
        workItemPropertiesView.$el.appendTo(document.body);
        workItemPropertiesView.trigger("dom:refresh");

        var textField, formElement, inputEle, e;
        formElement = $(workItemPropertiesView.$el).find(".cs-form").not('.alpaca-hidden');
        textField = $(formElement[0]).find('.alpaca-field-text');
        expect(textField.hasClass("alpaca-required")).toBeTruthy();
        inputEle = $(textField[1]).find(
            "input[id = " + textField[1].getAttribute("data-alpaca-field-id") + "]");
        $(textField[1]).find(".icon-edit").click();
        inputEle.val("some edited text");
        e = $.Event("keydown");
        e.keyCode = 27;
        e.which = 27;
        inputEle.trigger(e);
        expect($(textField[1]).find(".cs-field-write").hasClass("binf-hidden")).toBeTruthy();
        expect(inputEle.val()).toEqual('Form field 1 data');
      });
    });

  });
});

