/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/utils/contexts/page/page.context',
  'csui/perspectives/tabbed-flow/tabbed-flow.perspective.view'
], function (_, PageContext, TabbedFlowPerspectiveView) {

  describe('TabbedFlowPerspectiveView', function () {

    describe('given empty configuration', function () {

      var context, perspectiveView;

      beforeEach(function () {
        if (!context) {
          context = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        perspectiveView = new TabbedFlowPerspectiveView({
          context: context
        });
      });

      it('assigns right classes', function () {
        var className = perspectiveView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('cs-perspective');
        expect(classes).toContain('cs-tabbed-perspective');
      });

      it('renders empty output', function () {
        expect(perspectiveView.$el.html()).toBe('');
      });

    });

  });

});
