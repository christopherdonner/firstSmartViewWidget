/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/widgets/metadata/impl/header/leftbar/header.leftbar',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/browsing.states',
  'css!csui/widgets/metadata/impl/header/leftbar/header.leftbar'
], function (_, $, Marionette, template, lang, TabableRegionBehavior,
    BrowsingStateCollectionFactory) {

  var MetadataHeaderLeftBarView = Marionette.ItemView.extend({

    className: 'metadata-header-left-bar',

    template: template,
    templateHelpers: function () {
      var templateValues = {
        back_button: this.options.showBackIcon,
        goBackTooltip: lang.goBackTooltip
      };
      return templateValues;
    },

    behaviors: function () {
      if (this.options.showBackIcon) {
        return {
          TabableRegionBehavior: {
            behaviorClass: TabableRegionBehavior
          }
        };
      } else {
        return {};
      }
    },

    ui: {
      back: '.cs-go-back'
    },

    events: {
      'keydown': 'onKeyInView',
      'click @ui.back': 'onClickClose'
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        $(target).click();
      }
    },

    constructor: function MetadataHeaderLeftBarView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    currentlyFocusedElement: function () {
      if (this.options.showBackIcon) {
        return $(this.ui.back);
      }
      return undefined;
    },

    onClickClose: function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (this.options.context) {
        var browsingStates = this.options.context.getCollection(BrowsingStateCollectionFactory);
        browsingStates && (browsingStates.triggerStateChangeOnStateRemoval = true);
      }

      this.trigger('metadata:close');
    }

  });

  return MetadataHeaderLeftBarView;

});
