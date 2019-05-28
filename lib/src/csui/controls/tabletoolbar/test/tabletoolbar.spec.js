/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/marionette",
  "csui/utils/log",
  "csui/utils/base",
  "csui/lib/backbone",
  "csui/utils/connector",
  "csui/utils/authenticator",
  'csui/models/node/node.model',
  "csui/models/nodes",
  'csui/controls/toolbar/toolitems.filtered.model',
  "csui/models/nodechildren",
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/children',
  'csui/models/node/node.addable.type.factory',
  'csui/widgets/nodestable/toolbaritems',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/utils/commands',
  'csui/controls/toolbar/toolbar.command.controller',
  './tabletoolbar.mock.data.js',
  "csui/helpers"
], function (module, $, _, Marionette, log, base, Backbone, Connector, Authenticator,
             NodeModel,
             NodeCollection,
             FilteredToolItemsCollection,
             NodeChildrenCollection,
             PageContext,
             ChildrenCollectionFactory,
             AddableTypeCollectionFactory,
             toolbarItems,
             TableToolbarView,
             commands,
             ToolbarCommandController,
             NodeCollectionMockData) {

  describe("TableToolbar", function () {
    var el, menuListEl, liFilter, liAdd, liProperties, liDownload, liShare, liDelete, liCopy;
    var tableToolbarView;
    var context;

    beforeEach(function (done) {
      tableToolbarView = undefined;

      NodeCollectionMockData.test65909.enable();

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
          },
          node: {
            attributes: {id: 65909}
          }
        }
      });
      var collection = context.getCollection(ChildrenCollectionFactory);
      var addableTypes = context.getCollection(AddableTypeCollectionFactory);
      var fetching = context.fetch()
        .then(function () {

          this.selectedNodes = new NodeCollection();
          var status = {
            nodes: this.selectedNodes,
            container: collection.node
          };

          var commandController = new ToolbarCommandController({commands: commands});
          tableToolbarView = new TableToolbarView({
            toolbarCommandController: commandController,
            toolbarItems: toolbarItems,
            addableTypes: addableTypes,
            collection: collection,
            context: context
          });

          $('body').append(tableToolbarView.$el);

          done();
        })
        .fail(function () {
          expect(fetching.state()).toBe('resolved', "Collection has not been fetched in time");
          done();
        });
    });

    afterEach(function () {
      NodeCollectionMockData.test65909.disable();
      $('body').empty();
    });

    it("can be instantiated", function () {
      expect(tableToolbarView instanceof TableToolbarView).toBeTruthy();
    });

    it("has all toolbars", function () {
      tableToolbarView.updateForSelectedChildren([]); // array with NodeModel
      tableToolbarView.render();
      tableToolbarView.trigger('show');

      var el = tableToolbarView.$el;
      var filterToolbarEl = el.find('.csui-filterToolbar');
      var addToolbarEl = el.find('.csui-addToolbar');
      var leftToolbarEl = el.find('.csui-leftToolbar');
      var rightToolbarEl = el.find('.csui-rightToolbar');
      expect(filterToolbarEl.length).toBeGreaterThan(0);
      expect(addToolbarEl.length).toBeGreaterThan(0);
      expect(leftToolbarEl.length).toBeGreaterThan(0);
      expect(rightToolbarEl.length).toBeGreaterThan(0);
    });

    it("has filter and add toolbar items", function (done) {

      tableToolbarView.render();

      tableToolbarView.on('show', function() {
        tableToolbarView.updateForSelectedChildren([]); // array with NodeModels

        var el = tableToolbarView.$el;
        var filterToolbarEl = el.find('.csui-filterToolbar');
        var menuListEl = filterToolbarEl.find('ul.csui-toolbar');
        expect(menuListEl.length).toBe(1);
        var liFilter = menuListEl.find('a.csui-toolitem');
        expect(liFilter.length).toBeGreaterThan(0);

        var addToolbarEl = el.find('.csui-addToolbar');
        menuListEl = addToolbarEl.find('ul.binf-dropdown-menu');
        var liAdd = menuListEl.find('a.csui-toolitem');
        expect(liAdd.length).toBeGreaterThan(0);

        done();
      });
      tableToolbarView.trigger('show');

    });

    xit("update its toolbar items after selecting more than one documents", function (done) {

      tableToolbarView.render();

      tableToolbarView.on('show', function() {
        var collection = context.getCollection(ChildrenCollectionFactory);
        var documentNodeModel = collection.find(function (node) {
          return node.get('type') === 144;
        });
        tableToolbarView.updateForSelectedChildren([documentNodeModel]); // array with NodeModels

        el = tableToolbarView.$el;
        var otherToolbarEl = el.find('.csui-otherToolbar');
        menuListEl = otherToolbarEl.find('ul');
        expect(menuListEl.length).toBeGreaterThan(0);
        liDownload = menuListEl.find('li#Download');
        expect(liDownload.length).toBeGreaterThan(0);
        liDelete = menuListEl.find('li#Delete');
        expect(liDelete.length).toBeGreaterThan(0);
        liCopy = menuListEl.find('li#Copy');
        expect(liCopy.length).toBeGreaterThan(0);
        var documentNodeModels = collection.filter(function (node) {
          return node.get('type') === 144;
        });
        expect(documentNodeModels.length).toBeGreaterThan(1);
        tableToolbarView.updateForSelectedChildren(documentNodeModels); // array with NodeModels

        el = tableToolbarView.$el;
        otherToolbarEl = el.find('.csui-otherToolbar');
        menuListEl = otherToolbarEl.find('ul');
        expect(menuListEl.length).toBeGreaterThan(0);
        liDownload = menuListEl.find('li#Download');
        expect(liDownload.length).toBe(0);  // no Download if multiple nodes are selected
        liShare = menuListEl.find('li#EmailLink');
        expect(liShare.length).toBeGreaterThan(0);
        liCopy = menuListEl.find('li#Copy');
        expect(liCopy.length).toBeGreaterThan(0);
        liProperties = menuListEl.find('li#Properties');
        expect(liProperties.length).toBeGreaterThan(0);

        done();
      });
      tableToolbarView.trigger('show');

    });

  });
});
