define(['csui/lib/marionette',
  'csui/controls/form/form.view'
], function (Marionette, FormView) {
  'use strict';

  var MetadataHelloGeneralFormFieldView = FormView.extend({

    constructor: function MetadataHelloGeneralFormFieldView(options) {
      FormView.prototype.constructor.apply(this, arguments);

      // Whenever a field is changed, save the new value
      this.listenTo(this, 'change:field', this._saveField);
    },

    _saveField: function (args) {
      // This view is shared for both creation and editing scenarios.
      // Do not save immediately in the creation mode.  The creation dialog
      // has a button to get all field values and perform the action.
      if (this.mode === 'create') {
        return;
      }

      // Save modifications here.
    }

  });

  return MetadataHelloGeneralFormFieldView;

});
