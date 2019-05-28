/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'i18n!csui/controls/form/impl/fields/arraybuttonsfield/nls/lang',
  'hbs!csui/controls/form/impl/fields/arraybuttonsfield/arraybuttonsfield',
  'css!csui/controls/form/impl/fields/arraybuttonsfield/arraybuttonsfield'
], function (_, $, Backbone, Marionette, lang, template) {
  "use strict";

  var ArrayButtonsFieldView = Marionette.ItemView.extend({

    constructor: function ArrayButtonsFieldView(options) {
      Marionette.ItemView.apply(this, arguments);
    },

    className: 'cs-formfield cs-arraybuttonsfield',

    template: template,

    templateHelpers: function () {
      return {
        title: lang.title
      };
    },

    ui: {
      addButton: '.addbtn',
      removeButton: '.removebtn'
    },

    events: {
      'click @ui.addButton': 'onAddButtonClicked',
      'click @ui.removeButton': 'onRemoveButtonClicked'
    },

    onAddButtonClicked: function () {
    },

    onRemoveButtonClicked: function () {
      this.$el.closest('.cs-pull-left').parent().find('.cs-pull-right .circle_delete').parent().click();
      return;
    }

  });

  return ArrayButtonsFieldView;

});
