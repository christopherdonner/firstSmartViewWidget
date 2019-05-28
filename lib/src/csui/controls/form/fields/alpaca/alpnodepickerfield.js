/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  "csui/models/node/node.model",
  "csui/utils/namedsessionstorage",
  'csui/controls/form/fields/nodepickerfield.view'
], function (module, _require, _, $, Backbone, Marionette, Alpaca, NodeModel,
             NamedSessionStorage, NodePickerFieldView) {

  var storage = new NamedSessionStorage(module.id);

  Alpaca.Fields.CsuiNodePickerField = Alpaca.Fields.IntegerField.extend({
    constructor: function NodePickerField(container, data, options, schema,
                                          view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
      this.on("showNodePickerDialog", this.actionTriggerShowNodePickerDialog);
    },

    getFieldType: function () {
      return 'otcs_node_picker';
    },


    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    showField: function () {

      var id = this.id;
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length==1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }
      this.fieldView = new NodePickerFieldView({
        context: this.connector.config.context,
        formView: this.connector.config.formView,
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
        }),
        id: _.uniqueId(id), // wrapper <div>
        alpacaField: this,
        labelId: id4Label,
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
      this.getControlEl().replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);

      return;
    },


    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      return true;
    },

    focus: function () {
      this.fieldView.$el.focus();
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }


  });


  Alpaca.registerFieldClass('otcs_node_picker', Alpaca.Fields.CsuiNodePickerField, 'bootstrap-csui');
  Alpaca.registerFieldClass('otcs_node_picker', Alpaca.Fields.CsuiNodePickerField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.NodePickerField;
});
