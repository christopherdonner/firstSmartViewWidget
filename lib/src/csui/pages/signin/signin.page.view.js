/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context', 'csui/utils/contexts/factories/connector',
  "csui/controls/signin/signin.view", 'hbs!csui/pages/signin/impl/signin.page',
  'i18n!csui/pages/signin/impl/nls/lang', "csui/utils/log", 'csui/utils/base',
  'csui/utils/non-attaching.region/non-attaching.region',
  'css!csui/pages/signin/impl/signin.page'
], function (module, _, $, Marionette, PageContext,
    ConnectorFactory, SignInView, pageTemplate, lang, log, base,
    NonAttachingRegion) {

  var config = _.extend({
    applicationPageUrl: 'index.html'
  }, module.config());

  var SignInPageView = Marionette.LayoutView.extend({

    template: pageTemplate,

    regions: {
      formRegion: '#signin'
    },

    ui: {
      copyright: '.login-copyright'
    },

    constructor: function SignInPageView(options) {
      options || (options = {});
      options.el = document.body;

      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.$el.addClass('binf-widgets');
      if (base.isAppleMobile()) {
        this.$el.addClass('csui-on-ipad');
      }
    },

    onRender: function () {
      var context = new PageContext(),
          connector = context.getObject(ConnectorFactory),
          control = new SignInView({
            connection: connector.connection
          });

      this.listenTo(control, 'failure', function (event) {
        log.warn("Login for user {0} failed: {1} ", event.username,
            event.error.statusText) && console.warn(log.last);
      });
      this.listenTo(control, 'success', function (event) {
        log.info("Login succeeded for user: ", event.username) && console.log(log.last);
        var query = location.search.substring(1),
            nextUrl = /\bnextUrl(?:=([^&]+))?\b/i.exec(query),
            applicationPageUrl = nextUrl && decodeURIComponent(nextUrl[1]) ||
                                 this.options.applicationPageUrl ||
                                 config.applicationPageUrl;
        query = query.replace(/\bnextUrl(?:=[^&]*)?/i, '').replace(/&$/, '');
        if (query) {
          applicationPageUrl += (applicationPageUrl.indexOf('?') > 0 ? '&' : '?') + query;
        }
        location.href = applicationPageUrl + location.hash;
      });

      this.formRegion.show(control);
      this.ui.copyright.html(lang.copyrightMessage);
      setTimeout(_.bind(function () {
        var bodyRegion = new NonAttachingRegion({el: this.el});
        bodyRegion.show(this, {render: false});
      }, this));
    }

  });

  return SignInPageView;

});
