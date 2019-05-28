/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone"
], function ($, Backbone, config) {
  var ActivityFeedItemModel = Backbone.Model.extend({
    defaults: {
      id: 0,
      data_id: 0,
      created_at: "-",
      text: "-",
      feed_event_type: 0,
      user: {
        name: "-",
        screen_name: "-",
        profile_image_url: "-"
      },
      noMoreData: true
    },
    constructor: function ActivityFeedItemModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });
  return ActivityFeedItemModel;
});
