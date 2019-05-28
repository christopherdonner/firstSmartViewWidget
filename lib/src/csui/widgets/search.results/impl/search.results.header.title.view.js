/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/widgets/search.results/impl/search.results.header.title',
  'i18n!csui/widgets/search.results/nls/lang',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, Marionette, template, publicLang, lang) {
  'use strict';

  var TitleView = Marionette.ItemView.extend({

    template: template,

    constructor: function TitleView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    ui: {
      resultTitle: '#resultsTitle',
      customSearchTitle: '#customSearchTitle',
      headerCount: '#headerCount',
      searchHeaderCountLive: '#searchHeaderCountLive'
    },

    _assignTotalItemElem: function () {
      this.count = this.options.count || 0;
      var countTxt     = _.str.sformat(publicLang.aboutNHits, this.count),
          countTxtAria = "";
      if (this.count !== 0) {
        countTxtAria = countTxt;
      } else {
        countTxtAria = lang.noSearchResultMessage;
      }
      this.ui.headerCount.empty();
      this.ui.headerCount.append(countTxt);
      this.countTextAria = lang.searchResults + ": " + countTxtAria + ". " +
                           lang.searchQueryKeyboardShortcut;
      this.ui.searchHeaderCountLive.text(this.countTextAria);

      return true;
    },

    _updateSearchResultsTitle: function () {
      var searchHeaderTitle, tooltipText;
      if (!!this.options.useCustomTitle && !!this.title) {
        this.ui.customSearchTitle.text(this.title);
        tooltipText = lang.searchResults + ': ' + this.title;
        searchHeaderTitle = lang.searchResults + ': ';
      } else {
        searchHeaderTitle = this.options.searchHeaderTitle || lang.searchResults;
        tooltipText = searchHeaderTitle;
      }
      this.ui.resultTitle.text(searchHeaderTitle);
      this.ui.resultTitle.parent().attr("title", tooltipText);
    },

    setCustomSearchTitle: function (title) {
      this.title = '"' + title + '"';
      this.ui.customSearchTitle.text(title);
      var resultsTitle = lang.searchResults + ': ';
      this.ui.resultTitle.text(resultsTitle);
      this.ui.resultTitle.parent().attr("title", resultsTitle + this.title);
    },

    onRender: function () {
      this._assignTotalItemElem();
      this._updateSearchResultsTitle();
    }

  });

  return TitleView;
});
