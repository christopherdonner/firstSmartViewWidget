CKEDITOR.plugins.add( 'wikilink',
{
	requires : 'dialog' ,
	lang :  'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn',
	
	init : function( editor )
	{
		var pluginName = 'wikilink';
		editor.addCommand( pluginName, new CKEDITOR.dialogCommand( pluginName ) );
		editor.ui.addButton( 'WikiLink',
		{

			label : editor.lang.wikilink.langWikiLink.label,
			command : pluginName,
			icon : this.path + 'wikilink.gif',
			langWikiLink:editor.lang.wikilink.langWikiLink
		});
		CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/wikilink.js' );
	},
	onBrowseReturn : function( nodeId, nodeName )
	{
		var wikilinkDialog = CKEDITOR.dialog.getCurrent();
		wikilinkDialog._.contents.info.csObjectId.setValue( nodeId );
		wikilinkDialog._.contents.info.csObjectName.setValue( nodeName );
	}
});








