/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/ckeditor/ckeditor',
      'csui/controls/rich.text.editor/impl/rich.text.util',
      'css!csui/widgets/html.editor/impl/html.editor',
      'css!csui/lib/ckeditor/plugins/cssyntaxhighlight/styles/shCoreDefault'
    ],
    function ($, _, Backbone, ckeditor, RichTextEditorUtils) {
      'use strict';

      var getCSSName = function (part) {
        var uas = window.CKEDITOR.skin['ua_' + part],
            env = window.CKEDITOR.env;
        if (uas) {
          uas = uas.split(',').sort(function (a, b) {
            return a > b ? -1 : 1;
          });
          for (var i = 0, ua; i < uas.length; i++) {
            ua = uas[i];

            if (env.ie) {
              if ((ua.replace(/^ie/, '') == env.version) || (env.quirks && ua == 'iequirks')) {
                ua = 'ie';
              }
            }

            if (env[ua]) {
              part += '_' + uas[i];
              break;
            }
          }
        }
        return part + '.css';
      };

      var getRichTextEditor = function (config) {
        config = config || {};
        _.each(ckeditor.instances, function (ckInstance) {
          ckInstance.destroy();
        });

        var csuiDefaults = {
          custcsuiimage_imageExtensions: 'gif|jpeg|jpg|png',
          skin: 'otskin',
          format_tags: 'p;h1;h2;h3;h4;h5',
          allowedContent: true,
          disableAutoInline: true,
          autoHideToolbar: false,
          title: false,
          cs_syntaxhighlight_hideGutter: true,
          enterMode: ckeditor.ENTER_P,
          extraPlugins: 'filebrowser,find,panelbutton,colorbutton,font,selectall,smiley,dialog,' +
                        'sourcedialog,print,preview,justify,save,cancel,cssyntaxhighlight,cslink',
          toolbar: [
            ['Undo', 'Redo', '-', 'Font', 'FontSize', '-', 'Styles', 'Format', 'TextColor'],
            '/',
            ['Bold', 'Italic', 'Blockquote', '-', 'Replace', '-', 'NumberedList',
              'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter',
              'JustifyRight', '-', 'Link', 'cslink', '-', 'Image', 'Table', 'Sourcedialog']
          ]
        };

        if (config.externalPlugins) {
          if (!_.isArray(config.externalPlugins)) {
            throw TypeError('externalPlugins must be array type');
          } else {
            if (config.externalPluginsBasePath &&
                typeof config.externalPluginsBasePath === 'string') {
              if (config.externalPluginsBasePath.charAt(
                      config.externalPluginsBasePath.length - 1) !== '/') {
                config.externalPluginsBasePath += '/';
              }
              var extraPlugins = [];
              config.externalPlugins.map(function (pluginName) {
                ckeditor.plugins.addExternal(pluginName,
                    config.externalPluginsBasePath + pluginName + '/', 'plugin.js');
                extraPlugins.push(pluginName);
              });
              delete config.externalPlugins;
              delete config.externalPluginsBasePath;
              extraPlugins = extraPlugins.join();
              if (!!config.extraPlugins) {
                if (config.extraPlugins.length) {
                  extraPlugins = config.externalPlugins + ',' + extraPlugins;
                }
                config.extraPlugins = extraPlugins;
              } else {
                csuiDefaults.extraPlugins += ',' + extraPlugins;
              }
            } else {
              throw Error('externalPluginsBasePath option missing or is not a string');
            }
          }
        }

        config = _.defaults(config, csuiDefaults, ckeditor.config);
        ckeditor.config = config;
        ckeditor.on("dialogDefinition", function (event) {
          var dialogName = event.data.name,
              dialogDefinition = event.data.definition;
          event.data.definition.dialog.getElement().addClass('csui-ckeditor-control-dialog');
          event.data.definition.dialog.getElement().addClass('csui-ckeditor-dialog-' + dialogName);

          if (dialogName == 'link') {
            if (!config.linkShowUploadTab) {
              var uploadTab = dialogDefinition.getContents('upload');
              uploadTab.hidden = true;
            }
          }
        });
        var skin   = config.skin.split(','),	//skin[0] = skin name, skin[1] = skin path
            dialog = getCSSName('dialog'),
            editor = getCSSName('editor');
        $('head link[href*="ckeditor/skins/' + skin[0] + '/' + editor +
          '"], head link[href*="ckeditor/skins/' + skin[0] + '/' + dialog + '"]').remove();
        window.CKEDITOR.document.appendStyleSheet(skin[1] + editor);
        window.CKEDITOR.document.appendStyleSheet(skin[1] + dialog);
        return ckeditor;
      };

      var getRichTextEditorUtils = function getRichTextEditorUtils() {
        return RichTextEditorUtils;
      };

      var isEmptyContent = function (content) {
        return !!content &&
               content.getData().replace(/<\/div>|<div>|<\/p>|<p>|&nbsp;|<br \/>|\s/g, '');
      };

      return {
        getRichTextEditor: getRichTextEditor,
        getRichTextEditorUtils: getRichTextEditorUtils,
        isEmptyContent: isEmptyContent
      };
    });