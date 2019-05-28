async.test.utils.js
===================
usage
-----
    asyncElement(parent, selector, [interval |  removal | options])
    .done(function(el) {
      //async element
    });

#### parent:
  Element from which we are going to find the element. It can be a selector or an element

#### selector:
  Selector to find element from parent. It must be a string.

#### interval | removal | options:
  - **interval:** If you want to increase the interval of checking the element then pass numerical value as 3rd parameter.
        asyncElement(document.body, '.binf-modal', 200)
        .done(function(el) {
          //el - async element
        });

  - **removal:** If you want to check the removal of the element then pass true as 3rd parameter.
        asyncElement(document.body, '.binf-modal', true)
        .done(function() {
          //.binf-modal element not present in document.body now
        });

  - **options**: It is an object with any of the below supported values.
        {
          length: 1,
          interval: 500,
          removal: true
        }

  It is useful where we want to increase the interval and check the element  removal.

  The new option ***length*** is for waiting the selector elements to be more than the defined length. In above example function will wait until there will be more than 1 async elements found.


> Please update this md file on adding, improving or fixing any utility.
