/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  'csui/utils/contexts/page/page.context',
  'workflow/testutils/base.test.utils',
  'workflow/models/wfstatus/wfstatus.collection.factory',
  'workflow/widgets/wfstatus/impl/wfstatus.extended.view',
  'workflow/widgets/wfstatus/impl/wfstatus.progress.view'
], function (Backbone, $, _, Marionette, PageContext,
    BaseTestUtils, WFStatusCollectionFactory, WFStatusExtendedView,
    WFStatusProgressView) {
  "use strict";

  describe("The Workflow Status Widget Progress view", function () {

    var progressView, progressRegion;

    beforeEach(function (done) {
      $('body').append($('<div/>', {
        "class" : "wfstatus-progress-test-view"
      }));

      progressRegion = new Marionette.Region({el: ".wfstatus-progress-test-view"});

      var context = BaseTestUtils.getContext();
      var options = {
        retention: 30,        
        filterWorkflowtype:"Both", 
        selectionType:100,       
        status: "ontime",
        "chatSettings" : {"chatEnabled": true, "presenceEnabled": false}
      };
      BaseTestUtils.workItemMock.enable();
      var statusCollection = context.getCollection(WFStatusCollectionFactory, options);
      statusCollection.fetch({reload: true})
          .then(function () {
            delete options["chatSettings"];
            options.model = statusCollection.allModels[0];
            options.context = context;
            progressView = new WFStatusProgressView(options);
            progressRegion.show(progressView);
          });

      BaseTestUtils.waitUntil(function () {
        if (progressView.$('.wfstatusitem-progress-panel').length > 0 &&
        progressView.$(".wfstatus-stepcard").length === 1 && 
        $(".workitem-attachments-item").length > 0) {
          return true;
        }
        return false;
      }, 5000).always(function () {
        done();
      });
    });

    it('Basic progress view layout', function (done) {
      expect($(".wfstatusitem-body").length).toEqual(1);
      expect($(".wfstatusitem-tabpanel").length).toEqual(1);
      expect($(".cs-tablink-text").length).toEqual(3);
      expect($(".cs-tablink-text")[1].textContent).toBe("Attachments");
      expect($(".workitem-attachments-item").length).toEqual(2);
      expect($(".workitem-attachment-name")[0].textContent).toBe("Desert.jpg");
      expect($(".cs-tablink-text")[0].textContent).toBe("Details");
      expect($(".wfstatusitem-details-value")[0].textContent).toBe("Testing Workflow Status");
      expect($(".wfstatusitem-details-value")[1].textContent).toBe("November 1, 2018");
      expect($(".wfstatusitem-details-value")[2].textContent).toBe("on time");
      expect($(".wfstatusitem-details-value")[3].textContent.trim()).toBe("Admin Admin");
      expect($(".wfstatusitem-details-value")[4].textContent).toBe("November 1, 2017");
      expect($(".wfstatusitem-step").length).toEqual(5);
      expect($(".wfstatus-stepcard").length).toEqual(1);
      expect($(".wfstatus-step-name")[0].textContent).toBe("Current step");
      expect($(".wfstatus-step-duedate")[0].textContent).toBe("on time");
      expect($(".wfstatus-step-assignee")[0].textContent.trim()).toBe("alex dan");
      expect($(".wfstatus-open-workflow-button button")[0].textContent).toBe("Open Workflow");
      
      $(".wfstatus-step-assignee").click();
      BaseTestUtils.waitUntil(function () {
        if ($(".wfstatus-usercard").length === 1) {
          expect($(".wfstatus-usercard").length).toEqual(1);
          expect($(".wfstatus-reassignButton:visible").length).toEqual(1);
          expect($(".wfstatus-chatButton:visible").length).toEqual(1);
          expect($(".wfstatus-mini-profile-user-email")[0].textContent).toBe("alex@ot.com");
          expect($(".wfstatus-mini-profile-user-name")[0].textContent).toBe("Alex Chaudry");
          expect($(".wfstatus-mini-profile-user-phone")[0].textContent).toBe("Phone: 546346326272");
          $(".wfstatusitem-completed-step-icon").click();

          return true;
        }
        return false;
      }, 500);

       BaseTestUtils.waitUntil(function (done) {
        if ($(".wfstatusitem-completed-step-icon.wfstatusitem-focus-icon").length === 1 &&
            $(".wfstatus-completed-step-icon").length > 0) {
          expect($(".wfstatus-step-name")[0].textContent).toBe("Start Step");
          expect($(".wfstatus-step-duedate")[0].textContent).toBe("completed");
          expect($(".wfstatus-step-assignee")[0].textContent.trim()).toBe("alex dan");
          expect($(".wfstatus-open-workflow-button button")[0].textContent).toBe("Open Workflow");

          expect($(".wfstatus-step-name")[1].textContent).toBe("E-Mail");
          expect($(".wfstatus-step-duedate")[1].textContent).toBe("completed");
          expect($(".wfstatus-step-assignee")[1].textContent.trim()).toBe("Dan Brown");
          expect($(".wfstatus-open-workflow-button button")[1].textContent).toBe("Open Workflow");

          $(".wfstatus-step-assignee").click();

          return true;
        }
        return false;
      }, 1000);
      BaseTestUtils.waitUntil(function (done) {
        if ( $(".wfstatusitem-completed-step-icon.wfstatusitem-focus-icon").length === 1 &&
          $(".wfstatus-completed-step-icon").length > 0 && 
          $(".wfstatus-usercard").length === 1) {
          expect($(".wfstatus-usercard").length).toEqual(1);
          expect($(".wfstatus-reassignButton:visible").length).toEqual(1);
          expect($(".wfstatus-chatButton:visible").length).toEqual(1);
          expect($(".wfstatus-mini-profile-user-email")[0].textContent).toBe("alex@ot.com");
          expect($(".wfstatus-mini-profile-user-name")[0].textContent).toBe("Alex Chaudry");
          expect($(".wfstatus-mini-profile-user-phone")[0].textContent).toBe("Phone: 546346326272");

          return true;
        }
        return false;
      }, 1500).always(function() {
        done();
      });


    });

    afterEach(function () {
      progressView.destroy();
      progressRegion.destroy();
      $('body').empty();
      BaseTestUtils.workItemMock.disable();
    });

  });

});
