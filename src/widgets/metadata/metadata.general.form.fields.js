define(['i18n!greet/widgets/metadata/impl/nls/lang',
  'greet/widgets/metadata/general.fields/hello/metadata.general.form.field.controller'
], function (lang, MetadataHelloGeneralFormFieldController) {

  return [

    {
      //sequence: 100,
      controller: MetadataHelloGeneralFormFieldController
    }

  ];

});
