/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/dialogs/node.picker/start.locations/node.base.factory',
  'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang'
], function (_, NodeBaseFactory, lang) {
  "use strict";

  var CategoryVolumeFactory = NodeBaseFactory.extend({

    constructor: function CategoryVolumeFactory(options) {
      options = _.defaults({
        node: {
          id: 'volume',
          type: 133
        },
        unselectable : true,
        icon: 'csui-icon-category-volume',
        defaultName: lang.labelCategoryVolume
      }, options);
      NodeBaseFactory.prototype.constructor.call(this, options);
    }
  });

  return CategoryVolumeFactory;

});
