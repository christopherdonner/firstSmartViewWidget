/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/controls/conflict.resolver/impl/collection.conflicts/collection.conflicts',
  'hbs!csui/controls/conflict.resolver/impl/collection.conflicts/collection.conflict.item',
  'csui/controls/node-type.icon/node-type.icon.view',
  'i18n!csui/controls/conflict.resolver/impl/nls/lang',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'css!csui/controls/conflict.resolver/impl/collection.conflicts/conflicts.dialog'
], function (_, $, Marionette, template, conflictItemTemplate, NodeTypeIconView, lang,
    PerfectScrollingBehavior) {
  'use strict';

  var CollectionConflictItemView = Marionette.ItemView.extend({
    tagName: 'li',
    template: conflictItemTemplate,
    className: "csui-conflict-item",

    templateHelpers: function () {
      var data = {
        conflictsItemsName: this.model.get('name')
      };
      return data;
    },

    constructor: function CollectionConflictItemView(options) {
      options || (options = {});

      Marionette.ItemView.prototype.constructor.call(this, options);

    },

    onRender: function () {
      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model.node
      });
      this._nodeIconView.render();
    }

  });

  var CollectionConflictsView = Marionette.CompositeView.extend({
    template: template,
    className: 'csui-conflicts-items-data',

    childView: CollectionConflictItemView,
    childViewContainer: '#csui-collection-conflict-items',

    ui: {
      conflictItems: '#csui-collection-conflict-items'
    },

    templateHelpers: function () {
      var data = {
        conflictsItemsTitle: lang.conflictsItemsHeader
      };
      return data;
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: 'ul.csui-collection-conflict-items',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    constructor: function CollectionConflictsView(options) {
      options || (options = {});
      this.collection = options.collection || {};
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this._onSetContaintListHeight = _.bind(this._setContainerListHeight, this);
      $(window).bind("resize.app", this._onSetContaintListHeight);
    },

    onDomRefresh: function () {
      this._setContainerListHeight();
    },

    _setContainerListHeight: function () {
      var winHeight = ($(window).height() * 0.9 - 100 - 60 - 112) + 'px'; // 10% top margin -
      $('.csui-collection-conflict-items').css('max-height', winHeight);
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this._onSetContaintListHeight);
    },

  });

  return CollectionConflictsView;

});
