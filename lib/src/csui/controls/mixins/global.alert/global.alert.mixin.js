/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([], function () {
  'use strict';
  var GlobalAlertMixin = {
    prepareForGlobalAlert: function () {
      this.listenTo(this, 'global.alert.inprogress', this.handleAlertInProgress);
      this.listenTo(this, 'global.alert.completed', this.handleAlertComplete);
    },

    handleAlertInProgress: function () {
      if (this.currentlyFocusedElement !== this.disableCurrentFocusElementHandler) {
        this.originalCurrentlyFocusedElement = this.currentlyFocusedElement;
      }
      this.currentlyFocusedElement = this.disableCurrentFocusElementHandler;
    },

    disableCurrentFocusElementHandler: function () {
    },

    handleAlertComplete: function () {
      if (this.originalCurrentlyFocusedElement != null) {
        this.currentlyFocusedElement = this.originalCurrentlyFocusedElement;
        this.originalCurrentlyFocusedElement = undefined;
      }
    }
  };
  return GlobalAlertMixin;
});