/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/toolbar/impl/toolbar.state',
  'i18n!csui/controls/toolbar/impl/nls/localized.strings'
], function (_, Marionette, template, lang) {
  'use strict';

  var ToolbarStateView = Marionette.ItemView.extend({

    tagName: 'li',

    className: 'csui-toolbar-state',

    template: template,

    constructor: function ToolbarStateView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', function () {
        if (!this.isDestroyed) {
          this.render();
        }
      });
      this.statusMessages = {
        loading: lang.loadingActionsMessage,
        failed: lang.failedActionsMessage
      };
    },

    serializeData: function () {
      var message = this.model.get('showMessage') ? // empty, loading, failed
                    this.statusMessages[this.model.get('state')] : undefined;
      return _.extend(this.model.toJSON(), {
        message: message
      });
    }

  });

  return ToolbarStateView;

});
