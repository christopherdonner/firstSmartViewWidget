/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/context', 'csui/utils/contexts/factories/factory'
], function (_, Backbone, Context, Factory) {
  'use strict';

  describe('Context', function () {
    var context, globalOptions;

    var TestModel = Backbone.Model.extend({}),

      TestFactory = Factory.extend({
        propertyPrefix: 'test',
        constructor: function TestFactory(context, options) {
          Factory.prototype.constructor.apply(this, arguments);
          var test = this.options.test || {};
          this.property = new TestModel(test.attributes);
          this.property.options = _.extend({}, test, globalOptions);
        }
      });

    beforeEach(function () {
      context = new Context();
    });

    it('prefers to check the fetch-ability of the factory to just fetching', function () {
      var TestFactory = Factory.extend({
            fetch: function () {}
          }),
          factory = new TestFactory();
      expect(context._isFetchable(factory)).toBeTruthy();
      factory.isFetchable = function () {
        return false;
      };
      expect(context._isFetchable(factory)).toBeFalsy();
    });

    it('offers legible methods to get objects using factories', function () {
      expect(context.getObject).toBe(context.getModel);
      expect(context.getObject).toBe(context.getCollection);
    });

    it('gets a new object using a factory without arguments', function () {
      var object = context.getObject(TestFactory);
      expect(object).toBeDefined();
      expect(object instanceof TestModel).toBeTruthy();
    });

    it('gets the same object using a factory without arguments again', function () {
      var object1 = context.getObject(TestFactory),
          object2 = context.getObject(TestFactory);
      expect(object1).toBe(object2);
    });

    it('gets a different object using a factory with attributes', function () {
      var object1 = context.getObject(TestFactory),
          object2 = context.getObject(TestFactory, {
            attributes: {id: 1}
          });
      expect(object1).not.toBe(object2);
    });

    it('gets a different default object using a unique flag', function () {
      var object1 = context.getObject(TestFactory),
          object2 = context.getObject(TestFactory, {
            unique: true
          });
      expect(object1).not.toBe(object2);
    });

    it('gets a different specific object using a unique flag', function () {
      var object1 = context.getObject(TestFactory, {
            attributes: {id: 1}
          }),
          object2 = context.getObject(TestFactory, {
            attributes: {id: 1},
            unique: true
          });
      expect(object1).not.toBe(object2);
    });

    it('gets the same object using a factory with the same attributes', function () {
      var object1 = context.getObject(TestFactory, {
            attributes: {id: 1}
          }),
          object2 = context.getObject(TestFactory, {
            attributes: {id: 1}
          });
      expect(object1).toBe(object2);
    });

    it('gets a different object using a factory with different attributes', function () {
      var object1 = context.getObject(TestFactory, {
            attributes: {id: 1}
          }),
          object2 = context.getObject(TestFactory, {
            attributes: {id: 2}
          }),
          object3 = context.getObject(TestFactory, {
            attributes: {type: 2}
          });
      expect(object1).not.toBe(object2);
      expect(object1).not.toBe(object3);
      expect(object2).not.toBe(object3);
    });

    it('factory attributes passed to context constructor do not cause different' +
       ' objects created; they configure default objects attributes', function () {
      var preconfiredContext = new Context({
            factories: {
              test: {
                attributes: {
                  id: 1,
                  name: 'default'
                }
              }
            }
          }),
          preconfiguredTest = preconfiredContext.getObject(TestFactory),
          uniqueTest = preconfiredContext.getObject(TestFactory, {
            attributes: {id: 1}
          });
      expect(preconfiguredTest.get('id'))
          .toEqual(1, 'Context options do not affect object prefixes');
      expect(preconfiguredTest.get('name'))
          .toEqual('default', 'Context options pre-configure objects');
      expect(uniqueTest.get('name'))
          .toBeUndefined('Unique objects are not affected by default ones');
    });

    it('global context options are passed to the factory', function () {
      var context = new Context({
            factories: {
              test: {
                object: {
                  value: 1
                }
              }
            }
          }),
          test = context.getObject(TestFactory, {
            permanent: true
          });
      expect(test.options.object).toBeDefined();
      expect(test.options.object.value).toEqual(1);
    });

    it('global context options are merged with module options in the factory', function () {
      globalOptions = {global: 2};
      var context = new Context({
            factories: {
              test: {
                object: {
                  value: 1
                }
              }
            }
          }),
          test = context.getObject(TestFactory, {
            permanent: true
          });
      expect(test.options.global).toEqual(2);
      expect(test.options.object).toBeDefined();
      expect(test.options.object.value).toEqual(1);
    });

    it('discards temporary contextual objects when the context is fetched', function () {
      context.getObject(TestFactory, {
        attributes: {id: 1}
      });
      context.getObject(TestFactory, {
        attributes: {id: 2},
        temporary: true
      });
      expect(_.keys(context._factories).length).toBe(2);
      context.fetch();
      expect(_.keys(context._factories).length).toBe(1);
      expect(context._factories['test-id-1']).toBeTruthy();
    });

    it('retains permanent contextual objects when the context is cleared', function () {
      context.getObject(TestFactory, {
        attributes: {id: 1}
      });
      context.getObject(TestFactory, {
        attributes: {id: 2},
        permanent: true
      });
      expect(_.keys(context._factories).length).toBe(2);
      context.clear();
      expect(_.keys(context._factories).length).toBe(1);
      expect(context._factories['test-id-2']).toBeTruthy();
    });

    it('does not fetch detached objects', function () {
      var TestFactory = Factory.extend({
        propertyPrefix: 'test',
        fetch: function () {}
      });
      context.getObject(TestFactory, {
        attributes: {id: 1}
      });
      context.getObject(TestFactory, {
        attributes: {id: 2},
        detached: true
      });
      expect(context._isFetchable(context._factories['test-id-1'])).toBeTruthy();
      expect(context._isFetchable(context._factories['test-id-2'])).toBeFalsy();
    });
  });
});
