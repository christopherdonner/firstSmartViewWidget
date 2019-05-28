/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/contexts/context',
  'csui-ext!csui/utils/contexts/page/page.context'
], function (_, Context, contextPlugins) {
  'use strict';

  var PageContext = Context.extend({
    constructor: function PageContext() {
      Context.prototype.constructor.apply(this, arguments);
      var Plugins = _
          .chain(contextPlugins)
          .flatten(true)
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    }
  });

  return PageContext;
});
