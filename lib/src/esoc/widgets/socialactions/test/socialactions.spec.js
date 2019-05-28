/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/connector', './socialactions.mock.js'
], function (_, Connector) {

  describe('Connect', function () {

    describe('given a server connection to get the comments', function () {
      var connector;
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
