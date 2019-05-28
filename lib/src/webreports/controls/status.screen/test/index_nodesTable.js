/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

require([
		"module",
		"csui/lib/jquery",
		"csui/lib/underscore",
		"csui/lib/marionette",
		"csui/utils/log",
		"csui/utils/base",
		"csui/lib/backbone",
		"csui/widgets/nodestable/nodestable.view",
		'csui/utils/contexts/page/page.context',
		'csui/utils/contexts/factories/children',
		'webreports/controls/status.screen/test/status.screen.mock'
	], function (module, $, _, Marionette, log, base, Backbone, NodesTableView, PageContext,
				 ChildrenCollectionFactory, mock) {
		var config = module.config(),
			el = $("#content"),
			currentID =  678795;

	mock.enable();

		var context = new PageContext({
			factories: {
				connector: {
					connection: {
						url: '//server/cgi/cs.exe/api/v1',
						supportPath: '/img',
						credentials: {
							username: 'Admin',
							password: 'livelink'
						}
					}
				},
				node: {
					attributes: {id: currentID}
				}
			}
		});

		var options = {
			context: context,
			data: {
				pageSize: 20
			}
		};

		var nodesTableWidget = new NodesTableView(options);
		nodesTableWidget.render(); // must call for context.fetch because render requests the models in context



		context.fetch().then(function () {
			el.append(nodesTableWidget.el);
			nodesTableWidget.triggerMethod('show'); // triggers the marionette show event

		});
	}
);
