/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/utils/url',
  'csui/utils/base',
  'csui/models/node/node.model',
  'csui/utils/contexts/factories/user',
  'csui/widgets/html.editor/impl/html.editor.model',
  'hbs!csui/widgets/html.editor/impl/html.editor', 'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/progressblocker/blocker',
  'csui/controls/error/error.view',
  'csui/widgets/html.editor/impl/cslink.preview/cslink.preview.view',
  'csui/controls/rich.text.editor/rich.text.editor',
  'csui/widgets/html.editor/impl/dropdown.menu/dropdown.menu.view',
  'csui/controls/globalmessage/globalmessage',
  'csui/utils/node.links/node.links',
  'i18n!csui/widgets/html.editor/impl/nls/lang',
  'hbs!csui/widgets/html.editor/impl/edit.icon',
  'hbs!csui/widgets/html.editor/impl/html.editor.action.buttons',
  'css!csui/widgets/html.editor/impl/html.editor'
], function ($, _, Backbone, Marionette, ConnectorFactory, Url, base, NodeModel, UserModelFactory,
    HtmlEditorModel, htmlEditorTemplate, ModalAlert,
    BlockingView, ErrorView,
    LinkPreview, RichTextEditor, DropdownMenu, GlobalMessage, NodeLinks, lang, template,
    htmlEditorButtonsTemplate) {

  'use strict';
  var HtmlEditorContentView = Marionette.ItemView.extend({

    className: 'csui-html-editor-wrapper',

    modelEvents: {
      'change': 'render',
      'error': 'render'
    },

    ui: {
      richText: '.csui-richtext-message'
    },

    events: {
      'mouseenter .csui-richtext-message[contenteditable="false"] a': '_showPreview',
      'focusin .csui-richtext-message[contenteditable="true"]': '_actionButtonsPositionInEdge',
      'focusin .csui-richtext-message[contenteditable="false"] a': '_updateUrl',
      'keyup': '_validateState'
    },

    getTemplate: function () {
      return this.model.error ? false : htmlEditorTemplate;
    },

    templateHelpers: function () {
      return {
        'placeholder': lang.PageDefaultContent,
        'id': this.model.get('id'),
        'data': this.model.get('data')
      };
    },

    constructor: function HtmlEditorContentView(options) {
      options || (options = {});
      options.id = options.wikiPageId;
      options = _.extend(options, (options.data = {}));
      this.parentView = options.parentView;
      this.ui.richTextEle = '#csui-richtext-content-body' + options.id;
      BlockingView.imbue(this);
      this.context = options.context;
      this.connector = this.context.getObject(ConnectorFactory);
      this.node = new NodeModel({
        id: options.id
      }, {
        connector: this.connector,
        expand: {
          properties: ['original_id', 'parent_id'], //parent_id -> we need image_folder_id
        },
        commands: ['permissions', 'properties', 'reserve', 'unreserve',
          'addcategory']
      });
      this.user = this.context.getModel(UserModelFactory);
      if (!options.model) {
        options.model = new HtmlEditorModel({
          connector: this.connector,
          context: this.context,
          id: options.id
        });
        var url = Url.combine(this.connector.connection.url,
            "nodes/" + options.id + "/content");
        options.model.fetch({
          url: url,
          success: options.model.fetchSuccess,
          error: options.model.fetchError,
          dataType: "text"
        }).done(_.bind(function (htmlContent) {
          this._getLatestVersion().done(_.bind(function () {
            this.oldVersion = this.model.get('version');
          }, this));
        }, this));
      }

      options.richTextElementId = 'csui-richtext-content-body-' + options.id;

      Marionette.ItemView.prototype.constructor.call(this, options);

      this._errorRegion = new Marionette.Region({
        el: this.el
      });

      this.listenTo(this.model, 'sync', _.bind(function () {
        if (!this.model.error) {
          this.user.ensureFetched().done(this._renderActionsDropdown.bind(this));
        }
      }, this));

      this.mode = 'read';
      this.utils = RichTextEditor.getRichTextEditorUtils();
      this.enableSaveButton = false;
    },

    onRender: function () {
      var error = this.model.error;
      this.$el[error ? 'addClass' : 'removeClass']('csui-disabled');
      if (error) {
        this._errorRegion.show(new ErrorView({
          model: new Backbone.Model({
            message: lang.noWikiPageFound
          })
        }));
      }
      this.$el.addClass(this.options.header ? '' : 'csui-html-editor-no-header');
      this.filterHtmlContent();
      this.refreshTabableElements();
    },
    filterHtmlContent: function () {
      this.$el.find('table').each(function (index, table) {
        $(table).css({
          'border': table.getAttribute('border') + 'px solid',
          'borderSpacing': table.getAttribute('cellspacing') + 'px',
          'text-align': table.getAttribute('align')
        }).removeAttr('cellpadding cellspacing border align');
        $(table).find('th,td').css('padding', table.getAttribute('cellpadding') + 'px');
      });
      this.$el.find('big').each(function (index, bigEle) {
        $(bigEle).replaceWith('<span class="csui-big">' + $(bigEle).html() + '</span>');
      });
    },

    refreshTabableElements: function () {
      if (this.mode === 'read') {
        this.tabableElements = this.$el.find('a').toArray();
      } else {
        this.tabableElements = [];
        this.tabableElements.push(this.editorInstance.element.$);
        this.tabableElements = this.tabableElements.concat(
            $('#cke_' + this.options.richTextElementId +
              ' .csui-html-editor-action-buttons > button:not([disabled])').toArray());
      }
      this.currentlyFocusedElementIndex = -1;
    },

    moveTab: function (event) {
      this.currentlyFocusedElementIndex = this.tabableElements.indexOf(event.target);
      if(this.currentlyFocusedElementIndex === -1) {
        return false;
      }
      var currentFocus  = $(this.tabableElements[this.currentlyFocusedElementIndex]),
          resetTabIndex = false;
      if (event.keyCode === 9) {
        if (event.shiftKey) {
          if (this.currentlyFocusedElementIndex > 0) {
            this.currentlyFocusedElementIndex -= 1;
            $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
            event.stopPropagation();
            event.preventDefault();
          } else {
            resetTabIndex = true;
          }
        } else {
          if (this.currentlyFocusedElementIndex < this.tabableElements.length - 1) {
            this.currentlyFocusedElementIndex += 1;
            $(this.tabableElements[this.currentlyFocusedElementIndex]).prop('tabindex', 0).focus();
            event.stopPropagation();
            event.preventDefault();
          } else {
            resetTabIndex = true;
          }
        }
        if (resetTabIndex) {
          if (this.mode === 'write') {
            if (event.shiftKey) {
              this.currentlyFocusedElementIndex = this.tabableElements.length - 1;
            } else {
              this.currentlyFocusedElementIndex = 0;
            }
            $(this.tabableElements[this.currentlyFocusedElementIndex]).focus();
          } else {
            currentFocus.bind('focusout', _.bind(function () {
              currentFocus.unbind('focusout');
              this.currentlyFocusedElementIndex = -1;
            }, this));
          }
        }
        if (this.mode === 'write') {
          event.stopPropagation();
          event.preventDefault();
        }
      }
    },

    _showPreview: function (event) {
      this.utils.getUrl(this, event).done(_.bind(function () { 
        this.options.targetEle = event.target;
        this.options.connector = this.connector; 
        var linkPreview = new LinkPreview(this.options);
        linkPreview.render();
      }, this));

    },

    _updateUrl: function (event) {
      this.utils.getUrl(this, event);
    },

    _renderActionsDropdown: function () {
      this.node.fetch().done(_.bind(function (response) {
        this.dropdownMenu = new DropdownMenu({
          openForEdit: this._openForEdit.bind(this),
          node: this.node,
          user: this.user,
          context: this.options.context,
          parentView: this
        });
        new Marionette.Region({
          el: this.parentView.$el.find(".tile-controls")
        }).show(this.dropdownMenu);

        this.grandParentEle = this.$el.closest('.csui-html-editor-grand-parent');

        this.listenTo(this.dropdownMenu, 'render', _.bind(function () {
          this.refreshTabableElements();
          this.trigger('refresh:tabindexes');
        }, this));

        this.editIconEle = this.parentView.$el.find(".tile-controls");
        if (!!this.options.header) {
          var tileHeaderEleTitle = this.options.titlefield || '';
          this.editIconEle.closest('.tile-header').attr({
            'title': tileHeaderEleTitle,
            'aria-label': tileHeaderEleTitle
          });
        }
      }, this));
    },

    editModeAccessibility: function () {
      $(document).on('keydown.html.editor', _.bind(function (event) {
        if (!$.contains($('#cke_' + this.options.richTextElementId +
                          '.csui-rich-text-editor-toolbar .cke_inner')[0], event.target)) {
          if (event.keyCode === 9) {
            this.moveTab(event);
          } else if ([13, 32].indexOf(event.keyCode) !== -1 &&
                     $(event.target).hasClass('csui-html-edit-icon')) {
            $(event.target).click();
            event.preventDefault();
          }
        }
      }, this));
    },

    removeEditModeAccessibility: function () {
      $(document).off('keydown.html.editor');
    },

    _openForEdit: function () {
      this.editModeAccessibility();
      this.blockActions();
      this._getLatestVersion().done(_.bind(function () {
        this._toggleReserve(true).done(_.bind(function () {
          if (this.oldVersion === this.model.get('version')) {
            this._getLatestContent().done(_.bind(function () {
              this._editContent();
            }, this));

          } else {
            ModalAlert.confirmQuestion(_.bind(function (result) {

              if (result) {
                this._editContent();
                this.enableSaveButton = true;
              } else {
                this._getLatestContent().done(_.bind(function () {
                  this._editContent();
                  this.oldVersion = this.model.get('version');
                  this.enableSaveButton = false;
                }, this));
              }

              this.alreadyTriggered = true;

            }, this), lang.versionDifferenceConfirmMessage, lang.versionDifferenceConfirmTitle);

          }
        }, this)).fail(this.unblockActions.bind(this));
      }, this)).fail(this.unblockActions.bind(this));
      if (base.isAppleMobile()) {
        this.$el.find(".csui-richtext-message").attr("contenteditable", true).focus();
      }
    },

    _editContent: function () {
      var self            = this,
          url             = this.connector.connection.url,
          ckeditorConfig  = {
            'skin': 'otskin,' + this.connector.connection.supportPath +
                    '/csui/lib/ckeditor/skins/otskin/',
            'custcsuiimage_imageExtensions': 'gif|jpeg|jpg|png',
            'filebrowserUploadUrl': url.substring(0, url.indexOf('api')),
            'floatingWrapper': this.grandParentEle,
            'extraPlugins': 'csfloatingspace,filebrowser,custimage,custcsuiimage,find,panelbutton,colorbutton,' +
                            'font,selectall,smiley,dialog,sourcedialog,print,preview,justify,' +
                            'save,cancel,cssyntaxhighlight,cslink',
            'removePlugins': 'image,floatingspace',
            'cancel': {
              label: 'Cancel',
              onCancel: function (e) {
                self.blockActions();
                var contentDiv       = self.editorInstance,
                    isContentChanged = e.getData().length ?
                                       contentDiv.checkDirty() :
                                       self.model.get('data') !== lang.PageDefaultContent;

                if (isContentChanged) {
                  ModalAlert.confirmQuestion(function (result) {
                    if (result) {
                      self._getLatestVersion().done(function () {
                        if (self.oldVersion !== self.model.get('version')) {
                          self._getLatestContent().done(_.bind(function () {
                            self.oldVersion = this.model.get('version');
                            e.setData(self.model.get('oldData'));
                          }, self));
                        } else {
                          e.setData(self.model.get('oldData'));
                        }
                        self.trigger('updateScrollbar');
                        destroyCKEditor(e);
                        self.autoSaved && self.deleteAutoSavedContent({
                          connector: self.connector,
                          wikiId: self.node.get('parent_id'),
                          pageId: self.model.get('id')
                        });
                        self._toggleReserve();
                      });
                    } else {
                      $(self.options.richTextElementId).focus();
                      self.unblockActions();
                    }
                  }, lang.CancelConfirmMessage, lang.cancelTitle);
                } else {
                  self._getLatestVersion().done(function () {
                    if (self.oldVersion !== self.model.get('version')) {
                      self._getLatestContent().done(_.bind(function () {
                        self.oldVersion = this.model.get('version');
                        e.setData(self.model.get('oldData'));
                      }, self));
                    } else {
                      e.setData(self.model.get('oldData'));
                    }
                    destroyCKEditor(e);
                    self._toggleReserve();
                  });


                }

              }
            },
            'save': {
              label: 'Save',
              url: self.connector.connection.url + '/nodes/' + self.options.id,
              type: "PUT",
              useJSON: false,
              ticket: self.connector.connection.session.ticket,
              postData: function (editor) {
                return {
                  TextField: editor.getData()
                };
              },
              onSave: function (editor) {
                self.blockActions();
                self._getLatestVersion().done(function () {
                  if (!!self.alreadyTriggered || self.oldVersion === self.model.get('version')) {
                    self.enableSaveButton = false;
                    self.alreadyTriggered = false;
                    self._saveContent(editor);
                  } else {
                    ModalAlert.confirmQuestion(function (result) {
                          if (result) {
                            self.enableSaveButton = false;
                            self._saveContent(editor);
                          } else {

                            $(self.options.richTextElementId).focus();
                            self.unblockActions();
                          }
                        }, lang.versionDifferenceConfirmMessage,
                        lang.versionDifferenceConfirmTitle);
                  }
                });
              },
              onSuccess: function (editor, data) {
                self.model.set({
                  'data': editor.getData(),
                  'oldData': editor.getData()
                });
                self._getLatestVersion().done(function () {
                  self.oldVersion = self.model.get('version');
                  destroyCKEditor(editor);
                });

              },
              onFailure: function (editor, status, request) {
                destroyCKEditor(editor);
                self.render();
                self.trigger('updateScrollbar');
              }
            },
            'image': {
              url: self.connector.connection.url.replace("/api/v1", "")
            },
            'addimage': {
              url: function () {
                return url + "/nodes";
              },
              imageBrowseEnabled: function () {
                return self.node.get('parent_id_expand').imagebrowseenabled;
              },
              parent_id: self.node.get('parent_id_expand').image_folder_id,
              type: "POST",
              documentType: 144,
              ticket: self.connector.connection.session.ticket
            }
          },
          ckeditor        = RichTextEditor.getRichTextEditor(ckeditorConfig),
          destroyCKEditor = function (CKEditor) {
            $(".csui-rich-text-mask").remove();
            $(".csui-html-editor-zindex").removeClass('csui-html-editor-zindex');
            $("#csui-richtext-sharedspace").remove();
            $(".cui-rich-editor-widget-wrapper").removeAttr('style');
            self.editIconEle.removeClass('binf-hidden');
            self.$el.find(".csui-richtext-message").attr("contenteditable", false);
            CKEditor.destroy();
            self.unblockActions();
            self._unbindEvents();
            self.parentView.$el.find(".csui-html-editor-action-buttons").remove();
            $(window).unbind('resize');
            self.removeEditModeAccessibility();
            self.mode = 'read';
            self.refreshTabableElements();
            $('.csui-html-editor-zero-zindex').removeClass('csui-html-editor-zero-zindex');
          };

      var $rteEle = self.$("#" + this.options.richTextElementId);
      $rteEle.attr("contenteditable", true);

      this.editIconEle.addClass('binf-hidden');
      var rteMask          = document.createElement('div'),
          rteBodyMask      = document.createElement('div'),
          defaultContainer = $.fn.binf_modal.getDefaultContainer();

      rteMask.className = 'csui-rich-text-mask';
      rteBodyMask.className = 'csui-rich-text-mask csui-rich-text-body-mask';

      self.grandParentEle.before(rteMask);
      $(defaultContainer).append(rteBodyMask);

      if (base.isMSBrowser()) {
        !!$('#breadcrumb-wrap') &&
        $('#breadcrumb-wrap').addClass('csui-html-editor-zero-zindex');
      }

      var $rteMask     = $(rteMask),
          $rteBodyMask = $(rteBodyMask),
          $maskOfffset = this.grandParentEle.find('.csui-html-editor-no-header').length > 0 ?
                         5 :
                         80,
          resetMasking = function () {
            $rteEle.closest('.ps-container').scrollTop(0);
            $rteBodyMask.css("height", "0px");
            $rteMask.css("top", "0px");

            var rteMaskTop        = ($rteEle.offset().top - $(rteMask).offset().top -
                                     $maskOfffset),
                rteBodyMaskHeight = $rteEle.offset().top - $maskOfffset;

            rteBodyMaskHeight = rteMaskTop < 0 ? rteBodyMaskHeight + -rteMaskTop :
                                rteBodyMaskHeight;
            rteMaskTop = rteMaskTop < 0 ? 0 : rteMaskTop;

            $rteBodyMask.css("height", rteBodyMaskHeight + "px");
            $rteMask.css({
              "height": document.body.scrollHeight - rteBodyMask.offsetHeight,
              "top": rteMaskTop
            });

            $(rteMask).parent().addClass('csui-html-editor-zindex');
          };

      resetMasking();
      $(window).bind('resize', resetMasking);
      $('.csui-richtext-message').bind('change', resetMasking);

      window.onbeforeunload = function (e) {
        return false;
      };

      require(['csui/dialogs/node.picker/node.picker'], function (NodePicker) {
        ckeditor.config.csLink = {
          lang: {
            insertContentServerLink: lang.insertContentServerLink
          },
          nodeLink: NodeLinks,
          nodePicker: function () {
            return new NodePicker({
              connector: self.connector,
              dialogTitle: lang.contentServerLink,
              context: self.options.context,
              resolveShortcuts: true,
              resultOriginalNode: false,
              currentUser: self.options.context.getModel(UserModelFactory)
            });
          },
          enableSaveButton: function () {
            self._enableSaveButton();
          }
        };
      });

      self.editorInstance = ckeditor.inline(this.options.richTextElementId, {
        toolbar: [
          ['Undo', 'Redo', '-', 'FontSize', '-', 'Styles', 'Format', 'TextColor', '-', 'Bold',
            'Italic'],
          '/',
          ['Replace', '-', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-',
            'JustifyLeft', 'JustifyCenter', 'JustifyRight', '-', 'Link', 'cslink', '-',
            'addImage', 'Table', 'Sourcedialog']
        ]
      });

      ckeditor.once('instanceReady', function (event) {
        if (self.ui.richText.text().trim() === lang.PageDefaultContent) {
          self.ui.richText.empty();
        }
        self.mode = 'write';
        $("#cke_" + self.options.richTextElementId).addClass(
            'csui-rich-text-editor-toolbar');
        self.unblockActions();
        self._appendActionButtons();
        event.editor.focus();
        self.$el.find('.csui-richtext-message').focus();
        self.editorInstance.on('change', _.throttle(function () {
          self._autoSaveContent(ckeditor);
        }, self.options.autosaveInterval, {
          leading: false
        }));
        self.editorInstance.on('change', function () {
          self._validateState();
        });
        self._actionButtonsPosition();
        self._actionButtonsPositionInEdge();
        self.refreshTabableElements();

        if (!!self.autoSaved) {
          self.deleteAutoSavedContent({
            connector: self.connector,
            wikiId: self.node.get('parent_id'),
            pageId: self.model.get('id')
          });
        }
      });

    },

    _saveContent: function (editor) {
      editor.config.save.request.send(editor.config.save.json);
      this.autoSaved && this.deleteAutoSavedContent({
        connector: this.connector,
        wikiId: this.node.get('parent_id'),
        pageId: this.model.get('id')
      });
      this._toggleReserve();
    },

    _disableSaveButton: function () {
      var toolbar    = $("#cke_csui-richtext-content-body-" + this.id),
          saveButton = toolbar.find(".csui-html-edit-save");
      if (saveButton.length) {
        saveButton[0].disabled = true;
      }

    },
    _enableSaveButton: function () {
      var toolbar    = $("#cke_csui-richtext-content-body-" + this.id),
          saveButton = toolbar.find(".csui-html-edit-save");
      if (saveButton.length) {
        saveButton[0].disabled = false;
      }

    },

    _toggleReserve: function (toEditMode) {
      var deferred = $.Deferred();
      if (!!toEditMode && this.node.get('reserved')) {
        if (this.node.get('reserved_user_id') === this.user.get('id')) {
          deferred.resolve();
          return deferred;
        }
      }
      var contentUrl = this.connector.connection.url + '/nodes/' + this.node.get('id'),
          self       = this,
          formData   = new FormData();
      if (!!toEditMode) {
        !this.node.get('reserved') && formData.append('reserved_user_id', this.user.get('id'));
      } else {
        this.node.get('reserved') && formData.append('reserved_user_id', null);
      }
      this.updateAjaxCall({
        url: contentUrl,
        connector: this.connector,
        data: formData,
        type: 'PUT'
      }).done(function () {
        deferred.resolve();
      }).fail(function (xhr) {
        deferred.reject();
      }).always(function () {
        self.node.fetch();
      });
      return deferred;
    },

    _autoSaveContent: function (ckeditor) {
      var contentDiv = this.editorInstance;
      if (!!contentDiv && contentDiv.checkDirty()) {
        contentDiv.resetDirty();
        var source   = contentDiv.getData(),
            formData = new FormData();
        formData.append("wikiId", this.node.get('parent_id'));
        formData.append("pageId", this.model.get('id'));
        formData.append("source", source);

        this.updateAjaxCall({
          connector: this.connector,
          url: this.connector.connection.url.replace('api/v1', 'api/v2') +
               "/wiki/autosave",
          type: "POST",
          data: formData,
          view: this
        });
        this.autoSaved = true;
      }
    },

    _getLatestContent: function () {
      var ajaxParams = {
        "url": this.connector.connection.url.replace('/api/v1', '/api/v2') + "/wiki/" +
               this.model.get('id') + "/autosave",
        "type": "GET",
        "requestType": "getContent",
        "connector": this.connector,
        "view": this
      };
      return this.updateAjaxCall(ajaxParams);
    },

    _getLatestVersion: function () {
      var ajaxParams = {
        "url": this.connector.connection.url.replace('/api/v1', '/api/v2') + "/nodes/" +
               this.model.get('id'),
        "type": "GET",
        "requestType": "versions-reserve",
        "connector": this.connector,
        "view": this
      };
      return this.updateAjaxCall(ajaxParams);
    },

    _validateState: function () {
      this.utils = this.utils || RichTextEditor.getRichTextEditorUtils();
        var  editorText=  RichTextEditor.isEmptyContent(this.editorInstance);
  
       if (!!this.editorInstance && this.editorInstance.checkDirty() &&
          !(editorText === lang.PageDefaultContent || editorText.length === 0)) {
        this._enableSaveButton();
        this.refreshTabableElements();
      } else {
        this._disableSaveButton();
        this.refreshTabableElements();
      }
    },
    _appendActionButtons: function () {
      var toolbar = $("#cke_csui-richtext-content-body-" + this.id),
          data    = {
            'saveLabel': lang.saveTitle,
            'cancelLabel': lang.cancelTitle,
            'cancelAria': lang.cancelAria,
            'saveAria': lang.saveAria
          };

      toolbar.append(htmlEditorButtonsTemplate(data));

      toolbar.find(".csui-html-edit-save").on("click", _.bind(function () {
        this.editorInstance.execCommand('save');
      }, this));

      toolbar.find(".csui-html-edit-cancel").on("click", _.bind(function () {
        this.editorInstance.execCommand('cancel');
      }, this));
    },

    _actionButtonsPosition: function () {
      if (!!this.enableSaveButton) {
        this._enableSaveButton();
        this.refreshTabableElements();
      } else {
        this._disableSaveButton();
        this.refreshTabableElements();
      }
    },

    _actionButtonsPositionInEdge: function () {
      var toolbar = $("#cke_csui-richtext-content-body-" + this.id);
      if (base.isEdge() && toolbar.attr("style").indexOf('right') !== -1) {
        toolbar.find('.cke_inner').css('float', 'right');
      }
    },

    _unbindEvents: function () {
      window.onbeforeunload = null;
    },

    updateAjaxCall: function (args) {
      var deferred    = $.Deferred(),
          url         = args.url,
          data        = args.data,
          type        = args.type,
          connector   = args.connector,
          self        = args.view,
          requestType = args.requestType;
      $.ajax(connector.extendAjaxOptions({
        url: url,
        type: type,
        data: data,
        contentType: false,
        crossDomain: true,
        processData: false,
        success: function (response, status, jXHR) {
          switch (requestType) {
          case "getContent":
            if (!!response.results.data.autoSaved) {
              self.autoSaved = true;
              ModalAlert.confirmQuestion(function (result) {
                    var content = response.results.data.content;
                    if (result) {
                      content = response.results.data.autoSaved;
                      self.enableSaveButton = true;
                    } else {
                      self.enableSaveButton = false;
                    }
                    self.model.set({
                      'data': content,

                    });
                    deferred.resolve();
                  }, lang.RestoreDialogMessage, lang.RestoreDiaglogTitle,
                  ModalAlert.buttonLabels.Yes = lang.Continue,
                  ModalAlert.buttonLabels.No = lang.Discard);
            } else {
              self.model.set({
                'data': response.results.data.content,
                'oldData': response.results.data.content
              });
              deferred.resolve();
            }
            break;
          case 'versions-reserve':
            self.model.attributes.version = response.results.data.versions.length;
            self.node.set({
              'reserved': response.results.data.properties.reserved,
              'reserved_user_id': response.results.data.properties.reserved_user_id
            });

            deferred.resolve();
            break;
          default:
            deferred.resolve(response);
          }
        },
        error: function (xhr, status, text) {
          deferred.reject(xhr);
        }
      }));
      return deferred.promise();
    },

    deleteAutoSavedContent: function (args) {
      if (this.autoSaved) {
        args.type = "DELETE";
        args.url = args.connector.connection.url.replace('/api/v1', '/api/v2') + "/wiki/" +
                   args.wikiId + "/autosave/" + args.pageId;
        this.updateAjaxCall(args);
        this.autoSaved = false;
      }
      window.clearInterval(this.intervalId);
    }
  });

  return HtmlEditorContentView;

});
