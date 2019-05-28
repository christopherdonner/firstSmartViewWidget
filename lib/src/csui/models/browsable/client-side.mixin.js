/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/base',
  'csui/models/browsable/browsable.mixin'
], function (_, $, Backbone, base, BrowsableMixin) {

  var ClientSideBrowsableMixin = {

    mixin: function (prototype) {
      BrowsableMixin.mixin(prototype);

      var originalFetch = prototype.fetch;

      return _.extend(prototype, {

        makeClientSideBrowsable: function (options) {
          this.listenTo(this, 'add', this._modelAdded)
              .listenTo(this, 'remove', this._modelRemoved)
              .listenTo(this, 'reset', this._modelsReset);

          if (!this.allModels) {
            this.allModels = [];
          }
          this._filling = 0;

          return this.makeBrowsable(options);
        },

        setOrderOnRequest: function (arg) {
          this.orderOnRequest = arg;
        },

        getBrowsableUrlQuery: function () {
          var query = {};

          if (this.orderBy && this.orderOnRequest) {
            var first = this.orderBy.split(',')[0].split(' ');
            query.sort = (first[1] || 'asc') + '_' + first[0];
          }
          return $.param(query);
        },

        fetch: function (options) {
          options = options ? _.clone(options) : {};
          _.defaults(options, {skipSort: this.orderOnRequest});

          var self = this;
          var partialResponse;
          if (!options.reload && this.lastFilteredAndSortedModels !== undefined) {
            this.trigger('request', this, {}, options);
            var deferred = $.Deferred();
            setTimeout(function () {
              partialResponse = self._fill(options);
              self._notify(partialResponse, options);
              deferred.resolve(partialResponse);
            }, 0);
            return deferred.promise();
          }

          var originalSilent = options.silent,
              originalReset  = options.reset;
          options.silent = true;
          options.reset = true;

          var originalSuccess = options.success,
              originalError   = options.error;
          options.success = function (collection, response, options) {
            self.allModels = _.clone(self.models);
            var originalParse = options.parse;
            options.parse = false;
            self.reset([], options);
            if (originalSilent !== undefined) {
              options.silent = originalSilent;
            } else {
              delete options.silent;
            }
            if (originalReset !== undefined) {
              options.reset = originalReset;
            } else {
              delete options.reset;
            }
            partialResponse = self._fill(options);
            --self._filling;
            if (originalParse !== undefined) {
              options.parse = originalParse;
            } else {
              delete options.parse;
            }
            options.success = originalSuccess;
            if (originalSuccess) {
              originalSuccess.call(options.context, collection, response, options);
            }
          };
          options.error = function (collection, response, options) {
            --self._filling;
            if (originalError) {
              originalError.call(options.context, collection, response, options);
            }
          };

          ++this._filling;
          this.lastFilteredAndSortedModels = undefined;
          this._lastFilterAndSortCriteria = undefined;
          var pr =  originalFetch.call(this, options).then(function () {
            return partialResponse;
          });
          return pr;
        },

        populate: function (models, options) {
          options = _.extend({parse: true}, options);
          var originalSilent = options.silent,
              originalReset  = options.reset;
          options.silent = true;
          options.reset = true;
          options.skipSort = this.orderOnRequest;

          ++this._filling;

          this.lastFilteredAndSortedModels = [];
          this._lastFilterAndSortCriteria = undefined;
          this.skipCount = 0;
          this.filters = {};
          this.orderBy = undefined;
          this.reset(models, options);
          this.allModels = _.clone(this.models);
          var originalParse = options.parse;
          options.parse = false;
          this.reset([], options);
          this.trigger('request', this, {}, options);
          options.silent = originalSilent;
          if (this.allModels.length === 0) {
            options.reset = true;
          } else {
            options.reset = originalReset;
          }
          var deferred = $.Deferred();
          var self = this;
          setTimeout(function () {
            self.fetched = true; // this prevents the table from doing a collection.fetch
            var partialResponse = self._fill(options);
            --self._filling;
            options.parse = originalParse;
            self._notify(partialResponse, options);
            deferred.resolve(partialResponse);
          });
          return deferred.promise();
        },
        setAllModels: function (models) {
          var options = {};
          options.parse = false;
          var topCount = this.topCount;
          this.reset([], options);
          this.topCount = topCount; // topCount gets lost in reset...

          this.allModels = _.clone(models);
          this.totalCount = this.allModels.length;
          this.lastFilteredAndSortedModels = [];
          this._lastFilterAndSortCriteria = undefined;
          this.skipCount = 0;
          this.filters = {};
          this.orderBy = undefined;
        },

        compareObjectsForSort: function (property, left, right) {
          left = this._parseValue(property, left.get(property));
          right = this._parseValue(property, right.get(property));
          return this._compareValues(property, left, right);
        },

        _fill: function (options) {
          var filterAndSortCriteria = {
                orderBy: this.orderBy,
                filters: _.clone(this.filters)
              },
              models;
          if (this._lastFilterAndSortCriteria &&
              _.isEqual(this._lastFilterAndSortCriteria, filterAndSortCriteria)) {
            models = this.lastFilteredAndSortedModels;
          } else {
            models = _.clone(this.allModels);
            models = this._filter(models);
            models = options.skipSort ? models : this._sort(models);
            this.lastFilteredAndSortedModels = models;
            this._lastFilterAndSortCriteria = filterAndSortCriteria;
          }
          this.totalCount = this.allModels.length;
          this.filteredCount = models.length;
          models = this._limit(models);

          var method = options.reset ? 'reset' : 'set';
          ++this._filling;
          this[method](models, options);
          --this._filling;

          return models;
        },

        _notify: function (response, options) {
          if (options.success) {
            options.success.call(options.context, this, response, options);
          }
          this.trigger('sync', this, response, options);
        },

        _limit: function (models) {
          if (this.skipCount) {
            this.actualSkipCount = Math.min(this.skipCount, models.length);
            models = models.slice(this.skipCount);
          } else {
            this.actualSkipCount = 0;
          }
          if (this.topCount) {
            models = models.slice(0, this.topCount);
          }
          return models;
        },

        _sort: function (models) {
          var self = this;
          if (this.orderBy) {
            var criteria = _.map(this.orderBy.split(','), function (criterion) {
              var parts = criterion.trim().split(' ');
              return {
                property: parts[0],
                descending: parts[1] === 'desc'
              };
            });

            models = models.sort(function (left, right) {
              var result = 0;
              _.find(criteria, function (criterion) {
                result = self.compareObjectsForSort(criterion.property, left, right);
                if (result) {
                  if (criterion.descending) {
                    result *= -1;
                  }
                  return true;
                }
              });
              return result;
            });
          }
          return models;
        },

        _filter: function (models) {
          var self = this;
          for (var name in this.filters) {
            if (_.has(this.filters, name)) {
              var values = this.filters[name];
              if (values != null && values !== '') {
                _.isArray(values) || (values = [values]);
                models = _.filter(models, function (node) {
                  var hay = self._parseValue(name, node.get(name));
                  return _.any(values, function (value) {
                    var needle = self._parseValue(name, value);
                    if (name === 'type' && needle == -1) {
                      return node.get('container');
                    }
                    return self._containsValue(name, hay, needle);
                  });
                });
              }
            }
          }
          return models;
        },

        _modelAdded: function (model, collection, options) {
          if (this._populate(options)) {
            this.allModels.push(model);
            ++this.totalCount;
            this._lastFilterAndSortCriteria = undefined;
          }
        },

        _modelRemoved: function (model, collection, options) {
          if (this._populate(options)) {
            var index = _.findIndex(this.allModels, model);
            if (index >= 0) {
              this.allModels.splice(index, 1);
              --this.totalCount;
              this._lastFilterAndSortCriteria = undefined;
            }
          }
        },

        _modelsReset: function (collection, options) {
          if (this._populate(options)) {
            this.allModels = _.clone(this.models);
            this.totalCount = this.allModels.length;
            this.lastFilteredAndSortedModels = [];
            this._lastFilterAndSortCriteria = undefined;
            this.skipCount = this.topCount = 0;
            this.filters = {};
            this.orderBy = undefined;
          }
        },

        _populate: function (options) {
          return !(this._filling || options && options.populate === false);
        },

        _compareValues: function (property, left, right) {
          if (typeof left === 'string' && typeof right === 'string') {
            return base.localeCompareString(left, right, {usage: 'sort'});
          } else if (_.isArray(left) || _.isArray(right)) { //ARRAY Comparision.
            if (!_.isArray(left)) {
              left = [left];
            } else if (!_.isArray(right)) {
              right = [right];
            }
            return this._compareArrays(left, right);
          }
          return this._compareObjects(left, right); //OBJECT Comparision.
        },
		
        _compareObjects: function (left, right) {
          if (left != right) {
            if (left > right || right === void 0) {
              return 1;
            }
            if (left < right || left === void 0) {
              return -1;
            }
          }
          return 0;
        },

        _compareArrays: function (left, right) {
          var result = 0,
            len = Math.min(left.length, right.length),
            i=0;
          while(i <= len) {
            if (i === left.length && i === right.length) {
              result = 0;
              break;
            } else if (i === left.length) {
              result = -1;
              break;
            } else if (i === right.length) {
              result = 1;
              break;
            } else {
              if (typeof left[i] === 'string' && typeof right[i] === 'string') {
                result = base.localeCompareString(left[i], right[i], {usage: 'sort'});
              } else {
                result = this._compareObjects(left[i], right[i]);
              }
              if (result !== 0) {
                break;
              }
            }
            i++;
          }
          return result;
        },
		
        _containsValue: function (property, hay, needle) {
          if (typeof hay === 'string' && typeof needle === 'string') {
            return base.localeContainsString(hay, needle.toString());
          } else if (_.isArray(hay) && typeof needle === 'string') {
            return _.some(hay, function (blade) {
              if (typeof blade === 'string') {
                return base.localeContainsString(blade, needle.toString());
              } else {
                return blade == needle;
              }
            });
          }


          return hay == needle;
        },
        _parseValue: function (property, value) {
          if (value != null) {
            if (property === 'type') {
              return +value;
            }
            if (property.indexOf('date') >= 0) {
              if (_.isArray(value)) {
                return value.map(function(val) {
                  return  new Date(val);
                });
              } else {
                return new Date(value);
              }
            }
          }
          return value;
        }

      });
    }

  };

  return ClientSideBrowsableMixin;

});
