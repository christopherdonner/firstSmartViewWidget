/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', "csui/utils/url", 'csui/utils/contexts/factories/node',
  'i18n!csui/widgets/welcome.placeholder/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',
  'css!csui/widgets/welcome.placeholder/impl/welcome.video/welcome.video',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, base, Url, NodeModelFactory, lang,
  TabablesBehavior, TabableRegionBehavior, template) {

  var WelcomeVideo = Marionette.ItemView.extend({

    _dataDefaults:{
      videoSrc: lang.videoSrc,
      videoPoster: lang.videoPoster
    },

    className: 'cs-dialog welcome-video binf-modal binf-fade',

    template: template,

    events: {
      'hide.binf.modal': 'onDestroy',
      'hidden.binf.modal': 'onDestroy',
      'keydown video' : 'onKeyDown',
      'shown.binf.modal': 'onShown'
    },

    templateHelpers: function(){
      var optionsData = this.options.data;
      return {
        videoSrc: optionsData.videoSrc,
        videoPoster: optionsData.videoPoster
      };
    },

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      },
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function WelcomeVideo(options) {
      options || (options = {});
      options.data || (options.data = {});
      _.each(this._dataDefaults, function(value,key){
        var serverValue = options.data[key];
        if (!serverValue){
          options.data[key] = value;
        }
      });
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.connection = options.context.getModel(NodeModelFactory).connector.connection;
    },

    onKeyDown: function(event) {
      if(event.keyCode === 27) {
        this.destroy();
      }
    },

    onDestroy: function(){
      TabablesBehavior.popTabableHandler();
      this.$el.remove();
    },


    show: function () {
      this.render();
      if (base.isAppleMobile()){
        this.$el.addClass('mobile');
      }
      this.$el.binf_modal('show');
    },

    onShown: function () {
    this.$('video').focus();
   }



  });

  return WelcomeVideo;

});
