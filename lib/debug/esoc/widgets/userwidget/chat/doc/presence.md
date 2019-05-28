# Presence (esoc/widgets/userwidget/chat/view/presence.view)

  Shows a user's chat presence status.

### Example

      var context = new PageContext(),
           presenceRegion = new Marionette.Region({
                el: "#placeholderId", // placeholder where to show respective presence icon
              }),
           presenceOptions = {
                id: unique identifier,//optional
                context: context,
                username: "<<user-login-name>>"
           },
           presenceView = new PresenceView(presenceOptions);
      presenceRegion.show(presenceView);

### constructor(options)

  Creates a new PresenceView.

#### Parameters:

* `presenceOptions.id` - String* unique identifier for which the presence will be shown.
* `presenceOptions.context` - Object* page context instance
* `presenceOptions.username` - String*  user-login-name for which the presence will be shown.