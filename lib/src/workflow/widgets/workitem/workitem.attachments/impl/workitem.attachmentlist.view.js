/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/node/node.addable.type.collection',
  'csui/utils/log',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/default.action/default.action.behavior',
  'workflow/behaviors/list.keyboard.behavior',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.draganddrop.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentitem.view',
  'workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments.emptyDragAndDrop.view',
  'hbs!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachmentlist',
  'css!workflow/widgets/workitem/workitem.attachments/impl/workitem.attachments'
], function (_, Marionette, TabableRegionBehavior, AddableTypeCollection, log,
    PerfectScrollingBehavior, DefaultActionBehavior, ListKeyboardBehavior, DragAndDrop,
    WorkItemAttachmentItemView, WorkItemDragAndDropEmptyView, template) {
  'use strict';
  var WorkItemAttachmentListView = Marionette.CompositeView.extend({

    childViewContainer: '.workitem-attachments-itemlist',
    childView: WorkItemAttachmentItemView,
    emptyView: WorkItemDragAndDropEmptyView,
    childViewOptions: function () {
      var options         = this.options,
          originatingView = options.view;
      originatingView.collection = this.collection;
      return {
        defaultActionController: this.defaultActionController,
        context: options.context,
        view: originatingView,
        container: options.container
      };
    },
    childEvents: {
      'editmode:item': 'onEditModeItem'
    },

    events: {
      'keydown': 'onKeyDown'
    },
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },
      ListKeyboard: {
        behaviorClass: ListKeyboardBehavior,
        currentlyFocusedElementSelector: '.workitem-attachments-name'
      },
      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.workitem-attachments-scrolling',
        suppressScrollX: true,
        scrollYMarginOffset: 16
      }
    },
    className: 'workflow-attachmentlist-form',
    template: template,
    ui: {
      dragAndDropArea: 'div.workitem-attachments-scrolling'
    },

    constructor: function WorkItemAttachmentListView(options) {
      this.options = options;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    },

    onShow: function () {
      var mapsList = this.options.view.model.get('mapsList');
      if (!this.options.view.model.get('isDoc') || (mapsList && mapsList.length === 1)) {
        this.setDragNDrop();
      }
    },
    onAddChild:function () {
      this.selectedIndex = 0;
      this.trigger('refresh:tabindexes');
    },
    onRemoveChild:function () {
      this.selectedIndex = 0;
      this.trigger('refresh:tabindexes');
    },
    onEditModeItem: function (view) {
      if (_.isFunction(view.isEditMode) && !view.isEditMode()) {
        this.trigger('refresh:tabindexes');
      }
    },
    setDragNDrop: function () {
      this.addableTypes = new AddableTypeCollection(undefined, {node: this.collection.node});
      this.addableTypes.fetch().done(_.bind(function () {
        this.dragNDrop = new DragAndDrop({
          container: this.collection.node,
          collection: this.collection,
          context: this.options.context,
          addableTypes: this.addableTypes
        });
        this.listenTo(this.dragNDrop, 'drag:over', this._addDragDropBorder, this);
        this.listenTo(this.dragNDrop, 'drag:leave', this._removeDragDropBorder, this);
        this.dragNDrop.setDragParentView(this, '.workitem-attachments-scrolling');
      }, this));

    },

    _addDragDropBorder: function () {
      this.ui.dragAndDropArea.addClass('drag-over');
    },

    _removeDragDropBorder: function () {
      if (this.ui.dragAndDropArea.hasClass && this.ui.dragAndDropArea.hasClass('drag-over')) {
        this.ui.dragAndDropArea.removeClass('drag-over');
      }
    },
    onDomRefresh: function () {
      if (this.collection.propertiesAction) {
        Marionette.CollectionView.prototype._renderChildren.call(this);
        this.collection.propertiesAction = false;
      }
    }
  });

  return WorkItemAttachmentListView;

});
