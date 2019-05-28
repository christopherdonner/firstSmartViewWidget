/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone",
  "csui/controls/dialog/dialog.view", "csui/controls/progressblocker/blocker",
  "i18n!csui/widgets/metadata/impl/nls/lang", "css!csui/widgets/metadata/impl/metadata"
], function (_, $, Backbone, DialogView, BlockingView, lang) {

  function BaseMetadataActionView() {
  }

  _.extend(BaseMetadataActionView.prototype, Backbone.Events, {
    baseDisplayForm: function (options) {
      options || (options = {});
      this.options = options;
      this.deferred = $.Deferred();

      if (options.view) {
        BlockingView.imbue(options.view);
      }
      if (options.originatingView) {

      } else {  // show Metadata View in a modal dialog

        var dialogOptions = options.dialogOptions || {};
        var okAction = dialogOptions.OkButtonClick || this._cancelAction;
        var cancelAction = dialogOptions.CancelButtonClick || this._cancelAction;
        var buttons = [
          {
            id: 'okButton',
            default: true,
            label: dialogOptions.OkButtonTitle ? dialogOptions.OkButtonTitle :
                   lang.defaultDialogOkButtonTitle,
            click: _.bind(okAction, this, options)
          },
          {
            id: 'cancel',
            label: dialogOptions.CancelButtonTitle ? dialogOptions.CancelButtonTitle :
                   lang.defaultDialogCancelButtonTitle,
            click: _.bind(cancelAction, this),
            actionToken: dialogOptions.CancelButtonActionToken
          }
        ];
        if (this.options.view.model) {
          if (!(this.options.view.model.get('name'))) {
            buttons[0].disabled = true;
          }
        }
        var title = dialogOptions.dialogTitle ? dialogOptions.dialogTitle :
                    lang.defaultDialogTitle;
        var dialog = new DialogView({
          className: 'cs-item-action-metadata',
          title: title,
          buttons: buttons,
          largeSize: true,
          view: options.view
        });
        this.dialog = dialog;
        this.listenTo(this.dialog, "hide", this._cancelAction)
            .listenTo(this.dialog, "update:button", _.bind(function (args) {
              if (args.overlay !== undefined) {
                var buttonModel = this.dialog.footerView.collection.get('okButton'),
                    button      = this.dialog.footerView.children.findByModel(buttonModel),
                    method      = button && !button.$el.is(":disabled") && args.overlay ?
                                  'addClass' : 'removeClass';
                button.$el[method]("cs-button-overlay");
              } else {
                this.dialog.footerView.updateButton('okButton', args);
              }
            }, this));

        dialog.show();

      }

      return this.deferred.promise();
    },
    _cancelAction: function (args) {
      var resetRequiredSwitch = !!this.node && !!this.node.collection &&
                                !!this.node.collection.requireSwitched &&
                                (!!this.node.get('action') ||
                                 (!!this.options.view && this.options.view.options.action));
      if (resetRequiredSwitch) {
        this.node.collection.requireSwitched = false;
      }
      if (this.options.view) {
        this.options.view.unblockActions();
      }
      this.dialog.destroy();
      if (args === undefined) {
        args = {
          buttonAttributes: {
            actionToken: "closeMetadataActionView"
          }
        };
      }

      this.deferred.reject(args);
    }

  });

  BaseMetadataActionView.prototype.get = Backbone.Model.prototype.get;
  _.extend(BaseMetadataActionView, {version: "1.0"});

  return BaseMetadataActionView;

});
