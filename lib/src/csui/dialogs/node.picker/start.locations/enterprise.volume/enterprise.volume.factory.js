/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/dialogs/node.picker/start.locations/node.base.factory',
  'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang'
], function (_, NodeBaseFactory, lang) {
  "use strict";

  var EnterpriseVolumeFactory = NodeBaseFactory.extend({

    constructor: function EnterpriseVolumeFactory(options) {
      options = _.defaults({
        node: {
          id: 'volume',
          type: 141
        },
        icon: 'enterprise',
        unselectable: false,
        defaultName: lang.labelEnterpriseVolume
      }, options);
      NodeBaseFactory.prototype.constructor.call(this, options);
    }

  });

  return EnterpriseVolumeFactory;

});
