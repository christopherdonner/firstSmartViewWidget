/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery'
], function (require, _, $) {

  function PerspectiveFactory(options) {
    this.options = options || {};
  }

  _.extend(PerspectiveFactory.prototype, {

    createPerspective: function (model) {
      var self = this;
      return this._loadPerspective(model.get('type'))
          .then(function (PerspectiveView) {
            return new PerspectiveView(_.extend({
              context: self.options.context
            }, model.get('options')));
          });
    },

    _loadPerspective: function (type) {
      var deferred = $.Deferred(),
          path,
          lastSlash = type.lastIndexOf('/');
      if (lastSlash < 0) {
        path = 'csui/perspectives/' + type;
      } else {
        path = type;
        type = type.substring(lastSlash + 1);
      }
      require([path + '/' + type + '.perspective.view'],
          function (PerspectiveView) {
            deferred.resolve(PerspectiveView);
          }, function (error) {
            deferred.reject(error);
          });
      return deferred.promise();
    }

  });

  return PerspectiveFactory;

});
