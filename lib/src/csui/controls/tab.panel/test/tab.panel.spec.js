/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/tab.panel/tab.panel.view'
], function (Backbone, Marionette, TabPanelView) {
  "use strict";

  describe('TabPanelView', function () {
     it('can be created', function () {
      var collection = new Backbone.Collection(),
          tabPanel = new TabPanelView({collection: collection});
      expect(tabPanel instanceof TabPanelView).toBeTruthy();
    });

    it('can render tab title in single language', function () {
      var collection = new Backbone.Collection([
            {title: 'Test'}
          ]),
          tabPanel = new TabPanelView({
            contentView: Marionette.View,
            collection: collection
          });
      tabPanel.render();
      var links = tabPanel.tabLinks.children;
      expect(links.length).toEqual(1);
      var linkText = links.first().$el.text().replace(/\s+/g, '');
      expect(linkText).toEqual('Test');
    });

    it('can render tab title in the default language from multiple ones', function () {
      var collection = new Backbone.Collection([
            {
              title: {
                en: 'English',
                de: 'Deutsch'
              }
            }
          ]),
          tabPanel = new TabPanelView({
            contentView: Marionette.View,
            collection: collection
          });
      tabPanel.render();
      var links = tabPanel.tabLinks.children;
      expect(links.length).toEqual(1);
      var linkText = links.first().$el.text().replace(/\s+/g, '');
      expect(linkText).toEqual('English');
    });

    it('creates and all content views when rendered by default', function () {
      var collection = new Backbone.Collection([
            {title: 'Test1'}, {title: 'Test2'}
          ]),
          tabPanel = new TabPanelView({
            contentView: Marionette.View,
            collection: collection
          });
      tabPanel.render();
      var contents = tabPanel.tabContent.children;
      expect(contents.length).toEqual(2);
      expect(contents.findByIndex(0).content).toBeTruthy();
      expect(contents.findByIndex(1).content).toBeTruthy();
    });

    it('creates only content view for the active tab if specified', function () {
      var collection = new Backbone.Collection([
            {title: 'Test1'}, {title: 'Test2'}
          ]),
          tabPanel = new TabPanelView({
            contentView: Marionette.View,
            collection: collection,
            delayTabContent: true
          });
      tabPanel.render();
      var contents = tabPanel.tabContent.children;
      expect(contents.length).toEqual(2);
      expect(contents.findByIndex(0).content).toBeTruthy();
      expect(contents.findByIndex(1).content).toBeFalsy();
    });

    it('creates only content view for the active tab if not first', function () {
      var collection = new Backbone.Collection([
            {title: 'Test1'}, {title: 'Test2'}
          ]),
          tabPanel = new TabPanelView({
            contentView: Marionette.View,
            collection: collection,
            delayTabContent: true,
            activeTab: new Backbone.Model({tabIndex: 1})
          });
      tabPanel.render();
      var contents = tabPanel.tabContent.children;
      expect(contents.length).toEqual(2);
      expect(contents.findByIndex(0).content).toBeFalsy();
      expect(contents.findByIndex(1).content).toBeTruthy();
    });

  });

});
