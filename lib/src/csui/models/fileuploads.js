/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/utils/log",
  "csui/models/fileupload"
], function (module, _, $, Backbone, log, FileUploadModel) {

  var FileUploadCollection = Backbone.Collection.extend({

    model: FileUploadModel,

    constructor: function FileUploadCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    state: function () {
      var failed = false,
          processing = false,
          processed = this.all(function (fileUpload) {
            var state = fileUpload.get("state"),
                rejected = state == "rejected";
            failed = failed || rejected;
            processing = processing || state == "processing";
            return rejected || state == "resolved";
          });
      return processed ?
             failed ? "rejected" : "resolved" :
             processing ? "processing" : "pending";
    }

  });

  FileUploadCollection.version = '1.0';

  return FileUploadCollection;

});
