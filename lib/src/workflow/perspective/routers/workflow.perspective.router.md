# Workflow Router

The workflow.perspective.router defines workflow specific URLs.
These URLs can be used in email notifications.

Currently the following URLs are defined

| URL                                                               |
|-------------------------------------------------------------------|
|\<host>/*app*/**processes**/\<process_id>/\<subprocess_id>/\<task_id>|


The string **processes** specifies the main entry point for the workflows.
The following path elements are parameter which are specifying a special workflow.

| Parameter    | Description                |
|--------------|----------------------------|
| process_id   | WorkId of the workflow     |
| subprocess_id| SubWorkID of the workflow  |
| task_id      | TaskID of the workflow     |

If another URL as the defined ones is activated the global workitem model is cleared, so that the view is reseted.
