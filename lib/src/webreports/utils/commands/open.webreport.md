# Open WebReport Command

**Module: webreports/utils/commands/open.webreport**
open.webreport.js is the default action when a user clicks on a WebReport node in a List View.  
It invokes the /webreports/controls/run.webreport.pre/run.webreport.pre.controller to determine if the WebReport that is being executed has any Prompt Parameters that are supported in the SmartUI, as well as the Destination settings for the WebReport node.
If the WebReport has any SmartUI-supported prompt parameters, a promptView is shown.  
When the user submits the Prompt form OR if the WebReport does not have any prompt parameters, the action is handed over to the open.classic.webreport command, which opens a new tab and executes the WebReport in the classicUI.


See /csui/utils/commands/commands.md for more general info.

### Licensing

Although it is installed as part of core Content Server, WebReports is licensed separately. This component will only be available on an instance if you apply a valid WebReports license or if you install a licensed Content Server Application.
