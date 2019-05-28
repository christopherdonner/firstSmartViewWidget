/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/d3', // 3rd party libraries
    'csui/dialogs/modal.alert/modal.alert',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/filtered.count.facets',
    'csui/models/facettopics',
    'webreports/utils/url.webreports',
    'webreports/widgets/visual.data.filtered.count/impl/models/visualdata/visual.data.model',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/overlay.model',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.column.collection',
    'csui/models/mixins/connectable/connectable.mixin',
    'i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/nls/visual.data.lang',
    'csui/utils/deepClone/deepClone'
], function (_, Backbone, d3, ModalAlert, FilteredCountFacetCollection, FacetTopicCollection, UrlWebReports, FilteredCountModel, OverlayModel, FilteredCountColumnCollection, ConnectableMixin, lang) {

    var FilteredCountCollection = Backbone.Collection.extend({
        constructor: function FilteredCountCollection(models, options) {
            Backbone.Collection.prototype.constructor.apply(this, arguments);

            if (_.isUndefined(options)){
                options = {};
            }
            if (options && options.id && !this.id) {
                this.id = options.id;
            }

            this.options = options;
            this.makeConnectable(options);
            this.overlayModel = new OverlayModel({
                vis_type: options.type,
                active_column: options.activeColumn,
                sort_by: options.sortBy || 'Count',
                sort_order: options.sortOrder || 'desc',
                view_value_as_percentage: options.viewValueAsPercentage,
                group_after: options.groupAfter,
                fc_filters: options.filters || []
            });

            this.listenTo(this.overlayModel, 'change', this.onOverlayUpdate);
        },

        model: FilteredCountModel,
        url: function () {

            return this.connector.connection.url + '/nodes/' + this.id + '/output';

        },

        parse: function (response) {

            if ( response.data && response.data.length > 0 ){
                this._isEmpty = false;
                this._isFetched = true;

                this.grouped_on_server = response.grouped_on_server || false;
                this.sorted_on_server = response.sorted_on_server || false;
                this.setColumns(response.columns);

                if (this._isResponseValid(response)){
                    if(response.grouped_on_server){
                        this.groupedData = response;
                        if (response.fc_filters){
                            this.overlayModel.set({fc_filters:response.fc_filters}, {silent: true});
                        }
                    } else {
                        this.rawCollection = response.data;
                    }

                    this.filteredData = this.sortGroupAndFilter();

                    return this.filteredData;
                }
            } else {
                this._isEmpty = true;
                this._isFetched = true;
                return [];
            }


        },

        _isEmpty: true,

        _isFetched: false,

        isEmpty: function (){
          return  (this._isEmpty && this._isFetched);
        },

        isFetched: function () {
          return this._isFetched;
        },

        _isResponseValid: function(response){
            var ok = true;
            if (!response.grouped_on_server){
                if (!this._isActiveColumnValid(response)) {
                    ModalAlert.showError(lang.invalidActiveColumn);
                    ok = false;
                }
            }
            return ok;
        },

        _isActiveColumnValid: function(response){
            return !_.isUndefined(this._getCaseInsensitiveProperty(_.first(response.data),this.getActiveColumn()));
        },

        filteredData: {},
        rawCollection: {},
        overlayModel: {},

        getFilteredCountParms: function(){
            var parms = {};

            parms.filterable = (this.options.filterable === true);
            parms.expandable = (this.options.expandable === true);

            _.extend(parms, this.overlayModel.attributes);

            if (parms.sort_by === 'ordinal' ){
                parms.sort_by = parms.active_column;
            }

            parms.fc_filters = JSON.stringify(parms.fc_filters);

            return parms;
        },

        getFilteredCountQuery: function(){

            var postData = {},
                csuiContainerID,
                context = this.options.context || undefined,
                wrParameters = this.options.parameters || undefined;
            if (!_.isUndefined(wrParameters)){
                postData = _.extend(postData, UrlWebReports.getWebReportParametersAsData(wrParameters) );
            }

            csuiContainerID = UrlWebReports.getCurrentContainerID(context);
            if (!_.isUndefined(csuiContainerID)){
                postData = _.extend(postData, {csuiContainerID: csuiContainerID} );
            }
            postData = _.extend(postData, this.getFilteredCountParms() );

            return postData;
        },

        getActiveColumn: function(){
            var activeColumnName,
                activeColumnModel;

            if (this.columns){
                activeColumnModel = this.columns.findWhere({active_column:true});

                if (activeColumnModel){
                    activeColumnName = activeColumnModel.get("name");
                }
            }

            return activeColumnName;
        },

        getCountColumn: function(){
            var countColumnName,
                countColumnModel;

            if (this.columns){
                countColumnModel = this.columns.findWhere({count_column:true});

                if (countColumnModel){
                    countColumnName = countColumnModel.get("name");
                }
            }

            return countColumnName;
        },

        getFilters: function(){
            return _.deepClone(this.overlayModel.get('fc_filters'));
        },

        getSortOptions: function(){
            return {
                sortBy: this.overlayModel.get('sort_by'),
                sortOrder: this.overlayModel.get('sort_order')
            };
        },

        getTotalCount: function() {
            return this.models.reduce(function (memo, value) {
                return memo + value.get('value');
            }, 0);
        },

        getPercentageOfTotal: function(value){
            return ((value / this.getTotalCount()) * 100);
        },


        getGroupAfter: function(){
            return this.overlayModel.get('group_after');
        },

        mapFacetData: function(filteredData){

            var availableValues = [],
                facets = this.columns.toJSON(),
                activeColumn = _.findWhere(facets, {active_column:true}),
                activeFacet = {},
                facetObj = {},
                orderedFacets = [];
            activeFacet[activeColumn.id] = _.map(filteredData, _.bind(function(groupedItem){
                return {
                    name: groupedItem.key_formatted || groupedItem.key,
                    value: !_.isUndefined(groupedItem.key) ? groupedItem.key : groupedItem.key_formatted,
                    total: groupedItem.value,
                    percentage: this.getPercentageOfTotal(groupedItem.value)
                };
            }, this ));

            activeFacet[activeColumn.id] = _.reject(activeFacet[activeColumn.id], function(facet){
                return facet.name === "Other";
            });

            availableValues[0] = activeFacet;

            _.each(facets, function(facet){
                facetObj[facet.id] = facet;
            });

            _.each(availableValues, _.bind(function (item) {
                var id = _.keys(item)[0],
                    topics = item[id],
                    object = {},
                    existingFacetIndex = -1,
                    originalFacetNames = [],
                    facetModel;

                if (this.facetFilters && this.facetFilters.filters){

                    originalFacetNames = this._getAppliedFacetNames();

                    existingFacetIndex = originalFacetNames.indexOf(facetObj[id].name);

                }

                object[id] = facetObj[id];
                facetObj[id].name = facetObj[id].name_formatted;

                facetModel = new Backbone.Model(facetObj[id]);
                if (existingFacetIndex === -1){
                    facetModel.topics = new FacetTopicCollection(topics);
                } else {
                    facetModel.topics = new FacetTopicCollection();
                }

                orderedFacets.push(facetModel);

            }, this));

            if (this.facetFilters) {
                this.facetFilters.reset(orderedFacets);
            } else {
                this.facetFilters = new FilteredCountFacetCollection(orderedFacets);
            }

        },

        _getAppliedFacetNames: function(){
            return _.map(this.facetFilters.filters, _.bind(function (filter){
                return this.getActiveColumnByFormattedName(filter.facetName);
            }, this));
        },
        mapFilterData: function(filters){

            return _.map(filters, function(filtersToMap){
                    return {
                        facetName: filtersToMap.column ,
                        values: [{topicName: filtersToMap.value}]
                    };
                }
            );
        },
        unmapFilterData: function(filters){

            var values = _.map(filters.values, function(value){
                return value.topicName;
            });

            values = this.resolveToActualValues(values);

            var unMappedFilter = {
                column: this.getActiveColumnByFormattedName(filters.facetName),
                operator: 'IN',
                value: values
            };

            return unMappedFilter;
        },

        resolveToActualValues: function(formattedValues){
            var modelKeys = this.map(function(model){
                    return model.get('key');
                }),
                formattedKeys;

            if (!this.models[0].has("key_formatted")){
                return formattedValues;
            } else {
                formattedKeys = this.map(function(model){
                    return model.get('key_formatted');
                });
            }

            return _.map(formattedValues, _.bind(function(value){
                var index = formattedKeys.indexOf(value);
                if (index !== -1 ){
                    value =  modelKeys[index];
                }
                return value;
            }, this));

        },

        addFilter: function(filter){
            var activeColumnName = this._getNextActiveColumn(),
                filters = this.getFilters();

            filters.push(this.unmapFilterData(filter));

            this.overlayModel.set({
                fc_filters: filters,
                active_column: activeColumnName,
                active_column_formatted: this._getFormattedActiveColumnByName(activeColumnName)
            });
        },

        clearFilters: function(){
                var activeColumnName = this._getNextActiveColumn();

                this.overlayModel.set({
                    fc_filters: [],
                    active_column: activeColumnName,
                    active_column_formatted: this._getFormattedActiveColumnByName(activeColumnName)
            });
        },

        _getNextActiveColumn: function(){
            var activeColumn,
                columnNames = this.overlayModel.get('column_names'),
                columnsInFilter = this._getAppliedFacetNames(),
                columnsNotInFilter = _.difference(columnNames, columnsInFilter);
            if (columnsNotInFilter.length === 0){
                activeColumn = _.first(columnsInFilter);
            } else if (columnsInFilter.length !== 0) {
                activeColumn = _.first(columnsNotInFilter);
            } else {
                activeColumn = _.first(columnNames);
            }

            return activeColumn;
        },

        getActiveColumnByFormattedName: function(activeColumnFormattedName){
            var activeColumnModel = this.columns.findWhere({name_formatted: activeColumnFormattedName});

            return activeColumnModel.get('name');
        },

        _getFormattedActiveColumnByName: function(activeColumnName){
            var activeColumnModel = this.columns.findWhere({name: activeColumnName});

            return activeColumnModel.get('name_formatted') || activeColumnModel.get('name');
        },

        _getCaseInsensitiveProperty: function(obj, name) {
            if (obj && name){
                return obj[name] || obj[_.find(_.keys(obj), function(key){
                        return key.toLowerCase() === name.toLowerCase();
                    })];
            } else {
                return undefined;
            }
        },

        updateFilters: function(facetName, valueToRemove){
            var activeColumnName,
                filters = this.getFilters(),
                origFilterLength = filters.length,
                newFilters = [],
                triggerNeeded = false,
                push = false,
                valIndex;

            _.each(filters,function(filter){
                push = false;
                if (filter.column === facetName){
                    if (filter.value.length > 1 ){
                        valIndex = filter.value.indexOf(valueToRemove);
                        if (valIndex !== -1){
                            filter.value.splice(valIndex, 1);
                            push = true;
                            triggerNeeded = true;
                        } else {
                            push = true;
                        }
                    }
                } else {
                    push = true;
                }
                if (push){
                    newFilters.push(filter);
                }
            });

            activeColumnName = this._getNextActiveColumn();

            if (newFilters.length > 0 ){
                this.overlayModel.set({
                    fc_filters: newFilters,
                    active_column: activeColumnName,
                    active_column_formatted: this._getFormattedActiveColumnByName(activeColumnName)
                });
                if (triggerNeeded && (origFilterLength === newFilters.length)){
                    this.overlayModel.trigger('change', this.overlayModel);
                }
            } else {
                this.overlayModel.set({
                    active_column: activeColumnName,
                    active_column_formatted: this._getFormattedActiveColumnByName(activeColumnName)
                });
            }
        },

        updateColumnModels: function(activeColumn){
            var columnModels = this.columns.models;
            _.each(columnModels, function(columnModel){
                if (columnModel.get("active_column") === true && columnModel.get("name") !== activeColumn){
                    columnModel.set({"active_column":false});
                }

                if (columnModel.get("name") === activeColumn){
                    columnModel.set({"active_column":true});
                }
            });

            this.columns.set(columnModels);

        },

        setColumns: function(columns){
            var activeColumnName,
                activeColumn = _.findWhere(columns, {active_column:true} ),
                countColumn = _.findWhere(columns, {count_column:true} ),
                noActiveOrCountColSet = !activeColumn || !countColumn;
            if (noActiveOrCountColSet) {
                columns = _.map(columns, _.bind(function(column){
                    if (this.options.activeColumn && (column.name.toLowerCase() === this.options.activeColumn.toLowerCase())){
                        column.active_column = true;
                    }
                    if (this.options.countColumn && (column.name.toLowerCase() === this.options.countColumn.toLowerCase())){
                        column.active_column = true;
                    }
                    return column;
                }, this));
            }

            this.columns = new FilteredCountColumnCollection(columns);

            this.setColumnNames();

            activeColumnName = this.getActiveColumn();

            this.overlayModel.set({
                active_column: activeColumnName,
                active_column_formatted: this._getFormattedActiveColumnByName(activeColumnName),
                count_column: this.getCountColumn()
            }, {silent: true});

        },

        setColumnNames: function(){
            var columnsExcludingCount = this.columns.filter(function(model){
                return (model.get("count_column") !== true);
            });
            this.overlayModel.set({column_names: _.map(columnsExcludingCount, function(model){
                return model.get("name");
            })}, {silent: true});
            this.overlayModel.set({column_names_formatted: _.map(columnsExcludingCount, function(model){
                return model.get("name_formatted") || model.get("name");
            })}, {silent: true});
        },

        sortGroupAndFilter: function(options){
            var filteredData,
                nestedData;

            if (this.grouped_on_server){
                filteredData = this._mapGroupedData();
                if (!this.sorted_on_server || (options && options.sort)) {
                    filteredData = this.sortNest(filteredData, this.getSortOptions());
                }
            } else {
                nestedData = this.nest(this.filterBy(this.rawCollection, this.getFilters()),this.getActiveColumn());
                filteredData = this.groupOutlyingValues(this.sortNest(nestedData,this.getSortOptions()),this.getGroupAfter());
            }

            this.mapFacetData(filteredData);
            if (!this.facetFilters.filters){
                this.facetFilters.filters = this.mapFilterData(this.getFilters());
                this.facetFilters.trigger('reset');
            }

            return filteredData;
        },

        _mapGroupedData: function () {
            var mappedData = {};
            if (this.groupedData && this.groupedData.data){
                mappedData = _.map(this.groupedData.data, function(rowData){
                    var activeColumn = this.getActiveColumn(),
                        countColumn = this.getCountColumn(),
                        activeFormatted = this._getCaseInsensitiveProperty(rowData, activeColumn+"_formatted") || this._getCaseInsensitiveProperty(rowData, activeColumn) ,
                        countFormatted = this._getCaseInsensitiveProperty(rowData, countColumn+"_formatted") || this._getCaseInsensitiveProperty(rowData, countColumn);
                    return {
                        key: rowData[activeColumn],
                        key_formatted: this._removeEmptyValues(activeFormatted),
                        value: rowData[countColumn],
                        value_formatted: countFormatted
                    };
                }, this);
            }
            return mappedData;
        },

        _removeEmptyValues: function(value){
            return (value === null ||value === "" || value === undefined) ? lang.noValue :value;
        },

        nest: function(dataset,activeColumn) {

            var nestedData = [],
                index,
                key,
                count,
                nestedItem = {};

            _.each(dataset, _.bind(function(row){

                key = this._removeEmptyValues(row[activeColumn]);
                index = _.findIndex(nestedData, function(nestedRow){
                    return nestedRow.key === key;
                });
                if (index === -1){
                    nestedData.push({
                        key: key,
                        key_formatted: key.toString(),
                        value: 1,
                        value_formatted: "1"
                    });
                } else {
                    nestedItem = nestedData[index];
                    count = nestedItem.value;
                    count = count + 1;
                    nestedItem.value = count;
                    nestedItem.value_formatted = count.toString();
                    nestedData[index] = nestedItem;
                }

            },this));

            return nestedData;
        },

        filterBy: function(dataset,filters) {

            var column = null,
                value = null,
                operator = null;

            function dataFiltered(d) {
                var filtered,
                    currentValue = this._removeEmptyValues(d[column]);
                switch(operator) {
                    case '==':
                        filtered = currentValue === value;
                        break;
                    case 'IN':
                        filtered = (value.indexOf(currentValue) !== -1);
                        break;
                    default:
                        filtered = (value.indexOf(currentValue) !== -1);
                }

                return filtered;
            }

            _.each(filters,_.bind(function(item) {
                value = this._removeEmptyValues(item.value);
                column = item.column;
                operator = item.operator;
                dataset = dataset.filter(_.bind(dataFiltered, this));
            }, this));

            return dataset;
        },

        sortNest: function(dataset,sortOptions) {
            var sorted = [],
                sortBy,
                sortDir;

            sortBy = sortOptions.sortBy;
            sortDir = sortOptions.sortOrder;

            dataset = dataset.sort(function(a,b) {
                switch (sortBy.toLowerCase()) {
                    case 'ordinal':
                        if (isNaN(a.key)) {
                            sorted = d3.ascending(a.key,b.key);
                        }
                        else {
                            sorted = a.key - b.key;
                        }
                        break;
                    case 'count':
                        sorted = a.value - b.value;
                        break;
                    default:
                }
                return sorted;
            });
            return (sortDir === 'asc') ? dataset : dataset.reverse();
        },

        groupOutlyingValues: function(dataset,maxItems) {
            if (dataset.length > maxItems+1 && maxItems > -1) { // only sensible to group values if there are more than 2 of them
                var d1 = dataset.slice(0,maxItems),
                    d2 = dataset.slice(maxItems),
                    oValue = _.pluck(d2,'value'),
                    oTotal = _.reduce(oValue,function(memo,item) {
                        return memo + item;
                    },0),
                    others = {
                        key: 'Other',
                        value: oTotal
                    };
                d1.push(others);
                return d1;
            }
            else {
                return dataset;
            }
        },

        onOverlayUpdate: function() {

            var overlayChanges = this.overlayModel.changedAttributes(),
                clientOnlyChanges = (_.keys(_.omit(overlayChanges, ['sort_by','sort_order','view_value_as_percentage'])).length === 0),
                goToServer = (this.grouped_on_server && !clientOnlyChanges);

            if (!_.has(overlayChanges, 'column_names')){

                if (goToServer){
                    this._isFetched = false;
                    this._isEmpty = true;
                    this.fetch({type:"POST"});
                } else if (clientOnlyChanges) {
                    this.reset(this.sortGroupAndFilter({sort: true}));
                } else {
                    if (_.has(overlayChanges,'active_column')){
                        this.updateColumnModels(overlayChanges.active_column);
                    }
                    this.reset(this.sortGroupAndFilter());
                }
            }
        }
    });

    ConnectableMixin.mixin(FilteredCountCollection.prototype);

    var originalFetch = FilteredCountCollection.prototype.fetch;
    FilteredCountCollection.prototype.fetch = function (options) {
        options || (options = {});

        var requestExtensions,
            data = {
                format: 'webreport',
                method: 'GET'
            },
            chartQueryParms = this.getFilteredCountQuery();

        data = _.extend(data, chartQueryParms);

        requestExtensions = {
            type:'POST',
            data: data
        };
        if (options){
            _.extend(options,requestExtensions);
        } else {
            options = requestExtensions;
        }

        return originalFetch.call(this, options);
    };

    return FilteredCountCollection;

});
