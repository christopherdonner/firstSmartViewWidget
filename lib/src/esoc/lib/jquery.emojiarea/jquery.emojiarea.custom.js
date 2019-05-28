/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/**
 * emojiarea - A rich textarea control that supports emojis, WYSIWYG-style.
 * Copyright (c) 2012 DIY Co
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@diy.org>
 */
define(['module', 'csui/lib/jquery', 'i18n'],
    function (module, $, i18n) {
        (function ($, window, document) {

            var ELEMENT_NODE = 1;
            var TEXT_NODE = 3;
            var TAGS_BLOCK = ['p', 'div', 'pre', 'form'];
            var KEY_ESC = 27;
            var KEY_TAB = 9;

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            $.emojiarea = {
                path: '',
                util: {},
                icons: {},
                widget: '',
                defaults: {
                    button: null,
                    buttonLabel: 'Emojis',
                    buttonPosition: 'after'
                }
            };

            $.fn.emojiarea = function (options) {
                $.emojiarea.path = options.path;
                $.emojiarea.widget = options.widget;
                options = $.extend({}, $.emojiarea.defaults, options);
                return this.each(function () {
                    var $textarea = $(this);
                    if ('contentEditable' in document.body && options.wysiwyg !== false) {
                        new EmojiArea_WYSIWYG($textarea, options);
                    } else {
                        new EmojiArea_Plain($textarea, options);
                    }
                });
            };

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            var util = {};

            util.restoreSelection = (function () {
                if (window.getSelection) {
                    return function (savedSelection) {
                        var sel = window.getSelection();
                        sel.removeAllRanges();
                        for (var i = 0, len = savedSelection.length; i < len; ++i) {
                            sel.addRange(savedSelection[i]);
                        }
                    };
                } else if (document.selection && document.selection.createRange) {
                    return function (savedSelection) {
                        if (savedSelection) {
                            savedSelection.select();
                        }
                    };
                }
            })();

            util.saveSelection = (function () {
                if (window.getSelection) {
                    return function () {
                        var sel = window.getSelection(), ranges = [];
                        if (sel.rangeCount) {
                            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                                ranges.push(sel.getRangeAt(i));
                            }
                        }
                        return ranges;
                    };
                } else if (document.selection && document.selection.createRange) {
                    return function () {
                        var sel = document.selection;
                        return (sel.type.toLowerCase() !== 'none') ? sel.createRange() : null;
                    };
                }
            })();

            util.replaceSelection = (function () {
                if (window.getSelection) {
                    return function (content) {
                        var range, sel = window.getSelection();
                        var node = typeof content === 'string' ? document.createTextNode(content) : content;
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            //range.insertNode(document.createTextNode(' '));
                            range.insertNode(node);
                            range.setStart(node, 0);

                            window.setTimeout(function () {
                                range = document.createRange();
                                range.setStartAfter(node);
                                range.collapse(true);
                                sel.removeAllRanges();
                                sel.addRange(range);
                            }, 0);
                        }
                    }
                } else if (document.selection && document.selection.createRange) {
                    return function (content) {
                        var range = document.selection.createRange();
                        if (typeof content === 'string') {
                            range.text = content;
                        } else {
                            range.pasteHTML(content.outerHTML);
                        }
                    }
                }
            })();

            util.insertAtCursor = function (text, el) {
                text = ' ' + text;
                var val = el.value, endIndex, startIndex, range;
                if (typeof el.selectionStart != 'undefined' && typeof el.selectionEnd != 'undefined') {
                    startIndex = el.selectionStart;
                    endIndex = el.selectionEnd;
                    el.value = val.substring(0, startIndex) + text + val.substring(el.selectionEnd);
                    el.selectionStart = el.selectionEnd = startIndex + text.length;
                } else if (typeof document.selection != 'undefined' &&
                    typeof document.selection.createRange != 'undefined') {
                    el.focus();
                    range = document.selection.createRange();
                    range.text = text;
                    range.select();
                }
            };

            util.extend = function (a, b) {
                if (typeof a === 'undefined' || !a) {
                    a = {};
                }
                if (typeof b === 'object') {
                    for (var key in b) {
                        if (b.hasOwnProperty(key)) {
                            a[key] = b[key];
                        }
                    }
                }
                return a;
            };

            util.escapeRegex = function (str) {
                return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            };

            util.htmlEntities = function (str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
                    '&gt;').replace(/"/g, '&quot;');
            };

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            var EmojiArea = function () {
            };

            EmojiArea.prototype.setup = function () {
                var self = this;

                this.$editor.on('focus', function () {
                    self.hasFocus = true;
                });
                this.$editor.on('blur', function () {
                    self.hasFocus = false;
                });

                this.setupButton();
            };

            EmojiArea.prototype.setupButton = function () {
                var self = this;
                var $button;

                if (this.options.button) {
                    $button = $(this.options.button);
                } else if (this.options.button !== false) {
                    $button = $('<a href="javascript:void(0)">');
                    $button.html(this.options.buttonLabel);
                    $button.addClass('emoji-button');
                    $button.attr({title: this.options.buttonLabel});
                    this.$editor[this.options.buttonPosition]($button);
                } else {
                    $button = $('');
                }

                $button.on('click', function (e) {
                    EmojiMenu.show(self);
                });

                this.$button = $button;
            };

            EmojiArea.createIcon = function (emoji) {
                var filename = $.emojiarea.icons[emoji];
                var path = $.emojiarea.path || '';
                if (path.length && path.charAt(path.length - 1) !== '/') {
                    path += '/';
                }
                var emojiTitle = $.emojiarea.iconsTitle;
                var iconTitle = emojiTitle[emoji];
                var imageIcon = $("<img/>");
                imageIcon.attr("src", (path + filename));
                imageIcon.attr("title", util.htmlEntities(iconTitle));
                imageIcon.attr("alt", util.htmlEntities(emoji));
                return imageIcon.prop("outerHTML");
            };

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            /**
             * Editor (plain-text)
             *
             * @constructor
             * @param {object} $textarea
             * @param {object} options
             */

            var EmojiArea_Plain = function ($textarea, options) {
                this.options = options;
                this.$textarea = $textarea;
                this.$editor = $textarea;
                this.setup();
            };

            EmojiArea_Plain.prototype.insert = function (emoji) {
                if (!$.emojiarea.icons.hasOwnProperty(emoji)) {
                    return;
                }
                util.insertAtCursor(emoji, this.$textarea[0]);
                this.$textarea.trigger('change');
            };

            EmojiArea_Plain.prototype.val = function () {
                return this.$textarea.val();
            };

            util.extend(EmojiArea_Plain.prototype, EmojiArea.prototype);

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            /**
             * Editor (rich)
             *
             * @constructor
             * @param {object} $textarea
             * @param {object} options
             */

            var EmojiArea_WYSIWYG = function ($textarea, options) {
                var self = this;

                this.options = options;
                this.$textarea = $textarea;
                this.$editor = $('<div>').addClass('emoji-wysiwyg-editor');
                this.$editor.text($textarea.val());
                this.$editor.attr({contenteditable: 'true'});
                this.$editor.on('blur keydown keyup paste', function (e) {
                    if (e.originalEvent && e.originalEvent.type === 'paste') {
                        if (window.clipboardData && window.getSelection) {
                            var range = window.getSelection().getRangeAt(0);
                            if (range.endOffset - range.startOffset > 0) {
                                range.deleteContents();
                            }
                        }
                    }
                    return self.onChange.apply(self, arguments);
                });

                //for scrolling inside the textarea using mousewheel
                this.$editor.on('wheel', function (e) {

                    if (e.originalEvent.deltaY > 0) {
                        //scroll down
                        self.$editor.animate({scrollTop: '+=100px'}, 10);

                    } else {
                        //scroll up
                        self.$editor.animate({scrollTop: '-=100px'}, 10);
                    }
                    //prevent page fom scrolling
                    return false;
                });

                if (navigator.appVersion && navigator.appVersion.indexOf("MSIE 10") === -1) {
                    this.$editor.on('mousedown focus keydown', function () {
                        document.execCommand("AutoUrlDetect", false, false);
                        document.execCommand('enableObjectResizing', false, false);
                    });
                    this.$editor.on('blur', function () {
                        document.execCommand('enableObjectResizing', true, true);
                    });
                }

                var html = this.$editor.text(),
                    spanRegEx = /<span data-userid=.*?>\(@.*?\)<\/span>/gi,
                    userNamematch = html.match(spanRegEx),
                    emojis = $.emojiarea.icons;
                for (var key in emojis) {
                    if (emojis.hasOwnProperty(key)) {
                        html = html.replace(new RegExp(util.escapeRegex(key), 'g'),
                            EmojiArea.createIcon(key));
                    }
                }
                var matches = html.match(spanRegEx);
                if (matches !== null && matches.length > 0) {
                    for (var ids in matches) {
                        html = html.replace(matches[ids], userNamematch[ids]);
                    }
                }
                this.$editor.html(html);

                $textarea.hide().after(this.$editor);

                this.setup();
                $(document.body).on('mousedown touchstart keyup', function () {
                    if (self.hasFocus) {
                        self.selection = util.saveSelection();
                    }
                });
            };
            EmojiArea_WYSIWYG.prototype.onChange = function (e) {
                this.$textarea.val(this.val(e)).trigger('change');
            };

            EmojiArea_WYSIWYG.prototype.insert = function (emoji) {
                var content;
                var $img = $(EmojiArea.createIcon(emoji));
                $img.attr("tabindex", -1);
                if ($img[0].attachEvent) {
                    $img[0].attachEvent('onresizestart', function (e) {
                        e.returnValue = false;
                    }, false);
                }

                if (this.selection) {
                    util.restoreSelection(this.selection);
                }
                try {
                    util.replaceSelection($img[0]);
                } catch (e) {
                }
                this.onChange();
                $("#esoc-social-comment-container").find(".esoc-social-comment-list-item").removeClass(
                    "esoc-edit-init-min-height");
            };

            EmojiArea_WYSIWYG.prototype.val = function (e) {
                var lines = [];
                var line = [];

                var flush = function () {
                    lines.push(line.join(''));
                    line = [];
                };

                var sanitizeNode = function (node, event) {
                    if (node.nodeType === TEXT_NODE) {
                        line.push(node.nodeValue);
                    } else if (node.nodeType === ELEMENT_NODE) {
                        var tagName = node.tagName.toLowerCase();
                        var isBlock = TAGS_BLOCK.indexOf(tagName) !== -1;

                        if (isBlock && line.length) {
                            flush();
                        }

                        if (tagName === 'input') {
                            if (!event) {
                                var alt = node.value || '';
                                if (alt) {
                                    line.push(alt);
                                }
                            } else {
                                if (event.keyCode != 8) {
                                    var alt = node.value || '';
                                    if (alt) {
                                        line.push(alt);
                                    }
                                }
                            }
                            return;
                        }

                        if (tagName === 'img') {
                            var alt = node.getAttribute('alt') || '';
                            if (alt) {
                                line.push(alt);
                            }
                            return;
                        } else if (tagName === 'br') {
                            flush();
                        } else if (navigator.appVersion && navigator.appVersion.indexOf("MSIE 10") === -1 &&
                            tagName === 'p' && !node.hasChildNodes()) {
                            flush();
                        }

                        var children = node.childNodes;
                        for (var i = 0; i < children.length; i++) {
                            sanitizeNode(children[i], event);
                        }

                        if (isBlock && line.length) {
                            flush();
                        }
                    }
                };

                var children = this.$editor[0].childNodes;
                for (var i = 0; i < children.length; i++) {
                    sanitizeNode(children[i], e);
                }

                if (line.length) {
                    flush();
                }

                return lines.join('\n');
            };

            util.extend(EmojiArea_WYSIWYG.prototype, EmojiArea.prototype);

            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

            /**
             * Emoji Dropdown Menu
             *
             * @constructor
             * @param {object} emojiarea
             */
            var EmojiMenu = function () {
                var self = this;
                var $body = $(document.body);
                var $window = $(window);

                this.visible = false;
                this.emojiarea = null;
                this.$menu = $('<div>');
                this.$menu.addClass('binf-popover binf-bottom emoji-menu');
                this.$menu.hide();
                $('<div class="binf-arrow"></div>').appendTo(this.$menu);
                this.$items = $('<div class="myemoji">').appendTo(this.$menu);

                //$body.append(this.$menu);
                $("#esoc-social-comment-container").append();

                $.emojiarea.widget.off('keydown').on('keydown',
                    function (e) {
                        var emojiButton = self.emojiarea ? self.emojiarea.$button : '';
                        if (e.keyCode === KEY_ESC || e.keyCode === KEY_TAB) {
                            self.hide();
                            if (!!emojiButton) {
                                emojiButton.focus();
                            }
                        }
                    });
                $.emojiarea.widget.off('mouseup').on('mouseup',
                    function (e) {
                        if ($(e.target).parents(".esoc-social-attachment-popover").length === 0) {
                            if (self.visible === true) {
                                self.hide();
                            }
                        } else {
                            if (self.visible === true) {
                                self.hide();
                            }
                        }
                    });

                $window.off('resize').on('resize', function () {
                    if (self.visible) {
                        self.reposition();
                    }
                });

                this.$menu.on('mouseup', 'a', function (e) {
                    e.stopPropagation();
                    return false;
                });

                this.$items.on('keydown', function (e) {
                    switch (e.which) {
                        case $.ui.keyCode.LEFT:
                            if (!!e.target.previousSibling) {
                                e.target.previousSibling.focus();
                            }
                            e.preventDefault();
                            break;

                        case $.ui.keyCode.UP:
                            if (!!$(e.target).prevAll().eq(4)) {//Honor number of emoticons displayed per line(0-4)
                                $(e.target).prevAll().eq(4).focus();
                            }
                            e.preventDefault();
                            break;

                        case $.ui.keyCode.RIGHT:
                            if (!!e.target.nextSibling) {
                                e.target.nextSibling.focus();
                            }
                            e.preventDefault();
                            break;

                        case $.ui.keyCode.DOWN:
                            if (!!$(e.target).nextAll().eq(4)) {//Honor number of emoticons displayed per line(0-4)
                                $(e.target).nextAll().eq(4).focus();
                            }
                            e.preventDefault();
                            break;
                        case $.ui.keyCode.ESCAPE:
                            self.emojiarea.$button[0].focus();
                            if (self.emojiarea.options && self.emojiarea.options.util) {
                                self.emojiarea.options.util.emojiObj = self;
                            }
                            e.preventDefault();
                            e.stopPropagation();
                        default:
                            return; // allow other keys to be handled
                    }
                });

                this.$menu.on('click keydown', 'a', function (e) {
                    if (e.type === 'click' || (e.keyCode || e.which) === 32) {
                        var emoji = $('.binf-label', $(this)).text();
                        window.setTimeout(function () {
                            self.onItemSelected.apply(self, [emoji]);
                        }, 0);
                        e.stopPropagation();
                        return false;
                    }
                });

                this.load();
            };

            EmojiMenu.prototype.onItemSelected = function (emoji) {
                this.emojiarea.insert(emoji);
                this.emojiarea.$editor[0].focus();
                this.hide();
            };

            EmojiMenu.prototype.load = function () {
                var html = [];
                var options = $.emojiarea.icons;
                var emojiTitle = $.emojiarea.iconsTitle;
                var path = $.emojiarea.path;
                if (path.length && path.charAt(path.length - 1) !== '/') {
                    path += '/';
                }
                //html.push(' <div class="emoji-arrow-up"></div>');
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        var iconTitle = emojiTitle[key];
                        html.push('<a href="javascript:void(0)" title="' + iconTitle + '">' +
                            EmojiArea.createIcon(key) + '<span class="binf-label">' +
                            util.htmlEntities(key) + '</span></a>');
                    }
                }

                this.$items.html(html.join(''));
            };

            EmojiMenu.prototype.reposition = function () {
                if (this.emojiarea !== null && this.emojiarea.options !== undefined &&
                    $(this.emojiarea.options.parent).find(".emoji-menu").length === 0) {
                    this.emojiarea.options.parent.append(this.$menu);
                }

                if (this.emojiarea !== null) {
                    var $button = this.emojiarea.$button;
                    var position = $button.position();
                    if (!!this.emojiarea.options.container) {
                        var buttonHeight = this.emojiarea.$button.outerHeight(),
                            containerHeight = this.emojiarea.options.container.offset().top,
                            emojiHeight = this.emojiarea.$button.offset().top,
                            emojiAreaLength = this.$menu.height();
                        // align pop-up menu in the top
                        if (emojiHeight - containerHeight > emojiAreaLength + buttonHeight) {
                            position.top = $button.outerHeight() - (emojiAreaLength + buttonHeight / 2);
                            //removing previously added class
                            this.$menu.removeClass('binf-bottom');
                            this.$menu.addClass('binf-top');
                        }
                        // align pop-up menu in the bottom (default)
                        else {
                            //removing previously added class
                            this.$menu.removeClass('binf-top');
                            this.$menu.addClass('binf-bottom');
                            position.top += $button.outerHeight();
                        }
                    }
                    // if the container is not provided alignment.(default i.e., bottom)
                    else {
                        position.top += $button.outerHeight();
                    }
                    position.left += Math.round($button.outerWidth() / 2);
                    if (i18n.settings.rtl) {
                        var right = $button.parent().outerWidth() - position.left;
                        this.$menu.css({
                            top: position.top,
                            right: right
                        });
                    }
                    else {
                        this.$menu.css({
                            top: position.top,
                            left: position.left
                        });
                    }

                }
            };

            EmojiMenu.prototype.hide = function (callback) {
                var util;
                if (this.emojiarea) {
                    util = this.emojiarea.options.util;
                    isStatus = this.emojiarea.options.isStatus;
                    this.emojiarea.menu = null;
                    this.emojiarea.$button.removeClass('on');
                    this.emojiarea = null;
                }
                //this.visible = false;
                //this.$menu.hide(100);
                this.$menu.remove();
                $(".esoc-social-comment-dialog-minheight").removeClass(
                    "esoc-social-comment-dialog-minheight");
                if (!isStatus) {
                    if (!!util) {
                        util.setCommentDialogPointer();
                    }
                }
                new myfunc();
            };

            EmojiMenu.prototype.show = function (emojiarea) {
                if (this.emojiarea && this.emojiarea === emojiarea) {
                    return;
                }
                this.emojiarea = emojiarea;
                this.emojiarea.menu = this;

                this.reposition();
                this.$menu.show();
                this.$menu.find('a:first').focus();
                this.visible = true;
            };

            var myfunc = function () {
                EmojiMenu.show = (function () {
                    var menu = null;
                    return function (emojiarea) {
                        menu = menu || new EmojiMenu();
                        menu.show(emojiarea);
                    };
                })();
            };
            new myfunc();

        })($, window, document);
        return $;
    });
