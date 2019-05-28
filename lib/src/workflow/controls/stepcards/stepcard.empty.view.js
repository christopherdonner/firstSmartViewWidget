/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!workflow/controls/stepcards/nls/lang',
  'hbs!workflow/controls/stepcards/impl/stepcard.empty',
  'css!workflow/controls/stepcards/impl/stepcard'
], function (_, Marionette, lang, StepCardEmptyTemplate) {
  'use strict';
  var EmptyStepCardView = Marionette.ItemView.extend({
    template: StepCardEmptyTemplate,
    className: 'wfstatus-stepcard',
    templateHelpers: function () {
      return {
        messages: {
          NoStepAvailable: lang.NoStepAvailable
        }
      };
    },
    constructor: function EmptyStepCardView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return EmptyStepCardView;
});