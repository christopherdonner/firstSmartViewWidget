/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/utils/base",
  "csui/controls/form/form.view",
  'csui/widgets/metadata/general.panels/document/document.general.form.model',
  'csui/utils/contexts/page/page.context',
  'csui/utils/connector',
  'csui/utils/contexts/factories/connector',
  'csui/models/action',
  'csui/models/actions',
  'csui/models/node/node.model',
  'csui/models/form',
  'csui/widgets/metadata/property.panels/categories/impl/category.form.view',
  '../../../utils/testutils/async.test.utils.js',
  'csui/lib/bililiteRange',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext',
  'csui/lib/jquery.simulate.key-sequence'
], function ($, _, Backbone, Marionette, base, FormView, DocumentGeneralFormModel,
    PageContext, Connector, ConnectionFactory, ActionModel,
    ActionCollection, NodeModel, FormModel, CategoryFormView, testUtils) {
  'use strict';
  describe("disableView", function () {
    var form, formView, context, formModel, node, connector;
    context = new PageContext({
      factories: {
        connector: {
          connection: {
            url: '//server/otcs/cs/api/v1',
            supportPath: '/support',
            session: {
              ticket: 'dummy'
            }
          }
        }
      }
    });

    connector = context.getObject(ConnectionFactory);

    node = new NodeModel({id: 162675}, {
      connector: connector
    });

    form = {
      "data": {
        "1361773": {
          "1361773_1": {"version_number": 11},
          "1361773_2": null,
          "1361773_3": null,
          "1361773_4": null,
          "1361773_5": null,
          "1361773_8": [null],
          "1361773_6": null,
          "1361773_7": false
        }
      },
      "options": {
        "fields": {
          "1361773": {
            "fields": {
              "1361773_2": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Date: Field",
                "readonly": false,
                "type": "date"
              },
              "1361773_3": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Integer: Field",
                "readonly": false,
                "type": "integer"
              },
              "1361773_4": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Text: Popup",
                "readonly": false,
                "type": "select"
              },
              "1361773_5": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "User: Field",
                "readonly": false,
                "type": "otcs_member_picker"
              },
              "1361773_8": {
                "fields": {"item": {"type": "date"}},
                "hidden": false,
                "hideInitValidationError": true,
                "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
                "label": "Date: Field  MV",
                "readonly": false,
                "toolbarSticky": true
              },
              "1361773_6": {
                hidden: false,
                hideInitValidationError: true,
                label: "Name",
                readonly: false,
                type: "tkl"
              },
              "1361773_7": {
                hidden: false,
                hideInitValidationError: true,
                label: "Flag: Checkbox",
                readonly: false,
                type: "checkbox"
              },
              "1361773_1": {
                "hidden": true,
                "hideInitValidationError": true,
                "readonly": true,
                "type": "object"
              }
            },
            "hideInitValidationError": true,
            "label": "00All- attribute types",
            "type": "object"
          }
        }
      },
      "role_name": "categories",
      "schema": {
        "properties": {
          "1361773": {
            "properties": {
              "1361773_2": {
                "disabled": true,
                "readonly": false,
                "required": false,
                "title": "Date: Field",
                "type": "string"
              },
              "1361773_3": {
                "disabled": true,
                "readonly": false,
                "required": false,
                "title": "Integer: Field",
                "type": "integer"
              },
              "1361773_4": {
                "disabled": true,
                "enum": ["a", "b", "c", "d", "e"],
                "readonly": false,
                "required": false,
                "title": "Text: Popup",
                "type": "string"
              },
              "1361773_5": {
                "disabled": true,
                "readonly": false,
                "required": false,
                "title": "User: Field",
                "type": "otcs_member_picker"
              },
              "1361773_8": {
                "items": {
                  "defaultItems": 1,
                  "maxItems": 5,
                  "minItems": 1,
                  "type": "string"
                },
                "disabled": true,
                "readonly": false,
                "required": false,
                "title": "Date: Field  MV",
                "type": "array"
              },
              "1361773_6": {
                enum: [],
                parents: [],
                readonly: false,
                required: true,
                title: "Name",
                "disabled": true,
                type: "String"
              },
              "1361773_7": {
                readonly: false,
                required: false,
                title: "Flag: Checkbox",
                "disabled": true,
                type: "boolean"
              },
              "1361773_1": {"disabled": true, "readonly": true, "required": false, "type": "object"}
            }, "title": "00All- attribute types", "type": "object"
          }
        }, "title": "Categories", "type": "object"
      }
    };

    describe("as a disabled field", function () {

      beforeAll(function (done) {

        formModel = new FormModel(form);
        formView = new CategoryFormView({
          model: formModel,
          node: node,
          context: context,
          mode: 'create'
        });

        formView.render();
        $('body').append("<div id='disabled-elements'></div>");

        new Marionette.Region({
          el: "#disabled-elements"
        }).show(formView);
        formView.$form.postRender;
        testUtils.asyncElement(formView.$el, '.cs-formfield').done(
            function () {
              console.log("postrender");
              done();
            });
      });

      afterAll(function () {
        formView.destroy();
        formModel.destroy();
        $('body').empty();
      });

      it("must contain respective styling", function () {
        expect(formView).toBeDefined();
        var writeFields         = formView.$el.find(".cs-formfield:not(.cs-booleanfield)").length,
            booleanField        = formView.$el.find(".cs-formfield.cs-booleanfield .binf-switch"),
            disabledWriteFields = formView.$el.find(".cs-formfield .cs-field-write .csui-formfield-disabled").length;
        expect(writeFields === disabledWriteFields).toBeTruthy();
        expect(booleanField.hasClass("binf-switch-disabled")).toBeTruthy();
      });

      it("must be focusable", function () {
        var disabledField = formView.$el.find(".cs-formfield .cs-field-write .csui-formfield-disabled").last();
        expect(document.activeElement === disabledField[0]).toBeFalsy();
        disabledField.trigger("focus");
        expect(document.activeElement === disabledField[0]).toBeTruthy();
      });

      it("must not display action icons on hovering multi value field", function () {
        var disabledMultiValueField = formView.$el.find(".csui-multivalue-container").first(),
            disabledInputField      = disabledMultiValueField.find("input");
        disabledInputField.trigger("focus");
        expect(disabledInputField[0] === document.activeElement).toBeTruthy();
        var visibleActionIcons = disabledMultiValueField.find(".alpaca-array-actionbar button");
        expect(visibleActionIcons.is(":visible")).toBeFalsy();
      });

    });
  });
});