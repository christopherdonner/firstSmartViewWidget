/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';
  function ToolItemsMask(mask, options) {
    options || (options = {});
    if (options.normalize !== false) {
      mask = this._normalizeMask(mask);
    }
    this.blacklist = mask.blacklist;
    this.whitelist = mask.whitelist;
    this.storeMask();
  }

  _.extend(ToolItemsMask.prototype, Backbone.Events, {

    toJSON: function () {
      return {
        blacklist: _.clone(this.blacklist),
        whitelist: _.clone(this.whitelist)
      };
    },

    clone: function () {
      return new this.constructor(this);
    },

    clearMask: function (options) {
      var modified = this.blacklist.length || this.whitelist.length;
      this.blacklist.splice(0);
      this.whitelist.splice(0);
      if (modified && !(options && options.silent)) {
        this.trigger('update', this);
      }
      return modified;
    },

    extendMask: function (mask, options) {
      options || (options = {});
      if (options.normalize !== false) {
        mask = this._normalizeMask(mask);
      }
      var modified = this._extendList(this.blacklist, mask.blacklist);
      modified = this._extendList(this.whitelist, mask.whitelist) || modified;
      if (modified && !options.silent) {
        this.trigger('update', this);
      }
      return modified;
    },

    resetMask: function (mask, options) {
      options || (options = {});
      if (options.normalize !== false) {
        mask = this._normalizeMask(mask);
      }
      var modified = this._replaceList(this.blacklist, mask.blacklist);
      modified = this._replaceList(this.whitelist, mask.whitelist) || modified;
      if (modified && !options.silent) {
        this.trigger('update', this);
      }
      return modified;
    },

    storeMask: function () {
      this.originalBlacklist = _.clone(this.blacklist);
      this.originalWhitelist = _.clone(this.whitelist);
    },

    restoreMask: function (options) {
      options || (options = {});
      return this.resetMask({
        blacklist: this.originalBlacklist,
        whitelist: this.originalWhitelist
      }, {
        silent: options.silent,
        normalize: false
      });
    },

    restoreAndResetMask: function (mask, options) {
      options || (options = {});
      if (options.normalize !== false) {
        mask = this._normalizeMask(mask);
      }
      var modified = this.restoreMask({silent: true});
      modified = this.extendMask(mask, {
        silent: true,
        normalize: false
      }) || modified;
      if (modified && !options.silent) {
        this.trigger('update', this);
      }
      return modified;
    },

    maskItems: function (items) {
      if (items instanceof Backbone.Collection) {
        items = items.models;
      }
      return _.filter(items, this.passItem, this);
    },

    passItem: function (item) {
      if (item instanceof Backbone.Model) {
        item = item.attributes;
      }
      return !this._containsRule(item, this.blacklist) &&
          (!this.whitelist.length || this._containsRule(item, this.whitelist));
    },

    _containsRule: function (item, rules) {
      return _.any(rules, _.bind(this._matchesRule, this, item));
    },

    _matchesRule: function (item, rule) {
      if (item.signature != rule.signature) {
        return false;
      }
      var commandData = item.commandData || {};
      return _.all(rule.commandData, function (value, name) {
        return value == commandData[name];
      });
    },

    _extendList: function (target, source) {
      return _.reduce(source, function (modified, sourceRule) {
        if (!_.any(target, function (targetRule) {
          return _.isEqual(sourceRule, targetRule);
        })) {
          target.push(sourceRule);
          modified = true;
        }
        return modified;
      }, false);
    },

    _reduceList: function (target, source) {
      var indexes = _
              .chain(target)
              .map(function (targetRule, index) {
                return !_.any(source, function (sourceRule) {
                  return _.isEqual(targetRule, sourceRule);
                }) ? index : undefined;
              })
              .compact()
              .value(),
          shift = 0;
      _.each(indexes, function (index) {
        target.splice(index - shift++, 1);
      });
      return !!indexes.length;
    },

    _replaceList: function (target, source) {
      var modified = this._reduceList(target, source);
      return this._extendList(target, source) || modified;
    },

    _normalizeMask: function (mask) {
      mask || (mask = {});
      return {
        blacklist: this._normalizeList(mask.blacklist),
        whitelist: this._normalizeList(mask.whitelist)
      };
    },

    _normalizeList: function (rules) {
      return rules ? _.map(rules, this._normalizeRule, this) : [];
    },
    _normalizeRule: function (rule) {
      if (_.isObject(rule)) {
        return rule;
      }
      return {signature: rule};
    }

  });

  ToolItemsMask.extend = Backbone.Model.extend;

  return ToolItemsMask;

});
