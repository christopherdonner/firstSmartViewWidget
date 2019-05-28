/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
], function (_, $, Backbone, RulesMatchingMixin) {
  'use strict';

  describe('RulesMatchingMixin', function () {
    var DefaultActionModel, DefaultActionCollection, defaultActions;

    beforeAll(function () {
      DefaultActionModel = Backbone.Model.extend({
        idAttribute: null,

        defaults: {
          sequence: 100,
          signature: null
        },

        constructor: function DefaultActionModel(attributes, options) {
          Backbone.Model.prototype.constructor.apply(this, arguments);
          this.makeRulesMatching(options);
        },

        matches: function (node) {
          return this.matchRules(node, this.attributes);
        }
      });

      RulesMatchingMixin.mixin(DefaultActionModel.prototype);

      DefaultActionCollection = Backbone.Collection.extend({
        model: DefaultActionModel,

        comparator: 'sequence',

        constructor: function DefaultActionCollection(models, options) {
          Backbone.Collection.prototype.constructor.apply(this, arguments);
        },

        findByNode: function (node) {
          return this.find(function (item) {
            return item.matches(node);
          });
        }
      });

      defaultActions = new DefaultActionCollection([
        {
          equals: {
            container: true
          },
          signature: 'Browse'
        },
        {
          equals: {
            type: [144, 749]
          },
          signature: 'Open'
        },
        {
          equals: {
            'node.type': 5574
          },
          signature: 'OpenWikiPageVersion'
        },
        {
          and: {
            equals: {
              type: 144
            },
            contains: {
              mime_type: [
                "application/msword",
                "application/vnd.ms-word",
                "application/vnd.msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.wordprocessing-openxml",
                "application/vnd.ces-quickword",
                "application/vnd.ms-word.document.macroEnabled.12",
                "application/vnd.ms-word.document.12",
                "application/mspowerpoint",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.ces-quickpoint",
                "application/vnd.presentation-openxml",
                "application/vnd.presentation-openxmlm",
                "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
                "application/msexcel",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ces-quicksheet",
                "application/vnd.spreadsheet-openxml",
                "application/vnd.ms-excel.sheet.macroEnabled.12",
              ]
            }
          },
          signature: 'Edit',
          sequence: 50
        },
        {
          and: {
            equals: {
              type: 144
            },
            or: {
              startsWith: {
                mime_type: 'image/'
              },
              endsWith: {
                mime_type: ['/pdf', '/x-pdf']
              }
            }
          },
          signature: 'Convert',
          sequence: 50
        },
        {
          and: [
            {
              equals: {
                type: 144
              }
            },
            {
              equals: {
                mime_type: 'text/plain'
              }
            }
          ],
          signature: 'Read',
          sequence: 50
        },
        {
          matches: {
            type_name: '^Compound\\b'
          },
          sequence: 50,
          signature: 'Versions'
        },
        {
          decides: function (model) {
            return model.get('type') === 848 &&
                   model.get('workspace_id') == null;
          },
          sequence: 50,
          signature: 'Disabled'
        },
        {
          not: {
            equals: {
              type: [0, 144, 136, 140, 749, 848]
            }
          },
          sequence: 150,
          signature: 'Disabled'
        },
        {
          signature: 'Properties',
          sequence: 200
        }
      ]);
    });

    it('matches model by equals with single value', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 0,
        container: true
      })).get('signature')).toEqual('Browse');
    });

    it('matches model by the default rule', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 140
      })).get('signature')).toEqual('Properties');
    });

    it('matches model by equals with multiple values', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 144,
        mime_type: 'application/octet-stream'
      })).get('signature')).toEqual('Open');
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 749,
        mime_type: 'form/multi-part'
      })).get('signature')).toEqual('Open');
    });

    it('matches model by and, equals and contains', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 144,
        mime_type: 'application/msword'
      })).get('signature')).toEqual('Edit');
    });

    it('matches model by and, equals, or, startsWith and endsWith', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 144,
        mime_type: 'image/jpg'
      })).get('signature')).toEqual('Convert');
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 144,
        mime_type: 'application/pdf'
      })).get('signature')).toEqual('Convert');
    });

    it('matches model by and, and array of two equals', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 144,
        mime_type: 'text/plain'
      })).get('signature')).toEqual('Read');
    });

    it('matches model by a nested property', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        mime_type: 'text/plain',
        node: {
          type: 5574
        }
      })).get('signature')).toEqual('OpenWikiPageVersion');
    });

    it('matches model by matches', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 136,
        type_name: 'Compound Document'
      })).get('signature')).toEqual('Versions');
    });

    it('matches model by not and equals', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 3
      })).get('signature')).toEqual('Disabled');
    });

    it('matches model by decides', function () {
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 848,
        container: true,
        workspace_id: null
      })).get('signature')).toEqual('Disabled');
      expect(defaultActions.findByNode(new Backbone.Model({
        id: 1,
        type: 848,
        container: true,
        workspace_id: 2
      })).get('signature')).toEqual('Browse');
    });

    beforeAll(function () {
      this.RuleModel = Backbone.Model.extend({
        constructor: function RuleModel(attributes, options) {
          Backbone.Model.prototype.constructor.call(this, attributes, options);
          this.makeRulesMatching(options);
        },

        matches: function (test) {
          return this.matchRules(test, this.attributes);
        }
      });

      RulesMatchingMixin.mixin(this.RuleModel.prototype);

      this.RuleCollection = Backbone.Collection.extend({
        model: this.RuleModel,

        constructor: function RuleCollection() {
          Backbone.Collection.prototype.constructor.apply(this, arguments);
        },

        findRule: function (test) {
          return this.find(function (rule) {
            return rule.matches(test);
          });
        }
      });
    });

    describe('provides the "matchRules" method, which', function () {
      beforeAll(function () {
        this.rules = new this.RuleCollection([
          {has: 'test'}
        ]);
      });

      it('is injected to the target collection\'s prototype', function () {
        expect(this.rules.first().matchRules).toBeTruthy();
      });

      it('accepts an object literal to match properties of', function () {
        var test = {test: 1};
        expect(this.rules.findRule(test)).toBeTruthy();
      });

      it('accepts an Backbone model to match properties of', function () {
        var test = new Backbone.Model({test: 1});
        expect(this.rules.findRule(test)).toBeTruthy();
      });
    });

    describe('supports a "has" operation, which', function () {
      beforeAll(function () {
        this.rules = new this.RuleCollection([
          {has: 'first'},
          {has: ['second', 'third']}
        ]);
      });

      it('returns false, if no property matches specified names', function () {
        var test = new Backbone.Model({none: 1});
        expect(this.rules.findRule(test)).toBeFalsy();
      });

      it('checks existence of a single object property', function () {
        var test = new Backbone.Model({first: 1});
        expect(this.rules.findRule(test)).toBeTruthy();
      });

      it('checks existence of one specified properties', function () {
        var test = new Backbone.Model({second: 1});
        expect(this.rules.findRule(test)).toBeTruthy();
      });
    });

    describe('supports an "includes" operation, which', function () {
      beforeAll(function () {
        this.rules = new this.RuleCollection([
          {
            includes: {test: 'first'}
          },
          {
            includes: {test: ['second', 'third']}
          }
        ]);
      });

      it('returns false, if the property is neither an array nor an object', function () {
        var test = new Backbone.Model({test: 1});
        expect(this.rules.findRule(test)).toBeFalsy();
      });

      it('returns false, if an array contains none of the specified items', function () {
        var test = new Backbone.Model({test: ['none']});
        expect(this.rules.findRule(test)).toBeFalsy();
      });

      it('checks if an array contains a single item', function () {
        var test = new Backbone.Model({test: ['first']});
        expect(this.rules.findRule(test)).toBeTruthy();
      });

      it('checks if an array contains one of specified items', function () {
        var test = new Backbone.Model({test: ['second']});
        expect(this.rules.findRule(test)).toBeTruthy();
      });

      it('returns false, if an object contains none of the specified keys', function () {
        var test = new Backbone.Model({test: {none: 1}});
        expect(this.rules.findRule(test)).toBeFalsy();
      });

      it('checks if an object contains a single key', function () {
        var test = new Backbone.Model({test: {first: 1}});
        expect(this.rules.findRule(test)).toBeTruthy();
      });

      it('checks if an object contains one of specified keys', function () {
        var test = new Backbone.Model({test: {second: 1}});
        expect(this.rules.findRule(test)).toBeTruthy();
      });
    });
  });
});
