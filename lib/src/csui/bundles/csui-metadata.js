/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/tableheader/comment/comment.button.view',
  'csui/widgets/metadata/versions.toolbaritems',
  'csui/widgets/metadata/impl/metadata.tabcontentcollection.view',
  'csui/widgets/metadata/metadata.view',
  'csui/widgets/metadata/metadata.properties.view',
  'csui/widgets/metadata/metadata.action.one.item.properties.view',
  'csui/widgets/metadata/metadata.add.categories.controller',
  'csui/widgets/metadata/metadata.add.document.controller',
  'csui/widgets/metadata/metadata.add.item.controller',
  'csui/widgets/metadata/metadata.copy.move.items.controller',
  'csui/widgets/metadata/impl/metadatanavigation/metadatanavigation.view',
  'csui/widgets/metadata.navigation/metadata.navigation.view',
  'csui/widgets/document.overview/document.overview.view',
  'json!csui/widgets/document.overview/document.overview.manifest.json',
  'json!csui/widgets/metadata/metadata.manifest.json',
  'json!csui/widgets/metadata.navigation/metadata.navigation.manifest.json',
  'i18n!csui/widgets/document.overview/impl/nls/document.overview.manifest',
  'i18n!csui/widgets/metadata/impl/nls/metadata.manifest',
  'i18n!csui/widgets/metadata.navigation/impl/nls/metadata.navigation.manifest',
  'csui/widgets/metadata/add.properties.menuitems',
  'csui/widgets/metadata/add.properties.menuitems.mask',
  'csui/widgets/metadata/header.dropdown.menu.items',
  'csui/widgets/metadata/header.dropdown.menu.items.mask',
  'csui/widgets/metadata/versions.toolbaritems.mask',
  'csui/widgets/metadata/metadata.general.action.fields'

], {});

require(['require', 'css'], function (require, css) {

  css.styleLoad(require, 'csui/bundles/csui-metadata', true);

});
