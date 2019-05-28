/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'esoc/widgets/userwidget/model/view.simple.user.form',
  'esoc/controls/form/view.simple.user.info/view.simple.user.form',
  'hbs!esoc/widgets/userwidget/impl/simple.userwidget.form.view',
  'css!esoc/widgets/userwidget/impl/userwidget.css'
], function ($, _, Backbone, Handlebars, Marionette, PerfectScrollingBehavior, ViewSimpleUserFormModel,
    ViewSimpleUserFormView, SimpleUserWidgetFormViewTemplate) {

  var SimpleUserWidgetFormView = Marionette.ItemView.extend({
    className: 'esoc-simple-user-widget-profile-view',
    template: SimpleUserWidgetFormViewTemplate,
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        contentParent: ".esoc-simple-user-widget-form-view",
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      }
    },
    constructor: function SimpleUserWidgetFormView(options) {
      options = options || {};

      Marionette.ItemView.prototype.constructor.call(this, options);
      var form = new ViewSimpleUserFormModel({userId: this.options.userwidgetmodel.attributes.id}, {connector: this.options.connector}),
          that = this;
      form.fetch().done(function () {
        that.formView = new ViewSimpleUserFormView({
          context: that.options.context,
          orginatingView: that,
          model: form
        });
        that.render();
      });
    },
    onRender: function () {
      if (!!this.formView) {
        var formViewRegion = new Marionette.Region({el: this.$el.find('.esoc-simple-user-widget-form-content')});
        formViewRegion.show(this.formView);
      }
    }

  });
  return SimpleUserWidgetFormView;
});