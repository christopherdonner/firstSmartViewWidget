/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'require', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/controls/progressblocker/blocker'
], function (require, _, Marionette, BlockingView) {
  'use strict';

  describe('BlockingView', function () {
    var ParentView, parent, parentView,
      enableDelay = 150,
      disableDelay = 10;

    function ensureParentViewClass() {
      if (!ParentView) {
        ParentView = Marionette.ItemView.extend({
          render: function () {
            this._ensureViewIsIntact();
            this.triggerMethod('before:render', this);
            this.$el.html('<p>Test</p>');
            this.bindUIElements();
            this.triggerMethod('render', this);
            return this;
          }
        });
      }
    }

    describe('when imbuing a single parent view', function () {
      beforeEach(function () {
        ensureParentViewClass();
        parentView = new ParentView();
        BlockingView.imbue(parentView);
      });

      afterEach(function () {
        parentView.destroy();
      });

      it('extends the parent view members', function () {
        var members = ['blockingView', 'blockingPrototype', 'blockActions',
          'blockWithoutIndicator', 'unblockActions'];
        _.each(members, function (member) {
          expect(parentView[member]).toBeTruthy();
        });
      });

      it('remembers the parent view', function () {
        expect(parentView.blockingView.parentView).toBe(parentView);
      });
    });

    describe('when imbuing a parent object with other parent view', function () {
      beforeEach(function () {
        ensureParentViewClass();
        parent = new Marionette.Object();
        parentView = new ParentView();
        BlockingView.imbue(parent, parentView);
      });

      afterEach(function () {
        parentView.destroy();
        parent.destroy();
      });

      it('extends the parent object members, but not the parent view', function () {
        var members = ['blockingView', 'blockingPrototype', 'blockActions',
          'blockWithoutIndicator', 'unblockActions'];
        _.each(members, function (member) {
          expect(parent[member]).toBeTruthy();
        });
      });

      it('does not extend the parent view members', function () {
        var members = ['blockingView', 'blockingPrototype', 'blockActions',
          'blockWithoutIndicator', 'unblockActions'];
        _.each(members, function (member) {
          expect(parentView[member]).toBeFalsy();
        });
      });

      it('remembers the other parent view', function () {
        expect(parent.blockingView.parentView).toBe(parentView);
      });
    });

    describe('when imbuing a parent view', function () {
      beforeEach(function (done) {
        ensureParentViewClass();
        parentView = new ParentView();
        BlockingView.imbue(parentView);
        parentView.render();
        done();
      });

      afterEach(function () {
        parentView.destroy();
      });

      it('appends invisible blocker when the parent view is rendered', function () {
        var blocker = parentView.$el.find('> .load-container');
        expect(blocker.length).toEqual(1);
        expect(blocker.hasClass('binf-hidden')).toBeTruthy();
        expect(blocker.prev().length).toEqual(1);
        expect(blocker.prev().is('p')).toBeTruthy();
        expect(blocker.next().length).toEqual(0);
      });

      it('re-appends the blocker when the parent view is re-rendered', function (done) {
        parentView.render();
        var blocker = parentView.$el.find('> .load-container');
        expect(blocker.length).toEqual(1);
        done();
      });
    });

    describe('when imbuing a parent object with other parent view', function () {
      beforeEach(function (done) {
        ensureParentViewClass();
        parent = new Marionette.Object();
        parentView = new ParentView();
        BlockingView.imbue(parent, parentView);
        parentView.render();
        done();
      });

      afterEach(function () {
        parent.destroy();
        parentView.destroy();
      });

      it('still appends invisible blocker when the parent view is rendered', function (done) {
        var blocker = parentView.$el.find('> .load-container');
        expect(blocker.length).toEqual(1);
        done();
      });
    });

    describe('when enabled', function () {
      beforeEach(function (done) {
        ensureParentViewClass();
        parentView = new ParentView();
        BlockingView.imbue(parentView);
        parentView.render();
        done();
      });

      afterEach(function () {
        parentView.destroy();
      });

      it('shows the blocker after a delay', function (done) {
        parentView.blockActions();
        expect(parentView.blockingView.counter).toEqual(1);
        expect(parentView.blockingView.$el.hasClass('binf-hidden')).toBeTruthy();

        setTimeout(function () {
          expect(parentView.blockingView.$el.hasClass('binf-hidden')).toBeFalsy();
          done();
        }, enableDelay);
      });

      it('does not show the blocker, if disabled quickly enough', function (done) {
        parentView.blockActions();
        parentView.unblockActions();
        expect(parentView.blockingView.counter).toEqual(0);
        setTimeout(function () {
          expect(parentView.blockingView.$el.hasClass('binf-hidden')).toBeTruthy();
          done();
        }, enableDelay);
      });

      it('two times and disabled just once, still shows the blocker', function (done) {
        parentView.blockActions();
        parentView.blockActions();
        expect(parentView.blockingView.counter).toEqual(2);
        parentView.unblockActions();
        expect(parentView.blockingView.counter).toEqual(1);
        setTimeout(function () {
          expect(parentView.blockingView.$el.hasClass('binf-hidden')).toBeFalsy();
          done();
        }, enableDelay);
      });

      it('triggers an event, when the blocker is shown', function (done) {
        var shown;
        parentView.on('enable:blocking', function () {
          shown = true;
        });
        parentView.blockActions();
        expect(shown).toBeFalsy();
        setTimeout(function () {
          expect(shown).toBeTruthy();
          done();
        }, enableDelay);
      });
    });

    describe('when disabled', function () {
      beforeEach(function (done) {
        ensureParentViewClass();
        parentView = new ParentView();
        BlockingView.imbue(parentView);
        parentView.render();
        parentView.blockActions();
        setTimeout(function () {
          done();
        }, enableDelay);
      });

      afterEach(function () {
        parentView.destroy();
      });

      it('hides the blocker after a delay', function (done) {
        parentView.unblockActions();
        expect(parentView.blockingView.counter).toEqual(0);
        expect(parentView.blockingView.$el.hasClass('binf-hidden')).toBeFalsy();

        setTimeout(function () {
          expect(parentView.blockingView.$el.hasClass('binf-hidden')).toBeTruthy();
          done();
        }, disableDelay);
      });

      it('does not hide the blocker, if enabled quickly enough', function (done) {
        parentView.unblockActions();
        parentView.blockActions();
        expect(parentView.blockingView.counter).toEqual(1);

        setTimeout(function () {
          expect(parentView.blockingView.$el.hasClass('binf-hidden')).toBeFalsy();
          done();
        }, disableDelay);
      });

      it('triggers an event, when the blocker is hidden', function (done) {
        var hidden;

        parentView.on('disable:blocking', function () {
          hidden = true;
        });
        parentView.unblockActions();
        expect(hidden).toBeFalsy();

        setTimeout(function () {
          expect(hidden).toBeTruthy();
          done();
        }, disableDelay);
      });
    });

    describe('when disabled', function () {
      beforeEach(function () {
        ensureParentViewClass();
        parentView = new ParentView();
        BlockingView.imbue(parentView);
        parentView.render();
      });

      afterEach(function () {
        parentView.destroy();
      });

      it('without enabling, does not complain', function () {
        parentView.unblockActions();
        expect(parentView.blockingView.counter).toEqual(0);
      });

      it('more times than enabled, does not complain', function () {
        parentView.blockActions();
        parentView.unblockActions();
        parentView.unblockActions();
        expect(parentView.blockingView.counter).toEqual(0);
      });
    });

    describe('will be destroyed', function () {
      beforeEach(function () {
        ensureParentViewClass();
        parentView = new ParentView();
        BlockingView.imbue(parentView);
      });

      it('when the parent view is destroyed', function () {
        var destroyed;
        parentView.blockingView.on('destroy', function () {
          destroyed = true;
        });
        parentView.destroy();
        expect(destroyed).toBeTruthy();
      });
    });

    describe('will be destroyed', function () {
      beforeEach(function (done) {
        ensureParentViewClass();
        parent = new Marionette.Object();
        parentView = new ParentView();
        BlockingView.imbue(parent, parentView);
        done();
      });

      afterEach(function () {
        parent.destroy();
      });

      it('when the other parent view is destroyed', function (done) {
        var destroyed;
        parent.blockingView.on('destroy', function () {
          destroyed = true;
        });
        parentView.destroy();
        expect(destroyed).toBeTruthy();
        done();
      });
    });

    describe('when made global', function () {
      var parentView2;

      beforeEach(function () {
        ensureParentViewClass();
        parentView = new ParentView();
        BlockingView.imbue(parentView);
        parentView.blockingView.makeGlobal();
        parentView.render();
        parentView2 = new ParentView();
      });

      afterEach(function () {
        parentView.destroy();
        parentView2.destroy();
      });

      it('and enabled, another blocking view will join it', function () {
        BlockingView.imbue(parentView2);
        parentView2.render();
        parentView.blockActions();
        parentView2.blockActions();
        expect(parentView.blockingView.counter).toEqual(2);
        expect(parentView2.blockingView.counter).toEqual(0);
      });

      it('and not enabled, another blocking view will work alone', function () {
        BlockingView.imbue(parentView2);
        parentView2.render();
        parentView2.blockActions();
        expect(parentView.blockingView.counter).toEqual(0);
        expect(parentView2.blockingView.counter).toEqual(1);
      });

      it('and enabled, another local blocking view will work alone', function () {
        BlockingView.imbue({
          parent: parentView2,
          local: true
        });
        parentView2.render();
        parentView.blockActions();
        parentView2.blockActions();
        expect(parentView.blockingView.counter).toEqual(1);
        expect(parentView2.blockingView.counter).toEqual(1);
      });

      it('destroying the initial view will unblock the global one automatically',
        function () {
          BlockingView.imbue(parentView2);
          parentView2.render();
          parentView.blockActions();
          parentView2.blockActions();
          expect(parentView2.blockingView.counter).toEqual(0,
            'The other view should delegate the blocking to the global one.');
          expect(parentView.blockingView.counter).toEqual(2,
            'Global blocking view should take over the other one.');
          parentView2.destroy();
          expect(parentView.blockingView.counter).toEqual(1,
            'Global blocking view should get the counter decreased.');
        });
    });
    describe('when made global and forced as the only blocking view', function () {
      if (!window.require) {
        return it('Modules cannot be unloaded in the release mode.');
      }

      var ReloadedBlockingView, parentView2;

      beforeEach(function (done) {
        window.csui.requirejs.config({
          config: {
            'csui/controls/progressblocker/blocker': {
              globalOnly: true
            }
          }
        });
        window.csui.requirejs.undef('csui/controls/progressblocker/blocker');

        ReloadedBlockingView = undefined;
        require(['csui/controls/progressblocker/blocker'], function () {
          ReloadedBlockingView = arguments[0];
          var callback = _.after(1, function () {
            ensureParentViewClass();
            parentView = new ParentView();
            ReloadedBlockingView.imbue(parentView);
            parentView.blockingView.makeGlobal();
            parentView.render();
            parentView2 = new ParentView();
            ReloadedBlockingView.imbue(parentView2);
            parentView2.render();
            done();
          });
          callback();
          window.csui.requirejs.config({
            config: {
              'csui/controls/progressblocker/blocker': {
                globalOnly: undefined
              }
            }
          });
          window.csui.requirejs.undef('csui/controls/progressblocker/blocker');
        });
      });

      afterEach(function () {
        parentView2.destroy();
      });

      it('another blocking view will join it in any case', function (done) {
        parentView2.blockActions();
        expect(parentView.blockingView.counter).toEqual(1);
        expect(parentView2.blockingView.counter).toEqual(0);
        parentView.destroy();
        done();
      });

      it('and destroyed, another blocking view will work alone again', function (done) {
        parentView.destroy();
        parentView2.blockActions();
        expect(parentView.blockingView.counter).toEqual(0);
        expect(parentView2.blockingView.counter).toEqual(1);
        done();
      });
    });
  });
});
