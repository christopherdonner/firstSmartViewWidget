/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/url', 'csui/models/version'
], function (Url, VersionModel) {
  'use strict';

  function getContentPageUrl (node) {
    var cgiUrl = new Url(node.connector.connection.url).getCgiScript();
    var urlQuery = {
      func: 'doc.fetchcsui',
      nodeid: node.get('id')
    };
    if (node instanceof VersionModel) {
      urlQuery.vernum = node.get('version_number');
    }
    return Url.appendQuery(cgiUrl, Url.combineQueryString(urlQuery));
  }

  return {
    getContentPageUrl: getContentPageUrl
  };
});
