/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/form',
  'csui/controls/form/form.view',
  'json!./alpcsuiselectfield.form.json'
], function (FormModel, FormView, formSpecification) {
  'use strict';

  describe('Alpaca Select Field Wrapper', function () {
    it('can parse .NET date format returned from a saved query', function (done) {
      var formModel = new FormModel(formSpecification),
          formView = new FormView({
            model: formModel,
            mode: 'create'
          });
      formView.on('render:form', function () {
        var formHTML = formView.el.innerHTML.toLowerCase();
        console.log(formHTML);
        expect(formHTML.indexOf('>date</label>')).toBeGreaterThanOrEqual(0);
        expect(formHTML.indexOf('>invalid date</span>')).toBeLessThan(0);
        done();
      });
      formView.render();
    });
  });
});
