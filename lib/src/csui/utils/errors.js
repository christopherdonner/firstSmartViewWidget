/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/errors/request',
  'csui/utils/errors/response'
], function (_, RequestError, ResponseError) {
  'use strict';
  var Errors = {
    getError: function (source) {
      if (!source) {
        throw new Error('No error source');
      }
      if (source instanceof Error) {
        return source;
      }
      if (source.status != null && source.statusText != null) {
        return new RequestError(source);
      }
      if (source.error) {
        return new ResponseError(source);
      }
      if (_.isString(source)) {
        return new Error(source);
      }
      throw new Error('Unrecognized source');
    }

  };

  return Errors;

});
