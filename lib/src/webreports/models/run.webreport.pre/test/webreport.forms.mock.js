/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax',
	'webreports/models/run.webreport.pre/test/webreport.forms.wrapper'],
	function (mockjax, testDataWrapper) {

	var mocks = [];

	return {

		enable: function () {
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=12345',
				response: function(settings){
					var DataWrapper = new testDataWrapper();
					this.responseText = DataWrapper._buildJsonResponse();
				}
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/auth',
				responseText: {
					"data": {
						"id": 1000,
						"name": "Admin"
					}
				}
			}));
		},

		disable: function () {
			var mock;
			while ((mock = mocks.pop())) {
				mockjax.clear(mock);
			}
		}

	};

});
