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
				url: '//server/cgi/cs.exe/api/v2/nodes/678795?expand=properties*',
				responseTime: 100,
				proxy: 'mock_data/mock.nodes.json'
			}));


			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678795/nodes?extra=false*',
				responseTime: 100,
				proxy: 'mock_data/mock.nodes.children.json'
			}));

			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678795/addablenodetypes',
				responseTime: 100,
				proxy: 'mock_data/mock.nodes.addabletypes.json'
			}));

			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/actions?ids=*',
				responseTime: 100,
				proxy: 'mock_data/mock.nodes.actions.json'
			}));

			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678795/facets',
				responseTime: 100,
				proxy: 'mock_data/mock.facets.json'
			}));

			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/volumes/141',
				responseTime: 100,
				proxy: 'mock_data/mock.volumes.141.json'
			}));

			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/volumes/142',
				responseTime: 100,
				proxy: 'mock_data/mock.volumes.142.json'
			}));

			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/volumes/133',
				responseTime: 100,
				proxy: 'mock_data/mock.volumes.133.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678796',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.browser_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678798',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.node_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=682861',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.node_destination_addVer.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=681897',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.node_destination.RIBandConversion.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=686965',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.node_destination.NoStatusScreen.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=681895',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.node_destination.RIB.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=681871',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.node_destination.Conversion.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678807',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.version_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=694521',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.desktop_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678821',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.email_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=683009',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.form_destination.append.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=682999',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.form_destination.overwrite.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678868',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.form_destination.update.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678880',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.ftp_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=683652',
				responseTime: 100,
				proxy: 'mock_data/run_pre/mock.run.parameters.node.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678823',
				responseTime: 150,
				proxy: 'mock_data/run_pre/mock.run.server_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=681887',
				responseTime: 150,
				proxy: 'mock_data/run_pre/mock.run.server_destination.RunInBackground.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/nodes/run?id=678825',
				responseTime: 150,
				proxy: 'mock_data/run_pre/mock.run.workflow_destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678798/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.node.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/682861/output',
				responseTime: 1500,
				proxy: 'mock_data/output_responses/mock.node.destination.addVer.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/681897/output',
				responseTime: 1500,
				proxy: 'mock_data/output_responses/mock.node.destination.RIBandConversion.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/686965/output',
				responseTime: 1500,
				proxy: 'mock_data/output_responses/mock.node.destination.NoStatusScreen.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/681895/output',
				responseTime: 10000,
				proxy: 'mock_data/output_responses/mock.node.destination.RIB.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/681871/output',
				responseTime: 1500,
				proxy: 'mock_data/output_responses/mock.node.destination.Conversion.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678807/output',
				responseTime: 1050,
				proxy: 'mock_data/output_responses/mock.version.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/694521/output?format=webreport',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.desktop.destination.csv'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678821/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.email.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/683009/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.form.destination.append.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/682999/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.form.destination.overwrite.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678868/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.form.destination.update.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678880/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.ftp.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/683652/outpu*',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.parameters.node.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678823/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.server.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/681887/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.server.destination.RunInBackground.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/nodes/678825/output',
				responseTime: 150,
				proxy: 'mock_data/output_responses/mock.workflow.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/679564?expand=properties*',
				responseTime: 150,
				proxy: 'mock_data/misc_nodes/mock.node_destination.resulting_node.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/679564?fields=properties',
				responseTime: 150,
				proxy: 'mock_data/misc_nodes/mock.node_destination.resulting_node_fields.json'
			}));


			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/678798?fields=properties',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.node.destination.node.json'
			}));

			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/678795?fields=properties',
				responseTime: 100,
				proxy: 'mock_data/mock.targetNode.parent.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/151407?expand=properties*',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.DummyParentNode.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/682982?expand=properties*',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.node_destination_uniqueName.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/678873?expand=properties*',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.form.node.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/forms/processes/tasks/update?process_id=683235&subprocess_id=683235&task_id=1',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.workItem.initiatedWF.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/683231?expand=properties%7Boriginal_id%7D&fields=properties&actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=editactivex&actions=editofficeonline&actions=editwebdav&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=permissions&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=description&actions=savefilter',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.workflow.attachments.node.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/683770?expand=properties*',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.parameters.node.destination.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/7728?expand=properties*',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.parameters.node.destination.parent.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v2/nodes/653866?expand=properties*',
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.version.destination.ouput.json'
			}));
			mocks.push(mockjax({
				url: '//server/cgi/cs.exe/api/v1/contentauth?id=694521',
				contentType: "application/json",
				responseTime: 100,
				proxy: 'mock_data/misc_nodes/mock.contentauth.json'
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
