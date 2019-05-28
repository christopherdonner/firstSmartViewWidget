/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore",
  "csui/utils/errormessage", "i18n!csui/utils/impl/nls/lang"
], function ($, _, Message, lang) {

  "use strict";

  describe("ErrorWrapper", function () {
    var error,
      statusCode = '500',
      statusText = 'st',
      errMsg = 'errMsg',
      tmsg = 'msg',
      errDetails = 'errDetails',
      tname = 'name';


    describe("RequestErrorToShow", function () {

      it("is correctly initialized ...", function () {

        var error = new Message.RequestErrorMessage({
          statusCode: statusCode,
          statusText: statusText,
          errorMessage: errMsg,
          errorDetails: errDetails
        });

        expect(error.statusCode).toEqual(statusCode);
        expect(error.statusText).toEqual(statusText);
        expect(error.errorMessage).toEqual(errMsg);
        expect(error.errorDetails).toEqual(errDetails);
        expect(true).toBeTruthy();
      });

    });

    describe("Message.Message", function () {

      it("is correctly initialized ...", function () {

        var msg = new Message.Message({
          type: Message.Type.Info,
          message: tmsg,
          name: tname
        });

        expect(msg).toBeDefined();
        expect(msg.getName()).toEqual(tname);
        expect(msg.getType()).toEqual(Message.Type.Info);
        expect(msg.getMessage()).toEqual(tmsg);

        var err = new Error();
        var emsg = new Message.Message(err);
        expect(emsg).toBeDefined();
        expect(emsg.getName()).toEqual(err.name);
        expect(emsg.getMessage()).toEqual(err.message);
        expect(emsg.getType()).toEqual(Message.Type.Error);

      });

    });

    describe("Message.ErrorMessage", function () {

      it("is correctly initialized ...", function () {

        var msg = new Message.ErrorMessage();

        expect(msg).toBeDefined();
        expect(msg.getName()).not.toBeDefined();
        expect(msg.getType()).toEqual(Message.Type.Error);
        expect(msg.getMessage()).toEqual(lang.ErrorUnknown);
      });

    });

    describe("Message.RequestErrorMessage", function () {

      it("works", function () {
        var msg = new Message.RequestErrorMessage();

        expect(msg).toBeDefined();
        var s = msg.toString();
        expect(s.length > 0).toBeTruthy();
        expect(true).toBeTruthy();
      });

    });

  });
});
