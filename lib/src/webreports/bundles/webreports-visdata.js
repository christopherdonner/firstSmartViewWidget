/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



define([
    "webreports/widgets/visual.data.filtered.count/visual.data.filtered.count.view",
    "json!webreports/widgets/visual.data.filtered.count/visual.data.filtered.count.manifest.json",
	'i18n!webreports/widgets/visual.data.filtered.count/impl/nls/visual.data.filtered.count.manifest'

], {});

require(['require', 'css'], function (require, css) {

    css.styleLoad(require, 'webreports/bundles/webreports-visdata');

});
