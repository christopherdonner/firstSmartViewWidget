/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/widgets/error.global/error.global.view',
  'csui/utils/url',
  'csui/utils/non-attaching.region/non-attaching.region',
  'css!csui/pages/error.page/impl/error.page'
], function (_, $, Marionette, PageContext, ApplicationScopeModelFactory,
    GlobalErrorView, Url, NonAttachingRegion) {

  var ErrorPageView = Marionette.ItemView.extend({

    template: false,

    constructor: function ErrorPageView(options) {
      options || (options = {});
      options.el = document.body;

      Marionette.ItemView.prototype.constructor.call(this, options);
      this.$el.addClass('binf-widgets csui-error-page-container');

      this.context = new PageContext();
      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this.applicationScope, 'change:id', this._onChangeId);
      this.globalErrorView = new GlobalErrorView({
        model: options.model,
        context: this.context
      });
    },

    onRender: function () {
      this.globalErrorView.render();
      this.$el.empty().append(this.globalErrorView.el);
      setTimeout(_.bind(function () {
        var bodyRegion = new NonAttachingRegion({el: this.el});
        bodyRegion.show(this, {render: false});
      }, this));
    },

    _onChangeId: function () {
	    location.href = Url.combine(new Url(new Url(location.pathname).getCgiScript()), 'app');
    }

  });

  return ErrorPageView;
});
