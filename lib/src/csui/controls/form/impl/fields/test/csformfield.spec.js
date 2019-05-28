/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/controls/form/impl/fields/csformfield.editable.behavior'
], function (_, Backbone, Marionette, FormFieldView, FormFieldEditableBehavior) {
  'use strict';

  describe('FormFieldView', function () {

    it('allows adding behaviors in descendant objects', function () {
      var SpecialBehavior = Marionette.Behavior.extend({}),
          InheritedFormFieldView = FormFieldView.extend({
            behaviors: {
              Special: {
                behaviorClass: SpecialBehavior
              }
            }
          }),
          fieldModel = new Backbone.Model({
            data: {},
            schema: {},
            options: {}
          }),
          fieldView = new InheritedFormFieldView({model: fieldModel}),
          special = _.some(fieldView._behaviors, function (behavior) {
            return behavior instanceof SpecialBehavior;
          });
      expect(special).toBeTruthy('Special behavior has been added.');
    });

    it('provides default behaviors to descendant objects', function () {
      var InheritedFormFieldView = FormFieldView.extend({}),
          fieldModel = new Backbone.Model({
            data: {},
            schema: {},
            options: {}
          }),
          fieldView = new InheritedFormFieldView({model: fieldModel}),
          standard = _.some(fieldView._behaviors, function (behavior) {
            return behavior instanceof FormFieldEditableBehavior;
          });
      expect(standard).toBeTruthy('Standard behavior has been found.');
    });

    xit('allows replacing behaviors in descendant objects', function () {
      var SpecialBehavior = Marionette.Behavior.extend({}),
          InheritedFormFieldView = FormFieldView.extend({
            behaviors: {
              FormFieldEditable: {
                behaviorClass: SpecialBehavior
              }
            }
          }),
          fieldModel = new Backbone.Model({
            data: {},
            schema: {},
            options: {}
          }),
          fieldView = new InheritedFormFieldView({model: fieldModel}),
          standard = _.some(fieldView._behaviors, function (behavior) {
            return behavior instanceof FormFieldEditableBehavior;
          }),
          special = _.some(fieldView._behaviors, function (behavior) {
            return behavior instanceof SpecialBehavior;
          });
      expect(standard).toBeFalsy('Standard behavior has not been found.');
      expect(special).toBeTruthy('Special behavior has been found.');
    });

  });

})
;
