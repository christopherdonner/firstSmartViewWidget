/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  "csui/utils/log", "csui/utils/base",
  "csui/models/member/member.model",
  "csui/dialogs/members.picker/impl/select.views/select.views",
  "csui/dialogs/members.picker/impl/selectedMembers/selectedMemberList",
  "csui/controls/breadcrumbs/breadcrumbs.view",
  "csui/models/memberancestorcollection",
  "hbs!csui/dialogs/members.picker/impl/members.picker",
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin'
], function (module, $, _, Marionette, log, base, MemberModel, SelectViews, selectedMemberList,
    BreadcrumbsView, MemberAncestorCollection, template, LayoutViewEventsPropagationMixin) {

  var MemberPickerView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      breadcrumbRegion: '#csui-mp-breadcrumbs > .breadcrumb-inner',
      searchHeaderRegion: '#csui-mp-breadcrumbs > div.searchheader-inner',
      selectViewRegion: '#csui-mp-selectviews',
      selectedMemberListRegion: '#csui-mp-selected-member-list-container'
    },

    ui: {
      breadcrumb: '#csui-mp-breadcrumbs',
      breadcrumbContent: '.breadcrumb-inner',
      selectViews: '#csui-mp-selectviews'
    },

    constructor: function MemberPickerView(options) {
      options || (options = {});

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.propagateEventsToRegions();
      this.rootGroup = options.container;
      this.ancestorCollection = new MemberAncestorCollection(this.rootGroup.clone(), options,
          options.context);
      options.rootGroup = this.rootGroup;
      options.ancestorCollection = this.ancestorCollection;

      this.setBreadcrumbs(options);
      this.setViews(options);

      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).bind("resize.app", this.onWinRefresh);
     },

    windowRefresh: function () {
      var breadCrumb       = $('.cs-breadcrumb'),
          breadCrumbHeight = breadCrumb.is(':visible') ? breadCrumb.height() : 0,
          viewHeight       = this.$el.height() - breadCrumbHeight;
      if (!!window.chrome && viewHeight > 0) {
      }
      this.selectViews.triggerMethod('dom:refresh', this.selectViews);
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this.onWinRefresh);
    },

    onRender: function () {

      if (this.options.searchView) {
        this.searchHeaderRegion.show(this.searchHeaderView);
      }
      if (this.breadcrumbs) {
        this.breadcrumbRegion.show(this.breadcrumbs);
      }
      this.selectViews.options.navigateFromHistory = this.options.navigateFromHistory;
      this.selectViewRegion.show(this.selectViews);
     this.selectedMemberListRegion.show(this.selectedMemberList);
    },

    onDomRefresh: function () {
      this.windowRefresh();
    },

    onShow: function () {
      _.each(this.regionManager.regions, function (region) {
        if (region.currentView) {
          region.currentView.trigger('show');
        }
      });
      if (this.options.adduserorgroup && this.ancestorCollection.length === 1) {
        this.ui.breadcrumb.hide();
        this.ui.selectViews.addClass('csui-full-height');
      }
    },

    setViews: function (options) {
      var views = this.selectViews = new SelectViews(options);
      this.selectedMemberList = new selectedMemberList();
      this.listenTo(views, 'changed', this.updateBreadcrumbs);
      this.listenTo(views, 'change:location', _.bind(this.trigger, this, 'change:location'));
      this.listenTo(views, 'change:complete', _.bind(this.trigger, this, 'change:complete'));
      this.listenTo(views, 'close', this.close);
      this.listenTo(this.selectedMemberList, 'add:child remove:child', this.onMemberListChange);
    },

    onMemberListChange: function () {
      this.adjustSelectViews();
      this.trigger("update:button", this.selectedMemberList.collection);
    },

    adjustSelectViews: function () {
      var len            = this.selectedMemberList.collection.length < 3 ?
                           this.selectedMemberList.collection.length : 3,
          adjust = len ? len * this.selectedMemberList.$el.find('.csui-userpicker-item').height() :
                   0,
          adjustedHeight = adjust ? "calc(" + 100 + '% - ' + adjust + "px)" : "100%";
      this.selectViews.$el.find('.list-content').css({
        'height': adjustedHeight
      });
    },

    getSelection: function () {
      return this.selectViews.getSelection();
    },

    getNumberOfSelectItems: function () {
      return this.selectViews.getNumberOfSelectItems();
    },

    close: function () {
      this.destroy();
      this.trigger('close');
    },

    updateBreadcrumbs: function () {
      if (this.options.adduserorgroup && this.ancestorCollection.length === 1) {
        this.ui.breadcrumb.hide();
        this.ui.selectViews.addClass('csui-full-height');
      }
      else {
        this.ui.breadcrumb.show();
        this.ui.breadcrumbContent.show();
        this.ui.selectViews.removeClass('csui-full-height');

      }
      this.windowRefresh();
      this.adjustSelectViews();
      return true;
    },

    setBreadcrumbs: function (options) {
      this.breadcrumbs = new BreadcrumbsView({
        node: options.rootGroup, // breadcrumb view works with node
        collection: options.ancestorCollection
      });

      this.setBreadcrumbEvents();

      return true;
    },

    setBreadcrumbEvents: function () {
      this.listenTo(this.breadcrumbs, 'before:defaultAction', function (args) {
        var selectViews = this.selectViews,
            self        = this;
        selectViews.newLeftView(args.node).done(function (view) { // breadcrumb works with node!
          selectViews.setParentGroupAsTarget(view.container);
          self.trigger('change:complete', view.container);
        });
      });
    }

  });

  _.extend(MemberPickerView.prototype, LayoutViewEventsPropagationMixin);

  return MemberPickerView;

});
