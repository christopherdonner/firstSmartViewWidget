# ObjectListItem (controls/listitem/listitemobject.view)

  Shows a `ObjectListItem`. The `ObjectListItem` provides a simple list item, to be used in [ListView](#),
  which comprises a list of properties to fill the content of the item. The different properties 
  are shown in the picture below. All these properties are configurable through options.data and usually
  set by the list. 
  
  ![ObjectListItem Control](images/ObjectListItemProperties.png)

  All properties allow also a dynamic binding against a `Backbone.Model` given in the constructor
  as `model` parameter. There is also a way of expression binding (see below).
  
  The `date.price` and the `date.value` elements can be styled individually by setting according classes
  `priceClass` and `date.class` respectively.

  When clicked, the item throws an event `click:item`.

### Example

      var objItem = new Backbone.Model({
            id: '120001',
            name: 'Robotic Lawn Mower - HomeDep.',
            size: '1000 Items',
            categories: {
              sales_opportunity: {
                key: 'SOPP-06478',
                price: '84,500.00',
                currency: 'EUR',
                stage: '6. Create Price Proposal',
                closed_date: '09/05/2014'
              }
            }
          }),
          objLi = new ObjectListItem({
            model: objItem,
            data: {
              "date": {
                "label": "Closed Date",
                "value": "{categories.sales_opportunity.closed_date}",
                "class": {
                  "expression": "{categories.sales_opportunity.closed_date}",
                  "type": "Date",
                  "valueRanges": [
                    {
                      "lessThan": "07/01/2013",
                      "value": "cs-status-bad"
                    },
                    {
                      "lessThan": "07/01/2014",
                      "greaterOrEqual": "07/01/2013",
                      "value": "cs-status-mark"
                    },
                    {
                      "greaterOrEqual": "07/02/2014",
                      "value": "cs-status-good"
                    }
                  ]
                }
              }
            }
          });

      objLi.on("click:item", function () { alert('click:item raised')});
      objLi.render();


## Constructor Summary

### constructor(options)

  Creates a new ObjectListItem.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* to evaluate a dynamic binding.
* `options.data` - *Object* The data object.
* `options.data.icon` - *Object* A *String* or complex value giving the relative url to the icon.
* `options.data.key` - *Object* A *String* or complex value giving the key property value.
* `options.data.name` - *Object* A *String* or complex value giving the name property value.
* `options.data.size` - *Object* A *String* or complex value giving the size property value. The size value is set in parentheses 
and appended to the name value.
* `options.data.stage.label` - *Object* A *String* or complex value giving the stage.label value. It is appended a colon and precedes 
the stage.value, if set.
* `options.data.stage.value` - *Object* A *String* or complex value giving the stage.value value. It appears below the name in smaller
 font.
* `options.data.price` - *Object* A *String* or complex value giving the price value.
* `options.data.priceClass` - *Object* A *String* or complex value giving the priceClass. If set it is added to the css classes used
 to format the price.
* `options.data.priceCurrency` - *Object* A *String* or complex value giving the priceCurrency. It is set below the price, if set.
* `options.data.date.label` - *Object* A *String* or complex value giving the date label. It is set above the date.
* `options.data.date.value` - *Object* A *String* or complex value giving the date value. 
* `options.data.date.class` - *Object* A *String* or complex value giving the date class. If set it is added to the css classes used
 to format the date value.
 
 A complex value has elements
 
* `complex.expression` - *String* A constant value or a binding to a model attribute. A binding 
is of the
  form `'{<model attribute name>}'`. If the model has nested attributes, these can referred also,
   by using a dot notation `'{<model attribute name>[.<nested attribute name>]}'`.
* `complex.type` - *String* A type indicator for the expression. Currently only `'Date'` is 
evaluated. If no `type` is set, the value is treated as numeric.
* `complex.valueRanges?` *Array* Optional. An array consisting of range limitators. Each 
range limitator is of the form 


    {
        '<lessThan|greaterOrEqual>': <a constant or binding>
        ['<lessThan|greaterOrEqual>': <a constant or binding>]
        'value': <a constant or binding>
    }

The `value` is then compared with the value given in `lessThan` or `greaterOrEqual`, using `<` or
 `>=` respectively in the implementation behind, resp. a date comparison for `type: 'Date'`.
 A `lessThan` property can be combined with a `greaterOrEqual` property to indicate value ranges.

#### Returns:

  The newly created object instance.

#### Example:

  See the [ObjectListItem](#) object for an example.

## Events Summary

## click:item(event)

The event is fired if the authentication against the connection was successful.

### Parameters
* `event` - *Object* The event object


