/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/perspective.manage/pman.view',
    'csui/perspective.manage/behaviours/pman.widget.config.behaviour',
    'csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.view',
    'csui/perspective.manage/widgets/perspective.widget/perspective.widget.view',
    'json!csui/perspective.manage/widgets/perspective.placeholder/perspective.placeholder.manifest.json',
    'json!csui/perspective.manage/widgets/perspective.widget/perspective.widget.manifest.json',

    'i18n!csui/perspective.manage/widgets/perspective.placeholder/impl/nls/perspective.placeholder.manifest',
    'i18n!csui/perspective.manage/widgets/perspective.widget/impl/nls/perspective.widget.manifest',
], {});
  
require(['require', 'css'], function (require, css) {
    css.styleLoad(require, 'csui/bundles/csui-perspective', true);
});
  