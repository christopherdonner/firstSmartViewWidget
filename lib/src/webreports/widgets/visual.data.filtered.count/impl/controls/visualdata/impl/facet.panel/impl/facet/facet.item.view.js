/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/utils/base", "csui/lib/underscore", "csui/lib/marionette",
  "hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet/facet.item",
  "css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/impl/facet/facet.item"
], function ($, base, _, Marionette, template) {

  var FacetItemView = Marionette.ItemView.extend({

    template: template,
    className: 'csui-facet-item',

    constructor: function FacetItemView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.showInputOnHover =  !base.isTouchBrowser();
		this.uniqueID = _.uniqueId("visual-data-controls_");
    },

    triggers: {
      'click .csui-filter-name': 'single:filter:select'
    },

    events: {
      'click input': 'onCheckBoxSelect',
      'change input': 'onChangeValue',
      'keydown > span': 'onKeyInView',
      'keydown .csui-filter-name': 'onKeyInView'
    },

    ui: {
      icon: '> span',
      checkbox: '> span input',
      filterName: '> .csui-filter-name'
    },

    templateHelpers: function(){
      var showOnHover = this.showInputOnHover? '' : 'csui-showAlways';
      return {
        showOnHover: showOnHover,
          id: this.uniqueID,
        enableCheckBox : this.options.enableCheckBoxes
      };
    },
    onKeyInView: function(event){
      var keyCode = event.keyCode,
        target = $(event.target);
      switch (keyCode) {
        case 32:
        case 13:
          if(target.hasClass('icon')){
            this.ui.checkbox.trigger('click');
          }
          else{
            this.trigger('single:filter:select', this);
          }
          break;
        case 39:
        case 37:
          this.activeChild = target.hasClass('icon')?
            this.ui.filterName: this.ui.icon;
          this.activeChild.focus();
          break;
        case 38:
        case 40:
          this.trigger('keyupdown', keyCode === 38, target);
          break;
        default:
          return true;
      }
      return false;
    },

    onCheckBoxSelect: function(event){
      this.trigger('multi:filter:select', this);
    },

    onChangeValue: function (event) {
      var checkbox = event.target;
      if (checkbox.disabled) {
        this.ui.icon
            .removeClass('icon-checkbox icon-checkbox-selected')
            .addClass('icon-checkbox-disabled');
      } else if (checkbox.checked) {
        this.ui.icon
            .removeClass('icon-checkbox icon-checkbox-disabled')
            .addClass('icon-checkbox-selected');
      } else { // unchecked
        this.ui.icon
            .removeClass('icon-checkbox-selected icon-checkbox-disabled')
            .addClass('icon-checkbox');
      }
    },

    getIndex: function(){
      return this._index;
    }

  });

  return FacetItemView;

});
