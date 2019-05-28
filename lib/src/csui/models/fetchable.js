/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log'
], function (module, _, $, log) {
  'use strict';

  log = log(module.id);

  function FetchableModel(ParentModel) {
    var prototype = {

      makeFetchable: function (options) {
        this.autoreset = options && options.autoreset;
        return this.on('reset', this._beforeFetchSucceeded, this)
            .on('add', this._beforeFetchSucceeded, this)
            .on('change', this._beforeFetchSucceeded, this);
      },

      _beforeFetchSucceeded: function () {
        this.fetching && this._fetchSucceeded();
      },

      _fetchSucceeded: function () {
        this.fetching = false;
        this.fetched = true;
      },

      _fetchFailed: function () {
        this.fetching = false;
      },

      fetch: function (options) {
        if (!this.fetching) {
          this.fetched = false;
          log.debug('Fetching is starting for {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          options = this._prepareFetch(options);
          var self = this,
              success = options.success,
              error = options.error;
          options.success = function () {
            log.debug('Fetching succeeded for {0} ({1}).',
                log.getObjectName(self), self.cid) && console.log(log.last);
            self._fetchSucceeded();
            success && success.apply(this, arguments);
          };
          options.error = function () {
            log.debug('Fetching failed for {0} ({1}).',
                log.getObjectName(self), self.cid) && console.log(log.last);
            self._fetchFailed();
            error && error.apply(this, arguments);
          };
          this.fetching = ParentModel.prototype.fetch.call(this, options);
        } else {
          log.debug('Fetching is in progress for {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
        }
        return this.fetching;
      },

      _prepareFetch: function (options) {
        options || (options = {});
        options.reset === undefined && this.autoreset && (options.reset = true);
        return options;
      },

      ensureFetched: function (options) {
        if (this.fetched) {
          log.debug('No need to fetch {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          if (options && options.success) {
            options.success(this);
          }
          return $.Deferred()
              .resolve(this, {}, options)
              .promise();
        }
        return this.fetch(options);
      }

    };
    prototype.Fetchable = _.clone(prototype);

    return prototype;
  }

  return FetchableModel;

});
