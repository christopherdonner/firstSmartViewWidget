/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/utils/contexts/page/page.context',
  'csui/perspectives/tabbed/tabbed.perspective.view'
], function (_, PageContext, TabbedPerspectiveView) {

  describe('TabbedPerspectiveView', function () {

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
        perspectiveView = new TabbedPerspectiveView({
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
