/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require([
      "module",
      "csui/lib/jquery",
      "csui/lib/underscore",
      "csui/lib/marionette",
      "csui/utils/log",
      "csui/utils/base",
      "csui/lib/backbone",
      "csui/widgets/nodestable/nodestable.view",
      'csui/utils/contexts/page/page.context',
      './thumbnail.mock.js'
    ], function (module, $, _, Marionette, log, base, Backbone, NodesTableView, PageContext, mock) {
      mock.enable();
      var config = module.config();
      _.defaults(config, {
        enableGridView: true
      });
      var el = $("#content");
      var nodeIdCustomColumns = 2000;
      var pageSize = 30;

      var context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: nodeIdCustomColumns}
          }
        }
      });

      var options = {
        context: context,
        data: {
          pageSize: pageSize
        }
      };

      var nodesTableWidget = new NodesTableView(options);
      nodesTableWidget.render(); // must call for context.fetch because render requests the models in context

      context.fetch().then(function () {
        el.append(nodesTableWidget.el);
        nodesTableWidget.triggerMethod('show'); // triggers the marionette show event
      });
    }
);
