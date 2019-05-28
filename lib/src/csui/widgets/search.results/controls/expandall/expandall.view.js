/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/widgets/search.results/controls/expandall/impl/expandall',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'css!csui/widgets/search.results/controls/expandall/impl/expandall'
], function ($, Marionette, template, lang) {

  var expandAllView = Marionette.ItemView.extend({

    template: template,
    templateHelpers: function () {
      var messages = {
        expandAll: lang.expandAll
      };
      return {
        messages: messages
      };
    },

    events: {
      'click .icon-expandArrowDown, .icon-expandArrowUp': 'expandAll'
    },

    ui: {
      expandAllSelector: '.csui-search-header-expand-all'
    },

    expandAll: function (event) {
      if (this.collection.length > 0) {
        var that = this;
        if (this.ui.expandAllSelector[0].classList.contains(this.options._eleCollapse)) {
          $(".csui-search-expandall-text").html(lang.expandAll);
          $(".csui-expand-all").removeClass("csui-collapse-all");
          this.ui.expandAllSelector.removeClass(this.options._eleCollapse).addClass(
              this.options._eleExpand).attr('title', lang.expandAll).attr('aria-pressed', 'false');
          this.options.view.$el.find("." + this.options._eleCollapse).each(function (e) {
            $(this).trigger('click');
          });
          if (this.options.view.options.layoutView) {
            this.options.view.options.layoutView.updateScrollbar();
          }
        } else {
          $(".csui-search-expandall-text").html(lang.collapseAll);
          $(".csui-expand-all").addClass("csui-collapse-all");
          this.ui.expandAllSelector.removeClass(this.options._eleExpand).addClass(
              this.options._eleCollapse).attr('title', lang.collapseAll).attr('aria-pressed', 'true');
          this.options.view.$el.find("." + this.options._eleExpand).each(function (e) {
            if (!$(this)[0].classList.contains(that.options._eleCollapse)) {
              $(this).trigger('click');
            }
          });
        }
        event.preventDefault();
        event.stopPropagation();
      }
    },

    pageChange: function () {
      if (this.ui.expandAllSelector[0].classList.contains(this.options._eleCollapse)) {
        this.ui.expandAllSelector.removeClass(this.options._eleCollapse).addClass(
            this.options._eleExpand);
        $(".csui-search-expandall-text").html(lang.expandAll);
      }
    }

  });

  return expandAllView;

});
