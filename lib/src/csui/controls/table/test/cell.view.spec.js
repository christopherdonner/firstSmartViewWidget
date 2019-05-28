/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/date/date.view',
  'csui/controls/table/cells/datetime/datetime.view',
  'csui/controls/table/cells/duedate/duedate.view'

], function (module, $, _, Backbone, Marionette, CellView, DateView, DateTimeView, DueDateView) {
  'use strict';

  describe("Cell View", function () {

    beforeEach(function () {

      this.node = new Backbone.Model({
        keywords: [
          'A', 'B', 'C'
        ],
        singleValue: 'A',
        dates: [
          '2018-05-25T14:28:55.286Z',
          '2018-05-25T14:28:55.286Z',
          '2018-05-25T14:28:55.286Z'
        ],
        date: '2018-05-25T14:28:55.286Z'
      });

    });

    describe("With multi value plain text", function () {

      beforeEach(function () {

        var column = {
          name: 'keywords'
        };

        this.cellview = new CellView({
          model: this.node,
          column: column
        });

      });

      it('renders with comma separated values', function () {
        expect(this.cellview.getValueText()).toEqual("A, B, C");
      });

    });

    describe("With single value plain text", function () {

      beforeEach(function () {

        var column = {
          name: 'singleValue'
        };

        this.cellview = new CellView({
          model: this.node,
          column: column
        });

      });

      it('renders single value', function () {
        expect(this.cellview.getValueText()).toEqual("A");
      });

    });

    function testMultiValues(instance) {
      var value = instance.getValueData(),
          valueText = instance.getValueText(),
          expectedResult = "05/25/2018";
      expect(value.value).toContain(expectedResult);
      expect(value.formattedValue).toContain(expectedResult);
      expect(value.value).toContain(',');
      expect(value.formattedValue).toContain(',');
      expect(valueText).toContain(expectedResult);
      expect(valueText).toContain(expectedResult);
    }

    function testSingleValue(instance) {
      var value = instance.getValueData(),
          valueText = instance.getValueText(),
          expectedResult = "05/25/2018";
      expect(value.value).toContain(expectedResult);
      expect(value.formattedValue).toContain(expectedResult);
      expect(valueText).toContain(expectedResult);
    }

    describe("With single value date", function () {

      beforeEach(function () {

        var column = {
          name: 'date'
        };

        this.dateview = new DateView({
          model: this.node,
          column: column
        });
      });

      it('renders single value', function () {
        testSingleValue(this.dateview);
      });
    });
    describe("With multi value date", function () {

      beforeEach(function () {

        var column = {
          name: 'dates'
        };

        this.dateview = new DateView({
          model: this.node,
          column: column
        });
      });

      it('renders with comma separated values', function () {
        testMultiValues(this.dateview);
      });

    });

    describe("With single value datetime", function () {

      beforeEach(function () {

        var column = {
          name: 'date'
        };

        this.dateview = new DateTimeView({
          model: this.node,
          column: column
        });
      });

      it('renders single value', function () {
        testSingleValue(this.dateview);
      });
    });
    describe("With multi value datetime", function () {

      beforeEach(function () {

        var column = {
          name: 'dates'
        };

        this.dateview = new DateTimeView({
          model: this.node,
          column: column
        });
      });

      it('renders with comma separated values', function () {
        testMultiValues(this.dateview);
      });

    });

    describe("With single value duedate", function () {

      beforeEach(function () {

        var column = {
          name: 'date'
        };

        this.dateview = new DueDateView({
          model: this.node,
          column: column
        });
      });

      it('renders single value', function () {
        testSingleValue(this.dateview);
      });
    });
    describe("With multi value duedate", function () {

      beforeEach(function () {

        var column = {
          name: 'dates'
        };

        this.dateview = new DueDateView({
          model: this.node,
          column: column
        });
      });

      it('renders with comma separated values', function () {
        testMultiValues(this.dateview);
      });

    });

  });


});
