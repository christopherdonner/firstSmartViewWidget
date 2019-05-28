/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/disclosure/disclosure.view'
], function ($, Marionette, DisclosureView) {

  describe("Disclosure Control", function () {

    var el;

    beforeEach(function () {
      el = $('<div style="width: 960px;height: 500px">');
    });

    it("renders without any options", function () {
      var cbv = new DisclosureView();
      expect(cbv).toBeDefined();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var ariaLabel = cbv.$el.find('.csui-disclosure').attr('aria-label');
      expect(ariaLabel).toBe('Information disclosure');
      var ariaExpanded = cbv.$el.find('.csui-disclosure').attr('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });

    it("renders with initially expanded", function () {
      var cbv = new DisclosureView({expanded: true});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      var ariaExpanded = cbv.$el.find('.csui-disclosure').attr('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });

    it("renders with initially invalid expanded state", function () {
      var cbv = new DisclosureView({expanded: 'bad'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      var ariaExpanded = cbv.$el.find('.csui-disclosure').attr('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });

    it("renders with custom aria-label and expanded=true", function () {
      var cbv = new DisclosureView({expanded: true, ariaLabel: 'super'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      var ariaExpanded = cbEl.attr('aria-expanded');
      expect(ariaExpanded).toBe('true');
      var ariaLabel = cbEl.attr('aria-label');
      expect(ariaLabel).toBe('super');
    });

    it("renders with custom title and expanded=true", function () {
      var cbv = new DisclosureView({expanded: true, titleExpanded: 'super'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      var title = cbEl.attr('title');
      expect(title).toBe('super');
    });

    it("renders with custom title and expanded=false", function () {
      var cbv = new DisclosureView({expanded: false, titleDisclosed: 'ok'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      var title = cbEl.attr('title');
      expect(title).toBe('ok');
    });

    it("renders with custom title and changes title with expanded change", function (done) {
      var cbv = new DisclosureView({titleDisclosed: 'ok', titleExpanded: 'super'});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      var title = cbEl.attr('title');
      expect(title).toBe('ok');

      var t = setTimeout(function () {
        fail("no render event was triggered by the disclosure control after calling" +
             " setExpanded(true)");
      }, 1000);

      var rendered = false;
      cbv.listenTo(cbv.model, 'change:expanded', function () {
        expect(rendered).toBe(true);
        clearTimeout(t);
        done();
      });
      cbv.listenTo(cbv, 'render', function () {
        rendered = true;
        var cbEl = cbv.$el.find('.csui-disclosure');

        var title = cbEl.attr('title');
        expect(title).toBe('super');
      });

      cbv.setExpanded(true);
    });

    it("renders with expanded=false", function () {
      var cbv = new DisclosureView({expanded: false});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      var ariaExpanded = cbEl.attr('aria-expanded');
      expect(ariaExpanded).toBe('false');
    });

    it("triggers clicked event", function (done) {
      var cbv = new DisclosureView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');

      var t = setTimeout(function () {
        fail("no clicked event was triggered by the disclosure control");
        done();
      }, 3000);

      cbv.listenTo(cbv, 'clicked', function (event) {
        expect(event.model.get('expanded')).toBe(false); // in clicked it's still the old state
        clearTimeout(t);
        cbv.listenTo(event.model, 'change:expanded', function () {
          var expanded = event.model.get('expanded');
          expect(expanded).toBe(true);
          done();
        });
      });
      $(cbEl).click();
    });

    it("not triggering clicked event when disabled via options", function (done) {
      var cbv = new DisclosureView({'disabled': true});
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');

      var t = setTimeout(function () {
        done();
      }, 1000);

      cbv.listenTo(cbv, 'clicked', function (event) {
        clearTimeout(t);
        fail("clicked event was triggered by the disabled disclosure control");
      });
      $(cbEl).click();
    });

    it("not triggering clicked event when disabled", function (done) {
      var cbv = new DisclosureView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');
      cbv.setDisabled(true);

      var t = setTimeout(function () {
        done();
      }, 1000);

      cbv.listenTo(cbv, 'clicked', function (event) {
        clearTimeout(t);
        fail("clicked event was triggered by the disabled disclosure control");
      });
      $(cbEl).click();
    });

    it("disabled attribute is set when disabled", function (done) {
      var cbv = new DisclosureView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);
      var cbEl = cbv.$el.find('.csui-disclosure');

      var t = setTimeout(function () {
        done();
      }, 1000);

      cbv.listenTo(cbv, 'render', function () {
        var cbEl = cbv.$el.find('.csui-disclosure');

        var disabled = cbEl.prop('disabled');
        expect(disabled).toBe(true);

        clearTimeout(t);
        done();
      });

      cbv.setDisabled(true);
    });

    it("sets aria-expanded if called setExpanded(true)", function (done) {
      var cbv = new DisclosureView();
      var region = new Marionette.Region({el: el});
      region.show(cbv);

      var t = setTimeout(function () {
        fail("no render event was triggered by the disclosure control after calling" +
             " setExpanded(true)");
      }, 1000);

      var rendered = false;
      cbv.listenTo(cbv.model, 'change:expanded', function () {
        expect(rendered).toBe(true);
        clearTimeout(t);
        done();
      });
      cbv.listenTo(cbv, 'render', function () {
        rendered = true;
        var cbEl = cbv.$el.find('.csui-disclosure');

        var ariaExpanded = cbEl.attr('aria-expanded');
        expect(ariaExpanded).toBe('true');
      });

      cbv.setExpanded(true);
    });

    it("clears aria-expanded if called setExpanded(false)", function (done) {
      var cbv = new DisclosureView({expanded: true});
      var region = new Marionette.Region({el: el});
      region.show(cbv);

      var t = setTimeout(function () {
        fail("no render event was triggered by the disclosure control after calling" +
             " setExpanded(false)");
      }, 1000);

      var rendered = false;
      cbv.listenTo(cbv.model, 'change:expanded', function () {
        expect(rendered).toBe(true);
        clearTimeout(t);
        done();
      });
      cbv.listenTo(cbv, 'render', function () {
        rendered = true;
        var cbEl = cbv.$el.find('.csui-disclosure');

        var ariaExpanded = cbEl.attr('aria-expanded');
        expect(ariaExpanded).toBe('false');

        clearTimeout(t);
        done();
      });

      cbv.setExpanded(false);
    });

  });

});
