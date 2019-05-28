/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/models/facets",
  "csui/models/facettopics",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  "hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.bar/impl/facet.bar",
  "hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.bar/impl/facet.item",
  "i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.bar/impl/nls/lang",
  "css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.bar/impl/facet.bar"
], function ( $, _, Backbone, Marionette, FacetCollection,
    FacetTopicCollection, TabableRegionBehavior, template, itemTemplate, lang) {

  var FacetBarView =Marionette.ItemView.extend({

    listItemContext: itemTemplate,
    template: template,
    className: 'csui-facet-bar',
    ui:{
      facetListArea : '> div.csui-facet-list-area',
      facetList : '> div.csui-facet-list-area .csui-facet-list',
      facetDropdown: '.dropdown-facet-list',
      facetDropdownList : '.dropdown-facet-list > ul',
      dropdownBtn: '.binf-dropdown button',
      facetHeaderLabel: '> .csui-header',
      clearAll: '.csui-clear-all'
    },

    triggers: {
      'click .csui-clear-all': 'clear:all'
    },

    events: {
      'click .csui-facet-item .binf-close': 'onRemoveFilter',
      'keydown': 'onKeyInView'
    },
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    templateHelpers:function(){
      var options = this.options;
      return {
        clearAll: lang.clearAll,
        header: options.header,
        label: options.label
      };
    },

    constructor: function FacetBarView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.collection, 'reset', this.render, this);
      this.onWinResize = _.bind(function () {
        this.render();
      }, this);
      $(window).bind("resize.facetview", this.onWinResize);

    },

    currentlyFocusedElement: function () {
      var dropdownBtn = this.ui.dropdownBtn,
          focusables = this.$('.csui-facet-item > a[tabindex=-1]');
      if (focusables.length) {
        focusables.prop('tabindex', 0);
        if (_.isFunction(this.ui.clearAll.prop)){
          this.ui.clearAll.prop('tabindex', 0);
        }
      }
      if (_.isFunction(this.ui.facetDropdown.hasClass)){
        if (this.ui.facetDropdown.hasClass('csui-hidden')) {
          dropdownBtn.prop('tabindex', -1);
        }
        else{
          dropdownBtn.prop('tabindex', 0);
        }
      }
      return $(this.$('[tabindex]')[0]);
    },
    onKeyInView: function (event) {
      var keyCode = event.keyCode,
          retVal = true,
          $target = $(event.target);

      switch (keyCode) {
        case 46:
          if ($target.parent().hasClass('csui-facet-item')) {
            $target = $target.find('.binf-close');
            this.trigger('remove:filter',
                {facetIndex: $target.attr('data-facet'), filterIndex: $target.attr('data-topic')});
            retVal = false;
          }
          break;
        case 13:
          if ($target.hasClass('csui-clear-all')) {
            this.trigger('remove:all');
            retVal = false;
          }
          break;
        case 32:
          retVal = false;
          break;
      }
      return retVal;
    },

    onDestroy: function(){
      $(window).unbind("resize.facetview", this.onWinResize);
    },

    onRender: function(){
      if ( this.collection.filters.length > 0 ) {
        this.$el.show();
      }
      else{
        this.$el.hide();
      }
    },

   onDomRefresh: function () {
     this.ui.facetList[0].innerHTML = '';
     var filters = this.collection.filters,
       overflowStartIndex = this.addToFacetBar(filters);

     if (overflowStartIndex) {
        this.ui.facetDropdown.removeClass('csui-hidden');
       this.addToOverFlowDropDown(filters, overflowStartIndex);
     }
   },

    addToOverFlowDropDown: function(filters, startIndex) {
      var i = startIndex.startFilter,
        jqDropDownList = this.ui.facetDropdownList;

      for (; i < filters.length; i++) {
        var filter = filters[i],
          values = filter.values,
          j =  (i === startIndex.startFilter) ? startIndex.startValue : 0;

        for(; j < values.length ; j++) {
            var filterName = filter.facetName + ' : ' + values[j].topicName,
              newTopic = $(this.listItemContext({label: filterName, facetIndex: i, topicIndex: j}));

            newTopic.removeClass('zero-height');
            jqDropDownList.append(newTopic);
        }
      }
    },

    addToFacetBar: function(filters){
     var ui = this.ui,
       jqFacetListArea = ui.facetListArea,
       jqFacetList = ui.facetList;

     for (var i = 0; i < filters.length; i++) {
       var filter = filters[i],
         values = filter.values;

       for (var j = 0; j < values.length; j++) {

         var filterName = filter.facetName + ' : ' + values[j].topicName,
           newTopic = $(this.listItemContext({label: filterName, facetIndex: i, topicIndex: j}));

         jqFacetList.append(newTopic);

         var widthOfListArea = jqFacetListArea.width(),
              widthOfMoreIcon = ui.facetDropdown.width(),
           widthOfList = jqFacetList.width() + widthOfMoreIcon;

         if (widthOfList < widthOfListArea) {
           newTopic.removeClass('zero-height');
         }
         else {
           newTopic.remove();
           return {startFilter: i, startValue: j};
         }
       }
     }
   },

    onClearAll: function(){
      this.trigger('remove:all');
    },

    onRemoveFilter: function(e){
      var target = $(e.target);
      this.trigger('remove:filter',
          {facetIndex: target.attr('data-facet'), filterIndex: target.attr('data-topic')});
    },

    applyFilter: function(facet){
      this.trigger('apply:filter', facet.newFilter);
    },

    updateHeaderLabel: function( label ){
      this.options.label = label;
      this.ui.facetHeaderLabel.text(label);
    }
  });


  return FacetBarView;

});
