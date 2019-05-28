/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

CKEDITOR.plugins.add('cslink', {
  icons: 'cslink',
  init: function (editor) {
    editor.addCommand('cslink', {
      exec: function (editor) {
        var range = editor.getSelection().getRanges()[0];
        !!editor.config.csLink && !!editor.config.csLink.nodePicker &&
        editor.config.csLink.nodePicker().show().done(
            function (args) {
              var node = args.nodes[0],
                  url  = !!editor.config.csLink.getUrl &&
                         typeof(editor.config.csLink.getUrl) === "function" ?
                         editor.config.csLink.getUrl(node) :
                         editor.config.csLink.nodeLink.getUrl(args.nodes[0]),
                  anchor;
                 if(typeof editor.config.csLink.enableSaveButton === "function") {
                  editor.config.csLink.enableSaveButton();
                 }
              if (range.collapsed) { //no selection done
                range.insertNode(new CKEDITOR.dom.text(node.get('name'), editor.document));
              }
              if (range.startContainer.type !== CKEDITOR.NODE_TEXT) {
                range.startContainer.$.setAttribute('data-cke-saved-href', url);
              } else if (range.startContainer.getParent().$.href) {
                range.startContainer.getParent().$.setAttribute('data-cke-saved-href', url);
              }
              anchor = new CKEDITOR.style({
                element: "a",
                attributes: {
                  "data-cke-saved-href": url,
                  "href": url
                }
              });
              anchor.type = CKEDITOR.STYLE_INLINE;
              anchor.applyToRange(range, editor);
              range.select();
            }).fail(function (args) {
          //set the focus back to within editor upon cancel.
          editor.focus();
          //TODO handle fail case
        });
      }
    });
    editor.ui.addButton('cslink', {
      icon: this.path + "icons/format_cs_link16.svg",
      label: editor.config.csLink.lang.insertContentServerLink,
      command: 'cslink'
    });
  }
});
