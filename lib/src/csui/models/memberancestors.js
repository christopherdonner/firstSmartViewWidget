/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/url', 'csui/utils/log', 'csui/models/ancestor', 'csui/models/ancestors',
  'csui/models/mixins/member.resource/member.resource.mixin'
], function (module, _, $, Backbone, Url, log, AncestorModel, AncestorsCollection, MemberResourceMixin) {
  'use strict';

  var MemberAncestorsCollection = AncestorsCollection.extend({

    constructor: function MemberAncestorsCollection(models, options) {
      AncestorsCollection.prototype.constructor.apply(this, arguments);

      this.makeMemberResource(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    isFetchable: function () {
      return this.memberId.isFetchable();
    },

    url: function () {
      return Url.combine(this.member.url(), "ancestors");
    },

    parse: function (response, options) {

      response = response.ancestors;

      if (this.options.stop) {
        var id = this.options.stop.get ? this.options.stop.get("id") :
                 this.options.stop.id;
        var skip;
        response = _
            .filter(response.reverse(), function (ancestor) {
              var result = !skip;
              if (ancestor.id === id) {
                skip = true;
              }
              return result;
            })
            .reverse();
      }

      if (this.options.limit && response.length > this.options.limit) {
        response.splice(0, response.length - this.options.limit);
        response.unshift({
          type: AncestorModel.Hidden
        });
      }
      _.each(response, function (member) {
        member.container = true;
      });

      return response;
    }

  });

  MemberResourceMixin.mixin(MemberAncestorsCollection.prototype);

  return MemberAncestorsCollection;

});
