csui.define(['module', 'csui/lib/jquery', 'esoc/lib/jquery.emojiarea/jquery.emojiarea.custom'],
    function (module, $, emojiarea) {

      $.emojiarea.icons = {
        ':)': 'smile32.svg',
        ':D': 'grin32.svg',
        ':(': 'sad32.svg',
        'x(': 'angry32.svg',
        ';)': 'wink32.svg',
        ':-o': 'surprise32.svg',
        ':p': 'tounge32.svg',
        ':-s': 'worried32.svg',
        ':-/': 'confused32.svg',
        ':/)': 'eyebrows_raised32.svg',
        '(o)': 'oops32.svg',
        '(y)': 'thumbsup32.svg',
        '(n)': 'thumbsdown32.svg',
        '(*)': 'star32.svg',
        '(c)': 'coffee_break32.svg',
        '(q)': 'question32.svg',
        '(!)': 'exclamation32.svg'
      };
      //Below json is used to set the titles to Emoji icons.
      $.emojiarea.iconsTitle = {
        ':)': 'Smile    :)',
        ':D': 'Grin    :D',
        ':(': 'Sad    :(',
        'x(': 'Angry    x(',
        ';)': 'Wink    ;)',
        ':-o': 'Surprise    :-o',
        ':p': 'Tounge    :p',
        ':-s': 'Worried    :-s',
        ':-/': 'Confused    :-/',
        ':/)': 'Raised Eyebrow   :/)',
        '(o)': 'Oops    (o)',
        '(y)': 'Thumbs Up    (y)',
        '(n)': 'Thumbs Down    (n)',
        '(*)': 'Star    (*)',
        '(c)': 'Coffee    (c)',
        '(q)': 'Question    (q)',
        '(!)': 'Exclamation    (!)'
      }
});