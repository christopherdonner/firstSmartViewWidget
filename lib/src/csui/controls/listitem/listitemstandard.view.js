/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior', 'csui/utils/node.links/node.links',
  'hbs!csui/controls/listitem/impl/listitemstandard',
  'css!csui/controls/listitem/impl/listitemstandard'
], function (require, _, $, Marionette, DefaultActionBehavior, nodeLinks, itemTemplate) {
  'use strict';

  var StandardListItem = Marionette.ItemView.extend({

    tagName: function () {
      return this.showInlineActionBar ? 'div' : 'a';
    },
    className: 'csui-item-standard binf-list-group-item',

    triggers: {
      'click': 'click:item'
    },

    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },

    template: itemTemplate,
    templateHelpers: function () {
      return _.reduce(this.options, function (result, name, key) {
        if (typeof name === 'string') {
          var value = this._getValue(name);
          if (key === 'icon') {
            value = 'csui-icon ' + value;
            result.enableIcon = true;
          }
          result[key] = value;
        }
        return result;
      }, {}, this);
    },

    constructor: function StandardListItem(options) {

      if (options.toolbarData) {
        this._setInlineActions(options);
      }

      this.context = options.context;
      Marionette.ItemView.call(this, options);
    },

    _setInlineActions: function (options) {
      this.tileViewToolbarItems = options.toolbarData.toolbaritems || {};
      this.showInlineActionBar = true;
      this.collection = options.toolbarData.collection || {};
      this.triggers = {
        'click @ui.titleName': 'click:item',
        'click @ui.icon': 'click:item'
      };
      this.ui = {
        titleName: '.list-item-title',
        icon: '.csui-icon-group'
      };
      this.events = {
        'mouseenter': 'onShowCommands',
        'mouseleave': 'onDestroyCommands',
        'keydown': 'onKeyDown'
      };

    },

    setElementData: function () {
      var elementData;
      if (this.showInlineActionBar) {
        elementData = this.$el.find("a");

      } else {
        elementData = this.$el;
        elementData.prop('tabindex', '-1');
      }
      return elementData;
    },

    onRender: function () {
      var id = this.model && this.model.get('id');
      this.eleData = this.setElementData();
      if (id != null) {
        this.eleData.attr('href', nodeLinks.getUrl(this.model));
      }

      if (this.model && this.options && this.options.checkDefaultAction) {
        var disabled = this.model.fetched === false ||
                       !this.defaultActionController.hasAction(this.model);
        this.$el[disabled ? 'addClass' : 'removeClass']('inactive');
      }
      this.$el.removeAttr('role'); // these roles on the <a are not valid html
    },

    _getValue: function (name) {
      if (name.indexOf('{') === 0) {
        var names = name.substring(1, name.length - 1).split('.'),
            value = this.model.attributes;
        _.find(names, function (name) {
          value = value[name];
          if (value === undefined) {
            return true;
          }
        });
        return value;
      }
      return name;
    },

    onShowCommands: function (event) {
      if (this.showInlineActionBar) {
        this._showInlineBar(event);
      } else {
        return false;
      }
    },

    onKeyDown: function (e) {
      if (e.keyCode == 13 || e.keyCode == 32) {
        e.preventDefault();
        e.stopPropagation();
        this.trigger("click:item", {target: this.model});
      }
    },

    _showInlineBar: function (event) {
      this.showInlineActionsLock = true;
      this.$el.addClass('csui-tile-with-more-btn');
      event.preventDefault();
      event.stopPropagation();
      var self            = this,
          requiredModules = ['csui/controls/tableactionbar/tableactionbar.view',
            this.tileViewToolbarItems];

      require(requiredModules, function (TableActionBarView, TileViewToolbarItems) {
        self.inlineBarView = new TableActionBarView(_.extend({
          context: self.options.context,
          originatingView: self,
          commands: self.defaultActionController.commands,
          model: self.model,
          collection: TileViewToolbarItems.inlineActionbar,
          containerCollection: self.collection,
          status: {originatingView: self}
        }, TileViewToolbarItems.inlineActionbar.options));
        if (self.showInlineActionsLock) {
          var inlineBarDiv = self.$el.find('.csui-tileview-more-btn');
          var inlineBarRegion = new Marionette.Region({el: inlineBarDiv});
          inlineBarRegion.show(self.inlineBarView);
        }

      });

    },
    onDestroyCommands: function () {
      this.showInlineActionsLock = false;
      if (this.showInlineActionBar) {
        this.inlineBarView && this.inlineBarView.destroy();
        this.$el.removeClass('csui-tile-with-more-btn');
      } else {
        return false;
      }
    }
  });

  return StandardListItem;
});

