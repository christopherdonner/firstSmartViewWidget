# Workitem Extension Controller

The workitem extension controller object is the base object for the workflow extensions in the Smart UI.

The controller object has no state, only the context is provided to the constructor and saved in the controller object.
The workflow specific information is provided for each method, so that an instance could be reused between 
different workflows.

## Extension interface
The `WorkItemExtensionController` defines the following methods.

| Method     | Return value | Description                           |
|------------|--------------|---------------------------------------|
| validate   | Boolean      | Validates the controller for the given data package type and sub type |
| execute    | Promise      | Execute method for the controller.    |
|executeAction|Promise      | executeAction method for the controller


### validate
The validate method is called for each available data package type and each extension point.
The parameters for the method are the type and subtype value of the data package type.
The method returns `true` if the controller is responsible for the data package otherwise `false`.

### execute
The execute method is called for each extension point.

The parameters for the method are the current extension point, the workitem model, the data for the data package and the parentView.


    options = {
        extensionPoint: WorkItemExtensionController.ExtensionPoints.AddForm,
        model: this.model,
        data: dataPackage.data,
        parentView: this
    };


The values for the extension point parameter are defined below.

- The extension point parameter is a pre defined value which indicates the place for the extension.
  
- The workitem model represents the workflow in the SmartUI application. 
  The model defines the client side interface to interact with the workflow. It provides access to the workflow data and fires events about workflow actions.
  
- The data for the data package comes from the server.
  The server side data package implementation has to prepare this data in the method `GetRESTServiceData` or `GetStartRESTServiceData` of 
  `WFMAIN::WFObjectTypes::WFDataTypes`.
  If the data package does not implement this method, the data will not be included in the json response of the processes REST service and
  the extension is not loaded.

- The parentView is the view in which the extension will be loaded. This property is currently only for internal use.

The method has to return a promise object, so that the loading view could react on the asynchronous result.
The returned promise has to be resolved when the data for the view is available. 
The arguments of the `done` method must contain properties dependent from the selected extension point (See table).
The location in the widget where the view will be displayed is defined with the `extensionPoint` parameter.

In the case an error occurs during loading the information for the extension, the promise must be rejected.
The argument for the reject should contain a property `errorMsg`. This property is added to the global localized error message
about the failed loading of the extension.

#### Available extension points
The `WorkItemExtensionController` object contains an object `ExtensionPoints` which has all available extension points defined as members.
Currently the following integration points are defined and supported:

| Extension point | Description                                                              | Properties 				 |
|-----------------|--------------------------------------------------------------------------|---------------------|
| AddForm         | Show an additional view in the forms area, below the defined forms.      | viewToShow 			   |
| AddSidebar      | Shows an additional tab in the tabpanel view in the right side bar.			 | title							 |
|						      |																					                                 | viewToRender        |
|						      |																					                                 | viewToRenderOptions |
|						      |																					                                 | position					 	 |
| FullView        | Replace the standard workitem view with a complete custom view.          | viewToShow	 				 |

| Arguments				| 
|-----------------------------------------------------------------------------------------------------------------------------------------------	
| viewToShow			| View which will be shown in the workitem view.
| title					| The title\caption to display in the tab of the tabpanel.
| viewToRender			| A marionette view as class object, the tabpanel instantiates the view itself 
| viewToRenderOptions	| The options the marionette view needs to be instantiated
| position				| Defines the order of the tabs, position 1 and 2 are already set and can't be used

For all extension points: The arguments are extended automatically in the 'done' method with
the fields 'type' and 'sub_type' containing the value of the data package 'type' and
'sub_type'.


### executeAction
The executeAction method is called for each extension point.
This method is called with options:
| Backbone.Model ActionModel | object actionOptions | Backbone.Model WorkItemModel |

The method has to return in the resolve options:
| string 'scope' | object 'data' |

The method is called before any action (like Send On, Send for Review...) is
handled in cs.worklfow.ui.

When scope is 'custom' from the object 'data' a BackBone.Model is automatically created. Then
_sendOnWorkitem is called with this Backbone.Model as parameter.

If scope isn't 'custom' the action is handled from cs.workflow.ui.

To stop any handling of the action return fail.

Data can be changed only by one extension, therefore the WorkItemModel contains now the attribute
 task with the properties type and sub_type, so a extension can register on a specific task



## Registering extensions

The workflow extension are registered like the other extensions in the bundles extension json file.

To register the workflow extension add the following section to the extension json file and adjust the require.js path
to the location of the extensions controller object.
 

    "workflow/widgets/workitem/workitem.view": {
        "extensions": {
            "workflow": [
                "require.js path to the extensions controller object"
            ]
        }
    }

After a restart of the Content Server the json files are loaded and the extension is registered.

## Writing extensions

To write an extension for the workflow Smart View widget different modules are necessary.

1. Implementing the `GetStartRESTServiceData` and `GetRESTServiceData` methods from `WFMAIN::WFObjectTypes::WFDataTypes` in the data package OSpace
2. Implementing an extension controller by inheriting the `WorkItemExtensionController`
3. Add the extension controller to the bundle extension json file
