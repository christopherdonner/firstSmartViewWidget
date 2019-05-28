/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/controls/tile/tile.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/widgets/html.editor/impl/html.editor.content.view',
  'hbs!csui/widgets/html.editor/impl/html.editor.wrapper.template',
  'i18n!csui/widgets/html.editor/impl/nls/lang'
], function (_, $, Handlebars, Marionette, TileView, PerfectScrollingBehavior,
    TabableRegionBehavior, HtmlEditorContentView, template, lang) {

  var HtmlEditorTileView = TileView.extend({

    constructor: function HtmlEditorTileView(options) {
      options || (options = {});
      options.icon = 'cs-wiki-icon-wiki';
      this.context = options.context;
      options.id = 'csui-html-tile-wrapper-' + options.wikiPageId;

      TileView.prototype.constructor.call(this, options);

      options = options.data ? _.extend(options, options.data) : options;
      this.options = options;
      this.options.parentView = this;
      this.contentViewOptions = this.options;
    },

    contentView: HtmlEditorContentView,
    contentViewOptions: function () {
      _.extend(this.options, {parentView: this});
    },

    onShow: function () {
      this.$el.addClass(
          'cui-rich-editor-widget-wrapper cui-rich-editor-widget-wrapper-' +
          this.options.wikiPageId);
    }

  });

  var HtmlEditorWidgetView = Marionette.CompositeView.extend({
    tagName: 'div',

    className: 'csui-html-editor-grand-parent',

    templateHelpers: function () {
      return {};
    },

    template: template,

    ui: {
      editIcon: '.tile-controls'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    constructor: function HtmlEditorWidgetView(options) {
      options = options || {};
      options.data || (options.data = {});
      _.extend(options, options.data);
      options.wikiPageId = options.wikipageid || options.id;
      options.id = "csui-html-editor-grand-parent-" + options.wikiPageId;
      options.title = options.titlefield || options.title;
      options.header = !!options.title;
      options.scrollableParent = !!options.header ? '.tile-content' :
                                 '.csui-html-editor-wrapper-parent';
      this.context = options.context;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: function () {
          return this.options.scrollableParent;
        },
        suppressScrollX: true
      },
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (!!this.htmlEditorContentView.dropdownMenu &&
          !this.htmlEditorContentView.dropdownMenu.haveEditPermissions) {
        return this.htmlEditorContentView.$el.find('a:first');
      } else {
        return this.$el.find('.csui-html-editor-dropdown .csui-html-editor-control');
      }
    },

    onKeyInView: function (event) {
      if (this.htmlEditorContentView.mode === 'read') {
        this.htmlEditorContentView.moveTab(event);
      }
    },

    onRender: function (e) {
      var _htmlView;
      this.options.autosaveInterval = 60000;
      if (this.options.header === undefined || this.options.header) { // with header
        _htmlView = new HtmlEditorTileView(this.options);
        this.listenToOnce(_htmlView, 'show', _.bind(function () {
          this.htmlEditorContentView = _htmlView.getChildView('content');
        }, this));
      } else { // without header
        this.options.parentView = this;
        _htmlView = new HtmlEditorContentView(this.options);
        this.htmlEditorContentView = _htmlView;
      }

      new Marionette.Region({
        el: this.$el.find(".csui-html-editor-wrapper-parent")
      }).show(_htmlView);
      this._triggerView = this;

      this
          .listenTo(this.htmlEditorContentView, 'refresh:tabindexes', _.bind(function () {
            this.trigger('refresh:tabindexes');
          }, this))
          .listenTo(this.htmlEditorContentView, 'updateScrollbar', _.bind(function () {
            this.trigger('dom:refresh');
          }, this));
    }
  });
  return HtmlEditorWidgetView;
});
