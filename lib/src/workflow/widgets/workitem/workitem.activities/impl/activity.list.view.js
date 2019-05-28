/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'workflow/models/activity/activity.collection.model.factory',
  'workflow/widgets/workitem/workitem.activities/impl/activity.item.view',
  'i18n!workflow/widgets/workitem/workitem.activities/impl/nls/lang'
], function (_, $, Marionette, TabableRegionBehavior, ActivityCollectionModelFactory, ActivityView,
    lang) {
  'use strict';

  var ActivityList = Marionette.CollectionView.extend({

    className: 'workflow-activity-list',

    childView: ActivityView,

    tagName: 'ul',
    focusableElements: [],

    childViewOptions: function () {
      return {
        context: this.options.context,
        connector: this.collection.connector
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    events: {
      'keydown': 'onKeyDown'
    },
    selectedIndex: 0,
    onKeyDown: function (e) {
      var $preElem;
      switch (e.keyCode) {
      case 38: // up
        $preElem = this.currentlyFocusedElement();
        this._moveTo(e, this._selectPrevious(), $preElem);
        break;
      case 40: // down
        $preElem = this.currentlyFocusedElement();
        this._moveTo(e, this._selectNext(), $preElem);
        break;
      }
    },

    _moveTo: function (event, $elem, $preElem) {
      event.preventDefault();
      event.stopPropagation();

      setTimeout(_.bind(function () {
        $elem.focus();
        $preElem.prop('tabindex', '-1');
        $elem.prop('tabindex', '0');
      }, this), 50);
    },

    _selectNext: function () {
      if (this.selectedIndex < this.focusableElements.length - 1) {
        this.selectedIndex++;
      }
      return this.currentlyFocusedElement();
    },

    _selectPrevious: function () {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return this.currentlyFocusedElement();
    },

    currentlyFocusedElement: function () {
      this.focusableElements = [];
      var $collection = this.$('li');
      var that = this;
      _.each($collection, function ($item) {
        var $focusableUserLinks = $($item).find('.esoc-user-container');
        _.each($focusableUserLinks, function ($focusableUserLink) {
          that.focusableElements.push($focusableUserLink);
        });
        var $focusableAttachmentLinks = $($item).find('.attachment-name > a');
        _.each($focusableAttachmentLinks, function ($focusableAttachmentLink) {
          that.focusableElements.push($focusableAttachmentLink);
        });
      });
      var elementOfFocus = (this.focusableElements.length > this.selectedIndex) ?
                           this.$(this.focusableElements[this.selectedIndex]) : null;
      return elementOfFocus;
    },

    constructor: function ActivityList(options) {
      options || (options = {});
      options.collection = options.collection ? options.collection :
                           options.context.getModel(ActivityCollectionModelFactory);
      if (options.processId !== undefined && options.subprocessId !== undefined) {
        options.collection.setData({
          processId: options.processId,
          subprocessId: options.subprocessId
        });
      }
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    }
  });
  return ActivityList;
});