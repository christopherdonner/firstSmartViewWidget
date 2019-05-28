/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['webreports/widgets/tilereport/tilereport.view',
	'csui/utils/contexts/page/page.context'
], function (TileReportView,
			 PageContext ) {
  describe('TileReportView', function () {

    it('can be constructed', function () {

		var context = new PageContext(),
			view = new TileReportView({
				data: {
					  title: 'Simple Tile',
					  scroll: false,
					  header: false,
					  id: 18588
				  },
				  context: context
	  		});

      expect(view instanceof TileReportView).toBeTruthy();
    });

  });

});