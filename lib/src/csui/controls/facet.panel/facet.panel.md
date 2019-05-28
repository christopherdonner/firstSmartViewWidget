
Facet panel displays a one level tree structure of available facet filters.

### Examples

```js
var facets = ...,
    facetView = new FacetPanelView({
      collection: facets
    });

    this.listenTo(facetView, 'apply:filter', this._addToFacetFilter);
```

---

## Overview

### Constructor

#### Parameters

collection:
: Backbone collection of facets inherited from `FacetCollection` provided by "csui/models/facets".

---

### Events

#### apply:filter

Triggered when one or more available facet topics have been selected.

##### Arguments

* `filter` - *Object* Contains facet name and id, and the facet topics that have been selected.

    filter: {
      name: "Content Type"
      id: "2666"
      values: [
        {
          id: "0"
          name: "Folder"
        }
      ]
    }
