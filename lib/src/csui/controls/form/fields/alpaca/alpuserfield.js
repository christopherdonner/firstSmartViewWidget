/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/userfield.view', 'csui/utils/base',
  'csui/utils/contexts/factories/member','csui/controls/form/pub.sub', 'i18n!csui/controls/form/impl/nls/lang'
], function (module, _, $, Backbone, Marionette, Alpaca, UserFieldView, base,
    MemberModelFactory, PubSub, Lang) {

  Alpaca.Fields.CsuiUserField = Alpaca.Fields.TextField.extend({

    constructor: function CsuiUserField(container, data, options, schema, view, connector,
        onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'otcs_user';
    },

    postRender: function (callback) {
      this.base(callback);
      if (!!this.data && this.data !== -3) {
        var alpCtrl = this.field && this.field.parent().find('.alpaca-control');
        alpCtrl.addClass('alpaca-control-hidden');
        this.userModel = this.connector.config.context.getModel(MemberModelFactory, {
          attributes: {id: this.data || ''},
          temporary: true
        });
        var that = this;
        this.userModel.ensureFetched().done(_.bind(function () {
          that.showField(that.userModel.attributes);
          alpCtrl.removeClass('alpaca-control-hidden');
        }));
      } else {
        var data = {
          id: this.data,
          name: this.options.type_control ? this.options.type_control.name : ''
        };
        this.showField(data);
      }
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    showField: function (userData) {

      var data = userData;

      var id = this.id;
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length == 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }

      this.fieldView = new UserFieldView({
        context: this.connector.config.context,
        data: data,
        applyFlag: this.options.applyFlag,
        model: new Backbone.Model({
          data: data,
          options: this.options,
          schema: this.schema,
          id: this.id
        }),
        dataId: this.name,
        alpacaField: this,
        labelId: id4Label,
        path: this.path,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        },
        id: _.uniqueId(this.id), // wrapper <div>
      });
      this.options.validator = function (callback) {
        callback({
          "status": this.fieldView && this.fieldView.userPicked,
          "message": this.fieldView && this.fieldView.userPicked ? "" : Lang.invalidUser
        });
      };
      var $field = $('<div>').addClass('alpaca-control');
      this.containerItemEl.find(".alpaca-control").replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);
      PubSub.trigger(this.propertyId + 'tkl:asyncBuildRelation', this.fieldView);
    },

    getValue: function () {
      var retValue = "";
      if (!!this.data && !!this.data.id) { // updated field
        retValue = this.data.id;
      } else if (!!this.data) { // initial value
        retValue = (this.data.id === "" || this.data.id === null) ? "" : this.data;
      }
      return retValue;
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      } else {
        this.fieldView.$el.trigger($.Event('field:invalid'));
      }
      return bIsValid;
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    },

    handleValidate: function () {
      var ret = this.base();
      if (!ret) {
        var arrayValidations = this.validation;
        if (this.fieldView.$el.find(".picker-container input").val() !== undefined &&
            this.fieldView.$el.find(".picker-container input").val()) {
          arrayValidations["notOptional"]["status"] = true;
          arrayValidations["notOptional"]["message"] = "";
          return ret;
        }
        for (var validation in arrayValidations) {
          if (arrayValidations[validation]["status"] === false) {
            if (validation !== "notOptional") {
              arrayValidations[validation]["status"] = true;
              arrayValidations[validation]["message"] = "";
            }
          }
        }
      }
      return ret;
    }
  });

  Alpaca.registerFieldClass("otcs_user", Alpaca.Fields.CsuiUserField);
  return $.alpaca.Fields.CsuiUserField;
})
;
