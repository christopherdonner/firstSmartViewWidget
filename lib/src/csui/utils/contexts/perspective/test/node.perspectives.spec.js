/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

window.csui.require.config({
  config: {
    'csui/utils/contexts/perspective/node.perspectives': {
      'extensions': {
        'test': [
          'test.node.perspectives'
        ]
      }
    }
  }
});

define('test.node.perspectives', [], function () {
  return [
    {
      equals: {type: 123},
      module: 'json!test.node.perspective.json'
    }
  ];
});

define(['csui/lib/backbone',
  'csui/utils/contexts/perspective/node.perspectives'
], function (Backbone, nodePerspectives) {
  'use strict';

  describe('ModePerspectives', function () {

    it('chooses the metadata perspective by default', function () {
      var query = new Backbone.Model(),
          perspective = nodePerspectives.findByNode(query);
      expect(perspective.get('module')).toEqual('json!csui/utils/contexts/perspective/impl/perspectives/metadata.json');
    });

    it('chooses a custom perspective if node rules match', function () {
      var query = new Backbone.Model({type: 123}),
          perspective = nodePerspectives.findByNode(query);
      expect(perspective.get('module')).toEqual('json!test.node.perspective.json');
    });

  });

});
