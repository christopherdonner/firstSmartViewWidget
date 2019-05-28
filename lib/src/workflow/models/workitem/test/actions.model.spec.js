/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'workflow/testutils/base.test.utils'
], function (_, BaseTestUtils) {
  'use strict';

  describe('The ActionsModel', function () {

    var context;

    beforeEach(function () {
      context = BaseTestUtils.getContext();
      BaseTestUtils.workItemMock.enable();
    });

    afterEach(function () {
      BaseTestUtils.workItemMock.disable();
    });

    it('has members set', function () {
      var workItem = BaseTestUtils.getSimpleWorkItemModelWithAction(context);
      expect(workItem.get('title')).toBe('');
      expect(workItem.get('process_id')).toBe(1);
      expect(workItem.get('subprocess_id')).toBe(1);
      expect(workItem.get('task_id')).toBe(1);
      expect(workItem.actions.length).toBe(1);
      expect(workItem.actions.get('standard-SendOn').get('label')).toBe('SendOnLabel');
      expect(workItem.actions.get('standard-SendOn').get('key')).toBe('SendOn');
      expect(workItem.customActions.length).toBe(0);
    });

  });

});
