/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'],
	function (mockjax) {

		var mocks = [];

		return {

			enable: function () {
				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=699157',
					responseTime: 150,
					proxy: './mock_data/mock.forms.cs.json'
				}));

				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=699160',
					responseTime: 150,
					proxy: './mock_data/mock.forms.tilereport.json'
				}));
				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v1/nodes/699157/output',
					responseTime: 150,
					proxy: './mock_data/mock.output.cs.json'
				}));

				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v1/nodes/699160/output',
					responseTime: 150,
					proxy: './mock_data/mock.output.tilereport.json'
				}));
				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v2/nodes/699157?expand=properties*',
					responseTime: 100,
					proxy: './mock_data/mock.cs.json'
				}));

				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v2/nodes/749197?expand=properties*',
					responseTime: 100,
					proxy: './mock_data/mock.new.node.json'
				}));

				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v2/nodes/699145?expand=properties*',
					responseTime: 100,
					proxy: './mock_data/mock.parent.node.json'
				}));

				mocks.push(mockjax({
					url: '//server/cgi/cs.exe/api/v2/nodes/699160?expand=properties*',
					responseTime: 100,
					proxy: './mock_data/mock.tilereport.node.json'
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
