# Facet Bar

**Module: csui/controls/facet.bar/facet.bar**

Facet bar displays a collection of facet filters that have been selected for a node container or search.

### Examples

```js
var facets = ...,
    facetBarView = new FacetBarView({
      collection: facets
    });

 this.listenTo(facetBarView, 'remove:filter', this._removeFacetFilter)
     .listenTo(facetBarView, 'remove:all', this._removeAll);
```

---

## Overview

### Constructor

#### Parameters

collection: 
: Backbone collection of facets inherited from `FacetCollection` provided by "csui/models/facets".

### Events

#### remove:filter

Triggered when a single selected facet topic is to be removed

#### remove:all

Triggered when all selected facet topics are to be removed

##### Arguments

* `filter` - *Object* Contains identifiers of facet topics to be removed.

    filter: [{id: x, values: [{id: y}]}]
