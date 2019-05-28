/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery'], function ($) {

  // See http://blog.alexmaccaw.com/css-transitions
  $.fn.redraw = function () {
    $(this).each(function () {
      var redraw = this.offsetHeight;
    });
    return this;
  };

  return $.fn.redraw;

});
