/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/application.scope.factory',
  'workflow/models/workitem/workitem.model.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin'
], function (_, Backbone, ApplicationScopeModelFactory,
    WorkItemModelFactory, PerspectiveContextPlugin) {
  'use strict';

  var WorkflowPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function WorkflowPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.workItem = this.context
          .getModel(WorkItemModelFactory, {
            permanent: true
          })
          .on('change:process_id', this._fetchWorkflowPerspective, this)
          .on('change:doc_id', this._fetchWorkflowPerspective, this);
    },
    _fetchWorkflowPerspective: function () {
      var processId = this.workItem.get('process_id'),
          docId     = this.workItem.get('doc_id');
      if (!!processId && !!docId) {
        return;
      }
      if (!(processId || docId ) && this.applicationScope.id !== 'workflow') {
        return;
      }
      if (this.loadingPerspective) {
        return;
      }
      this.applicationScope.set('id', 'workflow');
      var perspectivePath   = 'json!workflow/perspective/context/plugins/impl/perspectives/',
          perspectiveModule = 'workflow.json';
      this.context.loadPerspective(perspectivePath + perspectiveModule);
    }

  });

  return WorkflowPerspectiveContextPlugin;

});