/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/url', 'csui/utils/base'
], function ($, Marionette, Url, base) {
  'use strict';

  var Thumbnail = Marionette.Object.extend({

    constructor: function Thumbnail(options) {
      Marionette.Object.prototype.constructor.apply(this, arguments);
      this.listenTo(this.options.node, 'change:id', this.load)
          .listenTo(this, 'destroy', this._release);
    },

    load: function () {
      var node         = this.options.node,
          nodeId       = node.get('id'),
          version      = node.get('version_number'), /*Assuming version number is available only
          with VersionModel*/
          versionParam = !!version ? '&version_number=' + version : '',
          self         = this;
      this._release();
      return nodeId &&
             $.ajax(node.connector.extendAjaxOptions({
                   url: Url.combine(node.connector.connection.url, '/nodes', nodeId,
                       '/thumbnails/medium/content?suppress_response_codes' + versionParam),
                   dataType: 'binary'
                 })
             ).then(function (response) {
                   if (!!response.type && !!response.type.match(/application\/json/i)) {
                     var reader = new window.FileReader();
                     reader.readAsText(response);
                     reader.onload = function (event) {
                       var jsonObject = JSON.parse(event.target.result);
                       if (jsonObject.statusCode === 404) {
                         self._failureHandler(jsonObject.error);
                       }
                     };
                   }
                   else {
                     self.url = URL.createObjectURL(response);
                     self.triggerMethod('load', self, self.url);
                     return self.url;
                   }
                 }, function (jqxhr) {
                   self._failureHandler(jqxhr);
                 }
             );
    },

    _release: function () {
      if (this.url) {
        URL.revokeObjectURL(this.url);
        this.url = undefined;
      }
    },

    _failureHandler: function (jqxhr) {
      var error = new base.Error(jqxhr);
      this.url = null;
      this.triggerMethod('error', this, error);
      return $.Deferred().reject(error).promise();
    }

  });

  return Thumbnail;

});
