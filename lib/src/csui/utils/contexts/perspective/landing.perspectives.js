/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/contexts/perspective/landing.perspectives'
], function (_, Backbone, RulesMatchingMixin, extraPerspectives) {

  var UserPerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      important: false,
      module: null
    },

    constructor: function UserPerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(UserPerspectiveModel.prototype);

  var UserPerspectiveCollection = Backbone.Collection.extend({

    model: UserPerspectiveModel,
    comparator: "sequence",

    constructor: function UserPerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByUser: function (user) {
      return this.find(function (item) {
        return item.matchRules(user, item.attributes);
      });
    }

  });

  var userPerspectives = new UserPerspectiveCollection([
    {
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/user.json',
      sequence: 10000
    }
  ]);

  if (extraPerspectives) {
    userPerspectives.add(_.flatten(extraPerspectives, true));
  }

  return userPerspectives;

});
