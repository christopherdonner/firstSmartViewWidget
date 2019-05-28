/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/node.links/node.links',
  'csui/controls/table/cells/parent/impl/parent.base.view'
], function (_, nodeLinks, ParentBaseView) {
  'use strict';

  var ParentTextView = ParentBaseView.extend({
    tagName: 'a',
    attributes: function () {
      return {
        title: this.model.get('name'),
        href: nodeLinks.getUrl(this.model)
      };
    },

    template: false,

    triggers: {
      click: 'cell:node:request',
    },

    constructor: function ParentTextView(options) {
      ParentBaseView.prototype.constructor.apply(this, arguments);
    },

    onRender: function () {
      this.el.textContent = this.model.get('name');
    }
  });

  return ParentTextView;
});
