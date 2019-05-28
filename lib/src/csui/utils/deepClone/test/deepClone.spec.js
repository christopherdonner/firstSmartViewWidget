/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, deepClone) {

  describe('deepClone', function () {

    it('copies immutable literals', function () {
      expect(undefined).toBe(deepClone(undefined));
      expect(null).toBe(deepClone(null));
      expect(false).toBe(deepClone(false));
      expect(true).toBe(deepClone(true));
      expect(0).toBe(deepClone(0));
      expect(1).toBe(deepClone(1));
      expect(1.2).toBe(deepClone(1.2));
      expect(Infinity).toBe(deepClone(Infinity));
      expect('').toBe(deepClone(''));
      expect('s').toBe(deepClone('s'));
    });

    it('copies immutable built-ins', function () {
      var original = new Boolean(true), // jshint ignore:line
          clone = deepClone(original);
      expect(original.valueOf()).toEqual(clone.valueOf());
      original = new Number(1); // jshint ignore:line
      clone = deepClone(original);
      expect(original.valueOf()).toEqual(clone.valueOf());
      original = String('s');
      clone = deepClone(original);
      expect(original.valueOf()).toEqual(clone.valueOf());
    });

    it('clones mutable built-ins', function () {
      var original = new Date(),
          clone = deepClone(original);
      expect(original).not.toBe(clone);
      expect(original.valueOf()).toEqual(clone.valueOf());
      original = /r/;
      clone = deepClone(original);
      expect(original.valueOf()).toEqual(clone.valueOf());
    });

    it('clones objects', function () {
      var original = {},
          clone = deepClone(original);
      expect(original).not.toBe(clone);
      expect(original.valueOf()).toEqual(clone.valueOf());
      original = {k: 1};
      clone = deepClone(original);
      expect(original).not.toBe(clone);
      expect(original.valueOf()).toEqual(clone.valueOf());
      original = {k: {k: 1}};
      clone = deepClone(original);
      expect(original).not.toBe(clone);
      expect(original.k).not.toBe(clone.k);
      expect(original.valueOf()).toEqual(clone.valueOf());
    });

    it('clones arrays', function () {
      var original = [],
          clone = deepClone(original);
      expect(original).not.toBe(clone);
      expect(original.valueOf()).toEqual(clone.valueOf());
      original = [1];
      clone = deepClone(original);
      expect(original).not.toBe(clone);
      expect(original.valueOf()).toEqual(clone.valueOf());
      original = [[1]];
      clone = deepClone(original);
      expect(original).not.toBe(clone);
      expect(original[0]).not.toBe(clone[1]);
      expect(original.valueOf()).toEqual(clone.valueOf());
    });

    it('copies functions and HTML elements', function () {
      var original = function () {},
          clone = deepClone(original);
      expect(original).toBe(clone);
      original = document.body;
      clone = deepClone(original);
      expect(original).toBe(clone);
    });

    it('can copy or clone arbitrary objects', function () {
      var original = $(document.body),
          clone = deepClone(original, {copyArbitraryObjects: true});
      expect(original).toBe(clone);
      original = $(document.body);
      clone = deepClone(original, {cloneArbitraryObjects: true});
      expect(original).not.toBe(clone);
      expect(original[0].tagName).toEqual(clone[0].tagName);
      original = $(document.body);
      clone = deepClone(original, {cloneCloneableObjects: true});
      expect(original).not.toBe(clone);
      expect(original[0].tagName).toEqual(clone[0].tagName);
      original = $(document.body);
      expect(function () {
        deepClone(original);
      }).toThrow(new Error('Cannot clone an arbitrary function object instance'));
    });

    it('integrates to Underscore.js and Backbone.js', function () {
      expect(_.deepClone).toBe(deepClone);
      expect(Backbone.Model.prototype.deepClone).toBeDefined();
      expect(Backbone.Collection.prototype.deepClone).toBeDefined();
    });

    it('clones Backbone models and collections', function () {
      var original = new Backbone.Model({k: 1}),
          clone = original.deepClone();
      expect(original).not.toBe(clone);
      expect(original.attributes).toEqual(clone.attributes);
      original = new Backbone.Collection([{k: 1}]);
      clone = original.deepClone();
      expect(original).not.toBe(clone);
      expect(original.length).toEqual(clone.length);
      expect(original.first()).not.toBe(clone.first());
      expect(original.first().attributes).toEqual(clone.first().attributes);
    });

  });

});
