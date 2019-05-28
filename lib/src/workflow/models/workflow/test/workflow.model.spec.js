/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'workflow/testutils/base.test.utils',
  'workflow/models/workflow/test/workflow.mock',
  'workflow/models/workflow/workflow.model'
], function (_, BaseTestUtils, WorkflowMock, WorkflowModel) {
  'use strict';

  var workflowMock = WorkflowMock;

  describe('The WorkflowModel', function () {

    var context;

    beforeEach(function () {
      context = BaseTestUtils.getContext();
      workflowMock.enable();
    });

    afterEach(function () {
      workflowMock.disable();
    });

    describe('fires an action event', function(){

      var draftProcessId;
      var successCalled = false;
      var errorCalled = false;

      beforeEach(function (done) {
        var workflow = new WorkflowModel({
          workflow_id: 4711
        }, _.extend({
          connector: BaseTestUtils.getConnector(context)
        }));

        workflow.createDraftProcess()
            .done(function (resp) {
              draftProcessId = resp.draftprocess_id;
              successCalled = true;
              done();
            })
            .fail(function (resp) {
              errorCalled = false;
              done();
            })
      });

      it('for a valid workitem', function (done) {
        expect(draftProcessId).toBe(4711);
        expect(successCalled).toBe(true);
        expect(errorCalled).toBe(false);
        done();
      });

    });

  });

});

