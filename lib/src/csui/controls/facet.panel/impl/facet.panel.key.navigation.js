/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var KeyEventNavigation = {

    currentlyFocusedElement: function () {
      var focusables = this.$('.cs-list-group .csui-facet[tabindex=-1]');
      if (focusables.length) {
        focusables.prop('tabindex', 0);
      }
      return this.getActiveChild();
    },
    onSetNextChildFocus: function(childView){
      this.activeChildIndex = childView.getIndex();
    },
    accActivateTabableRegion: function () {
      $(document).unbind('mousedown', this._onRemoveKeyboardFocus);
      $(document).bind('mousedown', this._onRemoveKeyboardFocus);

    },

    _removeKeyboardFocus: function () {
      this.$el.find('.csui-focus').removeClass('csui-focus');
      $(document).unbind('mousedown', this._onRemoveKeyboardFocus);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      var retVal = false;

      switch (keyCode) {
        case 38:
        case 33:
          var prevChild = this._getPrevActiveChild();
          prevChild.focus();
          break;
        case 40:
        case 34:
          var nextChild = this._getNextActiveChild();
          nextChild.focus();
          break;
        default:
          return true;
      }
      return retVal;
    },

    resetFacetFocus: function(childView){

        childView.$el.focus();
    },



    getActiveChild: function () {
      if (!this.$childViewContainer) {
        return $();
      }
      if (!this.activeChild){
      var childViewContainer = this.$childViewContainer[0];
        if (childViewContainer && childViewContainer.childNodes[0]) {
        this.activeChild = $(childViewContainer.childNodes[0]);
        this.activeChildIndex = 0;
      }


      }
      return this.activeChild;
    },

    _getNextActiveChild: function(){
      var childNodes = this.$childViewContainer[0].childNodes;
      if(childNodes.length - 1 > this.activeChildIndex){
        this.activeChildIndex++;
      }
      else{
        this.activeChildIndex = 0;
      }

      return $(childNodes[this.activeChildIndex]);
    },

    _getPrevActiveChild: function(){
      var childNodes = this.$childViewContainer[0].childNodes;
      if(this.activeChildIndex > 0){
        this.activeChildIndex--;
      }
      else {
        this.activeChildIndex = childNodes.length - 1;
      }

      return $(childNodes[this.activeChildIndex]);
    }


  };

  return KeyEventNavigation;

});
