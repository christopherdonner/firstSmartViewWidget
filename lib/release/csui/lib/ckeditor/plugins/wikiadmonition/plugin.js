CKEDITOR.plugins.add( 'wikiadmonition',
{
	requires : [ 'richcombo' ],
    lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn',
	init : function( editor )
	{
        var wikiadmonitionIconPath = editor.config.supportPath + '/wiki/ckeditor/plugins/wikiadmonition/';
		var wikiAdLang = editor.lang.wikiadmonition.langwikiAd;
		var comboOptions = 
		{
			'Note' : '<table class="specialnote"><TR FRAME="VOID"><TD ALIGN="LEFT" VALIGN="TOP"><P><IMG src="'+ wikiadmonitionIconPath + 'pi_note.gif" alt="'+wikiAdLang.Note+'"></P></TD><TD ALIGN="LEFT"><P><B>'+ wikiAdLang.Note +':  </B><BR>'+wikiAdLang.ReplaceThis +'</P></TD></TR></table>',
			'Caution' : '<table class="specialnote"><TR FRAME="VOID"><TD ALIGN="LEFT" VALIGN="TOP"><P><IMG src="'+ wikiadmonitionIconPath +'pi_caution.gif" alt="'+wikiAdLang.Caution+'"></P></TD><TD ALIGN="LEFT" ><P><B>' + wikiAdLang.Caution +': </B><BR>'+wikiAdLang.ReplaceThis +'</P></TD></TR></table>',
			'Warning' : '<table class="specialnote"><TR FRAME="VOID"><TD ALIGN="LEFT" VALIGN="TOP"><P><IMG src="'+ wikiadmonitionIconPath +'pi_warning.gif" alt="'+wikiAdLang.Warning+'"></P></TD><TD ALIGN="LEFT"><P><B>' + wikiAdLang.Warning +': </B><BR><B>'+wikiAdLang.ReplaceThis +'</B></P></TD></TR></table>',
			'Important' : '<table class="specialnote"><TR FRAME="VOID"><TD ALIGN="LEFT" VALIGN="TOP"><P><IMG src="'+ wikiadmonitionIconPath +'pi_important.gif" alt="'+wikiAdLang.Important+'"></P></TD><TD ALIGN="LEFT" ><P><B>'+ wikiAdLang.Important +': </B><BR>'+wikiAdLang.ReplaceThis +'</P></TD></TR></table>',
			'Tip' : '<table class="specialnote"><TR FRAME="VOID"><TD ALIGN="LEFT" VALIGN="TOP"><P><IMG src="'+ wikiadmonitionIconPath +'pi_tip.gif" alt="'+wikiAdLang.Tip+'"></P></TD><TD ALIGN="LEFT"><P><B>'+ wikiAdLang.Tip +': </B><BR>'+wikiAdLang.ReplaceThis +'</P></TD></TR></table>'
		};
		
		editor.ui.addRichCombo( 'WikiAdmonition',
		{
			label : wikiAdLang.Note,
			title : wikiAdLang.Title,
			multiSelect : false,
			width : 0,
			
			panel :
			{
				css: [ CKEDITOR.skin.getPath( 'editor' ) ].concat( editor.config.contentsCss )
			},
			
			init : function()
			{
				for ( var i in comboOptions )
				{
					//this.add( 'value', 'html', 'text' );
					var j = "wikiAdLang." + i;
					//this.add( i, i, i );
					this.add( i, eval(j), eval(j) );
				}
				this.setValue( 'Note', 'Note' );
			},
			
			onClick : function( value )
			{
				editor.focus();
				
				var comboSelectedHtml = comboOptions[ value ];
				var editorSelectedText = '';
				var selection = editor.getSelection();
				
				if ( CKEDITOR.env.ie )
				{
					selection.unlock( true );
					//commenting below to fix Wiki-565
					//editorSelectedText = selection.getNative().createRange().text;
					editorSelectedText = selection.getNative();
				}
				else
				{
					editorSelectedText = selection.getNative();
				}

				if ( editorSelectedText != 'undefined' && editorSelectedText != '' )
				{
					comboSelectedHtml = comboSelectedHtml.replace( wikiAdLang.ReplaceThis, editorSelectedText );
				}
				
				editor.insertHtml( comboSelectedHtml );
			}
		});
	}
});