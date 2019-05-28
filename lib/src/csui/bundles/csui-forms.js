/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/form/form.view',
  'csui/controls/form/fields/alpaca/alpuserfield',
  'csui/controls/form/fields/alpaca/alpcsuibooleanfield',
  'csui/controls/form/fields/alpaca/alpcsuiselectfield',
  'csui/controls/form/fields/alpaca/alpcsuidateonlyfield',
  'csui/controls/form/fields/alpaca/alpcsuidatetimefield',
  'csui/controls/form/fields/alpaca/alpcsuitextfield',
  'csui/controls/form/fields/alpaca/alpcsuitextareafield',
  'csui/controls/form/fields/alpaca/alpcsuiintegerfield',
  'csui/controls/form/fields/alpaca/alpcsuiurlfield',
  'csui/controls/form/fields/alpaca/alpcsuiarrayfield',
  'csui/controls/form/fields/alpaca/alpcsuiobjectfield',
  'csui/controls/form/fields/alpaca/alpnodepickerfield',
  'csui/controls/form/fields/alpaca/alpcsuiarraybuttonsfield',
  'csui/controls/form/fields/alpaca/alpcsuipasswordfield',
  "csui/controls/form/fields/alpaca/alpcsuitklfield",
  'csui/controls/form/fields/userfield.view',
  'csui/controls/form/fields/booleanfield.view',
  'csui/controls/form/fields/datefield.view',
  'csui/controls/form/fields/datetimefield.view',
  'csui/controls/form/fields/selectfield.view',
  'csui/controls/form/fields/textfield.view',
  'csui/controls/form/fields/textareafield.view',
  'csui/controls/form/fields/nodepickerfield.view',
  'csui/controls/form/fields/arraybuttonsfield.view',
  'csui/controls/form/colout/colout.view',
  'csui/controls/form/fields/tklfield.view',
  'csui/controls/userpicker/userpicker.view',
  'csui/controls/form/fields/base/csformfield.view',
  'csui/controls/form/fields/base/csformfield.editable.behavior',
  'csui/controls/form/fields/base/csformfield.states.behavior',
  'csui/controls/form/fields/base/csformarrayfield.editable.behavior',
  'csui/controls/form/fields/base/csformarrayfield.states.behavior',
  'csui/lib/alpaca/js/alpaca',
  'i18n!csui/controls/form/impl/nls/lang',
  'csui/controls/form/impl/fields/csformfield.view',
  'hbs!csui/controls/form/impl/fields/userfield/userfield',
  'css!csui/controls/form/impl/fields/userfield/userfield'
], {});

require(['require', 'css'], function (require, css) {

  css.styleLoad(require, 'csui/bundles/csui-forms', true);

});
