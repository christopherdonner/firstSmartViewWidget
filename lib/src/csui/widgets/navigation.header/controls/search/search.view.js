/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/widgets/search.box/search.box.view',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/controls/globalmessage/globalmessage'
], function (SearchBoxView, SearchQueryModelFactory, GlobalMessage) {
  'use strict';

  var SearchView = SearchBoxView.extend({
    constructor: function SearchView(options) {
      SearchBoxView.call(this, options);
      this.searchQuery = options.context.getModel(SearchQueryModelFactory);
      this.listenTo(this.searchQuery, 'change', this._updateBreadcrumbs);
    },

    onRender: function () {
      var resizetrigger = function () { GlobalMessage.trigger('resize'); };
      this.listenTo(this, 'hide:input', resizetrigger);
      this.listenTo(this, 'show:input', resizetrigger);
      this.listenTo(this, 'hide:breadcrumbspanel', function () {
        this.options.parentView.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
      });
    },

    _updateBreadcrumbs: function () {
      if (this.searchQuery.get('query_id')) {
        this.options.parentView.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
      }
    }
  });

  return SearchView;
});
