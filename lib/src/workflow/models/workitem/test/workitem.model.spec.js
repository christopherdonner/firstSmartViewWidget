/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'workflow/testutils/base.test.utils'
], function (_, BaseTestUtils) {
  'use strict';

  describe('The WorkItemModel', function () {

    var context;

    beforeEach(function () {
      context = BaseTestUtils.getContext();
      BaseTestUtils.workItemMock.enable();
    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
    });

    it('has members set', function () {
      var workItem = BaseTestUtils.getSimpleWorkItemModel(context);
      expect(workItem.get('title')).toBe('');
      expect(workItem.get('process_id')).toBe(1);
      expect(workItem.get('subprocess_id')).toBe(1);
      expect(workItem.get('task_id')).toBe(1);
    });

    it('sets the title after fetching the data', function (done) {
      var workItem = BaseTestUtils.getSimpleWorkItemModel(context),
          promise = workItem.fetch();

      BaseTestUtils.waitUntil(function () {
        return workItem.title().length > 0;
      }, 5000).always(function () {
        expect(workItem.title()).toBe('<Initiator>');
        done();
      });
    });

    it('is reset', function () {
      var workItem = BaseTestUtils.getSimpleWorkItemModelWithMaxDispositions(context, 1);
      expect(workItem.get('title')).toBe('');
      expect(workItem.get('process_id')).toBe(1);
      expect(workItem.get('subprocess_id')).toBe(1);
      expect(workItem.get('task_id')).toBe(1);
      expect(workItem.actions.length).toBe(1);
      expect(workItem.customActions.length).toBe(5);
      expect(workItem.forms.length).toBe(0);

      workItem.reset({silent:true});

      expect(workItem.get('title')).toBeUndefined();
      expect(workItem.get('process_id')).toBeUndefined();
      expect(workItem.get('subprocess_id')).toBeUndefined();
      expect(workItem.get('task_id')).toBeUndefined();
      expect(workItem.actions.length).toBe(0);
      expect(workItem.customActions.length).toBe(0);
      expect(workItem.forms.length).toBe(0);
    });

    describe('fires an action event', function(){

      var workItemSendOnCalled = false;
      var successCalled = false;
      var errorCalled = false;

      beforeEach(function (done) {
        var workItem = BaseTestUtils.getSimpleWorkItemModel(context),
            promise  = workItem.fetch();

        BaseTestUtils.waitUntil(function () {
          return workItem.title().length > 0;
        }, 5000).always(function () {

          workItem.sendAction(workItem.actions.get('standard-SendOn'))
              .done(function () {
              successCalled = true;
              done();
            })
              .fail(function (response) {
              errorCalled = true;
              done();
            });
        });
      });

      it('for a valid workitem', function (done) {
        expect(workItemSendOnCalled).toBe(false);
        expect(successCalled).toBe(true);
        expect(errorCalled).toBe(false);
        done();
      });
    });

    describe('fires an action event', function(){

      var workItemSendOnCalled = false;
      var successCalled = false;
      var errorCalled = false;

      beforeEach(function (done) {
        var workItem = BaseTestUtils.getSimpleWorkItemModel(context),
            promise  = workItem.fetch();

        var spy = jasmine.createSpy();

        BaseTestUtils.waitUntil(function () {
          return workItem.title().length > 0;
        }, 5000).always(function () {
          workItem.set('task_id', 100);

          workItem.sendAction(workItem.actions.get('standard-SendOn'))
              .done(function () {
              successCalled = true;
              done();
            })
              .fail(function (response) {
              errorCalled = true;
              done();
            });
        });
      });

      it('for an invalid workitem', function (done) {
        expect(workItemSendOnCalled).toBe(false);
        expect(successCalled).toBe(false);
        expect(errorCalled).toBe(true);
        done();
      });
    });

    describe('triggers custom event', function(){

      var workItemSendOnCalled = false;
      var successCalled = false;
      var errorCalled = false;

      beforeEach(function (done) {
        var workItem = BaseTestUtils.getSimpleWorkItemModel(context),
            promise  = workItem.fetch();

        var spy = jasmine.createSpy();

        BaseTestUtils.waitUntil(function () {
          return workItem.title().length > 0;
        }, 5000).always(function () {

          workItem.listenTo(workItem, "workitem:sendon", function () {
            workItemSendOnCalled = true;
            done();
          });

          workItem.sendAction(workItem.actions.get('standard-SendOn'))
              .done(function () {
              successCalled = true;
            })
              .fail(function (response) {
              errorCalled = true;
            });
        });
      });

      it('workitem:sendon is fired', function (done) {
        expect(workItemSendOnCalled).toBe(true);
        expect(successCalled).toBe(true);
        expect(errorCalled).toBe(false);
        done();
      });
    });
  });

});
