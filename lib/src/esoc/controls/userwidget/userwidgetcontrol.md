# userwidget.view (esoc/controls/userwidget/userwidget.view)

  Extend this view to get UserWidget capability for a custom template.

### Example user widget configuration

  csui.onReady(['esoc/controls/userwidget/userwidget.view', 'csui/lib/marionette',
        'csui/utils/contexts/page/page.context','csui/utils/connector','<path>/custom.hbs'],
        function (UserWidgetControl, Marionette, PageContext, Connector, CustomTemplate) {
          var pageContext          = new PageContext(),
              options       = {
                connector: new Connector({
                  connection: {
                    url: '//server/OTCS/livelink/api/v1',
                    supportPath: '/img',
                    crossDomain: true
                  }
                }),
                context: pageContext,
                userid: "1000", // mandatory
                showUserProfileLink: true, //Optional, default: false
                showMiniProfile: true, //Optional, default: false
                showUserWidgetFor: 'displayname', //Optional
                loggedUserId: "1000", // optional
                //Provide a wrapper class to override css for both profile pic and display name
                userWidgetWrapperClass: ""//Optional, default: blank
              },
              CustomUserWidgetView = UserWidgetControl.extend({
                template: CustomTemplate,
                constructor: function CustomUserWidgetView(options) {
                  options || (options = {});
                  UserWidgetControl.prototype.constructor.apply(this, arguments);
                }
              }),
              userwidgetviewInstance      = new
                              CustomUserWidgetView(options),
              userwidgetRegion     = new Marionette.Region({
                el: "<placeholder>"
              });
          userwidgetRegion.show(CustomUserWidgetView);
        }
  );

#### Parameters:
`options` - Object*
`options.userid` - String* userid for which the userwidget will be created.
`options.context` - Object* page context instance.
`options.model` - Object* optional parameter.It should be a Model from members api call.If passed
    this model will be honored else members api call is hit to fetch the corresponding model of
    the given userid.
`options.showUserProfileLink` - Boolean* optional parameter and default value is false. If set to
    true then clicking on user name opens user's full profile as a dialog.
`options.showMiniProfile` - Boolean* optional parameter and default value is false. If set to
    true then hovering on user name shows user's mini profile as a popover.
`options.loggedUserId` - String* loggedUserId is optional if the logged-in user information is
    present in the context (as context.getModel(UserModelFactory).get('id')), otherwise it is
    mandatory.
`options.showUserWidgetFor` - String* optional parameter.If not set userwidget is shown for
    username.If set to 'profilepic' user widget is shown for profile picture.
 `options.userWidgetWrapperClass` - String* optional parameter and default value is blank.Custom class can be set through this option

--------------------
NOTE:
--------------------
Add "esoc-user-mini-profile" class to custom template to get miniprofile on hover
Add "esoc-user-profile-link" class to custom template to get userprofile on click

Please ensure that "title" attribute is not added to the element to which user widget is
configured as this causes the user widget view distortion.
To set the title to that element add the attribute after the user widget is rendered.