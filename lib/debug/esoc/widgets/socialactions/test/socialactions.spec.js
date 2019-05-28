csui.define(['csui/lib/underscore', 'csui/utils/connector', './socialactions.mock.js'
], function (_, Connector) {

  describe('Connect', function () {

    describe('given a server connection to get the comments', function () {

      // Declare objects used in the checks
      var connector;

      // Initialize the objects first here to enable ddescribe and iit
      // tricks; wait until the model gets fetched by the CS REST API
      // mock before any spec is executed
      beforeEach(function () {
        connector = new Connector({
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/otcssupport',
            session: {
              ticket: 'dummy'
            }
          }
        });
        
      });

      it('creates a model', function () {
       
      });

      it('marks the widget with the right CSS class', function () {
        
      });

      it('renders the view', function () {
        
      });


    });

  });

});
