/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/utils/node.links/node.links',
  'csui/controls/thumbnail/content/content.registry',
  'i18n!csui/controls/thumbnail/content/name/impl/nls/localized.strings',
  'hbs!csui/controls/thumbnail/content/name/impl/name',
  'css!csui/controls/thumbnail/content/name/impl/name'
], function ($, _, Backbone, Marionette, NodeTypeIconView, nodeLinks, ContentRegistry, lang,
    template) {
  'use strict';

  var NameView = Marionette.ItemView.extend({
    template: template,
    className: 'csui-thumbnail-name-container',

    templateHelpers: function () {
      var column           = this.options.column,
          node             = this.model,
          name             = node.get(column.name),
          defaultActionUrl = nodeLinks.getUrl(node);
      return {
        cid: this.model.cid,
        defaultAction: column.defaultAction,
        defaultActionUrl: defaultActionUrl,
        contextualMenu: column.contextualMenu,
        name: name,
        nameAria: _.str.sformat(lang.nameAria, name),
        nameNoOpenAria: _.str.sformat(lang.nameNoOpenAria, name),
        inactive: node.get('inactive'),
        displayIcon: this.options.displayIcon
      };
    },

    constructor: function NameView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      if (this.options.displayIcon) {
        this.listenTo(this, 'render', this._createNodeTypeIcon)
            .listenTo(this, 'before:render', this._destroyNodeTypeIcon)
            .listenTo(this, 'before:destroy', this._destroyNodeTypeIcon);
      }
    },

    _createNodeTypeIcon: function () {
      var iconView = new NodeTypeIconView({node: this.model});
      this.typeIconRegion = new Marionette.Region({el: this.$('.csui-thumbnail-overview-icon')});
      this.typeIconRegion.show(iconView);
    },

    _destroyNodeTypeIcon: function () {
      if (this.typeIconRegion) {
        this.typeIconRegion.empty();
        this.typeIconRegion = null;
      }
    },

    onRender: function () {
      var self = this;
      this.$el.find(".csui-thumbnail-default-action").on('click.' + this.cid, function (event) {
        if (!self.model.inlineFormView) {
          self.trigger('execute:defaultAction', event);
        }
      });
    }
  });
  ContentRegistry.registerByKey('name', NameView);
  return NameView;
});