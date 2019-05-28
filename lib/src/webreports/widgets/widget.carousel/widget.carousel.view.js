/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
    'csui/lib/underscore',
    'csui/utils/base',
    'csui/controls/tile/tile.view',
    'webreports/widgets/widget.carousel/widget.carousel.layout.view',
    'i18n!webreports/widgets/widget.carousel/impl/nls/widget.carousel.lang',
    'hbs!webreports/controls/carousel/impl/carousel.tile',
    'css!webreports/controls/carousel/impl/carousel',
    'css!webreports/style/webreports.css'
], function (_, base, TileView, CarouselView, lang, template) {

    var CarouselTileView = TileView.extend({

        contentView: CarouselView,

        template: template,

        constructor: function CarouselTileView(options) {

            if (options.data && options.data.contentView){
                this.contentView = options.data.contentView;
            }
            this.contentViewOptions = options;
            TileView.prototype.constructor.apply(this, arguments);
        },
        
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

        onRender: function(){
            if (this.options.data.header === false){

                this.$(".tile-content")
                    .height("100%")
                    .css('margin-top','0px');
            }
        }

    });

    return CarouselTileView;

});
