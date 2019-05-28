/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/list/simplelist.view',
  './list.mock.data.js'
], function ($, _, Marionette, SimpleListView) {

  describe('SimpleListView Control', function () {
    it('tests', function () {
      var f = new SimpleListView();
      expect(f).toBeDefined();
    });
  });
});
