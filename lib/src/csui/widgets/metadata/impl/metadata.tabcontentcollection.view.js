/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.contents.view',
    'csui/utils/base'
], function(_, TabContentCollectionView, base) {

    var MetadataTabContentCollectionView = TabContentCollectionView.extend({

        constructor: function MetadataTabContentCollectionView(attributes, options) {
            TabContentCollectionView.prototype.constructor.apply(this, arguments);
            _.extend(this, {
                currentlyFocusedElement: function(event) {
                    var reverseDirection = event && event.shiftKey;
                    var elToFocus = this.currentlyFocusedElementInternal(event);
                    var totalElements = this.keyboardBehavior.tabableElements.length;
                    var cursor =  (reverseDirection ? totalElements - 1 : 0);
                    while(!base.isElementVisibleInParent(elToFocus, this.$el, 1, 1) && 
                            cursor >= 0 && cursor < totalElements) { 
                        event.elementCursor = cursor = cursor  + (reverseDirection ? -1 : 1);
                        elToFocus = this.currentlyFocusedElementInternal(event);
                    }
                    return elToFocus;
                }
            });
        }
    });

    return  MetadataTabContentCollectionView;
});