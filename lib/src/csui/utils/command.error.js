/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  "csui/lib/jquery",
  "csui/lib/underscore",
  'csui/lib/backbone',
  "csui/utils/log",
  "csui/utils/base"
], function (module, $, _, Backbone, log, base) {
  function CommandError(arg1, arg2) {

    if (!arg1) {
      throw new Error("No argument passed");
    }

    function applyArg2() {
      if (arg2 && _.isString(arg2)) {
        this.errorDetails = arg2;
      } else {
        if (arg2 instanceof Backbone.Model) {
          this.node = arg2;
        } else {
          if (arg2 && _.isObject(arg2)) {
            if (arg2.errorDetails && _.isString(arg2.errorDetails)) {
              this.errorDetails = arg2.errorDetails;
            }
            if (arg2.node instanceof Backbone.Model) {
              this.node = arg2.node;
            }
            if (arg2.requestError && _.isObject(arg2.requestError)) {
              var requestMessage = new base.RequestErrorMessage(arg2.requestError);
              if (this.message) {
                if (!this.errorDetails) {
                  this.errorDetails = requestMessage.message;
                }
              } else {
                this.message = requestMessage.message;
                if (!this.errorDetails) {
                  this.errorDetails = requestMessage.errorDetails;
                }
              }
            }
          }
        }
      }
    }

    if (arg1 instanceof Error) {
      this.message = arg1.message;
      if (arg1.stack) {
        this.stack = arg1.stack;
      }
    } else {
      if (_.isString(arg1)) {
        this.message = arg1;
      } else {
        var requestMessage = new base.RequestErrorMessage(arg1);
        this.message = requestMessage.message;
        this.errorDetails = requestMessage.errorDetails;
        this.statusCode = requestMessage.statusCode;
      }
    }
    applyArg2.call(this);
    this.name = "CommandError";
  }

  CommandError.prototype = Object.create(Error.prototype);

  return CommandError;

});

