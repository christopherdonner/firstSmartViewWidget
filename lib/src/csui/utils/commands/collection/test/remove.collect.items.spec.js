/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/collection/remove.collected.items',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage',
  "../../../testutils/async.test.utils.js",
  './mock.collect.items.js',
  'csui/lib/binf/js/binf'
], function (Marionette, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, RemoveCollectedItemsCommand, commands, GlobalMessage, asyncTestUtils, mock) {
  'use strict';

  describe('Remove items from collect Command', function () {

    var removeCollectedItemsCommand, context, connector;

    beforeAll(function () {

      mock.enable();

      removeCollectedItemsCommand = commands.get('RemoveCollectedItems');
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
      connector = context.getObject(ConnectorFactory);
    });

    afterAll(function () {
      $('body').empty();
      mock.disable();
    });

    it('can be constructed', function () {
      var helloCommand = new RemoveCollectedItemsCommand();
      expect(helloCommand instanceof RemoveCollectedItemsCommand).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(RemoveCollectedItemsCommand).toBeDefined();
    });

    it('signature is "RemoveCollectedItems"', function () {
      expect(removeCollectedItemsCommand.get('signature')).toEqual('RemoveCollectedItems');
    });

    it('scope is multiple', function () {
      expect(removeCollectedItemsCommand.get('scope')).toEqual('multiple');
    });

    describe('eanble based on permitted actions', function () {
      it('gets enabled for permitted action \'removefromcollection\'', function (done) {
        var node                = new NodeModel({id: 2007}, {connector: connector}),
            collectionContainer = new NodeModel({
              id: 5001,
              container: true,
              type: 298
            }, {connector: connector});
        node
            .fetch()
            .done(function () {
              var nodeChildern = new NodeCollection([node]),
                  removeItems  = new NodeCollection([node]),
                  status       = {
                    context: context,
                    nodes: removeItems,
                    container: collectionContainer,
                    collection: nodeChildern
                  };
              expect(node.actions.first().get('signature')).toEqual('removefromcollection');
              expect(removeCollectedItemsCommand.enabled(status)).toBeTruthy();
            })
            .done(done);
      }, 5000);

      it('does not get enabled for if node actions doesnot have \'removefromcollection\'',
          function () {
            var node                = new NodeModel({id: 2003, type: 0, container: true},
                {connector: connector}),
                nodeChildern        = new NodeCollection([node]),
                removeItems         = new NodeCollection([node]),
                collectionContainer = new NodeModel({
                  id: 5001,
                  container: true,
                  type: 298
                }, {connector: connector}),
                status              = {
                  context: context,
                  nodes: removeItems,
                  container: collectionContainer,
                  collection: nodeChildern
                };
            expect(removeCollectedItemsCommand.enabled(status)).toBeFalsy();
          });
    });

    describe('when executed with a node', function () {

      var messageLocation, node, status, collectionContainer, nodeChildern, removeItems,
          confirmationDialog;

      beforeAll(function () {
        messageLocation = new Marionette.View();
        messageLocation.render();
        messageLocation.$el.height("62px");
        messageLocation.trigger('before:show');
        messageLocation.$el.appendTo(document.body);
        messageLocation.trigger('show');
        GlobalMessage.setMessageRegionView(messageLocation);
      });

      afterAll(function () {
        messageLocation.destroy();
      });

      beforeEach(function () {
        node = new NodeModel({id: 2001}, {connector: connector});
        nodeChildern = new NodeCollection([node]);
        removeItems = new NodeCollection([node]);
        collectionContainer = new NodeModel({
          id: 5001,
          container: true,
          type: 298
        }, {connector: connector});
        status = {
          context: context,
          nodes: removeItems,
          container: collectionContainer,
          collection: nodeChildern
        };
      });

      xit('executes remove collected items command and shows confirmation dialog', function (done) {
        status.container = collectionContainer;
        removeCollectedItemsCommand.execute(status, {});
        asyncTestUtils.asyncElement($.fn.binf_modal.getDefaultContainer(),
            '.binf-modal-dialog .binf-modal-content')
            .done(function (el) {
              setTimeout(function () {
                confirmationDialog = el;
                expect(el.find('.question-header').length).toEqual(1);
                done();
              }, 20); // dialog transition time from quick-transitions.css
            });
      });

      xit(' click on no in confirmation dialog should cancel the remove operation', function (done) {
        var noButton = confirmationDialog.find(
            '.binf-modal-footer .csui-no');
        noButton.trigger('click');
        asyncTestUtils.asyncElement(confirmationDialog, '.binf-modal-dialog .question-header',
            true).done(function (el) {
          expect(el.length).toEqual(0);
          done();
        });
      });

      xit(' click on yes in confirmation dialog should remove item from collection',
          function (done) {
            var yesButton = confirmationDialog.find(
                '.binf-modal-footer .csui-yes');
            yesButton.trigger('click');
            asyncTestUtils.asyncElement(document.body, '.csui-global-message',
                true).done(function (el) {
              expect(el.length).toEqual(0);
              done();
            });
          });

    });

  });

});
