/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/application.scope.factory',
  'workflow/models/workitem/workitem.model.factory',
], function (PerspectiveRouter, ApplicationScopeModelFactory,
    WorkItemModelFactory) {
  'use strict';

  var WorkflowPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'processes/:process_id/:subprocess_id/:task_id': 'openProcess',
      'draftprocesses/:draftprocess_id': 'openDraftProcess',
      'docworkflows/:doc_id/:parent_id': 'openDocumentProcess',
      'docworkflows/:doc_id/:parent_id/draftprocesses/:draftprocess_id': 'openDocumentDraftProcess'
    },

    constructor: function WorkflowPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);

      this.workItem = this.context.getModel(WorkItemModelFactory);
      this.listenTo(this.workItem, 'change:process_id', this._updateUrl);
      this.listenTo(this.workItem, 'change:doc_id', this._updateUrl);
    },
    openProcess: function (process_id, subprocess_id, task_id) {
      this.workItem.set({
        process_id: parseInt(process_id),
        subprocess_id: parseInt(subprocess_id),
        task_id: parseInt(task_id),
        isDraft: false
      });
    },
    openDraftProcess: function (draftprocess_id) {
      this.workItem.set({
        process_id: parseInt(draftprocess_id),
        isDraft: true
      });
    },
    openDocumentProcess: function (doc_id, parent_id) {

      var defaults = this.workItem.defaults;
      this.workItem.reset({silent: true});
      this.workItem.set(defaults, {silent: true});
      this.workItem.set({
        parent_id: parseInt(parent_id),
        isDoc: true,
        doc_id: doc_id
      });
    },
    openDocumentDraftProcess: function (doc_id, parent_id, draftprocess_id) {
      this.workItem.set({
        parent_id: parseInt(parent_id),
        draft_id: parseInt(draftprocess_id),
        isDocDraft: true,
        doc_id: doc_id
      });
    },

    onOtherRoute: function () {
      this.workItem.reset({silent: true});
    },
    _updateUrl: function () {
      var process_id    = this.workItem.get('process_id'),
          subprocess_id = this.workItem.get('subprocess_id'),
          task_id       = this.workItem.get('task_id'),
          isDraft       = this.workItem.get('isDraft'),
          isDocDraft    = this.workItem.get('isDocDraft'),
          isDoc         = this.workItem.get('isDoc'),
          mapsList      = this.workItem.get('mapsList'),
          doc_id        = this.workItem.get('doc_id'),
          parent_id     = this.workItem.get('parent_id'),
          draftId       = this.workItem.get('draft_id');

      if (!!process_id && !!doc_id) {
        return;
      }
      if (!(doc_id || process_id) && this.applicationScope.id !== 'workflow') {
        return;
      }

      var url = 'processes';

      if (isDraft) {
        url = 'draftprocesses';
        if (process_id) {
          url += '/' + process_id;
        }
      } else if (isDocDraft || (mapsList && mapsList.length === 1)) {
        url = 'docworkflows';
        if (doc_id && parent_id && draftId) {
          url += '/' + doc_id + '/' + parent_id + '/' + 'draftprocesses' + '/' +
                 draftId;
        }
      } else if (isDoc) {
        url = 'docworkflows';
        if (doc_id && parent_id) {
          url += '/' + doc_id + '/' + parent_id;
        }
      } else {
        url = 'processes';
        if (process_id) {
          url += '/' + process_id + '/' + subprocess_id + '/' + task_id;
        }
      }

      this.navigate(url);
    }

  });

  return WorkflowPerspectiveRouter;

});
