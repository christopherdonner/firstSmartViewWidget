/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore',
    'csui/lib/marionette',
    'csui/utils/base',
    'csui/controls/list/list.view',
    'csui/controls/listitem/listitemstandard.view',
    'csui/controls/progressblocker/blocker',
    'webreports/widgets/nodeslistreport/impl/expanding.behavior',
    'csui/behaviors/default.action/default.action.behavior',
    'webreports/utils/contexts/factories/nodestablereport',
    'webreports/controls/nodestablereport/nodestablereport.view',
    'csui/controls/node-type.icon/node-type.icon.view',
    'webreports/mixins/webreports.view.mixin',
    'i18n!webreports/widgets/nodeslistreport/impl/nls/lang',
    'css!webreports/style/webreports.css'
], function (_, Marionette, base, ListView, StandardListItem, BlockingView,
             ServerExpandingBehavior, DefaultActionBehavior, NodesTableReportChildrenCollectionFactory,
             NodesTableReportView, NodeTypeIconView, WebReportsViewMixin, lang) {

    var NodesListReportView = ListView.extend({

        constructor: function NodesListReportView(options) {
            options || (options = {});
            options.data || (options.data = {});
            options.data.titleBarIcon = ( _.has(options.data, 'titleBarIcon') && options.data.titleBarIcon !== "") ? 'title-icon '+ options.data.titleBarIcon : 'title-icon title-webreports';
            options.data.header = false;

            BlockingView.imbue({
                parent: this
            });

            ListView.prototype.constructor.apply(this, arguments);
        },

        events: function(){
            return _.extend({},ListView.prototype.events,{
                'click @ui.moreLink': 'onMoreLinkClick',
                'keyup @ui.searchBox': 'onSearchKeyUp',
                'keydown @ui.searchBox': 'onSearchKeyDown'
            });
        },

        ui: function(){
            return _.extend({},ListView.prototype.ui,{
                'moreLink': '.cs-more.tile-expand'
            });
        },

        initialize: function() {

            var options = this.options,
                modelOptions;

            modelOptions = this.setCommonModelOptions(options);

            this.collection = this.options.collection ||
                this.options.context.getCollection(NodesTableReportChildrenCollectionFactory, { attributes: modelOptions });

            this.listenTo(this.collection, 'reset', this.enableMoreLink);

            this.listenTo(this, 'change:filterValue', this.synchronizeCollections);
            this.listenTo(this.collection, 'request', this.waitingOnServer);
            this.listenTo(this.collection, 'sync error', this.responseFromServer);
        },

        enableMoreLink: function () {
            var enable = !this.isEmpty();
            this.ui.moreLink[enable ? 'removeClass' : 'addClass']('hidden');
        },

        isEmpty: function () {
            return this.collection.fetched && this.collection.models.length === 0 && !this.blocking;
        },

        waitingOnServer: function() {
            this.blocking = true;
            this.blockActions();
        },

        responseFromServer: function() {
            this.blocking = false;
            this.unblockActions();
            this.render();
        },

        emptyViewOptions: {
            text: lang.emptyListText
        },

        childEvents: {
            'click:item': 'onClickItem',
            'render': 'onRenderItem',
            'before:destroy': 'onBeforeDestroyItem'
        },

        templateHelpers: function () {
            return {
                title: base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle),
                icon: this.options.data.titleBarIcon,
                searchPlaceholder: base.getClosestLocalizedString(this.options.data.searchPlaceholder, lang.searchPlaceholder)
            };
        },

        childView: StandardListItem,

        childViewOptions: {
            templateHelpers: function () {
                return {
                    name: this.model.get('name'),
                    enableIcon: true
                };
            }
        },

        blocking: false,

        emptySearch: false,

        behaviors: {

            ExpandableList: {
                behaviorClass: ServerExpandingBehavior,
                expandedView: NodesTableReportView,
                expandedViewOptions: function () {
                    return this.options;
                },

                orderBy: 'name asc',
                titleBarIcon: function () {
                    return this.options.data.titleBarIcon;
                },
                dialogTitle: function () {
                    return base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle);
                },
                dialogTitleIconRight: "icon-tileCollapse",
                dialogClassName: 'webreports-nodeslistreport-table'
            },

            DefaultAction: {
                behaviorClass: DefaultActionBehavior
            }

        },
         filterNodeList: function(filterValue) {
             this.options.filterValue = filterValue;
             this.trigger('change:filterValue');
             this.ui.searchInput.focus();
         },

         onSearchKeyUp: function(event) {
             clearTimeout(this.keyTimer);
             if (event.which === 27) {
                this.searchFieldClearerClicked();
             }
             else {
                this.keyTimer = setTimeout(_.bind(this.filterNodeList,this,this.ui.searchInput.val()),600);
             }
         },

         onSearchKeyDown: function(event) {
             if (event.which === 13) {
                 event.preventDefault();
                 return false;
             }
             clearTimeout(this.keyTimer);
         },

         searchFieldClearerClicked: function () {
             this.ui.searchInput.val('');
             this.emptySearch = true;
             this.filterNodeList('');
         },

        filterChanged: function (event) {
            return false;
        },
        _onCollapseExpandedView: function(){
            this.view.triggerMethod('collapse');
        },

        onBeforeDestroyItem: function (childView) {
            if (childView._nodeIconView) {
                childView._nodeIconView.destroy();
            }
        },

        onClickItem: function (target) {
            this.triggerMethod('execute:defaultAction', target.model);
        },

        onClickHeader: function( target) {
            if ( !this.isEmpty() ){
                this.triggerMethod('expand');
            }
        },

        onMoreLinkClick: function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.triggerMethod('expand');
        },

        onRender: function () {
            var listViewOnRender = ListView.prototype.onRender;

            if ( listViewOnRender ) {
                listViewOnRender.apply(this, arguments);
            }

            if (_.has(this.collection.filters, "name") || this.emptySearch) {
                this.ui.searchInput.show();
                this.ui.clearer.toggle(true);

                this.ui.searchInput.val(this.collection.filters.name);
                this.ui.searchInput.focus();
                this.ui.headerTitle.toggle();
                this.emptySearch = false;

            }

            this.collection.setExpand('properties', ['parent_id', 'reserved_user_id']);
        },

        onRenderItem: function (childView) {
            childView._nodeIconView = new NodeTypeIconView({
                el: childView.$('.csui-type-icon').get(0),
                node: childView.model
            });
            childView._nodeIconView.render();
        },

        synchronizeCollections: function () {
            var keyword = this.options.filterValue;
            if (!keyword.length && _.has(this.collection.filters, "name")) {
                this.collection.clearFilter();
                this.emptySearch = true;
            }
            if (keyword.length >= 3) {
                this.collection.setFilter({name: keyword});
                this.collection.reset();
            } else {
                this.collection.reset(this.collection.models);
            }
        }


    });
    WebReportsViewMixin.mixin(NodesListReportView.prototype);

    return NodesListReportView;

});
