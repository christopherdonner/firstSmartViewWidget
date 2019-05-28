/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/lib/backbone', 'csui/lib/numeral', 'csui/lib/d3', // 3rd party libraries
    'csui/controls/progressblocker/blocker', 'csui/controls/list/emptylist.view',
    'webreports/widgets/visual.data.filtered.count/impl/utils/contexts/factories/visual.data.collection.factory',
    'webreports/mixins/webreports.view.mixin',
    'i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/nls/visual.data.lang',
    'hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.content',
    'css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data'
], function (_, $, Marionette, Backbone, numeral, d3, BlockingView, EmptyView, VisualDataCollectionFactory, WebReportsViewMixin, lang, template) {

    var VisualDataContentView = Marionette.ItemView.extend({

        defaults: {
            marginTop: 20,
            marginRight: 20,
            marginBottom: 100,
            marginLeft: 60,
            groupAfter: 10,
            groupAfterMax: 20 //TODO this needs implementing. The idea is that a pie chart has a different sane groupAfter limit to a bar chart
        },

        groupAfterValidValues: [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],

        ui: {
            dataVisContainer: ' .visual-data-container',
            dataVisOverlay: ' .visual-data-overlay'
        },

        visType: '', // Define a unique name in extended objects to identify your visualization type

        constructor: function VisualDataContentView(options) {

            if (options && options.data) {
                var header = _.has(options.data, 'header') && _.isBoolean(options.data.header) ? options.data.header : true,
                    scroll = _.has(options.data, 'scroll') && _.isBoolean(options.data.scroll) ? options.data.scroll : true,
                    filterable = _.has(options.data, 'filterable') && _.isBoolean(options.data.filterable) ? options.data.filterable : false,
                    expandable = _.has(options.data, 'expandable') && _.isBoolean(options.data.expandable) ? options.data.expandable : false,
                    viewValueAsPercentage = _.has(options.data, 'viewValueAsPercentage') && _.isBoolean(options.data.viewValueAsPercentage) ? options.data.viewValueAsPercentage : false,
                    groupAfter = ( (_.has(options.data, 'groupAfter') && this.groupAfterValidValues.indexOf(parseInt(options.data.groupAfter, 10)) !== -1)) ? parseInt(options.data.groupAfter, 10) : this.defaults.groupAfter || 5,
                    modelOptions;

                options.data.header = header;
                options.data.scroll = scroll;
                options.data.visType = this.visType;
                options.data.groupAfter = groupAfter;
                options.data.filterable = filterable;
                options.data.expandable = expandable;
                options.data.viewValueAsPercentage = viewValueAsPercentage;

                modelOptions = this.setCommonModelOptions(options);

                _.extend(modelOptions, {
                    visType: options.data.type,
                    type: options.data.type,
                    activeColumn: options.data.activeColumn,
                    filters: options.data.filters,
                    filterable: filterable,
                    expandable: expandable,
                    viewValueAsPercentage: viewValueAsPercentage,
                    sortBy: options.data.sortBy,
                    sortOrder: options.data.sortOrder,
                    groupAfter: groupAfter
                });

                BlockingView.imbue({
                    parent: this
                });
                options.collection = options.context.getCollection(VisualDataCollectionFactory, {attributes: modelOptions});
                this.listenTo(options.collection, 'sync', this.resetAndRender)
                    .listenTo(options.collection, 'reset', this.resetAndRender)
                    .listenTo(options.collection, 'request', this.blockActions)
                    .listenTo(options.collection, 'sync error', this.unblockActions);

            }
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.onWinRefresh = _.bind(this.resetAndRender, this);
            $(window).on("resize.app", this.onWinRefresh);

            this.model = options.collection.overlayModel;

        },

        template: template,

        className: 'visual-data-wrapper',

        changeChartType: function() {
            console.log('change chart!');
            console.log(this);
            this.visType = this.model.get("vis_type");
            this.resetAndRender();
        },

        onDomRefresh: function () {
            if (this.collection.isFetched()) {
                this.draw();
                this.isChartRendered = true;
            }
        },

        callBackAlreadyHit: false,

        appendVisElements: function () {
        },

        update: function () {
        },

        isChartRendered: false,

        createRootElement: function () {

            var width = (this.width() > 0) ? this.width() : $(this.$el).width() - this.marginLeft() - this.marginRight(),
                height = (this.height() > 0) ? this.height() : $(this.$el).height() - this.marginTop() - this.marginBottom();
            if (this.uniqueID && $('#'+this.uniqueID).length){
                $('#'+this.uniqueID).remove();
            }

            this.uniqueID = _.uniqueId('vis_');
            this.visElement = d3.select(this.ui.dataVisContainer[0]).append(this.rootElementType)
                .attr("id", this.uniqueID)
                .attr("width", width + this.marginLeft() + this.marginRight())
                .attr("height", height + this.marginTop() + this.marginBottom());

        },

        onDestroy: function () {
            $(window).off("resize.app", this.onWinRefresh);
        },

        draw: function () {
            if ( this.collection.isEmpty() ){
                this.renderEmptyView();
            } else {
                this.createRootElement();
                this.appendVisElements();
                this.update();
            }
        },

        renderEmptyView: function () {
            var $tileContentElem = this.ui.dataVisContainer.closest('.tile-content'),
                emptyView = new EmptyView({
					text: lang.emptyChartText
				});
            $tileContentElem.html(emptyView.render().el);
            $tileContentElem.siblings('.visual-data-btn-settings')
                            .addClass('binf-hidden');
            $tileContentElem.siblings('.tile-footer')
                            .children('.tile-expand')
                            .addClass('binf-hidden');
        },

        resetAndRender: function () {
            this.render();
        },

        checkSign: function (x) {
            return Math.sign || function(x) {
                    x = +x; // convert to a number
                    if (x === 0 || isNaN(x)) {
                        return Number(x);
                    }
                    return x > 0 ? 1 : -1;
                };
        },

        shortenText: function(t) {
            t = t || '';
            var maxLength = 20;
            t = (t.length >= maxLength) ? t.substr(0, maxLength) + '\u2026' : t;
            return t;
        },

        formatCount: function(n){
            var formattedValue, formatTemplate,
                countColumnModel = this.collection.columns.findWhere({count_column: true}),
                format = countColumnModel.get("client_format").type;

			switch(format) {
				case "si":
					formattedValue = this.shortenNumber(n);
					break;
				case "bytes":
					formatTemplate = (n < 1024) ? '0b' : '0.0b';
					formattedValue = numeral(n).format( formatTemplate );
					break;
				default:
					formattedValue = n.toString();
			}
			return formattedValue;
		},

        shortenNumber: function(n) {
            n = n.toPrecision(3) || 0;
            n = Number(n); // remove precision decimal places for integers
            var formatNumber = d3.format('.3s'),
                displayNumber = (n < 1000 && n > -1000) ? n.toString() : formatNumber(n);

            return displayNumber;
        },

        width: function () {
            return this.$el.parent().width() - this.marginLeft() - this.marginRight();

        },

        height: function () {
            return this.$el.parent().height() - this.marginTop() - this.marginBottom();

        },

        marginTop: function () {
            return this.defaults.marginTop;
        },

        marginBottom: function () {
            return this.defaults.marginBottom;
        },

        marginLeft: function () {
            return this.defaults.marginLeft;
        },

        marginRight: function () {
            return this.defaults.marginRight;
        },
        rootElementType: "svg"
    });
    WebReportsViewMixin.mixin(VisualDataContentView.prototype);

    return VisualDataContentView;

});
