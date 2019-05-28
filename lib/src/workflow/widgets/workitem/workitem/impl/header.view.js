/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/node',
  'csui/models/nodes',
  'csui/utils/commandhelper',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/globalmessage/globalmessage',
  'workflow/models/workflow/workflow.model',
  'workflow/commands/initiate.workflow/initiate.workflow',
  'hbs!workflow/widgets/workitem/workitem/impl/header',
  'i18n!workflow/widgets/workitem/workitem/impl/nls/lang',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem/impl/workitem'
], function (_, $, Marionette, TabableRegion, NodeModelFactory, NodeCollection, CommandHelper,
    ModalAlert, GlobalMessage, WorkflowModel, InitiateWorkflowCommand, headerTemplate, Lang, LangCoreUI) {
  'use strict';

  var HeaderView = Marionette.ItemView.extend({

    template: headerTemplate,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion,
        initialActivationWeight: 100
      }
    },
    ui: {
      titleWorkflow: '.tile-title>h2'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .cs-menu-option': 'onMapSelectionChanged'
    },

    templateHelpers: function () {
      var maps = this.options.maps;
      var documentTitle ='';
      for (var map in maps) {
        var name = maps[map].Name.split(":");
        this.options.maps[map].Name = name[name.length - 1];
      }
      var selectedMapTitle = Lang.MultipleMapsSelectPlaceholder;
      var shadowClass = "";
      var showIcon = true;
      if (this.model && this.model.attributes.isDocDraft) {
        selectedMapTitle = this.model.attributes.title;
      }
      if (this.options.multiMaps === true) {
        documentTitle = selectedMapTitle;
      }
      else {
        documentTitle = this.options.title;
      }

      document.title = _.str.sformat(Lang.WorkflowStepTitle, documentTitle);

      return {
        iconLeft: this.options.iconLeft,
        imageLeftUrl: this.options.imageLeftUrl,
        imageLeftClass: this.options.imageLeftClass,
        title: this.options.title,
        expandedHeader: true,
        multiMaps: this.options.multiMaps,
        maps: this.options.maps,
        MultipleMapsSelectPlaceholder: selectedMapTitle,
        shadowClass: shadowClass,
        showIcon: showIcon
      };
    },

    constructor: function HeaderView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    isTabable: function () {
       return true;
    },

    currentlyFocusedElement: function () {
      var tabButton = this.$('#select-workflow-type');
      if (tabButton.length > 0) {
        return $(tabButton[0]);
      }
      else {
        return this.ui.titleWorkflow ;
      }
    },

    onSetFocus:function () {
      this.ui.titleWorkflow.focus();
    },

    onDomRefresh:function () {
      var tabButton = this.$('#select-workflow-type');
      if (tabButton.length > 0) {
        tabButton[0].focus();
      }
      else {
        this.triggerMethod("setFocus");
      }
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 32) {
        $(event.target).click();
      }
    },
    onMapSelectionChanged: function(event){
      var self = this;
      if(this.model && this.model.attributes.isDocDraft){
        var options={};
        options.buttons = ModalAlert.buttons.OkCancel;
        var promise = ModalAlert.confirmWarning( Lang.ChangeWorkflowTypeMessage, Lang.ChangeWorkflowTypeTitle, options);
        promise.then(function () {
          self.mapSelected(event);
        });
      } else {
        this.mapSelected(event);
      }
    },
    mapSelected: function (event) {
      var mapId = parseInt(event.target.getAttribute("data-wfid"));
      if (mapId) {

        this.propertiesCommand = new InitiateWorkflowCommand();
        this.mapModel = this.options.context.getModel(NodeModelFactory,
            {attributes: {id: mapId}});

        this.mapModel.fetch()
            .done(_.bind(function (args) {
              var model = this.options.model;
              var status = {};
              status.context = this.options.context;
              status.nodes = new NodeCollection([this.mapModel]);
              status.isDoc = true;
              status.doc_id = model.get('doc_id');
              status.parent_id = model.get('parent_id');
              status.docNames = model.get('doc_names');
              var defaults = model.defaults;
              model.reset({silent: true});
              model.set(defaults, {silent: true});
              var promisesFromCommands = this.propertiesCommand.execute(status);
              CommandHelper.handleExecutionResults(promisesFromCommands,
                  {
                    command: this.propertiesCommand,
                    suppressSuccessMessage: status.suppressSuccessMessage
                  });
            }, this))
            .fail(_.bind(function (args) {
              GlobalMessage.showMessage('error', args.responseJSON.error);
            }, this));
      }
    },

  });

  return HeaderView;
});
