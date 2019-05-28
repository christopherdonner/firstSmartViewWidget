/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", 'csui/lib/backbone', "csui/lib/marionette",
  'csui/dialogs/members.picker/impl/selectedMembers/selectedMember',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'hbs!csui/dialogs/members.picker/impl/selectedMembers/impl/selectedMemberList',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'css!csui/dialogs/members.picker/impl/selectedMembers/impl/selectedMember'
], function ($, _, Backbone, Marionette,
    MemberView, PerfectScrollingBehavior, template, LayoutViewEventsPropagationMixin) {

  var SelectedMemberList = Marionette.CollectionView.extend({
    template: template,
    childView: MemberView,
    childViewContainer: '.csui-selected-member-list',
    childViewOptions: {
      collection: this.collection
    },

    ui: {
      memberListContainer: '.csui-selected-member-list'
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15
      }
    },

    constructor: function SelectedMemberList(options) {
      options || (options = {});
      this.collection = options.collection || new Backbone.Collection();

      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'show:selectItem', _.bind(function (selectedMember) {
        this.collection.add(selectedMember);
      }, this));
    },

    onRender: function () {
      this.listenTo(this, 'remove:selectItem', _.bind(function (selectedMember) {
        this.collection.remove(selectedMember);
      }, this));
    }
  });
  _.extend(SelectedMemberList.prototype, LayoutViewEventsPropagationMixin);
  return SelectedMemberList;
});