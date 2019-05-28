/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/nodeforms", "csui/models/form"
], function (module, $, _, Backbone, log, base, NodeFormCollection, FormModel) {
  "use strict";

  var NodeUpdateFormCollection = NodeFormCollection.extend({

      constructor: function NodeUpdateFormCollection(models, options) {
        NodeFormCollection.prototype.constructor.apply(this, arguments);
        this.makeNodeResource(options);
      },

      model: FormModel,

      clone: function () {
        return new this.constructor(this.models, {
          node: this.node
        });
      },

      url: function () {
        return _.str.sformat('{0}/forms/nodes/update?id={1}', this.connector.connection.url,
          this.node.get('id'));       
      },

      parse: function (response) {
        if (response.forms) {
          var forms = [];
          _.each(response.forms, function (form) {
            if (form.role_name === 'categories') {
              forms = forms.concat(Object.keys(form.schema.properties).map(function (categoryId) {
                categoryId = Number(categoryId); // convert to number for unselectable node in nodepicker            
                form.data[categoryId] && delete form.data[categoryId][categoryId + '_1'];
                form.options.fields[categoryId] &&
                delete form.options.fields[categoryId][categoryId + '_1'];
                form.schema.properties[categoryId] &&
                delete form.schema.properties[categoryId][categoryId + '_1'];
                return {
                  id: categoryId,                  
                  name: form.schema.properties[categoryId]['title'],
                  title: form.schema.properties[categoryId]['title'],
                  data: form.data[categoryId],
                  role_name: "categories",
                  allow_delete: true,
                  categoryId: categoryId,
                  options: form.options.fields[categoryId],
                  schema: form.schema.properties[categoryId]
                };
              })); 
            } else {
              forms.push(form);
            }           
          });

          return forms;            
        } else {
          return response.data;
        }        
      }
    });

  _.extend(NodeUpdateFormCollection, {
    version: '1.0'
  });
  return NodeUpdateFormCollection;

});

