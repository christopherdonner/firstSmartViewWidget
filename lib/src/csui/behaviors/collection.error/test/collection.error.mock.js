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
        url: '//server/otcs/cs/api/v1/nodes/2001/nodes*',
        responseText: {
          data: [
            {
              id: 20011,
              name: 'ChildrenViewWithCollection 1'
            },
            {
              id: 20012,
              name: 'ChildrenViewWithCollection 2'
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2002*',
        response: fail
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2002/nodes*',
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
        url: '//server/otcs/cs/api/v1/nodes/2003/nodes*',
        responseText: {
          data: [
            {
              id: 20011,
              name: 'ChildrenViewWithViewCollection 1'
            },
            {
              id: 20012,
              name: 'ChildrenViewWithViewCollection 2'
            }
          ]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2004*',
        response: fail
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2004/nodes*',
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
