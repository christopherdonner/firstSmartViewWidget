/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/*
 * jquery.mousehover 0.2.1
 * https://github.com/prantlf/jquery.mousehover
 *
 * Copyright (c) 2017 Ferdinand Prantl
 * Licensed under the MIT license.
 */

// [OT] Modifications done:
//
// * Replace UMD with csui AMD at the top and bottom of the file
// * Return the .fn function
// * Disclose iPad and iPhone from mousehover checks

// [OT] Declare a csui module
define(['csui/lib/jquery'], function($) {
  'use strict';

  // Remember the existing mousehover plugin, if there is any, to be able
  // to restore it by calling noConflict.
  var oldMousehover = $.fn.mousehover,
      eventTimeProperty;

  // Convert any combination of input parametrs to the parameters object,
  // which has the same structure and all values available.
  // Arguments:
  // .mousehover(handlerIn)
  // .mousehover(handlerIn, handlerOut)
  // .mousehover(handlerIn, options)
  // .mousehover(handlerIn, handlerOut, options)
  // .mousehover({handlerIn, handlerOut, options})
  // .mousehover('off')
  // .mousehover('off', options)
  // Result:
  // .handlerIn:  function
  // .handlerOut: function
  // .namespace:  string (empty or starting with '.')
  function normalizeParameters(handlerIn, handlerOut, options) {
    var namespace;
    if (typeof handlerIn === 'object') {
      return handlerIn;
    }
    // The first parameter has to be always present. Function handler,
    // string method name, or an object literal.
    if (!handlerIn) {
      throw new Error('Missing event handler or method.');
    }
    if (!options) {
      options = typeof handlerOut === 'object' ? handlerOut : {};
    }
    // Prepend '.' to allow simple concatenation of the namespace.
    namespace = options.namespace;
    namespace = namespace ? '.' + namespace : '';
    // There is just one method supported right now - "off". It will be
    // detected by the missing "handlerIn"" parameter.
    if (typeof handlerIn === 'string') {
      if (handlerIn !== 'off') {
        throw new Error('Unsupported method.')
      }
      return {
        namespace: namespace
      };
    }
    return {
      handlerIn: handlerIn,
      handlerOut: typeof handlerOut === 'function' ? handlerOut : handlerIn,
      namespace: namespace
    };
  }

  // [OT] Some taps on iPad were not detected as emulated. Not clear why.
  // There i no mouse on iPad today, avoid any mouse detection.
  if (navigator.userAgent.indexOf('iPad') > 0 ||
      navigator.userAgent.indexOf('iPhone') > 0) {
    // Do nothing on iOS.
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      return this;
    };
  // If the browser supports pointer events, we can detect mouse reliably.
  // } else if ('onpointerenter' in window ) {
  // [OT] Pointer events are not detected properly in BCW.
  // navigator.pointerEnabled is undefined in browsers where as in SAP BCW it is false.
  // Adding extra check to bypass pointer event binding in SAP BCW.
  } else if ('onpointerenter' in window && navigator.pointerEnabled !== false) {
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      var parameters = normalizeParameters(handlerIn, handlerOut, options),
          namespace = parameters.namespace;
      handlerIn = parameters.handlerIn;
      // Missing "handlerIn" parameter means, that existing event handlers
      // should be unregistered.
      if (!handlerIn) {
        return this.off('pointerenter' + namespace +
                        ' pointerleave' + namespace);
      }
      handlerOut = parameters.handlerOut;
      return this.on('pointerenter' + namespace, function (event) {
                   if (event.originalEvent.pointerType === 'mouse') {
                     handlerIn.call(this, event);
                   }
                 })
                 .on('pointerleave' + namespace, function (event) {
                   if (event.originalEvent.pointerType === 'mouse') {
                     handlerOut.call(this, event);
                   }
                 });
    };

  // If the browser has support for touch events, the mouseenter and
  // mouseleave events can be emulated on tapping the display.
  } else if ('ontouchstart' in window) {
    eventTimeProperty = 'mousehover-start';
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      var parameters = normalizeParameters(handlerIn, handlerOut, options),
          namespace = parameters.namespace;
      handlerIn = parameters.handlerIn;
      // Missing "handlerIn" parameter means, that existing event handlers
      // should be unregistered.
      if (!handlerIn) {
        return this.off('touchend' + namespace +
                        ' mouseenter' + namespace +
                        ' mouseleave' + namespace);
      }
      handlerOut = parameters.handlerOut;
      // Store the time of the event, which would shortly preceed the
      // mouseenter event on touch-capable devices, if it were an emulated
      // mouse event caused by tapping the display.
      return this.on('touchend' + namespace, function () {
                   $(this).data(eventTimeProperty, new Date().getTime());
                 })
                 // If the first event handler remembered its time and the
                 // mouseenter event comes too soon, it was triggered by
                 // tapping and should be ignored.
                 .on('mouseenter' + namespace, function (event) {
                   var $this = $(this),
                       once = $this.data(eventTimeProperty),
                       now;
                   if (once) {
                     now = new Date().getTime();
                     // The time interval between the touchend event, which
                     // can identify, that the mouseenter event was emulated,
                     // and the mouseenter event itself can vary.
                     if (now - once < 50) {
                       return $(this).removeData(eventTimeProperty);
                     }
                   }
                   // Enable handling of the complementary mouseleave event.
                   $(this).data(eventTimeProperty, true);
                   handlerIn.call(this, event);
                 })
                 // The mouseleave event should call the hover event handler
                 // only if it was triggered by the mouseenter event earlier.
                 .on('mouseleave' + namespace, function (event) {
                   var $this = $(this);
                   if ($this.data(eventTimeProperty)) {
                     $this.removeData(eventTimeProperty);
                     handlerOut.call(this, event);
                   }
                 });
    };

  // If the browser has no support for touch events, we can assume, that
  // the only device, which can trigger the mouseenter eveny, is the mouse.
  } else {
    // Default to jQuery.hover behaviour on devices without touch capability.
    $.fn.mousehover = function (handlerIn, handlerOut, options) {
      var parameters = normalizeParameters(handlerIn, handlerOut, options),
          namespace = parameters.namespace;
      handlerIn = parameters.handlerIn;
      // Missing "handlerIn" parameter means, that existing event handlers
      // should be unregistered.
      if (!handlerIn) {
        return this.off('mouseenter' + namespace +
                        ' mouseleave' + namespace);
      }
      handlerOut = parameters.handlerOut;
      return this.on('mouseenter' + namespace, handlerIn)
                 .on('mouseleave' + namespace, handlerOut);
    };
  }

  // Restores the earlier mousehover plugin, which had been registered in
  // jQuery before this one. This plugin is returned for explicit usage.
  $.fn.mousehover.noConflict = function () {
    $.fn.mousehover = oldMousehover;
    return this;
  };

  // [OT] Return the .fn function
  return $.fn.mousehover;
});
