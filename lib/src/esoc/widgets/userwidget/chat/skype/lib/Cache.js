/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper',
      'esoc/widgets/userwidget/chat/skype/lib/MemoryStorage'],
    function (module, _require, $, _, Backbone, GeneralHelper, MemoryStorage) {

      var _generalHelper = GeneralHelper.attributes,
          _ids           = [],

          storage        = MemoryStorage.attributes;

      var Cache = new Backbone.Model({
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
        create: function (object) {
          if (storage && object && object.data) {
            try {

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