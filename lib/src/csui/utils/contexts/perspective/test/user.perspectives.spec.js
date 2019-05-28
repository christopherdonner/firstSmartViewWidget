/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

window.csui.require.config({
  config: {
    'csui/utils/contexts/perspective/landing.perspectives': {
      'extensions': {
        'test': [
          'test.landing.perspectives'
        ]
      }
    }
  }
});

define('test.landing.perspectives', [], function () {
  return [
    {
      equals: {group_id: 123},
      module: 'json!test.user.perspective.json'
    }
  ];
});

define(['csui/lib/backbone',
  'csui/utils/contexts/perspective/landing.perspectives'
], function (Backbone, userPerspectives) {
  'use strict';

  describe('UserPerspectives', function () {
    if (!window.require) {
      return it('Modules are loaded too early in the release mode.');
    }

    it('chooses the default landing page by default', function () {
      var user = new Backbone.Model(),
          perspective = userPerspectives.findByUser(user);
      expect(perspective.get('module')).toEqual('json!csui/utils/contexts/perspective/impl/perspectives/user.json');
    });

    it('chooses a custom landing page if user rules match', function () {
      var user = new Backbone.Model({group_id: 123}),
          perspective = userPerspectives.findByUser(user);
      expect(perspective.get('module')).toEqual('json!test.user.perspective.json');
    });

  });

});
