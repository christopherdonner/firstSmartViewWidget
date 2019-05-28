/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  
  'workflow/widgets/wfstatus/wfstatus.view', 
   'i18n!workflow/widgets/wfmonitor/impl/nls/root/lang'
  
], function (WFStatusView, wfmonitorlang) {

  'use strict'; 

  var WFMonitorView = WFStatusView.extend( {

    widgetTitle : wfmonitorlang.dialogTitle,

    constructor:function WFMonitorView(options) {


      WFStatusView.prototype.constructor.call(this, options); 
      
    }

  });

  return WFMonitorView;

});
