/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'workflow/testutils/base.test.utils',
  'workflow/widgets/workitem/workitem.body/workitem.body.view',
  'workflow/widgets/action/action.body/action.body.view',
  'workflow/dialogs/action.dialog/action.dialog.model'
], function (_, $, BaseTestUtils, WorkItemBodyView, ActionBodyView, ActionDialogModel) {
  'use strict';

  describe('The ActionBodyView', function () {

    describe('is rendering', function () {
      var view;

      it('with comments enabled', function () {
        var model = new ActionDialogModel({
          requireComment: true,
          requireAssignee: false
        });
        view = new ActionBodyView({
          model: model
        });
        view.render();
        expect(view.$el.find('.workitem-action-assignee').length).toBe(0);
        expect(view.$el.find('.workitem-action-comment').length).toBe(1);
        expect(view.$el.find('.comment-label').length).toBe(1);
        expect(view.$el.find('.comment-input').length).toBe(1);
        expect(view.$el.find('.csui-acc-tab-region').length).toBe(1);
      });

      it('with assignee enabled', function () {
        var context = BaseTestUtils.getContext();
        var model = new ActionDialogModel({
          requireComment: false,
          requireAssignee: true
        });
        view = new ActionBodyView({
          model: model,
          context: context
        });
        view.render();
        expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
        expect(view.$el.find('.assignee-label').length).toBe(1);
        expect(view.$el.find('.assignee-picker').length).toBe(1);
        expect(view.$el.find('.workitem-action-comment').length).toBe(0);
        expect(view.$el.find('.csui-acc-tab-region').length).toBe(1);
      });

      it('with assignee & comment enabled', function () {
        var context = BaseTestUtils.getContext();
        var model = new ActionDialogModel({
          requireComment: true,
          requireAssignee: true
        });
        view = new ActionBodyView({
          model: model,
          context: context
        });
        view.render();
        expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
        expect(view.$el.find('.assignee-label').length).toBe(1);
        expect(view.$el.find('.assignee-picker').length).toBe(1);
        expect(view.$el.find('.workitem-action-comment').length).toBe(1);
        expect(view.$el.find('.comment-label').length).toBe(1);
        expect(view.$el.find('.comment-input').length).toBe(1);
        expect(view.$el.find('.csui-acc-tab-region').length).toBe(2);
      });
    });

    describe('changes the model', function () {

      beforeEach(function () {
        BaseTestUtils.membersMock.enable();
      });

      afterEach(function () {
        BaseTestUtils.membersMock.disable();
      });

      it('whenever the comment is changed', function () {
        var model = new ActionDialogModel({
          requireComment: true,
          requireAssignee: false
        });
        var view = new ActionBodyView({
          model: model
        });
        view.render();
        var textbox = view.$el.find('.comment-input');
        textbox.val('ensure everything is working as expected...');
        textbox.trigger($.Event("keyup"));
        expect(model.get('comment')).toBe('ensure everything is working as expected...');
      });

      it('whenever the assignee is changed', function (done) {
        var context = BaseTestUtils.getContext();
        var model = new ActionDialogModel({
          requireComment: false,
          requireAssignee: true
        });
        var view = new ActionBodyView({
          model: model,
          context: context
        });
        view.render();
        var picker = view.$el.find('.assignee-picker input');
        picker.val('Bruce Willis');
        picker.trigger($.Event("keyup"));

        var item;
        BaseTestUtils.waitUntil(function () {
          item = view.$el.find('.assignee-picker .typeahead.binf-dropdown-menu > li');
          return (item.length !== 0);
        }, 1000).always(function () {
          item.addClass('binf-active');
          item.click();
          var assignee = model.get('assignee');
          expect(assignee).toBeDefined();
          if (assignee){
            expect(assignee.get('display_name')).toBe('Bruce Willis');
          }
          done();
        });
      });
    });
  });
});
