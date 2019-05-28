/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/marionette",
  "csui/controls/listitem/listitemstandard.view",
  "csui/lib/jquery.simulate"
], function ($, _, Marionette, StandardListItem) {


  describe("The ListItemStandard Control", function () {
    var sTitle = 'testTitle';
    var sIcon = "binf-glyphicon-folder-close";

    var w;

    beforeEach(function () {
      if (!w) {
        w = new StandardListItem({
          name: sTitle,
          icon: sIcon
        });
      }
    });

    it("can be instantiated and rendered", function () {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
    });

    it("has a configurable title", function () {

      expect(w.$('span.list-item-title').html()).toEqual(sTitle);

    });

    it("has a configurable icon", function () {
      var $iconSpan = w.$('span.csui-icon');
      expect($iconSpan[0].classList.length).toBeGreaterThan(1);
      expect($iconSpan.hasClass(sIcon)).toBeTruthy();

    });

    it("raises click:item event when clicked", function (done) {

      var bTriggered = false;

      w.on('click:item', function () {
        bTriggered = true; // has been called
        expect(bTriggered).toBeTruthy();
        done();
      });

      w.$el.simulate('click');

    });

  });

});
