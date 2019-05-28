csui.define(['module',
      'csui/lib/jquery',
      'csui/lib/underscore',
      'esoc/widgets/socialactions/mentions',
      'csui/utils/namedsessionstorage',
      'csui/utils/url',
      'csui/utils/base',
      'csui/dialogs/node.picker/node.picker',
      'hbs!esoc/widgets/socialactions/attachmentpopovertemplate',
      'hbs!esoc/widgets/socialactions/maskingtemplate',
      'esoc/widgets/common/util',
      'csui/utils/nodesprites',
      'csui/utils/user.avatar.color',
      'esoc/widgets/userwidget/userwidget',
      'i18n!esoc/widgets/socialactions/nls/lang',
      'i18n'
    ],
    function (module, $, _, Mentions, NamedSessionStorage, URL, Base, NodePicker,
        AttachmentPopoverTemplate, MaskingTemplate, CommonUtil, NodeSpriteCollection,
        UserAvatarColor, UserWidget,
        Lang, i18n) {

      var Utils = {
        commonUtil: CommonUtil,
        base: Base,
        namedSessionStorage: new NamedSessionStorage("esoc-user-mentions-info"),
        attachmentPopoverTemplate: AttachmentPopoverTemplate,
        maskingTemplate: MaskingTemplate,
        lang: Lang,

        /**
         * this method updates the current model, and requires the below arguments
         * @param args = {url, type, data {id, status, ATT_ID, replace}, dataType, model}
         */
        updateCommentAjaxCall: function (args) {
          var commentListItem = args.model,
              commentToDelete = commentListItem.model;
          if (args.requestType === 'AttachmentDelete') {
            $.ajax(commentListItem.options.model.collection.connector.extendAjaxOptions({
              url: args.url,
              type: args.type,
              dataType: args.dataType,
              data: args.data,
              success: this.onDeleteSuccess.bind(this, args),
              error: this.onDeleteFailure.bind(this, args)
            }));
          }
          else {
            commentToDelete.destroy({
              wait: true,
              success: this.onDeleteSuccess.bind(this, args),
              error: this.onDeleteFailure.bind(this, args)
            });
          }
        },
        onDeleteSuccess: function (args, data, status, jXHR) {
          var commentListItem         = args.model,
              requestType             = args.requestType,
              commentsCollectionModel = commentListItem.collection,
              self                    = this,
              commentToDelete         = commentListItem.model;

          // TODO: call success callback
          commentListItem.options.commentConfigOptions.commentAction = true;
          var max_id        = commentListItem.collection.models.length,
              fetchNextPage = false,
              model         = commentListItem.collection.models[max_id - 1];
          model = model || args.model.model;
          max_id = model.id;

          switch (requestType) {
          case 'CommentDelete':
            if (commentsCollectionModel.models.length) {
              fetchNextPage = !(commentsCollectionModel.models[commentsCollectionModel.models.length -
                                                               1].attributes.noMoreData);
              fetchNextPage = fetchNextPage &&
                              commentsCollectionModel.models.length ===
                              self.commonUtil.globalConstants.FETCH_NEXT_PAGE_MODELS_LENGTH;
            }
            self.hideMask(commentListItem.$el);
            commentListItem.destroy();
            commentsCollectionModel.remove(commentListItem.model);
            if (fetchNextPage) {
              commentsCollectionModel.defaults.params[self.commonUtil.globalConstants.MAX_ID] = max_id;
              commentsCollectionModel.fetch({remove: false});
            }
            var totalComments = 0;
            if (jXHR.xhr.responseJSON) {
              totalComments = jXHR.xhr.responseJSON.commentCount;
            } else {
              totalComments = commentListItem.collection.models.length;
              if (commentListItem.collection.find(commentToDelete)) {
                totalComments--;
              }
            }
            if (commentListItem.options.commentConfigOptions.tablecellwidget) {
              commentListItem.util.commonUtil.updateCommentCount({
                currentNodeModel: commentListItem.options.commentConfigOptions.currentNodeModel,
                commentCount: totalComments
              });
            }
            if (commentsCollectionModel.models.length === 0) {
              $("#esoc-social-comment-container").find(
                  ".esoc-social-comment-body-divider").each(function () {
                $(this).remove();
              });
              $("#esoc-social-comment-container").css("border-bottom", "0px solid #ffffff");
              $("#esoc-social-comment-form-buttons-container").addClass(
                  "esoc-social-form-minheight");
            }
            break;
          case 'ReplyDelete':
            var showSeeMoreLink = false;
            if (commentsCollectionModel.models.length > 0) {
              showSeeMoreLink = !commentsCollectionModel.models[commentsCollectionModel.models.length -
                                                                1].attributes.noMoreData;
            }
            fetchNextPage = showSeeMoreLink &&
                            commentsCollectionModel.models.length ===
                            self.commonUtil.globalConstants.FETCH_NEXT_PAGE_MODELS_LENGTH;
            if (fetchNextPage) {
              $(".esoc-social-reply-seemore:visible").trigger("click");
            }
            commentListItem.$el.find(".esoc-social-reply-seemore").remove();
            self.hideMask(commentListItem.$el);
            commentListItem.destroy();
            commentsCollectionModel.remove(commentListItem.model);
            showSeeMoreLink && commentsCollectionModel.models.length >
                               self.commonUtil.globalConstants.SHOW_SEE_MORE_MODELS_LENGTH ?
            $(".esoc-social-reply-seemore:last").show(1000) : "";
            commentListItem.options.commentConfigOptions.parentCollectionView.triggerMethod(
                'update:scrollbar');
            break;
          default:
            var myResponse = (JSON.parse(data)).status;
            commentListItem.model.attributes.data_id = myResponse.data_id;
            commentListItem.model.attributes.created_at_iso8601 = myResponse.created_at_iso8601;
            commentListItem.model.attributes.modified_at_iso8601 = self.base.formatFriendlyDateTimeNow(
                myResponse.modified_at_iso8601);
            commentListItem.model.attributes.text = myResponse.text;
            commentListItem.model.attributes.feed_event_type = myResponse.feed_event_type;
            commentListItem.model.attributes.user.name = myResponse.user.name;
            commentListItem.model.attributes.user.screen_name = myResponse.user.screen_name;
            commentListItem.model.attributes.user.profile_image_url = myResponse.user.profile_image_url;
            if (requestType ===
                self.commonUtil.globalConstants.REQUEST_TYPE_ATTACHMENT_DELETE) {
              if (!(myResponse.extended_info && myResponse.extended_info.attachment_id)) {
                commentListItem.model.attributes.extended_info.attachment_id = '';
              }
            }
            self.hideMask(commentListItem.$el);
            commentListItem.render();
            if (commentListItem.model.collection.models[commentListItem.model.collection.length -
                                                        1].attributes.noMoreData === false) {
              $(".esoc-social-reply-seemore:last").show();
            }
          }
          commentListItem.showSeeMoreLink(
              commentListItem.$el.find(commentListItem.contentTypeElement));
        },
        onDeleteFailure: function (args, xhr, status, text) {
          var model = args.model;
          this.hideMask(model.$el);
          //TODO: To handle the error messages which we have to show to the user
          model.showSeeMoreLink(model.$el.find(model.contentTypeElement));
          this.commonUtil.openErrorDialog({
            parent: ".esoc-social-comment-widget",
            errorContent: xhr.responseJSON ?
                          (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                           xhr.responseJSON.error) :
                          this.lang.defaultErrorMessageForUpdateComment
          });
        },
        /**
         * this method positions the cursor in input type elements to the position passed through arguments.
         * @param args = {input, pos}
         */
        setSelectionRange: function (input, pos) {
          var selectionStart = pos,
              selectionEnd   = pos;
          if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionEnd);
          } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
          }
        },
        /**
         * Opens the confirmation dialog based on the arguments.
         * on clicking cancel button, hides the dialog
         * on clicking delete button, updateCommentAjaxCall method is called
         * @param args = {dialogtitle, dialogmessage, {url, type, data {id, status, ATT_ID, replace}, dataType, model}}
         */
        openConfirmationDialog: function (args) {
          var dialog = $('#esoc-social-dialog');
          dialog.binf_modal({
            "backdrop": "static",
            "show": false
          });
          var that = this;
          dialog.on('show.binf.modal', function (event) {
            var modal = $(this);
            dialog.addClass("esoc-social-delete-dialog-mask");
            modal.find('#myModalTitle').text(args.dialogtitle);
            dialog.find(".binf-modal-backdrop").remove();
            modal.find('#myModalConfirmationText').text(args.dialogmessage);

            var clonedDialog;
            var top;
            clonedDialog = $(this).clone();
            clonedDialog.css('display', 'block');
            clonedDialog.appendTo(document.body);
            top = Math.round(($(".esoc-social-comment-widget").height() -
                              clonedDialog.find('.binf-modal-content').height()) / 2) + 10;
            top = top > 0 ? top : 0;
            clonedDialog.remove();
            $('.esoc-social-modal-content').attr("style", "margin-top:" + top + "px !important");

            $(".esoc-social-dialog-delete-button").off('click').on('click', function (event) {
              dialog.hide();
              dialog.unbind();
              dialog.removeData('binf.modal');
              that.updateCommentAjaxCall(args.ajaxParams);
              that.setFocusOnDefaultElement();
            });

            $('.esoc-social-dialog-cancel-button').on('keydown', function (e) {
              if ((e.keyCode || e.which) === 9) {
                $('.esoc-social-dialog-delete-button').focus();
                e.preventDefault();
              }
            });
          });
          dialog.on('shown.binf.modal', function (event) {
            $('.esoc-social-dialog-cancel-button').focus();
          });
          dialog.on('hidden.binf.modal', function (event) {
            that.hideMask(args.ajaxParams.model.$el);
            var modal = $(this);
            modal.find('#myModalTitle').text('');
            modal.find('#myModalConfirmationText').text('');
            dialog.removeClass("esoc-social-delete-dialog-mask");
            dialog.unbind();
            document.activeElement.blur();
            var _ele = $("#esoc-social-comment-title")[0];
            _ele.focus();
            document.activeElement = _ele;
          });

        },
        /**
         * On clicking Escape and clicking outside of the modal window.The widget will close.
         */
        closeCommentDialog: function (event, callbackFun) {
          var unbindWidgetFromBody = false,
              _e                   = event || window.event;
          if (_e.type === 'popstate' || _e.type === 'hashchange') {
            unbindWidgetFromBody = true;
          }
          if ((_e.type === 'keyup' || _e.type === 'keydown') &&
              (_e.keyCode === 27 || _e.which === 27)) {
            var _ele = $('.esoc-social-comment-attachment').next(".binf-popover:visible").size() ===
                       0 ?
                       $('.esoc-social-attachment-file').next(".binf-popover:visible") :
                       $('.esoc-social-comment-attachment').next(".binf-popover:visible");
            var emojiEle = $(".esoc-social-comment-emoticon").siblings(
                ".binf-popover.emoji-menu:visible");
            if (_ele.is(':visible')) {
              _ele.binf_popover('hide');
              _ele.hide();
              _ele.prev().focus();
              _e.stopImmediatePropagation();
            } else if (emojiEle.length) {
              if (event && event.data && event.data.util && event.data.util.emojiObj) {
                event.data.util.emojiObj.hide();
                delete event.data.util.emojiObj;
              }
            } else {
              if (!$('.binf-modal-dialog').is(':visible')) {
                unbindWidgetFromBody = true;
              }
              if ($('#esoc-social-dialog').is(':visible')) {
                $(this).find('.esoc-social-dialog-cancel-button').trigger('click');
              }
              if (!$('#esoc-social-dialog').is(':visible') && $('.cs-dialog').is(':visible')) {
                unbindWidgetFromBody = true;
              }
              if (unbindWidgetFromBody) {
                $(document).unbind(_e.type);
                $("[id^='esoc-social-comment-widget-mask_']").removeAttr('tabindex');
                $(".cs-expanded.activityfeed-expand.esoc.cs-dialog.binf-modal.binf-fade.binf-in").attr(
                    'tabindex', '-1');
                $(".esoc-user-widget-dialog.cs-dialog.binf-modal.binf-fade.binf-in").attr(
                    'tabindex',
                    '-1').removeAttr("disabled");
                var dialogOptions = _e.data.dialogOptions;
                if (dialogOptions) {
                  var element = dialogOptions.currentTarget;
                  if (_e.type === 'keydown') {
                    $(element).on('keyup', function (e) {
                      if ($(element).is(':focus')) {
                        $(element).off('keyup');
                        e.stopPropagation();
                      }
                    });
                  }
                  if (element) {
                    element.focus();
                    setTimeout(function () {
                      element.focus();
                    }, 1);
                  }
                }
              }
            }
          }
          if (!$(_e.target).closest('.esoc-socialactions-getcomments').length &&
              _e.type === 'click') {
            if (!($(_e.target).closest('[id*=esoc-social-comment-widget]').length &&
                !$(_e.target).closest('[id*=esoc-social-comment-widget-mask_]').length) &&
                !$(_e.target).closest('[class*=ui-autocomplete]').length &&
                !$('#esoc-social-dialog').is(':visible') && !$("#mdAlert").is(':visible')) {
              unbindWidgetFromBody = true;
            }
          }
          if (unbindWidgetFromBody && _e.data && _e.data.dialogOptions &&
              _e.data.dialogOptions.commentsHeaderView) {
            _e.data.dialogOptions.commentsHeaderView.disengageModalKeyboardFocusOnClose();
            delete _e.data.dialogOptions.commentsHeaderView;
          }
          unbindWidgetFromBody ?
          _e.data.callbackFun(_e.data.dialogOptions) : "";
          if (_e.keyCode === 27 || _e.which === 27) {
            if ($(".cs-dialog").length > 0) {
              $(".cs-dialog")[0].focus();
            }
          }
          $(".esoc-acitivityfeed-collection").css("overflow", "");
        },
        /**
         *    open file browse window,
         *        if shortcut is disabled and desktop attachments is enabled ,
         *        if no attachment is added yet.
         *    @param args = {event, popoverSource, inputElement, socialActions}
         */
        showBrowsePopup: function (event, popoverSource, inputElement, socialActions) {
          if (!socialActions.shortcutsEnabled && socialActions.attachementsEnabled &&
              inputElement.val().length === 0) {
            this.selectAttachment(event, inputElement);
          }
        },
        /**
         *    Triggers click event on file type element to open file browse window.
         *    @param args = {event,inputElement}
         */
        selectAttachment: function (event, inputElement) {
          event.preventDefault();
          event.stopPropagation();
          inputElement.trigger("click");
        },
        /**
         * Resets the attachment input element
         * @param inputElement
         * @param socialActions
         */
        resetAttachmentInput: function (inputElement, socialActions) {
          if (inputElement.length > 0) {
            inputElement.val("");
            if (inputElement[0].files && navigator.appVersion &&
                navigator.appVersion.indexOf("MSIE 10") !== -1) {
              inputElement.wrap('<form>').parent('form').trigger('reset');
              inputElement.unwrap();
              inputElement[0].files[0] = '';
            }
            if (socialActions.attachementsEnabled && socialActions.shortcutsEnabled &&
                inputElement[0].files) {
              inputElement.remove();
            }
          }
        },
        /**
         *    Resets the popup based on document attachment permissions.
         *    @param args = { event, popoverSource, inputElement, socialActions }
         */
        resetAttachmentPopup: function (event, popoverSource, inputElement, socialActions) {
          this.resetAttachmentInput(inputElement, socialActions);
          popoverSource.attr('data-binf-original-title', '');
          popoverSource.attr('data-binf-content', '');
          if (socialActions.attachementsEnabled && socialActions.shortcutsEnabled) {
            var _e = event || window.event;
            _e.preventDefault();
            _e.stopPropagation();
            popoverSource.binf_popover('show');
            $(".esoc-social-comment-dialog-att-minheight").removeClass(
                "esoc-social-comment-dialog-att-minheight");
            $(".esoc-social-comment-widget").addClass("esoc-social-comment-dialog-minheight");
          } else {
            popoverSource.binf_popover('hide');
            popoverSource.binf_popover('destroy');
            $(".esoc-social-comment-dialog-att-minheight").removeClass(
                "esoc-social-comment-dialog-att-minheight");
            $(".esoc-social-comment-dialog-minheight").removeClass(
                "esoc-social-comment-dialog-minheight");
          }
          popoverSource.focus();
          this.setCommentDialogPointer();
        },
        /**
         *    Hides the popup based on attachment permissions.
         *    @param args = { popoverSource, inputElement, socialActions }
         */
        hideAttachmentPopup: function (popoverSource, inputElement, socialActions) {
          this.resetAttachmentInput(inputElement, socialActions);
          popoverSource.attr('data-binf-original-title', '');
          popoverSource.attr('data-binf-content', '');
          popoverSource.binf_popover('hide');
          if (socialActions !== undefined && socialActions.attachementsEnabled &&
              !socialActions.shortcutsEnabled) {
            popoverSource.binf_popover('destroy');
          }
          $(".esoc-social-comment-dialog-minheight").removeClass(
              "esoc-social-comment-dialog-att-minheight");
          this.setCommentDialogPointer();
        },
        /**
         *    Shows attachment popover based on permissions
         *    @param args = {attachmentIcon, args}
         */
        showAttachmentPopOver: function (attachmentIcon, args) {
          if (args.socialActions !== undefined && args.socialActions.attachementsEnabled &&
              args.socialActions.shortcutsEnabled) {
            this.showAttachFilesPopOver(attachmentIcon, args);
          } else {
            var that = this;
            attachmentIcon.off("click").on("click", function (e) {
              var desktopAttachmentInput = $("#" + args.desktopAttachmentInputId);
              if (!args.socialActions.attachementsEnabled && args.socialActions.shortcutsEnabled) {
                if (args.shortcutIdHolder.val().length === 0) {
                  that.hideAttachmentPopup(attachmentIcon, desktopAttachmentInput,
                      args.socialActions);
                  that.openTargetPicker(attachmentIcon, args);
                }
              } else {
                if (desktopAttachmentInput.val().length === 0) {
                  that.hideAttachmentPopup(attachmentIcon, desktopAttachmentInput,
                      args.socialActions);
                }
                desktopAttachmentInput.off("change").on("change", function (e) {
                  if (desktopAttachmentInput.val().length > 0) {
                    that.showSelectedAttachmentPopOver(attachmentIcon, args);
                  }
                });
                that.showBrowsePopup(e, attachmentIcon, desktopAttachmentInput, args.socialActions);
              }
              $('.esoc-social-comment-attachment-header').attr('title',
                  that.commonUtil.lang.attachFile);
              $('.esoc-social-comment-attachment').attr('title', that.commonUtil.lang.attachFile);
            });
          }
        },
        showAttachFilesPopOver: function (popoverTarget, args) {
          var that          = this,
              id            = args.id,
              uniqueId      = args.uniqueId,
              contentparams = {
                "attachFilesPopover": true,
                "id": id,
                "fromContentServer": this.commonUtil.lang.fromContentServer,
                "fromYourDesktop": this.commonUtil.lang.fromYourDesktop,
                "desktopAttachmentInputId": args.desktopAttachmentInputId
              },
              titleparams   = {
                "popoverTitle": this.commonUtil.lang.attachFile
              },
              content       = this.attachmentPopoverTemplate(contentparams),
              title         = this.attachmentPopoverTemplate(titleparams);
          popoverTarget.binf_popover({
            content: content,
            title: title,
            delay: {"show": 100}, //set some delay to the popovers because In Desktop
            // applications like SAP server will take some time for loading a images.
            placement: function (tip, element) { //$this is implicit

              var offset          = $(element).offset(),
                  elementPos      = $(element).offset().top,
                  containerpos    = $("#esoc-social-comment-container").offset().top,
                  containerHeight = $("#esoc-social-comment-container").height(),
                  _tempElement    = $('<div/>').attr("style", "display:block; left:-5000px;")
                      .addClass("esoc-temp-attach-div")
                      .append(popoverTarget.data("binf.popover").tip());
              $(tip).addClass("esoc-social-attachment-popover");
              $("#esoc-social-comment-input-holder-" + uniqueId).append(_tempElement);
              var attachmentHeight = this.$tip.height();
              _tempElement.remove();
              var position = containerHeight - (elementPos - containerpos),
                  retValue = "bottom";
              if ($(element).hasClass("esoc-social-attachment-file-alone")) {
                if (i18n.settings.rtl) {
                  retValue = "left";
                } else {
                  retValue = "right"; // If RTL is enabled this value should become 'left'

                }

              } else if (containerHeight > position + attachmentHeight &&
                         position < attachmentHeight) {
                retValue = "top";
              }
              var commentContainer = $("#esoc-social-comment-container");
              var classAdd = "";
              if (popoverTarget.hasClass("esoc-social-attachment-file-alone")) {
                classAdd = "status-attachment-alone-init-min-height";
              } else if (popoverTarget.hasClass("comment esoc-social-attachment-file")) {
                classAdd = "status-attachment-init-min-height";
              } else if (popoverTarget.parent().attr('id') === "esoc-social-edit-comment-icons-" +
                         id) {
                classAdd = "esoc-edit-init-min-height";
              }
              if (commentContainer.find(".esoc-social-comment-list-item").length <= 1) {
                commentContainer.find(".esoc-social-comment-list-item").addClass(classAdd);
              } else {
                commentContainer.find(".esoc-social-comment-list-item").removeClass(
                    "status-attachment-init-min-height status-attachment-alone-init-min-height esoc-edit-init-min-height");
              }
              return retValue;
            }
          });

          popoverTarget.on('shown.binf.popover', function (e) {
            var desktopAttachmentInput = $("#" + args.desktopAttachmentInputId);
            $('#esoc-social-attachment-desktop-' +
              id).off("click touchstart").on("click touchstart", function (e) {
              desktopAttachmentInput.val("");
              e.stopPropagation();
              desktopAttachmentInput.trigger('click');
            });
            desktopAttachmentInput.off("change").on("change", function (e) {
              if (!args.attachFiles) {
                if (desktopAttachmentInput.val().length > 0) {
                  that.showSelectedAttachmentPopOver(popoverTarget, args);
                }
              } else {
                if (desktopAttachmentInput.val().length > 0) {
                  desktopAttachmentInput.appendTo(popoverTarget);
                  args.itemview.uploadAttachment();
                }
              }
            });
            $('#esoc-social-attachment-cs-' + id).off("click").on("click",
                function (e) {
                  that.openTargetPicker(popoverTarget, args);
                });
            $(".esoc-social-comment-widget").addClass("esoc-social-comment-dialog-minheight");
            that.setCommentDialogPointer();
          });
          this.hidePopOvers();
        },
        /**
         *    Opens target picker
         *    @param args = {popoverTarget, args}
         */
        openTargetPicker: function (popoverTarget, args) {
          var that       = this,
              nodePicker = new NodePicker({
                connector: args.connector,
                dialogTitle: this.commonUtil.lang.targetPickerTitle,
                resolveShortcuts: true
              });
          nodePicker.show().done(function (response) {
            if (response.nodes.length) {
              var node = response.nodes[0];
              args.node = node;
              if (args.shortcutIdHolder.length > 0) {
                args.shortcutIdHolder.val(args.node.get("id"));
                if (!args.attachFiles) {
                  that.showSelectedShortcutPopOver(popoverTarget, args);
                } else {
                  args.itemview.uploadAttachment();
                }
              } else {
                that.showSelectedShortcutPopOver(popoverTarget, args);
              }
            }
            $('.esoc-social-comment-attachment-header').attr('title',
                that.commonUtil.lang.attachFile);
            $('.esoc-social-comment-attachment').attr('title', that.commonUtil.lang.attachFile);
          }).always(function () {
            popoverTarget.focus();
          });
        },
        hidePopOvers: function () {
          var that = this;
          $('.esoc-social-comment-widget').on('click', function (e) {
            $('.esoc-social-comment-widget [aria-describedby]').each(function () {
              if (!$(this).is(e.target) && $(this).has(e.target).length === 0 &&
                  $('.binf-popover').has(e.target).length === 0 &&
                  !$(e.target).is($(".esoc-social-comment-load-more:last"))) {
                $(this).binf_popover('hide');
                $(".esoc-social-comment-dialog-minheight").removeClass(
                    "esoc-social-comment-dialog-minheight");
                $(".esoc-social-comment-dialog-att-minheight").removeClass(
                    "esoc-social-comment-dialog-att-minheight");
                that.setCommentDialogPointer();
              }
            });
          });
        },
        showSelectedAttachmentPopOver: function (popoverTarget, args) {
          var desktopAttachmentInput = $("#" + args.desktopAttachmentInputId),
              file                   = desktopAttachmentInput[0].files[0],
              that                   = this,
              size                   = '0 B',
              id                     = args.id,
              titleparams,
              contentparams;
          if (file.size !== 0) {
            var i = Math.floor(Math.log(file.size) / Math.log(1024));
            size = Math.ceil(file.size / Math.pow(1024, i)) + ' ' +
                   ['B', 'KB', 'MB', 'GB', 'TB'][i];
          }
          if (args.socialActions.attachementsEnabled && args.socialActions.shortcutsEnabled &&
              desktopAttachmentInput.length > 0) {
            desktopAttachmentInput.appendTo(popoverTarget);
          }

          var fileMimeType = file.type;
          if (fileMimeType === "") {
            var fileName = file.name;
            var fileExtn = fileName.split('.').pop().toLowerCase();
            //Except opera other browsers are not giving mime type info along with file object, hence the following hack fix for now.
            if ($.inArray(fileExtn, ["zip", "rar", "war", "jar"]) > -1) {
              fileMimeType = "application/zip";
            } else if ($.inArray(fileExtn, ["json", "properties"]) > -1) {
              fileMimeType = "text/plain";
            }
          }
          var virtualModel = {
            attributes: {
              "type": 144
            },
            "mime_type": fileMimeType,
            "container": false,
            get: function (key) {
              return this[key];
            }
          };
          contentparams = {
            "attachmentPopover": true,
            "id": id,
            "filesize": size,
            "filename": file.name,
            "filemimetypeicon": NodeSpriteCollection.findClassByNode(virtualModel),
            "deletetitle": this.commonUtil.lang.deleteComment
          };

          titleparams = {
            "popoverTitle": this.commonUtil.lang.attachmentPopoverTitle
          };
          var toolTip = this.commonUtil.lang.attachFile;
          popoverTarget.attr('data-binf-original-title',
              this.attachmentPopoverTemplate(titleparams));
          popoverTarget.attr('data-binf-content', this.attachmentPopoverTemplate(contentparams));
          popoverTarget.binf_popover('show');
          popoverTarget.on('shown.binf.popover', function (e) {
            $('.esoc-social-comment-attachment-header').attr('title', toolTip);
            $('.esoc-social-comment-attachment').attr('title', toolTip);
            $('#esoc-social-attachment-delete-icon-' + id).off("click keydown").on("click" +
                                                                                   " keydown",
                function (e) {
                  if ((e.keyCode || e.which) === 32 || e.type === 'click') {
                    that.resetAttachmentPopup(e, popoverTarget, desktopAttachmentInput,
                        args.socialActions);
                  }
                });
            var popOverContent = $("<div />").html(popoverTarget.attr('data-binf-content'));
            if (popOverContent.find(".esoc-social-selected-file").length > 0) {
              $(".esoc-social-comment-dialog-minheight").removeClass(
                  "esoc-social-comment-dialog-minheight");
              $(".esoc-social-comment-widget").addClass("esoc-social-comment-dialog-att-minheight");
            } else {
              $(".esoc-social-comment-dialog-att-minheight").removeClass(
                  "esoc-social-comment-dialog-att-minheight");
              $(".esoc-social-comment-widget").addClass("esoc-social-comment-dialog-minheight");
            }
            that.setCommentDialogPointer();
            $('#esoc-social-attachment-delete-icon-' + id).focus();
          });
          this.hidePopOvers();
        },
        showSelectedShortcutPopOver: function (popoverTarget, args) {
          var isShortcut   = !!args.node.attributes.original_id ? true : false,
              virtualModel = {
                attributes: {
                  "type": isShortcut ? args.node.attributes.original_id.type
                                     : args.node.get("type")
                },
                "mime_type": isShortcut ? args.node.attributes.original_id.mime_type
                                        : args.node.get("mime_type"),
                "container": isShortcut ? args.node.attributes.original_id.container
                                        : args.node.get("container"),
                get: function (key) {
                  return this[key];
                }
              };

          var that          = this,
              contentparams = {
                "shortcutPopover": true,
                "id": args.node.get("id"),
                "filename": args.node.get("name"),
                "filemimetypeicon": NodeSpriteCollection.findClassByNode(virtualModel),
                "deletetitle": this.commonUtil.lang.deleteComment
              },
              titleparams   = {
                "popoverTitle": this.commonUtil.lang.attachmentPopoverTitle
              };
          if (args.shortcutIdHolder.length > 0) {
            args.shortcutIdHolder.val(contentparams.id);
          }
          var toolTip = that.commonUtil.lang.attachFile;
          popoverTarget.attr('data-binf-original-title',
              this.attachmentPopoverTemplate(titleparams));
          popoverTarget.attr('data-binf-content', this.attachmentPopoverTemplate(contentparams));
          popoverTarget.binf_popover('show');
          popoverTarget.on('shown.binf.popover', function (e) {
            $('.esoc-social-comment-attachment-header').attr('title', toolTip);
            $('.esoc-social-comment-attachment').attr('title', toolTip);
            $('#esoc-social-attachment-delete-icon-' + contentparams.id).off("click keydown").on(
                "click keydown",
                function (e) {
                  if ((e.keyCode || e.which) === 32 || e.type === 'click') {
                    that.resetAttachmentPopup(e, popoverTarget, args.shortcutIdHolder,
                        args.socialActions);
                  }
                });
            $(".esoc-social-comment-dialog-minheight").removeClass(
                "esoc-social-comment-dialog-minheight");
            $(".esoc-social-comment-widget").addClass("esoc-social-comment-dialog-att-minheight");
            that.setCommentDialogPointer();
            $('#esoc-social-attachment-delete-icon-' + contentparams.id).focus();
          });
          this.hidePopOvers();
        },
        /**
         * Handles ajax call with attachment
         * @param args = {url, type, data {id, status, ATT_ID, replace}, dataType, model}
         */
        updateWithAttachmentAjaxCall: function (args) {
          var url       = args.url,
              type      = args.type,
              data      = args.data,
              that      = args.itemview,
              self      = this,
              commentId = args.commentId,
              feedType  = args.feedType,
              deferred  = $.Deferred();
          $.ajax(that.model.collection.connector.extendAjaxOptions({
            url: url,
            type: type,
            data: data,
            contentType: false,
            crossDomain: true,
            processData: false,
            success: function (data, status, jXHR) {
              that.options.commentConfigOptions.commentAction = true;
              that.model.attributes.text = data.status.text;
              if (data.status.extended_info.attachment_id) {
                that.model.attributes.attachmentCommands = data.status.attachmentCommands;
                that.model.attributes.extended_info.attachment_parent_data_id = data.status.extended_info.object_id;
                that.model.attributes.extended_info.attachment_name = data.status.extended_info.attachment_name;
                that.model.attributes.extended_info.attachment_size = data.status.extended_info.attachment_size;
                that.model.attributes.extended_info.attachment_icon_id = data.status.extended_info.attachment_icon_id;
                that.model.attributes.extended_info.attachment_original_data_id = data.status.extended_info.attachment_original_data_id;
                that.model.attributes.extended_info.attachment_id = data.status.extended_info.attachment_id;
                that.model.attributes.extended_info.attachment_subtype = parseInt(
                    data.status.extended_info.attachment_subtype,
                    10);
                that.model.attributes.extended_info.attachment_mime_type = data.status.extended_info.attachment_mime_type;
                if (that.model.attributes.extended_info.attachment_subtype === 1) {
                  that.model.attributes.extended_info.attachment_original_sub_type = parseInt(
                      data.status.extended_info.attachment_original_sub_type,
                      10);
                  that.model.attributes.extended_info.attachment_original_mime_type = data.status.extended_info.attachment_original_mime_type;
                  that.model.attributes.extended_info.attachment_original_container = data.status.extended_info.attachment_original_container;
                }
              } else {
                that.model.attributes.extended_info.attachment_id = '';
              }
              that.model.attributes.modified_at_iso8601 = self.base.formatFriendlyDateTimeNow(
                  data.status.modified_at_iso8601);
              self.hideMask(that.$el);
              that.render();
              if (that.model.collection.models[that.model.collection.length -
                                               1].attributes.noMoreData === false) {
                $(".esoc-social-reply-seemore:last").show();
              }
              that.showSeeMoreLink(that.$el.find(that.contentTypeElement));
              self.setFocusOnDefaultElement();
              !!that.options.commentConfigOptions.parentCollectionView ?
              that.options.commentConfigOptions.parentCollectionView.triggerMethod(
                  'update:scrollbar') :
              that.options.parentCollectionView.triggerMethod('update:scrollbar');
              deferred.resolve();
            },
            error: function (xhr, status, text) {
              self.hideMask(that.$el);
              var args = {
                parent: ".esoc-social-comment-widget",
                errorContent: xhr.responseJSON ?
                              (xhr.responseJSON.errorDetail ? xhr.responseJSON.errorDetail :
                               xhr.responseJSON.error) :
                              self.lang.defaultErrorMessageForUpdateWithAttachment
              }
              if (feedType === "comment") {
                $(".esoc-comment-attachment").show();
              } else {
                $(".esoc-reply-attachment").show();
              }

              $('[data-binf-original-title]').each(function () {
                if ($('[id^="popover"]').css("display") === "block") {
                  $(this).binf_popover('hide');
                }
              });
              self.commonUtil.openErrorDialog(args);
              that.showSeeMoreLink(that.$el.find(that.contentTypeElement));
              self.setFocusOnDefaultElement();
              deferred.reject();
            }
          }));
          return deferred.promise();
        },
        /**
         *  jQuery Autosuggestion response.
         */
        triggerAutoCompleteSuggestion: function (suggestionOptions) {
          var that             = this,
              _element         = suggestionOptions.element,
              _appendToElement = suggestionOptions.appendToElement;

          _element.triggeredAutocomplete({
            hidden: '#hidden_inputbox',
            minLength: 2,
            autoFocus: true,
            source: function (request, response) {
              var queryString = request.term,
                  resData     = {};
              if (request.term.split(" ").length > 3 || request.term.split(/\n/g).length !== 1 ||
                  request.term[0] === '@') {
                this.close();
                return false;
              }
              if (!that.namedSessionStorage.get("querystring" + queryString)) {
                resData = that.autoCompleteAjax(suggestionOptions.connector, request);
                that.namedSessionStorage.set("querystring" + queryString, resData);
              } else {
                resData = that.namedSessionStorage.get("querystring" + queryString);
              }

              response($.map(resData, function (item) {
                var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(item);
                return {
                  label: item.first_name && item.last_name ?
                         item.first_name + " " + item.last_name : item.name,
                  value: item.id,
                  initials: item.initials,
                  id: item.name,
                  photo_url: item.photo_url,
                  userbackgroundcolor: userbackgroundcolor,
                  context: suggestionOptions.context
                }
              }));
              if (!resData.length) {
                resData = [{
                  label: that.lang.noResults,
                  value: ""
                }]
                response($.map(resData, function (item) {
                  return {
                    label: item.label,
                    value: item.value,
                    id: -1
                  }
                }));
              }
            },
            trigger: "@",
            appendTo: _appendToElement,
            open: function () {
              $('.ui-autocomplete').css('width', $(_appendToElement).width());
            }

          });
        },
        /**
         *  jQuery Autosuggestion response.
         */
        autoCompleteAjax: function (connector, request) {
          var respData = {},
              csBaseUrl = URL.combine(connector.connection.url, "members");
          $.ajax(connector.extendFetchOptions({
            url: csBaseUrl,
            dataType: "json",
            async: false,
            data: {
              limit: 5,
              where_type: 0,
              query: request.term
            },
            success: function (res) {
              respData = res.data;
            }
          }));
          return respData;
        },
        //TODO: Moved this method to commonutil and so need to remove this method from
        // here and update its references
        updateQueryStringValues: function (uri, key, value) {
          var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i"); // Alternate RegEx Patter/([?&]z)=([^#&]*)/g
          var separator = uri.indexOf('?') !== -1 ? "&" : "?";
          if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
          }
          else {
            return uri + separator + key + "=" + value;
          }
        },
        createRemoteObject: function (options) {
          var roid         = options.socialActionsInstanse.model.attributes.roid,
              parent_id    = options.socialActionsInstanse.model.attributes.socialactions.ParentID,
              csBaseUrl    = options.socialActionsInstanse.options.connector.connection.url,
              createROIUrl = csBaseUrl + this.commonUtil.REST_URLS.csCreateROI,
              retVal       = {"csid": "", "error": ""},
              self         = this;
          $.ajax(options.socialActionsInstanse.options.connector.extendAjaxOptions({
            url: createROIUrl,
            type: "POST",
            dataType: "json",
            data: {
              name: roid,
              remote_object_id: roid,
              parent_id: parent_id,
              type: self.commonUtil.globalConstants.ROI_OBJECT_TYPE
            },
            async: false,
            success: function (res) {
              retVal.csid = res.id;
            },
            error: function (res) {
              retVal.csid = "";
              retVal.error = res.responseJSON.error;
              var args = {
                parent: ".esoc-social-comment-widget",
                errorContent: res.responseJSON ?
                              (res.responseJSON.errorDetail ? res.responseJSON.errorDetail :
                               res.responseJSON.error) :
                              self.lang.defaultErrorMessageForCreateRemoteObject
              }
              self.commonUtil.openErrorDialog(args);
            }
          }));
          return retVal;
        },
        /**
         * Below function used for toggling between attachment icon and emoji icon.
         * @param args = {_element}
         */
        hidePopover: function (_element) {
          $('.esoc-social-comment-widget [aria-describedby]').each(function () {
            $(this).binf_popover('hide');
          });
        },
        /**
         * Below function used for auto Adjustment of comment widget pointer.
         */
        setCommentDialogPointer: function () {
          this.widgetBaseElement = $(this.widgetBaseElement).width() === 0 ?
                                   $("[data-value=" + $(this.widgetBaseElement).attr("data-value") +
                                     "]") : this.widgetBaseElement;
          var widgetDialog        = $(this.widgetDialog),
              widgetDialogPointer = $(this.widgetDialogPointer),
              widgetBaseElement   = $(this.widgetBaseElement),
              setDialogCenter     = false;
          widgetDialog.css({"position": "absolute", "left": "0", "top": "0"});
          widgetDialogPointer.css({
            "position": "absolute",
            "left": "0",
            "top": "0"
          }).addClass("esoc-socialactions-widget-arrow-left");
          var leftPos = parseInt(widgetBaseElement.width() + 10, 10);
          widgetDialog.position({
            my: "left top",
            at: "left+" + leftPos + " top -" + (widgetBaseElement.parent().height()),
            of: this.widgetBaseElement,
            collision: "flipfit flipfit"
          });
          var widgetDialogLeftPos  = widgetDialog.offset().left,
              widgetDialogRightPos = widgetDialog.offset().left + widgetDialog.width(),
              targetElementLeftPos = widgetBaseElement.offset().left,
              targetElementTopPos  = widgetBaseElement.offset().top,
              baseWrapsParent      = widgetBaseElement.parent().height() ===
                                     widgetBaseElement.height();
          if (baseWrapsParent) {
            // if the comment icon's height and it's parent element's heights are equal,
            // then comment dialog's top should consider wrapper element's height
            targetElementTopPos = widgetBaseElement.offset().top +
                                  Math.ceil(widgetBaseElement.height() / 4) + 2;
          }
          if (widgetDialogLeftPos < targetElementLeftPos) {
            widgetDialogPointer.css({
              "position": "absolute",
              "left": widgetDialogRightPos,
              "top": targetElementTopPos
            })
            if (i18n.settings.rtl) {
              widgetDialogPointer.removeClass("esoc-socialactions-widget-arrow-right").addClass(
                  "esoc-socialactions-widget-arrow-left");
            } else {
              widgetDialogPointer.removeClass("esoc-socialactions-widget-arrow-left").addClass(
                  "esoc-socialactions-widget-arrow-right");
            }
            setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                              1 > widgetBaseElement.offset().left;
          } else {
            widgetDialogPointer.css({
              "position": "absolute",
              "left": widgetDialogLeftPos - 10,
              "top": targetElementTopPos
            });
            if (i18n.settings.rtl) {
              widgetDialogPointer.removeClass("esoc-socialactions-widget-arrow-left").addClass(
                  "esoc-socialactions-widget-arrow-right");
            } else {
              widgetDialogPointer.removeClass("esoc-socialactions-widget-arrow-right").addClass(
                  "esoc-socialactions-widget-arrow-left");
            }
            setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                              1 < (widgetBaseElement.offset().left + widgetBaseElement.width());
          }
          var widgetDialogBottomPos        = widgetDialog.offset().top + widgetDialog.height(),
              widgetDialogPointerBottomPos = widgetDialogPointer.offset().top + 25;
          if (widgetDialogBottomPos < widgetDialogPointerBottomPos) {
            widgetDialog.css("top",
                parseInt(widgetDialog.offset().top + (baseWrapsParent ? 0 : 20), 10));
          } else {
            if (widgetDialogBottomPos - widgetDialogPointerBottomPos > 20) {
              widgetDialog.css("top",
                  parseInt(widgetDialog.offset().top - (baseWrapsParent ? 0 : 20), 10));
            }
          }
          if (setDialogCenter) {
            widgetDialog.css({"left": $(window).width() / 2 - widgetDialog.width() / 2});
            widgetDialogPointer.css({"opacity": "0"});
          } else {
            widgetDialogPointer.css({"opacity": "1"});
          }
        },
        /**
         * Check the element is valid and has value
         * @param args = {_element}
         */
        isValidInput: function (_element) {
          if (_element !== undefined && _element.val() !== undefined && _element.val().length > 0) {
            return true;
          } else {
            return false;
          }
        },

        getUser: function (agrs) {
          var userWidget = new UserWidget(agrs);
          return userWidget;
        },
        /**
         * Apply masking for given element
         * @param args = {_element}
         */
        showMask: function (_element) {
          _element.append(this.maskingTemplate());
          _element.find(".esoc-comment-masking-container").addClass("esoc-progress-display");
        },
        /**
         * Removes masking for given element
         * @param args = {_element}
         */
        hideMask: function (_element) {
          _element.find(".esoc-comment-masking-container").remove();
        },
        onMentionNameEdit: function (event) {
          var children = $(event.currentTarget).children();
          for (var i = 0; i < children.length; i++) {
            if (($(event.currentTarget).children()[i].tagName === 'DIV') ||
                ($(event.currentTarget).children()[i].tagName === 'P')) {
              if ($(event.currentTarget).children()[i].textContent.charAt(0) === '@') {
                $(event.currentTarget).children()[i].innerHTML = " " +
                                                                 $(event.currentTarget).children()[i].innerHTML;
                this.setCursorPosition(event, i);
              }
            }
            if (typeof InstallTrigger !== 'undefined') {
              if ($(event.currentTarget).children('br').length !== 0) {
                var brTagValue = $(event.currentTarget).children('br').get(i);
                if (brTagValue && brTagValue.nextSibling &&
                    brTagValue.nextSibling.textContent.charAt(0) ===
                    '@') {
                  $(event.currentTarget).children('br').get(i).nextSibling.textContent =
                      " " + $(event.currentTarget).children('br').get(i).nextSibling.textContent;
                  this.setCursorPosition(event, i);
                }
              }
            }
          }
        },
        setCursorPosition: function (event, n) {
          var div_id = event.currentTarget.id;
          var el = document.getElementById(div_id);
          var range = document.createRange();
          var sel = window.getSelection();
          if (typeof InstallTrigger !== 'undefined') {
            range.setStart($(event.currentTarget).children('br').get(n).nextSibling, 2);
          } else {
            range.setStart(el.children[n], 1);
          }
          sel.removeAllRanges();
          sel.addRange(range);
          el.focus();
        },
        /*
         * sets focus on default element, this element focus is set to support tabbing
         */
        setFocusOnDefaultElement: function (e) {
          $("#esoc-social-focus-element").focus();
        },

        /**
         * Creates button element in the contenteditable div for mentions  to get chicklet
         * functionality
         *
         * @param emojiArea
         */
        createChickletForMentions: function (emojiArea) {
          var mentions = emojiArea.find("span.esoc-widget-user-display-name");
          for (var i = 0; i < mentions.length; i++) {
            var j, currentMention, imgElements, textNode;
            currentMention = $(mentions[i]);
            imgElements = currentMention.find("img");
            for (j = 0; j < imgElements.length; j++) {
              textNode = document.createTextNode($(imgElements[j]).attr("alt"));
              mentions[i].replaceChild(textNode, imgElements[j]);
            }
            if (typeof InstallTrigger !== 'undefined') { //Firefox
              var spanTag = $('<span />');
              spanTag.css("visibility", "hidden");
              spanTag.addClass('esoc-span-mention');
              spanTag[0].innerText = mentions[i].innerHTML;
              document.body.appendChild(spanTag[0]);
              var textBoxWidth = $(spanTag[0]).width() - mentions[i].innerHTML.length;
              document.body.removeChild(spanTag[0]);
              var inputElement = $('<input />');
              inputElement.attr({
                id: 'data-userid',
                type: 'text',
                value: mentions[i].innerHTML,
                disabled: 'true'
              });
              inputElement.addClass('esoc-user-mention');
              inputElement.css("width", textBoxWidth + "px");
              emojiArea[0].replaceChild(inputElement[0], mentions[i]);
            } else { //Other than Firefox
              var buttonElement = $('<input />');
              buttonElement.attr({
                id: $(mentions[i]).attr("data-userid"),
                type: "button",
                value: mentions[i].innerHTML
              });
              buttonElement.addClass('esoc-user-mention');
              emojiArea[0].replaceChild(buttonElement[0], mentions[i]);
            }
          }
          if (typeof InstallTrigger !== 'undefined') { //Firefox
            emojiArea[0].innerHTML = "&nbsp;" + emojiArea[0].innerHTML + "&nbsp;";
          }
        },
        setCursorPositionAtStartOFMention: function (event) {
          if (!!window.chrome && !!window.chrome.webstore) { // Chrome browser
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(event.currentTarget, 0);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        },
        applySpaceKeyEvent: function (e) {
          if ((e.keyCode || e.which) === 32) {
            e.preventDefault();
            $(e.currentTarget).click();
          }
        }
      }
      return Utils;
    });
