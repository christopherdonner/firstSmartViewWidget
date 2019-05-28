# OpenWorkItemCommand

The open work item opens the assigned work item in the standard (classic) or smart ui. Where the
work item is opened depends on the "workflow_open_in_smart_ui" property.

The command is registering for the 'workitem:sendon' event from the WorkItemModel.
If this event is triggered the current node is destroyed 
and the collection is reloaded.
The destroy is done, so that the workflow disappears immediately from the list,
because the reload could take some time.