/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette','csui/lib/backbone', // 3rd party libraries
    'csui/controls/tile/tile.view',
    'csui/utils/contexts/factories/connector',
    'csui/utils/url',
    'csui/utils/base',
    'csui/dialogs/modal.alert/modal.alert',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.expanding.behavior',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visual.data.content.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visual.data.overlay.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visual.data.expanded.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visualizations/visual.data.bar.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visualizations/visual.data.pie.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visualizations/visual.data.donut.view',
    'i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/nls/visual.data.lang',
    'hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.tile',
    'css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data',
    'css!webreports/style/webreports.css'
], function (_, $, Marionette, Backbone, TileView, ConnectorFactory, Url, base, ModalAlert, ExpandingBehavior, VisualDataContentView, VisualDataOverlay, VisualDataExpanded, VisualDataBarView, VisualDataPieView, VisualDataDonutView,  lang, template) {

      var VisualDataView = TileView.extend({

          contentView: VisualDataContentView,

          ui: {
              overlayClip: '.visual-data-overlay-clip',
              toggleSettings: '.visual-data-btn-settings span',
              overlay: '.visual-data-overlay'
          },

          constructor: function VisualDataView(options) {

              if (options.data && options.data.contentView){
                  this.contentView = options.data.contentView;
              }
              this.contentViewOptions = options;

              if (options.context){
                  this.connector = options.context.getObject(ConnectorFactory, options);
              }
             TileView.prototype.constructor.apply(this, arguments);
          },

          behaviors: function () {
              var behaviors = {},
                  launchButtonConfig = this.options.data.launchButtonConfig ;

              this.launchable = (this.options.data.expandable && launchButtonConfig && launchButtonConfig.launchButtons && (launchButtonConfig.launchButtons.length > 0));

              if (this.options.data.expandable){
                  behaviors.Expanding = {
                      behaviorClass: ExpandingBehavior,
                      titleBarIcon: function () {
                          return this.options.data.titleBarIcon;
                      },
                      dialogTitle: function () {
                          var title = base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle);
                          return title;
                      },
                      dialogTitleIconRight: "icon-tileCollapse",
                      dialogClassName: 'webreports-visual-data',
                      expandedView: function (){
                          return VisualDataExpanded;
                      },
                      expandedViewOptions: function () {
                          var expandedOptions = this.options,
                              VisTypeView; // generic pointer to one of several different specific visualisation views

                          switch (this.options.data.type) {
                              case 'bar':
                                  VisTypeView = VisualDataBarView;
                                  break;
                              case 'pie':
                                  VisTypeView = VisualDataPieView;
                                  break;
                              case 'donut':
                                  VisTypeView = VisualDataDonutView;
                                  break;
                              default:
                                  return false;
                          }
                          if (this.launchable){
                              this.rowLimit = launchButtonConfig.rowLimit;
                              expandedOptions.data.buttons = _.map(launchButtonConfig.launchButtons, _.bind(function(button){
                                  return {
                                      "label": base.getClosestLocalizedString(button.launchButtonLabel, lang.launchReport),
                                      "toolTip": base.getClosestLocalizedString(button.launchButtonTooltip, lang.launchReportTooltip),
                                      "click" : _.bind(function(){
                                          if (this.checkRowLimit(this.contentView.collection.getTotalCount(), this.rowLimit)){
                                              this._launchReport(button.launchButtonID);
                                          } else {
                                              ModalAlert.showError(lang.tooManyRows + this.rowLimit);
                                          }
                                      }, this)
                                  };
                              },this));
                          }
                          expandedOptions.data.isExpanded = true;
                          expandedOptions.data.expandedContentView = new VisTypeView(this.contentView.options);

                          return expandedOptions;
                      }
                  };
              }

              return behaviors;
          },

          regions: function() {
              var regions = _.extend({
                  visualizationControls: '.visual-data-controls-parent'
              }, TileView.prototype.regions);
              return regions;
          },

          events: {
              'click @ui.toggleSettings': 'toggleSettings',
			  'keyup @ui.toggleSettings': 'toggleSettings'
          },

          checkRowLimit: function(numRows, userDefinedLimit){
              var rowLimit,
                  defaultLimit = 5000,
                  hardLimit = 50000;

              if (!userDefinedLimit) {
                  rowLimit = defaultLimit;
              } else if (userDefinedLimit <= hardLimit){
                  rowLimit = userDefinedLimit;
              } else {
                  rowLimit = hardLimit;
              }

              this.rowLimit = rowLimit;

              return numRows <= rowLimit;
          },

          toggleSettings: function(event) {
			  
			  event.preventDefault();
              if(event.type === "click" || (event.type === "keyup" && (event.keyCode===13 || event.keyCode === 32) )) {
				  if (this.overlayVisible) {
					  $('.visual-data-overlay', this.$el).removeClass('visible');
					  this.overlayVisible = false;
				  } else {
					  var overlayView = new VisualDataOverlay({
						  overlayModel: this.contentView.collection.overlayModel
					  });

					  this.getRegion('visualizationControls').show(overlayView);
					  $('.visual-data-overlay', this.$el).addClass('visible');
					  this.overlayVisible = true;
				  }
			  }
          },

          template: template,

          templateHelpers: function () {

              var helpers = {
                  title: base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle),
                  icon: this.options.data.titleBarIcon || 'title-webreports',
                  activeColumn: this.options.data.activeColumn || '',
                  filterable: this.options.data.filterable,
				  settings: lang.settings
              };
              if (this.options.data.header === true){
                  _.extend(helpers,{header:this.options.data.header});
              }

              return helpers;

          },
          _launchReport: function(webreportID){

              var input,
                  cgiUrl = new Url(this.connector.connection.url).getCgiScript(),
                  wrClassicForm = $('<form></form>'),
                  fcParms = this.contentView.collection.getFilteredCountParms(),
                  runReportFields = {
                      func: 'll',
                      objAction: 'RunReport',
                      objId: webreportID,
                      nexturl: location.href
                  },
                  formFields = _.extend(runReportFields, fcParms);

              formFields.total_count = this.contentView.collection.getTotalCount();

              wrClassicForm.attr("method", "POST")
                      .attr("action",cgiUrl)
                      .attr("target","_blank")
                      .attr("id", "launch-webreport-form");

              _.each(_.keys(formFields), function(parmName){
                  input = $("<input>")
                      .attr("type", "hidden")
                      .attr("name", parmName)
                      .val(formFields[parmName]);
                  wrClassicForm.append(input);
              });
              $('.binf-modal-footer').append(wrClassicForm);
              wrClassicForm.submit();
              $('#launch-webreport-form').remove();
          }
      });

    return VisualDataView;

});
