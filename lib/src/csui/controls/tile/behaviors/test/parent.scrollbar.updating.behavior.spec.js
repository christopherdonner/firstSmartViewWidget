/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tile/behaviors/parent.scrollbar.updating.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior'
], function (_, Backbone, Marionette, ParentScrollbarUpdatingBehavior,
    PerfectScrollingBehavior) {
  'use strict';

  describe('ParentScrollbarUpdatingBehavior', function () {
    if (!PerfectScrollingBehavior.usePerfectScrollbar()) {
      return it('The perfect-scrollbar plugin is disabled.');
    }

    if (!_.contains(navigator.languages, 'de')) {
      it('cannot be tested without German locale ("de") enabled in web browser settings');
      return;
    }

    var ChildView, ParentView, ScrollableView;

    beforeEach(function () {
      if (!ScrollableView) {
        ChildView = Marionette.ItemView.extend({
          template: _.template(''),
          behaviors: {
            ParentScrollbarUpdating: {
              behaviorClass: ParentScrollbarUpdatingBehavior
            }
          }
        });

        ParentView = Marionette.LayoutView.extend({
          template: _.template('<div class="child"></div>'),
          regions: {child: '>.child'},
          regionClass: ParentScrollbarUpdatingBehavior.Region,
          behaviors: {
            ParentScrollbarUpdating: {
              behaviorClass: ParentScrollbarUpdatingBehavior
            }
          },
          onRender: function () {
            this.child.show(new ChildView());
          }
        });

        ScrollableView = Marionette.LayoutView.extend({
          template: _.template('<div class="child"></div>'),
          regions: {child: '>.child'},
          onRender: function () {
            this.$el.on('csui:update:scrollbar.' + this.cid, _.bind(function () {
              this.updateCount ? ++this.updateCount : (this.updateCount = 1);
            }, this));
          },
          onBeforeDestroy: function () {
            this.$el.off('csui:update:scrollbar.' + this.cid);
          }
        });
      }
    });

    it('requests scrollbar update, if the child requests it', function () {
      var childView = new ChildView(),
          scrollableView = new ScrollableView();
      scrollableView.render().child.show(childView);
      scrollableView.updateCount = 0;
      childView.triggerMethod('update:scrollbar');
      expect(scrollableView.updateCount).toEqual(1);
    });

    describe('requests scrollbar update from CollectionView', function () {
      var TestModel, TestCollection, ChildrenView;

      beforeEach(function () {
        if (!ChildrenView) {
          TestModel = Backbone.Model.extend({
            constructor: function TestModel(attributes, options) {
              attributes = {id: _.uniqueId()};
              Backbone.Model.call(this, attributes, options);
            }
          });

          TestCollection = Backbone.Collection.extend({
            model: TestModel
          });

          ChildrenView = Marionette.CollectionView.extend({
            childView: ChildView,
            behaviors: {
              ParentScrollbarUpdating: {
                behaviorClass: ParentScrollbarUpdatingBehavior
              }
            }
          });
        }
      });

      it('if a child is added', function () {
        var collection = new TestCollection(),
            scrollableView = new ScrollableView(),
            childrenView = new ChildrenView({collection: collection});
        scrollableView.render().child.show(childrenView);
        scrollableView.updateCount = 0;
        collection.add({});
        expect(scrollableView.updateCount).toEqual(1);
        collection.add({});
        expect(scrollableView.updateCount).toEqual(2);
      });

      it('if a child is removed', function () {
        var collection = new TestCollection([{}, {}]),
            scrollableView = new ScrollableView(),
            childrenView = new ChildrenView({collection: collection});
        scrollableView.render().child.show(childrenView);
        scrollableView.updateCount = 0;
        collection.remove(collection.last());
        expect(scrollableView.updateCount).toEqual(1);
        collection.remove(collection.last());
        expect(scrollableView.updateCount).toEqual(2);
      });

      it('if empty collection is populated', function () {
        var collection = new TestCollection(),
            scrollableView = new ScrollableView(),
            childrenView = new ChildrenView({collection: collection});
        scrollableView.render().child.show(childrenView);
        scrollableView.updateCount = 0;
        collection.reset([{}, {}]);
        expect(scrollableView.updateCount).toEqual(1);
      });

      it('if all children are emptied', function () {
        var collection = new TestCollection([{}, {}]),
            scrollableView = new ScrollableView(),
            childrenView = new ChildrenView({collection: collection});
        scrollableView.render().child.show(childrenView);
        scrollableView.updateCount = 0;
        collection.reset();
        expect(scrollableView.updateCount).toEqual(1);
      });

      it('if all children are replaced', function () {
        var collection = new TestCollection([{}, {}]),
            scrollableView = new ScrollableView(),
            childrenView = new ChildrenView({collection: collection});
        scrollableView.render().child.show(childrenView);
        scrollableView.updateCount = 0;
        collection.reset([{}, {}]);
        expect(scrollableView.updateCount).toEqual(1);
      });

      it('if a child requests update', function () {
        var collection = new TestCollection([{}]),
            scrollableView = new ScrollableView(),
            childrenView = new ChildrenView({collection: collection});
        scrollableView.render().child.show(childrenView);
        scrollableView.updateCount = 0;
        childrenView.children.first().triggerMethod('update:scrollbar');
        expect(scrollableView.updateCount).toEqual(1);
      });

      it('if the view itself requests update', function () {
        var collection = new TestCollection(),
            scrollableView = new ScrollableView(),
            childrenView = new ChildrenView({collection: collection});
        scrollableView.render().child.show(childrenView);
        scrollableView.updateCount = 0;
        childrenView.triggerMethod('update:scrollbar');
        expect(scrollableView.updateCount).toEqual(1);
      });
    });

    describe('requests scrollbar update from LayoutView', function () {
      it('if a region is populated', function () {
        var parentView = new ParentView(),
            scrollableView = new ScrollableView();
        scrollableView.render().child.show(parentView);
        scrollableView.updateCount = 0;
        parentView.child.show(new ChildView());
        expect(scrollableView.updateCount).toEqual(1);
      });

      it('if a region is emptied', function () {
        var parentView = new ParentView(),
            scrollableView = new ScrollableView();
        scrollableView.render().child.show(parentView);
        scrollableView.updateCount = 0;
        parentView.child.empty();
        expect(scrollableView.updateCount).toEqual(1);
      });

      it('if the child requests update', function () {
        var parentView = new ParentView(),
            scrollableView = new ScrollableView();
        scrollableView.render().child.show(parentView);
        scrollableView.updateCount = 0;
        parentView.child.currentView.triggerMethod('update:scrollbar');
        expect(scrollableView.updateCount).toEqual(1);
      });

      it('if the view itself requests update', function () {
        var parentView = new ParentView(),
            scrollableView = new ScrollableView();
        scrollableView.render().child.show(parentView);
        scrollableView.updateCount = 0;
        parentView.triggerMethod('update:scrollbar');
        expect(scrollableView.updateCount).toEqual(1);
      });
    });
  });
});
