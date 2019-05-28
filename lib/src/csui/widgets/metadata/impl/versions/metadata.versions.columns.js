/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/backbone", 'i18n!csui/widgets/metadata/impl/nls/lang'],
    function (Backbone, lang) {

      var TableColumnModel = Backbone.Model.extend({

        idAttribute: "key",

        defaults: {
          key: null,  // key from the resource definitions
          sequence: 0 // smaller number moves the column to the front
        }

      });

      var TableColumnCollection = Backbone.Collection.extend({

        model: TableColumnModel,
        comparator: "sequence",

        getColumnKeys: function () {
          return this.pluck('key');
        },

        deepClone: function () {
          return new TableColumnCollection(
              this.map(function (column) {
                return column.attributes;
              }));
        }
      });

      var tableColumns = new TableColumnCollection([
        {
          key: 'version_number_name',
          align: 'center',
          title: lang.versionColumnVersionNumberTitle,
          sequence: 10
        },
        {
          key: 'name',
          sequence: 20
        },
        {
          key: 'create_date',
          sequence: 30
        },
        {
          key: 'owner_id',
          sequence: 40
        },
        {
          key: 'file_size',
          align: 'right',
          title: lang.versionColumnSizeTitle,
          sequence: 50
        }
      ]);

      return tableColumns;

    });
