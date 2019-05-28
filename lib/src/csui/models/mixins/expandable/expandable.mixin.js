/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  "use strict";

  var ExpandableMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeExpandable: function (options) {
          var expand = options && options.expand;
          if (typeof expand === 'string') {
            expand = expand.split(',');
          }
          this.expand = expand || [];
          return this;
        },

        setExpand: function (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            if (!_.contains(this.expand, name)) {
              this.expand.push(name);
            }
          }, this);
        },

        resetExpand: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(",");
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.expand, name);
              if (index >= 0) {
                this.expand.splice(index, 1);
              }
            }, this);
          } else {
            this.expand.splice(0, this.expand.length);
          }
        },

        getExpandableResourcesUrlQuery: function () {
          return {expand: this.expand};
        }

      });
    }

  };

  return ExpandableMixin;

});
