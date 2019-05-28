/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/marionette', 'csui/lib/marionette3',
  'csui/utils/non-emptying.region/non-emptying.region'
], function ($, Marionette2, Marionette3, NonEmptyingRegion) {
  'use strict';

  function declareTests(library, TestView) {

    describe('NonEmptyingRegion with ' + library, function () {

      var View, view, spy, placeholder, region;

      beforeEach(function () {
        View = TestView.extend({
          className: 'view',
          template: false
        });
        view = new View();
        placeholder = $('<div>');
        region = new NonEmptyingRegion({el: placeholder});
        spy = jasmine.createSpyObj('events', ['beforeEmpty', 'empty']);
        region.on('before:empty', spy.beforeEmpty);
        region.on('empty', spy.empty);
      });

      it('appends the view without clearing the existing content', function () {
        $('<div>').addClass('existing')
                  .appendTo(placeholder);
        region.show(view);
        expect(placeholder.find('.existing').length).toEqual(1);
        expect(placeholder.find('.view').length).toEqual(1);
      });

      it('swaps the view without clearing the existing content', function () {
        $('<div>').addClass('existing')
                  .appendTo(placeholder);
        region.show(view);
        expect(placeholder.find('.existing').length).toEqual(1);
        expect(placeholder.find('.view').length).toEqual(1);
        View = TestView.extend({
          className: 'view2',
          template: false
        });
        region.show(new View());
        expect(view.isDestroyed).toBeTruthy();
        expect(spy.beforeEmpty).toHaveBeenCalled();
        expect(spy.empty).toHaveBeenCalled();
        expect(placeholder.find('.existing').length).toEqual(1);
        expect(placeholder.find('.view').length).toEqual(0);
        expect(placeholder.find('.view2').length).toEqual(1);
      });

      it('when emptied, destroys the view without clearing the existing content', function () {
        $('<div>').addClass('existing')
                  .appendTo(placeholder);
        region.show(view);
        expect(placeholder.find('.existing').length).toEqual(1);
        expect(placeholder.find('.view').length).toEqual(1);
        region.empty();
        expect(view.isDestroyed).toBeTruthy();
        expect(spy.beforeEmpty).toHaveBeenCalled();
        expect(spy.empty).toHaveBeenCalled();
        expect(placeholder.find('.existing').length).toEqual(1);
        expect(placeholder.find('.view').length).toEqual(0);
      });

    });

  }

  declareTests('Marionette 2', Marionette2.ItemView);
  declareTests('Marionette 3', Marionette3.View);

});
