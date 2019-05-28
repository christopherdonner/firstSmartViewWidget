# Widget Options Callback

If a widget needs to have computed values for any hidden options, it is possible to define a callback for each widget type.
Note that only *hidden* options can be updated via this mechanism.

Perspective Manager will look for a callback script in the widget's manifest here:
```javascript
attributes.manifest.callback
```
example:
```javascript
"callback": "csui/widgets/html.editor/widget.options.callback"
```

The manifest must also have one or more widget options defined which are 'hidden'. These are the values that will be updated by the callback. Note that the hidden options must be given the type "otcs_node_picker": this is to ensure that node ids are distinguishable from plain integers. (Perspective Manager stores node ids using a constant-replacement mechanism, so that e.g. perspectives can be transported between systems).
example:
```json
"manifest": { 
    "schema": {
        "properties": {
		    "wikiContainerId": {
                "title": "Wiki Container ID",
                "type": "integer"
            }
            "wikiPageId": {
                "title": "Wiki Page ID",
                "type": "integer"
             }
         }
    },
    "options": {
        "fields": {
		    "wikiContainerId": {
                "hidden": true,
				"type": "otcs_node_picker"				
            }
            "wikiPageId": {
                "hidden": true,
				"type": "otcs_node_picker"
            }
        }
    },
	"callback": "csui/widgets/html.editor/widget.options.callback"
}
```

For each widget type that has a callback defined, Perspective Manager will invoke the methods below. Any valid options returned when the promise is resolved will be added to the perspective. Any errors returned when the promise is rejected will be shown in the Perspective Manager user interface.
The first method invoked can be used to ensure an asset container is present before assets (such as a wiki) are created. The second method invoked is intended to allow developers to set common options for all widgets of the same type, before setting individual options for each instance of the widget type.
For example, if a container must be created first, this is done within the defineWidgetOptionsCommon() method. If a node needs to be created for each widget instance, this is done in the defineWidgetOptionsEach() method.

### Methods of a callback

ensureContainer(parameters) : boolean
: This method returns true if an asset container should be created in the Perspective Assets Volume. The asset container will be named uniquely, based on a timestamp.
If this function returns false (or is omitted) - the parent id for any assets created is assumed to be the same as the container to which the perspective orverride is applied.
This is not possible where the perspective is a landing page or global override, as there is no container context. The example callback below shows a simple test for this case.

defineWidgetOptionsCommon(parameters) : promise
: This method is invoked once a container has been ensured. It will be called once only, on the first instance of the widget encountered in the perspective. It returns a promise which must be resolved or rejected before the defineWidgetOptionsEach() method is invoked.

defineWidgetOptionsEach(widget, parameters) : promise
: Following the above method's resolution, Perspective Manager will iterate through each instance of the widget within the perspective, invoking this method. The widget argument is an object defining the widget options, and also the widgetBaseLocation which can be used as a unique identifier (see below).

The 'parameters' argument has the following structure:
```javascript
{
    mode: 'create', // STRING: 'create' || 'update'
    connector: object, // OBJECT: CSUI connector object	
    widgets: array, // ARRAY: array of widget definition objects (see below for example)
	previousWidgets: array, // ARRAY: array of widget definition objects corresponding to the perspective as it was before edits were made
    settings: object // OBJECT containing some of the perspective's general settings (as shown in Perspective Manager's Code Editor)
}
```
A widget definition object (in the widgets array above) has the following structure:
```javascript
{	
    widget: {	// JSON object containing the widget definition from the perspective JSON (as shown in Perspective Manager's Code Editor)
		c_id: 'widget_1234567890', // STRING The widget definition object is extended with a client-side unique id 'c_id'. Note that this id is not stored with the perspective, but is useful for comparing 'previousWidgets' array with current 'widgets' array.
	}, 
    widgetBaseLocation: 'string' // The JSON Pointer notation path to the widget's location within the perspective JSON structure 
}
```
parameters.settings has the following structure:
```javascript
{
    containerType: -1, // INTEGER: Subtype of the container type that the perspective will apply to (e.g. folder,binder etc.) -1 is 'all types'
	assetContainerId: 12345, // INTEGER: The ID of the container where the perspective will be created (e.g. the Perspective Assets Volume, or the container the override is applied to)
	overrideObjId: 12345, // INTEGER: The ID of the NODE container that the perspective overrides
	overrideType: 'landingpage', // STRING: either 'landingpage' or 'genericcontainer'
	perspectiveParentId: 196, // INTEGER: The ID of the container or volume where the perspective node will be created (usually the perspectives volume)
	priority: 2, // INTEGER: priority of perspective override, relevant where multiple overrides exist
	scope: 'global', // STRING: either 'global' or 'local'. If 'global', overrideObjId is likely undefined, but is irrelevant in any case
	title: 'My perspective' // STRING: name of perspective
}
```


### Example
This is a simplified example.
```javascript
define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone'], function ($, _, Backbone) {
    'use strict';

    function WidgetOptionsCallback() {}

    _.extend(WidgetOptionsCallback.prototype, {

        ensureContainer: function(parameters) {
            // called by getHiddenWidgetOptions()
            // takes the parameters provided to getHiddenWidgetOptions()
            // returns true if container needs to be created in assets volume

            if (parameters.settings.overrideType === 'landingpage' || parameters.settings.scope === 'global') {
                return true;
            }
            else {
                return false;
            }
        },

        defineWidgetOptionsCommon: function (parameters) {
            // called by getHiddenWidgetOptions()
            // takes the parameters provided to getHiddenWidgetOptions()
            // returns a promise, with any common options to be applied to all widgets
            var commonOptions = {},
                connector = parameters.connector,
                ticket = connector.connection.session.ticket,
                baseURL = connector.connection.url,
                deferredCommon = $.Deferred();

            // Create wiki node
            $.ajax({
                beforeSend: function (request) {
                    request.setRequestHeader("OTCSTicket", ticket);
                },
                type: "POST",
                url: baseURL + '/nodes',
                data: {
                    type: 5573,
                    parent_id: parameters.settings.assetContainerId,
                    name: "NewWiki"
                },
                success: function (response) {

                    _.extend(commonOptions, {
                        // any option properties that are common to all widgets go here
                        wikiContainerId: response.id
                    });

                    deferredCommon.resolve(commonOptions);

                },
                error: function (error) {
                    deferredCommon.reject(error);
                }
            });
            return deferredCommon.promise();

        },

        defineWidgetOptionsEach: function(widget,parameters) {
            // takes a widget definition object and the parameters provided to getHiddenWidgetOptions()
            // returns a widget definition object
            var newOptions = {},
                connector = parameters.connector,
                ticket = connector.connection.session.ticket,
                baseURL = connector.connection.url,
                deferredEach = $.Deferred();

            // Create wikiPage
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("OTCSTicket", ticket);
                },
                type: "POST",
                url: baseURL + '/nodes',
                data: {
                    type: 5574,
                    parent_id: widget.newOptions.wikiContainerId,
                    name: "NewWikiPage_"+ _.now(),
                    TextField: "your content goes here",
                    mime_type: "text/html"
                },
                success: function(response) {

                    _.extend(newOptions, {
                        wikiPageId: response.id
                    });

                    deferredEach.resolve(newOptions);

                },
                error: function(error) {
                    deferredEach.reject(error);
                }
            });

            return deferredEach.promise();
        }

    });

    return WidgetOptionsCallback;

});

});
```

