/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/page/page.context',
  'csui/models/node/node.model',
  'csui/models/nodechildren',
  "csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view",
  "./metadatanavigation.mock.data.js"
], function ($, _, Backbone, Marionette, ConnectorFactory, PageContext, NodeModel,
    NodeChildrenCollection, MetadataNavigationView, mock) {

  describe("MetadataNavigationView Widget", function () {

    var context;

    beforeAll(function () {
      mock.enable();

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

    });

    afterAll(function () {
      mock.disable();
    });

    it("plain instantiation", function () {
      var f = new MetadataNavigationView({
        container: new Backbone.Model(),
        collection: new Backbone.Collection(),
        context: new PageContext(),
        data: {
          contentView: new Backbone.View()
        }
      });
      expect(f).toBeDefined();
    });

    it("instantiation from node", function () {
      var context      = new PageContext(),
          connector    = context.getObject(ConnectorFactory),
          node         = new NodeModel({id: 3001, name: 'Container'}, {connector: connector}),
          nodeChildren = new NodeChildrenCollection(undefined, {node: node, autoreset: true}),
          contentView  = new Backbone.View();

      var f = new MetadataNavigationView({
        container: node,
        collection: nodeChildren,
        data: {
          contentView: contentView
        }
      });

      expect(f).toBeDefined();

    });

    it("check list and header", function (done) {
      var connector    = context.getObject(ConnectorFactory),
          node         = new NodeModel({id: 3001, name: 'Container'}, {connector: connector}),
          nodeChildren = new NodeChildrenCollection(undefined, {node: node, autoreset: true}),
          contentView  = new Backbone.View();

      var fetching = nodeChildren.fetch()
          .then(function () {
            var f = new MetadataNavigationView({
              container: node,
              collection: nodeChildren,
              data: {
                contentView: contentView
              }
            });

            expect(f).toBeDefined();

            f.render();
            f._showChildViews();
            expect(f.$el.find('.metadata-sidebar').length > 0).toBeTruthy();
            expect(f.$el.find('.cs-list-group').length > 0).toBeTruthy();
            expect(f.$el.find('.cs-list-group').children().length).toEqual(6);
            expect(f.$el.find('.cs-title').length > 0).toBeTruthy();
            expect(f.$el.find('.cs-title').html()).toEqual('Container');
            done();
          })
          .fail(function () {
            expect(fetching.state()).toBe('resolved', 'Data fetch timed out');
            done();
          });
    });

  });
  describe("MetadataItemNameView", function () {

    var context, metadataNavigationView, addMdnv;

    beforeAll(function (done) {
      mock.enable();
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

      var connector    = context.getObject(ConnectorFactory),
          node         = new NodeModel({id: 3001, name: 'Container'}, {connector: connector}),
          nodeChildren = new NodeChildrenCollection(undefined, {node: node, autoreset: true}),
          contentView  = new Backbone.View();
      addMdnv = $('<div id="content-mdnv"></div>');

      var fetching = nodeChildren.fetch()
          .then(function () {
            var collection = new Backbone.Collection();
            node = new NodeModel({id: 3001, name: 'Container'}, {connector: connector});
            collection.add(node);
            metadataNavigationView = new MetadataNavigationView({
              container: node,
              selected: node,
              collection: collection,
              context: new PageContext()
            });
            var contentRegion = new Marionette.Region({
              el: addMdnv.appendTo(document.body)
            });
            contentRegion.show(metadataNavigationView);
            done();
          });

    });

    afterAll(function () {
      mock.disable();
      addMdnv.remove();
    });

    it("should show toggle in ipad landscape resolution", function () {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 1280;
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      var toggleWrapper = $("#content-mdnv .csui-toggle-wrapper.binf-hidden");
      expect(toggleWrapper.length).toEqual(0);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("should show toggle in ipad portrait resolution", function () {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 768;
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      var toggleWrapper = $("#content-mdnv .csui-toggle-wrapper.binf-hidden");
      expect(toggleWrapper.length).toEqual(0);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("should show toggle in ipad landscape resolution", function () {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 1199;
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      var toggleWrapper = $("#content-mdnv .csui-toggle-wrapper.binf-hidden");
      expect(toggleWrapper.length).toEqual(0);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("should not show toggle in non ipad resolution", function () {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 1920;
      window.innerHeight = 1080;
      window.matchMedia = function (input) {
        if (input === "(orientation: portrait)") {
          return {matches: window.innerHeight > window.innerWidth};
        } else if (input === "(orientation: landscape)") {
          return {matches: window.innerWidth > window.innerHeight};
        }
      };
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      var toggleWrapper = $("#content-mdnv .csui-toggle-wrapper.binf-hidden");
      expect(toggleWrapper.length).toEqual(1);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("portrait by default hide side panel, display toggle & back button, click on toggle" +
       " should" +
       " show side panel", function (done) {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 483;
      window.innerHeight = 950;
      window.matchMedia = function (input) {
        if (input === "(orientation: portrait)") {
          return {matches: window.innerHeight > window.innerWidth};
        } else if (input === "(orientation: landscape)") {
          return {matches: window.innerWidth > window.innerHeight};
        }
      };
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
      expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeFalsy();
      setTimeout(function () {
        $("#content-mdnv .csui-metadata-listview")[0].click();
        expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
        expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeTruthy();
        expect($("#content-mdnv .cs-go-back").css('display')).toBe('none');
        done();
      }, 1000);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("click on toggle, side panel should be hidden, show back button in landscape mode",
        function (done) {
          var windowInnerWidth = window.innerWidth,
              wi               = window.matchMedia;
          var isLandscape = window.matchMedia("(orientation: landscape)").matches,
              isPortrait  = window.matchMedia("(orientation: portrait)").matches;
          window.innerWidth = 1280;
          window.innerHeight = 1080;
          window.matchMedia = function (input) {
            if (input === "(orientation: portrait)") {
              return {matches: window.innerHeight > window.innerWidth};
            } else if (input === "(orientation: landscape)") {
              return {matches: window.innerWidth > window.innerHeight};
            }
          };
          metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
          expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
          expect($("#content-mdnv .cs-go-back").css('display')).toBe('none');
          expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeTruthy();
          $("#content-mdnv .csui-metadata-listview")[0].click();
          setTimeout(function () {
            expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeFalsy();
            expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
            done();
          }, 1000);
          window.innerWidth = windowInnerWidth;
          window.matchMedia = wi;
        });

    it("should hide side panel on clicking enter on toggleIcon", function (done) {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 1180;
      window.innerHeight = 1080;
      window.matchMedia = function (input) {
        if (input === "(orientation: portrait)") {
          return {matches: window.innerHeight > window.innerWidth};
        } else if (input === "(orientation: landscape)") {
          return {matches: window.innerWidth > window.innerHeight};
        }
      };
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView.sideBarHidden = false;
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
      expect($("#content-mdnv .cs-go-back").css('display')).toBe('none');
      expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeTruthy();
      $("#content-mdnv .csui-metadata-listview").trigger({type: 'keydown', keyCode: 13});
      setTimeout(function () {
        expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeFalsy();
        expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
        done();
      }, 1000);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("should hide side panel on clicking spacebar on toggleIcon", function (done) {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 1198;
      window.innerHeight = 1080;
      window.matchMedia = function (input) {
        if (input === "(orientation: portrait)") {
          return {matches: window.innerHeight > window.innerWidth};
        } else if (input === "(orientation: landscape)") {
          return {matches: window.innerWidth > window.innerHeight};
        }
      };
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView.sideBarHidden = false;
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
      expect($("#content-mdnv .cs-go-back").css('display')).toBe('none');
      expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeTruthy();
      $("#content-mdnv .csui-metadata-listview").trigger({type: 'keydown', keyCode: 32});
      setTimeout(function () {
        expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeFalsy();
        expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
        done();
      }, 1000);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("portrait by default side panel is hidden, display toggle & back button, click enter on" +
       " toggle should show side panel", function (done) {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 483;
      window.innerHeight = 950;
      window.matchMedia = function (input) {
        if (input === "(orientation: portrait)") {
          return {matches: window.innerHeight > window.innerWidth};
        } else if (input === "(orientation: landscape)") {
          return {matches: window.innerWidth > window.innerHeight};
        }
      };
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
      expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeFalsy();
      setTimeout(function () {
        $("#content-mdnv .csui-metadata-listview").trigger({type: 'keydown', keyCode: 13});
        expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
        expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeTruthy();
        expect($("#content-mdnv .cs-go-back").css('display')).toBe('none');
        done();
      }, 1000);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

    it("portrait by default side panel is hidden, display toggle & back button, click spacebar on" +
       " toggle should show side panel", function (done) {
      var windowInnerWidth = window.innerWidth,
          wi               = window.matchMedia;
      var isLandscape = window.matchMedia("(orientation: landscape)").matches,
          isPortrait  = window.matchMedia("(orientation: portrait)").matches;
      window.innerWidth = 483;
      window.innerHeight = 950;
      window.matchMedia = function (input) {
        if (input === "(orientation: portrait)") {
          return {matches: window.innerHeight > window.innerWidth};
        } else if (input === "(orientation: landscape)") {
          return {matches: window.innerWidth > window.innerHeight};
        }
      };
      metadataNavigationView.mdv.metadataHeaderView.metadataItemNameView._setHideShowToggleButton();
      expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
      expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeFalsy();
      setTimeout(function () {
        $("#content-mdnv .csui-metadata-listview").trigger({type: 'keydown', keyCode: 32});
        expect($("#content-mdnv .csui-metadata-listview").is(':visible')).toBeTruthy();
        expect($("#content-mdnv .metadata-sidebar").is(':visible')).toBeTruthy();
        expect($("#content-mdnv .cs-go-back").css('display')).toBe('none');
        done();
      }, 1000);
      window.innerWidth = windowInnerWidth;
      window.matchMedia = wi;
    });

  });
});

