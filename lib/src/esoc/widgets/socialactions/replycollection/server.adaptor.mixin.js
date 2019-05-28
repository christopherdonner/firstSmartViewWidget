/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/underscore",
  "csui/utils/base",
  'csui/utils/url',
  'csui/behaviors/default.action/impl/defaultaction'
], function ($, Backbone, _, Base, Url, DefaultActionController) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },
        url: function () {
          return this.getRepliesUrl;
        },
        fetch: function (options) {
          if (options && options.params) {
            delete options.params["data_id"];
            delete this.defaults.params["data_id"];
          }
          options.params = $.extend(this.defaults.params, options.params);
          var defaultActionController = new DefaultActionController(),
              commands                = {commands: defaultActionController.actionItems.getAllCommandSignatures(
                  defaultActionController.commands)};
          this.getRepliesUrl = Url.appendQuery(this.defaults.csRESTUrl,
              Url.combineQueryString($.param(options.params), commands));
          Backbone.Collection.prototype.fetch.apply(this, arguments);
        },
        parse: function (response, options) {
          if (response.data[0].reply_count !== undefined && response.data[0].id === options.item_id) {
            if (document.getElementById("reply_link_count_" + options.item_id)) {
              document.getElementById("reply_link_count_" + options.item_id).innerHTML = '(' +
                                                                                         response.data[0].reply_count +
                                                                                         ')';
            } else {
              var countDivId = 'reply_link_count_' + response.data[0].id;
              document.getElementById("reply_link_" + options.item_id).innerHTML += '<span id =' +
                                                                                    countDivId +
                                                                                    '>(' +
                                                                                    response.data[0].reply_count +
                                                                                    ' )</span>';
            }
            options.parentCommentModel.attributes.reply_count = response.data[0].reply_count;
          } else if (document.getElementById("reply_link_count_" + options.item_id)) {
            document.getElementById("reply_link_count_" + options.item_id).innerHTML = "";
          }
          for (var res  in  response.data) { // Iterates   over response to remove the actual comment(i.e. parent of replies) from the list
            if (response.data[res].id === response.data[res].extended_info.conversation_id) {
              response.data.splice(res, 1);
            }
          }
          var returnData = JSON.parse(JSON.stringify(response.data));
          return this.parseReplyCollectionResponse(returnData);
        },
        parseReplyCollectionResponse: function (jsonResponse) {
          for (var response in jsonResponse) {
            var currentObj = jsonResponse[response];
            currentObj.text = $.trim(currentObj.text);
            currentObj.created_at_iso8601 = Base.formatFriendlyDateTimeNow(
                currentObj.created_at_iso8601);
            if (currentObj.modified_at_iso8601 !== "" &&
                currentObj.modified_at_iso8601 !== undefined) {
              currentObj.modified_at_iso8601 = Base.formatFriendlyDateTimeNow(
                  currentObj.modified_at_iso8601);
            }
          }
          return jsonResponse;
        },
        fetchSuccess: function (collection, response, options) {
          $(".esoc-social-reply-seemore").hide();
          $(options.selEle).parent().parent().next().find('a:first').focus();
          if (response.data[response.data.length - 1] &&
              response.data[response.data.length - 1].noMoreData === false) {
            $(".esoc-social-reply-seemore:last").show();
          }
          var showMoreLinks = response.data.length > 0 &&
                              response.data[response.data.length - 1].noMoreData;
          for (var colItem in collection.models) {
            collection.models[colItem].attributes.noMoreData = showMoreLinks;
          }
        },
        fetchError: function (collection, response) {
        }

      });
    }

  };

  return ServerAdaptorMixin;
});
