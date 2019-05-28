/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette',
  'hbs!./config.command.template', 'css!./config.command.view'
], function ($, Marionette, template) {
  'use strict';

  var ConfigCommandView = Marionette.ItemView.extend({

    className: 'config-command-view',

    template: template,

    ui: {
      bodyFormContainer: '.body-form-wrapper'
    },

    events: {
      'click .save-and-go-back': 'onClickSaveAndGoBack',
      'click .save-and-close': 'onClickSaveAndClose',
      'click .small-size-btn': 'onClickSmallSizeButton',
      'click .medium-size-btn': 'onClickMediumSizeButton',
      'click .large-size-btn': 'onClickLargeSizeButton'
    },

    constructor: function ConfigCommandView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onClickSaveAndGoBack: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.trigger('go:back');
    },

    onClickSaveAndClose: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.trigger('close:menu');
    },

    onClickSmallSizeButton: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.ui.bodyFormContainer.addClass('small').removeClass('medium').removeClass('large');
      this.trigger('dom:refresh');
    },

    onClickMediumSizeButton: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.ui.bodyFormContainer.removeClass('small').addClass('medium').removeClass('large');
      this.trigger('dom:refresh');
    },

    onClickLargeSizeButton: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.ui.bodyFormContainer.removeClass('small').removeClass('medium').addClass('large');
      this.trigger('dom:refresh');
    }

  });

  return ConfigCommandView;

});
