/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/checkbox/checkbox.view'
], function ($, Marionette, CheckboxView) {

  describe("Checkbox Control", function () {

    var el;

    beforeEach(function () {
      el = $('<div style="width: 960px;height: 500px">');
    });

    it("renders without any options", function () {
      var cbv = new CheckboxView();
      expect(cbv).toBeDefined();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var ariaLabel = cbv.$el.find('.csui-checkbox').attr('aria-label');
      expect(ariaLabel).toBe('Item selection');
    });

    it("renders with initially checked", function () {
      var cbv = new CheckboxView({checked: 'true'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('true');
    });

    it("renders with initially invalid checked state", function () {
      var cbv = new CheckboxView({checked: 'what'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('false');
    });

    it("renders with custom aria-label and checked='true'", function () {
      var cbv = new CheckboxView({ariaLabel: "super", checked: 'true'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('true');
      var ariaLabel = cbEl.attr('aria-label');
      expect(ariaLabel).toBe('super');
    });

    it("renders with checked='mixed", function () {
      var cbv = new CheckboxView({checked: 'mixed'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('mixed');
    });

    it("renders with checked='false'", function () {
      var cbv = new CheckboxView({checked: 'false'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('false');
    });

    it("triggers clicked event", function (done) {
      var cbv = new CheckboxView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');

      var t = setTimeout(function () {
        fail("no clicked event was triggered by the checkbox");
        done();
      }, 3000);

      cbv.listenTo(cbv, 'clicked', function (event) {
        expect(event.model.get('checked')).toBe('false'); // in clicked it's still the old state
        clearTimeout(t);
        cbv.listenTo(event.model, 'change:checked', function () {
          var checked = event.model.get('checked');
          expect(checked).toBe('true');
          done();
        });
      });
      $(cbEl).click();
    });

    it("not triggering clicked event when disabled via options", function (done) {
      var cbv = new CheckboxView({'disabled': true});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');

      var t = setTimeout(function () {
        done();
      }, 1000);

      cbv.listenTo(cbv, 'clicked', function (event) {
        clearTimeout(t);
        fail("clicked event was triggered by the disabled checkbox");
      });
      $(cbEl).click();
    });

    it("not triggering clicked event when disabled", function (done) {
      var cbv = new CheckboxView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');
      cbv.setDisabled(true);

      var t = setTimeout(function () {
        done();
      }, 1000);

      cbv.listenTo(cbv, 'clicked', function (event) {
        clearTimeout(t);
        fail("clicked event was triggered by the disabled checkbox");
      });
      $(cbEl).click();
    });

    it("disabled attribute is set when disabled", function (done) {
      var cbv = new CheckboxView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-checkbox');

      var t = setTimeout(function () {
        done();
      }, 1000);

      cbv.listenTo(cbv, 'render', function () {
        var cbEl = cbv.$el.find('.csui-checkbox');

        var disabled = cbEl.prop('disabled');
        expect(disabled).toBe(true);

        clearTimeout(t);
        done();
      });

      cbv.setDisabled(true);
    });

    it("sets aria-checked if called setChecked('true')", function () {
      var cbv = new CheckboxView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);

      cbv.setChecked('true'); // changes are done synchronous

      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('true');
    });

    it("sets aria-checked if called setChecked('false')", function () {
      var cbv = new CheckboxView({checked: 'true'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);

      cbv.setChecked('false');

      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('false');
    });

    it("sets aria-checked if called setChecked('mixed')", function () {
      var cbv = new CheckboxView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);

      cbv.setChecked('mixed');

      var cbEl = cbv.$el.find('.csui-checkbox');
      var ariaChecked = cbEl.attr('aria-checked');
      expect(ariaChecked).toBe('mixed');

    });

  });

});
