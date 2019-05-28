/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var SyncableFromMultipleSources = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeSyncableFromMultipleSources: function (options) {
          return this;
        },

        syncFromMultipleSources: function (promises, mergeSources,
            convertError, options) {
          function convertAjaxError(result) {
            return Array.isArray(result) ? result[0] : result;
          }
          if (options === undefined && typeof convertError === 'object') {
            options = convertError;
            convertError = convertAjaxError;
          } else if (convertError == null) {
            convertError = convertAjaxError;
          }

          var model = this,
              abortables = promises.filter(function (promise) {
                return promise.abort;
              }),
              deferred = $.Deferred(),
              promise = deferred.promise();
          if (abortables.length) {
            promise.abort = function (statusText) {
              statusText || (statusText = 'canceled');
              abortables.forEach(function (promise) {
                promise.abort(statusText);
              });
              return this;
            };
          }
          model.trigger('request', model, {}, options);
          $.when.apply($, promises)
           .done(function () {
             var response = mergeSources.apply(model, arguments),
                 success = options.success;
             if (success) {
               success.call(options.context, response, 'success', {});
             }
             deferred.resolve(response, 'success', {});
           })
           .fail(function () {
             var object = convertError.apply(model, arguments),
                 error = options.error;
             if (error) {
               error.call(options.context, object, 'error', object.statusText);
             }
             deferred.reject.call(deferred, object, 'error', object.statusText);
           });
          return promise;
        }
      });
    }
  };

  return SyncableFromMultipleSources;
});
