/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/controls/list/simpletreelist.view",
  "csui/utils/connector",
  "csui/lib/jquery.simulate"
], function ($, _, Backbone, Marionette, SimpleTreeListView, Connector) {

  describe("The SimpleTreeList Control", function () {

    var w, treeCollection;

    it("can be instantiated and rendered without any parameters", function () {

      w = new SimpleTreeListView();
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      w.destroy();

    });

    it("with empty collection", function () {

      treeCollection = new Backbone.Collection();

      w = new SimpleTreeListView({collection: treeCollection});
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      w.destroy();

    });

    it("with the collection", function () {

      var connection = {
            url: "//server/otcs/cs/api/v1",
            supportPath: "/otcssupport"
          },
          connector  = new Connector({
            connection: connection
          });
      treeCollection = new Backbone.Collection([
        {
          id: 11112,
          name: "Tree List Node 1 - Favorite Group",
          type: -1,
          icon: "mime_fav_group32"
        },
        {
          id: 11113,
          name: "Tree List Node 2 - Folder",
          type: 0,
          icon: "mime_folder"
        },
        {
          id: 11114,
          name: "Tree List Node 3 - PDF",
          type: 144,
          mime_type: "application/pdf",
          icon: "mime_pdf"
        },
        {
          id: 11115,
          name: "Tree List Node 4 - No Icon",
          type: 0
        },
        {
          id: 11116,
          name: "Tree List Node 5 - Folder with super long name to see truncation",
          type: 0,
          icon: "mime_folder"
        }
      ]);
      var i;
      for (i = 0; i < treeCollection.length; i++) {
        treeCollection.models[i].connector = connector;
      }
      treeCollection.models[0].childrenCollection = new Backbone.Collection([
        {
          id: 111121,
          name: "Tree List Leaf 1 - Folder",
          type: 0,
          icon: "mime_folder"
        },
        {
          id: 111122,
          name: "Tree List Leaf 2 - PDF",
          type: 144,
          mime_type: "application/pdf",
          icon: "mime_pdf"
        },
        {
          id: 111123,
          name: "Tree List Leaf 3 - Folder with super long name to see truncation",
          type: 0,
          icon: "mime_folder"
        }
      ]);
      for (i = 0; i < treeCollection.models[0].childrenCollection.length; i++) {
        treeCollection.models[0].childrenCollection.models[i].connector = connector;
      }

      w = new SimpleTreeListView({collection: treeCollection});
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.$('.cs-simpletreelistitem').length).toEqual(5);
      expect($(w.$('.cs-simpletreelistitem')[0]).find('.cs-list-group a').length).toEqual(3);

      w.destroy();

    });

  });

});
