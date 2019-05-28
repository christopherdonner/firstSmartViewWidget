/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/tile/tile.view',
  'webreports/utils/contexts/factories/wrtext.model.factory',
  'webreports/mixins/webreports.view.mixin',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'i18n!webreports/widgets/tilereport/impl/nls/tilereport.lang',
  'hbs!webreports/widgets/tilereport/impl/tilereport',
  'csui/lib/perfect-scrollbar',
  'css!webreports/widgets/tilereport/impl/tilereport',
  'css!webreports/style/webreports.css'
], function (_, $, Marionette, base, TileView, WrTextModelFactory, WebReportsViewMixin,
    PerfectScrollingBehavior, lang, template) {
    var ScriptExecutingRegion = Marionette.Region.extend({
        attachHtml: function(view) {
            this.$el.html('').append(view.el);
        }
    });
    var ContentView = Marionette.ItemView.extend({

       className: 'webreports-tilereport-content',

       render: function () {

            var source;

            if (this.model){
                source = this.model.get('source');
                if(!_.isUndefined(source)) {
                    this.$el.html(source);
                }
            }

            return this;
        }
    });

      var TileReportView = TileView.extend({
          constructor: function TileReportView(options) {


              if (options && options.data) {
              var header = ( _.has(options.data, 'header')) && _.isBoolean(options.data.header) ? options.data.header : true,
                  scroll = (_.has(options.data, 'scroll')) && _.isBoolean(options.data.scroll) ? options.data.scroll : true,
                  modelOptions;

                  options.data.header = header;
                  options.data.scroll = scroll;

                  modelOptions = this.setCommonModelOptions(options);
                 options.model = options.context.getModel(WrTextModelFactory, { attributes: modelOptions } );
                  this.listenTo(options.model, 'change', this.render);
                  this.listenTo(options.model, 'change', this._updateScrollbar);
                  this.contentViewOptions = options;

              }
              TileView.prototype.constructor.apply(this, arguments);
          },

          _updateScrollbar: function () {
              this.triggerMethod('update:scrollbar', this);
          },


          regionClass: ScriptExecutingRegion,

          contentView: ContentView,

          template: template,

          templateHelpers: function () {

              var helpers = {
                  title: base.getClosestLocalizedString(this.options.data.title, lang.dialogTitle),
                  icon: this.options.data.titleBarIcon || 'title-webreports'
              };
              if (this.options.data.header === true){
                  _.extend(helpers,{header:this.options.data.header});
              }

              return helpers;

          },

          behaviors: {

              PerfectScrolling: {
                  behaviorClass: PerfectScrollingBehavior,
                  contentParent: '> .tile-content',
                  suppressScrollX: true,
                  scrollYMarginOffset: 15,
                  scrollingDisabled: function () {
                      return !this.options.data.scroll;
                  }
              }

          },


          onRender: function () {

              if (this.contentView && typeof this.contentView === "object"){
                  this.contentView = this.contentView.constructor;
              }

              if (this.options.data.header === false){

                  this.$(".tile-content")
                                        .height("100%")
                                        .css('margin-top','0px');
              }
          }

      });
    WebReportsViewMixin.mixin(TileReportView.prototype);

      return TileReportView;

});
