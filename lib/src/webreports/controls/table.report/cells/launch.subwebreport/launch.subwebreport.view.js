/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/lib/underscore', 'csui/utils/commands', 'csui/controls/table/cells/templated/templated.view',
    'csui/utils/contexts/factories/connector',
    'csui/controls/table/cells/cell.registry',
    'csui/models/node/node.model',
    'hbs!webreports/controls/table.report/cells/launch.subwebreport/impl/launch.subwebreport',
    'i18n!webreports/controls/table.report/cells/launch.subwebreport/impl/nls/launch.subwebreport.lang',
    'css!webreports/controls/table.report/cells/launch.subwebreport/impl/launch.subwebreport'
], function(Backbone, _, commands, TemplatedCellView, ConnectorFactory, cellViewRegistry, NodeModel, template, lang) {

    var LaunchSubWebreportCellView = TemplatedCellView.extend({

        template: template,
        renderValue: function () {
            var data = this.getValueData(),
                html = data ? this.template(data) : '';

            this.$el.html(html);
        },

        getValueData: function () {
            var hoverText,
                iconClass,
                column = this.options.column;


            if (column.attributes){
                if(column.attributes.hoverText){
                    hoverText = column.attributes.hoverText;
                }
                if(column.attributes.iconClass){
                    iconClass = column.attributes.iconClass;
                }
            }

            return {
                icon_label: hoverText || lang.button_label,
                icon_class: iconClass || 'icon-subwebreport'
            };
        },

        ui: {
            launchSWR: '.launch-subwebreport'
        },

        events: {
            'click @ui.launchSWR': 'onClickLaunchSubWebreport'
        },

        onClickLaunchSubWebreport: function(event) {
            event.preventDefault();

            var connector = this.options.context.getObject(ConnectorFactory),
                WRNode = new NodeModel({
                    id: this.model.get('subwebreportid')
                }, {
                    connector: connector
                });

            WRNode.fetch().done(_.bind(function() {
                this.launchWebReport(WRNode);
            }, this));

        },

        launchWebReport: function(node) {
            var nodeCollection = new Backbone.Collection([node]),
                openWebReport = commands.get('OpenWebReport'),
                status = {
                    nodes: nodeCollection,
                    context: this.options.context
                };

            if (openWebReport && openWebReport.enabled(status)) {
                openWebReport.execute(status, {
                    context: this.options.context,
                    parameters: this.model.attributes
                });
            }
        }

    }, {
        hasFixedWidth: true,
        columnClassName: 'launch-subwebreport-col'
    });

    cellViewRegistry.registerByColumnKey("subwebreportid", LaunchSubWebreportCellView);

    return LaunchSubWebreportCellView;

});