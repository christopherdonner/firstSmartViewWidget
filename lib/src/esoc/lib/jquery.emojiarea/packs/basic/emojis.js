/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'esoc/lib/jquery.emojiarea/jquery.emojiarea'],
    function(module, $, emojiarea) {
$.emojiarea.path = '../packs/basic';
$.emojiarea.icons = {
	':smile:'     : 'smile.png',
	':angry:'     : 'angry.png',
	':flushed:'   : 'flushed.png',
	':neckbeard:' : 'neckbeard.png',
	':laughing:'  : 'laughing.png'
};
$.emojiarea.icons1 = {
	':smile:'     : 'smile :)',
	':angry:'     : 'angry :(',
	':flushed:'   : 'flushed :|',
	':neckbeard:' : 'neckbeard :P',
	':laughing:'  : 'laughing :D'
}
});