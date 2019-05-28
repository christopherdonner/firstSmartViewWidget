/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
    'csui/lib/marionette', 'csui/widgets/metadata/metadata.general.action.fields',
    'csui/widgets/metadata/general.action.fields/impl/general.action.fields.view',
    'csui/dialogs/modal.alert/modal.alert'
], function (_, $, Backbone, Marionette, metadataGeneralActionFields,
        GeneralActionFieldCollectionView, ModalAlert) {
    'use strict';

    var GeneralActionFieldBehavior = Marionette.Behavior.extend({
        constructor: function GeneralActionFieldBehavior(options, view) {
            Marionette.Behavior.prototype.constructor.apply(this, arguments);
            this.view = view;
            this
                .listenTo(this.view, 'render', this._insertFieldExtensions)
                .listenTo(this.view, 'destroy', this._emptyExtensionRegion);

            var self = this;
            view.getGeneralActionFieldValues = function () {
                var formValues = {};
                if (self.fieldRegion) {
                    self.fieldRegion.currentView.children.each(function (formView) {
                        var values = formView.getValues(),
                            roleName = formView.model.get("role_name"),
                            roles, role;
                        if (values) {
                            if (roleName) {
                                roles = formValues.roles || (formValues.roles = {});
                                role = roles[roleName] || (roles[roleName] = {});
                                _.extend(role, values);
                            } else {
                                _.extend(formValues, values);
                            }
                        }
                    });
                }
                return formValues;
            };
        },

        _insertFieldExtensions: function () {
            var fieldParent = this.getOption('fieldParent');
            if (_.isFunction(fieldParent)) {
                fieldParent = fieldParent.call(this.view);
            }
            if (fieldParent) {
                fieldParent = this.view.$(fieldParent)[0];
            }
            if (!fieldParent) {
                return;
            }

            var fieldDescriptors = this.getOption('fieldDescriptors');
            if (_.isFunction(fieldDescriptors)) {
                fieldDescriptors = fieldDescriptors.call(this.view);
            }
            if (!fieldDescriptors || !fieldDescriptors.length) {
                return;
            }

            this.fieldRegion = new Marionette.Region({el: fieldParent});

            var fieldViewOptions = this.getOption('fieldViewOptions');
            if (_.isFunction(fieldViewOptions)) {
                fieldViewOptions = fieldViewOptions.call(this.view);
            }
            var fieldModels = new Backbone.Collection(_.pluck(fieldDescriptors, 'formModel')),
                fieldViews = new GeneralActionFieldCollectionView(_.extend({
                    context: this.view.options.context,
                    fieldDescriptors: fieldDescriptors,
                    collection: fieldModels,
                    node: this.view.options.node,
                    mode: this.view.options.mode,
                    generalFormView: this.view,
                    fetchedModels: this.view.options.fetchedModels,
                    displayedModels: this.view.options.displayedModels,
                    originatingView: this.view.options.originatingView,
                    metadataView: this.view.options.metadataView
                }, fieldViewOptions));
            this.listenTo(fieldViews, 'render:actions', function () {
                this.view.triggerMethod('render:general:action:fields', fieldViews);
            });
            this.fieldRegion.show(fieldViews);
        },

        _emptyExtensionRegion: function () {
            if (this.fieldRegion) {
                this.fieldRegion.empty();
            }
        }

    }, {

        getFieldDescriptors: function (options) {
            var methodName, parameters;
            if (options.action === 'create') {
                methodName = 'getGeneralActionFieldsForCreate';
                parameters = [{forms: options.forms}];
            } else if (options.action === 'copy') {
                methodName = 'getGeneralActionFieldsForCopy';
                parameters = [{forms: options.forms}];
            } else if (options.action === 'move') {
                methodName = 'getGeneralActionFieldsForMove';
                parameters = [{forms: options.forms}];
            } else {
                methodName = 'getGeneralActionFields';
            }
            var promises = metadataGeneralActionFields.chain()
                .map(function (fieldControllerDescriptor) {
                    var Controller = fieldControllerDescriptor.get('controller'),
                        controllerOptions = fieldControllerDescriptor.get('controllerOptions'),
                        controller = new Controller(_.extend({
                            context: options.context,
                            model: options.node,
                            fetchedModels: options.forms
                        }, controllerOptions)),
                        method = controller[methodName];
                    return method && method.apply(controller, parameters);
                })
                .compact()
                .value();
            return $.when
                .apply($, promises)
                .then(function () {
                    return _.flatten(arguments);
                });
        }

    });

    return GeneralActionFieldBehavior;
});
