define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        responseText: {
          data: {
            "id": 1,
            "name": "jdoe",
            "first_name": "John",
            "last_name": "Doe"
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

});
