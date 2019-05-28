/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore','csui/utils/url','csui/utils/contexts/factories/node'], function (_,Url, NodeModelFactory) {

    var UrlWebReports = _.extend({

        appendWebReportParameters: function (query, parameters) {
            if (!_.isUndefined(parameters)) {
                if (_.isArray(parameters)) {
                    query = this.combineQueryString(query, this._serializeWebReportParameters(parameters));
                } else {
                    query = this.combineQueryString(query, parameters);
                }
            }

            return query;
        },

        appendCurrentContainer: function (query, context) {

            var csuiContainerID;
            if (!_.isUndefined(context)) {
                csuiContainerID = this.getCurrentContainerID(context);

                if (csuiContainerID){
                    query = this.combineQueryString(query, 'csuiContainerID='+ csuiContainerID );
                }
            }

            return query;
        },

        appendSWRCellID: function (query, options) {

            var subWebReportCellID;
            if (options && options.data && options.data.swrLaunchCell && options.data.swrLaunchCell.id) {

                subWebReportCellID = parseInt(options.data.swrLaunchCell.id, 10);

                if (typeof subWebReportCellID === "number" && !isNaN(subWebReportCellID)){
                    query = this.combineQueryString(query, 'subwebreport_id='+ subWebReportCellID );
                }
            }

            return query;
        },

        getCurrentContainerID: function (context) {
            var csuiContainerID,
                node = context.getModel(NodeModelFactory);

            if (!_.isUndefined(node)){
                csuiContainerID = node.get('id');
            }
            return csuiContainerID;
        },

        _serializeWebReportParameters: function(parameters){
            var serializedParms = '';

            _.each(parameters, function (parmPair) {
                if ( parmPair.name !== '' ) {
                    if (serializedParms.length) {
                        serializedParms += '&' + parmPair.name + '=' + parmPair.value;
                    } else {
                        serializedParms += parmPair.name + '=' + parmPair.value;
                    }
                }
            });

            return serializedParms;
        },

        getWebReportParametersAsData: function(parameters){

            var parmsObject = {};

            if (_.isArray(parameters)) {
                _.each(parameters, function (parmPair) {
                    if ( parmPair.name !== '' ) {
                        parmsObject[parmPair.name] = parmPair.value;
                    }
                });
            }

            return parmsObject;
        },
        getDataAsWebReportParameters: function(parameters){


            var parmsArray = [];

            if ( _.isObject(parameters) ){
                _.mapObject( parameters, function (val, key){
                    parmsArray.push({"name":key, "value": val});
                });
            }

            return parmsArray;
        }

    }, Url);

    return UrlWebReports;

});
