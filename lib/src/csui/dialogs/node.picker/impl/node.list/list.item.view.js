/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/listitem/listitemstandard.view',
  'hbs!csui/dialogs/node.picker/impl/node.list/list.item',
  'hbs!csui/dialogs/node.picker/impl/search.list/search.location.item',
  'csui/controls/node-type.icon/node-type.icon.view',
  'csui/behaviors/default.action/default.action.behavior',
  'i18n!csui/dialogs/node.picker/impl/nls/lang'
], function (_, $, StandardListItem, itemTemplate, searchLocationTemplate, NodeTypeIconView,
    DefaultActionBehavior, npLang) {

  var ListItem = StandardListItem.extend({

    template: itemTemplate,
    searchLocationTemplate: searchLocationTemplate,

    templateHelpers: function () {

      return {
        'selected': this.selected ? 'icon-listview-checkmark' : '',
        'browsed': this.browsed ? 'icon-sidebar-expand24' : ''

      };
    },

    tagName: 'li',

    events: {
      'keydown': 'onKeyInView'
    },

    ui: {
      link: '.csui-list-group-item'
    },

    onKeyInView: function (event) {
      if (event.keyCode === 39 || event.keyCode === 32 || event.keyCode === 13) {
        this.$el.trigger('click');
        this.$el.focus();
        return false;
      }
      return true;
    },

    constructor: function ListItem(options) {
      StandardListItem.apply(this, arguments);

      this.selected = false;
      this.browsed = false;
    },

    toggleSelect: function () {
      this.selected = !this.selected;
      this.render();
    },

    toggleBrowse: function () {
      this.browsed = !this.browsed;
      this.render();
    },

    assignedBrowseNSelect: function () {
      this.browsed = this.selected = true;
      this.render();
    },

    unassignBrowseNSelect: function () {
      if (!this.isDestroyed) {
        this.browsed = this.selected = false;
        this.render();
      }
    },

    isSelected: function () {
      return this.selected;
    },

    isBrowsed: function () {
      return this.browsed;
    },

    setValidity: function (valid) {
      this.valid = valid;
    },

    setEnable: function setEnable(enable) {
      if (enable) {
        this.$el.removeClass('csui-disabled');
        var elementNamePlus = _.str.sformat(npLang.itemTypeNameAria, this.model.get('type_name'),
            this.model.get('name'));
        if (!this.valid) {
          elementNamePlus = _.str.sformat(npLang.disabledItemTypeNameAria,
              this.model.get('type_name'), this.model.get('name'));
        }
        this.$el.attr('aria-label', elementNamePlus);
      } else {
        this.$el.addClass('csui-disabled');
        var disabledTitle = _.str.sformat(npLang.disabledItemTypeNameAria,
            this.model.get('type_name'), this.model.get('name'));
        this.$el.attr('aria-label', disabledTitle);
      }
    },

    onRender: function () {
      this.$el.addClass('cs-left-item-' + this.model.get('id'));
      this.$el.removeClass('select');
      this.$el.removeClass('browse');
      this.ui.link.removeAttr('aria-expanded', 'false');
      this.$el.removeAttr('aria-selected');
      this.$el.attr('role', 'option');
      this.setEnable(true);

      if (!this.options.searchView) {
        $(".binf-list-group").removeClass("search-left-item");
        if ($(".csui-np-content .csui-search-item-left-panel").is(":visible")) {
          $(".binf-list-group").addClass("search-left-folder-right");
        } else if ($(".cs-start-locations .binf-search-location-group").is(":visible")) {
          $(".binf-list-group").removeClass("search-left-folder-right");
        }
        if (this._nodeLocationIconView) {
          this._nodeLocationIconView.destroy();
        }
      }

      if (this._isBrowsable(this.model)) {
        this.ui.link.attr('aria-haspopup', 'true');
      }

      if (this.selected) {
        this.$el.addClass('select');
        this.ui.link.attr('aria-expanded', 'true');
        this.$el.attr('aria-selected', 'true');
      } else if (this.browsed) {
        this.$el.addClass('browse');
      }

      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });

      var mimeTypeIconClassName = this._nodeIconView.model.get('className');
      mimeTypeIconClassName = this.valid ? mimeTypeIconClassName :
                              mimeTypeIconClassName + '_nonselectable';
      this._nodeIconView.model.set('className', mimeTypeIconClassName);

      var mimeTypeIconMainClassName = this._nodeIconView.model.get('mainClassName');
      mimeTypeIconMainClassName = this.valid ? mimeTypeIconMainClassName :
                                  mimeTypeIconMainClassName + '_nonselectable';
      this._nodeIconView.model.set('mainClassName', mimeTypeIconMainClassName);

      this._nodeIconView.render();
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
    },

    _openSearchLocation: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this._parent.triggerMethod("click:location", this.model.parent);
    },

    _isBrowsable: function (model) {
      return model.get('container') && model.get('perm_see_contents') !== false;
    },

    getResolvedModel: function () {
      var model = this.model;
      if (this.options.resolveShortcuts && model.get('type') === 1 && model.original !==
          undefined) {
        model = model.original;
      }
      return model;
    }

  });

  return ListItem;

});
