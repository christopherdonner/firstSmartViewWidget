/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/log'
], function (module, _, $, Backbone, log) {
  'use strict';

  log = log(module.id);

  function UploadableModel(ParentModel) {
    var prototype = {

      makeUploadable: function (options) {
        return this;
      },

      sync: function (method, model, options) {
        var data = options.data || options.attrs || this.attributes;
        function currectUpdatingUrl() {
          var url = options.url || _.result(model, 'url');
          return url.replace(/\?.*$/, '');
        }

        if (method === 'create') {
          log.debug('Creating {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          var formData = new FormData();
          formData.append('body', JSON.stringify(data));
          _.each(_.keys(options.files || {}), function (key) {
            var files = options.files[key], i;
            if (_.isArray(files) && files.length > 1) {
              for (i = 0; i < files.length; ++i) {
                var name = i ? key + i : key;
                formData.append(name, files[i]);
              }
            } else if (files) {
              formData.append(key, files);
            }
          });

          _.extend(options, {
            data: formData,
            contentType: false,
            url: currectUpdatingUrl()
          });
        } else if (method === 'update' || method === 'patch') {
          log.debug('Updating {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          method = 'update';
          data = {body: JSON.stringify(data)};
          _.extend(options, {
            data: $.param(data),
            contentType: 'application/x-www-form-urlencoded',
            url: currectUpdatingUrl()
          });
        }
        return Backbone.sync(method, model, options);
      }

    };
    prototype.Uploadable = _.clone(prototype);

    return prototype;
  }

  return UploadableModel;

});
