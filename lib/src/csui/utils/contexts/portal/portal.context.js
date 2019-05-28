/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/contexts/impl/node.opening.context',
  'csui-ext!csui/utils/contexts/portal/portal.context'
], function (_, NodeOpeningContext, contextPlugins) {
  'use strict';

  var PortalContext = NodeOpeningContext.extend({
    constructor: function PortalContext(options) {
      NodeOpeningContext.prototype.constructor.apply(this, arguments);
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
      return NodeOpeningContext.prototype._isFetchable.apply(this, arguments) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    onNextNodeChanged: function () {
      this.openNewNodePage();
    },

    openNewNodePage: function () {
      this.openNodePage(this.nextNode);
      this.nextNode.clear({silent: true});
    }
  });

  return PortalContext;
});
