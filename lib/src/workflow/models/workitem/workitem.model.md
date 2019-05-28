Workitem model
==============
> Only the documented attributes and functions are available for customizations.
> All other parts of the workitem model can change in the future!

The workitem model provides a client side data representation of a running workflow.
It also provides methods to execute actions on the server side.

## Supported actions

### sendAction
This method sends an action to the server for the current workitem.
The available actions are returned from the server and are stored in the model.

There are two different kind of actions.

* standard actions, `Send on`, `Send for review` and `Forward`
* custom actions, the defined dispositions for the current step in the workflow

All actions (standard and custom) are sending the workitem on to the next step or a different user,
so that the current model is no longer valid after the a successful `sendAction` call.
The server communication is asynchronous, so that the method immediately returns when the server call is started.
To get information when the server call returns the method returns a promise object. 
The returned promise is resolved in the case no error was returned from the server. If an error is returned the promise is rejected.
The caller of the method can react on the result of promise.

If the server returns no error the [`workitem:sendon`](#fired-events) event is fired to 
inform all listeners that the work item was sent on and this workitem is no longer valid.

### sendMemberAcceptAction
This methods accepts the current workitem for the current user.
This is necessary in the case a workflow was sent to a group and only one should work on it.

The method returns a promise object.
The returned promise will be resolved when the server call returns without error and the workitem was accepted for the current user.
In the case the server returns an error the promise is rejected and the parameter of the reject method is the response from the server.

## Fired events
The workitem model fires events to inform listeners about different actions

Currently the following event is defined

| Event name          | Description                                            |
|---------------------|--------------------------------------------------------|
| workitem:sendon     | This event is fired in the case a work item is sent on |



