/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/pages/start/perspective.router',
  'csui/utils/contexts/factories/search.query.factory',
  'i18n!csui/pages/start/nls/lang', 'i18n!csui/pages/start/impl/nls/lang'
], function (module, _, PerspectiveRouter, SearchQueryModelFactory, publicLang, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    showTitle: true
  });

  var SearchPerspectiveRouter = PerspectiveRouter.extend({
    routes: {
      'search/*path': 'openSearchPerspective'
    },

    constructor: function SearchPerspectiveRouter(options) {
      PerspectiveRouter.prototype.constructor.apply(this, arguments);

      this.searchQuery = this.context.getModel(SearchQueryModelFactory);
      this.listenTo(this.searchQuery, 'change', this._updateSearchUrl);
      this.listenTo(this.searchQuery, 'change', this._updatePageTitle);
    },

    openSearchPerspective: function (path) {
      var name,
          parameters = _.reduce(path.split('/'), function (result, item) {
            if (name) {
              result[name] = item != null ? decodeURIComponent(item).trim() : '';
              name = undefined;
            } else {
              name = decodeURIComponent(item);
            }
            return result;
          }, {});
      this._updatePageTitle();
        this.searchQuery.set(parameters, {silent: !!this.searchQuery.get('query_id')});
    },

    onOtherRoute: function () {
      this.searchQuery.clear({silent: true});
    },

    _updateSearchUrl: function () {
      var url = this.routerURL(this.searchQuery);
      this.navigate(url);
      this._updatePageTitle();
    },

    _updatePageTitle: function () {
      if(config.showTitle) {
        document.title = _.str.sformat(publicLang.SearchTitle, this.searchQuery.get('where'));
      }
    },
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        return param ? param : null;
      });
    }
  });

  SearchPerspectiveRouter.prototype.routerURL =  function(searchQuery){
    var url = _.reduce(searchQuery.attributes, function (result, value, name) {
      if (value) {
        result += '/' + encodeURIComponent(name) + '/' + encodeURIComponent(value);
      } else {
        result += '/' + encodeURIComponent(name) + '/' + '%20';
      }
      return result;
    }, 'search');
    return url;
  };

  return SearchPerspectiveRouter;
});
