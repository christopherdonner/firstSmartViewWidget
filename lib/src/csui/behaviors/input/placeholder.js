/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette'
], function (_, Backbone, Marionette) {
  "use strict";

  var PlaceholderBehavior = Marionette.Behavior.extend({

    events: {
      'keydown @ui.inputField': 'onKeyDown',
      'keyup @ui.inputField': 'onKeyUp',
      'focus @ui.inputField': 'onFocus'
    },

    initialize: function(options, view) {
      this.isEmpty = true;
    },

    onKeyDown: function() {
      var fldVal = this.view.ui.inputField.val();
      var placeholderText = this.view.ui.inputField.attr('placeholder');

      if (this.isEmpty === true && fldVal === placeholderText) {
        this.view.ui.inputField.val('');
      }
    },

    onKeyUp: function() {
      var fldVal = this.view.ui.inputField.val();
      var placeholderText = this.view.ui.inputField.attr('placeholder');

      if (fldVal.length === 0 || fldVal === placeholderText) {
        this.isEmpty = true;
        this.view.ui.inputField.val(placeholderText);
        this.view.ui.inputField[0].setSelectionRange(0, 0);
      }
      else {
        this.isEmpty = false;
      }
    },

    onFocus: function() {
      var placeholderText = this.view.ui.inputField.attr('placeholder');

      if (this.view.ui.inputField.val().length === 0) {
        this.isEmpty = true;
        this.view.ui.inputField.val(placeholderText);
        this.view.ui.inputField[0].setSelectionRange(0, 0);
      }
    }

  });

  return PlaceholderBehavior;

});
