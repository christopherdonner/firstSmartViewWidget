/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/utils/contexts/factories/node',
  'csui/controls/tab.panel/tab.panel.view',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin'
], function (_, $, Backbone, Marionette, log, NodeModelFactory, TabPanelView,
    TabLinkCollectionViewExt, TabLinksScrollMixin) {
  'use strict';
  var WorkItemTabPanelView = TabPanelView.extend({

    contentView: function (model) {
      return model.get('viewToRender');
    },

    contentViewOptions: function (model) {
      return model.get('viewToRenderOptions');
    },

    constructor: function WorkItemTabPanelView(options) {
      _.defaults(options, {
        tabType: 'binf-nav-pills',
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
      });
      TabPanelView.prototype.constructor.apply(this, arguments);

    },

    render: function () {
      TabPanelView.prototype.render.apply(this);

      this._initializeToolbars();
      this._listenToTabEvent();
      setTimeout(_.bind(this._enableToolbarState, this), 500);
      return this;
    }
  });
  _.extend(WorkItemTabPanelView.prototype, TabLinksScrollMixin);
  return WorkItemTabPanelView;
});

