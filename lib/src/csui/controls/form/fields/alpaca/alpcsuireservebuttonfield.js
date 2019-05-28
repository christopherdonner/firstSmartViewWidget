/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/reservebuttonfield.view', 'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, ReserveButtonFieldView, base) {

  Alpaca.Fields.CsuiReserveButtonField = Alpaca.Fields.TextField.extend({

    constructor: function CsuiReserveButtonField(container, data, options, schema, view, connector,
        onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'otcs_reserve_button';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    getValue: function () {
      var self = this,
          val  = this.data;
      val = self.ensureProperType(val);
      return val;
    },

    showField: function () {

      var id = this.id;
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length==1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }
      this.options.labelId = id4Label;
      this.fieldView = new ReserveButtonFieldView(_.extend(this));
      this.fieldView.$el.attr('id', _.uniqueId(this.id));
      var $field = $('<div>').addClass('alpaca-control');
      this.containerItemEl.find(".alpaca-control").replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);
      return;
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      }
      return bIsValid;
    },

    focus: function () {
      this.fieldView.setFocus();
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }
  });

  Alpaca.registerFieldClass('otcs_reserve_button', Alpaca.Fields.CsuiReserveButtonField,
      'bootstrap-csui');

  return $.alpaca.Fields.CsuiReserveButtonField;
})
;
