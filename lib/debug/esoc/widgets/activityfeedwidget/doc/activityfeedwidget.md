# ActivityFeedWidgetView (esoc/widgets/activityfeedwidget)

  Shows a Activity view. The Activities view provides a list of Activities as given through the
  page context. Activities are filtered based on the params provided as options. Clicking on
  the expanded icon will show the expanded Activity view as dialog view.


### Example

      var contentRegion    = new Marionette.Region({el: '#content1'}),
                pageContext      = new PageContext(),
                options          = {
                  context: pageContext,
                  "title": "Activity Feed - All",
                  "feedsize": 10,
                  "wrapperClass": "hero",
                  "feedtype": "all",
                  "feedSettings": {
                    "enableComments": true,
                    "enableFilters": false
                  },
                  "honorfeedsource": false,
                  "headerView": false,
                  "feedsource": {"source":"all"},
                  "updatesfrom": {"from":"all"},
                  config_settings: {
                    'feedsAutoRefreshWait': 60000,
                    'maxMessageLength': 1000
                  }
                },
                activityFeedView = new ActivityFeedWidget(options);

            contentRegion.show(activityFeedView);
            pageContext.fetch();

### constructor(options)

  Creates a new ActivityFeedView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.
#Activity Feed Settings parameters:
* `options.feedsize` - *number* no. of items to be fetched and shown.
* `options.feedtype` - *string* type of activities to be fetched and shown. Default value is
    "all". Other available options are "content/status/attribute" and we can pass combination of
    these 3 with comma as a delimiter (eg:{"source":"status,content"}).
* `options.feedSettings` - *object* feed settings to honor feed level settings at front-end.
    Available options are "enableComments" and "enableFilters".
    * `options.feedSettings.enableComments` - *Boolean* decides whether we have to show the
        comment button or not. Default value is true.
    * `options.feedSettings.enableFilters` - *Boolean* decides whether we have to show the
        filter panel at left side in expand view only. Default value is false.
* `options.honorfeedsource` -  *Boolean* optional parameter and default value is false.
    true means it considers "pulsefrom" as feedsource value or if you want to consider
    perspective/widget options as feed source then set to false.
* `options.headerView` -  *Boolean* optional parameter and default value is false.
    true means it shows the feeds in horizontal view and with dark theme.
* `options.feedsource` - *object* activities of feed source to be fetched and shown. Default value
    is "all" and available options are "all/node/pulsefrom".
    * `options.feedsource.source` - *String*
       - If value is "all" then it considers system level feeds.
       - If value is "node" then it considers specific node level feeds and need to provide id of
       that node which is mandatory for this selection.
       - If value is "pulsefrom" then it considers specific node level and it's sub-sequent
       children's feeds and need to provide id which is mandatory for this selection.
    (eg:{"source":"node/pulsefrom","id":"<nodeid>"}).
* `options.updatesfrom` - *object* fetch the activities done by different user (like all,
    followers, etc.,) and below are the available options.
    "all/iamfollowing/myfollowers/following/followers/myupdates/mentions/myfavorites/user/group".
    * `options.updatesfrom.from` - *String*
      - If value is "all", then it shows all user's feeds and this is the default value.
      - If value is "iamfollowing", then it shows all following user's feeds of loggedin user along
        with his/her feeds.
      - If value is "myfollowers", then it shows all followers feeds of loggedin user along with
        his/her feeds.
      - If value is "following", then it shows all following user's feeds of given user. We need to
        provide "id" and it is mandatory.
      - If value is "followers", then it shows all followers feeds of given user. We need to provide
        "id" and it is mandatory.
        (eg:{"from":"following/followers","id":"<userid>"})
      - If value is "myupdates", then it shows only current logged-in user's feeds.
      - If value is "mentions", then it shows only current logged-in user's mention feeds.
      - If value is "myfavorites", then it shows current logged-in user's favorite item's feeds.
      - If value is "user", then it shows specific given user's feeds. We need to provide
        "id" and it is mandatory for this option.
      - If value is "group", then it shows specific given group's feeds. We need to provide
        "id" and it is mandatory for this option.
        (eg:{"from":"user/group","id":"<userid/groupid>"}).
* `options.config_settings` - *object* configuration settings to be consider, if not provided
    then it will consider server level config settings.
* Note: all options are not mandatory by default.

#### Returns:

  The newly created object instance.

#### Example:
  Activity Feed as Tile View:
  - refer index.html (esoc/widgets/activityfeedwidget/test/index.html)

## Localizations Summary

The following localization keys are used
* `title` -  for the widget's title