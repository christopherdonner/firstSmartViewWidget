/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/handlebars',
  "csui/lib/marionette",
  "csui/lib/jquery",
  "csui/utils/connector",
  'i18n!esoc/widgets/socialactions/nls/lang',
  "esoc/widgets/socialactions/commentscollection.model",
  "esoc/widgets/socialactions/socialactions.model",
  "esoc/widgets/socialactions/commentscollection.view",
  "esoc/widgets/socialactions/commentsheader.view",
  "esoc/widgets/socialactions/util",
  "esoc/widgets/common/util",
  'csui/utils/contexts/factories/connector',
  'esoc/lib/jquery-ui',
  'css!esoc/widgets/socialactions/socialactions.css'
], function (_, Handlebars, Marionette, $, Connector, lang, CommentsCollectionModel,
    SocialActionsModel, CommentsCollectionView, CommentsHeaderView, Util, CommonUtil,
    ConnectorFactory) {
  function CommentsCollectionWidget(options) {

    $(document).bind('keyup',
        {callbackFun: Util.commonUtil.unbindWidget, dialogOptions: options, util: Util},
        Util.closeCommentDialog);
    var CSID;
    options = options ? options : {};
    options.CSID = options.nodeID = options.baseElement.dataset ?
                                    options.baseElement.dataset.value :
                                    $(options.baseElement).attr("data-value");

    if (options.CSID === "") {
      var roiInfo = Util.createRemoteObject(options);
      if (roiInfo.error !== "") {
        if ($(options.baseElement).parent().parent().find(".esoc-error-socialactions").length > 0) {
          $(options.baseElement).parent().parent().find(".esoc-error-socialactions").show();
          $(options.baseElement).parent().parent().find(".binf-panel-title").html(roiInfo.error);
          $(options.baseElement).hide();
        } else {
          $(options.baseElement).text(roiInfo.error);
        }
        this.show = function () {
        };
        return;
      }
      options.CSID = options.nodeID = CSID = roiInfo.csid;
      $(options.baseElement).attr("data-value", CSID);
    } else if (parseInt(options.CSID, 10) > 0) {
      options.statusInfo = {};
    } else {
      CSID = options.CSID;
    }

    var compositeID       = !!options.socialActionsInstanse && options.socialActionsInstanse.options.model.id ?
                            (CSID + "_" + options.socialActionsInstanse.options.model.id) : CSID,
        parentNodeId      = "#esoc-social-comment-widget_" + compositeID,
        parentNodePointer = "#esoc-social-comment-widget-pointer_" + compositeID,
        commentsModelMask = "#esoc-social-comment-widget-mask_" + compositeID;

    var isvisible = $(parentNodeId).is(':visible');
    if (isvisible) {
      $(parentNodeId).remove();
      $(parentNodePointer).remove();
      $(commentsModelMask).remove();
      this.show = function () {
      };
    } else {
      var commentsDialog, commentsDialogPointer, commentsDialogMask;
      if (!document.getElementById("esoc-social-comment-widget_" + compositeID)) {
        if (parentNodeId.indexOf("esoc-social-comment-widget") > 0) {
          Util.commonUtil.unbindWidget(this.options);
        }
        commentsDialog = document.createElement('div');
        commentsDialog.id = 'esoc-social-comment-widget_' + compositeID;

        commentsDialog.setAttribute("class", "esoc-social-comment-widget esoc");
        commentsDialogPointer = document.createElement('div');
        commentsDialogPointer.id = 'esoc-social-comment-widget-pointer_' + compositeID;

        commentsDialogMask = document.createElement('div');
        commentsDialogMask.id = 'esoc-social-comment-widget-mask_' + compositeID;
      } else {
        commentsDialog = document.getElementById("esoc-social-comment-widget_" + compositeID);
        commentsDialogPointer = document.getElementById("esoc-social-comment-widget-pointer_" +
                                                        compositeID);
        commentsDialogMask = document.getElementById("esoc-social-comment-widget-mask_" +
                                                     compositeID);
      }

      Util.widgetDialog = commentsDialog;
      Util.widgetDialogPointer = commentsDialogPointer;
      Util.widgetDialogMask = commentsDialogMask;


      if (options.socialActionsInstanse && options.socialActionsInstanse.model &&
          options.socialActionsInstanse.options.connector) {
        options.connector = options.socialActionsInstanse.model.connector;
      } else {
        options.connector = options.context.getObject(ConnectorFactory);
      }
      if (false) {
        options.socialActions = options.socialActionsInstanse.model.attributes.socialactions;
      } else {
        options.params = {page: 1, data_id: CSID};
        options.rockey = options.roid = "";
        options.csid = CSID;
        var socialActionsModel = new SocialActionsModel("", options);
        options.model = socialActionsModel;
		if (!!options.socialActionsInstanse) {
          options.socialActions = options.socialActionsInstanse.model.attributes.socialactions;
		}
      }
      if (!options.context) {
        options.context = options.socialActionsInstanse.options.context;
      }
      Util.widgetBaseElement = options.baseElement;

      var commentsRootWidget = $(parentNodeId);
      options.params = {page: 1, data_id: CSID};

      var commentsCollectionModel = new CommentsCollectionModel(options);
      commentsCollectionModel.baseURL = options.connector.connection.url;
      commentsCollectionModel.nodeID = options.nodeID;
      commentsCollectionModel.socialActions = options.socialActions;
      if (options.maxMessageLength) {
        commentsCollectionModel.maxMessageLength = options.maxMessageLength;
      }
      options.model = commentsCollectionModel;
      this.show = function () {
        var defaultContainer = $.fn.binf_modal.getDefaultContainer();
        $(defaultContainer).append(commentsDialogMask).append(commentsDialog).append(
            commentsDialogPointer);

        $("[id^='esoc-social-comment-widget-mask_']").bind('keydown click',
            {callbackFun: Util.commonUtil.unbindWidget, dialogOptions: options},
            Util.closeCommentDialog);
        $(window).on('popstate hashchange',
            {callbackFun: Util.commonUtil.unbindWidget, dialogOptions: options},
            Util.closeCommentDialog);
        this.initializeWidget();
        CommonUtil.createEmojiIcons();
      };

      this.initializeWidget = function () {
        var commentsHeaderContainerRegion = new Marionette.Region({
          el: parentNodeId
        });
        commentsHeaderContainerRegion.show(new CommentsHeaderView(options));
        options.originatingView = commentsHeaderContainerRegion.currentView;
        var commentsListRegion = new Marionette.Region({
          el: "#esoc-social-comment-container" // internal, found in commentsHeaderContainerRegion
        });
        var commentsCollectionView = new CommentsCollectionView({
          context: commentsCollectionModel.context,
          collection: commentsCollectionModel,
          commentConfigOptions: options,
          sort: true
        });
        commentsListRegion.show(commentsCollectionView);
        commentsCollectionModel.fetch({
          success: commentsCollectionModel.fetchSuccess,
          error: commentsCollectionModel.fetchError
        });
        commentsRootWidget.css({display: "block"});
        commentsRootWidget.animate({opacity: 1.0});
      };

      this.getConfig = function () {
        return options;
      };
    }
  }

  return CommentsCollectionWidget;
});
