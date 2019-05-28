/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/nodestable/nodestable.view', 'csui/utils/contexts/page/page.context',
  'csui/integration/folderbrowser/folderbrowser.widget',
  './nodestable.toolitems.mock.data.js',
  'csui/utils/contexts/factories/node',
  'csui/controls/toolbar/toolitem.model',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext'
], function (module, $, _, Marionette, NodesTableView, PageContext,
    FolderBrowserWidget, folderBrowserMock, NodeModelFactory, ToolItemModel) {
  'use strict';

  describe('FolderBrowserWidget - nodestable', function () {
    var context, folderBrowser, tableRendered;
    var originalTimeout;
    var enableLog = false;
    var fullPageSel = "span.csui-icon-open-full-page";
    var backButtonSel = "span.csui-icon-go-previous-node";

    beforeAll(function (done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

      folderBrowserMock.test.enable();

      window.csui.require.config({
        config: {
          'csui/integration/folderbrowser/commands/go.to.node.history': {
            enabled: true
          },
          'csui/integration/folderbrowser/commands/open.full.page.container': {
            enabled: true
          }
        }
      });

      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

      folderBrowser = new FolderBrowserWidget({
        context: context,
        start: {id: 101},
        breadcrumb: false,
        placeholder: $('<div>').appendTo(document.body)
      });
      folderBrowser.show();

      folderBrowser.folderView.on("render", function (args) {
        tableRendered = true;
        done();
      });

    });
    afterAll(function () {
      folderBrowserMock.test.disable();
    });

    beforeEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    afterEach(function () {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('has rendered nodes table', function (done) {
      expect(tableRendered).toBeTruthy();
      done();
    });


    it('is the first visited node and has rendered page expansion control', function (done) {
      expect(folderBrowser.folderView.$el.find(fullPageSel).length).toBeGreaterThan(0);
      done();
    });

    it('is the first visited node and has not rendered back control', function (done) {
      expect(folderBrowser.folderView.$el.find(backButtonSel).length).toBe(0);
      done();
    });

    it('is the second visited node and has rendered page and back controls', function (done) {

      folderBrowser.folderView.context.once("sync", function (args) {
        expect(context.getObject(NodeModelFactory).get("id")).toBe(103409);
        expect(folderBrowser.folderView.$el.find(backButtonSel).length).toBeGreaterThan(0);
        expect(folderBrowser.folderView.$el.find(fullPageSel).length).toBeGreaterThan(0);
        if (enableLog) {
          console.log("Finished fetch.");
        }
        done();
      });

      folderBrowser.folderView.enterContainer(103409);

    });

    it('is the previous node and has not rendered back control ', function (done) {
      expect(folderBrowser.folderView.$el.find(backButtonSel).length).toBeGreaterThan(0);
      expect(context.getObject(NodeModelFactory).get("id")).toBe(103409);

      folderBrowser.folderView.context.once("sync", function (args) {
        if (enableLog) {
          console.log("Got sync event for: " + context.getObject(NodeModelFactory).get("id"));
        }

        if (enableLog) {
          console.log("Performing final checks.");
        }
        var currId = context.getObject(NodeModelFactory).get("id");
        expect(currId).toBe(101);
        expect(folderBrowser.folderView.$el.find(backButtonSel).length).toBe(0);
        done();
      });
      if (enableLog) {
        console.log("Before triggering click on back-button.");
      }
      var backButton = folderBrowser.folderView.$(".csui-toolitem > span.arrow_back");
      if (backButton != null) {
        if (enableLog) {
          console.log("Found backButton with length: " + backButton.length);
        }
        var toolItem = new ToolItemModel({
          signature: "Back",
          name: "Previous page",
          icon: "icon icon-back",               // some icon
          menuIcon: "icon icon-back-mobile",    // some mobile-icon
          type: 0                  // folder
        });

        var args = {
          toolItem: toolItem
        };
        folderBrowser.folderView.nodesTable.tableToolbarView._toolbarItemClicked(folderBrowser.folderView.nodesTable.tableToolbarView.toolbarView, args);

        if (enableLog) {
          console.log("After triggering click on back-button.");
        }
      } else {
        expect(backButton).toBeDefined("BackButton was not found in html page, is null. Unable to trigger button!");
      }

    });

  });

});
