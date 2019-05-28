/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior'
], function (require,
    _,
    Marionette,
    ViewEventsPropagationMixin,
    TabableRegionBehavior) {

  var CommentButtonView = Marionette.View.extend({

    className: 'csui-comment-button',

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function CommentButtonView(options) {
      Marionette.View.call(this, options);
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      var self = this;
      require(['esoc/widgets/utils/commentdialog/commentdialog.view'],
          function (CommentDialogView) {
            var contentRegion = new Marionette.Region({
              el: self.el
            });

            var globalConfig = (typeof window.require !== "undefined") ?
                               window.require.s.contexts._.config :
                               window.csui.require.s.contexts._.config;
            globalConfig.roId = self.model.get('id');

            var commentDialogView = new CommentDialogView({
              connector: self.model.connector,
              nodeid: self.model.get('id'),
              CSID: self.model.get('id'),
              model: self.model,
              context: self.options.context
            });

            commentDialogView.listenTo(commentDialogView, 'before:render', function () {
              self.triggerMethod('before:render', self);
            });
            commentDialogView.listenTo(commentDialogView, 'render', function () {
              self.triggerMethod('render', self);
            });

            self.propagateEventsToViews(commentDialogView);
            contentRegion.show(commentDialogView);
          }, function () {}
      );
      return this;
    }

  });

  _.extend(CommentButtonView.prototype, ViewEventsPropagationMixin);

  return CommentButtonView;
});
