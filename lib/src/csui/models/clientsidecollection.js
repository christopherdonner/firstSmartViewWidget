/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/base'
], function (_, Backbone, base) {
  'use strict';

  function ClientSideCollection() {
    var prototype = {

      clone: function () {
        var clone = new this.constructor(this.models, this.options);
        if (this.columns) {
          clone.columns.reset(this.columns.toJSON());
        }
        clone.actualSkipCount = this.actualSkipCount;
        clone.totalCount = this.totalCount;
        clone.filteredCount = this.filteredCount;
        return clone;
      },

      _cacheCollection: function () {
        if (this.selfReset !== true) {
          this.selfReset = false;
          this.cachedCollection = this.clone();
        }
      },

      parse: function (response) {
        this.actualSkipCount = 0;
        this.totalCount = response.results.length;
        this.filteredCount = this.totalCount;

        this._limitResponse(response.results);

        this.columns && this.columns.resetColumnsV2(response, this.options);
        return response.results;
      },

      _limitResponse: function (elements) {
        if (elements && this.skipCount) {
          if (elements.length > this.skipCount) {
            elements.splice(0, this.skipCount);
          } else {
            this.actualSkipCount = 0;
          }
        }
        if (elements && this.topCount) {
          if (elements.length > this.topCount) {
            elements.splice(this.topCount);
          }
        }
      },

      _resetCollection: function () {
        if (!this.cachedCollection) {
          this._cacheCollection();
        }
        this.workingModels = _.clone(this.cachedCollection.models);
        this.totalCount = this.workingModels.length;
        this.filteredCount = this.workingModels.length;
      },

      _runAllOperations: function (reset) {
        this._resetCollection();
        this._sortCollection();
        this._filterCollection();
        this._limitCollection();
        this._triggerCollectionResetEvent(reset);
      },

      _triggerCollectionResetEvent: function (reset) {
        this.models = _.clone(this.workingModels);
        this.length = this.models.length;
        if (reset) {
          this.selfReset = true;
          this.trigger("reset", this);
        }
      },
      setLimit: function (skip, top, fetch) {
        if (this.skipCount != skip || this.topCount != top) {
          this.skipCount = skip;
          this.actualSkipCount = skip;
          this.topCount = top;

          this._runAllOperations(true);

          return true;
        }
      },

      _limitCollection: function () {
        this._limitResponse(this.workingModels);
      },

      resetLimit: function (fetch) {
        if (this.skipCount) {
          this.skipCount = 0;
          this.topCount = 0;
          this.actualSkipCount = 0;

          this._resetCollection();
          this._triggerCollectionResetEvent(true);

          return true;
        }
      },
      setFilter: function (filterObj) {
        this.filterObj || (this.filterObj = {});
        if (_.isEmpty(filterObj)) {
          this.filterObj = {};
        } else {
          _.extend(this.filterObj, filterObj);
        }
        this._runAllOperations(true);
        return true;
      },

      clearFilter: function (fetch) {
        if (this.filterObj) {
          this.filterObj = undefined;
          this._resetCollection();
          this._triggerCollectionResetEvent(true);
          return true;
        }
      },

      _filterCollection: function () {
        for (var name in this.filterObj) {
          if (_.has(this.filterObj, name)) {
            var values = this.filterObj[name];
            if (values != null && values !== '') {
              _.isArray(values) || (values = [values]);
              this.workingModels = _.filter(this.workingModels, function (node) {
                var hay = parseValue(name, node.get(name));
                return _.any(values, function (value) {
                  var needle = parseValue(name, value);
                  if (name === 'type' && needle == -1) {
                    return node.get('container');
                  }
                  return containsValue(hay, needle);
                });
              });
            }
          }
        }
        this.totalCount = this.workingModels.length;
        this.filteredCount = this.workingModels.length;
      },
      setOrder: function (attributes, fetch) {
        if (this.orderBy != attributes) {
          this.orderBy = attributes;
          this._runAllOperations();
          return true;
        }
      },

      resetOrder: function (fetch) {
        if (this.orderBy) {
          this.orderBy = undefined;
          this._resetCollection();
          this._triggerCollectionResetEvent();
          return true;
        }
      },

      _sortCollection: function () {
        if (this.orderBy) {
          var criteria = _.map(this.orderBy.split(','), function (criterium) {
            var parts = criterium.trim().split(' ');
            return {
              property: parts[0],
              descending: parts[1] === 'desc'
            };
          });

          this.workingModels.sort(function (left, right) {
            var result = 0;
            _.find(criteria, function (criterium) {
              left = parseValue(criterium.property, left.get(criterium.property));
              right = parseValue(criterium.property, right.get(criterium.property));

              result = compareValues(left, right);
              if (result) {
                if (criterium.descending) {
                  result *= -1;
                }
                return true;
              }
            });
            return result;
          });
        }
      }

    };
    prototype.ClientSideCollection = _.clone(prototype);

    return prototype;
  }

  function compareValues(left, right) {
    if (typeof left === 'string' && typeof right === 'string') {
      return base.localeCompareString(left, right, {usage:'sort'});
    }
    if (left != right) {
      if (left > right || right === void 0) {
        return 1;
      }
      if (left < right || left === void 0) {
        return -1;
      }
    }
    return 0;
  }

  function containsValue(hay, needle) {
    if (typeof hay === 'string' && typeof needle === 'string') {
      return base.localeContainsString(hay, needle.toString());
    }
    return hay == needle;
  }
  function parseValue(property, value) {
    if (value != null) {
      if (property === 'type') {
        return +value;
      }
      if (property.indexOf('date') >= 0) {
        return new Date(value);
      }
    }
    return value;
  }

  return ClientSideCollection;

});
