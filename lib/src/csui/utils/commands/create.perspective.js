/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command', 'csui/utils/commandhelper', 'csui/utils/url',
  'csui/models/perspective/perspective.model',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, $, CommandModel, CommandHelper,
    Url, PerspectiveModel, lang) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/contexts/perspective'] || {};
  config = _.extend({
    enableInlinePerspectiveEditing: false
  }, config, module.config());

  var ConnectorFactory, NodeModelFactory, AncestorCollectionFactory;

  var CreatePerspectiveCommand = CommandModel.extend({

    defaults: {
      signature: 'CreatePerspective',
      name: lang.CreatePerspective
    },

    enabled: function (status, options) {
      var context    = status.context || options && options.context,
          attributes = context.perspective.attributes;
      if (attributes.id === undefined && attributes.canEditPerspective &&
          context._applicationScope.attributes.id === "node") {
        return true;
      }
      return false;
    },

    execute: function (status, options) {
      var context         = status.context || options && options.context,
          isInlineEditing = (options && options.inlinePerspectiveEditing) ||
                            config.enableInlinePerspectiveEditing;
      if (isInlineEditing) {
        return this._editInline(status, options, context);
      } else {
        return this._editInClassicPMan(status, options, context);
      }
    },
    _preparePerspectiveConfig: function (context) {
      var perspectiveConfig = {
            "perspective": {
              "type": "flow",
              "options": {
                "widgets": [
                  {
                    "type": "csui/widgets/nodestable"
                  }
                ]
              }
            },
            "overrideType": "genericContainer",
            "scope": "local",
            "containerType": "-1",
            "cascading": "false"
          },
          node              = CommandHelper.getJustOneNode(status) ||
                              context.getModel(NodeModelFactory),
          collection        = context.getCollection(AncestorCollectionFactory);
      perspectiveConfig.nodepath = this._getNodePath(collection);
      perspectiveConfig.node = node.get('id');
      perspectiveConfig.containerType = node.get('type');
      perspectiveConfig.title = node.get('name');
      return perspectiveConfig;
    },

    _editInline: function (status, options, context) {
      var deferred = $.Deferred(), self = this;
      require(['csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/connector',
        'csui/utils/contexts/factories/ancestors',
        'csui/perspective.manage/pman.view'
      ], function () {
        NodeModelFactory = arguments[0];
        ConnectorFactory = arguments[1];
        AncestorCollectionFactory = arguments[2];
        var PManView          = arguments[3],
            perspectiveConfig = self._preparePerspectiveConfig(context, NodeModelFactory,
                AncestorCollectionFactory);
        perspectiveConfig.title = perspectiveConfig.title + ' ' + new Date().getTime();
        var perspective = new PerspectiveModel(perspectiveConfig,
            {connector: context.getObject(ConnectorFactory)});
        var pmanView = new PManView({
          context: context,
          perspective: perspective
        });
        pmanView.show();
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise();
    },

    _editInClassicPMan: function (status, options, context) {
      var deferred = $.Deferred(), self = this;
      require(['csui/utils/contexts/factories/connector',
        'csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/ancestors'
      ], function () {
        ConnectorFactory = arguments[0];
        NodeModelFactory = arguments[1];
        AncestorCollectionFactory = arguments[2];
        var f = self._getForm(context, status);
        f.submit();
        f.remove();
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise();
    },

    _getForm: function (context, status) {
      var f = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
        action: this._getUrl(context, status)
      }).appendTo(document.body);

      var params = this._getUrlQueryParameters(context, status);

      for (var i in params) {
        if (params.hasOwnProperty(i)) {
          $('<input type="hidden" />').attr({
            name: i,
            value: params[i]
          }).appendTo(f);
        }
      }

      return f;
    },

    _getUrl: function (context, status) {
      var connector      = context.getObject(ConnectorFactory),
          cgiUrl         = new Url(connector.connection.url).getCgiScript(),
          perspectiveUrl = cgiUrl.toString() + "/perspectivemgr";

      return perspectiveUrl;
    },

    _getUrlQueryParameters: function (context, status) {
      var perspectiveConfig = this._preparePerspectiveConfig(context, NodeModelFactory,
          AncestorCollectionFactory);
      perspectiveConfig.ui = {
        "elements": {
          "btn-mode-code": true,
          "btn-view-general": true,
          "btn-view-rules": false,
          "btn-view-layout": true,
          "btn-view-widgets": true,

          "view-perspective-action": true,
          "perspective-action-create": true,
          "perspective-action-edit": true,
          "perspective-action-copy": true,

          "view-perspective-form": true,
          "perspective-title": true,
          "perspective-type": true,
          "perspective-scope": true,
          "perspective-nodetypes": true,
          "perspective-node": true,
          "perspective-cascading": true,

          "display-size-msg": false,
          "rules-code": true,

          "layout-flow": true,
          "layout-left-center-right": true,
          "layout-grid": false,
          "layout-tabbed": false
        },
        "widgetGroupsBlacklist": [],
        "widgetsWhitelist": [],
        "disableGrouping": false
      };
      return {
        config: JSON.stringify(perspectiveConfig)
      };
    },

    _getNodePath: function (collection) {
      var nodepath = "";
      collection.each(function (model) {
        nodepath += nodepath ? ':' : '';
        nodepath += model.get('name');
      });
      return nodepath;
    }

  });

  return CreatePerspectiveCommand;
});
