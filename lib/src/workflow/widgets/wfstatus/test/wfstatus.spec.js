/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  'csui/utils/contexts/page/page.context', 'csui/utils/url', 'csui/models/member/member.model',
  'csui/models/member/membercollection',
  'workflow/testutils/base.test.utils',
  'workflow/models/wfstatus/wfstatus.collection.factory',
  'workflow/models/wfstatus/usercard.model',
  'workflow/controls/usercards/usercard.view',
  'workflow/widgets/wfstatus/wfstatus.view',
  'workflow/widgets/wfstatus/impl/wfstatus.list.view',
  'workflow/controls/usercards/usercards.view',
  'workflow/utils/workitem.util',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function (Backbone, $, _, Marionette, PageContext, Url, MemberModel, UserCollectionFactory,
    BaseTestUtils, WFStatusCollectionFactory, UserCardModel, UserCardView, WFStatusView, WFStatusListView,
    UsercardCollectionView, WorkitemUtil, lang) {
  "use strict";
  describe("Workflow tracking Widget", function () {

    var context, icon, widget;

    beforeEach(function (done) {
      var statusModelOptions = {
        retention: 30,
        selectionType:100,       
        filterWorkflowtype:"Both"
        
      }
      var context  = BaseTestUtils.getContext(),
          options  = {context: context, data: statusModelOptions};

      BaseTestUtils.workItemMock.enable();
      context = BaseTestUtils.getContext();
      icon = "mime_workflow_status";
      
      widget = new WFStatusView(options);
      widget.model.fetch().then(function () {
        widget.render();
        widget.collection = new Backbone.Collection(widget.model.get('data'));
      });

      BaseTestUtils.waitUntil(function () {
        if (widget.$el('div.tile-header').length > 0) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });
    });

    afterEach(function () {
      widget.destroy();
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });

    it("can be instantiated and rendered", function () {
      expect(widget).toBeDefined();
      expect(widget.$el.length > 0).toBeTruthy();
      expect(widget.el.childNodes.length > 0).toBeTruthy();

    });

    it("has a header and an icon", function () {

      expect(widget.$('div.tile-header').length).toBeGreaterThan(0);
      expect(widget.$('div.tile-type-icon').length).toBeGreaterThan(0);

    });

    it("has a title", function () {
      expect(widget.$el.find(".tile-header .tile-title h2")[0].textContent).toBe(lang.dialogTitle);
    });

    it("has a configurable icon, which is set as the header icon", function () {

      var iconDiv = widget.$el.find('div.tile-type-icon > span.icon');
      expect(iconDiv[0].classList.length).toBeGreaterThan(0);
      expect($(iconDiv[0]).hasClass(icon));

    });

    it("Check the data for a single workflow scenario", function () {
      expect(widget.$el.find(
          ".wfstatus-count-" + widget.model.get("data").status)[0].textContent).toBe(
          "1");
      expect(widget.$el.find(".wfstatus-info")[0].textContent).toBe("On time");
      expect(widget.$el.find(".wfstatus-workflow-name")[0].textContent).toBe(
          "Employee Joining Form");
      expect(widget.$el.find(".wfstatus-step-name")[0].textContent).toBe("Joining Form");
      expect(widget.$el.find(".wfstatus-assignee")[0].textContent).toBe("Admin Admin");
    });

  });

  describe("The Workflow Status Widget, Expanded", function () {

    var w;

    beforeEach(function (done) {

      var context = BaseTestUtils.getContext();
      var options = {
        retention: 30,
        filterWorkflowtype:"Both",
        selectionType:100,       
        status: "ontime",
        chatSettings : {"chatEnabled": true}
      }
      BaseTestUtils.workItemMock.enable();
      
      var statusCollection = context.getCollection(WFStatusCollectionFactory, options);
      statusCollection.fetch({reload: true})
          .then(function () {
            w = new WFStatusListView({
              context: context,
              collection: statusCollection
            });
            w.render();
            $('body').append(w.$el);
            w.trigger('show');
            w.trigger('dom:refresh');
          });

      BaseTestUtils.waitUntil(function () {
        if (w.$('div.wfstatus-table').length > 0) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });
    });

    afterEach(function () {
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });

    it("the workflow status table view can be instantiated", function () {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length > 0).toBeTruthy();

    });

    it("shows 2 workflow status items and correct data", function () {

      expect(w.collection.length).toEqual(2);
      expect(w.$('div.wfstatus-table')).toBeDefined();
      expect($(w.$('tbody')[0]).find('tr').length).toEqual(2);
      expect($(w.$('tbody > tr')[0]).find('td').length).toEqual(6);
      expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-status_key').length).toEqual(1);
      expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-date').length).toEqual(2);
      expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-wf_name').length).toEqual(
          1);
      expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-step_name').length).toEqual(1);
      expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-assignee').length).toEqual(1);
    });

    it("showing usercard details and workflow status from expand view", function () {
      var context = BaseTestUtils.getContext();
      var connector = BaseTestUtils.getConnector(context),
          userId    = '7060';
      var statusModel = w.collection.at(0);
      var options = {
            dueDate: statusModel.get('due_date'),
            status: statusModel.get('status_key')
          },
          result  = WorkitemUtil.formatStatus(options);

      var collectionOptions = {
        retention: 30,
        filterWorkflowtype:"Both",
        selectionType:100,
        status: "ontime",
        chatSettings : {"chatEnabled": true}
      };

      var statusCollection = context.getCollection(WFStatusCollectionFactory, collectionOptions);

      new UserCardModel({
        userId: userId,
        connector: connector
      }).fetch().done(function (response) {
        var userData = response.results.data.properties;
        userData.singleUser = true;
        var Usercollection = new UserCollectionFactory(userData, {});
        var usercardCollectionView = new UsercardCollectionView({
          collection: Usercollection,
          context: context,
          status: result.status
        });
        usercardCollectionView.render();
        expect(
            usercardCollectionView.$el.find(".wfstatus-reassignButton button")[0].textContent).toBe(
            "Reassign");
        expect(usercardCollectionView.$el.find(".wfstatus-chatButton button")[0].textContent).toBe(
            "Chat");
        expect(usercardCollectionView.$el.find(
            ".wfstatus-usercard-wfstatus")[0].textContent.trim()).toBe("on time");
        expect(usercardCollectionView.$el.find(
            ".wfstatus-mini-profile-user-email")[0].textContent).toBe("alex@ot.com");
        expect(usercardCollectionView.$el.find(
            ".wfstatus-mini-profile-user-name")[0].textContent).toBe("Alex Chaudry");
        expect(usercardCollectionView.$el.find(
            ".wfstatus-mini-profile-user-phone")[0].textContent).toBe("Phone: 546346326272");
      });

    });

  });

  describe("Workflow Status Widget Expanding View ", function() {

    var assigneeModel, tableview;

    beforeEach(function (done) {
      var context = BaseTestUtils.getContext();
      var options = {
        retention: 30,
        filterWorkflowtype:"Both",
        selectionType:100,
        status: "ontime",
        chatSettings : {"chatEnabled": true}
      }
      BaseTestUtils.workItemMock.enable();

      var statusCollection = context.getCollection(WFStatusCollectionFactory, options);
      statusCollection.fetch({reload: true})
          .then(function () {
            var w = new WFStatusListView({
              context: context,
              collection: statusCollection
            });
        $('body').append(w.$el);

        var wfData = {
            process_id: 95867,
            subprocess_id: 95867,
            task_id: 1
          },
          model = Backbone.Model.extend({}),
          assigneeCollection = new model();

        var viewOptions = {};

        tableview = w.tableView;
        viewOptions.tableView = tableview;
        viewOptions.originatingView = {
          model: tableview.collection.models[0],
          options: {tableView: tableview}
        };

        viewOptions.wfData = wfData;
        viewOptions.context = context;
        viewOptions.options = {};

        assigneeModel = new model({
          'id': 54010,
          'firstName':  "Candidate",
          'lastName': 'One' 
        });
        
        viewOptions.model = assigneeCollection.set('assignee', assigneeModel);

        var userCardView = new UserCardView(viewOptions);
        userCardView.reAssignUser(viewOptions.model, viewOptions);
      });

      BaseTestUtils.waitUntil(function () {
        if (tableview && tableview.collection.models[0].get("assignee") ===
              assigneeModel.get('firstName') + " " + assigneeModel.get('lastName')) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });
    });

    afterEach(function () {
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });

    it("workflow status reassign", function () {
      expect(tableview.collection.models[0].get("userId")).toBe(assigneeModel.get('id'));
    });

  });

  describe("Workflow tracking Widget User Cards", function () {

    beforeEach(function (done) {

      BaseTestUtils.workItemMock.enable();
      var context   = BaseTestUtils.getContext(),
          connector = BaseTestUtils.getConnector(context),
          userId    = '7060',
          self      = this;

      var collectionOptions = {
        retention: 30,
        filterWorkflowtype:"Both",
        selectionType:100,
        status: "ontime",
        chatSettings : {"chatEnabled": true}
      };

      var statusCollection = context.getCollection(WFStatusCollectionFactory, collectionOptions);

      new UserCardModel({
        userId: userId,
        connector: connector
      }).fetch().done(function (response) {
        var userData = response.results.data.properties;
        userData.singleUser = true;
        self.Usercollection = new UserCollectionFactory(userData, {});
        self.usercardCollectionView = new UsercardCollectionView({
          collection: self.Usercollection,
          context: context
        });
        self.usercardCollectionView.render();
        $('body').append(self.usercardCollectionView.$el);
      });

      BaseTestUtils.waitUntil(function () {
        if (self.usercardCollectionView.$el.length > 0) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });

    });

    it("Details on usercard", function () {
      expect($(".wfstatus-reassignButton button")[0].textContent).toBe("Reassign");
      expect($(".wfstatus-chatButton button")[0].textContent).toBe("Chat");
      expect($(".wfstatus-mini-profile-user-email")[0].textContent).toBe("alex@ot.com");
      expect($(".wfstatus-mini-profile-user-name")[0].textContent).toBe("Alex Chaudry");
      expect($(".wfstatus-mini-profile-user-phone")[0].textContent).toBe("Phone: 546346326272");
    });

    afterEach(function () {
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });
  });

  describe("Workflow tracking Widget Multiple User Cards", function () {

    beforeEach(function (done) {
      BaseTestUtils.workItemMock.enable();

      var context   = BaseTestUtils.getContext(),
          connector = BaseTestUtils.getConnector(context),
          groupid   = '3495919',
          self      = this;
      
      var collectionOptions = {
        retention: 30,
        filterWorkflowtype:"Both",
        selectionType:100,
        status: "ontime",
        chatSettings : {"chatEnabled": true}
      };

      var statusCollection = context.getCollection(WFStatusCollectionFactory, collectionOptions);

      var memberModel = new MemberModel({
        groupId : groupid
      }, {connector: connector});
      new UserCollectionFactory(undefined, {
        member: memberModel,
        autofetch: true,
        connector: connector
      }).fetch().done(function (response) {
        self.Usercollection = new UserCollectionFactory(response.results, {});
        self.usercardCollectionView = new UsercardCollectionView({
          collection: self.Usercollection,
          context: context
        });
        self.usercardCollectionView.render();
        $('body').append(self.usercardCollectionView.$el);
      });

      BaseTestUtils.waitUntil(function () {
        if (self.usercardCollectionView.$el.length > 0) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });

    });

    it("User Details on usercards", function () {
      expect($(".wfstatus-usercard").length).toEqual(2);
      expect($(".wfstatus-reassignButton:visible").length).toEqual(1);
      expect($(".wfstatus-chatButton:visible").length).toEqual(1);
      expect($(".wfstatus-mini-profile-user-email")[0].textContent).toBe("WilliamBergs@ot.com");
      expect($(".wfstatus-mini-profile-user-name")[0].textContent).toBe("Alen William");
      expect($(".wfstatus-mini-profile-user-phone")[0].textContent).toBe("Phone: 9874563214");
      expect($(".wfstatus-mini-profile-user-email")[1].textContent).toBe("dante@ot.com");
      expect($(".wfstatus-mini-profile-user-name")[1].textContent).toBe("Dante Carlo");
      expect($(".wfstatus-mini-profile-user-phone")[1].textContent).toBe("Phone: 987456321");
    });

    it("Mouse actions on usercards", function () {
      var element = $(".wfstatus-mini-profile-user")[0];
      $(element).trigger('mouseleave');
      expect($(".wfstatus-reassignButton:visible").length).toEqual(0);
      expect($(".wfstatus-chatButton:visible").length).toEqual(0);
      $(element).trigger('mouseenter');
      expect($(".wfstatus-reassignButton:visible").length).toEqual(1);
      expect($(".wfstatus-chatButton:visible").length).toEqual(1);
    });

    afterEach(function () {
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });
  });

});
