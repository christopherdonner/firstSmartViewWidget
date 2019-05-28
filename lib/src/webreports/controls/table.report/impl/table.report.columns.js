/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/backbone"], function (Backbone) {
	var TableColumnModel = Backbone.Model.extend({

		idAttribute: "key",

		defaults: {
			key: null,  // key from the resource definitions
			sequence: 0 // smaller number moves the column to the front
		}

	});
	var TableColumnCollection = Backbone.Collection.extend({

		model: TableColumnModel,
		comparator: "sequence"

	});
	var	tableColumns = new TableColumnCollection();
	return tableColumns;
});