/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/tile/behaviors/infinite.scrolling.behavior'
], function (InfiniteScrollingBehavior) {
  "use strict";

  var AfwInfiniteScrollingBehavior = InfiniteScrollingBehavior.extend({
    _checkScrollPositionFetch: function () {
      var commentsContainer = this._content;
      var containerHeight = commentsContainer.height();
      var containerScrollHeight = commentsContainer[0].scrollHeight;
      var containerScrollTop = commentsContainer.scrollTop();
      if ((containerScrollTop + 30) >= (containerScrollHeight - containerHeight)) {
        this._content.find(".esoc-social-activity-load-more:last").trigger("click");
      }
    }
  });

  return AfwInfiniteScrollingBehavior;

});
