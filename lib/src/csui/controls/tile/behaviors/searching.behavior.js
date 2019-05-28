/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/tile/behaviors/impl/searching.behavior',
  'csui/lib/jquery.ui/js/jquery-ui'
], function (_, Marionette, template) {
  "use strict";

  var SearchingBehavior = Marionette.Behavior.extend({

    defaults: {
      searchPlaceholder: 'Type to filter',
      headerTitle: '.tile-title',
      searchButton: '.tile-controls'
    },

    ui: function () {
      var headerTitle = getOption.call(this, 'headerTitle');
      return {
        headerTitle: headerTitle,
        searchBox: '.search-box',
        searchInput: '.search',
        clearer: '.clearer'
      };
    },

    triggers: {
      'click .icon-search': 'toggle:search'
    },

    constructor: function SearchingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      this.listenTo(view, 'render', this._renderSearchButton);
      this.listenTo(view, 'toggle:search', this._toggleSearching);
    },

    _renderSearchButton: function () {
      var searchButtonSelector = getOption.call(this, 'searchButton'),
          searchButton         = this.view.$(searchButtonSelector),
          searchPlaceholder    = getOption.call(this, 'searchPlaceholder'),
          iconTitle = getOption.call(this, 'searchIconTitle'),
          searchIconTitle = iconTitle ? iconTitle : 'Search',
          iconAria = getOption.call(this, 'searchIconAria'),
          searchIconAria = iconAria ? iconAria : searchIconTitle,
          data                 = {
            searchPlaceholder: searchPlaceholder,
            searchIconTitle: searchIconTitle,
            searchIconAria: searchIconAria
          };
      searchButton.html(template(data));
      this.view._bindUIElements.call(this);
    },

    _toggleSearching: function () {
      var self = this;
      this.ui.searchInput.val('');
      this.ui.clearer.toggle(false);
      this.ui.headerTitle.toggle('fade');
      this.ui.searchBox.removeClass('binf-hidden');
      this.ui.searchInput.toggle('blind', {direction: 'right'}, 200, function () {
        if (self.ui.searchInput.is(":visible")) {
          self.ui.searchInput.focus();
        }
      });
    }

  });
  function getOption(property) {
    var options = this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return SearchingBehavior;

});
