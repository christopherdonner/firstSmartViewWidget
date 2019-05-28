/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!csui/perspective.manage/impl/nls/root/lang',
  'csui/models/widget/widget.collection',
  'hbs!csui/perspective.manage/impl/widget.item'
], function (module, _, $, Backbone, Marionette, base, PerfectScrollingBehavior, Lang,
    WidgetCollection,
    WidgetItemTemplate) {
  'use strict';

  var config = module.config();
  _.defaults(config, {});

  var WidgetItemView = Marionette.ItemView.extend({

    constructor: function WidgetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    tagName: 'div',

    template: WidgetItemTemplate,

    events: {
      'click': 'onClickItem'
    },
    onClickItem: function () {
      var widgetCollection = new Backbone.Collection(this.model.attributes.widgets);
      this.options.parentView.trigger("item:clicked", {
        data: {
          items: widgetCollection.models,
          draggable: true
        }
      });
    }

  });

  var WidgetListView = Marionette.ItemView.extend({
    tagName: 'div',

    template: WidgetItemTemplate,

    constructor: function WidgetListView(options) {
      options || (options = {});
      options.data || (options.data = {});
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
            return behavior.behaviorClass === PerfectScrollingBehavior;
          }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '.cs-module-list',
            suppressScrollX: true,
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.ItemView.call(this, options);

      var self = this;
      this.allWidgets = new WidgetCollection();
      this.allWidgets.fetch().done(function () {
        self.collection = self._groupWidgetsByModule();
        self.render();
        self.trigger("items:fetched");
      });
    },

    initialize: function () {
      _.bindAll(this, "renderItem");
    },

    className: 'cs-module-list',

    render: function () {
      this.collection && this.collection.each(this.renderItem);
    },

    renderItem: function (model) {
      var parentView = this;
      var itemView = new WidgetItemView({model: model, parentView: parentView});
      itemView.render();
      $(this.el).append(itemView.el);
    },

    _groupWidgetsByModule: function () {
      var moduleCollection = new Backbone.Collection();
      _.each(this.allWidgets.models, function (model) {
        model.set("title",
            model.attributes.manifest ? model.attributes.manifest.title : Lang.noTitle);
      });
      _.each(_.groupBy(this.allWidgets.models, function (model) {
        return model.serverModule.id;
      }), function (val, key) {
        var title = _.first(val).serverModule.attributes.title;
        title = title ? title.replace(/OpenText /, '') : Lang.noTitle; // remove superfluous OpenText prefix
        moduleCollection.add({
          id: key,
          title: title,
          widgets: val
        })
      });
      return moduleCollection;
    },

    _sanitiseWidgetLibrary: function () {
    }

  });

  return WidgetListView;

});
