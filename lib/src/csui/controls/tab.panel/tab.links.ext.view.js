/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.links.view',
  'hbs!csui/controls/tab.panel/impl/tab.links.ext',
  'csui/controls/tab.panel/impl/tab.link.ext.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/lib/binf/js/binf'
], function (_, TabLinkCollectionView, tabLinksTemplate, TabLinkViewExt,
    ViewEventsPropagationMixin) {
  "use strict";

  var TabLinkCollectionViewExt = TabLinkCollectionView.extend({

    template: tabLinksTemplate,
    templateHelpers: function () {
      return {
        tab_type: this.options.tabType || 'binf-nav-tabs',
        toolbar: this.options.toolbar ? true : false
      };
    },

    events: {
      'click .left-toolbar': 'onToolbarClicked',
      'click .right-toolbar': 'onToolbarClicked'
    },

    childView: TabLinkViewExt,
    childViewContainer: function () {
      return '.tab-links-bar >.' + this.tabType;
    },
    childViewOptions: function (model, index) {
      return _.extend(this.options, {});
    },

    constructor: function TabLinkCollectionViewExt(options) {
      this.options = options || {};
      TabLinkCollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'metadata:schema:updated', function (model) {
        this.children.findByModel(model).render();
      }, this);
    },

    onToolbarClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    deleteTabById: function (tabId) {
      var ret = false;
      if (tabId === undefined) {
        return ret;
      }

      var uTabId = tabId.charAt(0) === '#' ? tabId.slice(1) : tabId;
      var model = this.collection.findWhere({uniqueTabId: uTabId});
      if (model) {
        var tabLink = this.children.findByModel(model);
        if (tabLink) {
          tabLink.deleteCurrentTab();
          ret = true;
        }
      }
      return ret;
    }

  });

  _.extend(TabLinkCollectionViewExt.prototype, ViewEventsPropagationMixin);

  return TabLinkCollectionViewExt;

});
