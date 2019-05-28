/* Copyright (C) Microsoft 2014. All rights reserved. */
csui.define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper'],
    function (module, _require, $, _, Backbone, GeneralHelper) {

      var _generalHelper = GeneralHelper.attributes;

      /// <summary>
      /// LocalStorage is an HTML5 localStorage implementation of a storage object.
      /// </summary>
      var LocalStorage = new Backbone.Model({

        _scope: this,
        _ids: [],

        /// <summary>
        /// Gets or creates a unique id in attempt to store in localStorage without collisions.
        /// </summary>
        /// <param name="id">Identifier to get/create a unique id for.</param>
        /// <returns>Unique id for this id.</returns>
        getUniqueId: function (id) {
          var unique = null;

          for (var i = 0; i < this._ids.length; i++) {
            if (this._ids[i].key === id) {
              unique = this._ids[i].value;
              break;
            }
          }

          if (!unique) {
            unique = _generalHelper.generateUUID();

            this._ids.push({
              key: id,
              value: unique
            });
          }

          return unique;
        },

        /// <summary>
        /// Initialize data.
        /// </summary>
        /// <param name="object">Object to init the storage.</param>
        /// <returns>Promise object related to this init.</returns>
        init: function (object) {
          var deferred = $.Deferred();

          for (var i = 0; i < this._ids.length; i++) {
            window.localStorage.removeItem(this._ids[i].key);
          }

          this._ids.length = 0;
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
          var deferred = $.Deferred(),
              unique   = this.getUniqueId(id);

          window.localStorage.setItem(unique, JSON.stringify(data));
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
          var deferred = $.Deferred(),
              unique   = this.getUniqueId(id),
              data     = JSON.parse(window.localStorage.getItem(unique));

          deferred.resolve(data);

          _generalHelper.safeCallbackExec({
            callback: callback,
            params: [
              data
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

          this._scope.create(data, id).done(function (id) {
            deferred.resolve(id);

            _generalHelper.safeCallbackExec({
              callback: callback,
              params: [
                id
              ]
            });
          });

          return deferred.promise();
        },

        /// <summary>
        /// Delete data in storage based on id.
        /// </summary>
        /// <param name="id">Identifier to data.</param>
        /// <param name="callback">Method to execute upon completion.</param>
        /// <returns>Promise object related to this delete.</returns>
        deleteVal: function (id, callback) {
          var deferred = $.Deferred(),
              unique   = this.getUniqueId(id);

          window.localStorage.removeItem(unique);

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

      return LocalStorage;

    });