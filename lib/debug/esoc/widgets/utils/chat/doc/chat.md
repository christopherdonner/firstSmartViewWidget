#Chat	(esoc/widgets/utils/chat.view)

	Chat control provides ability to chat with other user based on the given target user information.
	As part of this control, by default chat icon displays in the given placeholder,
	upon clicking the chat icon, it tries to launch application and respective target user's
	conversation window.
	In order to customize chat icon, it also provides the ability to give customized template.
	Pulse administration setting for enabling/disabling chat, is not handled as a part of this control.
###	Example Chat Configuration:
		var context = new PageContext(),
			contentRegion = new Marionette.Region({
				el: "#placeholderId",  // placeholder where to show chat icon
			}),
			options = {
				context: context, 
				tguser: "<<user-login-name>>",  // target userName
				domain: "<<domain>>",           // Domain name with what chat is configured with
				customtemplate: customChatTemplate // handlebar template that replaces chat icon
			},
			chatView      = new ChatView(chatOptions);
		contentRegion.show(chatView);

###  getChatButton(options)

	Provides chat ability based on the given options.

#### Parameters:
`options` - Object* The options object to be sent to getChatButton method of chat.
`options.context` - Object* page context instance.
`options.placeholder` - String* placeholder from where we can initiate the chat functionality.
`options.tguser` - String* tguser (target <<user-login-name>>) to chat with.
`options.domain` - String* domain (<<domain>>) that chat is configured with.
`options.customtemplate` - hbs template instance for custom chat icon.
