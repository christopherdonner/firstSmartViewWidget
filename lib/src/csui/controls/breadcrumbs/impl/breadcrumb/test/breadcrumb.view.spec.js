/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/backbone', 'csui/utils/connector',
  'csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view'
], function (Backbone, Connector, BreadcrumbView) {

  describe("BreadcrumbView", function () {

    var connector;

    beforeAll(function () {
      connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
    });

    it('renders URL of the target container in the href attribute of the link',
        function () {
          var ancestor = new Backbone.Model({
            container: true,
            id: 2000,
            name: 'Enterprise',
            parent_id: -1,
            type: 141,
            type_name: 'Enterprise Workspace',
            volume_id: -2000
          });
          connector.assignTo(ancestor);

          var breadcrumbView = new BreadcrumbView({
            model: ancestor
          });
          breadcrumbView.render();

          var href = breadcrumbView.$el.find('a').attr('href');
          expect(href.lastIndexOf('nodes/2000')).toBeGreaterThan(0);
        });

  });

});
