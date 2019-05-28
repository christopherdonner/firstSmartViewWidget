/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/log',
  'csui/lib/marionette'
], function (module, _, $,
    log,
    Marionette) {
  'use strict';

  var RetainFocusBehavior = Marionette.Behavior.extend({

        ui: {
          control: '.csui-control'
        },

        events: {
          'mousedown @ui.control': '_startActive',
          'focusout @ui.control': '_stopActive',
          'keydown @ui.control': '_stopActive'
        },

        constructor: function RetainFocusBehavior(options, view) {
          Marionette.Behavior.prototype.constructor.apply(this, arguments);

          this._isFocused = false;

          this.listenTo(view, 'before:render', function () {
            this._isRendering = true;
            if (view.isRendered) {
              var controlEl = this.ui.control[0];
              this._isFocused = document.activeElement === controlEl;
            }
          });

          this.listenTo(view, 'render', function () {
            this._isRendering = false;
          });

          this.listenTo(view, 'dom:refresh', function () {
            this._reApplyFocus();
          });

        },

        _reApplyFocus: function () {
          if (this._isActive) {
            this.ui.control.addClass('csui-control-active');
          } else {
            this.ui.control.removeClass('csui-control-active');
          }
          if (this._isFocused) {
            this.ui.control.focus();
          }
        },

        _startActive: function () {
          this._isActive = true;
          this.ui.control.addClass('csui-control-active');
        },

        _stopActive: function () {
          if (!this._isRendering) {
            this.ui.control.removeClass('csui-control-active');
            this._isActive = false;
          }
        }

      },
      {
      }
  );

  return RetainFocusBehavior;
});
