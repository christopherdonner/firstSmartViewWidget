/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/behaviors/collection.state/collection.state.view',
  'hbs!csui/controls/list/impl/emptylist',
  'css!csui/controls/list/impl/emptylist'
], function (CollectionStateView, emptyListTemplate) {
  'use strict';

  var ListStateView = CollectionStateView.extend({

    constructor: function ListStateView() {
      CollectionStateView.prototype.constructor.apply(this, arguments);
    },

    className: 'cs-emptylist-container ' + CollectionStateView.prototype.className,

    template: emptyListTemplate,

    serializeData: function () {
      var data = CollectionStateView.prototype.serializeData.apply(this, arguments);
      return {
        text: data.message
      };
    }

  });

  return ListStateView;

});
