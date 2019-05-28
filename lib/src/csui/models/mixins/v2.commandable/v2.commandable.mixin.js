/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  "use strict";

  var CommandableV2Mixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeCommandableV2: function (options) {
          var commands = options && options.commands;
          if (typeof commands === 'string') {
            commands = commands.split(',');
          }
          this.commands = commands || [];
          return this;
        },

        setCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            if (!_.contains(this.commands, name)) {
              this.commands.push(name);
            }
          }, this);
        },

        resetCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(",");
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.commands, name);
              if (index >= 0) {
                this.commands.splice(index, 1);
              }
            }, this);
          } else {
            this.commands.splice(0, this.commands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          return this.commands.length && {actions: this.commands};
        }

      });
    }

  };

  return CommandableV2Mixin;

});
