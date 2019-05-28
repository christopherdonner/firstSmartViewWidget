/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
    ['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
      'csui/behaviors/default.action/default.action.behavior',
      'csui/controls/rich.text.editor/impl/rich.text.util',
      'csui/models/node/node.model', 'csui/utils/commands', 'csui/utils/url',
      'hbs!csui/widgets/html.editor/impl/cslink.preview/cslink.preview',
      'i18n!csui/widgets/html.editor/impl/nls/lang',
      'css!csui/widgets/html.editor/impl/cslink.preview/cslink.preview'
    ], function ($, _, Backbone, Marionette, DefaultActionBehavior, Utils, NodeModel,
        commands, Url, linkTemplate, lang) {

      var CSLinkPreview = Marionette.ItemView.extend({
        template: linkTemplate,
        className: 'cs-link',
        behaviors: {
          DefaultAction: {
            behaviorClass: DefaultActionBehavior
          }
        },
        subTypeName: 'wiki',
        constructor: function CSLinkPreview(options) {
          options || (options = {});
          Marionette.ItemView.prototype.constructor.call(this, options);
          this.options = options;
          this.subTypeName = options.subTypeName || this.subTypeName;
          this.modelFetched = false;
          this.linkPreviewContent = null;
          this.linkPreviewImage = null;
          var that = this;
          this._obtainId().done(function () {
            that._executeProcess();
          });
        },

        _obtainId: function () {
          this.id = this.options.objId || -1;
          var targetEle  = this.options.targetEle,
              targetHref = targetEle.href || targetEle.closest('a').href;
          var hrefMatcher = targetHref.match(/^.*\/open\/(.+)$/i) ||
                            targetHref.match(/^.*\/nodes\/(.+)$/i),
              deferred    = $.Deferred(),
              that        = this,
              canResolve  = true;

          if (this.options.isSameDomain) {  // if link is of same domain
            if (!!hrefMatcher) {  // if the links contain nodes
              if (isNaN(parseInt(hrefMatcher[1]))) {    // if nodeid in link is not a number
                canResolve = false;
                var nickName = this.options.targetEle.href &&
                               this.options.targetEle.href.substring(
                                   this.options.targetEle.href.lastIndexOf("/") + 1,
                                   this.options.targetEle.href.length),
                    node;
                Utils._getNicknameId(that.options, nickName).done(function (response) {
                  node = Utils.getNewNodeModel({}, {connector: that.options.connector});
                  node.attributes = node.parse(response);
                  node = Utils.getNewNodeModel({attributes: node.attributes},
                      {connector: that.options.connector});
                  that.model = node;
                  that.id = that.model.get("id");
                  deferred.resolve();
                }).fail(function(){
                  $(that.options.targetEle).attr("title", lang.cannotFindObject);
                });
              } else {   // if nodeid is a number
                this.id = hrefMatcher[1];
              }
            }
          }
          if (!!canResolve) {
            deferred.resolve();
          }
          return deferred.promise();
        },

        _executeProcess: function () {
          if (this.id !== -1) {
            this.model = new NodeModel({
              id: this.id
            }, {
              connector: this.options.connector,
              commands: commands.getAllSignatures(),
              fields: this.options.fields || {},
              expand: this.options.expand || {}
            });

            this.model.fetch().fail(_.bind(function () {
              $(this.options.targetEle).attr("title", lang.cannotFindObject);
            }, this));
            this.listenTo(this.model, 'sync', function (e) {
              this.linkHeading = this.model.attributes.name;
              var that    = this,
                  promise = this._getContent();
              promise.done(function (res) {
                if (that.model.get('type') === 5574) {
                  that._callbackExecuteProcess(res);
                }
                else {
                  $(that.options.targetEle).attr("title",
                      _.str.sformat(lang.goToTooltip, that.model.get("name")));
                }
              });
            });
          }
          else {
            $(this.options.targetEle).attr("title", lang.previewUnavailable);
          }
        },

        _getContent: function () {
          var deferred       = $.Deferred(),
              connector      = this.options.connector,
              collectOptions = connector.extendAjaxOptions({
                url: this._getUrl(),
                type: 'GET'
              });

          $.ajax(collectOptions).done(function (resp) {
            deferred.resolve(resp);
          }).fail(function (resp) {
            deferred.reject(resp);
          });
          return deferred.promise();
        },

        _getUrl: function () {
          return this.options.connector.connection.url.replace('/v1', '/v2') + '/' +
                 this.subTypeName +
                 '/' + this.id + "/previewcontent";
        },

        _callbackExecuteProcess: function (res) {
          this.modelFetched = true;
          this.linkPreviewImage = res.results.data.firstImage;
          this.linkPreviewContent = res.results.data.previewContent;
          var content = $("<div>" + this.linkPreviewContent + "</div>").find("*").text().trim();
          this.isEmptyContent = (content === "" || content === lang.pageDefaultContent);
          if (!this.isDestroyed) {
            $(this.options.targetEle).attr({"title":"","data-binf-original-title":""});
            if ((this.linkPreviewContent !== null && !this.isEmptyContent) ||
                this.linkPreviewImage !== null) {
              this.render();
              $(this.options.targetEle).binf_popover('show');
              if (this.linkPreviewContent !== null && !this.isEmptyContent) {
                $('.cs-link-content').html(this.linkPreviewContent);
              }
              else {
                $('.cs-link-preview-content').addClass('cs-link-image-only');
              }
              this.eventHandlers();
            } else {
              $(this.options.targetEle).attr("title",
                  _.str.sformat(lang.goToTooltip, this.model.get("name")));
            }
          }
        },

        onDestroy: function () {
          this.hidePopover();
        },
        eventHandlers: function () {
          var that = this;
          $('.cs-link-popover').on("mouseleave", function (e) {
            if ($("#" + e.target.id).attr("aria-describedby") !==
                $(that.options.targetEle).attr("aria-describedby")) {
              that.hidePopover();
            }
          });
          $('.cs-link-expand').on('click', function (e) {
            that.expandLinkView();
          });
        },
        hidePopover: function () {
          $(this.options.targetEle).binf_popover('hide');
          $(this.options.targetEle).binf_popover('destroy');
        },
        expandLinkView: function () {
          this.triggerMethod("execute:defaultAction", this.model);
        },
        onRender: function () {
          var that = this;
          if (this.modelFetched) {
            var targetEle = this.options.targetEle;
            var contentparams = {
                  "LinkHeading": this.linkHeading,
                  "isLinkPreviewImage": this.linkPreviewImage !== null ? true : false,
                  "LinkPreviewImage": this.linkPreviewImage,
                  "isPreviewContent": !this.isEmptyContent,
                  "linkPreviewContent": this.linkPreviewContent
                },
                content       = this.template(contentparams);

            $(targetEle).binf_popover({
              html: true,
              trigger: "manual",
              content: content,
              container: $.fn.binf_modal.getDefaultContainer(),
              placement: function (context) {
                $(context).addClass("cs-link-popover");
                var _tempElement = $('<div/>')
                    .attr("style", "display:none")
                    .addClass("cs-link-popover binf-popover cs-link-popover-temp-div")
                    .append(linkTemplate);
                $(targetEle).append(_tempElement);
                if (that.linkPreviewImage === null ||
                    (that.linkPreviewContent === null || that.isEmptyContent)) {
                  $(context).addClass('cs-link-preview-width');
                }
                var popOverMaxHeight = $(".cs-link-popover-temp-div").height() + 40,
                    popOverMaxWidth  = $(".cs-link-popover-temp-div").width() + 40;
                _tempElement.remove();
                var popOverSource = $(targetEle),
                    offset        = popOverSource.offset(),
                    window_left   = offset.left,
                    window_top    = offset.top,
                    window_right  = (($(window).width()) -
                                     (window_left + popOverSource.outerWidth())),
                    window_bottom = (($(window).height()) -
                                     (window_top + popOverSource.outerHeight(true)));
                if (window_bottom > popOverMaxHeight) {
                  that.popoverPosition = "bottom";
                  return "bottom";
                } else if (window_top > popOverMaxHeight) {
                  that.popoverPosition = "top";
                  return "top";
                } else if (window_right > popOverMaxWidth) {
                  that.popoverPosition = "right";
                  return "right";
                } else if (window_left > popOverMaxWidth) {
                  that.popoverPosition = "left";
                  return "left";
                } else {
                  that.popoverPosition = "auto";
                  return "auto";
                }
              }
            });
          }
          $("*").one('scroll', function () {
            that.destroy();
          });
          $(this.options.targetEle).one("remove", function () {
            that.destroy();
          });
          $(this.options.targetEle).off("mouseleave").on("mouseleave", function (e) {
            setTimeout(function () {
              if ($(".cs-link-popover:hover").length === 0) {
                that.destroy();
              }
            }, 10);
          });
        }
      });
      return CSLinkPreview;
    });
