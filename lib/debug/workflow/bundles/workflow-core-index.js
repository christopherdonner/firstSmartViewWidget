csui.require.config({
  bundles: {
'workflow/bundles/workflow-core': [
  'workflow/models/workitem/workitem.model.factory',
  'workflow/commands/defaultactionitems',
  'workflow/commands/initiate.workflow/initiate.workflow',
  'workflow/commands/initiate.document.workflow/initiate.document.workflow',
  'workflow/commands/open.workitem/open.workitem',
  'workflow/perspective/routers/workflow.perspective.router'
]
  }
});