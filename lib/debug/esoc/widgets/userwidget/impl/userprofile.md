# User Profile

This module provides the ability to perform the different operations for user. User can
view/edit general information, followers and activity of followers, following and activity of
following users ,activity of that user and settings of that user.

user can also view other user information, but other user settings will not be displayed for
logged in user. If the pulse(social) module is disabled then only general information will
be displayed, other information related to followers, following,activity and settings will not be
displayed.

## User profile can be integrated for both userName and userProfilePic using user widget view


### Example:
var userProfileEle = $("#userprofilename"),
    userProfilePicEle = $("#userprofilepic"),
   userNameRegion = new Marionette.Region({el:"#userprofilename"}),
   userProfilePicRegion = new Marionette.Region({el:"#userprofilepic"});

      require(['esoc/controls/userwidget/userwidget.view'], function (UserWidgetView) {
        var defaultOptions = {
          userid: options.userid,
          context: options.context,
          showUserProfileLink: true,
          showMiniProfile: true,
          connector: options.connector
        };
        var userProfileOptions = _.extend({
          baseElement: userProfileEle
        }, defaultOptions);
        var userWidgetView = new UserWidgetView(userProfileOptions);
        userNameRegion.show(self.userWidgetView);
        var userProfilePicOptions = _.extend({
          baseElement: userProfilePicEle,
          showUserWidgetFor: 'profilepic'
        }, defaultOptions);
        var userWidgetView = new UserWidgetView(userProfilePicOptions);
        userProfilePicRegion.show(userWidgetView);
      });



## Register a custom tab in user profile maximised view

Custom tab registration is performed by adding a new rule
pointing to the esoc user profile (Registered custom tabs are shown at the end).
The rule is an object literal with properties:

### Rule properties

####tabName
this property is required. The shortName of the tab which is used to form id and class names for
custom
 tab

####tabDisplayName
This property is required. Localized string which displays in the tab panel view

####tabContentView
This view is rendered when this custom tab is active.

####tabCount
This property is optional if the customTab needs to show any count then in this property add object
with function which returns the count
{ getItemCount: function(model, options){return count} }. otherwise do not add this property.

####showTab
This property is optional. this function has two parameters and need to return the boolean value.
If the return value is true then tab is visible otherwise it will not be visible.

### Examples

Register custom tab by creating a module exporting its reference:

```
define(['module/userprofilecustomTab/custom.tab.view', 'i18n!module/nls/lang'],
function (CustomTabView, lang) {
  'use strict';

  return [
    {
      tabName: "customTab",
      tabDisplayName: lang.customTabName,
      tabContentView: CustomTabView,
      showTab: function(model, options){      // this property is optional. need to return boolean
        return true;                          //  value to show tab. By default it will show the
                                                // tab if the property is not present
      },
      tabCount: {        //this property is required only if the tab needs to show any count.
        getItemCount: function(model,options){
          return count;
        }
      }
    }
    ];
});
```
if the custom tab do not need to show the count then
return [
    {
      tabName: "customTab",
      tabDisplayName: lang.customTabName,
      tabContentView: CustomTabView,
    }
   ];
 tabCount property should not present.

To allow custom tab view elements to be navigable using keyboard , follow below steps.
After rendering of custom tab view, trigger view:shown event on the view.
  Ex: view.trigger("view:shown");
  // If 'this' refers required view then this.trigger("view:shown") also fine.

Modules with custom tab have to be registered as extensions of the
`esoc/widgets/userprofile/tab.extension` module in the module
extension file.  For example, the module above is packaged as
`wiki/utils/tab.extension` and the `wiki-extensions.json` file refers
to it:

```json
{
  "esoc/widgets/userprofile/tab.extension": {
    "extensions": {
      "wiki": [
        "wiki/utils/tab.extension"
      ]
    }
  }
}
```
