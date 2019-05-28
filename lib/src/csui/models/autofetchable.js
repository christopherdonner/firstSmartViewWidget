/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function AutoFetchableModel(ParentModel) {
    var prototype = {

      makeAutoFetchable: function (options) {
        options && options.autofetch && this.automateFetch(options.autofetch);
        return this;
      },

      automateFetch: function (enable) {
        this[enable ? 'on' : 'off'](_.result(this, '_autofetchEvent'),
          _.bind(this._fetchAutomatically, this, enable));
      },

      isFetchable: function () {
        return !!this.get('id');
      },

      _autofetchEvent: 'change:id',

      _fetchAutomatically: function (enableOptions, model, value, options) {
        if (this.isFetchable()) {
         var fullOptions = _.extend({}, enableOptions, options);
        this.fetch(fullOptions);
        }
      }

    };
    prototype.AutoFetchable = _.clone(prototype);
    
    return prototype;
  }

  return AutoFetchableModel;

});
