# WorkItemProperties

The work item properties view is a layout view.
The view contains two regions
* WorkItem message (*message.view*) <br>
  In the cases of forward, send for review or send for review return the entered comment is shown in this view.
  
* WorkItem instructions (*workitem.instructions.view*)<br>
  The workflow step instructions are shown.
  In the case the instrctions are empty the workitem.insctions.view is rendered but with not 
  content.
  
* WorkItem forms (*FormsView*)<br>
  The workflow properties are shown which are defined for this step in the workflow designer.
  In the workflow designer multiple sections can be defined. Each section will be shown in its own
  FormView (*form.view*). All sections / forms will be shown as a Marionette CollectionView.
  
* WorkItem extensions <br>
  Below the forms region an extensions region is added to this view. This region will be filled with a view
  returned from an workitem extension. How the workitems extensions 
  are working are described in the `workitem.extensions.controller.md` file in the `utils` directory.
