/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require.config({
  config: {
    'csui/utils/commands': {
      extensions: {
        'workflow': [
          'workflow/commands/open.workitem/open.workitem'
        ]
      }
    }
  }
});

define([
  'csui/lib/jquery', 'workflow/testutils/base.test.utils',
  'workflow/models/workitem/workitem.model',
  'workflow/models/workitem/workitem.model.factory',
  'csui/utils/commands',
  'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model',
  'csui/models/nodes'
], function ($, BaseTestUtils,
    WorkItemModel,
    WorkItemModelFactory,
    Commands,
    ConnectorFactory,
    NodeModel,
    Nodes) {
  'use strict';

  describe('OpenWorkItemCommand', function () {

    var openWorkItemCommand,
        assignment,
        assignments,
        context;

    beforeEach(function (done) {
      BaseTestUtils.workItemMock.enable();
      context = BaseTestUtils.getContext();
      var connector = context.getObject(ConnectorFactory);
      assignment = new NodeModel({id: 1254}, {connector: connector});
      var promise = assignment.fetch();

      promise.always(function(){
        openWorkItemCommand = Commands.get('OpenWorkflowStep');
        assignments = new Nodes();
        assignments.add([assignment]);
      })
      .always(done);
    }, 5000);

    afterEach(function () {
      BaseTestUtils.workItemMock.disable({});
      $('body').empty();
    });

    it('is enabled for assignments', function () {
      expect(openWorkItemCommand.enabled({nodes: assignments}, {context: context})).toBeTruthy();
    });

    it('loads the model which automatically will change the view in smart UI', function () {
      var workItem = context.getModel(WorkItemModelFactory);
      expect(workItem.get('process_id')).toBe(0);

      openWorkItemCommand.execute({nodes: assignments}, {context: context});
      expect(workItem.get('process_id')).toBe(1);

    });

    it('redirects to classic UI', function () {
      assignments.models[0].set("workflow_open_in_smart_ui", false);
      spyOn(window, 'open').and.returnValue({focus: function focus() {}});
      openWorkItemCommand.execute({nodes: assignments}, {context: context});
      expect(window.open).toHaveBeenCalled();
      expect(window.open.calls.mostRecent().args[0]).toContain("workid=1&subworkid=1&taskid=1");
    });
  });

});
