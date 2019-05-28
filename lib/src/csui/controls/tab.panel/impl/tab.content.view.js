/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, log, ViewEventsPropagationMixin) {
  'use strict';

  var TabContentView = Marionette.View.extend({

    constructor: function TabContentView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.contentRegion = new Marionette.Region({el: this.el});
      if (!this.options.delayTabContent || this.options.mode === 'spy' ||
          this._isActive()) {
        this._createContent(options);
      } else {
        this.listenTo(this.options.tabPanel, 'before:activate:tab', this._ensureContent);
      }
    },

    className: function () {
      var classes = '';
      if (!this.options.mode) {
        classes = 'binf-tab-pane binf-fade';
        if (this._isActive()) {
          classes += ' binf-in binf-active';
        }
      }
      return classes;
    },

    attributes: function () {
      var uTabId = this.model.get('uniqueTabId');
      if (!uTabId) {
        log.warn('Missing unique tab ID in the TabPanel UI component. Please report.')
        && console.warn(log.last);
      }
      return {
        role: 'tabpanel',
        id: uTabId,
        'aria-labelledby': 'tablink-' + uTabId
      };
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderContent();
      this.triggerMethod('render', this);
      return this;
    },

    onBeforeDestroy: function () {
      this._destroyContent();
    },

    _isActive: function () {
      var activeTabIndex = Math.max(0, this.options.activeTab.get('tabIndex'));
      return this.model === this.model.collection.at(activeTabIndex);
    },

    _ensureContent: function (tabContent, tabPane, tabLink) {
      if (tabPane === this) {
        if (!this.content) {
          this._createContent(this.options);
          if (this._isRendered) {
            this.render();
          }
        }
      }
    },

    _createContent: function (options) {
      var ContentView        = this._getContentView(),
          contentViewOptions = this._getContentViewOptions(),
          fullOptions        = _.extend({
                model: this.model,
                containerCollection: options.containerCollection,
                index: options.index
              },
              contentViewOptions);
      this.content = new ContentView(fullOptions);
      this.propagateEventsToViews(this.content);
    },

    _getContentView: function () {
      var contentView = this.model.get("contentView") ||
                        this.options.tabPanel.getOption('contentView');
      if (contentView && !(contentView.prototype instanceof Backbone.View)) {
        contentView = contentView.call(this.options.tabPanel, this.model);
      }
      if (!contentView) {
        throw new Marionette.Error({
          name: 'NoContentViewError',
          message: 'A "contentView" must be specified'
        });
      }
      return contentView;
    },

    _getContentViewOptions: function () {
      var contentViewOptions = this.options.tabPanel.getOption('contentViewOptions');
      if (_.isFunction(contentViewOptions)) {
        contentViewOptions = contentViewOptions.call(this.options.tabPanel,
            this.model);
      }
      return contentViewOptions;
    },

    _renderContent: function () {
      if (this.content) {
        this.contentRegion.show(this.content);
      }
    },

    _destroyContent: function () {
      if (this.content) {
        this.cancelEventsToViewsPropagation(this.content);
        this.contentRegion.reset();
        this.content = undefined;
      }
    }

  });

  _.extend(TabContentView.prototype, ViewEventsPropagationMixin);

  return TabContentView;

});
