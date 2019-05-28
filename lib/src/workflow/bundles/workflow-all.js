/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define([
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
  'i18n!workflow/widgets/wfstatus/impl/nls/wfstatus.manifest',
  'i18n!workflow/widgets/wfmonitor/impl/nls/wfmonitor.manifest'
], {});

require(['require', 'css'], function (require, css) {
  'use strict';

  css.styleLoad(require, 'workflow/bundles/workflow-all', true);

});
