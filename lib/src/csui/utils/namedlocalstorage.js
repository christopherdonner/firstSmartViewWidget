/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/utils/log", "csui/utils/namedstorage"
], function (module, log, NamedStorage) {

  if (localStorage === undefined) {
    log.warn("Local storage is not available." +
             "  Some information will not be able to be persisted;" +
             " expanded/collapsed state of facet filters, for example.") &&
    console.warn(log.last);
  }

  var NamedLocalStorage = NamedStorage.extend({

    constructor: function NamedLocalStorage(name) {
      NamedStorage.prototype.constructor.call(this, localStorage, name);
    }

  });

  NamedLocalStorage.version = '1.0';

  return NamedLocalStorage;

});
