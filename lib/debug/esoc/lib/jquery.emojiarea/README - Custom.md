Refer README.md for Jquery.emojiarea usage.

## Custom Changes ##

* For displaying arrow icon added 	html.push(' <div class="emoji-arrow-up"></div>') in the EmojiMenu.prototype.load function
* For showing custom title
. added title JSON in the emojis.js exists in the packs/custom folder
. updated the existing title code with our code like:
   	var emojiTitle = $.emojiarea.iconsTitle;
	var iconTitle = emojiTitle[key];
	set the iconTitle to the emoji image icon title
