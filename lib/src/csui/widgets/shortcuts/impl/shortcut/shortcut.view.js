/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/utils/contexts/factories/node',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'hbs!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut',
  'i18n!csui/widgets/shortcuts/impl/nls/lang',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/small.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/medium.shortcut',
  'css!csui/widgets/shortcuts/impl/shortcut/impl/large.shortcut'
], function (
  _,
  $,
  Backbone,
  Marionette,
  DefaultActionBehavior,
  ItemErrorBehavior,
  NodeModelFactory,
  defaultActionItems,
  commands,
  smallShortcutTemplate,
  mediumShortcutTemplate,
  largeShortcutTemplate,
  lang) {
  
  'use strict';
  var ShortcutView = Marionette.ItemView.extend({
  
    constructor: function MiniShortcutView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.data.icon = options.data.icon || 'icon-folder';
      options.data.theme = options.data.theme || 'csui-shortcut-theme-grey-shade1';
      options.data.layout = options.data.layout || 'small';

      options.model = options.context.getModel(NodeModelFactory, {
        attributes: {
          id: options.data.id || 'volume',
          type: options.data.type
        }
      });

      Marionette.ItemView.prototype.constructor.call(this, options);
      this.model.excludeResources();
      this.model.resetFields();
      this.model.setFields({
        'properties': ['container', 'id', 'name', 'original_id', 'type'],
        'versions.element(0)': ['mime_type']
      });
      this.model.resetExpand();
      this.model.setExpand({
        properties: ['original_id']
      });
      this.model.resetCommands();
      this.model.setCommands(defaultActionItems.getAllCommandSignatures(commands));
    },

    tagName: 'a',

    className: function() {
      var classArr = [];

      classArr.push('csui-shortcut-item');
      classArr.push('csui-acc-focusable');
      classArr.push(this.options.data.theme);
      classArr.push('csui-' + this.options.data.layout);

      return classArr.join(' ');
    },

    getTemplate: function() {
      var template;

      if (this.options.data.layout === 'small') {
        template = smallShortcutTemplate;
      }
      else if (this.options.data.layout === 'medium') {
        template = mediumShortcutTemplate;
      }
      else {
        template = largeShortcutTemplate;
      }

      return template;
    },

    templateHelpers: function() {
      var favName = this.model.fetched ? this.model.get('name') : lang.loadingText;
      return {
        icon: this.options.data.icon,
        name: favName,
        shortcutAria: lang.shortcutPrefixAria + " " + favName
      };
    },

    onRender: function() {
      this.$el.attr('role', 'menuitem');
      if (this.model.fetched && this.defaultActionController.hasAction(this.model)) {
        this.$el.removeClass('csui-disabled');
      }
      else {
        this.$el.addClass('csui-disabled');
      }

      if (this.model.error) {
        this.$el.addClass('csui-failed');
      }
      else {
        this.$el.removeClass('csui-failed');
      }
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },
      ItemError: {
        behaviorClass: ItemErrorBehavior,
        errorViewOptions: function () {
          return {
            low: this.options.data.layout === 'small'
          };
        }
      }
    },

    modelEvents: {
      change: 'render'
    },

    events: {
      'click': 'onClicked'
    },

    onClicked: function() {
      this.triggerMethod('execute:defaultAction', this.model);
    }

  });

  return ShortcutView;

});
