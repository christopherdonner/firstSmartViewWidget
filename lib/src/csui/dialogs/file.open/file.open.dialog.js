/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'hbs!csui/dialogs/file.open/impl/file.open'
], function (module, _, $, Marionette, log, base, template) {
  'use strict';

  log = log(module.id);

  var FileOpenDialog = Marionette.ItemView.extend({

    className: 'csui-file-open',

    template: template,

    templateHelpers: function () {
      return {
        multiple: this.options.multiple ? 'multiple' : ''
      };
    },

    ui: {
      fileInput: 'input'
    },

    events: {
      'change @ui.fileInput': '_processFiles'
    },

    constructor: function FileOpenDialog(options) {
      this.className = _.result(this, 'className');
      var earlierElement = $(document.body).find('> .' + this.className);
      if (earlierElement.length) {
        log.debug('Removing an earlier file-open input element.')
        && console.log(log.last);
        earlierElement.remove();
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onDestroy: function(){
      this.ui.fileInput.off();
    },

    show: function () {
      log.debug('Showing a file-open input element.')
      && console.log(log.last);
      this.render();
      $(document.body).append(this.el);
      this.ui.fileInput.click();
      this.ui.fileInput.trigger('focus');
    },

    _processFiles: function (event) {
      var originalEvent = event.originalEvent,
          files = originalEvent.target.files ||
                  originalEvent.dataTransfer &&
                  originalEvent.dataTransfer.files;
      log.debug(files.length + ' file(s) selected by a file-open input element.')
      && console.log(log.last);
      this.trigger('add:files', files);
    }

  });

  return FileOpenDialog;

});
