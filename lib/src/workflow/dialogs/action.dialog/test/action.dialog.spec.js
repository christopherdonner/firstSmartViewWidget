/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/jquery',
  'workflow/testutils/base.test.utils',
  'workflow/dialogs/action.dialog/action.dialog',
  'workflow/dialogs/action.dialog/action.dialog.model'
], function (_, Marionette, $, BaseTestUtils, ActionDialog, ActionDialogModel) {
  'use strict';

  describe('The ActionDialogModel', function () {

    it('has valid defaults', function () {
      var model = new ActionDialogModel();
      expect(model.get('title')).toBeUndefined();
      expect(model.get('action')).toBeUndefined();
      expect(model.get('requireComment')).toBeFalsy();
      expect(model.get('comment')).toBeUndefined();
      expect(model.get('requireAssignee')).toBeFalsy();
      expect(model.get('readonlyAssignee')).toBeFalsy();
      expect(model.get('assigneeOptions')).toBeFalsy();
      expect(model.get('assignee')).toBeUndefined();
      expect(model.get('texts')).toBeDefined();
    });

    it('initializes correctly', function () {
      var model = new ActionDialogModel({
        title: 'Forward: Delegate to User',
        requireComment: true,
        requireAssignee: true
      });
      expect(model.get('title')).toBe('Forward: Delegate to User');
      expect(model.get('requireComment')).toBeTruthy();
      expect(model.get('comment')).toBeUndefined();
      expect(model.get('requireAssignee')).toBeTruthy();
      expect(model.get('assignee')).toBeUndefined();
      expect(model.get('action')).toBeUndefined();
    });
  });

  describe('The ActionDialog', function () {

    describe('is rendering for \'Send-On\' action', function () {

      var view;
      var context;
      var action;

      beforeEach(function () {
        context = BaseTestUtils.getContext();
        action = BaseTestUtils.getWorkItemModel(context).actions.get('standard-SendOn');
      });

      afterEach(function () {
        view.destroy();
        $('body').empty();
      });

      it('with defaults', function () {
        var model = new ActionDialogModel({
          title: 'This is a nice title...',
          action: action,
          requireComment: true
        });
        view = new ActionDialog({
          context: context,
          model: model
        });
        view.render();
        expect(view.$el.find('.binf-modal-title').text()).toBe('This is a nice title...');
        expect(view.$el.find('.workitem-action-assignee').length).toBe(0);
        expect(view.$el.find('.workitem-action-comment').length).toBe(1);
        var cancelButton = view.$el.find('.binf-btn.binf-btn-default');
        var submitButton = view.$el.find('.binf-btn.binf-btn-primary');
        expect(cancelButton.length).toBe(1);
        expect(submitButton.length).toBe(1);
        expect(submitButton[0].title).toBe('Submit');
        expect($(submitButton[0]).is(':enabled')).toBeTruthy();
        expect(cancelButton[0].title).toBe('Cancel');
        expect($(cancelButton[0]).is(':enabled')).toBeTruthy();
      });

      it('with fallback title', function () {
        var model = new ActionDialogModel({
          action: action,
          requireComment: true
        });
        view = new ActionDialog({
          context: context,
          model: model
        });
        view.render();
        expect(view.$el.find('.binf-modal-title').text()).toBe('Send On: Workflow step');
      });

      it('and closes with the \'Submit\' button', function (done) {
        var model = new ActionDialogModel({
          title: 'This is a nice title...',
          action: action,
          requireComment: true
        });
        view = new ActionDialog({
          context: context,
          model: model
        });
        view.render();
        view.$el.find('.binf-btn.binf-btn-default')[0].click();
        BaseTestUtils.waitUntil(function () {
          return $('.modal-body').length === 0;
        }, 1000).fail(function () {
          expect(false).toBeTruthy('Dialog was not hidden in time');
        }).always(done);
      });

      it('and closes with the \'Cancel\' button', function (done) {
        var model = new ActionDialogModel({
          title: 'This is a nice title...',
          action: action,
          requireComment: true
        });
        view = new ActionDialog({
          context: context,
          model: model
        });
        view.render();
        view.$el.find('.binf-btn.binf-btn-default')[0].click();
        BaseTestUtils.waitUntil(function () {
          return $('.modal-body').length === 0;
        }, 1000).fail(function () {
          expect(false).toBeTruthy('Dialog was not hidden in time');
        }).always(done);
      });
    });

    describe('is rendering for \'Forward\' action', function () {

      var view;
      var context;
      var props;
      var action;

      beforeEach(function () {
        BaseTestUtils.membersMock.enable();
        context = BaseTestUtils.getContext();
        props = {
          id: 'standard-Delegate',
          key: 'Delegate',
          label: 'Forward'
        };
        action = BaseTestUtils.getWorkItemModel(context, undefined, props).actions.get(
            'standard-Delegate');
      });

      afterEach(function () {
        BaseTestUtils.membersMock.disable();
        view.destroy();
        $('body').empty();
      });

      it('with defaults', function () {
        var model = new ActionDialogModel({
          title: 'This is a nice title...',
          action: action,
          requireComment: true,
          requireAssignee: true
        });
        view = new ActionDialog({
          context: context,
          model: model
        });
        view.render();
        expect(view.$el.find('.binf-modal-title').text()).toBe('This is a nice title...');
        expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
        expect(view.$el.find('.workitem-action-comment').length).toBe(1);
        var cancelButton = view.$el.find('.binf-btn.binf-btn-default');
        var submitButton = view.$el.find('.binf-btn.binf-btn-primary');
        expect(cancelButton.length).toBe(1);
        expect(submitButton.length).toBe(1);
        expect(submitButton[0].title).toBe('Submit');
        expect($(submitButton[0]).is(':enabled')).toBeFalsy("submitButton");
        expect(cancelButton[0].title).toBe('Cancel');
        expect($(cancelButton[0]).is(':enabled')).toBeTruthy("cancelButton");
        expect(view.$el.find('.workitem-action-assignee .assignee-label').text().trim()).toEqual(
            'Forward to');
        expect(view.$el.find('.assignee-picker input').attr('placeholder')).toEqual(
            'Enter user name');
        expect(view.$el.find('.comment-label').text().trim()).toEqual('Add comments');
        expect(view.$el.find('.comment-input').attr('placeholder')).toEqual('Add message');
      });

      it('with changing submit button state depending on assignee selection', function (done) {
        var model = new ActionDialogModel({
          title: 'This is a nice title...',
          action: action,
          requireComment: true,
          requireAssignee: true
        });
        view = new ActionDialog({
          context: context,
          model: model
        });
        view.render();
        var buttons = view.$el.find('.binf-btn.binf-btn-primary');
        expect(buttons[0].title).toBe('Submit');
        expect($(buttons[0]).is(':enabled')).toBeFalsy();
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
          buttons = view.$el.find('.binf-btn.binf-btn-primary');
          expect(buttons[0].title).toBe('Submit');
          expect($(buttons[0]).is(':enabled')).toBeTruthy("button enabled");
          picker.val('');
          picker.trigger($.Event('change'));
          buttons = view.$el.find('.binf-btn.binf-btn-primary');
          expect(buttons[0].title).toBe('Submit');
          expect($(buttons[0]).is(':enabled')).toBeFalsy();
          done();
        });
      });
    });

    describe('is rendering for \'Send for Review\' action', function () {

      var view;
      var context;
      var props;
      var action;

      beforeEach(function () {
        BaseTestUtils.membersMock.enable();
        context = BaseTestUtils.getContext();
        props = {
          id: 'standard-SendForReview',
          key: 'SendForReview',
          label: 'Send for review'
        };
        action = BaseTestUtils.getWorkItemModel(context, undefined, props).actions.get(
            'standard-SendForReview');
      });

      afterEach(function () {
        BaseTestUtils.membersMock.disable();
        view.destroy();
        $('body').empty();
      });

      it('with defaults', function () {
        var model = new ActionDialogModel({
          title: 'This is a nice title...',
          action: action,
          requireComment: true,
          requireAssignee: true,
          assigneeOptions: true,
          texts: {
            assigneeLabel: 'Send to',
            commentLabel: 'Instructions',
            commentPlaceholder: 'Add instructions',
            submitLabel: 'Send'
          }
        });
        view = new ActionDialog({
          context: context,
          model: model
        });
        view.render();
        expect(view.$el.find('.binf-modal-title').text()).toBe('This is a nice title...');
        expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
        expect(view.$el.find('.workitem-action-assignee-options .assignee-label').length).toBe(1);
        expect(view.$el.find('.workitem-action-assignee-options .assignee-label').is(
            ':visible')).toBeFalsy();
        expect(view.$el.find('.workitem-action-assignee-options .assignee-options').length).toBe(1);
        expect(view.$el.find('.workitem-action-assignee-options .assignee-options').is(
            ':visible')).toBeFalsy();
        expect(view.$el.find('.workitem-action-comment').length).toBe(1);
        var cancelButton = view.$el.find('.binf-modal-footer  .binf-btn.binf-btn-default');
        var submitButton = view.$el.find('.binf-modal-footer  .binf-btn.binf-btn-primary');
        expect(cancelButton.length).toBe(1);
        expect(submitButton.length).toBe(1);
        expect(submitButton[0].title).toBe('Send');
        expect($(submitButton[0]).is(':enabled')).toBeFalsy();
        expect(cancelButton[0].title).toBe('Cancel');
        expect($(cancelButton[0]).is(':enabled')).toBeTruthy();
        expect(view.$el.find('.workitem-action-assignee .assignee-label').text().trim()).toEqual(
            'Send to');
        expect(view.$el.find('.assignee-picker input').attr('placeholder')).toEqual(
            'Enter user name');
        expect(view.$el.find('.comment-label').text().trim()).toEqual('Instructions');
        expect(view.$el.find('.comment-input').attr('placeholder')).toEqual('Add instructions');
      });

      it('with changing submit button and assignee option state depending on assignee selection' +
          ' (user)',
          function (done) {
            var model = new ActionDialogModel({
              title: 'This is a nice title...',
              action: action,
              requireComment: true,
              requireAssignee: true,
              assigneeOptions: true,
              texts: {
                assigneeLabel: 'Send to',
                commentLabel: 'Instructions',
                commentPlaceholder: 'Add instructions',
                submitLabel: 'Send'
              }
            });
            view = new ActionDialog({
              context: context,
              model: model
            });
            view.render();
            var buttons = view.$el.find('.binf-modal-footer .binf-btn.binf-btn-primary');
            expect(buttons[0].title).toBe('Send');
            expect($(buttons[0]).is(':enabled')).toBeFalsy();
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
              expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-label').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-label').is(
                  ':visible')).toBeFalsy();
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-options').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-options').is(
                  ':visible')).toBeFalsy();
              buttons = view.$el.find('.binf-modal-footer .binf-btn.binf-btn-primary');
              expect(buttons[0].title).toBe('Send');
              expect($(buttons[0]).is(':enabled')).toBeTruthy("expect submit button to be enabled");
              picker.val('');
              picker.trigger($.Event('change'));
              expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-label').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-label').hasClass(
                  'binf-hidden')).toBeTruthy("expect userpicker disabled label");
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-options').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-options').hasClass(
                  'binf-hidden')).toBeTruthy("expect userpicker disabled options");
              buttons = view.$el.find('.binf-modal-footer .binf-btn.binf-btn-primary');
              expect(buttons[0].title).toBe('Send');
              expect($(buttons[0]).is(':enabled')).toBeFalsy();
              expect(view.$el.find('.workitem-action-assignee .assignee-label')
                  .text().trim()).toEqual('Send to');
              expect(view.$el.find('.assignee-picker input').attr('placeholder'))
                  .toEqual('Enter user name');
              expect(view.$el.find('.comment-label').text().trim()).toEqual('Instructions');
              expect(view.$el.find('.comment-input').attr('placeholder')).toEqual(
                  'Add instructions');
              done();
            });
          });

      it('with changing submit button and assignee option state depending on assignee selection' +
          ' (group)',
          function (done) {
            var model = new ActionDialogModel({
              title: 'This is a nice title...',
              action: action,
              requireComment: true,
              requireAssignee: true,
              assigneeOptions: true,
              texts: {
                assigneeLabel: 'Send to',
                commentLabel: 'Instructions',
                commentPlaceholder: 'Add instructions',
                submitLabel: 'Send'
              }
            });
            view = new ActionDialog({
              context: context,
              model: model
            });
            view.render();
            var buttons = view.$el.find('.binf-modal-footer .binf-btn.binf-btn-primary');
            expect(buttons[0].title).toBe('Send');
            expect($(buttons[0]).is(':enabled')).toBeFalsy();
            var picker = view.$el.find('.assignee-picker input');
            picker.val('Super Heroes');
            picker.trigger($.Event("keyup"));

            var item;
            BaseTestUtils.waitUntil(function () {
              item = view.$el.find('.assignee-picker .typeahead.binf-dropdown-menu > li');
              return (item.length !== 0);
            }, 1000).always(function () {
              item.click();
              expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-label').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-label').hasClass(
                  'binf-hidden')).toBeFalsy();
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-options').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-options').hasClass(
                  'binf-hidden')).toBeFalsy();
              buttons = view.$el.find('.binf-modal-footer .binf-btn.binf-btn-primary');
              expect(buttons[0].title).toBe('Send');
              expect($(buttons[0]).is(':enabled')).toBeTruthy();
              picker.val('');
              picker.trigger($.Event('change'));
              expect(view.$el.find('.workitem-action-assignee').length).toBe(1);
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-label').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-label').hasClass(
                  'binf-hidden')).toBeTruthy();
              expect(
                  view.$el.find('.workitem-action-assignee-options .assignee-options').length).toBe(
                  1);
              expect(view.$el.find('.workitem-action-assignee-options .assignee-options').hasClass(
                  'binf-hidden')).toBeTruthy();
              buttons = view.$el.find('.binf-modal-footer .binf-btn.binf-btn-primary');
              expect(buttons[0].title).toBe('Send');
              expect($(buttons[0]).is(':enabled')).toBeFalsy();
              expect(view.$el.find('.workitem-action-assignee .assignee-label')
                  .text().trim()).toEqual('Send to');
              expect(view.$el.find('.assignee-picker input').attr('placeholder'))
                  .toEqual('Enter user name');
              expect(view.$el.find('.comment-label').text().trim()).toEqual('Instructions');
              expect(view.$el.find('.comment-input').attr('placeholder')).toEqual(
                  'Add instructions');
              done();
            });
          });
    });
  });
});
