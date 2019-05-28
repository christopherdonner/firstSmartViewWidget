# UserWidget (esoc/widgets/userwidget)

  Shows a UserWidget view for the given user id. 
  By default it displays the user's name.
  #sub views (can be enabled/disabled via widget options):
  Miniprofile View - On hovering user name, user's mini profile is shown as popover.
  Userprofile View- On clicking user name, user's full profile is opened as a dialog.

### Example user widget configuration

    csui.onReady(['esoc/widgets/userwidget', 'csui/utils/contexts/page/page.context'],
            function (UserWidget, PageContext) {
                var pageContext = new PageContext(),
                options = {
                            userid: "1000", // target user id
                            context: pageContext,
                            placeholder: "#placehodlerId",
                            showUserProfileLink: true, // enabling Userprofile View
                            showMiniProfile: true, // enabling Miniprofile View
                            loggedUserId: "2000", // current logged-in user id
                            showUserWidgetFor: 'profilepic', //available options : profilepic/displayname
                            userWidgetWrapperClass: "" // custom class name to override the default css
                        };
                UserWidget.getUser(options);
            }
    );

### getUser(options)

  Creates a user widget instance for the given user id.

#### Parameters:
`options` - Object* The options object to be sent to getUser method of UserWidget.
`options.userid` - String* userid for which the userwidget will be created.
`options.context` - Object* page context instance.
`options.placeholder` - String* placeholder id where the user widget should be placed.
`options.showUserProfileLink` - Boolean* optional parameter and default value is false. If set to
    true then clicking on user name opens user's full profile as a dialog.
`options.showMiniProfile` - Boolean* optional parameter and default value is false. If set to
    true then hovering on user name shows user's mini profile as a popover.
`options.loggedUserId` - String* loggedUserId is optional if the logged-in user information is
    present in the context (as context.getModel(UserModelFactory).get('id')), otherwise it is mandatory.
`options.showUserWidgetFor` - String* optional parameter.If not set userwidget is shown for
    username.If set to 'profilepic' user widget is shown for profile picture.
 `options.userWidgetWrapperClass` - String* optional parameter and default value is blank.Custom class can be set through this option
 `options.focusCallBack` - callback function* otional parameter and which is required for when closing a user profile dialog the focus should be on the element at which it was before opening the dialog or widget.