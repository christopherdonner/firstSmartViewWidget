/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/lib/binf/js/binf',
  'csui/lib/binf/js/binf-switch',
  'csui/lib/fastclick',
  'csui/lib/hammer',
  'csui/lib/handlebars.helpers.xif',
  'csui/lib/jquery',
  'csui/lib/jquery.ajax-progress',
  'csui/lib/jquery.binary.ajax',
  'csui/lib/jquery.parse.param',
  'csui/lib/jquery.redraw',
  'csui/lib/jquery.renametag',
  'csui/lib/jquery.scrollbarwidth',
  'csui/lib/jquery.when.all',
  'csui/lib/jquery.ui/js/jquery-ui',
  'csui/lib/log4javascript',
  'csui/lib/marionette',
  'csui/lib/marionette3',
  'csui/lib/moment',
  'csui/lib/moment-timezone',
  'csui/lib/numeral',
  'csui/lib/perfect-scrollbar',
  'csui/lib/radio',
  'csui/lib/exif'
], {});

require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-libraries', true);
});
