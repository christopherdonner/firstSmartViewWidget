/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca', 'csui/models/form',
  'csui/controls/form/fields/textfield.view', 'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, FormModel, TextFieldView, base) {

  Alpaca.Fields.CsuiUrlField = Alpaca.Fields.URLField.extend({

    constructor: function CsuiUrlField(container, data, options, schema, view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'url';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    showField: function () {

      var id = this.id;
      this.fieldView = new TextFieldView({
        context: this.connector.config.context,
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
        }),
        id: _.uniqueId(id), // wrapper <div>
        alpacaField: this,
        value: this.data,
        readonly: true,
        dataId: this.name,
        path: this.path,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        }
      });
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith( $field);
      this.region = new Marionette.Region({ el: $field});
      this.region.show(this.fieldView);

      return;
    },

    setValueAndValidate: function( value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if( validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      }
      return bIsValid;
    },

    focus: function () {
      this.fieldView.setFocus();
    },
    handleValidate: function() {
      var ret = this.base();
      if(!ret) {
        var valInfo = this.validation;
        if(this.fieldView.cancelClicked || this.fieldView.getEditableBehavior().escapePressed) {
          valInfo["invalidPattern"]["status"] = true;
          valInfo["invalidPattern"]["message"] = "";
          return true;
        }
      }
      return ret;
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }
  });

  Alpaca.registerFieldClass('url', Alpaca.Fields.CsuiUrlField, 'bootstrap-csui');
  Alpaca.registerFieldClass('url', Alpaca.Fields.CsuiUrlField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiUrlField;
})
;
