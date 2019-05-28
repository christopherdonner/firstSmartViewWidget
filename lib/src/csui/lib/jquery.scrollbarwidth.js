/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery"], function (module, $) {

  // See http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
  var scrollbarWidth;
  $.scrollbarWidth = function () {
    var parent,
      child;

    if (scrollbarWidth === undefined) {
      parent = $("<div></div>").css({
        width: "50px",
        height: "50px",
        overflow: "auto",
        position: "absolute",
        visibility: "hidden"
      }).appendTo('body');
      child = $("<div></div>").appendTo(parent);
      scrollbarWidth = child.innerWidth() - child.height(99).innerWidth();
      parent.remove();
    }

    return scrollbarWidth;
  };

  // See http://stackoverflow.com/a/15432281/623816
  $.inScrollRange = function (event) {
    var x = event.pageX,
      y = event.pageY,
      e = $(event.target),
      hasY = e.hasScroll(),
      hasX = e.hasScroll("x"),
      rX,
      rY,
      bInX,
      bInY,
      scrollSize = $.scrollbarWidth();
    if (hasY) {
      rY = new Rectangle();
      rY.top = e.offset().top;
      rY.right = e.offset().left + e.width();
      rY.bottom = rY.top + e.height();
      rY.left = rY.right - scrollSize;

      //if (hasX) rY.bottom -= scrollSize;
      bInY = rY.contains(x, y);
    }
    if (hasX) {
      rX = new Rectangle();
      rX.bottom = e.offset().top + e.height();
      rX.left = e.offset().left;
      rX.top = rX.bottom - scrollSize;
      rX.right = rX.left + e.width();

      // if(hasY) rX.right -= scrollSize;
      bInX = rX.contains(x, y);
    }
    return bInX || bInY;
  }

  $.fn.hasScroll = function (axis) {
    var firstElement = this.get(0);
    if (!firstElement) {
      return false;
    }
    var overflow = this.css("overflow"),
      overflowAxis = typeof axis === "undefined" || axis == "y" ?
                    this.css("overflow-y") : this.css("overflow-x"),
      bShouldScroll = firstElement.scrollHeight > this.innerHeight(),
      bAllowedScroll = overflow == "auto" || overflow == "visible" ||
                      overflowAxis == "auto" || overflowAxis == "visible",
      bOverrideScroll = overflow == "scroll" || overflowAxis == "scroll";
    return bShouldScroll && bAllowedScroll || bOverrideScroll;
  };

  function Rectangle() {
    this.top = 0;
    this.left = 0;
    this.bottom = 0;
    this.right = 0;
  }

  Rectangle.prototype.contains = function (x, y) {
    return y >= this.top && y <= this.bottom &&
           x >= this.left && x <= this.right;
  }

  $.scrollbarWidth.version = "1.0";

});
