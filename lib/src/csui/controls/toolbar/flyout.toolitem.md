Flyout Tool Item
================

Flyout tool item is a button with multiple actions attached to it. It is
rendered as a toolbar button with a menu dropdown. The dropdown offers all
actions assigned to the flyout as clickable menu items. The main button
carries a signature to be able to mask it off, but it does not trigger
the action event. If there is one action among the assigned ones promoted,
the main button will trigger its event and optionally show its label.

Tool items can be added to the flyout using the tool item collection
extensibility. They are recognized by the matching `flyout` attribute.

Examples
--------

    // Flyout without a promoted action
    {
      signature: 'share', // Button signature to mask the whole flyout off
      name: 'Share',      // Fixed label for the main button
      flyout: 'share'     // Introduce flyout with this identifier
    },
    {
      signature: 'email',
      name: 'Email link',
      flyout: 'share'     // Add this ection to the flyout 'share'
    },
    {
      signature: 'share-via-core',
      name: 'Share via Core',
      flyout: 'share'     // Add this ection to the flyout 'share'
    }

    // Flyout with a promoted action showing its name on the main button
    {
      signature: 'edit', // Button signature to mask the whole flyout off
      flyout: 'edit'     // Introduce flyout with this identifier
    },
    {
      signature: 'editonline',
      name: 'Edit Online',
      flyout: 'edit',    // Add this ection to the flyout 'edit'
      promoted: true     // Promote this action to the main button
    },
    {
      signature: 'editoffline',
      name: 'Edit Offline',
      flyout: 'edit'     // Add this ection to the flyout 'edit'
    }

    // Flyout with a promoted action showing a fixed label on the main button
    {
      signature: 'save',
      name: 'Save',      // Fixed label overriding the promoted action
      flyout: 'save'
    },
    {
      signature: 'save',
      name: 'Save',
      flyout: 'save',    // Add this ection to the flyout 'save'
      promoted: true     // Promote this action to the main button
    },
    {
      signature: 'saveas',
      name: 'Save as',
      flyout: 'save'    // Add this ection to the flyout 'save'
    }

Attributes
----------

* flyout (string): indicates which flyout this tool item belongs to.
* promoted (boolean): indicates that the tool item will be promoted;
  clicking on the main button will cause its action triggered too
  and if the main button has no name, the name of the tool item will
  be used as the main button label.
