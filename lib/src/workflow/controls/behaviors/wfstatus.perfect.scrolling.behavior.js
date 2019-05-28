/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([ "csui/lib/jquery", 'csui/controls/tile/behaviors/infinite.scrolling.behavior'
], function ( $,InfiniteScrollingBehavior) {
  'use strict';

  var WfInfiniteScrollingBehavior = InfiniteScrollingBehavior.extend({
    _checkScrollPosition: function () {
      var container = $(this.options.contentParent);
      var containerHeight = container.height();
      var containerScrollHeight = container[0].scrollHeight;
      var containerScrollTop = container.scrollTop();
      if ((containerScrollTop + 30) >= (containerScrollHeight - containerHeight)) {
        $('#tableview').trigger("click");
      }
    }

  });

  return WfInfiniteScrollingBehavior;

});