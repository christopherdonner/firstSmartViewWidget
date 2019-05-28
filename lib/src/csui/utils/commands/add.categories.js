/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["require", "csui/lib/jquery", "csui/lib/underscore", "csui/utils/base", "csui/utils/log",
  "csui/models/command"
], function (require, $, _, base, log, CommandModel) {

  var AddCategories = CommandModel.extend({

    defaults: {
      signature: 'AddCategory',
      command_key: ['addcategory', 'AddCategory'],
      scope: "single"
    },

    enabled: function (status, options) {
      var scope = this.get("scope");
      var nodes = this._getNodesByScope(status, scope);

      if (nodes && nodes.length > 0) {
        if (nodes[0].get('id') === undefined) {

          var enabled = true;
          if (status.originalFormCollection) {
            status.originalFormCollection.each(function (form) {
              if (form.get('role_name') === 'categories' &&
                  form.get('schema').additionalProperties === false) {
                enabled = false;
              }
            });
          }
          return enabled;
        } else {
          return CommandModel.prototype.enabled.apply(this, arguments);
        }
      }
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/widgets/metadata/metadata.add.categories.controller'
      ], function (MetadataAddCategoriesController) {

        var metadataAddCatController = new MetadataAddCategoriesController();
        metadataAddCatController.AddNewCategory(options)
            .done(function (resp) {
              if (options.addPropertiesCallback) {
                options.addPropertiesCallback.call(options.parentView, resp.catModel);
              }
              deferred.resolve();
            })
            .fail(function (err) {
              deferred.reject(err);
            });

      }, function (error) {
        log.warn('Failed to load MetadataAddCategoriesController. {0}', error)
        && console.warn(log.last);
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  return AddCategories;

});
