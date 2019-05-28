/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
      'esoc/widgets/userwidget/chat/skype/lib/GeneralHelper'],
    function (module, _require, $, _, Backbone, GeneralHelper) {

      var _generalHelper = GeneralHelper.attributes;
      var Mime = new Backbone.Model({
        processHeader: function (header) {
          var data = $.trim(header).split("\n");

          for (var line in data) {
            if (data[line].indexOf("boundary") !== -1) {
              var temp = data[line].split(";");

              for (var item in temp) {
                if (temp[item].indexOf("boundary") !== -1) {
                  var result = $.trim(temp[item].split("=")[1]);

                  if (result[0] === '"' && result[result.length - 1] === '"') {
                    return result.slice(1, -1);
                  }

                  return result;
                }
              }
            }
          }
        },
        processBody: function (boundary, body) {
          var data     = body.split("--" + boundary),
              parsed   = [],
              messages = [];

          for (var part in data) {
            if ($.trim(data[part]) !== "" && $.trim(data[part]) !== "--") {
              var partData    = $.trim(data[part]).split("\r\n"),
                  message     = {
                    status: null,
                    statusText: null,
                    responseText: "",
                    header: "",
                    messageId: null
                  },
                  contentType = null;

              for (var item in partData) {
                if (contentType === null && partData[item].indexOf("Content-Type") !== -1) {
                  contentType = this.determineContentType(partData[item]);

                  if (contentType !== null && message.header === "") {
                    message.header = this.readHeader(partData, item);
                  }
                } else if (partData[item].indexOf("HTTP/1.1") !== -1) {
                  message.status = partData[item].split(" ")[1];
                  message.header = this.readHeader(partData, ++item);
                } else if (contentType !== null && $.trim(partData[item]) !== "") {
                  message.responseText = partData[item];
                  if (contentType === "json") {
                    message.results = JSON.parse($.trim(partData[item]));
                  }
                }
              }

              messages.push(message);
            }
          }

          return messages;
        },
        determineContentType: function (data) {
          var contentType  = null,
              expectedType = "json";

          if (data.indexOf("http; msgtype=response") === -1) {
            var index = data.indexOf(expectedType);

            if (index !== -1) {
              contentType = expectedType;
            } else {
              contentType = $.trim(data).split('/')[1];
            }
          }

          return contentType;
        },
        readHeader: function (parts, index) {
          var header = "";
          while ($.trim(parts[index]) !== "" && index < parts.length) {
            header = header.concat(parts[index], "\n");
            index++;
          }

          return header;
        },
        processMessage: function (data) {
          var boundary = this.processHeader(data.headers),
              result   = this.processBody(boundary, data.responseText);

          return result;
        }

      });
      return Mime;

    });