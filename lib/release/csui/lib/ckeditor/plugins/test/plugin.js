CKEDITOR.plugins.add('test', {
  icons: 'test',
  init: function(editor) {
    editor.addCommand('test', {
      exec: function(editor) {debugger;
        editor.config.csLink.openNodePicker().done(
            function(args) {
              var node = args.nodes[0], name = editor.getSelection()
                  .getSelectedText(); // check for selection
              if (!name) {
                name = node.get('name');
              }
              editor.insertHtml('<a href="' + editor.config.csLink.urlBase
                  + '/open/' + node.get('id') + '">'
                  + CKEDITOR.tools.htmlEncode(name) + '</a>');
            }).fail(function(args) {
        });
      }
    });
    editor.ui.addButton('test', {
      icon: this.path + "icons/cslink.png",
      label: 'test',
      command: 'test'
    });
  }
});