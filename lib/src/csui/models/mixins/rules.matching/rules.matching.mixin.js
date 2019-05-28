/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/log'
], function (module, _, Backbone, log) {
  'use strict';

  log = log(module.id);

  var RulesMatchingMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {

        makeRulesMatching: function (options) {
          return this;
        },

        rulesToMatch: [
          'equals', 'contains', 'startsWith', 'endsWith', 'matches',
          'includes', 'equalsNoCase', 'containsNoCase', 'startsWithNoCase',
          'endsWithNoCase', 'matchesNoCase', 'includesNoCase',  'has',
          'decides', 'or', 'and', 'not'
        ],

        matchRules: function (model, operations, combine) {
          var results = _.chain(this.rulesToMatch)
                         .map(function (operation) {
                           var operands = operations[operation];
                           return operands === undefined ? undefined :
                                  this['_evaluate-' + operation](model, operands);
                         }, this)
                         .filter(function (result) {
                           return result !== undefined;
                         })
                         .value();
          return !results.length ||
                 _[combine || 'any'](results, function (result) {
                   return result === true;
                 });
        },

        _getRulingPropertyValue: function (model, name) {
          if (typeof name !== 'string') {
            if (name == null) {
              name = 'null';
            }
            log.warn('Invalid property name in the action rule specification: {0}',
                name) && console.warn(log.last);
            return null;
          }
          var names = name.split('.'),
              value = model instanceof Backbone.Model ?
                      model.attributes : model || {};
          _.find(names, function (name) {
            value = value[name];
            if (value == null) {
              value = null;
              return true;
            }
          });
          return value;
        },

        '_evaluate-or': function (model, operations) {
          if (_.isArray(operations)) {
            return _.any(operations, function (operation) {
              return this.matchRules(model, operation);
            }, this);
          }
          return this.matchRules(model, operations, 'any');
        },

        '_evaluate-and': function (model, operations) {
          if (_.isArray(operations)) {
            return _.all(operations, function (operation) {
              return this.matchRules(model, operation);
            }, this);
          }
          return this.matchRules(model, operations, 'all');
        },

        '_evaluate-not': function (model, operations) {
          return !this.matchRules(model, operations);
        },

        '_evaluate-equals': function (model, operands) {
          return this._evaluateEquals(model, operands, false);
        },

        '_evaluate-equalsNoCase': function (model, operands) {
          return this._evaluateEquals(model, operands, true);
        },

        _evaluateEquals: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key);
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return value == actual;
            });
          }, this);
        },

        '_evaluate-contains': function (model, operands) {
          return this._evaluateContains(model, operands, false);
        },

        '_evaluate-containsNoCase': function (model, operands) {
          return this._evaluateContains(model, operands, true);
        },

        _evaluateContains: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = []);
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return actual.indexOf(value) >= 0;
            });
          }, this);
        },

        '_evaluate-startsWith': function (model, operands) {
          return this._evaluateStartsWith(model, operands, false);
        },

        '_evaluate-startsWithNoCase': function (model, operands) {
          return this._evaluateStartsWith(model, operands, true);
        },

        _evaluateStartsWith: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = '');
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return actual.indexOf(value) === 0;
            });
          }, this);
        },

        '_evaluate-endsWith': function (model, operands) {
          return this._evaluateEndsWith(model, operands, false);
        },

        '_evaluate-endsWithNoCase': function (model, operands) {
          return this._evaluateEndsWith(model, operands, true);
        },

        _evaluateEndsWith: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = '');
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return _.str.endsWith(actual, value);
            });
          }, this);
        },

        '_evaluate-matches': function (model, operands) {
          return this._evaluateMatches(model, operands, false);
        },

        '_evaluate-matchesNoCase': function (model, operands) {
          return this._evaluateMatches(model, operands, true);
        },

        _evaluateMatches: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = '');
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              if (typeof value === 'string') {
                value = new RegExp(value);
              }
              return value.test(actual);
            });
          }, this);
        },

        '_evaluate-includes': function (model, operands) {
          return this._evaluateIncludes(model, operands, false);
        },

        '_evaluate-includesNoCase': function (model, operands) {
          return this._evaluateIncludes(model, operands, true);
        },

        _evaluateIncludes: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || [];
            if (!_.isArray(actual)) {
              if (_.isObject(actual)) {
                actual = Object.keys(actual);
              } else {
                actual = [actual];
              }
            }
            if (!_.isArray(values)) {
              values = [values];
            }
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return _.contains(actual, value);
            });
          }, this);
        },

        '_evaluate-has': function (model, operands) {
          _.isArray(operands) || (operands = [operands]);
          return _.any(operands, function (name) {
            return this._getRulingPropertyValue(model, name) != null;
          }, this);
        },

        '_evaluate-decides': function (model, methods) {
          _.isArray(methods) || (methods = [methods]);
          return _.any(methods, function (method) {
            return method(model);
          });
        },

        _normalizeCase: function (actual, values) {
          if (typeof actual === 'string') {
            actual = actual.toLowerCase();
          }
          values = _.map(values, function (value) {
            return typeof value === 'string' ? value.toLowerCase() : value;
          });
          return {
            actual: actual,
            values: values
          };
        }
      });
    }

  };

  return RulesMatchingMixin;

});
