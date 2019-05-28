/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(["csui/lib/underscore", "csui/utils/connector",
  "csui/integration/folderbrowser/folderbrowser.widget",
  "csui/integration/target.picker/target.picker"
], function (_, Connector, FolderBrowserWidget, TargetPicker) {

  var csui = window.csui;
  _.extend(csui, {

    version: "2.0",

    util: {
      Connector: Connector
    },

    widget: {
      FolderBrowserWidget: FolderBrowserWidget,
      TargetPickerDialogWidget: TargetPicker
    },
    Connector: Connector,
    FolderBrowserWidget: FolderBrowserWidget

  });

  return csui;

});
