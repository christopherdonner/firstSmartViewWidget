/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  'csui/utils/contexts/page/page.context',
  "csui/lib/alpaca/js/alpaca",
  './alpcontrols.mock.data.js',
  "csui/controls/form/fields/alpaca/alpcsuitextfield",
  "csui/controls/form/fields/alpaca/alpcsuitextareafield",
  "csui/controls/form/fields/alpaca/alpcsuiurlfield",
  "csui/controls/form/fields/alpaca/alpcsuidateonlyfield",
  "csui/controls/form/fields/alpaca/alpcsuidatetimefield",
  "csui/controls/form/fields/alpaca/alpcsuiselectfield",
  "csui/controls/form/fields/alpaca/alpcsuiintegerfield",
  'csui/lib/bililiteRange',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext',
  'csui/lib/jquery.simulate.key-sequence'
], function ($, _, Backbone, Marionette, PageContext, Alpaca, mock) {

  xdescribe("Csui Alpaca Form Controls", function () {

    var context;

    beforeAll(function () {
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
    });

    beforeEach(function () {
      mock.enable();
    });

    afterEach(function () {
      mock.disable();
    });

    describe("Fields.Alpaca.CsuiTextField", function () {

      var afd, afdEmpty;
      var placeHolder;

      beforeAll(function (done) {
        afd = {
          data: "Enterprise",
          options: {
            "hidden": false,
            "hideInitValidationError": true,
            "label": "Name",
            "readonly": false,
            "type": "text"
          },
          schema: {
            "maxLength": 14,
            "minLength": 1,
            "readonly": false,
            "required": true,
            "title": "Name",
            "type": "string"
          }
        };

        placeHolder = "placeholder";
        afdEmpty = {
          data: "",
          options: {
            "type": "text",
            "placeholder": placeHolder
          },
          schema: {
            "title": "Text Field",
            "type": "string",
            "required": false
          }
        };

        var callback = _.after(2, done);

        var f1 = $('<div id="f1"/>').appendTo('body'); // gets id alpaca1
        afd.postRender = callback;
        f1.alpaca(afd);

        var f2 = $('<div id="f2"/>').appendTo('body'); // gets id alpaca3
        afdEmpty.postRender = callback;
        f2.alpaca(afdEmpty);

      });

      afterAll(function () {
        $('body').empty();
      });

      it("can be instantiated", function () {
        var field = $('#f1').find('.alpaca-field');
        expect(field.length).toEqual(1);
        var internal = $('#f1').find('.cs-textfield');
        expect(internal.length).toEqual(1);
      });

      it("if required:true, shows up required", function () {
        var required = $('#f1').find('.alpaca-required');
        var requiredIcon = $('#f1').find('.alpaca-icon-required');
        expect(required.length).toBeGreaterThan(0);
        expect(requiredIcon.length).toBeGreaterThan(0);
      });

      it("if required:false, doesn't show up required", function () {
        var required = $('#f2').find('.alpaca-required');
        var requiredIcon = $('#f2').find('.alpaca-icon-required');
        expect(required.length).toEqual(0);
        expect(requiredIcon.length).toEqual(0);
      });

      it("empty shows placeholder", function () {
        var placeholder = $('#f2').find("input[placeholder]")[0].placeholder;
        expect(placeholder.trim()).toEqual(placeHolder);
      });
      it("if required field emptied and validated shows error", function () {
        var fieldView = $.alpaca.fieldInstances.alpaca1.fieldView;
        var invalid = $('#f1').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        var ok = fieldView.setValue('', true); // validate
        expect(ok).toBeFalsy();

        invalid = $('#f1').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
      });

      it("if maxLength exceeds and validated shows error", function () {
        var fieldView = $.alpaca.fieldInstances.alpaca1.fieldView;
        var ok = fieldView.setValue('Enterprise', true); // validate
        expect(ok).toBeTruthy();
        var invalid = $('#f1').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        ok = fieldView.setValue('Enterprise Location', true); // validate
        expect(ok).toBeFalsy();

        invalid = $('#f1').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
      });

    });

    describe("Fields.Alpaca.CsuiUrlField", function () {

      var urlfd;

      beforeAll(function (done) {
        urlfd = {
          data: "http://www.yahoo.de",
          options: {
            hidden: false,
            hideInitValidationError: true,
            label: "URL",
            readonly: false,
            type: "url"
          },
          schema: {
            readonly: false,
            required: true,
            title: "URL",
            type: "string"
          }
        };

        var f1 = $('<div id="furl"/>').appendTo('body'); // gets id alpaca5
        urlfd.postRender = done;    // call done on postRender
        f1.alpaca(urlfd);
      });

      afterAll(function () {
        $('body').empty();
      });

      it("can be instantiated and is url field", function (done) {
        var field = $('#furl').find('.alpaca-field');
        expect(field.length).toEqual(1);
        var internal = $('#furl').find("input[type='text']");
        expect(internal.length).toEqual(1);
        var fieldurl = $('#furl').find('.alpaca-field-url');
        expect(fieldurl.length).toEqual(1);
        setTimeout(function () {
          var type = $('#furl').alpaca('get').fieldView.model.attributes.options.type;
          expect(type).toEqual('url');
          done();
        }, 100);
      });

      it("it has hyperlink to navigate to web-address", function () {
        var urlLink = $('#furl').find('.cs-field-read a');
        expect(urlLink.length).toEqual(1);
        var urlAddress = urlLink.attr('href');
        expect(urlAddress).toEqual(urlfd.data);
        var urlText = urlLink.text();
        expect(urlText.trim()).toEqual(urlfd.data);
      });

      it("if required:true, shows up required", function () {
        var required = $('#furl').find('.alpaca-required');
        var requiredIcon = $('#furl').find('.alpaca-icon-required');
        expect(required.length).toEqual(1);
        expect(requiredIcon.length).toEqual(1);
      });
      it("if required field emptied and validated, shows error", function () {
        var fieldView = $('#furl').alpaca('get').fieldView;
        var invalid = $('#furl').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        var ok = fieldView.setValue('', true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#furl').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);
      });
      it("if set invalid url and validated, shows error", function () {
        var fieldView = $('#furl').alpaca('get').fieldView;
        var ok = fieldView.setValue('http://google.co.in', true); // validate
        expect(ok).toBeTruthy();
        var invalid = $('#furl').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        ok = fieldView.setValue('abc', true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#furl').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
      });

    });

    describe("Fields.Alpaca.CsuiIntegerField", function () {

      var ifd, f1, fi2, ifdEmpty, placeHolder;

      beforeAll(function (done) {
        ifd = {
          data: "9",
          options: {
            "hidden": false,
            "type": "integer"
          },
          schema: {
            "required": true,
            "title": "Integer",
            "type": "integer",
            "maximum": 10,
            "minimum": 1
          }
        };
        placeHolder = "placeholder";
        ifdEmpty = {
          data: "",
          options: {
            "type": "integer",
            "placeholder": placeHolder
          },
          schema: {
            "title": "Text Field",
            "type": "integer",
            "required": false
          }
        };

        f1 = $('<div id="fi"/>').appendTo('body');
        ifd.postRender = done;    // call done on postRender
        f1.alpaca(ifd);

        fi2 = $('<div id="fi2"/>').appendTo('body');
        ifd.postRender = done;    // call done on postRender
        fi2.alpaca(ifdEmpty);
      });

      afterAll(function () {
        $('body').empty();
      });

      it("can be instantiated and is integer field[Low]", function () {
        var field = $('#fi').find('.alpaca-field');
        expect(field.length).toEqual(1);
        var internal = $('#fi').find("input[type='text']");
        expect(internal.length).toEqual(1);
        var fieldurl = $('#fi').find('.alpaca-field-text');
        expect(fieldurl.length).toEqual(1);
      });

      it("if required:true, shows up required[Low]", function () {
        var required = $('#fi').find('.alpaca-required');
        var requiredIcon = $('#fi').find('.alpaca-icon-required');
        expect(required.length).toEqual(1);
        expect(requiredIcon.length).toEqual(1);
      });

      it("if required:false, doesn't show up required[Low]", function () {
        var required = $('#fi2').find('.alpaca-required');
        var requiredIcon = $('#fi2').find('.alpaca-icon-required');
        expect(required.length).toEqual(0);
        expect(requiredIcon.length).toEqual(0);
      });

      it("empty shows placeholder[Low]", function () {
        var placeholder = $('#fi2').find("input[placeholder]")[0].placeholder;
        expect(placeholder.trim()).toEqual(placeHolder);
      });

      it("if required field emptied and validated shows error[High]", function () {
        var invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        var ok = f1.alpaca().fieldView.setValue('', true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
      });

      it("if range is exceeded and validated shows error[High]", function () {
        var ok = f1.alpaca().fieldView.setValue("5", true); // validate
        expect(ok).toBeTruthy();
        var invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        ok = f1.alpaca().fieldView.setValue("55", true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
        ok = f1.alpaca().fieldView.setValue("5", true); // validate
        expect(ok).toBeTruthy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        ok = f1.alpaca().fieldView.setValue("0", true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
      });

      it("if non integer values are passed and validated shows error[High]", function () {
        var ok = f1.alpaca().fieldView.setValue("5", true); // validate
        expect(ok).toBeTruthy();
        var invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        ok = f1.alpaca().fieldView.setValue("abc", true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
        ok = f1.alpaca().fieldView.setValue("5", true); // validate
        expect(ok).toBeTruthy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        ok = f1.alpaca().fieldView.setValue("2.25", true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element
        ok = f1.alpaca().fieldView.setValue("5", true); // validate
        expect(ok).toBeTruthy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(0);  //No invalid field element
        ok = f1.alpaca().fieldView.setValue("2,25", true); // validate
        expect(ok).toBeFalsy();
        invalid = $('#fi').find('.cs-formfield-invalid');
        expect(invalid.length).toEqual(1);  //1 invalid field element

      });

    });

    describe("Fields.Alpaca.CsuiNodepickerField", function () {

      var npfd;
      beforeEach(function (done) {
        npfd = {
          connector: {
            id: 'otcs_context',
            config: {context: context}
          },
          data: {
            shortcut: 2000
          },
          options: {
            fields: {
              shortcut: {
                anchorTitle: "Enterprise>Classic 3000/3 Jet",
                label: "Location (nodepicker)",
                type: "otcs_node_picker",
                url: "#nodes/69321"
              }
            }
          },
          schema: {
            properties: {
              shortcut: {
                format: "uri",
                type: "string"
              }
            }
          }
        };

        var f1 = $('<div id="fnp"/>').appendTo('body');
        npfd.postRender = done;
        f1.alpaca(npfd);

      });

      beforeEach(function () {
        mock.enable();
      });

      afterEach(function () {
        mock.disable();
      });

      afterAll(function () {
        $('body').empty();
      });

      it("can be instantiated and is nodepicker field", function () {
        var field = $('#fnp').find('.alpaca-field.alpaca-field-otcs_node_picker');
        expect(field.length).toEqual(1);
        var internal = $('#fnp').find('.alpaca-field-otcs_node_picker');
        expect(internal.length).toEqual(1);
      });

    });

    describe("Fields.Alpaca.CsuiDateField", function () {

      var fd;

      beforeAll(function (done) {
        fd = {
          data: {
            "187420_11_x_14": null
          },
          options: {
            fields: {
              "187420_11_x_14": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Reviewed at (date)",
                "readonly": false,
                "type": "date"
              }
            }
          },
          schema: {
            properties: {
              "187420_11_x_14": {
                "readonly": false,
                "required": false,
                "title": "Reviewed at (date)",
                "type": "string"
              }
            }
          }
        };

        var f = $('<div id="f9"/>').css({
          position: "relative"
        }).appendTo('body');
        fd.postRender = done;
        f.alpaca(fd);

      });

      beforeEach(function () {
        mock.enable();
      });

      afterEach(function () {
        mock.disable();
      });

      afterAll(function () {
        $('body').empty();
      });

      it("can be instantiated and is date field", function () {
        var field = $('#f9').find('.alpaca-field.alpaca-field-date');
        expect(field.length).toEqual(1);
        var internal = $('#f9').find('.cs-datefield');
        expect(internal.length).toEqual(1);
      });

    });

    describe("Fields.Alpaca.CsuiDateTimeField", function () {

      var fd;

      beforeAll(function (done) {
        fd = {
          data: {
            "187420_11_x_14": null
          },
          options: {
            fields: {
              "187420_11_x_14": {
                "hidden": false,
                "hideInitValidationError": true,
                "label": "Reviewed at (datetime)",
                "readonly": false,
                "type": "datetime"
              }
            }
          },
          schema: {
            properties: {
              "187420_11_x_14": {
                "readonly": false,
                "required": false,
                "title": "Reviewed at (datetime)",
                "type": "string"
              }
            }
          }
        };

        var f = $('<div id="f10"/>').css({
          position: "relative"
        }).appendTo('body'); // gets id alpaca10
        fd.postRender = done;
        f.alpaca(fd);

      });

      beforeEach(function () {
        mock.enable();
      });

      afterEach(function () {
        mock.disable();
      });

      afterAll(function () {
        $('body').empty();
      });

      it("can be instantiated and is datetime field", function () {
        var field = $('#f10').find('.alpaca-field.alpaca-field-datetime');
        expect(field.length).toEqual(1);
        var internal = $('#f10').find('.cs-datetime');
        expect(internal.length).toEqual(1);
      });

    });

    describe("Fields.Alpaca.CsuiSelectField", function () {

      var fd, f, selectField;

      beforeAll(function (done) {
        fd = {
          data: "Draft",
          options: {
            "hidden": false,
            "hideInitValidationError": true,
            "label": "Status (select)",
            "readonly": false,
            "required": true,
            "type": "select"
          },
          schema: {
            "enum": [
              "Draft",
              "Review",
              "Released",
              "Public"
            ],
            "readonly": false,
            "required": true,
            "title": "Status"
          }

        };

        f = $('<div id="f11" />').appendTo('body'); // gets id alpaca11
        fd.postRender = done;
        f.alpaca(fd);
        selectField = f.alpaca().fieldView;
        if (!$.contains(document, selectField.el)) {
          $('body').append(selectField.$el);
        }

      });

      beforeEach(function () {
        mock.enable();
      });

      afterEach(function () {
        mock.disable();
      });

      afterAll(function () {
        $('body').empty();
      });

      it("can be instantiated and is select field", function (done) {
        var field         = $("#f11").find('.alpaca-field.alpaca-field-select'),
            intervalCount = 0;
        expect(field.length).toEqual(1);
        var interval = setInterval(function () {
          var internal = $('#f11').find('.cs-selectfield');
          if (internal.length > 0 || intervalCount > 5) {
            clearInterval(interval);
            expect(internal.length).toEqual(1);
            done();
          }
          intervalCount++;
        }, 10);
      });

      it("shows up required", function () {
        var required = $('#f11').find('.alpaca-required');
        var requiredIcon = $('#f11').find('.alpaca-icon-required');
        expect(required.length).toEqual(1);
        expect(requiredIcon.length).toEqual(1);
      });

      it("if required:false, doesn't show up required", function () {
        var required = $('#f12').find('.alpaca-required');
        var requiredIcon = $('#f12').find('.alpaca-icon-required');
        expect(required.length).toEqual(0);
        expect(requiredIcon.length).toEqual(0);
      });

      it("has two states: readable and writeable", function () {
        var readState = $('#f11').find('.cs-field-read');
        var writeState = $('#f11').find('.cs-field-write');
        expect(readState).toBeTruthy();
        expect(writeState).toBeTruthy();
        expect(!!selectField.getStatesBehavior()).toBeTruthy();
        expect(!!selectField.getEditableBehavior()).toBeTruthy();
      });

      it("providing the value exists in drop-down", function () {
        expect(f.alpaca().setValueAndValidate('Review', true)).toBeTruthy();
      });

      it("providing the value which doesn't exists in drop-down", function () {
        expect(f.alpaca().setValueAndValidate('dummy', true)).toBeFalsy();
      });

      it("set blank value : check for error class", function (done) {
        var model         = selectField.getValue(),
            intervalCount = 0;
        model.id = '';
        model.attributes.id = '';
        model.attributes.name = '';
        selectField._setSelection(model);
        selectField.ui.writeField.blur();
        var interval = setInterval(function () {
          if ($('#f11 .cs-formfield-invalid').length > 0 || intervalCount > 5) {
            clearInterval(interval);
            expect($('#f11 .cs-formfield-invalid').length).toEqual(1);
            done();
          }
          intervalCount++;
        }, 10);
      });

      it("Sending value to the selectField using model: check no error", function (done) {
        var model         = selectField.getValue(),
            intervalCount = 0;
        selectField.resetSelection();
        model.id = 'Released';
        model.attributes.id = 'Released';
        model.attributes.name = 'Released';
        selectField._setSelection(model);
        selectField.ui.writeField.blur();
        var interval = setInterval(function () {
          if ($('#f11 .cs-formfield-invalid').length === 0 || intervalCount > 5) {
            clearInterval(interval);
            expect($('#f11 .cs-formfield-invalid').length).toEqual(0);
            done();
          }
          intervalCount++;
        }, 10);
      });

      it("is readable per default", function () {
        expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
      });

      describe("a readable field", function () {

        beforeAll(function () {
          selectField.render();
        });
        it("shows its value", function () {
          expect(selectField.getValue()).toEqual(selectField.model);
          expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          expect(selectField.getEditableBehavior()._isCancelIconVisible()).toBeFalsy();
        });
        it("gives the right value", function () {
          expect(selectField.getValue()).toEqual(selectField.model);
        });
        it("allows to set the value", function () {
          var model = selectField.getValue();
          model.id = 'Released';
          model.attributes.id = 'Released';
          model.attributes.name = 'Released';
          selectField._setSelection(model);
          expect(selectField.getValue()).toEqual(model);
          selectField.ui.writeField.blur();
        });
        it("shows an edit icon on hovering (300ms) the field's value ",
            function (done) {
              var intervalCount = 0;
              expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
              selectField.getEditableBehavior().ui.readArea.trigger('mouseover');
              var interval = setInterval(function () {
                if (intervalCount > 5) {
                  clearInterval(interval);
                  expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                  done();
                }
                intervalCount++;
              }, 50);
            });
        it("not having the focus: hides the edit icon on mouse leave (after 10ms) ",
            function (done) {
              var intervalCount = 0;
              expect(selectField.getEditableBehavior().hasReadFocus()).toBeFalsy();
              expect(selectField.getStatesBehavior().isWriteOnly()).toBeFalsy();
              selectField.getEditableBehavior()._showEditIcon();
              expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
              selectField.getEditableBehavior().ui.readArea.trigger('mouseleave');
              var interval = setInterval(function () {
                if (intervalCount > 5) {
                  clearInterval(interval);
                  expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                  done();
                }
                intervalCount++;
              }, 10);
            });
        xit("having the focus: always shows the edit icon", function () { //failing only in bulk execution, need to check
          expect(selectField.getEditableBehavior().hasReadFocus()).toBeFalsy();
          expect(selectField.getStatesBehavior().isWriteOnly()).toBeFalsy();
          expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          selectField.getEditableBehavior().ui.readField.focus();
          expect(selectField.getEditableBehavior().hasReadFocus()).toBeTruthy();
          expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
        });

        describe("can be made writeable by", function () {

          beforeEach(function () {
            selectField.getStatesBehavior().setStateRead(false);
          });

          it("clicking on the field area", function () {
            expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
            selectField.getEditableBehavior().ui.readAreaInner.simulate('click');

            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();

          });
          it("clicking on the edit icon", function () {
            expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
            selectField.getEditableBehavior().ui.editIcon.simulate('click');

            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          });
          it("having the focus: pressing F2", function () {
            expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
            selectField.setFocus();
            selectField.ui.readField.trigger({type: 'keydown', keyCode: 113}); // F2

            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          });
          it("having the focus: pressing Enter", function () {
            expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
            selectField.ui.readField.focus();
            selectField.$el.simulate('key-sequence', {sequence: '{enter}'});

            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          });
        });

      });

      describe("a writeable field", function () {

        beforeEach(function () {
          selectField.getStatesBehavior().setStateWrite(true, true);
        });
        it("shows a cancel icon and no edit icon", function () {
          expect(selectField.ui.writeField.is(':visible')).toBeTruthy();
          expect(selectField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          expect(selectField.getEditableBehavior()._isCancelIconVisible()).toBeTruthy();
        });
        describe("can be made readable by", function () {

          beforeEach(function () {
            selectField.getStatesBehavior().setStateWrite(true, true);
            selectField.ui.writeField.focus();
            var model = selectField.getValue();
            model.id = 'Released';
            model.attributes.id = 'Released';
            model.attributes.name = 'Released';
            selectField._setSelection(model);
          });
          it("clicking on the cancel icon", function () {
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            selectField.getEditableBehavior().ui.cancelIcon.trigger('click');
            expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
          });
          it("clicking outside the field", function (done) {
            var intervalCount = 0;
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            selectField.ui.writeField.blur();
            selectField.getEditableBehavior().ui.writeArea.trigger('blur');

            var interval = setInterval(function () {
              if (intervalCount > 5) {
                clearInterval(interval);
                expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
                done();
              }
              intervalCount++;
            }, 10);
          });
          it("having focus: pressing Enter", function (done) {
            var intervalCount = 0;
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            selectField.$el.trigger({type: 'keypress', keyCode: 13}); // ENTER
            var interval = setInterval(function () {
              if (intervalCount > 5) {
                clearInterval(interval);
                expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
                done();
              }
              intervalCount++;
            }, 10);
          });
          it("having focus: pressing F2", function () {
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            selectField.$el.trigger({type: 'keydown', keyCode: 113}); // F2
            expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
          });
          it("having focus: pressing Escape", function () {
            expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
            selectField.$el.trigger({type: 'keydown', keyCode: 27}); // Escape
            expect(selectField.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(selectField.getStatesBehavior().isStateWrite()).toBeFalsy();
          });
        });

        it("drop-down will be displayed, on pressing down arrow", function () {
          expect(selectField.getStatesBehavior().isStateRead()).toBeFalsy();
          expect(selectField.getStatesBehavior().isStateWrite()).toBeTruthy();
          selectField.$el.trigger({type: 'keypress', keyCode: 40}); // Down arrow
          expect(selectField.isDropdownOpen).toBeTruthy();
        });

        it("shows its old value if cancel icon is clicked", function () {
          var oldValue = selectField.getValue();
          var newValue = _.clone(selectField.getValue());
          newValue.id = 'Draft';
          newValue.attributes.id = 'Draft';
          newValue.attributes.name = 'Draft';
          expect(selectField.getValue()).toEqual(oldValue);//before changing the value
          selectField._setSelection(newValue);//set different value
          selectField.getEditableBehavior().ui.cancelIcon.trigger('mousedown');//click on cancel icon
          expect(selectField.getValue()).toEqual(oldValue); // value should reset to it's old state

        });

        it("shows its old value if escape is pressed", function () {
          var oldValue = selectField.getValue();
          var newValue = _.clone(selectField.getValue());
          newValue.id = 'Review';
          newValue.attributes.id = 'Review';
          newValue.attributes.name = 'Review';
          expect(selectField.getValue()).toEqual(oldValue);//before changing the value
          selectField._setSelection(newValue);//set different value
          selectField.$el.trigger({type: 'keydown', keyCode: 27}); // hit Escape
          expect(selectField.getValue()).toEqual(oldValue); // value should reset to it's old state

        });

      });

    });

  });

});
