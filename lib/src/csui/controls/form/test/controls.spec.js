/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/utils/base",
  "csui/controls/form/fields/userfield.view",
  "csui/controls/form/fields/booleanfield.view",
  "csui/controls/form/fields/selectfield.view",
  "csui/controls/form/fields/textfield.view",
  "csui/controls/form/fields/textareafield.view",
  "csui/controls/form/fields/datefield.view",
  "csui/controls/form/fields/nodepickerfield.view",
  'csui/controls/form/fields/reservebuttonfield.view',
  'csui/widgets/metadata/general.panels/document/document.general.form.model',
  "./alpcontrols.mock.data.js",
  'csui/utils/contexts/page/page.context',
  'csui/utils/connector',
  'csui/models/action',
  'csui/models/actions',
  'csui/models/node/node.model',
  'csui/lib/bililiteRange',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext',
  'csui/lib/jquery.simulate.key-sequence'
], function ($, _, Backbone, Marionette, base, UserFieldView, BooleanFieldView,
    SelectFieldView, TextFieldView, TextAreaFieldView, DateFieldView, NodePickerFieldView,
    ReserveButtonFieldView, DocumentGeneralFormModel, mock, PageContext, Connector, ActionModel,
    ActionCollection,
    NodeModel) {
  'use strict';

  xdescribe("Form Controls", function () {

    describe("UserFieldView", function () {
      var context, userField, emptyUserField, allTestsDone;
      var ufId  = "ufID",
          eufId = "eufID",
          data  = {};

      beforeAll(function () {
        mock.enable();
      });

      beforeEach(function () {
        context = new PageContext({
          factories: {
            connector: {
              connection: {
                url: '//server/otcs/cs/api/v1/',
                supportPath: '/support',
                session: {
                  ticket: 'dummy'
                }
              }
            }
          }
        });

        if (!userField) {
          userField = new UserFieldView({
            context: context,
            id: ufId,
            alpaca: {
              options: {
                applyFlag: true
              }
            },
            model: new Backbone.Model({
              data: data,
              schema: {
                readonly: false
              },
              options: {
                setRequiredFieldsEditable: true
              }
            })
          });
          userField.alpacaField = {refreshValidationState: function () {}};
          userField.render();
        }

        if (!$.contains(document, userField.el)) {
          $('body').append(userField.$el); // this is important, otherwise simulate does not work
        }

        if (!emptyUserField) {
          emptyUserField = new UserFieldView({
            context: context,
            id: eufId,
            alpaca: {
              options: {
                applyFlag: true
              }
            },
            model: new Backbone.Model({
              data: data,
              schema: {
                readonly: false
              },
              options: {
                setRequiredFieldsEditable: true
              }
            })
          });
          emptyUserField.render();
        }

        if (!$.contains(document, emptyUserField.el)) {
          $('body').append(emptyUserField.$el); // this is important, otherwise simulate does not work
        }

        allTestsDone = false;
      });

      afterEach(function () {
        if (allTestsDone) {
          $('body').empty();
        }
      });

      afterAll(function () {
        mock.disable();
      });

      describe("as a control", function () {

        it("can be instantiated", function () {
          expect(userField).toBeDefined();
          expect(emptyUserField).toBeDefined();
        });

        it('assigns right classes', function () {
          var className = userField.$el.attr('class');
          expect(className).toBeDefined();
          var classes = className.split(' ');
          expect(classes).toContain('cs-formfield', 'cs-userfield');
        });

      });

      describe("rendered in DOM", function () {
        var writeField, InvalidUser;
        it("has two states: readable and writeable", function () {
          expect(!!userField.getStatesBehavior()).toBeTruthy();
          expect(!!userField.getEditableBehavior()).toBeTruthy();
        });

        it("In create mode userfield is writable by default", function () {
          expect(userField.getStatesBehavior().isStateWrite()).toBeTruthy();
        });

        it("has user dropdown", function () {
          expect(userField.isReadyToSave()).toBeTruthy();
        });

        it("should show user on dropdown", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount = 0;
          writeField.val('a');
          writeField.trigger('keyup');
          interval = setInterval(function () {
            typeahead = userField.$el.find('.picker-container ul.typeahead>li');
            if (typeahead.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(typeahead.length > 0).toBeTruthy();
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should show user on dropdown", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount;
          writeField.val('b');
          writeField.trigger('keyup');
          interval = setInterval(function () {
            typeahead = userField.$el.find('.picker-container ul.typeahead>li');
            if (typeahead.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(typeahead.length > 0).toBeTruthy();
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should show default group on dropdown", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount = 0;
          writeField.val('d');
          writeField.trigger('keyup');
          interval = setInterval(function () {
            typeahead = userField.$el.find('.csui-icon.image_group_placeholder');
            if (typeahead.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(typeahead.length > 0).toBeTruthy();
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should show no results when there is no user", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount = 0;
          writeField.val('xyz');
          writeField.trigger('keyup');
          interval = setInterval(function () {
            typeahead = userField.$el.find('.picker-container ul .csui-user-picker-no-results');
            if (typeahead.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(typeahead.length).toEqual(0);
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should show userpicker", function () {
          expect(!!userField.pickerView.ui.userpicker).toBeTruthy();
        });

        it("should show list of autosuggested users", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount;
          writeField.val('a');
          writeField.trigger('keyup');
          interval = setInterval(function () {
            typeahead = userField.$el.find('.picker-container ul.typeahead>li');
            if (typeahead.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(typeahead.length > 0).toBeTruthy();
              expect(typeahead.length).toEqual(4);
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should fail if the count doesnot match with the autosuggested users", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount;
          writeField.val('a');
          writeField.trigger('keyup');
          interval = setInterval(function () {
            typeahead = userField.$el.find('.picker-container ul.typeahead>li');
            if (typeahead.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(typeahead.length).not.toEqual(10);
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should show users in the suggested dropdown", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount;
          writeField.val('a');
          writeField.trigger('keyup');
          var names = ["Admin", "Arabic", "Business Administrator", "DefaultGroup"];
          interval = setInterval(function () {
            typeahead = userField.$el.find('.picker-container ul.typeahead>li');
            if (typeahead.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(typeahead.length > 0).toBeTruthy();
              if (names.indexOf($(typeahead.find('.name')[0]).text()) !== -1) {
                expect(typeahead.find('.name').text()).toBeTruthy();
                expect(typeahead.find('.name')[0]).toBeTruthy();
                expect(typeahead.find('.name')[1]).toBeTruthy();
                expect(typeahead.find('.name')[2]).toBeTruthy();
                expect(typeahead.find('.name')[3]).toBeTruthy();
              }
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should throw error on manual enter and focusout", function (done) {
          writeField = userField.$el.find('.picker-container input');
          var typeahead, interval, intervalCount = 0, el;
          writeField.val('anusha');
          writeField.trigger('keypress');
          writeField.trigger('focusout');
          el = writeField.closest('.cs-userfield.cs-formfield-invalid');
          interval = setInterval(function () {
            el = writeField.closest('.cs-userfield.cs-formfield-invalid');
            if (el.length > 0 || intervalCount > 9) {
              clearInterval(interval);
              expect(el.length > 0).toBeTruthy();
              done();
            }
            intervalCount++;
          }, 50);
        });

        it("should allow edit only on clicking icon", function (done) {
          userField.getStatesBehavior().setStateRead(false, false); //by default write mode so,
          userField.$el.find('.csui-icon-edit.inline-edit-icon').trigger('click');
          expect(userField.$el.find('.cs-field-read.binf-hidden').length).toEqual(1);
          expect(userField.$el.find('.cs-field-write.binf-hidden').length).toEqual(0);
          done();
        });
      });
    });

    describe("TextFieldView", function () {

      var tfId    = "tfID",
          etfId   = "etfID",
          tfVal1  = "tfVal1",
          tfVal2  = "tfVal2",
          tfLabel = "tfLabel";
      var textField, emptyTextField;

      var allTestsDone;

      beforeEach(function () {
        if (!textField) {
          textField = new TextFieldView({
            id: tfId,
            model: new Backbone.Model({
              data: tfVal1,
              options: {label: tfLabel}
            })
          });

          textField.render();
        }

        if (!$.contains(document, textField.el)) {
          $('body').append(textField.$el); // this is important, otherwise simulate does not work
        }

        if (!emptyTextField) {
          emptyTextField = new TextFieldView({
            id: etfId,
            model: new Backbone.Model({
              data: ''
            })
          });
          emptyTextField.render();
        }

        if (!$.contains(document, emptyTextField.el)) {
          $('body').append(emptyTextField.$el); // this is important, otherwise simulate does not work
        }

        allTestsDone = false;
      });

      afterEach(function () {
        if (allTestsDone) {
          $('body').empty();
        }
      });

      describe("as a control", function () {

        it("can be instantiated", function () {
          expect(textField).toBeDefined();
          expect(emptyTextField).toBeDefined();
        });

      });

      describe("rendered in DOM", function () {

        it("has two states: readable and writeable", function () {
          expect(!!textField.getStatesBehavior()).toBeTruthy();
          expect(!!textField.getEditableBehavior()).toBeTruthy();
        });

        it("is readable per default", function () {
          expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
        });

        describe("a readable field", function () {

          beforeEach(function () {
            if (!$.contains(document, textField.el)) {
              $('body').append(textField.$el);
            }
          });

          it("shows its value", function () {
            expect(textField.getValue()).toEqual(tfVal1);
            expect(emptyTextField.getValue()).toEqual('');
            expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            expect(textField.getEditableBehavior()._isCancelIconVisible()).toBeFalsy();
          });

          it("gives the right value", function () {
            expect(textField.getValue()).toEqual(tfVal1);
            expect(emptyTextField.getValue()).toEqual("");
          });

          it("allows to set the value", function () {
          });

          it("shows an edit icon on hovering (300ms) the field's value ",
              function (done) {
                expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                textField.getEditableBehavior().ui.readArea.trigger('mouseover');
                expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();

                setTimeout(function () {
                  expect(
                      textField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                  done();
                }, 350);
              });
          xit("not having the focus: hides the edit icon on mouse leave (after 10ms) ",
              function (done) {
                expect(textField.getEditableBehavior().hasReadFocus()).toBeFalsy();
                expect(textField.getStatesBehavior().isWriteOnly()).toBeFalsy();
                textField.getEditableBehavior()._showEditIcon();
                expect(textField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                textField.getEditableBehavior().ui.readArea.trigger('mouseleave');

                setTimeout(function () {
                  expect(
                      textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                  done();
                }, 100);
              });
          xit("having the focus: always shows the edit icon", function (done) {
            expect(textField.getEditableBehavior().hasReadFocus()).toBeFalsy();
            expect(textField.getStatesBehavior().isWriteOnly()).toBeFalsy();
            expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            textField.getEditableBehavior().ui.readField.focus();

            var intervalCount = 0,
                interval      = setInterval(function () {
                  var isEditIconVisible = textField.getEditableBehavior()._isEditIconVisible();
                  if (isEditIconVisible || intervalCount > 9) {
                    clearInterval(interval);
                    expect(textField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                    done();
                  }
                  intervalCount++;
                }, 150);
          });
          xdescribe("can be made writeable by", function () {

            beforeEach(function () {
              if (!$.contains(document, textField.el)) {
                $('body').append(textField.$el);
              }
              textField.getStatesBehavior().setStateRead(false); // validate: false
            });

            it("clicking on the field area", function () {
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              textField.getEditableBehavior().ui.readAreaInner.simulate('click');

              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();

            });

            it("clicking on the edit icon", function () {
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              textField.getEditableBehavior().ui.editIcon.simulate('click');

              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });

            it("having the focus: pressing F2", function () {
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              textField.setFocus();
              textField.ui.readField.trigger({type: 'keydown', keyCode: 113}); // F2

              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });

            it("having the focus: pressing Enter", function () {
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              textField.ui.readField.focus();
              textField.$el.simulate('key-sequence', {sequence: '{enter}'});

              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });

          });

        });
        xdescribe("a writeable field", function () {

          beforeEach(function () {
            textField.getStatesBehavior().setStateWrite(false, true);
          });

          it("shows its value", function () {
            expect(textField.ui.writeField.is(':visible')).toBeTruthy();
            expect(textField.ui.writeField.val()).toEqual(tfVal1);
            expect(emptyTextField.ui.writeField.val()).toEqual('');
          });

          it("shows an cancel icon and no edit icon", function () {
            expect(textField.ui.writeField.is(':visible')).toBeTruthy();
            expect(textField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            expect(textField.getEditableBehavior()._isCancelIconVisible()).toBeTruthy();
          });

          describe("can be made readable by", function () {

            beforeEach(function () {
              textField.getStatesBehavior().setStateWrite(false, true);
              if (!$.contains(document, textField.el)) {
                $('body').append(textField.$el);
              }
            });

            it("clicking on the cancel icon", function () {
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textField.getEditableBehavior().ui.cancelIcon.trigger('click');
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

            it("clicking outside the field", function (done) {
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textField.getEditableBehavior().ui.writeField.trigger('blur');

              setTimeout(function () {
                expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
                done();
              }, 100);
            });

            it("having focus: pressing Enter", function () {
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textField.$el.simulate('key-sequence', {sequence: '{enter}'});
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

            it("having focus: pressing F2", function () {
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textField.$el.trigger({type: 'keydown', keyCode: 113}); // F2
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

            it("having focus: pressing Escape", function () {
              expect(textField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textField.$el.trigger({type: 'keydown', keyCode: 27}); // Escape
              expect(textField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(textField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

          });

          it("throws event when value has changed", function (done) {
            textField.getStatesBehavior().setStateWrite();

            var newVal = "newVal";
            textField.once('field:changed', function (event) {
              expect(event.fieldid).toEqual(tfId);
              expect(event.fieldvalue).toEqual(newVal);
              done();
            });
            textField.setValue(newVal);
          });

          it("shows its old value if cancel icon is clicked", function (done) {
            var newVal = "newVal",
                oldVal = "oldVal";
            textField.setValue(oldVal);
            expect(textField.getValue()).toEqual(oldVal);
            textField.getEditableBehavior().ui.writeField.val(newVal);

            setTimeout(function () {
              expect(textField.getValue()).toEqual(oldVal);
              done();
            }, 100);
            textField.getEditableBehavior().ui.cancelIcon.trigger('mousedown');
          });

          it("shows its old value if escape is pressed", function (done) {
            var newVal = "newVal",
                oldVal = "oldVal";
            textField.setValue(oldVal);
            expect(textField.getValue()).toEqual(oldVal);
            textField.getEditableBehavior().ui.writeField.val(newVal);

            setTimeout(function () {
              expect(textField.getValue()).toEqual(oldVal);
              allTestsDone = true;
              done();
            }, 100);
            textField.$el.trigger({type: 'keydown', keyCode: 27}); // Escape
          });

        });

      });

    });

    xdescribe("TextAreaFieldView", function () {

      var tafId    = "tafID",
          etafId   = "etafID",
          tafVal1  = "tafVal1",
          tafVal2  = "tafVal2",
          tafLabel = "tafLabel";
      var textAreaField, emptyTextAreaField;

      var allTestsDone;

      beforeEach(function () {
        if (!textAreaField) {
          textAreaField = new TextAreaFieldView({
            id: tafId,
            model: new Backbone.Model({
              data: tafVal1,
              options: {label: tafLabel}
            })
          });

          textAreaField.render();
        }

        if (!$.contains(document, textAreaField.el)) {
          $('body').append(textAreaField.$el); // this is important, otherwise simulate does not work
        }

        if (!emptyTextAreaField) {
          emptyTextAreaField = new TextAreaFieldView({
            id: etafId,
            model: new Backbone.Model({
              data: ''
            })
          });
          emptyTextAreaField.render();
        }

        if (!$.contains(document, emptyTextAreaField.el)) {
          $('body').append(emptyTextAreaField.$el); // this is important, otherwise simulate
        }

        allTestsDone = false;
      });

      afterEach(function () {
        if (allTestsDone) {
          $('body').empty();
        }
      });

      describe("as a control", function () {

        it("can be instantiated", function () {
          expect(textAreaField).toBeDefined();
          expect(emptyTextAreaField).toBeDefined();
        });

      });

      describe("rendered in DOM", function () {

        it("has two states: readable and writeable", function () {
          expect(!!textAreaField.getStatesBehavior()).toBeTruthy();
          expect(!!textAreaField.getEditableBehavior()).toBeTruthy();
        });

        it("is readable per default", function () {
          expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
        });

        describe("a readable field", function () {

          beforeEach(function () {
            if (!$.contains(document, textAreaField.el)) {
              $('body').append(textAreaField.$el);
            }
          });

          it("shows its value", function () {
            expect(textAreaField.getValue()).toEqual(tafVal1);
            expect(emptyTextAreaField.getValue()).toEqual('');
            expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            expect(textAreaField.getEditableBehavior()._isCancelIconVisible()).toBeFalsy();
          });

          it("gives the right value", function () {
            expect(textAreaField.getValue()).toEqual(tafVal1);
            expect(emptyTextAreaField.getValue()).toEqual("");
          });

          it("allows to set the value", function () {
          });

          it("shows an edit icon on hovering (300ms) the field's value ",
              function (done) {
                expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                textAreaField.getEditableBehavior().ui.readArea.trigger('mouseover');
                expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();

                setTimeout(function () {
                  expect(
                      textAreaField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                  done();
                }, 350);
              });

          it("not having the focus: hides the edit icon on mouse leave (after 10ms) ",
              function (done) {
                expect(textAreaField.getEditableBehavior().hasReadFocus()).toBeFalsy();
                expect(textAreaField.getStatesBehavior().isWriteOnly()).toBeFalsy();
                textAreaField.getEditableBehavior()._showEditIcon();
                expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                textAreaField.getEditableBehavior().ui.readArea.trigger('mouseleave');

                setTimeout(function () {
                  expect(
                      textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                  done();
                }, 100);
              });

          it("having the focus: always shows the edit icon", function (done) {
            expect(textAreaField.getEditableBehavior().hasReadFocus()).toBeFalsy();
            expect(textAreaField.getStatesBehavior().isWriteOnly()).toBeFalsy();
            expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            textAreaField.getEditableBehavior().ui.readField.focus();

            setTimeout(function () {
              expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
              done();
            }, 100);
          });

          describe("can be made writeable by", function () {

            beforeEach(function () {
              if (!$.contains(document, textAreaField.el)) {
                $('body').append(textAreaField.$el);
              }
              textAreaField.getStatesBehavior().setStateRead(false); // validate: false
            });

            it("clicking on the field area", function () {
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
              textAreaField.getEditableBehavior().ui.readAreaInner.simulate('click');

              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();

            });

            it("clicking on the edit icon", function () {
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
              textAreaField.getEditableBehavior().ui.editIcon.simulate('click');

              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });

            it("having the focus: pressing F2", function () {
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
              textAreaField.setFocus();
              textAreaField.ui.readField.trigger({type: 'keydown', keyCode: 113}); // F2

              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });

            it("having the focus: pressing Enter", function () {
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
              textAreaField.ui.readField.focus();
              textAreaField.$el.simulate('key-sequence', {sequence: '{enter}'});

              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });

          });

        });

        describe("a writeable field", function () {

          beforeEach(function () {
            textAreaField.getStatesBehavior().setStateWrite(false, true);
          });

          it("shows its value", function () {
            expect(textAreaField.ui.writeField.is(':visible')).toBeTruthy();
            expect(textAreaField.ui.writeField.val()).toEqual(tafVal1);
            expect(emptyTextAreaField.ui.writeField.val()).toEqual('');
          });

          it("shows an cancel icon and no edit icon", function () {
            expect(textAreaField.ui.writeField.is(':visible')).toBeTruthy();
            expect(textAreaField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            expect(textAreaField.getEditableBehavior()._isCancelIconVisible()).toBeTruthy();
          });

          describe("can be made readable by", function () {

            beforeEach(function () {
              textAreaField.getStatesBehavior().setStateWrite(false, true);
              if (!$.contains(document, textAreaField.el)) {
                $('body').append(textAreaField.$el);
              }
            });

            it("clicking on the cancel icon", function () {
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textAreaField.getEditableBehavior().ui.cancelIcon.trigger('click');
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

            it("clicking outside the field", function (done) {
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textAreaField.getEditableBehavior().ui.writeField.trigger('blur');

              setTimeout(function () {
                expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
                done();
              }, 100);
            });

            it("having focus: pressing F2", function () {
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textAreaField.$el.trigger({type: 'keydown', keyCode: 113}); // F2
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textAreaField.getEditableBehavior()._isCancelIconVisible()).toBeFalsy();
            });

            it("having focus: pressing Escape", function () {
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textAreaField.$el.trigger({type: 'keydown', keyCode: 27}); // Escape
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(textAreaField.getEditableBehavior()._isCancelIconVisible()).toBeFalsy();
            });

          });

          describe("can not be made readable by", function () {

            beforeEach(function () {
              textAreaField.getStatesBehavior().setStateWrite(false, true);
              if (!$.contains(document, textAreaField.el)) {
                $('body').append(textAreaField.$el);
              }
            });

            it("having focus: pressing Enter", function () {
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              textAreaField.$el.simulate('key-sequence', {sequence: '{enter}'});
              expect(textAreaField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(textAreaField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(textAreaField.getEditableBehavior()._isCancelIconVisible()).toBeTruthy();
            });

          });

          it("throws event when value has changed", function (done) {
            textAreaField.getStatesBehavior().setStateWrite();

            var newVal = "newVal";
            textAreaField.once('field:changed', function (event) {
              expect(event.fieldid).toEqual(tafId);
              expect(event.fieldvalue).toEqual(newVal);
              done();
            });
            textAreaField.setValue(newVal);
          });

          it("shows its old value if cancel icon is clicked", function (done) {
            var newVal = "newVal",
                oldVal = "oldVal";
            textAreaField.setValue(oldVal);
            expect(textAreaField.getValue()).toEqual(oldVal);
            textAreaField.getEditableBehavior().ui.writeField.val(newVal);

            setTimeout(function () {
              expect(textAreaField.getValue()).toEqual(oldVal);
              done();
            }, 100);
            textAreaField.getEditableBehavior().ui.cancelIcon.trigger('mousedown');
          });

          it("shows its old value if escape is pressed", function (done) {
            var newVal = "newVal",
                oldVal = "oldVal";
            textAreaField.setValue(oldVal);
            expect(textAreaField.getValue()).toEqual(oldVal);
            textAreaField.getEditableBehavior().ui.writeField.val(newVal);

            setTimeout(function () {
              expect(textAreaField.getValue()).toEqual(oldVal);
              allTestsDone = true;
              done();
            }, 100);
            textAreaField.$el.trigger({type: 'keydown', keyCode: 27}); // Escape
          });

        });

      });

    });

    describe("UrlField using TextFieldView", function () {

      var ufId  = "ufID",
          eufId = "eufID";

      var urlfd = {
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

      var eurlfd = {
        data: "",
        options: {
          hidden: false,
          hideInitValidationError: true,
          label: "EmptyURL",
          readonly: false,
          type: "url"
        },
        schema: {
          readonly: false,
          required: false,
          title: "EmptyURL",
          type: "string"
        }
      };
      var urlField, emptyUrlField;

      var allTestsDone;

      beforeEach(function () {
        if (!urlField) {
          urlField = new TextFieldView({
            id: ufId,
            model: new Backbone.Model({
              data: urlfd.data,
              options: urlfd.options,
              schema: urlfd.schema,
              id: ufId
            }),
            value: urlfd.data,
            alpaca: {
              data: urlfd.data,
              options: urlfd.options,
              schema: urlfd.schema,
            }
          });

          urlField.render();
        }

        if (!$.contains(document, urlField.el)) {
          $('body').append(urlField.$el); // this is important, otherwise simulate does not work
        }

        if (!emptyUrlField) {
          emptyUrlField = new TextFieldView({
            id: eufId,
            model: new Backbone.Model({
              data: eurlfd.data,
              options: eurlfd.options,
              schema: eurlfd.schema,
              id: eufId
            }),
            value: eurlfd.data,
            alpaca: {
              data: eurlfd.data,
              options: eurlfd.options,
              schema: eurlfd.schema,
            }
          });
          emptyUrlField.render();
        }

        if (!$.contains(document, emptyUrlField.el)) {
          $('body').append(emptyUrlField.$el); // this is important, otherwise simulate does not work
        }

        allTestsDone = false;
      });

      afterEach(function () {
        if (allTestsDone) {
          $('body').empty();
        }
      });

      describe("as a control", function () {

        it("can be instantiated", function () {
          expect(urlField).toBeDefined();
          expect(emptyUrlField).toBeDefined();
        });

      });

      describe("rendered in DOM", function () {

        it("has two states: readable and writeable", function () {
          expect(!!urlField.getStatesBehavior()).toBeTruthy();
          expect(!!urlField.getEditableBehavior()).toBeTruthy();
        });

        it("is readable per default", function () {
          expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
          expect(emptyUrlField.getStatesBehavior().isStateRead()).toBeTruthy();
        });

        describe("a readable field", function () {

          beforeEach(function () {
            if (!$.contains(document, urlField.el)) {
              $('body').append(urlField.$el);
            }
            if (!$.contains(document, emptyUrlField.el)) {
              $('body').append(emptyUrlField.$el);
            }
          });

          it("shows its value", function () {
            expect(urlField.getValue()).toEqual(urlfd.data);
            expect(emptyUrlField.getValue()).toEqual('http://');
            expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            expect(urlField.getEditableBehavior()._isCancelIconVisible()).toBeFalsy();
            expect(emptyUrlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            expect(emptyUrlField.getEditableBehavior()._isCancelIconVisible()).toBeFalsy();
          });

          it("gives the right value", function () {
            expect(urlField.getValue()).toEqual(urlfd.data);
            expect(emptyUrlField.getValue()).toEqual("http://");
          });

          it("shows an edit icon on hovering (350ms) the field's value ",
              function (done) {
                expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                urlField.getEditableBehavior().ui.readArea.trigger('mouseover');
                expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();

                setTimeout(function () {
                  expect(
                      urlField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                  done();
                }, 350);
              });

          it("not having the focus: hides the edit icon on mouse leave (after 10ms) ",
              function (done) {
                expect(urlField.getEditableBehavior().hasReadFocus()).toBeFalsy();
                expect(urlField.getStatesBehavior().isWriteOnly()).toBeFalsy();
                urlField.getEditableBehavior()._showEditIcon();
                expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                urlField.getEditableBehavior().ui.readArea.trigger('mouseleave');

                setTimeout(function () {
                  expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                  done();
                }, 100);
              });

          it("having the focus: always shows the edit icon", function (done) {
            expect(urlField.getEditableBehavior().hasReadFocus()).toBeFalsy();
            expect(urlField.getStatesBehavior().isWriteOnly()).toBeFalsy();
            expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            urlField.getEditableBehavior().ui.readField.focus();

            setTimeout(function () {
              expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
              done();
            }, 100);
          });

          describe("cannot be edited or make writable by", function () {

            beforeEach(function () {
              if (!$.contains(document, urlField.el)) {
                $('body').append(urlField.$el);
              }
              urlField.getStatesBehavior().setStateRead(false); // validate: false
            });

            it("clicking on the field area", function () {
              expect(urlField.allowEditOnClickReadArea()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              urlField.getEditableBehavior().ui.readAreaInner.simulate('click');

              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
            });

            it("having the focus: pressing Enter", function () {
              expect(urlField.allowEditOnEnter()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              urlField.ui.readField.focus();
              urlField.$el.simulate('key-sequence', {sequence: '{enter}'});

              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
            });

          });

          describe("can be made writeable by", function () {

            beforeEach(function () {
              if (!$.contains(document, urlField.el)) {
                $('body').append(urlField.$el);
              }
              urlField.getStatesBehavior().setStateRead(false); // validate: false
            });

            it("clicking on the edit icon", function () {
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              urlField.getEditableBehavior().ui.editIcon.simulate('click');

              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });

            it("having the focus: pressing F2", function () {
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              urlField.setFocus();
              urlField.ui.readField.trigger({type: 'keydown', keyCode: 113}); // F2

              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            });
          });

        });

        describe("a writeable field", function () {

          beforeEach(function () {
            urlField.getStatesBehavior().setStateWrite(false, true);
          });

          it("shows its value", function () {
            expect(urlField.ui.writeField.is(':visible')).toBeTruthy();
            expect(urlField.ui.writeField.val()).toEqual(urlfd.data);
            expect(emptyUrlField.ui.writeField.val()).toEqual('');
          });

          it("shows a cancel icon and no edit icon", function () {
            expect(urlField.ui.writeField.is(':visible')).toBeTruthy();
            expect(urlField.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
            expect(urlField.getEditableBehavior()._isCancelIconVisible()).toBeTruthy();
          });

          describe("can be made readable by", function () {

            beforeEach(function () {
              urlField.getStatesBehavior().setStateWrite(false, true);
              if (!$.contains(document, urlField.el)) {
                $('body').append(urlField.$el);
              }
            });

            it("clicking on the cancel icon", function () {
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              urlField.getEditableBehavior().ui.cancelIcon.trigger('click');
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

            it("clicking outside the field", function (done) {
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              urlField.getEditableBehavior().ui.writeField.trigger('blur');

              setTimeout(function () {
                expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
                done();
              }, 100);
            });

            it("having focus: pressing Enter", function () {
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              urlField.$el.simulate('key-sequence', {sequence: '{enter}'});
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

            it("having focus: pressing F2", function () {
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              urlField.$el.trigger({type: 'keydown', keyCode: 113}); // F2
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

            it("having focus: pressing Escape", function () {
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              urlField.$el.trigger({type: 'keydown', keyCode: 27}); // Escape
              expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
            });

          });

          describe("can be edited", function () {

            beforeEach(function () {
              urlField.getStatesBehavior().setStateWrite(false, true);
              if (!$.contains(document, urlField.el)) {
                $('body').append(urlField.$el);
              }
            });

            it("throws event when value has changed", function (done) {
              urlField.getStatesBehavior().setStateWrite();

              var newVal = "http://www.google.com";
              urlField.once('field:changed', function (event) {
                expect(event.fieldid).toEqual(ufId);
                expect(event.fieldvalue).toEqual(newVal);
                done();
              });
              urlField.setValue(newVal);
            });

            it("shows its old value if cancel icon is clicked", function (done) {
              var newVal = "http://www.gmail.com",
                  oldVal = "https://www.google.co.in";
              urlField.setValue(oldVal);
              expect(urlField.getValue()).toEqual(oldVal);
              urlField.getEditableBehavior().ui.writeField.val(newVal);
              urlField.getEditableBehavior().ui.cancelIcon.trigger('mousedown');

              setTimeout(function () {
                expect(urlField.getValue()).toEqual(oldVal);
                done();
              }, 100);
            });

            it("shows its old value if escape is pressed", function (done) {
              var newVal = "http://www.gmail.com",
                  oldVal = "https://www.google.co.in";
              urlField.setValue(oldVal);
              expect(urlField.getValue()).toEqual(oldVal);
              urlField.getEditableBehavior().ui.writeField.val(newVal);
              urlField.$el.trigger({type: 'keydown', keyCode: 27}); // Escape

              setTimeout(function () {
                expect(urlField.getValue()).toEqual(oldVal);
                done();
              }, 100);
            });

            it("shows its new value and turns to read mode, if F2 is pressed", function (done) {
              var newVal = "http://www.yahoo.com";
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              urlField.ui.writeField.val(newVal);
              urlField.ui.writeField.trigger({type: 'keydown', keyCode: 113}); // F2

              setTimeout(function () {
                expect(urlField.getEditValue()).toEqual(newVal);
                expect(urlField.getValue()).toEqual(newVal);
                expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
                done();
              }, 100);
            });

            it("shows its new value and turns to read mode, if Enter is pressed", function (done) {
              var newVal = "http://www.opentext.com",
                  oldVal = "https://www.google.co.in";
              urlField.setValue(oldVal);
              expect(urlField.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(urlField.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(urlField.getValue()).toEqual(oldVal);

              urlField.ui.writeField.val(newVal);
              urlField.ui.writeField.simulate('key-sequence', {sequence: '{enter}'});

              setTimeout(function () {
                expect(urlField.getEditValue()).toEqual(newVal);
                expect(urlField.getValue()).toEqual(newVal);
                expect(urlField.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(urlField.getStatesBehavior().isStateWrite()).toBeFalsy();
                done();
              }, 100);
            });

          });

        });

      });

    });

    describe("DateFieldView", function () {

      var fId,
          efId,
          fVal1,
          fVal2,
          fFormat,
          fLabel,
          fTitle,
          context;
      var field, field2, emptyField;
      var allTestsDone;

      beforeEach(function () {
        mock.enable();
        fId = "npfID";
        efId = "enpfID";
        fVal1 = '2017-08-05T00:00:00';
        fVal2 = '2016-06-11T00:00:00';
        fFormat = "MM.DD.YYYY";
        fLabel = "npfLabel";
        fTitle = "npfTitle";
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

        if (!field) {
          field = new DateFieldView({
            id: fId,
            context: context,
            model: new Backbone.Model({
              data: fVal1,
              options: {}
            })
          });

          field.render();
        }
        if (!$.contains(document, field.el)) {
          $('body').append($('<div/>').css('position', 'relative').append(field.$el));
        }

        if (!emptyField) {
          emptyField = new DateFieldView({
            id: efId,
            context: context,
            model: new Backbone.Model()
          });
          emptyField.render();
        }

        if (!$.contains(document, emptyField.el)) {
          $('body').append(
              $('<div/>').css('position', 'relative').append(emptyField.$el)); // this is important, otherwise simulate does not work
        }

        allTestsDone = false;
      });

      afterEach(function () {
        mock.disable();
        if (allTestsDone) {
          $('body').empty();
        }
      });

      describe("as a control", function () {

        it("can be instantiated [Low]", function () {
          expect(field).toBeDefined();
          expect(emptyField).toBeDefined();
        });
      });
      describe("rendered an in DOM [Low]", function () {
        it("has two states: readable and writable", function () {
          expect(field.getEditableBehavior()).toBeTruthy();
          expect(field.getStatesBehavior()).toBeTruthy();
        });
      });
      describe("a readable field", function () {

        it("gives the right value [Low]", function () {
          expect(field.getValue()).toEqual(fVal1);
          expect(emptyField.getValue()).toBeUndefined();
        });

        it("allows to set the value [Medium]", function () {
          field.setValue(fVal2);
          expect(field.getValue()).toEqual(fVal2);
          field.setValue(fVal1);
          expect(field.getValue()).toEqual(fVal1);
        });

        it("shows an edit icon on hovering (300ms) the field's value  [High]",
            function (done) {
              expect(field.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
              field.getEditableBehavior().ui.readArea.trigger('mouseover');
              setTimeout(function () {
                expect(
                    field.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
                done();
              }, 350);
            });
        it("hide the edit icon on the mouse leave [High]",
            function (done) {
              expect(field.getEditableBehavior().hasReadFocus()).toBeFalsy();
              field.getEditableBehavior()._showEditIcon();
              expect(field.getEditableBehavior()._isEditIconVisible()).toBeTruthy();
              field.getEditableBehavior().ui.readArea.trigger('mouseleave');
              setTimeout(function () {
                expect(
                    field.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
                done();
              }, 100);
            });

        describe("can be made writable by", function () {

          beforeEach(function () {
            if (!$.contains(document, field.el)) {
              $('body').append(field.$el);
            }
            field.getStatesBehavior().setStateRead(false); // validate: false
          });

          it("clicking on the field area [Medium]", function () {
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
            field.getEditableBehavior().ui.readArea.simulate('click');
            expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
            expect(field.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          });

          it("clicking on the edit icon [Medium]", function () {
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
            field.getEditableBehavior().ui.editIcon.simulate('click');
            expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
          });

          it("having the focus: pressing F2 [Medium]", function () {
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
            field.setFocus();
            field.ui.readField.trigger({type: 'keydown', keyCode: 113}); // F2
            expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
            expect(field.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          });

          it("having the focus: pressing Enter [Medium]", function () {
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
            field.ui.readField.focus();
            field.$el.simulate('key-sequence', {sequence: '{enter}'});
            expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(field.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          });

        });
      });
      describe("a writeable field", function () {

        beforeEach(function () {
          field.getStatesBehavior().setStateWrite(false, true);
        });

        it("shows its value [Medium]", function () {
          expect(field.getValue()).toEqual(fVal1);
          var actual   = field.getEditableBehavior().ui.readField.find('div').html(),
              expected = base.formatDate(fVal1);
          expect(actual).toEqual(expected);
          expect(emptyField.ui.writeField.val()).toEqual('');
        });

        it("shows an cancel icon and no edit icon [High]", function () {
          expect(field.ui.writeField.is(':visible')).toBeTruthy();
          expect(field.getEditableBehavior()._isEditIconVisible()).toBeFalsy();
          expect(field.getEditableBehavior()._isCancelIconVisible()).toBeTruthy();
        });

        it("opens the date picker on Pressing space [High]", function () {
          expect(field.ui.writeField.is(':visible')).toBeTruthy();
          field.$el.find('.icon-date_picker').trigger({type: 'keydown', keyCode: 32});
          var datepicker = field.$el.find('.usetwentyfour');
          expect(datepicker.length > 0).toBeTruthy();
        });

        it("opens the date picker on Pressing Enter [High]", function () {
          expect(field.ui.writeField.is(':visible')).toBeTruthy();
          field.$el.find('.icon-date_picker').trigger({type: 'keydown', keyCode: 13});
          var datepicker = field.$el.find('.usetwentyfour');
          expect(datepicker.length > 0).toBeTruthy();

        });

        describe("can be made readable by", function () {

          beforeEach(function () {
            field.getStatesBehavior().setStateWrite(false, true);
          });

          it("clicking outside the field [Medium]", function () {
            expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
            expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
            field.getEditableBehavior().ui.writeField.trigger('blur');
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
          });

          it("clicking on the cancel icon [Medium]", function () {
            expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
            field.getEditableBehavior().ui.cancelIcon.trigger('click');
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
          });

          it("having focus: pressing Enter [Medium]", function () {
            expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
            field.$el.simulate('key-sequence', {sequence: '{enter}'});
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
          });

          it("having focus: pressing F2 [Medium]", function () {
            expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
            field.$el.trigger({type: 'keydown', keyCode: 113}); // F2
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
          });

          it("having focus: pressing Escape [Medium]", function () {
            expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
            expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
            field.$el.trigger({type: 'keydown', keyCode: 27}); // Escape
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
          });
        });

        it("shows its old value if cancel icon is clicked [High]", function (done) {
          field.setValue(fVal1);
          expect(field.getValue()).toEqual(fVal1);
          field.getEditableBehavior().ui.writeField.val(field._formatValue(fVal2));
          field.getEditableBehavior().ui.cancelIcon.trigger('mousedown');
          setTimeout(function () {
            expect(field.getValue()).toEqual(fVal1);
            done();
          }, 100);
        });

        it("shows its old value if escape is pressed [High]", function (done) {
          field.setValue(fVal1);
          expect(field.getValue()).toEqual(fVal1);
          field.getEditableBehavior().ui.writeField.val(field._formatValue(fVal2));
          field.getEditableBehavior().ui.writeField.trigger({type: 'keydown', keyCode: 27}); // Escape
          setTimeout(function () {
            expect(field.getValue()).toEqual(fVal1);
            done();
          }, 100);
        });

        it("shows its new value and turns to read mode, if F2 is pressed [High]", function (done) {
          field.setValue(fVal1);
          expect(field.getValue()).toEqual(fVal1);
          expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
          expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
          field.getEditableBehavior().ui.writeField.val(field._formatValue(fVal2));
          field.getEditableBehavior().ui.writeField.trigger({type: 'keydown', keyCode: 113}); // F2
          setTimeout(function () {
            expect(field.getEditValue()).toEqual(fVal2);
            expect(field.getValue()).toEqual(fVal2);
            expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
            expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
            done();
          }, 100);
        });

        it("shows its new value and turns to read mode, if Enter is pressed [High]",
            function (done) {
              field.setValue(fVal1);
              expect(field.getStatesBehavior().isStateRead()).toBeFalsy();
              expect(field.getStatesBehavior().isStateWrite()).toBeTruthy();
              expect(field.getValue()).toEqual(fVal1);
              field.getEditableBehavior().ui.writeField.val(field._formatValue(fVal2));
              field.getEditableBehavior().ui.writeField.trigger({type: 'keypress', keyCode: 13});
              setTimeout(function () {
                expect(field.getEditValue()).toEqual(fVal2);
                expect(field.getValue()).toEqual(fVal2);
                expect(field.getStatesBehavior().isStateRead()).toBeTruthy();
                expect(field.getStatesBehavior().isStateWrite()).toBeFalsy();
                allTestsDone = true;
                done();
              }, 100);

            });
      });

    });
    describe("ReserveButtonField", function () {
      var selfReserveButton, otherReserveButton, cantUnReserveButton, nodeData, nodeModel, actionModel;
      var connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });

      beforeAll(function () {
        mock.enable();
        if (!selfReserveButton) {
          actionModel = new ActionModel({
            body: "reserved_user_id=1000",
            content_type: "application/x-www-form-urlencoded",
            form_href: "",
            href: "/api/v2/nodes/7052",
            method: "PUT",
            name: "unreserve",
            signature: "unreserve"

          });
          actionModel.id = "unreserve";
          nodeData = {
            container: false,
            container_size: 0,
            id: 1111,
            name: "JAVA_Exercises.docx",
            description: "",
            mime_type: 'Microsoft Word',
            type: 144,
            type_name: "Document",
            perm_reserve: true,
            reserved: true,
            reserved_date: "2017-05-23T16:53:13",
            reserved_user_id: {
              group_id: 1001,
              id: 1000,
              name: "Admin",
              name_formatted: "Admin",
              photo_url: "api/v1/members/1000/photo",
              privilege_login: true,
              privilege_modify_groups: true,
              privilege_modify_users: true,
              privilege_public_access: true,
              privilege_system_admin_rights: true,
              privilege_user_admin_rights: true,
              type: 0,
              type_name: "User"
            }
          };
          nodeModel = new NodeModel(nodeData, {connector: connector});
          nodeModel.actions = new ActionCollection(
              [actionModel]);
          var selfDocumentGeneralFormModel = new DocumentGeneralFormModel({
            data: {
              create_date: "2017-03-31T15:32:04",
              create_user_id: 1000,
              description: "",
              mimeTypeClassName: "csui-icon mime_word",
              mime_type: "Microsoft Word",
              modify_date: "2017-05-11T11:58:35",
              name: "JAVA_Exercises.docx",
              owner_user_id: 1000,
              reserved: true,
              reserved_date: "2017-05-23T16:53:13",
              reserved_user_id: 1000,
              size: "487 KB",
              type: 144,
              type_name: "Document"
            }
          });
          selfDocumentGeneralFormModel.node = nodeModel;
          selfReserveButton = new ReserveButtonFieldView({
            data: selfDocumentGeneralFormModel
          });
          selfReserveButton.userId = 1000;
          spyOn(selfReserveButton, "onRender");
        }
        if (!otherReserveButton) {
          actionModel = new ActionModel({
            body: "reserved_user_id=null",
            content_type: "application/x-www-form-urlencoded",
            form_href: "",
            href: "/api/v2/nodes/7052",
            method: "PUT",
            name: "unreserve",
            signature: "unreserve"
          });
          actionModel.id = "unreserve";
          nodeData = {
            container: false,
            container_size: 0,
            id: 1111,
            name: "JAVA_Exercises.docx",
            description: "",
            mime_type: 'Microsoft Word',
            type: 144,
            type_name: "Document",
            perm_reserve: true,
            reserved: true,
            reserved_date: "2017-05-23T16:53:13",
            reserved_user_id: {
              group_id: 1001,
              id: 1000,
              name: "Admin",
              name_formatted: "Admin",
              photo_url: "api/v1/members/1000/photo",
              privilege_login: true,
              privilege_modify_groups: true,
              privilege_modify_users: true,
              privilege_public_access: true,
              privilege_system_admin_rights: true,
              privilege_user_admin_rights: true,
              type: 0,
              type_name: "User"
            }
          };
          nodeModel = new NodeModel(nodeData, {connector: connector});
          nodeModel.actions = new ActionCollection(
              [actionModel]);
          var otherDocumentGeneralFormModel = new DocumentGeneralFormModel({
            data: {
              create_date: "2017-03-31T15:32:04",
              create_user_id: 1000,
              description: "",
              mimeTypeClassName: "csui-icon mime_word",
              mime_type: "Microsoft Word",
              modify_date: "2017-05-11T11:58:35",
              name: "JAVA_Exercises.docx",
              owner_user_id: 1000,
              reserved: true,
              reserved_date: "2017-05-23T16:53:13",
              reserved_user_id: 1000,
              size: "487 KB",
              type: 144,
              type_name: "Document"
            },
            options: {}
          });
          otherDocumentGeneralFormModel.node = nodeModel;
          otherReserveButton = new ReserveButtonFieldView({
            data: otherDocumentGeneralFormModel
          });
          otherReserveButton.userId = 1003;
          spyOn(otherReserveButton, "onRender");
        }
        if (!cantUnReserveButton) {
          nodeData = {
            container: false,
            container_size: 0,
            id: 1111,
            name: "JAVA_Exercises.docx",
            description: "",
            mime_type: 'Microsoft Word',
            type: 144,
            type_name: "Document",
            reserved: true,
            reserved_date: "2017-05-23T16:53:13",
            reserved_user_id: {
              group_id: 1001,
              id: 1000,
              name: "Admin",
              name_formatted: "Admin",
              photo_url: "api/v1/members/1000/photo",
              privilege_login: true,
              privilege_modify_groups: true,
              privilege_modify_users: true,
              privilege_public_access: true,
              privilege_system_admin_rights: true,
              privilege_user_admin_rights: true,
              type: 0,
              type_name: "User"
            }
          };
          nodeModel = new NodeModel(nodeData, {connector: connector});
          var cantUnReserveDocumentGeneralFormModel = new DocumentGeneralFormModel({
            data: {
              create_date: "2017-03-31T15:32:04",
              create_user_id: 1000,
              description: "",
              mimeTypeClassName: "csui-icon mime_word",
              mime_type: "Microsoft Word",
              modify_date: "2017-05-11T11:58:35",
              name: "JAVA_Exercises.docx",
              owner_user_id: 1000,
              reserved: true,
              reserved_date: "2017-05-23T16:53:13",
              reserved_user_id: 1000,
              size: "487 KB",
              type: 144,
              type_name: "Document"
            },
            options: {}
          });
          cantUnReserveDocumentGeneralFormModel.node = nodeModel;
          cantUnReserveButton = new ReserveButtonFieldView({
            data: cantUnReserveDocumentGeneralFormModel
          });
          cantUnReserveButton.userId = 1005;
          spyOn(cantUnReserveButton, "onRender");
        }
      });
      afterAll(function () {
        mock.disable();
        $('body').empty();
      });
      it("can be instantiated [low]", function () {
        expect(selfReserveButton).toBeDefined();
        expect(otherReserveButton).toBeDefined();
        expect(cantUnReserveButton).toBeDefined();
      });

      it("can be rendered [low]", function () {
        selfReserveButton.render();
        otherReserveButton.render();
        cantUnReserveButton.render();
        var reserveIconSelf = selfReserveButton.$el.find('.icon-reserved_metadata_self');
        expect(reserveIconSelf.length).toEqual(1);
        var reserveIconOther = otherReserveButton.$el.find('.icon-reserved_metadata_other');
        expect(reserveIconOther.length).toEqual(1);
        var reserveIcon = cantUnReserveButton.$el.find('.icon-reserved_metadata_other');
        expect(reserveIcon.length).toEqual(1);
      });

      describe("by reserved user", function () {
        it("should change background image on mousedown [medium]", function () {
          selfReserveButton.ui.btnReserveAction.trigger('mousedown');
          var reserveIcon = $(selfReserveButton.$el).find('.icon-reserved_self_md');
          expect(reserveIcon.length).toEqual(1);
        });
        it("should change  background image on mouseup [medium]", function () {
          selfReserveButton.ui.btnReserveAction.trigger('mousedown');
          var reserveIcon = $(selfReserveButton.$el).find('.icon-reserved_self_md');
          expect(reserveIcon.length).toEqual(1);
          selfReserveButton.ui.btnReserveAction.trigger('mouseup');
          reserveIcon = $(selfReserveButton.$el).find('.icon-reserved_self_md');
          expect(reserveIcon.length).toEqual(0);
        });
        it("should unreserve on click [high]", function (done) {
          var reserveIcon = $(selfReserveButton.$el).find('.csui-btn-reserve-status-action');
          expect(reserveIcon.length).toEqual(1);
          selfReserveButton.ui.btnReserveAction.trigger('click');
          var interval, intervalCount = 0, reserveStatus;
          interval = setInterval(function () {
            reserveStatus = selfReserveButton.commandStatus.nodes.models[0].get('reserved');
            if (!reserveStatus || (intervalCount > 9)) {
              clearInterval(interval);
              expect(selfReserveButton.commandStatus.nodes.models[0].get('reserved')).toBeFalsy();
              done();
            }
            intervalCount++;
          }, 100);
        });
      });

      describe("by other user", function () {

        describe("who can unreserve", function () {
          it("should change  background image on mousedown [medium]",
              function () {
                otherReserveButton.ui.btnReserveAction.trigger('mousedown');
                var reserveIcon = $(otherReserveButton.$el).find('.icon-reserved_other_md');
                expect(reserveIcon.length).toEqual(1);
              });
          it("should change  background image on mouseup [medium]", function () {
            otherReserveButton.ui.btnReserveAction.trigger('mousedown');
            var reserveIcon = $(otherReserveButton.$el).find('.icon-reserved_other_md');
            expect(reserveIcon.length).toEqual(1);
            otherReserveButton.ui.btnReserveAction.trigger('mouseup');
            reserveIcon = $(otherReserveButton.$el).find('.icon-reserved_other_md');
            expect(reserveIcon.length).toEqual(0);
          });
          it("should unreserve on click [high]", function (done) {
            var reserveIcon = $(otherReserveButton.$el).find('.csui-btn-reserve-status-action');
            expect(reserveIcon.length).toEqual(1);
            otherReserveButton.ui.btnReserveAction.trigger('click');
            var interval, intervalCount = 0, reserveStatus;
            interval = setInterval(function () {
              reserveStatus = otherReserveButton.commandStatus.nodes.models[0].get('reserved');
              if (!reserveStatus || (intervalCount > 9)) {
                clearInterval(interval);
                expect(
                    otherReserveButton.commandStatus.nodes.models[0].get('reserved')).toBeFalsy();
                done();
              }
              intervalCount++;
            }, 100);
          });
        });

        describe("who can't unreserve", function () {
          it("should not  change  background image on mousedown [medium]",
              function () {
                cantUnReserveButton.ui.btnReserveAction.trigger('mousedown');
                var reserveIcon = $(cantUnReserveButton.$el).find('.icon-reserved_other_md');
                expect(reserveIcon.length).toEqual(0);
              });
          it("should change  background image on mouseup [medium]", function () {
            cantUnReserveButton.ui.btnReserveAction.trigger('mousedown');
            var reserveIcon = $(cantUnReserveButton.$el).find('.icon-reserved_other_md');
            expect(reserveIcon.length).toEqual(0);
            cantUnReserveButton.ui.btnReserveAction.trigger('mouseup');
            reserveIcon = $(cantUnReserveButton.$el).find('.icon-reserved_other_md');
            expect(reserveIcon.length).toEqual(0);
          });
          it("should not unreserve on click [high]", function (done) {
            var reserveIcon = $(cantUnReserveButton.$el).find('.csui-btn-reserve-status-action');
            expect(reserveIcon.length).toEqual(1);
            cantUnReserveButton.ui.btnReserveAction.trigger('click');
            var interval, intervalCount = 0, reserveStatus;
            interval = setInterval(function () {
              reserveStatus = cantUnReserveButton.commandStatus.nodes.models[0].get('reserved');
              if (reserveStatus || (intervalCount > 9)) {
                clearInterval(interval);
                expect(
                    cantUnReserveButton.commandStatus.nodes.models[0].get('reserved')).toBeTruthy();
                done();
              }
              intervalCount++;
            }, 100);
          });

        });

      });

    });

  });

});
