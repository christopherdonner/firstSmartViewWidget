/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base'
], function (_, $, Backbone, base) {
  'use strict';

  var FetchableMixin = {
    mixin: function (prototype) {
      var originalFetch = prototype.fetch;

      return _.extend(prototype, {
        makeFetchable: function (options) {
          this.autoreset = options && options.autoreset;
          return this.on('reset', this._beforeFetchSucceeded, this)
              .on('add', this._beforeFetchSucceeded, this)
              .on('remove', this._beforeFetchSucceeded, this)
              .on('change', this._beforeFetchSucceeded, this);
        },

        _beforeFetchSucceeded: function () {
          this._fetchingOriginal && this._fetchSucceeded();
        },

        _fetchSucceeded: function () {
          this._fetchingOriginal = this.fetching = false;
          this.fetched = true;
          this.error = undefined;
        },

        _fetchFailed: function (jqxhr) {
          this._fetchingOriginal = this.fetching = false;
          this.error = new base.Error(jqxhr);
        },

        fetch: function (options) {
          var fetching = this.fetching;
          if (!fetching) {
            options = _.defaults(options || {}, {
              cache: true,
              urlBase: this.urlCacheBase? this.urlCacheBase(): undefined
            });

            this.fetched = false;
            this.error = null;
            options = this._prepareFetch(options);
            var self = this,
                success = options.success,
                error = options.error;
            options.success = function () {
              self._fetchSucceeded();
              success && success.apply(this, arguments);
            };
            options.error = function (model, jqxhr, options) {
              self._fetchFailed(jqxhr);
              error && error.apply(this, arguments);
            };
            this._fetchingOriginal = true;
            fetching = originalFetch.call(this, options);
            if (this._fetchingOriginal) {
              this.fetching = fetching;
            }
          }
          return fetching;
        },

        _prepareFetch: function (options) {
          options || (options = {});
          options.reset === undefined && this.autoreset && (options.reset = true);
          return options;
        },

        ensureFetched: function (options) {
          if (this.fetched) {
            if (options && options.success) {
              options.success(this);
            }
            return $.Deferred()
                .resolve(this, {}, options)
                .promise();
          }
          return this.fetch(options);
        },

        prefetch: function (response, options) {
          var deferred = $.Deferred().resolve();
          options = _.extend({parse: true}, options);
          options = this._prepareFetch(options);
          this.error = null;
          this.fetched = false;
          this.fetching = deferred.promise();
          this.trigger('request', this, response, options);
          setTimeout(function () {
            this._fetchSucceeded();
            if (this instanceof Backbone.Model) {
              var attributes = options.parse ? this.parse(response, options) :
                                               response;
              this.set(attributes, options);
            } else {
              var method = options.reset ? 'reset' : 'set';
              this[method](response, options);
            }
            if (options.success) {
              options.success.call(options.context, this, response, options);
            }
            this.trigger('sync', this, response, options);
            deferred.resolve();
          }.bind(this));
          return this.fetching;
        }
      });
    }
  };

  return FetchableMixin;
});
