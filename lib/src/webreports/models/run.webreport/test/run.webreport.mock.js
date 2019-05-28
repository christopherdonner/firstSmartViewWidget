/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax',
		'webreports/models/run.webreport.pre/test/webreport.forms.wrapper'],
	function (mockjax, testDataWrapper) {

		var mocks = [];

		return {

			enable: function () {

				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v1/auth',
					responseText: {
						"data": {
							"id": 1000,
							"name": "Admin"
						}
					}
				}));
				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v1/nodes/12345/output',
					responseTime: 150,
					proxy: '../../../controls/status.screen/test/mock_data/output_responses/mock.node.destination.json'
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
