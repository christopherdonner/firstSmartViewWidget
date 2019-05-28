/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/thumbnail/content/content.registry',
  'csui/controls/thumbnail/content/node.state/node.state.icons',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'hbs!csui/controls/thumbnail/content/node.state/impl/node.state',
  'i18n!csui/controls/thumbnail/content/node.state/impl/nls/localized.strings'
], function ($, _, Backbone, Marionette, ContentRegistry, nodeStateIcons,
    FieldsV2Mixin, template, lang) {
  'use strict';

  var NodeStateCollectionView = Marionette.CollectionView.extend({
    tagName: 'ul',

    attributes: {
      'aria-label': lang.stateListAria
    },

    getChildView: function (iconModel) {
      return iconModel.get('iconView');
    },

    childViewOptions: function (iconModel) {
      return _.extend({
        context: this.options.context,
        model: this.options.node,
        originatingView: this.options.originatingView,
        targetView: this.options.targetView
      }, iconModel.get('iconViewOptions'));
    }
  });

  var ThumbnailNodeStateView = Marionette.LayoutView.extend({
    template: template,
    className: 'csui-thumbnail-nodestate-container',

    regions: {
      nodeStateRegion: '.csui-thumbnail-nodestate'
    },

    constructor: function ThumbnailNodeStateView(options) {
      options || (options = {});
      this.options = options;
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },
    onRender: function () {
      var enabledStateIcons = this._getEnabledNodeStateIcons(),
          message           = enabledStateIcons.length ?
                              lang.someStateIconsAria : lang.noStateIconsAria,
          title             = this.options.displayTitle ? lang.nodeStateTitle_thumbnail : "";
      this.el.setAttribute('aria-label', message);
      this.el.setAttribute('title', title);
      if (enabledStateIcons.length) {
        var iconsView = new NodeStateCollectionView({
          context: this.options.context,
          node: this.model,
          originatingView: this.options.originatingView,
          targetView: this.options.targetView,
          collection: enabledStateIcons
        });
        this.nodeStateRegion.show(iconsView);
        if (this.options.displayTitle) {
          iconsView.$el.find("button").attr("tabindex", "-1");
        }
      }
    },

    _getEnabledNodeStateIcons: function () {

      var nodeStateIconsPrototype;
      var enabledNodeStateIcons;

      nodeStateIconsPrototype = Object.getPrototypeOf(nodeStateIcons);
      enabledNodeStateIcons = new nodeStateIconsPrototype.constructor(
          nodeStateIcons.filter(function (iconModel) {
            var IconView = iconModel.get('iconView');
            return IconView && (!IconView.enabled || IconView.enabled({
                  context: this.options.context,
                  node: this.model
                }));
          }, this));

      return enabledNodeStateIcons;
    }
  });
  ContentRegistry.registerByKey('reserved', ThumbnailNodeStateView);
  return ThumbnailNodeStateView;
});