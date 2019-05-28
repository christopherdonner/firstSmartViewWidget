# SignInView (controls/signin)

  Shows a Sign In view. On submit, a signin is tried using
  RequestAuthenticator (utils/requestauthenticator), addressing the url given in options. On
  successful authentication, a 'success' event is raised. Otherwise a 'failure' event is raised,
  and the view shows an error message along with setting an error state (marked input fields).
  Pressing enter while having focus in one of the input fields causes a submit. The submit button
   is disabled as long as the username field is empty. It is also disabled during
   the authentication operation.
   The following texts are localized: Placeholders of username and password input fields, text of
   submit button, error message.


### Example

    var contentRegion = new Marionette.Region({
          el: "#content"
        }),
        options = {
          connection: {
            url: 'api/v1',
            supportPath: '/alphasupport'
          }
        },
        control = new SignIn( options);

    control.render();
    control.on('success', function() {
      alert( "event 'success' raised.");
    });
    control.on('failure', function() {
      alert( "event 'failure' raised.");
    });
    contentRegion.show(control);

## Constructor Summary

### constructor(options)

  Creates a new SignInView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [SignInView](#) object for an example.

## Events Summary

## success(event)

The event is fired if the authentication against the connection was successful.

### Parameters
* `event` - *Object* The event object
* `event.username` - *String* The username used to sign in

## failure(event)

The event is fired if the authentication against the connection failed.

### Parameters
* `event` - *Object* The event object
* `event.username` - *String* The username used to sign in
* `event.error` - *Error* The error causing the authentication failure.

## Localizations Summary

The following localization keys are used

* `signinButtonText` -  for the submit button text
* `signinForgotPassword` - for the forgot password link
* `signinPlaceholderUsername` - for the username placeholder
* `signinPlaceholderPassword` - for the password placeholder
* `signinInvalidUsernameOrPassword` - for the failed login error message


