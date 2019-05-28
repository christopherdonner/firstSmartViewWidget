/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/controls/usercards/usercards.list.view',
  'hbs!workflow/controls/usercards/impl/usercards.popover',
  'css!workflow/controls/usercards/impl/usercard'
], function (require, $, _, Backbone, Marionette, PerfectScrollingBehavior, UsercardsListView, template) {
  'use strict';

  var PopOverView = Marionette.LayoutView.extend({

    className: 'wfstatus-usercard-popover-class',
    template: template,
    tagName: 'div',

    constructor: function PopOverView(options) {

      options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.userCardListView = new UsercardsListView(this.options);
    },

    regions: {
      usercardPopover: ".wfstatus-usercard-popover-content"
    },

    events: {
      'click .wfstatus-user-search-icon': 'toggleSearchInput',
      'keyup .wfstatus-user-input': 'searchUser'
    },

    ui: {
      wfstatusUserInput: '.wfstatus-user-input'
    },

    behaviors: {

      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.wfstatus-usercard-popover-scrolling',
        suppressScrollX: true,
        scrollYMarginOffset: 16
      }
    },

    templateHelpers: function () {
      var utils           = require('workflow/utils/workitem.util'),
          groupDetails    = this.model.get('assignedto') ? this.model.get('assignedto') :
                            this.model.get('task_assignees') ?
                            this.model.get('task_assignees').assignedto : undefined,
          isGroup         = groupDetails !== undefined ? true : false,
          dueDate         = this.model.get('task_due_date') === null ? "" :
                            this.model.get('task_due_date'),
          status          = this.model.get('task_status') === null ? "" :
                            this.model.get('task_status'),
          statusOptions   = {
            dueDate: dueDate,
            status: status
          },
          formattedStatus = utils.formatStatus(statusOptions);

      return {
        groupName: isGroup === true ? groupDetails.groupName : '',
        isGroup: isGroup,
        status: formattedStatus.status
      };
    },

    onRender: function () {

      this.setPopoverSize();
      this.usercardPopover.show(this.userCardListView);
    },

    searchUser: function (e) {
      var searchVal      = e.currentTarget.value,
          userCollection = this.userCardListView.completeCollection,
          models;

      if (searchVal && searchVal.length > 0) {
        var keywords = searchVal.toLowerCase().split(' ');
        models = userCollection.filter(function (item) {
          var name      = item.get("name"),
              firstname = item.get("first_name"),
              lastname  = item.get("last_name");

          name = name ? name.trim().toLowerCase() : "";
          firstname = firstname ? firstname.trim().toLowerCase() : "";
          lastname = lastname ? lastname.trim().toLowerCase() : "";

          var isMatch = _.reduce(keywords, function (result, keyword) {
            return result && (name.indexOf(keyword) >= 0 || firstname.indexOf(keyword) >= 0 ||
                              lastname.indexOf(keyword) >= 0);
          }, true);
          return isMatch;
        });
      } else {
        models = this.userCardListView.completeCollection.models;
      }
      this.userCardListView.Usercollection.reset(models);
    },

    toggleSearchInput: function () {
      if (this.ui.wfstatusUserInput.hasClass('binf-active')) {
        $('.wfstatus-user-input').hide();
        $('.wfstatus-usercard-popover-header-labels').show();
        this.ui.wfstatusUserInput.removeClass('binf-active');
      } else {
        $('.wfstatus-user-input').show();
        $('.wfstatus-usercard-popover-header-labels').hide();
        this.ui.wfstatusUserInput.addClass('binf-active');
      }
    },

    setPopoverSize: function () {

      var PopOverContentEle = this.$el.find(".wfstatus-usercard-popover-content.popover");
      if (this.model.get('assignedto')) {
        var assignees = this.model.get('assignedto').assignees ?
                        this.model.get('assignedto').assignees :
                        this.model.get('task_assignees').assignees;
        if (assignees) {
          switch (assignees.length) {
          case 1 :
            PopOverContentEle.addClass("small");
            break;
          case 2:
            PopOverContentEle.addClass("medium");
            break;
          }
        }
      } else {
        PopOverContentEle.addClass("small");
      }
    }
  });

  function ShowPopOver(options) {
    var Utils        = require('workflow/utils/workitem.util');
    Utils.unbindPopover(options);
    var globalConfig = initializePopover(options);
    bindEvents(options);
    setPopoverPointer(globalConfig);

  }
  function initializePopover(options) {

    var userDialog,
        userDialogPointer,
        userDialogMask,
        parentNodeId,
        globalConfig     = {},
        uniqueID     = _.uniqueId(3),
        defaultContainer = $.fn.binf_modal.getDefaultContainer();

    userDialog = document.createElement('div');
    userDialog.id = 'wfstatus-usercard-popover_' + uniqueID;
    parentNodeId = "#wfstatus-usercard-popover_" + uniqueID;
    userDialog.setAttribute("class", "wfstatus-usercard-popover");

    userDialogPointer = document.createElement('div');
    userDialogPointer.id = 'wfstatus-usercard-popover-pointer_' + uniqueID;

    userDialogMask = document.createElement('div');
    userDialogMask.id = 'wfstatus-usercard-popover-mask_' + uniqueID;

    $(options.delegateTarget).css("overflow", "hidden");
    globalConfig.widgetDialog = userDialog;
    globalConfig.widgetDialogPointer = userDialogPointer;
    globalConfig.widgetDialogMask = userDialogMask;
    globalConfig.placeholder = options.delegateTarget;
    globalConfig.widgetBaseElement = options.delegateTarget;

    $(defaultContainer).append(userDialogMask).append(userDialog).append(
        userDialogPointer);

    var UserCardPopoverRegion = new Marionette.Region({
      el: parentNodeId
    });

    var popoverView = new PopOverView(options.UserCardviewOptions);
    UserCardPopoverRegion.show(popoverView);

    $(parentNodeId).css({display: "block"}).animate({opacity: 1.0});

    return globalConfig;
  }

  function bindEvents(options) {
    var Utils        = require('workflow/utils/workitem.util');
    $(".binf-modal-header").bind('keydown click',
        {callbackFun: Utils.unbindPopover, popoverOptions: options}, handlePopoverDialog);
    $(".binf-modal-backdrop").bind('keydown click',
        {callbackFun: Utils.unbindPopover, popoverOptions: options}, handlePopoverDialog);
    $(window).bind('resize.onUserCardPopOver', function () {
      Utils.unbindPopover(options);
    });
    $(window).bind('popstate.onUserCardPopOver', function () {
      Utils.unbindPopover(options);
    });
    $(window).bind('hashchange.onUserCardPopOver', function () {
      Utils.unbindPopover(options);
    });

    $(".wfstatus-table tbody").scroll(function() {
      Utils.unbindPopover(options);
    });
    $(document).off('focusin.binf.modal');
  }
  function handlePopoverDialog(event) {

    var unbindWidgetFromBody = false,
        _e                   = event || window.event,
        options              = _e.data.popoverOptions;

    if (_e.type === 'popstate' || _e.type === 'hashchange') {
      unbindWidgetFromBody = true;
    }
    else if ((_e.type === 'keyup' || _e.type === 'keydown')) {

      if ((_e.keyCode === 27 || _e.which === 27)) {
        if ($('.wfstatus-usercard-popover').is(':visible') && $('.cs-dialog').is(':visible')) {
          unbindWidgetFromBody = true;
        }
        setFocusOnTargetEle();
      }
    }
    else if (_e.type === "resize") {
      if ($('.wfstatus-usercard-popover').is(':visible') && $('.cs-dialog').is(':visible')) {
        unbindWidgetFromBody = true;
      }
      setFocusOnTargetEle();
    } else {
      if (!$(_e.target).closest('.wfstatus-usercard-popover').length && _e.type === 'click') {
        if (!($(_e.target).closest('[id*=wfstatus-usercard-popover]').length &&
            !$(_e.target).closest('[id*=wfstatus-usercard-popover-mask_]').length) &&
            !$(_e.target).closest('[class*=ui-autocomplete]').length) {
          unbindWidgetFromBody = true;
        }
      }

    }
    unbindWidgetFromBody ? _e.data.callbackFun(options) : "";

    function setFocusOnTargetEle() {
      if (options) {
        var element = options.popoverOptions;
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
  function setPopoverPointer(globalConfig) {

    var widgetDialog        = $(globalConfig.widgetDialog),
        widgetDialogPointer = $(globalConfig.widgetDialogPointer),
        widgetBaseElement   = $(globalConfig.widgetBaseElement),
        setDialogCenter     = false;

    globalConfig.widgetBaseElement = $(globalConfig.widgetBaseElement).width() === 0 ?
                                     $("[data-value=" +
                                       $(globalConfig.widgetBaseElement).attr("data-value") +
                                       "]") : globalConfig.widgetBaseElement;

    widgetDialog.css({"position": "absolute", "left": "0", "top": "0"});
    widgetDialogPointer.css({"position": "absolute", "left": "0", "top": "0"})
        .addClass("wfstatus-usercard-popover-arrow-left");

    var leftPos = parseInt(widgetBaseElement.outerWidth() + 10, 10);
    widgetDialog.position({
      my: "left top",
      at: "left+" + leftPos + " top -" + (widgetBaseElement.parent().height() / 2),
      of: globalConfig.widgetBaseElement,
      collision: "flipfit flipfit"
    });

    var widgetDialogLeftPos  = widgetDialog.offset().left,
        widgetDialogRightPos = widgetDialog.offset().left + widgetDialog.width(),
        targetElementLeftPos = widgetBaseElement.offset().left,
        targetElementTopPos  = widgetBaseElement.offset().top + 10,
        baseWrapsParent      = widgetBaseElement.parent().height() ===
                               widgetBaseElement.height();
    if (baseWrapsParent) {
      targetElementTopPos = widgetBaseElement.offset().top +
                            Math.ceil(widgetBaseElement.height() / 4) + 2;
    }
    if (widgetDialogLeftPos < targetElementLeftPos) {
      widgetDialogPointer.css({
        "position": "absolute",
        "left": widgetDialogRightPos,
        "top": targetElementTopPos
      });

      widgetDialogPointer.removeClass("wfstatus-usercard-popover-arrow-left").addClass(
          "wfstatus-usercard-popover-arrow-right");

      setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                        1 > widgetBaseElement.offset().left;
    } else {
      widgetDialogPointer.css({
        "position": "absolute",
        "left": widgetDialogLeftPos - 10,
        "top": targetElementTopPos
      });
      widgetDialogPointer.removeClass("wfstatus-usercard-popover-arrow-right").addClass(
          "wfstatus-usercard-popover-arrow-left");

      setDialogCenter = parseInt($(widgetDialogPointer).css("left").replace("px", ""), 10) +
                        1 < (widgetBaseElement.offset().left + widgetBaseElement.width());
    }

    var widgetDialogBottomPos        = widgetDialog.offset().top + widgetDialog.height(),
        widgetDialogPointerBottomPos = widgetDialogPointer.offset().top + 25;
    if (widgetDialogBottomPos < widgetDialogPointerBottomPos) {
      widgetDialog.css("top",
          parseInt(widgetDialog.offset().top + (baseWrapsParent ? 0 : 20), 10));
    } else if (widgetDialogBottomPos - widgetDialogPointerBottomPos > 20) {
      widgetDialog.css("top",
          parseInt(widgetDialog.offset().top - (baseWrapsParent ? 0 : 20), 10));
    }
    if (setDialogCenter) {
      widgetDialog.css({"left": $(window).width() / 2 - widgetDialog.width() / 2});
      widgetDialogPointer.css({"opacity": "0"});
    } else {
      widgetDialogPointer.css({"opacity": "1"});
    }
  }

  return {
    ShowPopOver: ShowPopOver
  };
});
