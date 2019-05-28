/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/behaviors/item.error/item.error.behavior',
  'csui/utils/contexts/factories/node', 'csui/utils/node.links/node.links',
  'csui/utils/defaultactionitems', 'csui/utils/commands',
  'hbs!csui/widgets/shortcut/impl/shortcut',
  'i18n!csui/widgets/shortcut/impl/nls/lang',
  'css!csui/widgets/shortcut/impl/shortcut',
], function (Backbone, Marionette, DefaultActionBehavior, TabableRegionBehavior,
    ItemErrorBehavior, NodeModelFactory, nodeLinks, defaultActionItems, commands,
    shortcutTemplate, lang) {
  'use strict';
  var ShortcutView = Marionette.ItemView.extend({
    tagName: 'a',

    attributes: {
      href: '#'
    },

    className: function () {
      var background = this.options.data.background || 'cs-tile-background-default';
      return 'cs-shortcut tile ' + background;
    },

    modelEvents: {
      'change': 'render'
    },

    triggers: {
      'click': 'click:link'
    },

    template: shortcutTemplate,

    templateHelpers: function () {
      var name, short_name, first_space;
      if (this.model.fetched) {
        name = this.model.get('name') || '';
        short_name = name.length > 38 ? name.substr(0, 38) + '...' : name;
        first_space = short_name.indexOf(' ');
        if (short_name.length >= 20 && (first_space < 0 || first_space > 20)) {
          short_name = short_name.substr(0, 18) + '...';
        }
      } else {
        short_name = lang.loadingText;
      }
      return {
        short_name: short_name,
        icon: this.options.data.icon || "icon-folder",
        title: this.model.get('name')
      };
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      },

      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      },

      ItemError: {
        behaviorClass: ItemErrorBehavior
      }
    },

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {
      return this.$el;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        this.triggerMethod("click:link");
      }
    },

    constructor: function ShortcutView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!options.model) {
        options.model = options.context.getModel(NodeModelFactory, {
          attributes: {
            id: options.data.id || 'volume',
            type: options.data.type
          }
        });
      }

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

    onRender: function () {
      var disabled = !this.model.fetched ||
                     !this.defaultActionController.hasAction(this.model);
      this.$el[disabled ? 'addClass' : 'removeClass']('csui-disabled');
      this.$el.attr('href', nodeLinks.getUrl(this.model) || '#');
    },

    onClickLink: function () {
      this.triggerMethod('execute:defaultAction', this.model);
    }
  });

  return ShortcutView;
});
