/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery'], function ($) {
  'use strict';

  // Use this method only before you attach event handlers to the element. Whatever
  // you attach to the element will be lost, except for attributes and children.
  // Based on // http://stackoverflow.com/a/9468280/1185698.

  $.fn.renameTag = function (newTagName) {
    var newElements = [];
    for (var i = 0, elementLength = this.length; i < elementLength; ++i) {
      var newElement = document.createElement(newTagName),
          elementToRename = this[i],
          attributes = elementToRename.attributes;
      for (var j = 0, attributeLength = attributes.length; j < attributeLength; ++j) {
        var attribute = attributes[j];
        newElement.setAttribute(attribute.name, attribute.value);
      };
      for (var childToMove; (childToMove = elementToRename.firstChild) !== null;) {
        newElement.appendChild(childToMove);
      }
      var parentElement = elementToRename.parentNode;
      if (parentElement) {
        parentElement.replaceChild(newElement, elementToRename);
      }
      newElements.push(newElement);
    }
    return $(newElements);
  };

  return $.fn.renameTag;
});
