/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/tile/tile.view'
], function (TileView) {

  describe('TileView', function () {

    it('can be constructed', function () {
      var view = new TileView();
      expect(view instanceof TileView).toBeTruthy();
    });

  });

});
