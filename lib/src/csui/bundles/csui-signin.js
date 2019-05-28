/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/jquery.binary.ajax',
  'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param',
  'csui/pages/signin/signin.page.view',
  'csui/utils/authenticators/core.authenticators',
  'csui/utils/high.contrast/detector',
  'csui/utils/url',
  'csui/utils/authenticators/core.authenticators',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/page/page.context'
], {});

require(['require', 'css'], function (require, css) {
  css.styleLoad(require, 'csui/bundles/csui-signin', true);
});
