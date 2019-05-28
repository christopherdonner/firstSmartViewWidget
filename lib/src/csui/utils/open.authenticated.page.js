/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/utils/url'
], function ($, Url) {
  'use strict';

  function openAuthenticatedPage (connector, url, options) {
    options || (options = {});
    var content = options.window || (options.openInNewTab === false ?
        window : window.open('', '_blank'));
    var cgiUrl = new Url(connector.connection.url).getCgiScript();
    var ticket = connector.connection.session.ticket;

    $('<form>')
        .attr('method', "post")
        .attr('action', cgiUrl)
        .append($('<input>', {
          'name': 'func',
          'value': 'csui.authenticate',
          'type': 'hidden'
        }))
        .append($('<input>', {
          'name': 'otcsticket',
          'value': ticket,
          'type': 'hidden'
        }))
        .append($('<input>', {
          'name': 'nexturl',
          'value': url,
          'type': 'hidden'
        }))
        .appendTo(content.document.body)
        .submit();

    return $.Deferred().resolve().promise();
  }

  return openAuthenticatedPage;
});
