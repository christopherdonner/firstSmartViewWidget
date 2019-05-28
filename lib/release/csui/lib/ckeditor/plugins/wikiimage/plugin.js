var WikiImage = function()
{
	this.exec = function(editor)
	{
		var configImage = editor.config.image;
		var imageDialog = window.open(configImage.url + '?func=Wiki.ImageBrowser&wikiObjId=' + configImage.wikiId + '&wikiVolumeId=-2000' ,'imageDialog',	'width=400,height=450,left=100,top=200,scrollbars=1');
	};
};

CKEDITOR.plugins.add( 'wikiimage',
{
	init : function( editor )
	{
		var pluginName = 'wikiimage';
		editor.addCommand( pluginName, new WikiImage() );
		editor.ui.addButton( 'WikiImage',
		{
			label : 'Insert Wiki Image',
			command : pluginName,
			icon : this.path + 'wikiimage.gif'
		});
	}
});