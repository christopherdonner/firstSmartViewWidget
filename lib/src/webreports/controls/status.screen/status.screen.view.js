/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
	'csui/lib/underscore',
	'csui/lib/marionette',
	'csui/controls/node-type.icon/node-type.icon.view',
	'csui/utils/node.links/node.links',
	'csui/behaviors/default.action/default.action.behavior',
	'csui/utils/smart.nodes/smart.nodes',
	'hbs!webreports/controls/status.screen/impl/status.screen',
	'i18n!webreports/controls/status.screen/impl/nls/lang',
	'css!webreports/controls/status.screen/impl/status.screen'
], function( _,
			 Marionette,
			 NodeTypeIconView,
			 NodeLinks,
			 DefaultActionBehavior,
			 SmartNodes,
			 template,
			 lang) {
	
	
	var statusScreenView = Marionette.ItemView.extend({

		className: 'custom-message',
		template: template,

		ui: {
			iconContainer: ".webreport-status-screen-data",
			secondaryContainer: ".webreport-status-screen-misc-data",
			parentLink: ".parentLink"
		},

			events: {
			'click #primaryNodeLink': "onClickNodeLink",
			'click #secondaryNodeLink': "onClickSecondaryLink"
		},

		behaviors: {
			DefaultAction: {
				behaviorClass: DefaultActionBehavior
			}
		},

		onClickNodeLink: function(event){
			event.preventDefault();
			this.triggerMethod('execute:defaultAction', this.options.primaryNode);
			if ( SmartNodes.isSupported(this.options.primaryNode) ){
				this.options.dialogView.triggerMethod("click:close", event);
			}

		},

		onClickSecondaryLink: function(event){

			var actionNode,
				openWorkItemCommand,
				wfAssignment,
				assignments,
				wfData,
				destination = this.options.destinationModel.get("output_destination");
			event.preventDefault();

			if ( destination === "workflow" && _.has( this.options, "wfAttachmentsNode" ) ) {

				actionNode = this.options.wfAttachmentsNode;

			} else {

				actionNode = this.options.secondaryNode;

			}
			this.triggerMethod('execute:defaultAction', actionNode);
			if ( SmartNodes.isSupported( actionNode ) ){
				this.options.dialogView.triggerMethod("click:close", event);
			}

		},
		

		templateHelpers: function(){

			var primaryNode,
				secondaryNode,
				destinationMessage,
				destinationModel = this.options.destinationModel,
				executionModel = this.options.executeModel,
				outputData = destinationModel.get("run_in_background") ? destinationModel.toJSON() : executionModel.get("data"),
				destination_data = destinationModel.get("run_in_background") ? outputData : outputData.destination_data,
				specifics = destination_data.destination_specific,
				useConversion = destination_data.use_conversion_engine,
				rib = destination_data.run_in_background,
				genericIsProcessingMessage = lang.genericIsProcessingMessage,
				helperData = {
					useConversion: useConversion,
					runInBackground: rib
				};


			if (rib) {
				helperData = _.extend( helperData, {
					runningInBackground: lang.runningInBackground,
					noFurtherResponse: lang.noFurtherResponse,
					outputMessage: genericIsProcessingMessage
				});

			} else if (useConversion){
				helperData = _.extend( helperData, {
					sentForConversion:  lang.sentForConversion,
					outputMessage: genericIsProcessingMessage
				});

			} else {
				switch (destination_data.output_destination.toLowerCase()) {

					case "node":
						primaryNode = this.options.primaryNode; // resulting output node
						secondaryNode = this.options.secondaryNode; // parent of the output node
						if ( specifics.export_type.toLowerCase() === "version" || specifics.duplicate_name_action.toLowerCase() === "addver" ) {

							helperData = _.extend( helperData, {
								primaryData: primaryNode.get("name"),
								primaryIsLink: true,
								destinationMessage: lang.versionDestinationMessage,
								dualRows: false
							});

						} else {

							helperData = _.extend( helperData, {
								primaryData: primaryNode.get("name"),
								primaryIsLink: true,
								destinationMessage: _.str.sformat(lang.nodeDestinationMessage, (specifics.node_type === "doc") ? lang.document : lang.customView),
								secondaryNodeInfo: lang.storedInContainer,
								parentURL: NodeLinks.getUrl(secondaryNode),
								secondaryData: secondaryNode.get("name"),
								dualRows: true
							});

						}

						break;


					case "email":

						helperData = _.extend( helperData, {
							primaryIsLink: false,
							destinationMessage: lang.emailDestinationMessage,
							primaryData: specifics.email_subject,
							dualRows: false,
							iconClass: "icon_status_email_sent"
						});
						break;


					case "form":

						switch (specifics.append_form) {

							case "append":
								destinationMessage = lang.formAppendDestinationMessage;
								break;

							case "overwrite":
								destinationMessage = lang.formOverwriteDestinationMessage;
								_.extend( helperData, {
									primaryData2:  lang.formOverwriteDestinationMessage2
								});
								break;

							case "update":
								destinationMessage = lang.formUpdateDestinationMessage;
								break;
						}


						helperData = _.extend( helperData, {
							primaryIsLink:false,
							dualRows: false,
							destinationMessage: destinationMessage,
							primaryData: outputData.rows_affected,
							iconClass: "mime_form"
						});

						break;


					case "server":
						helperData = _.extend( helperData, {
							primaryIsLink: false,
							dualRows: false,
							destinationMessage: lang.serverDestinationMessage,
							iconClass: "icon_status_ftp_server"
						});
						break;


					case "ftp":
						helperData = _.extend( helperData, {
							primaryIsLink: false,
							destinationMessage: lang.ftpDestinationMessage,
							dualRows: false,
							iconClass: "icon_status_ftp_server"
						});
						break;


					case "workflow":

						primaryNode = this.options.primaryNode; // The dataID of the original WF map
						secondaryNode = this.options.secondaryNode;  // The workID that was initiated

						helperData = _.extend( helperData, {
							primaryIsLink: false,
							dualRows: specifics.workflow_attach_output,
							destinationMessage: lang.workflowDestinationMessage,
							primaryData: specifics.workflow_title
						});
						if (specifics.workflow_attach_output === true) {
							helperData = _.extend( helperData, {
								secondaryNodeURL: NodeLinks.getUrl(secondaryNode),
								secondaryNodeInfo: lang.workflowAttachmentMessage,
								secondaryData: lang.attachments
							});
						}
						break;


					default:
						console.warn(lang.unknownWebReportDestination + destination_data.output_destination);
						break;
				}

			}


			return helperData;
		},


		onRender: function() {
			var primaryIconView,
				secondaryIconView,
				primaryIcon,
				secondaryIcon,
				destinationModel = this.options.destinationModel,
				specifics = destinationModel.get("destination_specific"),
				useConversion = destinationModel.get("use_conversion_engine"),
				rib = destinationModel.get("run_in_background");


			if (!rib && !useConversion) {
				switch (destinationModel.get("output_destination").toLowerCase()) {

					case "node":
						primaryIconView = new NodeTypeIconView({node: this.options.primaryNode});
						primaryIcon = primaryIconView.render();
						this.ui.iconContainer.prepend(primaryIcon.$el);
						if (_.has(specifics, "export_type") && specifics.export_type.toLowerCase() === "node") {

							secondaryIconView = new NodeTypeIconView({node: this.options.secondaryNode});
							secondaryIcon = secondaryIconView.render();
							this.ui.secondaryContainer.prepend(secondaryIcon.$el);

						}

						break;

					case "workflow":
						primaryIconView = new NodeTypeIconView({node: this.options.primaryNode});
						primaryIcon = primaryIconView.render();
						this.ui.iconContainer.prepend(primaryIcon.$el);

						if (destinationModel.get("destination_specific").workflow_attach_output === true) {
							secondaryIconView = new NodeTypeIconView({node: this.options.wfAttachmentsNode}),
								secondaryIcon = secondaryIconView.render();
							this.ui.secondaryContainer.prepend(secondaryIcon.$el);
						}

						break;

				}

			}

		}

	});

	return statusScreenView;
	
});