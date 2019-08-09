define(['i18n!greet/widgets/metadata/impl/nls/lang',
  'greet/widgets/metadata/property.panels/hello/metadata.hello.property.controller'
], function (lang, MetadataHelloPropertyController) {

  return [

    {
      sequence: 20,
      controller: MetadataHelloPropertyController
    }

  ];

});
