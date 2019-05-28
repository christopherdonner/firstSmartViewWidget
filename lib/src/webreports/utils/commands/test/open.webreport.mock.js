/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax',
	'webreports/models/run.webreport.pre/test/webreport.forms.wrapper'],
	function (mockjax, testDataWrapper) {

	var mocks = [];

	return {

		enable: function () {
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/348005?expand=properties*',
				responseTime: 100,
				proxy: './mock.nodes.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/348005/nodes?extra=false*',
				responseTime: 100,
				proxy: './mock.nodes.children.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/348005/addablenodetypes',
				responseTime: 100,
				proxy: './mock.nodes.addabletypes.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/actions?ids=*',
				responseTime: 100,
				proxy: './mock.nodes.actions.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/348005/facets',
				responseTime: 100,
				proxy: './mock.facets.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/volumes/141',
				responseTime: 100,
				proxy: './mock.volumes.141.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/volumes/142',
				responseTime: 100,
				proxy: './mock.volumes.142.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/volumes/133',
				responseTime: 100,
				proxy: './mock.volumes.133.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/members/targets?fields=properties&fields=versions.element*',
				responseTime: 100,
				proxy: './mock.members.targets.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=348547',
				responseTime: 100,
				proxy: './mock.run.nocustomparms.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=348006',
				responseTime: 100,
				proxy: './mock.run.nopromptparms.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=381739',
				responseTime: 100,
				proxy: './mock.run.datasourceparms.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=543919',
				responseTime: 100,
				proxy: './mock.run.parmsnoprompts.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=348554',
				responseTime: 100,
				proxy: './mock.run.custompromptscreen.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=513563',
				responseTime: 100,
				proxy: './mock.run.parametersdemo.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=348549',
				responseTime: 150,
				proxy: './mock.run.customparameter.json'
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
