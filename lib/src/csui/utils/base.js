/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/errormessage', 'csui/utils/messagehelper',
  'csui/utils/types/date', 'csui/utils/types/number',
  'csui/utils/types/member', 'csui/utils/types/localizable', 'i18n'
], function (_, $, Url, Message, MessageHelper, date, number, member,
    localizable, i18n) {
  'use strict';

  var $window = $(window);
  var messageHelper = new MessageHelper();
  messageHelper.on("showErrors", function (errors, html, title, showit) {
    alert($(html).text());
  });

  var escapeHtmlHelper = $("<p></p>");

  function escapeHtml(text, preserveLineBreaks) {
    var html = escapeHtmlHelper.text(text).html();
    if (preserveLineBreaks) {
      html = html.replace(/\r?\n/g, "\r\n<br>");
    }
    return html;
  }

  function isBackbone(value) {
    return value && value.once;
  }

  function isPlaceholder(value) {
    return value && (_.isString(value) || _.isElement(value) || value instanceof $);
  }

  function isTouchBrowser() {
    return !!(('ontouchstart' in window) || (navigator.maxTouchPoints) ||
              (navigator.msMaxTouchPoints));
  }

  function isAppleMobile() {
    if (navigator && navigator.userAgent != null) {
      var appleMatches = navigator.userAgent.match(/(iPhone |iPad)/i);
      return (appleMatches != null);
    }
    return true;
  }

  function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1;
  }

  function isLandscape() {
    return isAppleMobile() && (window.matchMedia("(orientation: landscape)").matches);
  }

  function isPortrait() {
    return isAppleMobile() && (window.matchMedia("(orientation: portrait)").matches);
  }

  function isIE11() {
    if (navigator && navigator.userAgent) {
      var isInternetExplorer11 = /Trident.*11/i.test(navigator.userAgent);
      return isInternetExplorer11;
    }
  }

  function isMozilla() {
    if (navigator && navigator.userAgent) {
      var isMozilla = /Mozilla/.test(navigator.userAgent);
      return isMozilla;
    }
  }

  function isEdge() {
    if (navigator && navigator.userAgent) {
      var isEdge = /Edge/.test(navigator.userAgent);
      return isEdge;
    }
  }

  function isFirefox() {
    if (navigator && navigator.userAgent) {
      var isFirefox = /Firefox/.test(navigator.userAgent);
      return isFirefox;
    }
  }
  function isMSBrowser() {
    return isIE11() || isEdge();
  }

  function isChrome() {
    var isChromium  = window.chrome,
        winNav      = window.navigator,
        vendorName  = winNav.vendor,
        isOpera     = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge    = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS"),
        retVal      = false;
    if (isIOSChrome ||
        (isChromium != null && vendorName === "Google Inc." && isOpera === false &&
         isIEedge === false)) {
      retVal = true;
    }
    return retVal;
  }

  function isSafari() {
    if (navigator && navigator.userAgent) {
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      return isSafari;
    }
  }
  function px2em(pxContainerWidth, pxElemWidth) {
    var pxInEms = 0;
    if (pxElemWidth > 0) {
      pxInEms = Math.floor(2 * pxContainerWidth / pxElemWidth);
    }
    return pxInEms;
  }

  function isVisibleInWindowViewport(el) {
    var $el = el instanceof $ ? el : $(el);
    if (!$el.is(':visible')) {
      return false;
    }
    var position = $el.offset(),
        offset   = {
          left: window.pageXOffset,
          top: window.pageYOffset
        },
        extents  = {
          width: $window.width(),
          height: $window.height()
        };
    return position.left >= offset.left && position.left - offset.left < extents.width &&
           position.top >= offset.top && position.top - offset.top < extents.height;
  }

  function isVisibleInWindowViewportHorizontally(el) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var elRect = elem.getBoundingClientRect();
    return elRect.left >= window.pageXOffset && elRect.right - window.pageXOffset < $window.width();
  }

  function isVisibleInWindowViewportVertically(el) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var elRect = elem.getBoundingClientRect();
    return elRect.top >= window.pageYOffset &&
           elRect.bottom - window.pageYOffset < $window.height();
  }
  function isElementVisibleInParents(el, levels, iPercentX, iPercentY) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var tolerance = 0.01;
    var percentX = iPercentX !== undefined ? iPercentX : 100;
    var percentY = iPercentY !== undefined ? iPercentY : 100;
    var elemRect = elem.getBoundingClientRect();
    var parentRects = [];
    var maxLevels = levels || 5;
    var curLevel = 0;
    while (elem.parentElement != null && curLevel < maxLevels) {
      parentRects.push(elem.parentElement.getBoundingClientRect());
      elem = elem.parentElement;
      curLevel++;
    }

    var visibleInAllParents = parentRects.every(function (parentRect) {
      var visiblePixelX = Math.min(elemRect.right, parentRect.right) -
                          Math.max(elemRect.left, parentRect.left);
      var visiblePixelY = Math.min(elemRect.bottom, parentRect.bottom) -
                          Math.max(elemRect.top, parentRect.top);
      var visiblePercentageX = visiblePixelX / elemRect.width * 100;
      var visiblePercentageY = visiblePixelY / elemRect.height * 100;
      return visiblePercentageX + tolerance > percentX &&
             visiblePercentageY + tolerance > percentY;
    });
    return visibleInAllParents;
  }
  function isElementVisibleInParent(el, parent, iPercentX, iPercentY) {
    if (el === undefined || parent === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var container = parent instanceof $ ? parent[0] : parent;
    if (!container || !container.getBoundingClientRect) {
      return false;
    }
    var tolerance = 0.01;
    var percentX = iPercentX !== undefined ? iPercentX : 100;
    var percentY = iPercentY !== undefined ? iPercentY : 100;
    var elemRect = elem.getBoundingClientRect();
    var contRect = container.getBoundingClientRect();
    var visiblePixelX = Math.min(elemRect.right, contRect.right) -
                        Math.max(elemRect.left, contRect.left);
    var visiblePixelY = Math.min(elemRect.bottom, contRect.bottom) -
                        Math.max(elemRect.top, contRect.top);
    var visiblePercentageX = visiblePixelX / elemRect.width * 100;
    var visiblePercentageY = visiblePixelY / elemRect.height * 100;
    return visiblePercentageX + tolerance > percentX &&
           visiblePercentageY + tolerance > percentY;
  }

  function checkAndScrollElemToViewport(elem) {
    var $elem            = $(elem),
        scrollSelector   = $elem.closest('.csui-perfect-scrolling').length > 0 ?
                           '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        elemScrollParent = $elem.closest(scrollSelector),
        stickyHeader     = elemScrollParent.siblings(".csui-tab-contents-header-wrapper");
    if (!!stickyHeader[0]) {
      var elemTop       = $elem.offset().top,
          viewportTop   = elemScrollParent[0].getBoundingClientRect().top + stickyHeader.height(),
          isElemVisible = elemTop > viewportTop;
      if (!isElemVisible) {
        var currScrollTop = elemScrollParent.scrollTop();
        elemScrollParent.scrollTop(currScrollTop - (viewportTop - elemTop));
      }
    }

  }

  function setScrollHandler(e) {
    var eventArg = e.data;
    var inputElement      = eventArg.inputElement,
        view              = eventArg.view,
        dropdownContainer = eventArg.dropdownContainer,
        callback          = eventArg.callback;
    inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
    if (dropdownContainer.length > 0 && dropdownContainer[0] !== e.target &&
        dropdownContainer.is(":visible") && callback) {
      callback(view);
    }
  }

  function adjustDropDownField(inputElement, dropdownContainer, applyWidth, view, callback,
      scrollableDropdownContainer) {
    var scrollEl;
    var eventArg = {
      inputElement: inputElement,
      view: view,
      dropdownContainer: dropdownContainer,
      callback: callback
    };

    var isIEBrowser    = this.isIE11(),
        isTouchBrowser = this.isTouchBrowser();

    if (isTouchBrowser &&
        !inputElement.closest('.csui-scrollable-writemode').hasClass('csui-dropdown-open')) {
      inputElement.closest('.csui-scrollable-writemode').addClass('csui-dropdown-open');
    }
    if (inputElement.parents(".csui-scrollablecols").length > 0 &&
        inputElement.parents(".cs-form-set-container").length >
        0) {
      scrollEl = inputElement.parents(".csui-scrollablecols").parents(".cs-form-set-container").find
      (".ps-container.ps-active-x");
      var isRtl            = i18n && i18n.settings.rtl,
          inputElementLeft = inputElement.offset().left,
          leftShadow       = inputElement.parents(".csui-scrollablecols").siblings(
              ".csui-lockedcols").find(".csui-shadowleft-container"),
          leftShadowLeft   = leftShadow.offset().left,
          currentLeft,
          scrollUpdate;
      if (isRtl) {
        var inputElementRight = inputElementLeft + inputElement.outerWidth();
        scrollUpdate = inputElementRight - leftShadowLeft;
      }
      else {
        var leftShadowRight = leftShadowLeft + leftShadow.outerWidth();
        scrollUpdate = leftShadowRight - inputElementLeft;
      }
      if (scrollUpdate > 0) {
        scrollEl.unbind('scroll', setScrollHandler);
        scrollEl.one('set:scrolled', function () {
          if (!!scrollEl) {
            scrollEl.bind('scroll', eventArg, setScrollHandler);
          }
          autoAlignDropDowns(inputElement, dropdownContainer, applyWidth,
              scrollableDropdownContainer, isIEBrowser);
          hideDropDowns(inputElement, dropdownContainer, view, callback);
        });
        if (isRtl) {
          currentLeft = scrollEl.scrollLeftRtl();
          scrollEl.scrollLeftRtl(currentLeft + scrollUpdate);
        }
        else {
          currentLeft = scrollEl.scrollLeft();
          scrollEl.scrollLeft(currentLeft - scrollUpdate);
          var that = this;
          setTimeout(function () {
            if (that.isTouchBrowser && !inputElement.closest('.csui-scrollable-writemode').hasClass(
                '.csui-dropdown-open')) {
              inputElement.closest('.csui-scrollable-writemode').addClass('csui-dropdown-open');
            }
          }, 100);
        }
        return;
      }
    }

    if (!!scrollEl) {
      scrollEl.bind('scroll', eventArg, setScrollHandler);
    }
    autoAlignDropDowns(inputElement, dropdownContainer, applyWidth, scrollableDropdownContainer,
        isIEBrowser);
    hideDropDowns(inputElement, dropdownContainer, view, callback);

  }
  function autoAlignDropDowns(inputElement, dropdownContainer, applyWidth,
      scrollableDropdownContainer, isIEBrowser) {
    var isRtl                 = i18n && i18n.settings.rtl,
        elTop                 = inputElement.offset().top,
        elPositionX           = inputElement.offset().left,
        scrollSelector        = inputElement.closest('.csui-perfect-scrolling').length > 0 ?
                                '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        form                  = inputElement.closest(scrollSelector),
        modalContentElem      = isIEBrowser ? [] :
                                (form.length > 0 ? form.parents(".binf-modal-content") :
                                 inputElement.closest(".binf-modal-content")), /*For
         IE, left & top position is calculated with respect to document*/
        modalContentPositionX = modalContentElem.length > 0 ? (isRtl ?
                                                               (modalContentElem.outerWidth() +
                                                                modalContentElem.offset().left) :
                                                               modalContentElem.offset().left) :
                                (isRtl ? $(document).width() : 0),
        modalContentTop       = modalContentElem.length > 0 ? modalContentElem.offset().top : 0,
        controlheight         = inputElement.outerHeight(),
        dropdownWidth         = inputElement.outerWidth(),
        perspectivePanel      = $(".cs-perspective-panel"),
        perspective           = inputElement.closest(".cs-perspective"),
        perspectiveHeight     = perspective.length > 0 ?
                                perspective.outerHeight() : $(document).height(),
        perspectiveTop        = perspective.length > 0 ?
                                perspective.offset().top : 0,
        elemBoundingRect      = inputElement[0].getBoundingClientRect(),
        contextBottom, contextTop;

    if (applyWidth) {
      dropdownContainer.css({
        "width": dropdownWidth
      });
    }
    if (scrollSelector != '.csui-normal-scrolling') {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "hidden");
    }

    var perspectivePanelClientTop = perspectivePanel.length > 0 ?
                                    perspectivePanel[0].getBoundingClientRect().top : 0;
    if (perspectivePanelClientTop < 0) {
      perspectivePanelClientTop = 0;
    }
    var spaceOnTop           = elemBoundingRect.top - perspectivePanelClientTop,
        spaceOnBottom        = window.innerHeight - elemBoundingRect.top,
        isDropdownShownOnTop = spaceOnTop > spaceOnBottom;

    if (!!scrollableDropdownContainer) {
      scrollableDropdownContainer.css({
        'max-height': Math.abs((isDropdownShownOnTop ? spaceOnTop : spaceOnBottom) * 0.9) + 'px'
      });
    }
    if (isDropdownShownOnTop) {

      if (isIEBrowser) {
        contextBottom = document.documentElement.offsetHeight + document.documentElement.scrollTop -
                        elTop;
      } else {
        if (modalContentElem.length > 0) {
          contextBottom = modalContentElem.outerHeight() + modalContentTop - elTop;
        } else {
          if (perspective.length > 0 || isSafari()) {
            contextBottom = perspectiveHeight + perspectiveTop - elTop;
          } else {
            contextBottom = document.documentElement.offsetHeight  -  elTop;
          }
        }
      }
      if (isRtl) {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "right": modalContentPositionX - (elPositionX + dropdownWidth),
          "top": "auto",
          "bottom": contextBottom
        });
      } else {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "left": elPositionX - modalContentPositionX,
          "top": "auto",
          "bottom": contextBottom
        });
      }
      if (dropdownContainer.hasClass('binf-datetimepicker-widget')) {
        dropdownContainer.addClass('binf-top').removeClass('binf-bottom');
      }
    } else {
      if (isIEBrowser) {
        contextTop = elTop + controlheight - document.documentElement.scrollTop;
      } else {
        if (modalContentElem.length > 0) {
          contextTop = elTop + controlheight - modalContentTop;
        } else {
          if (perspective.length > 0) {
            contextTop = elTop + controlheight - perspectiveTop;
          } else {
            contextTop = elemBoundingRect.top + elemBoundingRect.height - perspectiveTop;
          }

        }
      }
      if (isRtl) {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "right": modalContentPositionX - (elPositionX + dropdownWidth),
          "top": contextTop,
          "bottom": "auto"
        });
      } else {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "left": elPositionX - modalContentPositionX,
          "top": contextTop,
          "bottom": "auto"
        });
      }
      if (dropdownContainer.hasClass('binf-datetimepicker-widget')) {
        dropdownContainer.addClass('binf-bottom').removeClass('binf-top');
      }
    }
  }

  function hideDropDowns(inputElement, dropdownContainer, view, callback) {
    var scrollSelector = inputElement.closest('.csui-perfect-scrolling').length > 0 ?
                         '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        form           = inputElement.closest(scrollSelector),
        scrollableSet;
    form.bind('scroll', view, function (e) {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
    $(window).bind('scroll', function () {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
    $(window).bind('resize', function () {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
  }
  function stringifyDate(date) {
    return JSON.stringify(date);
  }
  function dateToLocalIsoString(date, format) {
    if (format === 'YYYY-MM-DD') {
      return date.serializeDate(date);
    }
    return date.serializeDateTime(date);
  }

  function findFocusables(element) {
    return $(element).find('a[href], area[href], input, select, textarea, button,' +
                           ' iframe, object, embed, *[tabindex], *[contenteditable]')
        .filter(':visible:not([disabled])');
  }

  return {
    MessageHelper: messageHelper,
    ErrorHandler: messageHelper,

    MessageType: Message.Type,
    Message: Message.Message,
    RequestErrorMessage: Message.RequestErrorMessage,

    ErrorStatus: Message.Type,
    ErrorToShow: Message.Message,
    ErrorMessage: Message.ErrorMessage,
    Error: Message.RequestErrorMessage,

    exactDateFormat: date.exactDateFormat,
    exactTimeFormat: date.exactTimeFormat,
    exactDateTimeFormat: date.exactDateTimeFormat,

    parseDate: date.deserializeDate,
    stringifyDate: stringifyDate,
    dateToLocalIsoString: dateToLocalIsoString,
    deserializeDate: date.deserializeDate,
    serializeDate: date.serializeDate,
    serializeDateTime: date.serializeDateTime,
    formatDate: date.formatDate,
    formatDateTime: date.formatDateTime,
    formatExactDate: date.formatExactDate,
    formatExactTime: date.formatExactTime,
    formatExactDateTime: date.formatExactDateTime,
    formatFriendlyDate: date.formatFriendlyDate,
    formatFriendlyDateTime: date.formatFriendlyDateTime,
    formatFriendlyDateTimeNow: date.formatFriendlyDateTimeNow,
    formatISODateTime: date.formatISODateTime,
    formatISODate: date.formatISODate,

    getReadableFileSizeString: number.formatFileSize,
    formatFileSize: number.formatFileSize,
    formatFriendlyFileSize: number.formatFriendlyFileSize,
    formatExactFileSize: number.formatExactFileSize,

    formatInteger: number.formatInteger,
    formatIntegerWithCommas: number.formatIntegerWithCommas,

    formatMemberName: member.formatMemberName,

    getClosestLocalizedString: localizable.getClosestLocalizedString,

    localeCompareString: localizable.localeCompareString,
    localeContainsString: localizable.localeContainsString,
    localeEndsWithString: localizable.localeEndsWithString,
    localeIndexOfString: localizable.localeIndexOfString,
    localeStartsWithString: localizable.localeStartsWithString,

    formatMessage: localizable.formatMessage,

    escapeHtml: escapeHtml,

    isBackbone: isBackbone,
    isPlaceholder: isPlaceholder,
    Url: Url,
    isTouchBrowser: isTouchBrowser,
    isAppleMobile: isAppleMobile,
    isMacintosh: isMacintosh,
    isIE11: isIE11,
    isEdge: isEdge,
    isMozilla: isMozilla,
    isFirefox: isFirefox,
    isSafari: isSafari,
    isLandscape: isLandscape,
    isPortrait: isPortrait,
    isMSBrowser: isMSBrowser,
    isChrome: isChrome,
    px2em: px2em,
    isVisibleInWindowViewport: isVisibleInWindowViewport,
    isVisibleInWindowViewportHorizontally: isVisibleInWindowViewportHorizontally,
    isVisibleInWindowViewportVertically: isVisibleInWindowViewportVertically,
    isElementVisibleInParents: isElementVisibleInParents,
    isElementVisibleInParent: isElementVisibleInParent,
    checkAndScrollElemToViewport: checkAndScrollElemToViewport,
    setScrollHandler: setScrollHandler,
    adjustDropDownField: adjustDropDownField,
    autoAlignDropDowns: autoAlignDropDowns,
    hideDropDowns: hideDropDowns,
    findFocusables: findFocusables
  };
});
