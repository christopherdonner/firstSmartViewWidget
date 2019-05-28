/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base',
  'csui/controls/listitem/listitemstandard.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/utils/node.links/node.links',
  'hbs!csui/controls/list/impl/simplelist',
  'hbs!csui/controls/list/impl/simplelistitem',
  'csui/utils/nodesprites',
  'i18n!csui/controls/list/impl/nls/lang',
  'css!csui/controls/list/impl/simplelist'
], function (_, $, Backbone, Marionette, base, ListItemStandardView,
    PerfectScrollingBehavior, nodeLinks, listTemplate, listItemTemplate,
    nodeSpriteCollection, lang) {
  'use strict';

  var SimpleListItemView = Marionette.ItemView.extend({
    constructor: function SimpleListItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'a',

    template: listItemTemplate,
    serializeData: function () {
      var data = Marionette.ItemView.prototype.serializeData.apply(this, arguments);
      if (data) {
        var icon = data.icon;
        if (icon) {
          data.icon = 'csui-icon ' + icon;
        }
      }
      return data;
    },

    onRender: function () {
      var id = this.model && this.model.get('id');
      if (id != null) {
        this.$el.attr('href', nodeLinks.getUrl(this.model));
      }
      var exactNodeSprite = nodeSpriteCollection.findByNode(this.model) || {},
          mimeTypeFromNodeSprite;
      if (exactNodeSprite.attributes) {
        mimeTypeFromNodeSprite = exactNodeSprite.get('mimeType');
      }
      var title = mimeTypeFromNodeSprite || this.model.get("type_name") || this.model.get("type");
      if (this.model.get("name") && title) {
        var nameTitleAria = _.str.sformat(lang.nameTitleAria, this.model.get("name"), title);
        this.$el.attr("aria-label", nameTitleAria);
      }
    },

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click': 'click:item'
    }

  });

  var SimpleListView = Marionette.CompositeView.extend({

    constructor: function SimpleListView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
            return behavior.behaviorClass === PerfectScrollingBehavior;
          }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '> .cs-content',
            suppressScrollX: true,
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.call(this, options);
      if (this.options.data && this.options.data.items) {
        if (!this.collection) {
          var ViewCollection = Backbone.Collection.extend({
            model: Backbone.Model.extend({
              idAttribute: null
            })
          });
          this.collection = new ViewCollection();
        }
        this.collection.add(this.options.data.items);
      }
    },

    ui: {
      header: '.cs-header',
      headerGoBack: '.cs-header-with-go-back',
      back: '.cs-go-back',
      backTitle: '.cs-title-with-go-back'
    },

    events: {
      'click @ui.back': 'onClickBack',
      'click @ui.backTitle': 'onClickBack',
      'click @ui.headerGoBack': 'onClickBack'
    },

    childEvents: {
      'click:item': 'onClickItem',
      'render': '_onChildRender'
    },

    className: 'cs-simplelist binf-panel binf-panel-default',
    template: listTemplate,

    templateHelpers: function () {
      var backButton = this.options.data.back_button;
      var title = this.options.data.title;
      if (backButton && (title === undefined || title.length === 0)) {
        title = lang.goBackTitleForEmptyTitle;
      }
      return {
        back_button: backButton,
        goBackTooltip: lang.goBackTooltip,
        title: title,
        goBackAria: _.str.sformat(lang.goBackAria, title)
      };
    },

    childViewContainer: '.cs-list-group',

    childView: SimpleListItemView,

    childViewOptions: function () {
      return {
        template: this.options.childViewTemplate
      };
    },

    _onChildRender: function (childView) {
      var $item = childView.$el;
      if ($item.is('[data-csui-active]')) {
        $item.append($('<div>').addClass('arrow-overlay'));
        $item.addClass('binf-active');
      }
    },
    getSelectedItem: function () {
      var selectedIndex = this.getSelectedIndex();
      var selectedItem = this.children.findByIndex(selectedIndex);
      return selectedItem;
    },
    getSelectedIndex: function () {
      var $selectedItem = this.$el.find('[data-csui-active]');
      var selectedIndex = this.$el.find('.cs-list-group>a').index($selectedItem);
      return selectedIndex;
    },
    setSelectedIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return;
      }
      var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1); // index is zero-based
      var $item = this.$(nthChildSel);
      this._setCssItemSelected($item);
      $($item[0]).focus();
      var $contentView = this.$('.cs-content');
      if (!this._isScrolledIntoView($item)) {

        var itemPosTop = $item.position().top;
        var deltaScroll = (itemPosTop > 0) ?
                          ($item.height() - $contentView.height()) + itemPosTop : itemPosTop;

        $contentView.animate({
          scrollTop: $contentView.scrollTop() + deltaScroll
        }, 500);
      }

      return;
    },

    selectedIndexElem: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var nthChildSel = _.str.sformat('div a:nth-child({0})', index + 1); // index is zero-based
      var $item = this.$(nthChildSel);
      return $($item[0]);
    },

    selectNext: function () {
      var nSelected = this.getSelectedIndex();
      var nNext = Math.min(nSelected + 1, this.collection.models.length);
      this.setSelectedIndex(nNext);
      return;
    },

    selectPrevious: function () {
      var nSelected = this.getSelectedIndex();
      var nNext = Math.max(nSelected - 1, 0);
      this.setSelectedIndex(nNext);
      return;

    },

    onClickItem: function (src) {
      src.cancelClick = false;
      this.trigger('click:item', src);
      if (src.cancelClick === false) {
        this._setCssItemSelected(src.$el);
      }
      return;
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.clickBack();
    },

    clickBack: function () {
      this.trigger('click:back');
    },

    _setCssItemSelected: function ($item) {
      if (!($item instanceof $)) {
        return;
      }
      var $active = $item.siblings('[data-csui-active]');
      $active.removeClass('binf-active').removeAttr('data-csui-active');
      $active.find('.arrow-overlay').remove();
      $item.append($('<div>').addClass('arrow-overlay'));
      $item.addClass('binf-active').attr('data-csui-active', '');
      $item.siblings().prop('tabindex', '-1');

      return;
    },

    _isScrolledIntoView: function ($item) {
      var $contentWindow = this.$('.cs-content');
      var elemTop = $item.position().top;
      var elemBottom = elemTop + $item.height();
      return ((elemTop >= 0) && (elemBottom <= $contentWindow.height()));
    }
  });

  return SimpleListView;
});
