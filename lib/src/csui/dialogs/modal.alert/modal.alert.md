ModalAlert
==========

A modal alert dialog to notify about errors and other events, or to ask
a confirmation question.  You can configure:

* Title of the dialog
* Message in the dialog body
* Buttons in the dialog footer
* Other options like the close button in the dialog caption, for example

Both clicking on the close button in the caption (if it is visible) or
hitting "Esc" cancel the dialog, like the "Cancel" button does.

Hitting "Enter" when no other button is focused clicks the default
(the first) button; usually "Yes" or "OK".

Modal alert dialogs are used to suspend the running operation and wait until
the user closes the dialog, but methods of this object are not synchronous
as the native `alert`, which.  They are asynchronous and resuming the
operation must continue in a function callback.

## Synopsis

```
// Report an error and wait for closing the alert dialog
ModalAlert.showError('You have no permissions to create a folder.')
  .always(function () {
    // Continue here when the dialog was closed
  });

// Make sure that the user does not accidentally delete the documents
ModalAlert.confirmWarning('The selected folder is not ampty.' + 
    '\n\nAre you sure that you want to delete it?',
    'Folder Deletion')
  .done(function () {
    // Delete the folder
  });

// Ask the user how to resolve the document name conflict
ModalAlert.confirmQuestion('An existing document with the same name has been found.' + 
    '\n\nDo you want to replace it with the uploaded one?',
    'Document Name Conflict', {
      buttons: ModalAlert.buttons.YesNoCancel
    })
  .always(function (answer) {
    if (answer) {
      // Overwrite the existing document
    } else if (answer !== undefined) {
      // Append a new version to the existing document
    }
  });
```

## Interface

All public methods are static.  They show the alert dialog and return a
promise to be able to wait until the dialog is closed.  They start with
"show" or "confirm" to conveniently provide buttons usually needed for
notifications or confirmations.  They end with the alert type like "Error",
for example, to conveniently provide the usual look and feel for the
particular notification or confirmation.

### Notifications

The following methods show a notification alert with the "Close" button only
by default:

* `showError`
* `showWarning`
* `showInformation`
* `showSuccess`
* `showMessage`

### Confirmations

The following methods show a confirmation alert with the "Yes" and "No"
buttons by default:

* `confirmError`
* `confirmWarning`
* `confirmInformation`
* `confirmSuccess`
* `confirmMessage`
* `confirmQuestion`

### Alert Types

The alert types carry default options for the alert dialog, which can be
overridden to customize the behaviour for a special scenario.  They are
exposed as the second part of the method name; after "show" or "confirm":

Error
: Suitable for reporting failed operations.

Warning
: Suitable for warning about unexpected or dangerous events, which do not
  prevent the operation from finishing, but the result should be checked.

Information
: Suitable for notifying about important events.

Success
: Suitable for notifying about successfully finished operations.

Message
: Suitable for common messages; shows no icon and no header colour; it gives
  no hint about the severity of the message.

Question
: Suitable for questions about non-destructive operations and available only
  by `confirmQuestion`; if the operation is dangerous, `confirmWarning` should
  be preferred.

### Buttons

The most usual button sets are exposed as keys of the `ModalAlert.buttons`
object:

* `YesNoCancel`
* `YesNo`
* `OkCancel`
* `Ok`
* `Cancel`
* `Close`

They can be used to override the buttons used by a particular alert showing
method by default.  They are supposed to be passed in to the method by the
property `buttons` of the `options` parameter.

### Method Signatures

All alert showing methods share the same signature:

```text
(callback : function, message : string, title : string, options : object)
```

The `callback`, `title` and `options` parameter are optional, when the
`message` parameter is provided.  The `options` parameter can be passed in
alone, containing the other parameters as keys.  If multiple parameters are
passed in, the have to come in their declaration order.  Calls with these
arguments are valid:

```javascript
(callback, message, title, options)
(message, title, options)
(message, options)
(message, title)
(message)
(callback, message, title)
(callback, message, options)
(callback, message)
(callback, options)
(options)
({
  message:  ...,
  title:    ...,
  callback: ...,
  ...
})
```

### Callbacks and Promises

The callback is called with a single argument depending on the button which
the dialog was closed with:

```javascript
// Process the answer of a confirmation dialog
function (result) {
  if (result === true) {
    // Dialog was closed by "Yes" (result is true)
  } if (result === false) {
    // Dialog was closed by "No" (result is false)
  } else {
    // Dialog was cancelled (result is undefined)
  }
}

// Just resume after closing the notification dialog
function () {
  // Continue the operation
}
```

The promise is either resolved with a single argument or rejected with nothing
depending on the button which the dialog was closed with:

```javascript
// Process the answer of a confirmation dialog separately
.done(function (result) {
  // Dialog was closed by "Yes" (result is true)
})
.fail(function (result) {
  if (result !== undefined) {
    // Dialog was closed by "No" (result is false)
  } else {
    // Dialog was cancelled (result is undefined)
  }
})

// Process the answer of a confirmation dialog together
.always(function (result) {
  if (result) {
    // Dialog was closed by "Yes" (result is true)
  } else if (result !== undefined) {
    // Dialog was closed by "No" (result is false)
  } else {
    // Dialog was cancelled (result is undefined)
  }
})

// Just resume after closing the notification dialog
.always(function () {
  // Continue the operation
})
```

Summary of the dialog closing results:

button clicked      | `result` value | promise state
--------------------|----------------|----------------------
"Yes" or "OK"       | `true`         | resolved with `true`
"No"                | `false`        | rejected with `false`
"Cancel" or "Close" | `undefined`    | rejected with nothing

The callback is executed before the promise is resolved or rejected.

### Options

buttons
: (object, `ModalAlert.buttons.Close` by default)

callback
: (function, undefined by default)

dialogSize
: 'sm', 'md', 'lg' (string, 'md' by default) 

headerClass
: (string, 'info-header' by default) 

message
: (string, undefined by default) 

modalClass
: CSS class to be added to the `.modal` wrapper element (string, undefined
  by default)

showHeader
: (boolean, `true`' by default)

showTitleCloseButton
: (boolean, `false`' by default)

showTitleIcon
: (boolean, `true`' by default)

title
: (string, undefined by default) 

titleCloseIcon
: (string, 'icon-close-white' by default) 

titleIcon
: (string, 'icon-information-white' by default) 

## Examples

The following examples show typical parameters of the `show` and `confirm`
methods.  See other examples to learn how to wait until the alert dialog
is closed, to check the confirmation question result, to use additional
method options, or to use different ways how to specify the arguments.

```
require(['csui/dialogs/modal.alert/modal.alert',
], function (ModalAlert) {

  // Report an error
  ModalAlert.showError('Unable to import items. ' +
      'The items to import may have been moved or deleted.');

  // Warn about an incoming danger
  ModalAlert.showWarning('System maintenance is scheduled in 30 minutes. ' +
      'You will be automatically signed out at that time.');

  // Inform about an important event
  ModalAlert.showInformation('OpenText Content Server application ' +
      'has been updated to version 16.0',
    'Software Update');

  // Announce that an operation has succeeded
  ModalAlert.showSuccess('12 files have been successfully uploaded.',
    'Upload Succeeded');

  // Show a plain message without any status colour
  ModalAlert.showMessage('12 files have been successfully uploaded.',
    'Upload Succeeded');

  // Ask if the user is really sure to proceed
  ModalAlert.confirmQuestion('The selected folder contains 235 items.\n\n' +
      'Remove the selected folder?',
    'Remove');

  // Ask if the user agrees to proceed right now or not
  ModalAlert.confirmQuestion('The database needs to be upgraded before you continue.',
    'Database Maintenance', {
      buttons: ModalAlert.buttons.OkCancel
    });

});
```
