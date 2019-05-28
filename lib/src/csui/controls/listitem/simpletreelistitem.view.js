/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/list/emptylist.view',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/node.links/node.links', 'csui/behaviors/default.action/default.action.behavior',
  'hbs!csui/controls/listitem/impl/simpletreelistitem',
  'hbs!csui/controls/listitem/impl/simpletreelistleaf',
  'i18n!csui/controls/listitem/impl/nls/lang',
  'css!csui/controls/listitem/impl/simpletreelistitem'
], function (require, _, $, Backbone, Marionette, base, EmptyListView, NodeTypeIconView,
    PerfectScrollingBehavior, nodeLinks, DefaultActionBehavior, treeListItemTemplate,
    treeListLeafTemplate, lang) {
  'use strict';
  var TabPosition = {
    none: -1,
    header: 0,
    list: 1
  };

  var SimpleTreeListLeafView = Marionette.ItemView.extend({

    tagName: 'a',

    attributes: function () {
      return {
        role: 'treeitem'
      };
    },

    template: treeListLeafTemplate,

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click': 'click:item'
    },
    events: function () {
      var evts = {
        'keydown': 'onKeyDown'
      };

      if (!!this.options.toolbarData) {
        evts = _.extend(evts, {
          'click': 'onExecuteClick',
          'mouseenter': 'onShowCommands',
          'mouseleave': 'onDestroyCommands'
        });
      }

      return evts;
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    onExecuteClick: function (event) {
      if (($(event.target).closest('.csui-tileview-more-btn').length === 1)) {
        return true;
      }
      else {
        event.stopPropagation();
        event.preventDefault();
        this.trigger('click:item', {target: this.model});
      }
    },

    constructor: function SimpleTreeListLeafView(options) {
      this.showInlineActionBar = !!options.toolbarData;
      if (this.showInlineActionBar) {
        this.triggers = {};
        this._setInlineActions(options);
      }
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.context = options.context;

    },
    _setInlineActions: function (options) {

      this.tileViewToolbarItems = options.toolbarData.toolbaritems || {};
      this.collection = options.toolbarData.collection || {};
    },

    onShowCommands: function (event) {
      this.$el.addClass('csui-tile-with-more-btn');
      this._showInlineBar(event);
    },

    _showInlineBar: function (event) {
      this.showInlineActionsLock = true;
      event.preventDefault();
      event.stopPropagation();
      var requiredModules = ['csui/controls/tableactionbar/tableactionbar.view',
        this.tileViewToolbarItems];

      require(requiredModules, _.bind(function (TableActionBarView, TileViewToolbarItems) {
        this.inlineBarView = new TableActionBarView(_.extend({
          context: this.options.context,
          originatingView: this,
          commands: this.defaultActionController.commands,
          model: this.model,
          collection: TileViewToolbarItems.inlineActionbar,
          containerCollection: this.collection,
          status: {originatingView: this}
        }, TileViewToolbarItems.inlineActionbar.options));
        if (this.showInlineActionsLock) {
          var inlineBarDiv    = this.$el.find('.csui-tileview-more-btn'),
              inlineBarRegion = new Marionette.Region({el: inlineBarDiv});
          inlineBarRegion.show(this.inlineBarView);
        }

      }, this));

    },

    onDestroyCommands: function () {
      this.showInlineActionsLock = false;
      if (this.showInlineActionBar) {
        this.inlineBarView && this.inlineBarView.destroy();
        this.$el.removeClass('csui-tile-with-more-btn');
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger("click:item", {target: this.model});
      }
    },

    onRender: function () {
      var id = this.model && this.model.get('id');
      if (id != null) {
        this.$el.attr('href', nodeLinks.getUrl(this.model));
      }
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();

      if (this.model && this.options && this.options.checkDefaultAction) {
        var disabled = this.model.fetched === false ||
                       !this.defaultActionController.hasAction(this.model);
        this.$el[disabled ? 'addClass' : 'removeClass']('inactive');
      }
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
    }

  });

  var SimpleTreeListItemView = Marionette.CompositeView.extend({

    className: 'cs-simpletreelistitem binf-panel binf-panel-default',

    attributes: function () {
      return {
        role: 'treeitem'
      };
    },

    template: treeListItemTemplate,
    templateHelpers: function () {
      return {
        icon: this.options.model && this.options.model.get('icon'),
        name: this.options.model && this.options.model.get('name'),
        expandLabel: lang.treeListExpandTooltip,
        collapseLabel: lang.treeListCollapseTooltip
      };
    },

    ui: {
      header: '.cs-header',
      headerDropdownIcon: '.cs-header .dropdown-icon',
      content: '> .cs-content',
      contentList: '> .cs-content > .cs-list-group'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': '_onChildRender'
    },

    childViewContainer: '.cs-list-group',

    childView: SimpleTreeListLeafView,

    childViewOptions: function () {
      return {
        text: this.options.emptyViewDefaultText,
        checkDefaultAction: this.options.checkDefaultAction,
        template: this.options.childViewTemplate,
        templateHelpers: this.options.childViewTemplateHelpers,
        toolbarData: this.options.toolbarData,
        context: this.options.context

      };
    },

    emptyView: EmptyListView,

    _onChildRender: function (childView) {
      var $item = childView.$el;
      if ($item.is('[data-csui-active]')) {
        $item.addClass('binf-active');
      }
    },

    constructor: function SimpleTreeListItemView(options) {
      options || (options = {});
      if (options.model && options.model.childrenCollection) {
        options.collection = options.model.childrenCollection;
      } else {
        options.collection = new Backbone.Collection();
      }
      Marionette.CompositeView.call(this, options);
    },

    onRender: function () {
      if (this.model && this.model.get('flatten') === true) {
        this.$el.addClass('flatten-tree');
        this.ui.header.addClass('binf-hidden');
        if (this.collection.length > 0) {
          this.ui.content.removeClass('binf-hidden');
        }
        this.$el.removeAttr('role');
        this.ui.contentList.removeAttr('role');
      }

      this.ui.header.on('click', _.bind(this.onClickHeader, this));
      this._setDropdownIconClass();
      this.tabPosition = TabPosition.none;
      this.selectedIndex = -1;
    },

    onClickHeader: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.ui.content.toggleClass('binf-hidden');
      this._setDropdownIconClass();

      this.ui.header.focus();
      this.tabPosition = TabPosition.header;
      this.selectedIndex = -1;

      this.triggerMethod('click:tree:header', this);
    },

    _setDropdownIconClass: function () {
      if (this.ui.content.hasClass('binf-hidden')) {
        this.ui.headerDropdownIcon.removeClass('icon-expandArrowUp');
        this.ui.headerDropdownIcon.addClass('icon-expandArrowDown');
        this.ui.headerDropdownIcon.attr('title', lang.treeListExpandTooltip);
        if (this.model && this.model.get('flatten') !== true) {
          this.$el.attr('aria-expanded', 'false');
        }
      } else {
        this.ui.headerDropdownIcon.addClass('icon-expandArrowUp');
        this.ui.headerDropdownIcon.removeClass('icon-expandArrowDown');
        this.ui.headerDropdownIcon.attr('title', lang.treeListCollapseTooltip);
        if (this.model && this.model.get('flatten') !== true) {
          this.$el.attr('aria-expanded', 'true');
        }
      }
    },

    onClickItem: function (src) {
      src.cancelClick = false;
      this.triggerMethod('click:tree:item', src);
      if (src.cancelClick === false) {
        this._setCssItemSelected(src.$el);
        src.$el.focus();
      }
      this.tabPosition = TabPosition.list;
      this.selectedIndex = src._index ? src._index : -1;
    },

    _setCssItemSelected: function ($item) {
      if (!($item instanceof $)) {
        return;
      }
      var $active = $item.siblings('[data-csui-active]');
      $active.removeClass('binf-active').removeAttr('data-csui-active');
      $item.addClass('binf-active').attr('data-csui-active', '');
      $item.siblings().prop('tabindex', '-1');
    },

    currentlyFocusedElement: function (event) {
      var $elem;
      if (event && !this.ui.content.hasClass('binf-hidden') &&
          (event.keyCode === 34 || event.keyCode === 35 || event.keyCode === 38 ||
           (event.keyCode === 9 && event.shiftKey))) {
        var lastIndex = this.collection.length - 1;
        $elem = this.getElementByIndex(lastIndex);
        if ($elem) {
          this.tabPosition = TabPosition.list;
          this.selectedIndex = lastIndex;
          return $elem;
        }
      }
      if (this.model && this.model.get('flatten') === true) {
        if (this.collection.length > 0) {
          var index = 0;
          (event && event.keyCode === 38 /* arrow up */) && (index = this.collection.length - 1);
          $elem = this.getElementByIndex(index);
          if ($elem) {
            this.tabPosition = TabPosition.list;
            this.selectedIndex = index;
            return $elem;
          }
        }
      } else {  // normal non-flattened tree, return the tree header
        this.tabPosition = TabPosition.header;
        this.selectedIndex = -1;
        return this.ui.header;
      }
      this.tabPosition = TabPosition.none;
      this.selectedIndex = -1;
      return undefined;
    },

    _moveTo: function (event, $elem, $preElem) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger('before:keyboard:change:focus');
      $preElem && $preElem.prop('tabindex', '-1');
      $elem.prop('tabindex', '0');
      $elem.focus();
      this.trigger('after:keyboard:change:focus');
    },

    onKeyInView: function (event) {
      var $preElem;
      switch (event.keyCode) {
      case 38: // arrow up
        if (this.tabPosition === TabPosition.list && this.selectedIndex === 0) {
          if (this.model && this.model.get('flatten') === true) {
            this.tabPosition = TabPosition.none;
            this.selectedIndex = -1;
          } else {  // normal non-flattened tree, return the tree header
            $preElem = this.getElementByIndex(this.selectedIndex);
            this.tabPosition = TabPosition.header;
            this.selectedIndex = -1;
            this._moveTo(event, this.ui.header, $preElem);
          }
        } else if (this.tabPosition === TabPosition.list && this.selectedIndex > 0) {
          $preElem = this.getElementByIndex(this.selectedIndex);
          this._moveTo(event, this._selectPrevious(), $preElem);
        }
        break;
      case 40: // arrow down
        if (!this.ui.content.hasClass('binf-hidden')) {
          if (this.selectedIndex < this.collection.length - 1) {
            this.tabPosition = TabPosition.list;
            $preElem = this.getElementByIndex(this.selectedIndex);
            this._moveTo(event, this._selectNext(), $preElem);
          }
        }
        break;
      case 33:  // page up
      case 34:  // page down
        this.tabPosition = TabPosition.none;
        this.selectedIndex = -1;
        break;
      case 13:  // enter
      case 32:  // space
        this._clickTargetByKeyboard(event);
        break;
      case 37:  // left arrow
        if (this.tabPosition === TabPosition.header && !this.ui.content.hasClass('binf-hidden')) {
          this._clickTargetByKeyboard(event);
        } else if (this.tabPosition === TabPosition.list) {
          var flattenTree = this.model && this.model.get('flatten');
          if (!flattenTree) {
            $preElem = this.getElementByIndex(this.selectedIndex);
            this.tabPosition = TabPosition.header;
            this.selectedIndex = -1;
            this._moveTo(event, this.ui.header, $preElem);
          }
        }
        break;
      case 39:  // right arrow
        if (this.tabPosition === TabPosition.header) {
          if (this.ui.content.hasClass('binf-hidden')) {
            this._clickTargetByKeyboard(event);
          } else {
            if (this.collection.length > 0) {
              this.tabPosition = TabPosition.list;
              this.selectedIndex = 0;
              this._moveTo(event, this.getElementByIndex(this.selectedIndex), this.ui.header);
            }
          }
        }
        break;
      }
      return true;
    },

    _clickTargetByKeyboard: function (event) {
      event.preventDefault();
      event.stopPropagation();
      $(event.target).click();
    },

    _selectNext: function () {
      if (this.selectedIndex < this.collection.length - 1) {
        this.selectedIndex++;
      }
      return this.getElementByIndex(this.selectedIndex);
    },

    _selectPrevious: function () {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return this.getElementByIndex(this.selectedIndex);
    },
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1); // index is zero-based
      var $item = this.$(nthChildSel);
      return $($item[0]);
    }
  });

  return SimpleTreeListItemView;
});
