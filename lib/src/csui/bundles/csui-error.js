/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/lib/jquery.binary.ajax',
  'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param',
  'csui/pages/error.page/error.page.view',
], {});

require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-error', true);
});
