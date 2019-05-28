/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/utils/contexts/factories/ancestors',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'hbs!csui/controls/breadcrumbspanel/impl/breadcrumbspanel',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang',
  'css!csui/controls/breadcrumbspanel/impl/breadcrumbspanel'
], function (Marionette, AncestorCollectionFactory, BreadcrumbsView,
    BreadcrumbsPanelTemplate, lang) {
  'use strict';

  var BreadcrumbsPanelView = Marionette.LayoutView.extend({

    attributes: {id: 'breadcrumb-wrap'},

    className: 'binf-container-fluid',

    template: BreadcrumbsPanelTemplate,

    ui: {
      tileBreadcrumb: '.tile-breadcrumb',
      breadcrumbsWrap: '#breadcrumb-wrap'
    },

    regions: {
      breadcrumbsInner: '.breadcrumb-inner'
    },

    templateHelpers: function () {
      return {
        breadcrumbAria: lang.breadcrumbAria
      };
    },

    constructor: function BreadcrumbsPanelView(options) {
      Marionette.LayoutView.apply(this, arguments);

      this.listenTo(this.options.context, 'request', this._contextFetching);
      this.listenTo(this.options.context, 'current:folder:changed', this._currentFolderChanged);
    },

    _getAncestors: function () {
      var ancestors = this.options.context.getCollection(AncestorCollectionFactory);
      if (this.ancestors !== ancestors) {
        if (this.ancestors) {
          this.stopListening(this.ancestors, 'sync', this.breadcrumbsChanged);
        }
        this.listenTo(ancestors, 'sync', this.breadcrumbsChanged);
        this.ancestors = ancestors;
      }
      return ancestors;
    },

    _contextFetching: function () {
      var ancestors = this._getAncestors();
      if (this.breadcrumbs && ancestors !== this.breadcrumbs.completeCollection) {
        this.breadcrumbs.updateCompleteCollection(ancestors);
      }
    },

    _currentFolderChanged: function (node) {
      if (this.ancestors) {
        if (this.ancestors.isFetchable()) {
          if (node) {
            var ancestor = this.ancestors.findWhere({id: node.get('id')});
            if (ancestor) {
              ancestor.set('name', node.get('name'));
            } else {
              this.ancestors.reset([]);
              if (this.breadcrumbs) {
                this.breadcrumbs.updateCompleteCollection(this.ancestors);
                this.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
              }
            }
          } else {
            this.ancestors.fetch();
          }
        } else {
          this.ancestors.reset([]);
        }
      }
    },

    breadcrumbsChanged: function () {
      this.triggerMethod('change:breadcrumbs', {
        isBreadcrumbsEmpty: this.ancestors.size() === 0
      });
    },

    onRender: function () {
      this.breadcrumbs = new BreadcrumbsView({
        context: this.options.context,
        collection: this._getAncestors(),
        fetchOnCollectionUpdate: false
      });
      this.breadcrumbsInner.show(this.breadcrumbs);
    },

    hideBreadcrumbs: function () {
      if (this.breadcrumbs) {
        this.breadcrumbs.hideSubCrumbs();
      }
      this.$el.removeClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable:not", this);
      this.$el.hide();
    },

    showBreadcrumbs: function () {
      this.$el.addClass('breadcrumb-wrap-visible');
      this.triggerMethod("tabable", this);
      this.$el.show();
      this.breadcrumbs && this.breadcrumbs.triggerMethod("refresh:tabindexes");
    },

    isTabable: function () {
      if (this.breadcrumbs) {
        return this.ancestors.size() > 1;
      } else {
        return false;
      }
    }

  });

  return BreadcrumbsPanelView;
});
