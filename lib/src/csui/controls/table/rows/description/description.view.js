/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'hbs!csui/controls/table/rows/description/impl/description',
  'i18n!csui/controls/table/rows/description/impl/nls/lang',
  'css!csui/controls/table/rows/description/impl/description'
], function (_, $, Marionette, base, template, lang) {

  var DescriptionView = Marionette.ItemView.extend({

    className: function () {
      if (this._collapsedHeightIsOneLine) {
        return "cs-description csui-description-short-lines-1";
      } else {
        return "cs-description";
      }
    },

    template: template,

    templateHelpers: function () {
      var description = this.model.get("instructions")
          || this.model.get("description") || '';
      return {
        complete_description: description,
        current_description: description,
        more_description: this.has_more_desc && !this.hideShowLess,
        showmore_tooltip: lang.showmore,
        showmore_aria: lang.showmoreAria,
        showless_tooltip: lang.showless,
        showless_aria: lang.showlessAria
      };
    },

    ui: {
      description: '.description',
      readMore: '.description-readmore',
      showLess: '.description-showless'
    },

    events: {
      'keydown @ui.readMore': 'readMoreClicked',
      'keydown @ui.showLess': 'showLessClicked',
      'click @ui.readMore': 'readMoreClicked',
      'click @ui.showLess': 'showLessClicked'
    },

    constructor: function DescriptionView(options) {
      this._preinitializeFlags(options);

      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.listenTo(this, 'dom:refresh', this._truncateIfNecessary)
          .listenTo(this.options.tableView, 'dom:refresh',
              this.triggerMethod.bind(this, 'dom:refresh'));
    },

    currentlyFocusedElement: function () {
      if (this.has_more_desc) {
        if (this.shortDescMode) {
          return this.ui.readMore;
        } else {
          return this.ui.showLess;
        }
      } else {
        return $();
      }
    },

    _preinitializeFlags: function (options) {
      this.shortDescMode = true;
      this.hideShowLess = false;
      this.has_more_desc = false;
      this._collapsedHeightIsOneLine = options && options.collapsedHeightIsOneLine;
    },

    _updateDescriptionAndCaret: function () {
      this._enableCaretState();
      if (this.shortDescMode && this.has_more_desc) {
        this.$el.addClass('csui-description-collapsed');
      } else {
        this.$el.removeClass('csui-description-collapsed');
      }
    },

    _truncateIfNecessary: function () {
      var actualHeight = this.ui.description.height();
      if (actualHeight) {
        var maxHeight = parseFloat(this.ui.description.css("line-height"));
        if (!this._collapsedHeightIsOneLine) {
          maxHeight = maxHeight * 2;  // if not one line, use 2 lines
        }
        if (actualHeight > maxHeight) {
          this.has_more_desc = true;
        }
        this._updateDescriptionAndCaret();
      }
    },

    readMoreClicked: function (event) {
      if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();

        this.shortDescMode = false;
        this._updateDescriptionAndCaret();
        this.options.tableView && this.options.tableView.trigger('update:scrollbar');
        this.ui.showLess.focus();
      }
    },

    showLessClicked: function (event) {
      if (!!event && (event.keyCode === 13 || event.keyCode === 32 || event.type === 'click')) {
        event.preventDefault();
        event.stopPropagation();

        this.shortDescMode = true;
        this._updateDescriptionAndCaret();
        this.options.tableView && this.options.tableView.trigger('update:scrollbar');
        this.ui.readMore.focus();
      }
    },

    _enableCaretState: function () {
      if (this.has_more_desc) {
        this.ui.readMore.toggleClass('caret-hide', this.shortDescMode ? false : true);
        this.ui.showLess.toggleClass('caret-hide', this.shortDescMode ? true : false);
      } else {
        this.ui.readMore.addClass('caret-hide');
        this.ui.showLess.addClass('caret-hide');
      }
    }

  });

  return DescriptionView;

});
