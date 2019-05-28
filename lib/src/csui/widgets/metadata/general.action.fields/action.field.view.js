/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore','csui/lib/marionette',
    'hbs!csui/widgets/metadata/general.action.fields/impl/action.field',
    'csui/dialogs/modal.alert/modal.alert',
    'css!csui/widgets/metadata/general.action.fields/impl/action.field'

], function (_, Marionette, formTemplate, ModalAlert) {
    'use strict';

    var ActionFieldView = Marionette.ItemView.extend({

        template : formTemplate,

        ui: {
          'icon' : '.csui-action-icon',
          'action-link': '.csui-action-link'
        },

        templateHelpers: function () {
            var data = this.model.get('data');
            return {
                actionName: data.actionName,
                icon: data.iconClass,
                actionLabel: data.actionLabel
            };
        },

        events: {
            'click .action-with-icon': 'onClickActionLink'
        },

        className: 'cs-form csui-general-form',

        constructor: function ActionFieldView(options) {
            Marionette.ItemView.prototype.constructor.apply(this, arguments);
            this.listenTo(this, 'trigger:external:action', this.actionHandler);
        },

        onClickActionLink: function(event) {
        },

        actionHandler: function(callback) {
            if(callback) {
                callback();
                return;
            }
            ModalAlert.showError("No callback action supplied");
            return;
        }

    });

    return ActionFieldView;

});
