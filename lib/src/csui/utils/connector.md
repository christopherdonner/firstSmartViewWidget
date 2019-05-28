 
  Package: util/connector
  =======================

  This module contains a utility object for the Content Server
  connection - <Connector>.
 


  Class: Connector
  ================

  Utility object for the Content Server connection.

  Widgets create this object internally to establish a connection to
  the Content Server, but it can be created and passed to the widget
  from the client code too, if there are multiple widgets on the page
  and they should share the same server connection.
 
  Example:

    (start code)
    // Ensure initialization of the framework.
    csui.onReady(function() {

      // Specify the server connection settings.
      var connection = {
            url: "//server/otcs/cs/api/v1",
            supportPath: "/otcssupport"
          },
      // Create the server connecting object.
          connector = new csui.util.Connector({
            connection: connection
          }),
      // Pass the connector to a widget.
          folderbrowser = new csui.widget.FolderBrowserWidget({
            connector: connector,
            start: {id: 2000}
          }),
       // Display the widget.
      folderbrowser.show({placeholder: '#target'});
      
    });
    (end)
 

// Group: Constructor
// ==================

 
   Constructor: constructor
   ------------------------
  
   Creates a new connector instance.
 
   Parameters:
   
     options - object literal with initial settings

   Properties of `options`:
       connection  - object with the API url and other parameters of
                     the server connection
       headers     - object with HTTP headers to add to every request
 
   Properties of `connection`:
     url         - string pointing to the URL root of the REST API, for example:
                   //server/otcs/cs/api/v1/
     supportPath - string with the URL path to the static resources, usually
                   the CGI path with the "support" suffix: "/otcssupport" here
                   //server/otcs/cs/api/v1/
     session     - object with `ticket` property containing a string obtained
                   from the server to authenticate the API requests
     credentials - object with `username`, `password` and `domain` properties
                   to authenticate the API requests with
     authenticationHeaders - object with properties for HTTP headers which are
                             provide the authentication information

   The minimum connection settings include the `url` and `supportPath`
   properties.  The authentication will take place interactively as soon
   as the first server call will take place:

     (start code)
     connection: {
       url: '//server/otcs/cs/api/v1',
       supportPath: '/otcssupport'
     }
     (end)

   The connection settings can contain an access token (ticket) to use
   an already pre-authenticated session.  The ticket can be obtained by
   the `/auth` API request handler:

     (start code)
     connection: {
       url: '//server/otcs/cs/api/v1',
       supportPath: '/otcssupport',
       session: {
         ticket: '...'
       }
     }
     (end)

   The connection settings can also contain user credentials for
   the automatic authentication:

     (start code)
     connection: {
       url: '//server/otcs/cs/api/v1',
       supportPath: '/otcssupport',
       credentials: {
         username: 'guest',
         password: 'opentext',
         domain: '' // optional
       }
     }
     (end)

   At last, the connection settings can contain HTTP headers which
   are acepted by a server side login callback to authenticate the
   API request:

     (start code)
     connection: {
       url: '//server/otcs/cs/api/v1',
       supportPath: '/otcssupport',
       authenticationHeaders: {
         OTDSTicket: '...'
       }
     }
     (end)

   Returns:
   
     The newly created object instance.
     
   Example:

     See the <Connector> object for an example.
 
