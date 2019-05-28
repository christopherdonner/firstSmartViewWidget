/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore',
    'i18n!csui/perspective.manage/impl/nls/root/lang',
    'csui-ext!perspective.manage/impl/perspectivelayouts'
], function(_, Lang, extraPerspectiveLayouts) {

    var perspectivelayouts = [
        {
            title: Lang.LcrLayoutTitle, 
            type: "left-center-right",
            icon: "csui-layout-lcr"
        },
        {
            title: Lang.FlowLayoutTitle, 
            type: "flow",
            icon: "csui-layout-flow"
        }
    ];

    if(extraPerspectiveLayouts) {
        perspectivelayouts = _.union(perspectivelayouts, extraPerspectiveLayouts);
    }

    return perspectivelayouts;
});