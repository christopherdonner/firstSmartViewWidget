/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/log'
], function (module, _, $, Backbone, log) {
  'use strict';

  log = log(module.id);

  var config = _.extend({
    useJson: false,
    useMock: false,
    usePatch: false,
    metadataPartName: 'body'
  }, module.config());

  var UploadableMixin = {

    mixin: function (prototype) {
      var originalSync = prototype.sync;
      if (!prototype.prepare) {
        prototype.prepare = function (data, options) {
          return data;
        };
      }
      if (!prototype.prepareFormData) {
        prototype.prepareFormData = function (data, options) {
          return {body: JSON.stringify(data)};
        };
      }

      return _.extend(prototype, {
        makeUploadable: function (options) {
          return this;
        },

        sync: function (method, model, options) {
          var useJson          = UploadableMixin.useJSON,
              useMock          = UploadableMixin.mock,
              usePatch         = UploadableMixin.usePatch,
              metadataPartName = UploadableMixin.metadataPartName,
              data             = options.data || options.attrs || this.attributes;
          if (options.prepare !== false) {
            data = this.prepare(data, options);
          }
          function currectUpdatingUrl() {
            var url = options.url || _.result(model, 'url');
            return url.replace(/\?.*$/, '');
          }

          if (method === 'create') {
            log.debug('Creating {0} ({1}).',
                log.getObjectName(this), this.cid) && console.log(log.last);
            if (useMock) {
              _.each(_.keys(options.files || {}), function (key) {
                var files = options.files[key], i;
                if (_.isArray(files) && files.length > 1) {
                  for (i = 0; i < files.length; ++i) {
                    var name = i ? key + i : key;
                    data[name] = files[i];
                  }
                } else if (files) {
                  data[key] = files;
                }
              });

              _.extend(options, {
                data: data,
                contentType: 'application/json',
                url: currectUpdatingUrl()
              });
            } else if (!_.isEmpty(options.files)) {
              var formData = new FormData();
              data = JSON.stringify(data);
              if (useJson) {
                formData.append(metadataPartName,
                    new Blob([data], {type: 'application/json'}));
              } else {
                formData.append(metadataPartName, data);
              }
              _.each(_.keys(options.files || {}), function (key) {
                var files = options.files[key], i;
                if (_.isArray(files) && files.length > 1) {
                  for (i = 0; i < files.length; ++i) {
                    var name = i ? key + i : key;
                    formData.append(name, files[i]);
                  }
                } else if (files) {
                  formData.append(key, files, files.name);
                }
              });

              _.extend(options, {
                data: formData,
                contentType: false,
                url: currectUpdatingUrl()
              });
            } else {
              if (useJson) {
                _.extend(options, {
                  data: JSON.stringify(data),
                  contentType: 'application/json',
                  url: currectUpdatingUrl()
                });
              } else {
                data = this.prepareFormData(data);
                _.extend(options, {
                  data: $.param(data),
                  contentType: 'application/x-www-form-urlencoded',
                  url: currectUpdatingUrl()
                });
              }
            }
          } else if (method === 'update' || method === 'patch') {
            log.debug('Updating {0} ({1}).',
                log.getObjectName(this), this.cid) && console.log(log.last);
            if (!usePatch) {
              method = 'update';
            }
            if (useMock) {
              _.extend(options, {
                data: data,
                contentType: 'application/json',
                url: currectUpdatingUrl()
              });
            } else if (useJson) {
              _.extend(options, {
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: currectUpdatingUrl()
              });
            } else {
              data = this.prepareFormData(data);
              _.extend(options, {
                data: $.param(data),
                contentType: 'application/x-www-form-urlencoded',
                url: currectUpdatingUrl()
              });
            }
          }
          return originalSync.call(this, method, model, options);
        }
      });
    },
    useJSON: config.useJson,
    mock: config.useMock,
    usePatch: config.usePatch,
    metadataPartName: config.metadataPartName
  };

  return UploadableMixin;
});
