NavigationHeaderControls
========================

The navigation header:
 
* Hosts header controls.
* Shows the company logo. 

The navigation header can be configured using the extension point
"csui/widgets/navigation.header/navigation.header".

Positioning Company Logo
------------------------

The *location* of the logo can be set to "left", "center" (default), "right" or "none" 
(hidden).

For examaple, move the logo to the left:

    require.config({
      config: {
        'csui/widgets/navigation.header/navigation.header.controls': {
          logo: {
            location: 'left'
          }
        }
      }
    })

Hiding Header Controls
----------------------

Header controls can be hidden by masking off their identifiers. The *whitelist* will 
enable only specified controls and disable all the other. The *blacklist* will disable 
the specified controls and let the others enabled.

The following header controls are available:

* "csui/widgets/navigation.header/controls/help/help.view",
* "csui/widgets/navigation.header/controls/home/home.view",
* "csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view",
* "csui/widgets/navigation.header/controls/search/search.view"
* "csui/widgets/navigation.header/controls/favorites/favorites.view"
* "csui/widgets/navigation.header/controls/user.profile/user.profile.view"

For example, hide the Help button, show the others:

    require.config({
      config: {
        'csui/widgets/navigation.header/navigation.header.controls': {
          masks: {
            myscenario: {
              blacklist: [
                'csui/widgets/navigation.header/controls/help/help.view',
              ]
            }
          }
        }
      }
    })

For example, show only buttons Home, Breadcrumbs and User Profile:

    require.config({
      config: {
        'csui/widgets/navigation.header/navigation.header.controls': {
          masks: {
            myscenario: {
              whitelist: [
                'csui/widgets/navigation.header/controls/home/home.view',
                'csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',
                'csui/widgets/navigation.header/controls/user.profile/user.profile.view'
              ]
            }
          }
        }
      }
    })
