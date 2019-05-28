/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/help/impl/nls/localized.strings',
  'i18n', 'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/server.module/server.module.collection', 'csui/lib/othelp',
  'hbs!csui/widgets/navigation.header/controls/help/impl/help'
], function (module, _, $, Marionette, localizedStrings, i18n, TabableRegionBehavior,
    ServerModuleCollection, OTHHUrlBuilder, template) {
  'use strict';
  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/pages/start/impl/navigationheader/navigationheader.view'] || {};
  _.extend(config, module.config());
  config.help || (config.help = {});
  _.defaults(config.help, {
    language: i18n.settings.locale.replace(/[-_]\w+$/, ''),
    preserve: true
  });
  if (config.help.urlRoot === '') {
    config.help.urlRoot = undefined;
  }
  if (config.help.tenant === '') {
    config.help.tenant = undefined;
  }
  if (config.help.type === '') {
    config.help.type = undefined;
  }

  var HelpView = Marionette.ItemView.extend({
    tagName: 'a',

    attributes: {
      href: '#',
      title: localizedStrings.HelpIconTitle,
      'aria-label': localizedStrings.HelpIconAria
    },

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.HelpIconTitle
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 50
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function HelpView(options) {
      Marionette.ItemView.call(this, options);
      this.listenTo(this, 'click:help', this._onClick);
    },

    onRender: function () {
      var self = this;
      this.$el.click(function () {
        self.triggerMethod('click:help');
      });
      this.$el.keydown(function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
          self.triggerMethod('click:help');
        }
      });
    },

    _onClick: function () {
      var serverModules = new ServerModuleCollection();

      serverModules
          .fetch()
          .then(function () {
            var modulesWithHelp;
            var urlBuilder;
            var documentsOptions;
            var helpURL;
            var browserTab;

            modulesWithHelp = serverModules.filter(function (serverModule) {
              return !!serverModule.get('helpDocId');
            });

            urlBuilder = new OTHHUrlBuilder({
              urlRoot: config.help.urlRoot
            });

            documentsOptions = {
              preserve: config.help.preserve,
              documents: []
            };
            _.each(modulesWithHelp, function (serverModule, index) {
              var currmodule = serverModule.get('helpDocId');
              documentsOptions.documents.push({
                module: currmodule,
                active: (index === 0),
                topic: (currmodule.indexOf('cssui') === 0 ? 'sui-overview-bg' : undefined)
              });
            });

            helpURL = urlBuilder.buildHelpUrl(config.help.language,
                documentsOptions, {
                  tenant: config.help.tenant,
                  type: config.help.type,
                  options: { search: 'allModules' }
            });

            browserTab = window.open(helpURL, '_blank');
            browserTab.focus();
	}, function (error) {
		console.error(error);
	});
    }
  });

  return HelpView;
});
