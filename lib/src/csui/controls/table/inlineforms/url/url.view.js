/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!csui/controls/table/inlineforms/url/impl/nls/lang',
  'csui/controls/table/inlineforms/inlineform.registry',
  'csui/controls/table/inlineforms/inlineform/impl/inlineform.view',
  "hbs!csui/controls/table/inlineforms/url/impl/url",
  "css!csui/controls/table/inlineforms/url/impl/url"
], function (require, $, _, Marionette, lang, inlineFormViewRegistry, InlineFormView, template) {

  var InlineFormUrlView = InlineFormView.extend({

        className: function () {
          var className = "csui-inlineform-url";
          if (InlineFormView.prototype.className) {
            className += ' ' + _.result(InlineFormView.prototype, 'className');
          }
          return className;
        },

        template: template,

        templateHelpers: function () {
          var dataFromInlineFormView = this._templateHelpers();
          var url = this.model.get('url');
          var data = _.extend(dataFromInlineFormView, {
            url: url,
            namePlaceholder: lang.UrlNamePlaceholder,
            urlPlaceholder: lang.UrlAddressPlaceholder
          });
          return data;
        },

        ui: {
          urlFieldName: '.csui-inlineform-input-url'
        },

        events: {
          'keyup @ui.urlFieldName': 'keyReleased'
        },

        constructor: function InlineFormUrlView(options) {
          this.options = options || {};
          this.ui = _.extend({}, this.ui, InlineFormView.prototype.ui);
          this.events = _.extend({}, this.events, InlineFormView.prototype.events);

          this.relativeUrlRegexp = this.options.relativeUrlRegexp || /^\?func=[a-z0-9]/i;

          Marionette.ItemView.prototype.constructor.apply(this, arguments);
        },
        checkCustomFieldsInputVal: function () {
          return this._getInputUrl().trim().length !== 0;
        },
        checkCustomFieldsModel: function () {
          return !(!!this.model.get("url"));
        },
        _viewToModelDataExtended: function () {
          this.model.set('url', this._getInputUrl(), {silent: true});
        },

        _getInputUrl: function () {
          var url      = '',
              elInputs = this.ui.urlFieldName;

          elInputs.each(_.bind(function (idx, elInput) {
            var h = elInput.offsetHeight;
            if (h > 0) {
              url = $(elInput).val().trim();
              if (!url.match(this.relativeUrlRegexp)) {
                url = (!!url.match(/^[a-zA-Z]+:\/\//)) ? url : 'http://' + url;
              }
            }
          }, this));

          return url;
        },

        _saveIfOk: function () {
          var urlName    = this._getInputName(),
              urlAddress = this._getInputUrl();
          if (urlName.length > 0 && urlAddress.length > 0) {
            if (urlAddress.match(this.relativeUrlRegexp)) {
              this._save({name: urlName, url: urlAddress});
            } else {
              var self = this;
              require(['csui/lib/alpaca/js/alpaca'
              ], function (Alpaca) {
                var regexpUrl = Alpaca.regexps.url;
                if (urlAddress.match(regexpUrl)) {
                  self._save({name: urlName, url: urlAddress});
                } else {
                  self.model.set({'name': urlName, 'url': urlAddress}, {silent: true});
                  self.model.set('csuiInlineFormErrorMessage', lang.UrlInvalidFormat);
                }
              }, function (error) {
                self.model.set('csuiInlineFormErrorMessage', error.message);
              });
            }
          }
        }

      },
      {
        CSSubType: 140 // Content Server Subtype of Url is 140
      }
  );

  inlineFormViewRegistry.registerByAddableType(InlineFormUrlView.CSSubType, InlineFormUrlView);
  return InlineFormUrlView;
});
