/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone",
	"webreports/models/run.webreport.pre/test/all_filter_types",
	"webreports/models/run.webreport.pre/test/all_option_labels",
	"webreports/models/run.webreport.pre/test/all_select_types"
], function (_, $, Backbone, filterTypes, optionLabels, selectTypes) {
	'use strict';

	function DataWrapper() {
	}

	_.extend(DataWrapper.prototype, Backbone.Events, {
		_buildJsonResponse: function () {

			var FilterTypes = new filterTypes(),
				OptionLabels = new optionLabels(),
				SelectTypes = new selectTypes();


			var data = {
				"data": {
					"destination_data": {
						"destination_specific": {},
						"export_mime_type": "text/html",
						"output_destination": "browser"
					},
					"parameters_data": {
						"prompt_file_id": "",
						"show_descriptions": true
					}
				},
				"forms": [
					{
						"data": {
							"myCurrentDate": "Thu Oct 19 14:47:36 2017",
							"myMandatoryString": "",
							"myNode": null,
							"myNumber": 7,
							"myString": "Your Name Here",
							"myStringNoPrompt": "a default value",
							"mySubtype": 144
						},
						"options": {
							"fields": {
								"myCurrentDate": {
									"hidden": false,
									"hideInitValidationError": true,
									"label": "Target Date",
									"readonly": false,
									"type": "datetime"
								},
								"myMandatoryString": {
									"hidden": false,
									"hideInitValidationError": true,
									"label": "Priority",
									"readonly": false,
									"type": "text"
								},
								"myNode": {
									"hidden": false,
									"hideInitValidationError": true,
									"label": "Source Container",
									"readonly": false,
									"select_types": [
										144,
										0
									],
									"type": "otcs_node_picker",
									"type_control": {
										"action": "api/v1/volumes",
										"method": "GET",
										"name": "",
										"parameters": {
											"filter_types": [
												-1,
												144,
												0
											],
											"select_types": [
												144,
												0
											]
										}
									}
								},
								"myNumber": {
									"hidden": false,
									"hideInitValidationError": true,
									"label": "Quantity",
									"readonly": false,
									"type": "number"
								},
								"myString": {
									"hidden": false,
									"hideInitValidationError": true,
									"label": "Name",
									"readonly": false,
									"type": "text"
								},
								"myStringNoPrompt": {
									"hidden": true,
									"hideInitValidationError": true,
									"label": "myStringNoPrompt label",
									"readonly": false,
									"type": "text"
								},
								"mySubtype": {
									"hidden": false,
									"hideInitValidationError": true,
									"label": "Filter By",
									"optionLabels": OptionLabels.allSubtypeLabels,
									"readonly": false,
									"type": "select"
								}
							},
							"form": {
								"attributes": {
									"action": "api/v1/",
									"method": ""
								},
								"renderForm": true
							}
						},
						"schema": {
							"properties": {
								"myCurrentDate": {
									"description": "",
									"readonly": false,
									"required": false,
									"title": "Target Date",
									"type": "Date"
								},
								"myMandatoryString": {
									"description": "",
									"readonly": false,
									"required": true,
									"title": "Priority",
									"type": "String"
								},
								"myNode": {
									"description": "",
									"readonly": false,
									"required": false,
									"title": "Source Container",
									"type": "ObjectID"
								},
								"myNumber": {
									"description": "",
									"readonly": false,
									"required": false,
									"title": "Quantity",
									"type": "number"
								},
								"myString": {
									"description": "myString description!",
									"readonly": false,
									"required": false,
									"title": "Name",
									"type": "String"
								},
								"myStringNoPrompt": {
									"description": "",
									"readonly": false,
									"required": false,
									"title": "myStringNoPrompt label",
									"type": "String"
								},
								"mySubtype": {
									"description": "",
									"enum": SelectTypes.allTypes,
									"readonly": false,
									"required": false,
									"title": "Filter By",
									"type": "Object"
								}
							},
							"type": "object"
						}
					}
				]
			}; // data

			return data;
		}

	});

	DataWrapper.prototype.get = Backbone.Model.prototype.get;
	_.extend(DataWrapper, {version: "1.0"});

	return DataWrapper;

});