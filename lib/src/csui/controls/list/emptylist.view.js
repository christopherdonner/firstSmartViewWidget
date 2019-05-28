/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/controls/list/impl/emptylist',
  'i18n!csui/controls/list/impl/nls/lang',
  'css!csui/controls/list/impl/emptylist'
], function (_, $, Marionette, emptyListTemplate, lang) {


  var EmptyListView = Marionette.ItemView.extend({

    constructor: function EmptyListView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    className: 'cs-emptylist-container',

    template: emptyListTemplate,

    templateHelpers: function() {
      return {
        text: this.options.text || lang.emptyViewDefaultText
      };
    }

  });

  return EmptyListView;

});
