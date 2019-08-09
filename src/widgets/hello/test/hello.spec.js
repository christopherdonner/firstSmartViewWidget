define(['csui/utils/contexts/page/page.context',
  'greet/widgets/hello/hello.view', './hello.mock.js'
], function (PageContext, HelloView, HelloMock) {

  describe('WidgetHelloView', function () {

    beforeEach(function () {
      // Make sure that the server connection is mocked in the test specs
      HelloMock.enable();
    });

    afterEach(function () {
      // Remove the mocks not to interfere with other test specs
      HelloMock.disable();
    });

    describe('given a server connection with the person to greet', function () {

      // Declare objects used in the checks
      var context, helloView;

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

        helloView = new HelloView({
          context: context
        });

        helloView.render();

        context
            .fetch()
            .done(done);
      }, 5000);

      it('creates a model with information about the person', function () {
        var model = helloView.model;
        expect(model).toBeDefined();
        var name = model.get('name');
        expect(name).toBe('jdoe');
      });

      it('marks the widget with the right CSS class', function () {
        expect(helloView.$el.hasClass('greet-hello')).toBeTruthy();
      });

      it('renders the greeting', function () {
        var innerText = helloView.$el.text();
        expect(innerText).not.toMatch(/Unnamed/);
      });

    });

  });

});
