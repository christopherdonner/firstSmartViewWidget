/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/controls/tab.panel/impl/tab.link.dropdown',
  'csui/lib/binf/js/binf'
], function (_, TabLinkView, itemTemplate) {
  "use strict";

  var TabLinkDropDownView = TabLinkView.extend({

    template: itemTemplate,

    attributes: function () {
      var title = this.model.get('title');
      return {
        id: 'tablink-' + this.model.get('uniqueTabId'),
        role: 'menuitem',
        'aria-label': title,
        title: title
      };
    },

    constructor: function TabLinkDropDownView() {
      TabLinkView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'change', this.render);

      this.$el.bind('click', '>a', _.bind(this._linkClicked, this));
    },

    onBeforeDestroy: function () {
      this.$el.unbind('click', '>a');
    },

    activate: function () {
      if (!this.$el.hasClass("binf-active")) {
        this.triggerMethod('clear:active:tab');
        this.ui.link.binf_tab('show');
      }
      var index = this.model.collection.indexOf(this.model);
      this._parent.options.activeTab && this._parent.options.activeTab.set('tabIndex', index);
      this.triggerMethod('activate:tab', this);
      this.triggerMethod('click:link');
    },

    _linkClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.activate();
    }

  });

  return TabLinkDropDownView;

});
