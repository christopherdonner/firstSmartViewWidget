/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/contexts/page/page.context',
  'csui/controls/listitem/listitemobject.view',
  'i18n', 'csui/lib/jquery.simulate'
], function ($, _, Backbone, Marionette, PageContext, ObjectListItemView, i18n) {

  describe("The ObjectListItemView Control", function () {

    var sTitleName = 'testTitle',
        sTitleSize = "100",
        sStageLabel = "stageLabel",
        sStageValue = "stageValue",
        sPrice = "100,-",
        sCurrency = "$",
        sIcon = "binf-glyphicon-folder-close";

    var w;

    beforeEach(function () {
      if (!w) {
          w = new ObjectListItemView({
            data: {
              name: sTitleName,
              size: sTitleSize,
              stage: {
                label: sStageLabel,
                value: sStageValue
              },
              price: sPrice,
              currency: sCurrency,
              icon: sIcon
            }
          });
      }
    });

    it("can be instantiated and rendered", function () {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
    });

    it("has a configurable title name", function () {

      expect(w.$('.cs-title .cs-name').html()).toEqual(sTitleName);

    });

    it("has a configurable title size", function () {

      expect(w.$('.cs-title .cs-size').html()).toEqual(' (' + sTitleSize + ')');

    });

    it("has a configurable stage label", function () {

      expect(w.$('.cs-label').html()).toEqual(sStageLabel);

    });

    it("has a configurable stage value", function () {

      expect(w.$('.cs-value').html()).toEqual(sStageValue);

    });

    it("has a configurable prize", function () {

      expect(w.$('.cs-price').html()).toEqual(sPrice);

    });

    it("has a configurable currency", function () {

      expect(w.$('.cs-currency').html()).toEqual(sCurrency);

    });

    it("has a configurable icon", function () {
      var $iconImg = w.$('img.cs-icon');
      expect($iconImg.attr('src')).toEqual( sIcon);

    });

    it("raises click:item event when clicked", function (done) {

      var clickCnt = 0;
      var callback = _.after(1, function() {
        ++clickCnt;
        expect(clickCnt).toBeGreaterThan(0, 'event click:item handler was not called');
        done();
      });

      w.on('click:item', function () {
        callback();   // has been called
      });

      w.$el.simulate('click');
    });

    it("binds nested data", function (done) {

      var w1 = new ObjectListItemView({
        model: new Backbone.Model({
              id: '120001',
              name: 'Robotic Lawn Mower - HomeDep.',
              size: '1000 Items',
              categories: {
                sales_opportunity: {
                  key: 'SOPP-06478',
                  price: '84,500.00',
                  currency: 'EUR',
                  stage: '6. Create Price Proposal',
                  closed_date: '09/05/2014'
                }
              }
            }
        ),
        data: {
          "key": "{categories.sales_opportunity.key}",
          "name": "{name}",
          "size": "{size}",
          "stage": {
            "label": "Stage:",
            "value": "{categories.sales_opportunity.stage}"
          },
          "price": "{categories.sales_opportunity.price}",
          "currency": "{categories.sales_opportunity.currency}",
          "date": {
            "label": "Closed Date",
            "value": "{categories.sales_opportunity.closed_date}"
          }
        }
      });

      w1.render();

      expect(w1.$('.cs-title .cs-name').html().indexOf('Robotic')).toBe(0);
      expect(w1.$('.cs-price').html().indexOf('84')).toBe(0);
      expect(w1.$('.cs-currency').html()).toEqual('EUR');
      done();
    });

    it("evaluates data expressions for dateClass of type Date with ranges", function (done) {

      var m = new Backbone.Model({
                id: '120001',
                name: 'Robotic Lawn Mower - HomeDep.',
                size: '1000 Items',
                categories: {
                  sales_opportunity: {
                    key: 'SOPP-06478',
                    price: '84,500.00',
                    currency: 'EUR',
                    stage: '6. Create Price Proposal',
                    closed_date: '09/05/2014'
                  }
                }
              }
          ),
          m1 = new Backbone.Model({
                categories: {
                  sales_opportunity: {
                    key: 'SOPP-06478',
                    price: '84,500.00',
                    currency: 'EUR',
                    stage: '6. Create Price Proposal',
                    closed_date: '09/05/2013' // old
                  }
                }
              }
          );

      var w = new ObjectListItemView({
        model: m,
        data: {
          "date": {
            "label": "Closed Date",
            "value": "{categories.sales_opportunity.closed_date}",
            "class": {
              "expression": "{categories.sales_opportunity.closed_date}",
              "type": "Date",
              "valueRanges": [
                {
                  "lessThan": "07/01/2014",
                  "value": "cs-status-bad"
                },
                {
                  "greaterOrEqual": "07/02/2014",
                  "value": "cs-status-good"
                }
              ]
            }
          }
        }
      });

      w.render();

      expect(w.$('.cs-date .cs-value').html()).toEqual('09/05/2014');
      expect(w.$('.cs-date .cs-value').hasClass('cs-status-good')).toBeTruthy();

      w.model = m1;
      w.render();
      expect(w.$('.cs-date .cs-value').html()).toEqual('09/05/2013');
      expect(w.$('.cs-date .cs-value').hasClass('cs-status-bad')).toBeTruthy();
      done();
    });

    xit("evaluates data expressions for dateClass of type (Number) with ranges", function () {

      var ml = new Backbone.Model({
            categories: {
              product: {
                type: 'GardenCare Product Low',
                price: '45.00 EUR'
              }
            }
          }),
          mm = new Backbone.Model({
            categories: {
              product: {
                type: 'GardenCare Product Medium',
                price: '645.00 EUR'
              }
            }
          }),
          mh = new Backbone.Model({
            categories: {
              product: {
                type: 'GardenCare Product High',
                price: '1645.00 EUR'
              }
            }
          });

      var w = new ObjectListItemView({
        model: ml,
        data: {
          "date": {
            "label": "Unit Price",
            "value": "{categories.product.price}",
            "class": {
              "expression": "{categories.product.price}",
              "valueRanges": [
                {
                  "lessThan": 200,
                  "value": "cs-priority-low"
                },
                {
                  "greaterOrEqual": 200.01,
                  "lessThan": 1000,
                  "value": "cs-priority-medium"
                },
                {
                  "greaterOrEqual": 1000.01,
                  "value": "cs-priority-high"
                }
              ]
            }
          }
        }
      });

      w.render();

      expect(w.$('.cs-date .cs-value').html().indexOf('45')).toBe(0);
      expect(w.$('.cs-date .cs-value').hasClass('cs-priority-low')).toBeTruthy();

      w.model = mm;
      w.render();
      expect(w.$('.cs-date .cs-value').html().indexOf('645')).toBe(0);
      expect(w.$('.cs-date .cs-value').hasClass('cs-priority-medium')).toBeTruthy();

      w.model = mh;
      w.render();
      expect(w.$('.cs-date .cs-value').html().indexOf('1645')).toBe(0);
      expect(w.$('.cs-date .cs-value').hasClass('cs-priority-high')).toBeTruthy();

    });

    it("evaluates data expressions for priceClass with value map", function (done) {
      var mot = new Backbone.Model({
        id: '120021',
        name: 'AquaControur Automatic Set (2708-20)',
        categories: {
          sales_order: {
            type: 'GardenCare Product',
            status: 'On Track',
            target_date: '09/05/2014'
          }
        }
      });
      var w = new ObjectListItemView({
        model: mot,
        data: {
          "stage": {
            "value": "{categories.sales_order.type}"
          },
          "price": "{categories.sales_order.status}",
          "priceClass": {
            "expression": "{categories.sales_order.status}",
            "valueMap": {
              "Stopped": "cs-progress-delayed",
              "On Track": "cs-progress-ontrack",
              "Delivered": "cs-progress-finished",
              "Retour": "cs-progress-failed"
            }
          }
        }
      });

      w.render();
      expect(w.$('.cs-price').hasClass('cs-progress-ontrack')).toBeTruthy();
      done();
    });

    it("allows multi-lingual input in options.data", function (done) {
      var m = new Backbone.Model({
            categories: {
              sales_order: {
                type: 'GardenCare Product'
              }
            }
          }),
          enLabel = "enLabel",
          w = new ObjectListItemView({
            model: m,
            data: {
              "stage": {
                "label": {
                  "en": enLabel,
                },
                "value": "{categories.sales_order.type}"
              }
            }
          });
      w.render();
      expect(w.$('.cs-stage .cs-label').text()).toBe(enLabel);
      done();
    });

  });

});
