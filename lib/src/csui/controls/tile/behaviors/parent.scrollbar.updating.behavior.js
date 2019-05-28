/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior'
], function (_, $, Marionette, PerfectScrollingBehavior) {
  'use strict';

  var ParentScrollbarUpdatingRegion = Marionette.Region.extend({

    constructor: function ParentScrollbarUpdatingRegion(options) {
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
      triggerScrollbarUpdate(this._parent._parent);
    }

  });

  var ParentScrollbarUpdatingBehavior = Marionette.Behavior.extend({

    constructor: function ParentScrollbarUpdatingBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);

      if (PerfectScrollingBehavior.usePerfectScrollbar()) {
        var updateOnWindowResize = getOption.call(this, 'updateOnWindowResize');
        this._renderState = 0;
        
        this
            .listenTo(view, 'before:render', function () {
              this._renderState = 1;
            })
            .listenTo(view, 'render', function () {
              this._renderState = 0;
              this._requestScrollbarUpdate();
            })
            .listenTo(view, 'update:scrollbar', this._requestScrollbarUpdate)
            .listenToOnce(view, 'before:render', function () {
              if (updateOnWindowResize) {
                $(window).bind('resize.' + view.cid, _.bind(this._updateScrollbar, this));
                this.listenToOnce(view, 'before:destroy', function () {
                  $(window).unbind('resize.' + view.cid);
                });
              }
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
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'render:empty', function () {
                      if (this._resetTriggered || !this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'add:child', function () {
                      if (!this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    })
                    .listenTo(view, 'remove:child', function () {
                      if (!this._resetTriggered && !this._renderState) {
                        this._requestScrollbarUpdate();
                      }
                    });
              }
            });
      }
    },

    _requestScrollbarUpdate: function () {
      triggerScrollbarUpdate(this.view);
    }

  }, {
    Region: ParentScrollbarUpdatingRegion

  });

  function triggerScrollbarUpdate(view) {
    $.event.trigger('csui:update:scrollbar', {view: view}, view.el, false);
  }
  function getOption(property, source) {
    var options = source || this.options || {};
    var value = options[property];
    return _.isFunction(value) ? options[property].call(this.view) : value;
  }

  return ParentScrollbarUpdatingBehavior;

});
