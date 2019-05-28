/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/signin/signin.view',
  'hbs!csui/utils/impl/signin.dialog/signin',
  'css!csui/utils/impl/signin.dialog/signin',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, SignInView, wrapperTemplate) {
  'use strict';

  function SignInDialog(options) {
    this.connection = options.connection;
  }

  _.extend(SignInDialog.prototype, {

    show: function () {
      var deferred = $.Deferred(),
          container = $.fn.binf_modal.getDefaultContainer(),
          wrapper = $(wrapperTemplate()).appendTo(container),
          region = new Marionette.Region({
            el: wrapper.find('.binf-modal-content')[0]
          }),
          view = new SignInView({
            connection: this.connection
          });
      view.on('success', function (args) {
        wrapper.binf_modal('hide');
        deferred.resolve(args);
      });
      region.show(view);
      wrapper
          .on('shown.binf.modal', function () {
            view.triggerMethod('dom:refresh');
          })
          .on('hidden.binf.modal', function () {
            view.destroy();
          })
          .binf_modal({
            backdrop: 'static',
            keyboard: false
          });
      return deferred.promise();
    }

  });

  return SignInDialog;

});
