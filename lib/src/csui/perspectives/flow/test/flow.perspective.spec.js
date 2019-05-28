/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/perspectives/flow/flow.perspective.view'
], function (_, FlowPerspectiveView) {

  describe('FlowPerspectiveView', function () {

    describe('given empty configuration', function () {

      var perspectiveView;

      beforeEach(function () {
        perspectiveView = new FlowPerspectiveView();
      });

      it('assigns right classes', function () {
        var className = perspectiveView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('cs-perspective');
        expect(classes).toContain('cs-flow-perspective');
      });

      it('renders empty output', function () {
        expect(perspectiveView.$el.html()).toBe('');
      });

    });

  });

});
