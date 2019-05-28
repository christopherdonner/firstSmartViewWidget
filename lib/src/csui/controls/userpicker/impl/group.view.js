/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/url',
  'i18n!csui/controls/userpicker/nls/userpicker.lang',
  'hbs!csui/controls/userpicker/impl/group',
  'css!csui/controls/userpicker/impl/userpicker'
], function (_, $, Marionette, Base, Url, lang, template) {

  var GroupView = Marionette.ItemView.extend({

    template: template,

    tagName: 'div',

    className: 'csui-userpicker-item',

    templateHelpers: function () {
      return {
        'name': Base.formatMemberName(this.model),
        'group-title': lang.groupViewGroupTitle,
        'leader': this.model.get('leader_id') && Base.formatMemberName(this.model.get('leader_id')),
        'leader-title': lang.groupViewLeaderTitle,
        'disabled': this.model.get('disabled'),
        'disabled-message': this.options.disabledMessage,
        'lightWeight': !!this.options.lightWeight
      };
    },

    constructor: function UserView(options) {
      options || (options = {});
      options.disabledMessage || (options.disabledMessage = '');
      Marionette.ItemView.prototype.constructor.call(this, options);
    }

  });

  return GroupView;
});
