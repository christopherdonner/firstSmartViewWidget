/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/utils/connector', 'csui/models/node/node.model',
  'csui/models/nodeancestors', './nodeancestors.mock.js'
], function (Backbone, Connector, NodeModel, NodeAncestorCollection, mock) {

  xdescribe("NodeAncestorCollection", function () {

    var ancestors;

    beforeAll(function (done) {
      var connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });

      mock.enable();

      var parent = new NodeModel({id: 2000}, {connector: connector});
      ancestors = new NodeAncestorCollection(undefined, {node: parent});
      ancestors
          .fetch()
          .done(done);
    });

    afterAll(function () {
      mock.disable();
    });

    it('assigns connector to ancestors, if the collection is connected', function () {
      expect(ancestors.length).toEqual(1);
      expect(ancestors.first().connector).toBeTruthy();
    });

    it('marks fetched ancestors, that they are containers', function () {
      expect(ancestors.length).toEqual(1);
      expect(ancestors.first().get('container')).toBeTruthy();
    });

  });

});
