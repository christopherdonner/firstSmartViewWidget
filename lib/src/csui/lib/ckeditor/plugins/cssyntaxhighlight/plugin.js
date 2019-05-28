/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

CKEDITOR.plugins.add( 'cssyntaxhighlight', {
	requires : 'dialog',
	lang : 'en,de,fr,zh-cn', // %REMOVE_LINE_CORE%
	icons : 'cssyntaxhighlight', // %REMOVE_LINE_CORE%
	init : function( editor ) {
		editor.addCommand( 'cssyntaxhighlightDialog', new CKEDITOR.dialogCommand( 'cssyntaxhighlightDialog', {
			allowedContent: 'pre[title](*)',
			requiredContent: 'pre[title](*)'
		} ) );
		editor.ui.addButton && editor.ui.addButton( 'cssyntaxhighlight',
		{
			label : editor.lang.cssyntaxhighlight.title,
			command : 'cssyntaxhighlightDialog',
			toolbar : 'insert,98'
		} );

		if ( editor.contextMenu ) {
			editor.addMenuGroup( 'cssyntaxhighlightGroup' );
			editor.addMenuItem( 'cssyntaxhighlightItem', {
				label: editor.lang.cssyntaxhighlight.contextTitle,
				icon: this.path + 'icons/syntaxhighlight.png',
				command: 'cssyntaxhighlightDialog',
				group: 'cssyntaxhighlightGroup'
			});
			editor.contextMenu.addListener( function( element ) {
				if ( element.getAscendant( 'pre', true ) ) {
					return { cssyntaxhighlightItem: CKEDITOR.TRISTATE_OFF };
				}
			});
		}

		CKEDITOR.dialog.add( 'cssyntaxhighlightDialog', this.path + 'dialogs/syntaxhighlight.js' );
	}
});

/**
 * Whether the "Hide gutter & line numbers" checkbox is checked by default in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_hideGutter = false;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_hideGutter = false;

/**
 * Whether the "Hide code controls at the top of the code block" checkbox is checked by default in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_hideControls = false;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_hideControls = false;

/**
 * Whether the "Collapse the code block by default" checkbox is checked by default in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_collapse = false;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_collapse = false;

/**
 * "Default code title" text-field default value in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_codeTitle = '';
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_codeTitle = '';

/**
 * Whether the "Show row columns in the first line" checkbox is checked by default in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_showColumns = false;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_showColumns = false;

/**
 * Whether the "Switch off line wrapping" checkbox is checked by default in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_noWrap = false;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_noWrap = false;

/**
 * "Default line count" text-field default value in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_firstLine = 0;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_firstLine = 0;

/**
 * "Enter a comma seperated lines of lines you want to highlight" text-field default value in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_highlight = null;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_highlight = null;

/**
 * "Select language" select default selection in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_lang = null;
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_lang = null;

/**
 * Default content of the "Code" textarea in the
 * cssyntaxhighlight dialog.
 *
 *		config.cs_syntaxhighlight_code = '';
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.cs_syntaxhighlight_code = '';

CKEDITOR.config.syntaxhighlighter_className = "cssyntaxhighlighter";