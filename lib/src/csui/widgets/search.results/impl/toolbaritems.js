/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "module",
  'csui-ext!csui/widgets/search.results/impl/toolbaritems'
], function (_, module, extraToolItems) {

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
    });
  }

  return extraToolItems;

});
