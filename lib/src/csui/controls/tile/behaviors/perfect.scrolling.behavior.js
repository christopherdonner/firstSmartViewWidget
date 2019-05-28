/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/base', 'csui/lib/perfect-scrollbar',
  'css!csui/controls/tile/behaviors/impl/perfect.scrolling'
], function (module, _, $, Marionette, base) {
  'use strict';
  var config = module.config();
  _.defaults(config, {
    usePerfectScrollbar: false
  });
  if (/\bperfectScrollbar[^=]/.test(location.search) ||
      /\bperfectScrollbar=true\b/.test(location.search)) {
    config.usePerfectScrollbar = true;
  }
  var defaultPluginOptions = {
    minScrollbarLength: 32,
    stopPropagationOnClick: false
  };

  var PerfectScrollingRegion = Marionette.Region.extend({
    constructor: function PerfectScrollingRegion(options) {
      Marionette.Region.prototype.constructor.apply(this, arguments);
      this._swapping = false;
      this
          .listenTo(this, 'before:swapOut', function () {
            this._swapping = true;
          })
          .listenTo(this, 'swapOut', function () {
            this._swapping = false;
          })
          .listenTo(this, 'show', function () {
            this._requestScrollbarUpdate();
          })
          .listenTo(this, 'empty', function () {
            if (!this._swapping) {
              this._requestScrollbarUpdate();
            }
          });
    },

    _requestScrollbarUpdate: function () {
      this._parent._parent.trigger('update:scrollbar');
    }
  });

  var PerfectScrollingBehavior = Marionette.Behavior.extend({
    defaults: {
      contentParent: null
    },

    constructor: function PerfectScrollingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      this.listenTo(view, 'render', this._applyClasses);

      if (this._useScrollbar() && this._usePerfectScrollbar()) {
        var updateOnWindowResize = getOption.call(this, 'updateOnWindowResize');
        this._renderState = 0;

        this
            .listenToOnce(view, 'render', function () {
              this.view.$el.on('csui:update:scrollbar.' + view.cid,
                  _.bind(this._updateScrollbarFromPropagation, this));
              if (updateOnWindowResize !== false) {
                $(window).bind('resize.' + view.cid, _.bind(this._updateScrollbar, this));
              }
            })
            .listenToOnce(view, 'before:destroy', function () {
              this.view.$el.off('csui:update:scrollbar.' + view.cid);
              if (updateOnWindowResize !== false) {
                $(window).unbind('resize.' + view.cid);
              }
            })
            .listenTo(view, 'before:render', function () {
              this._renderState = 1;
            })
            .listenTo(view, 'render', function () {
              this._renderState = 0;
            })
            .listenTo(view, 'dom:refresh', this._ensureScrollbar)
            .listenTo(view, 'ensure:scrollbar', this._ensureScrollbar)
            .listenTo(view, 'before:render', this._destroyScrollbar)
            .listenTo(view, 'before:destroy', this._destroyScrollbar)
            .listenTo(view, 'update:scrollbar', this._refreshScrollbar)
            .listenToOnce(view, 'before:render', function () {
              if (view instanceof Marionette.CollectionView && view.collection) {
                this
                    .listenTo(view.collection, 'reset', function () {
                      this._resetTriggered = true;
                    })
                    .listenTo(view, 'before:render:collection', function () {
                      ++this._renderState;
                    })
                    .listenTo(view, 'render:collection', function () {
                      this._resetTriggered = false;
                      --this._renderState;
                      if (!this._renderState) {
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'render:empty', function () {
                      if (this._resetTriggered || !this._renderState) {
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'add:child', function () {
                      if (!this._renderState) {
                        this._updateScrollbar();
                      }
                    })
                    .listenTo(view, 'remove:child', function () {
                      if (!this._resetTriggered && !this._renderState) {
                        this._updateScrollbar();
                      }
                    });
              }
            });
      }
    },

    _applyClasses: function () {
      var classes;
      this._contentParent = this._getContentParent();
      if (this._useScrollbar()) {
        if (this._usePerfectScrollbar()) {
          classes = 'csui-perfect-scrolling';
        } else {
          var suppressScrollX = getOption.call(this, 'suppressScrollX'),
              suppressScrollY = getOption.call(this, 'suppressScrollY');
          classes = 'csui-normal-scrolling';
          if (suppressScrollX) {
            classes += ' csui-no-scroll-x';
          }
          if (suppressScrollY) {
            classes += ' csui-no-scroll-y';
          }
        }
      } else {
        classes = 'csui-no-scrolling';
      }
      this._contentParent.addClass(classes);
    },

    _ensureScrollbar: function () {
      this._contentParent = !!this._contentParent ? this._contentParent : this._getContentParent();
      if (!this._contentParent) {
        throw new Error('The "dom:refresh"" event was triggered earlier ' +
                        'than the "render" event in view ' + this.view.cid +
                        '(' + Object.getPrototypeOf(this.view).constructor.name + ')');
      }
      if (this._perfectScrollbar) {
        this._contentParent.perfectScrollbar('update');
      } else {
        var options = _.reduce(['suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
          'scrollYMarginOffset', 'maxScrollbarLength', 'minScrollbarLength'
        ], function (result, property) {
          result[property] = getOption.call(this, property);
          return result;
        }, {}, this);
        _.defaults(options, defaultPluginOptions);
        this._contentParent.perfectScrollbar(options);
        this._perfectScrollbar = true;
        this._setClickEventFocus();
      }
    },

    _setClickEventFocus: function () {
      var yRail = this._contentParent.find('.ps-scrollbar-y-rail');
      var xRail = this._contentParent.find('.ps-scrollbar-x-rail');
      if (base.isChrome()) {
        this._setClickEventRailFocus(yRail);
        this._setClickEventRailFocus(xRail);
      }
      else {
        var yScrollBar = this._contentParent.find('.ps-scrollbar-y');
        var xScrollBar = this._contentParent.find('.ps-scrollbar-x');
        this._setClickEventBarFocus(yScrollBar, yRail);
        this._setClickEventBarFocus(xScrollBar, xRail);
      }
    },

    _setClickEventBarFocus: function (xyBar, xyRail) {
      var self = this;
      xyBar.bind('mousedown', function (e) {
        self.addXYFocus = true;
        xyRail.addClass('binf-focus');
      });
      xyRail.bind('mouseout', function (e) {
        if (!self.addXYFocus) {
          xyRail.removeClass('binf-focus');
          xyRail.blur();
        }
        self.addXYFocus = false;
      });
    },

    _setClickEventRailFocus: function (xyRail) {
      var self = this;
      if (xyRail.length > 0) {
        xyRail.bind('mouseup', function (e) {
          $(this).addClass('binf-focus');
          self.addXYFocus = true;
        });
        xyRail.bind('mouseleave', function (e) {
          if (!self.addXYFocus) {
            $(this).removeClass('binf-focus');
          }
          self.addXYFocus = false;
        });
      }
    },

    _refreshScrollbar: function () {
      if (this._contentParent && this._perfectScrollbar) {
        if (!(this._contentParent.find('.ps-scrollbar-y-rail').length ||
            this._contentParent.find('.ps-scrollbar-x-rail').length)) {
          this._destroyScrollbar();
          this._ensureScrollbar();
        } else {
          this._updateScrollbar();
        }
      }
    },

    _updateScrollbar: function () {
      if (this._perfectScrollbar) {
        this._contentParent.perfectScrollbar('update');
      }
    },

    _updateScrollbarFromPropagation: function (event) {
      event.stopPropagation();
      this._updateScrollbar();
    },

    _destroyScrollbar: function () {
      if (this._perfectScrollbar) {
        this._contentParent.perfectScrollbar('destroy');
        this._contentParent.find('.ps-scrollbar-y-rail').off();
        this._contentParent.find('.ps-scrollbar-x-rail').off();
        this._perfectScrollbar = false;
      }
    },

    _getContentParent: function () {
      var contentParent = getOption.call(this, 'contentParent');
      if (contentParent) {
        if (contentParent.insertAfter) { // check for a jQuery object
          return contentParent;
        }
        if (_.isElement(contentParent)) { // check for a HTML element
          return $(contentParent);
        }
        return this.view.$(contentParent); // DOM selector
      }
      return this.view.$el; // use the view root element by default
    },

    _useScrollbar: function () {
      var scrollingDisabled = getOption.call(this, 'scrollingDisabled') ||
                              getOption.call(this, 'scrollingDisabled', this.view.options);
      return !scrollingDisabled;
    },

    _usePerfectScrollbar: function () {
      return PerfectScrollingBehavior.usePerfectScrollbar();
    }
  }, {
    Region: PerfectScrollingRegion,

    usePerfectScrollbar: function () {
      return config.usePerfectScrollbar &&
             !(base.isTouchBrowser() || base.isIE11() || base.isEdge());
    }
  });
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return PerfectScrollingBehavior;
});
