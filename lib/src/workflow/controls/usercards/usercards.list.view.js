/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/models/member/member.model',
  'csui/models/member/membercollection',
  'workflow/controls/usercards/usercard.view',
  'workflow/models/wfstatus/usercard.model',
  'workflow/controls/usercards/usercards.view',
  'workflow/utils/workitem.util',
  'hbs!workflow/controls/usercards/impl/usercards.list',
  'css!workflow/controls/usercards/impl/usercard'
], function (require, $, _, Backbone, Marionette, Url, PerfectScrollingBehavior, MemberModel,
    UserCollectionFactory, UsercardView, UserCardModel, UsercardCollectionView, WorkitemUtil,
    template) {
  'use strict';
  var UsercardsView = Marionette.LayoutView.extend({

    childView: UsercardView,
    className: 'wfstatus-usercard-layout',
    template: template,
    tagName: 'div',

    regions: {
      usercardLayout: ".wfstatus-usercard-list"
    },

    constructor: function UsercardsView(options) {
      options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
      var self = this;

      if (this.model.get('assignedto')) {
        var memberModel = new MemberModel({
          groupId: this.model.get('assignedto').groupId
        }, {connector: this.model.connector});

        new UserCollectionFactory(undefined, {
          member: memberModel,
          autofetch: true,
          connector: this.model.connector
        }).fetch().done(function (response) {
          var userData = _.sortBy(response.results, 'type');
          self.renderUserCards(userData);
        });

      } else {

        new UserCardModel({
          userId: this.model.get('userId'),
          connector: this.model.connector
        }).fetch().done(function (response) {
          var userData = response.results.data.properties;
          userData.singleUser = true;
          self.renderUserCards(userData);

        });
      }
    },

    renderUserCards: function (userData) {

      var options = {
            dueDate: this.model.get('task_due_date') ? this.model.get('task_due_date')  : this.model.get('due_date') ,
            status: this.model.get('task_status') ? this.model.get('task_status') : this.model.get('status_key')
          },
          utils = require('workflow/utils/workitem.util'),
          result  = utils.formatStatus(options);
      this.Usercollection = new UserCollectionFactory(userData, {});
      this.usercardCollectionView = new UsercardCollectionView({
        collection: this.Usercollection,
        status: result.status,
        context: this.options.context,
        options: this,
        originatingView: this.options.originatingView,
        nodeModel: this.options.nodeModel,
        stepCardsListView: this.options.stepCardsListView,
        wfData:this.options.wfData,
        stepType: this.options.stepType
      });
      this.completeCollection = new UserCollectionFactory(userData, {});
      this.usercardLayout.show(this.usercardCollectionView);

    }

  });
  return UsercardsView;
});
