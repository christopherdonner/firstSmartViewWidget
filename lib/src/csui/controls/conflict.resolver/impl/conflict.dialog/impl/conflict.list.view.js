/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/base', 'csui/controls/list/simplelist.view',
  'csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.item/conflict.item.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/conflict.resolver/impl/conflict.dialog/impl/conflict.list.navigation',
], function (_, $, base, SimpleListView, ConflictItemView,
    TabableRegionBehavior, KeyNavigation) {

  var ConflictListView = SimpleListView.extend({

    childView: ConflictItemView,

    childEvents: {
      'resolved': 'trackResolved',
      'item:focus': 'setItemFocus'
    },

    events: {
      'keydown': 'onKeyInView',
      'mouseenter': 'clearTabFocus'
    },
    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function ConflictListView(options) {
      options || (options = {});
      SimpleListView.prototype.constructor.apply(this, arguments);
      this.multiList = options.numConflicts > 1;
      this.removeItemList = [];
      this.listenToOnce(this, 'mouseenter', this.onUpdateScroll);
      this._onSetContaintListHeight = _.bind(this._setContainerListHeight, this);
      $(window).bind("resize.app", this._onSetContaintListHeight);
    },

    childViewOptions: function () {
      return {
        multiConflicts: this.multiList,
        connector: this.options.connector,
        parentId: this.options.parentId,
        removeItemList: this.options.removeItemList
      };
    },

    onDomRefresh: function () {
      this._setContainerListHeight();
    },
    onUpdateScroll: function () {
      this.triggerMethod('update:scrollbar', this);
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this._onSetContaintListHeight);
    },

    trackResolved: function () {
      var resolved = arguments[1];
      this.options.trackResolved(resolved);
    },
    _setContainerListHeight: function () {
      var winHeight = ($(window).height() * 0.9 - 100 - 60 - 130) + 'px'; // 10% top margin - 30px for bottom margin - 130 for header/foooter
      this.$el.find('.cs-content').css('max-height', winHeight);
    },

    _getActiveIndex: function(tabItems) {
      var lastIndex = tabItems.length - 1;
      for (var i = 0; i <= lastIndex; i++) {
        if ($(tabItems[i]).hasClass(TabableRegionBehavior.accessibilityActiveElementClass)) {
          return i;
    }
      }
    }
  });

  _.extend(ConflictListView.prototype, KeyNavigation);
  return ConflictListView;

});
