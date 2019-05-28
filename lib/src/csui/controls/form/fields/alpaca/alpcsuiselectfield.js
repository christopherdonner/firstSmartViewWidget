/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/selectfield.view',
  'csui/utils/types/date', 'i18n!csui/controls/form/impl/nls/lang',
  'csui/lib/underscore.string'
], function (_, $, Backbone, Marionette, Alpaca, SelectFieldView, date,
    lang) {
  'use strict';

  Alpaca.Fields.CsuiSelectField = Alpaca.Fields.SelectField.extend({
    constructor: function CsuiSelectField(container, data, options, schema, view,
        connector,
        onError) {
      this.excludeNoneOption = options.removeDefaultNone !== undefined &&
                               options.removeDefaultNone;
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'select';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    showField: function () {
      var collectionData = [];

      var bNullValueFound = false;
      if (this.options.optionLabels) {
        collectionData = _.zip(this.schema['enum'], this.options.optionLabels).map(
            function (cur) {
              bNullValueFound = bNullValueFound || (cur[0] === null || cur[0] === '');
              return {id: cur[0], name: cur[1]};
            });
        ensureDateFormat(collectionData);
      } else if (this.schema['enum']) {
        collectionData = this.schema['enum'].map(function (cur) {
          bNullValueFound = bNullValueFound || (cur[0] === null || cur[0] === '');
          return {id: cur, name: cur};
        });
      } else if (this.options.dataSource) {
        collectionData = $.map(this.options.dataSource, function (value, index) {
          return {id: index, name: value};
        });
      }

      if (!bNullValueFound && !this.excludeNoneOption) {
        collectionData.splice(0, 0, {
          id: null,
          name: '<' + lang.selectFieldDefaultLabel + '>'
        });
      }

      var collection = new Backbone.Collection(collectionData),
          selection = {},
          hasValue = true,
          isDataNotNaN = this.schema.type === "number" ? !isNaN(this.data) : true;
      if (this.data !== null && this.data !== "" && isDataNotNaN) {
        selection = new Backbone.Model({
          id: this.data,
          name: collection.get(this.data) && collection.get(this.data).get('name')
        });
      } else if (this.excludeNoneOption) {
        selection = new Backbone.Model({
          id: this.options.mode === 'create' ? collection.models[0].attributes.id : null,
          name: collection.models[0].attributes.name
        });
        hasValue = this.options.mode === 'create';
      } else {
        selection = new Backbone.Model({
          id: null,
          name: '<' + lang.selectFieldDefaultLabel + '>'
        });
      }
      var id4Label,
        labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length==1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }
      var id = this.id;
      this.fieldView = new SelectFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
        }),
        id: _.uniqueId(id), // wrapper <div>
        alpacaField: this,
        labelId: id4Label, // this will remain undefined if the label does not exist
        selected: selection,
        collection: collection,
        mode: this.options.mode,
        path: this.path,
        dataId: this.name,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        },
        hasValue: hasValue
      });
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);
    },

    setValueAndValidate: function (value, validate) {
      if (this.fieldView.mode !== "writeonly") {
        if (value instanceof Object) {
          if (value.id === null) {
            this.setValue(value.id);
          } else {
            this.setValue(value);
          }
        } else {
          this.setValue(value);
        }
      } else {
        this.setValue(value);
      }

      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate();
      }
      this.refreshValidationState(false);
      return bIsValid;
    },

    _validator: function (callback) {
      var value = this.getValue();

      if (this.schema.required && value === "") {
        callback({
          "status": false,
          "message": "This field is required"
        });
      } else {
        callback({
          "status": true
        });
      }
    },

    validate: function () {
      var ret = this.base();
      this.validation = _.omit(this.validation, "invalidValueOfEnum");
      return ret;
    },

    setValue: function (value) {
      value === null ? this.base("") : this.base(value);
    },

    getValue: function () {
      return this.base();
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
  function ensureDateFormat(collectionData) {
    _.each(collectionData, function (item) {
      var value = item.id,
          formatted;
      if (typeof value === 'string') {
        formatted = tryFormatServerIso(value);
        if (formatted) {
          item.name = formatted;
        } else {
          formatted = tryFormatServerDotNet(value);
          if (formatted) {
            item.name = formatted;
          }
        }
      }
    });
  }
  function tryFormatServerIso(value) {
    if (/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ?$/.test(value)) {
      return date.formatExactDate(value);
    }
  }
  function tryFormatServerDotNet(value) {
    if (/^D\/\d\d\d\d\/\d+\/\d+:\d+:\d+:\d+$/.test(value)) {
      var parts = /^D\/(\d\d\d\d)\/(\d+)\/(\d+):(\d+):(\d+):(\d+)$/.exec(value),
          label = _.str.sformat('{0}-{1}-{2}T{3}:{4}:{5}', parts[1],
            padWithTwoDigits(parts[2]), padWithTwoDigits(parts[3]),
            padWithTwoDigits(parts[4]), padWithTwoDigits(parts[5]),
            padWithTwoDigits(parts[6]));
      return date.formatExactDate(label);
    }

    function padWithTwoDigits(number) {
      return _.str.lpad(number, 2, '0');
    }
  }

  Alpaca.registerFieldClass('select', Alpaca.Fields.CsuiSelectField, 'bootstrap-csui');

  return Alpaca.Fields.CsuiSelectField;
});
