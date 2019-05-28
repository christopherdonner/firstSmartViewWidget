/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/integration/folderbrowser/impl/folderbrowser.view'
], function (_, Backbone, Marionette, FolderView) {
  'use strict';

  function FolderBrowserWidget(options) {
    this.options = options || (options = {});
    this.folderView = new FolderView(options);

    this.listenTo(this.folderView, 'containerOpened', function (args) {
      this.trigger('containerOpened', {
        sender: this,
        node: args.node.toJSON()
      });
    });

    this.listenTo(this.folderView, 'executingDefaultAction', function (args) {
      var sentArgs = {
        sender: this,
        node: args.node.toJSON()
      };
      this.trigger('executingDefaultAction', sentArgs);
      args.cancel = sentArgs.cancel;
    });

    this.listenTo(this.folderView, 'tableBodyRendered', function (args) {
      this.trigger('tableBodyRendered', {
        sender: this,
        target: args.target
      });
    });

    var selection = this.folderView.nodesTable.getSelectedNodes(),
        previousSelection = selection.clone();
    this.listenTo(selection, 'reset', function () {
      var eventName, difference;
      if (selection.length > previousSelection.length) {
        eventName = 'childSelected';
        difference = selection.reject(function (node) {
          return previousSelection.findWhere({id: node.get('id')});
        });
      } else {
        eventName = 'childUnselected';
        difference = previousSelection.reject(function (node) {
          return selection.findWhere({id: node.get('id')});
        });
      }
      if (difference.length) {
        this.trigger(eventName, {
          sender: this,
          nodes: _.invoke(difference, 'toJSON')
        });
      }
      previousSelection = selection.clone();
    });
  }

  var originalListenTo = Backbone.Events.listenTo;

  _.extend(FolderBrowserWidget.prototype, Backbone.Events, {

    constructor: FolderBrowserWidget,

    show: display,

    display: display,

    destroy: destroy,

    close: destroy,

    enterContainer: function (startNode, breadCrumbNode) {
      if (breadCrumbNode && breadCrumbNode.stop) {
        this.folderView.updateBreadcrumb(breadCrumbNode.stop);
      }
      this.folderView.enterContainer(startNode);
      return this;
    },

    getContainer: function () {
      return this.folderView.container.toJSON();
    },

    getSelectedChildren: function () {
      return this.folderView.nodesTable.selectedNodes.toJSON();
    },
    listenTo: function (other, event, callback) {
      return typeof other === 'string' ?
             originalListenTo.call(this, this, other, event) :
             originalListenTo.call(this, other, event, callback);
    }

  });

  function display(options) {
    var contextPromise = this.folderView.contextPromise;
    var self = this;
    options || (options = {});
    _.extend(options, this.options);
    this.region = new Marionette.Region({el: options.placeholder});
    if (contextPromise) {
      contextPromise.done(function () {
        if (self.region) {
          self.region.show(self.folderView);
        }
      });
    } else {
      self.region.show(self.folderView);
    }
    return this;
  }

  function destroy() {
    if (this.region) {
      this.folderView.destroy();
      this.region.destroy();
      this.region = null;
    }
    return this;
  }

  FolderBrowserWidget.version = '1.0';

  return FolderBrowserWidget;

});

