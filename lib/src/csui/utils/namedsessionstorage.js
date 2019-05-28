/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/utils/log", "csui/utils/namedstorage"
], function (module, log, NamedStorage) {

  if (sessionStorage === undefined) {
    log.warn("Session storage is not available." +
             "  Some information will not be able to save temporarily;" +
             " authenticated state, for example.") && console.warn(log.last);
  }

  var NamedSessionStorage = NamedStorage.extend({

    constructor: function NamedSessionStorage(name) {
      NamedStorage.prototype.constructor.call(this, sessionStorage, name);
    }

  });

  NamedSessionStorage.version = '1.0';

  return NamedSessionStorage;

});
