/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/controls/error/impl/error',
  'css!csui/controls/error/impl/error'
], function ($, Marionette, template) {
  'use strict';

  var ErrorView = Marionette.ItemView.extend({

    className: function () {
      var className = 'csui-error content-tile';
      if (this.options.low) {
        className += ' csui-low';
      }
      return className;
    },

    template: template,

    modelEvents: {
      change: 'render'
    },

    ui: {
      messageArea: '.csui-message'
    },

    events: {
      "mouseenter": 'showPopover',
      "mouseleave": 'hidePopover'
    },

    constructor: function ErrorView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onShow: function () {
      if (this.options.model.get('title')) {
        var that = this;
        this.$el.closest('.csui-disabled').removeClass('csui-disabled');
        this.ui.messageArea.binf_popover({
          content: this.options.model.get('title'),
          html: true,
          placement: function () {
            var popOverSource = that.ui.messageArea,
                maxWidth      = popOverSource.width(),
                maxHeight     = popOverSource.height(),
                offset        = popOverSource.offset(),
                window_left   = offset.left,
                window_top    = offset.top,
                window_right  = (($(window).width()) - (window_left + popOverSource.outerWidth(true))),
                window_bottom = (($(window).height()) - (window_top + popOverSource.outerHeight(true)));
            if (window_right > maxWidth) {
              return "right";
            } else if (window_left > maxWidth) {
              return "left";
            } else if (window_bottom > maxHeight) {
              return "bottom";
            } else {
              return "top";
            }
          }
        });
      }
    },

    showPopover: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.messageArea.binf_popover('show');
    },

    hidePopover: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.messageArea.binf_popover('hide');
    }

  });

  return ErrorView;

});
