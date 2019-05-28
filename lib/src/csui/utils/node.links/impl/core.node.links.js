/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/url'
], function (Url) {
  'use strict';

  return [
    {
      equals: {
        type: 140
      },
      getUrl: function (node) {
        return node.get('url');
      }
    },
    {
      equals: {
        type: 258
      },
      getUrl: function (node) {
        return Url.combine('search/query_id/', node.get('id'));
      }
    },
    {
      getUrl: function (node) {
        return Url.combine('nodes/', node.get('id'));
      }
    }
  ];
});
