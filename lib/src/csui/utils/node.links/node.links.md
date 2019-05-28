NodeLinkCollection
==================

Helps implementing links to nodes by returning an absolute URL to the nodes.

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

If you render a link to be opened *outside the application context* -
from an e-mail, for example - you need the *node action URL*.
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
      // The node to render the link for
      var node = ...;
      return {
        // Permissions or not, a node has always some URL to be opened with
        url: nodeLinks.getUrl(node)
      }
    }

See `DefaultActionBehavior` for more information about click action
implementation and enabled/disabled link handling.
