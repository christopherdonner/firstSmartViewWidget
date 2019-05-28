/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/form/pub.sub',
  'csui/models/version',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'hbs!csui/widgets/metadata/impl/tab.contents.header/tab.contents.header',
  'css!csui/widgets/metadata/impl/tab.contents.header/tab.contents.header', 'csui/lib/binf/js/binf'
], function (require, $, _, Backbone, Marionette, PubSub, VersionModel, lang,
    tabContentsHeaderTemplate) {
  'use strict';

  var TabContentsHeaderView = Marionette.ItemView.extend({

    tagName: 'div',

    className: 'csui-tab-contents-header',

    template: tabContentsHeaderTemplate,

    ui: {
      leftTabContentsHeader: '.csui-tab-contents-header-content',
      rightTabContentsHeader: '.csui-tab-contents-header-right',
      tabContentsHeaderTitle: '.csui-tab-contents-header-content h4',
      requiredSwitchEle: '.required-field-switch', //container of required field switch
      requiredSwitchIcon: '.required-field-switch > div.required-fields-switch'
    },

    events: {
      'click @ui.requiredSwitchIcon': 'onClickRequiredIconDiv',
      'keydown': 'onKeyInView'
    },

    constructor: function TabContentsHeaderView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.pubsubPostFix = (this.options.node instanceof VersionModel ? 'v' : 'p') +
                           this.options.node.get('id');

      this.requiredFieldsLabelId = _.uniqueId("requiredFields");

      var objPubSubId = 'pubsub:tab:contents:header:view:change:tab:title:' + this.pubsubPostFix;
      PubSub.off(objPubSubId);

      this.listenTo(PubSub, objPubSubId, this._changeTabTitle);

      this.listenTo(this.collection, 'add', function (model) {
        !!model.get('required') && this._showRequiredSwitch();
      });
      this.listenTo(this.collection, 'remove', function (model) {
        if (!this.isRequiredCatPresent()) {
          this._hideRequiredSwitch();
        }
      });

      this.listenTo(this, 'metadata:schema:updated', function (model) {
        if (!this.isRequiredCatPresent()) {
          this._hideRequiredSwitch();
        } else {
          this._showRequiredSwitch();
        }
      }, this);
    },

    templateHelpers: function () {
      return {
        onlyRequiredFieldsLabel: lang.onlyRequiredFieldsLabel,
        requiredFieldsLabelId: this.requiredFieldsLabelId
      };
    },

    _changeTabTitle: function (args) {
      this.$(this.ui.tabContentsHeaderTitle).html(args);
    },

    onRender: function () {
      this.requiredFieldSwitchModel = new Backbone.Model(
          {data: !!this.options.node.collection.requireSwitched});
      var self = this;
      require(['csui/controls/form/fields/booleanfield.view'], function (BooleanFieldView) {
        self.requiredFieldSwitchView = new BooleanFieldView({
          mode: 'writeonly',
          model: self.requiredFieldSwitchModel,
          labelId: self.requiredFieldsLabelId
        });
        self.requiredFieldSwitchView.render();
        self.listenTo(self.requiredFieldSwitchView, 'field:changed', function (event) {  //toggle
          var objPubSubId = 'pubsub:tab:contents:header:view:switch:' + self.pubsubPostFix;

          PubSub.trigger(objPubSubId, {on: event.fieldvalue});
          if (!!self.options.node.collection) {
            self.options.node.collection.requireSwitched = event.fieldvalue;
          }
        });
        self.$('.required-fields-switch').append(self.requiredFieldSwitchView.$el);
        if (self.isRequiredCatPresent()) {
          self._showRequiredSwitch();
        }

        PubSub.off('pubsub:header:rightbar:view:change:switch:status');
        self.listenTo(PubSub, 'pubsub:header:rightbar:view:change:switch:status', function (reset) {
          if (!!reset) {
            if (!!self.requiredFieldSwitchView.curVal) {
              self.requiredFieldSwitchView.$el.click();
            }
          } else if (!!self.requiredFieldSwitchModel &&
                     (self.requiredFieldSwitchModel.get('data') !== undefined &&
                     !self.requiredFieldSwitchModel.get('data')) && !!self.options.node &&
                     !!self.options.node.collection &&
                     !!self.options.node.collection.requireSwitched) {
            self.requiredFieldSwitchView.$el.click();
          }
        });

      });
    },

    currentlyFocusedElement: function (event) {
      if (!this.ui.requiredSwitchEle.hasClass('binf-hidden') && this.requiredFieldSwitchView) {
        return $(this.ui.requiredSwitchIcon.find(":input"));
      } else {
        return undefined;
      }
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 32 || event.keyCode === 13) {
        if (!this.ui.requiredSwitchEle.hasClass('binf-hidden') && this.requiredFieldSwitchView) {
          event.preventDefault();
          event.stopPropagation();
          setTimeout(_.bind(function () {
            $(target).click();
          }, this), 200);
        }
      }
      return undefined;
    },
    onClickRequiredIconDiv: function (event) {
      this.requiredFieldSwitchView.onClickWriteField(event);
    },

    _hideRequiredSwitch: function () {
      this.ui.tabContentsHeaderTitle.addClass('csui-tab-contents-header-title-full-width');
      this.ui.requiredSwitchEle.addClass('binf-hidden');
      !!this.requiredFieldSwitchView && !!this.requiredFieldSwitchView.getValue() &&
      this.requiredFieldSwitchView.ui.flagWriteField.trigger('click');
    },

    _showRequiredSwitch: function () {
      this.ui.tabContentsHeaderTitle.removeClass('csui-tab-contents-header-title-full-width');
      this.ui.requiredSwitchEle.removeClass('binf-hidden');
    },

    isRequiredCatPresent: function () {
      var isRequiredCatPresent = false,
          i                    = 0;
      for (; !isRequiredCatPresent && i < this.collection.models.length; i++) {
        isRequiredCatPresent = this.collection.models[i].get('required') === true;
      }
      return isRequiredCatPresent;
    }
  });

  return TabContentsHeaderView;

});
