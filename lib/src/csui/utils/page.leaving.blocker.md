# PageLeavingBlocker

Prevents the user from leaving the current page without being warned, that
some running operation would be interrupted and pending items would not be
processed.  If the blocker is enabled, the web browser is supposed to show
a confirmation dialog with the specified message and a question if the user
is really sure, when the user tries to:

* navigate to other page.
* reload the current page.
* close the current window or tab.
* quit the web browser application.

**Warning:** Mobile browsers may not support the page-leave warning.
Neither of Safari, Chrome and Firefox on iOS supports it today.  The page
will be left as soon as the user attempts it.

The blocker should be enabled providing the warning message before a
long-running multiple-item processing operation starts and disabled, when
all items have been processed.  Calls to `enable` and `disable` methods
have to be paired, otherwise the warning would be shown any time later,
when the user would try to leave the page.

## Examples

Processing multiple items *without* the page-leaving blocker:

```
require(['csui/lib/jquery', 'csui/utils/page.leaving.blocker',
  'csui/lib/jquery.when.all'
], function ($, PageLeavingBlocker) {

  // Returns a promise for all items and works in the background
  function processItems(items) {
    var promises = items.map(processItem);
    return $.whenAll.apply($, promises);
  }

  // Returns a promise for the single item and works in the background
  function processItem(item) {
    ...
  }

  processItems(...);

});
```

Processing multiple items *with* the page-leaving blocker:

```
require(['csui/lib/jquery', 'csui/utils/page.leaving.blocker',
  'csui/lib/jquery.when.all'
], function ($, PageLeavingBlocker) {

  // Returns a promise for all items and works in the background
  function processItems(items) {
    // Enable the blocker before processing of the first item begins
    PageLeavingBlocker.enable(
      'If you leave the page now, pending items will not be processed.');
    var promises = items.map(processItem);
    return $.whenAll
        .apply($, promises)
        // Disable the blocker after processing of the last item ends
        .always(PageLeavingBlocker.disable);
  }

  // Returns a promise for the single item and works in the background
  function processItem(item) {
  }

  processItems(...);

});
```

## Methods

### isEnabled() : boolean

Returns `true` if the page-leaving blocker is enabled, otherwise `false`.

### enabled(message) : void

Enables the page-leaving blocker.  The `message` string will be displayed, if the user tries to leave the current page.  The message passed the the most recent call to `enable` will be displayed.  Every call to `enable` has to be paired with a call to `disable`.

### disable() : void

Cancels the previous `enable` call and if it was the last one, it isables the page-leaving blocker.  Every call to `enable` has to be paired with a call to `disable`.
