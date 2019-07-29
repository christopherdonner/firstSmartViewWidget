define(['csui/utils/contexts/page/page.context',
  'donner/widgets/.donner/.donner.view', './.donner.mock.js'
], function (PageContext, DonnerView, mock) {
  'use strict';

  describe('DonnerView', function () {
    beforeEach(function () {
      // Make sure that the server connection is mocked in the test specs
      mock.enable();
    });

    afterEach(function () {
      // Remove the mocks not to interfere with other test specs
      mock.disable();
    });

    describe('given a server connection with the person to greet', function () {

      // Declare objects used in the checks
      var context, view;

      // Initialize the objects first here to enable ddescribe and iit
      // tricks; wait until the model gets fetched by the CS REST API
      // mock before any spec is executed
      beforeEach(function (done) {
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

        view = new DonnerView({
          context: context
        });

        view.render();

        context
            .fetch()
            .done(done);
      }, 5000);

      it('creates a model with information about the person', function () {
        var model = view.model;
        expect(model).toBeDefined();
        var name = model.get('name');
        expect(name).toBe('jdoe');
      });

      it('marks the widget with the right CSS class', function () {
        expect(view.$el.hasClass('donner--donner')).toBeTruthy();
      });

      it('renders the greeting', function () {
        var innerText = view.$el.text();
        expect(innerText).not.toMatch(/Unnamed/);
      });

    });

  });

});
