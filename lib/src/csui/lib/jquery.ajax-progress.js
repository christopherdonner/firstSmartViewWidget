/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([ "module", "csui/lib/underscore", "csui/lib/jquery"
], function (module, _, $) {

  //is onprogress supported by browser?
  var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

  //If not supported, do nothing
  if (!hasOnProgress) {
    return;
  }

  //patch ajax settings to call a progress callback
  var oldXHR = $.ajaxSettings.xhr;
  $.ajaxSettings.xhr = function () {
    var xhr = oldXHR();
    if (xhr instanceof window.XMLHttpRequest) {
      xhr.addEventListener('progress', this.progress, false);
    }

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', this.progress, false);
    }

    return xhr;
  };

  return $;

});
