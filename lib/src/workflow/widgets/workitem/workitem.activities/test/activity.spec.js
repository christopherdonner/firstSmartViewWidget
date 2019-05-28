/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/base',
  'csui/utils/contexts/factories/connector',
  'workflow/testutils/base.test.utils',
  'workflow/widgets/workitem/workitem.activities/impl/activity.list.view'
], function (_, $, BaseUtils, ConnectorFactory, BaseTestUtils, ActivityListView) {
  'use strict';

  var Helper = {

    getActivityViewDetails: function (activity) {
      return {
        'name': activity.find('.user .esoc-user-container').text().trim(),
        'date': activity.find('.date').text().trim(),
        'exactDate': activity.find('.date').length > 0 ?
                     activity.find('.date').attr('title').trim() : '',
        'action': activity.find('.action-text').text().trim(),
        'comment': activity.find('.comment').text().trim(),
        'reassign': activity.find('.reassign-user .esoc-user-container').text().trim(),
        'attachmentName': activity.find('.attachment-name').text().trim(),
        'attachmentLink': activity.find('.attachment-name > a').length > 0 ?
                          activity.find('.attachment-name > a').attr('href').trim() : '',
        'attachmentDesc': activity.find('.attachment-desc').text().trim(),
        'attachmentIcon': activity.find('.attachment-icon .csui-icon').length > 0 ?
                          activity.find('.attachment-icon .csui-icon').attr('class').trim() : '',
        'attachmentLinkDisabled': activity.find('.attachment .disabled').length === 2
      };
    }
  }

  describe('The ActivityList View', function () {
    var pid = 'x';
    var sid = 'x';

    describe('is initializing', function () {
      var view;

      beforeEach(function () {
        BaseTestUtils.activityMock.enable();
        BaseTestUtils.membersMock.enable({
          id: 1002,
          type: 0,
          name: 'bwillis',
          business_email: 'bwillis@elink.loc',
          office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
          title: 'New York Police Officer (Retired)',
          display_name: 'Bruce Willis',
          name_formatted: 'Bruce Willis',
          group_id: 101,
          photo_url: null
        });
      });

      afterEach(function () {
        BaseTestUtils.activityMock.disable();
        BaseTestUtils.membersMock.disable();
      });

      it('correctly', function () {

        view = new ActivityListView({
          context: BaseTestUtils.getContext(),
          processId: pid,
          subprocessId: sid
        });
        expect(view.collection).toBeDefined();
        expect(view.collection.isFetchable()).toBeTruthy();
      });
    });

    describe('is rendering', function () {

      var view;
      var context;

      beforeEach(function () {
        BaseTestUtils.activityMock.enable();
        BaseTestUtils.membersMock.enable({
          id: 1002,
          type: 0,
          name: 'bwillis',
          business_email: 'bwillis@elink.loc',
          office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
          title: 'New York Police Officer (Retired)',
          display_name: 'Bruce Willis',
          name_formatted: 'Bruce Willis',
          group_id: 101,
          photo_url: null
        });
        context = BaseTestUtils.getContext();
      });

      afterEach(function () {
        BaseTestUtils.activityMock.disable();
        BaseTestUtils.membersMock.disable();
      });

      it('correctly multiple items', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activities = view.$el.find('.activity-item');
          expect(activities.length).toEqual(10);
          done();
        });
      });

      it('correctly a standard send-on activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          if (view.$el.find('.activity-item').length !== 0) {
            return (view.$el.find('.activity-item').eq(0).find('.esoc-user-container').text() !== "");
          }
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(0);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.now.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.now.toJSON()));
            expect(details.action).toEqual('Send on');
            expect(details.comment.indexOf('Please take a look')).toEqual(0);
            expect(details.reassign).toEqual('');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly a forward activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(1);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeaday.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeaday.toJSON()));
            expect(details.action).toEqual('Forward');
            expect(details.comment.indexOf('I forwarded this task')).toEqual(0);
            expect(details.reassign).toEqual('Bruce Willis');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly a send for review reply activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(2);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeamonth.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeamonth.toJSON()));
            expect(details.action).toEqual('Reply');
            expect(details.comment.indexOf('Your approval seems OK to me. Go ahead!')).toEqual(0);
            expect(details.reassign).toEqual('');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly a send for review activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(3);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeamonth.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeamonth.toJSON()));
            expect(details.action).toEqual('Send for review');
            expect(details.comment.indexOf('Hi Matt, can you')).toEqual(0);
            expect(details.reassign).toEqual('Bruce Willis');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly an activity without comment', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(4);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.action).toEqual('Send on');
            expect(details.comment).toEqual('');
            expect(details.reassign).toEqual('');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly a disposition activity without comment', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(5);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.action).toEqual('Reject Approval');
            expect(details.comment.indexOf('I guess we should reject')).toEqual(0);
            expect(details.reassign).toEqual('');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly a start activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(6);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.action).toEqual('Start');
            expect(details.comment.indexOf('I am starting this workflow')).toEqual(0);
            expect(details.reassign).toEqual('');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly a attachment attached activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(7);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.action).toEqual('Attach');
            expect(details.comment).toEqual('');
            expect(details.reassign).toEqual('');
            expect(details.attachmentIcon.indexOf('mime_pdf')).toBeGreaterThan(0);
            expect(details.attachmentName).toEqual('Hardware Renewal Request, John Doe');
            expect(details.attachmentLink).toEqual('/app/nodes/4711');
            expect(details.attachmentDesc.indexOf('This is an auto-generated')).toEqual(0);
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly a attachment updated activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(8);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Bruce Willis');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.action).toEqual('Update');
            expect(details.comment).toEqual('');
            expect(details.reassign).toEqual('');
            expect(details.attachmentIcon.indexOf('mime_pdf')).toBeGreaterThan(0);
            expect(details.attachmentName).toEqual('Hardware Renewal Request, John Doe');
            expect(details.attachmentLink).toEqual('/app/nodes/4711');
            expect(details.attachmentDesc.indexOf('Changed the document')).toEqual(0);
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly an anonymous user activity', function (done) {
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(9);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.name).toEqual('Anonymous User');
            expect(details.date).toEqual(BaseUtils.formatFriendlyDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.exactDate).toEqual(BaseUtils.formatExactDateTime(
                BaseTestUtils.activityMock._dates.beforeayear.toJSON()));
            expect(details.action).toEqual('Forward');
            expect(details.comment.indexOf('From anonymous to anonymous.')).toEqual(0);
            expect(details.reassign).toEqual('Anonymous User');
            expect(details.attachmentIcon).toEqual('');
            expect(details.attachmentName).toEqual('');
            expect(details.attachmentDesc).toEqual('');
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });
    });

    describe('is rendering attachment links', function () {

      var view;
      var context;

      beforeEach(function () {

      });

      afterEach(function () {
        BaseTestUtils.activityMock.disable();
        BaseTestUtils.membersMock.disable();
      });

      it('correctly for a document', function (done) {
        BaseTestUtils.activityMock.enable(undefined,
            BaseTestUtils.activityMock._nodeDataDoc);
        BaseTestUtils.membersMock.enable({
          id: 1002,
          type: 0,
          name: 'bwillis',
          business_email: 'bwillis@elink.loc',
          office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
          title: 'New York Police Officer (Retired)',
          display_name: 'Bruce Willis',
          name_formatted: 'Bruce Willis',
          group_id: 101,
          photo_url: null
        });
        context = BaseTestUtils.getContext();
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(7);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.attachmentLinkDisabled).toBeFalsy();
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly for a document link', function (done) {
        BaseTestUtils.activityMock.enable(undefined,
            BaseTestUtils.activityMock._nodeDataLinkToDoc);
        BaseTestUtils.membersMock.enable({
          id: 1002,
          type: 0,
          name: 'bwillis',
          business_email: 'bwillis@elink.loc',
          office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
          title: 'New York Police Officer (Retired)',
          display_name: 'Bruce Willis',
          name_formatted: 'Bruce Willis',
          group_id: 101,
          photo_url: null
        });
        context = BaseTestUtils.getContext();
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(7);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.attachmentLinkDisabled).toBeFalsy();
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });

      it('correctly for a workflow link', function (done) {
        BaseTestUtils.activityMock.enable(undefined,
            BaseTestUtils.activityMock._nodeDataLinkToWorkflow);
        BaseTestUtils.membersMock.enable({
          id: 1002,
          type: 0,
          name: 'bwillis',
          business_email: 'bwillis@elink.loc',
          office_location: 'Nakatomi Plaza (Office Building in Los Angeles)',
          title: 'New York Police Officer (Retired)',
          display_name: 'Bruce Willis',
          name_formatted: 'Bruce Willis',
          group_id: 101,
          photo_url: null
        });
        context = BaseTestUtils.getContext();
        view = new ActivityListView({
          context: context,
          processId: pid,
          subprocessId: sid
        });
        view.render();
        context.fetch();
        BaseTestUtils.waitUntil(function () {
          return (view.$el.find('.activity-item').length !== 0);
        }, 1000).always(function () {
          var activity = view.$el.find('.activity-item').eq(7);
          if (activity) {
            var details = Helper.getActivityViewDetails(activity);
            expect(details.attachmentLinkDisabled).toBeTruthy();
          } else {
            console.log('activity view not found!');
            expect(true).toBeFalsy();
          }
          done();
        });
      });
    });
  });
});
