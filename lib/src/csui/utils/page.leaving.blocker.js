/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery'], function (module, $) {

  var listenerRegistered,
      forceDisabled,
      messages = [],

      PageLeavingBlocker = {

        isEnabled: function () {
          return !forceDisabled && messages.length;
        },

        enable: function (message) {
          messages.unshift(message);
          ensureListener();
        },

        disable: function () {
          messages.shift();
        },

        forceDisable: function () {
          forceDisabled = true;
        }

      };

  function ensureListener() {
    if (!listenerRegistered) {
      listenerRegistered = true;
      $(window).bind('beforeunload.' + module.id, function (event) {
        if (PageLeavingBlocker.isEnabled()) {
          var message = messages[0];
          if (event) {
            event.originalEvent.returnValue = message; // Gecko, Trident, Chrome 34+
          }
          return message; // Gecko, WebKit, Chrome <34
        }
      });
    }
  }

  return PageLeavingBlocker;

});
