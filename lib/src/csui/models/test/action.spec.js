/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    "csui/lib/jquery",
    "csui/lib/underscore",
    "csui/models/action",
    "csui/models/actions"],
  function ($, _,
            ActionModel,
            ActionCollection) {
    "use strict";

    describe("ActionWrapper", function () {
      var action;
      var actions;

      beforeAll(function () {
        action = {
          children: [
            {
              children: {},
              name: "c1name",
              signature: "c1sig",
              url: "c1url"
            },
            {
              children: {},
              name: "c2name",
              signature: "c2sig",
              url: "c2url"
            }
          ],
          name: "name",
          signature: "sig",
          url: "url"
        };
        actions = [
          {
            children: {},
            name: "a1",
            signature: "s1",
            url: "url1"
          },
          {
            children: {},
            name: "-",
            signature: "-",
            url: ""
          },
          {
            children: {},
            name: "a2",
            signature: "s2",
            url: "url2"
          },
          {
            children: [
              {
                children: {},
                name: "c1",
                signature: "sc1",
                url: "urlc1"
              },
              {
                children: {},
                name: "c2",
                signature: "sc2",
                url: "urlc2"
              }
            ],
            name: "a3",
            signature: "s3",
            url: "url3"
          }
        ];
      });

      describe("ActionModel", function () {


        it("instantiates from object ...", function () {
          var action = new ActionModel(action);
          expect(action).toBeDefined();
          expect(action instanceof ActionModel).toBeTruthy();
        });
      });

      describe("ActionCollection", function () {

        it("instantiates from object ...", function () {
          var axc = new ActionCollection(actions);
          expect(axc).toBeDefined();
          expect(axc instanceof ActionCollection).toBeTruthy();
          expect(axc.length).toEqual(4);
          expect(axc.at(3).children.length).toEqual(2);
        });
      });

    });
  });