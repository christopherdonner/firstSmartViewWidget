csui.require.config({
  bundles: {
'workflow/bundles/workflow-core': [
  'workflow/models/workitem/workitem.model.factory',
  'workflow/commands/defaultactionitems',
  'workflow/commands/initiate.workflow/initiate.workflow',
  'workflow/commands/initiate.document.workflow/initiate.document.workflow',
  'workflow/commands/open.workitem/open.workitem',
  'workflow/perspective/routers/workflow.perspective.router'
],
'workflow/bundles/workflow-all': [
  'workflow/toolbars/workflow.nodestable.toolbaritems',
  'workflow/widgets/workitem/workitem/workitem.view',
  'workflow/widgets/wfstatus/wfstatus.view',
  'workflow/widgets/wfmonitor/wfmonitor.view',
  'workflow/controls/table/cells/status.cell',
  'workflow/controls/table/cells/date.cell',
  'workflow/controls/table/cells/assignee.cell',
  'workflow/perspective/context/plugins/workflow.perspective.context.plugin',
  'json!workflow/perspective/context/plugins/impl/perspectives/workflow.json',
  'workflow/utils/workitem.extension.controller',
  'json!workflow/widgets/wfstatus/wfstatus.manifest.json',
  'json!workflow/widgets/wfmonitor/wfmonitor.manifest.json',
  'workflow/widgets/wfstatus/impl/nls/wfstatus.manifest',
  'workflow/widgets/wfmonitor/impl/nls/wfmonitor.manifest'
]
  }
});