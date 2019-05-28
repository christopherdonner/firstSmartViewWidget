/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/node.links/node.links',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/table/cells/parent/impl/parent.base.view',
  'hbs!csui/controls/table/cells/parent/impl/parent.with.icon',
  'css!csui/controls/table/cells/parent/impl/parent.with.icon'
], function (_, nodeLinks, NodeTypeIconView, ParentBaseView, template) {
  'use strict';

  var ParentIconView = ParentBaseView.extend({
    template: template,
    className: 'csui-parent-location',

    triggers: {
      'click a.csui-parent-name': 'cell:node:request',
      'click .cs-icon-group': 'cell:node:request'
    },

    templateHelpers: function () {
      var name = this.model.get('name');
      var defaultActionUrl = nodeLinks.getUrl(this.model);
      return {
        name: name,
        defaultActionUrl: defaultActionUrl
      };
    },

    constructor: function ParentIconView(options) {
      ParentBaseView.prototype.constructor.apply(this, arguments);

      this.iconView = new NodeTypeIconView({node: this.model});
    },

    onRender: function () {
      this.iconView.render();
      this.$el.prepend(this.iconView.$el);
    }
  });

  return ParentIconView;
});
