/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/controls/listitem/simpletreelistitem.view",
  "csui/utils/connector",
  "csui/lib/jquery.simulate"
], function ($, _, Backbone, Marionette, SimpleTreeListItemView, Connector) {

  describe("The SimpleTreeListItem Control", function () {

    var w, treeModel, nodeName, bTriggered;

    it("can be instantiated and rendered without any parameters", function () {

      w = new SimpleTreeListItemView();
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      expect(w.$('.cs-header').length).toEqual(1);
      expect(w.$('.cs-header .cs-title').length).toEqual(1);
      expect(w.$('.cs-header .dropdown-icon').length).toEqual(1);

      expect(w.$('.cs-content').length).toEqual(1);
      expect(w.$('.cs-content .cs-list-group').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-container').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-text').length).toEqual(1);
      expect(w.$('.cs-content .csui-no-result-message').text()).toEqual("No items.");

      w.destroy();

    });

    it("with the model and empty/no children collection", function () {

      nodeName = "Tree List with icon";
      treeModel = new Backbone.Model({
        id: 11111,
        icon: 'mime_fav_group32',
        name: nodeName
      });

      w = new SimpleTreeListItemView({model: treeModel});
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      expect(w.$('.cs-header').length).toEqual(1);
      expect(w.$('.cs-header .cs-title').html()).toEqual(nodeName);
      expect(w.$('.cs-header .mime_fav_group32').length).toEqual(1);

      expect(w.$('.cs-content').length).toEqual(1);
      expect(w.$('.cs-content').hasClass('binf-hidden')).toBeTruthy();
      expect(w.$('.cs-content .cs-list-group').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-container').length).toEqual(1);
      expect(w.$('.cs-content .cs-emptylist-container .cs-emptylist-text').length).toEqual(1);
      expect(w.$('.cs-content .csui-no-result-message').text()).toEqual("No items.");

      w.destroy();

    });

    it("with the model and children collection", function () {

      var itemName1 = "Tree List Item 1 Folder",
          itemName2 = "Tree List Item 2.pdf",
          itemName3 = "Tree List Item 4.doc";

      var childrenCollection = new Backbone.Collection([
        {id: 11112, name: itemName1, type: 0},
        {id: 11113, name: itemName2, type: 144, mime_type: "application/pdf"},
        {id: 11114, name: itemName3, type: 144, mime_type: "application/msword"}
      ]);
      var connection = {
        url: "//server/otcs/cs/api/v1",
        supportPath: "/otcssupport"
      };
      var connector = new Connector({connection: connection});
      var i;
      for (i = 0; i < childrenCollection.length; i++) {
        childrenCollection.models[i].connector = connector;
      }
      var treeModel = new Backbone.Model({
        id: 11111,
        icon: 'mime_fav_group32',
        name: "Tree List with icon"
      });
      treeModel.childrenCollection = childrenCollection;

      w = new SimpleTreeListItemView({model: treeModel});
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();

      expect(w.$('.cs-header').length).toEqual(1);
      expect(w.$('.cs-header .cs-title').html()).toEqual(nodeName);
      expect(w.$('.cs-header .mime_fav_group32').length).toEqual(1);

      expect(w.$('.cs-content').length).toEqual(1);
      expect(w.$('.cs-content').hasClass('binf-hidden')).toBeTruthy();
      expect(w.$('.cs-content .cs-list-group').length).toEqual(1);
      expect(w.$('.cs-content .cs-list-group').children().length).toEqual(3);
      expect(w.$('.cs-content .binf-list-group-item .csui-icon').length).toEqual(3);
      expect($(w.$('.cs-content .list-item-title')[0]).html()).toEqual(itemName1);
      expect(w.$('.cs-content .binf-list-group-item .csui-icon.mime_pdf').length).toEqual(1);
      expect($(w.$('.cs-content .list-item-title')[1]).html()).toEqual(itemName2);
      expect(w.$('.cs-content .binf-list-group-item .csui-icon.mime_word').length).toEqual(1);
      expect($(w.$('.cs-content .list-item-title')[2]).html()).toEqual(itemName3);

    });

    it("opens the subtree and raises event when click on the tree node", function (done) {

      bTriggered = false;

      w.on('click:tree:header', function () {
        bTriggered = true; // has been called
        expect(bTriggered).toBeTruthy();
        expect(w.$('.cs-content').hasClass('binf-hidden')).toBeFalsy();
        done();
      });

      w.$('.cs-header').simulate('click');

    });

    it("raises childview:click:item event when click on the tree leaf item", function (done) {

      bTriggered = false;

      w.on('childview:click:item', function () {
        bTriggered = true; // has been called
        expect(bTriggered).toBeTruthy();
        done();
      });

      $(w.$('.cs-content .cs-list-group a')[0]).simulate('click');

      w.destroy();

    });

  });

});
