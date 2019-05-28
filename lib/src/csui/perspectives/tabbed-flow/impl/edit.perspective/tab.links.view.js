/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/tab.panel/tab.links.ext.view',
  'hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links',
  'csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'i18n!csui/perspectives/tabbed-flow/impl/nls/lang',
  'csui/lib/binf/js/binf',
  'css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links'
], function (_, TabLinkCollectionView, tabLinksTemplate, TabLinkViewExt,
    ViewEventsPropagationMixin, lang) {

  var EditPerspectiveTabLinks = TabLinkCollectionView.extend({
    template: tabLinksTemplate,

    childView: TabLinkViewExt,

    childViewContainer: function () {
      return '.' + this.tabType;
    },

    ui: {
      'addNewTab': '.csui-pman-add-newtab'
    },

    events: {
      'click @ui.addNewTab': '_onAddNewTab'
    },

    childViewOptions: function (model, index) {
      return _.extend(this.options, {});
    },

    childEvents: {
      'remove:tab': '_onRemoveTab',
      'enable:addTab': 'enableAddTab',
      'disable:addTab': 'disableAddTab'
    },

    constructor: function EditPerspectiveTabLinks() {
      TabLinkCollectionView.prototype.constructor.apply(this, arguments);
    },

    _onRemoveTab: function (tabView) {
      var isDeletingActive = tabView.isActive(),
          tabIndex         = this.collection.indexOf(tabView.model);
      this.collection.remove(tabView.model);
      if (!isDeletingActive) {
        return;
      }
      if (tabIndex >= this.collection.length) {
        tabIndex = this.collection.length - 1;
      }
      if (tabIndex < 0) {
        return;
      }
      var tabToActivate = this.collection.at(tabIndex);
      this.children.findByModel(tabToActivate).activate();
    },

    _onAddNewTab: function () {
      if (this.ui.addNewTab.hasClass("csui-pman-disable-newtab")) {
        return;
      }
      var newTab = {
        title: ""
      };
      this.options.tabPanel.collection.add(newTab);
    },

    enableAddTab: function () {
      this.ui.addNewTab.removeClass("csui-pman-disable-newtab");
    },

    disableAddTab: function () {
      this.ui.addNewTab.addClass("csui-pman-disable-newtab");
    }
  });
  return EditPerspectiveTabLinks;
});