/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  'use strict';

  function fail() {
    this.status = 500;
    this.statusText = 'Internal Server Error';
    this.dataType = 'json';
    this.responseText = {
      error: 'The server is not available now.'
    };
  }

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2001*',
        responseText: {
          results: {
            data: {
              properties: {
                id: 2001,
                name: 'NodeViewWithModel'
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2002*',
        response: fail
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2003*',
        responseText: {
          results: {
            data: {
              properties: {
                id: 2003,
                name: 'NodeViewWithViewModel'
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2004*',
        response: fail
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2005*',
        responseText: {
          results: {
            data: {
              properties: {
                id: 2005,
                name: 'NodeViewWithErrorElement'
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2006*',
        response: fail
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2007*',
        responseText: {
          results: {
            data: {
              properties: {
                id: 2007,
                name: 'NodeViewWithErrorRegion'
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2008*',
        response: fail
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };
});
