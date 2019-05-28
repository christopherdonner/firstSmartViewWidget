/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

CKEDITOR.plugins.add("cancel", {
  lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn',

  init: function (editor) {
  
	// Get the cancel configuration from config
    var configCancel = editor.config.cancel;
    if (typeof configCancel == "undefined") {configCancel = {}}
	//adding cancel command execution function
    editor.addCommand("cancel", {
      exec: function (editor) {
        var cancelExec = configCancel.onCancel;
        if (typeof cancelExec === "function") {
          cancelExec(editor)
        } else {throw new Error("CKEditor cancel: You must define config.cancel as a function in your configuration file.")}
      }
    });
	// adding the cancel button label and command
    editor.ui.addButton("Cancel", {
      label: editor.lang.cancel.toolbar,
      command: "cancel"
    })
  }
});