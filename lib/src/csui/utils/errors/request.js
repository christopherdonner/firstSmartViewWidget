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
  ResponseError.prototype.name = 'ResponseError';
  function RequestError(request) {
    Error.prototype.constructor.call(this);
    var responseJSON = request.responseJSON || {},
        settings = request.settings,
        message;
    this.statusCode = request.status;
    this.statusText = request.statusText;
    this.message = responseJSON.error || request.responseText;
    this.details = responseJSON.errorDetail;
    if (settings) {
      this.method = settings.type;
      this.url = settings.url;
    }
  }

  RequestError.prototype = Object.create(Error.prototype);
  RequestError.constructor = RequestError;
  RequestError.prototype.name = 'ServerError';

  return RequestError;

});
