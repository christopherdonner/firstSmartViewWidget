// Renders a view in a modal dialog and waits for the user to close it
csui.define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/dialog/dialog.view',
  'csui/utils/log'
], function (module, _, $, DialogView, log) {

  log = log(module.id);

  var UserDialogView = DialogView.extend({

    templateHelpers: _.extend(function () {
      var userid = "user" + this.options.view.options.userid;
      return {
        binfDialogSizeClassName: (!!this.options.largeSize ? 'binf-modal-lg ' :
                                  (!!this.options.midSize ? 'binf-modal-md ' : ' ')) + userid
      };
    }),

    onRender: function () {
      // FIXME: Do not use className for additional classes; it overrides the prototype
      this.$el
          .addClass(UserDialogView.prototype.className.call(this))
          .attr('tabindex', 0);
      this._renderHeader();

      if (this.options.view) {
        this.body.show(this.options.view);
        this.options.view.triggerMethod('dom:refresh');
        this.options.view.triggerMethod('after:show');
      }

      this._renderFooter();
    }

  });

  return UserDialogView;

});