# GeneralFormFieldBehavior

Maintains extra fields on the General node properties form.  They are form views 
with one or multiple fields and should be placed on the form below the common fields
in the left column.

Yuo can apply this behavior to a General node properties form like this:

```javascript
  behaviors: {
    generalFormFields: {
      behaviorClass: GeneralFormFieldBehavior,
      // Parent element in the form template for the extra fields
      fieldParent: '.csui-extra-general-fields',
      // Array of general form field descriptors returned by
      // GeneralFormFieldBehavior.getFieldDescriptors; it should
      // be called during fetching the model of the general form
      fieldDescriptors: function () {
        // Passed from the parent view, which fetched them
        return this.options.generalFormFieldDescriptors;
      },
      fieldViewOptions: function () {
        return {
          context: this.options.context,
          node: this.node,
          mode: this.options.mode,
          originatingView: this,
          metadataView: this.options.metadataView
        };
      }
    }
  }
```

You can get general form field descriptors, which you need for this behavior,
at the time of fetching the view model from a promise by calling this:

```javascript
    return GeneralFormFieldBehavior.getFieldDescriptors({
      context: this.options.context,
      action: this.options.action,
      node: this.node,
      forms: this.allForms
    });
```

If you need to wait until all form view with the extra fields have been rendered,
you can listen to the event "render:general:form:fields".  If the array of general
form field descriptors is not empty, this event will be always triggered after
the render event on your General node properties form. 

You can get all field values organized by roles of their forms by calling this
on the view, which you applied the behavior to:

```javascript
var additionalFormValues = generalFormView.getGeneralFormFieldValues();
```
