/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/userpicker/userpicker.view'
], function (_, $, Marionette, TabableRegionBehavior, UserPickerView) {
  'use strict';
  var TabableUserPickerView = UserPickerView.extend({

    events: {
      'keydown @ui.searchbox': 'onKeyDown',
      'change @ui.searchbox': 'onChange'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function TabableUserPickerView(options) {
      UserPickerView.prototype.constructor.call(this, options);
      this.listenTo(this, 'item:change', this.onItemChanged);
    },
    currentlyFocusedElement: function () {
      return $(this.ui.searchbox);
    },
    onKeyDown: function (e) {
      if (e.keyCode === 9) {
        var elem = this.$el.find('li.binf-active');
        if (elem.is(':visible')) {
          elem.click();
        }
      }
    },
    onChange: function (e) {
      var name = this.model ? this.model.get('name_formatted') : '';
      if (name !== this.ui.searchbox.val()) {
        this.ui.searchbox.val('');
        this.model = undefined;
        this.triggerMethod('item:remove');
      }
    },

    onItemChanged: function (e) {
      this.model = e.item;
    }
  });
  return TabableUserPickerView;

});