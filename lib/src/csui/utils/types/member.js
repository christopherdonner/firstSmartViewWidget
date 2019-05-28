/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
   'i18n!csui/utils/impl/nls/lang'
], function (_, Backbone, lang) {
  'use strict';

  function formatMemberName(member) {
    if (!member) {
      return '';
    }
    if (_.isNumber(member) || _.isString(member)) {
      return member.toString();
    }
    if (member instanceof Backbone.Model) {
      member = member.attributes;
    }
    if (member.display_name) {
      return member.display_name;
    }
    if (member.name_formatted) {
      return member.name_formatted;
    }
    var firstName  = member.first_name,
        lastName   = member.last_name,
        middleName = member.middle_name,
        name;
    if (firstName) {
      if (middleName) {
        name = _.str.sformat(lang.ColumnMemberName3, lastName, firstName, middleName);
      } else if (lastName) {
        name = _.str.sformat(lang.ColumnMemberName2, lastName, firstName);
      } else {
        name = firstName;
      }
    } else {
      name = lastName;
    }
    return name || member.name_formatted || member.name
           || member.id && member.id.toString() || '';
  }

  return {
    formatMemberName: formatMemberName
  };
});
