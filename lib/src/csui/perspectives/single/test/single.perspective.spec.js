/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/perspectives/single/single.perspective.view'
], function (_, SinglePerspectiveView) {

  describe('SinglePerspectiveView', function () {

    describe('given empty configuration', function () {

      var perspectiveView;

      beforeEach(function () {
        perspectiveView = new SinglePerspectiveView();
      });

      it('assigns right classes', function () {
        var className = perspectiveView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('cs-perspective');
        expect(classes).toContain('cs-single-perspective');
      });

      it('renders empty output', function () {
        expect(perspectiveView.$el.html()).toBe('');
      });

    });

  });

});
