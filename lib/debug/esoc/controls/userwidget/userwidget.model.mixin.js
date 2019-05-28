csui.define(['csui/lib/jquery', 'csui/lib/underscore'
], function ($, _) {
  
  var UserWidgetModelMixin = {
    parseModelResponse: function (model, options) {
      model.attributes.display_name = model.get("name_formatted");
      model.attributes.department_name = model.get("group_id") ? model.get("group_id").name : "";
    }
  };
  return UserWidgetModelMixin;
});
