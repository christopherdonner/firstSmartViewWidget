/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'], function (_) {
  'use strict';

  var CommandableV1Mixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeCommandable: function (options) {
          var commands = options && options.commands;
          if (typeof commands === 'string') {
            commands = commands.split(',');
          }
          this.includeCommands = commands || [];
          return this;
        },

        setCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            if (!_.contains(this.includeCommands, name)) {
              this.includeCommands.push(name);
            }
          }, this);
        },

        resetCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(",");
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.includeCommands, name);
              if (index >= 0) {
                this.includeCommands.splice(index, 1);
              }
            }, this);
          } else {
            this.includeCommands.splice(0, this.includeCommands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          return this.includeCommands.length && {commands: this.includeCommands};
        }

      });
    }

  };

  return CommandableV1Mixin;

});
