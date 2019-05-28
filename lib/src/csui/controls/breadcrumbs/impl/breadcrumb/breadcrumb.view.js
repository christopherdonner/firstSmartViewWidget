/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/node.links/node.links',
  'hbs!csui/controls/breadcrumbs/impl/breadcrumb/impl/breadcrumb',
  'i18n!csui/controls/breadcrumbs/impl/breadcrumb/impl/nls/lang'
], function (_, $, Marionette, nodeLinks, template, lang) {
  'use strict';

  var BreadcrumbItemView = Marionette.ItemView.extend({
    tagName: 'li',

    template: template,

    modelEvents: {
      change: 'render'
    },

    events: {
      'click a.csui-breadcrumb': 'onClickLink'
    },

    onClickLink: function (e) {
      e.preventDefault();
      e.stopPropagation();

      var model = this.model;
      if (model.get('subcrumbs').length > 0) {
        var id = $(e.target).data('id');
        model = this._getModel(id);
      }
      this.triggerMethod('click:ancestor', model);
    },

    className: function () {
      var cname,
          subCrumbs = this.model.get('subcrumbs');

      if (this.options.isLastChild) {
        cname = 'binf-active';
      } else if (subCrumbs && subCrumbs.length > 0) {
        cname = 'binf-dropdown';
      } else {
        cname = 'tail';
      }

      return cname;
    },

    templateHelpers: function () {
      function getAncestorUrl(crumb) {
        return crumb.get('id') > 0 && (crumb.connector || crumb.collection.connector) &&
               nodeLinks.getUrl(crumb) || '#';
      }

      var options   = this.options,
          subCrumbs = _.map(this.model.get('subcrumbs'), function (crumb) {
            return _.extend(crumb.toJSON(), {url: getAncestorUrl(crumb)});
          });
      return {
        inactive: this.model.get('inactive') || options.isLastChild,
        hasSubCrumbs: subCrumbs.length > 0,
        subcrumbs: subCrumbs,
        name: this.model.attributes.displayName || this.model.attributes.name_formatted ||
              this.model.attributes.name,
        url: getAncestorUrl(this.model),
        subcrumbTooltip: lang.subcrumbTooltip
      };
    },

    onRender: function () {
      if (this.options.isLastChild) {
        this.$el.attr("aria-current", "page");
      }
    },

    constructor: function BreadcrumbItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      if (!this.model.has('subcrumbs')) {
        this.model.set('subcrumbs', [], {silent: true});
      }
    },

    _getModel: function (id) {
      var subCrumbs = this.model.get('subcrumbs'),
          model     = null;

      for (var i = 0; i < subCrumbs.length; i++) {
        if (subCrumbs[i].get('id') === id) {
          model = subCrumbs[i];
          break;
        }
      }
      return model;
    }
  });

  return BreadcrumbItemView;
});
