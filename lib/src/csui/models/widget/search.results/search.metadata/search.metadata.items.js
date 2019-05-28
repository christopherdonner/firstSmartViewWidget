/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/backbone",
  'i18n!csui/models/widget/nls/lang'
], function (_, Backbone, lang) {

  var metadataCollection = [
    {
      key: 'create_date',
      column_key: 'create_date',
      column_name: lang.created,
      column_type: 'date',
      search_index: 'OTCreateDate',
      sequence: 10
    },
    {
      key: 'create_user_display_name',
      column_key: 'create_user_display_name',
      column_name: lang.createdBy,
      search_index: 'OTCreatedByName',
      sequence: 20
    },
    {
      key: 'modify_date',
      column_key: 'modify_date',
      column_name: lang.modified,
      column_type: 'date',
      search_index: 'OTObjectDate',
      sequence: 30
    },
    {
      key: 'owner_display_name',
      column_key: 'owner_display_name',
      column_name: lang.owner,
      search_index: 'OTName',
      sequence: 40,
      permanentColumn: false
    },
    {
      key: 'mime_type_search',
      column_key: 'mime_type_search',
      column_name: lang.type,
      search_index: 'OTFileType',
      sequence: 50,
      permanentColumn: false
    },
    {
      key: 'size',
      column_key: 'size',
      column_name: lang.size,
      search_index: 'OTObjectSize',
      sequence: 60,
      permanentColumn: false
    }
  ];
  return metadataCollection;
});