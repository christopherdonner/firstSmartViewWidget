/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/utils/messagehelper',
  'csui/controls/globalmessage/impl/progresspanel/progresspanel.view',
  'csui/controls/globalmessage/impl/messagedialog.view',
  'csui/controls/globalmessage/globalmessage'
], function (_, $, Marionette, Base, MessageHelper, ProgressPanel, MessageView, GlobalMessage) {

  var functions = {
    testShowMessageSimple: function(info) {
      GlobalMessage.showMessage(info,"This is a test "+info+" message.");
    },

    testShowMessageDetailed: function(info) {
      this.messageNo = this.messageNo ? this.messageNo+1 : 1;
      GlobalMessage.showMessage(info,"This is a test "+info+" message. "+this.messageNo,
          "Nam libero tempore, cum soluta nobis      est eligendi optio cumque nihil impedit " +
          "quo minus id quod maxime placeat facere      possimus, omnis voluptas assumenda est, " +
          "omnis dolor repellendus." + " These are the test "+info+" details.");
    },

    testShowFileUploadProgress: function() {
      if (!this.fileUploadCollection) {
        var FileUploadCollection = require('csui/models/fileuploads');
        this.fileUploadCollection = new FileUploadCollection([{
          state: "resolved",
          count: 2097152,
          file: {
            name: "Comparison-Safety-Classic.pdf",
            type: "application/pdf",
            size: 2097152
          }}]);
        GlobalMessage.showFileUploadProgress(this.fileUploadCollection);
      } else {
        GlobalMessage.showFileUploadProgress();
      }
    }

  };

  var btnStyle = "position: fixed; left: 4px; z-index: 10; font-size: 0.7em; padding: 3px 6px;";
  var btnFormat = '<button class="binf-btn" style="{0} top: {1}px;">{2}</button>';
  var showPButton = $(_.str.sformat(btnFormat,btnStyle,68,"showP")).appendTo(document.body);
  var hidePButton = $(_.str.sformat(btnFormat,btnStyle,98,"hideP")).appendTo(document.body);
  var showMButton = $(_.str.sformat(btnFormat,btnStyle,128,"showM")).appendTo(document.body);

  showPButton.on("click", function() {
    functions.testShowFileUploadProgress();
  });

  hidePButton.on("click", function() {
    GlobalMessage.hideFileUploadProgress();
  });

  showMButton.on("click", function() {
    functions.testShowMessageDetailed("warning");
  });

  var View = Marionette.ItemView.extend({});

  return View;
});
