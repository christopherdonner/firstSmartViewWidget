/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/lib/backbone', // 3rd party libraries,
    'i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/nls/visual.data.lang',
    'hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.overlay',
    'css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data'
], function (_, $, Marionette, Backbone, lang, template) {

      var VisualDataOverlayView = Marionette.ItemView.extend({

          constructor: function VisualDataOverlayView(options) {

              this.model = options.overlayModel;
              this.uniqueID = _.uniqueId("visual-data-controls_");
              Marionette.ItemView.prototype.constructor.apply(this, arguments);
          },

          ui: function(){
              return {
                  settingsField: '#'+ this.uniqueID +' select'
              };
          },

          template: template,

          events: {
               'change @ui.settingsField': 'onChangeSetting'
          },

          templateHelpers: function () {
              var groupAfter = _.map([2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], function (value) {
                      return {
                          value: value ,
                          display: value ,
                          selected: this.model.get('group_after') === value
                      };
                  }, this),
                  chartSelectOptions = [
                      {visType: 'bar', name: lang.barChart, selected: this.model.get('vis_type') === 'bar'},
                      {visType: 'donut', name: lang.donutChart, selected: this.model.get('vis_type') === 'donut'},
                      {visType: 'pie', name: lang.pieChart, selected: this.model.get('vis_type') === 'pie'}
                  ],
                  viewValueAsPercentage = [
                      {value:"true", selected: this.model.get("view_value_as_percentage"), label: lang.percentage},
                      {value:"false", selected: !this.model.get("view_value_as_percentage"), label: lang.actual}
                  ],
                  sortOptions = [
                        {value:"Count|asc", selected: (this.model.get("sort_by") === "Count" && this.model.get("sort_order") === "asc"), label: lang.count+':'+ lang.asc},
                        {value:"Count|desc", selected: (this.model.get("sort_by") === "Count" && this.model.get("sort_order") === "desc"), label: lang.count+':'+ lang.desc},
                        {value:"ordinal|asc", selected: (this.model.get("sort_by") === "ordinal" && this.model.get("sort_order") === "asc"), label: lang.activeColumn+':'+ lang.asc},
                        {value:"ordinal|desc", selected: (this.model.get("sort_by") === "ordinal" && this.model.get("sort_order") === "desc"), label: lang.activeColumn+':'+ lang.desc}
                  ],
                  columnNames = _.map(this.model.get('column_names'), function (column, index) {
                      return {
                          column: column,
                          column_formatted: this.model.get('column_names_formatted')[index],
                          selected: this.model.get('active_column') === column
                      };
                  }, this);

              return {
                  chartoptions: chartSelectOptions,
                  columnnames: columnNames,
                  groupAfter: groupAfter,
                  viewValueAsPercentage: viewValueAsPercentage,
                  sortOptions: sortOptions,
                  lang: lang,
                  id: this.uniqueID,
                  multipleColumns: (columnNames.length > 1 )
              };

          },

          onChangeSetting: function(event) {
              event.preventDefault();
              this.updateSettings();
          },

          updateSettings: function() {

              var activeColumn,
                  activeColumnFormatted,
                  sortOptions,
                  sortBy,
                  sortOrder,
                  overlayForm = $('#'+ this.uniqueID +' select'),
                  overlayFormData= overlayForm.serializeArray();
              overlayFormData = _.object(_.map(overlayFormData, _.values));

              activeColumn = overlayFormData['visual-data-active-column'];
              sortOptions = overlayFormData['visual-data-sort-options'];
              sortOptions = sortOptions.split('|');
              sortBy = sortOptions[0];
              sortOrder = sortOptions[1];
              activeColumnFormatted = $("#"+ this.uniqueID +" select[name='visual-data-active-column'] option[value='"+activeColumn+"']").text();

              this.model.set({
                  active_column: activeColumn,
                  active_column_formatted: activeColumnFormatted,
                  sort_by: sortBy,
                  sort_order: sortOrder,
                  view_value_as_percentage: (overlayFormData['visual-data-value-as-percentage'].toLowerCase() === 'true'), // cast string as boolean
                  group_after: +overlayFormData['visual-data-group-after'] //string to number
              });
          }

      });

    return VisualDataOverlayView;

});
