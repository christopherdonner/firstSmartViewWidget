/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view',
  'csui/behaviors/default.action/default.action.behavior',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang'
], function (_, $, Marionette, BreadCrumbItemView, DefaultActionBehavior, lang) {
  'use strict';
  var BreadcrumbItemView = BreadCrumbItemView.extend({

    templateHelpers: function () {
      var that      = this,
          subCrumbs = _.map(this.model.get('subcrumbs'), function (crumb) {
            return _.extend(crumb.toJSON(), {url: that.getAncestorUrl(crumb)});
          });
      return {
        inactive: this.model.get('inactive'),
        hasSubCrumbs: subCrumbs.length > 0,
        subcrumbs: subCrumbs,
        url: this.getAncestorUrl(this.model),
        subcrumbTooltip: lang.subcrumbTooltip
      };
    },
    getAncestorUrl: function (crumb) {
      return crumb.get('id') > 0 && crumb.connector &&
             DefaultActionBehavior.getDefaultActionNodeUrl(crumb);
    }

  });
  return BreadcrumbItemView;
});
