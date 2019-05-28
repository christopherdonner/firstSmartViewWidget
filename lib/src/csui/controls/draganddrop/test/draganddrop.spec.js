/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/contexts/page/page.context',
  './draganddrop.mock.js', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.addable.type.factory', 'csui/controls/draganddrop/draganddrop.view',
  'csui/widgets/nodestable/nodestable.view', 'csui/controls/globalmessage/globalmessage',
  'csui/lib/jquery.simulate'
], function (_, $, PageContext, dragAndDropMock, NodeModelFactory,
    AddableTypeCollectionFactory, DragAndDropView, NodesTableView,
    GlobalMessage) {
  'use strict';

  xdescribe('DragAndDropView', function () {

    var context;

    beforeEach(function () {
      dragAndDropMock.enable();

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
            attributes: {id: 2000}
          }
        }
      });
    });

    afterEach(function () {
      dragAndDropMock.disable();
    });

    describe('test drag events', function () {

      var nodesTableWidget;

      beforeEach(function (done) {
        $('body').empty();

        var options = {
          context: context,
          data: {pageSize: 20}
        };

        nodesTableWidget = new NodesTableView(options);
        nodesTableWidget.render();

        GlobalMessage.setMessageRegionView(nodesTableWidget);

        context.fetch()
          .then(function() {
            $(document.body).append(nodesTableWidget.el);
            nodesTableWidget.triggerMethod('show');
            done();
          });
      });

      afterEach(function () {
        $('body').empty();
      });

      it('test dragover/dragleave tableview adds/removes border to' +
          ' csui-child-container', function (done) {
        $('.csui-table-tableview').trigger('dragover');
        expect(nodesTableWidget.$el.find('.csui-table-tableview').attr('class')).toContain('drag-over');
        $('.csui-table-tableview').trigger('dragleave');
        nodesTableWidget.dragNDrop.on('drag:leave', function () {
          expect(nodesTableWidget.$el.find('.csui-table-tableview').attr('class')).not.toContain('drag-over');
          done();
        });
      });

      it('test drop table gets registered', function () {
          var files = [];
          $('.csui-table-tableview').trigger('dragover');
          nodesTableWidget.$el.find('.csui-table-tableview').trigger('drop', files);
          expect(nodesTableWidget.$el.find('.csui-table-tableview').attr('class')).not.toContain('drag-over');
      });

    });

    it('can be created and destroyed without rendering', function () {
      var node = context.getModel(NodeModelFactory),
          addableTypes = context.getCollection(AddableTypeCollectionFactory),
          view = new DragAndDropView({
            container: node,
            addableTypes: addableTypes
          });
      view.destroy();
    });

  });

});
