/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/listitem/listitemstandard.view',
  'hbs!csui/controls/listitem/impl/listitemstateful',
  'css!csui/controls/listitem/impl/listitemstateful'
], function (_, $, Marionette, StandardListItem, itemTemplate) {

  var StatefulListItem = StandardListItem.extend({

    className: 'SLI binf-list-group-item',

    template: itemTemplate,

    constructor: function StatefulListItem() {
      StandardListItem.apply(this, arguments);
    }

  });

  return StatefulListItem;

});

