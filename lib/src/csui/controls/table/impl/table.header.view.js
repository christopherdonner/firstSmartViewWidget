/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/base'
], function ($, _, Marionette, base) {
  'use strict';

  var TableHeaderView = Marionette.View.extend({
    constructor: function TableHeaderView(options) {
      TableHeaderView.__super__.constructor.apply(this, arguments);
      this._getActiveInlineForm = options._getActiveInlineForm;
      this.searchBoxes = options.searchBoxes;
      this.alternativeHeaderView = options.alternativeHeaderView;
      this.displayedColumns = options.displayedColumns;

      this.accFocusedColumn = options.accFocusedColumn || 0;
      this.accSearchFocused = options.accSearchFocused || false;

      if (this.alternativeHeaderView) {
        this.listenTo(this.alternativeHeaderView, 'focusout', function (args) {
          var thElements = this.$('>tr>th:not(.csui-alternative-table-header)');
          var thNextToAlternativeHeaderIndex = -1;
          var i, thEl;
          if (args.direction === "left") {
            for (i = 0; i < thElements.length; i++) {
              thEl = $(thElements[i]);
              if (thEl.hasClass(TableHeaderView.ClassNameColumnForAlternativeHeader)) {
                thNextToAlternativeHeaderIndex = i - 1;
                break;
              }
            }
          } else {
            for (i = thElements.length - 1; i > 0; i--) {
              thEl = $(thElements[i]);
              if (thEl.hasClass(TableHeaderView.ClassNameColumnForAlternativeHeader)) {
                if (i + 1 < thElements.length) {
                  thNextToAlternativeHeaderIndex = i + 1;
                  break;
                }
              }
            }
          }
          if (thNextToAlternativeHeaderIndex >= 0) {
            this.accFocusedColumn = thNextToAlternativeHeaderIndex;
          }
          this._accSetFocusToCurrentlyFocusedElement();
        });

        this.listenTo(this.alternativeHeaderView, 'changed:focus',
            this._accSetFocusToCurrentlyFocusedElement);
      }
    },

    events: {"keydown": "onKeyInView"},

    render: function () {
      this.triggerMethod('before:render', this);
      var headerCells = this.$('>tr>th');
      var searchBoxCells = this.$('>tr>th>.csui-table-column-search');
      this._columnCount = headerCells.length;
      this._searchBoxCount = searchBoxCells.length;

      this.triggerMethod('render', this);
    },

    remove: function () {
      this.stopListening();
      this.undelegateEvents();
      return this;
    },

    currentlyFocusedElement: function () {
      _limitAccFocusedColumnToDisplayed.call(this);

      var columnSelector = this._getColumnSelector(this.displayedColumns[this.accFocusedColumn]);
      var focusedElement = this.$(columnSelector);
      if (focusedElement.is(":visible")) {
        if (this.accSearchFocused) {
          var sbView = this._findActiveSearchBoxView();
          if (sbView) {
            focusedElement = sbView.currentlyFocusedElement();
          } else {
            focusedElement = $(); // should never happen
          }
        } else {

          var elText = $(focusedElement[0]).find('.csui-focusable-table-column-header');
          if (elText.length > 0) {
            focusedElement = elText;
          }
        }
      }
      return focusedElement;

    },

    _getColumnSelector: function (column) {
      var columnAttributeName = column.attributes.column_key;
      var columnSelector = 'tr>th[data-csui-attribute="' + columnAttributeName + '"]';
      return columnSelector;
    },
    _rightIsNextColumn: function () {
      var column = this.displayedColumns[this.accFocusedColumn];
      var columnSelector = this._getColumnSelector(column);
      var searchboxSelector = columnSelector + " .csui-table-column-search";
      var searchBox = this.$(searchboxSelector);
      return this.accSearchFocused || searchBox.length === 0;
    },

    onKeyInView: function (event) {
      var columnSelector, thEl;

      function moveFocusedElementLeft() {
        newFocusedColumn = this.accFocusedColumn - 1;
        while (newFocusedColumn >= 0) {
          columnSelector = this._getColumnSelector(this.displayedColumns[newFocusedColumn]);
          thEl = this.$(columnSelector);
          if (thEl.is(":visible") &&
              thEl.find('.csui-focusable-table-column-header').length > 0) {
            this.accFocusedColumn = newFocusedColumn;
            searchBox = thEl.find('.csui-table-column-search');
            this.accSearchFocused = searchBox.length > 0;
            if (this.accSearchFocused) {
              sbView = this._findActiveSearchBoxView();
              if (sbView && sbView.getShown()) {
                sbView.setFocusToGlass();
              }
            }
            break;
          } else {
            newFocusedColumn--;
          }
        }
      }

      var n, searchBox, newFocusedColumn, sbView;
      if (this._getActiveInlineForm()) {
        return;
      }

      switch (event.keyCode) {
      case 32:
      case 13:
        if (!(event.ctrlKey || event.metaKey)) {
          if (!this.accSearchFocused) {
            if (this.options.displayedColumns[this.accFocusedColumn].bSortable) {
              event.preventDefault();
              event.stopPropagation();

              this.trigger('sorting:toggle', this.accFocusedColumn);
            }
          }
        }
        break;
      case 37:
        if (this.accSearchFocused) {
          sbView = this._findActiveSearchBoxView();
          if (sbView && sbView.getShown()) {
            moveFocusedElementLeft.call(this);
          } else {
            this.accSearchFocused = false;
          }
        } else {
          moveFocusedElementLeft.call(this);
        }
        event.preventDefault();
        event.stopPropagation();
        this.trigger('closeOtherControls'); // force inline bar to close
        this._accSetFocusAfterTabableRegionActivated();
        break;
      case 39:

        if (this._rightIsNextColumn()) {

          n = this.accFocusedColumn + 1;
          while (n < this.displayedColumns.length) {
            columnSelector = this._getColumnSelector(this.displayedColumns[n]);
            thEl = this.$(columnSelector);
            if (this._isHeaderCellFocusable(thEl)) {
              this.accFocusedColumn = n;
              this.accSearchFocused = false;
              break;  // stop loop, because we have found the next column
            } else {
              n = n + 1;
            }
          }
          sbView = this._findActiveSearchBoxView();
          if (sbView && sbView.getShown()) {
            this.accSearchFocused = true;
            sbView.setFocusToInput();
          }

        } else {
          this.accSearchFocused = true;
          sbView = this._findActiveSearchBoxView();
          if (sbView && sbView.getShown()) {
            sbView.setFocusToInput();
          }
        }

        event.preventDefault();
        event.stopPropagation();
        this.trigger('closeOtherControls'); // force inline bar to close
        this._accSetFocusAfterTabableRegionActivated();

        break;
      case 35:
        this.accFocusedColumn = this.displayedColumns.length - 1;
        n = this.accFocusedColumn + 1;
        searchBox = this.$('>tr>th:nth-child(' + n + ') .csui-table-column-search');
        this.accSearchFocused = searchBox.length > 0;
        if (this.accSearchFocused) {
          sbView = this._findActiveSearchBoxView();
          if (sbView && sbView.getShown()) {
            sbView.setFocusToInput();
          }
        }
        event.preventDefault();
        event.stopPropagation();
        this.trigger('closeOtherControls'); // force inline bar to close
        this._accSetFocusAfterTabableRegionActivated();
        break;
      case 36:
        this.accFocusedColumn = 0;
        this.accSearchFocused = false;
        event.preventDefault();
        event.stopPropagation();
        this.trigger('closeOtherControls'); // force inline bar to close
        this._accSetFocusAfterTabableRegionActivated();
        break;
      case 121:
        if (event.shiftKey) {
          if (this.searchBoxes && this.searchBoxes.length > 0) {
            sbView = this.searchBoxes[0];
            sbView.showSearchInput();
            this.listenToOnce(sbView, 'closed', this._accSetFocusAfterTabableRegionActivated);
          }
          event.stopPropagation();
          event.preventDefault();
        }
        break;
      }

    },

    _accSetFocusToCurrentlyFocusedElement: function () {
      var el = this.currentlyFocusedElement();
      if (el.length > 0) {
        el = $(el[0]);
        this.trigger('changed:focus', this);
        if (base.isVisibleInWindowViewport(el)) {
          el.focus();
        }
      }
    },

    _accSetFocusAfterTabableRegionActivated: function () {
      if (this._getActiveInlineForm()) {
        return;
      }
      var sbView = this._findActiveSearchBoxView();
      if (sbView && sbView.getShown()) {
        return;
      }
      this._accSetFocusToCurrentlyFocusedElement();
    },

    _accSearchBoxFocused: function (options) {
      this.accFocusedColumn = options.columnIndex;
      this.accSearchFocused = true;
      this._accSetFocusToCurrentlyFocusedElement();
    },

    _findActiveSearchBoxView: function () {
      var searchBoxViews = this.searchBoxes;
      var displayedColumns = this.displayedColumns;
      var columnName = displayedColumns[this.accFocusedColumn].name.toLowerCase();
      var sbView = _.find(searchBoxViews, function (searchBoxView) {
        return searchBoxView.options.column === columnName;
      });
      return sbView;
    },

    _isHeaderCellFocusable: function (thEl) {
      return thEl.is(":visible") &&
             thEl.find('.csui-focusable-table-column-header').length > 0;
    }
  }, {
    ClassNameColumnForAlternativeHeader: 'csui-undefined'
  });

  function _limitAccFocusedColumnToDisplayed() {
    if (this.accFocusedColumn >= this.displayedColumns.length) {
      if (this.displayedColumns > 0) {
        this.accFocusedColumn = this.displayedColumns.length - 1;
      } else {
        this.accFocusedColumn = 0;
      }
    }
  }

  return TableHeaderView;
})
;
