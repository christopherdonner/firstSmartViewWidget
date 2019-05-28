/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/errormessage", 'i18n!csui/utils/impl/nls/lang'
], function (module, $, _, Backbone, log, Message, Lang) {
  "use strict";

  log = log(module.id);

  var ts = "0.3s";
  var animationShow = {"-webkit-transition": "top " + ts, "transition": "top " + ts};
  var animationHide = {"-webkit-transition": "top " + ts, "transition": "top " + ts};
  var animationNone = {"-webkit-transition": "", "transition": ""};
  var animationFadeOut = {
    "-webkit-transition": "opacity " + ts,
    "transition": "opacity " + ts
  };

  var MessageHelper = Backbone.Collection.extend({
    model: Message.Message,
    title: '',

    showMessages: function (reset, show) {
      log.warn(
          'This method has been deprecated and will be removed in future. ' +
          'Please, use MoalAler or GlobalMessaage to report errors.')
      && console.warn(log.last);

      var title = Lang.ErrorStatiNice[this.getStatus()],
          showit = (show !== undefined) ? show : true;

      this.trigger("showErrors", this.groupBy('type'), this.toHtml(), title,
          showit);
      reset && this.reset();
    },

    addMessage: function (txt, type, title) {
      this.title = title || '';
      type = type || Message.Type.Error;
      var msg = new Message.Message({
        type: type,
        message: txt
      });
      return this.add([msg]);
    },

    showErrors: function (reset, show) {
      return this.showMessages(reset, show);
    },

    addError: function (error) {
      var errmsg = new Message.ErrorMessage();
      errmsg.message = error.message;
      return this.add([errmsg]);
    },

    addErrorMessage: function (errorts) {
      return this.add([errorts]);
    },

    getStatus: function () {
      return this.sortBy('type')[0].get('type');
    },

    clear: function () {
      return this.reset();
    },

    hasMessages: function () {
      return (this.length > 0);
    },

    getMessages: function () {
      return this.groupBy('type');
    },

    toHtml: function () {
      var template = _.template(Lang.ErrorHtmlTpl),
          html = [];

      _.each(this.groupBy('type'), function (msgType) {
        _.each(msgType.reverse(), function (msg) {
          html += template({
            statusPlain: _.keys(Message.Type)[msg.get('type')],
            statusNice: Lang.ErrorStatiNice[msg.get('type')],
            msg: msg.get('message')
          });
        });
      });

      return html;
    },

    removeField: function (viewel, selector, values) {
      var elem = viewel.find(selector);
      values.forEach(function (oldval) {
        var oldclass = selector + "-" + oldval;
        var oldel = elem.find(oldclass);
        if (!oldel.hasClass("binf-hidden")) {
          oldel.addClass("binf-hidden");
        }
      });
    },
    switchField: function (viewel, selector, value, values) {
      var elem = viewel.find(selector);
      var newclass = selector + "-" + value;
      var newel = elem.find(newclass);
      var changed = false;
      if (newel.hasClass("binf-hidden")) {
        values.forEach(function (oldval) {
          var oldclass = selector + "-" + oldval;
          if (newclass != oldclass) {
            var oldel = elem.find(oldclass);
            if (!oldel.hasClass("binf-hidden")) {
              oldel.addClass("binf-hidden");
            }
          }
        });
        newel.removeClass("binf-hidden");
        changed = true;
      }
      return {changed: changed, element: newel};
    },

    transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    createPanel: function (globals, Panel, options, oldPanel) {
      var newPanel = new Panel(options);
      newPanel.$el.removeClass("binf-panel binf-panel-default");
      newPanel.$el.addClass("csui-global-message");
      globals.classNames && newPanel.$el.addClass(globals.classNames);
      newPanel.render();
      if (oldPanel) {
        if (oldPanel.$el.hasClass("binf-hidden") !=
            newPanel.$el.hasClass("binf-hidden")) {
          newPanel.$el.toggleClass("binf-hidden");
        }
        var collapsed = oldPanel.$el.hasClass("csui-collapsed");
        if (collapsed != newPanel.$el.hasClass("csui-collapsed")) {
          if (collapsed) {
            newPanel.doCollapse(false);
          } else {
            newPanel.doExpand(false);
          }
        }
      }
      return newPanel;
    },

    activatePanel: function (newPanel, relatedView, parentView, oldPanel) {
      if (!oldPanel && !newPanel.$el.hasClass("binf-hidden")) {
        newPanel.$el.addClass("binf-hidden");
        newPanel.$el.appendTo(parentView.el);
        newPanel.doShow(relatedView, parentView);
      } else {
        if (relatedView) {
          this.resizePanel(newPanel, relatedView);
        }
        newPanel.$el.appendTo(parentView.el);
        if (oldPanel) {
          oldPanel.destroy();
        }
      }
      return newPanel;
    },

    showPanel: function (view, relatedView, parentView) {
      if (view.$el.hasClass("binf-hidden")) {
        var self = this,
            slideSize = this.getTargetSizes(parentView.$el);
        var panel = _.extend({
          csuiBeforeShow: function () {
            if (relatedView) {
              var panelSize = self.getTargetSizes(relatedView.$el);
              self.setPanelHeight(view, panelSize);
            }
          }
        }, view);
        this.slidedown(panel, view.$el, view.$el, slideSize);
      }
    },

    slidedown: function (view, elem, hidden, sizes) {
      var distance, elemHeight;
      hidden = hidden || elem;

      view.$el === elem || view.$el.removeClass("csui-collapsed");
      view.$el.removeClass(view.$el === elem ? "csui-hiding" : "csui-collapsing");
      view.$el.addClass(view.$el === elem ? "csui-showing" : "csui-expanding");
      if (view.csuiBeforeShow) {
        view.csuiBeforeShow();
      }

      var position = elem.css("position");
      if (hidden.hasClass("binf-hidden")) {
        elem.css(animationNone);
        elem.addClass('position-hidden');
        if (elem !== hidden) {
          elemHeight = elem.height();
          distance = Math.min(sizes.height - sizes.top, elemHeight);
          elem.css({
            "bottom": "calc(100% - " + (sizes.top + distance) + "px)"
          });
        }
        hidden.removeClass("binf-hidden");
        elemHeight = elem.height();
        var rect = this.getTargetSizes(elem);
        if (position === "relative") {
          distance = Math.min(sizes.height - rect.height, elemHeight);
          elem.css({
            "top": distance + "px"
          });
        } else /* if (position==="absolute") */ {
          distance = Math.min(rect.top, sizes.top + elemHeight);
          elem.css({
            "top": distance + "px"
          });
        }
        elem.removeClass('position-hidden');
        elem.addClass('position-show');
        var pos = elem.position(); // just access property, so browser updates element
      }
      elem.one(this.transitionEnd(), function () {
        if (view.$el === elem ? "csui-showing" : "csui-expanding") {
          elem.css(animationNone);
          view.$el.removeClass(view.$el === elem ? "csui-showing" : "csui-expanding");
          if (view.csuiAfterShow) {
            view.csuiAfterShow();
          }
        }
      });
      if (position === "relative") {
        elem.css(_.extend({"top": "0px"}, animationShow));
      } else /* if (position==="absolute") */ {
        elem.css(_.extend({"top": sizes.top + "px"}, animationShow));
      }

      return view;
    },

    expandPanel: function (view, details, hidden, animated) {
      hidden = hidden || details;
      if (view.$el.hasClass("csui-collapsed") || hidden.hasClass("binf-hidden") ||
          view.$el.hasClass("csui-collapsing")) {
        animated = (animated === true || animated === undefined) ? true : false;
        if (animated) {
          this.slidedown(view, details, hidden, this.getTargetSizes(details));
        }
        else {
          view.$el.removeClass("csui-collapsed");
          hidden.removeClass("binf-hidden");
        }
      }
    },

    hidePanel: function (view) {
      if (!view.$el.hasClass("binf-hidden")) {
        this.slideup(view, view.$el, view.$el);
      }
    },

    slideup: function (view, elem, hidden) {

      hidden = hidden || elem;
      var position = elem.css("position");
      view.$el.removeClass(view.$el === elem ? "csui-showing" : "csui-expanding");
      view.$el.addClass(view.$el === elem ? "csui-hiding" : "csui-collapsing");
      if (view.csuiBeforeHide) {
        view.csuiBeforeHide();
      }
      elem.one(this.transitionEnd(), function () {
        if (view.$el.hasClass(view.$el === elem ? "csui-hiding" : "csui-collapsing")) {
          hidden.addClass("binf-hidden");
          elem.css(_.extend({"top": "", "bottom": ""}, animationNone));
          view.$el.removeClass(view.$el === elem ? "csui-hiding" : "csui-collapsing");
          view.$el === elem || view.$el.addClass("csui-collapsed");
          if (view.csuiAfterHide) {
            view.csuiAfterHide();
          }
        }
      });
      var rect = this.getTargetSizes(elem);
      if (position === "relative") {
        elem.css({"top": "0px"});
      } else /* if (position==="absolute") */ {
        elem.css({"top": rect.top + "px"});
      }
      var pos = elem.position(); // just access property, so browser updates element
      var min_top = 0;
      var idattr = elem.attr("id");
      if (idattr && elem.hasClass("csui-minheight")) {
        var heightSource = elem.find("." + idattr + "-heightsource");
        if (heightSource.length > 0) {
          min_top = heightSource.outerHeight();
        }
      }
      elem.css(
          _.extend({"top": (parseInt(min_top) - rect.height) + "px"}, animationHide));
      return elem;
    },

    collapsePanel: function (view, details, hidden, animated) {
      hidden = hidden || view.$el;
      if (!view.$el.hasClass("csui-collapsed") || !hidden.hasClass("binf-hidden") ||
          view.$el.hasClass("csui-expanding")) {
        animated = (animated === true || animated === undefined) ? true : false;
        if (animated) {
          this.slideup(view, details, hidden);
        }
        else {
          view.$el.addClass("csui-collapsed");
          hidden.addClass("binf-hidden");
        }
      }
    },

    fadeoutPanel: function (view) {
      var opacity = view.$el.css("opacity") || "1";
      view.$el.css({"opacity": opacity});
      view.$el.one(this.transitionEnd(), function () {
        view.$el.addClass("binf-hidden");
        view.$el.css(_.extend({"opacity": ""}, animationNone));
        if (view.csuiAfterHide) {
          view.csuiAfterHide();
        }
      });
      var opq = view.$el.css("opacity"); // just access property, so browser updates element
      view.$el.css(_.extend({"opacity": "0.0"}, animationFadeOut));
      return view;
    },

    resizePanel: function (view, location) {
      if (location) {
        var sizes = this.getTargetSizes(location.$el);
        this.setPanelHeight(view, sizes);
      }
      view.doResize && view.doResize();
    },

    getTargetSizes: function (location) {
      if (location) {
        var rect = location[0].getBoundingClientRect();
        return _.extend({width: rect.width, height: rect.height}, location.position());
      } else {
        return {left: 0, top: 0, width: 333, height: 63};
      }
    },

    setPanelHeight: function (view, sizes) {
      view.$el.find(".csui-height-target").height(sizes.height);
      return view;
    }

  });

  MessageHelper.prototype.toString = function () {
    var template = _.template(Lang.ErrorStringTpl),
        html = [];

    _.each(this.groupBy('type'), function (msgType) {
      _.each(msgType, function (msg) {
        html += template({
          statusPlain: _.keys(Message.Type)[msg.get('type')],
          statusNice: Lang.ErrorStatiNice[msg.get('type')],
          msg: msg.get('message')
        });
      });
    });

  };

  MessageHelper.version = '1.0';
  _.extend(MessageHelper, Backbone.Events);

  return MessageHelper;

});
