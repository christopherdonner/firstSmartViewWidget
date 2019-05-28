/* Copyright (C) Microsoft 2014. All rights reserved. */

csui.define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper',
      'esoc/widgets/userwidget/chat/skype/lib/MemoryStorage'],
    function (module, _require, $, _, Backbone, GeneralHelper, MemoryStorage) {

      var _generalHelper = GeneralHelper.attributes,

          //_generalHelper.namespace("microsoft.rtc.ucwa.samples");

          /// <summary>
          /// Cache is responsible for managing storage based on a supplied storage object.
          /// </summary>
          /// <param name="storage">Storage object for the Cache to use.</param>
          /// <remarks>
          /// If no storage object is supplied Cache will default to using MemoryStorage.
          // A storage object used by the cache must implement init, create, read, update, and delete.
          /// </remarks>
          _ids           = [],

          storage        = MemoryStorage.attributes;

      var Cache = new Backbone.Model({
        // Check storage for appropriate methods

        /// <summary>
        /// Initialize the storage object.
        /// </summary>
        /// <param name="object">Object to init the storage.</param>
        /// <remarks>
        /// object does not have a prescribed format due to differing needs of storage objects
        /// </remarks>
        /// <returns>Promise object related to this init.</returns>
        init: function (object) {
          if (storage) {
            try {
              return storage.init(object);
            } catch (e) {
              return _generalHelper.genericRejectAction(e,
                  "Encountered error during init");
            }
          } else {
            return _generalHelper.genericRejectAction(null,
                "storage object is not defined: unable to init");
          }
        },

        /// <summary>
        /// Create data in storage based on object.
        /// </summary>
        /// <param name="object">Object to create in storage.</param>
        /// <remarks>
        /// object comes in the form of:
        /// {
        ///     data - information
        ///     id - identifier to data (optional)
        ///     callback - method to execute upon completion
        /// }
        /// Callback/Promise object will be called with id
        /// </remarks>
        /// <returns>Promise object related to this create.</returns>
        create: function (object) {
          if (storage && object && object.data) {
            try {
              // TODO need to revisit
              /*if (object.id && _ids.indexOf(object.id) !== -1) {
                return _generalHelper.genericRejectAction(object,
                    "_ids does contain an entry for " + object.id +
                    ": unable to create");
              }

              while (!object.id) {
                var id = _generalHelper.generateUUID();

                if (_ids.indexOf(id) === -1) {
                  object.id = id;
                }
              }*/

              return storage.create(object.data, object.id, object.callback).done(
                  function () {
                    _ids.push(object.id);
                  });
            } catch (e) {
              _generalHelper.logError(e);
              return _generalHelper.genericRejectAction(object,
                  "Encountered error during create");
            }
          } else {
            return _generalHelper.genericRejectAction(object,
                "storage object or object.data not defined: unable to create");
          }
        },

        /// <summary>
        /// Read data in storage based on object.
        /// </summary>
        /// <param name="object">Object to read in storage.</param>
        /// <remarks>
        /// object comes in the form of:
        /// {
        ///     id - identifier to data
        ///     callback - method to execute upon completion
        /// }
        /// Callback/Promise object will be called with data
        /// </remarks>
        /// <returns>Promise object related to this read.</returns>
        read: function (object) {
          if (storage && object.id) {
            try {
              if (_ids.indexOf(object.id) !== -1) {
                return storage.read(object.id, object.callback);
              } else {
                return _generalHelper.genericRejectAction(object,
                    "_ids does not contain an entry for " + object.id +
                    ": unable to read");
              }
            } catch (e) {
              _generalHelper.logError(e);
              return _generalHelper.genericRejectAction(object,
                  "Encountered error during read");
            }
          } else {
            return _generalHelper.genericRejectAction(object,
                "storage object or object.id not defined: unable to read");
          }
        },

        /// <summary>
        /// Update data in storage based on object.
        /// </summary>
        /// <param name="object">Object to update in storage.</param>
        /// <remarks>
        /// object comes in the form of:
        /// {
        ///     data - information
        ///     id - identifier to data
        ///     callback - method to execute upon completion
        /// }
        /// Callback/Promise object will be called with id
        /// </remarks>
        /// <returns>Promise object related to this update.</returns>
        update: function (object) {
          if (storage && object.id && object.data) {
            try {
              if (_ids.indexOf(object.id) !== -1) {
                return storage.update(object.data, object.id, object.callback);
              } else {
                return _generalHelper.genericRejectAction(object,
                    "_ids does not contain an entry for " + object.id +
                    ": unable to update");
              }
            } catch (e) {
              _generalHelper.logError(e);
              return _generalHelper.genericRejectAction(object,
                  "Encountered error during update");
            }
          } else {
            return _generalHelper.genericRejectAction(object,
                "storage object, object.id, or object.data not defined: unable to update");
          }
        },

        /// <summary>
        /// Delete data in storage based on object.
        /// </summary>
        /// <param name="object">Object to delete in storage.</param>
        /// <remarks>
        /// object comes in the form of:
        /// {
        ///     id - identifier to data
        ///     callback - method to execute upon completion
        /// }
        /// Callback/Promise object will be called with id
        /// </remarks>
        /// <returns>Promise object related to this delete.</returns>
        deleteVal: function (object) {
          if (storage && object.id) {
            try {
              var index = _ids.indexOf(object.id);

              if (index !== -1) {
                return storage.deleteVal(object.id, object.callback).done(
                    function () {
                      _ids.splice(index, 1);
                    });
              } else {
                return _generalHelper.genericRejectAction(object,
                    "_ids does not contain an entry for " + object.id +
                    ": unable to delete");
              }
            } catch (e) {
              _generalHelper.logError(e);
              return _generalHelper.genericRejectAction(object,
                  "Encountered error during delete");
            }
          } else {
            return _generalHelper.genericRejectAction(object,
                "storage object or object.id not defined: unable to delete");
          }
        }
      });

      return Cache;

    });