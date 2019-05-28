/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/models/node/node.model',
  'csui/behaviors/default.action/impl/defaultaction'
], function (Backbone, NodeModel, DefaultActionController) {

  describe('DefaultActionController', function () {

    var defaultActionController;

    beforeEach(function () {
      defaultActionController = new DefaultActionController();
    });

    it('Commands to browse a container', function () {
      var node = new NodeModel({
            id: 1,
            type: 0,
            container: true,
            actions: [
              {signature: 'open'}
            ]
          }),
          action = defaultActionController.getAction(node);
      expect(action).toBeDefined();
      expect(action.get('signature')).toBe('OpenSpecificNodePerspective');
    });

    it('Commands to open a document', function () {
      var node = new NodeModel({
            id: 1,
            type: 144,
            mime_type: 'text/plain',
            actions: [
              {signature: 'download'}
            ]
          }),
          action = defaultActionController.getAction(node);
      expect(action).toBeDefined();
      expect(action.get('signature')).toBe('Open');
    });

    it('Commands to navigate to a URL', function () {
      var node = new Backbone.Model({
            id: 1,
            type: 140
          }),
          action = defaultActionController.getAction(node);
      expect(action).toBeDefined();
      expect(action.get('signature')).toBe('Navigate');
    });

  });

});
