/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/children',
  'csui/models/node/node.model',
  'csui/models/nodes',
  "csui/controls/table/table.view",
  'csui/controls/table/table.columns',
  'csui/behaviors/default.action/impl/defaultaction',
  './table.mock.data.js',
  'csui/lib/jquery.mockjax',
  'css!csui/themes/carbonfiber/theme',
  'css!csui/controls/table/impl/table',
  'css!csui/widgets/nodestable/impl/nodestable'
], function (module, $, _,
    Marionette,
    PageContext,
    ConnectorFactory,
    ChildrenCollectionFactory,
    NodeModel,
    NodeCollection,
    TableView,
    tableColumns,
    DefaultActionController,
    mock,
    mockjax) {

  xdescribe("TableView", function () {

    var tableViewControl, context, connector, collection, delayedActionsLoaded;

    beforeAll(function () {
      mockjax.publishHandlers();
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    beforeEach(function (done) {
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
            attributes: {id: 183718}
          }
        }
      });

      connector = context.getObject(ConnectorFactory);
      var defaultActionController = new DefaultActionController();
      var commands           = defaultActionController.commands,
          defaultActionItems = defaultActionController.actionItems;
      collection = context.getCollection(
          ChildrenCollectionFactory, {
            options: {
              commands: defaultActionController.commands,
              defaultActionCommands: defaultActionItems.getAllCommandSignatures(commands),
              delayRestCommands: true
            }
          });

      delayedActionsLoaded = false;
      collection.delayedActions.once('sync', function () {
        delayedActionsLoaded = true;
      });

      tableViewControl = new TableView({
        collection: collection,
        tableColumns: tableColumns.deepClone(), // table.view needs columns
        columnsWithSearch: ["name"],
        context: context
      });

      var rendered;
      tableViewControl.on('csui-ready', function () {
        if (collection.length && tableViewControl.columns.length) {
          if (rendered) {
            setTimeout(done);
          } else {
            rendered = true;
          }
        }
      });

      var el = $('<div style="width: 960px;height: 500px">');
      $(document.body)
        .empty()
        .append(el);

      var target = new Marionette.Region({el: el});
      target.show(tableViewControl);

      context.fetch();
    });

    afterEach(function () {
      tableViewControl.destroy();
      $(document.body).empty();
    });

    it('can be instantiated', function () {
      expect(tableViewControl instanceof TableView).toBeTruthy();
    });

    function showSearchInput() {
      tableViewControl.triggerMethod('dom:refresh');
      expect(tableViewControl.collection.length).toBeGreaterThan(0);
      expect(tableViewControl.searchBoxes).toBeDefined();
      expect(tableViewControl.searchBoxes.length).toBe(1);
      var sbView = tableViewControl.searchBoxes[0];
      sbView.showSearchInput();

      var searchIconDiv = sbView.$el.find('.csui-table-search-icon');
      var searchInput = sbView.$el.find('input');
      expect(searchInput.length).toBe(1);
      expect(searchIconDiv.length).toBe(1);
      return searchIconDiv;
    }

    function testSearchElementsNotOverflowing() {
      var searchIconDiv = showSearchInput();

      var searchIconDivDomEl = searchIconDiv[0];
      var searchDiv = searchIconDivDomEl.offsetParent;
      var searchInputEl = $(searchDiv).find('input')[0];
      var iconElOffsetRight = searchIconDivDomEl.offsetLeft + searchIconDivDomEl.offsetWidth;
      var searchDivRight = searchDiv.clientLeft + searchDiv.clientWidth;
      expect(searchDivRight).toBeGreaterThan(iconElOffsetRight);
      var inputElOffsetRight = searchInputEl.offsetLeft + searchInputEl.offsetWidth;
      expect(searchDivRight).toBeGreaterThan(inputElOffsetRight);
    }

    function testSearchDivNotOverflowing() {
      var searchIconDiv = showSearchInput();
      var searchIconDivDomEl = searchIconDiv[0];
      var searchDiv = searchIconDivDomEl.parentElement;
      var searchDivOffsetRight = searchDiv.offsetLeft + searchDiv.offsetWidth;
      var searchDivParentOffsetRight = searchDiv.parentElement.offsetLeft +
                                       searchDiv.parentElement.offsetWidth;

      expect(searchDivParentOffsetRight).toBeGreaterThanOrEqual(searchDivOffsetRight);
    }

    it('Search view is completely visible when name filter is opened', function () {
      testSearchDivNotOverflowing();
    });

    it('Search input field and magnifier glass are completely visible when name filter is opened',
        function () {
          testSearchElementsNotOverflowing();
        }
    );

    it('Search view is completely visible when name filter is opened' +
       ' even on a small browser width', function () {
      tableViewControl.$el.width('600px');
      testSearchDivNotOverflowing();
    });

    it('Search input field and magnifier glass are completely visible when name filter is opened' +
       ' even on a small browser width', function () {
      tableViewControl.$el.width('510px');
      testSearchElementsNotOverflowing();
    });

    it('HTML element for name uses full width of outer td', function () {
      var tdEls = tableViewControl.$('table>tbody>tr:first-child>td.csui-table-cell-name');
      expect(tdEls.length).toBe(1);
      var td$El = $(tdEls[0]);
      var tdWidth = td$El.width();
      expect(tdWidth).toBeGreaterThan(0);
      var nameValueEls = td$El.find('.csui-table-cell-name-value');
      expect(nameValueEls.length).toBe(1);
      var nameValue$El = $(nameValueEls[0]);
      var nameValueWidth = nameValue$El.width();
      var rootEls = $(":root");
      var tdWidthWithoutPadding = tdWidth;
      expect(nameValueWidth).toBe(tdWidthWithoutPadding);
    });

    it("has the right name in the first row", function () {
      var txt = tableViewControl.$('table>tbody>tr:first-child>td:nth-child(3)').text();
      var i = txt.indexOf("Grindex");
      expect(i > -1).toBeTruthy();
    });

    it("shows the sorting indicator (ascending) in the name column", function () {
      var cols = tableViewControl.$('table>thead>tr:first-child>th');
      expect($(cols[2]).hasClass('sorting_asc')).toBeTruthy();
    });

    it("shows the sorting indicator (descending) in the name column after clicking it",
        function (done) {

          tableViewControl.on('render', function () {
            var cols = tableViewControl.$('table>thead>tr:first-child>th');
            var nameCol = $(cols[2]);
            var iconSpans = nameCol.find('span.csui-sort-arrow');
            expect(iconSpans.length).toBe(1);
            var iconSpan = $(iconSpans[0]);
            var hasSortingDescClass = iconSpan.hasClass('icon-sortArrowDown');
            expect(hasSortingDescClass).toBeTruthy();
            done();
          });

          var cols = tableViewControl.$('table>thead>tr:first-child>th');
          var e = $(cols[2]).find('span.csui-sort-arrow');
          var iconSpan = $(e[0]);
          expect(e.length).toBe(1);
          var hasSortingArrowUpClass = iconSpan.hasClass('icon-sortArrowUp');
          expect(hasSortingArrowUpClass).toBeTruthy();
          $(cols[2]).click();
        }
    );

    it("displays no inline edit form when the edit icon was not clicked", function () {
      var cellEditorEl = tableViewControl.$('div.csui-td-content-edit');
      expect(cellEditorEl.length).toBe(0);
    });

    it("displays the inline edit form", function (done) {
      var node;
      var collection = context.getCollection(ChildrenCollectionFactory);
      expect(collection.length).toBeGreaterThan(0);
      node = collection.at(0);
      tableViewControl.startInlineFormForEdit(node);

      var inlineFormEl = tableViewControl.$('table>tbody>tr>td>div.csui-inlineform');
      expect(inlineFormEl.length).toBe(1);
      var inputEl = $(inlineFormEl[0]).find('input');
      expect(inputEl.length).toBe(1);
      var val = $(inputEl[0]).val();
      expect(val).toMatch(node.get('name'));
      var saveButtonEl = $(inlineFormEl[0]).find('button.csui-btn-save');
      expect(saveButtonEl.length).toBe(0);
      var cancelButtonEl = $(inlineFormEl[0]).find('button.csui-btn-cancel');
      expect(cancelButtonEl.length).toBe(0);
      var cancelEditButtonEl = $(inlineFormEl[0]).find('button.csui-btn-edit-cancel');
      expect(cancelEditButtonEl.length).toBe(1);
      done();
    });

    it("re-renders without inline edit form when the edit was canceled", function (done) {
      var collection = context.getCollection(ChildrenCollectionFactory);
      expect(collection.length).toBeGreaterThan(0);
      var node = collection.at(0);
      tableViewControl.startInlineFormForEdit(node);

      var inlineFormEl = tableViewControl.$('table>tbody>tr>td>div.csui-inlineform');
      expect(inlineFormEl.length).toBe(1);
      var inputEl = $(inlineFormEl[0]).find('input');
      expect(inputEl.length).toBe(1);
      var saveButtonEl = $(inlineFormEl[0]).find('button.csui-btn-save');
      expect(saveButtonEl.length).toBe(0);
      var cancelButtonEl = $(inlineFormEl[0]).find('button.csui-btn-cancel');
      expect(cancelButtonEl.length).toBe(0);
      var cancelEditButtonEl = $(inlineFormEl[0]).find('button.csui-btn-edit-cancel');
      expect(cancelEditButtonEl.length).toBe(1);
      cancelEditButtonEl.click();
      inlineFormEl = tableViewControl.$('table>tbody>tr>td>div.csui-inlineform');
      expect(inlineFormEl.length).toBe(0);
      done();
    });

    xit("when renaming, does not close the inline form before the node gets updated",
        function (done) {
          var node, renamed;

          expect(tableViewControl.collection.length).toBeGreaterThan(0);
          node = tableViewControl.collection.first();
          tableViewControl.once('render', function () {
            var destroyed;
            tableViewControl.activeInlineForm.on('destroy', function () {
              destroyed = true;
            });
            var inlineFormEl = tableViewControl.activeInlineForm.$('>form');
            var inputEl = inlineFormEl.find('>input');
            var val = inputEl.val();
            renamed = val += ' edited';
            inputEl.val(val);
            var callback2 = _.after(3, function () {
              expect(node.get('name')).toEqual(renamed);
              done();
            });

            node.once('request', function () {
              expect(destroyed).toBeFalsy();
              callback2();
            });

            collection.delayedActions.once('sync', callback2);
            tableViewControl.once('render', callback2);

            inlineFormEl.submit();  // table view will emit render and delayed actions a sync event
          });

          tableViewControl.startInlineFormForEdit(node);  // table view will emit a render event
        });

  });
});
