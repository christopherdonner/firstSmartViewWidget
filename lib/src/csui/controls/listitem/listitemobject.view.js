/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore', 'csui/lib/marionette', 'csui/lib/numeral',
  'csui/lib/moment', 'csui/lib/handlebars', 'csui/utils/base',
  'hbs!csui/controls/listitem/impl/listitemobject',
  'csui/utils/handlebars/l10n', // support {{csui-l10n ...}}
  'css!csui/controls/listitem/impl/listitemobject'
], function (_, Marionette, numeral, moment, Handlebars, base, itemTemplate) {

  var ObjectListItem = Marionette.ItemView.extend({

    constructor: function ObjectListItem() {
      Marionette.ItemView.apply(this, arguments);
    },

    triggers: {
      'click': 'click:item'
    },

    className: 'cs-item-object list-group-item binf-clearfix',
    template: itemTemplate,

    templateHelpers: function () {
      return this._getObject(this.options.data || {});
    },

    _getObject: function (object) {
      return _.reduce(object, function (result, expression, name) {
        if (typeof expression === 'string') {
          expression = this._getValue(expression);
        } else if (typeof expression === 'object') {
          if (expression.expression !== undefined) {
            expression = this._getValue(expression);
          } else {
            expression = this._getObject(expression);
          }
        }
        result[name] = expression;
        return result;
      }, {}, this);
    },

    _getValue: function (expression) {
      var complexExpression;
      if (typeof expression !== 'string') {
        complexExpression = expression;
        expression = expression.expression;
      }
      expression = this._replacePlaceholders(expression);
      if (complexExpression) {
        expression = this._applyValueRanges(expression, complexExpression);
        expression = this._applyValueMap(expression, complexExpression);
      }
      return expression;
    },

    _replacePlaceholders: function (expression) {
      var parameterPlaceholder = /{([^}]+)}/g,
          match, names, value;
      while ((match = parameterPlaceholder.exec(expression))) {
        names = match[1].split('.');
        value = this.model.attributes;
        _.find(names, function (name) {
          value = value[name];
          if (value == null) {
            value = '';
            return true;
          }
        });
        expression = expression.substring(0, match.index) + value +
                     expression.substring(match.index + match[0].length);
      }
      return expression;
    },
    _applyValueMap: function (value, complexExpression) {
      var valueMap = complexExpression.valueMap;
      if (valueMap) {
        value = valueMap[value];
        if (value == null) {
          value = valueMap['*'];
        }
      }
      return value;
    },
    _applyValueRanges: function (value, complexExpression) {
      var valueRanges = complexExpression.valueRanges;
      if (valueRanges) {
        var convertValue;
        if (complexExpression.type === 'Date') {
          convertValue = function converDate(value) {
            return base.parseDate(value);
          };
        } else {
          convertValue = function convertNumber(value) {
            return numeral(value).value();
          };
        }
        value = convertValue(value);
        _.find(valueRanges, function (range) {
          var greaterOrEqual = range.greaterOrEqual;
          if (greaterOrEqual !== undefined) {
            greaterOrEqual = convertValue(greaterOrEqual);
            if (greaterOrEqual > value) {
              return false;
            }
          }
          var lessThan = range.lessThan;
          if (lessThan !== undefined) {
            lessThan = convertValue(lessThan);
            if (lessThan <= value) {
              return false;
            }
          }
          value = range.value;
          return true;
        });
      }
      return value;
    }

  });

  return ObjectListItem;

});
