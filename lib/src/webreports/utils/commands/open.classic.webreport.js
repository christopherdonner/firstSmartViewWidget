/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (_, CommandHelper, OpenClassicPageCommand) {

    var OpenClassicWebReportCommand = OpenClassicPageCommand.extend({

        defaults: {
            signature: 'OpenClassicWebReport',
            scope: "single"
        },
        
        enabled: function (status) {
            var node = CommandHelper.getJustOneNode(status);
            return node && node.get('type') === 30303;
        },

        getUrlQueryParameters: function (node, options) {
            var additionalParms,
                baseParms = {
                func: 'll',
                objAction: 'RunReport',
                objId: node.get('id'),
                nexturl: location.href
            };

            if ( _.has(options, "parameters") ) {
                baseParms = _.extend( baseParms, options.parameters );
            }

            return baseParms;
        }

    });

    return OpenClassicWebReportCommand;

});