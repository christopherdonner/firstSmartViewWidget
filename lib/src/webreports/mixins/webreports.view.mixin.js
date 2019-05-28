/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'webreports/utils/url.webreports'
], function (_, Url) {
    "use strict";

    var WebReportsViewMixin = {

        mixin: function (prototype) {
            return _.extend(prototype, {
                setCommonModelOptions: function(options){

                    var parameters,
                        modelOptions = {};

                    if (options && options.data) {
                        if (_.has(options.data, 'parameters')) {
                            parameters = options.data.parameters;
                            if(!_.isUndefined(parameters) && typeof parameters === "object") {
                                _.extend(modelOptions,{parameters: parameters});
                                _.extend( modelOptions, Url.getWebReportParametersAsData(parameters));
                            }
                        }
                        if (options.data.id) {
                            _.extend(modelOptions,{id: options.data.id});
                        }
                        if (options.context) {
                            _.extend(modelOptions,{context: options.context});
                        }

                    }

                    return modelOptions;
                }
            });
        }

    };

    return WebReportsViewMixin;
});
