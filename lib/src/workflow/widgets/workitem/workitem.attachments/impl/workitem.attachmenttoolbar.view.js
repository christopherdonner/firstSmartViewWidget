/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/globalmessage/globalmessage',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/toolbar/toolbar.view',
  'workflow/widgets/workitem/workitem.attachments/workitem.attachments.toolbaritems',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromDesktop',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addfromCS',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.addShortcut',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmenttoolbar',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function ($, _, Marionette, log, GlobalMessage, TabableRegionBehavior,
    LayoutViewEventsPropagationMixin, ToolbarView, toolbarItems, AddFromFileSysCommand,
    AddFromContentServerCommand, AddShortCutServerCommand, template, lang) {
  'use strict';

  var WorkItemAttachmentsToolbarView = Marionette.LayoutView.extend({

    template: template,

    regions: {
      addToolbarRegion: '.workitem-attachment-toolbar-add' // add toolbar
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    toolbarItemSelector: 'a.' + TabableRegionBehavior.accessibilityFocusableClass,

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {

      var toolbarElements = this.$(this.toolbarItemSelector);
      var elementOfFocus = toolbarElements.length ?
                           $(toolbarElements[this.accNthToolbarItemFocused]) : null;
      return elementOfFocus;
    },

    constructor: function WorkItemAttachmentsToolbarView(options) {
      options || (options = {});

      this.context = options.context;
      this.toolbarCollection = options.toolbarCollection;
      this.originatingView = options.originatingView;
      this.addableTypes = options.addableTypes;
      this.container = options.container;
      this.attachmentCollection = options.attachmentCollection;
      this.accNthToolbarItemFocused = 0;

      Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options
    },

    initialize: function () {
      this.toolbarView = new ToolbarView({
        collection: this.toolbarCollection,
        maxItemsShown: 0,
        dropDownText: lang.AddToolbarItemLabel,
        dropDownIcon: 'icon icon-toolbarAdd'
      });
      this.addFromCSCommand = new AddFromContentServerCommand();
      this.addFromFileSysCommand = new AddFromFileSysCommand();
      this.addShortCutCommand = new AddShortCutServerCommand();
      this.listenTo(this.toolbarView, 'childview:toolitem:action', this._toolbarItemClicked);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.addToolbarRegion.show(this.toolbarView);
    },

    _closeMenu: function (event, prevent) {
      var dropDownEl = this.$el.find('li.binf-dropdown.binf-open');
      if (dropDownEl.length > 0) {
        var dropDownToggel = this.$el.find('li.binf-dropdown.binf-open > a');
        dropDownEl.removeClass('binf-open');
        dropDownToggel.attr('aria-expanded', 'false');
        if (prevent) {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 27:
        this._closeMenu(event, true);
        break;
      case 9:
        this._closeMenu(event, false);
        break;
      }
    },
    _toolbarItemClicked: function (event) {

      switch (event.model.get('id')) {
      case 'copy':
        var validTypes = this.addableTypes.map(function (model) {
          return model.get('type');
        });
        this.addFromCSCommand.execute({
          originatingView: this.originatingView,
          context: this.context,
          container: this.container,
          collection: this.attachmentCollection,
          validTypes: validTypes
        });
        break;
      case 'filesystem':
        var status = {
          originatingView: this.originatingView,
          context: this.context,
          container: this.container,
          collection: this.attachmentCollection,
          data: this.addableTypes
        };
        var fileSysOptions = {
          context: this.context,
          addableType: event.model.get('type'),
          addableTypeName: event.model.get('name')
        };
        this.addFromFileSysCommand.execute(status, fileSysOptions);
        break;
      case 'shortcut':
        this.addShortCutCommand.execute({
          originatingView: this.originatingView,
          context: this.context,
          container: this.container,
          collection: this.attachmentCollection
        }, {
          type: 1, //shortcut subtype
          type_name: 'shortcut'
        });
        break;
      default:
        GlobalMessage.showMessage("warning", "not implemented");
      }
    }

  });

  _.extend(WorkItemAttachmentsToolbarView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemAttachmentsToolbarView;
});
