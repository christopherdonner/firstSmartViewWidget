DefaultActionBehavior
=====================

Helps implementing the click action for node links - finding the command
to execute on the click.

Concepts
--------

- default click action
- node action URL

If you click on a node (link) *inside the application context* -
within the Smart UI - the *default click action* will be triggered.
For example: opening the Document content, navigating to the URL
web address, drilling down to the Folder etc.  If no special action
has been defined for the node, the *node action URL* will opened,
which usually means switching the perspective.

If you click on a node link *outside the application context* -
in an e-mail, for example - the *node action URL* will be opened.
It means opening the node perspective.  If no perspective has been
assigned to the node explicitly, the "nodestable" perspective will
be opened for containers and "metadata" perspective for all other nodes.

Why the difference?  If you click on a link in an e-mail, you may want
to perfom some other action with the node, than the default one.  If
the Document content were downloaded immediately, you couldn't.  The node
action URL allows you to visit the node in the Smart UI first and then
execute some action.

Usage
-----

Make the HTML template ready for the hyperlink URL coming from the
view template data:

    <a href="{{url}}">{{name}}</a>

Provide the node action URL among other temmplate data:

    templateHelpers: function () {
      // The node to execute the default action for
      var node = ...;
      return {
        // Permissions or not, a node has always some URL to be opened with
        url: nodeLinks.getUrl(node)
      }
    }

Add the `DefaultActionBehavior` to the view object behaviour set:

    behaviors: {
      // Register the default action execution handler in this view
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    }

Listen to the click event on the hyperlink and trigger the default action
execution:

    events: {
      'click a': function (event) {
        // Do not navigate to the URL; it is there to bookmarking only
        event.preventDefault();
        // The node to execute the default action for
        var node = ...;
        // Trigger the default action execution handler registered in the
        // DefaultActionBehavior; if the action is disabled, it does nothing
        this.triggerMethod('execute:defaultAction', node);
      }
    }

If your view uses the linked node as its main model, you can shorten it:

    triggers: {
      // Trigger the default action execution handler registered in the
      // DefaultActionBehavior; if the action is disabled, it does nothing
      'click a': 'execute:defaultAction'
    }

If the default action should not be always available, because the current
user may not have enough permissions, for example:

    <a href="{{url}}" class="{{disabledClass}}>{{name}}</a>

    templateHelpers: function () {
      // The node to execute the default action for
      var node = ...,
          // Is there any default action assigned to this node and
          // is it enabled for this node?
          enabled = this.defaultActionController.hasAction(node);
      return {
        // Provide the URL for bookmarking purposes
        url: nodeLinks.getUrl(node),
        // Make the link appear disabled by Bootstrap class
        disabledClass: enabled ? '' : 'disabled'
      }
    }

See `NodeLinkCollection` for more information about rendering
of the URL on node links.

Reference
---------

defaultActionController: object
: Inserted by the `DefaultActionBehavior` to the view instance.

event 'execute:defaultAction' (model,options | view)
: When triggered on the view, the behaviour will perform the default node
  action.  Parameters can be either node `model` and `options` for the action
  execution, or `view` yo pick the model from it.

DefaultActionController
=======================

Provides access to detailed default action handling.

hasAction(node): boolean
: Checks, if there is a default action defined for the node and if the
command implementing the action confirms, that it is enabled.

getAction(node) : object
Returns the command implementing the default action for the specified node,
or `undefined` if there is no default action for it.

executeAction(node, options) : promise
Executes the default action for the specified node and returns a promise
for the command result.  If there is no action defined or the command is
disabled, it returns `undefined`.
