/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  "csui/widgets/shortcut/shortcut.view", 'csui/utils/contexts/page/page.context',
  "./shortcut.mock.data.js"
], function ($, _, Marionette, ShortcutView, PageContext, ShortcutMock) {

  describe("Shortcut Widget", function () {

    var context, icon, background, title1, title2, w_ent, w;

    beforeEach(function () {
      ShortcutMock.enable();

      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

      icon = "icon-folder";
      background = "cs-tile-background1";
      title1 = "Enterprise";
      title2 = "Water Management";

      w_ent = new ShortcutView({
        context: context,
        data: {
          type: 141
        }
      });

      w = new ShortcutView({
        context: context,
        data: {
          id: 50000,
          icon: icon,
          background: background
        }
      });
    });

    afterEach(function () {
      ShortcutMock.disable();
    });

    it("can be instantiated and rendered", function () {
      expect(w_ent).toBeDefined();
      expect(w_ent.$el.length > 0).toBeTruthy();
      expect(w_ent.el.childNodes.length === 0).toBeTruthy();

      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
      w_ent.render();
      expect(w_ent.$el.length > 0).toBeTruthy();
      expect(w_ent.el.childNodes.length > 0).toBeTruthy();

      w.render();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length > 0).toBeTruthy();
    });

    it("has a header and an icon", function () {
      w_ent.render();
      w.render();
      expect(w_ent.$('div.tile-header').length).toBeGreaterThan(0);
      expect(w_ent.$('div.tile-icon').length).toBeGreaterThan(0);

      expect(w.$('div.tile-header').length).toBeGreaterThan(0);
      expect(w.$('div.tile-icon').length).toBeGreaterThan(0);
    });

    it("has a title, which came from the mock data type=141", function (done) {
      var fetching = w_ent.model.fetch()
        .then(function() {
          expect(w_ent.model.attributes.id).toEqual(2000);
          expect(w_ent.model.attributes.name).toEqual(title1);
          expect(w_ent.$('div.tile-title > .csui-heading').html()).toEqual(title1);
          done();
        })
        .fail(function() {
          expect(fetching.state()).toBe('resolved', "Data fetch timed out");
          done();
        });
    });

    it("has a title, which came from the mock data id=50000", function (done) {
      var fetching = w.model.fetch()
        .then(function() {
          expect(w.model.attributes.id).toEqual(50000);
          expect(w.model.attributes.name).toEqual(title2);
          expect(w.$('div.tile-title >.csui-heading').html()).toEqual(title2);
          done();
        })
        .fail(function() {
          expect(fetching.state()).toBe('resolved', "Data fetch timed out");
          done();
        });
    });

    it("has a configurable icon, which is set as the header icon", function () {
      w_ent.render();
      w.render();

      var iconDiv = w_ent.$('div.tile-icon > div.icon');
      expect(iconDiv[0].classList.length).toBeGreaterThan(1);
      expect($(iconDiv[0]).hasClass(icon));

      iconDiv = w.$('div.tile-icon > div.icon');
      expect(iconDiv[0].classList.length).toBeGreaterThan(1);
      expect($(iconDiv[0]).hasClass(icon));
    });

    it("has a configurable background, which is set as the background image", function () {
      w_ent.render();
      w.render();

      expect(w.$el.hasClass('cs-tile-background1')).toBeTruthy(0);
    });

  });

});
