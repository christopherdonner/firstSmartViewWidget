csui.define(['module',
      'csui/lib/jquery',
      'csui/lib/underscore',
      'i18n!esoc/widgets/userwidget/nls/lang',
      'esoc/widgets/common/util'
    ],
    function (module, $, _, Lang, CommonUtil) {
      var Utils = {
        lang: Lang,
        commonUtil: CommonUtil

      }
      return Utils;
    });
