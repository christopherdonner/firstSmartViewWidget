/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  function Url(url) {
    this.raw = url;
  }

  Url.prototype = {
    raw: undefined,

    isValid: function () {
      return this.raw ? this.raw.match(Url.re_weburl) : false;
    },

    isAbsolute: function () {
      return this.raw ? this.raw.match(/^.*\/\//) : false;
    },

    getAbsolute: function () {
      return this.isAbsolute() ? this.raw :
             Url.combine(window.location.origin, this.raw);
    },

    getProtocol: function () {
      var url = this.isAbsolute() && this.raw.indexOf('//') !== 0 ?
                this.raw : window.location.href;
      return url.toLowerCase().substring(0, url.indexOf(':'));
    },

    getHost: function () {
      var match = this.getAbsolute().match(/^.*\/\/([^:\/]+)/);
      return match && match[1];
    },

    getPort: function () {
      var url = this.getAbsolute().toLowerCase(),
          start = url.match(/^.*\/\/([^\/]+)/),
          port = start && start[1].match(/:([^\/]+)/);
      return port ? parseInt(port[1], 10) : url.indexOf('https') === 0 ? 443 : 80;
    },

    getOrigin: function () {
      var match = this.getAbsolute().match(/^.*\/\/[^\/]+/);
      return match && match[0];
    },

    getPath: function () {
      var match = this.getAbsolute().match(/^.*\/\/[^\/]+(\/[^?]+)/);
      return match && match[1];
    },

    getVirtualDirectory: function () {
      var match = this.getAbsolute().match(/^.*\/\/[^\/]+\/[^\/]+/);
      return match && match[0];
    },

    getCgiScript: function () {
      var url = this.getAbsolute();
      var apiSuffix = url.length - 7;
      if (url.charAt(this.raw.length - 1) === '/') {
        --apiSuffix;
      }
      if (url.lastIndexOf('/api/v1') === apiSuffix) {
        return url.substr(0, apiSuffix);
      }
      var match = url.match(/^.*\/\/[^\/]+\/[^\/]+\/[^\/]+/);
      return match && match[0];
    },

    getQuery: function () {
      var match = this.getAbsolute().match(/\?(.+)/);
      return match && match[1];
    },

    getApiBase: function (version) {
      version || (version = 'v1');
      typeof version === 'number' && (version = 'v' + version);
      return this.getCgiScript() + '/api/' + version + '/';
    },

    toString: function () {
      return this.raw;
    }
  };
  Url.version = '1.0';

  Url.combine = function () {
    var url = '';
    for (var i = 0; i < arguments.length; ++i) {
      var part = arguments[i],
          path = part !== undefined && part !== null ? part.toString() : '';
      if (path.charAt(0) == '/') {
        url += url && url.charAt(url.length - 1) == '/' ? path.substring(1) :
               path;
      } else {
        if (i > 0 && !(url && url.charAt(url.length - 1) == '/') &&
            path.length > 0) {
          url += '/';
        }
        url += path;
      }
    }
    return url;
  };

  Url.makeMultivalueParameter = function (name, values) {
    if (values && values.length) {
      values = _.map(values, encodeURIComponent);
      return name + '=' + values.join('&' + name + '=');
    }
    return '';
  };
  Url.combineQueryString = function () {
    var query = {},
        i, part;
    for (i = 0; i < arguments.length; ++i) {
      part = arguments[i];
      if (_.isObject(part)) {
        _.extend(query, part);
      }
    }
    query = $.param(query, true);
    for (i = 0; i < arguments.length; ++i) {
      part = arguments[i];
      if (_.isString(part) && part) {
        if (query) {
          query += '&';
        }
        query += part;
      }
    }
    return query;
  };

  Url.appendQuery = function (url, query) {
    if (url.indexOf('?') >= 0) {
      var lastCharacter = url[url.length - 1];
      if (lastCharacter !== '?' && lastCharacter !== '&') {
        url += '&';
      }
    } else {
      url += '?';
    }
    url += query;
    return url;
  };
  Url.re_weburl = new RegExp(
      '^' +
      '(?:(?:https?|ftp)://)' +
      '(?:\\S+(?::\\S*)?@)?' +
      '(?:' +
      '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
      '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
      '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
      '|' +
      '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
      '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
      '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
      '\\.?' +
      ')' +
      '(?::\\d{2,5})?' +
      '(?:[/?#]\\S*)?' +
      '$', 'i'
  );

  return Url;
});
