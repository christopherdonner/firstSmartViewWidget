/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper'],
    function (module, _require, $, _, Backbone, GeneralHelper) {

      var _generalHelper = GeneralHelper.attributes;
      var LocalStorage = new Backbone.Model({

        _scope: this,
        _ids: [],
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
        init: function (object) {
          var deferred = $.Deferred();

          for (var i = 0; i < this._ids.length; i++) {
            window.localStorage.removeItem(this._ids[i].key);
          }

          this._ids.length = 0;
          deferred.resolve();

          return deferred.promise();
        },
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