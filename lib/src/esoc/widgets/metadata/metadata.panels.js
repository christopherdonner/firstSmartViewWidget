/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['i18n!esoc/widgets/metadata/impl/nls/lang',
  "esoc/widgets/metadata/impl/activity/metadata.activity.view"
], function (lang, MetadataActivityView) {

  return [

    {
      title: lang.activityTabTitle,
      sequence: 30,
      contentView: MetadataActivityView
    }

  ];

});
