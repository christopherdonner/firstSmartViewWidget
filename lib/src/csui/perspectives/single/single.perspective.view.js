/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/perspectives/zone/zone.perspective.view'
], function (module, _, ZonePerspectiveView) {

  var config = module.config();
  _.defaults(config, {
    zoneNames: ['widget'],
    zoneLayouts: {
      'widget': {
        zoneOrder: ['widget'],
        zoneSizes: {
          widget: {
            sizes: {
              xs: 12
            },
            heights: {
              xs: 'full'
            }
          }
        }
      }
    }
  });

  var SinglePerspectiveView = ZonePerspectiveView.extend({

    className: function () {
      var className = 'cs-single-perspective',
          parentClassName = _.result(ZonePerspectiveView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    zoneNames: config.zoneNames,
    zoneLayouts: config.zoneLayouts,

    constructor: function SinglePerspectiveView(options) {
      ZonePerspectiveView.prototype.constructor.apply(this, arguments);
    }

  });

  return SinglePerspectiveView;

});
