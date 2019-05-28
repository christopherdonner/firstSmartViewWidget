/*
 * Extending jquery-ui auto-complete to support @, template...
 */
csui.define(['module', 'csui/lib/jquery', 'esoc/widgets/common/util', 'esoc/lib/jquery-ui'], function (module, $, CommonUtil) {

  (function ($, window, document, undefined) {
    $.widget("ui.triggeredAutocomplete", $.extend(true, {}, $.ui.autocomplete.prototype, {

      options: {
        trigger: "@",
        commonUtil: CommonUtil,
        allowDuplicates: false
      },

      _create: function () {

        var self = this;
        this.id_map = {};
        this.stopIndex = -1;
        this.stopLength = -1;
        this.contents = '';
        this.cursorPos = 0;

        /** Fixes some events improperly handled by ui.autocomplete */
        this.element.bind('keydown.autocomplete.fix', function (e) {
          switch (e.keyCode) {
          case $.ui.keyCode.ESCAPE:
            self.close(e);
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.DOWN:
            if (!self.menu.element.is(":visible")) {
              e.stopImmediatePropagation();
            }
          }
        });

        // Check for the id_map as an attribute.  This is for editing.

        var id_map_string = this.element.attr('id_map');
        if (id_map_string) {
          this.id_map = $.parseJSON(id_map_string);
        }

        this.ac = $.ui.autocomplete.prototype;
        this.ac._create.apply(this, arguments);

        this.updateHidden();

        // Select function defined via options.
        this.options.select = function (event, ui) {
          sessionStorage.removeItem("esoc-user-mentions-info");
          var contents = self.element[0].textContent;
          //Fetch the cursor position for the div
          var cursorPos = self.getCursor(contents);
          var inputPos = self.getCaretPosition(self.element[0]);
          var selectedContent = "";
          if (ui.item.id !== -1) {
            selectedContent = '(' + self.options.trigger + ui.item.id + ')';
          } else {
            selectedContent = self.options.trigger + self.userterm;
            return false;
          }
          if (typeof InstallTrigger !== 'undefined') { //Firefox
            var spanTag = $('<span />');
            spanTag.css("visibility", "hidden");
            spanTag.addClass('esoc-span-mention');
            spanTag[0].innerText = selectedContent;
            $(self.element)[0].appendChild(spanTag[0]);
            var textBoxWidth = $(spanTag[0]).width();
            $(self.element)[0].removeChild(spanTag[0]);

            var mentionedTag = $('<input />');
            mentionedTag.attr({
              id: 'data-userid',
              type: 'text',
              value: selectedContent,
              disabled: 'true'
            });
            mentionedTag.addClass('esoc-user-mention');
            mentionedTag.css("width", textBoxWidth + "px");
          }
          else { //other than Firefox
            mentionedTag = $('<input />');
            mentionedTag.attr({
              type: "button",
              value: selectedContent
            });
            mentionedTag.addClass('esoc-user-mention');
          }
          setTimeout(function () {
            if (self.options.commonUtil.globalConstants.MAX_CHAR_LIMIT <
                contents.length + selectedContent.length) {
              return false;
            }
            if (false || !!document.documentMode) { // IE
              if (self.node.nodeName === "DIV" || self.node.nodeName === 'P') {
                if (ui.item.id !== -1) {
                  self.element[0].innerHTML = self.element[0].innerHTML.substring(0,
                          (self.caretPos - self.length_of_query)) + mentionedTag[0].innerHTML +
                                              self.element[0].innerHTML.substring(self.caretPos,
                                                  self.element[0].innerHTML.length);
                  self.replaceSelection(mentionedTag[0]);
                }
              } else {
                self.replaceTextNodeWithMention(self, mentionedTag[0]);
              }
            } else { // other than IE
              self.replaceTextNodeWithMention(self, mentionedTag[0]);
            }
          }, 0);

          $(this).focus();
          $(this).trigger("input");
          return false;
        };

        this.replaceSelection = (function () {
          if (window.getSelection) {
            return function (content) {
              var range, sel = window.getSelection();
              var node = typeof content === 'string' ? document.createTextNode(content) : content;
              if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                if (typeof InstallTrigger !== 'undefined') { //Firefox
                  range.insertNode(document.createTextNode('\u00A0'));
                  range.insertNode(node);
                  range.insertNode(document.createTextNode('\u00A0'));
                } else {
                  range.insertNode(node);
                }
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

        this.replaceTextNodeWithMention = function (options, mentionTag) {
          options.node.splitText(options.index_for_split);
          if (!!options.node.nextSibling) {
            options.node.nextSibling.splitText(options.length_of_query);
            options.node.nextSibling.nodeValue = "";
          } else {
            options.node.nodeValue.splitText(options.length_of_query);
            options.node.nodeValue.nodeValue = "";
          }

          options.replaceSelection(mentionTag);
        }

        // Don't change the input as you browse the results.
        this.options.focus = function (event, ui) {
          return false;
        }
        this.options.close = function (event, ui) {
          sessionStorage.removeItem("esoc-user-mentions-info");
          return false;
        }
        this.menu.options.blur = function (event, ui) {
          return false;
        }

        // Any changes made need to update the hidden field.
        this.element.focus(function () {
          self.updateHidden();
        });
        this.element.change(function () {
          self.updateHidden();
        });
      },

      // If there is an 'img' then show it beside the label.

      _renderItem: function (ul, item) {
        if (item.id !== -1) {
          if (item.img !== undefined) {
            return $("<li></li>")
                .data("item.autocomplete", item)
                .append("<div class='ui-menu-item-wrapper'>" + "<a>" +
                        "<span class='image_user_placeholder esoc-user-mention-default-avatar'>" + item.initails + "</span><img src='esoc-user-mention-avatar" +
                        item.img + "' /><span>" + item.label + "</span></a></div>")
                .appendTo(ul);
          }
          else if (item.id !== undefined) {

            var listElement          = document.createElement('li'),
                divElement           = document.createElement('div'),
                anchorElement        = document.createElement('a'),
                defaultAvatarElement = document.createElement('span'),
                imgElement           = document.createElement('img'),
                spanElement          = document.createElement('span');

            $(listElement).attr({'class': 'ui-menu-item', 'role': 'presentation'});
            divElement.setAttribute('class', 'ui-menu-item-wrapper');
            imgElement.setAttribute('class', 'esoc-autosuggestion-img');
            spanElement.setAttribute('class', 'esoc-autosuggestion-name');
            $(spanElement).text(item.label + " (" + item.id + ")");
            defaultAvatarElement.setAttribute('class',
                'image_user_placeholder esoc-user-mention-default-avatar');
            $(defaultAvatarElement).addClass('esoc-user-default-avatar-' + item.value);
            $(defaultAvatarElement)[0].innerText = item.initials;
            $(defaultAvatarElement).css("background",item.userbackgroundcolor);
            anchorElement.appendChild(defaultAvatarElement);
            anchorElement.appendChild(imgElement);
            anchorElement.appendChild(spanElement);
            divElement.appendChild(anchorElement);
            listElement.appendChild(divElement);
            var userProfilePicOptions = {
              context: item.context,
              userid: item.value,
              photoElement: $(imgElement),
              defaultPhotElement: $(defaultAvatarElement),
              photoUrl: item.photo_url
            }
            this.options.commonUtil.setProfilePic(userProfilePicOptions);
            return $(listElement).data("item.autocomplete", item).appendTo(ul);
          }
        }
        else {
          return $("<li></li>")
              .append(
                  "<div class='ui-menu-item-wrapper'>" + "<a class='esoc-autosuggestion-text'>" +
                  item.label + "</a></div>")
              .appendTo(ul);
        }
      },

      // This stops the input box from being cleared when traversing the menu.

      _move: function (direction, event) {
        if (!this.menu.element.is(":visible")) {
          this.search(null, event);
          return;
        }
        /*if ( this.menu.first() && /^previous$/i.test(direction) ||
         this.menu.last() && /^next$/i.test(direction) ) {
         this.menu.deactivate();
         return;
         }*/
        this.menu[direction](event);
      },

      search: function (value, event) {

        var contents = this.element.html();
        var cursorPos = this.getCursor(contents);
        this.contents = contents;
        this.cursorPos = cursorPos;
        var that = this;

        // Include the character before the trigger and check that the trigger is not in the middle of a word
        // This avoids trying to match in the middle of email addresses when '@' is used as the trigger
        var inputPos = this.getCaretPosition(this.element[0]),
            query    = this.element[0].textContent.substring(0, inputPos),
            regex    = new RegExp("(^|\\s)([" + this.options.trigger + "][^\W-]*)$");
        if (query.match(/\s@/g) !== null && query.match(/\s@/g).length >= 1) {
          var re = new RegExp(/\s@/g);
          var termIndex = 0, matchString;
          while ((matchString = re.exec(query)) != null) {
            termIndex = matchString.index;
          }
          query = query.substring(termIndex, query.length);
        }
        var result = regex.exec(query);

        if (result && result[2]) {
          // Get the characters following the trigger and before the cursor position.
          // Get the contents up to the cursortPos first then get the lastIndexOf the trigger to find the search term.

          contents = query.substring(0, inputPos);
          /*if(result[2].match(/\@@/g)){
              result[2] = result[2].substring(1, result[2].length);
          }*/
          var term = result[2].substring(1, result[2].length).toLowerCase();
          this.length_of_query = term.length + this.options.trigger.length;
          var range = "";
          setTimeout(function () {
            if (window.getSelection && window.getSelection().getRangeAt) {
              range = window.getSelection().getRangeAt(0);
            } else if (document.selection && document.selection.createRange) {
              range = document.selection.createRange();
            }
            that.node = range.startContainer;
            if (false || !!document.documentMode) { // IE
              if (that.node.nodeName === 'DIV' || that.node.nodeName === 'P') {
                var cursorPosition = that.getCaretPosition(that.node);
                that.index_for_split = cursorPosition - that.length_of_query;
                that.nodeCurPos = that.insertNodeAtCaret(that.node,
                    document.createTextNode('\u0001'));
                that.caretPos = that.insertNodeAtCaret(that.element[0],
                    document.createTextNode('\u0001'));
              } else {
                that.index_for_split = range.startOffset - that.length_of_query;
              }
            } else { // other than IE
              that.index_for_split = range.startOffset - that.length_of_query;
            }
          }, 10);
          this.userterm = term;

          // Only query the server if we have a term and we haven't received a null response.
          // First check the current query to see if it already returned a null response.

          if (term.length > 0) {
            // Updates the hidden field to check if a name was removed so that we can put them back in the list.
            this.updateHidden();
            return this._search(term);
          }
          else {
            this.close();
          }
        } else {
          this.close();
        }
      },

      // Slightly altered the default ajax call to stop querying after the search produced no results.
      // This is to prevent unnecessary querying.

      _initSource: function () {
        var self = this, array, url, label;
        if ($.isArray(this.options.source)) {
          array = this.options.source;
          this.source = function (request, response) {
            response($.ui.autocomplete.filter(array, request.term));
          };
        } else if (typeof this.options.source === "string") {
          url = this.options.source;
          this.source = function (request, response) {
            if (self.xhr) {
              self.xhr.abort();
            }
            self.xhr = $.ajax({
              url: url,
              data: request,
              dataType: 'json',
              success: function (data) {
                if (data != null) {
                  response($.map(data, function (item) {
                    if (typeof item === "string") {
                      label = item;
                    }
                    else {
                      label = item.label;
                    }
                    // If the item has already been selected don't re-include it.
                    if (!self.id_map[label] || self.options.allowDuplicates) {
                      return item
                    }
                  }));
                  self.stopLength = -1;
                  self.stopIndex = -1;
                }
                else {
                  // No results, record length of string and stop querying unless the length decreases
                  self.stopLength = request.term.length;
                  self.stopIndex = self.contents.lastIndexOf(self.options.trigger);
                  self.close();
                }
              }
            });
          };
        } else {
          this.source = this.options.source;
        }
      },

      destroy: function () {
        $.Widget.prototype.destroy.call(this);
      },

      // Gets the position of the cursor in the input box.

      getCursor: function (contents) {
        var range;
        if (window.getSelection && window.getSelection().getRangeAt) {
          range = window.getSelection().getRangeAt(0);
        } else if (document.selection && document.selection.createRange) {
          range = document.selection.createRange();
        }
        var textVal = window.getSelection().focusNode.textContent;
        textVal = textVal.substring(1, range.endOffset)
        var cursorPos = contents.lastIndexOf(textVal) + textVal.length;
        return cursorPos;
      },
      insertNodeAtCaret: function (element, node) {
        var sel = window.getSelection();
        var cPosition = 0;
        if (sel.rangeCount) {
          var range = sel.getRangeAt(0);
          range.collapse(false);
          range.insertNode(node);
          range = range.cloneRange();
          range.selectNodeContents(node);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
          cPosition = element.innerHTML.indexOf("\u0001");
          node.parentNode.removeChild(node);
        }
        return cPosition;
      },
      getCaretCharacterOffset: function (element) {
        var caretOffset = 0;
        if (typeof window.getSelection !== "undefined") {
          var range = window.getSelection().getRangeAt(0);
          var preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
        } else if (typeof document.selection !== "undefined" &&
                   document.selection.type !== "Control") {
          var textRange = document.selection.createRange();
          var preCaretTextRange = document.body.createTextRange();
          preCaretTextRange.moveToElementText(element);
          preCaretTextRange.setEndPoint("EndToEnd", textRange);
          caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
      },
      // Populates the hidden field with the contents of the entry box but with
      // ID's instead of usernames.  Better for storage.

      updateHidden: function () {
        var trigger = this.options.trigger;
        var top = this.element.scrollTop();
        var contents = this.element.val();
        for (var key in this.id_map) {
          var find = trigger + key;
          find = find.replace(/[^a-zA-Z 0-9@]+/g, '\\$&');
          var regex = new RegExp(find, "g");
          var old_contents = contents;
          contents = contents.replace(regex, trigger + '[' + this.id_map[key] + ']');
          if (old_contents === contents) {
            delete this.id_map[key];
          }
        }
        $(this.options.hidden).val(contents);
        this.element.scrollTop(top);
      },
      getCharacterOffsetWithin: function (range, node) {
        var treeWalker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            function (node) {
              var nodeRange = document.createRange();
              nodeRange.selectNode(node);
              return nodeRange.compareBoundaryPoints(Range.END_TO_END, range) < 1 ?
                     NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            },
            false
        );

        var charCount = 0;
        while (treeWalker.nextNode()) {
          charCount += treeWalker.currentNode.length;
        }
        if (range.startContainer.nodeType === 3) {
          charCount += range.startOffset;
        }
        return charCount;
      },
      getCaretPosition: function (containerEl) {
        var range = window.getSelection().getRangeAt(0);
        return this.getCharacterOffsetWithin(range, containerEl);
      }
    }));
  })($, window, document);
  return $;
});
