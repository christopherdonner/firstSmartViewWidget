/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/utils/log',
  'csui/models/connectable', 'csui/models/fetchable',
  'csui/models/autofetchable'
], function (module, _, log, ConnectableModel, FetchableModel,
  AutoFetchableModel) {
  'use strict';

  log = log(module.id);

  function ResourceModel(ParentModel) {
    var prototype = {

      makeResource: function (options) {
        return this.makeConnectable(options)
          .makeFetchable(options)
          .makeAutoFetchable(options);
      }

    };
    prototype.Resource = _.clone(prototype);
    
    return _.extend({},
      ConnectableModel(ParentModel),
      FetchableModel(ParentModel),
      AutoFetchableModel(ParentModel),
      prototype);
  }

  return ResourceModel;

});
