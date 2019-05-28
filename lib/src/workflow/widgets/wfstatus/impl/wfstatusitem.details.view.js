/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/url',
  'workflow/models/wfstatus/usercard.model',
  'hbs!workflow/widgets/wfstatus/impl/wfstatusitem.details',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (require, $, _, Marionette, Url, UserCardModel, template, lang) {

  'use strict';

  var WFStatusItemDetailsView = Marionette.LayoutView.extend({

    template: template,

    ui: {
      userIcon: '.wfstatusitem-userprofile-img',
      defaultUserIcon: '.wfstatusitem-userprofile-default-avatar'
    },

    constructor: function WFStatusItemDetailsView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, arguments);
      this.model = options.model;
      this.details = options.model.get('details');
      this.photoUrl = null;
      var self = this;
      if (this.details.userId) {
        new UserCardModel({
          userId: this.details.userId,
          connector: this.model.connector
        }).fetch().done(function (response) {
          var Utils    = require('workflow/utils/workitem.util'),
              userData = response.results.data.properties,
              photoElement = $("#wfstatusitem-mini-profile-pic-" + userData.id);

          if (userData.photo_url === null) {
            self.ui.defaultUserIcon.removeClass('binf-hidden');
          } else {
            self.model.set('photo_url', userData.photo_url);
            Utils.showProfilePic(self.model).done(function (response) {
              var photoUrl     = URL.createObjectURL(response);
              self.ui.userIcon.removeClass('binf-hidden');
              photoElement.attr("src", photoUrl);
            }).fail(function () {
              self.ui.userIcon.addClass('binf-hidden');
            });
          }
        });
      }
    },

    templateHelpers: function () {

      var details = this.details;
      return {
        "NameLabel": lang.NameLabel,
        "dueDateLabel": lang.dueDateLabel,
        "statusLabel": lang.statusLabel,
        "initiatorLabel": lang.initiatorLabel,
        "startedLabel": lang.startedLabel,
        "wfName": details.wf_name,
        "startDate": details.date_initiated,
        "dueDate": details.due_date,
        "status": details.status_key,
        "initiator": details.initiator,
        "userId": details.userId
      };
    }

  });

  return WFStatusItemDetailsView;

});