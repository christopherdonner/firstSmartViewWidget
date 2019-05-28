/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/commands', 'csui/utils/defaultactionitems',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'csui/models/node/node.model',
  'csui/behaviors/default.action/default.action.behavior',
  'workflow/controls/breadcrumbs/impl/breadcrumb/breadcrumb.view'
], function (_, $, Marionette, Commands, DefaultActionItems, BreadcrumbsView, NodeModel,
    DefaultActionBehavior,
    BreadCrumbItemView) {
  'use strict';
  var BreadcrumbItemView = BreadcrumbsView.extend({
    childView: BreadCrumbItemView,
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    onClickAncestor: function (model, node) {

      var that    = this,
          args    = {node: node},
          newnode = new NodeModel({
            id: node.get('id')
          }, {
            connector: node.connector,
            autoreset: true,
            commands: DefaultActionItems.getAllCommandSignatures(Commands)
          });
      newnode.fetch()
          .done(function () {
            if (that.defaultActionController.hasAction(newnode)) {
              that.triggerMethod('execute:defaultAction', newnode);
            } else {
              that.trigger('before:defaultAction', args);
              if (!args.cancel) {
                that._nextNode.set('id', node.get('id'));
              }

              that.$el.trigger('setCurrentTabFocus');
            }

          });
    }
  });

  return BreadcrumbItemView;

});
