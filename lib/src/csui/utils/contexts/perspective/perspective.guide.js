/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'], function (_) {

  function PerspectiveGuide() {
  }

  PerspectiveGuide.prototype = {
    isNew: function (oldPerspective, newPerspective) {
      return !_.isEqual(_.omit(oldPerspective, ['showWidgetInMaxMode', 'id']),
          _.omit(newPerspective, ['id']));
    }
  };

  return PerspectiveGuide;

});
