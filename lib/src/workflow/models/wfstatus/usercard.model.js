/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'workflow/controls/usercards/usercard.view'
], function ($, _, Backbone, Url, UserCardView) {

  'use strict';

  var UserCardModel = Backbone.Model.extend({

    constructor: function UserCardModel(options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    url: function () {

      var baseUrl        = this.connector.connection.url.replace('/v1', '/v2'),
          membersRestUrl = Url.combine(baseUrl, '/members/'),
          assigneeUrl    = Url.combine(membersRestUrl, this.get('userId'));

      return assigneeUrl;

    }
  });
  return UserCardModel;
});
