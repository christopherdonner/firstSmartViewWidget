/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette'
], function (_, $, Backbone, Marionette) {
  'use strict';

  var MetadataNavigationListBehavior = Marionette.Behavior.extend({

    constructor: function MetadataNavigationListBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      _.extend(view, {

        onBeforeShow: function () {
          this._showChildViews();
        },
        onShow: function () {
          this._showScrollPosition();
        },
        onBeforeDestroy: function () {
          if (this.mdv && this.mdv.internal) {
            this.mdv.destroy();
          }
          if (this.mdn) {
            this.mdn.destroy();
          }
        },

        _showChildViews: function () {
          this.navigationRegion.show(this.mdn);
          this.contentRegion.show(this.mdv);
        },

        _showScrollPosition: function () {
          if (this.initiallySelected instanceof Backbone.Model) {
            var index = this.mdn.collection.findIndex({id: this.initiallySelected.get('id')});
            (index < 0 || index > this.mdn.collection.length - 1) && (index = 0);
            return this.mdn.setSelectedIndex(index);
          } else if (this.initiallySelected && this.initiallySelected.length > 0) {
            var firstSelected = this.initiallySelected.models[0];
            var selIndex = this.mdn.collection.indexOf(firstSelected);
            this.mdn.setSelectedIndex(selIndex);
          } else {
            if (this.mdn.collection.models.length > 0) {
              this.mdn.setSelectedIndex(0);
            }
          }

        }
      });

    } // constructor

  });

  return MetadataNavigationListBehavior;
});
