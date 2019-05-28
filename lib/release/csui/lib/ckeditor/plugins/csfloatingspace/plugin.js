/**
 * Default out of the box floating plugin (namely 'floaingspace') floats based on it's
 * scrollable parent, and it's offset(X,Y) are different from smartUI's perfect scrollbar's
 * offset(X,Y).
 * In this case, it's parent element's offset(X,Y) should be considered.
 *
 * Second customization is, prevented hiding toolbar upon blur from the editor.
 */

(function () {
  var win      = CKEDITOR.document.getWindow(),
      pixelate = CKEDITOR.tools.cssLength,
      floatSpaces = [];

  CKEDITOR.plugins.add('csfloatingspace', {
    init: function (editor) {
      // get it's actual parent element.
      if (!!CKEDITOR.config.floatingWrapper && CKEDITOR.config.floatingWrapper.length > 0) {
        var editorGrandParent = CKEDITOR.config.floatingWrapper[0];
        editor.floatingWrapper = CKEDITOR.dom.node(editorGrandParent) || undefined;
      }

      editor.on('loaded', function () {
        attach(this);
      }, null, null, 20);
    }
  });

  function scrollOffset(side) {
    var pageOffset      = side == 'left' ? 'pageXOffset' : 'pageYOffset',
        docScrollOffset = side == 'left' ? 'scrollLeft' : 'scrollTop';

    return (pageOffset in win.$) ? win.$[pageOffset] :
           CKEDITOR.document.$.documentElement[docScrollOffset];
  }

  function attach(editor) {
    var config  = editor.config,

        // Get the HTML for the predefined spaces.
        topHtml = editor.fire('uiSpace', {space: 'top', html: ''}).html,

        // Re-positioning of the space.
        layout  = (function () {
          // Mode indicates the vertical aligning mode.
          var mode, editable,
              spaceRect, editorRect, viewRect, spaceHeight, pageScrollX,

              // Allow minor adjustments of the float space from custom configs.
              dockedOffsetX = config.floatSpaceDockedOffsetX || 0,
              dockedOffsetY = config.floatSpaceDockedOffsetY || 0,
              pinnedOffsetX = config.floatSpacePinnedOffsetX || 0,
              pinnedOffsetY = config.floatSpacePinnedOffsetY || 0;

          // Update the float space position.
          function updatePos(pos, prop, val) {
            floatSpace.setStyle(prop, pixelate(val));
            floatSpace.setStyle('position', pos);
          }

          // Change the current mode and update float space position accordingly.
          function changeMode(newMode) {

            var editorPos = editable.getDocumentPosition();

            switch (newMode) {
            case 'top':
              updatePos('absolute', 'top', editorPos.y - spaceHeight - dockedOffsetY);
              break;
            case 'pin':
              updatePos('fixed', 'top', pinnedOffsetY);
              break;
            case 'bottom':
              updatePos('absolute', 'top', editorPos.y + (editorRect.height || editorRect.bottom -
                                                                               editorRect.top) + dockedOffsetY);
              break;
            }

            mode = newMode;
          }

          return function (evt) {
            var floatingEle = !!editor.floatingWrapper ? editor.floatingWrapper : editor.editable();
            if (!(editable = floatingEle)) {
              return;
            }

            var show = (evt && evt.name == 'focus');

            // Show up the space on focus gain.
            if (show) {
              floatSpace.show();
            }

            editor.fire('floatingSpaceLayout', {show: show});

            // Reset the horizontal position for below measurement.
            floatSpace.removeStyle('left');
            floatSpace.removeStyle('right');

            // Compute the screen position from the TextRectangle object would
            // be very simple, even though the "width"/"height" property is not
            // available for all, it's safe to figure that out from the rest.

            // http://help.dottoro.com/ljgupwlp.php
            spaceRect = floatSpace.getClientRect();
            editorRect = editable.getClientRect();
            viewRect = win.getViewPaneSize();
            spaceHeight = spaceRect.height;
            pageScrollX = scrollOffset('left');

            // We initialize it as pin mode.
            if (!mode) {
              mode = 'pin';
              changeMode('pin');
              // Call for a refresh to the actual layout.
              layout(evt);
              return;
            }

            if (spaceHeight + dockedOffsetY <= editorRect.top) {
              changeMode('top');
            } else if (spaceHeight + dockedOffsetY > viewRect.height - editorRect.bottom) {
              changeMode('pin');
            } else {
              changeMode('bottom');
            }

            var mid = viewRect.width / 2,
                alignSide, offset;

            if (config.floatSpacePreferRight) {
              alignSide = 'right';
            } else if (editorRect.left > 0 && editorRect.right < viewRect.width &&
                       editorRect.width > spaceRect.width) {
              alignSide = config.contentsLangDirection == 'rtl' ? 'right' : 'left';
            } else {
              alignSide = mid - editorRect.left > editorRect.right - mid ? 'left' : 'right';
            }

            if (spaceRect.width > viewRect.width) {
              alignSide = 'left';
              offset = 0;
            } else {
              if (alignSide == 'left') {
                if (editorRect.left > 0) {
                  offset = editorRect.left;
                } else {
                  offset = 0;
                }
              } else {
                if (editorRect.right < viewRect.width) {
                  offset = viewRect.width - editorRect.right;
                } else {
                  offset = 0;
                }
              }

              if (offset + spaceRect.width > viewRect.width) {
                alignSide = alignSide == 'left' ? 'right' : 'left';
                offset = 0;
              }
            }

            // Pin mode is fixed, so don't include scroll-x.
            // (https://dev.ckeditor.com/ticket/9903) For mode is "top" or "bottom", add opposite scroll-x for right-aligned space.
            var scroll = mode == 'pin' ? 0 : alignSide == 'left' ? pageScrollX : -pageScrollX;

            floatSpace.setStyle(alignSide,
                pixelate((mode == 'pin' ? pinnedOffsetX : dockedOffsetX) + offset + scroll));
          };
        })();

    if (topHtml) {
      var floatSpaceTpl = new CKEDITOR.template(
              '<div' +
              ' id="cke_{name}"' +
              ' class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' +
              CKEDITOR.env.cssClass + '"' +
              ' dir="{langDir}"' +
              ' title="' + (CKEDITOR.env.gecko ? ' ' : '') + '"' +
              ' lang="{langCode}"' +
              ' role="application"' +
              ' style="{style}"' +
              (editor.title ? ' aria-labelledby="cke_{name}_arialbl"' : ' ') +
              '>' +
              (editor.title ?
               '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : ' ') +
              '<div class="cke_inner">' +
              '<div id="{topId}" class="cke_top" role="presentation">{content}</div>' +
              '</div>' +
              '</div>'),
          floatSpace    = CKEDITOR.document.getBody().append(
              CKEDITOR.dom.element.createFromHtml(floatSpaceTpl.output({
                content: topHtml,
                id: editor.id,
                langDir: editor.lang.dir,
                langCode: editor.langCode,
                name: editor.name,
                style: 'display:none;z-index:' + (config.baseFloatZIndex - 1),
                topId: editor.ui.spaceId('top'),
                voiceLabel: editor.title
              }))),

          // Use event buffers to reduce CPU load when tons of events are fired.
          changeBuffer  = CKEDITOR.tools.eventsBuffer(500, layout),
          uiBuffer      = CKEDITOR.tools.eventsBuffer(100, layout);

      // There's no need for the floatSpace to be selectable.
      floatSpace.unselectable();

      //store multiple floatable toolbars
      floatSpaces.push(floatSpace);
      // Prevent clicking on non-buttons area of the space from blurring editor.
      floatSpace.on('mousedown', function (evt) {
        evt = evt.data;
        if (!evt.getTarget().hasAscendant('a', 1)) {
          evt.preventDefault();
        }
      });

      editor.on('focus', function (evt) {
        layout(evt);
        for ( var sibling in floatSpaces ) {
          if ( floatSpaces[sibling].type == CKEDITOR.NODE_ELEMENT &&
               !floatSpaces[sibling].equals( floatSpace ) &&
               floatSpaces[sibling].hasClass( 'cke_float' ) ) {
            floatSpaces[sibling].hide();
          } else {
            floatSpaces[sibling].show();
          }
        }

        editor.on('change', changeBuffer.input);
        win.on('scroll', uiBuffer.input);
        win.on('resize', uiBuffer.input);
      });

      editor.on('blur', function (evt) {
        layout(evt);
      });

      editor.on('destroy', function () {
        win.removeListener('scroll', uiBuffer.input);
        win.removeListener('resize', uiBuffer.input);
        floatSpace.clearCustomData();
        floatSpaces.splice(floatSpaces.indexOf(floatSpace), 1);
        floatSpace.remove();
      });

      // Handle initial focus.
      if (editor.focusManager.hasFocus) {
        floatSpace.show();
      }

      // Register this UI space to the focus manager.
      editor.focusManager.add(floatSpace, 1);
    }
  }
})();