/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/children',
  'csui/utils/contexts/factories/node',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/models/nodeversions',
  'csui/controls/table/table.view',
  'csui/widgets/metadata/impl/versions/metadata.versions.columns',
  'csui/behaviors/default.action/impl/defaultaction',
  './version.table.mock.data.js',
  'csui/lib/jquery.mockjax',
  'css!csui/themes/carbonfiber/theme',
  'css!csui/controls/table/impl/table',
  'css!csui/widgets/nodestable/impl/nodestable'
], function (module, $, _,
    Marionette,
    PageContext,
    ConnectorFactory,
    ChildrenCollectionFactory,
    NodeModelFactory,
    NodeModel,
    NodeCollection,
    NodeVersionCollection,
    TableView,
    metadataVersionsColumns,
    DefaultActionController,
    mock,
    mockjax) {

  describe("TableView with Versions", function () {

    var tableViewControl, context, connector, collection;
    var originalTimeout;

    beforeAll(function () {
      mockjax.publishHandlers();
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    beforeEach(function (done) {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

      $('body').empty();
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
            attributes: {id: 244861}
          }
        }
      });
      var el = $('<div style="width: 740px;height: 500px">', {id: 'target'});

      connector = context.getObject(ConnectorFactory);
      var defaultActionController = new DefaultActionController();
      var commands = defaultActionController.commands;

      var node = context.getModel(NodeModelFactory);
      context.fetch().then(function () {
        collection = new NodeVersionCollection(undefined, {
          node: node,
          autoreset: true,
          expand: "user",
          commands: commands.getAllSignatures(),
          onlyClientSideDefinedColumns: true  // ignore columns sent by server
        });

        var options = {
          el: el,
          collection: collection,
          tableColumns: metadataVersionsColumns.deepClone(), // table.view needs columns
          columnsWithSearch: ["name"],
          context: context
        };

        tableViewControl = new TableView(options);
        collection.on("sync", function () {
          setTimeout(done, 100);
        });

        tableViewControl.render();

        $('body').append(el);
        tableViewControl.triggerMethod('show');

        collection.fetch();
      });
    });

    afterEach(function (done) {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;

      $('body').empty();
      done();
    });

    it('can be instantiated', function (done) {
      expect(tableViewControl instanceof TableView).toBeTruthy();
      done();
    });

    it("has the right name in the first row", function (done) {
      var txt = tableViewControl.$('table>tbody>tr:first-child>[data-csui-attribute=name]').text();
      var i = txt.indexOf("Abk5_let.xlsx");
      expect(i > -1).toBeTruthy();
      done();
    });

    it("shows the sorting indicator (ascending) in the name column", function (done) {
      var nameHeader = tableViewControl.$('table>thead>tr:first-child>[data-csui-attribute=name]');
      expect(nameHeader.hasClass('sorting_asc')).toBeTruthy();
      done();
    });

    function testRows(rowsToTest, allRows, done) {
      if (rowsToTest.length > 0) {
        var tr = rowsToTest.shift();
        var td = $('.csui-table-cell-_toggledetails', tr);
        expect(td.length).toBe(1);
        var a = $('.csui-table-cell-_toggledetails>a.expand-details-row-toggle', tr);
        expect(a.length).toBe(1);
        var nextTr = $(tr).next();
        expect(nextTr.length).toBe(1);
        var nextTrEl = $(nextTr[0]);
        expect(nextTrEl.hasClass('csui-details-row')).toBeTruthy();
        expect(nextTrEl.hasClass('binf-collapse')).toBeTruthy();
        $(nextTrEl).on('shown.binf.collapse', function () {
          expect(nextTrEl.hasClass('binf-collapse binf-in')).toBeTruthy();

          var expandedRows = 0;
          var collapsedRows = 0;
          _.each(allRows, function (row) {
            var detailsRow = $(row).next();
            if (detailsRow.hasClass('binf-collapse')) {
              if (detailsRow.hasClass('binf-in')) {
                expandedRows++;
              } else {
                collapsedRows++;
              }
            }
          });
          expect(collapsedRows + expandedRows).toBe(allRows.length);
          expect(expandedRows).toBe(1);

          $(nextTrEl).on('hidden.binf.collapse', function () {
            expect(nextTrEl.hasClass('binf-collapse')).toBeTruthy();
            var expandedRows = 0;
            var collapsedRows = 0;
            _.each(allRows, function (row) {
              var detailsRow = $(row).next();
              if (detailsRow.hasClass('binf-collapse')) {
                if (detailsRow.hasClass('binf-in')) {
                  expandedRows++;
                } else {
                  collapsedRows++;
                }
              }
            });
            expect(collapsedRows + expandedRows).toBe(allRows.length);
            expect(expandedRows).toBe(0);
            $(nextTrEl).off();
            testRows(rowsToTest, allRows, done);
          });
          a = $('.csui-table-cell-_toggledetails>a.expand-details-row-toggle', tr);
          expect(a.length).toBe(1);
          a.click();
        });
        a.click();
      } else {
        done();
      }
    }

    it("shows the expand/collapse button in the rows", function (done) {
      var rows = tableViewControl.$('table>tbody>tr.csui-has-details-row');
      expect(rows.length).toBe(60);
      var rowsToTest = _.toArray(rows).slice(0, 5);
      testRows(rowsToTest, _.clone(rowsToTest), function () {
        done();
      });
    });

  });
});
