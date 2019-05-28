/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];
  var id = 1;
  return {

    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2000/facets(.*)$'),
        responseText: {
          "facets":
          {
            'available_values':getAvailableValues(),
            'properties':getProperties(),
            'selected_values':[]
          }
        }
      }));
    },


    disable: function () {
      var mock;
      while ((mock = mocks.pop())) {
        mockjax.clear(mock);
      }
    }

  };

  function getProperties() {

    var properties = {};

    for (var j = 1; j < 3; j++) {
      properties[j] = {
        'display_priority': 50,
        'id': j,
        'items_to_show': 5,
        'name': "Content Type"
      };
    }

    return properties;
  }

  function getAvailableValues()
  {
    var availableValues = [];

    for (var j = 1; j < 3; j++) {
      var facet = {},
        facetTopics = facet[j] = [],
        i = j === 2? 5: 6;

      availableValues.push(facet);

      for (; i > 0 ; i--) {
        var topic = {"name": "Microsoft Word", "percentage": 25, "total": 70, "value": 'i'};
        facetTopics.push(topic);
      }
    }
    return availableValues;
  }
});
