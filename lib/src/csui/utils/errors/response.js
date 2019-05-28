/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(function () {
  'use strict';
  function ResponseError(response) {
    Error.prototype.constructor.call(this);
    this.message = response.error;
    this.details = response.errorDetail;
  }

  ResponseError.prototype = Object.create(Error.prototype);
  ResponseError.prototype.constructor = ResponseError;
  ResponseError.prototype.name = 'ServerError';

  return ResponseError;

});
