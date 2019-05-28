/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


(function(root, factory)
{
    var umdEnabled = true;
    if (root && typeof(root.umd) != "undefined") {
        umdEnabled = root.umd;
    }

    if (umdEnabled && typeof exports === 'object')
    {
        module.exports = factory(require('jquery'), require('handlebars'), require('bootstrap'));
    }
    else if (umdEnabled && typeof define === 'function' && define.amd)
    {
        define("alpaca", ["jquery","handlebars","bootstrap"], factory);
    }
    else
    {
        root["Alpaca"] = factory(root["jQuery"], root["Handlebars"], root["Bootstrap"]);
    }

}(this, function ($, Handlebars, Bootstrap) {

    
        this["HandlebarsPrecompiled"] = this["HandlebarsPrecompiled"] || {};
this["HandlebarsPrecompiled"]["web-display"] = this["HandlebarsPrecompiled"]["web-display"] || {};
this["HandlebarsPrecompiled"]["web-display"]["container-array-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-array"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-object-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-object"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-table-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr>\n        "
    + ((stack1 = (helpers.itemField || (depth0 && depth0.itemField) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"td",{"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </tr>\n\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    <th>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.value : depth0)) != null ? stack1.title : stack1), depth0))
    + "</th>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                "
    + ((stack1 = (helpers.item || (depth0 && depth0.item) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"tr",{"name":"item","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        ";
  stack1 = ((helper = (helper = helpers.arrayToolbar || (depth0 != null ? depth0.arrayToolbar : depth0)) != null ? helper : alias2),(options={"name":"arrayToolbar","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.arrayToolbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <table>\n\n            <!-- table headers -->\n            <thead>\n                <tr>\n"
    + ((stack1 = (helpers.eachProperty || (depth0 && depth0.eachProperty) || alias2).call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.schema : depth0)) != null ? stack1.items : stack1)) != null ? stack1.properties : stack1),{"name":"eachProperty","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n            </thead>\n\n            <!-- table body -->\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n\n        </table>\n\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-tablerow-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <td>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </td>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container-tablerow"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-merge-up\">\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <legend class=\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-container-label\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</legend>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\"alpaca-helper "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"alpaca-icon-helper\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"8":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.container || (depth0 != null ? depth0.container : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"container","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.container) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-any"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>"
    + ((stack1 = (helpers.str || (depth0 && depth0.str) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),{"name":"str","hash":{},"data":data})) != null ? stack1 : "")
    + "</div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-checkbox"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>"
    + ((stack1 = (helpers.str || (depth0 && depth0.str) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),{"name":"str","hash":{},"data":data})) != null ? stack1 : "")
    + "</div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-hidden"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<script type=\"text/x-handlebars-template\">\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-image"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-image-display\">\n        <img id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-image\" src=\""
    + alias4(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper)))
    + "\">\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-password"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>"
    + ((stack1 = (helpers.disguise || (depth0 && depth0.disguise) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),"&bull;",{"name":"disguise","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-radio"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].data : depths[1]),{"name":"compare","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                "
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>\n";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-display"]["control-select"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].data : depths[1]),{"name":"compare","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                "
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>\n";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-display"]["control-text"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>"
    + ((stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-textarea"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <p>\n        "
    + ((stack1 = ((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </p>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control-url"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "target=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTarget : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1), depth0));
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper)));
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            "
    + container.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"data","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-control-url-anchor-wrapper\">\n        <a href=\""
    + container.escapeExpression(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTarget : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " title=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.anchorTitle : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "        </a>\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <label class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-control-label\" for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"info-sign\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.control || (depth0 != null ? depth0.control : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"control","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.control) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-display"]["form"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <button data-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"submit",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.type : depth0),"reset",{"name":"compare","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"alpaca-form-button alpaca-form-button-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.styles || (depth0 != null ? depth0.styles : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"styles","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.attributes : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "type=\"submit\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "type=\"reset\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return " "
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <form role=\"form\">\n\n        ";
  stack1 = ((helper = (helper = helpers.formItems || (depth0 != null ? depth0.formItems : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"formItems","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.formItems) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <div class=\"alpaca-form-buttons-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n\n    </form>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"] = this["HandlebarsPrecompiled"]["web-edit"] || {};
this["HandlebarsPrecompiled"]["web-edit"]["container-array-actionbar"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "        <button class=\"alpaca-array-actionbar-action "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.smallButton : stack1), depth0))
    + "\" data-alpaca-array-actionbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </button>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "            <i class=\""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.iconClass : depth0), depth0))
    + "\"></i>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-array-actionbar alpaca-array-actionbar-"
    + alias4(((helper = (helper = helpers.actionbarStyle || (depth0 != null ? depth0.actionbarStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionbarStyle","hash":{},"data":data}) : helper)))
    + " btn-group\" data-alpaca-array-actionbar-parent-field-id=\""
    + alias4(((helper = (helper = helpers.parentFieldId || (depth0 != null ? depth0.parentFieldId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"parentFieldId","hash":{},"data":data}) : helper)))
    + "\" data-alpaca-array-actionbar-field-id=\""
    + alias4(((helper = (helper = helpers.fieldId || (depth0 != null ? depth0.fieldId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "\" data-alpaca-array-actionbar-item-index=\""
    + alias4(((helper = (helper = helpers.itemIndex || (depth0 != null ? depth0.itemIndex : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemIndex","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-array-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = 
  "        <div class=\"pull-left\">\n            ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : alias2),(options={"name":"arrayActionbar","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.arrayActionbar) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n        </div>\n        <div class=\"pull-right\">\n            ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : alias2),(options={"name":"itemField","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.itemField) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n        </div>\n        <div class=\"clear\"></div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.actionbarStyle : depth0),"right",{"name":"compare","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=helpers.blockHelperMissing, buffer = 
  "            <div class=\"pull-left\">\n                ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : alias2),(options={"name":"itemField","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.itemField) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n            </div>\n            <div class=\"pull-right\">\n                ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : alias2),(options={"name":"arrayActionbar","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.arrayActionbar) { stack1 = alias4.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n            </div>\n            <div class=\"alpaca-clear\"></div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, buffer = 
  "            <div>\n\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.actionbarStyle : depth0),"top",{"name":"compare","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : alias2),(options={"name":"itemField","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.actionbarStyle : depth0),"bottom",{"name":"compare","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </div>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "                ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayActionbar","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.arrayActionbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.actionbarStyle : depth0),"left",{"name":"compare","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-array-toolbar"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " btn-group";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depths[1] != null ? depths[1].toolbarStyle : depths[1]),"link",{"name":"compare","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depths[1] != null ? depths[1].toolbarStyle : depths[1]),"button",{"name":"compare","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                <a href=\"#\" class=\"alpaca-array-toolbar-action\" data-alpaca-array-toolbar-action=\""
    + container.escapeExpression(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "                <button class=\"alpaca-array-toolbar-action "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.smallButton : stack1), depth0))
    + "\" data-alpaca-array-toolbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                </button>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-array-toolbar\" data-alpaca-array-toolbar-field-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.toolbarStyle : depth0),"button",{"name":"compare","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.actions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-array"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        ";
  stack1 = ((helper = (helper = helpers.arrayToolbar || (depth0 != null ? depth0.arrayToolbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayToolbar","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.arrayToolbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-object-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-object"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "\n            ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-table-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr>\n        "
    + ((stack1 = (helpers.itemField || (depth0 && depth0.itemField) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"td",{"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </tr>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    return "                    <!-- hidden column storing sort order -->\n                    <th class=\"alpaca-table-reorder-index-header\"></th>\n                    <!-- draggable -->\n                    <th class=\"alpaca-table-reorder-draggable-header\"></th>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                    <th data-header-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hidden : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</th>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "class=\"alpaca-table-column-hidden\"";
},"8":function(container,depth0,helpers,partials,data) {
    return "                        <th>Actions</th>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                "
    + ((stack1 = (helpers.item || (depth0 && depth0.item) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"tr",{"name":"item","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        ";
  stack1 = ((helper = (helper = helpers.arrayToolbar || (depth0 != null ? depth0.arrayToolbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayToolbar","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.arrayToolbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <table>\n\n            <!-- table headers -->\n            <thead>\n                <tr>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.dragRows : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.headers : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showActionsColumn : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n            </thead>\n\n            <!-- table body -->\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n\n        </table>\n\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-tablerow-item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <td>\n        ";
  stack1 = ((helper = (helper = helpers.itemField || (depth0 != null ? depth0.itemField : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"itemField","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.itemField) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </td>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container-tablerow"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "\n            <!-- hidden sort order column -->\n            <div class=\"alpaca-table-reorder-index-cell\"></div>\n\n            <!-- reorder draggable -->\n            <div class=\"alpaca-table-reorder-draggable-cell\">\n                <i class=\"glyphicon glyphicon-menu-hamburger\"></i>\n            </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.hidden : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "                ";
  stack1 = ((helper = (helper = helpers.item || (depth0 != null ? depth0.item : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"item","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.item) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, buffer = 
  "            <div class=\"alpaca-merge-up\">\n                ";
  stack1 = ((helper = (helper = helpers.arrayActionbar || (depth0 != null ? depth0.arrayActionbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayActionbar","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.arrayActionbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-merge-up\">\n\n        <!-- drag cell -->\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.dragRows : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <!-- actions cell -->\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showActionsColumn : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <legend class=\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-container-label\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</legend>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\"alpaca-helper "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"alpaca-icon-helper\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"8":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.container || (depth0 != null ? depth0.container : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"container","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.container) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-any"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"text\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" size=\"40\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-checkbox"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.checkboxOptions : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "\n            <div>\n\n                <label>\n\n                    <input type=\"checkbox\" data-checkbox-index=\""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" data-checkbox-value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n                    "
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n\n                </label>\n            </div>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "data-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "\n        <div>\n\n            <label>\n\n                <input type=\"checkbox\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n                "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rightLabel : stack1), depth0)) != null ? stack1 : "")
    + "\n            </label>\n\n        </div>\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.multiple : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(9, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n</script>\n";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-ckeditor"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <textarea id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\" cols=\"80\" rows=\"10\">\n    </textarea>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-editor"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"control-field-editor-el\"></div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-file"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"file\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-hidden"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"hidden\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-image"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"text\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n    <div class=\"alpaca-image-display\">\n        <h5>Preview</h5>\n        <img id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "-image\" src=\""
    + alias4(((helper = (helper = helpers.data || (depth0 != null ? depth0.data : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data","hash":{},"data":data}) : helper)))
    + "\">\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-optiontree"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"optiontree\"></div>\n\n    <input type=\""
    + alias4(((helper = (helper = helpers.inputType || (depth0 != null ? depth0.inputType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputType","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.attributes : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-password"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"password\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-radio"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "    <div class=\"radio\">\n        <label>\n            <input type=\"radio\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" value=\"\"/>"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.noneLabel : stack1), depth0)) != null ? stack1 : "")
    + "\n        </label>\n    </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=container.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "    <div class=\"radio\">\n        <label>\n            <input type=\"radio\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " name=\""
    + alias2(container.lambda((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" value=\""
    + alias2(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias3).call(alias1,(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].data : depths[1]),{"name":"compare","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>"
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n        </label>\n    </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "checked=\"checked\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.hideNone : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-select"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"3":function(container,depth0,helpers,partials,data) {
    return "multiple=\"multiple\"";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.hideNone : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.program(12, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <option value=\"\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.noneLabel : stack1), depth0)) != null ? stack1 : "")
    + "</option>\n";
},"14":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "        <option value=\""
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depths[1] != null ? depths[1].data : depths[1]),{"name":"each","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"15":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),(depths[2] != null ? depths[2].value : depths[2]),{"name":"compare","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"16":function(container,depth0,helpers,partials,data) {
    return "selected=\"selected\"";
},"18":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.hideNone : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.program(12, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(19, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"19":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "        <option value=\""
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].data : depths[1]),{"name":"compare","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + container.escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"text","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <select id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.multiple : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.multiple : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.program(18, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "\n    </select>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-text"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\""
    + alias4(((helper = (helper = helpers.inputType || (depth0 != null ? depth0.inputType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputType","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.attributes : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-textarea"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "rows=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rows : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "cols=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.cols : stack1), depth0))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "data-"
    + container.escapeExpression(((helper = (helper = helpers.fieldId || (depth0 != null ? depth0.fieldId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fieldId","hash":{},"data":data}) : helper)))
    + "=\""
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <textarea id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.rows : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.cols : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control-url"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "placeholder=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1), depth0))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "size=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1), depth0))
    + "\"";
},"5":function(container,depth0,helpers,partials,data) {
    return "readonly=\"readonly\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "name=\""
    + container.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"name","hash":{},"data":data}) : helper)))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "data-"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <input type=\"text\" id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.placeholder : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.size : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.readonly : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.name : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.data : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "/>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <label class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " alpaca-control-label\" for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\""
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"info-sign\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"alpaca-control-buttons-container\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <button data-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"alpaca-control-button alpaca-control-button-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.styles || (depth0 != null ? depth0.styles : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"styles","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.control || (depth0 != null ? depth0.control : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"control","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.control) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.renderButtons : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["form"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <button data-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\"alpaca-form-button alpaca-form-button-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.styles || (depth0 != null ? depth0.styles : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"styles","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.attributes : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return " "
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <form role=\"form\">\n\n        ";
  stack1 = ((helper = (helper = helpers.formItems || (depth0 != null ? depth0.formItems : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"formItems","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.formItems) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <div class=\"alpaca-form-buttons-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n\n    </form>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["message"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-message alpaca-message-"
    + ((stack1 = ((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\">\n        "
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["web-edit"]["wizard"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <div class=\"alpaca-wizard-nav\">\n            <nav class=\"navbar navbar-default\" role=\"navigation\">\n                <div class=\"container-fluid alpaca-wizard-back\">\n                    <ul class=\"nav navbar-nav\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.steps : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </ul>\n                </div>\n            </nav>\n        </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                        <li data-alpaca-wizard-step-index=\""
    + container.escapeExpression(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\">\n                            <div class=\"holder\">\n                                <div class=\"title\">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n                                <div class=\"description\">"
    + ((stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n                            </div>\n                            <div class=\"chevron\"></div>\n                        </li>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "        <div class=\"alpaca-wizard-progress-bar\">\n            <div class=\"progress\">\n                <div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 60%;\">\n                </div>\n            </div>\n        </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "            <h3>"
    + ((stack1 = ((helper = (helper = helpers.wizardTitle || (depth0 != null ? depth0.wizardTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"wizardTitle","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h3>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "            <h4>"
    + ((stack1 = ((helper = (helper = helpers.wizardDescription || (depth0 != null ? depth0.wizardDescription : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"wizardDescription","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</h4>\n";
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.align : depth0),"left",{"name":"compare","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <button type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.id : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " class=\""
    + alias4(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-alpaca-wizard-button-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.attributes : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var helper;

  return "id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\"";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return " "
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"";
},"16":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.align : depth0),"right",{"name":"compare","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-wizard\">\n\n        <!-- nav bar -->\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showSteps : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <!-- wizard progress bar -->\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.showProgressBar : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.wizardTitle : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.wizardDescription : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <!-- wizard steps -->\n        <div class=\"alpaca-wizard-steps\">\n\n        </div>\n\n        <!-- wizard buttons -->\n        <div class=\"alpaca-wizard-buttons\">\n\n            <div class=\"pull-left\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.buttons : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n\n            <div class=\"pull-right\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.buttons : depth0),{"name":"each","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n\n            <div style=\"clear:both\"></div>\n\n        </div>\n\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["bootstrap-display"] = this["HandlebarsPrecompiled"]["bootstrap-display"] || {};
this["HandlebarsPrecompiled"]["bootstrap-display"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "        <legend class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "alpaca-container-label\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.collapsible : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.collapsible : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </legend>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0))
    + " ";
},"4":function(container,depth0,helpers,partials,data) {
    return "            <span data-toggle=\"collapse\">\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "            </span>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\"alpaca-helper help-block "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"alpaca-icon-16 glyphicon glyphicon-info-sign\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"12":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.container || (depth0 != null ? depth0.container : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"container","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.container) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-display"]["control-radio"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].data : depths[1]),{"name":"compare","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "                "
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>\n";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["bootstrap-display"]["control-select"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.value : depth0),(depths[1] != null ? depths[1].data : depths[1]),{"name":"compare","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "            "
    + ((stack1 = ((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"text","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.selectOptions : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</script>\n";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["bootstrap-display"]["control-upload-partial-download"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <td></td>\n        <td class=\"name\">\n            <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n        </td>\n        <td class=\"size\">\n            <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.size : stack1), depth0))
    + "</span>\n        </td>\n        <td class=\"error\" colspan=\"2\">\n            Error:\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1), depth0))
    + "\n        </td>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <td class=\"preview\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.thumbnailUrl : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </td>\n        <td class=\"name\">\n            <a href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" data-gallery=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.thumbnailUrl : stack1), depth0))
    + "gallery\" download=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a>\n        </td>\n        <td class=\"size\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.size : stack1), depth0))
    + "</span></td>\n        <td colspan=\"2\"></td>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "            <a href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" data-gallery=\"gallery\" download=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\n                <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.thumbnailUrl : stack1), depth0))
    + "\">\n            </a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.buttons : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isDelete : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=container.escapeExpression;

  return "                        <button class=\"delete btn btn-danger\" data-file-index=\""
    + alias1(container.lambda((depths[1] != null ? depths[1].fileIndex : depths[1]), depth0))
    + "\" data-button-key=\""
    + alias1(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n                            <i class=\"glyphicon glyphicon-trash glyphicon-white\"></i>\n                        </button>\n";
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <button class=\""
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " btn "
    + alias4(((helper = (helper = helpers.buttonClass || (depth0 != null ? depth0.buttonClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonClass","hash":{},"data":data}) : helper)))
    + "\" data-file-index=\""
    + alias4(container.lambda((depths[1] != null ? depths[1].fileIndex : depths[1]), depth0))
    + "\" data-button-key=\""
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </button>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                "
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr class=\"template-download\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "        <td>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.buttons : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </td>\n    </tr>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["bootstrap-display"]["control-upload-partial-upload"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "        <td class=\"preview\">\n            <span class=\"fade\"></span>\n        </td>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <td></td>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <td class=\"error\" colspan=\"2\"><span class=\"label label-important\">Error</span> "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1), depth0))
    + "</td>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.valid : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(alias1,(data && data.index),0,{"name":"compare","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <td class=\"start\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.autoUpload : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "            </td>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "                <td>\n                    <div class=\"progress progress-success progress-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\">\n                        <div class=\"progress-bar\" style=\"width:0%;\"></div>\n                    </div>\n                </td>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "";
},"13":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"btn btn-primary\"> \\\n                    <i class=\"glyphicon glyphicon-upload glyphicon-white\"></i>\n                    <span>Start</span>\n                </button>\n";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <td></td>\n            <td class=\"cancel\">\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(data && data.index),0,{"name":"compare","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </td>\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"btn btn-warning\">\n                    <i class=\"glyphicon glyphicon-ban-circle glyphicon-white\"></i>\n                    <span>Cancel</span>\n                </button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=container.lambda, alias3=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr class=\"template-upload\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showUploadPreview : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n        <td class=\"name\"><span>"
    + alias3(alias2(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span></td>\n        <td class=\"size\"><span>"
    + alias3(alias2(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.size : stack1), depth0))
    + "</span></td>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "        <td></td>\n    </tr>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-display"]["control-upload"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.cssClasses || (depth0 != null ? depth0.cssClasses : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"cssClasses","hash":{},"data":data}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                        <thead>\n                            <tr>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showUploadPreview : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "                                <td>Name</td>\n                                <td>Size</td>\n                                <td colspan=\"2\"></td><!-- error or start or progress indicator -->\n                                <td>Actions</td>\n                            </tr>\n                        </thead>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                                    <td>Thumbnail</td>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "                                    <td></td>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=container.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-fileupload-container "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.cssClasses : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <div class=\"container-fluid\">\n            <div class=\"row alpaca-fileupload-chooserow\">\n                <div class=\"col-md-12\">\n                    <div class=\"btn-group\">\n                        <span class=\""
    + alias2(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.view : depth0)) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + " fileinput-button\">\n                            <i class=\"glyphicon glyphicon-upload\"></i>\n                            <span class=\"fileupload-add-button\">"
    + alias2(((helper = (helper = helpers.chooseButtonLabel || (depth0 != null ? depth0.chooseButtonLabel : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"chooseButtonLabel","hash":{},"data":data}) : helper)))
    + "</span>\n                            <input class=\"alpaca-fileupload-input\" type=\"file\" name=\""
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "_files\">\n                            <input class=\"alpaca-fileupload-input-hidden\" type=\"hidden\" name=\""
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "_files_hidden\">\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row alpaca-fileupload-well\">\n                <div class=\"col-md-12 fileupload-active-zone\">\n                    <table class=\"table table-striped\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showHeaders : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        <tbody class=\"files\">\n                        </tbody>\n                    </table>\n                    <p align=\"center\" class=\"dropzone-message\">"
    + alias2(((helper = (helper = helpers.dropZoneMessage || (depth0 != null ? depth0.dropZoneMessage : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"dropZoneMessage","hash":{},"data":data}) : helper)))
    + "</p>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <div id=\"progress\" class=\"progress\">\n                        <div class=\"progress-bar progress-bar-success\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-display"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <label class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " control-label alpaca-control-label\" for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\"help-block "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"glyphicon glyphicon-info-sign\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"form-group\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.control || (depth0 != null ? depth0.control : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"control","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.control) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-display"]["message"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"help-block\">\n        <i class=\"glyphicon glyphicon-exclamation-sign\"></i>&nbsp;"
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"] = this["HandlebarsPrecompiled"]["bootstrap-edit"] || {};
this["HandlebarsPrecompiled"]["bootstrap-edit"]["container-grid"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " btn-group";
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"link",{"name":"compare","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || alias2).call(alias1,((stack1 = (depths[1] != null ? depths[1].options : depths[1])) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                <a href=\"#\" class=\"alpaca-array-toolbar-action\" data-array-toolbar-action=\""
    + alias2(alias1((depth0 != null ? depth0.action : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "                <button class=\"alpaca-array-toolbar-action "
    + alias1(container.lambda(((stack1 = ((stack1 = (depths[1] != null ? depths[1].view : depths[1])) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + "\" data-array-toolbar-action=\""
    + alias1(((helper = (helper = helpers.action || (depth0 != null ? depth0.action : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"action","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    "
    + ((stack1 = helpers["if"].call(alias2,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n                </button>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n        <div class=\"alpaca-array-toolbar\" "
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.toolbarStyle : stack1),"button",{"name":"compare","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.arrayToolbarActions : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </div>\n\n        <div class=\"alpaca-container-grid-holder\"></div>\n\n    </div>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"]["container-table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"3":function(container,depth0,helpers,partials,data) {
    return "                    <!-- hidden column storing sort order -->\n                    <th class=\"alpaca-table-reorder-index-header\"></th>\n                    <!-- draggable -->\n                    <th class=\"alpaca-table-reorder-draggable-header\"></th>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "                    <th data-header-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hidden : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</th>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "class=\"alpaca-table-column-hidden\"";
},"8":function(container,depth0,helpers,partials,data) {
    return "                        <th>Actions</th>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n                "
    + ((stack1 = (helpers.item || (depth0 && depth0.item) || helpers.helperMissing).call(depth0 != null ? depth0 : {},"tr",{"name":"item","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"table-responsive\">\n\n        ";
  stack1 = ((helper = (helper = helpers.arrayToolbar || (depth0 != null ? depth0.arrayToolbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"arrayToolbar","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.arrayToolbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n        <table>\n\n            <!-- table headers -->\n            <thead>\n                <tr>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.dragRows : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.headers : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showActionsColumn : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </tr>\n            </thead>\n\n            <!-- table body -->\n            <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </tbody>\n\n        </table>\n\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"]["container"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "        <legend class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "alpaca-container-label\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.collapsible : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            "
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.collapsible : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </legend>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0))
    + " ";
},"4":function(container,depth0,helpers,partials,data) {
    return "            <span data-toggle=\"collapse\">\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "            </span>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\"alpaca-helper help-block "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"alpaca-icon-16 glyphicon glyphicon-info-sign\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"12":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.container || (depth0 != null ? depth0.container : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"container","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.container) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n    </div>\n\n</script>\n";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"]["control-upload-partial-download"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <td></td>\n        <td class=\"name\">\n            <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n        </td>\n        <td class=\"size\">\n            <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.size : stack1), depth0))
    + "</span>\n        </td>\n        <td class=\"error\" colspan=\"2\">\n            Error:\n            "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1), depth0))
    + "\n        </td>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <td class=\"preview\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.thumbnailUrl : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </td>\n        <td class=\"name\">\n            <a href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" data-gallery=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.thumbnailUrl : stack1), depth0))
    + "gallery\" download=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "</a>\n        </td>\n        <td class=\"size\"><span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.size : stack1), depth0))
    + "</span></td>\n        <td colspan=\"2\"></td>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "            <a href=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" data-gallery=\"gallery\" download=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\n                <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.thumbnailUrl : stack1), depth0))
    + "\">\n            </a>\n";
},"6":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.buttons : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isDelete : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=container.escapeExpression;

  return "                        <button class=\"delete btn btn-danger\" data-file-index=\""
    + alias1(container.lambda((depths[1] != null ? depths[1].fileIndex : depths[1]), depth0))
    + "\" data-button-key=\""
    + alias1(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n                            <i class=\"glyphicon glyphicon-trash glyphicon-white\"></i>\n                        </button>\n";
},"10":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <button class=\""
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " btn "
    + alias4(((helper = (helper = helpers.buttonClass || (depth0 != null ? depth0.buttonClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buttonClass","hash":{},"data":data}) : helper)))
    + "\" data-file-index=\""
    + alias4(container.lambda((depths[1] != null ? depths[1].fileIndex : depths[1]), depth0))
    + "\" data-button-key=\""
    + alias4(((helper = (helper = helpers.key || (depth0 != null ? depth0.key : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.iconClass : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.label : depth0),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </button>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                <i class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconClass || (depth0 != null ? depth0.iconClass : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"iconClass","hash":{},"data":data}) : helper)))
    + "\"></i>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                "
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr class=\"template-download\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data})) != null ? stack1 : "")
    + "        <td>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.buttons : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </td>\n    </tr>\n\n</script>";
},"useData":true,"useDepths":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"]["control-upload-partial-upload"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "        <td class=\"preview\">\n            <span class=\"fade\"></span>\n        </td>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <td></td>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <td class=\"error\" colspan=\"2\"><span class=\"label label-important\">Error</span> "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1), depth0))
    + "</td>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.valid : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(15, data, 0),"data":data})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(alias1,(data && data.index),0,{"name":"compare","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <td class=\"start\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.autoUpload : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "            </td>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "                <td>\n                    <div class=\"progress progress-success progress-striped active\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\" aria-valuenow=\"0\">\n                        <div class=\"progress-bar\" style=\"width:0%;\"></div>\n                    </div>\n                </td>\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "";
},"13":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"btn btn-primary\"> \\\n                    <i class=\"glyphicon glyphicon-upload glyphicon-white\"></i>\n                    <span>Start</span>\n                </button>\n";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <td></td>\n            <td class=\"cancel\">\n"
    + ((stack1 = (helpers.compare || (depth0 && depth0.compare) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(data && data.index),0,{"name":"compare","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </td>\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"btn btn-warning\">\n                    <i class=\"glyphicon glyphicon-ban-circle glyphicon-white\"></i>\n                    <span>Cancel</span>\n                </button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {}, alias2=container.lambda, alias3=container.escapeExpression;

  return "<script type=\"text/x-handlebars-template\">\n\n    <tr class=\"template-upload\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showUploadPreview : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n        <td class=\"name\"><span>"
    + alias3(alias2(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span></td>\n        <td class=\"size\"><span>"
    + alias3(alias2(((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.size : stack1), depth0))
    + "</span></td>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.file : depth0)) != null ? stack1.error : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "        <td></td>\n    </tr>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"]["control-upload"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.cssClasses || (depth0 != null ? depth0.cssClasses : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"cssClasses","hash":{},"data":data}) : helper)));
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                        <thead>\n                            <tr>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showUploadPreview : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "                                <td>Name</td>\n                                <td>Size</td>\n                                <td colspan=\"2\"></td><!-- error or start or progress indicator -->\n                                <td>Actions</td>\n                            </tr>\n                        </thead>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "                                    <td>Thumbnail</td>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "                                    <td></td>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=container.escapeExpression, alias3=helpers.helperMissing, alias4="function";

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"alpaca-fileupload-container "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.cssClasses : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <div class=\"container-fluid\">\n            <div class=\"row alpaca-fileupload-chooserow\">\n                <div class=\"col-md-12\">\n                    <div class=\"btn-group\">\n                        <span class=\""
    + alias2(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.view : depth0)) != null ? stack1.styles : stack1)) != null ? stack1.button : stack1), depth0))
    + " fileinput-button\">\n                            <i class=\"glyphicon glyphicon-upload\"></i>\n                            <span class=\"fileupload-add-button\">"
    + alias2(((helper = (helper = helpers.chooseButtonLabel || (depth0 != null ? depth0.chooseButtonLabel : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"chooseButtonLabel","hash":{},"data":data}) : helper)))
    + "</span>\n                            <input class=\"alpaca-fileupload-input\" type=\"file\" name=\""
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "_files\">\n                            <input class=\"alpaca-fileupload-input-hidden\" type=\"hidden\" name=\""
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "_files_hidden\">\n                        </span>\n                    </div>\n                </div>\n            </div>\n            <div class=\"row alpaca-fileupload-well\">\n                <div class=\"col-md-12 fileupload-active-zone\">\n                    <table class=\"table table-striped\">\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.showHeaders : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        <tbody class=\"files\">\n                        </tbody>\n                    </table>\n                    <p align=\"center\" class=\"dropzone-message\">"
    + alias2(((helper = (helper = helpers.dropZoneMessage || (depth0 != null ? depth0.dropZoneMessage : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias1,{"name":"dropZoneMessage","hash":{},"data":data}) : helper)))
    + "</p>\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"col-md-12\">\n                    <div id=\"progress\" class=\"progress\">\n                        <div class=\"progress-bar progress-bar-success\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"]["control"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "        <label class=\""
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " control-label alpaca-control-label\" for=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + ((stack1 = container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1), depth0)) != null ? stack1 : "")
    + "</label>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.labelClass : stack1), depth0));
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <p class=\"help-block "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n            <i class=\"glyphicon glyphicon-info-sign\"></i>\n            "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n        </p>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helperClass : stack1), depth0));
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "            <div class=\"alpaca-control-buttons-container\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <button data-key=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"alpaca-control-button alpaca-control-button-"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.styles || (depth0 != null ? depth0.styles : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"styles","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"each","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + ((stack1 = ((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</button>\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, buffer = 
  "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"form-group\">\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.label : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        ";
  stack1 = ((helper = (helper = helpers.control || (depth0 != null ? depth0.control : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"control","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.control) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.helpers : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.options : depth0)) != null ? stack1.renderButtons : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
this["HandlebarsPrecompiled"]["bootstrap-edit"]["message"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function";

  return "<script type=\"text/x-handlebars-template\">\n\n    <div class=\"help-block alpaca-message alpaca-message-"
    + ((stack1 = ((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\">\n        <i class=\"glyphicon glyphicon-exclamation-sign\"></i>&nbsp;"
    + ((stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n    </div>\n\n</script>";
},"useData":true});
(function (root, factory) {
        root['Base'] = factory();
}(this, function () {
    var TYPE_FUNCTION = 'function';
    var TYPE_OBJECT = 'object';
    var TYPE_STRING = 'string';
    var _prototyping = false;
    var _hiddenMethods = ['constructor', 'toString', 'valueOf'];
    var _hiddenMethodsLength = _hiddenMethods.length;
    var _superMethodRegex = /\bbase\b/;
    var _blankFunction = function() {};
    var _prototypeDefaults = { toSource: null, base: _blankFunction };
    var Base = function() {};
    Base.extend = function(instanceMethods, staticMethods) { // subclass
        var extend = Base.prototype.extend;
        _prototyping = true;

        var proto = new this();
        extend.call(proto, instanceMethods);
        proto.base = _prototypeDefaults.base;

        _prototyping = false;
        var constructor = proto.constructor;
        var klass = proto.constructor = function() {
            if (!_prototyping) {
                if (this && (this._constructing || this.constructor === klass)) {
                    this._constructing = true;
                    constructor.apply(this, arguments);
                    this._constructing = false;
                } else if (arguments.length) {
                    Base.cast.apply(klass, arguments);
                }
            }
        };
        extend.call(klass, this);
        klass.ancestor = this;
        klass.prototype = proto;
        klass.valueOf = function(type) {
            return (type === TYPE_OBJECT) ? klass : constructor.valueOf();
        };
        extend.call(klass, staticMethods);
        if (typeof klass.init === TYPE_FUNCTION) {
            klass.init();
        }

        return klass;
    };
    Base.prototype.extend = function(source, value) {
        if (typeof source === TYPE_STRING && arguments.length > 1) {
            var ancestor = this[source];
            if (
                ancestor &&
                (typeof value === TYPE_FUNCTION) &&
                (!ancestor.valueOf || ancestor.valueOf() !== value.valueOf()) &&
                _superMethodRegex.test(value)
            ) {
                var method = value.valueOf();
                value = function() {
                    var returnValue;
                    var previous = this.base || _prototypeDefaults.base;
                    this.base = ancestor;
                    if (arguments.length === 0) {
                        returnValue = method.call(this);
                    } else {
                        returnValue = method.apply(this, arguments);
                    }
                    this.base = previous;
                    return returnValue;
                };
                value.valueOf = function(type) {
                    return (type === TYPE_OBJECT) ? value : method;
                };
                value.toString = Base.toString;
            }
            this[source] = value;
        } else if (source) {
            var extend = Base.prototype.extend;
            if (!_prototyping && typeof this !== TYPE_FUNCTION) {
                extend = this.extend || extend;
            }
            var i = _prototyping ? 0 : 1;
            var key;
            for (; i < _hiddenMethodsLength; i++) {
                key = _hiddenMethods[i];
                if (source[key] !== _prototypeDefaults[key]) {
                    extend.call(this, key, source[key]);
                }
            }
            for (key in source) {
                if (!_prototypeDefaults[key]) {
                    extend.call(this, key, source[key]);
                }
            }
        }

        return this;
    };
    Base = Base.extend({
        base: _prototypeDefaults.base

    }, {
        ancestor: Object,
        version: '1.1',
        cast: function() {
            var i = 0;
            var length = arguments.length;
            var extend;
            var caster;

            for (; i < length; i++) {
                caster = arguments[i];
                extend = caster.extend || Base.prototype.extend;
                if (typeof caster === TYPE_FUNCTION) {
                    extend = caster.prototype.extend || Base.prototype.extend;
                    extend.call(caster.prototype, this.prototype);
                    extend.call(caster, this);
                    caster.ancestor = this;
                } else {
                    extend.call(caster, this.prototype);
                }
            }

            return this;
        },
        implement: function() {
            for (var i = 0; i < arguments.length; i++) {
                this.cast.call(arguments[i], this);
            }

            return this;
        },
        toString: function() {
            return this.valueOf() + '';
        }

    });

    return Base;


}));
(function($) {
    var Alpaca = function()
    {
        var args = Alpaca.makeArray(arguments);
        if (args.length === 0) {
            return Alpaca.throwDefaultError("You must supply at least one argument.  This argument can either be a DOM element against which Alpaca will generate a form or it can be a function name.  See http://www.alpacajs.org for more details.");
        }
        var el = args[0];
        if (el && Alpaca.isString(el)) {
            el = $("#" + el);
        }
        var data = null;
        var schema = null;
        var options = null;
        var view = null;
        var callback = null;
        var renderedCallback = null;
        var errorCallback = null;
        var connector = null;
        var notTopLevel = false;
        var initialSettings = {};
        var dataSource = null;
        var schemaSource = null;
        var optionsSource = null;
        var viewSource = null;
        var findExistingAlpacaBinding = function(domElement, skipPivot)
        {
            var existing = null;
            var alpacaFieldId = $(domElement).attr("data-alpaca-field-id");
            if (alpacaFieldId)
            {
                var alpacaField = Alpaca.fieldInstances[alpacaFieldId];
                if (alpacaField)
                {
                    existing = alpacaField;
                }
            }
            if (!existing)
            {
                var formId = $(domElement).attr("data-alpaca-form-id");
                if (formId)
                {
                    var subElements = $(domElement).find(":first");
                    if (subElements.length > 0)
                    {
                        var subFieldId = $(subElements[0]).attr("data-alpaca-field-id");
                        if (subFieldId)
                        {
                            var subField = Alpaca.fieldInstances[subFieldId];
                            if (subField)
                            {
                                existing = subField;
                            }
                        }
                    }
                }
            }
            if (!existing && !skipPivot)
            {
                var childDomElements = $(el).find(":first");
                if (childDomElements.length > 0)
                {
                    var childField = findExistingAlpacaBinding(childDomElements[0], true);
                    if (childField)
                    {
                        existing = childField;
                    }
                }
            }
            if (!existing && !skipPivot)
            {
                var parentEl = $(el).parent();
                if (parentEl)
                {
                    var parentField = findExistingAlpacaBinding(parentEl, true);
                    if (parentField)
                    {
                        existing = parentField;
                    }
                }
            }

            return existing;
        };

        var specialFunctionNames = ["get", "exists", "destroy"];
        var isSpecialFunction = (args.length > 1 && Alpaca.isString(args[1]) && (specialFunctionNames.indexOf(args[1]) > -1));

        var existing = findExistingAlpacaBinding(el);
        if (existing || isSpecialFunction)
        {
            if (isSpecialFunction)
            {
                var specialFunctionName = args[1];
                if ("get" === specialFunctionName) {
                    return existing;
                }
                else if ("exists" === specialFunctionName) {
                    return (existing ? true : false);
                }
                else if ("destroy" === specialFunctionName) {
                    if (existing) {
                        existing.destroy();
                    }
                    return;
                }

                return Alpaca.throwDefaultError("Unknown special function: " + specialFunctionName);
            }

            return existing;
        }
        else
        {
            var config = null;
            if (args.length === 1)
            {
                var jsonString = $(el).text();

                config = JSON.parse(jsonString);
                $(el).html("");
            }
            else
            {
                if (Alpaca.isObject(args[1]))
                {
                    config = args[1];
                }
                else if (Alpaca.isFunction(args[1]))
                {
                    config = args[1]();
                }
                else
                {
                    config = {
                        "data": args[1]
                    };
                }
            }

            if (!config)
            {
                return Alpaca.throwDefaultError("Unable to determine Alpaca configuration");
            }

            data = config.data;
            schema = config.schema;
            options = config.options;
            view = config.view;
            callback = config.render;
            if (config.callback) {
                callback = config.callback;
            }
            renderedCallback = config.postRender;
            errorCallback = config.error;
            connector = config.connector;
            dataSource = config.dataSource;
            schemaSource = config.schemaSource;
            optionsSource = config.optionsSource;
            viewSource = config.viewSource;
            if (config.ui) {
                initialSettings["ui"] = config.ui;
            }
            if (config.type) {
                initialSettings["type"] = config.type;
            }
            if (!Alpaca.isEmpty(config.notTopLevel)) {
                notTopLevel = config.notTopLevel;
            }
        }
        if (Alpaca.isEmpty(errorCallback)) {
            errorCallback = Alpaca.defaultErrorCallback;
        }
        if (!connector || !connector.connect)
        {
            var connectorId = "default";
            var connectorConfig = {};
            if (Alpaca.isString(connector)) {
                connectorId = connector;
            }
            else if (Alpaca.isObject(connector) && connector.id) {
                connectorId = connector.id;
                if (connector.config) {
                    connectorConfig = connector.config;
                }
            }

            var ConnectorClass = Alpaca.getConnectorClass(connectorId);
            if (!ConnectorClass) {
                ConnectorClass = Alpaca.getConnectorClass("default");
            }
            connector = new ConnectorClass(connectorId, connectorConfig);
        }

        var loadAllConnector = connector;

        if (notTopLevel) {
            var LoadAllConnectorClass = Alpaca.getConnectorClass("default");
            loadAllConnector = new LoadAllConnectorClass("default");
        }

        if (!options) {
            options = {};
        }
        var _resetInitValidationError = function(field)
        {
            if (!field.parent)
            {
                if (!field.hideInitValidationError)
                {
                    field.refreshValidationState(true);
                }
                if (field.view.type !== 'view')
                {
                    Alpaca.fieldApplyFieldAndChildren(field, function(field) {
                        field.hideInitValidationError = false;

                    });
                }
            }
        };
        var _renderedCallback = function(field)
        {
            if (!field.parent)
            {
                field.observableScope = Alpaca.generateId();
            }
            if (!field.parent)
            {
                Alpaca.fireReady(field);
            }
            if (Alpaca.isUndefined(options.focus) && !field.parent) {
                options.focus = Alpaca.defaultFocus;
            }
            if (options && options.focus)
            {
                window.setTimeout(function() {

                    var doFocus = function(__field)
                    {
                        __field.suspendBlurFocus = true;
                        __field.focus();
                        __field.suspendBlurFocus = false;
                    };

                    if (options.focus)
                    {
                        if (field.isControlField && field.isAutoFocusable())
                        {
                            doFocus(field);
                        }
                        else if (field.isContainerField)
                        {
                            if (options.focus === true)
                            {
                                if (field.children && field.children.length > 0)
                                {

                                    doFocus(field);
                                }
                            }
                            else if (typeof(options.focus) === "string")
                            {
                                var child = field.getControlByPath(options.focus);
                                if (child && child.isControlField && child.isAutoFocusable())
                                {
                                    doFocus(child);
                                }
                            }
                        }

                        _resetInitValidationError(field);
                    }
                }, 500);
            }
            else
            {
                _resetInitValidationError(field);
            }

            if (renderedCallback)
            {
                renderedCallback(field);
            }
        };

        loadAllConnector.loadAll({
            "data": data,
            "schema": schema,
            "options": options,
            "view": view,
            "dataSource": dataSource,
            "schemaSource": schemaSource,
            "optionsSource": optionsSource,
            "viewSource": viewSource
        }, function(loadedData, loadedOptions, loadedSchema, loadedView) {

            loadedData = loadedData ? loadedData : data;
            loadedSchema = loadedSchema ? loadedSchema: schema;
            loadedOptions = loadedOptions ? loadedOptions : options;
            loadedView = loadedView ? loadedView : view;

            if (Alpaca.isEmpty(loadedData))
            {
                if (Alpaca.isEmpty(loadedSchema) && (Alpaca.isEmpty(loadedOptions) || Alpaca.isEmpty(loadedOptions.type)))
                {
                    loadedData = "";

                    if (Alpaca.isEmpty(loadedOptions))
                    {
                        loadedOptions = "text";
                    }
                    else if (options && Alpaca.isObject(options))
                    {
                        loadedOptions.type = "text";
                    }
                }
            }

            if (loadedOptions.view)
            {
                loadedView = loadedOptions.view;
            }
            return Alpaca.init(el, loadedData, loadedOptions, loadedSchema, loadedView, initialSettings, callback, _renderedCallback, connector, errorCallback);

        }, function (loadError) {
            errorCallback(loadError);
            return null;
        });
    };
    Alpaca.Fields = { };
    Alpaca.Connectors = { };

    Alpaca.Extend = $.extend;

    Alpaca.Create = function()
    {
        var args = Array.prototype.slice.call(arguments);
        args.unshift({});

        return $.extend.apply(this, args);
    };
    Alpaca.Extend(Alpaca,
    {
        makeArray : function(nonArray) {
            return Array.prototype.slice.call(nonArray);
        },
        isFunction: function(obj) {
            return Object.prototype.toString.call(obj) === "[object Function]";
        },
        isString: function(obj) {
            return (typeof obj === "string");
        },
        isObject: function(obj) {
            return !Alpaca.isUndefined(obj) && Object.prototype.toString.call(obj) === '[object Object]';
        },
        isPlainObject: function(obj) {
            return $.isPlainObject(obj);
        },
        isNumber: function(obj) {
            return (typeof obj === "number");
        },
        isArray: function(obj) {
            return obj instanceof Array;
        },
        isBoolean: function(obj) {
            return (typeof obj === "boolean");
        },
        isUndefined: function(obj) {
            return (typeof obj == "undefined");
        },
        trim: function(text)
        {
            var trimmed = text;

            if (trimmed && Alpaca.isString(trimmed))
            {
                trimmed = trimmed.replace(/^\s+|\s+$/g, '');
            }

            return trimmed;
        },
        safeDomParse: function(x)
        {
            if (x && Alpaca.isString(x))
            {
                x = Alpaca.trim(x);
                var converted = null;
                try
                {
                    converted = $(x);
                }
                catch (e)
                {
                    x = "<div>" + x + "</div>";

                    converted = $(x).children();
                }

                return converted;
            }

            return x;
        },
        isEmpty: function(obj, includeFunctions) {

            var self = this;

            if (Alpaca.isUndefined(obj))
            {
                return true;
            }
            else if (obj === null)
            {
                return true;
            }

            if (obj && Alpaca.isObject(obj))
            {
                var count = self.countProperties(obj, includeFunctions);
                if (count === 0)
                {
                    return true;
                }
            }

            return false;
        },
        countProperties: function(obj, includeFunctions) {
            var count = 0;

            if (obj && Alpaca.isObject(obj))
            {
                for (var k in obj)
                {
                    if (obj.hasOwnProperty(k))
                    {
                        if (includeFunctions) {
                            count++;
                        } else {
                            if (typeof(obj[k]) !== "function") {
                                count++;
                            }
                        }
                    }
                }
            }

            return count;
        },
        copyOf: function(thing)
        {
            var copy = thing;

            if (Alpaca.isArray(thing))
            {
                copy = [];

                for (var i = 0; i < thing.length; i++)
                {
                    copy.push(Alpaca.copyOf(thing[i]));
                }
            }
            else if (Alpaca.isObject(thing))
            {
                if (thing instanceof Date)
                {
                    return new Date(thing.getTime());
                }
                else if (thing instanceof RegExp)
                {
                    return new RegExp(thing);
                }
                else if (thing.nodeType && "cloneNode" in thing)
                {
                    copy = thing.cloneNode(true);
                }
                else if ($.isPlainObject(thing))
                {
                    copy = {};

                    for (var k in thing)
                    {
                        if (thing.hasOwnProperty(k))
                        {
                            copy[k] = Alpaca.copyOf(thing[k]);
                        }
                    }
                }
                else
                {
                }
            }

            return copy;
        },

        copyInto: function(target, source)
        {
            for (var i in source)
            {
                if (source.hasOwnProperty(i) && !this.isFunction(this[i]))
                {
                    target[i] = source[i];
                }
            }
        },
        cloneObject: function(object)
        {
            return Alpaca.copyOf(object);
        },
        spliceIn: function(source, splicePoint, splice) {
            return source.substring(0, splicePoint) + splice + source.substring(splicePoint, source.length);
        },
        compactArray: function(arr) {
            var n = [], l = arr.length,i;
            for (i = 0; i < l; i++) {
                if (!lang.isNull(arr[i]) && !lang.isUndefined(arr[i])) {
                    n.push(arr[i]);
                }
            }
            return n;
        },
        removeAccents: function(str) {
            return str.replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i").replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ýÿ]/g, "y").replace(/[ñ]/g, "n").replace(/[ç]/g, "c").replace(/[œ]/g, "oe").replace(/[æ]/g, "ae");
        },
        indexOf: function(el, arr, fn) {
            var l = arr.length,i;

            if (!Alpaca.isFunction(fn)) {
                fn = function(elt, arrElt) {
                    return elt === arrElt;
                };
            }

            for (i = 0; i < l; i++) {
                if (fn.call({}, el, arr[i])) {
                    return i;
                }
            }

            return -1;
        },
        uniqueIdCounter: 0,
        defaultLocale: "en_US",
        defaultFocus: true,
        defaultSort: function(a, b) {

            if (a.text > b.text) {
                return 1;
            }
            else if (a.text < b.text) {
                return -1;
            }

            return 0;
        },
        setDefaultLocale: function(locale) {
            this.defaultLocale = locale;
        },
        defaultSchemaFieldMapping: {},
        registerDefaultSchemaFieldMapping: function(schemaType, fieldType) {
            if (schemaType && fieldType) {
                this.defaultSchemaFieldMapping[schemaType] = fieldType;
            }
        },
        defaultFormatFieldMapping: {},
        registerDefaultFormatFieldMapping: function(format, fieldType) {
            if (format && fieldType) {
                this.defaultFormatFieldMapping[format] = fieldType;
            }
        },
        getSchemaType: function(data) {

            var schemaType = null;
            if (Alpaca.isEmpty(data)) {
                schemaType = "string";
            }
            else if (Alpaca.isArray(data)) {
                schemaType = "array";
            }
            else if (Alpaca.isObject(data)) {
                schemaType = "object";
            }
            else if (Alpaca.isString(data)) {
                schemaType = "string";
            }
            else if (Alpaca.isNumber(data)) {
                schemaType = "number";
            }
            else if (Alpaca.isBoolean(data)) {
                schemaType = "boolean";
            }
            if (!schemaType && (typeof data === 'object')) {
                schemaType = "object";
            }

            return schemaType;
        },
        guessOptionsType: function(schema)
        {
            var type = null;

            if (schema && typeof(schema["enum"]) !== "undefined")
            {
                if (schema["enum"].length > 3)
                {
                    type = "select";
                }
                else
                {
                    type = "radio";
                }
            }
            else
            {
                type = Alpaca.defaultSchemaFieldMapping[schema.type];
            }
            if (schema.format && Alpaca.defaultFormatFieldMapping[schema.format])
            {
                type = Alpaca.defaultFormatFieldMapping[schema.format];
            }

            return type;
        },
        views: {},
        generateViewId : function () {
            return "view-" + this.generateId();
        },
        registerView: function(viewObject)
        {
            var viewId = viewObject.id;

            if (!viewId)
            {
                return Alpaca.throwDefaultError("Cannot register view with missing view id: " + viewId);
            }

            var existingView = this.views[viewId];
            if (existingView)
            {
                Alpaca.mergeObject(existingView, viewObject);
            }
            else
            {
                this.views[viewId] = viewObject;

                if (!viewObject.templates)
                {
                    viewObject.templates = {};
                }
                var engineIds = Alpaca.TemplateEngineRegistry.ids();
                for (var i = 0; i < engineIds.length; i++)
                {
                    var engineId = engineIds[i];

                    var engine = Alpaca.TemplateEngineRegistry.find(engineId);
                    if (engine)
                    {
                        var cacheKeys = engine.findCacheKeys(viewId);
                        for (var z = 0; z < cacheKeys.length; z++)
                        {
                            var parts = Alpaca.splitCacheKey(cacheKeys[z]);
                            viewObject.templates[parts.templateId] = {
                                "type": engineId,
                                "template": true,
                                "cacheKey": cacheKeys[z]
                            };
                        }
                    }
                }
            }
        },
        getNormalizedView: function(viewId)
        {
            return this.normalizedViews[viewId];
        },
        lookupNormalizedView: function(ui, type)
        {
            var theViewId = null;

            for (var viewId in this.normalizedViews)
            {
                var view = this.normalizedViews[viewId];

                if (view.ui === ui && view.type === type)
                {
                    theViewId = viewId;
                    break;
                }
            }

            return theViewId;
        },
        registerTemplate: function(templateId, template, viewId)
        {
            if (!viewId)
            {
                viewId = "base";
            }

            if (!this.views[viewId])
            {
                this.views[viewId] = {};
                this.views[viewId].id = viewId;
            }

            if (!this.views[viewId].templates)
            {
                this.views[viewId].templates = {};
            }

            this.views[viewId].templates[templateId] = template;

        },
        registerTemplates: function(templates, viewId) {
            for (var templateId in templates) {
                this.registerTemplate(templateId, templates[templateId], viewId);
            }
        },
        registerMessage: function(messageId, message, viewId)
        {
            if (!viewId)
            {
                viewId = "base";
            }

            if (!this.views[viewId])
            {
                this.views[viewId] = {};
                this.views[viewId].id = viewId;
            }

            if (!this.views[viewId].messages)
            {
                this.views[viewId].messages = {};
            }

            this.views[viewId].messages[messageId] = message;
        },
        registerMessages: function(messages, viewId) {
            for (var messageId in messages) {
                if (messages.hasOwnProperty(messageId)) {
                    this.registerMessage(messageId, messages[messageId], viewId);
                }
            }
        },
        defaultDateFormat: "MM/DD/YYYY",
        defaultTimeFormat: "HH:SS",
        regexps:
        {
            "email": /^[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+(?:\.[a-z0-9!\#\$%&'\*\-\/=\?\+\-\^_`\{\|\}~]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,6}$/i,
            "url": /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(\:[0-9]{1,5})?(\/.*)?$/i,
            "intranet-url": /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*(\:[0-9]{1,5})?(\/.*)?$/i,
            "password": /^[0-9a-zA-Z\x20-\x7E]*$/,
            "date": /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.]\d\d$/,
            "integer": /^([\+\-]?([1-9]\d*)|0)$/,
            "number":/^([\+\-]?((([0-9]+(\.)?)|([0-9]*\.[0-9]+))([eE][+-]?[0-9]+)?))$/,
            "phone":/^(\D?(\d{3})\D?\D?(\d{3})\D?(\d{4}))?$/,
            "ipv4":/^(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)(?:\.(?:1\d?\d?|2(?:[0-4]\d?|[6789]|5[0-5]?)?|[3-9]\d?|0)){3}$/,
            "zipcode-five": /^(\d{5})?$/,
            "zipcode-nine": /^(\d{5}(-\d{4})?)?$/,
            "whitespace": /^\s+$/
        },
        fieldInstances: {},
        fieldClassRegistry: {},
        registerFieldClass: function(type, fieldClass) {
            this.fieldClassRegistry[type] = fieldClass;
        },
        getFieldClass: function(type) {
            return this.fieldClassRegistry[type];
        },
        getFieldClassType: function(fieldClass) {
            for (var type in this.fieldClassRegistry) {
                if (this.fieldClassRegistry.hasOwnProperty(type)) {
                    if (this.fieldClassRegistry[type] === fieldClass) {
                        return type;
                    }
                }
            }
            return null;
        },
        connectorClassRegistry: {},
        registerConnectorClass: function(type, connectorClass) {
            this.connectorClassRegistry[type] = connectorClass;
        },
        getConnectorClass: function(type) {
            return this.connectorClassRegistry[type];
        },
        replaceAll: function(text, replace, with_this) {
            return text.replace(new RegExp(replace, 'g'), with_this);
        },
        element: function(tag, domAttributes, styleAttributes, classNames) {
            var el = $("<" + tag + "/>");

            if (domAttributes) {
                el.attr(domAttributes);
            }
            if (styleAttributes) {
                el.css(styleAttributes);
            }
            if (classNames) {
                for (var className in classNames) {
                    el.addClass(className);
                }
            }
        },
        elementFromTemplate: function(template, substitutions) {
            var html = template;
            if (substitutions) {
                for (var x in substitutions) {
                    html = Alpaca.replaceAll(html, "${" + x + "}", substitutions[x]);
                }
            }
            return $(html);
        },
        generateId: function() {
            Alpaca.uniqueIdCounter++;
            return "alpaca" + Alpaca.uniqueIdCounter;
        },
        later: function(when, o, fn, data, periodic) {
            when = when || 0;
            o = o || {};
            var m = fn, d = $.makeArray(data), f, r;

            if (typeof fn === "string") {
                m = o[fn];
            }

            if (!m) {
                throw {
                    name: 'TypeError',
                    message: "The function is undefined."
                };
            }
            f = function() {
                m.apply(o, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                id: r,
                interval: periodic,
                cancel: function() {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        },
        endsWith : function(text, suffix) {
            return text.indexOf(suffix, text.length - suffix.length) !== -1;
        },
        startsWith : function(text, prefix) {
            return text.substr(0, prefix.length) === prefix;
        },
        isUri : function(obj) {
            return Alpaca.isString(obj) && (Alpaca.startsWith(obj, "http://") ||
                    Alpaca.startsWith(obj, "https://") ||
                    Alpaca.startsWith(obj, "/") ||
                    Alpaca.startsWith(obj, "./") ||
                    Alpaca.startsWith(obj, "../"));
        },
        traverseObject : function(object, keys, subprop) {
            if (Alpaca.isString(keys)) {
                keys = keys.split(".");
            }

            var element = null;
            var current = object;

            var key = null;
            do {
                key = keys.shift();
                if (subprop && key === subprop) {
                    key = keys.shift();
                }
                if (!Alpaca.isEmpty(current[key])) {
                    current = current[key];
                    if (keys.length === 0) {
                        element = current;
                    }
                } else {
                    keys = [];
                }
            } while (keys.length > 0);

            return element;
        },
        each : function(data, func) {
            if (Alpaca.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    func.apply(data[i]);
                }
            } else if (Alpaca.isObject(data)) {
                for (var key in data) {
                    func.apply(data[key]);
                }
            }
        },
        merge : function(obj1, obj2, validKeyFunction) {
            if (!obj1) {
                obj1 = {};
            }
            for (var key in obj2) {
                var valid = true;

                if (validKeyFunction) {
                    valid = validKeyFunction(key);
                }

                if (valid) {
                    if (Alpaca.isEmpty(obj2[key])) {
                        obj1[key] = obj2[key];
                    } else {
                        if (Alpaca.isObject(obj2[key])) {
                            if (!obj1[key]) {
                                obj1[key] = {};
                            }
                            obj1[key] = Alpaca.merge(obj1[key], obj2[key]);
                        } else {
                            obj1[key] = obj2[key];
                        }
                    }
                }
            }

            return obj1;
        },
        mergeObject : function(target, source) {

            if (!target) {
                target = {};
            }

            if (!source) {
                source = {};
            }

            this.mergeObject2(source, target);

            return target;
        },

        mergeObject2: function(source, target)
        {
            var isArray = Alpaca.isArray;
            var isObject = Alpaca.isObject;
            var isUndefined = Alpaca.isUndefined;
            var copyOf = Alpaca.copyOf;

            var _merge = function(source, target)
            {
                if (isArray(source))
                {
                    if (isArray(target))
                    {
                        $.each(source, function(index) {
                            target.push(copyOf(source[index]));
                        });
                    }
                    else
                    {
                    }
                }
                else if (isObject(source))
                {
                    if (isObject(target))
                    {
                        $.each(source, function(key) {

                            if (isUndefined(target[key])) {
                                target[key] = copyOf(source[key]);
                            } else {
                                target[key] = _merge(source[key], target[key]);
                            }

                        });
                    }
                    else
                    {
                    }

                }
                else
                {
                    target = copyOf(source);
                }

                return target;
            };

            _merge(source, target);

            return target;
        },
        substituteTokens : function(text, args) {

            if (!Alpaca.isEmpty(text)) {
                for (var i = 0; i < args.length; i++) {
                    var token = "{" + i + "}";

                    var x = text.indexOf(token);
                    if (x > -1) {
                        var nt = text.substring(0, x) + args[i] + text.substring(x + 3);
                        text = nt;
                    }
                }
            }
            return text;
        },
        compareObject : function(obj1, obj2) {
            return equiv(obj1, obj2);
        },
        compareArrayContent : function(a, b) {
            var equal = a && b && (a.length === b.length);

            if (equal) {
                for (var i = a.length - 1; i >= 0; i--) {
                    var v = a[i];
                    if ($.inArray(v, b) < 0) {
                        return false;
                    }
                }
            }

            return equal;
        },

        testRegex: function(expression, textValue)
        {
            var regex = new RegExp(expression);

            return regex.test(textValue);
        },
        isValEmpty : function(val, includeFunctions) {
            var empty = false;
            if (Alpaca.isEmpty(val, includeFunctions)) {
                empty = true;
            } else {
                if (Alpaca.isString(val) && val === "") {
                    empty = true;
                }
                if (Alpaca.isObject(val) && $.isEmptyObject(val)) {
                    empty = true;
                }
                if (Alpaca.isArray(val) && val.length === 0) {
                    empty = true;
                }
            }
            return empty;
        },
        init: function(el, data, options, schema, view, initialSettings, callback, renderedCallback, connector, errorCallback) {

            var self = this;
            if (Alpaca.isObject(view)) {
                var viewId = view.id;
                if (!viewId) {
                    view.id = this.generateViewId();
                }
                var parentId = view.parent;
                if (!parentId)
                {
                    view.parent = "bootstrap-edit";
                }
                this.registerView(view);
                view = view.id;
            }
            this.compile(function(report) {

                if (report.errors && report.errors.length > 0)
                {
                    var messages = [];

                    for (var i = 0; i < report.errors.length; i++)
                    {
                        var viewId = report.errors[i].view;
                        var cacheKey = report.errors[i].cacheKey
                        var err = report.errors[i].err;

                        var text = "The template with cache key: " + cacheKey + " for view: " + viewId + " failed to compile";
                        if (err && err.message) {
                            text += ", message: " + err.message;

                            messages.push(err.message);
                        }
                        if (err) {
                            text += ", err: " + JSON.stringify(err);
                        }
                        Alpaca.logError(text);

                        delete self.normalizedViews[viewId];
                        delete self.views[viewId];
                    }

                    return Alpaca.throwErrorWithCallback("View compilation failed, cannot initialize Alpaca. " + messages.join(", "), errorCallback);
                }

                self._init(el, data, options, schema, view, initialSettings, callback, renderedCallback, connector, errorCallback);
            }, errorCallback);
        },

        _init: function(el, data, options, schema, view, initialSettings, callback, renderedCallback, connector, errorCallback)
        {
            var self = this;
            var fallbackUI   = Alpaca.defaultView || null;
            var fallbackType = null;
            if ($.mobile && !fallbackUI) {
                fallbackUI = "jquerymobile";
            }
            var bootstrapDetected = (typeof $.fn.modal === 'function');
            if (bootstrapDetected && !fallbackUI) {
                fallbackUI = "bootstrap";
            }
            var jQueryUIDetected = (typeof($.ui) !== "undefined");
            if (jQueryUIDetected && !fallbackUI) {
                fallbackUI = "jqueryui";
            }

            if (fallbackUI)
            {
                if (data) {
                    fallbackType = "edit";
                } else {
                    fallbackType = "create";
                }
            }
            if (!view)
            {
                var ui = initialSettings.ui;
                var type = initialSettings.type;

                if (!ui)
                {
                    if (!fallbackUI) {
                        fallbackUI = Alpaca.defaultUI;
                    }
                    if (fallbackUI) {
                        ui = fallbackUI;
                    }
                }

                if (ui) {
                    if (!type) {
                        type = fallbackType ? fallbackType : "edit";
                    }

                    Alpaca.logDebug("No view provided but found request for UI: " + ui + " and type: " + type);
                    view = this.lookupNormalizedView(ui, type);
                    if (view) {
                        Alpaca.logDebug("Found view: " + view);
                    } else {
                        Alpaca.logDebug("No view found for UI: " + ui + " and type: " + type);
                    }
                }
            }
            if (!view)
            {
                return Alpaca.throwErrorWithCallback("A view was not specified and could not be automatically determined.", errorCallback);
            }
            else
            {
                if (Alpaca.isString(view))
                {
                    if (!this.normalizedViews[view])
                    {
                        return Alpaca.throwErrorWithCallback("The desired view: " + view + " could not be loaded.  Please make sure it is loaded and not misspelled.", errorCallback);
                    }
                }

                var field = Alpaca.createFieldInstance(el, data, options, schema, view, connector, errorCallback);
                if (field)
                {
                    $(el).addClass("alpaca-field-rendering");
                    $(el).addClass("alpaca-hidden");

                    Alpaca.fieldInstances[field.getId()] = field;
                    field.allFieldInstances = function()
                    {
                        return Alpaca.fieldInstances;
                    };
                    if (Alpaca.isEmpty(callback)) {
                        callback = field.view.render;
                    }
                    if (Alpaca.isEmpty(renderedCallback)) {
                        renderedCallback = field.view.postRender;
                    }

                    var fin = function()
                    {
                        if (!field.parent)
                        {
                            field.getFieldEl().addClass("alpaca-" + self.getNormalizedView(view).type);
                        }
                        if (!field.parent)
                        {
                            field.getFieldEl().addClass("alpaca-top");
                        }
                        $(el).removeClass("alpaca-field-rendering");
                        $(el).removeClass("alpaca-hidden");
                        if (field._oldFieldEl)
                        {
                            $(field._oldFieldEl).remove();
                        }


                        renderedCallback(field);
                    };

                    if (!Alpaca.isEmpty(callback)) {
                        callback(field, function() {
                            fin();
                        });
                    } else {
                        field.render(function() {
                            fin();
                        });
                    }

                    field.callback = callback;
                    field.renderedCallback = renderedCallback;
                }
            }
        },
        createFieldInstance : function(el, data, options, schema, view, connector, errorCallback) {
            if (Alpaca.isValEmpty(options, true)) {
                options = {};
            }
            if (Alpaca.isValEmpty(schema, true)) {
                schema = {};
            }
            if (options && Alpaca.isString(options)) {
                var fieldType = options;
                options = {};
                options.type = fieldType;
            }
            if (!options.type)
            {
                if (!schema.type) {
                    schema.type = Alpaca.getSchemaType(data);
                }
                if (!schema.type) {
                    if (data && Alpaca.isArray(data)) {
                        schema.type = "array";
                    }
                    else {
                        schema.type = "object"; // fallback
                    }
                }
                options.type = Alpaca.guessOptionsType(schema);
            }
            var FieldClass = Alpaca.getFieldClass(options.type);
            if (!FieldClass) {
                errorCallback({
                    "message":"Unable to find field class for type: " + options.type,
                    "reason": "FIELD_INSTANTIATION_ERROR"
                });
                return null;
            }
            return new FieldClass(el, data, options, schema, view, connector, errorCallback);
        },
        parseJSON: function(text)
        {
            if (!text) {
                return null;
            }

            return $.parseJSON(text);
        },
        compile: function(cb, errorCallback)
        {
            var self = this;

            var report = {
                "errors": [],
                "count": 0,
                "successCount": 0
            };

            var finalCallback = function(normalizedViews)
            {

                if (report.errors.length === 0)
                {
                    for (var k in normalizedViews)
                    {
                        self.normalizedViews[k] = normalizedViews[k];
                    }
                }

                cb(report);
            };
            var viewCompileCallback = function(normalizedViews, err, view, cacheKey, totalCalls)
            {
                var viewId = view.id;

                report.count++;
                if (err)
                {
                    report.errors.push({
                        "view": viewId,
                        "cacheKey": cacheKey,
                        "err": err
                    });
                }
                else
                {
                    report.successCount++;
                }

                if (report.count == totalCalls) // jshint ignore:line
                {
                    finalCallback(normalizedViews);
                }
            };

            var compileViewTemplate = function(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls)
            {
                var cacheKey = Alpaca.makeCacheKey(view.id, scopeType, scopeId, templateId);
                var engineType = "text/x-handlebars-template";
                if (template && Alpaca.isObject(template))
                {
                    engineType = template.type;
                    if (template.cacheKey) {
                        cacheKey = template.cacheKey;
                    }

                    template = template.template;
                }
                if (template && typeof(template) === "string")
                {
                    var x = template.toLowerCase();
                    if (Alpaca.isUri(x))
                    {
                    }
                    else if (template && ((template.indexOf("#") === 0) || (template.indexOf(".") === 0)))
                    {
                        var domEl = $(template);

                        engineType = $(domEl).attr("type");
                        template = $(domEl).html();
                    }
                    else if (template)
                    {
                        var existingTemplate = view.templates[template];
                        if (existingTemplate)
                        {
                            template = existingTemplate;
                        }
                    }
                }
                if (!engineType)
                {
                    Alpaca.logError("Engine type was empty");

                    var err = new Error("Engine type was empty");
                    viewCompileCallback(normalizedViews, err, view, cacheKey, totalCalls);

                    return;
                }
                var engine = Alpaca.TemplateEngineRegistry.find(engineType);
                if (!engine)
                {
                    Alpaca.logError("Cannot find template engine for type: " + type);

                    var err = new Error("Cannot find template engine for type: " + type);
                    viewCompileCallback(normalizedViews, err, view, cacheKey, totalCalls);

                    return;
                }
                if (template === true)
                {
                    if (engine.isCached(cacheKey))
                    {
                        viewCompileCallback(normalizedViews, null, view, cacheKey, totalCalls);
                        return;
                    }
                    else
                    {
                        var errString = "View configuration for view: " + view.id + " claims to have precompiled template for cacheKey: " + cacheKey + " but it could not be found";
                        Alpaca.logError(errString);

                        viewCompileCallback(normalizedViews, new Error(errString), view, cacheKey, totalCalls);

                        return;
                    }
                }
                if (engine.isCached(cacheKey))
                {
                    viewCompileCallback(normalizedViews, null, view, cacheKey, totalCalls);
                    return;
                }
                engine.compile(cacheKey, template, function(err) {
                    viewCompileCallback(normalizedViews, err, view, cacheKey, totalCalls);
                });
            };

            var compileTemplates = function(normalizedViews)
            {
                var functionArray = [];
                for (var viewId in normalizedViews)
                {
                    var view = normalizedViews[viewId];
                    if (view.templates)
                    {
                        for (var templateId in view.templates)
                        {
                            var template = view.templates[templateId];

                            functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                                return function(totalCalls) {
                                    compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                                };
                            })(normalizedViews, view, "view", view.id, templateId, template));
                        }
                    }
                    if (view.fields)
                    {
                        for (var path in view.fields)
                        {
                            if (view.fields[path].templates)
                            {
                                for (var templateId in view.fields[path].templates)
                                {
                                    var template = view.fields[path].templates[templateId];

                                    functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                                        return function(totalCalls) {
                                            compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                                        };
                                    })(normalizedViews, view, "field", path, templateId, template));
                                }
                            }
                        }
                    }
                    if (view.layout && view.layout.template)
                    {
                        var template = view.layout.template;

                        functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                            return function(totalCalls) {
                                compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                            };
                        })(normalizedViews, view, "layout", "layout", "layoutTemplate", template));
                    }
                    if (view.globalTemplate)
                    {
                        var template = view.globalTemplate;

                        functionArray.push((function(normalizedViews, view, scopeType, scopeId, templateId, template) {
                            return function(totalCalls) {
                                compileViewTemplate(normalizedViews, view, scopeType, scopeId, templateId, template, totalCalls);
                            };
                        })(normalizedViews, view, "global", "global", "globalTemplate", template));
                    }
                }
                var totalCalls = functionArray.length;
                for (var i = 0; i < functionArray.length; i++)
                {
                    functionArray[i](totalCalls);
                }
            };

            var normalizeViews = function()
            {
                var normalizedViews = {};
                var normalizedViewCount = 0;
                if (!Alpaca.normalizedViews) {
                    Alpaca.normalizedViews = {};
                }
                self.normalizedViews = Alpaca.normalizedViews;
                for (var viewId in self.views)
                {
                    if (!Alpaca.normalizedViews[viewId])
                    {
                        var normalizedView = new Alpaca.NormalizedView(viewId);
                        if (normalizedView.normalize(self.views))
                        {
                            normalizedViews[viewId] = normalizedView;
                            normalizedViewCount++;
                        }
                        else
                        {
                            return Alpaca.throwErrorWithCallback("View normalization failed, cannot initialize Alpaca.  Please check the error logs.", errorCallback);
                        }
                    }
                }

                if (normalizedViewCount > 0)
                {
                    compileTemplates(normalizedViews);
                }
                else
                {
                    finalCallback(normalizedViews);
                }
            };

            normalizeViews();
        },
        getTemplateDescriptor: function(view, templateId, field)
        {
            var descriptor = null;

            var _engineId = null;
            var _cacheKey = null;
            if (view.templates && view.templates[templateId])
            {
                _cacheKey = Alpaca.makeCacheKey(view.id, "view", view.id, templateId);
                var t = view.templates[templateId];
                if (Alpaca.isObject(t) && t.cacheKey)
                {
                    _cacheKey = t.cacheKey;
                }
            }
            if (field && field.path)
            {
                var path = field.path;

                if (view && view.fields)
                {
                    if (path && path.length > 1)
                    {
                        var collectMatches = function(tokens, index, matches)
                        {
                            if (index == tokens.length)
                            {
                                return;
                            }
                            var newTokens = tokens.slice();
                            var toggled = false;
                            var token = tokens[index];
                            var x1 = token.indexOf("[");
                            if (x1 > -1)
                            {
                                token = token.substring(0, x1);
                                toggled = true;
                            }
                            newTokens[index] = token;
                            var _path = newTokens.join("/");

                            if (view.fields[_path] && view.fields[_path].templates && view.fields[_path].templates[templateId])
                            {
                                var _ck = Alpaca.makeCacheKey(view.id, "field", _path, templateId);
                                if (_ck)
                                {
                                    matches.push({
                                        "path": _path,
                                        "cacheKey": _ck
                                    });
                                }
                            }
                            collectMatches(tokens, index + 1, matches);
                            if (toggled) {
                                collectMatches(newTokens, index + 1, matches);
                            }
                        };

                        var tokens = path.split("/");
                        var matches = [];
                        collectMatches(tokens, 0, matches);

                        if (matches.length > 0)
                        {
                            _cacheKey = matches[0].cacheKey;
                        }
                    }
                }
            }
            if (templateId === "globalTemplate" || templateId === "global")
            {
                _cacheKey = Alpaca.makeCacheKey(view.id, "global", "global", "globalTemplate");
            }
            if (templateId === "layoutTemplate" || templateId === "layout")
            {
                _cacheKey = Alpaca.makeCacheKey(view.id, "layout", "layout", "layoutTemplate");
            }

            if (_cacheKey)
            {
                var engineIds = Alpaca.TemplateEngineRegistry.ids();
                for (var i = 0; i < engineIds.length; i++)
                {
                    var engineId = engineIds[i];

                    var engine = Alpaca.TemplateEngineRegistry.find(engineId);
                    if (engine.isCached(_cacheKey))
                    {
                        _engineId = engineId;
                        break;
                    }
                }

                if (_engineId)
                {
                    descriptor = {
                        "engine": _engineId,
                        "cacheKey": _cacheKey
                    };
                }
            }

            return descriptor;
        },
        tmpl: function(templateDescriptor, model)
        {
            var html = Alpaca.tmplHtml(templateDescriptor, model);

            return Alpaca.safeDomParse(html);
        },
        tmplHtml: function(templateDescriptor, model)
        {
            if (!model)
            {
                model = {};
            }

            var engineType = templateDescriptor.engine;

            var engine = Alpaca.TemplateEngineRegistry.find(engineType);
            if (!engine)
            {
                return Alpaca.throwDefaultError("Cannot find template engine for type: " + engineType);
            }
            var cacheKey = templateDescriptor.cacheKey;
            var html = engine.execute(cacheKey, model, function(err) {

                var str = JSON.stringify(err);
                if (err.message) {
                    str = err.message;
                }
                return Alpaca.throwDefaultError("The compiled template: " + cacheKey + " failed to execute: " + str);
            });

            return html;
        }

    });

    Alpaca.DEBUG = 0;
    Alpaca.INFO = 1;
    Alpaca.WARN = 2;
    Alpaca.ERROR = 3;
    Alpaca.logLevel = Alpaca.WARN;

    Alpaca.logDebug = function(obj) {
        Alpaca.log(Alpaca.DEBUG, obj);
    };
    Alpaca.logInfo = function(obj) {
        Alpaca.log(Alpaca.INFO, obj);
    };
    Alpaca.logWarn = function(obj) {
        Alpaca.log(Alpaca.WARN, obj);
    };
    Alpaca.logError = function(obj) {
        Alpaca.log(Alpaca.ERROR, obj);
    };

    Alpaca.LOG_METHOD_MAP = {
        0: 'debug',
        1: 'info',
        2: 'warn',
        3: 'error'
    };

    Alpaca.log = function(level, obj) {

        if (Alpaca.logLevel <= level)
        {
            var method = Alpaca.LOG_METHOD_MAP[level];

            if (typeof console !== 'undefined' && console[method])
            {
                if ("debug" === method) {
                    console.debug(obj);
                }
                else if ("info" === method) {
                    console.info(obj);
                }
                else if ("warn" === method) {
                    console.warn(obj);
                }
                else if ("error" === method) {
                    console.error(obj);
                }
                else {
                    console.log(obj);
                }
            }
        }
    };

    Alpaca.checked = function(el, value)
    {
        return Alpaca.attrProp(el, "checked", value);
    };

    Alpaca.disabled = function(el, value)
    {
        return Alpaca.attrProp(el, "disabled", value);
    };

    Alpaca.attrProp = function(el, name, value)
    {
        if (typeof(value) !== "undefined")
        {
            if ($(el).prop)
            {
                $(el).prop(name, value);
            }
            else
            {
                if (value) {
                    $(el).attr(name, value);
                } else {
                    $(el).removeAttr(name);
                }
            }
        }
        if ($(el).prop) {
            return $(el).prop(name);
        }

        return $(el).attr(name);
    };

    Alpaca.loadRefSchemaOptions = function(topField, referenceId, callback)
    {
        if (!referenceId)
        {
            callback();
        }
        else if (referenceId === "#")
        {
            callback(topField.schema, topField.options);
        }
        else if (referenceId.indexOf("#/") === 0)
        {
            var defId = referenceId.substring(2);
            var tokens = defId.split("/");

            var defSchema = topField.schema;
            for (var i = 0; i < tokens.length; i++)
            {
                var token = tokens[i];
                if (defSchema[token])
                {
                    defSchema = defSchema[token];
                }
                else if (defSchema.properties && defSchema.properties[token])
                {
                    defSchema = defSchema.properties[token];
                }
                else if (defSchema.definitions && defSchema.definitions[token])
                {
                    defSchema = defSchema.definitions[token];
                }
                else
                {
                    defSchema = null;
                    break;
                }
            }

            var defOptions = topField.options;
            for (var i = 0; i < tokens.length; i++)
            {
                var token = tokens[i];
                if (defOptions[token])
                {
                    defOptions = defOptions[token];
                }
                else if (defOptions.fields && defOptions.fields[token])
                {
                    defOptions = defOptions.fields[token];
                }
                else if (defOptions.definitions && defOptions.definitions[token])
                {
                    defOptions = defOptions.definitions[token];
                }
                else
                {
                    defOptions = null;
                    break;
                }
            }

            callback(defSchema, defOptions);
        }
        else if (referenceId.indexOf("#") === 0)
        {
            var resolution = Alpaca.resolveReference(topField.schema, topField.options, referenceId);
            if (resolution)
            {
                callback(resolution.schema, resolution.options);
            }
            else
            {
                callback();
            }
        }
        else
        {

            var referenceParts = Alpaca.pathParts(referenceId);

            topField.connector.loadReferenceSchema(referenceParts.path, function(schema) {
                topField.connector.loadReferenceOptions(referenceParts.path, function(options) {

                    if (referenceParts.id)
                    {
                        var resolution = Alpaca.resolveReference(schema, options, referenceParts.id);
                        if (resolution)
                        {
                            schema = resolution.schema;
                            options = resolution.options;
                        }
                    }

                    callback(schema, options);

                }, function() {
                    callback(schema);
                });
            }, function() {
                callback();
            });
        }
    };

    Alpaca.DEFAULT_ERROR_CALLBACK = function(error)
    {
        if (error && error.message)
        {
            Alpaca.logError(JSON.stringify(error));
            throw new Error("Alpaca caught an error with the default error handler: " + JSON.stringify(error));

        }
    };
    Alpaca.defaultErrorCallback = Alpaca.DEFAULT_ERROR_CALLBACK;
    Alpaca.throwDefaultError = function(message)
    {
        if (message && Alpaca.isObject(message))
        {
            message = JSON.stringify(message);
        }

        var err = {
            "message": message
        };

        Alpaca.defaultErrorCallback(err);
    };
    Alpaca.throwErrorWithCallback = function(message, errorCallback)
    {
        if (message && Alpaca.isObject(message))
        {
            message = JSON.stringify(message);
        }

        var err = {
            "message": message
        };

        if (errorCallback)
        {
            errorCallback(err);
        }
        else
        {
            Alpaca.defaultErrorCallback(err);
        }
    };
    Alpaca.resolveReference = function(schema, options, referenceId)
    {
        if ((schema.id === referenceId) || (("#" + schema.id) === referenceId)) // jshint ignore:line
        {
            var result = {};
            if (schema) {
                result.schema = schema;
            }
            if (options) {
                result.options = options;
            }

            return result;
        }
        else
        {
            if (schema.properties)
            {
                for (var propertyId in schema.properties)
                {
                    var subSchema = schema.properties[propertyId];
                    var subOptions = null;
                    if (options && options.fields && options.fields[propertyId])
                    {
                        subOptions = options.fields[propertyId];
                    }

                    var x = Alpaca.resolveReference(subSchema, subOptions, referenceId);
                    if (x)
                    {
                        return x;
                    }
                }
            }
            else if (schema.items)
            {
                var subSchema = schema.items;
                var subOptions = null;
                if (options && options.items)
                {
                    subOptions = options.items;
                }

                var x = Alpaca.resolveReference(subSchema, subOptions, referenceId);
                if (x)
                {
                    return x;
                }
            }
        }

        return null;
    };

    $.alpaca = window.Alpaca = Alpaca;
    $.fn.alpaca = function() {
        var args = Alpaca.makeArray(arguments);
        var newArgs = [].concat(this, args);
        var ret = Alpaca.apply(this, newArgs);
        if (typeof(ret) === "undefined") {
            ret = $(this);
        }

        return ret;
    };
    $.fn.outerHTML = function(nocloning) {
        if (nocloning) {
            return $("<div></div>").append(this).html();
        } else {
            return $("<div></div>").append(this.clone()).html();
        }
    };
    $.fn.swapWith = function(to) {
        return this.each(function() {
            var copy_to = $(to).clone();
            var copy_from = $(this).clone();
            $(to).replaceWith(copy_from);
            $(this).replaceWith(copy_to);
        });
    };

    $.fn.attrProp = function(name, value) {
        return Alpaca.attrProp($(this), name, value);
    };
    $.event.special.destroyed = {
        remove: function(o) {
            if (o.handler) {
                o.handler();
            }
        }
    };

    Alpaca.pathParts = function(resource)
    {
        if (typeof(resource) !== "string")
        {
            return resource;
        }
        var resourcePath = resource;
        var resourceId = null;
        var i = resourcePath.indexOf("#");
        if (i > -1)
        {
            resourceId = resourcePath.substring(i + 1);
            resourcePath = resourcePath.substring(0, i);
        }

        if (Alpaca.endsWith(resourcePath, "/")) {
            resourcePath = resourcePath.substring(0, resourcePath.length - 1);
        }

        var parts = {};
        parts.path = resourcePath;

        if (resourceId)
        {
            parts.id = resourceId;
        }

        return parts;
    };
    Alpaca.resolveField = function(containerField, propertyIdOrReferenceId)
    {
        var resolvedField = null;

        if (typeof(propertyIdOrReferenceId) === "string")
        {
            if (propertyIdOrReferenceId.indexOf("#/") === 0 && propertyId.length > 2)
            {
            }
            else if (propertyIdOrReferenceId === "#" || propertyIdOrReferenceId === "#/")
            {
                resolvedField = containerField;
            }
            else if (propertyIdOrReferenceId.indexOf("#") === 0)
            {
                var topField = containerField;
                while (topField.parent)
                {
                    topField = topField.parent;
                }

                var referenceId = propertyIdOrReferenceId.substring(1);

                resolvedField = Alpaca.resolveFieldByReference(topField, referenceId);

            }
            else
            {
                resolvedField = containerField.childrenByPropertyId[propertyIdOrReferenceId];
            }
        }

        return resolvedField;
    };
    Alpaca.resolveFieldByReference = function(field, referenceId)
    {
        if (field.schema && field.schema.id == referenceId) // jshint ignore:line
        {
            return field;
        }
        else
        {
            if (field.children && field.children.length > 0)
            {
                for (var i = 0; i < field.children.length; i++)
                {
                    var child = field.children[i];

                    var resolved = Alpaca.resolveFieldByReference(child, referenceId);
                    if (resolved)
                    {
                        return resolved;
                    }
                }
            }
        }

        return null;
    };
    Alpaca.anyEquality = function(first, second)
    {
        var values = {};
        if (typeof(first) === "object" || Alpaca.isArray(first))
        {
            for (var k in first)
            {
                values[first[k]] = true;
            }
        }
        else
        {
            values[first] = true;
        }

        var result = false;
        if (typeof(second) === "object" || Alpaca.isArray(second))
        {
            for (var k in second)
            {
                var v = second[k];

                if (values[v])
                {
                    result = true;
                    break;
                }
            }
        }
        else
        {
            result = values[second];
        }

        return result;
    };

    Alpaca.series = function(funcs, callback)
    {
        async.series(funcs, function() {
            callback();
        });
    };

    Alpaca.parallel = function(funcs, callback)
    {
        async.parallel(funcs, function() {
            callback();
        });
    };

    Alpaca.nextTick = function(f)
    {
        async.nextTick(function() {
            f();
        });
    };
    Alpaca.compileValidationContext = function(field, callback)
    {
        var chain = [];
        var parent = field;
        do
        {
            if (!parent.isValidationParticipant())
            {
                parent = null;
            }

            if (parent)
            {
                chain.push(parent);
            }

            if (parent)
            {
                parent = parent.parent;
            }
        }
        while (parent);
        chain.reverse();
        var context = [];
        var f = function(chain, context, done)
        {
            if (!chain || chain.length === 0)
            {
                return done();
            }

            var current = chain[0];

            var entry = {};
            entry.id = current.getId();
            entry.field = current;
            entry.path = current.path;
            var beforeStatus = current.isValid();
            if (current.isContainer())
            {
                beforeStatus = current.isValid(true);
            }

            entry.before = beforeStatus;

            var ourselvesHandler = function(current, entry, weFinished)
            {
                var previouslyValidated = current._previouslyValidated;
                current.validate();
                current._validateCustomValidator(function() {
                    var afterStatus = current.isValid();
                    if (current.isContainer())
                    {
                        afterStatus = current.isValid(true);
                    }

                    entry.after = afterStatus;
                    entry.validated = false;
                    entry.invalidated = false;
                    if (!beforeStatus && afterStatus)
                    {
                        entry.validated = true;
                    }
                    else if (beforeStatus && !afterStatus)
                    {
                        entry.invalidated = true;
                    }
                    else if (!previouslyValidated && !afterStatus)
                    {
                        entry.invalidated = true;
                    }

                    entry.container = current.isContainer();
                    entry.valid = entry.after;

                    context.push(entry);

                    weFinished();
                });
            };
            if (chain.length > 1)
            {
                var childChain = chain.slice(0);
                childChain.shift();
                f(childChain, context, function() {
                    ourselvesHandler(current, entry, function() {
                        done();
                    });
                });
            }
            else
            {
                ourselvesHandler(current, entry, function() {
                    done();
                })
            }
        };

        f(chain, context, function() {
            callback(context);
        });
    };

    Alpaca.updateValidationStateForContext = function(view, context)
    {
        for (var i = 0; i < context.length; i++)
        {
            var entry = context[i];
            var field = entry.field;
            field.getFieldEl().removeClass("alpaca-invalid alpaca-invalid-hidden alpaca-valid");
            field.fireCallback("clearValidity");
            if (entry.valid)
            {
                field.getFieldEl().addClass("alpaca-field-valid");
                field.fireCallback("valid");
            }
            else
            {
                if (!field.options.readonly || Alpaca.showReadOnlyInvalidState)
                {
                    var hidden = false;
                    if (field.hideInitValidationError) {
                        hidden = true;
                    }

                    field.fireCallback("invalid", hidden);

                    field.getFieldEl().addClass("alpaca-invalid");
                    if (hidden)
                    {
                        field.getFieldEl().addClass("alpaca-invalid-hidden");
                    }
                }
                else
                {
                    Alpaca.logWarn("The field (id=" + field.getId() + ", title=" + field.getTitle() + ", path=" + field.path + ") is invalid and also read-only");
                }
            }
            if (entry.validated)
            {
                Alpaca.later(25, this, function() {
                    field.trigger("validated");
                });
            }
            else if (entry.invalidated)
            {
                Alpaca.later(25, this, function() {
                    field.trigger("invalidated");
                });
            }
            if (field.options.showMessages)
            {
                if (!field.initializing)
                {
                    if (!field.options.readonly || Alpaca.showReadOnlyInvalidState)
                    {
                        var messages = [];
                        for (var messageId in field.validation)
                        {
                            if (!field.validation[messageId]["status"])
                            {
                                messages.push({
                                    "id": messageId,
                                    "message": field.validation[messageId]["message"]
                                });
                            }
                        }

                        field.displayMessage(messages, field.valid);
                    }
                }
            }
        }
    };
    Alpaca.fieldApplyFieldAndChildren = function(field, fn)
    {
        fn(field);
        if (field.children && field.children.length > 0)
        {
            for (var i = 0; i < field.children.length; i++)
            {
                Alpaca.fieldApplyFieldAndChildren(field.children[i], fn);
            }
        }
    };
    Alpaca.replaceAll = function(text, find, replace)
    {
        return text.replace(new RegExp(find, 'g'), replace);
    };

    Alpaca.asArray = function(thing)
    {
        if (!Alpaca.isArray(thing))
        {
            var array = [];
            array.push(thing);

            return array;
        }

        return thing;
    };
    (function () {

        var async = {};
        var root, previous_async;

        root = this;
        if (root != null) {
            previous_async = root.async;
        }

        async.noConflict = function () {
            root.async = previous_async;
            return async;
        };

        function only_once(fn) {
            var called = false;
            return function() {
                if (called) {
                    throw new Error("Callback was already called.");
                }
                called = true;
                fn.apply(root, arguments);
            };
        }

        var _each = function (arr, iterator) {
            if (arr.forEach) {
                return arr.forEach(iterator);
            }
            for (var i = 0; i < arr.length; i += 1) {
                iterator(arr[i], i, arr);
            }
        };

        var _map = function (arr, iterator) {
            if (arr.map) {
                return arr.map(iterator);
            }
            var results = [];
            _each(arr, function (x, i, a) {
                results.push(iterator(x, i, a));
            });
            return results;
        };

        var _reduce = function (arr, iterator, memo) {
            if (arr.reduce) {
                return arr.reduce(iterator, memo);
            }
            _each(arr, function (x, i, a) {
                memo = iterator(memo, x, i, a);
            });
            return memo;
        };

        var _keys = function (obj) {
            if (Object.keys) {
                return Object.keys(obj);
            }
            var keys = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    keys.push(k);
                }
            }
            return keys;
        };
        if (typeof process === 'undefined' || !(process.nextTick)) {
            if (typeof setImmediate === 'function') {
                async.nextTick = function (fn) {
                    setImmediate(fn);
                };
                async.setImmediate = async.nextTick;
            }
            else {
                async.nextTick = function (fn) {
                    setTimeout(fn, 0); // jshint ignore:line
                };
                async.setImmediate = async.nextTick;
            }
        }
        else {
            async.nextTick = process.nextTick;
            if (typeof setImmediate !== 'undefined') {
                async.setImmediate = function (fn) {
                    setImmediate(fn);
                };
            }
            else {
                async.setImmediate = async.nextTick;
            }
        }

        async.each = function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length) {
                return callback();
            }
            var completed = 0;
            _each(arr, function (x) {
                iterator(x, only_once(function (err) {
                    if (err) {
                        callback(err);
                        callback = function () {};
                    }
                    else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        }
                    }
                }));
            });
        };
        async.forEach = async.each;

        async.eachSeries = function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length) {
                return callback();
            }
            var completed = 0;
            var iterate = function () {
                iterator(arr[completed], function (err) {
                    if (err) {
                        callback(err);
                        callback = function () {};
                    }
                    else {
                        completed += 1;
                        if (completed >= arr.length) {
                            callback(null);
                        }
                        else {
                            iterate();
                        }
                    }
                });
            };
            iterate();
        };
        async.forEachSeries = async.eachSeries;

        async.eachLimit = function (arr, limit, iterator, callback) {
            var fn = _eachLimit(limit);
            fn.apply(null, [arr, iterator, callback]);
        };
        async.forEachLimit = async.eachLimit;

        var _eachLimit = function (limit) {

            return function (arr, iterator, callback) {
                callback = callback || function () {};
                if (!arr.length || limit <= 0) {
                    return callback();
                }
                var completed = 0;
                var started = 0;
                var running = 0;

                (function replenish () {
                    if (completed >= arr.length) {
                        return callback();
                    }

                    while (running < limit && started < arr.length) {
                        started += 1;
                        running += 1;
                        iterator(arr[started - 1], function (err) {
                            if (err) {
                                callback(err);
                                callback = function () {};
                            }
                            else {
                                completed += 1;
                                running -= 1;
                                if (completed >= arr.length) {
                                    callback();
                                }
                                else {
                                    replenish();
                                }
                            }
                        });
                    }
                })();
            };
        };


        var doParallel = function (fn) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(null, [async.each].concat(args));
            };
        };
        var doParallelLimit = function(limit, fn) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(null, [_eachLimit(limit)].concat(args));
            };
        };
        var doSeries = function (fn) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(null, [async.eachSeries].concat(args));
            };
        };


        var _asyncMap = function (eachfn, arr, iterator, callback) {
            var results = [];
            arr = _map(arr, function (x, i) {
                return {index: i, value: x};
            });
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        };
        async.map = doParallel(_asyncMap);
        async.mapSeries = doSeries(_asyncMap);
        async.mapLimit = function (arr, limit, iterator, callback) {
            return _mapLimit(limit)(arr, iterator, callback);
        };

        var _mapLimit = function(limit) {
            return doParallelLimit(limit, _asyncMap);
        };
        async.reduce = function (arr, memo, iterator, callback) {
            async.eachSeries(arr, function (x, callback) {
                iterator(memo, x, function (err, v) {
                    memo = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, memo);
            });
        };
        async.inject = async.reduce;
        async.foldl = async.reduce;

        async.reduceRight = function (arr, memo, iterator, callback) {
            var reversed = _map(arr, function (x) {
                return x;
            }).reverse();
            async.reduce(reversed, memo, iterator, callback);
        };
        async.foldr = async.reduceRight;

        var _filter = function (eachfn, arr, iterator, callback) {
            var results = [];
            arr = _map(arr, function (x, i) {
                return {index: i, value: x};
            });
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (v) {
                    if (v) {
                        results.push(x);
                    }
                    callback();
                });
            }, function (err) {
                callback(_map(results.sort(function (a, b) {
                    return a.index - b.index;
                }), function (x) {
                    return x.value;
                }));
            });
        };
        async.filter = doParallel(_filter);
        async.filterSeries = doSeries(_filter);
        async.select = async.filter;
        async.selectSeries = async.filterSeries;

        var _reject = function (eachfn, arr, iterator, callback) {
            var results = [];
            arr = _map(arr, function (x, i) {
                return {index: i, value: x};
            });
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (v) {
                    if (!v) {
                        results.push(x);
                    }
                    callback();
                });
            }, function (err) {
                callback(_map(results.sort(function (a, b) {
                    return a.index - b.index;
                }), function (x) {
                    return x.value;
                }));
            });
        };
        async.reject = doParallel(_reject);
        async.rejectSeries = doSeries(_reject);

        var _detect = function (eachfn, arr, iterator, main_callback) {
            eachfn(arr, function (x, callback) {
                iterator(x, function (result) {
                    if (result) {
                        main_callback(x);
                        main_callback = function () {};
                    }
                    else {
                        callback();
                    }
                });
            }, function (err) {
                main_callback();
            });
        };
        async.detect = doParallel(_detect);
        async.detectSeries = doSeries(_detect);

        async.some = function (arr, iterator, main_callback) {
            async.each(arr, function (x, callback) {
                iterator(x, function (v) {
                    if (v) {
                        main_callback(true);
                        main_callback = function () {};
                    }
                    callback();
                });
            }, function (err) {
                main_callback(false);
            });
        };
        async.any = async.some;

        async.every = function (arr, iterator, main_callback) {
            async.each(arr, function (x, callback) {
                iterator(x, function (v) {
                    if (!v) {
                        main_callback(false);
                        main_callback = function () {};
                    }
                    callback();
                });
            }, function (err) {
                main_callback(true);
            });
        };
        async.all = async.every;

        async.sortBy = function (arr, iterator, callback) {
            async.map(arr, function (x, callback) {
                iterator(x, function (err, criteria) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, {value: x, criteria: criteria});
                    }
                });
            }, function (err, results) {
                if (err) {
                    return callback(err);
                }
                else {
                    var fn = function (left, right) {
                        var a = left.criteria, b = right.criteria;
                        return a < b ? -1 : a > b ? 1 : 0;
                    };
                    callback(null, _map(results.sort(fn), function (x) {
                        return x.value;
                    }));
                }
            });
        };

        async.auto = function (tasks, callback) {
            callback = callback || function () {};
            var keys = _keys(tasks);
            if (!keys.length) {
                return callback(null);
            }

            var results = {};

            var listeners = [];
            var addListener = function (fn) {
                listeners.unshift(fn);
            };
            var removeListener = function (fn) {
                for (var i = 0; i < listeners.length; i += 1) {
                    if (listeners[i] === fn) {
                        listeners.splice(i, 1);
                        return;
                    }
                }
            };
            var taskComplete = function () {
                _each(listeners.slice(0), function (fn) {
                    fn();
                });
            };

            addListener(function () {
                if (_keys(results).length === keys.length) {
                    callback(null, results);
                    callback = function () {};
                }
            });

            _each(keys, function (k) {
                var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
                var taskCallback = function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    if (err) {
                        var safeResults = {};
                        _each(_keys(results), function(rkey) {
                            safeResults[rkey] = results[rkey];
                        });
                        safeResults[k] = args;
                        callback(err, safeResults);
                        callback = function () {};
                    }
                    else {
                        results[k] = args;
                        async.setImmediate(taskComplete);
                    }
                };
                var requires = task.slice(0, Math.abs(task.length - 1)) || [];
                var ready = function () {
                    return _reduce(requires, function (a, x) {
                        return (a && results.hasOwnProperty(x));
                    }, true) && !results.hasOwnProperty(k);
                };
                if (ready()) {
                    task[task.length - 1](taskCallback, results);
                }
                else {
                    var listener = function () {
                        if (ready()) {
                            removeListener(listener);
                            task[task.length - 1](taskCallback, results);
                        }
                    };
                    addListener(listener);
                }
            });
        };

        async.waterfall = function (tasks, callback) {
            callback = callback || function () {};
            if (tasks.constructor !== Array) {
                var err = new Error('First argument to waterfall must be an array of functions');
                return callback(err);
            }
            if (!tasks.length) {
                return callback();
            }
            var wrapIterator = function (iterator) {
                return function (err) {
                    if (err) {
                        callback.apply(null, arguments);
                        callback = function () {};
                    }
                    else {
                        var args = Array.prototype.slice.call(arguments, 1);
                        var next = iterator.next();
                        if (next) {
                            args.push(wrapIterator(next));
                        }
                        else {
                            args.push(callback);
                        }
                        async.setImmediate(function () {
                            iterator.apply(null, args);
                        });
                    }
                };
            };
            wrapIterator(async.iterator(tasks))();
        };

        var _parallel = function(eachfn, tasks, callback) {
            callback = callback || function () {};
            if (tasks.constructor === Array) {
                eachfn.map(tasks, function (fn, callback) {
                    if (fn) {
                        fn(function (err) {
                            var args = Array.prototype.slice.call(arguments, 1);
                            if (args.length <= 1) {
                                args = args[0];
                            }
                            callback.call(null, err, args);
                        });
                    }
                }, callback);
            }
            else {
                var results = {};
                eachfn.each(_keys(tasks), function (k, callback) {
                    tasks[k](function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        results[k] = args;
                        callback(err);
                    });
                }, function (err) {
                    callback(err, results);
                });
            }
        };

        async.parallel = function (tasks, callback) {
            _parallel({ map: async.map, each: async.each }, tasks, callback);
        };

        async.parallelLimit = function(tasks, limit, callback) {
            _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
        };

        async.series = function (tasks, callback) {
            callback = callback || function () {};
            if (tasks.constructor === Array) {
                async.mapSeries(tasks, function (fn, callback) {
                    if (fn) {
                        fn(function (err) {
                            var args = Array.prototype.slice.call(arguments, 1);
                            if (args.length <= 1) {
                                args = args[0];
                            }
                            callback.call(null, err, args);
                        });
                    }
                }, callback);
            }
            else {
                var results = {};
                async.eachSeries(_keys(tasks), function (k, callback) {
                    tasks[k](function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        results[k] = args;
                        callback(err);
                    });
                }, function (err) {
                    callback(err, results);
                });
            }
        };

        async.iterator = function (tasks) {
            var makeCallback = function (index) {
                var fn = function () {
                    if (tasks.length) {
                        tasks[index].apply(null, arguments);
                    }
                    return fn.next();
                };
                fn.next = function () {
                    return (index < tasks.length - 1) ? makeCallback(index + 1): null;
                };
                return fn;
            };
            return makeCallback(0);
        };

        async.apply = function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            return function () {
                return fn.apply(
                    null, args.concat(Array.prototype.slice.call(arguments))
                );
            };
        };

        var _concat = function (eachfn, arr, fn, callback) {
            var r = [];
            eachfn(arr, function (x, cb) {
                fn(x, function (err, y) {
                    r = r.concat(y || []);
                    cb(err);
                });
            }, function (err) {
                callback(err, r);
            });
        };
        async.concat = doParallel(_concat);
        async.concatSeries = doSeries(_concat);

        async.whilst = function (test, iterator, callback) {
            if (test()) {
                iterator(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    async.whilst(test, iterator, callback);
                });
            }
            else {
                callback();
            }
        };

        async.doWhilst = function (iterator, test, callback) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (test()) {
                    async.doWhilst(iterator, test, callback);
                }
                else {
                    callback();
                }
            });
        };

        async.until = function (test, iterator, callback) {
            if (!test()) {
                iterator(function (err) {
                    if (err) {
                        return callback(err);
                    }
                    async.until(test, iterator, callback);
                });
            }
            else {
                callback();
            }
        };

        async.doUntil = function (iterator, test, callback) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                if (!test()) {
                    async.doUntil(iterator, test, callback);
                }
                else {
                    callback();
                }
            });
        };

        async.queue = function (worker, concurrency) {
            if (concurrency === undefined) {
                concurrency = 1;
            }
            function _insert(q, data, pos, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    var item = {
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    };

                    if (pos) {
                        q.tasks.unshift(item);
                    } else {
                        q.tasks.push(item);
                    }

                    if (q.saturated && q.tasks.length === concurrency) {
                        q.saturated();
                    }
                    async.setImmediate(q.process);
                });
            }

            var workers = 0;
            var q = {
                tasks: [],
                concurrency: concurrency,
                saturated: null,
                empty: null,
                drain: null,
                push: function (data, callback) {
                    _insert(q, data, false, callback);
                },
                unshift: function (data, callback) {
                    _insert(q, data, true, callback);
                },
                process: function () {
                    if (workers < q.concurrency && q.tasks.length) {
                        var task = q.tasks.shift();
                        if (q.empty && q.tasks.length === 0) {
                            q.empty();
                        }
                        workers += 1;
                        var next = function () {
                            workers -= 1;
                            if (task.callback) {
                                task.callback.apply(task, arguments);
                            }
                            if (q.drain && q.tasks.length + workers === 0) {
                                q.drain();
                            }
                            q.process();
                        };
                        var cb = only_once(next);
                        worker(task.data, cb);
                    }
                },
                length: function () {
                    return q.tasks.length;
                },
                running: function () {
                    return workers;
                }
            };
            return q;
        };

        async.cargo = function (worker, payload) {
            var working     = false,
                tasks       = [];

            var cargo = {
                tasks: tasks,
                payload: payload,
                saturated: null,
                empty: null,
                drain: null,
                push: function (data, callback) {
                    if(data.constructor !== Array) {
                        data = [data];
                    }
                    _each(data, function(task) {
                        tasks.push({
                            data: task,
                            callback: typeof callback === 'function' ? callback : null
                        });
                        if (cargo.saturated && tasks.length === payload) {
                            cargo.saturated();
                        }
                    });
                    async.setImmediate(cargo.process);
                },
                process: function process() {
                    if (working) {
                        return;
                    }
                    if (tasks.length === 0) {
                        if(cargo.drain) {
                            cargo.drain();
                        }
                        return;
                    }

                    var ts = typeof payload === 'number' ?
                        tasks.splice(0, payload) :
                        tasks.splice(0);

                    var ds = _map(ts, function (task) {
                        return task.data;
                    });

                    if(cargo.empty) {
                        cargo.empty();
                    }
                    working = true;
                    worker(ds, function () {
                        working = false;

                        var args = arguments;
                        _each(ts, function (data) {
                            if (data.callback) {
                                data.callback.apply(null, args);
                            }
                        });

                        process();
                    });
                },
                length: function () {
                    return tasks.length;
                },
                running: function () {
                    return working;
                }
            };
            return cargo;
        };
        var _console_fn = function (name) {
            return function (fn) {
                var args = Array.prototype.slice.call(arguments, 1);
                fn.apply(null, args.concat([function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (typeof console !== 'undefined') {
                        if (err) {
                            if (console.error) {
                                console.error(err);
                            }
                        }
                        else if (console[name]) {
                            _each(args, function (x) {
                                console[name](x);
                            });
                        }
                    }
                }]));
            };
        };

        async.log = _console_fn('log');
        async.dir = _console_fn('dir');

        async.memoize = function (fn, hasher) {
            var memo = {};
            var queues = {};
            hasher = hasher || function (x) {
                return x;
            };
            var memoized = function () {
                var args = Array.prototype.slice.call(arguments);
                var callback = args.pop();
                var key = hasher.apply(null, args);
                if (key in memo) {
                    callback.apply(null, memo[key]);
                }
                else if (key in queues) {
                    queues[key].push(callback);
                }
                else {
                    queues[key] = [callback];
                    fn.apply(null, args.concat([function () {
                        memo[key] = arguments;
                        var q = queues[key];
                        delete queues[key];
                        for (var i = 0, l = q.length; i < l; i++) {
                            q[i].apply(null, arguments);
                        }
                    }]));
                }
            };
            memoized.memo = memo;
            memoized.unmemoized = fn;
            return memoized;
        };

        async.unmemoize = function (fn) {
            return function () {
                return (fn.unmemoized || fn).apply(null, arguments);
            };
        };

        async.times = function (count, iterator, callback) {
            var counter = [];
            for (var i = 0; i < count; i++) {
                counter.push(i);
            }
            return async.map(counter, iterator, callback);
        };

        async.timesSeries = function (count, iterator, callback) {
            var counter = [];
            for (var i = 0; i < count; i++) {
                counter.push(i);
            }
            return async.mapSeries(counter, iterator, callback);
        };

        async.compose = function (/* functions... */) {
            var fns = Array.prototype.reverse.call(arguments);
            return function () {
                var that = this;
                var args = Array.prototype.slice.call(arguments);
                var callback = args.pop();
                async.reduce(fns, args, function (newargs, fn, cb) {
                        fn.apply(that, newargs.concat([function () {
                            var err = arguments[0];
                            var nextargs = Array.prototype.slice.call(arguments, 1);
                            cb(err, nextargs);
                        }]));
                    },
                    function (err, results) {
                        callback.apply(that, [err].concat(results));
                    });
            };
        };

        var _applyEach = function (eachfn, fns /*args...*/) {
            var go = function () {
                var that = this;
                var args = Array.prototype.slice.call(arguments);
                var callback = args.pop();
                return eachfn(fns, function (fn, cb) {
                        fn.apply(that, args.concat([cb]));
                    },
                    callback);
            };
            if (arguments.length > 2) {
                var args = Array.prototype.slice.call(arguments, 2);
                return go.apply(this, args);
            }
            else {
                return go;
            }
        };
        async.applyEach = doParallel(_applyEach);
        async.applyEachSeries = doSeries(_applyEach);

        async.forever = function (fn, callback) {
            function next(err) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    }
                    throw err;
                }
                fn(next);
            }
            next();
        };

        root.async = async;
        function hoozit(o) {
            if (o.constructor === String) {
                return "string";

            } else if (o.constructor === Boolean) {
                return "boolean";

            } else if (o.constructor === Number) {

                if (isNaN(o)) {
                    return "nan";
                } else {
                    return "number";
                }

            } else if (typeof o === "undefined") {
                return "undefined";
            } else if (o === null) {
                return "null";
            } else if (o instanceof Array) {
                return "array";
            } else if (o instanceof Date) {
                return "date";
            } else if (o instanceof RegExp) {
                return "regexp";

            } else if (typeof o === "object") {
                return "object";

            } else if (o instanceof Function) {
                return "function";
            } else {
                return undefined;
            }
        }
        function bindCallbacks(o, callbacks, args) {
            var prop = hoozit(o);
            if (prop) {
                if (hoozit(callbacks[prop]) === "function") {
                    return callbacks[prop].apply(callbacks, args);
                } else {
                    return callbacks[prop]; // or undefined
                }
            }
        }
        var equiv = root.equiv = function ()
        {
            var innerEquiv; // the real equiv function
            var callers = []; // stack to decide between skip/abort functions

            var callbacks = function () {
                function useStrictEquality(b, a) {
                    if (b instanceof a.constructor || a instanceof b.constructor) {
                        return a == b;
                    } else {
                        return a === b;
                    }
                }

                return {
                    "string": useStrictEquality,
                    "boolean": useStrictEquality,
                    "number": useStrictEquality,
                    "null": useStrictEquality,
                    "undefined": useStrictEquality,

                    "nan": function (b) {
                        return isNaN(b);
                    },

                    "date": function (b, a) {
                        return hoozit(b) === "date" && a.valueOf() === b.valueOf();
                    },

                    "regexp": function (b, a) {
                        return hoozit(b) === "regexp" &&
                            a.source === b.source && // the regex itself
                            a.global === b.global && // and its modifers (gmi) ...
                            a.ignoreCase === b.ignoreCase &&
                            a.multiline === b.multiline;
                    },
                    "function": function () {
                        var caller = callers[callers.length - 1];
                        return caller !== Object &&
                            typeof caller !== "undefined";
                    },

                    "array": function (b, a) {
                        var i;
                        var len;
                        if ( ! (hoozit(b) === "array")) {
                            return false;
                        }

                        len = a.length;
                        if (len !== b.length) { // safe and faster
                            return false;
                        }
                        for (i = 0; i < len; i++) {
                            if( ! innerEquiv(a[i], b[i])) {
                                return false;
                            }
                        }
                        return true;
                    },

                    "object": function (b, a) {
                        var i;
                        var eq = true; // unless we can proove it
                        var aProperties = [], bProperties = []; // collection of strings
                        if ( a.constructor !== b.constructor) {
                            return false;
                        }
                        callers.push(a.constructor);

                        for (i in a) { // be strict: don't ensures hasOwnProperty and go deep

                            aProperties.push(i); // collect a's properties

                            if ( ! innerEquiv(a[i], b[i])) {
                                eq = false;
                            }
                        }

                        callers.pop(); // unstack, we are done

                        for (i in b) {
                            bProperties.push(i); // collect b's properties
                        }
                        return eq && innerEquiv(aProperties.sort(), bProperties.sort());
                    }
                };
            }();

            innerEquiv = function () { // can take multiple arguments
                var args = Array.prototype.slice.apply(arguments);
                if (args.length < 2) {
                    return true; // end transition
                }

                return (function (a, b) {
                    if (a === b) {
                        return true; // catch the most you can
                    } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || hoozit(a) !== hoozit(b)) {
                        return false; // don't lose time with error prone cases
                    } else {
                        return bindCallbacks(a, callbacks, [b, a]);
                    }
                })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length -1));
            };

            return innerEquiv;

        }();

    }());

    Alpaca.MARKER_CLASS_CONTROL_FIELD = "alpaca-marker-control-field";
    Alpaca.MARKER_CLASS_CONTAINER_FIELD = "alpaca-marker-container-field";
    Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM = "alpaca-marker-control-field-item";
    Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY = "data-alpaca-container-field-item-key";
    Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD = "alpaca-marker-form-items-field";
    Alpaca.CLASS_CONTAINER = "alpaca-container";
    Alpaca.CLASS_CONTROL = "alpaca-control";
    Alpaca.MARKER_CLASS_INSERT = "alpaca-marker-insert";
    Alpaca.MARKER_DATA_INSERT_KEY = "data-alpaca-marker-insert-key";
    Alpaca.MARKER_CLASS_ARRAY_TOOLBAR = "alpaca-marker-array-field-toolbar";
    Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID = "data-alpaca-array-field-toolbar-field-id";
    Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR = "alpaca-marker-array-field-item-actionbar";
    Alpaca.MARKER_DATA_ARRAY_ITEM_KEY = "data-alpaca-marker-array-field-item-key";
    Alpaca.MARKER_DATA_ARRAY_ITEM_PARENT_FIELD_ID = "data-alpaca-marker-array-field-item-parent-field-id";
    Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD = "alpaca-marker-container-field-item-field";

    Alpaca.makeCacheKey = function(viewId, scopeType, scopeId, templateId)
    {
        return viewId + ":" + scopeType + ":" + scopeId + ":" + templateId;
    };
    Alpaca.splitCacheKey = function(cacheKey)
    {
        var parts = {};

        var x = cacheKey.indexOf(":");
        var y = cacheKey.lastIndexOf(":");

        parts.viewId = cacheKey.substring(0, x);
        parts.templateId = cacheKey.substring(y + 1);

        var scopeIdentifier = cacheKey.substring(x + 1, y);

        var z = scopeIdentifier.indexOf(":");

        parts.scopeType = scopeIdentifier.substring(0, z);
        parts.scopeId = scopeIdentifier.substring(z+1);

        return parts;
    };
    Alpaca.createEmptyDataInstance = function(schema)
    {
        if (!schema) {
            return "";
        }

        if (schema.type === "object") {
            return {};
        }

        if (schema.type === "array") {
            return [];
        }

        if (schema.type === "number") {
            return -1;
        }

        if (schema.type === "boolean") {
            return false;
        }

        return "";
    };
    Alpaca.animatedSwap = function(source, target, duration, callback)
    {
        if (typeof(duration) === "function") {
            callback = duration;
            duration = 500;
        }

        var _animate = function(a, b, duration, callback)
        {
            var from = $(a),
                dest = $(b),
                from_pos = from.offset(),
                dest_pos = dest.offset(),
                from_clone = from.clone(),
                dest_clone = dest.clone(),
                total_route_vertical   = dest_pos.top + dest.height() - from_pos.top,
                route_from_vertical    = 0,
                route_dest_vertical    = 0,
                total_route_horizontal = dest_pos.left + dest.width() - from_pos.left,
                route_from_horizontal  = 0,
                route_dest_horizontal  = 0;

            from.css("opacity", 0);
            dest.css("opacity", 0);

            from_clone.insertAfter(from).css({position: "absolute", width: from.outerWidth(), height: from.outerHeight()}).offset(from_pos).css("z-index", "999");
            dest_clone.insertAfter(dest).css({position: "absolute", width: dest.outerWidth(), height: dest.outerHeight()}).offset(dest_pos).css("z-index", "999");

            if(from_pos.top !== dest_pos.top) {
                route_from_vertical = total_route_vertical - from.height();
            }
            route_dest_vertical = total_route_vertical - dest.height();
            if(from_pos.left !== dest_pos.left) {
                route_from_horizontal = total_route_horizontal - from.width();
            }
            route_dest_horizontal = total_route_horizontal - dest.width();

            from_clone.animate({
                top: "+=" + route_from_vertical + "px",
                left: "+=" + route_from_horizontal + "px"
            }, duration, function(){
                dest.css("opacity", 1);
                $(this).remove();
            });

            dest_clone.animate({
                top: "-=" + route_dest_vertical + "px",
                left: "-=" + route_dest_horizontal + "px"
            }, duration, function(){
                from.css("opacity", 1);
                $(this).remove();
            });

            window.setTimeout(function() {
                from_clone.remove();
                dest_clone.remove();
                callback();
            }, duration + 1);
        };

        _animate(source, target, duration, callback);
    };
    Alpaca.animatedMove = function(source, target, duration, callback)
    {
        if (typeof(duration) === "function") {
            callback = duration;
            duration = 500;
        }

        var _animate = function(a, b, duration, callback)
        {
            var from = $(a),
                dest = $(b),
                from_pos = from.offset(),
                dest_pos = dest.offset(),
                from_clone = from.clone(),
                total_route_vertical   = dest_pos.top + dest.height() - from_pos.top,
                route_from_vertical    = 0,
                route_dest_vertical    = 0,
                total_route_horizontal = dest_pos.left + dest.width() - from_pos.left,
                route_from_horizontal  = 0,
                route_dest_horizontal  = 0;

            from.css("opacity", 0);
            dest.css("opacity", 0);

            from_clone.insertAfter(from).css({position: "absolute", width: from.outerWidth(), height: from.outerHeight()}).offset(from_pos).css("z-index", "999");

            if(from_pos.top !== dest_pos.top) {
                route_from_vertical = total_route_vertical - from.height();
            }
            route_dest_vertical = total_route_vertical - dest.height();
            if(from_pos.left !== dest_pos.left) {
                route_from_horizontal = total_route_horizontal - from.width();
            }
            route_dest_horizontal = total_route_horizontal - dest.width();

            from_clone.animate({
                top: "+=" + route_from_vertical + "px",
                left: "+=" + route_from_horizontal + "px"
            }, duration, function(){
                dest.css("opacity", 1);
                $(this).remove();
            });

            window.setTimeout(function() {
                from_clone.remove();
                callback();
            }, duration + 1);
        };

        _animate(source, target, duration, callback);
    };


    Alpaca.fireReady = function(_field)
    {
        if (_field.children && _field.children.length > 0)
        {
            for (var g = 0; g < _field.children.length; g++)
            {
                Alpaca.fireReady(_field.children[g]);
            }
        }

        _field.trigger("ready");
    };

    Alpaca.readCookie = function(name)
    {
        function _readCookie(name)
        {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++)
            {
                var c = ca[i];
                while (c.charAt(0)==' ')
                {
                    c = c.substring(1,c.length);
                }

                if (c.indexOf(nameEQ) == 0)
                {
                    return c.substring(nameEQ.length,c.length);
                }
            }
            return null;
        }

        var value = null;

        if (typeof(document) !== "undefined")
        {
            value = _readCookie(name);
        }

        return value;
    };

    Alpaca.safeSetObjectArray = function(baseObject, propertyName, values) {

        if (typeof(baseObject[propertyName]) === "undefined" || baseObject[propertyName] === null)
        {
            baseObject[propertyName] = [];
        }
        else
        {
            baseObject[propertyName].length = 0;
        }

        for (var i = 0; i < values.length; i++)
        {
            baseObject[propertyName].push(values[i]);
        }
    };

    Alpaca.moment = function() {

        if (!Alpaca._moment) {
            if (window.moment) {
                Alpaca._moment = window.moment;
            }
        }

        if (!Alpaca._moment) {
            throw new Error("The moment.js library has not been included, cannot produce moment object");
        }

        return Alpaca._moment.call(this, arguments);
    }

    Alpaca.CSRF_TOKEN = null;
    Alpaca.CSRF_COOKIE_NAMES = ["CSRF-TOKEN", "XSRF-TOKEN"];
    Alpaca.CSRF_HEADER_NAME = "X-CSRF-TOKEN";
    Alpaca.defaultToolbarSticky = undefined;
    Alpaca.showReadOnlyInvalidState = false;

})(jQuery);
    Alpaca.subscribe = function()
    {
        var args = Alpaca.makeArray(arguments);

        var scope = null;
        var id = null;
        var listener = null;

        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            listener = args.shift();
        }
        else
        {
            scope = args.shift();
            id = args.shift();
            listener = args.shift();
        }
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable subscribe id: " + id);
            return null;
        }
        var listenerId = listener._lfid;
        if (!listenerId) {
            listenerId = Alpaca.listenerId();
            listener._lfid = listenerId;
        }
        var func = function(that) {
            return function() {
                return listener.apply(that, arguments);
            };
        }(this);
        func._lfid = listener._lfid;

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);
        observable.subscribe(listenerId, func);

        return {
            "scope": scope,
            "id": id,
            "listenerId": listenerId
        };
    };
    Alpaca.unsubscribe = function()
    {
        var args = Alpaca.makeArray(arguments);

        var scope = null;
        var id = null;
        var listenerOrId = null;

        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            listenerOrId = args.shift();
        }
        else if (args.length == 3)
        {
            scope = args.shift();
            id = args.shift();
            listenerOrId = args.shift();
        }

        var listenerId = listenerOrId;
        if (Alpaca.isFunction(listenerId))
        {
            listenerId = listenerId._lfid;
        }
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + id);
            return null;
        }

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);
        observable.unsubscribe(listenerId);

        return {
            "scope": scope,
            "id": id,
            "listenerId": listenerId
        };
    };
    Alpaca.observable = function()
    {
        var scope;
        var id;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 1)
        {
            scope = "global";
            id = args.shift();
        }
        else if (args.length == 2)
        {
            scope = args.shift();
            id = args.shift();
        }
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }
        else
        {
            var observables = Alpaca.ScopedObservables.get(scope);
            observable = observables.observable(id);
        }

        return observable;
    };

    Alpaca.clearObservable = function()
    {
        var scope;
        var id;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 1)
        {
            scope = "global";
            id = args.shift();
        }
        else if (args.length == 2)
        {
            scope = args.shift();
            id = args.shift();
        }
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }

        var observables = Alpaca.ScopedObservables.get(scope);
        var observable = observables.observable(id);

        observable.clear();
    };
    Alpaca.dependentObservable = function()
    {
        var scope = null;
        var id = null;
        var func = null;

        var args = Alpaca.makeArray(arguments);
        if (args.length == 2)
        {
            scope = "global";
            id = args.shift();
            func = args.shift();
        }
        else if (args.length == 3)
        {
            scope = args.shift();
            id = args.shift();
            func = args.shift();
        }
        else
        {
            Alpaca.error("Wrong number of arguments");
            return;
        }
        if (id && Alpaca.isObject(id))
        {
            id = id.path;
        }

        if (!id)
        {
            Alpaca.logError("Missing observable id: " + JSON.stringify(args));
        }

        var observables = Alpaca.ScopedObservables.get(scope);

        return observables.dependentObservable(id, func);
    };

})(jQuery);
(function($)
{
    var Alpaca = $.alpaca;
    Alpaca.Observables = Base.extend(
    {
        constructor: function(scope)
        {
            this.base();

            this.scope = scope;

            this.observables = {};
        },

        observable: function(id, initialValue)
        {
            if (!this.observables[id])
            {
                var observable = new Alpaca.Observable(this.scope, id);

                if (initialValue)
                {
                    observable.set(initialValue);
                }

                this.observables[id] = observable;
            }
            return this.observables[id];
        },

        dependentObservable: function(id, func)
        {
            var _this = this;

            if (!this.observables[id])
            {
                var observable = this.observable(id);
                var m = new Alpaca.Observables(this.scope);
                m.observable = function(x, y)
                {
                    var o = _this.observable(x, y);
                    o.markDependentOnUs(observable);

                    return o;
                };
                var valueFunction = function() {
                    return func.call(m);
                };

                observable.setValueFunction(valueFunction);
            }

            return this.observables[id];
        },

        observables: function()
        {
            return this.observables;
        }

    });

})(jQuery);
(function($)
{
    var Alpaca = $.alpaca;

    Alpaca.Observable = Base.extend(
    {
        constructor: function(scope, id)
        {
            var _this = this;

            this.base();

            this.id = scope + "-" + id;

            this.value = null;
            this.subscribers = {};
            this.dependentOnUs = {};

            this.notifySubscribers = function(prior)
            {
                var _this = this;

                $.each(this.subscribers, function(id, handler) {
                    handler(_this.value, prior);
                });
            };

            this.notifyDependents = function(prior)
            {
                $.each(this.dependentOnUs, function(key, observer) {
                    observer.onDependencyChange();
                });
            };
            this.valueFunction = null;
        },

        setValueFunction: function(valueFunction)
        {
            this.valueFunction = valueFunction;
            this.onDependencyChange();
        },
        subscribe: function(id, handler)
        {
            if (!this.isSubscribed(id))
            {
                this.subscribers[id] = handler;
            }
        },

        unsubscribe: function(id)
        {
            delete this.subscribers[id];
        },

        isSubscribed: function(id)
        {
            return (this.subscribers[id] ? true: false);
        },

        markDependentOnUs: function(observable)
        {
            this.dependentOnUs[observable.id] = observable;
        },
        onDependencyChange: function()
        {
            var prior = this.get();
            if (this.valueFunction)
            {
                var current = this.valueFunction();
                if (prior != current)
                {
                    this.set(current);
                }
            }
        },

        set: function(value)
        {
            var prior = this.value;
            this.value = value;
            this.notifyDependents(prior);
            this.notifySubscribers(prior);
        },

        get: function(_default)
        {
            var v = this.value;
            if (!v)
            {
                v = _default;
            }
            return v;
        },

        clear: function()
        {
            var prior = this.value;
            delete this.value;
            this.notifyDependents(prior);
            this.notifySubscribers(prior);
        }

    });

})(jQuery);
(function($)
{
    var Alpaca = $.alpaca;

    Alpaca.ScopedObservables = {};
    Alpaca.ScopedObservables.map = {};

    Alpaca.ScopedObservables.get = function(scope)
    {
        if (!Alpaca.ScopedObservables.map[scope])
        {
            Alpaca.ScopedObservables.map[scope] = new Alpaca.Observables(scope);
        }

        return Alpaca.ScopedObservables.map[scope];
    };

})(jQuery);

(function()
{
    Alpaca.TemplateEngineRegistry = (function() {

        var registry = {};

        return {

            register: function(id, engine)
            {
                registry[id] = engine;

                engine.init();
            },

            find: function(idOrType)
            {
                var engine = null;

                if (registry[idOrType])
                {
                    engine = registry[idOrType];
                }
                else
                {
                    for (var id in registry)
                    {
                        var supportedMimetypes = registry[id].supportedMimetypes();
                        for (var i = 0; i < supportedMimetypes.length; i++)
                        {
                            if (idOrType.toLowerCase() === supportedMimetypes[i].toLowerCase())
                            {
                                engine = registry[id];
                                break;
                            }
                        }
                    }
                }

                return engine;
            },

            ids: function()
            {
                var ids = [];

                for (var id in registry)
                {
                    ids.push(id);
                }

                return ids;
            }
        };
    })();

})();

(function($)
{
    Alpaca.AbstractTemplateEngine = Base.extend(
    {
        constructor: function(id)
        {
            this.base();

            this.id = id;

            this.cleanup = function(html)
            {
                if (html)
                {
                    if ($(html).length === 1)
                    {
                        if ($(html)[0].nodeName.toLowerCase() === "script")
                        {
                            return $(html).html();

                        }
                    }
                }

                return html;
            };
        },
        compile: function(cacheKey, template, callback)
        {
            var self = this;
            var type = "html";
            if (Alpaca.isString(template))
            {
                var lc = template.toLowerCase();
                if (Alpaca.isUri(lc))
                {
                    type = "uri";
                }
                else if (template.indexOf("#") === 0 || template.indexOf(".") === 0 || template.indexOf("[") === 0)
                {
                    type = "selector";
                }
            }
            else
            {
            }
            if (type === "selector")
            {
                self._compile(cacheKey, template, function(err) {
                    callback(err);
                });
            }
            else if (type === "uri")
            {
                var fileExtension = self.fileExtension();

                var url = template;
                if (url.indexOf("." + fileExtension) === -1) {
                    url += "." + fileExtension;
                }
                $.ajax({
                    "url": url,
                    "dataType": "html",
                    "success": function(html, code, xhr)
                    {
                        html = self.cleanup(html);

                        self._compile(cacheKey, html, function(err) {
                            callback(err);
                        });
                    },
                    "error": function(xhr, code)
                    {
                        callback({
                            "message": xhr.responseText,
                            "xhr": xhr,
                            "code": code
                        }, null);
                    }
                });
            }
            else if (type === "html")
            {
                var html = template;
                if (html instanceof jQuery)
                {
                    html = $(html).outerHTML();
                }

                self._compile(cacheKey, html, function(err) {
                    callback(err);
                });
            }
            else
            {
                callback(new Error("Template engine cannot determine how to handle type: " + type));
            }
        },

        _compile: function(cacheKey, html, callback)
        {
            if (Alpaca.isEmpty(html)) {
                html = "";
            }
            html = Alpaca.trim(html);

            if (html.toLowerCase().indexOf("<script") === 0)
            {
            }
            else
            {
                html = "<script type='" + this.supportedMimetypes()[0] + "'>" + html + "</script>";
            }

            Alpaca.logDebug("Compiling template: " + this.id + ", cacheKey: " + cacheKey + ", template: " + html);

            this.doCompile(cacheKey, html, callback);
        },
        doCompile: function(cacheKey, html, callback)
        {

        },
        execute: function(cacheKey, model, errorCallback)
        {
            Alpaca.logDebug("Executing template for cache key: " + cacheKey);

            var html = this.doExecute(cacheKey, model, errorCallback);
            html = this.cleanup(html);

            return html;
        },
        doExecute: function(cacheKey, model, errorCallback)
        {
            return null;
        },
        fileExtension: function() {
            return "html";
        },
        supportedMimetypes: function()
        {
            return [];
        },
        isCached: function(cacheKey)
        {
            return false;
        },
        findCacheKeys: function(viewId)
        {
            return [];
        }

    });

})(jQuery);

(function($, Handlebars, HandlebarsPrecompiled)
{
    var COMPILED_TEMPLATES = {};

    var helpers = {};
    helpers["compare"] = function(lvalue, rvalue, options)
    {
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        var operator = options.hash.operator || "==";

        var operators = {
            '==':       function(l,r) { return l == r; }, // jshint ignore:line
            '===':      function(l,r) { return l === r; },
            '!=':       function(l,r) { return l != r; }, // jshint ignore:line
            '!==':      function(l,r) { return l !== r; },
            '<':        function(l,r) { return l < r; },
            '>':        function(l,r) { return l > r; },
            '<=':       function(l,r) { return l <= r; },
            '>=':       function(l,r) { return l >= r; },
            'typeof':   function(l,r) { return typeof l == r; } // jshint ignore:line
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
        }

        var result = operators[operator](lvalue,rvalue);

        if( result ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    };
    helpers["ifnot"] = function(value, options)
    {
        if (!value)
        {
            return options.fn(this);
        }
        else
        {
            return options.inverse(this);
        }
    };
    helpers["times"] = function(n, block) {
        var accum = '';
        for(var i = 0; i < n; ++i)
        {
            accum += block.fn(i);
        }
        return accum;
    };
    helpers["control"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_CONTROL_FIELD + "'></div>";
    };
    helpers["container"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD + "'></div>";
    };
    helpers["item"] = function(tag, options)
    {
        if (Alpaca.isObject(tag))
        {
            options = tag;
            tag = "div";
        }

        return "<" + tag + " class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM + "' " + Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY + "='" + this.name + "'></" + tag + ">";
    };
    helpers["itemField"] = function(tag, options)
    {
        if (Alpaca.isObject(tag))
        {
            options = tag;
            tag = "div";
        }

        return "<" + tag + " class='" + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD + "'></" + tag + ">";
    };
    helpers["formItems"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD + "'></div>";
    };
    helpers["insert"] = function(key)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_INSERT + "' " + Alpaca.MARKER_DATA_INSERT_KEY + "='" + key + "'></div>";
    };
    helpers["str"] = function(data)
    {
        if (data === false)
        {
            return "false";
        }
        else if (data === true)
        {
            return "true";
        }
        else if (data === 0)
        {
            return "0";
        }
        else if (typeof(data) == "undefined")
        {
            return "";
        }
        else if (data === null)
        {
            return "";
        }
        else if (Alpaca.isString(data))
        {
            return data;
        }
        else if (Alpaca.isNumber(data))
        {
            return data;
        }
        else if (Alpaca.isObject(data))
        {
            return JSON.stringify(data, null, "  ");
        }
        else if (Alpaca.isArray(data))
        {
            return JSON.stringify(data, null, "  ");
        }

        return data;
    };
    helpers["arrayToolbar"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_ARRAY_TOOLBAR + "' " + Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID + "='" + this.id + "'></div>";
    };
    helpers["arrayActionbar"] = function(options)
    {
        return "<div class='" + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR + "' " + Alpaca.MARKER_DATA_ARRAY_ITEM_KEY + "='" + this.name + "' " + Alpaca.MARKER_DATA_ARRAY_ITEM_PARENT_FIELD_ID + "='" + this.parentFieldId + "'></div>";
    };
    Handlebars.registerHelper("arrayToolbar", helpers["arrayToolbar"]);
    Handlebars.registerHelper("arrayActionbar", helpers["arrayActionbar"]);

    Handlebars.registerHelper("setIndex", function(value){
        this.index = Number(value);
    });

    Handlebars.registerHelper("eachProperty", function(context, options) {
        var ret = "";
        for(var prop in context)
        {
            ret = ret + options.fn({key:prop,value:context[prop]});
        }
        return ret;
    });


    Handlebars.registerHelper("uploadErrorMessage", function(error) {

        var message = error;

        if (error === 1)
        {
            message = "File exceeds upload_max_filesize";
        }
        else if (error === 2)
        {
            message = "File exceeds MAX_FILE_SIZE";
        }
        else if (error === 3)
        {
            message = "File was only partially uploaded";
        }
        else if (error === 4)
        {
            message = "No File was uploaded";
        }
        else if (error === 5)
        {
            message = "Missing a temporary folder";
        }
        else if (error === 6)
        {
            message = "Failed to write file to disk";
        }
        else if (error === 7)
        {
            message = "File upload stopped by extension";
        }
        else if (error === "maxFileSize")
        {
            message = "File is too big";
        }
        else if (error === "minFileSize")
        {
            message = "File is too small";
        }
        else if (error === "acceptFileTypes")
        {
            message = "Filetype not allowed";
        }
        else if (error === "maxNumberOfFiles")
        {
            message = "Max number of files exceeded";
        }
        else if (error === "uploadedBytes")
        {
            message = "Uploaded bytes exceed file size";
        }
        else if (error === "emptyResult")
        {
            message = "Empty file upload result";
        }

        return message;
    });

    Handlebars.registerHelper("disguise", function(text, character) {

        var replaced = "";
        for (var i = 0; i < text.length; i++) {
            replaced += character;
        }

        return replaced;

    });
    Handlebars.registerHelper("compare", helpers["compare"]);
    Handlebars.registerHelper("control", helpers["control"]);
    Handlebars.registerHelper("container", helpers["container"]);
    Handlebars.registerHelper("item", helpers["item"]);
    Handlebars.registerHelper("itemField", helpers["itemField"]);
    Handlebars.registerHelper("formItems", helpers["formItems"]);
    Handlebars.registerHelper("times", helpers["times"]);
    Handlebars.registerHelper("str", helpers["str"]);
    Handlebars.registerHelper('with', function(context, options) {
        return options.fn(context);
    });
    Handlebars.registerHelper("ifnot", helpers["ifnot"]);

    var partials = {};

    Alpaca.HandlebarsTemplateEngine = Alpaca.AbstractTemplateEngine.extend(
    {
        fileExtension: function() {
            return "html";
        },

        supportedMimetypes: function()
        {
            return [
                "text/x-handlebars-template",
                "text/x-handlebars-tmpl"
            ];
        },

        init: function()
        {
            if (HandlebarsPrecompiled)
            {
                for (var viewId in HandlebarsPrecompiled)
                {
                    var viewTemplates = HandlebarsPrecompiled[viewId];
                    for (var templateId in viewTemplates)
                    {
                        var template = viewTemplates[templateId];
                        if (typeof(template) === "function")
                        {
                            var cacheKey = Alpaca.makeCacheKey(viewId, "view", viewId, templateId);
                            COMPILED_TEMPLATES[cacheKey] = template;
                        }
                    }
                }
            }
        },

        doCompile: function(cacheKey, html, callback)
        {
            var self = this;

            var template = null;
            try
            {
                var functionString = Handlebars.precompile(html);
                template = eval("(" + functionString + ")"); // jshint ignore:line
                template = Handlebars.template(template);
                COMPILED_TEMPLATES[cacheKey] = template;
            }
            catch (e)
            {
                callback(e);
                return;
            }

            callback();
        },

        doExecute: function(cacheKey, model, errorCallback)
        {
            var self = this;
            var templateFunction = COMPILED_TEMPLATES[cacheKey];
            if (!templateFunction)
            {
                errorCallback(new Error("Could not find handlebars cached template for key: " + cacheKey));
                return;
            }
            var html = null;
            try
            {
                html = templateFunction(model);
            }
            catch (e)
            {
                errorCallback(e);
                return null;
            }

            return html;
        },

        isCached: function(cacheKey)
        {
            return (COMPILED_TEMPLATES[cacheKey] ? true  : false);
        },

        findCacheKeys: function(viewId)
        {
            var cacheKeys = [];

            for (var cacheKey in COMPILED_TEMPLATES)
            {
                if (cacheKey.indexOf(viewId + ":") === 0)
                {
                    cacheKeys.push(cacheKey);
                }
            }

            return cacheKeys;
        }

    });
    Alpaca.TemplateEngineRegistry.register("handlebars", new Alpaca.HandlebarsTemplateEngine("handlebars"));

})(jQuery, ((typeof(Handlebars) != "undefined") ? Handlebars : window.Handlebars), ((typeof(HandlebarsPrecompiled) != "undefined") ? HandlebarsPrecompiled : window.HandlebarsPrecompiled));

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.NormalizedView = Base.extend(
    {
        constructor: function(viewId) {
            this.id = viewId;
        },
        normalize: function(views)
        {
            var viewObject  = views[this.id];
            if (!viewObject)
            {
                Alpaca.logError("View compilation failed - view not found: " + this.id);
                return false;
            }
            var chain = [];
            var current = viewObject;
            while (current) {
                chain.push(current);

                var parentId = current.parent;
                if (parentId) {
                    var parent = views[current.parent];
                    if (!parent) {
                        Alpaca.logError("View compilation failed - cannot find parent view: " + parentId + " for view: " + current.id);
                        return false;
                    }
                    current = parent;
                }
                else
                {
                    current = null;
                }
            }
            chain = chain.reverse();

            var setScalar = function(target, source, propertyId)
            {
                var value = source[propertyId];

                var currentValue = target[propertyId];
                if (!Alpaca.isUndefined(currentValue) && !Alpaca.isUndefined(value))
                {
                    Alpaca.logDebug("View property: " + propertyId + " already has value: " + currentValue + " and overwriting to: " + value);
                }

                if (!Alpaca.isUndefined(value)) {
                    target[propertyId] = value;
                }
            };

            var setFunction = function(target, source, propertyId)
            {
                var value = source[propertyId];

                var currentValue = target[propertyId];
                if (!Alpaca.isUndefined(currentValue) && !Alpaca.isUndefined(value))
                {
                    Alpaca.logDebug("View property: " + propertyId + " already has function, overwriting");
                }

                if (!Alpaca.isUndefined(value)) {
                    target[propertyId] = value;
                }
            };

            var mergeMap = function(target, source, propertyId)
            {
                var sourceMap = source[propertyId];
                if (sourceMap)
                {
                    if (!target[propertyId])
                    {
                        target[propertyId] = {};
                    }

                    Alpaca.mergeObject2(sourceMap, target[propertyId]);
                }
            };
            for (var i = 0; i < chain.length; i++)
            {
                var element = chain[i];
                setScalar(this, element, "type"); // view, edit, create
                setScalar(this, element, "ui"); // bootstrap, jqueryui, jquerymobile, web
                setScalar(this, element, "displayReadonly");
                setScalar(this, element, "locale");
                setFunction(this, element, "render");
                setFunction(this, element, "postRender");
                mergeMap(this, element, "templates");
                mergeMap(this, element, "fields");
                mergeMap(this, element, "layout");
                mergeMap(this, element, "styles");
                mergeMap(this, element, "callbacks");
                mergeMap(this, element, "messages");
                setScalar(this, element, "horizontal");
                setScalar(this, element, "collapsible");
                setScalar(this, element, "legendStyle");
                setScalar(this, element, "toolbarStyle");
                setScalar(this, element, "buttonStyle");
                setScalar(this, element, "toolbarSticky");
                setScalar(this, element, "globalTemplate");
                mergeMap(this, element, "wizard");
            }

            Alpaca.logDebug("View compilation complete for view: " + this.id);
            Alpaca.logDebug("Final view: ");
            Alpaca.logDebug(JSON.stringify(this, null, "   "));

            return true;
        }
    });
})(jQuery);
    {
        constructor: function(viewId, field) {
            this.field = field;
            this.setView(viewId);
        },
        setView: function (viewId)
        {
            if (!viewId)
            {
                viewId =  "web-edit";
            }
            var normalizedView = Alpaca.getNormalizedView(viewId);
            if (!normalizedView)
            {
                throw new Error("Runtime view for view id: " + viewId + " could not find a normalized view");
            }
            for (var k in normalizedView)
            {
                if (normalizedView.hasOwnProperty(k)) {
                    this[k] = normalizedView[k];
                }
            }
        },
        getWizard : function () {
            return this.getViewParam("wizard");
        },
        getGlobalTemplateDescriptor : function ()
        {
            return this.getTemplateDescriptor("globalTemplate");
        },
        getLayout: function ()
        {
            var self = this;

            return {
                "templateDescriptor": this.getTemplateDescriptor("layoutTemplate", self),
                "bindings": this.getViewParam(["layout","bindings"], true)
            };
        },
        getTemplateDescriptor: function(templateId, field)
        {
            return Alpaca.getTemplateDescriptor(this, templateId, field);
        },
        getMessage : function (messageId, locale)
        {
            if (!locale) {
                locale = Alpaca.defaultLocale;
            }

            var messageForLocale = this.getViewParam(["messages", locale, messageId]);
            if (Alpaca.isEmpty(messageForLocale)) {
                messageForLocale = this.getViewParam(["messages", messageId]);
            }

            return messageForLocale;
        },
        getViewParam: function (configId, topLevelOnly) {

            var self = this;
            var fieldPath = this.field.path;
            if (this.fields && this.fields[fieldPath]) {
                var configVal = this._getConfigVal(this.fields[fieldPath], configId);
                if (!Alpaca.isEmpty(configVal)) {
                    return configVal;
                }
            }
            if (fieldPath && fieldPath.indexOf('[') !== -1 && fieldPath.indexOf(']') !== -1) {
                var newFieldPath = fieldPath.replace(/\[\d+\]/g,"[*]");
                if (this.fields && this.fields[newFieldPath]) {
                    var configVal = this._getConfigVal(this.fields[newFieldPath], configId);
                    if (!Alpaca.isEmpty(configVal)) {
                        return configVal;
                    }
                }
            }
            if (fieldPath && fieldPath.indexOf('[') !== -1 && fieldPath.indexOf(']') !== -1) {
                var newFieldPath = fieldPath.replace(/\[\d+\]/g,"");
                if (this.fields && this.fields[newFieldPath]) {
                    var configVal = this._getConfigVal(this.fields[newFieldPath], configId);
                    if (!Alpaca.isEmpty(configVal)) {
                        return configVal;
                    }
                }
            }

            if (!Alpaca.isEmpty(topLevelOnly) && topLevelOnly && this.field.path !== "/") {
                return null;
            }

            return this._getConfigVal(this, configId);
        },
        _getConfigVal : function (configVal, configId) {
            if (Alpaca.isArray(configId)) {
                for (var i = 0; i < configId.length && !Alpaca.isEmpty(configVal); i++) {
                    configVal = configVal[configId[i]];
                }
            } else {
                if (!Alpaca.isEmpty(configVal)) {
                    configVal = configVal[configId];
                }
            }
            return configVal;
        },

        fireCallback: function(field, id, arg1, arg2, arg3, arg4, arg5)
        {
            var self = this;

            if (this.callbacks && this.callbacks[id])
            {
                this.callbacks[id].call(field, arg1, arg2, arg3, arg4, arg5);
            }
        },

        applyStyle: function(id, fieldOrEl)
        {
            var el = fieldOrEl;
            if (el && el.getFieldEl) {
                el = el.getFieldEl();
            }

            if (el)
            {
                if (this.styles && this.styles[id])
                {
                    $(el).addClass(this.styles[id]);
                }
            }
        },

        getStyle: function(id)
        {
            return this.styles[id] ? this.styles[id] : "";
        }


    });
})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Field = Base.extend(
    {
        constructor: function(domEl, data, options, schema, viewId, connector, errorCallback) {

            var self = this;
            this.initializing = true;
            this.domEl = domEl;
            this.parent = null;
            this.data = data;
            this.options = options;
            this.schema = schema;
            this.connector = connector;
            this.errorCallback = function(err)
            {
                if (errorCallback)
                {
                    errorCallback(err);
                }
                else
                {
                    Alpaca.defaultErrorCallback.call(self, err);
                }
            };
            this.singleLevelRendering = false;
            this.view = new Alpaca.RuntimeView(viewId, this);
            var noOptions = false;
            if (!this.options) {
                this.options = {};
                noOptions = true;
            }
            this.id = this.options.id;
            this.type = this.options.type;
            if (!this.id) {
                this.id = Alpaca.generateId();
            }
            var noSchema = false;
            if (!this.schema) {
                this.schema = {};
                noSchema = true;
            }
            if (!this.options.label && this.schema.title !== null) {
                this.options.label = this.schema.title;
            }
            if (!this.options.helpers) {
                this.options.helpers = [];
            }
            if (this.options.helper) {
                if (!Alpaca.isArray(this.options.helper)) {
                    this.options.helpers.push(this.options.helper);
                } else {
                    for (var i = 0; i < this.options.helper.length; i++) {
                        this.options.helpers.push(this.options.helper[i]);
                    }
                }
                delete this.options.helper;
            }

            if (Alpaca.isEmpty(this.options.readonly) && !Alpaca.isEmpty(this.schema.readonly)) {
                this.options.readonly = this.schema.readonly;
            }
            if (Alpaca.isValEmpty(this.data) && !Alpaca.isEmpty(this.schema["default"])) {
                this.data = this.schema["default"];
                this.showingDefaultData = true;
            }
            this.path = "/";
            this.validation = {};
            this._events = {};
            this.isDisplayOnly = function()
            {
                return (self.view.type === "view" || self.view.type == "display");
            };
            if (this.schema && this.schema.id && this.schema.id.indexOf("#") === 0)
            {
                this.schema.id = this.schema.id.substring(1);
            }
            this._previouslyValidated = false;

            this.updateObservable = function()
            {
                if (this.data)
                {
                    this.observable(this.path).set(this.data);
                }
                else
                {
                    this.observable(this.path).clear();
                }
            };

            this.getObservableScope = function()
            {
                var top = this;
                while (!top.isTop()) {
                    top = top.parent;
                }

                var observableScope = top.observableScope;
                if (!observableScope)
                {
                    observableScope = "global";
                }

                return observableScope;
            };

            this.ensureProperType = function(val)
            {
                var self = this;

                var _ensure = function(v, type)
                {
                    if (Alpaca.isString(v))
                    {
                        if (type === "number")
                        {
                            v = parseFloat(v);
                        }
                        else if (type === "integer")
                        {
                            v = parseInt(v);
                        }
                        else if (type === "boolean")
                        {
                            if (v === "" || v.toLowerCase() === "false")
                            {
                                v = false;
                            }
                            else
                            {
                                v = true;
                            }
                        }
                    }
                    else if (Alpaca.isNumber(v))
                    {
                        if (type === "string")
                        {
                            v = "" + v;
                        }
                        else if (type === "boolean")
                        {
                            if (v === -1 || v === 0)
                            {
                                v = false;
                            }
                            else {
                                v = true;
                            }
                        }
                    }

                    return v;
                };

                if (typeof(val) !== "undefined")
                {
                    if (Alpaca.isArray(val))
                    {
                        for (var i = 0; i < val.length; i++)
                        {
                            if (self.schema.items && self.schema.items.type)
                            {
                                val[i] = _ensure(val[i], self.schema.items.type);
                            }
                        }
                    }
                    else if (Alpaca.isString(val) || Alpaca.isNumber(val))
                    {
                        if (self.schema.type)
                        {
                            val = _ensure(val, self.schema.type);
                        }
                    }
                }

                return val;
            };

            this.onConstruct();
        },

        onConstruct: function()
        {

        },

        isTop: function()
        {
            return !this.parent;
        },
        getTemplateDescriptorId : function () {
            throw new Error("Template descriptor ID was not specified");
        },
        initTemplateDescriptor: function()
        {
            var self = this;

            var viewTemplateDescriptor = this.view.getTemplateDescriptor(this.getTemplateDescriptorId(), this);
            var globalTemplateDescriptor = this.view.getGlobalTemplateDescriptor();
            var layout = this.view.getLayout();
            var trip = false;
            if (this.isTop())
            {
                if (globalTemplateDescriptor)
                {
                    this.setTemplateDescriptor(globalTemplateDescriptor);
                    this.singleLevelRendering = true;
                    trip = true;
                }
                else if (layout && layout.templateDescriptor)
                {
                    this.setTemplateDescriptor(layout.templateDescriptor);
                    trip = true;
                }
            }

            if (!trip && viewTemplateDescriptor)
            {
                this.setTemplateDescriptor(viewTemplateDescriptor);
            }
            var t = this.getTemplateDescriptor();
            if (!t)
            {
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for field: " + self.getFieldType());
            }
        },
        setup: function() {

            if (!this.initializing)
            {
                this.data = this.getValue();
            }
            this.initTemplateDescriptor();
            if (Alpaca.isUndefined(this.schema.required)) {
                this.schema.required = false;
            }
            if (Alpaca.isUndefined(this.options.validate)) {
                this.options.validate = true;
            }
            if (Alpaca.isUndefined(this.options.disabled)) {
                this.options.disabled = false;
            }
            if (Alpaca.isUndefined(this.options.showMessages)) {
                this.options.showMessages = true;
            }
        },
        on: function(name, fn)
        {
            Alpaca.logDebug("Adding listener for event: " + name);

            if (!this._events[name]) {
                this._events[name] = [];
            }

            this._events[name].push(fn);
            return this;
        },
        off: function(name)
        {
            if (this._events[name]) {
                this._events[name].length = 0;
            }
        },
        triggerWithPropagation: function(name, event, direction)
        {
            if (typeof(event) === "string") {
                direction = event;
                event = null;
            }

            if (!direction) {
                direction = "up";
            }

            if (direction === "up")
            {
                this.trigger.call(this, name, event);
                if (this.parent)
                {
                    this.parent.triggerWithPropagation.call(this.parent, name, event, direction);
                }
            }
            else if (direction === "down")
            {
                if (this.children && this.children.length > 0)
                {
                    for (var i = 0; i < this.children.length; i++)
                    {
                        var child = this.children[i];

                        child.triggerWithPropagation.call(child, name, event, direction);
                    }
                }
                this.trigger.call(this, name, event);
            }
            else if (direction === "both")
            {
                if (this.children && this.children.length > 0)
                {
                    for (var i = 0; i < this.children.length; i++)
                    {
                        var child = this.children[i];

                        child.triggerWithPropagation.call(child, name, event, "down");
                    }
                }
                this.trigger.call(this, name, event);
                if (this.parent)
                {
                    this.parent.triggerWithPropagation.call(this.parent, name, event, "up");
                }
            }
        },
        trigger: function(name, event, arg1, arg2, arg3)
        {

            var handlers = this._events[name];
            if (handlers)
            {
                for (var i = 0; i < handlers.length; i++)
                {
                    var handler = handlers[i];

                    var ret = null;
                    if (typeof(handler) === "function")
                    {
                        Alpaca.logDebug("Firing event: " + name);
                        try
                        {
                            ret = handler.call(this, event, arg1, arg2, arg3);
                        }
                        catch (e)
                        {
                            Alpaca.logDebug("The event handler caught an exception: " + name);
                            Alpaca.logDebug(e);
                        }
                    }
                }
            }
        },
        bindData: function()
        {
            if (!Alpaca.isEmpty(this.data))
            {
                this.setValue(this.data);
            }
        },
        render: function(view, callback)
        {
            var self = this;

            if (view && (Alpaca.isString(view) || Alpaca.isObject(view)))
            {
                this.view.setView(view);
            }
            else
            {
                if (Alpaca.isEmpty(callback) && Alpaca.isFunction(view))
                {
                    callback = view;
                }
            }
            if (this.options.label === null && this.propertyId)
            {
                this.options.label = this.propertyId;
            }
            if (this.options.name)
            {
                this.name = this.options.name;
            }
            this.calculateName();

            this.setup();

            this._render(function() {
                self.trigger("render");

                callback();
            });
        },

        calculateName: function()
        {
            if (!this.name || (this.name && this.nameCalculated))
            {
                if (this.parent && this.parent.name && this.path)
                {
                    var lastSegment = this.path.substring(this.path.lastIndexOf('/') + 1);
                    if (lastSegment.indexOf("[") !== -1 && lastSegment.indexOf("]") !== -1)
                    {
                        lastSegment = lastSegment.substring(lastSegment.indexOf("[") + 1, lastSegment.indexOf("]"));
                    }

                    if (lastSegment)
                    {
                        this.name = this.parent.name + "_" + lastSegment;
                        this.nameCalculated = true;
                    }
                }
                else
                {
                    if (this.path)
                    {
                        this.name = this.path.replace(/\//g,"").replace(/\[/g,"_").replace(/\]/g,"");
                        this.nameCalculated = true;
                    }
                }
            }
        },
        _render: function(callback)
        {
            var self = this;
            if (self.options.form && Alpaca.isObject(self.options.form))
            {
                self.options.form.viewType = this.view.type;

                var form = self.form;
                if (!form)
                {
                    form = new Alpaca.Form(self.domEl, this.options.form, self.view.id, self.connector, self.errorCallback);
                }
                form.render(function(form) {

                    var tempFieldHolder = $("<div></div>");
                    self._processRender(tempFieldHolder, function() {
                        form.formFieldsContainer.before(self.field);
                        form.formFieldsContainer.remove();
                        form.topControl = self;
                        if (self.view.type && self.view.type !== 'view')
                        {
                            form.initEvents();
                        }

                        self.form = form;
                        self.postRender(function() {
                            self.initializing = false;
                            self.form.afterInitialize();
                            $(self.field).bind('destroyed', function (e) {
                                self.form.destroy();
                            });
                            if (callback && Alpaca.isFunction(callback))
                            {
                                callback(self);
                            }

                        });
                    });
                });
            }
            else
            {
                this._processRender(self.domEl, function() {
                    self.postRender(function() {
                        self.initializing = false;
                        if (callback && Alpaca.isFunction(callback))
                        {
                            callback(self);
                        }

                    });
                });
            }
        },
        _processRender: function(parentEl, callback)
        {
            var self = this;
            self.renderField(parentEl, function() {
                self.fireCallback("field");
                self.renderFieldElements(function() {

                    callback();

                });
            });
        },

        renderFieldDomElement: function(data)
        {
            var templateDescriptor = this.getTemplateDescriptor();
            return Alpaca.tmpl(templateDescriptor, {
                "id": this.getId(),
                "options": this.options,
                "schema": this.schema,
                "data": data,
                "view": this.view,
                "path": this.path,
                "name": this.name
            });
        },
        renderField: function(parentEl, onSuccess)
        {
            var self = this;
            var theData = this.data;
            if (this.isDisplayOnly() && typeof(theData) === "object")
            {
                theData = JSON.stringify(theData);
            }

            var renderedDomElement = self.renderFieldDomElement(theData);
            if ($(renderedDomElement).length > 0)
            {
                var single = null;
                for (var i = 0; i < $(renderedDomElement).length; i++)
                {
                    var name = $(renderedDomElement)[i].nodeName;
                    if (name)
                    {
                        name = name.toLowerCase();

                        if ("div" === name || "span" === name)
                        {
                            single = $($(renderedDomElement)[i]);
                            break;
                        }
                    }
                }
                if (!single)
                {
                    single = $($(renderedDomElement).last());
                }
                if (single)
                {
                    renderedDomElement = single;
                }
            }

            this.field = renderedDomElement;
            this.field.appendTo(parentEl);

            onSuccess();
        },
        renderFieldElements: function(callback)
        {
            callback();
        },
        updateDOMElement: function()
        {
            this.field.attr("data-alpaca-field-path", this.getPath());
            this.field.attr("data-alpaca-field-name", this.getName());
            this.field.removeAttr("name");
        },
        postRender: function(callback)
        {
            var self = this;
            this.field.addClass("alpaca-field");
            this.field.addClass("alpaca-field-" + this.getFieldType());
            this.field.attr("data-alpaca-field-id", this.getId());

            this.updateDOMElement();
            if (this.view.type !== 'view') {
                if (this.isRequired())
                {
                    $(this.field).addClass("alpaca-required");
                    self.fireCallback("required");
                }
                else
                {
                    $(this.field).addClass("alpaca-optional");
                    self.fireCallback("optional");
                }

                var doDisableField = function()
                {
                    Alpaca.disabled($('input', self.field), true);
                    Alpaca.disabled($('select', self.field), true);
                    Alpaca.disabled($(':radio', self.field), true);
                    Alpaca.disabled($(':checkbox', self.field), true);
                    $(":radio", self.field).off().click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    });
                    $(".radio label", self.field).off().click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    });
                    $("input", self.field).off().click(function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false;
                    });

                };
                if (this.options.readonly)
                {
                    $(this.field).addClass("alpaca-readonly");

                    $('input', this.field).attr('readonly', 'readonly');
                    doDisableField();
                    self.fireCallback("readonly");
                }
                if (this.options.disabled)
                {
                    $(this.field).addClass("alpaca-disabled");
                    doDisableField();
                    self.fireCallback("disabled");
                }
                var applyFieldClass = function(el, thing)
                {
                    if (thing) {

                        var i = 0;
                        var tokens = null;

                        if (Alpaca.isArray(thing)) {
                            for (i = 0; i < thing.length; i++) {
                                el.addClass(thing[i]);
                            }
                        }
                        else {
                            if (thing.indexOf(",") > -1) {
                                tokens = thing.split(",");
                                for (i = 0; i < tokens.length; i++) {
                                    el.addClass(tokens[i]);
                                }
                            } else if (thing.indexOf(" ") > -1) {
                                tokens = thing.split(" ");
                                for (i = 0; i < tokens.length; i++) {
                                    el.addClass(tokens[i]);
                                }
                            }
                            else {
                                el.addClass(thing);
                            }
                        }
                    }
                };
                applyFieldClass(this.field, this.options["fieldClass"]);
                if (this.options.disabled)
                {
                    this.disable();
                    self.fireCallback("disable");
                }
                if (this.view.type && this.view.type === 'edit')
                {
                    this.bindData();
                }
                else if (this.showingDefaultData)
                {
                    this.bindData();
                }
                if (this.view.type === "create")
                {
                    Alpaca.logDebug("Skipping data binding for field: " + this.id + " since view mode is 'create'");
                }
                if (this.view.type && this.view.type !== 'view')
                {
                    this.initEvents();
                }
            }
            if (this.options.hidden)
            {
                this.field.hide();
            }

            var defaultHideInitValidationError = (this.view.type === 'create') && !this.refreshed;
            this.hideInitValidationError = Alpaca.isValEmpty(this.options.hideInitValidationError) ? defaultHideInitValidationError : this.options.hideInitValidationError;
            if (!this.view.displayReadonly)
            {
                $(this.field).find(".alpaca-readonly").hide();
            }
            if (this.options.postRender)
            {
                this.options.postRender.call(this, function() {

                    callback();

                });
            }
            else
            {
                callback();
            }
        },
        refresh: function(callback)
        {
            var self = this;
            var _data = self.data = self.getValue();
            var oldDomEl = self.domEl;
            var oldField = self.field;
            var markerEl = $("<div></div>");
            $(oldField).before(markerEl);
            self.domEl = $("<div style='display: none'></div>");
            self.field = undefined;
            self.control = undefined;
            self.container = undefined;
            self.form = undefined;
            $(oldField).find("button").prop("disabled", true);
            this.initializing = true;
            self.setup();
            self._render(function() {
                $(markerEl).before(self.field);
                self.domEl = oldDomEl;
                var oldClasses = $(oldField).attr("class");
                if (oldClasses) {
                    $.each(oldClasses.split(" "), function(i, v) {
                        if (v && !v.indexOf("alpaca-") === 0) {
                            $(self.field).addClass(v);
                        }
                    });
                }
                $(oldField).hide();
                $(markerEl).remove();
                self.refreshed = true;
                if (typeof(_data) !== "undefined")
                {
                    if (Alpaca.isObject(_data) || Alpaca.isArray(_data))
                    {
                        self.setValue(_data);
                    }
                }
                Alpaca.fireReady(self);

                if (callback)
                {
                    callback();
                }
                $(oldField).remove(undefined, {
                    "nodestroy": true
                });

            });
        },
        applyStyle: function(id, target)
        {
            this.view.applyStyle(id, target);
        },
        fireCallback: function(id, arg1, arg2, arg3, arg4, arg5)
        {
            this.view.fireCallback(this, id, arg1, arg2, arg3, arg4, arg5);
        },
        getFieldEl: function() {
            return this.field;
        },
        getId: function() {
            return this.id;
        },
        getParent: function() {
            return this.parent;
        },
        getPath: function() {
            return this.path;
        },
        getName: function() {
            return this.name;
        },
        isTopLevel: function() {
            return Alpaca.isEmpty(this.parent);
        },
        top: function()
        {
            var top = this;

            while (top.parent) {
                top = top.parent;
            }

            return top;
        },
        getValue: function()
        {
            var self = this;

            var val = this.data;

            val = self.ensureProperType(val);

            return val;
        },
        setValue: function(value) {
            this.data = value;

            this.updateObservable();

            this.triggerUpdate();
            if (this.isDisplayOnly() && !this.initializing)
            {
                if (this.top && this.top() && this.top().initializing)
                {
                }
                else
                {
                    this.refresh();
                }
            }
        },
        setDefault: function() {
        },
        getTemplateDescriptor: function() {
            return this.templateDescriptor;
        },
        setTemplateDescriptor: function(templateDescriptor) {
            this.templateDescriptor = templateDescriptor;
        },
        displayMessage: function(messages, beforeStatus) {

            var self = this;
            if (messages && Alpaca.isObject(messages))
            {
                messages = [messages];
            }
            if (messages && Alpaca.isString(messages))
            {
                messages = [{
                    "id": "custom",
                    "message": messages
                }];
            }
            $(this.getFieldEl()).children(".alpaca-message").remove();
            if (messages && messages.length > 0) {
                if(this.options.maxMessages && Alpaca.isNumber(this.options.maxMessages) && this.options.maxMessages > -1) {
                    messages = messages.slice(0,this.options.maxMessages);
                }
            }
            self.fireCallback("removeMessages");
            if (messages && messages.length > 0)
            {
                $.each(messages, function(index, messageObject) {

                    var hidden = false;
                    if (self.hideInitValidationError)
                    {
                        hidden = true;
                    }
                    var messageTemplateDescriptor = self.view.getTemplateDescriptor("message");
                    if (messageTemplateDescriptor)
                    {
                        var messageElement = Alpaca.tmpl(messageTemplateDescriptor, {
                            "id": messageObject.id,
                            "message": messageObject.message,
                            "view": self.view
                        });
                        messageElement.addClass("alpaca-message");
                        if (hidden)
                        {
                            messageElement.addClass("alpaca-message-hidden");
                        }
                        $(self.getFieldEl()).append(messageElement);
                    }
                    self.fireCallback("addMessage", index, messageObject.id, messageObject.message, hidden);
                });
            }
        },
        refreshValidationState: function(validateChildren, cb)
        {

            var self = this;
            var contexts = [];
            var functions = [];
            var functionBuilder = function(field, contexts)
            {
                return function(callback)
                {
                    Alpaca.nextTick(function() {
                        Alpaca.compileValidationContext(field, function(context) {
                            contexts.push(context);
                            callback();
                        });
                    });
                };
            };
            if (validateChildren)
            {
                var crawl = function(field, contexts)
                {
                    if (field.isValidationParticipant())
                    {
                        if (field.children && field.children.length > 0)
                        {
                            for (var i = 0; i < field.children.length; i++)
                            {
                                crawl(field.children[i], contexts);
                            }
                        }

                        functions.push(functionBuilder(field, contexts));
                    }
                };
                crawl(this, contexts);
            }
            functions.push(functionBuilder(this, contexts));
            Alpaca.series(functions, function(err) {
                var mergedMap = {};
                var mergedContext = [];
                for (var i = 0; i < contexts.length; i++)
                {
                    var context = contexts[i];

                    var mIndex = mergedContext.length;
                    for (var j = 0; j < context.length; j++)
                    {
                        var entry = context[j];

                        var existing = mergedMap[entry.id];
                        if (!existing)
                        {
                            var newEntry = {};
                            newEntry.id = entry.id;
                            newEntry.path = entry.path;
                            newEntry.domEl = entry.domEl;
                            newEntry.field = entry.field;
                            newEntry.validated = entry.validated;
                            newEntry.invalidated = entry.invalidated;
                            newEntry.valid = entry.valid;
                            mergedContext.splice(mIndex, 0, newEntry);
                            mergedMap[newEntry.id] = newEntry;
                        }
                        else
                        {
                            if (entry.validated && !existing.invalidated)
                            {
                                existing.validated = true;
                                existing.invalidated = false;
                                existing.valid = entry.valid;
                            }

                            if (entry.invalidated)
                            {
                                existing.invalidated = true;
                                existing.validated = false;
                                existing.valid = entry.valid;
                            }
                        }
                    }
                }
                mergedContext.reverse();
                if (!self.hideInitValidationError)
                {
                    Alpaca.updateValidationStateForContext(self.view, mergedContext);
                }

                if (cb)
                {
                    cb();
                }
            });
        },
        getMessage: function(key)
        {
            return this.view.getMessage(key, this.view.locale);
        },
        validate: function(validateChildren)
        {
            var status = true;

            if (!this.initializing && this.options.validate)
            {
                if (this.children && validateChildren)
                {
                    for (var i = 0; i < this.children.length; i++)
                    {
                        var child = this.children[i];
                        if (child.isValidationParticipant())
                        {
                            child.validate(validateChildren);
                        }
                    }
                }
                status = this.handleValidate();
                if (!status && Alpaca.logLevel == Alpaca.DEBUG) // jshint ignore:line
                {
                    var messages = [];
                    for (var messageId in this.validation)
                    {
                        if (!this.validation[messageId]["status"])
                        {
                            messages.push(this.validation[messageId]["message"]);
                        }
                    }

                    Alpaca.logDebug("Validation failure for field (id=" + this.getId() + ", path=" + this.path + "), messages: " + JSON.stringify(messages));
                }
            }

            this._previouslyValidated = true;

            return status;
        },
        handleValidate: function() {
            var valInfo = this.validation;

            var status = this._validateOptional();
            valInfo["notOptional"] = {
                "message": status ? "" : this.getMessage("notOptional"),
                "status": status
            };

            status = this._validateDisallow();
            valInfo["disallowValue"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("disallowValue"), [this.schema["disallow"].join(', ')]),
                "status": status
            };

            return valInfo["notOptional"]["status"] && valInfo["disallowValue"]["status"];
        },
        _validateCustomValidator: function(callback) {

            var _this = this;

            if (this.options.validator && Alpaca.isFunction(this.options.validator))
            {
                this.options.validator.call(this, function(valInfo) {
                    _this.validation["custom"] = valInfo;

                    callback();
                });
            }
            else
            {
                callback();
            }
        },
        _validateOptional: function() {

            if (this.isRequired() && this.isEmpty()) {
                return false;
            }

            if (this.options.disallowOnlyEmptySpaces && Alpaca.testRegex(Alpaca.regexps.whitespace, this.getValue())) {
                return false;
            }

            return true;
        },
        _validateDisallow: function() {
            if (!Alpaca.isValEmpty(this.schema.disallow)) {
                var val = this.getValue();
                var disallow = this.schema.disallow;
                if (Alpaca.isArray(disallow)) {
                    var isAllowed = true;
                    $.each(disallow, function(index, value) {
                        if ((Alpaca.isObject(val) || (Alpaca.isArray(val)) && Alpaca.isString(value))) {
                            value = Alpaca.parseJSON(value);
                        }
                        if (Alpaca.compareObject(val, value)) {
                            isAllowed = false;
                        }
                    });
                    return isAllowed;
                } else {
                    if ((Alpaca.isObject(val) || (Alpaca.isArray(val)) && Alpaca.isString(disallow))) {
                        disallow = Alpaca.parseJSON(disallow);
                    }
                    return !Alpaca.compareObject(val, disallow);
                }
            }

            return true;
        },
        triggerUpdate: function() {
            $(this.field).trigger("fieldupdate");
        },
        disable: function() {
        },
        enable: function() {
        },
        isDisabled: function()
        {
            return false;
        },
        isEnabled: function()
        {
            return !this.isDisabled();
        },
        focus: function(onFocusCallback) {

            if (onFocusCallback)
            {
                onFocusCallback(this);
            }

        },
        destroy: function() {
            Alpaca.observable(this.path).clear();
            if (Alpaca && Alpaca.fieldInstances) {
                if (Alpaca.fieldInstances[this.getId()]) {
                    delete Alpaca.fieldInstances[this.getId()];
                }
            }
            $(this.field).remove();
        },
        show: function()
        {
            if (this.options && this.options.hidden)
            {
                return;
            }
            else
            {
                $(this.field).css({
                    "display": ""
                });

                this.onShow();
                this.fireCallback("show");
            }
        },

        onShow: function()
        {

        },
        hide: function()
        {
            $(this.field).css({
                "display": "none"
            });

            this.onHide();
            this.fireCallback("hide");
        },

        onHide: function()
        {

        },

        isValidationParticipant: function()
        {
            return this.isShown();
        },

        isShown: function() {
            return !this.isHidden();
        },

        isVisible: function() {
            return !this.isHidden();
        },

        isHidden: function() {
            return ("none" === $(this.field).css("display"));
        },
        print: function()
        {
            if (this.getFieldEl().printArea)
            {
                this.getFieldEl().printArea();
            }
        },
        onDependentReveal: function()
        {

        },
        onDependentConceal: function()
        {

        },
        reload: function()
        {
            this.initializing = true;

            if (!Alpaca.isEmpty(this.callback))
            {
                this.callback(this, this.renderedCallback);
            }
            else
            {
                this.render(this.renderedCallback);
            }
        },
        clear: function()
        {
            var newValue = null;

            if (this.data) {
                newValue = this.data;
            }

            this.setValue(newValue);
        },
        isEmpty: function()
        {
            return Alpaca.isValEmpty(this.getValue());
        },
        isValid: function(checkChildren)
        {
            if (checkChildren && this.children)
            {
                for (var i = 0; i < this.children.length; i++) {
                    var child = this.children[i];
                    if (child.isValidationParticipant())
                    {
                        if (!child.isValid(checkChildren)) {
                            return false;
                        }
                    }
                }
            }

            if ($.isEmptyObject(this.validation)) {
                return true;
            } else {
                for (var key in this.validation) {
                    if (!this.validation[key].status) {
                        return false;
                    }
                }
                return true;
            }
        },
        initEvents: function()
        {
            var _this = this;

            if (this.field)
            {
                this.field.mouseover(function(e) {
                    _this.onMouseOver.call(_this, e);
                    _this.trigger("mouseover", e);
                });

                this.field.mouseout(function(e) {
                    _this.onMouseOut.call(_this, e);
                    _this.trigger("mouseout", e);
                });
                $.each(this.options, function(key, func) {

                    if (Alpaca.startsWith(key,'onField') && Alpaca.isFunction(func))
                    {
                        var event = key.substring(7).toLowerCase();
                        _this.field.on(event, function(e) {
                            func.call(_this,e);
                        });
                    }
                });
                if (this.options && this.options.events)
                {
                    $.each(this.options.events, function(event, func) {

                        if (Alpaca.isFunction(func))
                        {
                            if (event === "render" || event === "ready" || event === "blur" || event === "focus")
                            {
                                _this.on(event, function(e, a, b, c) {
                                    func.call(_this, e, a, b, c);
                                })
                            }
                            else
                            {
                                _this.field.on(event, function(e) {
                                    func.call(_this,e);
                                });
                            }
                        }
                    });
                }
            }
        },
        onFocus: function(e) {
            $(this.field).removeClass("alpaca-field-empty");
            $(this.field).addClass("alpaca-field-focused");
        },
        onBlur: function(e) {

            var wasFocused = $(this.field).hasClass("alpaca-field-focused");

            $(this.field).removeClass("alpaca-field-focused");
            if (wasFocused)
            {
                this.refreshValidationState();
            }
            $(this.field).trigger("fieldblur");
        },
        onChange: function(e) {
            this.data = this.getValue();
            this.updateObservable();
            this.triggerUpdate();
        },
        onMouseOver: function(e) {

        },
        onMouseOut: function(e) {

        },
        getControlByPath: function(path) {

            var result = null;

            if (path)
            {
                if (path.indexOf("/") === 0) {
                    path = path.substring(1);
                }
                if (Alpaca.endsWith(path, "/")) {
                    path = path.substring(0, path.length - 1);
                }

                var current = this;

                var pathArray = path.split('/');
                for (var i = 0; i < pathArray.length; i++)
                {
                    var pathElement = pathArray[i];

                    var _name = pathElement;
                    var _index = -1;

                    var z1 = pathElement.indexOf("[");
                    if (z1 >= 0)
                    {
                        var z2 = pathElement.indexOf("]", z1 + 1);
                        if (z2 >= 0)
                        {
                            _index = parseInt(pathElement.substring(z1 + 1, z2));
                            _name = pathElement.substring(0, z1);
                        }
                    }

                    if (_name)
                    {
                        current = current.childrenByPropertyId[_name];

                        if (_index > -1)
                        {
                            current = current.children[_index];
                        }
                    }
                }

                result = current;
            }

            return result;
        },
        getControlsByFieldType: function(fieldType) {

            var array = [];

            if (fieldType)
            {
                var f = function(parent, fieldType, array)
                {
                    for (var i = 0; i < parent.children.length; i++)
                    {
                        if (parent.children[i].getFieldType() === fieldType)
                        {
                            array.push(parent.children[i]);
                        }

                        if (parent.children[i].isContainer())
                        {
                            f(parent.children[i], fieldType, array);
                        }
                    }
                };
                f(this, fieldType, array);
            }

            return array;
        },
        getControlsBySchemaType: function(schemaType) {

            var array = [];

            if (schemaType)
            {
                var f = function(parent, schemaType, array)
                {
                    for (var i = 0; i < parent.children.length; i++)
                    {
                        if (parent.children[i].getType() === schemaType)
                        {
                            array.push(parent.children[i]);
                        }

                        if (parent.children[i].isContainer())
                        {
                            f(parent.children[i], schemaType, array);
                        }
                    }
                };
                f(this, schemaType, array);
            }

            return array;
        },

        subscribe: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.subscribe.apply(this, args);
        },

        unsubscribe: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.unsubscribe.apply(this, args);
        },

        observable: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.observable.apply(this, args);
        },

        clearObservable: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.clearObservable.apply(this, args);
        },

        dependentObservable: function()
        {
            var args = Alpaca.makeArray(arguments);
            args.unshift(this.getObservableScope());

            return Alpaca.dependentObservable.apply(this, args);
        },
        getType: function() {

        },
        getFieldType: function()
        {
            return "";
        },
        getBaseFieldType: function()
        {
            var baseFieldType = null;

            var x = this.constructor.ancestor.prototype;
            if (x && x.getFieldType)
            {
                baseFieldType = x.getFieldType();
            }

            return baseFieldType;
        },
        isContainer: function() {
            return false;
        },
        isRequired: function()
        {
            var required = false;

            if (typeof(this.schema.required) === "boolean")
            {
                required = this.schema.required;
            }
            if (this.parent && this.parent.schema.required)
            {
                if (Alpaca.isArray(this.parent.schema.required))
                {
                    var requiredArray = this.parent.schema.required;
                    if (requiredArray)
                    {
                        for (var i = 0; i < requiredArray.length; i++)
                        {
                            if (requiredArray[i] === this.propertyId)
                            {
                                required = true;
                                break;
                            }
                        }
                    }
                }
            }

            return required;
        }
        ,
        getTitle: function() {

        },
        getDescription: function() {

        },
        getSchemaOfSchema: function() {
            var schemaOfSchema = {
                "title": this.getTitle(),
                "description": this.getDescription(),
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "description": "Short description of the property.",
                        "type": "string"
                    },
                    "description": {
                        "title": "Description",
                        "description": "Detailed description of the property.",
                        "type": "string"
                    },
                    "readonly": {
                        "title": "Readonly",
                        "description": "Indicates that the field is read-only.  A read-only field cannot have it's value changed.  Read-only fields render in a grayed-out or disabled control.  If the field is rendered using a view with the <code>displayReadonly</code> attribute set to false, the read-only field will not appear.",
                        "type": "boolean",
                        "default": false
                    },
                    "required": {
                        "title": "Required",
                        "description": "Indicates whether the field's value is required.  If set to true, the field must take on a valid value and cannnot be left empty or unassigned.",
                        "type": "boolean",
                        "default": false
                    },
                    "default": {
                        "title": "Default",
                        "description": "The default value to be assigned for this property.  If the data for the field is empty or not provided, this default value will be plugged in for you.  Specify a default value when you want to pre-populate the field's value ahead of time.",
                        "type": "any"
                    },
                    "type": {
                        "title": "Type",
                        "description": "Data type of the property.",
                        "type": "string",
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Data format of the property.",
                        "type": "string"
                    },
                    "disallow": {
                        "title": "Disallowed Values",
                        "description": "List of disallowed values for the property.",
                        "type": "array"
                    },
                    "dependencies": {
                        "title": "Dependencies",
                        "description": "List of property dependencies.",
                        "type": "array"
                    }
                }
            };
            if (this.getType && !Alpaca.isValEmpty(this.getType())) {
                schemaOfSchema.properties.type['default'] = this.getType();
                schemaOfSchema.properties.type['enum'] = [this.getType()];
            }
            return schemaOfSchema;
        },
        getOptionsForSchema: function() {
            return {
                "fields": {
                    "title": {
                        "helper": "Field short description",
                        "type": "text"
                    },
                    "description": {
                        "helper": "Field detailed description",
                        "type": "textarea"
                    },
                    "readonly": {
                        "helper": "Field will be read only if checked",
                        "rightLabel": "This field is read-only",
                        "type": "checkbox"
                    },
                    "required": {
                        "helper": "Field value must be set if checked",
                        "rightLabel": "This field is required",
                        "type": "checkbox"
                    },
                    "default": {
                        "helper": "Field default value",
                        "type": "textarea"
                    },
                    "type": {
                        "helper": "Field data type",
                        "type": "text"
                    },
                    "format": {
                        "type": "select",
                        "dataSource": function(callback) {
                            for (var key in Alpaca.defaultFormatFieldMapping)
                            {
                                this.selectOptions.push({
                                    "value": key,
                                    "text": key
                                });
                            }

                            callback();
                        }
                    },
                    "disallow": {
                        "helper": "Disallowed values for the field",
                        "itemLabel":"Value",
                        "type": "array"
                    },
                    "dependencies": {
                        "helper": "Field Dependencies",
                        "multiple":true,
                        "size":3,
                        "type": "select",
                        "dataSource": function (field, callback) {
                            if (field.parent && field.parent.schemaParent && field.parent.schemaParent.parent) {
                                for (var key in field.parent.schemaParent.parent.childrenByPropertyId) {
                                    if (key != field.parent.schemaParent.propertyId) { // jshint ignore:line
                                        field.selectOptions.push({
                                            "value": key,
                                            "text": key
                                        });
                                    }
                                }
                            }
                            if (callback) {
                                callback();
                            }
                        }
                    }
                }
            };
        },
        getSchemaOfOptions: function() {
            var schemaOfOptions = {
                "title": "Options for " + this.getTitle(),
                "description": this.getDescription() + " (Options)",
                "type": "object",
                "properties": {
                    "form":{},
                    "id": {
                        "title": "Field Id",
                        "description": "Unique field id. Auto-generated if not provided.",
                        "type": "string"
                    },
                    "type": {
                        "title": "Field Type",
                        "description": "Field type.",
                        "type": "string",
                        "default": this.getFieldType(),
                        "readonly": true
                    },
                    "validate": {
                        "title": "Validation",
                        "description": "Field validation is required if true.",
                        "type": "boolean",
                        "default": true
                    },
                    "showMessages": {
                        "title": "Show Messages",
                        "description": "Display validation messages if true.",
                        "type": "boolean",
                        "default": true
                    },
                    "disabled": {
                        "title": "Disabled",
                        "description": "Field will be disabled if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "readonly": {
                        "title": "Readonly",
                        "description": "Field will be readonly if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "hidden": {
                        "title": "Hidden",
                        "description": "Field will be hidden if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "label": {
                        "title": "Label",
                        "description": "Field label.",
                        "type": "string"
                    },
                    "helper": {
                        "title": "Helper",
                        "description": "Field help message.",
                        "type": "string"
                    },
                    "helpers": {
                        "title": "Helpers",
                        "description": "An array of field help messages.  Each message will be displayed on it's own line.",
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "fieldClass": {
                        "title": "CSS class",
                        "description": "Specifies one or more CSS classes that should be applied to the dom element for this field once it is rendered.  Supports a single value, comma-delimited values, space-delimited values or values passed in as an array.",
                        "type": "string"
                    },
                    "hideInitValidationError" : {
                        "title": "Hide Initial Validation Errors",
                        "description" : "Hide initial validation errors if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "focus": {
                        "title": "Focus",
                        "description": "If true, the initial focus for the form will be set to the first child element (usually the first field in the form).  If a field name or path is provided, then the specified child field will receive focus.  For example, you might set focus to 'name' (selecting the 'name' field) or you might set it to 'client/name' which picks the 'name' field on the 'client' object.",
                        "type": "checkbox",
                        "default": true
                    },
                    "optionLabels": {
                        "title": "Enumerated Value Labels",
                        "description": "An array of string labels for items in the enum array",
                        "type": "array"
                    },
                    "view": {
                        "title": "Override of the view for this field",
                        "description": "Allows for this field to be rendered with a different view (such as 'display' or 'create')",
                        "type": "string"
                    }
                }
            };
            if (this.isTopLevel()) {

                schemaOfOptions.properties.form = {
                    "title": "Form",
                    "description": "Options for rendering the FORM tag.",
                    "type": "object",
                    "properties": {
                        "attributes": {
                            "title": "Form Attributes",
                            "description": "List of attributes for the FORM tag.",
                            "type": "object",
                            "properties": {
                                "id": {
                                    "title": "Id",
                                    "description": "Unique form id. Auto-generated if not provided.",
                                    "type": "string"
                                },
                                "action": {
                                    "title": "Action",
                                    "description": "Form submission endpoint",
                                    "type": "string"
                                },
                                "method": {
                                    "title": "Method",
                                    "description": "Form submission method",
                                    "enum":["post","get"],
                                    "type": "string"
                                },
                                "rubyrails": {
                                    "title": "Ruby On Rails",
                                    "description": "Ruby on Rails Name Standard",
                                    "enum": ["true", "false"],
                                    "type": "string"
                                },
                                "name": {
                                    "title": "Name",
                                    "description": "Form name",
                                    "type": "string"
                                },
                                "focus": {
                                    "title": "Focus",
                                    "description": "Focus Setting",
                                    "type": "any"
                                }
                            }
                        },
                        "buttons": {
                            "title": "Form Buttons",
                            "description": "Configuration for form-bound buttons",
                            "type": "object",
                            "properties": {
                                "submit": {
                                    "type": "object",
                                    "title": "Submit Button",
                                    "required": false
                                },
                                "reset": {
                                    "type": "object",
                                    "title": "Reset button",
                                    "required": false
                                }
                            }
                        },
                        "toggleSubmitValidState": {
                            "title": "Toggle Submit Valid State",
                            "description": "Toggle the validity state of the Submit button",
                            "type": "boolean",
                            "default": true
                        }
                    }
                };

            } else {
                delete schemaOfOptions.properties.form;
            }

            return schemaOfOptions;
        },
        getOptionsForOptions: function() {
            var optionsForOptions = {
                "type": "object",
                "fields": {
                    "id": {
                        "type": "text",
                        "readonly": true
                    },
                    "type": {
                        "type": "text"
                    },
                    "validate": {
                        "rightLabel": "Enforce validation",
                        "type": "checkbox"
                    },
                    "showMessages": {
                        "rightLabel":"Show validation messages",
                        "type": "checkbox"
                    },
                    "disabled": {
                        "rightLabel":"Disable this field",
                        "type": "checkbox"
                    },
                    "hidden": {
                        "type": "checkbox",
                        "rightLabel": "Hide this field"
                    },
                    "label": {
                        "type": "text"
                    },
                    "helper": {
                        "type": "textarea"
                    },
                    "helpers": {
                        "type": "array",
                        "items": {
                            "type": "textarea"
                        }
                    },
                    "fieldClass": {
                        "type": "text"
                    },
                    "hideInitValidationError": {
                        "rightLabel": "Hide initial validation errors",
                        "type": "checkbox"
                    },
                    "focus": {
                        "type": "checkbox",
                        "rightLabel": "Auto-focus first child field"
                    },
                    "optionLabels": {
                        "type": "array",
                        "items": {
                            "type": "text"
                        }
                    },
                    "view": {
                        "type": "text"
                    }
                }
            };
            if (this.isTopLevel()) {
                optionsForOptions.fields.form = {
                    "type": "object",
                    "fields": {
                        "attributes": {
                            "type": "object",
                            "fields": {
                                "id": {
                                    "type": "text",
                                    "readonly": true
                                },
                                "action": {
                                    "type": "text"
                                },
                                "method": {
                                    "type": "select"
                                },
                                "name": {
                                    "type": "text"
                                }
                            }
                        }
                    }
                };
            }

            return optionsForOptions;
        }
    });
    Alpaca.registerMessages({
        "disallowValue": "{0} are disallowed values.",
        "notOptional": "This field is not optional."
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.ControlField = Alpaca.Field.extend(
        {
            onConstruct: function()
            {
                var _this = this;

                this.isControlField = true;
                this._getControlVal = function(ensureProperType) {
                    var val = null;

                    if (this.control)
                    {
                        val = $(this.control).val();

                        if (ensureProperType)
                        {
                            val = _this.ensureProperType(val);
                        }
                    }

                    return val;
                };
            },
            setup: function()
            {
                var self = this;

                this.base();

                var controlTemplateType = self.resolveControlTemplateType();
                if (!controlTemplateType)
                {
                    return Alpaca.throwErrorWithCallback("Unable to find template descriptor for control: " + self.getFieldType());
                }

                this.controlDescriptor = this.view.getTemplateDescriptor("control-" + controlTemplateType, self);
                if (typeof(this.options.renderButtons) === "undefined")
                {
                    this.options.renderButtons = true;
                }
                if (this.options.buttons)
                {
                    for (var k in this.options.buttons)
                    {
                        if (this.options.buttons[k].label)
                        {
                            this.options.buttons[k].value = this.options.buttons[k].label;
                        }
                        if (this.options.buttons[k].title)
                        {
                            this.options.buttons[k].value = this.options.buttons[k].title;
                        }
                        if (!this.options.buttons[k].type)
                        {
                            this.options.buttons[k].type = "button";
                        }
                        if (!this.options.buttons[k].styles)
                        {
                            this.options.buttons[k].styles = this.view.styles.button;
                        }
                    }
                }
            },

            getControlEl: function()
            {
                return this.control;
            },

            resolveControlTemplateType: function()
            {
                var self = this;

                var finished = false;
                var selectedType = null;

                var b = this;
                do
                {
                    if (!b.getFieldType)
                    {
                        finished = true;
                    }
                    else
                    {
                        var d = this.view.getTemplateDescriptor("control-" + b.getFieldType(), self);
                        if (d)
                        {
                            selectedType = b.getFieldType();
                            finished = true;
                        }
                        else
                        {
                            b = b.constructor.ancestor.prototype;
                        }
                    }
                }
                while (!finished);

                return selectedType;
            },

            onSetup: function()
            {

            },

            isAutoFocusable: function()
            {
                return true;
            },
            getTemplateDescriptorId : function ()
            {
                return "control";
            },
            renderFieldElements: function(callback) {

                var self = this;
                this.control = $(this.field).find("." + Alpaca.MARKER_CLASS_CONTROL_FIELD);
                this.control.removeClass(Alpaca.MARKER_CLASS_CONTROL_FIELD);
                self.prepareControlModel(function(model) {
                    self.beforeRenderControl(model, function() {
                        self.renderControl(model, function(controlField) {

                            if (controlField)
                            {
                                self.control.replaceWith(controlField);
                                self.control = controlField;

                                self.control.addClass(Alpaca.CLASS_CONTROL);
                            }
                            self.fireCallback("control");

                            self.afterRenderControl(model, function() {

                                callback();
                            });

                        });
                    });
                });
            },
            prepareControlModel: function(callback)
            {
                var self = this;

                var model = {};
                model.id = this.getId();
                model.name = this.name;
                model.options = this.options;
                model.schema = this.schema;
                model.data = this.data;
                model.required = this.isRequired();
                model.view = this.view;

                callback(model);
            },
            beforeRenderControl: function(model, callback)
            {
                var self = this;

                callback();
            },
            afterRenderControl: function(model, callback)
            {
                var self = this;

                if (!self.firstUpdateObservableFire)
                {
                    if ((typeof(self.data) == "undefined") || self.data == null)
                    {
                    }
                    else
                    {
                        self.firstUpdateObservableFire = true;
                        self.updateObservable();
                    }
                }
                $(this.getFieldEl()).find(".alpaca-control-button").each(function() {

                    $(this).click(function(e) {
                        $(this).attr("button-pushed", true);
                    });
                    var key = $(this).attr("data-key");
                    if (key)
                    {
                        var buttonConfig = self.options.buttons[key];
                        if (buttonConfig)
                        {
                            if (buttonConfig.click)
                            {
                                $(this).click(function(control, handler) {
                                    return function(e) {
                                        e.preventDefault();
                                        handler.call(control, e);
                                    }
                                }(self, buttonConfig.click));
                            }
                        }
                    }
                });


                callback();
            },
            renderControl: function(model, callback)
            {
                var control = null;

                if (this.controlDescriptor)
                {
                    control = Alpaca.tmpl(this.controlDescriptor, model);
                }

                callback(control);
            },
            postRender: function(callback)
            {
                var self = this;

                this.base(function() {

                    callback();

                });
            },
            updateDOMElement: function()
            {
                this.base();
                this.control.attr("name", this.getName());
            },
            setDefault: function() {
                var defaultData = Alpaca.isEmpty(this.schema['default']) ? "" : this.schema['default'];
                this.setValue(defaultData);
            },
            getValue: function()
            {
                var self = this;

                var value = this.base();

                if (!this.isDisplayOnly())
                {
                    value = self.getControlValue();
                }
                value = self.ensureProperType(value);

                return value;
            },
            getControlValue: function()
            {
                return this._getControlVal(true);
            },
            _validateEnum: function()
            {
                if (!this.getEnum()) {
                    return true;
                }

                var val = this.getValue();

                if (!this.isRequired() && Alpaca.isValEmpty(val)) {
                    return true;
                }

                return ($.inArray(val, this.getEnum()) > -1);
            },
            handleValidate: function()
            {
                var baseStatus = this.base();

                var valInfo = this.validation;

                var status = this._validateEnum();
                var messageValues = this.getEnum();
                var optionLabels = this.getOptionLabels();
                if (optionLabels && optionLabels.length > 0) {
                    messageValues = optionLabels;
                }

                valInfo["invalidValueOfEnum"] = {
                    "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidValueOfEnum"), [messageValues.join(', '), this.getValue()]),
                    "status": status
                };

                return baseStatus && valInfo["invalidValueOfEnum"]["status"];
            },
            initEvents: function()
            {
                this.base();

                if (this.control && this.control.length > 0)
                {
                    this.initControlEvents();
                }
            },

            initControlEvents: function()
            {
                var self = this;

                var control = this.control;

                control.click(function(e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });
                control.change(function(e) {
                    setTimeout(function() {
                        self.onChange.call(self, e);
                        self.triggerWithPropagation("change", e);
                    }, 200);
                });

                control.focus(function(e) {

                    self.wasFocused = true;

                    if (!self.suspendBlurFocus)
                    {
                        var x = self.onFocus.call(self, e);
                        if (x !== false) {
                            x = self.trigger("focus", e);
                        }

                        return x;
                    }
                });

                control.blur(function(e) {

                    self.wasBlurred = true;

                    if (!self.suspendBlurFocus)
                    {
                        var x = self.onBlur.call(self, e);
                        if (x !== false) {
                            x = self.trigger("blur", e);
                        }

                        return x;
                    }
                });

                control.keypress(function(e) {
                    var x = self.onKeyPress.call(self, e);
                    if (x !== false) {
                        x = self.trigger("keypress", e);
                    }

                    return x;
                });

                control.keyup(function(e) {
                    var x = self.onKeyUp.call(self, e);
                    if (x !== false) {
                        x = self.trigger("keyup", e);
                    }

                    return x;
                });

                control.keydown(function(e) {
                    var x = self.onKeyDown.call(self, e);
                    if (x !== false) {
                        x = self.trigger("keydown", e);
                    }

                    return x;
                });
            },
            onKeyPress: function(e)
            {
                var self = this;

                var refresh = false;
                if (self.view.type && self.view.type === 'edit')
                {
                    var wasValid = this.isValid();
                    if (!wasValid)
                    {
                        refresh = true;
                    }
                }
                else if (self.view.type && self.view.type === 'create')
                {
                    var wasValid = this.isValid();
                    if (!wasValid && self.wasBlurred)
                    {
                        refresh = true;
                    }
                }

                if (refresh)
                {
                    window.setTimeout(function () {
                        self.refreshValidationState();
                    }, 50);
                }

            },
            onKeyDown: function(e)
            {
            },
            onKeyUp: function(e)
            {
            },
            onClick: function(e)
            {
            },
            disable: function()
            {
                this.base();

                if (this.control && this.control.length > 0)
                {
                    $(this.control).prop("disabled", true);
                }
            },
            enable: function()
            {
                this.base();

                if (this.control && this.control.length > 0)
                {
                    $(this.control).prop("disabled", false);
                }
            },
            isDisabled: function()
            {
                return $(this.control).prop("disabled");
            },
            getEnum: function()
            {
                var array = null;

                if (this.schema && this.schema["enum"])
                {
                    array = this.schema["enum"];
                }

                return array;
            },
            setEnum: function(enumArray)
            {
                Alpaca.safeSetObjectArray(this.schema, "enum", enumArray);
            },
            getOptionLabels: function()
            {
                var array = null;

                if (this.options && this.options["optionLabels"])
                {
                    array = this.options["optionLabels"];
                }

                return array;
            },
            setOptionLabels: function(optionLabelsArray)
            {
                Alpaca.safeSetObjectArray(this.options, "optionLabels", optionLabelsArray);
            },
            sortEnum: function()
            {
                var enumValues = this.getEnum();
                if (enumValues && enumValues.length > 0)
                {
                    var optionLabels = this.getOptionLabels();

                    var selectableOptions = [];
                    for (var i = 0; i < enumValues.length; i++)
                    {
                        var value = enumValues[i];
                        var text = enumValues[i];

                        if (optionLabels && optionLabels.length >= i + 1)
                        {
                            text = optionLabels[i];
                        }

                        selectableOptions.push({
                            "value": value,
                            "text": text
                        });
                    }
                    this.sortSelectableOptions(selectableOptions);
                    var newEnumValues = [];
                    var newOptionLabels = [];
                    for (var i = 0; i < selectableOptions.length; i++)
                    {
                        newEnumValues.push(selectableOptions[i].value);

                        if (Alpaca.isArray(optionLabels)) {
                            newOptionLabels.push(selectableOptions[i].text);
                        }
                    }

                    this.setEnum(newEnumValues);
                    this.setOptionLabels(newOptionLabels);
                }
            },
            sortSelectableOptions: function(selectableOptions)
            {
                var self = this;
                if (self.options.sort === false)
                {
                    return;
                }
                var sortFn = Alpaca.defaultSort;
                if (self.options.sort) {
                    if (typeof(self.options.sort) === "function") {
                        sortFn = self.options.sort;
                    }
                }
                selectableOptions.sort(sortFn);
            },
            invokeDataSource: function(array, model, onFinish)
            {
                var self = this;

                var completionFunction = function(err)
                {
                    var self = this;

                    if (err) {
                        return onFinish(err);
                    }

                    self.afterLoadDataSourceOptions(array, model, function(err, array) {

                        if (err) {
                            return onFinish(err);
                        }
                        self.sortSelectableOptions(array);

                        onFinish(null, array);

                    });

                }.bind(self);

                if (Alpaca.isFunction(self.options.dataSource))
                {
                    self.options.dataSource.call(self, function(values) {

                        if (Alpaca.isArray(values))
                        {
                            for (var i = 0; i < values.length; i++)
                            {
                                if (typeof(values[i]) === "string")
                                {
                                    array.push({
                                        "text": values[i],
                                        "value": values[i]
                                    });
                                }
                                else if (Alpaca.isObject(values[i]))
                                {
                                    array.push(values[i]);
                                }
                            }

                            completionFunction();
                        }
                        else if (Alpaca.isObject(values))
                        {
                            for (var k in values)
                            {
                                array.push({
                                    "text": k,
                                    "value": values[k]
                                });
                            }

                            completionFunction();
                        }
                        else
                        {
                            completionFunction();
                        }
                    });
                }
                else if (Alpaca.isUri(self.options.dataSource))
                {
                    $.ajax({
                        url: self.options.dataSource,
                        type: "get",
                        dataType: "json",
                        success: function(jsonDocument) {

                            var ds = jsonDocument;
                            if (self.options.dsTransformer && Alpaca.isFunction(self.options.dsTransformer))
                            {
                                ds = self.options.dsTransformer(ds);
                            }

                            if (ds)
                            {
                                if (Alpaca.isObject(ds))
                                {
                                    $.each(ds, function(key, value) {
                                        array.push({
                                            "value": key,
                                            "text": value
                                        });
                                    });

                                    completionFunction();
                                }
                                else if (Alpaca.isArray(ds))
                                {
                                    $.each(ds, function(index, value) {
                                        array.push({
                                            "value": value.value,
                                            "text": value.text
                                        });
                                    });

                                    completionFunction();
                                }
                            }
                        },
                        "error": function(jqXHR, textStatus, errorThrown) {

                            self.errorCallback({
                                "message":"Unable to load data from uri : " + self.options.dataSource,
                                "stage": "DATASOURCE_LOADING_ERROR",
                                "details": {
                                    "jqXHR" : jqXHR,
                                    "textStatus" : textStatus,
                                    "errorThrown" : errorThrown
                                }
                            });
                        }
                    });
                }
                else if (Alpaca.isArray(self.options.dataSource))
                {
                    for (var i = 0; i < self.options.dataSource.length; i++)
                    {
                        if (typeof(self.options.dataSource[i]) === "string")
                        {
                            array.push({
                                "text": self.options.dataSource[i],
                                "value": self.options.dataSource[i]
                            });
                        }
                        else if (Alpaca.isObject(self.options.dataSource[i]))
                        {
                            array.push(self.options.dataSource[i]);
                        }
                    }

                    completionFunction();
                }
                else if (Alpaca.isObject(self.options.dataSource))
                {
                    if (self.options.dataSource.connector)
                    {
                        var connector = self.connector;

                        if (Alpaca.isObject(self.options.dataSource.connector))
                        {
                            var connectorId = self.options.dataSource.connector.id;
                            var connectorConfig = self.options.dataSource.connector.config;
                            if (!connectorConfig) {
                                connectorConfig = {};
                            }

                            var ConnectorClass = Alpaca.getConnectorClass(connectorId);
                            if (ConnectorClass) {
                                connector = new ConnectorClass(connectorId, connectorConfig);
                            }
                        }

                        var config = self.options.dataSource.config;
                        if (!config) {
                            config = {};
                        }
                        connector.loadDataSource(config, function(values) {

                            for (var i = 0; i < values.length; i++)
                            {
                                if (typeof(values[i]) === "string")
                                {
                                    array.push({
                                        "text": values[i],
                                        "value": values[i]
                                    });
                                }
                                else if (Alpaca.isObject(values[i]))
                                {
                                    array.push(values[i]);
                                }
                            }

                            completionFunction();
                        });
                    }
                    else
                    {
                        for (var k in self.options.dataSource)
                        {
                            array.push({
                                "text": self.options.dataSource[k],
                                "value": k
                            });
                        }

                        completionFunction();
                    }

                }
                else
                {
                    onFinish();
                }
            },

            afterLoadDataSourceOptions: function(array, model, callback)
            {
                callback(null, array);
            }
            ,
            getSchemaOfSchema: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "enum": {
                            "title": "Enumerated Values",
                            "description": "List of specific values for this property",
                            "type": "array"
                        }
                    }
                });
            },
            getOptionsForSchema: function() {
                return Alpaca.merge(this.base(), {
                    "fields": {
                        "enum": {
                            "itemLabel":"Value",
                            "type": "array"
                        }
                    }
                });
            },
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "name": {
                            "title": "Field Name",
                            "description": "Field Name.",
                            "type": "string"
                        },
                        "sort": {
                            "title": "Sort Function",
                            "description": "Defines an f(a,b) sort function for the array of enumerated values [{text, value}].  This is used to sort enum and optionLabels as well as results that come back from any data sources (for select and radio controls).  By default the items are sorted alphabetically.   Don't apply any sorting if false.",
                            "type": "function"
                        }
                    }
                });
            },
            getOptionsForOptions: function() {
                return Alpaca.merge(this.base(), {
                    "fields": {
                        "name": {
                            "type": "text"
                        }
                    }
                });
            }
        });
    Alpaca.registerMessages({
        "invalidValueOfEnum": "This field should have one of the values in {0}.  Current value is: {1}"
    });

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.ContainerField = Alpaca.Field.extend(
    {
        onConstruct: function()
        {
            this.isContainerField = true;
        },
        isContainer: function()
        {
            return true;
        },

        getContainerEl: function()
        {
            return this.container;
        },
        getTemplateDescriptorId : function ()
        {
            return "container";
        },

        resolveContainerTemplateType: function()
        {

            var finished = false;
            var selectedType = null;

            var b = this;
            do
            {
                if (!b.getFieldType)
                {
                    finished = true;
                }
                else
                {
                    var d = this.view.getTemplateDescriptor("container-" + b.getFieldType(), this);
                    if (d)
                    {
                        selectedType = b.getFieldType();
                        finished = true;
                    }
                    else
                    {
                        b = b.constructor.ancestor.prototype;
                    }
                }
            }
            while (!finished);

            return selectedType;
        },

        resolveContainerItemTemplateType: function()
        {

            var finished = false;
            var selectedType = null;

            var b = this;
            do
            {
                if (!b.getFieldType)
                {
                    finished = true;
                }
                else
                {
                    var d = this.view.getTemplateDescriptor("container-" + b.getFieldType() + "-item", this);
                    if (d)
                    {
                        selectedType = b.getFieldType();
                        finished = true;
                    }
                    else
                    {
                        b = b.constructor.ancestor.prototype;
                    }
                }
            }
            while (!finished);

            return selectedType;
        },
        setup: function()
        {
            var self = this;

            this.base();

            var containerTemplateType = self.resolveContainerTemplateType();
            if (!containerTemplateType)
            {
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for container: " + self.getFieldType());
            }

            this.containerDescriptor = this.view.getTemplateDescriptor("container-" + containerTemplateType, self);
            var collapsible = false;

            if (!Alpaca.isEmpty(this.view.collapsible)) {
                collapsible = this.view.collapsible;
            }

            if (!Alpaca.isEmpty(this.options.collapsible)) {
                collapsible = this.options.collapsible;
            }

            this.options.collapsible = collapsible;

            var legendStyle = "button";

            if (!Alpaca.isEmpty(this.view.legendStyle)) {
                legendStyle = this.view.legendStyle;
            }

            if (!Alpaca.isEmpty(this.options.legendStyle)) {
                legendStyle = this.options.legendStyle;
            }

            this.options.legendStyle = legendStyle;
            this.lazyLoading = false;
            if (!Alpaca.isEmpty(this.options.lazyLoading)) {
                this.lazyLoading = this.options.lazyLoading;
                if (this.lazyLoading) {
                    this.options.collapsed = true;
                }
            }
            this.children = [];
            this.childrenById = {};
            this.childrenByPropertyId = {};
        },
        destroy: function()
        {
            if (this.form)
            {
                this.form.destroy(true); // pass in true so that we don't call back recursively
                delete this.form;
            }
            Alpaca.each(this.children, function () {
                this.destroy();
            });
            this.base();
        },
        renderFieldElements: function(callback) {

            var self = this;
            this.container = $(this.field).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD);
            this.container.removeClass(Alpaca.MARKER_CLASS_CONTAINER_FIELD);
            self.prepareContainerModel(function(model) {
                self.beforeRenderContainer(model, function() {
                    self.renderContainer(model, function(containerField) {

                        if (containerField)
                        {
                            self.container.replaceWith(containerField);
                            self.container = containerField;

                            self.container.addClass(Alpaca.CLASS_CONTAINER);
                        }
                        if (self.view.horizontal)
                        {
                            self.container.addClass("alpaca-horizontal");
                        }
                        else
                        {
                            self.container.addClass("alpaca-vertical");
                        }
                        self.fireCallback("container");

                        self.afterRenderContainer(model, function() {

                            callback();
                        });

                    });
                });
            });
        },
        prepareContainerModel: function(callback)
        {
            var self = this;

            var model = {
                "id": this.getId(),
                "name": this.name,
                "schema": this.schema,
                "options": this.options,
                "view": this.view
            };
            self.createItems(function(items) {

                if (!items)
                {
                    items = [];
                }
                for (var i = 0; i < items.length; i++)
                {
                    if (!items[i].containerItemEl) {
                        items[i].containerItemEl = items[i].getFieldEl();
                    }
                }

                model.items = items;

                callback(model);

            });
        },
        beforeRenderContainer: function(model, callback)
        {
            var self = this;

            callback();
        },
        renderContainer: function(model, callback)
        {
            var container = null;

            if (this.containerDescriptor)
            {
                container = Alpaca.tmpl(this.containerDescriptor, model);
            }

            callback(container);
        },
        afterRenderContainer: function(model, callback)
        {
            var self = this;

            self.beforeApplyCreatedItems(model, function() {
                self.applyCreatedItems(model, function () {
                    self.afterApplyCreatedItems(model, function () {
                        callback();
                    });
                });
            });
        },
        postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                callback();

            });
        },
        initEvents: function()
        {
            var self = this;

            this.base();
        },
        createItems: function(callback)
        {
            callback();
        },

        beforeApplyCreatedItems: function(model, callback)
        {
            callback();
        },

        applyCreatedItems: function(model, callback)
        {
            var self = this;

            var layoutBindings = null;
            if (self.isTopLevel() && self.view.getLayout())
            {
                layoutBindings = self.view.getLayout().bindings;
                if (!layoutBindings && self.view.getLayout().templateDescriptor && model.items.length > 0)
                {
                    layoutBindings = {};

                    for (var i = 0; i < model.items.length; i++)
                    {
                        var name = model.items[i].name;

                        layoutBindings[name] = "[data-alpaca-layout-binding='" + name + "']";
                    }
                }

            }

            if (model.items.length > 0)
            {
                $(self.container).addClass("alpaca-container-has-items");
                $(self.container).attr("data-alpaca-container-item-count", model.items.length);
            }
            else
            {
                $(self.container).removeClass("alpaca-container-has-items");
                $(self.container).removeAttr("data-alpaca-container-item-count");
            }

            for (var i = 0; i < model.items.length; i++)
            {
                var item = model.items[i];
                var insertionPoint = $(self.container).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM + "[" + Alpaca.MARKER_DATA_CONTAINER_FIELD_ITEM_KEY + "='" + item.name + "']");
                if (!layoutBindings)
                {
                    var holder = $(insertionPoint).parent();

                    $(insertionPoint).replaceWith(item.containerItemEl);
                    item.domEl = holder;
                }
                else
                {
                    var bindingId = layoutBindings[item.name];
                    if (bindingId)
                    {
                        var holder = $(bindingId, self.field);
                        if (holder.length == 0)
                        {
                            try {
                                holder = $('#' + bindingId, self.field);
                            } catch (e) { }
                        }
                        if (holder.length > 0)
                        {
                            item.domEl = $("<div></div>");
                            $(item.domEl).addClass("alpaca-layout-binding-holder");
                            $(item.domEl).attr("alpaca-layout-binding-field-name", item.name);
                            holder.append(item.domEl);
                            item.domEl.append(item.containerItemEl);
                        }
                    }
                    $(insertionPoint).remove();
                }

                $(item.containerItemEl).addClass("alpaca-container-item");

                if (i === 0)
                {
                    $(item.containerItemEl).addClass("alpaca-container-item-first");
                }

                if (i + 1 === model.items.length)
                {
                    $(item.containerItemEl).addClass("alpaca-container-item-last");
                }

                $(item.containerItemEl).attr("data-alpaca-container-item-index", i);
                $(item.containerItemEl).attr("data-alpaca-container-item-name", item.name);
                $(item.containerItemEl).attr("data-alpaca-container-item-parent-field-id", self.getId());
                self.registerChild(item, i);
            }

            if (self.options.collapsible)
            {
                self.fireCallback("collapsible");
            }

            self.triggerUpdate();
            callback();
        },

        afterApplyCreatedItems: function(model, callback)
        {
            callback();
        },
        registerChild: function(child, index)
        {
            if (!Alpaca.isEmpty(index))
            {
                this.children.splice(index, 0, child);
            }
            else
            {
                this.children.push(child);
            }

            this.childrenById[child.getId()] = child;
            if (child.propertyId)
            {
                this.childrenByPropertyId[child.propertyId] = child;
            }

            child.parent = this;
        },
        unregisterChild: function(index)
        {
            var child = this.children[index];
            if (!child)
            {
                return;
            }

            if (!Alpaca.isEmpty(index))
            {
                this.children.splice(index, 1);
            }

            delete this.childrenById[child.getId()];
            if (child.propertyId)
            {
                delete this.childrenByPropertyId[child.propertyId];
            }

            child.parent = null;
        },
        updateDOMElement: function()
        {
            var self = this;

            this.base();

            if (self.children.length > 0)
            {
                $(self.getContainerEl()).addClass("alpaca-container-has-items");
                $(self.getContainerEl()).attr("data-alpaca-container-item-count", self.children.length);
            }
            else
            {
                $(self.getContainerEl()).removeClass("alpaca-container-has-items");
                $(self.getContainerEl()).removeAttr("data-alpaca-container-item-count");
            }

            for (var i = 0; i < self.children.length; i++)
            {
                var child = self.children[i];
                if (!child.path)
                {
                    if (child.schema.type === "array")
                    {
                        child.path = self.path + "[" + i + "]";
                    }
                    else
                    {
                        child.path = self.path + "/" + child.propertyId;
                    }
                }

                child.calculateName();

                $(child.containerItemEl).removeClass("alpaca-container-item-first");
                $(child.containerItemEl).removeClass("alpaca-container-item-last");
                $(child.containerItemEl).removeClass("alpaca-container-item-index");
                $(child.containerItemEl).removeClass("alpaca-container-item-key");

                $(child.containerItemEl).addClass("alpaca-container-item");

                if (i === 0)
                {
                    $(child.containerItemEl).addClass("alpaca-container-item-first");
                }
                if (i + 1 === self.children.length)
                {
                    $(child.containerItemEl).addClass("alpaca-container-item-last");
                }

                $(child.containerItemEl).attr("data-alpaca-container-item-index", i);
                $(child.containerItemEl).attr("data-alpaca-container-item-name", child.name);
                $(child.containerItemEl).attr("data-alpaca-container-item-parent-field-id", self.getId());

                self.updateChildDOMWrapperElement(i, child);

                child.updateDOMElement();
            }
        },
        updateChildDOMWrapperElement: function(i, child)
        {

        },
        handleRepositionDOMRefresh: function()
        {
            var self = this;

            if (self.getParent())
            {
                self.getParent().updateDOMElement();
            }
            else
            {
                self.updateDOMElement();
            }
        },
        onDependentReveal: function()
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].onDependentReveal();
            }
        },
        onDependentConceal: function()
        {
            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].onDependentConceal();
            }
        },
        focus: function(onFocusCallback)
        {
            var self = this;

            if (this.isDisplayOnly())
            {
                if (onFocusCallback) {
                    onFocusCallback();
                }
                return;
            }

            this.base();

            var invalidIndex = -1;
            var pageOrderedChildren = [];
            var el = this.getContainerEl();
            if (this.form) {
                el = this.form.getFormEl();
            }
            $(el).find(".alpaca-container-item[data-alpaca-container-item-parent-field-id='" + this.getId() + "']").each(function() {
                var childIndex = $(this).attr("data-alpaca-container-item-index");
                pageOrderedChildren.push(self.children[childIndex]);
            });
            for (var i = 0; i < pageOrderedChildren.length; i++)
            {
                if (pageOrderedChildren[i])
                {
                    if (!pageOrderedChildren[i].isValid(true) &&
                        pageOrderedChildren[i].isControlField &&
                        pageOrderedChildren[i].isAutoFocusable() &&
                        !pageOrderedChildren[i].options.readonly)
                    {
                        invalidIndex = i;
                        break;
                    }
                }
            }
            if (invalidIndex === -1 && pageOrderedChildren.length > 0)
            {
                invalidIndex = 0;
            }
            if (invalidIndex > -1)
            {
                pageOrderedChildren[invalidIndex].focus();

                if (onFocusCallback)
                {
                    onFocusCallback(pageOrderedChildren[invalidIndex]);
                }
            }
        },
        disable: function()
        {
            this.base();

            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].disable();
            }
        },
        enable: function()
        {
            this.base();

            for (var i = 0; i < this.children.length; i++)
            {
                this.children[i].enable();
            }
        },
        getValue: function()
        {
            var self = this;

            var value = self.getContainerValue();

            return value;
        },
        getContainerValue: function()
        {
            return null;
        },

        firstChild: function() {
            var child = null;

            if (this.children.length > 0) {
                child = this.children[0];
            }

            return child;
        },

        lastChild: function() {
            var child = null;

            if (this.children.length > 0) {
                child = this.children[this.children.length - 1];
            }

            return child;
        }
        ,
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "lazyLoading": {
                        "title": "Lazy Loading",
                        "description": "Child fields will only be rendered when the fieldset is expanded if this option is set true.",
                        "type": "boolean",
                        "default": false
                    },
                    "collapsible": {
                        "title": "Collapsible",
                        "description": "Field set is collapsible if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "collapsed": {
                        "title": "Collapsed",
                        "description": "Field set is initially collapsed if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "legendStyle": {
                        "title": "Legend Style",
                        "description": "Field set legend style.",
                        "type": "string",
                        "enum":["button","link"],
                        "default": "button"
                    },
                    "animate": {
                        "title": "Animate movements and transitions",
                        "description": "Up and down transitions will be animated",
                        "type": "boolean",
                        "default": true
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "lazyLoading": {
                        "rightLabel": "Lazy loading child fields ?",
                        "helper": "Lazy loading will be enabled if checked.",
                        "type": "checkbox"
                    },
                    "collapsible": {
                        "rightLabel": "Field set collapsible ?",
                        "helper": "Field set is collapsible if checked.",
                        "type": "checkbox"
                    },
                    "collapsed": {
                        "rightLabel": "Field set initially collapsed ?",
                        "description": "Field set is initially collapsed if checked.",
                        "type": "checkbox"
                    },
                    "legendStyle": {
                        "type":"select"
                    },
                    "animate": {
                        "rightLabel": "Animate movements and transitions",
                        "type": "checkbox"
                    }
                }
            });
        }
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Form = Base.extend(
    {
        constructor: function(domEl, options, viewId, connector, errorCallback) {
            this.domEl = domEl;
            this.parent = null;

            this.connector = connector;
            this.errorCallback = errorCallback;
            this.options = options;

            if (this.options.attributes)
            {
                this.attributes = this.options.attributes;
            }
            else
            {
                this.attributes = {};
            }

            if (this.options.buttons)
            {
                if (this.options.buttons.submit)
                {
                    if (!this.options.buttons.submit.type)
                    {
                        this.options.buttons.submit.type = 'submit';
                    }

                    if (!this.options.buttons.submit.name)
                    {
                        this.options.buttons.submit.name = 'submit';
                    }

                    if (!this.options.buttons.submit.value)
                    {
                        this.options.buttons.submit.value = 'Submit';
                    }
                }

                if (this.options.buttons.reset)
                {
                    if (!this.options.buttons.reset.type)
                    {
                        this.options.buttons.reset.type = 'reset';
                    }
                    if (!this.options.buttons.reset.name)
                    {
                        this.options.buttons.reset.name = 'reset';
                    }
                    if (!this.options.buttons.reset.value)
                    {
                        this.options.buttons.reset.value = 'Reset';
                    }
                }
                for (var k in this.options.buttons)
                {
                    if (this.options.buttons[k].label)
                    {
                        this.options.buttons[k].value = this.options.buttons[k].label;
                    }
                    if (this.options.buttons[k].title)
                    {
                        this.options.buttons[k].value = this.options.buttons[k].title;
                    }
                    if (!this.options.buttons[k].type)
                    {
                        this.options.buttons[k].type = "button";
                    }
                }
            }

            if (this.attributes.id)
            {
                this.id = this.attributes.id;
            }
            else
            {
                this.id = Alpaca.generateId();
                this.attributes.id = this.id;
            }
            if (this.options.buttons && this.options.buttons.submit && Alpaca.isUndefined(this.options.toggleSubmitValidState))
            {
                this.options.toggleSubmitValidState = true;
            }

            this.viewType = options.viewType;
            this.view = new Alpaca.RuntimeView(viewId, this);
            for (var k in this.options.buttons)
            {
                if (!this.options.buttons[k].styles) {
                    this.options.buttons[k].styles = this.view.styles.button;
                }
            }

        },
        render: function(callback)
        {
            var self = this;
            this.processRender(this.domEl, function() {
                self.form.appendTo(self.domEl);
                self.form.addClass("alpaca-form");
                self.fireCallback("form");
                callback(self);
            });
        },

        afterInitialize: function()
        {
            var self = this;

            if (self.options.toggleSubmitValidState) {
                self.adjustSubmitButtonState();

            }

        },
        isFormValid: function()
        {
            this.topControl.validate(true);

            var valid = this.topControl.isValid(true);

            return valid;
        },

        isValid: function()
        {
            return this.isFormValid();
        },

        validate: function(children)
        {
            return this.topControl.validate(children);
        },

        enableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", false);

            if ($.mobile)
            {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        disableSubmitButton: function()
        {
            $(".alpaca-form-button-submit").attrProp("disabled", true);

            if ($.mobile)
            {
                try { $(".alpaca-form-button-submit").button('refresh'); } catch (e) { }
            }
        },

        adjustSubmitButtonState: function()
        {
            this.disableSubmitButton();

            if (this.isFormValid())
            {
                this.enableSubmitButton();
            }
        },
        processRender: function(parentEl, callback)
        {
            var self = this;
            this.formDescriptor = this.view.getTemplateDescriptor("form");
            if (!this.formDescriptor)
            {
                return Alpaca.throwErrorWithCallback("Could not find template descriptor: form");
            }

            var renderedDomElement = Alpaca.tmpl(this.formDescriptor, {
                id: this.getId(),
                options: this.options,
                view: this.view
            });
            renderedDomElement.appendTo(parentEl);

            this.form = renderedDomElement;
            this.formFieldsContainer = $(this.form).find("." + Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD);
            this.formFieldsContainer.removeClass(Alpaca.MARKER_CLASS_FORM_ITEMS_FIELD);

            if (Alpaca.isEmpty(this.form.attr("id")))
            {
                this.form.attr("id", this.getId() + "-form-outer");
            }
            if (Alpaca.isEmpty(this.form.attr("data-alpaca-form-id")))
            {
                this.form.attr("data-alpaca-form-id", this.getId());
            }
            $(parentEl).find("form").attr(this.attributes);
            this.buttons = {};
            $(parentEl).find(".alpaca-form-button").each(function() {

                $(this).click(function(e) {
                    $(this).attr("button-pushed", true);
                });
                var key = $(this).attr("data-key");
                if (key)
                {
                    var buttonConfig = self.options.buttons[key];
                    if (buttonConfig)
                    {
                        if (buttonConfig.click)
                        {
                            $(this).click(function(form, handler) {
                                return function(e) {
                                    e.preventDefault();
                                    handler.call(form, e);
                                }
                            }(self, buttonConfig.click));
                        }
                    }
                }
            });

            callback();
        },
        getId: function()
        {
            return this.id;
        },
        getType: function()
        {
            return this.type;
        },
        getParent: function()
        {
            return this.parent;
        },
        getValue: function()
        {
            return this.topControl.getValue();
        },
        setValue: function(value)
        {
            this.topControl.setValue(value);
        },
        initEvents: function()
        {
            var _this = this;

            var formTag = $(this.domEl).find("form");

            var v = this.getValue();
            $(formTag).submit(v, function(e) {
                return _this.onSubmit(e, _this);
            });
            if (this.options.toggleSubmitValidState)
            {
                $(_this.topControl.getFieldEl()).bind("fieldupdate", function() {
                    _this.adjustSubmitButtonState();
                });

                $(_this.topControl.getFieldEl()).bind("fieldkeyup", function() {
                    _this.adjustSubmitButtonState();
                });

                $(_this.topControl.getFieldEl()).bind("fieldblur", function() {
                    _this.adjustSubmitButtonState();
                });

            }
        },

        getButtonEl: function(buttonId)
        {
            return $(this.domEl).find(".alpaca-form-button-" + buttonId);
        },
        onSubmit: function(e, form)
        {
            if (!this.isFormValid())
            {
                e.stopPropagation();

                this.refreshValidationState(true);

                return false;
            }

            if (this.submitHandler)
            {
                e.stopPropagation();

                var v = this.submitHandler(e, form);
                if (Alpaca.isUndefined(v)) {
                    v = false;
                }

                return v;
            }
        },
        registerSubmitHandler: function (func)
        {
            if (Alpaca.isFunction(func))
            {
                this.submitHandler = func;
            }
        },
        refreshValidationState: function(children, callback)
        {
            this.topControl.refreshValidationState(children, callback);
        },
        disable: function()
        {
            this.topControl.disable();
        },
        enable: function()
        {
            this.topControl.enable();
        },
        focus: function(onFocusCallback)
        {
            this.topControl.focus(function(controlWithFocus) {
                if (onFocusCallback)
                {
                    onFocusCallback(controlWithFocus);
                }
            });
        },
        destroy: function(skipParent)
        {
            this.getFormEl().remove();
            if (!skipParent && this.parent)
            {
                this.parent.destroy();
            }
        },
        show: function()
        {
            this.getFormEl().css({
                "display": ""
            });
        },
        hide: function()
        {
            this.getFormEl().css({
                "display": "none"
            });
        },
        clear: function(stopUpdateTrigger)
        {
            this.topControl.clear(stopUpdateTrigger);
        },
        isEmpty: function()
        {
            return this.topControl.isEmpty();
        },
        fireCallback: function(id, arg1, arg2, arg3, arg4, arg5)
        {
            this.view.fireCallback(this, id, arg1, arg2, arg3, arg4, arg5);
        },
        getFormEl: function() {
            return this.form;
        },
        submit: function()
        {
            this.form.submit();
        },
        ajaxSubmit: function(config)
        {
            var self = this;

            if (!config) {
                config = {};
            }

            config.url = self.options.attributes.action;
            config.type = self.options.attributes.method;

            if (!config.data) {
                config.data = this.getValue();
            }

            if (!config.dataType) {
                config.dataType = "json";
            }
            if (!config.headers) {
                config.headers = {};
            }
            var csrfToken = self.determineCsrfToken();
            if (csrfToken) {
                config.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }

            return $.ajax(config);
        },

        determineCsrfToken: function()
        {
            var csrfToken = Alpaca.CSRF_TOKEN;
            if (!csrfToken)
            {
                for (var t = 0; t < Alpaca.CSRF_COOKIE_NAMES.length; t++)
                {
                    var cookieName = Alpaca.CSRF_COOKIE_NAMES[t];

                    var cookieValue = Alpaca.readCookie(cookieName);
                    if (cookieValue)
                    {
                        csrfToken = cookieValue;
                        break;
                    }
                }
            }

            return csrfToken;
        }

    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    var ONE_HOUR = 3600000;

    Alpaca.Connector = Base.extend(
    {
        constructor: function(id, config)
        {
            this.id = id;
            this.config = config;
            this.isUri = function(resource)
            {
                return !Alpaca.isEmpty(resource) && Alpaca.isUri(resource);
            };

            this.cache = new AjaxCache('URL', true, ONE_HOUR);
        },
        connect: function (onSuccess, onError)
        {
            onSuccess();
        },
        loadTemplate : function (source, onSuccess, onError)
        {
            if (!Alpaca.isEmpty(source))
            {
                if (Alpaca.isUri(source))
                {
                    this.loadUri(source, false, function(loadedData) {

                        if (onSuccess && Alpaca.isFunction(onSuccess))
                        {
                            onSuccess(loadedData);
                        }

                    }, function (loadError) {

                        if (onError && Alpaca.isFunction(onError))
                        {
                            onError(loadError);
                        }
                    });
                }
                else
                {
                    onSuccess(source);
                }
            }
            else
            {
                onError({
                    "message":"Empty data source.",
                    "reason": "TEMPLATE_LOADING_ERROR"
                });
            }
        },
        loadData: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },
        loadSchema: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },
        loadOptions: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },
        loadView: function (resource, resources, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },
        loadAll: function (resources, onSuccess, onError)
        {
            var self = this;

            var onConnectSuccess = function() {

                var dataSource = resources.dataSource;
                var schemaSource = resources.schemaSource;
                var optionsSource = resources.optionsSource;
                var viewSource = resources.viewSource;
                if (!schemaSource && typeof(resources.schema) === "string")
                {
                    schemaSource = resources.schema;
                }
                if (!optionsSource && typeof(resources.options) === "string")
                {
                    optionsSource = resources.options;
                }
                if (!viewSource && typeof(resources.view) === "string")
                {
                    viewSource = resources.view;
                }

                var loaded = {};

                var loadCounter = 0;
                var invocationCount = 0;

                var successCallback = function()
                {
                    if (loadCounter === invocationCount)
                    {
                        if (onSuccess && Alpaca.isFunction(onSuccess))
                        {
                            onSuccess(loaded.data, loaded.options, loaded.schema, loaded.view);
                        }
                    }
                };

                var errorCallback = function (loadError)
                {
                    if (onError && Alpaca.isFunction(onError))
                    {
                        onError(loadError);
                    }
                };
                if (dataSource)
                {
                    invocationCount++;
                }
                if (schemaSource)
                {
                    invocationCount++;
                }
                if (optionsSource)
                {
                    invocationCount++;
                }
                if (viewSource)
                {
                    invocationCount++;
                }
                if (invocationCount === 0)
                {
                    successCallback();
                    return;
                }

                var doMerge = function(p, v1, v2)
                {
                    loaded[p] = v1;

                    if (v2)
                    {
                        if ((typeof(loaded[p]) === "object") && (typeof(v2) === "object"))
                        {
                            Alpaca.mergeObject(loaded[p], v2);
                        }
                        else
                        {
                            loaded[p] = v2;
                        }
                    }
                };
                if (dataSource)
                {
                    self.loadData(dataSource, resources, function(data) {

                        doMerge("data", resources.data, data);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (schemaSource)
                {
                    self.loadSchema(schemaSource, resources, function(schema) {

                        doMerge("schema", resources.schema, schema);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (optionsSource)
                {
                    self.loadOptions(optionsSource, resources, function(options) {

                        doMerge("options", resources.options, options);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }
                if (viewSource)
                {
                    self.loadView(viewSource, resources, function(view) {

                        doMerge("view", resources.view, view);

                        loadCounter++;
                        successCallback();
                    }, errorCallback);
                }

            };

            var onConnectError  = function(err) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError(err);
                }
            };

            self.connect(onConnectSuccess, onConnectError);
        },
        loadJson : function(uri, onSuccess, onError) {
            this.loadUri(uri, true, onSuccess, onError);
        } ,
        buildAjaxConfig: function(uri, isJson)
        {
            var ajaxConfig = {
                "url": uri,
                "type": "get"
            };

            if (isJson) {
                ajaxConfig.dataType = "json";
            } else {
                ajaxConfig.dataType = "text";
            }

            return ajaxConfig;
        },
        loadUri : function(uri, isJson, onSuccess, onError) {

            var self = this;

            var ajaxConfig = self.buildAjaxConfig(uri, isJson);

            ajaxConfig["success"] = function(jsonDocument) {

                self.cache.put(uri, jsonDocument);

                if (onSuccess && Alpaca.isFunction(onSuccess)) {
                    onSuccess(jsonDocument);
                }
            };
            ajaxConfig["error"] = function(jqXHR, textStatus, errorThrown) {
                if (onError && Alpaca.isFunction(onError)) {
                    onError({
                        "message":"Unable to load data from uri : " + uri,
                        "stage": "DATA_LOADING_ERROR",
                        "details": {
                            "jqXHR" : jqXHR,
                            "textStatus" : textStatus,
                            "errorThrown" : errorThrown
                        }
                    });
                }
            };

            var cachedDocument = self.cache.get(uri);

            if (cachedDocument !== false && onSuccess && Alpaca.isFunction(onSuccess)) {
                onSuccess(cachedDocument);
            } else {
                $.ajax(ajaxConfig);
            }
        },
        loadReferenceSchema: function (resource, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },
        loadReferenceOptions: function (resource, successCallback, errorCallback)
        {
            return this._handleLoadJsonResource(resource, successCallback, errorCallback);
        },

        _handleLoadJsonResource: function (resource, successCallback, errorCallback)
        {
            if (this.isUri(resource))
            {
                this.loadJson(resource, function(loadedResource) {
                    successCallback(loadedResource);
                }, errorCallback);
            }
            else
            {
                successCallback(resource);
            }
        },
        loadDataSource: function (config, successCallback, errorCallback)
        {
            return this._handleLoadDataSource(config, successCallback, errorCallback);
        },

        _handleLoadDataSource: function(config, successCallback, errorCallback)
        {
            var url = config;
            if (Alpaca.isObject(url)) {
                url = config.url;
            }

            return this._handleLoadJsonResource(url, successCallback, errorCallback);
        }

    });

    Alpaca.registerConnectorClass("default", Alpaca.Connector);


    /*!
     * ajax-cache JavaScript Library v0.2.1
     * http://code.google.com/p/ajax-cache/
     *
     * Includes few JSON methods (open source)
     * http://www.json.org/js.html
     *
     * Date: 2010-08-03
     */
    var AjaxCache = function AjaxCache(type, on, lifetime) {
        if (on) {
            this.on = true;
        } else {
            this.on = false;
        }
        if (lifetime != null) {
            this.defaultLifetime = lifetime;
        }
        this.type = type;
        switch (this.type) {
            case 'URL':
                this.put = this.put_url;
                break;
            case 'GET':
                this.put = this.put_GET;
                break;
        }

    };

    AjaxCache.prototype.on = false;
    AjaxCache.prototype.type = undefined;
    AjaxCache.prototype.defaultLifetime = 1800000; // 1800000=30min, 300000=5min, 30000=30sec
    AjaxCache.prototype.items = {};
    AjaxCache.prototype.put_url = function(url, response, lifetime) {
        if (lifetime == null) {
            lifetime = this.defaultLifetime;
        }
        var key = this.make_key(url);
        this.items[key] = {};
        this.items[key].key = key;
        this.items[key].url = url;
        this.items[key].response = response;
        this.items[key].expire = (new Date().getTime()) + lifetime;
        return true;
    };
    AjaxCache.prototype.put_GET = function(url, data, response, lifetime) {
        if (lifetime == null) {
            lifetime = this.defaultLifetime;
        }
        var key = this.make_key(url, [ data ]);
        this.items[key] = {};
        this.items[key].key = key;
        this.items[key].url = url;
        this.items[key].data = data;
        this.items[key].response = response;
        this.items[key].expire = (new Date().getTime()) + lifetime;
        return true;
    };
    AjaxCache.prototype.get = function(url, params) {
        var key = this.make_key(url, params);
        if (this.items[key] == null) {
            return false;
        }
        if (this.items[key].expire < (new Date().getTime())) {
            return false;
        }
        return this.items[key].response;
    };
    AjaxCache.prototype.make_key = function(url, params) {
        var key = url;
        switch (this.type) {
            case 'URL':
                break;
            case 'GET':
                key += this.stringify(params[0]);
                break;
        }

        return key;
    };
    AjaxCache.prototype.flush = function() {
        cache.items = {};
        return true;
    };
    AjaxCache.prototype.stringify = function(value, replacer, space) {

        var i;
        gap = '';
        indent = '';

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

        } else if (typeof space === 'string') {
            indent = space;
        }

        rep = replacer;
        if (replacer &&
              typeof replacer !== 'function' &&
              (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

        return this.str('', {
            '' : value
        });
    };

    AjaxCache.prototype.quote = function(string) {

        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable,
            function(a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a
                    .charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
    };

    AjaxCache.prototype.str = function(key, holder) {

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length, mind = gap, partial, value = holder[key];

        if (value &&
            typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
            case 'string':
                return this.quote(value);

            case 'number':

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                return String(value);

            case 'object':

                if (!value) {
                    return 'null';
                }

                gap += indent;
                partial = [];

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = this.str(i, value) || 'null';
                    }

                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap +
                        partial.join(',\n' + gap) + '\n' + mind + ']' :
                        '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = this.str(k, value);
                            if (v) {
                                partial.push(this.quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = this.str(k, value);
                            if (v) {
                                partial.push(this.quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                v = partial.length === 0 ?
                  '{}' : gap ?
                    '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                    '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    };

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.CloudCmsConnector = Alpaca.Connector.extend(
    {
        connect: function (onSuccess, onError)
        {
            var self = this;

            var cfn = function(err, branch)
            {
                if (err)
                {
                    onError(err);
                    return;
                }

                if (branch)
                {
                    self.branch = Chain(branch);

                    self.bindHelperFunctions(self.branch);
                }

                onSuccess();
            };

            if (Alpaca.globalContext && Alpaca.globalContext.branch)
            {
                cfn(null, Alpaca.globalContext.branch);
            }
            else
            {
                self.branch = null;

                self.doConnect(function (err, branch) {
                    cfn(err, branch);
                });
            }
        },

        doConnect: function(callback)
        {
            var self = this;

            if (!this.config.key) {
                this.config.key = "default";
            }

            Gitana.connect(this.config, function(err) {

                if (err) {
                    callback(err);
                    return;
                }

                if (this.getDriver().getOriginalConfiguration().loadAppHelper)
                {
                    this.datastore("content").readBranch("master").then(function() {
                        callback(null, this);
                    });
                }
                else
                {
                    callback();
                }
            });
        },

        bindHelperFunctions: function(branch)
        {
            if (!branch.loadAlpacaSchema)
            {
                branch.loadAlpacaSchema = function(schemaIdentifier, resources, callback)
                {
                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/schema";
                    };

                    var params = {};
                    params["id"] = schemaIdentifier;

                    return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                        callback.call(this, null, response);
                    });
                };
            }

            if (!branch.loadAlpacaOptions)
            {
                branch.loadAlpacaOptions = function(optionsIdentifier, resources, callback)
                {
                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/options";
                    };

                    var params = {};
                    params["schemaId"] = resources.schemaSource;
                    params["id"] = optionsIdentifier;

                    return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                        callback.call(this, null, response);
                    });
                };
            }

            if (!branch.loadAlpacaData)
            {
                branch.loadAlpacaData = function(dataIdentifier, resources, callback)
                {
                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/data";
                    };

                    var params = {};
                    params["id"] = dataIdentifier;

                    return this.chainGetResponse(this, uriFunction, params).then(function(response) {
                        callback.call(this, null, response);
                    });
                };
            }

            if (!branch.loadAlpacaDataSource)
            {
                branch.loadAlpacaDataSource = function(config, pagination, callback)
                {
                    var params = {};
                    if (pagination)
                    {
                        Alpaca.copyInto(params, pagination);
                    }

                    var uriFunction = function()
                    {
                        return branch.getUri() + "/alpaca/datasource";
                    };

                    return this.chainPostResponse(this, uriFunction, params, config).then(function(response) {
                        callback.call(this, null, response.datasource);
                    });
                };
            }

        },
        loadData: function (nodeId, resources, successCallback, errorCallback)
        {
            var self = this;
            if (!self.branch)
            {
                return this.base(nodeId, resources, successCallback, errorCallback);
            }
            self.branch.loadAlpacaData(nodeId, resources, function(err, data) {

                if (err)
                {
                    errorCallback(err);
                    return;
                }

                var obj = null;

                if (data)
                {
                    obj = JSON.parse(JSON.stringify(data));
                }

                successCallback(obj);
            });
        },
        loadSchema: function (schemaIdentifier, resources, successCallback, errorCallback)
        {
            var self = this;
            if (!self.branch)
            {
                return this.base(schemaIdentifier, resources, successCallback, errorCallback);
            }
            self.branch.loadAlpacaSchema(schemaIdentifier, resources, function(err, schema) {

                if (err)
                {
                    errorCallback(err);
                    return;
                }

                successCallback(schema);
            });
        },
        loadOptions: function (optionsIdentifier, resources, successCallback, errorCallback)
        {
            var self = this;
            if (!self.branch)
            {
                return this.base(optionsIdentifier, resources, successCallback, errorCallback);
            }
            self.branch.loadAlpacaOptions(optionsIdentifier, resources, function(err, options) {

                if (err)
                {
                    errorCallback(err);
                    return;
                }

                if (!options) {
                    options = {};
                }
                options.form.buttons = {
                    "submit": {
                        "title": "Submit",
                        "click": function(e) {

                            var form = this;

                            var value = this.getValue();
                            if (!value) {
                                value = {};
                            }

                            var promise = this.ajaxSubmit({
                                "xhrFields": {
                                    "withCredentials": true
                                },
                                "crossDomain": true,
                                "processData": false,
                                "data": JSON.stringify(value),
                                "contentType": "application/json; charset=utf-8"
                            });
                            promise.done(function () {
                                form.topControl.trigger("formSubmitSuccess");
                            });
                            promise.fail(function () {
                                form.topControl.trigger("formSubmitFail");
                            });
                        }
                    }
                };

                if (typeof(options.focus) === "undefined")
                {
                    options.focus = Alpaca.defaultFocus;
                }
                options.form.attributes.action = self.config.baseURL + options.form.attributes.action;

                successCallback(options);
            });
        },
        loadReferenceSchema: function (schemaIdentifier, successCallback, errorCallback)
        {
            var self = this;

            return self.loadSchema(schemaIdentifier, successCallback, errorCallback);
        },
        loadReferenceOptions: function (optionsIdentifier, successCallback, errorCallback)
        {
            var self = this;

            return self.loadOptions(optionsIdentifier, successCallback, errorCallback);
        },
        loadDataSource: function (config, successCallback, errorCallback)
        {
            var self = this;
            if (!self.branch)
            {
                return this.base(config, successCallback, errorCallback);
            }

            var pagination = config.pagination;
            delete config.pagination;

            return self.branch.loadAlpacaDataSource(config, pagination, function(err, array) {
                if (err) {
                    errorCallback(err);
                    return;
                }

                successCallback(array);
            });
        }

    });

    Alpaca.registerConnectorClass("cloudcms", Alpaca.CloudCmsConnector);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextField = Alpaca.ControlField.extend(
    {
        getFieldType: function()
        {
            return "text";
        },
        setup: function()
        {
            this.base();
            if (!this.inputType)
            {
                this.inputType = "text";
            }

            if (this.options.inputType)
            {
                this.inputType = this.options.inputType;
            }
            if (!this.options.data)
            {
                this.options.data = {};
            }
            if (!this.options.attributes)
            {
                this.options.attributes = {};
            }

            if (typeof(this.options.allowOptionalEmpty) === "undefined")
            {
                this.options.allowOptionalEmpty = true;
            }
            if (this.options.autocomplete && typeof(this.options.autocomplete) === "string")
            {
                if (this.options.autocomplete.toLowerCase() === "on")
                {
                    this.options.autocomplete = true;
                }
                else if (this.options.autocomplete.toLowerCase() === "true")
                {
                    this.options.autocomplete = true;
                }
                else if (this.options.autocomplete.toLowerCase() === "yes")
                {
                    this.options.autocomplete = true;
                }
                else
                {
                    this.options.autocomplete = false;
                }
            }

            if (typeof(this.options.autocomplete) === "undefined")
            {
                this.options.autocomplete = false;
            }

            if (typeof(this.options.disallowEmptySpaces) === "undefined")
            {
                this.options.disallowEmptySpaces = false;
            }

            if (typeof(this.options.disallowOnlyEmptySpaces) === "undefined")
            {
                this.options.disallowOnlyEmptySpaces = false;
            }
        },
        destroy: function()
        {
            this.base();
            if ( this.control && this.control.typeahead && this.options.typeahead)
            {
                $(this.control).typeahead('destroy');
            }
        },
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.control)
                {
                    self.applyAutocomplete();
                    self.applyMask();
                    self.applyTypeAhead();
                    self.updateMaxLengthIndicator();
                }

                callback();
            });
        },

        applyAutocomplete: function()
        {
            var self = this;
            if (typeof(self.options.autocomplete) !== "undefined")
            {
                $(self.field).addClass("alpaca-autocomplete");
                $(self.control).attr("autocomplete", (self.options.autocomplete ? "on" : "off"));
                self.fireCallback("autocomplete");
            }
        },

        applyMask: function()
        {
            var self = this;
            if (self.control.mask && self.options.maskString)
            {
                self.control.mask(self.options.maskString);
            }
        },

        applyTypeAhead: function()
        {
            var self = this;

            if (self.control.typeahead && self.options.typeahead && !Alpaca.isEmpty(self.options.typeahead))
            {
                var tConfig = self.options.typeahead.config;
                if (!tConfig) {
                    tConfig = {};
                }

                var tDatasets = self.options.typeahead.datasets;
                if (!tDatasets) {
                    tDatasets = {};
                }

                if (!tDatasets.name) {
                    tDatasets.name = self.getId();
                }

                var tEvents = self.options.typeahead.events;
                if (!tEvents) {
                    tEvents = {};
                }
                if (tDatasets.type === "local" || tDatasets.type === "remote" || tDatasets.type === "prefetch")
                {
                    var bloodHoundConfig = {
                        datumTokenizer: function(d) {
                            var tokens = "";
                            for (var k in d) {
                                if (d.hasOwnProperty(k) || d[k]) {
                                    tokens += " " + d[k];
                                }
                            }
                            return Bloodhound.tokenizers.whitespace(tokens);
                        },
                        queryTokenizer: Bloodhound.tokenizers.whitespace
                    };

                    if (tDatasets.type === "local" )
                    {
                        var local = [];

                        if (typeof(tDatasets.source) === "function")
                        {
                            bloodHoundConfig.local = tDatasets.source;
                        }
                        else
                        {
                            for (var i = 0; i < tDatasets.source.length; i++)
                            {
                                var localElement = tDatasets.source[i];
                                if (typeof(localElement) === "string")
                                {
                                    localElement = {
                                        "value": localElement
                                    };
                                }

                                local.push(localElement);
                            }

                            bloodHoundConfig.local = local;
                        }

                        if (tDatasets.local)
                        {
                            bloodHoundConfig.local = tDatasets.local;
                        }
                    }

                    if (tDatasets.type === "prefetch")
                    {
                        bloodHoundConfig.prefetch = {
                            url: tDatasets.source
                        };

                        if (tDatasets.filter)
                        {
                            bloodHoundConfig.prefetch.filter = tDatasets.filter;
                        }
                    }

                    if (tDatasets.type === "remote")
                    {
                        bloodHoundConfig.remote = {
                            url: tDatasets.source
                        };

                        if (tDatasets.filter)
                        {
                            bloodHoundConfig.remote.filter = tDatasets.filter;
                        }

                        if (tDatasets.replace)
                        {
                            bloodHoundConfig.remote.replace = tDatasets.replace;
                        }
                    }

                    var engine = new Bloodhound(bloodHoundConfig);
                    engine.initialize();
                    tDatasets.source = engine.ttAdapter();
                }
                if (tDatasets.templates)
                {
                    for (var k in tDatasets.templates)
                    {
                        var template = tDatasets.templates[k];
                        if (typeof(template) === "string")
                        {
                            tDatasets.templates[k] = Handlebars.compile(template);
                        }
                    }
                }
                $(self.control).typeahead(tConfig, tDatasets);
                $(self.control).on("typeahead:autocompleted", function(event, datum) {
                    self.setValue(datum.value);
                    $(self.control).change();
                });
                $(self.control).on("typeahead:selected", function(event, datum) {
                    self.setValue(datum.value);
                    $(self.control).change();
                });
                if (tEvents)
                {
                    if (tEvents.autocompleted) {
                        $(self.control).on("typeahead:autocompleted", function(event, datum) {
                            tEvents.autocompleted(event, datum);
                        });
                    }
                    if (tEvents.selected) {
                        $(self.control).on("typeahead:selected", function(event, datum) {
                            tEvents.selected(event, datum);
                        });
                    }
                }
                var fi = $(self.control);
                $(self.control).change(function() {

                    var value = $(this).val();

                    var newValue = $(fi).typeahead('val');
                    if (newValue !== value)
                    {
                        $(fi).typeahead('val', newValue);
                    }

                });
                $(self.field).find("span.twitter-typeahead").first().css("display", "block"); // SPAN to behave more like DIV, next line
                $(self.field).find("span.twitter-typeahead input.tt-input").first().css("background-color", "");
            }
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.inputType = self.inputType;

                callback(model);
            });
        },

        updateMaxLengthIndicator: function()
        {
            var self = this;

            var errState = false;

            var message = "";
            if (!Alpaca.isEmpty(self.schema.maxLength) && self.options.showMaxLengthIndicator)
            {
                var val = self.getValue() || "";

                var diff = self.schema.maxLength - val.length;
                if (diff >= 0)
                {
                    message = "You have " + diff + " characters remaining";
                }
                else
                {
                    message = "Your message is too long by " + (diff*-1) + " characters";
                    errState = true;
                }

                var indicator = $(self.field).find(".alpaca-field-text-max-length-indicator");
                if (indicator.length === 0)
                {
                    indicator = $("<p class='alpaca-field-text-max-length-indicator'></p>");
                    $(self.control).after(indicator);
                }

                $(indicator).html(message);
                $(indicator).removeClass("err");
                if (errState)
                {
                    $(indicator).addClass("err");
                }
            }

        },
        getControlValue: function()
        {
            var self = this;

            var value = this._getControlVal(true);

            if (self.control.mask && self.options.maskString)
            {
                var fn = $(this.control).data($.mask.dataName);
                if (fn)
                {
                    value = fn();
                    value = self.ensureProperType(value);
                }
            }

            return value;
        },
        setValue: function(value)
        {
            if (this.control && this.control.length > 0)
            {
                if (Alpaca.isEmpty(value))
                {
                    this.control.val("");
                }
                else
                {
                    this.control.val(value);
                }
            }
            this.base(value);
            this.updateMaxLengthIndicator();
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status =  this._validatePattern();
            valInfo["invalidPattern"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidPattern"), [this.schema.pattern]),
                "status": status
            };

            status = this._validateMaxLength();
            valInfo["stringTooLong"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringTooLong"), [this.schema.maxLength]),
                "status": status
            };

            status = this._validateMinLength();
            valInfo["stringTooShort"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringTooShort"), [this.schema.minLength]),
                "status": status
            };

            return baseStatus && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },
        _validatePattern: function()
        {
            if (this.schema.pattern)
            {
                var val = this.getValue();

                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }

                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }

                if (typeof(val) === "string")
                {
                    if (!val.match(this.schema.pattern))
                    {
                        return false;
                    }
                }
            }

            return true;
        },
        _validateMinLength: function()
        {
            if (!Alpaca.isEmpty(this.schema.minLength))
            {
                var val = this.getValue();
                if(val !== val) {
                    val = "";
                }
                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }
                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }
                if ((""+val).length < this.schema.minLength)
                {
                    return false;
                }
            }
            return true;
        },
        _validateMaxLength: function()
        {
            if (!Alpaca.isEmpty(this.schema.maxLength))
            {
                var val = this.getValue();
                if (val === "" && this.options.allowOptionalEmpty && !this.isRequired())
                {
                    return true;
                }
                if (Alpaca.isEmpty(val))
                {
                    val = "";
                }
                if ((""+val).length > this.schema.maxLength)
                {
                    return false;
                }
            }
            return true;
        },
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {

                var el = $(this.control).get(0);

                try {
                    var elemLen = el.value ? el.value.length : 0;
                    el.selectionStart = elemLen;
                    el.selectionEnd = elemLen;
                }
                catch (e) {
                }

                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }

            }
        },
        getType: function() {
            return "string";
        },
        onKeyPress: function(e)
        {
            var self = this;
            if (e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
                return;
            }

            if (e.keyCode === 8) // backspace
            {
                if (!Alpaca.isEmpty(self.schema.minLength) && (self.options.constrainLengths || self.options.constrainMinLength))
                {
                    var newValue = self.getValue() || "";
                    if (newValue.length <= self.schema.minLength)
                    {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }
            else
            {
                if (!Alpaca.isEmpty(self.schema.maxLength) && (self.options.constrainLengths || self.options.constrainMaxLength))
                {
                    var newValue = self.getValue() || "";
                    if (newValue.length >= self.schema.maxLength)
                    {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }

            if (e.keyCode === 32) // space
            {
                if (self.options.disallowEmptySpaces)
                {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        },

        onKeyUp: function(e)
        {
            var self = this;
            self.updateMaxLengthIndicator();
            $(this.field).trigger("fieldkeyup");
        }
        ,
        getTitle: function() {
            return "Single-Line Text";
        },
        getDescription: function() {
            return "Text field for single-line text.";
        },
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "minLength": {
                        "title": "Minimal Length",
                        "description": "Minimal length of the property value.",
                        "type": "number"
                    },
                    "maxLength": {
                        "title": "Maximum Length",
                        "description": "Maximum length of the property value.",
                        "type": "number"
                    },
                    "pattern": {
                        "title": "Pattern",
                        "description": "Regular expression for the property value.",
                        "type": "string"
                    }
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "default": {
                        "helper": "Field default value",
                        "type": "text"
                    },
                    "minLength": {
                        "type": "integer"
                    },
                    "maxLength": {
                        "type": "integer"
                    },
                    "pattern": {
                        "type": "text"
                    }
                }
            });
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "size": {
                        "title": "Field Size",
                        "description": "Field size.",
                        "type": "number",
                        "default":40
                    },
                    "maskString": {
                        "title": "Mask Expression",
                        "description": "Expression for the field mask. Field masking will be enabled if not empty.",
                        "type": "string"
                    },
                    "placeholder": {
                        "title": "Field Placeholder",
                        "description": "Field placeholder.",
                        "type": "string"
                    },
                    "typeahead": {
                        "title": "Type Ahead",
                        "description": "Provides configuration for the $.typeahead plugin if it is available.  For full configuration options, see: https://github.com/twitter/typeahead.js"
                    },
                    "allowOptionalEmpty": {
                        "title": "Allow Optional Empty",
                        "description": "Allows this non-required field to validate when the value is empty"
                    },
                    "inputType": {
                        "title": "HTML5 Input Type",
                        "description": "Allows for the override of the underlying HTML5 input type.  If not specified, an assumed value is provided based on the kind of input control (i.e. 'text', 'date', 'email' and so forth)",
                        "type": "string"
                    },
                    "data": {
                        "title": "Data attributes for the underlying DOM input control",
                        "description": "Allows you to specify a key/value map of data attributes that will be added as DOM attribuets for the underlying input control.  The data attributes will be added as data-{name}='{value}'.",
                        "type": "object"
                    },
                    "autocomplete": {
                        "title": "HTML autocomplete attribute for the underlying DOM input control",
                        "description": "Allows you to specify the autocomplete attribute for the underlying input control whether or not field should have autocomplete enabled.",
                        "type": "string"
                    },
                    "disallowEmptySpaces": {
                        "title": "Disallow Empty Spaces",
                        "description": "Whether to disallow the entry of empty spaces in the text",
                        "type": "boolean",
                        "default": false
                    },
                    "disallowOnlyEmptySpaces": {
                        "title": "Disallow Only Empty Spaces",
                        "description": "Whether to disallow the entry of only empty spaces in the text",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "size": {
                        "type": "integer"
                    },
                    "maskString": {
                        "helper": "a - an alpha character;9 - a numeric character;* - an alphanumeric character",
                        "type": "text"
                    },
                    "typeahead": {
                        "type": "object"
                    },
                    "allowOptionalEmpty": {
                        "type": "checkbox"
                    },
                    "inputType": {
                        "type": "text"
                    },
                    "data": {
                        "type": "object"
                    }
                }
            });
        }

    });

    Alpaca.registerMessages({
        "invalidPattern": "This field should have pattern {0}",
        "stringTooShort": "This field should contain at least {0} numbers or characters",
        "stringTooLong": "This field should contain at most {0} numbers or characters"
    });
    Alpaca.registerFieldClass("text", Alpaca.Fields.TextField);
    Alpaca.registerDefaultSchemaFieldMapping("string", "text");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TextAreaField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function()
        {
            return "textarea";
        },
        setup: function()
        {
            this.base();

            if (!this.options.rows) {
                this.options.rows = 5;
            }

            if (!this.options.cols) {
                this.options.cols = 40;
            }
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status =  this._validateWordCount();
            valInfo["wordLimitExceeded"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("wordLimitExceeded"), [this.options.wordlimit]),
                "status": status
            };

            return baseStatus && valInfo["wordLimitExceeded"]["status"];
        },
        _validateWordCount: function()
        {
            if (this.options.wordlimit && this.options.wordlimit > -1)
            {
                var val = this.data;

                if (val)
                {
                    var wordcount = val.split(" ").length;
                    if (wordcount > this.options.wordlimit)
                    {
                        return false;
                    }
                }
            }

            return true;
        }
        ,
        getTitle: function() {
            return "Multi-Line Text";
        },
        getDescription: function() {
            return "Textarea field for multiple line text.";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "rows": {
                        "title": "Rows",
                        "description": "Number of rows",
                        "type": "number",
                        "default": 5
                    },
                    "cols": {
                        "title": "Columns",
                        "description": "Number of columns",
                        "type": "number",
                        "default": 40
                    },
                    "wordlimit": {
                        "title": "Word Limit",
                        "description": "Limits the number of words allowed in the text area.",
                        "type": "number",
                        "default": -1
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "rows": {
                        "type": "integer"
                    },
                    "cols": {
                        "type": "integer"
                    },
                    "wordlimit": {
                        "type": "integer"
                    }
                }
            });
        }

    });

    Alpaca.registerMessages({
        "wordLimitExceeded": "The maximum word limit of {0} has been exceeded."
    });

    Alpaca.registerFieldClass("textarea", Alpaca.Fields.TextAreaField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CheckBoxField = Alpaca.ControlField.extend(
        {
            getFieldType: function() {
                return "checkbox";
            },
            setup: function() {

                var self = this;

                self.base();

                if (typeof(self.options.multiple) == "undefined")
                {
                    if (self.schema.type === "array")
                    {
                        self.options.multiple = true;
                    }
                    else if (typeof(self.schema["enum"]) !== "undefined")
                    {
                        self.options.multiple = true;
                    }
                }

                if (self.options.multiple)
                {

                    self.checkboxOptions = [];
                    if (self.getEnum())
                    {
                        self.sortEnum();

                        var optionLabels = self.getOptionLabels();

                        $.each(self.getEnum(), function (index, value) {

                            var text = value;
                            if (optionLabels)
                            {
                                if (!Alpaca.isEmpty(optionLabels[index]))
                                {
                                    text = optionLabels[index];
                                }
                                else if (!Alpaca.isEmpty(optionLabels[value]))
                                {
                                    text = optionLabels[value];
                                }
                            }

                            self.checkboxOptions.push({
                                "value": value,
                                "text": text
                            });
                        });
                    }
                    if (self.options.datasource && !self.options.dataSource) {
                        self.options.dataSource = self.options.datasource;
                        delete self.options.datasource;
                    }
                    if (typeof(self.options.useDataSourceAsEnum) === "undefined")
                    {
                        self.options.useDataSourceAsEnum = true;
                    }
                }
                else
                {

                    if (!this.options.rightLabel) {
                        this.options.rightLabel = "";
                    }
                }
            },

            prepareControlModel: function(callback)
            {
                var self = this;

                this.base(function(model) {

                    if (self.checkboxOptions)
                    {
                        model.checkboxOptions = self.checkboxOptions;
                    }

                    callback(model);
                });
            },
            getEnum: function()
            {
                var values = this.base();
                if (!values)
                {
                    if (this.schema && this.schema.items && this.schema.items.enum)
                    {
                        values = this.schema.items.enum;
                    }
                }

                return values;
            },
            getOptionLabels: function()
            {
                var values = this.base();
                if (!values)
                {
                    if (this.options && this.options.items && this.options.items.optionLabels)
                    {
                        values = this.options.items.optionLabels;
                    }
                }

                return values;
            },
            onClick: function(e)
            {
                this.refreshValidationState();
            },
            beforeRenderControl: function(model, callback)
            {
                var self = this;

                this.base(model, function() {

                    if (self.options.dataSource)
                    {
                        self.options.multiple = true;

                        if (!self.checkboxOptions) {
                            model.checkboxOptions = self.checkboxOptions = [];
                        }
                        self.checkboxOptions.length = 0;

                        self.invokeDataSource(self.checkboxOptions, model, function(err) {

                            if (self.options.useDataSourceAsEnum)
                            {
                                var _enum = [];
                                var _optionLabels = [];
                                for (var i = 0; i < self.checkboxOptions.length; i++)
                                {
                                    _enum.push(self.checkboxOptions[i].value);
                                    _optionLabels.push(self.checkboxOptions[i].text);
                                }

                                self.setEnum(_enum);
                                self.setOptionLabels(_optionLabels);
                            }

                            callback();
                        });
                    }
                    else
                    {
                        callback();
                    }

                });
            },
            postRender: function(callback) {

                var self = this;

                this.base(function() {
                    if (self.data && typeof(self.data) !== "undefined")
                    {
                        self.setValue(self.data);
                    }
                    if (self.options.multiple)
                    {
                        $(self.getFieldEl()).find("input:checkbox").prop("checked", false);

                        if (self.data)
                        {
                            var dataArray = self.data;
                            if (typeof(self.data) === "string")
                            {
                                dataArray = self.data.split(",");
                                for (var a = 0; a < dataArray.length; a++)
                                {
                                    dataArray[a] = $.trim(dataArray[a]);
                                }
                            }

                            for (var k in dataArray)
                            {
                                $(self.getFieldEl()).find("input:checkbox[data-checkbox-value=\"" + dataArray[k] + "\"]").prop("checked", true);
                            }
                        }
                    }
                    $(self.getFieldEl()).find("input:checkbox").change(function(evt) {
                        self.triggerWithPropagation("change");
                    });

                    callback();
                });
            },
            getControlValue: function()
            {
                var self = this;

                var value = null;

                if (!self.options.multiple)
                {
                    var input = $(self.getFieldEl()).find("input");
                    if (input.length > 0)
                    {
                        value = Alpaca.checked($(input[0]));
                    }
                    else
                    {
                        value = false;
                    }
                }
                else
                {
                    var values = [];
                    for (var i = 0; i < self.checkboxOptions.length; i++)
                    {
                        var inputField = $(self.getFieldEl()).find("input[data-checkbox-index='" + i + "']");
                        if (Alpaca.checked(inputField))
                        {
                            var v = $(inputField).attr("data-checkbox-value");
                            values.push(v);
                        }
                    }
                    if (self.schema.type === "array")
                    {
                        value = values;
                    }
                    else if (self.schema.type === "string")
                    {
                        value = values.join(",");
                    }
                }

                return value;
            },
            setValue: function(value)
            {
                var self = this;

                var applyScalarValue = function(value)
                {
                    if (Alpaca.isString(value)) {
                        value = (value === "true");
                    }

                    var input = $(self.getFieldEl()).find("input");
                    if (input.length > 0)
                    {
                        Alpaca.checked($(input[0]), value);
                    }
                };

                var applyMultiValue = function(values)
                {
                    if (typeof(values) === "string")
                    {
                        values = values.split(",");
                    }
                    for (var i = 0; i < values.length; i++)
                    {
                        values[i] = Alpaca.trim(values[i]);
                    }
                    Alpaca.checked($(self.getFieldEl()).find("input[data-checkbox-value]"), false);
                    for (var j = 0; j < values.length; j++)
                    {
                        var input = $(self.getFieldEl()).find("input[data-checkbox-value=\"" + values[j] + "\"]");
                        if (input.length > 0)
                        {
                            Alpaca.checked($(input[0]), value);
                        }
                    }
                };

                var applied = false;

                if (!self.options.multiple)
                {
                    if (typeof(value) === "boolean")
                    {
                        applyScalarValue(value);
                        applied = true;
                    }
                    else if (typeof(value) === "string")
                    {
                        applyScalarValue(value);
                        applied = true;
                    }
                }
                else
                {

                    if (typeof(value) === "string")
                    {
                        applyMultiValue(value);
                        applied = true;
                    }
                    else if (Alpaca.isArray(value))
                    {
                        applyMultiValue(value);
                        applied = true;
                    }
                }

                if (!applied && value)
                {
                    Alpaca.logError("CheckboxField cannot set value for schema.type=" + self.schema.type + " and value=" + value);
                }
                this.base(value);
            },
            _validateEnum: function()
            {
                var self = this;

                if (!self.options.multiple)
                {
                    return true;
                }

                var val = self.getValue();
                if (!self.isRequired() && Alpaca.isValEmpty(val))
                {
                    return true;
                }
                if (typeof(val) === "string")
                {
                    val = val.split(",");
                }

                return Alpaca.anyEquality(val, self.getEnum());
            },
            disable: function()
            {
                $(this.control).find("input").each(function() {
                    $(this).disabled = true;
                    $(this).prop("disabled", true);
                });
            },
            enable: function()
            {
                $(this.control).find("input").each(function() {
                    $(this).disabled = false;
                    $(this).prop("disabled", false);
                });
            },
            getType: function() {
                return "boolean";
            },
            getTitle: function() {
                return "Checkbox Field";
            },
            getDescription: function() {
                return "Checkbox Field for boolean (true/false), string ('true', 'false' or comma-delimited string of values) or data array.";
            },
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "rightLabel": {
                            "title": "Option Label",
                            "description": "Optional right-hand side label for single checkbox field.",
                            "type": "string"
                        },
                        "multiple": {
                            "title": "Multiple",
                            "description": "Whether to render multiple checkboxes for multi-valued type (such as an array or a comma-delimited string)",
                            "type": "boolean"
                        },
                        "dataSource": {
                            "title": "Option DataSource",
                            "description": "Data source for generating list of options.  This can be a string or a function.  If a string, it is considered to be a URI to a service that produces a object containing key/value pairs or an array of elements of structure {'text': '', 'value': ''}.  This can also be a function that is called to produce the same list.",
                            "type": "string"
                        },
                        "useDataSourceAsEnum": {
                            "title": "Use Data Source as Enumerated Values",
                            "description": "Whether to constrain the field's schema enum property to the values that come back from the data source.",
                            "type": "boolean",
                            "default": true
                        }
                    }
                });
            },
            getOptionsForOptions: function() {
                return Alpaca.merge(this.base(), {
                    "fields": {
                        "rightLabel": {
                            "type": "text"
                        },
                        "multiple": {
                            "type": "checkbox"
                        },
                        "dataSource": {
                            "type": "text"
                        }
                    }
                });
            }

        });

    Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CheckBoxField);
    Alpaca.registerDefaultSchemaFieldMapping("boolean", "checkbox");

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.FileField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function()
        {
            return "file";
        },
        setValue: function(value)
        {
            this.data = value;

            this.data = value;

            this.updateObservable();

            this.triggerUpdate();
        },
        getControlValue: function()
        {
            return this.data;
        },

        onChange: function(e)
        {
            this.base(e);

            if (this.options.selectionHandler)
            {
                this.processSelectionHandler(e.target.files);
            }
        },

        processSelectionHandler: function(files)
        {
            if (files && files.length > 0)
            {
                if (typeof(FileReader) !== "undefined")
                {
                    var loadedData = [];
                    var loadCount = 0;

                    var fileReader = new FileReader();
                    fileReader.onload = (function() {
                        var field = this;
                        return function(event)
                        {
                            var dataUri = event.target.result;

                            loadedData.push(dataUri);
                            loadCount++;

                            if (loadCount === files.length)
                            {
                                field.options.selectionHandler.call(field, files, loadedData);
                            }
                        };
                    }).call(this);

                    for (var i = 0; i < files.length; i++)
                    {
                        fileReader.readAsDataURL(files[i]);
                    }
                }
            }
        }
        ,
        getTitle: function() {
            return "File Field";
        },
        getDescription: function() {
            return "Field for uploading files.";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "selectionHandler": {
                        "title": "Selection Handler",
                        "description": "Function that should be called when files are selected.  Requires HTML5.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "selectionHandler": {
                        "type": "checkbox"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("file", Alpaca.Fields.FileField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ListField = Alpaca.ControlField.extend(
    {
        setup: function()
        {
            var self = this;

            self.base();

            self.selectOptions = [];

            if (self.getEnum())
            {
                self.sortEnum();

                var optionLabels = self.getOptionLabels();

                $.each(self.getEnum(), function(index, value)
                {
                    var text = value;
                    if (optionLabels)
                    {
                        if (!Alpaca.isEmpty(optionLabels[index]))
                        {
                            text = optionLabels[index];
                        }
                        else if (!Alpaca.isEmpty(optionLabels[value]))
                        {
                            text = optionLabels[value];
                        }
                    }

                    self.selectOptions.push({
                        "value": value,
                        "text": text
                    });
                });
            }
            if (self.isRequired() && !self.data)
            {
                if ((self.options.removeDefaultNone === true))
                {
                    var enumValues = self.getEnum();
                    if (enumValues && enumValues.length > 0)
                    {
                        self.data = enumValues[0];
                    }
                }
            }
            if (self.options.datasource && !self.options.dataSource) {
                self.options.dataSource = self.options.datasource;
                delete self.options.datasource;
            }
            if (typeof(self.options.useDataSourceAsEnum) === "undefined")
            {
                self.options.useDataSourceAsEnum = true;
            }
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                if (typeof(self.options.noneLabel) === "undefined")
                {
                    self.options.noneLabel = self.getMessage("noneLabel");
                }

                if (typeof(self.options.hideNone) === "undefined")
                {
                    if (typeof(self.options.removeDefaultNone) !== "undefined")
                    {
                        self.options.hideNone = self.options.removeDefaultNone;
                    }
                    else
                    {
                        self.options.hideNone = self.isRequired();
                    }
                }

                callback(model);
            });
        },
        convertValue: function(val)
        {
            var _this = this;

            if (Alpaca.isArray(val))
            {
                $.each(val, function(index, itemVal) {
                    $.each(_this.selectOptions, function(index2, selectOption) {

                        if (selectOption.value === itemVal)
                        {
                            val[index] = selectOption.value;
                        }

                    });
                });
            }
            else
            {
                $.each(this.selectOptions, function(index, selectOption) {

                    if (selectOption.value === val)
                    {
                        val = selectOption.value;
                    }

                });
            }
            return val;
        },
        beforeRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.options.dataSource)
                {
                    self.selectOptions.length = 0;

                    self.invokeDataSource(self.selectOptions, model, function() {

                        if (self.options.useDataSourceAsEnum)
                        {
                            var _enum = [];
                            var _optionLabels = [];
                            for (var i = 0; i < self.selectOptions.length; i++)
                            {
                                _enum.push(self.selectOptions[i].value);
                                _optionLabels.push(self.selectOptions[i].text);
                            }

                            self.setEnum(_enum);
                            self.setOptionLabels(_optionLabels);
                        }

                        callback();

                    });
                }
                else
                {
                    callback();
                }

            });
        }
        ,
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "enum": {
                        "title": "Enumeration",
                        "description": "List of field value options",
                        "type": "array",
                        "required": true
                    }
                }
            });
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dataSource": {
                        "title": "Option Datasource",
                        "description": "Datasource for generating list of options.  This can be a string or a function.  If a string, it is considered to be a URI to a service that produces a object containing key/value pairs or an array of elements of structure {'text': '', 'value': ''}.  This can also be a function that is called to produce the same list.",
                        "type": "string"
                    },
                    "removeDefaultNone": {
                        "title": "Remove Default None",
                        "description": "If true, the default 'None' option will not be shown.",
                        "type": "boolean",
                        "default": false
                    },
                    "noneLabel": {
                        "title": "None Label",
                        "description": "The label to use for the 'None' option in a list (select, radio or otherwise).",
                        "type": "string",
                        "default": "None"
                    },
                    "hideNone": {
                        "title": "Hide None",
                        "description": "Whether to hide the None option from a list (select, radio or otherwise).  This will be true if the field is required and false otherwise.",
                        "type": "boolean",
                        "default": false
                    },
                    "useDataSourceAsEnum": {
                        "title": "Use Data Source as Enumerated Values",
                        "description": "Whether to constrain the field's schema enum property to the values that come back from the data source.",
                        "type": "boolean",
                        "default": true
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "dataSource": {
                        "type": "text"
                    },
                    "removeDefaultNone": {
                        "type": "checkbox",
                        "rightLabel": "Remove Default None"
                    },
                    "noneLabel": {
                        "type": "text"
                    },
                    "hideNone": {
                        "type": "checkbox",
                        "rightLabel": "Hide the 'None' option from the list"
                    }
                }
            });
        }
    });
    Alpaca.registerMessages({
        "noneLabel": "None"
    });

})(jQuery);

(function($){

    var Alpaca = $.alpaca;

    Alpaca.Fields.RadioField = Alpaca.Fields.ListField.extend(
    {
        getFieldType: function() {
            return "radio";
        },
        setup: function()
        {
            this.base();
            
            if (this.options.name)
            {
				this.name = this.options.name;
			}
			else if (!this.name)
            {
				this.name = this.getId() + "-name";
			}
            if (Alpaca.isUndefined(this.options.emptySelectFirst))
            {
                this.options.emptySelectFirst = false;
            }
            if (Alpaca.isUndefined(this.options.vertical))
            {
                this.options.vertical = true;
            }
        },
        getControlValue: function()
        {
            var self = this;

            var val = null;

            $(this.control).find(":checked").each(function() {
                val = $(this).val();

                val = self.ensureProperType(val);
            });

            return val;
        },
        setValue: function(val)
        {
            var self = this;
            $(this.control).find("input").each(function() {
                Alpaca.checked($(this), null);
            });
            if (typeof(val) != "undefined")
            {
                Alpaca.checked($(self.control).find("input[value=\"" + val + "\"]"), "checked");
            }
            if (this.options.emptySelectFirst)
            {
                if ($(this.control).find("input:checked").length === 0)
                {
                    Alpaca.checked($(self.control).find("input:radio").first(), "checked");
                }
            }

            this.base(val);
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            var inputs = $(this.control).find("input");

            inputs.focus(function(e) {
                if (!self.suspendBlurFocus)
                {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                }
            });

            inputs.blur(function(e) {
                if (!self.suspendBlurFocus)
                {
                    self.onBlur.call(self, e);
                    self.trigger("blur", e);
                }
            });
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.selectOptions = self.selectOptions;
                model.removeDefaultNone = self.options.removeDefaultNone;

                callback(model);
            });
        },
        
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {
                if (self.options.emptySelectFirst && self.selectOptions && self.selectOptions.length > 0)
                {
                    self.data = self.selectOptions[0].value;

                    if ($("input:radio:checked", self.control).length === 0)
                    {
                        Alpaca.checked($(self.control).find("input:radio[value=\"" + self.data + "\"]"), "checked");
                    }
                }
                if (self.options.vertical)
                {
                    $(self.control).css("display", "block");
                }
                else
                {
                    $(self.control).css("display", "inline-block");
                }

                callback();

            });
        },
        onClick: function(e)
        {
            var self = this;
            var currentValue = self.getValue();

            this.base(e);

            var val = $(e.currentTarget).find("input").val();
            if (typeof(val) !== "undefined")
            {
                self.setValue(val);
                self.refreshValidationState();
                if (currentValue !== val) {

                    self.trigger("change");
                }
            }
        },
        disable: function()
        {
            this.base();
            this.getFieldEl().addClass("disabled");
        },
        enable: function()
        {
            this.base();

            this.getFieldEl().removeClass("disabled");
        }
        ,
        getTitle: function() {
            return "Radio Group Field";
        },
        getDescription: function() {
            return "Radio Group Field with list of options.";
        },
		getSchemaOfOptions: function()
        {
            return Alpaca.merge(this.base(),{
				"properties": {
					"name": {
						"title": "Field name",
						"description": "Field name.",
						"type": "string"
					},
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "vertical": {
                        "title": "Position the radio selector items vertically",
                        "description": "By default, radio controls are stacked vertically.  Set to false if you'd like radio controls to lay out horizontally.",
                        "type": "boolean",
                        "default": true
                    }
				}
			});
        }
        
    });
    
    Alpaca.registerFieldClass("radio", Alpaca.Fields.RadioField);
    
})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SelectField = Alpaca.Fields.ListField.extend(
    {
        getFieldType: function()
        {
            return "select";
        },
        setup: function()
        {
            this.base();
        },
        getControlValue: function()
        {
            var val = this._getControlVal(true);
            if (typeof(val) === "undefined")
            {
                val = this.data;
            }

            return this.convertValue(val);
        },
        setValue: function(val)
        {
            if (Alpaca.isArray(val))
            {
                if (!Alpaca.compareArrayContent(val, this.getValue()))
                {
                    if (!Alpaca.isEmpty(val) && this.control)
                    {
                        this.control.val(val);
                    }

                    this.base(val);
                }
            }
            else
            {
                if (val !== this.getValue())
                {
                    if (this.control && typeof(val) != "undefined" && val != null)
                    {
                        this.control.val(val);
                    }

                    this.base(val);
                }
            }
        },
        getEnum: function()
        {
            if (this.schema)
            {
                if (this.schema["enum"])
                {
                    return this.schema["enum"];
                }
                else if (this.schema["type"] && this.schema["type"] === "array" && this.schema["items"] && this.schema["items"]["enum"])
                {
                    return this.schema["items"]["enum"];
                }
            }
        },

        initControlEvents: function()
        {
            var self = this;

            self.base();

            if (self.options.multiple)
            {
                var button = this.control.parent().find("button.multiselect");

                button.focus(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onFocus.call(self, e);
                        self.trigger("focus", e);
                    }
                });

                button.blur(function(e) {
                    if (!self.suspendBlurFocus)
                    {
                        self.onBlur.call(self, e);
                        self.trigger("blur", e);
                    }
                });
            }
        },

        beforeRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.schema["type"] && self.schema["type"] === "array")
                {
                    self.options.multiple = true;
                }

                callback();

            });
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.selectOptions = self.selectOptions;

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {
                if (Alpaca.isUndefined(self.data) && self.options.emptySelectFirst && self.selectOptions && self.selectOptions.length > 0)
                {
                    self.data = self.selectOptions[0].value;
                }
                if (self.data)
                {
                    self.setValue(self.data);
                }
                if (self.options.multiple && $.fn.multiselect)
                {
                    var settings = null;
                    if (self.options.multiselect) {
                        settings = self.options.multiselect;
                    }
                    else
                    {
                        settings = {};
                    }
                    if (!settings.nonSelectedText)
                    {
                        settings.nonSelectedText = "None";
                        if (self.options.noneLabel)
                        {
                            settings.nonSelectedText = self.options.noneLabel;
                        }
                    }
                    if (self.options.hideNone)
                    {
                        delete settings.nonSelectedText;
                    }

                    $(self.getControlEl()).multiselect(settings);
                }

                callback();

            });
        },
        _validateEnum: function()
        {
            var _this = this;

            if (this.schema["enum"])
            {
                var val = this.data;

                if (!this.isRequired() && Alpaca.isValEmpty(val))
                {
                    return true;
                }

                if (this.options.multiple)
                {
                    var isValid = true;

                    if (!val)
                    {
                        val = [];
                    }

                    if (!Alpaca.isArray(val) && !Alpaca.isObject(val))
                    {
                        val = [val];
                    }

                    $.each(val, function(i,v) {

                        if ($.inArray(v, _this.schema["enum"]) <= -1)
                        {
                            isValid = false;
                            return false;
                        }

                    });

                    return isValid;
                }
                else
                {
                    if (Alpaca.isArray(val)) {
                        val = val[0];
                    }

                    return ($.inArray(val, this.schema["enum"]) > -1);
                }
            }
            else
            {
                return true;
            }
        },
        onChange: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
                _this.refreshValidationState();
            });
        },
        _validateMinItems: function()
        {
            if (this.schema.items && this.schema.items.minItems)
            {
                if ($(":selected",this.control).length < this.schema.items.minItems)
                {
                    return false;
                }
            }

            return true;
        },
        _validateMaxItems: function()
        {
            if (this.schema.items && this.schema.items.maxItems)
            {
                if ($(":selected",this.control).length > this.schema.items.maxItems)
                {
                    return false;
                }
            }

            return true;
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.items.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.items.minItems]),
                "status": status
            };

            return baseStatus && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        },
        focus: function(onFocusCallback)
        {
            if (this.control && this.control.length > 0)
            {
                var el = $(this.control).get(0);

                el.focus();

                if (onFocusCallback)
                {
                    onFocusCallback(this);
                }
            }
        }
        ,
        getTitle: function() {
            return "Select Field";
        },
        getDescription: function() {
            return "Select Field";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multiple": {
                        "title": "Mulitple Selection",
                        "description": "Allow multiple selection if true.",
                        "type": "boolean",
                        "default": false
                    },
                    "size": {
                        "title": "Displayed Options",
                        "description": "Number of options to be shown.",
                        "type": "number"
                    },
                    "emptySelectFirst": {
                        "title": "Empty Select First",
                        "description": "If the data is empty, then automatically select the first item in the list.",
                        "type": "boolean",
                        "default": false
                    },
                    "multiselect": {
                        "title": "Multiselect Plugin Settings",
                        "description": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect",
                        "type": "any"
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multiple": {
                        "rightLabel": "Allow multiple selection ?",
                        "helper": "Allow multiple selection if checked",
                        "type": "checkbox"
                    },
                    "size": {
                        "type": "integer"
                    },
                    "emptySelectFirst": {
                        "type": "checkbox",
                        "rightLabel": "Empty Select First"
                    },
                    "multiselect": {
                        "type": "object",
                        "rightLabel": "Multiselect plugin properties - http://davidstutz.github.io/bootstrap-multiselect"
                    }
                }
            });
        }

    });

    Alpaca.registerFieldClass("select", Alpaca.Fields.SelectField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.NumberField = Alpaca.Fields.TextField.extend(
    {
        setup: function()
        {

            this.base();

            if (typeof(this.options.numericEntry) === "undefined")
            {
                this.options.numericEntry = false;
            }

        },
        getFieldType: function() {
            return "number";
        },
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                if (self.control)
                {
                    self.on("keypress", function(e) {

                        var key = e.charCode || e.keyCode || 0;

                        var valid = true;

                        if (self.options.numericEntry) {
                            valid = valid && (key >= 48 && key <= 57);
                        }

                        if(!valid) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                        }

                        return valid;
                    });
                }

                callback();
            });
        },
        getControlValue: function()
        {
            var val = this._getControlVal(true);

            if (typeof(val) == "undefined" || "" == val)
            {
                return val;
            }

            return parseFloat(val);
        },
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateNumber();
            valInfo["stringNotANumber"] = {
                "message": status ? "" : this.getMessage("stringNotANumber"),
                "status": status
            };

            status = this._validateDivisibleBy();
            valInfo["stringDivisibleBy"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("stringDivisibleBy"), [this.schema.divisibleBy]),
                "status": status
            };

            status = this._validateMaximum();
            valInfo["stringValueTooLarge"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMaximum) {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooLargeExclusive"), [this.schema.maximum]);
                } else {
                    valInfo["stringValueTooLarge"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooLarge"), [this.schema.maximum]);
                }
            }

            status = this._validateMinimum();
            valInfo["stringValueTooSmall"] = {
                "message": "",
                "status": status
            };
            if (!status) {
                if (this.schema.exclusiveMinimum) {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooSmallExclusive"), [this.schema.minimum]);
                } else {
                    valInfo["stringValueTooSmall"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueTooSmall"), [this.schema.minimum]);
                }
            }

            status = this._validateMultipleOf();
            valInfo["stringValueNotMultipleOf"] = {
                "message": "",
                "status": status
            };
            if (!status)
            {
                valInfo["stringValueNotMultipleOf"]["message"] = Alpaca.substituteTokens(this.getMessage("stringValueNotMultipleOf"), [this.schema.multipleOf]);
            }
            return baseStatus && valInfo["stringNotANumber"]["status"] && valInfo["stringDivisibleBy"]["status"] && valInfo["stringValueTooLarge"]["status"] && valInfo["stringValueTooSmall"]["status"] && valInfo["stringValueNotMultipleOf"]["status"] && valInfo["invalidPattern"]["status"] && valInfo["stringTooLong"]["status"] && valInfo["stringTooShort"]["status"];
        },
        _validateOptional: function() {

            if (this.isRequired() && Alpaca.isValEmpty($(this.control).val())) {
                return false;
            }

            return true;
        },
        _validateNumber: function() {
            var textValue = this._getControlVal();
            if (typeof(textValue) === "number")
            {
                textValue = "" + textValue;
            }
            if (Alpaca.isValEmpty(textValue)) {
                return true;
            }
            var validNumber = Alpaca.testRegex(Alpaca.regexps.number, textValue);
            if (!validNumber)
            {
                return false;
            }
            var floatValue = this.getValue();
            if (isNaN(floatValue)) {
                return false;
            }

            return true;
        },
        _validateDivisibleBy: function() {
            var floatValue = this.getValue();
            if (!Alpaca.isEmpty(this.schema.divisibleBy)) {
                if (floatValue % this.schema.divisibleBy !== 0)
                {
                    return false;
                }
            }
            return true;
        },
        _validateMaximum: function() {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.maximum)) {
                if (floatValue > this.schema.maximum) {
                    return false;
                }

                if (!Alpaca.isEmpty(this.schema.exclusiveMaximum)) {
                    if (floatValue == this.schema.maximum && this.schema.exclusiveMaximum) { // jshint ignore:line
                        return false;
                    }
                }
            }

            return true;
        },
        _validateMinimum: function() {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.minimum)) {
                if (floatValue < this.schema.minimum) {
                    return false;
                }

                if (!Alpaca.isEmpty(this.schema.exclusiveMinimum)) {
                    if (floatValue == this.schema.minimum && this.schema.exclusiveMinimum) { // jshint ignore:line
                        return false;
                    }
                }
            }

            return true;
        },
        _validateMultipleOf: function() {
            var floatValue = this.getValue();

            if (!Alpaca.isEmpty(this.schema.multipleOf)) {
                if (floatValue && this.schema.multipleOf !== 0)
                {
                    return false;
                }
            }

            return true;
        },
        getType: function() {
            return "number";
        },
        onKeyPress: function(e)
        {
            var self = this;
            if (e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
                return;
            }

            if (e.keyCode === 8) // backspace
            {
                if (!Alpaca.isEmpty(self.schema.minLength) && (self.options.constrainLengths || self.options.constrainMinLength))
                {
                    var newValue = self.getValue() || "";
                    if(Alpaca.isNumber(newValue)) {
                        newValue = newValue.toString();
                    }
                    if (newValue.length <= self.schema.minLength)
                    {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }
            else
            {
                if (!Alpaca.isEmpty(self.schema.maxLength) && (self.options.constrainLengths || self.options.constrainMaxLength))
                {
                    var newValue = self.getValue() || "";
                    if(Alpaca.isNumber(newValue)) {
                        newValue = newValue.toString();
                    }
                    if (newValue.length >= self.schema.maxLength)
                    {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                }
            }

            if (e.keyCode === 32) // space
            {
                if (self.options.disallowEmptySpaces)
                {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
        },

        onKeyUp: function(e)
        {
            var self = this;
            self.updateMaxLengthIndicator();
            $(this.field).trigger("fieldkeyup");
        },
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "multipleOf": {
                        "title": "Multiple Of",
                        "description": "Property value must be a multiple of the multipleOf schema property such that division by this value yields an interger (mod zero).",
                        "type": "number"
                    },
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property.",
                        "type": "number"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property.",
                        "type": "number"
                    },
                    "exclusiveMinimum": {
                        "title": "Exclusive Minimum",
                        "description": "Property value can not equal the number defined by the minimum schema property.",
                        "type": "boolean",
                        "default": false
                    },
                    "exclusiveMaximum": {
                        "title": "Exclusive Maximum",
                        "description": "Property value can not equal the number defined by the maximum schema property.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "multipleOf": {
                        "title": "Multiple Of",
                        "description": "The value must be a integral multiple of the property",
                        "type": "number"
                    },
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property",
                        "type": "number"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property",
                        "type": "number"
                    },
                    "exclusiveMinimum": {
                        "rightLabel": "Exclusive minimum ?",
                        "helper": "Field value must be greater than but not equal to this number if checked",
                        "type": "checkbox"
                    },
                    "exclusiveMaximum": {
                        "rightLabel": "Exclusive Maximum ?",
                        "helper": "Field value must be less than but not equal to this number if checked",
                        "type": "checkbox"
                    }
                }
            });
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "numericEntry": {
                        "title": "Numeric Entry",
                        "description": "Whether to constrain data entry key presses to numeric values (0-9)",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },
        getTitle: function() {
            return "Number Field";
        },
        getDescription: function() {
            return "Field for float numbers.";
        }
    });
    Alpaca.registerMessages({
        "stringValueTooSmall": "The minimum value for this field is {0}",
        "stringValueTooLarge": "The maximum value for this field is {0}",
        "stringValueTooSmallExclusive": "Value of this field must be greater than {0}",
        "stringValueTooLargeExclusive": "Value of this field must be less than {0}",
        "stringDivisibleBy": "The value must be divisible by {0}",
        "stringNotANumber": "This value is not a number.",
        "stringValueNotMultipleOf": "This value is not a multiple of {0}"
    });
    Alpaca.registerFieldClass("number", Alpaca.Fields.NumberField);
    Alpaca.registerDefaultSchemaFieldMapping("number", "number");

})(jQuery);
    {
        getFieldType: function() {
            return "array";
        },
        setup: function()
        {
            var self = this;

            this.base();

            var containerItemTemplateType = self.resolveContainerItemTemplateType();
            if (!containerItemTemplateType)
            {
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for container item: " + self.getFieldType());
            }

            this.containerItemTemplateDescriptor = self.view.getTemplateDescriptor("container-" + containerItemTemplateType + "-item", self);

            if (!this.options.toolbarStyle) {
                this.options.toolbarStyle = Alpaca.isEmpty(this.view.toolbarStyle) ? "button" : this.view.toolbarStyle;
            }
            if (!this.options.toolbarStyle) {
                this.options.toolbarStyle = "button";
            }

            if (!this.options.actionbarStyle) {
                this.options.actionbarStyle = Alpaca.isEmpty(this.view.actionbarStyle) ? "top" : this.view.actionbarStyle;
            }
            if (!this.options.actionbarStyle) {
                this.options.actionbarStyle = "top";
            }

            if (!this.schema.items)
            {
                this.schema.items = {};
            }

            if (!this.options.items)
            {
                this.options.items = {};
            }
            if (this.schema.items.maxItems) {
                this.schema.maxItems = this.schema.items.maxItems;
                delete this.schema.items.maxItems;
            }

            if (this.schema.items.minItems) {
                this.schema.minItems = this.schema.items.minItems;
                delete this.schema.items.minItems;
            }

            if (this.schema.items.uniqueItems) {
                this.schema.uniqueItems = this.schema.items.uniqueItems;
                delete this.schema.items.uniqueItems;
            }
            this.options.rubyrails = false;
            if (this.parent && this.parent.options && this.parent.options.form && this.parent.options.form.attributes)
            {
                if (!Alpaca.isEmpty(this.parent.options.form.attributes.rubyrails))
                {
                    this.options.rubyrails = true;
                }
            }

            var toolbarSticky = Alpaca.defaultToolbarSticky;

            if (!Alpaca.isEmpty(this.view.toolbarSticky))
            {
                toolbarSticky = this.view.toolbarSticky;
            }

            if (!Alpaca.isEmpty(this.options.toolbarSticky))
            {
                toolbarSticky = this.options.toolbarSticky;
            }

            this.options.toolbarSticky = toolbarSticky;
            if (typeof(self.options.hideToolbarWithChildren) === "undefined")
            {
                self.options.hideToolbarWithChildren = true;
            }
            if (this.schema.items && this.schema.uniqueItems)
            {
                Alpaca.mergeObject(this.options, {
                    "forceRevalidation" : true
                });
            }

            if (typeof(this.data) == "undefined")
            {
                this.data = [];
            }

            if (this.data == null)
            {
                this.data = [];
            }

            if ("" == this.data)
            {
                this.data = [];
            }

            if (Alpaca.isString(this.data))
            {
                try
                {
                    var parsedJSON = Alpaca.parseJSON(this.data);

                    if (!Alpaca.isArray(parsedJSON) && !Alpaca.isObject(parsedJSON))
                    {
                        Alpaca.logWarn("ArrayField parsed string data but it was not an array: " + this.data);
                        return;
                    }

                    this.data = parsedJSON;
                }
                catch (e)
                {
                    this.data = [this.data];
                }
            }

            if (!Alpaca.isArray(this.data) && !Alpaca.isObject(this.data))
            {
                Alpaca.logWarn("ArrayField data is not an array: " + JSON.stringify(this.data, null, "  "));
                return;
            }
            var applyAction = function(actions, key, actionConfig) {
                var action = self.findAction(actions, key);
                if (!action) {
                    action = {
                        "core": true
                    };
                    actions.push(action);
                }
                for (var k in actionConfig) {
                    if (!action[k]) {
                        action[k] = actionConfig[k];
                    }
                }
            };
            var cleanupActions = function(actions, showLabels) {
                var i = 0;
                do {
                    if (typeof(actions[i].enabled) === "undefined") {
                        actions[i].enabled = true;
                    }
                    if (!showLabels) {
                        delete actions[i].label;
                    }

                    if (!actions[i].enabled) {
                        actions.splice(i, 1);
                    } else {
                        i++;
                    }

                } while (i < actions.length);
                actions.sort(function(a, b) {
                    if (a.core && !b.core) {
                        return -1;
                    }
                    if (!a.core && b.core) {
                        return 1;
                    }
                    return 0;
                });
            };
            self.toolbar = {};
            if (self.options.toolbar)
            {
                for (var k in self.options.toolbar) {
                    self.toolbar[k] = Alpaca.copyOf(self.options.toolbar[k]);
                }
            }
            if (typeof(self.toolbar.showLabels) === "undefined") {
                self.toolbar.showLabels = true;
            }
            if (!self.toolbar.actions) {
                self.toolbar.actions = [];
            }
            applyAction(self.toolbar.actions, "add", {
                "label": self.getMessage("addItemButtonLabel"),
                "action": "add",
                "iconClass": self.view.getStyle("addIcon"),
                "click": function(key, action) {

                    self.handleToolBarAddItemClick(function(item) {
                    });
                }
            });
            cleanupActions(self.toolbar.actions, self.toolbar.showLabels);
            self.actionbar = {};
            if (self.options.actionbar)
            {
                for (var k2 in self.options.actionbar) {
                    self.actionbar[k2] = Alpaca.copyOf(self.options.actionbar[k2]);
                }
            }
            if (typeof(self.actionbar.showLabels) === "undefined") {
                self.actionbar.showLabels = false;
            }
            if (!self.actionbar.actions) {
                self.actionbar.actions = [];
            }
            applyAction(self.actionbar.actions, "add", {
                "label": self.getMessage("addButtonLabel"),
                "action": "add",
                "iconClass": self.view.getStyle("addIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarAddItemClick(itemIndex, function(item) {
                    });
                }
            });
            applyAction(self.actionbar.actions, "remove", {
                "label": self.getMessage("removeButtonLabel"),
                "action": "remove",
                "iconClass": self.view.getStyle("removeIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarRemoveItemClick(itemIndex, function(item) {
                    });
                }
            });
            applyAction(self.actionbar.actions, "up", {
                "label": self.getMessage("upButtonLabel"),
                "action": "up",
                "iconClass": self.view.getStyle("upIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarMoveItemUpClick(itemIndex, function() {
                    });
                }
            });
            applyAction(self.actionbar.actions, "down", {
                "label": self.getMessage("downButtonLabel"),
                "action": "down",
                "iconClass": self.view.getStyle("downIcon"),
                "click": function(key, action, itemIndex) {

                    self.handleActionBarMoveItemDownClick(itemIndex, function() {
                    });
                }
            });
            cleanupActions(self.actionbar.actions, self.actionbar.showLabels);

            var len = this.data.length;
            var data = $.extend(true, {}, this.data);
            data.length = len;

            this.data = Array.prototype.slice.call(data);
        },
        setValue: function(data)
        {
            var self = this;

            if (!data || !Alpaca.isArray(data))
            {
                return;
            }
            var i = 0;
            do
            {
                if (i < self.children.length)
                {
                    var childField = self.children[i];

                    if (data.length > i)
                    {
                        childField.setValue(data[i]);
                        i++;
                    }
                    else
                    {
                        self.removeItem(i);
                    }
                }
            }
            while (i < self.children.length);
            if (i < data.length)
            {
                self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {

                    if (!itemSchema)
                    {
                        Alpaca.logDebug("Unable to resolve schema for item: " + i);
                    }
                    if (circular)
                    {
                        return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                    }
                    var funcs = [];

                    while (i < data.length)
                    {
                        var f = (function(i, data)
                        {
                            return function(callback)
                            {
                                self.addItem(i, itemSchema, itemOptions, data[i], function() {
                                    Alpaca.nextTick(function() {
                                        callback();
                                    });

                                });
                            };
                        })(i, data);

                        funcs.push(f);

                        i++;
                    }

                    Alpaca.series(funcs, function() {
                    });
                });
            }

        },
        getContainerValue: function()
        {
            if (this.children.length === 0 && !this.isRequired())
            {
                return [];
            }
            var o = [];
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();

                if(v !== v) {
                    v = undefined;
                }

                if (typeof(v) !== "undefined")
                {
                    o.push(v);
                }
            }
            return o;
        },
        createItems: function(callback)
        {
            var self = this;

            var items = [];

            if (self.data && self.data.length > 0)
            {
                self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {
                    if (circular)
                    {
                        return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                    }
                    var funcs = [];
                    for (var index = 0; index < self.data.length; index++)
                    {
                        var value = self.data[index];

                        var pf = (function(index, value)
                        {
                            return function(_done)
                            {
                                self.createItem(index, itemSchema, itemOptions, value, function(item) {

                                    items.push(item);

                                    _done();
                                });
                            };

                        })(index, value);

                        funcs.push(pf);
                    }
                    Alpaca.nextTick(function() {
                        Alpaca.series(funcs, function(err) {
                            callback(items);
                        });
                    });

                });
            }
            else
            {
                callback(items);
            }
        },
        createItem: function(index, itemSchema, itemOptions, itemData, postRenderCallback)
        {
            var self = this;

            if (self._validateEqualMaxItems())
            {
                var formEl = $("<div></div>");
                formEl.alpaca({
                    "data" : itemData,
                    "options": itemOptions,
                    "schema" : itemSchema,
                    "view" : this.view.id ? this.view.id : this.view,
                    "connector": this.connector,
                    "error": function(err)
                    {
                        self.destroy();

                        self.errorCallback.call(self, err);
                    },
                    "notTopLevel":true,
                    "render": function(fieldControl, cb) {
                        fieldControl.parent = self;
                        fieldControl.path = self.path + "[" + index + "]";
                        fieldControl.render(null, function() {
                            self.updatePathAndName();
                            self.triggerUpdate();

                            if (cb)
                            {
                                cb();
                            }
                        });
                    },
                    "postRender": function(control)
                    {
                        var containerItemEl = Alpaca.tmpl(self.containerItemTemplateDescriptor, {
                            "id": self.getId(),
                            "name": control.name,
                            "parentFieldId": self.getId(),
                            "actionbarStyle": self.options.actionbarStyle,
                            "view": self.view,
                            "data": itemData
                        });
                        var insertionPointEl = $(containerItemEl).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD);
                        if (insertionPointEl.length === 0)
                        {
                            if ($(containerItemEl).hasClass(Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD)) {
                                insertionPointEl = $(containerItemEl);
                            }
                        }
                        if (insertionPointEl.length === 0)
                        {
                            self.errorCallback.call(self, {
                                "message": "Cannot find insertion point for field: " + self.getId()
                            });
                            return;
                        }
                        $(insertionPointEl).before(control.getFieldEl());
                        $(insertionPointEl).remove();

                        control.containerItemEl = containerItemEl;
                        Alpaca.fieldApplyFieldAndChildren(control, function(_control) {
                            _control.hideInitValidationError = false;
                        });
                        if (Alpaca.isFunction(self.options.items.postRender))
                        {
                            self.options.items.postRender.call(control, insertionPointEl);
                        }

                        if (postRenderCallback)
                        {
                            postRenderCallback(control);
                        }
                    }
                });
            }
        },
        resolveItemSchemaOptions: function(callback)
        {
            var _this = this;

            var completionFunction = function(resolvedItemSchema, resolvedItemOptions, circular)
            {
                if (_this.options.readonly) {
                    resolvedItemOptions.readonly = true;
                }

                callback(resolvedItemSchema, resolvedItemOptions, circular);
            };

            var itemOptions;
            if (!itemOptions && _this.options && _this.options.fields && _this.options.fields.item) {
                itemOptions = _this.options.fields.item;
            }
            if (!itemOptions && _this.options && _this.options.items) {
                itemOptions = _this.options.items;
            }
            var itemSchema;
            if (_this.schema && _this.schema.items) {
                itemSchema = _this.schema.items;
            }
            if (itemSchema && itemSchema["$ref"])
            {
                var referenceId = itemSchema["$ref"];

                var topField = this;
                var fieldChain = [topField];
                while (topField.parent)
                {
                    topField = topField.parent;
                    fieldChain.push(topField);
                }

                var originalItemSchema = itemSchema;
                var originalItemOptions = itemOptions;

                Alpaca.loadRefSchemaOptions(topField, referenceId, function(itemSchema, itemOptions) {
                    var refCount = 0;
                    for (var i = 0; i < fieldChain.length; i++)
                    {
                        if (fieldChain[i].schema)
                        {
                            if ( (fieldChain[i].schema.id === referenceId) || (fieldChain[i].schema.id === "#" + referenceId))
                            {
                                refCount++;
                            }
                            else if ( (fieldChain[i].schema["$ref"] === referenceId))
                            {
                                refCount++;
                            }
                        }
                    }
                    var circular = (refCount > 10);

                    var resolvedItemSchema = {};
                    if (originalItemSchema) {
                        Alpaca.mergeObject(resolvedItemSchema, originalItemSchema);
                    }
                    if (itemSchema)
                    {
                        Alpaca.mergeObject(resolvedItemSchema, itemSchema);
                    }
                    delete resolvedItemSchema.id;

                    var resolvedItemOptions = {};
                    if (originalItemOptions) {
                        Alpaca.mergeObject(resolvedItemOptions, originalItemOptions);
                    }
                    if (itemOptions)
                    {
                        Alpaca.mergeObject(resolvedItemOptions, itemOptions);
                    }

                    Alpaca.nextTick(function() {
                        completionFunction(resolvedItemSchema, resolvedItemOptions, circular);
                    });
                });
            }
            else
            {
                Alpaca.nextTick(function() {
                    completionFunction(itemSchema, itemOptions);
                });
            }
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateUniqueItems();
            valInfo["valueNotUnique"] = {
                "message": status ? "" : this.getMessage("valueNotUnique"),
                "status": status
            };

            status = this._validateMaxItems();
            valInfo["tooManyItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.maxItems]),
                "status": status
            };

            status = this._validateMinItems();
            valInfo["notEnoughItems"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("notEnoughItems"), [this.schema.minItems]),
                "status": status
            };

            return baseStatus && valInfo["valueNotUnique"]["status"] && valInfo["tooManyItems"]["status"] && valInfo["notEnoughItems"]["status"];
        },
        _validateEqualMaxItems: function()
        {
            if (this.schema.maxItems && this.schema.maxItems >= 0)
            {
                if (this.getSize() >= this.schema.maxItems)
                {
                    return false;
                }
            }

            return true;
        },
        _validateEqualMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if (this.getSize() <= this.schema.minItems)
                {
                    return false;
                }
            }

            return true;
        },
        _validateMinItems: function()
        {
            if (this.schema.minItems && this.schema.minItems >= 0)
            {
                if (this.getSize() < this.schema.minItems)
                {
                    return false;
                }
            }

            return true;
        },
        _validateMaxItems: function()
        {
            if (this.schema.maxItems && this.schema.maxItems >= 0)
            {
                if (this.getSize() > this.schema.maxItems)
                {
                    return false;
                }
            }

            return true;
        },
        _validateUniqueItems: function()
        {
            if (this.schema.items && this.schema.uniqueItems)
            {
                var hash = {};

                for (var i = 0; i < this.children.length; i++)
                {
                    var key = this.children[i].getValue();
                    if (!key) {
                        key = "";
                    }

                    if (hash[key])
                    {
                        return false;
                    }

                    hash[key] = true;
                }
            }

            return true;
        },

        findAction: function(actionsArray, actionKey)
        {
            var action = null;

            $.each(actionsArray, function(i, v) {
                if (v.action === actionKey) // jshint ignore:line
                {
                    action = v;
                }
            });

            return action;
        },

        postRender: function(callback)
        {
            var self = this;

            this.base(function() {
                self.updateToolbars();

                callback();

            });
        },
        getSize: function() {
            return this.children.length;
        },
        updatePathAndName: function()
        {
            var self = this;

            var updateChildrenPathAndName = function(parent)
            {
                if (parent.children)
                {
                    $.each(parent.children, function(i, v) {

                        if (parent.prePath && Alpaca.startsWith(v.path,parent.prePath))
                        {
                            v.prePath = v.path;
                            v.path = v.path.replace(parent.prePath,parent.path);
                        }
                        if (parent.preName && Alpaca.startsWith(v.name, parent.preName))
                        {
                            v.preName = v.name;
                            v.name = v.name.replace(parent.preName, parent.name);
                            if (v.field)
                            {
                                $(v.field).attr('name', v.name);
                            }
                        }

                        updateChildrenPathAndName(v);
                    });
                }
            };

            if (this.children && this.children.length > 0)
            {
                $.each(this.children, function(i, v) {

                    var idx = v.path.lastIndexOf('/');
                    var lastSegment = v.path.substring(idx+1);
                    if (lastSegment.indexOf("[") < 0 && lastSegment.indexOf("]") < 0)
                    {
                        lastSegment = lastSegment.substring(lastSegment.indexOf("[") + 1, lastSegment.indexOf("]"));
                    }

                    if (lastSegment !== i)
                    {
                        v.prePath = v.path;
                        v.path = v.path.substring(0, idx) + "/[" + i + "]";
                    }
                    if (v.nameCalculated)
                    {
                        v.preName = v.name;

                        if (v.parent && v.parent.name && v.path)
                        {
                            v.name = v.parent.name + "_" + i;
                        }
                        else
                        {
                            if (v.path)
                            {
                                v.name = v.path.replace(/\//g, "").replace(/\[/g, "_").replace(/\]/g, "");
                            }
                        }

                        if (this.parent.options.rubyrails )
                        {
                            $(v.field).attr('name', v.parent.name);
                        }
                        else
                        {
                            $(v.field).attr('name', v.name);
                        }

                    }

                    if (!v.prePath)
                    {
                        v.prePath = v.path;
                    }

                    updateChildrenPathAndName(v);
                });
            }
        },
        updateToolbars: function()
        {
            var self = this;
            if (this.view.type === "display")
            {
                return;
            }
            if (this.schema.readonly)
            {
                return;
            }
            if (self.toolbar)
            {
                self.fireCallback("arrayToolbar", true);
                self.fireCallback("arrayToolbar");
            }
            if (self.actionbar)
            {
                self.fireCallback("arrayActionbars", true);
                self.fireCallback("arrayActionbars");
            }

            var toolbarEl = $(this.getFieldEl()).find(".alpaca-array-toolbar[data-alpaca-array-toolbar-field-id='" + self.getId() + "']");
            if (this.children.length > 0 && self.options.hideToolbarWithChildren)
            {
                $(toolbarEl).hide();
            }
            else
            {
                $(toolbarEl).show();
                $(toolbarEl).find("[data-alpaca-array-toolbar-action]").each(function() {

                    var actionKey = $(this).attr("data-alpaca-array-toolbar-action");
                    var action = self.findAction(self.toolbar.actions, actionKey);
                    if (action)
                    {
                        $(this).off().click(function(e) {
                            e.preventDefault();
                            action.click.call(self, actionKey, action);
                        });
                    }
                });
            }
            if (typeof(this.options.toolbarSticky) === "undefined" || this.options.toolbarSticky === null)
            {
                var items = this.getFieldEl().find(".alpaca-container-item[data-alpaca-container-item-parent-field-id='" + self.getId() +  "']");
                $(items).each(function(itemIndex) {
                    var actionbarEl = $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() +  "'][data-alpaca-array-actionbar-item-index='" + itemIndex + "']");
                    if (actionbarEl && actionbarEl.length > 0)
                    {
                        $(this).hover(function() {
                            $(actionbarEl).show();
                        }, function() {
                            $(actionbarEl).hide();
                        });

                        $(actionbarEl).hide();
                    }
                });
            }
            else if (this.options.toolbarSticky)
            {
                $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() +  "']").css("display", "inline-block");
            }
            else if (!this.options.toolbarSticky)
            {
                $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() +  "']").hide();
            }
            var actionbarEls = $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-parent-field-id='" + self.getId() + "']");
            $(actionbarEls).each(function() {

                var targetIndex = $(this).attr("data-alpaca-array-actionbar-item-index");
                if (typeof(targetIndex) === "string")
                {
                    targetIndex = parseInt(targetIndex, 10);
                }
                $(this).children("[data-alpaca-array-actionbar-action]").each(function() {

                    var actionKey = $(this).attr("data-alpaca-array-actionbar-action");
                    var action = self.findAction(self.actionbar.actions, actionKey);
                    if (action)
                    {
                        $(this).off().click(function(e) {
                            e.preventDefault();
                            action.click.call(self, actionKey, action, targetIndex);
                        });
                    }
                });
                if (self._validateEqualMaxItems())
                {
                    $(this).children("[data-alpaca-array-toolbar-action='add']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });

                    $(this).children("[data-alpaca-array-actionbar-action='add']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });
                }
                else
                {
                    $(this).children("[data-alpaca-array-toolbar-action='add']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });

                    $(this).children("[data-alpaca-array-actionbar-action='add']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });
                }
                if (self._validateEqualMinItems())
                {
                    $(this).children("[data-alpaca-array-actionbar-action='remove']").each(function(index) {
                        $(this).removeClass('alpaca-button-disabled');
                        self.fireCallback("enableButton", this);
                    });
                }
                else
                {
                    $(this).children("[data-alpaca-array-actionbar-action='remove']").each(function(index) {
                        $(this).addClass('alpaca-button-disabled');
                        self.fireCallback("disableButton", this);
                    });
                }
            });
            $(actionbarEls).first().children("[data-alpaca-array-actionbar-action='up']").each(function() {
                $(this).addClass('alpaca-button-disabled');
                self.fireCallback("disableButton", this);
            });
            $(actionbarEls).last().children("[data-alpaca-array-actionbar-action='down']").each(function() {
                $(this).addClass('alpaca-button-disabled');
                self.fireCallback("disableButton", this);
            });

        },

        doResolveItemContainer: function()
        {
            var self = this;

            return $(self.container);
        },

        handleToolBarAddItemClick: function(callback)
        {
            var self = this;

            self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {
                if (circular)
                {
                    return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                }
                var insertionPoint = self.children.length;

                var itemData = Alpaca.createEmptyDataInstance(itemSchema);
                self.addItem(insertionPoint, itemSchema, itemOptions, itemData, function(item) {
                    if (callback) {
                        callback(item);
                    }
                });
            });
        },

        handleActionBarAddItemClick: function(itemIndex, callback)
        {
            var self = this;

            self.resolveItemSchemaOptions(function(itemSchema, itemOptions, circular) {
                if (circular)
                {
                    return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(itemSchema), self.errorCallback);
                }

                var itemData = Alpaca.createEmptyDataInstance(itemSchema);
                self.addItem(itemIndex + 1, itemSchema, itemOptions, itemData, function(item) {
                    if (callback) {
                        callback(item);
                    }
                });
            });
        },

        handleActionBarRemoveItemClick: function(itemIndex, callback)
        {
            var self = this;

            self.removeItem(itemIndex, function() {
                if (callback) {
                    callback();
                }
            });
        },

        handleActionBarMoveItemUpClick: function(itemIndex, callback)
        {
            var self = this;

            self.swapItem(itemIndex, itemIndex - 1, self.options.animate, function() {
                if (callback) {
                    callback();
                }
            });
        },

        handleActionBarMoveItemDownClick: function(itemIndex, callback)
        {
            var self = this;

            self.swapItem(itemIndex, itemIndex + 1, self.options.animate, function() {
                if (callback) {
                    callback();
                }
            });
        },

        doAddItem: function(index, item, callback)
        {
            var self = this;

            var addItemContainer = self.doResolveItemContainer();
            if (index === 0)
            {
                $(addItemContainer).append(item.containerItemEl);
            }
            else
            {
                var existingElement = addItemContainer.children("[data-alpaca-container-item-index='" + (index-1) + "']");
                if (existingElement && existingElement.length > 0)
                {
                    existingElement.after(item.containerItemEl);
                }
            }

            self.doAfterAddItem(item, function(err) {
                Alpaca.fireReady(item);

                callback(err);
            });
        },

        doAfterAddItem: function(item, callback)
        {
            callback();
        },
        addItem: function(index, schema, options, data, callback)
        {
            var self = this;

            if (self._validateEqualMaxItems())
            {
                self.createItem(index, schema, options, data, function(item) {
                    self.registerChild(item, index);
                    self.doAddItem(index, item, function() {
                        self.handleRepositionDOMRefresh();
                        self.updateToolbars();
                        self.refreshValidationState();
                        self.trigger("add", item);
                        self.triggerUpdate();

                        if (callback)
                        {
                            callback(item);
                        }

                    });
                });
            }
        },

        doRemoveItem: function(childIndex, callback)
        {
            var self = this;

            var removeItemContainer = self.doResolveItemContainer();

            removeItemContainer.children(".alpaca-container-item[data-alpaca-container-item-index='" + childIndex + "']").remove();

            self.doAfterRemoveItem(childIndex, function(err) {
                callback(err);
            });
        },

        doAfterRemoveItem: function(childIndex, callback)
        {
            callback();
        },
        removeItem: function(childIndex, callback)
        {
            var self = this;

            if (this._validateEqualMinItems())
            {
                self.unregisterChild(childIndex);
                self.doRemoveItem(childIndex, function() {
                    self.handleRepositionDOMRefresh();
                    self.updateToolbars();
                    self.refreshValidationState();
                    self.trigger("remove", childIndex);
                    self.triggerUpdate();

                    if (callback)
                    {
                        callback();
                    }

                });
            }
        },
        moveItem: function(sourceIndex, targetIndex, animate, callback)
        {
            var self = this;

            if (typeof(animate) == "function")
            {
                callback = animate;
                animate = self.options.animate;
            }

            if (typeof(animate) == "undefined")
            {
                animate = self.options.animate ? self.options.animate : true;
            }

            if (typeof(sourceIndex) === "string")
            {
                sourceIndex = parseInt(sourceIndex, 10);
            }

            if (typeof(targetIndex) === "string")
            {
                targetIndex = parseInt(targetIndex, 10);
            }

            if (targetIndex < 0)
            {
                targetIndex = 0;
            }
            if (targetIndex >= self.children.length)
            {
                targetIndex = self.children.length - 1;
            }

            if (targetIndex === -1)
            {
                return;
            }

            if (sourceIndex === targetIndex)
            {
                return;
            }

            var targetChild = self.children[targetIndex];
            if (!targetChild)
            {
                return;
            }

            var onComplete = function()
            {
                var adjustedTargetIndex = targetIndex;
                if (sourceIndex < targetIndex) {
                    adjustedTargetIndex--;
                }
                var child = self.children.splice(sourceIndex, 1)[0];
                self.children.splice(adjustedTargetIndex, 0, child);
                self.data = self.getValue();
                self.refresh(function() {
                    self.refreshValidationState();
                    self.triggerUpdate();
                    self.trigger("move");

                    if (callback)
                    {
                        callback();
                    }

                });
            };

            var duration = 0;
            if (animate)
            {
                duration = 500;
            }

            if (duration > 0)
            {
                var parentFieldId = self.getId();
                var sourceContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + sourceIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");
                var targetContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + targetIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");
                var tempSourceMarker = $("<div class='tempMarker1'></div>");
                sourceContainer.before(tempSourceMarker);
                var tempTargetMarker = $("<div class='tempMarker2'></div>");
                targetContainer.before(tempTargetMarker);
                Alpaca.animatedMove(sourceContainer, targetContainer, duration, function () {
                    onComplete();
                });
            }
            else
            {
                onComplete();
            }
        },
        swapItem: function(sourceIndex, targetIndex, animate, callback)
        {
            var self = this;

            if (typeof(animate) == "function")
            {
                callback = animate;
                animate = self.options.animate;
            }

            if (typeof(animate) == "undefined")
            {
                animate = self.options.animate ? self.options.animate : true;
            }

            if (typeof(sourceIndex) === "string")
            {
                sourceIndex = parseInt(sourceIndex, 10);
            }

            if (typeof(targetIndex) === "string")
            {
                targetIndex = parseInt(targetIndex, 10);
            }

            if (targetIndex < 0)
            {
                targetIndex = 0;
            }
            if (targetIndex >= self.children.length)
            {
                targetIndex = self.children.length - 1;
            }

            if (targetIndex === -1)
            {
                return;
            }

            if (sourceIndex === targetIndex)
            {
                return;
            }

            var targetChild = self.children[targetIndex];
            if (!targetChild)
            {
                return;
            }

            var onComplete = function()
            {
                var sourceChild = self.children[sourceIndex];
                var targetChild = self.children[targetIndex];

                self.children[sourceIndex] = targetChild;
                self.children[targetIndex] = sourceChild;
                self.data = self.getValue();
                self.refresh(function() {
                    self.refreshValidationState();
                    self.triggerUpdate();
                    self.trigger("move");

                    if (callback)
                    {
                        callback();
                    }

                });
            };

            var duration = 0;
            if (animate)
            {
                duration = 500;
            }

            if (duration > 0)
            {
                var parentFieldId = self.getId();
                var sourceContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + sourceIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");
                var targetContainer = self.getContainerEl().find(".alpaca-container-item[data-alpaca-container-item-index='" + targetIndex + "'][data-alpaca-container-item-parent-field-id='" + parentFieldId + "']");
                var tempSourceMarker = $("<div class='tempMarker1'></div>");
                sourceContainer.before(tempSourceMarker);
                var tempTargetMarker = $("<div class='tempMarker2'></div>");
                targetContainer.before(tempTargetMarker);
                Alpaca.animatedSwap(sourceContainer, targetContainer, duration, function () {
                    onComplete();
                });
            }
            else
            {
                onComplete();
            }
        },
        getType: function() {
            return "array";
        },
        getTitle: function() {
            return "Array Field";
        },
        getDescription: function() {
            return "Field for list of items with same data type or structure.";
        },
        getSchemaOfSchema: function() {
            var properties = {
                "properties": {
                    "items": {
                        "title": "Array Items",
                        "description": "Schema for array items.",
                        "type": "object"
                    },
                    "minItems": {
                        "title": "Minimum Items",
                        "description": "Minimum number of items.",
                        "type": "number"
                    },
                    "maxItems": {
                        "title": "Maximum Items",
                        "description": "Maximum number of items.",
                        "type": "number"
                    },
                    "uniqueItems": {
                        "title": "Items Unique",
                        "description": "Item values should be unique if true.",
                        "type": "boolean",
                        "default": false
                    }
                }
            };

            if (this.children && this.children[0]) {
                Alpaca.merge(properties.properties.items.properties, this.children[0].getSchemaOfSchema());
            }

            return Alpaca.merge(this.base(), properties);
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "items": {
                        "type": "object"
                    },
                    "minItems": {
                        "type": "integer"
                    },
                    "maxItems": {
                        "type": "integer"
                    },
                    "uniqueItems": {
                        "type": "checkbox"
                    }
                }
            });
        },
        getSchemaOfOptions: function() {
            var properties = {
                "properties": {
                    "toolbarSticky": {
                        "title": "Sticky Toolbar",
                        "description": "If true, the array item toolbar will always be enabled.  If false, the toolbar is always disabled.  If undefined or null, the toolbar will appear when hovered over.",
                        "type": "boolean",
                        "default": undefined
                    },
                    "toolbarStyle": {
                        "title": "Toolbar Style",
                        "description": "The kind of top-level toolbar to render for the array field.  Either 'button' or 'link'.",
                        "type": "string",
                        "default": "button"
                    },
                    "actionbarStyle": {
                        "title": "Actionbar Style",
                        "description": "The kind of actionbar to render for each item in the array.  Either 'top', 'bottom', 'left', or 'right'.",
                        "type": "string",
                        "default": "top"
                    },
                    "toolbar": {
                        "type": "object",
                        "title": "Toolbar Configuration",
                        "properties": {
                            "showLabels": {
                                "type": "boolean",
                                "default": true,
                                "title": "Whether to show labels next to actions"
                            },
                            "actions": {
                                "type": "array",
                                "title": "Toolbar Actions Configuration",
                                "items": {
                                    "action": {
                                        "type": "string",
                                        "title": "Action Key"
                                    },
                                    "label": {
                                        "type": "string",
                                        "title": "Action Label"
                                    },
                                    "iconClass": {
                                        "type": "string",
                                        "title": "Action CSS Classes for Icon"
                                    },
                                    "click": {
                                        "type": "function",
                                        "title": "Action Click Handler"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Whether to enable the action",
                                        "default": true
                                    }
                                }
                            }
                        }
                    },
                    "actionbar": {
                        "type": "object",
                        "properties": {
                            "showLabels": {
                                "type": "boolean",
                                "default": false,
                                "title": "Whether to show labels next to actions"
                            },
                            "actions": {
                                "type": "array",
                                "title": "Actions Bar Actions Configuration",
                                "items": {
                                    "action": {
                                        "type": "string",
                                        "title": "Action Key"
                                    },
                                    "label": {
                                        "type": "string",
                                        "title": "Action Label"
                                    },
                                    "iconClass": {
                                        "type": "string",
                                        "title": "Action CSS Classes for Icon"
                                    },
                                    "click": {
                                        "type": "function",
                                        "title": "Action Click Handler"
                                    },
                                    "enabled": {
                                        "type": "boolean",
                                        "title": "Whether to enable the action",
                                        "default": true
                                    }
                                }
                            }
                        }
                    },
                    "hideToolbarWithChildren": {
                        "type": "boolean",
                        "title": "Hide Toolbar with Children",
                        "description": "Indicates whether to hide the top toolbar when child elements are available.",
                        "default": true
                    }
                }
            };

            if (this.children && this.children[0]) {
                Alpaca.merge(properties.properties.items.properties, this.children[0].getSchemaOfSchema());
            }

            return Alpaca.merge(this.base(), properties);
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "toolbarSticky": {
                        "type": "checkbox"
                    },
                    "items": {
                        "type": "object",
                        "fields": {
                        }
                    }
                }
            });
        }
    });

    Alpaca.registerMessages({
        "notEnoughItems": "The minimum number of items is {0}",
        "tooManyItems": "The maximum number of items is {0}",
        "valueNotUnique": "Values are not unique",
        "notAnArray": "This value is not an Array"
    });
    Alpaca.registerFieldClass("array", Alpaca.Fields.ArrayField);
    Alpaca.registerDefaultSchemaFieldMapping("array", "array");

    Alpaca.registerMessages({
        "addItemButtonLabel": "Add New Item",
        "addButtonLabel": "Add",
        "removeButtonLabel": "Remove",
        "upButtonLabel": "Up",
        "downButtonLabel": "Down"
    });

})(jQuery);
    {
        getFieldType: function() {
            return "object";
        },
        setup: function()
        {
            var self = this;

            this.base();

            var containerItemTemplateType = self.resolveContainerItemTemplateType();
            if (!containerItemTemplateType)
            {
                var x = self.resolveContainerItemTemplateType();
                return Alpaca.throwErrorWithCallback("Unable to find template descriptor for container item: " + self.getFieldType());
            }

            this.containerItemTemplateDescriptor = self.view.getTemplateDescriptor("container-" + containerItemTemplateType + "-item", self);

            if (Alpaca.isEmpty(this.data))
            {
                return;
            }

            if (this.data === "")
            {
                return;
            }

            if (!Alpaca.isObject(this.data))
            {
                if (!Alpaca.isString(this.data))
                {
                    return;
                }
                else
                {
                    try
                    {
                        this.data = Alpaca.parseJSON(this.data);
                        if (!Alpaca.isObject(this.data))
                        {
                            Alpaca.logWarn("ObjectField parsed data but it was not an object: " + JSON.stringify(this.data));
                            return;
                        }
                    }
                    catch (e)
                    {
                        return;
                    }
                }
            }
        },
        setValue: function(data)
        {
            if (!data)
            {
                data = {};
            }
            if (!Alpaca.isObject(data))
            {
                return;
            }
            var existingFieldsByPropertyId = {};
            for (var fieldId in this.childrenById)
            {
                var propertyId = this.childrenById[fieldId].propertyId;
                existingFieldsByPropertyId[propertyId] = this.childrenById[fieldId];
            }
            var newDataByPropertyId = {};
            for (var k in data)
            {
                if (data.hasOwnProperty(k))
                {
                    newDataByPropertyId[k] = data[k];
                }
            }
            for (var propertyId in newDataByPropertyId)
            {
                var field = existingFieldsByPropertyId[propertyId];
                if (field)
                {
                    field.setValue(newDataByPropertyId[propertyId]);

                    delete existingFieldsByPropertyId[propertyId];
                    delete newDataByPropertyId[propertyId];
                }
            }
            for (var propertyId in existingFieldsByPropertyId)
            {
                var field = existingFieldsByPropertyId[propertyId];
                field.setValue(null);
            }
        },
        getContainerValue: function()
        {
            if (this.children.length === 0 && !this.isRequired())
            {
                return {};
            }
            var o = {};

            for (var i = 0; i < this.children.length; i++)
            {
                var propertyId = this.children[i].propertyId;
                var fieldValue = this.children[i].getValue();

                if(fieldValue !== fieldValue) {
                    fieldValue = undefined;
                }

                if (typeof(fieldValue) !== "undefined")
                {
                    if (this.determineAllDependenciesValid(propertyId))
                    {
                        var assignedValue = null;

                        if (typeof(fieldValue) === "boolean")
                        {
                            assignedValue = (fieldValue? true: false);
                        }
                        else if (Alpaca.isArray(fieldValue) || Alpaca.isObject(fieldValue) || Alpaca.isNumber(fieldValue))
                        {
                            assignedValue = fieldValue;
                        }
                        else if (fieldValue || fieldValue === 0)
                        {
                            assignedValue = fieldValue;
                        }

                        if (assignedValue !== null)
                        {
                            o[propertyId] = assignedValue;
                        }
                    }
                }
            }

            return o;
        },
        afterRenderContainer: function(model, callback) {

            var self = this;

            this.base(model, function() {
                if (self.isTopLevel())
                {
                    if (self.view)
                    {
                        self.wizardConfigs = self.view.getWizard();
                        if (typeof(self.wizardConfigs) != "undefined")
                        {
                            if (!self.wizardConfigs || self.wizardConfigs === true)
                            {
                                self.wizardConfigs = {};
                            }
                        }

                        var layoutTemplateDescriptor = self.view.getLayout().templateDescriptor;
                        if (self.wizardConfigs && Alpaca.isObject(self.wizardConfigs))
                        {
                            if (!layoutTemplateDescriptor || self.wizardConfigs.bindings)
                            {
                                self.autoWizard();
                            }
                            else
                            {
                                self.wizard();
                            }
                        }
                    }
                }

                callback();
            });
        },
        createItems: function(callback)
        {
            var self = this;

            var items = [];
            var extraDataProperties = {};
            for (var dataKey in self.data) {
                extraDataProperties[dataKey] = dataKey;
            }

            var properties = self.data;
            if (self.schema && self.schema.properties) {
                properties = self.schema.properties;
            }

            var cf = function()
            {
                var extraDataKeys = [];
                for (var extraDataKey in extraDataProperties) {
                    extraDataKeys.push(extraDataKey);
                }
                if (extraDataKeys.length > 0) {
                    Alpaca.logDebug("There were " + extraDataKeys.length + " extra data keys that were not part of the schema " + JSON.stringify(extraDataKeys));
                }

                callback(items);
            };
            var propertyFunctions = [];
            for (var propertyId in properties)
            {
                var itemData = null;
                if (self.data)
                {
                    if (self.data.hasOwnProperty(propertyId))
                    {
                        itemData = self.data[propertyId];
                    }
                }

                var pf = (function(propertyId, itemData, extraDataProperties)
                {
                    return function(_done)
                    {
                        self.resolvePropertySchemaOptions(propertyId, function (schema, options, circular) {
                            if (circular) {
                                return Alpaca.throwErrorWithCallback("Circular reference detected for schema: " + JSON.stringify(schema), self.errorCallback);
                            }

                            if (!schema) {
                                Alpaca.logDebug("Unable to resolve schema for property: " + propertyId);
                            }

                            self.createItem(propertyId, schema, options, itemData, null, function (addedItemControl) {

                                items.push(addedItemControl);
                                delete extraDataProperties[propertyId];

                                _done();
                            });
                        });
                    };

                })(propertyId, itemData, extraDataProperties);

                propertyFunctions.push(pf);
            }
            Alpaca.nextTick(function() {

                Alpaca.series(propertyFunctions, function(err) {
                    var hasOrderInformation = false;
                    for (var i = 0; i < items.length; i++) {
                        if (typeof(items[i].options.order) !== "undefined") {
                            hasOrderInformation = true;
                            break;
                        }
                    }

                    if (hasOrderInformation)
                    {
                        items.sort(function (a, b) {

                            var orderA = a.options.order;
                            if (!orderA)
                            {
                                orderA = 0;
                            }
                            var orderB = b.options.order;
                            if (!orderB)
                            {
                                orderB = 0;
                            }

                            return (orderA - orderB);
                        });
                    }

                    cf();
                });

            });
        },
        createItem: function(propertyId, itemSchema, itemOptions, itemData, insertAfterId, postRenderCallback)
        {
            var self = this;

            var formEl = $("<div></div>");
            formEl.alpaca({
                "data" : itemData,
                "options": itemOptions,
                "schema" : itemSchema,
                "view" : this.view.id ? this.view.id : this.view,
                "connector": this.connector,
                "error": function(err)
                {
                    self.destroy();

                    self.errorCallback.call(self, err);
                },
                "notTopLevel":true,
                "render" : function(fieldControl, cb) {
                    fieldControl.parent = self;
                    fieldControl.propertyId = propertyId;
                    if (self.path !== "/") {
                        fieldControl.path = self.path + "/" + propertyId;
                    } else {
                        fieldControl.path = self.path + propertyId;
                    }
                    fieldControl.render(null, function() {
                        cb();
                    });
                },
                "postRender": function(control) {
                    var containerItemEl = Alpaca.tmpl(self.containerItemTemplateDescriptor, {
                        "id": self.getId(),
                        "name": control.name,
                        "parentFieldId": self.getId(),
                        "actionbarStyle": self.options.actionbarStyle,
                        "view": self.view,
                        "data": itemData
                    });
                    var insertionPointEl = $(containerItemEl).find("." + Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD);
                    if (insertionPointEl.length === 0)
                    {
                        if ($(containerItemEl).hasClass(Alpaca.MARKER_CLASS_CONTAINER_FIELD_ITEM_FIELD)) {
                            insertionPointEl = $(containerItemEl);
                        }
                    }
                    if (insertionPointEl.length === 0)
                    {
                        self.errorCallback.call(self, {
                            "message": "Cannot find insertion point for field: " + self.getId()
                        });
                        return;
                    }
                    $(insertionPointEl).before(control.getFieldEl());
                    $(insertionPointEl).remove();

                    control.containerItemEl = containerItemEl;
                    Alpaca.fieldApplyFieldAndChildren(control, function(_control) {
                        _control.hideInitValidationError = false;
                    });

                    if (postRenderCallback)
                    {
                        postRenderCallback(control);
                    }
                }
            });
        },
        resolvePropertySchemaOptions: function(propertyId, callback)
        {
            var _this = this;

            var completionFunction = function(resolvedPropertySchema, resolvedPropertyOptions, circular)
            {
                if (_this.options.readonly) {
                    resolvedPropertyOptions.readonly = true;
                }

                callback(resolvedPropertySchema, resolvedPropertyOptions, circular);
            };

            var propertySchema = null;
            if (_this.schema && _this.schema.properties && _this.schema.properties[propertyId]) {
                propertySchema = _this.schema.properties[propertyId];
            }
            var propertyOptions = {};
            if (_this.options && _this.options.fields && _this.options.fields[propertyId]) {
                propertyOptions = _this.options.fields[propertyId];
            }
            if (propertySchema && propertySchema["$ref"])
            {
                var referenceId = propertySchema["$ref"];

                var topField = this;
                var fieldChain = [topField];
                while (topField.parent)
                {
                    topField = topField.parent;
                    fieldChain.push(topField);
                }

                var originalPropertySchema = propertySchema;
                var originalPropertyOptions = propertyOptions;

                Alpaca.loadRefSchemaOptions(topField, referenceId, function(propertySchema, propertyOptions) {
                    var refCount = 0;
                    for (var i = 0; i < fieldChain.length; i++)
                    {
                        if (fieldChain[i].schema)
                        {
                            if ( (fieldChain[i].schema.id === referenceId) || (fieldChain[i].schema.id === "#" + referenceId))
                            {
                                refCount++;
                            }
                            else if ( (fieldChain[i].schema["$ref"] === referenceId))
                            {
                                refCount++;
                            }
                        }
                    }

                    var circular = (refCount > 1);

                    var resolvedPropertySchema = {};
                    if (originalPropertySchema) {
                        Alpaca.mergeObject(resolvedPropertySchema, originalPropertySchema);
                    }
                    if (propertySchema)
                    {
                        Alpaca.mergeObject(resolvedPropertySchema, propertySchema);
                    }
                    if (originalPropertySchema && originalPropertySchema.id) {
                        resolvedPropertySchema.id = originalPropertySchema.id;
                    }

                    var resolvedPropertyOptions = {};
                    if (originalPropertyOptions) {
                        Alpaca.mergeObject(resolvedPropertyOptions, originalPropertyOptions);
                    }
                    if (propertyOptions)
                    {
                        Alpaca.mergeObject(resolvedPropertyOptions, propertyOptions);
                    }

                    Alpaca.nextTick(function() {
                        completionFunction(resolvedPropertySchema, resolvedPropertyOptions, circular);
                    });
                });
            }
            else
            {
                Alpaca.nextTick(function() {
                    completionFunction(propertySchema, propertyOptions);
                });
            }
        },

        applyCreatedItems: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                var f = function(i)
                {
                    if (i === model.items.length)
                    {
                        callback();
                        return;
                    }

                    var item = model.items[i];

                    var propertyId = item.propertyId;
                    self.showOrHidePropertyBasedOnDependencies(propertyId);
                    self.bindDependencyFieldUpdateEvent(propertyId);
                    self.refreshDependentFieldStates(propertyId);

                    f(i+1);
                };
                f(0);
            });
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateMaxProperties();
            valInfo["tooManyProperties"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyProperties"), [this.schema.maxProperties]),
                "status": status
            };

            status = this._validateMinProperties();
            valInfo["tooFewProperties"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("tooManyItems"), [this.schema.minProperties]),
                "status": status
            };

            return baseStatus && valInfo["tooManyProperties"]["status"] && valInfo["tooFewProperties"]["status"];
        },
        _validateMaxProperties: function()
        {
            if (typeof(this.schema["maxProperties"]) == "undefined")
            {
                return true;
            }

            var maxProperties = this.schema["maxProperties"];
            var propertyCount = 0;
            for (var k in this.data)
            {
                propertyCount++;
            }

            return propertyCount <= maxProperties;
        },
        _validateMinProperties: function()
        {
            if (typeof(this.schema["minProperties"]) == "undefined")
            {
                return true;
            }

            var minProperties = this.schema["minProperties"];
            var propertyCount = 0;
            for (var k in this.data)
            {
                propertyCount++;
            }

            return propertyCount >= minProperties;
        },
        showOrHidePropertyBasedOnDependencies: function(propertyId)
        {
            var self = this;

            var item = this.childrenByPropertyId[propertyId];
            if (!item)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }

            var valid = this.determineAllDependenciesValid(propertyId);
            if (valid)
            {
                item.show();
                item.onDependentReveal();
            }
            else
            {
                item.hide();
                item.onDependentConceal();
            }

            item.getFieldEl().trigger("fieldupdate");
        },
        getChildDependencies: function(propertyId)
        {
            var itemDependencies = null;
            if (this.schema.dependencies)
            {
                itemDependencies = this.schema.dependencies[propertyId];
            }
            if (!itemDependencies)
            {
                var item = this.childrenByPropertyId[propertyId];
                if (item)
                {
                    itemDependencies = item.schema.dependencies;
                }
            }

            return itemDependencies;
        },

        getChildConditionalDependencies: function(propertyId)
        {
            var itemConditionalDependencies = null;
            var item = this.childrenByPropertyId[propertyId];
            if (item)
            {
                itemConditionalDependencies = item.options.dependencies;
            }

            return itemConditionalDependencies;
        },
        determineAllDependenciesValid: function(propertyId)
        {
            var self = this;

            var item = this.childrenByPropertyId[propertyId];
            if (!item)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }
            var itemDependencies = self.getChildDependencies(propertyId);;
            if (!itemDependencies)
            {
                return true;
            }

            var valid = true;
            if (Alpaca.isString(itemDependencies))
            {
                valid = self.determineSingleDependencyValid(propertyId, itemDependencies);
            }
            else if (Alpaca.isArray(itemDependencies))
            {
                $.each(itemDependencies, function(index, value) {
                    valid = valid && self.determineSingleDependencyValid(propertyId, value);
                });
            }

            return valid;
        },
        bindDependencyFieldUpdateEvent: function(propertyId)
        {
            var self = this;

            var item = this.childrenByPropertyId[propertyId];
            if (!item)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }

            var itemDependencies = self.getChildDependencies(propertyId);
            if (!itemDependencies)
            {
                return true;
            }
            var bindEvent = function(propertyId, dependencyPropertyId)
            {

                var dependentField = Alpaca.resolveField(self, dependencyPropertyId);
                if (dependentField)
                {
                    dependentField.getFieldEl().bind("fieldupdate", (function(propertyField, dependencyField, propertyId, dependencyPropertyId) {

                        return function(event)
                        {
                            self.showOrHidePropertyBasedOnDependencies(propertyId);

                            propertyField.getFieldEl().trigger("fieldupdate");
                        };

                    })(item, dependentField, propertyId, dependencyPropertyId));
                    dependentField.getFieldEl().trigger("fieldupdate");
                }
            };

            if (Alpaca.isString(itemDependencies))
            {
                bindEvent(propertyId, itemDependencies);
            }
            else if (Alpaca.isArray(itemDependencies))
            {
                $.each(itemDependencies, function(index, value) {
                    bindEvent(propertyId, value);
                });
            }
        },

        refreshDependentFieldStates: function(propertyId)
        {
            var self = this;

            var propertyField = this.childrenByPropertyId[propertyId];
            if (!propertyField)
            {
                return Alpaca.throwErrorWithCallback("Missing property: " + propertyId, self.errorCallback);
            }

            var itemDependencies = self.getChildDependencies(propertyId);
            if (!itemDependencies)
            {
                return true;
            }
            var triggerFieldUpdateForProperty = function(otherPropertyId)
            {
                var dependentField = Alpaca.resolveField(self, otherPropertyId);
                if (dependentField)
                {
                    dependentField.getFieldEl().trigger("fieldupdate");
                }
            };

            if (Alpaca.isString(itemDependencies))
            {
                triggerFieldUpdateForProperty(itemDependencies);
            }
            else if (Alpaca.isArray(itemDependencies))
            {
                $.each(itemDependencies, function(index, value) {
                    triggerFieldUpdateForProperty(value);
                });
            }
        },
        determineSingleDependencyValid: function(propertyId, dependentOnPropertyId)
        {
            var self = this;
            var dependentOnField = Alpaca.resolveField(self, dependentOnPropertyId);
            if (!dependentOnField)
            {
                return false;
            }

            var dependentOnData = dependentOnField.data;
            var valid = false;
            var conditionalDependencies = this.getChildConditionalDependencies(propertyId);
            if (!conditionalDependencies || conditionalDependencies.length === 0)
            {
                if (dependentOnField.getType() === "boolean" && !this.childrenByPropertyId[propertyId].options.dependencies && !dependentOnData)
                {
                    valid = false;
                }
                else
                {
                    valid = !Alpaca.isValEmpty(dependentOnField.data);
                }
            }
            else
            {
                if (dependentOnField.getType() === "boolean" && !dependentOnData) {
                    dependentOnData = false;
                }

                var conditionalData = conditionalDependencies[dependentOnPropertyId];
                if (!Alpaca.isEmpty(conditionalData) && Alpaca.isFunction(conditionalData))
                {
                    valid = conditionalData.call(this, dependentOnData);
                }
                else
                {
                    valid = true;
                    if (Alpaca.isArray(conditionalData)) {
                        if (!Alpaca.anyEquality(dependentOnData, conditionalData))
                        {
                            valid = false;
                        }
                    }
                    else
                    {
                        if (!Alpaca.isEmpty(conditionalData) && !Alpaca.anyEquality(conditionalData, dependentOnData))
                        {
                            valid = false;
                        }
                    }
                }
            }
            if (dependentOnField && dependentOnField.isHidden())
            {
                valid = false;
            }

            return valid;
        },
        getIndex: function(propertyId)
        {
            if (Alpaca.isEmpty(propertyId)) {
                return -1;
            }
            for (var i = 0; i < this.children.length; i++) {
                var pid = this.children[i].propertyId;
                if (pid == propertyId) { // jshint ignore:line
                    return i;
                }
            }
            return -1;
        },
        addItem: function(propertyId, itemSchema, itemOptions, itemData, insertAfterId, callback)
        {
            var self = this;

            this.createItem(propertyId, itemSchema, itemOptions, itemData, insertAfterId, function(child) {

                var index = null;
                if (insertAfterId && self.childrenById[insertAfterId])
                {
                    for (var z = 0; z < self.children.length; z++)
                    {
                        if (self.children[z].getId() == insertAfterId)
                        {
                            index = z;
                            break;
                        }
                    }
                }
                self.registerChild(child, ((index != null) ? index + 1 : 0));
                self.doAddItem(index, child);
                self.handleRepositionDOMRefresh();
                self.refreshValidationState(true, function() {
                    self.trigger("add", child);
                    self.triggerUpdate();
                    child.triggerWithPropagation.call(child, "ready", "down");

                    if (callback)
                    {
                        callback();
                    }

                });
            });
        },

        doAddItem: function(index, item)
        {
            var self = this;
            if (!index)
            {
                $(self.container).prepend(item.containerItemEl);
            }
            else
            {
                var existingElement = self.getContainerEl().children("[data-alpaca-container-item-index='" + index + "']");
                if (existingElement && existingElement.length > 0)
                {
                    existingElement.after(item.containerItemEl);
                }
            }

            self.doAfterAddItem(item, function() {
                Alpaca.fireReady(item);

            });

        },

        doAfterAddItem: function(item, callback)
        {
            callback();
        },

        doResolveItemContainer: function()
        {
            var self = this;

            return $(self.container);
        },
        removeItem: function(propertyId, callback)
        {
            var self = this;

            var childField = this.childrenByPropertyId[propertyId];
            if (childField)
            {
                this.children = $.grep(this.children, function (val, index) {
                    return (val.propertyId !== propertyId);
                });

                delete this.childrenByPropertyId[propertyId];
                delete this.childrenById[childField.getId()];
                self.doRemoveItem(childField);

                this.refreshValidationState(true, function () {
                    self.handleRepositionDOMRefresh();
                    self.trigger("remove", childField);
                    self.triggerUpdate();

                    if (callback)
                    {
                        callback();
                    }
                });
            }
            else
            {
                callback();
            }
        },

        doRemoveItem: function(item)
        {
            var self = this;

            var removeItemContainer = self.doResolveItemContainer();

            removeItemContainer.children(".alpaca-container-item[data-alpaca-container-item-name='" + item.name + "']").remove();
            item.destroy();
        },
        wizard: function()
        {
            var self = this;
            var stepDescriptors = this.wizardConfigs.steps;
            if (!stepDescriptors)
            {
                stepDescriptors = [];
            }
            var wizardTitle = this.wizardConfigs.title;
            var wizardDescription = this.wizardConfigs.description;
            var buttonDescriptors = this.wizardConfigs.buttons;
            if (!buttonDescriptors)
            {
                buttonDescriptors = {};
            }
            if (!buttonDescriptors["previous"])
            {
                buttonDescriptors["previous"] = {}
            }
            if (!buttonDescriptors["previous"].title)
            {
                buttonDescriptors["previous"].title = "Previous";
            }
            if (!buttonDescriptors["previous"].align)
            {
                buttonDescriptors["previous"].align = "left";
            }
            if (!buttonDescriptors["previous"].type)
            {
                buttonDescriptors["previous"].type = "button";
            }
            if (!buttonDescriptors["next"])
            {
                buttonDescriptors["next"] = {}
            }
            if (!buttonDescriptors["next"].title)
            {
                buttonDescriptors["next"].title = "Next";
            }
            if (!buttonDescriptors["next"].align)
            {
                buttonDescriptors["next"].align = "right";
            }
            if (!buttonDescriptors["next"].type)
            {
                buttonDescriptors["next"].type = "button";
            }

            if (!this.wizardConfigs.hideSubmitButton)
            {
                if (!buttonDescriptors["submit"]) {
                    buttonDescriptors["submit"] = {}
                }
                if (!buttonDescriptors["submit"].title) {
                    buttonDescriptors["submit"].title = "Submit";
                }
                if (!buttonDescriptors["submit"].align) {
                    buttonDescriptors["submit"].align = "right";
                }
                if (!buttonDescriptors["submit"].type) {
                    buttonDescriptors["submit"].type = "button";
                }
            }

            for (var buttonKey in buttonDescriptors)
            {
                if (!buttonDescriptors[buttonKey].type)
                {
                    buttonDescriptors[buttonKey].type = "button";
                }
            }
            var showSteps = this.wizardConfigs.showSteps;
            if (typeof(showSteps) == "undefined")
            {
                showSteps = true;
            }
            var showProgressBar = this.wizardConfigs.showProgressBar;
            var performValidation = this.wizardConfigs.validation;
            if (typeof(performValidation) == "undefined")
            {
                performValidation = true;
            }
            var wizardTitle = $(this.field).attr("data-alpaca-wizard-title");
            var wizardDescription = $(this.field).attr("data-alpaca-wizard-description");
            var _wizardValidation = $(this.field).attr("data-alpaca-wizard-validation");
            if (typeof(_wizardValidation) != "undefined")
            {
                performValidation = _wizardValidation ? true : false;
            }
            var _wizardShowSteps = $(this.field).attr("data-alpaca-wizard-show-steps");
            if (typeof(_wizardShowSteps) != "undefined")
            {
                showSteps = _wizardShowSteps ? true : false;
            }
            var _wizardShowProgressBar = $(this.field).attr("data-alpaca-wizard-show-progress-bar");
            if (typeof(_wizardShowProgressBar) != "undefined")
            {
                showProgressBar = _wizardShowProgressBar ? true : false;
            }
            var stepEls = $(this.field).find("[data-alpaca-wizard-role='step']");
            if (stepDescriptors.length == 0)
            {
                stepEls.each(function(i) {

                    var stepDescriptor = {};

                    var stepTitle = $(this).attr("data-alpaca-wizard-step-title");
                    if (typeof(stepTitle) != "undefined")
                    {
                        stepDescriptor.title = stepTitle;
                    }
                    if (!stepDescriptor.title)
                    {
                        stepDescriptor.title = "Step " + i;
                    }

                    var stepDescription = $(this).attr("data-alpaca-wizard-step-description");
                    if (typeof(stepDescription) != "undefined")
                    {
                        stepDescriptor.description = stepDescription;
                    }
                    if (!stepDescriptor.description)
                    {
                        stepDescriptor.description = "Step " + i;
                    }

                    stepDescriptors.push(stepDescriptor);
                });
            }
            if (typeof(showProgressBar) == "undefined")
            {
                if (stepDescriptors.length > 1)
                {
                    showProgressBar = true;
                }
            }
            var model = {};
            model.wizardTitle = wizardTitle;
            model.wizardDescription = wizardDescription;
            model.showSteps = showSteps;
            model.performValidation = performValidation;
            model.steps = stepDescriptors;
            model.buttons = buttonDescriptors;
            model.schema = self.schema;
            model.options = self.options;
            model.data = self.data;
            model.showProgressBar = showProgressBar;
            model.markAllStepsVisited = this.wizardConfigs.markAllStepsVisited;
            model.view = self.view;
            var wizardTemplateDescriptor = self.view.getTemplateDescriptor("wizard", self);
            if (wizardTemplateDescriptor)
            {
                var wizardEl = Alpaca.tmpl(wizardTemplateDescriptor, model);

                $(self.field).append(wizardEl);

                var wizardNav = $(wizardEl).find(".alpaca-wizard-nav");
                var wizardSteps = $(wizardEl).find(".alpaca-wizard-steps");
                var wizardButtons = $(wizardEl).find(".alpaca-wizard-buttons");
                var wizardProgressBar = $(wizardEl).find(".alpaca-wizard-progress-bar");
                $(wizardSteps).append(stepEls);

                (function(wizardNav, wizardSteps, wizardButtons, model) {

                    var currentIndex = 0;

                    var previousButtonEl = $(wizardButtons).find("[data-alpaca-wizard-button-key='previous']");
                    var nextButtonEl = $(wizardButtons).find("[data-alpaca-wizard-button-key='next']");
                    var submitButtonEl = $(wizardButtons).find("[data-alpaca-wizard-button-key='submit']");
                    var refreshSteps = function()
                    {
                        if (model.showSteps)
                        {
                            if (!model.visits)
                            {
                                model.visits = {};
                            }
                            if (model.markAllStepsVisited)
                            {
                                var stepElements = $(wizardNav).find("[data-alpaca-wizard-step-index]");
                                for (var g = 0; g < stepElements.length; g++)
                                {
                                    model.visits[g] = true;
                                }
                            }
                            model.visits[currentIndex] = true;

                            var stepElements = $(wizardNav).find("[data-alpaca-wizard-step-index]");
                            $(stepElements).removeClass("disabled");
                            $(stepElements).removeClass("completed");
                            $(stepElements).removeClass("active");
                            $(stepElements).removeClass("visited");
                            for (var g = 0; g < stepElements.length; g++)
                            {
                                if (g < currentIndex)
                                {
                                    $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("completed");
                                }
                                else if (g === currentIndex)
                                {
                                    $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("active");
                                }
                                else
                                {
                                    if (model.visits && model.visits[g])
                                    {
                                    }
                                    else
                                    {
                                        $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("disabled");
                                    }

                                }

                                if (model.visits && model.visits[g])
                                {
                                    $(wizardNav).find("[data-alpaca-wizard-step-index='" + g + "']").addClass("visited");
                                }
                            }
                        }
                        if (model.showProgressBar)
                        {
                            var valueNow = currentIndex + 1;
                            var valueMax = model.steps.length + 1;
                            var width = parseInt(((valueNow / valueMax) * 100), 10) + "%";

                            $(wizardProgressBar).find(".progress-bar").attr("aria-valuemax", valueMax);
                            $(wizardProgressBar).find(".progress-bar").attr("aria-valuenow", valueNow);
                            $(wizardProgressBar).find(".progress-bar").css("width", width);
                        }
                        previousButtonEl.hide();
                        nextButtonEl.hide();
                        submitButtonEl.hide();
                        if (model.steps.length == 1)
                        {
                            submitButtonEl.show();
                        }
                        else if (model.steps.length > 1)
                        {
                            if (currentIndex > 0)
                            {
                                previousButtonEl.show();
                            }

                            nextButtonEl.show();

                            if (currentIndex == 0)
                            {
                                nextButtonEl.show();
                            }
                            else if (currentIndex == model.steps.length - 1)
                            {
                                nextButtonEl.hide();
                                submitButtonEl.show();
                            }
                        }
                        $(wizardSteps).find("[data-alpaca-wizard-role='step']").hide();
                        $($(wizardSteps).find("[data-alpaca-wizard-role='step']")[currentIndex]).show();

                    };

                    var assertValidation = function(buttonId, callback)
                    {
                        if (!model.performValidation)
                        {
                            callback(true);
                            return;
                        }
                        var fields = [];

                        var currentStepEl = $($(wizardSteps).find("[data-alpaca-wizard-role='step']")[currentIndex]);
                        $(currentStepEl).find(".alpaca-field").each(function() {
                            var fieldId = $(this).attr("data-alpaca-field-id");
                            if (fieldId)
                            {
                                var field = self.childrenById[fieldId];
                                if (field)
                                {
                                    fields.push(field);
                                }
                            }
                        });
                        var fns = [];
                        for (var i = 0; i < fields.length; i++)
                        {
                            fns.push(function(field) {
                                return function(cb)
                                {
                                    field.refreshValidationState(true, function() {
                                        cb();
                                    });
                                }
                            }(fields[i]));
                        }
                        Alpaca.series(fns, function() {

                            var valid = true;
                            for (var i = 0; i < fields.length; i++)
                            {
                                valid = valid && fields[i].isValid(true);
                            }
                            var b = model.buttons[buttonId];
                            if (b && b.validate)
                            {
                                b.validate.call(self, function(_valid) {
                                    valid = valid && _valid;
                                    callback(valid);
                                });
                            }
                            else
                            {
                                callback(valid);
                            }
                        });
                    };

                    $(previousButtonEl).click(function(e) {
                        e.preventDefault();

                        if (currentIndex >= 1)
                        {
                                    var b = model.buttons["previous"];
                                    if (b)
                                    {
                                        if (b.click)
                                        {
                                            b.click.call(self, e);
                                        }
                                    }

                                    currentIndex--;

                                    refreshSteps();
                        }
                    });

                    $(nextButtonEl).click(function(e) {
                        e.preventDefault();

                        if (currentIndex + 1 <= model.steps.length - 1)
                        {
                            assertValidation("next", function(valid) {

                                if (valid)
                                {
                                    var b = model.buttons["next"];
                                    if (b)
                                    {
                                        if (b.click)
                                        {
                                            b.click.call(self, e);
                                        }
                                    }

                                    currentIndex++;

                                    refreshSteps();
                                }
                                else
                                {
                                    window.setTimeout(function() {
                                        self.focus(function(field) {
                                        });
                                    }, 250);
                                }
                            });
                        }
                    });

                    $(submitButtonEl).click(function(e) {
                        e.preventDefault();

                        if (currentIndex === model.steps.length - 1)
                        {
                            assertValidation("submit", function(valid) {

                                if (valid)
                                {
                                    var b = model.buttons["submit"];
                                    if (b)
                                    {
                                        if (b.click)
                                        {
                                            b.click.call(self, e);
                                        }
                                        else
                                        {
                                            if (self.form)
                                            {
                                                self.form.submit();
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    window.setTimeout(function() {
                                        self.focus(function(field) {
                                        });
                                    }, 250);
                                }
                            });
                        }
                    });
                    $(wizardButtons).find("[data-alpaca-wizard-button-key]").each(function() {
                        var key = $(this).attr("data-alpaca-wizard-button-key");
                        if (key != "submit" && key != "next" && key != "previous") { // standard buttons have different behavior
                            var b = model.buttons[key];
                            if (b && b.click) {
                                $(this).click(function (b) {
                                    return function (e) {
                                        b.click.call(self, e);
                                    };
                                }(b));
                            }
                        }
                    });

                    $(wizardNav).find("[data-alpaca-wizard-step-index]").click(function(e) {
                        e.preventDefault();

                        var navIndex = $(this).attr("data-alpaca-wizard-step-index");
                        if (navIndex)
                        {
                            navIndex = parseInt(navIndex, 10);

                            if (navIndex == currentIndex || (model.visits && model.visits[navIndex]))
                            {
                                if (navIndex < currentIndex)
                                {
                                    currentIndex = navIndex;
                                    refreshSteps();
                                }
                                else if (navIndex > currentIndex)
                                {
                                    assertValidation(null, function(valid) {

                                        if (valid)
                                        {
                                            currentIndex = navIndex;
                                            refreshSteps();
                                        }
                                    });
                                }
                                else
                                {
                                }
                            }
                        }
                    });

                    self.on("moveToStep", function(event) {

                        var index = event.index;
                        var skipValidation = event.skipValidation;

                        if ((typeof(index) !== "undefined") && index <= model.steps.length - 1)
                        {
                            if (skipValidation)
                            {
                                currentIndex = index;
                                refreshSteps();
                            }
                            else
                            {
                                assertValidation(null, function(valid) {

                                    if (valid)
                                    {
                                        currentIndex = index;

                                        refreshSteps();
                                    }
                                });
                            }
                        }
                    });

                    self.on("advanceOrSubmit", function(event) {

                        assertValidation(null, function(valid) {

                            if (valid)
                            {
                                if (currentIndex === model.steps.length - 1)
                                {
                                    $(submitButtonEl).click();
                                }
                                else
                                {
                                    $(nextButtonEl).click();
                                }
                            }
                        });
                    });


                    refreshSteps();

                }(wizardNav, wizardSteps, wizardButtons, model));
            }
        },
        autoWizard: function()
        {
            var stepBindings = this.wizardConfigs.bindings;
            if (!stepBindings)
            {
                stepBindings = {};
            }

            for (var propertyId in this.childrenByPropertyId)
            {
                if (!stepBindings.hasOwnProperty(propertyId))
                {
                    stepBindings[propertyId] = 1;
                }
            }
            var createSteps = true;
            if ($(this.field).find("[data-alpaca-wizard-role='step']").length > 0)
            {
                createSteps = false;
            }

            var step = 1;
            var stepFields = [];
            do
            {
                stepFields = [];
                for (var propertyId in stepBindings)
                {
                    if (stepBindings[propertyId] === step)
                    {
                        if (this.childrenByPropertyId && this.childrenByPropertyId[propertyId])
                        {
                            stepFields.push(this.childrenByPropertyId[propertyId]);
                        }
                    }
                }

                if (stepFields.length > 0)
                {
                    var stepEl = null;
                    if (createSteps)
                    {
                        stepEl = $('<div data-alpaca-wizard-role="step"></div>');
                        $(this.field).append(stepEl);
                    }
                    else
                    {
                        stepEl = $($(this.field).find("[data-alpaca-wizard-role='step']")[step-1]);
                    }
                    var hasOrderInformation = false;
                    for (var i = 0; i < stepFields.length; i++) {
                        if (typeof(stepFields[i].options.order) !== "undefined") {
                            hasOrderInformation = true;
                            break;
                        }
                    }

                    if (hasOrderInformation)
                    {
                        stepFields.sort(function (a, b) {

                            var orderA = a.options.order;
                            if (!orderA)
                            {
                                orderA = 0;
                            }
                            var orderB = b.options.order;
                            if (!orderB)
                            {
                                orderB = 0;
                            }

                            return (orderA - orderB);
                        });
                    }
                    for (var i = 0; i < stepFields.length; i++)
                    {
                        $(stepEl).append(stepFields[i].containerItemEl);
                    }

                    step++;
                }
            }
            while (stepFields.length > 0);
            this.wizard();
            if ($(this.container).children().length === 0) {
                $(this.container).css("display", "none");
            }
        },
        getType: function() {
            return "object";
        },
        moveItem: function(sourceIndex, targetIndex, animate, callback)
        {
            var self = this;

            if (typeof(animate) == "function")
            {
                callback = animate;
                animate = self.options.animate;
            }

            if (typeof(animate) == "undefined")
            {
                animate = self.options.animate ? self.options.animate : true;
            }

            if (typeof(sourceIndex) === "string")
            {
                sourceIndex = parseInt(sourceIndex, 10);
            }

            if (typeof(targetIndex) === "string")
            {
                targetIndex = parseInt(targetIndex, 10);
            }

            if (targetIndex < 0)
            {
                targetIndex = 0;
            }
            if (targetIndex >= self.children.length)
            {
                targetIndex = self.children.length - 1;
            }

            if (targetIndex === -1)
            {
                return;
            }

            var targetChild = self.children[targetIndex];
            if (!targetChild)
            {
                return;
            }
            var sourceContainer = self.getContainerEl().children("[data-alpaca-container-item-index='" + sourceIndex + "']");
            var targetContainer = self.getContainerEl().children("[data-alpaca-container-item-index='" + targetIndex + "']");
            var tempSourceMarker = $("<div class='tempMarker1'></div>");
            sourceContainer.before(tempSourceMarker);
            var tempTargetMarker = $("<div class='tempMarker2'></div>");
            targetContainer.before(tempTargetMarker);

            var onComplete = function()
            {
                var tempChildren = [];
                for (var i = 0; i < self.children.length; i++)
                {
                    if (i === sourceIndex)
                    {
                        tempChildren[i] = self.children[targetIndex];
                    }
                    else if (i === targetIndex)
                    {
                        tempChildren[i] = self.children[sourceIndex];
                    }
                    else
                    {
                        tempChildren[i] = self.children[i];
                    }
                }
                self.children = tempChildren;
                tempSourceMarker.replaceWith(targetContainer);
                tempTargetMarker.replaceWith(sourceContainer);
                self.handleRepositionDOMRefresh();
                $(sourceContainer).find("[data-alpaca-array-actionbar-item-index='" + sourceIndex + "']").attr("data-alpaca-array-actionbar-item-index", targetIndex);
                $(targetContainer).find("[data-alpaca-array-actionbar-item-index='" + targetIndex + "']").attr("data-alpaca-array-actionbar-item-index", sourceIndex);
                self.refreshValidationState();
                self.triggerUpdate();
                self.trigger("move");

                if (callback)
                {
                    callback();
                }
            };

            if (animate)
            {
                Alpaca.animatedSwap(sourceContainer, targetContainer, 500, function() {
                    onComplete();
                });
            }
            else
            {
                onComplete();
            }
        },
        getTitle: function() {
            return "Object Field";
        },
        getDescription: function() {
            return "Object field for containing other fields";
        },
        getSchemaOfSchema: function() {
            var properties = {
                "properties": {
                    "properties": {
                        "title": "Properties",
                        "description": "List of child properties.",
                        "type": "object"
                    },
                    "maxProperties": {
                        "type": "number",
                        "title": "Maximum Number Properties",
                        "description": "The maximum number of properties that this object is allowed to have"
                    },
                    "minProperties": {
                        "type": "number",
                        "title": "Minimum Number of Properties",
                        "description": "The minimum number of properties that this object is required to have"
                    }
                }
            };

            var fieldsProperties = properties.properties.properties;

            fieldsProperties.properties = {};

            if (this.children) {
                for (var i = 0; i < this.children.length; i++) {
                    var propertyId = this.children[i].propertyId;
                    fieldsProperties.properties[propertyId] = this.children[i].getSchemaOfSchema();
                    fieldsProperties.properties[propertyId].title = propertyId + " :: " + fieldsProperties.properties[propertyId].title;
                }
            }

            return Alpaca.merge(this.base(), properties);
        },
        getSchemaOfOptions: function() {
            var schemaOfOptions = Alpaca.merge(this.base(), {
                "properties": {
                },
                "order": {
                    "type": "number",
                    "title": "Order",
                    "description": "Allows for optional specification of the index of this field in the properties array."
                }
            });

            var properties = {
                "properties": {
                    "fields": {
                        "title": "Field Options",
                        "description": "List of options for child fields.",
                        "type": "object"
                    }
                }
            };

            var fieldsProperties = properties.properties.fields;

            fieldsProperties.properties = {};

            if (this.children) {
                for (var i = 0; i < this.children.length; i++) {
                    var propertyId = this.children[i].propertyId;
                    fieldsProperties.properties[propertyId] = this.children[i].getSchemaOfOptions();
                    fieldsProperties.properties[propertyId].title = propertyId + " :: " + fieldsProperties.properties[propertyId].title;
                }
            }

            return Alpaca.merge(schemaOfOptions, properties);
        }
    });
    Alpaca.registerMessages({
        "tooManyProperties": "The maximum number of properties ({0}) has been exceeded.",
        "tooFewProperties": "There are not enough properties ({0} are required)"
    });

    Alpaca.registerFieldClass("object", Alpaca.Fields.ObjectField);
    Alpaca.registerDefaultSchemaFieldMapping("object", "object");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AnyField = Alpaca.ControlField.extend(
    {
        getFieldType: function() {
            return "any";
        },
        setup: function()
        {
            this.base();
        },
        getControlValue: function()
        {
            return this._getControlVal(true);
        },
        setValue: function(value)
        {
            if (Alpaca.isEmpty(value))
            {
                this.control.val("");
            }
            else
            {
                this.control.val(value);
            }
            this.base(value);
        },
        disable: function()
        {
            this.control.disabled = true;
        },
        enable: function()
        {
            this.control.disabled = false;
        },
        focus: function(onFocusCallback)
        {
            this.control.focus();

            if (onFocusCallback)
            {
                onFocusCallback(this);
            }
        },
        getType: function() {
            return "any";
        }
        ,
        getTitle: function() {
            return "Any Field";
        },
        getDescription: function() {
            return "Any field.";
        },
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }
    });

    Alpaca.registerFieldClass("any", Alpaca.Fields.AnyField);
    Alpaca.registerDefaultSchemaFieldMapping("any", "any");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.HiddenField = Alpaca.ControlField.extend(
    {
        getFieldType: function()
        {
            return "hidden";
        },
        setup: function()
        {
            this.base();
        },
        getControlValue: function()
        {
            return this._getControlVal(true);
        },
        setValue: function(value)
        {
            if (Alpaca.isEmpty(value)) {
                this.getControlEl().val("");
            } else {
                this.getControlEl().val(value);
            }
            this.base(value);
        },
        getType: function() {
            return "string";
        },
        getTitle: function() {
            return "Hidden";
        },
        getDescription: function() {
            return "Field for a hidden HTML input";
        }

    });

    Alpaca.registerFieldClass("hidden", Alpaca.Fields.HiddenField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AddressField = Alpaca.Fields.ObjectField.extend(
    {
        getFieldType: function() {
            return "address";
        },
        setup: function()
        {
            this.base();

            if (this.data === undefined) {
                this.data = {
                    street: ['', '']
                };
            }

            this.schema = {
                "title": "Home Address",
                "type": "object",
                "properties": {
                    "street": {
                        "title": "Street",
                        "type": "array",
                        "items": {
                            "type": "string",
                            "maxLength": 30,
                            "minItems": 0,
                            "maxItems": 3
                        }
                    },
                    "city": {
                        "title": "City",
                        "type": "string"
                    },
                    "state": {
                        "title": "State",
                        "type": "string",
                        "enum": ["AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY"]
                    },
                    "zip": {
                        "title": "Zip Code",
                        "type": "string",
                        "pattern": /^(\d{5}(-\d{4})?)?$/
                    }
                }
            };
            Alpaca.merge(this.options, {
                "fields": {
                    "zip": {
                        "maskString": "99999",
                        "size": 5
                    },
                    "state": {
                        "optionLabels": ["ALABAMA", "ALASKA", "AMERICANSAMOA", "ARIZONA", "ARKANSAS", "CALIFORNIA", "COLORADO", "CONNECTICUT", "DELAWARE", "DISTRICTOFCOLUMBIA", "FEDERATEDSTATESOFMICRONESIA", "FLORIDA", "GEORGIA", "GUAM", "HAWAII", "IDAHO", "ILLINOIS", "INDIANA", "IOWA", "KANSAS", "KENTUCKY", "LOUISIANA", "MAINE", "MARSHALLISLANDS", "MARYLAND", "MASSACHUSETTS", "MICHIGAN", "MINNESOTA", "MISSISSIPPI", "MISSOURI", "MONTANA", "NEBRASKA", "NEVADA", "NEWHAMPSHIRE", "NEWJERSEY", "NEWMEXICO", "NEWYORK", "NORTHCAROLINA", "NORTHDAKOTA", "NORTHERNMARIANAISLANDS", "OHIO", "OKLAHOMA", "OREGON", "PALAU", "PENNSYLVANIA", "PUERTORICO", "RHODEISLAND", "SOUTHCAROLINA", "SOUTHDAKOTA", "TENNESSEE", "TEXAS", "UTAH", "VERMONT", "VIRGINISLANDS", "VIRGINIA", "WASHINGTON", "WESTVIRGINIA", "WISCONSIN", "WYOMING"]
                    }
                }
            });

            if (Alpaca.isEmpty(this.options.addressValidation))
            {
                this.options.addressValidation = true;
            }
        },
        isContainer: function()
        {
            return false;
        },
        getAddress: function()
        {
            var value = this.getValue();
            if (this.view.type === "view")
            {
                value = this.data;
            }
            var address = "";
            if (value)
            {
                if (value.street)
                {
                    $.each(value.street, function(index, value) {
                        address += value + " ";
                    });
                }
                if (value.city)
                {
                    address += value.city + " ";
                }
                if (value.state)
                {
                    address += value.state + " ";
                }
                if (value.zip)
                {
                    address += value.zip;
                }
            }

            return address;
        },
        afterRenderContainer: function(model, callback) {

            var self = this;

            this.base(model, function() {
                var container = self.getContainerEl();
                $(container).addClass("alpaca-addressfield");

                if (self.options.addressValidation && !self.isDisplayOnly())
                {
                    $('<div style="clear:both;"></div>').appendTo(container);
                    var mapButton = $('<div class="alpaca-form-button">Show Google Map</div>').appendTo(container);
                    if (mapButton.button)
                    {
                        mapButton.button({
                            text: true
                        });
                    }
                    mapButton.click(function() {

                        if (google && google.maps)
                        {
                            var geocoder = new google.maps.Geocoder();
                            var address = self.getAddress();
                            if (geocoder)
                            {
                                geocoder.geocode({
                                    'address': address
                                }, function(results, status)
                                {
                                    if (status === google.maps.GeocoderStatus.OK)
                                    {
                                        var mapCanvasId = self.getId() + "-map-canvas";
                                        if ($('#' + mapCanvasId).length === 0)
                                        {
                                            $("<div id='" + mapCanvasId + "' class='alpaca-field-address-mapcanvas'></div>").appendTo(self.getFieldEl());
                                        }

                                        var map = new google.maps.Map(document.getElementById(self.getId() + "-map-canvas"), {
                                            "zoom": 10,
                                            "center": results[0].geometry.location,
                                            "mapTypeId": google.maps.MapTypeId.ROADMAP
                                        });

                                        var marker = new google.maps.Marker({
                                            map: map,
                                            position: results[0].geometry.location
                                        });

                                    }
                                    else
                                    {
                                        self.displayMessage("Geocoding failed: " + status);
                                    }
                                });
                            }

                        }
                        else
                        {
                            self.displayMessage("Google Map API is not installed.");
                        }
                    }).wrap('<small/>');

                    if (self.options.showMapOnLoad)
                    {
                        mapButton.click();
                    }
                }

                callback();

            });
        },
        getType: function() {
            return "any";
        }
        ,
        getTitle: function() {
            return "Address";
        },
        getDescription: function() {
            return "Standard US Address with Street, City, State and Zip. Also comes with support for Google map.";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "validateAddress": {
                        "title": "Address Validation",
                        "description": "Enable address validation if true",
                        "type": "boolean",
                        "default": true
                    },
                    "showMapOnLoad": {
                        "title": "Whether to show the map when first loaded",
                        "type": "boolean"
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "validateAddress": {
                        "helper": "Address validation if checked",
                        "rightLabel": "Enable Google Map for address validation?",
                        "type": "checkbox"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("address", Alpaca.Fields.AddressField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CKEditorField = Alpaca.Fields.TextAreaField.extend(
    {
        getFieldType: function() {
            return "ckeditor";
        },
        setup: function()
        {
            if (!this.data)
            {
                this.data = "";
            }

            this.base();

            if (typeof(this.options.ckeditor) == "undefined")
            {
                this.options.ckeditor = {};
            }
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {
                if (!self.isDisplayOnly() && self.control && typeof(CKEDITOR) !== "undefined")
                {
                    self.on("ready", function() {
                        if (!self.editor)
                        {
                            self.editor = CKEDITOR.replace($(self.control)[0], self.options.ckeditor);

                            self.initCKEditorEvents();
                        }
                    });
                }
                $(self.control).bind('destroyed', function() {

                    if (self.editor)
                    {
                        self.editor.removeAllListeners();
                        try { self.editor.destroy(false); } catch (e) { }
                        self.editor = null;
                    }

                });

                callback();
            });
        },

        initCKEditorEvents: function()
        {
            var self = this;

            if (self.editor)
            {
                self.editor.on("click", function (e) {
                    self.onClick.call(self, e);
                    self.trigger("click", e);
                });
                self.editor.on("change", function (e) {
                    self.onChange();
                    self.triggerWithPropagation("change", e);
                });
                self.editor.on('blur', function (e) {
                    self.onBlur();
                    self.trigger("blur", e);
                });
                self.editor.on("focus", function (e) {
                    self.onFocus.call(self, e);
                    self.trigger("focus", e);
                });
                self.editor.on("key", function (e) {
                    self.onKeyPress.call(self, e);
                    self.trigger("keypress", e);
                });
            }
        },

        setValue: function(value)
        {
            var self = this;
            this.base(value);

            if (self.editor)
            {
                self.editor.setData(value);
            }
        },
        getControlValue: function()
        {
            var self = this;

            var value = null;

            if (self.editor)
            {
                value = self.editor.getData();
            }

            return value;
        },
        destroy: function()
        {
            var self = this;
            if (self.editor)
            {
                self.editor.destroy();
                self.editor = null;
            }
            this.base();
        }
        ,
        getTitle: function() {
            return "CK Editor";
        },
        getDescription: function() {
            return "Provides an instance of a CK Editor control for use in editing HTML.";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "ckeditor": {
                        "title": "CK Editor options",
                        "description": "Use this entry to provide configuration options to the underlying CKEditor plugin.",
                        "type": "any"
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "ckeditor": {
                        "type": "any"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("ckeditor", Alpaca.Fields.CKEditorField);

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ColorField = Alpaca.Fields.TextField.extend(
    {
        setup: function()
        {
            var self = this;

            this.spectrumAvailable = false;
            if (!self.isDisplayOnly() && typeof($.fn.spectrum) !== "undefined")
            {
                this.spectrumAvailable = true;
            }
            if (typeof(this.options.spectrum) === "undefined" && self.spectrumAvailable)
            {
                this.inputType = "color";
            }

            this.base();
            if (typeof(this.options.spectrum) === "undefined")
            {
                this.options.spectrum = {};
            }
            if (typeof(this.options.spectrum.showInput) === "undefined")
            {
                this.options.spectrum.showInput = true;
            }
            if (typeof(this.options.spectrum.showPalette) === "undefined")
            {
                this.options.spectrum.showPalette = true;
            }
            if (typeof(this.options.spectrum.preferredFormat) === "undefined")
            {
                this.options.spectrum.preferredFormat = "hex3";
            }
            if (typeof(this.options.spectrum.clickoutFiresChange) === "undefined")
            {
                this.options.spectrum.clickoutFiresChange = true;
            }
        },
        getFieldType: function() {
            return "color";
        },
        getType: function() {
            return "string";
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {
                if (self.spectrumAvailable && self.control)
                {
                    setTimeout(function() {
                        $((self.control)[0]).spectrum(
                          $.extend({ color: this.data }, self.options.spectrum)
                        );
                    }, 100);

                    $(self.control).on('change.spectrum', function(e, tinycolor) {
                        self.setValue(tinycolor.toHexString());
                    });
                }

                callback();
            });
        },
        getTitle: function() {
            return "Color Field";
        },
        getDescription: function() {
            return "A color picker for selecting hexadecimal color values";
        }
    });

    Alpaca.registerFieldClass("color", Alpaca.Fields.ColorField);
    Alpaca.registerDefaultSchemaFieldMapping("color", "color");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.CountryField = Alpaca.Fields.SelectField.extend(
    {
        getFieldType: function() {
            return "country";
        },
        setup: function()
        {
            if (Alpaca.isUndefined(this.options.capitalize))
            {
                this.options.capitalize = false;
            }

            this.schema["enum"] = [];
            this.options.optionLabels = [];

            var countriesMap = this.getMessage("countries");
            if (countriesMap)
            {
                for (var countryKey in countriesMap)
                {
                    this.schema["enum"].push(countryKey);

                    var label = countriesMap[countryKey];
                    if (this.options.capitalize)
                    {
                        label = label.toUpperCase();
                    }

                    this.options.optionLabels.push(label);
                }
            }

            this.base();
        }
        ,
        getTitle: function() {
            return "Country Field";
        },
        getDescription: function() {
            return "Provides a dropdown selector of countries keyed by their ISO3 code.  The names of the countries are read from the I18N bundle for the current locale.";
        },
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "capitalize": {
                        "title": "Capitalize",
                        "description": "Whether the values should be capitalized",
                        "type": "boolean",
                        "default": false,
                        "readonly": true
                    }
                }
            });

        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "capitalize": {
                        "type": "checkbox"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("country", Alpaca.Fields.CountryField);
    Alpaca.registerDefaultFormatFieldMapping("country", "country");

})(jQuery);

(function($) {

    var round = (function() {
        var strategies = {
            up:      Math.ceil,
            down:    function(input) { return ~~input; },
            nearest: Math.round
        };
        return function(strategy) {
            return strategies[strategy];
        };
    })();

    var Alpaca = $.alpaca;

    Alpaca.Fields.CurrencyField = Alpaca.Fields.TextField.extend(
    {
        constructor: function(container, data, options, schema, view, connector, errorCallback) {
            options = options || {};

            var pfOptionsSchema = this.getSchemaOfPriceFormatOptions().properties;
            for (var i in pfOptionsSchema) {
                var option = pfOptionsSchema[i];
                if (!(i in options)) {
                    options[i] = option["default"] || undefined;
                }
            }

            if (typeof(data) !== "undefined")
            {
                data = "" + parseFloat(data).toFixed(options.centsLimit);
            }

            this.base(container, data, options, schema, view, connector, errorCallback);
        },
        getFieldType: function() {
            return "currency";
        },
        afterRenderControl: function(model, callback) {

            var self = this;

            var field = this.getControlEl();

            this.base(model, function() {

                $(field).priceFormat(self.options);

                callback();

            });
        },
        getControlValue: function() {

            var field = this.getControlEl();

            var val = $(field).is('input') ? field.val() : field.html();
            if (this.options.unmask || this.options.round !== "none") {
                var unmasked = function() {
                    var result = '';
                    for (var i in val) {
                        var cur = val[i];
                        if (!isNaN(cur)) {
                            result += cur;
                        } else if (cur === this.options.centsSeparator) {
                            result += '.';
                        }
                    }
                    return parseFloat(result);
                }.bind(this)();
                if (this.options.round !== "none") {
                    unmasked = round(this.options.round)(unmasked);
                    if (!this.options.unmask) {
                        var result = [];
                        var unmaskedString = "" + unmasked;
                        for (var i = 0, u = 0; i < val.length; i++) {
                            if (!isNaN(val[i])) {
                                result.push(unmaskedString[u++] || 0);
                            } else {
                                result.push(val[i]);
                            }
                        }
                        return result.join('');
                    }
                }
                return unmasked;
            } else {
                return val;
            }
        }
        ,
        getTitle: function() {
            return "Currency Field";
        },
        getDescription: function() {
            return "Provides an automatically formatted and configurable input for entering currency amounts.";
        },

        getSchemaOfPriceFormatOptions: function() {
            return {
                "properties": {
                    "allowNegative": {
                        "title": "Allow Negative",
                        "description": "Determines if negative numbers are allowed.",
                        "type": "boolean",
                        "default": false
                    },
                    "centsLimit": {
                        "title": "Cents Limit",
                        "description": "The limit of fractional digits.",
                        "type": "number",
                        "default": 2,
                        "minimum": 0
                    },
                    "centsSeparator": {
                        "title": "Cents Separator",
                        "description": "The separator between whole and fractional amounts.",
                        "type": "text",
                        "default": "."
                    },
                    "clearPrefix": {
                        "title": "Clear Prefix",
                        "description": "Determines if the prefix is cleared on blur.",
                        "type": "boolean",
                        "default": false
                    },
                    "clearSuffix": {
                        "title": "Clear Suffix",
                        "description": "Determines if the suffix is cleared on blur.",
                        "type": "boolean",
                        "default": false
                    },
                    "insertPlusSign": {
                        "title": "Plus Sign",
                        "description": "Determines if a plus sign should be inserted for positive values.",
                        "type": "boolean",
                        "default": false
                    },
                    "limit": {
                        "title": "Limit",
                        "description": "A limit of the length of the field.",
                        "type": "number",
                        "default": undefined,
                        "minimum": 0
                    },
                    "prefix": {
                        "title": "Prefix",
                        "description": "The prefix if any for the field.",
                        "type": "text",
                        "default": "$"
                    },
                    "round": {
                        "title": "Round",
                        "description": "Determines if the field is rounded. (Rounding is done when getValue is called and is not reflected in the UI)",
                        "type": "string",
                        "enum": [ "up", "down", "nearest", "none" ],
                        "default": "none"
                    },
                    "suffix": {
                        "title": "Suffix",
                        "description": "The suffix if any for the field.",
                        "type": "text",
                        "default": ""
                    },
                    "thousandsSeparator": {
                        "title": "Thousands Separator",
                        "description": "The separator between thousands.",
                        "type": "string",
                        "default": ","
                    },
                    "unmask": {
                        "title": "Unmask",
                        "description": "If true then the resulting value for this field will be unmasked.  That is, the resulting value will be a float instead of a string (with the prefix, suffix, etc. removed).",
                        "type": "boolean",
                        "default": true
                    }
                }
            };
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), this.getSchemaOfPriceFormatOptions());
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "allowNegative": {
                        "type": "checkbox"
                    },
                    "centsLimit": {
                        "type": "number"
                    },
                    "centsSeparator": {
                        "type": "text"
                    },
                    "clearPrefix": {
                        "type": "checkbox"
                    },
                    "clearSuffix": {
                        "type": "checkbox"
                    },
                    "insertPlusSign": {
                        "type": "checkbox"
                    },
                    "limit": {
                        "type": "number"
                    },
                    "prefix": {
                        "type": "text"
                    },
                    "round": {
                        "type": "select"
                    },
                    "suffix": {
                        "type": "text"
                    },
                    "thousandsSeparator": {
                        "type": "string"
                    },
                    "unmask": {
                        "type": "checkbox"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("currency", Alpaca.Fields.CurrencyField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.DateField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "date";
        },

        getDefaultFormat: function() {
            return "MM/DD/YYYY";
        },

        getDefaultExtraFormats: function() {
            return [];
        },
        setup: function()
        {
            var self = this;

            this.base();

            if (!self.options.picker)
            {
                self.options.picker = {};
            }

            if (typeof(self.options.picker.useCurrent) === "undefined") {
                self.options.picker.useCurrent = false;
            }

            if (self.options.picker.format) {
                self.options.dateFormat = self.options.picker.format;
            }
            if (!self.options.dateFormat) {
                self.options.dateFormat = self.getDefaultFormat();
            }
            if (!self.options.picker.format) {
                self.options.picker.format = self.options.dateFormat;
            }

            if (!self.options.picker.locale) {
                self.options.picker.locale = "en_US";
            }

            if (!self.options.picker.dayViewHeaderFormat) {
                self.options.picker.dayViewHeaderFormat = "MMMM YYYY";
            }
            if (!self.options.picker.extraFormats) {
                var extraFormats = self.getDefaultExtraFormats();
                if (extraFormats) {
                    self.options.picker.extraFormats = extraFormats;
                }
            }

            if (typeof(self.options.manualEntry) === "undefined")
            {
                self.options.manualEntry = false;
            }
        },
        
        onKeyPress: function(e)
        {
            if (this.options.manualEntry)
            {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            else
            {
                this.base(e);
                return;
            }
        },
        
        onKeyDown: function(e)
        {
            if (this.options.manualEntry)
            {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            else
            {
                this.base(e);
                return;
            }
        },

        beforeRenderControl: function(model, callback)
        {
            this.field.css("position", "relative");

            callback();
        },
        afterRenderControl: function(model, callback) {

            var self = this;

            this.base(model, function() {

                if (self.view.type !== "display")
                {
                    if ($.fn.datetimepicker)
                    {
                        self.getControlEl().datetimepicker(self.options.picker);

                        self.picker = self.getControlEl().data("DateTimePicker");
                        if (self.picker && self.options.dateFormat)
                        {
                            self.picker.format(self.options.dateFormat);
                        }
                        if (self.picker)
                        {
                            self.options.dateFormat = self.picker.format();
                        }
                        self.getFieldEl().on("dp.change", function(e) {
                            setTimeout(function() {
                                self.onChange.call(self, e);
                                self.triggerWithPropagation("change", e);
                            }, 250);

                        });
                        if (self.data) {
                            self.picker.date(self.data);
                        }
                    }
                }

                callback();

            });
        },
        setManualEntry: function(manualEntry)
        {
            this.options.manualEntry = manualEntry;
        },
        getDate: function()
        {
            var self = this;

            var date = null;
            try
            {
                if (self.picker)
                {
                    date = (self.picker.date() ? self.picker.date()._d: null);
                }
                else
                {
                    date = new Date(this.getValue());
                }
            }
            catch (e)
            {
                console.error(e);
            }

            return date;
        },
        date: function()
        {
            return this.getDate();
        },
        onChange: function(e)
        {
            this.base();

            this.refreshValidationState();
        },

        isAutoFocusable: function()
        {
            return false;
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateDateFormat();
            valInfo["invalidDate"] = {
                "message": status ? "" : Alpaca.substituteTokens(this.getMessage("invalidDate"), [this.options.dateFormat]),
                "status": status
            };

            return baseStatus && valInfo["invalidDate"]["status"];
        },
        _validateDateFormat: function()
        {
            var self = this;

            var isValid = true;

            if (self.options.dateFormat)
            {
                var value = self.getValue();
                if (value || self.isRequired())
                {
                    var dateFormats = [];
                    dateFormats.push(self.options.dateFormat);
                    if (self.options.picker && self.options.picker.extraFormats)
                    {
                        for (var i = 0; i < self.options.picker.extraFormats.length; i++)
                        {
                            dateFormats.push(self.options.picker.extraFormats[i]);
                        }
                    }

                    for (var i = 0; i < dateFormats.length; i++)
                    {
                        isValid = isValid || Alpaca.moment(value, self.options.dateFormat, true).isValid();
                    }
                }
            }

            return isValid;
        },
        setValue: function(value)
        {
            var self = this;

            this.base(value);

            if (this.picker)
            {
                if (Alpaca.moment(value, self.options.dateFormat, true).isValid())
                {
                    this.picker.date(value);
                }
            }
        },

        destroy: function()
        {
            this.base();

            this.picker = null;
        }
        ,
        getTitle: function() {
            return "Date Field";
        },
        getDescription: function() {
            return "Date Field";
        },
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"date",
                        "enum" : ["date"],
                        "readonly":true
                    }
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "dateFormat": {
                        "title": "Date Format",
                        "description": "Date format (using moment.js format)",
                        "type": "string"
                    },
                    "picker": {
                        "title": "DatetimePicker options",
                        "description": "Options that are supported by the <a href='http://eonasdan.github.io/bootstrap-datetimepicker/'>Bootstrap DateTime Picker</a>.",
                        "type": "any"
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "dateFormat": {
                        "type": "text"
                    },
                    "picker": {
                        "type": "any"
                    }
                }
            });
        }
    });

    Alpaca.registerMessages({
        "invalidDate": "Invalid date for format {0}"
    });
    Alpaca.registerFieldClass("date", Alpaca.Fields.DateField);
    Alpaca.registerDefaultFormatFieldMapping("date", "date");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.DatetimeField = Alpaca.Fields.DateField.extend(
        {
            getFieldType: function() {
                return "datetime";
            },

            getDefaultFormat: function() {
                return "MM/DD/YYYY HH:mm:ss";
            },

            getDefaultExtraFormats: function() {
                return [
                    "MM/DD/YYYY hh:mm:ss a",
                    "MM/DD/YYYY HH:mm",
                    "MM/DD/YYYY"
                ];
            },
            setup: function()
            {
                var self = this;

                this.base();
            }
            ,
            getTitle: function() {
                return "Datetime Field";
            },
            getDescription: function() {
                return "Datetime Field based on <a href='http://eonasdan.github.io/bootstrap-datetimepicker/'>Bootstrap DateTime Picker</a>.";
            }
        });

    Alpaca.registerFieldClass("datetime", Alpaca.Fields.DatetimeField);
    Alpaca.registerDefaultFormatFieldMapping("datetime", "datetime");
    Alpaca.registerDefaultFormatFieldMapping("date-time", "datetime");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.EditorField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "editor";
        },

        setup: function()
        {
            var self = this;

            this.base();

            if (!self.options.aceTheme)
            {
                self.options.aceTheme = "ace/theme/chrome";
            }

            if (!self.options.aceMode)
            {
                self.options.aceMode = "ace/mode/json";
            }

            if (typeof(self.options.beautify) == "undefined")
            {
                self.options.beautify = true;
            }

            if (self.options.beautify && this.data)
            {
                if (self.options.aceMode === "ace/mode/json")
                {
                    if (Alpaca.isObject(this.data))
                    {
                        this.data = JSON.stringify(this.data, null, "    ");
                    }
                    else if (Alpaca.isString(this.data))
                    {
                        this.data = JSON.stringify(JSON.parse(this.data), null, "    ");
                    }
                }

                if (self.options.aceMode === "ace/mode/html")
                {
                    if (typeof(html_beautify) !== "undefined")
                    {
                        this.data = html_beautify(this.data);
                    }
                }

                if (self.options.aceMode === "ace/mode/css")
                {
                    if (typeof(css_beautify) !== "undefined")
                    {
                        this.data = css_beautify(this.data);
                    }
                }

                if (self.options.aceMode === "ace/mode/javascript")
                {
                    if (typeof(js_beautify) !== "undefined")
                    {
                        this.data = js_beautify(this.data);
                    }
                }
            }

            if (self.options.aceMode === "ace/mode/json")
            {
                if (!this.data || this.data === "{}")
                {
                    this.data = "{\n\t\n}";
                }
            }

        },
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.control)
                {
                    var aceHeight = self.options.aceHeight;
                    if (aceHeight)
                    {
                        $(self.control).css("height", aceHeight);
                    }
                    var aceWidth = self.options.aceWidth;
                    if (!aceWidth) {
                        aceWidth = "100%";
                    }
                    $(self.control).css("width", aceWidth);
                }
                var el = $(self.control)[0];
                if (!ace && window.ace) {
                    ace = window.ace;
                }

                if (!ace)
                {
                    Alpaca.logError("Editor Field is missing the 'ace' Cloud 9 Editor");
                }
                else
                {
                    self.editor = ace.edit(el);
                    self.editor.setOptions({
                        maxLines: Infinity
                    });

                    self.editor.getSession().setUseWrapMode(true);
                    var aceTheme = self.options.aceTheme;
                    self.editor.setTheme(aceTheme);
                    var aceMode = self.options.aceMode;
                    self.editor.getSession().setMode(aceMode);

                    self.editor.renderer.setHScrollBarAlwaysVisible(false);
                    self.editor.setShowPrintMargin(false);
                    self.editor.setValue(self.data);
                    self.editor.clearSelection();
                    self.editor.getSession().getUndoManager().reset();
                    if (self.options.aceFitContentHeight)
                    {
                        var heightUpdateFunction = function() {

                            var first = false;
                            if (self.editor.renderer.lineHeight === 0)
                            {
                                first = true;
                                self.editor.renderer.lineHeight = 16;
                            }
                            var newHeight = self.editor.getSession().getScreenLength() * self.editor.renderer.lineHeight + self.editor.renderer.scrollBar.getWidth();

                            $(self.control).height(newHeight.toString() + "px");
                            self.editor.resize();

                            if (first)
                            {
                                window.setTimeout(function() {
                                    self.editor.clearSelection();
                                }, 100);
                            }
                        };
                        heightUpdateFunction();
                        self.editor.getSession().on('change', heightUpdateFunction);
                    }
                    if (self.schema.readonly)
                    {
                        self.editor.setReadOnly(true);
                    }
                    $(el).bind('destroyed', function() {

                        if (self.editor)
                        {
                            self.editor.destroy();
                            self.editor = null;
                        }

                    });
                }

                callback();
            });

        },
        destroy: function()
        {
            if (this.editor)
            {
                this.editor.destroy();
                this.editor = null;
            }
            this.base();
        },
        getEditor: function()
        {
            return this.editor;
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var wordCountStatus =  this._validateWordCount();
            valInfo["wordLimitExceeded"] = {
                "message": wordCountStatus ? "" : Alpaca.substituteTokens(this.getMessage("wordLimitExceeded"), [this.options.wordlimit]),
                "status": wordCountStatus
            };

            var editorAnnotationsStatus = this._validateEditorAnnotations();
            valInfo["editorAnnotationsExist"] = {
                "message": editorAnnotationsStatus ? "" : this.getMessage("editorAnnotationsExist"),
                "status": editorAnnotationsStatus
            };

            return baseStatus && valInfo["wordLimitExceeded"]["status"] && valInfo["editorAnnotationsExist"]["status"];
        },

        _validateEditorAnnotations: function()
        {
            if (this.editor)
            {
                var annotations = this.editor.getSession().getAnnotations();
                if (annotations && annotations.length > 0)
                {
                    return false;
                }
            }

            return true;
        },
        _validateWordCount: function()
        {
            if (this.options.wordlimit && this.options.wordlimit > -1)
            {
                var val = this.editor.getValue();

                if (val)
                {
                    var wordcount = val.split(" ").length;
                    if (wordcount > this.options.wordlimit)
                    {
                        return false;
                    }
                }
            }

            return true;
        },
        onDependentReveal: function()
        {
            if (this.editor)
            {
                this.editor.resize();
            }
        },
        setValue: function(value)
        {
            var self = this;

            if (this.editor)
            {
                if (self.schema.type == "object" && Alpaca.isObject(value))
                {
                    value = JSON.stringify(value, null, "    ");
                }

                this.editor.setValue(value);
                self.editor.clearSelection();
            }
            this.base(value);
        },
        getControlValue: function()
        {
            var value = null;

            if (this.editor)
            {
                value = this.editor.getValue();
            }
            if (this.schema.type == "object")
            {
                if (!value)
                {
                    value = {};
                }
                else
                {
                    value = JSON.parse(value);
                }
            }

            return value;
        }
        ,
        getTitle: function() {
            return "Editor";
        },
        getDescription: function() {
            return "Editor";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "aceTheme": {
                        "title": "ACE Editor Theme",
                        "description": "Specifies the theme to set onto the editor instance",
                        "type": "string",
                        "default": "ace/theme/twilight"
                    },
                    "aceMode": {
                        "title": "ACE Editor Mode",
                        "description": "Specifies the mode to set onto the editor instance",
                        "type": "string",
                        "default": "ace/mode/javascript"
                    },
                    "aceWidth": {
                        "title": "ACE Editor Height",
                        "description": "Specifies the width of the wrapping div around the editor",
                        "type": "string",
                        "default": "100%"
                    },
                    "aceHeight": {
                        "title": "ACE Editor Height",
                        "description": "Specifies the height of the wrapping div around the editor",
                        "type": "string",
                        "default": "300px"
                    },
                    "aceFitContentHeight": {
                        "title": "ACE Fit Content Height",
                        "description": "Configures the ACE Editor to auto-fit its height to the contents of the editor",
                        "type": "boolean",
                        "default": false
                    },
                    "wordlimit": {
                        "title": "Word Limit",
                        "description": "Limits the number of words allowed in the text area.",
                        "type": "number",
                        "default": -1
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "aceTheme": {
                        "type": "text"
                    },
                    "aceMode": {
                        "type": "text"
                    },
                    "wordlimit": {
                        "type": "integer"
                    }
                }
            });
        }

    });

    Alpaca.registerMessages({
        "wordLimitExceeded": "The maximum word limit of {0} has been exceeded.",
        "editorAnnotationsExist": "The editor has errors in it that must be corrected"
    });

    Alpaca.registerFieldClass("editor", Alpaca.Fields.EditorField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.EmailField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "email";
        },
        setup: function()
        {
            this.inputType = "email";

            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.email;
            }
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidEmail");
            }

            return baseStatus;
        }
        ,
        getTitle: function() {
            return "Email Field";
        },
        getDescription: function() {
            return "Email Field.";
        },
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern) ? this.schema.pattern : Alpaca.regexps.email;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "enum":[pattern],
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"email",
                        "enum":["email"],
                        "readonly":true
                    }
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        }
    });

    Alpaca.registerMessages({
        "invalidEmail": "Invalid Email address e.g. info@cloudcms.com"
    });
    Alpaca.registerFieldClass("email", Alpaca.Fields.EmailField);
    Alpaca.registerDefaultFormatFieldMapping("email", "email");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.GridField = Alpaca.Fields.ArrayField.extend(
    {
        getFieldType: function() {
            return "grid";
        },

        setup: function()
        {
            this.base();

            if (typeof(this.options.grid) == "undefined")
            {
                this.options.grid = {};
            }
        },

        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {
                var gridData = [];
                var headers = [];
                for (var key in self.options.fields)
                {
                    var fieldDefinition = self.options.fields[key];

                    var label = key;
                    if (fieldDefinition.label)
                    {
                        label = fieldDefinition.label;
                    }

                    headers.push(label);
                }
                gridData.push(headers);

                for (var i = 0; i < self.data.length; i++)
                {
                    var row = [];
                    for (var key2 in self.data[i])
                    {
                        row.push(self.data[i][key2]);
                    }
                    gridData.push(row);
                }

                var holder = $(self.container).find(".alpaca-container-grid-holder");

                var gridConfig = self.options.grid;
                gridConfig.data = gridData;

                $(holder).handsontable(gridConfig);

                callback();
            });
        },
        getType: function() {
            return "array";
        }
        ,
        getTitle: function() {
            return "Grid Field";
        },
        getDescription: function() {
            return "Renders array items into a grid";
        }
    });

    Alpaca.registerFieldClass("grid", Alpaca.Fields.GridField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ImageField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "image";
        }
        ,
        getTitle: function() {
            return "Image Field";
        },
        getDescription: function() {
            return "Image Field.";
        }
    });

    Alpaca.registerFieldClass("image", Alpaca.Fields.ImageField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.IntegerField = Alpaca.Fields.NumberField.extend(
    {
        getFieldType: function() {
            return "integer";
        },
        getControlValue: function()
        {
            var val = this.base();

            if (typeof(val) == "undefined" || "" == val)
            {
                return val;
            }

            return parseInt(val, 10);
        },
        onChange: function(e)
        {
            this.base();

            if (this.slider)
            {
                this.slider.slider("value", this.getValue());
            }
        },
        postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                if (self.options.slider)
                {
                    if (!Alpaca.isEmpty(self.schema.maximum) && !Alpaca.isEmpty(self.schema.minimum))
                    {
                        if (self.control)
                        {
                            self.control.after('<div id="slider"></div>');

                            self.slider = $('#slider', self.control.parent()).slider({
                                value: self.getValue(),
                                min: self.schema.minimum,
                                max: self.schema.maximum,
                                slide: function(event, ui) {
                                    self.setValue(ui.value);
                                    self.refreshValidationState();
                                }
                            });
                        }
                    }
                }

                callback();
            });
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateInteger();
            valInfo["stringNotANumber"] = {
                "message": status ? "" : this.getMessage("stringNotAnInteger"),
                "status": status
            };

            return baseStatus;
        },
        _validateInteger: function()
        {
            var textValue = this._getControlVal();
            if (typeof(textValue) === "number")
            {
                textValue = "" + textValue;
            }
            if (Alpaca.isValEmpty(textValue)) {
                return true;
            }
            var validNumber = Alpaca.testRegex(Alpaca.regexps.integer, textValue);
            if (!validNumber)
            {
                return false;
            }
            var floatValue = this.getValue();
            if (isNaN(floatValue)) {
                return false;
            }

            return true;
        },
        getType: function() {
            return "integer";
        }
        ,
        getTitle: function() {
            return "Integer Field";
        },
        getDescription: function() {
            return "Field for integers.";
        },
        getSchemaOfSchema: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "minimum": {
                        "title": "Minimum",
                        "description": "Minimum value of the property.",
                        "type": "integer"
                    },
                    "maximum": {
                        "title": "Maximum",
                        "description": "Maximum value of the property.",
                        "type": "integer"
                    },
                    "divisibleBy": {
                        "title": "Divisible By",
                        "description": "Property value must be divisible by this number.",
                        "type": "integer"
                    }
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "minimum": {
                        "helper": "Minimum value of the field.",
                        "type": "integer"
                    },
                    "maximum": {
                        "helper": "Maximum value of the field.",
                        "type": "integer"
                    },
                    "divisibleBy": {
                        "helper": "Property value must be divisible by this number.",
                        "type": "integer"
                    }
                }
            });
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "slider": {
                        "title": "Slider",
                        "description": "Generate jQuery UI slider control with the field if true.",
                        "type": "boolean",
                        "default": false
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "slider": {
                        "rightLabel": "Slider control ?",
                        "helper": "Generate slider control if selected.",
                        "type": "checkbox"
                    }
                }
            });
        }
    });
    Alpaca.registerMessages({
        "stringNotAnInteger": "This value is not an integer."
    });
    Alpaca.registerFieldClass("integer", Alpaca.Fields.IntegerField);
    Alpaca.registerDefaultSchemaFieldMapping("integer", "integer");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.IPv4Field = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "ipv4";
        },
        setup: function()
        {
            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.ipv4;
            }
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"])
            {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidIPv4");
            }

            return baseStatus;
        }
        ,
        getTitle: function() {
            return "IP Address Field";
        },
        getDescription: function() {
            return "IP Address Field.";
        },
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern)? this.schema.pattern : Alpaca.regexps.ipv4;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "enum": ["ip-address"],
                        "default":"ip-address",
                        "readonly":true
                    }
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(),{
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        }
    });

    Alpaca.registerMessages({
        "invalidIPv4": "Invalid IPv4 address, e.g. 192.168.0.1"
    });
    Alpaca.registerFieldClass("ipv4", Alpaca.Fields.IPv4Field);
    Alpaca.registerDefaultFormatFieldMapping("ip-address", "ipv4");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.JSONField = Alpaca.Fields.TextAreaField.extend(
    {
        getFieldType: function() {
            return "json";
        },
        setValue: function(value)
        {
            if (Alpaca.isObject(value) || typeof(value) === "object")
            {
                value = JSON.stringify(value, null, 3);
            }

            this.base(value);
        },
        getControlValue: function()
        {
            var val = this.base();

            if (val && Alpaca.isString(val))
            {
                val = JSON.parse(val);
            }

            return val;
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateJSON();
            valInfo["stringNotAJSON"] = {
                "message": status.status ? "" : this.getMessage("stringNotAJSON") +" "+ status.message,
                "status": status.status
            };

            return baseStatus && valInfo["stringNotAJSON"]["status"] ;
        },
        _validateJSON: function()
        {
            var textValue = this.control.val();
            if (Alpaca.isValEmpty(textValue))
            {
                return {
                    "status" : true
                };
            }
            try
            {
                var obj = JSON.parse(textValue);
                this.setValue(JSON.stringify(obj, null, 3));
                return {
                    "status" : true
                };
            }
            catch(e)
            {
                return {
                    "status" : false,
                    "message" : e.message
                };
            }
        },
        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                if (self.control)
                {
                    self.control.bind('keypress', function(e) {

                        var code = e.keyCode || e.wich;

                        if (code === 34) {
                            self.control.insertAtCaret('"');
                        }
                        if (code === 123) {
                            self.control.insertAtCaret('}');
                        }
                        if (code === 91) {
                            self.control.insertAtCaret(']');
                        }
                    });

                    self.control.bind('keypress', 'Ctrl+l', function() {
                        self.getFieldEl().removeClass("alpaca-field-focused");
                        self.refreshValidationState();
                    });

                    self.control.attr('title','Type Ctrl+L to format and validate the JSON string.');
                }

                callback();

            });

        }
        ,
        getTitle: function() {
            return "JSON Editor";
        },
        getDescription: function() {
            return "Editor for JSON objects with basic validation and formatting.";
        }
    });
    Alpaca.registerMessages({
        "stringNotAJSON": "This value is not a valid JSON string."
    });

    Alpaca.registerFieldClass("json", Alpaca.Fields.JSONField);

    $.fn.insertAtCaret = function (myValue) {

        return this.each(function() {
            if (document.selection) {

                this.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();

            } else if (this.selectionStart || this.selectionStart == '0') { // jshint ignore:line
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos /*+ myValue.length*/;
                this.selectionEnd = startPos /*+ myValue.length*/;
                this.scrollTop = scrollTop;

            } else {

                this.value += myValue;
                this.focus();
            }
        });
    };
    jQuery.hotkeys = {
        version: "0.8",

        specialKeys: {
            8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
            20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
            96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
            104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
            120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
        },

        shiftNums: {
            "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
            "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
            ".": ">",  "/": "?",  "\\": "|"
        }
    };

    function keyHandler( handleObj ) {
        if ( typeof handleObj.data !== "string" ) {
            return;
        }

        var origHandler = handleObj.handler,
            keys = handleObj.data.toLowerCase().split(" ");

        handleObj.handler = function( event ) {
            if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
                 event.target.type === "text") ) {
                return;
            }
            var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
                character = String.fromCharCode( event.which ).toLowerCase(),
                key, modif = "", possible = {};
            if ( event.altKey && special !== "alt" ) {
                modif += "alt+";
            }

            if ( event.ctrlKey && special !== "ctrl" ) {
                modif += "ctrl+";
            }
            if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
                modif += "meta+";
            }

            if ( event.shiftKey && special !== "shift" ) {
                modif += "shift+";
            }

            if ( special ) {
                possible[ modif + special ] = true;

            } else {
                possible[ modif + character ] = true;
                possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;
                if ( modif === "shift+" ) {
                    possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
                }
            }

            for ( var i = 0, l = keys.length; i < l; i++ ) {
                if ( possible[ keys[i] ] ) {
                    return origHandler.apply( this, arguments );
                }
            }
        };
    }

    jQuery.each([ "keydown", "keyup", "keypress" ], function() {
        jQuery.event.special[ this ] = { add: keyHandler };
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.LowerCaseField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "lowercase";
        },
        setup: function()
        {
            var self = this;

            this.base();

            if (this.data) {
                this.data = this.data.toLowerCase();
            }
        },
        setValue: function(val)
        {
            if (!val)
            {
                return this.base(val);
            }

            var lowerValue = val.toLowerCase();

            if (lowerValue != this.getValue()) // jshint ignore:line
            {
                this.base(lowerValue);
            }
        },
        onKeyPress: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });
        }
        ,
        getTitle: function() {
            return "Lowercase Text";
        },
        getDescription: function() {
            return "Text field for lowercase text.";
        }
    });

    Alpaca.registerFieldClass("lowercase", Alpaca.Fields.LowerCaseField);
    Alpaca.registerDefaultFormatFieldMapping("lowercase", "lowercase");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MapField = Alpaca.Fields.ArrayField.extend(
    {
        getFieldType: function() {
            return "map";
        },

        getType: function()
        {
            return "object"
        },
        setup: function()
        {
            if (this.data && Alpaca.isObject(this.data))
            {
                var newData = [];

                $.each(this.data, function(key, value) {
                    var newValue = Alpaca.copyOf(value);
                    newValue["_key"] = key;
                    newData.push(newValue);
                });

                this.data = newData;
            }

            this.base();

            Alpaca.mergeObject(this.options, {
                "forceRevalidation" : true
            });

            if (Alpaca.isEmpty(this.data))
            {
                return;
            }
        },
        getContainerValue: function()
        {
            if (this.children.length === 0 && !this.isRequired())
            {
                return;
            }
            var o = {};
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];
                if (key)
                {
                    delete v["_key"];
                    o[key] = v;
                }
            }

            return o;
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var isValidMapKeysNotEmpty = this._validateMapKeysNotEmpty();
            valInfo["keyMissing"] = {
                "message": isValidMapKeysNotEmpty ? "" : this.getMessage("keyMissing"),
                "status": isValidMapKeysNotEmpty
            };

            var isValidMapKeysUnique = this._validateMapKeysUnique();
            valInfo["keyNotUnique"] = {
                "message": isValidMapKeysUnique ? "" : this.getMessage("keyNotUnique"),
                "status": isValidMapKeysUnique
            };

            return baseStatus && valInfo["keyMissing"]["status"] && valInfo["keyNotUnique"]["status"];
        },
        _validateMapKeysNotEmpty: function()
        {
            var isValid = true;

            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (!key)
                {
                    isValid = false;
                    break;
                }
            }

            return isValid;
        },
        _validateMapKeysUnique: function()
        {
            var isValid = true;

            var keys = {};
            for (var i = 0; i < this.children.length; i++)
            {
                var v = this.children[i].getValue();
                var key = v["_key"];

                if (keys[key])
                {
                    isValid = false;
                }

                keys[key] = key;
            }

            return isValid;
        }
        ,
        getTitle: function() {
            return "Map Field";
        },
        getDescription: function() {
            return "Field for objects with key/value pairs that share the same schema for values.";
        }
    });

    Alpaca.registerFieldClass("map", Alpaca.Fields.MapField);
    Alpaca.registerMessages({
        "keyNotUnique": "Keys of map field are not unique.",
        "keyMissing": "Map contains an empty key."
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.OptionTreeField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "optiontree";
        },
        setup: function()
        {
            var self = this;

            this.base();

            if (!this.options.tree)
            {
                this.options.tree = {};
            }

            if (!this.options.tree.selectors)
            {
                this.options.tree.selectors = {};
            }

            if (!this.options.tree.order)
            {
                this.options.tree.order = [];
            }
            for (var k in this.options.tree.selectors)
            {
                if (!this.options.tree.selectors[k].schema) {
                    Alpaca.logError("OptionTree selector for: " + k + " is missing schema");
                    return;
                }

                if (!this.options.tree.selectors[k].options) {
                    this.options.tree.selectors[k].options = {};
                }
            }

            if (!this.options.tree.data)
            {
                this.options.tree.data = [];
            }
            for (var i = 0; i < this.options.tree.data.length; i++)
            {
                var item = this.options.tree.data[i];

                if (item.attributes)
                {
                    for (var k in item.attributes)
                    {
                        if (!this.options.tree.selectors[k])
                        {
                            this.options.tree.selectors[k] = {};
                        }

                        if (!this.options.tree.selectors[k].label)
                        {
                            this.options.tree.selectors[k].options.noneLabel = "Choose...";
                        }

                        if (!this.options.tree.selectors[k].type)
                        {
                            this.options.tree.selectors[k].options.type = "select";
                        }
                    }
                }
            }
            if (!self.options.tree.order)
            {
                self.options.tree.order = [];

                for (var k in self.options.tree.selectors)
                {
                    self.options.tree.order.push(self.options.tree.selectors[k]);
                }
            }

            if (typeof(self.options.tree.horizontal) === "undefined")
            {
                self.options.tree.horizontal = true;
            }
            this.locationValueLists = {};
            this.locationValues = {};

            for (var i = 0; i < self.options.tree.data.length; i++)
            {
                if (self.options.tree.data[i].attributes)
                {
                    var location = "root";

                    for (var k in self.options.tree.data[i].attributes)
                    {
                        var v = self.options.tree.data[i].attributes[k];

                        var array = this.locationValueLists[location];
                        if (!array) {
                            array = [];
                            this.locationValueLists[location] = array;
                        }

                        var exists = false;
                        for (var x = 0; x < array.length; x++)
                        {
                            if (array[x].value === v) {
                                exists = true;
                                break;
                            }
                        }

                        if (!exists)
                        {
                            array.push({
                                "text": v,
                                "value": v
                            });
                        }

                        if (location.length > 0) {
                            location += "~";
                        }

                        location += k + "=" + v;
                    }

                    this.locationValues[location] = self.options.tree.data[i].value;
                }
            }

            this.currentAttributes = {};
            this.controls = {};
        },

        toLocation: function(attrs)
        {
            var location = "root";

            for (var k in attrs)
            {
                var v = attrs[k];

                if (location.length > 0) {
                    location += "~";
                }

                location += k + "=" + v;
            }

            return location;
        },

        existsLocationWithPrefix: function(prefix)
        {
            var match = false;

            for (var k in this.locationValueLists)
            {
                if (k.indexOf(prefix) > -1)
                {
                    match = true;
                    break;
                }
            }

            return match;
        },
        afterRenderControl: function(model, callback) {

            var self = this;

            self.optionTreeHolder = $(self.field).find(".optiontree");

            if (self.options.tree.horizontal)
            {
                $(self.field).addClass("optiontree-horizontal");
            }

            this.base(model, function() {

                self.refreshOptionTreeControls(function() {
                    callback();
                });

            });
        },

        refreshOptionTreeControls: function(callback)
        {
            var self = this;
            for (var k in self.controls)
            {
                self.controls[k].hide();
            }
            var displayUpToIndex = 0;
            for (var i = 0; i < self.options.tree.order.length; i++)
            {
                var selectorId = self.options.tree.order[i];

                if (typeof(self.currentAttributes[selectorId]) !== "undefined" && self.currentAttributes[selectorId] !== null  && self.currentAttributes[selectorId] !== "")
                {
                    displayUpToIndex++;
                }
            }
            var location = "root";
            var fns = [];
            var displayCount = 0;
            var i = 0;
            do
            {
                if (i < self.options.tree.order.length)
                {
                    var selectorId = self.options.tree.order[i];

                    var hasMatches = (i == self.options.tree.order.length - 1) || (self.existsLocationWithPrefix(location + "~" + selectorId + "="));
                    if (hasMatches)
                    {
                        if (displayCount <= displayUpToIndex)
                        {
                            if (self.controls[selectorId])
                            {
                                self.controls[selectorId].show();

                                location += "~" + selectorId + "=" + self.currentAttributes[selectorId];
                            }
                            else
                            {
                                var selector = self.options.tree.selectors[selectorId];
                                var last = (i + 1 === self.options.tree.order.length);

                                var fn = function(index, selectorId, selector, controls, optionTreeHolder, last) {
                                    return function(done) {

                                        var alpacaSchema = selector.schema;

                                        var alpacaOptions = selector.options;
                                        if (!alpacaOptions) {
                                            alpacaOptions = {};
                                        }
                                        if (!alpacaOptions.type) {
                                            alpacaOptions.type = "select";
                                        }

                                        if (alpacaOptions.type === "select") {

                                            alpacaOptions.dataSource = function(callback) {

                                                var currentLocation = self.toLocation(self.currentAttributes);
                                                var currentValueList = self.locationValueLists[currentLocation];

                                                callback(currentValueList);

                                            };
                                        }
                                        var domEl = $("<div class='optiontree-selector'></div>");

                                        $(domEl).alpaca({
                                            "schema": alpacaSchema,
                                            "options": alpacaOptions,
                                            "postRender": function(control) {

                                                controls[selectorId] = control;
                                                $(optionTreeHolder).append(domEl);

                                                control.selectorId = selectorId;
                                                control.on("change", function() {

                                                    var selectorId = this.selectorId;
                                                    self.currentAttributes[selectorId] = this.getValue();
                                                    for (var i = 0; i < self.options.tree.order.length; i++)
                                                    {
                                                        if (i > index)
                                                        {
                                                            var selectorId = self.options.tree.order[i];
                                                            delete self.currentAttributes[selectorId];
                                                            if (controls[selectorId])
                                                            {
                                                                controls[selectorId].destroy();
                                                                delete controls[selectorId];
                                                            }
                                                        }
                                                    }

                                                    if (last)
                                                    {
                                                        var val = null;

                                                        for (var i = 0; i < self.options.tree.data.length; i++)
                                                        {
                                                            var match = true;

                                                            var attrs = self.options.tree.data[i].attributes;
                                                            for (var k in self.currentAttributes)
                                                            {
                                                                if (attrs[k] !== self.currentAttributes[k])
                                                                {
                                                                    match = false;
                                                                    break;
                                                                }
                                                            }

                                                            if (match)
                                                            {
                                                                val = self.options.tree.data[i].value;
                                                            }
                                                        }

                                                        if (val)
                                                        {
                                                            self.setValue(val);
                                                        }
                                                    }

                                                    self.refreshOptionTreeControls();
                                                });
                                                control.show();

                                                done();
                                            }
                                        });
                                    }
                                }(i, selectorId, selector, self.controls, self.optionTreeHolder, last);

                                fns.push(fn);

                                location += "~" + selectorId + "=" + self.currentAttributes[selectorId];
                            }

                            displayCount++;
                        }
                        else
                        {
                            if (self.controls[selectorId])
                            {
                                self.controls[selectorId].destroy();
                                delete self.controls[selectorId];
                            }
                        }
                    }
                    else
                    {
                        if (self.controls[selectorId])
                        {
                            self.controls[selectorId].destroy();
                            delete self.controls[selectorId];
                        }
                    }
                }

                i++;
            }
            while (i < self.options.tree.order.length);

            Alpaca.series(fns, function() {

                if (callback)
                {
                    callback();
                }

            });

        },
        getType: function() {
            return "any";
        }
        ,
        getTitle: function() {
            return "Option Tree";
        },
        getDescription: function() {
            return "Option Tree";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "tree": {
                        "type": "object",
                        "properties": {
                            "options": {
                                "type": "object"
                            },
                            "order": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "data": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "any"
                                        },
                                        "attributes": {
                                            "type": "object"
                                        }
                                    }
                                }
                            },
                            "horizontal": {
                                "type": "boolean"
                            }
                        }
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                }
            });
        }
    });

    Alpaca.registerFieldClass("optiontree", Alpaca.Fields.OptionTreeField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PasswordField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "password";
        },
        setup: function()
        {
            this.base();

            if (!this.schema.pattern)
            {
                this.schema.pattern = Alpaca.regexps.password;
            }
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidPassword");
            }

            return baseStatus;
        }
        ,
        getTitle: function() {
            return "Password Field";
        },
        getDescription: function() {
            return "Password Field.";
        },
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern)? this.schema.pattern : /^[0-9a-zA-Z\x20-\x7E]*$/;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": this.schema.pattern,
                        "enum":[pattern],
                        "readonly": true
                    },
					"format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
						"default":"password",
                        "enum":["password"],
						"readonly":true
                    }
                }
            });
        },
		getOptionsForSchema: function() {
            return Alpaca.merge(this.base(),{
				"fields": {
					"format": {
						"type": "text"
					}
				}
			});
        }
    });

    Alpaca.registerMessages({
        "invalidPassword": "Invalid Password"
    });
    Alpaca.registerFieldClass("password", Alpaca.Fields.PasswordField);
    Alpaca.registerDefaultFormatFieldMapping("password", "password");
})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PersonalNameField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "personalname";
        },
        setValue: function(val)
        {
            if (!val)
            {
                return this.base(val);
            }
            var upperValue = "";

            for (var i = 0; i < val.length; i++)
            {
                if (i === 0)
                {
                    upperValue += val.charAt(i).toUpperCase();
                }
                else if (val.charAt(i - 1) === ' ' || val.charAt(i - 1) === '-' || val.charAt(i - 1) === "'")
                {
                    upperValue += val.charAt(i).toUpperCase();
                }
                else
                {
                    upperValue += val.charAt(i);
                }
            }

            if (upperValue != this.getValue()) // jshint ignore:line
            {
                this.base(upperValue);
            }
        },
        onKeyPress: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });

        }
        ,
        getTitle: function() {
            return "Personal Name";
        },
        getDescription: function() {
            return "Text Field for personal name with captical letter for first letter & after hyphen, space or apostrophe.";
        }
    });

    Alpaca.registerFieldClass("personalname", Alpaca.Fields.PersonalNameField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PhoneField = Alpaca.Fields.TextField.extend(
    {
        setup: function()
        {
            this.inputType = "tel";

            this.base();

            if (!this.schema.pattern) {
                this.schema.pattern = Alpaca.regexps.phone;
            }

            if (Alpaca.isEmpty(this.options.maskString)) {
                this.options.maskString = "(999) 999-9999";
            }

        },
        postRender: function(callback) {

            var self = this;

            this.base(function() {

                callback();

            });
        },
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {
                valInfo["invalidPattern"]["message"] = this.getMessage("invalidPhone");
            }

            return baseStatus;
        },
        getFieldType: function() {
            return "phone";
        }
        ,
        getTitle: function() {
            return "Phone Field";
        },
        getDescription: function() {
            return "Phone Field.";
        },
        getSchemaOfSchema: function() {
            var pattern = (this.schema && this.schema.pattern) ? this.schema.pattern : Alpaca.regexps.phone;
            return Alpaca.merge(this.base(), {
                "properties": {
                    "pattern": {
                        "title": "Pattern",
                        "description": "Field Pattern in Regular Expression",
                        "type": "string",
                        "default": pattern,
                        "enum":[pattern],
                        "readonly": true
                    },
                    "format": {
                        "title": "Format",
                        "description": "Property data format",
                        "type": "string",
                        "default":"phone",
                        "enum":["phone"],
                        "readonly":true
                    }
                }
            });
        },
        getOptionsForSchema: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "maskString": {
                        "title": "Field Mask String",
                        "description": "Expression for field mask",
                        "type": "string",
                        "default": "(999) 999-9999"
                    }
                }
            });
        }
    });

    Alpaca.registerMessages({
        "invalidPhone": "Invalid Phone Number, e.g. (123) 456-9999"
    });
    Alpaca.registerFieldClass("phone", Alpaca.Fields.PhoneField);
    Alpaca.registerDefaultFormatFieldMapping("phone", "phone");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.SearchField = Alpaca.Fields.TextField.extend(
    {
        setup: function()
        {
            this.inputType = "search";

            this.base();

            this.options.attributes.results = 5;
        },
        getFieldType: function() {
            return "search";
        },
        getType: function() {
            return "string";
        },
        getTitle: function() {
            return "Search Field";
        },
        getDescription: function() {
            return "A search box field";
        }
    });

    Alpaca.registerFieldClass("search", Alpaca.Fields.SearchField);
    Alpaca.registerDefaultSchemaFieldMapping("search", "search");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.usHoldings = {};

    Alpaca.usHoldings.territories = {
        "American Samoa"                 : "AS",
        "District Of Columbia"           : "DC",
        "Federated States Of Micronesia" : "FM",
        "Guam"                           : "GU",
        "Marshall Islands"               : "MH",
        "Northern Mariana Islands"       : "MP",
        "Palau"                          : "PW",
        "Puerto Rico"                    : "PR",
        "Virgin Islands"                 : "VI"
    };

    Alpaca.usHoldings.states =  {
        "Alabama"                        : "AL",
        "Alaska"                         : "AK",
        "Arizona"                        : "AZ",
        "Arkansas"                       : "AR",
        "California"                     : "CA",
        "Colorado"                       : "CO",
        "Connecticut"                    : "CT",
        "Delaware"                       : "DE",
        "Florida"                        : "FL",
        "Georgia"                        : "GA",
        "Hawaii"                         : "HI",
        "Idaho"                          : "ID",
        "Illinois"                       : "IL",
        "Indiana"                        : "IN",
        "Iowa"                           : "IA",
        "Kansas"                         : "KS",
        "Kentucky"                       : "KY",
        "Louisiana"                      : "LA",
        "Maine"                          : "ME",
        "Maryland"                       : "MD",
        "Massachusetts"                  : "MA",
        "Michigan"                       : "MI",
        "Minnesota"                      : "MN",
        "Mississippi"                    : "MS",
        "Missouri"                       : "MO",
        "Montana"                        : "MT",
        "Nebraska"                       : "NE",
        "Nevada"                         : "NV",
        "New Hampshire"                  : "NH",
        "New Jersey"                     : "NJ",
        "New Mexico"                     : "NM",
        "New York"                       : "NY",
        "North Carolina"                 : "NC",
        "North Dakota"                   : "ND",
        "Ohio"                           : "OH",
        "Oklahoma"                       : "OK",
        "Oregon"                         : "OR",
        "Pennsylvania"                   : "PA",
        "Rhode Island"                   : "RI",
        "South Carolina"                 : "SC",
        "South Dakota"                   : "SD",
        "Tennessee"                      : "TN",
        "Texas"                          : "TX",
        "Utah"                           : "UT",
        "Vermont"                        : "VT",
        "Virginia"                       : "VA",
        "Washington"                     : "WA",
        "West Virginia"                  : "WV",
        "Wisconsin"                      : "WI",
        "Wyoming"                        : "WY"
    };

    Alpaca.Fields.StateField = Alpaca.Fields.SelectField.extend(
    {
        getFieldType: function() {
            return "state";
        },
        setup: function()
        {
            if (Alpaca.isUndefined(this.options.capitalize)) {
                this.options.capitalize = false;
            }
            if (Alpaca.isUndefined(this.options.includeStates)) {
                this.options.includeStates = true;
            }
            if (Alpaca.isUndefined(this.options.includeTerritories)) {
                this.options.includeTerritories = true;
            }
            if (Alpaca.isUndefined(this.options.format)) {
                this.options.format = "name";
            }
            if (this.options.format === "name" || this.options.format === "code")
            {
            }
            else
            {
                Alpaca.logError("The configured state format: " + this.options.format + " is not a legal value [name, code]");
                this.options.format = "name";
            }
            var holdings = Alpaca.retrieveUSHoldings(
                this.options.includeStates,
                this.options.includeTerritories,
                (this.options.format === "code"),
                this.options.capitalize);

            this.schema["enum"] = holdings.keys;
            this.options.optionLabels = holdings.values;

            this.base();
        }
        ,
        getTitle: function() {
            return "State Field";
        },
        getDescription: function() {
            return "Provides a dropdown selector of states and/or territories in the United States, keyed by their two-character code.";
        },
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "How to represent the state values in the selector",
                        "type": "string",
                        "default": "name",
                        "enum":["name", "code"],
                        "readonly": true
                    },
                    "capitalize": {
                        "title": "Capitalize",
                        "description": "Whether the values should be capitalized",
                        "type": "boolean",
                        "default": false,
                        "readonly": true
                    },
                    "includeStates": {
                        "title": "Include States",
                        "description": "Whether to include the states of the United States",
                        "type": "boolean",
                        "default": true,
                        "readonly": true
                    },
                    "includeTerritories": {
                        "title": "Include Territories",
                        "description": "Whether to include the territories of the United States",
                        "type": "boolean",
                        "default": true,
                        "readonly": true
                    }
                }
            });

        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    },
                    "capitalize": {
                        "type": "checkbox"
                    },
                    "includeStates": {
                        "type": "checkbox"
                    },
                    "includeTerritories": {
                        "type": "checkbox"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("state", Alpaca.Fields.StateField);
    Alpaca.registerDefaultFormatFieldMapping("state", "state");
    Alpaca.retrieveUSHoldings = (function()
    {
        return function(includeStates, includeTerritories, codeValue, capitalize) {
            var res  = {
                keys:   [],
                values: []
            };
            var opts = $.extend(
                {},
                includeStates      ? Alpaca.usHoldings.states      : {},
                includeTerritories ? Alpaca.usHoldings.territories : {}
            );
            var sorted = Object.keys(opts);
            sorted.sort();
            for (var i in sorted) {
                var state = sorted[i];
                var key   = opts[state];
                var value = codeValue ? key : state;
                if (capitalize) {
                    value = value.toUpperCase();
                }
                res.keys.push(key);
                res.values.push(value);
            }
            return res;
        };
    })();

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;
    Alpaca.Fields.TableField = Alpaca.Fields.ArrayField.extend(
    {
        setup: function()
        {
            var self = this;

            if (!self.options)
            {
                self.options = {};
            }

            if (typeof(self.options.animate) === "undefined")
            {
                self.options.animate = false;
            }
            if (typeof(this.options.toolbarSticky) === "undefined")
            {
                this.options.toolbarSticky = true;
            }

            this.base();

            if (!this.options.items.type)
            {
                this.options.items.type = "tablerow";
            }
            if (this.options.datatable) {
                this.options.datatables = this.options.datatable;
            }
            if (typeof(this.options.datatables) === "undefined")
            {
                this.options.datatables = {
                    "paging": false,
                    "lengthChange": false,
                    "info": false,
                    "searching": false,
                    "ordering": true
                };
                if (typeof(this.options.dragRows) == "undefined")
                {
                    this.options.dragRows = false;
                }

                if (this.options.readonly)
                {
                    this.options.dragRows = false;
                }

                if (this.isDisplayOnly())
                {
                    this.options.dragRows = false;
                }
            }
            if (typeof(this.options.showActionsColumn) === "undefined")
            {
                this.options.showActionsColumn = true;

                if (this.options.readonly)
                {
                    this.options.showActionsColumn = false;
                }

                if (this.isDisplayOnly())
                {
                    this.options.showActionsColumn = false;
                }
            }
            this.options.datatables.columns = [];
            if ($.fn.dataTableExt && !$.fn.DataTable.ext.type.search["alpaca"])
            {
                $.fn.DataTable.ext.order["alpaca"] = function (settings, col) {

                    return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
                        var alpacaId = $(td).children().attr("data-alpaca-field-id");
                        return Alpaca.fieldInstances[alpacaId].getValue();
                    } );

                };
                $.fn.dataTableExt.afnFiltering.push(function(settings, fields, fieldIndex, data, dataIndex) {

                    var text = $(settings.nTableWrapper).find(".dataTables_filter input[type='search']").val();

                    if (!text) {
                        return true;
                    }

                    text = "" + text;

                    text = $.trim(text);
                    text = text.toLowerCase();

                    var match = false;

                    for (var i = 0; i < data.length; i++)
                    {
                        var dataValue = data[i];
                        if (dataValue)
                        {
                            var z = dataValue.indexOf("data-alpaca-field-id=");
                            if (z > -1)
                            {
                                var alpacaId = $(dataValue).attr("data-alpaca-field-id");

                                var alpacaValue = Alpaca.fieldInstances[alpacaId].getValue();
                                if (alpacaValue)
                                {
                                    alpacaValue = "" + alpacaValue;
                                    alpacaValue = alpacaValue.toLowerCase();

                                    if (alpacaValue.indexOf(text) > -1)
                                    {
                                        match = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    return match;
                });
            }
        },
        getFieldType: function() {
            return "table";
        },

        prepareContainerModel: function(callback)
        {
            var self = this;

            self.base(function(model) {
                model.headers = [];
                if (self.schema.items && self.schema.items.properties)
                {
                    for (var k in self.schema.items.properties)
                    {
                        var header = {};
                        header.id = k;
                        header.title = self.schema.items.properties[k].title;
                        header.hidden = false;
                        if (self.options.items && self.options.items.fields && self.options.items.fields[k])
                        {
                            if (self.options.items.fields[k].label)
                            {
                                header.title = self.options.items.fields[k].label;
                            }

                            if (self.options.items.fields[k].type === "hidden")
                            {
                                header.hidden = true;
                            }
                        }

                        model.headers.push(header);
                    }
                }

                callback(model);
            });
        },
        afterRenderContainer: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                self.cleanupDomInjections();
                var table = $(this.container).find("table");
                self.applyStyle("table", table);
                if (self.options.datatables)
                {
                    if ($.fn.DataTable)
                    {
                        if (self.options.dragRows)
                        {
                            self.options.datatables.columns.push({
                                "orderable": false,
                                "name": "dragRowsIndex",
                                "hidden": true
                            });

                            self.options.datatables.columns.push({
                                "orderable": false,
                                "name": "dragRowsDraggable"
                            });
                        }
                        for (var k in self.schema.items.properties)
                        {
                            self.options.datatables.columns.push({
                                "orderable": true,
                                "orderDataType": "alpaca"
                            });
                        }
                        if (self.options.showActionsColumn)
                        {
                            self.options.datatables.columns.push({
                                "orderable": false,
                                "name": "actions"
                            });
                        }

                        if (self.options.dragRows)
                        {
                            self.options.datatables["rowReorder"] = {
                                "selector": "tr td.alpaca-table-reorder-draggable-cell",
                                "dataSrc": 0,
                                "snapX": true,
                                "update": true
                            };
                        }
                        self.off("ready");
                        self.on("ready", function() {
                            if (self._dt) {
                                self._dt.destroy();
                                self._dt = undefined;
                            }
                            var table = $(self.container).find("table");
                            self._dt = $(table).DataTable(self.options.datatables);
                            self._dt.on("row-reorder", function(e, diff, edit) {

                                if (self._dt._disableAlpacaHandlers) {
                                    return;
                                }
                                if (diff.length > 0)
                                {
                                    if (diff[0].oldPosition !== diff[0].newPosition)
                                    {
                                        self._dt._disableAlpacaHandlers = true;
                                        self.moveItem(diff[0].oldPosition, diff[0].newPosition, false, function() {
                                        });
                                    }
                                }
                            });
                            $(self.container).bind('destroyed', function() {
                                if (self._dt) {
                                    self._dt.destroy();
                                    self._dt = undefined;
                                }
                            });
                            self._dt.on('order', function ( e, ctx, sorting, columns ) {

                                if (self._dt._disableAlpacaHandlers) {
                                    return;
                                }
                                if (!self._dt._originalChildren) {
                                    self._dt._originalChildren = [];
                                    for (var k = 0; k < self.children.length; k++) {
                                        self._dt._originalChildren.push(self.children[k]);
                                    }
                                }
                                var newChildren = [];
                                for (var z = 0; z < ctx.aiDisplay.length; z++)
                                {
                                    var index = ctx.aiDisplay[z];
                                    newChildren.push(self._dt._originalChildren[index]);
                                }
                                self.children = newChildren;

                                self._dt._disableAlpacaHandlers = false;
                            });

                        });
                    }
                }
                $(table).find("thead > tr > th[data-header-id]").each(function() {

                    var key = $(this).attr("data-header-id");

                    var schema = self.schema.items.properties[key];
                    var options = null;
                    if (self.options.items.fields && self.options.items.fields[key]) {
                        options = self.options.items.fields[key];
                    }
                    if (schema.required || (options && options.required))
                    {
                        self.fireCallback("tableHeaderRequired", schema, options, this);
                    }
                    else
                    {
                        self.fireCallback("tableHeaderOptional", schema, options, this);
                    }

                });

                callback();

            }.bind(self));
        },

        cleanupDomInjections: function()
        {
            var mergeElementUp = function(mergeElement)
            {
                var mergeElementParent = $(mergeElement).parent();
                var mergeElementChildren = $(mergeElement).children();
                var classNames =$(mergeElement).attr('class').split(/\s+/);
                $.each( classNames, function(index, className){
                    if (className === "alpaca-merge-up") {
                    } else {
                        $(mergeElementParent).addClass(className);
                    }
                });
                $.each($(mergeElement)[0].attributes, function() {
                    if (this.name && this.name.indexOf("data-") === 0)
                    {
                        $(mergeElementParent).attr(this.name, this.value);
                    }
                });
                if (mergeElementChildren.length > 0)
                {
                    $(mergeElement).replaceWith(mergeElementChildren);
                }
                else
                {
                    $(mergeElement).remove();
                }
            };
            this.getFieldEl().find("tr > .alpaca-field").each(function() {
                mergeElementUp(this);
            });
            this.getFieldEl().find("tr > .alpaca-container").each(function() {
                mergeElementUp(this);
            });
            var alpacaArrayActionbar = this.getFieldEl().find("." + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR);
            if (alpacaArrayActionbar.length > 0)
            {
                alpacaArrayActionbar.each(function() {
                    var td = $("<td class='actionbar' nowrap='nowrap'></td>");
                    $(this).before(td);
                    $(td).append(this);
                });
            }
            var alpacaTableReorderDraggableCells = this.getFieldEl().find(".alpaca-table-reorder-draggable-cell");
            if (alpacaTableReorderDraggableCells.length > 0)
            {
                alpacaTableReorderDraggableCells.each(function() {
                    var td = $("<td class='alpaca-table-reorder-draggable-cell'></td>");
                    $(this).before(td);
                    $(td).append($(this).children());
                    $(this).remove();
                });
            }
            var alpacaTableReorderIndexCells = this.getFieldEl().find(".alpaca-table-reorder-index-cell");
            if (alpacaTableReorderIndexCells.length > 0)
            {
                alpacaTableReorderIndexCells.each(function(i) {
                    var td = $("<td class='alpaca-table-reorder-index-cell'>" + i + "</td>");
                    $(this).before(td);
                    $(this).remove();
                });
            }
            this.getFieldEl().find(".alpaca-merge-up").each(function() {
                mergeElementUp(this);
            });
        },

        doResolveItemContainer: function()
        {
            var self = this;

            return $(self.container).find("table tbody");
        },

        doAfterAddItem: function(item, callback)
        {
            var self = this;

            self.data = self.getValue();

            self.cleanupDomInjections();
            var usingDataTables = self.options.datatables && $.fn.DataTable;
            if (self.options.dragRows || (usingDataTables && self.data.length === 1))
            {
                self.refresh(function() {

                    callback();
                });
            }
            else
            {
                callback();
            }
        },

        doAfterRemoveItem: function(childIndex, callback)
        {
            var self = this;

            self.data = self.getValue();

            self.cleanupDomInjections();

            var usingDataTables = self.options.datatables && $.fn.DataTable;
            if (self.options.dragRows || (usingDataTables && self.data.length === 0))
            {
                self.refresh(function () {
                    callback();
                });

                callback();
            }
            else
            {
                callback();
            }
        },
        getType: function() {
            return "array";
        }
        ,
        getTitle: function() {
            return "Table Field";
        },
        getDescription: function() {
            return "Renders array items into a table";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "datatables": {
                        "title": "DataTables Configuration",
                        "description": "Optional configuration to be passed to the underlying DataTables Plugin.",
                        "type": "object"
                    },
                    "showActionsColumn": {
                        "title": "Show Actions Column",
                        "default": true,
                        "description": "Whether to show or hide the actions column.",
                        "type": "boolean"
                    },
                    "dragRows": {
                        "title": "Drag Rows",
                        "default": false,
                        "description": "Whether to enable the dragging of rows via a draggable column.  This requires DataTables and the DataTables Row Reorder Plugin.",
                        "type": "boolean"
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "datatables": {
                        "type": "object"
                    },
                    "showActionsColumn": {
                        "type": "checkbox"
                    },
                    "dragRows": {
                        "type": "checkbox"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("table", Alpaca.Fields.TableField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TableRowField = Alpaca.Fields.ObjectField.extend(
    {
        prepareContainerModel: function(callback)
        {
            var self = this;

            this.base(function(model) {

                model.options.showActionsColumn = self.parent.options.showActionsColumn;
                model.options.dragRows = self.parent.options.dragRows;
                for (var i = 0; i < model.items.length; i++)
                {
                    if (model.items[i].options.type === "hidden")
                    {
                        model.items[i].hidden = true;
                    }
                }

                callback(model);
            });
        },
        getFieldType: function() {
            return "tablerow";
        },
        getType: function() {
            return "object";
        }
        ,
        getTitle: function() {
            return "Table Row Field";
        },
        getDescription: function() {
            return "Renders object items into a table row";
        }
    });

    Alpaca.registerFieldClass("tablerow", Alpaca.Fields.TableRowField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TagField = Alpaca.Fields.LowerCaseField.extend(
    {
        getFieldType: function() {
            return "tag";
        },
        setup: function()
        {
            this.base();

            if (!this.options.separator)
            {
                this.options.separator = ",";
            }
        },
        getControlValue: function()
        {
            var val = this.base();

            if (val === "") {
                return [];
            }

            return val.split(this.options.separator);
        },
        setValue: function(val)
        {
            if (val === "")
            {
                return;
            }

            if (!val)
            {
                return this.base("");
            }

            this.base(val.join(this.options.separator));
        },
        onBlur: function(e)
        {
            this.base(e);

            var vals = this.getValue();

            var trimmed = [];

            $.each(vals, function(i, v) {

                if (v.trim() !== "")
                {
                    trimmed.push(v.trim());
                }
            });

            this.setValue(trimmed);
        }
        ,
        getTitle: function() {
            return "Tag Field";
        },
        getDescription: function() {
            return "Text field for entering list of tags separated by delimiter.";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tags.",
                        "type": "string",
                        "default":","
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("tag", Alpaca.Fields.TagField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TimeField = Alpaca.Fields.DateField.extend(
    {
        getFieldType: function() {
            return "time";
        },

        getDefaultFormat: function() {
            return "h:mm:ss a";
        },
        setup: function()
        {
            var self = this;

            this.base();
        }
        ,
        getTitle: function() {
            return "Time Field";
        },
        getDescription: function() {
            return "Time Field";
        }
    });

    Alpaca.registerMessages({
        "invalidTime": "Invalid time"
    });
    Alpaca.registerFieldClass("time", Alpaca.Fields.TimeField);
    Alpaca.registerDefaultFormatFieldMapping("time", "time");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TinyMCEField = Alpaca.Fields.TextAreaField.extend(
        {
            getFieldType: function() {
                return "tinymce";
            },
            setup: function()
            {
                var self = this;

                if (!this.data)
                {
                    this.data = "";
                }

                if (!self.options.toolbar)
                {
                    self.options.toolbar = "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image";
                }

                this.base();
            },

            setValue: function(value)
            {
                var self = this;
                this.base(value);

                if (self.editor)
                {
                    self.editor.setContent(value);
                }
            },
            getControlValue:function()
            {
                var self = this;

                var value = null;

                if (self.editor)
                {
                    value = self.editor.getContent()
                }

                return value;
            },

            initTinyMCEEvents: function()
            {
                var self = this;

                if (self.editor) {
                    self.editor.on("click", function (e) {
                        self.onClick.call(self, e);
                        self.trigger("click", e);
                    });
                    self.editor.on("change", function (e) {
                        self.onChange();
                        self.triggerWithPropagation("change", e);
                    });
                    self.editor.on('blur', function (e) {
                        self.onBlur();
                        self.trigger("blur", e);
                    });
                    self.editor.on("focus", function (e) {
                        self.onFocus.call(self, e);
                        self.trigger("focus", e);
                    });
                    self.editor.on("keypress", function (e) {
                        self.onKeyPress.call(self, e);
                        self.trigger("keypress", e);
                    });
                    self.editor.on("keyup", function (e) {
                        self.onKeyUp.call(self, e);
                        self.trigger("keyup", e);
                    });
                    self.editor.on("keydown", function (e) {
                        self.onKeyDown.call(self, e);
                        self.trigger("keydown", e);
                    });
                }
            },

            afterRenderControl: function(model, callback)
            {
                var self = this;

                this.base(model, function() {

                    if (!self.isDisplayOnly() && self.control && typeof(tinyMCE) !== "undefined")
                    {
                        self.on("ready", function() {

                            if (!self.editor)
                            {
                                var rteFieldID = $(self.control)[0].id;

                                tinyMCE.init({
                                    init_instance_callback: function(editor) {
                                        self.editor = editor;

                                        self.initTinyMCEEvents();
                                    },
                                    selector: "#" + rteFieldID,
                                    toolbar: self.options.toolbar
                                });

                            }
                        });
                    }

                    callback();
                });
            },
            destroy: function()
            {
                var self = this;
                if (self.editor)
                {
                    self.editor.remove();
                    self.editor = null;
                }
                this.base();
            },
            getTitle: function() {
                return "TinyMCE Editor";
            },
            getDescription: function() {
                return "Provides an instance of a TinyMCE control for use in editing HTML.";
            },
            getSchemaOfOptions: function() {
                return Alpaca.merge(this.base(), {
                    "properties": {
                        "toolbar": {
                            "title": "TinyMCE toolbar options",
                            "description": "Toolbar options for TinyMCE plugin.",
                            "type": "string"
                        }
                    }
                });
            },
            getOptionsForOptions: function() {
                return Alpaca.merge(this.base(), {
                    "fields": {
                        "toolbar": {
                            "type": "text"
                        }
                    }
                });
            }
        });

    Alpaca.registerFieldClass("tinymce", Alpaca.Fields.TinyMCEField);

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.TokenField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "token";
        },
        setup: function()
        {
            this.base();

            if (!this.options.separator)
            {
                this.options.separator = ",";
            }

            if (typeof(this.options.tokenfield) == "undefined")
            {
                this.options.tokenfield = {};
            }

            if (typeof(this.options.tokenfield.showAutocompleteOnFocus) === "undefined")
            {
                this.options.tokenfield.showAutocompleteOnFocus = true;
            }
        },
        getControlValue: function()
        {
            return this.base();
        },
        setValue: function(val)
        {
            this.base(val);
        },
        onBlur: function(e)
        {
            this.base(e);
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {
                if (!self.isDisplayOnly() && self.control && typeof($.fn.tokenfield) !== "undefined")
                {
                    self.on("ready", function() {
                        $(self.control).tokenfield(self.options.tokenfield);
                    });
                }

                callback();
            });
        }
        ,
        getTitle: function() {
            return "Token Field";
        },
        getDescription: function() {
            return "Token field for entering list of tokens separated by delimiter.";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "separator": {
                        "title": "Separator",
                        "description": "Separator used to split tokens.",
                        "type": "string",
                        "default":","
                    },
                    "tokenfield": {
                        "title": "Token Field options",
                        "description": "Settings to pass into the underlying bootstrap-tokenfield control",
                        "type": "object",
                        "default": undefined
                    }
                }
            });
        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "separator": {
                        "type": "text"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("token", Alpaca.Fields.TokenField);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.UploadField = Alpaca.Fields.TextField.extend(
    {
        constructor: function(container, data, options, schema, view, connector)
        {
            var self = this;

            this.base(container, data, options, schema, view, connector);

            this.wrapTemplate = function(templateId)
            {
                return function(config) {

                    var files = config.files;
                    var formatFileSize = config.formatFileSize;
                    var options = config.options;

                    var rows = [];
                    for (var i = 0; i < files.length; i++)
                    {
                        var model = {};
                        model.options = self.options;
                        model.file = Alpaca.cloneObject(files[i]);
                        model.size = formatFileSize(model.size);
                        model.buttons = self.options.buttons;
                        model.view = self.view;
                        model.fileIndex = i;

                        var row = Alpaca.tmpl(self.view.getTemplateDescriptor(templateId), model, self);

                        rows.push(row[0]);
                    }

                    rows = $(rows);
                    $(rows).each(function() {

                        if (options.fileupload && options.fileupload.autoUpload)
                        {
                            $(this).find("button.start").css("display", "none");
                        }

                        self.handleWrapRow(this, options);

                        var row = $(this);
                        $(this).find("button.delete").on("click", function() {

                            var button = $(row).find("button.delete");

                            var fileIndex = $(button).attr("data-file-index");
                            var file = files[fileIndex];

                            self.onFileDelete.call(self, row, button, file);

                            self.triggerWithPropagation("change");
                            setTimeout(function() {
                                self.refreshUIState();
                            }, 200);
                        });

                    });

                    return $(rows);
                };
            };
        },
        getFieldType: function() {
            return "upload";
        },
        setup: function()
        {
            var self = this;

            this.base();
            self.options.renderButtons = false;

            if (!self.options.buttons)
            {
                self.options.buttons = [];
            }

            if (!self.options.hideDeleteButton)
            {
                self.options.buttons.push({
                    "key": "delete",
                    "isDelete": true
                });
            }

            if (typeof(self.options.multiple) === "undefined")
            {
                self.options.multiple = false;
            }

            if (typeof(self.options.showUploadPreview) === "undefined")
            {
                self.options.showUploadPreview = true;
            }

            if (typeof(self.options.showHeaders) === "undefined")
            {
                self.options.showHeaders = true;
            }

            if (!self.data)
            {
                self.data = [];
            }
            if (!self.options.upload)
            {
                self.options.upload = {};
            }
            if (typeof(self.options.maxNumberOfFiles) === "undefined")
            {
                if (self.options.upload.maxNumberOfFiles)
                {
                    self.options.maxNumberOfFiles = self.options.upload.maxNumberOfFiles;
                    if (self.options.maxNumberOfFiles === 1)
                    {
                        self.options.multiple = false;
                    }
                    else if (self.options.maxNumberOfFiles > 1)
                    {
                        self.options.multiple = true;
                    }
                }
                else
                {
                    self.options.maxNumberOfFiles = 1;
                    if (typeof(self.options.multiple) === "boolean" && self.options.multiple)
                    {
                        self.options.maxNumberOfFiles = -1;
                    }
                }
                if (self.options.maxNumberOfFiles)
                {
                    self.options.upload.maxNumberOfFiles = self.options.maxNumberOfFiles;
                }

            }
            if (typeof(self.options.maxFileSize) === "undefined")
            {
                if (self.options.upload.maxFileSize)
                {
                    self.options.maxFileSize = self.options.upload.maxFileSize;
                }
                else
                {
                    self.options.maxFileSize = -1; // no limit
                }
                if (self.options.maxFileSize)
                {
                    self.options.upload.maxFileSize = self.options.maxFileSize;
                }
            }
            if (typeof(self.options.fileTypes) === "undefined")
            {
                if (self.options.upload.acceptFileTypes)
                {
                    self.options.fileTypes = self.options.upload.acceptFileTypes;
                }
                else
                {
                    self.options.fileTypes = null; // no restrictions
                }
                if (self.options.fileTypes)
                {
                    self.options.upload.acceptFileTypes = self.options.fileTypes;
                }
            }
            if (!self.options.errorHandler)
            {
                self.options.errorHandler = function(messages)
                {
                    alert(messages.join("\n"));
                };
            }
            var csrfToken = self.determineCsrfToken();
            if (csrfToken)
            {
                if (!self.options.upload) {
                    self.options.upload = {};
                }

                if (!self.options.upload.headers) {
                    self.options.upload.headers = {};
                }

                self.options.upload.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }

        },

        determineCsrfToken: function()
        {
            var csrfToken = Alpaca.CSRF_TOKEN;
            if (!csrfToken)
            {
                for (var t = 0; t < Alpaca.CSRF_COOKIE_NAMES.length; t++)
                {
                    var cookieName = Alpaca.CSRF_COOKIE_NAMES[t];

                    var cookieValue = Alpaca.readCookie(cookieName);
                    if (cookieValue)
                    {
                        csrfToken = cookieValue;
                        break;
                    }
                }
            }

            return csrfToken;
        },

        prepareControlModel: function(callback)
        {
            var self = this;

            self.base(function(model) {

                model.chooseButtonLabel = self.options.chooseButtonLabel;
                if (!model.chooseButtonLabel)
                {
                    model.chooseButtonLabel = self.getMessage("chooseFiles");
                    if (self.options.maxNumberOfFiles === 1)
                    {
                        model.chooseButtonLabel = self.getMessage("chooseFile");
                    }
                }

                model.dropZoneMessage = self.options.dropZoneMessage;
                if (!model.dropZoneMessage)
                {
                    model.dropZoneMessage = self.getMessage("dropZoneSingle");
                    if (model.maxNumberOfFiles === 1)
                    {
                        model.dropZoneMessage = self.getMessage("dropZoneMultiple");
                    }
                }

                callback(model);
            });
        },

        afterRenderControl: function(model, callback)
        {
            var self = this;

            this.base(model, function() {

                self.handlePostRender(function() {
                    if (self.isDisplayOnly())
                    {
                        $(self.control).find("button").hide();
                        $(self.control).find(".btn").hide();
                        $(self.control).find(".alpaca-fileupload-chooserow").hide();
                        $(self.control).find(".dropzone-message").hide();
                    }

                    callback();
                });

            });
        },
        getUploadTemplate: function() {
            return this.wrapTemplate("control-upload-partial-upload");
        },
        getDownloadTemplate: function() {
            return this.wrapTemplate("control-upload-partial-download");
        },

        handlePostRender: function(callback)
        {
            var self = this;

            var el = this.control;
            var fileUploadConfig = {};
            fileUploadConfig["dataType"] = "json";
            fileUploadConfig["uploadTemplateId"] = null;
            fileUploadConfig["uploadTemplate"] = this.getUploadTemplate();
            fileUploadConfig["downloadTemplateId"] = null;
            fileUploadConfig["downloadTemplate"] = this.getDownloadTemplate();
            fileUploadConfig["filesContainer"] = $(el).find(".files");
            fileUploadConfig["dropZone"] = $(el).find(".fileupload-active-zone");
            fileUploadConfig["url"] = "/";
            fileUploadConfig["method"] = "post";
            fileUploadConfig["showUploadPreview"] = self.options.showUploadPreview;

            if (self.options.upload)
            {
                for (var k in self.options.upload)
                {
                    fileUploadConfig[k] = self.options.upload[k];
                }
            }

            if (self.options.multiple)
            {
                $(el).find(".alpaca-fileupload-input").attr("multiple", true);
                $(el).find(".alpaca-fileupload-input").attr("name", self.name + "_files[]");
            }
            $(el).find(".progress").css("display", "none");
            fileUploadConfig["progressall"] = function (e, data) {

                var showProgressBar = false;
                if (data.loaded < data.total)
                {
                    showProgressBar = true;
                }
                if (showProgressBar)
                {
                    $(el).find(".progress").css("display", "block");
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#progress .progress-bar').css(
                        'width',
                        progress + '%'
                    );
                }
                else
                {
                    $(el).find(".progress").css("display", "none");
                }
            };
            fileUploadConfig["add"] = function(e, data) {

                var uploadErrors = [];

                var i = 0;
                do
                {
                    var bad = false;

                    if (i < data.originalFiles.length)
                    {
                        if (self.options.fileTypes)
                        {
                            var re = self.options.fileTypes;
                            if (typeof(self.options.fileTypes) === "string")
                            {
                                re = new RegExp(self.options.fileTypes);
                            }

                            if (!re.test(data.originalFiles[i]["type"]))
                            {
                                uploadErrors.push('Not an accepted file type: ' + data.originalFiles[i]["type"]);
                                bad = true;
                            }
                        }
                        if (self.options.maxFileSize > -1)
                        {
                            if (data.originalFiles[i].size > self.options.maxFileSize) {
                                uploadErrors.push('Filesize is too big: ' + data.originalFiles[i].size);
                                bad = true;
                            }
                        }
                    }

                    if (bad)
                    {
                        i++;
                    }
                    else
                    {
                        i++;
                    }
                }
                while (i < data.originalFiles.length);

                if (uploadErrors.length > 0)
                {
                    self.options.errorHandler(uploadErrors);
                }
                else
                {
                    data.submit();
                }
            };
            self.applyConfiguration(fileUploadConfig);
            var fileUpload = self.fileUpload = $(el).find('.alpaca-fileupload-input').fileupload(fileUploadConfig);
            fileUpload.bindFirst("fileuploaddone", function(e, data) {

                var enhanceFiles = self.options.enhanceFiles;
                if (enhanceFiles)
                {
                    enhanceFiles(fileUploadConfig, data);
                }
                else
                {
                    self.enhanceFiles(fileUploadConfig, data);
                }
                data.files = data.result.files;

                setTimeout(function() {
                    self.refreshUIState();
                }, 250);

            });
            fileUpload.bindFirst("fileuploadsubmit", function(e, data) {

                if (self.options["properties"])
                {
                    $.each(data.files, function(index, file) {

                        for (var key in self.options["properties"])
                        {
                            var propertyName = "property" + index + "__" + key;
                            var propertyValue = self.options["properties"][key];
                            propertyValue = self.applyTokenSubstitutions(propertyValue, index, file);

                            if (!data.formData) {
                                data.formData = {};
                            }

                            data.formData[propertyName] = propertyValue;
                        }
                    });
                }

                if (self.options["parameters"])
                {
                    $.each(data.files, function(index, file) {

                        for (var key in self.options["parameters"])
                        {
                            var paramName = "param" + index + "__" + key;
                            var paramValue = self.options["parameters"][key];
                            paramValue = self.applyTokenSubstitutions(paramValue, index, file);

                            if (!data.formData) {
                                data.formData = {};
                            }

                            data.formData[paramName] = paramValue;
                        }
                    });
                }
            });
            fileUpload.bind("fileuploaddone", function(e, data) {
                var array = self.getValue();

                var f = function(i)
                {
                    if (i === data.files.length) // jshint ignore:line
                    {
                        self.setValue(array);
                        return;
                    }

                    self.convertFileToDescriptor(data.files[i], function (err, descriptor) {

                        if (descriptor)
                        {
                            array.push(descriptor);
                        }

                        f(i + 1);
                    });

                };
                f(0);
            });
            fileUpload.bind("fileuploadfail", function(e, data) {

                if (data.errorThrown)
                {
                    self.onUploadFail(data);
                }
            });
            fileUpload.bind("fileuploadalways", function(e, data) {
                self.refreshUIState();
            });
            self.applyBindings(fileUpload, el);
            self.preload(fileUpload, el, function(files) {

                if (files)
                {
                    var form = $(self.control).find('.alpaca-fileupload-input');
                    $(form).fileupload('option', 'done').call(form, $.Event('done'), {
                        result: {
                            files: files
                        }
                    });

                    self.afterPreload(fileUpload, el, files, function() {
                        callback();
                    });
                }
                else
                {
                    callback();
                }
            });

            if (typeof(document) != "undefined")
            {
                $(document).bind('drop dragover', function (e) {
                    e.preventDefault();
                });
            }
        },

        handleWrapRow: function(row, options)
        {

        },

        applyTokenSubstitutions: function(text, index, file)
        {
            var tokens = {
                "index": index,
                "name": file.name,
                "size": file.size,
                "url": file.url,
                "thumbnailUrl": file.thumbnailUrl
            };
            var x = -1;
            var b = 0;
            do
            {
                x = text.indexOf("{", b);
                if (x > -1)
                {
                    var y = text.indexOf("}", x);
                    if (y > -1)
                    {
                        var token = text.substring(x + car.length, y);

                        var replacement = tokens[token];
                        if (replacement)
                        {
                            text = text.substring(0, x) + replacement + text.substring(y+1);
                        }

                        b = y + 1;
                    }
                }
            }
            while(x > -1);

            return text;
        },
        removeValue: function(id)
        {
            var self = this;

            var array = self.getValue();
            for (var i = 0; i < array.length; i++)
            {
                if (array[i].id == id) // jshint ignore:line
                {
                    array.splice(i, 1);
                    break;
                }
            }

            self.setValue(array);
        },
        applyConfiguration: function(fileUploadconfig)
        {
        },
        applyBindings: function(fileUpload)
        {
        },
        convertFileToDescriptor: function(file, callback)
        {
            var descriptor = {
                "id": file.id,
                "name": file.name,
                "size": file.size,
                "url": file.url,
                "thumbnailUrl":file.thumbnailUrl,
                "deleteUrl": file.deleteUrl,
                "deleteType": file.deleteType
            };

            callback(null, descriptor);
        },
        convertDescriptorToFile: function(descriptor, callback)
        {
            var file = {
                "id": descriptor.id,
                "name": descriptor.name,
                "size": descriptor.size,
                "url": descriptor.url,
                "thumbnailUrl":descriptor.thumbnailUrl,
                "deleteUrl": descriptor.deleteUrl,
                "deleteType": descriptor.deleteType
            };

            callback(null, file);
        },
        enhanceFiles: function(fileUploadConfig, data)
        {
        },
        preload: function(fileUpload, el, callback)
        {
            var self = this;

            var files = [];
            var descriptors = self.getValue();

            var f = function(i)
            {
                if (i == descriptors.length) // jshint ignore:line
                {
                    callback(files);
                    return;
                }

                self.convertDescriptorToFile(descriptors[i], function(err, file) {
                    if (file)
                    {
                        files.push(file);
                    }
                    f(i+1);
                });
            };
            f(0);
        },

        afterPreload: function(fileUpload, el, files, callback)
        {
            var self = this;

            self.refreshUIState();

            callback();
        },
        getControlValue: function()
        {
            return this.data;
        },
        setValue: function(val)
        {
            if (!val)
            {
                val = [];
            }

            this.data = val;

            this.updateObservable();

            this.triggerUpdate();
        },

        reload: function(callback)
        {
            var self = this;

            var descriptors = this.getValue();

            var files = [];

            var f = function(i)
            {
                if (i === descriptors.length) // jshint ignore:line
                {

                    var form = $(self.control).find('.alpaca-fileupload-input');
                    $(form).fileupload('option', 'done').call(form, $.Event('done'), {
                        result: {
                            files: files
                        }
                    });
                    self.refreshValidationState();

                    callback();

                    return;
                }

                self.convertDescriptorToFile(descriptors[i], function(err, file) {
                    if (file)
                    {
                        files.push(file);
                    }
                    f(i+1);
                });
            };
            f(0);
        },

        plugin: function()
        {
            var self = this;

            return $(self.control).find('.alpaca-fileupload-input').data().blueimpFileupload;
        },

        refreshUIState: function()
        {
            var self = this;

            var fileUpload = self.plugin();
            if (fileUpload)
            {
                var maxNumberOfFiles = self.options.maxNumberOfFiles;

                if (fileUpload.options.getNumberOfFiles && fileUpload.options.getNumberOfFiles() >= maxNumberOfFiles)
                {
                    self.refreshButtons(false);
                }
                else
                {
                    self.refreshButtons(true);
                }
            }
        },

        refreshButtons: function(enabled)
        {
            var self = this;
            $(self.control).find(".btn.fileinput-button").prop("disabled", true);
            $(self.control).find(".btn.fileinput-button").attr("disabled", "disabled");
            $(self.control).find(".fileupload-active-zone p.dropzone-message").css("display", "none");

            if (enabled)
            {
                $(self.control).find(".btn.fileinput-button").prop("disabled", false);
                $(self.control).find(".btn.fileinput-button").attr("disabled", null);
                $(self.control).find(".fileupload-active-zone p.dropzone-message").css("display", "block");
            }
        },

        onFileDelete: function(rowEl, buttonEl, file)
        {
            var self = this;

            var deleteUrl = file.deleteUrl;
            var deleteMethod = file.deleteType;

            var c = {
                "method": deleteMethod,
                "url": deleteUrl,
                "headers": {}
            };

            var csrfToken = self.determineCsrfToken();
            if (csrfToken)
            {
                c.headers[Alpaca.CSRF_HEADER_NAME] = csrfToken;
            }

            $.ajax(c);
        },

        onUploadFail: function(data)
        {
            var self = this;

            for (var i = 0; i < data.files.length; i++)
            {
                data.files[i].error = data.errorThrown;
            }

            if (self.options.uploadFailHandler)
            {
                self.options.uploadFailHandler.call(self, data);
            }
        },
        disable: function()
        {
            $(this.field).find(".fileinput-button").prop("disabled", true);
            $(this.field).find(".fileinput-button").attr("disabled", "disabled");
            $(this.field).find(".alpaca-fileupload-well").css("visibility", "hidden");
        },
        enable: function()
        {
            $(this.field).find(".fileinput-button").prop("disabled", false);
            $(this.field).find(".fileinput-button").removeAttr("disabled");
            $(this.field).find(".alpaca-fileupload-well").css("visibility", "visible");
        },
        getTitle: function() {
            return "Upload Field";
        },
        getDescription: function() {
            return "Provides an upload field with support for thumbnail preview";
        },
        getType: function() {
            return "array";
        },
        getSchemaOfOptions: function() {
            return Alpaca.merge(this.base(), {
                "properties": {
                    "maxNumberOfFiles": {
                        "title": "Maximum Number of Files",
                        "description": "The maximum number of files to allow to be uploaded.  If greater than zero, the maximum number will be constrained.  If -1, then no limit is imposed.",
                        "type": "number",
                        "default": 1
                    },
                    "maxFileSize": {
                        "title": "Maximum File Size (in bytes)",
                        "description": "The maximum file size allowed per upload.  If greater than zero, the maximum file size will be limited to the given size in bytes.  If -1, then no limit is imposed.",
                        "type": "number",
                        "default": -1
                    },
                    "fileTypes": {
                        "title": "File Types",
                        "description": "A regular expression limiting the file types that can be uploaded based on filename",
                        "type": "string"
                    },
                    "multiple": {
                        "title": "Multiple",
                        "description": "Whether to allow multiple file uploads.  If maxNumberOfFiles is not specified, multiple will toggle between 1 and unlimited.",
                        "type": "boolean",
                        "default": false
                    },
                    "showUploadPreview": {
                        "title": "Show Upload Preview",
                        "description": "Whether to show thumbnails for uploaded assets (requires preview support)",
                        "type": "boolean",
                        "default": true
                    },
                    "errorHandler": {
                        "title": "Error Handler",
                        "description": "Optional function handler to be called when there is an error uploading one or more files.  This handler is typically used to instantiate a modal or other UI element to inform the end user.",
                        "type": "function"
                    },
                    "uploadFailHandler": {
                        "title": "Upload Fail Handler",
                        "description": "Optional function handler to be called when one or more files fails to upload.  This function is responsible for parsing the underlying xHR request and populating the error message state.",
                        "type": "function"
                    }
                }
            });
        }
    });

    Alpaca.registerFieldClass("upload", Alpaca.Fields.UploadField);

    Alpaca.registerMessages({
        "chooseFile": "Choose file...",
        "chooseFiles": "Choose files...",
        "dropZoneSingle": "Click the Choose button or Drag and Drop a file here to upload...",
        "dropZoneMultiple": "Click the Choose button or Drag and Drop files here to upload..."
    });
    (function($) {
        var splitVersion = $.fn.jquery.split(".");
        var major = parseInt(splitVersion[0]);
        var minor = parseInt(splitVersion[1]);

        var JQ_LT_17 = (major < 1) || (major === 1 && minor < 7);

        function eventsData($el)
        {
            return JQ_LT_17 ? $el.data('events') : $._data($el[0]).events;
        }

        function moveHandlerToTop($el, eventName, isDelegated)
        {
            var data = eventsData($el);
            var events = data[eventName];

            if (!JQ_LT_17) {
                var handler = isDelegated ? events.splice(events.delegateCount - 1, 1)[0] : events.pop();
                events.splice(isDelegated ? 0 : (events.delegateCount || 0), 0, handler);

                return;
            }

            if (isDelegated) {
                data.live.unshift(data.live.pop());
            } else {
                events.unshift(events.pop());
            }
        }

        function moveEventHandlers($elems, eventsString, isDelegate) {
            var events = eventsString.split(/\s+/);
            $elems.each(function() {
                for (var i = 0; i < events.length; ++i) {
                    var pureEventName = $.trim(events[i]).match(/[^\.]+/i)[0];
                    moveHandlerToTop($(this), pureEventName, isDelegate);
                }
            });
        }

        $.fn.bindFirst = function()
        {
            var args = $.makeArray(arguments);
            var eventsString = args.shift();

            if (eventsString) {
                $.fn.bind.apply(this, arguments);
                moveEventHandlers(this, eventsString);
            }

            return this;
        };

    })($);

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.UpperCaseField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "uppercase";
        },
        setup: function()
        {
            var self = this;

            this.base();

            if (this.data) {
                this.data = this.data.toUpperCase();
            }
        },
        setValue: function(val)
        {
            if (!val) {
                return this.base(val);
            }

            var upperValue = null;
            if (val && Alpaca.isString(val)) {
                upperValue = val.toUpperCase();
            }

            if (upperValue != this.getValue()) // jshint ignore:line
            {
                this.base(upperValue);
            }
        },
        onKeyPress: function(e)
        {
            this.base(e);

            var _this = this;

            Alpaca.later(25, this, function() {
                var v = _this.getValue();
                _this.setValue(v);
            });
        }
        ,
        getTitle: function() {
            return "Uppercase Text";
        },
        getDescription: function() {
            return "Text field for uppercase text.";
        }
    });

    Alpaca.registerFieldClass("uppercase", Alpaca.Fields.UpperCaseField);
    Alpaca.registerDefaultFormatFieldMapping("uppercase", "uppercase");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.URLField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "url";
        },
        setup: function()
        {
            this.inputType = "url";

            this.base();

            if (typeof(this.options.allowIntranet) === "undefined")
            {
                this.options.allowIntranet = false;
            }

            if (this.options.allowIntranet)
            {
                this.schema.pattern = Alpaca.regexps["intranet-url"];
            }
            else
            {
                this.schema.pattern = Alpaca.regexps.url;
            }
            this.schema.format = "uri";
        },
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {

                valInfo["invalidPattern"]["message"] = this.getMessage("invalidURLFormat");
            }

            return baseStatus;
        }
        ,
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "allowIntranet": {
                        "title": "Allow intranet",
                        "description": "Allows URLs with unqualified hostnames"
                    }
                }
            });

        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "allowIntranet": {
                        "type": "checkbox"
                    }
                }
            });
        },
        getTitle: function() {
            return "URL Field";
        },
        getDescription: function() {
            return "Provides a text control with validation for an internet web address.";
        }
    });

    Alpaca.registerMessages({
        "invalidURLFormat": "The URL provided is not a valid web address."
    });
    Alpaca.registerFieldClass("url", Alpaca.Fields.URLField);
    Alpaca.registerDefaultFormatFieldMapping("url", "url");

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ZipcodeField = Alpaca.Fields.TextField.extend(
    {
        getFieldType: function() {
            return "zipcode";
        },
        setup: function()
        {
            this.base();

            this.options.format = (this.options.format ? this.options.format : "nine");

            if (this.options.format === "nine")
            {
                this.schema.pattern = Alpaca.regexps["zipcode-nine"];
            }
            else if (this.options.format === "five")
            {
                this.schema.pattern = Alpaca.regexps["zipcode-five"];
            }
            else
            {
                Alpaca.logError("The configured zipcode format: " + this.options.format + " is not a legal value [five, nine]");
                this.options.format = "nine";
                this.schema.pattern = Alpaca.regexps["zipcode-nine"];
            }
            if (this.options.format === "nine")
            {
                this.options["maskString"] = "99999-9999";
            }
            else if (this.options.format === "five")
            {
                this.options["maskString"] = "99999";
            }
        },
        handleValidate: function()
        {
            var baseStatus = this.base();

            var valInfo = this.validation;

            if (!valInfo["invalidPattern"]["status"]) {

                if (this.options.format === "nine")
                {
                    valInfo["invalidPattern"]["message"] = this.getMessage("invalidZipcodeFormatNine");
                }
                else if (this.options.format === "five")
                {
                    valInfo["invalidPattern"]["message"] = this.getMessage("invalidZipcodeFormatFive");
                }
            }

            return baseStatus;
        }
        ,
        getSchemaOfOptions: function() {

            return Alpaca.merge(this.base(), {
                "properties": {
                    "format": {
                        "title": "Format",
                        "description": "How to represent the zipcode field",
                        "type": "string",
                        "default": "five",
                        "enum":["five", "nine"],
                        "readonly": true
                    }
                }
            });

        },
        getOptionsForOptions: function() {
            return Alpaca.merge(this.base(), {
                "fields": {
                    "format": {
                        "type": "text"
                    }
                }
            });
        },
        getTitle: function() {
            return "Zipcode Field";
        },
        getDescription: function() {
            return "Provides a five or nine-digital US zipcode control with validation.";
        }
    });

    Alpaca.registerMessages({
        "invalidZipcodeFormatFive": "Invalid Five-Digit Zipcode (#####)",
        "invalidZipcodeFormatNine": "Invalid Nine-Digit Zipcode (#####-####)"
    });
    Alpaca.registerFieldClass("zipcode", Alpaca.Fields.ZipcodeField);
    Alpaca.registerDefaultFormatFieldMapping("zipcode", "zipcode");

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView({
        "id": "base",
        "title": "Abstract base view",
        "messages": {
            "countries": {
                "afg":"Afghanistan",
                "ala":"Aland Islands",
                "alb":"Albania",
                "dza":"Algeria",
                "asm":"American Samoa",
                "and":"Andorra",
                "ago":"Angola",
                "aia":"Anguilla",
                "ata":"Antarctica",
                "atg":"Antigua and Barbuda",
                "arg":"Argentina",
                "arm":"Armenia",
                "abw":"Aruba",
                "aus":"Australia",
                "aut":"Austria",
                "aze":"Azerbaijan",
                "bhs":"Bahamas",
                "bhr":"Bahrain",
                "bgd":"Bangladesh",
                "brb":"Barbados",
                "blr":"Belarus",
                "bel":"Belgium",
                "blz":"Belize",
                "ben":"Benin",
                "bmu":"Bermuda",
                "btn":"Bhutan",
                "bol":"Bolivia",
                "bih":"Bosnia and Herzegovina",
                "bwa":"Botswana",
                "bvt":"Bouvet Island",
                "bra":"Brazil",
                "iot":"British Indian Ocean Territory",
                "brn":"Brunei Darussalam",
                "bgr":"Bulgaria",
                "bfa":"Burkina Faso",
                "bdi":"Burundi",
                "khm":"Cambodia",
                "cmr":"Cameroon",
                "can":"Canada",
                "cpv":"Cape Verde",
                "cym":"Cayman Islands",
                "caf":"Central African Republic",
                "tcd":"Chad",
                "chl":"Chile",
                "chn":"China",
                "cxr":"Christmas Island",
                "cck":"Cocos (Keeling), Islands",
                "col":"Colombia",
                "com":"Comoros",
                "cog":"Congo",
                "cod":"Congo, the Democratic Republic of the",
                "cok":"Cook Islands",
                "cri":"Costa Rica",
                "hrv":"Croatia",
                "cub":"Cuba",
                "cyp":"Cyprus",
                "cze":"Czech Republic",
                "civ":"Cote d'Ivoire",
                "dnk":"Denmark",
                "dji":"Djibouti",
                "dma":"Dominica",
                "dom":"Dominican Republic",
                "ecu":"Ecuador",
                "egy":"Egypt",
                "slv":"El Salvador",
                "gnq":"Equatorial Guinea",
                "eri":"Eritrea",
                "est":"Estonia",
                "eth":"Ethiopia",
                "flk":"Falkland Islands (Malvinas),",
                "fro":"Faroe Islands",
                "fji":"Fiji",
                "fin":"Finland",
                "fra":"France",
                "guf":"French Guiana",
                "pyf":"French Polynesia",
                "atf":"French Southern Territories",
                "gab":"Gabon",
                "gmb":"Gambia",
                "geo":"Georgia",
                "deu":"Germany",
                "gha":"Ghana",
                "gib":"Gibraltar",
                "grc":"Greece",
                "grl":"Greenland",
                "grd":"Grenada",
                "glp":"Guadeloupe",
                "gum":"Guam",
                "gtm":"Guatemala",
                "ggy":"Guernsey",
                "gin":"Guinea",
                "gnb":"Guinea-Bissau",
                "guy":"Guyana",
                "hti":"Haiti",
                "hmd":"Heard Island and McDonald Islands",
                "vat":"Holy See (Vatican City State),",
                "hnd":"Honduras",
                "hkg":"Hong Kong",
                "hun":"Hungary",
                "isl":"Iceland",
                "ind":"India",
                "idn":"Indonesia",
                "irn":"Iran, Islamic Republic of",
                "irq":"Iraq",
                "irl":"Ireland",
                "imn":"Isle of Man",
                "isr":"Israel",
                "ita":"Italy",
                "jam":"Jamaica",
                "jpn":"Japan",
                "jey":"Jersey",
                "jor":"Jordan",
                "kaz":"Kazakhstan",
                "ken":"Kenya",
                "kir":"Kiribati",
                "prk":"Korea, Democratic People's Republic of",
                "kor":"Korea, Republic of",
                "kwt":"Kuwait",
                "kgz":"Kyrgyzstan",
                "lao":"Lao People's Democratic Republic",
                "lva":"Latvia",
                "lbn":"Lebanon",
                "lso":"Lesotho",
                "lbr":"Liberia",
                "lby":"Libyan Arab Jamahiriya",
                "lie":"Liechtenstein",
                "ltu":"Lithuania",
                "lux":"Luxembourg",
                "mac":"Macao",
                "mkd":"Macedonia, the former Yugoslav Republic of",
                "mdg":"Madagascar",
                "mwi":"Malawi",
                "mys":"Malaysia",
                "mdv":"Maldives",
                "mli":"Mali",
                "mlt":"Malta",
                "mhl":"Marshall Islands",
                "mtq":"Martinique",
                "mrt":"Mauritania",
                "mus":"Mauritius",
                "myt":"Mayotte",
                "mex":"Mexico",
                "fsm":"Micronesia, Federated States of",
                "mda":"Moldova, Republic of",
                "mco":"Monaco",
                "mng":"Mongolia",
                "mne":"Montenegro",
                "msr":"Montserrat",
                "mar":"Morocco",
                "moz":"Mozambique",
                "mmr":"Myanmar",
                "nam":"Namibia",
                "nru":"Nauru",
                "npl":"Nepal",
                "nld":"Netherlands",
                "ant":"Netherlands Antilles",
                "ncl":"New Caledonia",
                "nzl":"New Zealand",
                "nic":"Nicaragua",
                "ner":"Niger",
                "nga":"Nigeria",
                "niu":"Niue",
                "nfk":"Norfolk Island",
                "mnp":"Northern Mariana Islands",
                "nor":"Norway",
                "omn":"Oman",
                "pak":"Pakistan",
                "plw":"Palau",
                "pse":"Palestinian Territory, Occupied",
                "pan":"Panama",
                "png":"Papua New Guinea",
                "pry":"Paraguay",
                "per":"Peru",
                "phl":"Philippines",
                "pcn":"Pitcairn",
                "pol":"Poland",
                "prt":"Portugal",
                "pri":"Puerto Rico",
                "qat":"Qatar",
                "rou":"Romania",
                "rus":"Russian Federation",
                "rwa":"Rwanda",
                "reu":"Reunion",
                "blm":"Saint Barthelemy",
                "shn":"Saint Helena",
                "kna":"Saint Kitts and Nevis",
                "lca":"Saint Lucia",
                "maf":"Saint Martin (French part)",
                "spm":"Saint Pierre and Miquelon",
                "vct":"Saint Vincent and the Grenadines",
                "wsm":"Samoa",
                "smr":"San Marino",
                "stp":"Sao Tome and Principe",
                "sau":"Saudi Arabia",
                "sen":"Senegal",
                "srb":"Serbia",
                "syc":"Seychelles",
                "sle":"Sierra Leone",
                "sgp":"Singapore",
                "svk":"Slovakia",
                "svn":"Slovenia",
                "slb":"Solomon Islands",
                "som":"Somalia",
                "zaf":"South Africa",
                "sgs":"South Georgia and the South Sandwich Islands",
                "esp":"Spain",
                "lka":"Sri Lanka",
                "sdn":"Sudan",
                "sur":"Suriname",
                "sjm":"Svalbard and Jan Mayen",
                "swz":"Swaziland",
                "swe":"Sweden",
                "che":"Switzerland",
                "syr":"Syrian Arab Republic",
                "twn":"Taiwan, Province of China",
                "tjk":"Tajikistan",
                "tza":"Tanzania, United Republic of",
                "tha":"Thailand",
                "tls":"Timor-Leste",
                "tgo":"Togo",
                "tkl":"Tokelau",
                "ton":"Tonga",
                "tto":"Trinidad and Tobago",
                "tun":"Tunisia",
                "tur":"Turkey",
                "tkm":"Turkmenistan",
                "tca":"Turks and Caicos Islands",
                "tuv":"Tuvalu",
                "uga":"Uganda",
                "ukr":"Ukraine",
                "are":"United Arab Emirates",
                "gbr":"United Kingdom",
                "usa":"United States",
                "umi":"United States Minor Outlying Islands",
                "ury":"Uruguay",
                "uzb":"Uzbekistan",
                "vut":"Vanuatu",
                "ven":"Venezuela",
                "vnm":"Viet Nam",
                "vgb":"Virgin Islands, British",
                "vir":"Virgin Islands, U.S.",
                "wlf":"Wallis and Futuna",
                "esh":"Western Sahara",
                "yem":"Yemen",
                "zmb":"Zambia",
                "zwe":"Zimbabwe"
            },
            "empty": "",
            "required": "This field is required",
            "valid": "",
            "invalid": "This field is invalid",
            "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "timeUnits": { SECOND: "seconds", MINUTE: "minutes", HOUR: "hours", DAY: "days", MONTH: "months", YEAR: "years" }
        }
    });

})(jQuery);
(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"cs_CZ": {
				required: "Toto pole je vyžadováno",
				invalid: "Toto pole je neplatné",
				months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
				timeUnits: {
					SECOND: "sekundy",
					MINUTE: "minuty",
					HOUR: "hodiny",
					DAY: "dny",
					MONTH: "měsíce",
					YEAR: "roky"
				},
				"invalidValueOfEnum": "Toto pole musí obsahovat jednu hodnotu z {0}. Aktuální hodnota je: {1}",
				"notOptional": "Toto pole není volitelné",
				"disallowValue": "{0} jsou zakázané hodnoty.",
				"notEnoughItems": "Minimální počet položek je {0}",
				"tooManyItems": "Maximální počet položek je {0}",
				"valueNotUnique": "Hodnoty nejsou unikátní",
				"notAnArray": "Tato hodnota není pole",
				"addItemButtonLabel": "Přidat novou položku",
				"addButtonLabel": "Přidat",
				"removeButtonLabel": "Odebrat",
				"upButtonLabel": "Nahoru",
				"downButtonLabel": "Dolů",
				"noneLabel": "Žádný",
				"stringValueTooSmall": "Minimální hodnota tohoto pole je {0}",
				"stringValueTooLarge": "Maximální hodnota tohoto pole je {0}",
				"stringValueTooSmallExclusive": "Hodnota tohoto pole musí být větší než {0}",
				"stringValueTooLargeExclusive": "Hodnota tohoto pole musí být menší než {0}",
				"stringDivisibleBy": "Hodnota musí být dělitelná {0}",
				"stringNotANumber": "Hodnota není číslo.",
				"stringValueNotMultipleOf": "Číslo není násobkem {0}",
				"tooManyProperties": "Maximální počet vlastností ({0}) byl překročen.",
				"tooFewProperties": "Není dostatek vlastností (je požadováno {0})",
				"wordLimitExceeded": "Maximální počet slov ({0}) byl překročen.",
				"invalidPattern": "Toto pole má mít vzor {0}",
				"stringTooShort": "Toto pole musí obsahovat nejmeně {0} znaků",
				"stringTooLong": "Toto pole musí obsahovat maximálně {0} znaků",
				"invalidDate": "Nesprávné datum pro formát {0}",
				"editorAnnotationsExist": "Editor má v sobě chyby, které musí být opraveny",
				"invalidEmail": "Chybná e-mailová adresa, př.: info@cloudcms.com",
				"stringNotAnInteger": "Tato hodnota není číslo.",
				"invalidIPv4": "Chybná IPv4 adresa, ex: 192.168.0.1",
				"stringNotAJSON": "Tato hodnota není platný JSON text.",
				"keyMissing": "Mapa obsahuje prázdný klíč.",
				"keyNotUnique": "Klíče nejsou jedinečné.",
				"invalidPassword": "Špatné heslo",
				"invalidPhone": "Špatné telefonní číslo, př.: (123) 456-9999", // TODO: invalid pattern for czech locale
				"chooseFile": "Vyberte soubor...",
				"chooseFiles": "Vyberte soubory...",
				"dropZoneSingle": "Vyberte soubor nebo jej přetáhněte sem pro nahrání...",
				"dropZoneMultiple": "Vyberte soubory nebo je přetáhněte sem pro nahrání...",
				"invalidURLFormat": "Uvedená URL není platna webová adresa.",
				"invalidZipcodeFormatFive": "Chybné poštovní směrovací číslo (#####)",
				"invalidZipcodeFormatNine": "Chybné devíti-místné poštovní směrovací číslo (#####-####)"
			}
        }
	});

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "de_AT": {
                required: "Eingabe erforderlich",
                invalid: "Eingabe invalid",
                months: ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                timeUnits: {
                    SECOND: "Sekunden",
                    MINUTE: "Minuten",
                    HOUR: "Stunden",
                    DAY: "Tage",
                    MONTH: "Monate",
                    YEAR: "Jahre"
                },
                "notOptional": "Dieses Feld ist nicht optional",
                "disallowValue": "Diese Werte sind nicht erlaubt: {0}",
                "invalidValueOfEnum": "Diese Feld sollte einen der folgenden Werte enthalten: {0}. [{1}]",
                "notEnoughItems": "Die Mindestanzahl von Elementen ist {0}",
                "tooManyItems": "Die Maximalanzahl von Elementen ist {0}",
                "valueNotUnique": "Diese Werte sind nicht eindeutig",
                "notAnArray": "Keine Liste von Werten",
                "invalidDate": "Falsches Datumsformat: {0}",
                "invalidEmail": "Ungültige e-Mail Adresse, z.B.: info@cloudcms.com",
                "stringNotAnInteger": "Eingabe ist keine Ganz Zahl.",
                "invalidIPv4": "Ungültige IPv4 Adresse, z.B.: 192.168.0.1",
                "stringValueTooSmall": "Die Mindestanzahl von Zeichen ist {0}",
                "stringValueTooLarge": "Die Maximalanzahl von Zeichen ist {0}",
                "stringValueTooSmallExclusive": "Die Anzahl der Zeichen muss größer sein als {0}",
                "stringValueTooLargeExclusive": "Die Anzahl der Zeichen muss kleiner sein als {0}",
                "stringDivisibleBy": "Der Wert muss durch {0} dividierbar sein",
                "stringNotANumber": "Die Eingabe ist keine Zahl",
                "invalidPassword": "Ungültiges Passwort.",
                "invalidPhone": "Ungültige Telefonnummer, z.B.: (123) 456-9999",
                "invalidPattern": "Diese Feld stimmt nicht mit folgender Vorgabe überein {0}",
                "stringTooShort": "Dieses Feld sollte mindestens {0} Zeichen enthalten",
                "stringTooLong": "Dieses Feld sollte höchstens {0} Zeichen enthalten"
            }
		}
	});

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
            "de_DE": {
                required: "Eingabe erforderlich",
                invalid: "Eingabe ungültig",
                months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                timeUnits: {
                    SECOND: "Sekunden",
                    MINUTE: "Minuten",
                    HOUR: "Stunden",
                    DAY: "Tage",
                    MONTH: "Monate",
                    YEAR: "Jahre"
                },
                "notOptional": "Dieses Feld ist nicht optional",
                "disallowValue": "Diese Werte sind nicht erlaubt: {0}",
                "invalidValueOfEnum": "Diese Feld sollte einen der folgenden Werte enthalten: {0}. [{1}]",
                "notEnoughItems": "Die Mindestanzahl von Elementen ist {0}",
                "tooManyItems": "Die Maximalanzahl von Elementen ist {0}",
                "valueNotUnique": "Diese Werte sind nicht eindeutig",
                "notAnArray": "Keine Liste von Werten",
                "invalidDate": "Falsches Datumsformat: {0}",
                "invalidEmail": "Keine gültige E-Mail Adresse",
                "stringNotAnInteger": "Keine Ganze Zahl",
                "invalidIPv4": "Ungültige IPv4 Adresse",
                "stringValueTooSmall": "Die Mindestanzahl von Zeichen ist {0}",
                "stringValueTooLarge": "Die Maximalanzahl von Zeichen ist {0}",
                "stringValueTooSmallExclusive": "Die Anzahl der Zeichen muss größer sein als {0}",
                "stringValueTooLargeExclusive": "Die Anzahl der Zeichen muss kleiner sein als {0}",
                "stringDivisibleBy": "Der Wert muss durch {0} dividierbar sein",
                "stringNotANumber": "Die Eingabe ist keine Zahl",
                "invalidPassword": "Ungültiges Passwort",
                "invalidPhone": "Ungültige Telefonnummer",
                "invalidPattern": "Diese Feld stimmt nicht mit folgender Vorgabe überein {0}",
                "stringTooShort": "Dieses Feld sollte mindestens {0} Zeichen enthalten",
                "stringTooLong": "Dieses Feld sollte höchstens {0} Zeichen enthalten"
            }
		}
	});

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"es_ES": {
				required: "Este campo es obligatorio",
				invalid: "Este campo es inválido",
				months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
				timeUnits: {
					SECOND: "segundos",
					MINUTE: "minutos",
					HOUR: "horas",
					DAY: "días",
					MONTH: "meses",
					YEAR: "años"
				},
				"notOptional": "Este campo no es opcional.",
				"disallowValue": "{0} son los valores rechazados.",
				"invalidValueOfEnum": "Este campo debe tener uno de los valores adentro {0}. [{1}]",
				"notEnoughItems": "El número mínimo de artículos es {0}",
				"tooManyItems": "El número máximo de artículos es {0}",
				"valueNotUnique": "Los valores no son únicos",
				"notAnArray": "Este valor no es un arsenal",
				"invalidDate": "Fecha inválida para el formato {0}",
				"invalidEmail": "Email address inválido, ex: info@cloudcms.com",
				"stringNotAnInteger": "Este valor no es un número entero.",
				"invalidIPv4": "Dirección inválida IPv4, ex: 192.168.0.1",
				"stringValueTooSmall": "El valor mínimo para este campo es {0}",
				"stringValueTooLarge": "El valor máximo para este campo es {0}",
				"stringValueTooSmallExclusive": "El valor de este campo debe ser mayor que {0}",
				"stringValueTooLargeExclusive": "El valor de este campo debe ser menos que {0}",
				"stringDivisibleBy": "El valor debe ser divisible cerca {0}",
				"stringNotANumber": "Este valor no es un número.",
				"invalidPassword": "Contraseña inválida",
				"invalidPhone": "Número de teléfono inválido, ex: (123) 456-9999",
				"invalidPattern": "Este campo debe tener patrón {0}",
				"stringTooShort": "Este campo debe contener por lo menos {0} números o caracteres",
				"stringTooLong": "Este campo debe contener a lo más {0} números o caracteres",
				"noneLabel": "Ninguno",
				"addItemButtonLabel": "Añadir",
				"addButtonLabel": "Añadir",
				"removeButtonLabel": "Quitar",
				"upButtonLabel": "Arriba",
				"downButtonLabel": "Abajo"
			}
        }
	});

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"fr_FR": {
				required: "Ce champ est requis",
				invalid: "Ce champ est invalide",
				months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
				timeUnits: {
					SECOND: "secondes",
					MINUTE: "minutes",
					HOUR: "heures",
					DAY: "jours",
					MONTH: "mois",
					YEAR: "années"
				},
				"notOptional": "Ce champ n'est pas optionnel.",
				"disallowValue": "{0} sont des valeurs interdites.",
				"invalidValueOfEnum": "Ce champ doit prendre une des valeurs suivantes : {0}. [{1}]",
				"notEnoughItems": "Le nombre minimum d'éléments est {0}",
				"tooManyItems": "Le nombre maximum d'éléments est {0}",
				"valueNotUnique": "Les valeurs sont uniques",
				"notAnArray": "Cette valeur n'est pas une liste",
				"invalidDate": "Cette date ne correspond pas au format {0}",
				"invalidEmail": "Adresse de courriel invalide, ex: info@cloudcms.com",
				"stringNotAnInteger": "Cette valeur n'est pas un nombre entier.",
				"invalidIPv4": "Adresse IPv4 invalide, ex: 192.168.0.1",
				"stringValueTooSmall": "La valeur minimale pour ce champ est {0}",
				"stringValueTooLarge": "La valeur maximale pour ce champ est {0}",
				"stringValueTooSmallExclusive": "La valeur doit-être supérieure à {0}",
				"stringValueTooLargeExclusive": "La valeur doit-être inférieure à {0}",
				"stringDivisibleBy": "La valeur doit-être divisible par {0}",
				"stringNotANumber": "Cette valeur n'est pas un nombre.",
				"invalidPassword": "Mot de passe invalide",
				"invalidPhone": "Numéro de téléphone invalide, ex: (123) 456-9999",
				"invalidPattern": "Ce champ doit correspondre au motif {0}",
                "stringTooShort": "Ce champ doit contenir au moins {0} caractères",
                "stringTooLong": "Ce champ doit contenir au plus {0} caractères"
            }
        }
    });

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"hr_HR": {
				required: "Polje je obavezno",
				invalid: "Pogrešna vrijednost",
				months: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
				timeUnits: {
					SECOND: "sekunda",
					MINUTE: "minuta",
					HOUR: "sati",
					DAY: "dan",
					MONTH: "mjesec",
					YEAR: "godina"
				},
				"notOptional": "Polje nije opciono.",
				"disallowValue": "{0} vrijednost nije dozvoljena.",
				"invalidValueOfEnum": "Moguće vrijednosti : {0}. [{1}]",
				"notEnoughItems": "Odaberite najmanje {0}",
				"tooManyItems": "Odaberite najviše {0}",
				"valueNotUnique": "Vrijednost nije jedinstvena",
				"notAnArray": "Vrijednost nije popis",
				"invalidDate": "Datum nije u formatu {0}",
				"invalidEmail": "E-mail adresa nije u ispravnom formatu, npr: ime.prezime@internet.com",
				"stringNotAnInteger": "Vrijednost nije cijeli broj.",
				"invalidIPv4": "IPv4 adresa nije ispravna, npr: 192.168.0.1",
				"stringValueTooSmall": "Vrijednost je ispod dopuštenog {0}",
				"stringValueTooLarge": "Vrijednost je iznad dopuštenog {0}",
				"stringValueTooSmallExclusive": "Vrijednost mora biti veća od {0}",
				"stringValueTooLargeExclusive": "Vrijednost mora biti manja od {0}",
				"stringDivisibleBy": "Vrijednost mora biti djeljiva sa {0}",
				"stringNotANumber": "Vrijednost nije broj.",
				"invalidPassword": "Neispravna lozinka",
				"invalidPhone": "Telefon nije ispravan, npr: (123) 456-9999",
				"invalidPattern": "Pogrešan uzorak {0}",
                "stringTooShort": "Polje mora imati namjanje {0} znakova",
                "stringTooLong": "Polje mora imati najviše {0} znakova"
            }
        }
    });

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"it_IT": {
				required: "Questo campo è obbligatorio",
				invalid: "Questo campo è invalido",
				months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
				timeUnits: {
					SECOND: "secondi",
					MINUTE: "minuti",
					HOUR: "ore",
					DAY: "giorni",
					MONTH: "mesi",
					YEAR: "anni"
				},
				"notOptional": "Questo campo non è opzionale",
				"disallowValue": "{0} sono valori invalidi",
				"invalidValueOfEnum": "Questo campo deve avere uno dei seguenti valori {0} (valore attuale: {1})",
				"notEnoughItems": "Il numero minimo di elementi richiesti è {0}",
				"tooManyItems": "Il numero massimo di elementi ammessi è {0}",
				"valueNotUnique": "I valori non sono univoci",
				"notAnArray": "Questo valore non è di tipo array",
				"invalidDate": "Data invalida per il formato {0}",
				"invalidEmail": "Indirizzo email invalido, si attendono valori del tipo: info@cloudcms.com",
				"stringNotAnInteger": "Questo valore non è un numero intero",
				"invalidIPv4": "Indirizzo IPv4 invalido, si attendono valori del tipo: 192.168.0.1",
				"stringValueTooSmall": "Il valore minimo per questo campo è {0}",
				"stringValueTooLarge": "Il valore massimo per questo campo è {0}",
				"stringValueTooSmallExclusive": "Il valore di questo campo deve essere maggiore di {0}",
				"stringValueTooLargeExclusive": "Il valore di questo campo deve essere minore di {0}",
				"stringDivisibleBy": "Il valore di questo campo deve essere divisibile per {0}",
				"stringNotANumber": "Questo valore non è un numero",
				"invalidPassword": "Password invalida",
				"invalidPhone": "Numero di telefono invalido, si attendono valori del tipo: (123) 456-9999",
				"invalidPattern": "Questo campo deve avere la seguente struttura: {0}",
				"stringTooShort": "Questo campo non deve contenere meno di {0} caratteri",
				"stringTooLong": "Questo campo non deve contenere più di {0} caratteri",
				"noneLabel": "Nessuno",
				"addItemButtonLabel": "Aggiungi",
				"addButtonLabel": "Aggiungi",
				"removeButtonLabel": "Rimuovi",
				"upButtonLabel": "Su",
				"downButtonLabel": "Giù"
			}
		}
	});

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "ja_JP": {
                required: "この項目は必須です",
                invalid: "この項目は正しい値ではありません",
                months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                timeUnits: {
                    SECOND: "秒",
                    MINUTE: "分",
                    HOUR: "時",
                    DAY: "日",
                    MONTH: "月",
                    YEAR: "年"
                },
                "notOptional": "この項目は任意の回答項目ではありません",
                "disallowValue": "{0} は禁止されている値です",
                "invalidValueOfEnum": "この項目は {0} の中から選ばなければなりません。現在の値は {1} です",
                "notEnoughItems": "項目数は {0} 以上必要です",
                "tooManyItems": "項目数は {0} 以下でなければなりません",
                "valueNotUnique": "値が一意ではありません",
                "notAnArray": "この項目の値が配列でありません",
                "stringValueTooSmall": "この項目の最小値は {0} です",
                "stringValueTooLarge": "この項目の最大値は {0} です",
                "stringValueTooSmallExclusive": "この項目の値は {0} より小さくなければなりません",
                "stringValueTooLargeExclusive": "この項目の値は {0} より大きくなければなりません",
                "stringDivisibleBy": "値は {0} によって割り切れなければなりません",
                "stringNotANumber": "この項目の値が数値ではありません",
                "stringValueNotMultipleOf": "値が {0} の倍数ではありません",
                "stringNotAnInteger": "この項目の値が整数ではありません",
                "stringNotAJSON": "値が正しい JSON 形式の文字列ではありません",
                "stringTooShort": "この項目は {0} 文字以上必要です",
                "stringTooLong": "この項目は {0} 文字以下でなければなりません",
                "invalidTime": "時間が正しくありません",
                "invalidDate": "日付が {0} ではありません",
                "invalidEmail": "メールアドレスが正しくありません。例えば info@cloudcms.com のような形式です",
                "invalidIPv4": "IPv4 アドレスが正しくありません。例えば 192.168.0.1 のような形式です",
                "invalidPassword": "パスワードが正しくありません",
                "invalidPhone": "電話番号が正しくありません。例えば (123) 456-9999 のような形式です",
                "invalidPattern": "この項目は {0} のパターンでなければなりません",
                "invalidURLFormat": "URL が正しい形式ではありません",
                "keyMissing": "地図が空のキーを含んでいます",
                "keyNotUnique": "地図のキーが一意ではありません",
                "ObjecttooFewProperties": "プロパティが足りません ({0} が必要です)",
                "tooManyProperties": "プロパティ ({0}) の最大数を超えています",
                "wordLimitExceeded": "{0} の単語数の制限を超えています",
                "editorAnnotationsExist": "エディタが修正すべきエラーを報告しています",
                "invalidZipcodeFormatFive": "5桁の Zipcode (#####) ではありません",
                "invalidZipcodeFormatNine": "9桁の Zipcode (#####-####) ではありません"
            }
        }
    });

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"nl_BE": {
				required: "Dit veld is verplicht",
				invalid: "Dit veld is ongeldig",
				months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "July", "Augustus", "September", "Oktober", "November", "December"],
				timeUnits: {
					SECOND: "seconden",
					MINUTE: "minuten",
					HOUR: "uren",
					DAY: "dagen",
					MONTH: "maanden",
					YEAR: "jaren"
				},
				"notOptional": "Dit veld is niet optioneel.",
				"disallowValue": "{0} zijn verboden waarden.",
				"invalidValueOfEnum": "Dit veld moet één van volgende bevatten : {0}. [{1}]",
				"notEnoughItems": "Het minimum aantal elementen is {0}",
				"tooManyItems": "Het maximum aantal elementen is {0}",
				"valueNotUnique": "De waarden zijn uniek",
				"notAnArray": "Deze waarde is geen lijst",
				"invalidDate": "De datum komt niet overeen met formaat {0}",
				"invalidEmail": "Ongeldig e-mailadres, vb.: info@cloudcms.com",
				"stringNotAnInteger": "Deze waarde is geen geheel getal.",
				"invalidIPv4": "Ongeldig IPv4 adres, vb.: 192.168.0.1",
				"stringValueTooSmall": "De minimale waarde voor dit veld is {0}",
				"stringValueTooLarge": "De maximale waarde voor dit veld is {0}",
				"stringValueTooSmallExclusive": "De waarde moet groter zijn dan {0}",
				"stringValueTooLargeExclusive": "De waarde moet kleiner zijn dan {0}",
				"stringDivisibleBy": "De waarde moet deelbaar zijn door {0}",
				"stringNotANumber": "Deze waarde is geen getal.",
				"invalidPassword": "Ongeldig wachtwoord",
				"invalidPhone": "Ongeldig telefoonnummer, vb: (123) 456-9999",
				"invalidPattern": "Dit veld moet overeenkomen met patroon {0}",
                "stringTooShort": "Dit veld moet minstens {0} tekens bevatten",
                "stringTooLong": "Dit veld moet minder dan {0} tekens bevatten"
            }
        }
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "pl_PL": {
                required: "To pole jest wymagane",
                invalid: "To pole jest nieprawidłowe",
                months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                timeUnits: {
                    SECOND: "sekundy",
                    MINUTE: "minuty",
                    HOUR: "godziny",
                    DAY: "dni",
                    MONTH: "miesiące",
                    YEAR: "lata"
                },
                "notOptional": "To pole nie jest opcjonalne",
                "disallowValue": "Ta wartość nie jest dozwolona: {0}",
                "invalidValueOfEnum": "To pole powinno zawierać jedną z następujących wartości: {0}. [{1}]",
                "notEnoughItems": "Minimalna liczba elementów wynosi {0}",
                "tooManyItems": "Maksymalna liczba elementów wynosi {0}",
                "valueNotUnique": "Te wartości nie są unikalne",
                "notAnArray": "Ta wartość nie jest tablicą",
                "invalidDate": "Niepoprawny format daty: {0}",
                "invalidEmail": "Niepoprawny adres email, n.p.: info@cloudcms.com",
                "stringNotAnInteger": "Ta wartość nie jest liczbą całkowitą",
                "invalidIPv4": "Niepoprawny adres IPv4, n.p.: 192.168.0.1",
                "stringValueTooSmall": "Minimalna wartość dla tego pola wynosi {0}",
                "stringValueTooLarge": "Maksymalna wartość dla tego pola wynosi {0}",
                "stringValueTooSmallExclusive": "Wartość dla tego pola musi być większa niż {0}",
                "stringValueTooLargeExclusive": "Wartość dla tego pola musi być mniejsza niż {0}",
                "stringDivisibleBy": "Wartość musi być podzielna przez {0}",
                "stringNotANumber": "Wartość nie jest liczbą",
                "invalidPassword": "Niepoprawne hasło",
                "invalidPhone": "Niepoprawny numer telefonu, n.p.: (123) 456-9999",
                "invalidPattern": "To pole powinno mieć format {0}",
                "stringTooShort": "To pole powinno zawierać co najmniej {0} znaków",
                "stringTooLong": "To pole powinno zawierać najwyżej {0} znaków"
            }
        }
    });

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;

    Alpaca.registerView ({
        "id": "base",
        "messages": {
            "pt_BR": {
                required: "Este campo é obrigatório",
                invalid: "Este campo é inválido",
                months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
                timeUnits: {
                    SECOND: "segundos",
                    MINUTE: "minutos",
                    HOUR: "horas",
                    DAY: "dias",
                    MONTH: "meses",
                    YEAR: "anos"
                },
                "notOptional": "Este campo não é opcional.",
                "disallowValue": "{0} são valores proibidas.",
                "invalidValueOfEnum": "Este campo deve ter um dos seguintes valores: {0}. [{1}]",
                "notEnoughItems": "O número mínimo de elementos é {0}",
                "tooManyItems": "O número máximo de elementos é {0}",
                "valueNotUnique": "Os valores não são únicos",
                "notAnArray": "Este valor não é uma lista",
                "invalidDate": "Esta data não tem o formato {0}",
                "invalidEmail": "Endereço de email inválida, ex: info@cloudcms.com",
                "stringNotAnInteger": "Este valor não é um número inteiro.",
                "invalidIPv4": "Endereço IPv4 inválida, ex: 192.168.0.1",
                "stringValueTooSmall": "O valor mínimo para este campo é {0}",
                "stringValueTooLarge": "O valor máximo para este campo é {0}",
                "stringValueTooSmallExclusive": "O valor deste campo deve ser maior que {0}",
                "stringValueTooLargeExclusive": "O valor deste campo deve ser menor que {0}",
                "stringDivisibleBy": "O valor deve ser divisível por {0}",
                "stringNotANumber": "Este valor não é um número.",
                "invalidPassword": "Senha inválida",
                "invalidPhone": "Número de telefone inválido, ex: (123) 456-9999",
                "invalidPattern": "Este campo deve ter o padrão {0}",
                "stringTooShort": "Este campo deve incluir pelo menos {0} caracteres",
                "stringTooLong": "Este campo pode incluir no máximo {0} caracteres"
            }
        }
    });

})(jQuery);

(function($) {

	var Alpaca = $.alpaca;

	Alpaca.registerView ({
		"id": "base",
		"messages": {
			"zh_CN": {
				required: "&#27492;&#22495;&#24517;&#39035;",
				invalid: "&#27492;&#22495;&#19981;&#21512;&#26684;",
				months: ["&#19968;&#26376;", "&#20108;&#26376;", "&#19977;&#26376;", "&#22235;&#26376;", "&#20116;&#26376;", "&#20845;&#26376;", "&#19971;&#26376;", "&#20843;&#26376;", "&#20061;&#26376;", "&#21313;&#26376;", "&#21313;&#19968;&#26376;", "&#21313;&#20108;&#26376;"],
				timeUnits: {
					SECOND: "&#31186;",
					MINUTE: "&#20998;",
					HOUR: "&#26102;",
					DAY: "&#26085;",
					MONTH: "&#26376;",
					YEAR: "&#24180;"
				},
				"notOptional": "&#27492;&#22495;&#38750;&#20219;&#36873;",
				"disallowValue": "&#38750;&#27861;&#36755;&#20837;&#21253;&#25324; {0}.",
				"invalidValueOfEnum": "&#20801;&#35768;&#36755;&#20837;&#21253;&#25324; {0}. [{1}]",
				"notEnoughItems": "&#26368;&#23567;&#20010;&#25968; {0}",
				"tooManyItems": "&#26368;&#22823;&#20010;&#25968; {0}",
				"valueNotUnique": "&#36755;&#20837;&#20540;&#19981;&#29420;&#29305;",
				"notAnArray": "&#19981;&#26159;&#25968;&#32452;",
				"invalidDate": "&#26085;&#26399;&#26684;&#24335;&#22240;&#35813;&#26159; {0}",
				"invalidEmail": "&#20234;&#22969;&#20799;&#26684;&#24335;&#19981;&#23545;, ex: info@cloudcms.com",
				"stringNotAnInteger": "&#19981;&#26159;&#25972;&#25968;.",
				"invalidIPv4": "&#19981;&#26159;&#21512;&#27861;IP&#22320;&#22336;, ex: 192.168.0.1",
				"stringValueTooSmall": "&#26368;&#23567;&#20540;&#26159; {0}",
				"stringValueTooLarge": "&#26368;&#22823;&#20540;&#26159; {0}",
				"stringValueTooSmallExclusive": "&#20540;&#24517;&#39035;&#22823;&#20110; {0}",
				"stringValueTooLargeExclusive": "&#20540;&#24517;&#39035;&#23567;&#20110; {0}",
				"stringDivisibleBy": "&#20540;&#24517;&#39035;&#33021;&#34987; {0} &#25972;&#38500;",
				"stringNotANumber": "&#19981;&#26159;&#25968;&#23383;.",
				"invalidPassword": "&#38750;&#27861;&#23494;&#30721;",
				"invalidPhone": "&#38750;&#27861;&#30005;&#35805;&#21495;&#30721;, ex: (123) 456-9999",
				"invalidPattern": "&#27492;&#22495;&#39035;&#26377;&#26684;&#24335; {0}",
				"stringTooShort": "&#27492;&#22495;&#33267;&#23569;&#38271;&#24230; {0}",
				"stringTooLong": "&#27492;&#22495;&#26368;&#22810;&#38271;&#24230; {0}"
			}
        }
    });

})(jQuery);

(function($) {

    var Alpaca = $.alpaca;
    var callbacks = {};
    callbacks["field"] = function()
    {
    };
    callbacks["control"] = function()
    {
    };
    callbacks["container"] = function()
    {
    };
    callbacks["form"] = function()
    {
    };
    callbacks["required"] = function()
    {
    };
    callbacks["optional"] = function()
    {
    };
    callbacks["readonly"] = function()
    {
    };
    callbacks["disabled"] = function()
    {
    };
    callbacks["enabled"] = function()
    {
    };
    callbacks["clearValidity"] = function()
    {
    };
    callbacks["invalid"] = function(hidden)
    {
    };
    callbacks["valid"] = function()
    {
    };
    callbacks["addMessage"] = function(index, messageId, messageText, hidden)
    {
    };
    callbacks["removeMessages"] = function()
    {
    };
    callbacks["enableButton"] = function(button)
    {
    };
    callbacks["disableButton"] = function(button)
    {
    };
    callbacks["arrayToolbar"] = function(remove)
    {

        var self = this;

        if (remove)
        {
            var existingToolbar = $(self.getFieldEl()).find(".alpaca-array-toolbar[data-alpaca-array-toolbar-field-id='" + self.getId() + "']");
            if (existingToolbar.length > 0)
            {
                var insertionPointEl = $("<div class='" + Alpaca.MARKER_CLASS_ARRAY_TOOLBAR + "' " + Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID + "='" + self.getId() + "'></div>");

                existingToolbar.before(insertionPointEl);
                existingToolbar.remove();
            }
        }
        else
        {
            var insertionPointEl = $(self.getContainerEl()).find("." + Alpaca.MARKER_CLASS_ARRAY_TOOLBAR + "[" + Alpaca.MARKER_DATA_ARRAY_TOOLBAR_FIELD_ID + "='" + self.getId() + "']");
            if (insertionPointEl.length > 0)
            {
                var templateDescriptor = self.view.getTemplateDescriptor("container-array-toolbar", self);
                if (templateDescriptor)
                {
                    var toolbar = Alpaca.tmpl(templateDescriptor, {
                        "actions": self.toolbar.actions,
                        "id": self.getId(),
                        "toolbarStyle": self.options.toolbarStyle,
                        "view": self.view
                    });
                    $(insertionPointEl).before(toolbar);
                    $(insertionPointEl).remove();
                }
            }
        }
    };
    callbacks["arrayActionbars"] = function(remove)
    {

        var self = this;
        for (var childIndex = 0; childIndex < self.children.length; childIndex++)
        {
            var childField = self.children[childIndex];
            var childFieldId = childField.getId();

            if (remove)
            {
                var existingActionbar = $(self.getFieldEl()).find(".alpaca-array-actionbar[data-alpaca-array-actionbar-field-id='" + childFieldId + "']");
                if (existingActionbar.length > 0)
                {
                    var insertionPointEl = $("<div class='" + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR + "' " + Alpaca.MARKER_DATA_ARRAY_ITEM_KEY + "='" + childField.name + "'></div>");

                    existingActionbar.before(insertionPointEl);
                    existingActionbar.remove();
                }
            }
            else
            {
                var insertionPointEl = $(self.getFieldEl()).find("." + Alpaca.MARKER_CLASS_ARRAY_ITEM_ACTIONBAR + "[" + Alpaca.MARKER_DATA_ARRAY_ITEM_KEY + "='" + childField.name + "']");
                if (insertionPointEl.length > 0)
                {
                    var templateDescriptor = self.view.getTemplateDescriptor("container-array-actionbar", self);
                    if (templateDescriptor)
                    {
                        var actionbar = Alpaca.tmpl(templateDescriptor, {
                            "actions": self.actionbar.actions,
                            "name": childField.name,
                            "parentFieldId": self.getId(),
                            "fieldId": childField.getId(),
                            "itemIndex": childIndex,
                            "actionbarStyle": self.options.actionbarStyle,
                            "view": self.view
                        });
                        $(insertionPointEl).before(actionbar);
                        $(insertionPointEl).remove();
                    }
                }
            }
        }
    };
    callbacks["autocomplete"] = function()
    {
    };


    var styles = {};
    styles["button"] = "";
    styles["smallButton"] = "";
    styles["addIcon"] = "";
    styles["removeIcon"] = "";
    styles["upIcon"] = "";
    styles["downIcon"] = "";
    styles["expandedIcon"] = "";
    styles["collapsedIcon"] = "";
    styles["table"] = "";

    Alpaca.registerView({
        "id": "web-display",
        "parent": "base",
        "type": "display",
        "ui": "web",
        "title": "Default HTML5 display view",
        "displayReadonly": true,
        "templates": {},
        "callbacks": callbacks,
        "styles": styles,
        "horizontal": false
    });

    Alpaca.registerView({
        "id": "web-display-horizontal",
        "parent": "web-display",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "web-edit",
        "parent": "base",
        "type": "edit",
        "ui": "web",
        "title": "Default HTML5 edit view",
        "displayReadonly": true,
        "templates": {},
        "callbacks": callbacks,
        "styles": styles,
        "horizontal": false
    });

    Alpaca.registerView({
        "id": "web-edit-horizontal",
        "parent": "web-edit",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "web-create",
        "parent": "web-edit",
        "type": "create",
        "title": "Default HTML5 create view",
        "displayReadonly": false,
        "templates": {},
        "horizontal": false
    });

    Alpaca.registerView({
        "id": "web-create-horizontal",
        "parent": "web-create",
        "horizontal": true
    });

})(jQuery);
(function($) {

    var Alpaca = $.alpaca;
    var styles = {};
    styles["button"] = "btn btn-default";
    styles["smallButton"] = "btn btn-default btn-sm";
    styles["addIcon"] = "glyphicon glyphicon-plus-sign";
    styles["removeIcon"] = "glyphicon glyphicon-minus-sign";
    styles["upIcon"] = "glyphicon glyphicon-chevron-up";
    styles["downIcon"] = "glyphicon glyphicon-chevron-down";
    styles["expandedIcon"] = "glyphicon glyphicon-circle-arrow-down";
    styles["collapsedIcon"] = "glyphicon glyphicon-circle-arrow-right";
    styles["table"] = "table table-striped table-bordered table-hover";
    var callbacks = {};
    callbacks["required"] = function()
    {
        var fieldEl = this.getFieldEl();
        var label = $(fieldEl).find("label.alpaca-control-label");
        $('<span class="alpaca-icon-required glyphicon glyphicon-star"></span>').prependTo(label);

    };
    callbacks["invalid"] = function()
    {
        if (this.isControlField)
        {
            $(this.getFieldEl()).addClass('has-error');
        }

    };
    callbacks["valid"] = function()
    {
        $(this.getFieldEl()).removeClass('has-error');
    };
    callbacks["control"] = function()
    {
        var fieldEl = this.getFieldEl();
        var controlEl = this.getControlEl();
        $(fieldEl).find("input").addClass("form-control");
        $(fieldEl).find("textarea").addClass("form-control");
        $(fieldEl).find("select").addClass("form-control");
        $(fieldEl).find("input[type=checkbox]").removeClass("form-control");
        $(fieldEl).find("input[type=file]").removeClass("form-control");
        $(fieldEl).find("input[type=radio]").removeClass("form-control");
        if (this.inputType === "color")
        {
            $(fieldEl).find("input").removeClass("form-control");
        }
        $(fieldEl).find("input[type=checkbox]").parent().parent().addClass("checkbox");
        $(fieldEl).find("input[type=radio]").parent().parent().addClass("radio");
        if ($(fieldEl).parents("form").hasClass("form-inline"))
        {
            $(fieldEl).find("input[type=checkbox]").parent().addClass("checkbox-inline");
            $(fieldEl).find("input[type=radio]").parent().addClass("radio-inline");
        }
        $(fieldEl).find("label.alpaca-control-label").addClass("control-label");
        if (this.view.horizontal)
        {
            $(fieldEl).find("label.alpaca-control-label").addClass("col-sm-3");

            var wrapper = $("<div></div>");
            wrapper.addClass("col-sm-9");

            $(controlEl).after(wrapper);
            wrapper.append(controlEl);

            $(fieldEl).append("<div style='clear:both;'></div>");
        }
    };
    callbacks["container"] = function()
    {
        var containerEl = this.getContainerEl();

        if (this.view.horizontal)
        {
            $(containerEl).addClass("form-horizontal");
        }
    };
    callbacks["form"] = function()
    {
        var formEl = this.getFormEl();
    };
    callbacks["enableButton"] = function(button)
    {
        $(button).removeAttr("disabled");
    };
    callbacks["disableButton"] = function(button)
    {
        $(button).attr("disabled", "disabled");
    };
    callbacks["collapsible"] = function()
    {
        var fieldEl = this.getFieldEl();
        var legendEl = $(fieldEl).find("legend").first();
        var anchorEl = $("[data-toggle='collapse']", legendEl);
        if ($(anchorEl).length > 0)
        {
            var containerEl = this.getContainerEl();
            var id = $(containerEl).attr("id");
            if (!id) {
                id = Alpaca.generateId();
                $(containerEl).attr("id", id);
            }
            $(containerEl).addClass("collapse in");
            if (!$(anchorEl).attr("data-target")) {
                $(anchorEl).attr("data-target", "#" + id);
            }

            $(anchorEl).mouseover(function(e) {
                $(this).css("cursor", "pointer");
            })
        }
    };
    callbacks["tableHeaderRequired"] = function(schema, options, domEl)
    {
        $('<span class="alpaca-icon-required glyphicon glyphicon-star"></span>').prependTo(domEl);

    };
    callbacks["tableHeaderOptional"] = function(schema, options, domEl)
    {
    };

    Alpaca.registerView({
        "id": "bootstrap-display",
        "parent": "web-display",
        "type": "display",
        "ui": "bootstrap",
        "title": "Display View for Bootstrap 3",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "bootstrap-display-horizontal",
        "parent": "bootstrap-display",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "bootstrap-edit",
        "parent": "web-edit",
        "type": "edit",
        "ui": "bootstrap",
        "title": "Edit View for Bootstrap 3",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "bootstrap-edit-horizontal",
        "parent": "bootstrap-edit",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "bootstrap-create",
        "parent": "bootstrap-edit",
        "title": "Create View for Bootstrap 3",
        "type": "create",
        "displayReadonly": false
    });

    Alpaca.registerView({
        "id": "bootstrap-create-horizontal",
        "parent": "bootstrap-create",
        "horizontal": true
    });

})(jQuery);

        
            Alpaca.defaultView = 'bootstrap';
        
        return Alpaca;

    

}));
