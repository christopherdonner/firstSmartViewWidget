/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/perspectives/left-center-right/left-center-right.perspective.view'
], function (_, LeftCenterRightPerspectiveView) {

  describe('LeftCenterRightPerspectiveView', function () {

    describe('given empty configuration', function () {

      var perspectiveView;

      beforeEach(function () {
        perspectiveView = new LeftCenterRightPerspectiveView();
      });

      it('assigns right classes', function () {
        var className = perspectiveView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('cs-perspective');
        expect(classes).toContain('cs-left-center-right-perspective');
      });

      it('renders empty output', function () {
        expect(perspectiveView.$el.html()).toBe('');
      });

    });

  });

});
