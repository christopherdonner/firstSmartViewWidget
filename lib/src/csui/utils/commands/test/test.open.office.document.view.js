/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',                           // Cross-browser utility belt
  'csui/lib/marionette',                           // MVC application support
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/utils/contexts/factories/children',
  'csui/models/nodes',
  'csui/utils/commands/open',
  'csui/utils/commands/test/test.open.office.document.mock',
  'csui/lib/jquery.mockjax',
  'hbs!csui/utils/commands/test/test.open.office.document.view' // Template to render the HTML
], function ($, _, Marionette, PageContext, ConnectorFactory, DefaultActionController,
    ChildrenCollectionFactory, NodeCollection, OpenCommand, mock, mockjax, template) {
  var TestOpenOfficeDocumentView = Marionette.ItemView.extend({

    template: template,
    ui: {
      allButtons: 'button',
      openButtonExcel: '.csui-test-button-open-xls',
      openButtonPowerPoint: '.csui-test-button-open-ppt',
      openButtonPdf: '.csui-test-button-open-pdf',
      openButtonJpg: '.csui-test-button-open-jpg'
    },

    events: {
      'click @ui.openButtonExcel': 'openExcel',
      'click @ui.openButtonPowerPoint': 'openPowerPoint',
      'click @ui.openButtonPdf': 'openPdf',
      'click @ui.openButtonJpg': 'openJpg'
    },
    constructor: function TestOpenOfficeDocumentView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);

      var apiUrlBase = window.location.origin + '/otcs/cs';

      mockjax.publishHandlers();
      mock.enable(apiUrlBase);

      this.context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: apiUrlBase + '/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          },
          node: {
            attributes: {id: 205659}
          }
        }
      });

      this.connector = this.context.getObject(ConnectorFactory);
      var defaultActionController = new DefaultActionController();
      var commands           = defaultActionController.commands,
          defaultActionItems = defaultActionController.actionItems;
      this.collection = this.context.getCollection(
          ChildrenCollectionFactory, {
            options: {
              commands: defaultActionController.commands,
              defaultActionCommands: defaultActionItems.getAllCommandSignatures(commands),
              delayRestCommands: true
            }
          });

    },

    onRender: function () {
      this.ui.allButtons.prop('disabled', true);
      var self = this;
      this.context.fetch().then(function () {
        console.log("Context fetched");
        self.ui.allButtons.prop('disabled', false);
      });
    },

    openExcel: function() {
      this.openOfficeDocument(244861);
    },
    openPowerPoint: function() {
      this.openOfficeDocument(343248);
    },
    openPdf: function() {
      this.openOfficeDocument(297859);
    },
    openJpg: function() {
      this.openOfficeDocument(525928);
    },

    openOfficeDocument: function (nodeId) {
      var node = this.collection.findWhere({id: nodeId});
      var status = {nodes: new NodeCollection([node])};

      var command = new OpenCommand();
      var options = {context: this.context, originatingView: this};
      var promises = command.execute(status, options);
      if (!_.isArray(promises)) {
        promises = [promises];
      }
      return $.when
          .apply($, promises)
          .fail(function (error) {
            if (error) {
              console.log("ERROR", error);
            }
          });
    },

    setUserAgent: function (window, userAgent) {
      if (window.navigator.userAgent != userAgent) {
        var userAgentProp = {get: function () { return userAgent; }};
        try {
          Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
          window.navigator = Object.create(navigator, {
            userAgent: userAgentProp
          });
        }
      }
    }

  });

  return TestOpenOfficeDocumentView;

});
