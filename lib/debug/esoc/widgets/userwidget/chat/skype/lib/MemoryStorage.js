/* Copyright (C) Microsoft 2014. All rights reserved. */
csui.define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper'],
    function (module, _require, $, _, Backbone, GeneralHelper) {

      var _generalHelper = GeneralHelper.attributes;

      /// <summary>
      /// MemoryStorage is an in-memory implementation of a storage object.
      /// </summary>
      var MemoryStorage = new Backbone.Model({
        _data: {},

        /*var obj = function MemoryStorage() {
            if (!(this instanceof MemoryStorage)) {
                return new MemoryStorage();
            }

            var _scope = this,
                this._data  = {};*/

        /// <summary>
        /// Initialize data.
        /// </summary>
        /// <param name="object">Object to init the storage.</param>
        /// <returns>Promise object related to this init.</returns>
        init: function (object) {
          var deferred = $.Deferred();
          this._data = {};
          deferred.resolve();

          return deferred.promise();
        },

        /// <summary>
        /// Create data in storage based on id.
        /// </summary>
        /// <param name="data">Information.</param>
        /// <param name="id">Identifier to data.</param>
        /// <param name="callback">Method to execute upon completion.</param>
        /// <returns>Promise object related to this create.</returns>
        create: function (data, id, callback) {
          var deferred = $.Deferred();

          this._data[id] = data;

          deferred.resolve(id);

          _generalHelper.safeCallbackExec({
            callback: callback,
            params: [
              id
            ]
          });

          return deferred.promise();
        },

        /// <summary>
        /// Read data in storage based on id.
        /// </summary>
        /// <param name="id">Identifier to data.</param>
        /// <param name="callback">Method to execute upon completion.</param>
        /// <returns>Promise object related to this read.</returns>
        read: function (id, callback) {
          var deferred = $.Deferred();

          deferred.resolve(this._data[id]);

          _generalHelper.safeCallbackExec({
            callback: callback,
            params: [
              this._data[id]
            ]
          });

          return deferred.promise();
        },

        /// <summary>
        /// Update data in storage based on id.
        /// </summary>
        /// <param name="data">Information.</param>
        /// <param name="id">Identifier to data.</param>
        /// <param name="callback">Method to execute upon completion.</param>
        /// <returns>Promise object related to this update.</returns>
        update: function (data, id, callback) {
          var deferred = $.Deferred();

          this._data[id] = data;

          deferred.resolve(id);

          _generalHelper.safeCallbackExec({
            callback: callback,
            params: [
              id
            ]
          });

          deferred.promise();
        },

        /// <summary>
        /// Delete data in storage based on id.
        /// </summary>
        /// <param name="id">Identifier to data.</param>
        /// <param name="callback">Method to execute upon completion.</param>
        /// <returns>Promise object related to this delete.</returns>
        deleteVal: function (id, callback) {
          var deferred = $.Deferred();

          delete this._data[id];

          deferred.resolve(id);

          _generalHelper.safeCallbackExec({
            callback: callback,
            params: [
              id
            ]
          });

          return deferred.promise();
        }
      });

      return MemoryStorage;

    });
