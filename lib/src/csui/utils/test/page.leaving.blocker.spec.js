/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/page.leaving.blocker'
], function ($, _, PageLeavingBlocker) {
  'use strict';

  describe('PageLeavingBlocker', function () {

    it('is disabled by default', function () {
      expect(PageLeavingBlocker.isEnabled()).toBeFalsy();
    });

    it('can be enabled and disabled', function () {
      PageLeavingBlocker.enable('Test');
      expect(PageLeavingBlocker.isEnabled()).toBeTruthy();
      PageLeavingBlocker.disable();
      expect(PageLeavingBlocker.isEnabled()).toBeFalsy();
    });

    it('when enabled, returns the message on page leave', function () {
      PageLeavingBlocker.enable('Test');
      var event = $.extend(
          new $.Event(), {
            type: 'beforeunload',
            isSimulated: true,
            originalEvent: {}
          });
      $.event.dispatch.call(window, event);
      PageLeavingBlocker.disable();
      expect(event.originalEvent.returnValue).toEqual('Test');
    });

    it('can be forced disabled and then never enabled again', function () {
      PageLeavingBlocker.forceDisable();
      expect(PageLeavingBlocker.isEnabled()).toBeFalsy();
      PageLeavingBlocker.enable('Test');
      expect(PageLeavingBlocker.isEnabled()).toBeFalsy();
      PageLeavingBlocker.disable();
      expect(PageLeavingBlocker.isEnabled()).toBeFalsy();
    });

  });

});
