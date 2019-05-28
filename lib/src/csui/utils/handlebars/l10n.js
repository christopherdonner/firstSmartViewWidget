/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/handlebars', 'csui/utils/base'
], function (Handlebars, base) {

  Handlebars.registerHelper('csui-l10n', function (value) {
    return base.getClosestLocalizedString(value);
  });

  return Handlebars.helpers['csui-l10n'];

});
