csui.define(['csui/lib/jquery.mockjax'], function (mockjax) {

  mockjax({
    url: '//server/otcs/cs/api/v1/auth', responseTime: 50,
    responseText: {
      data: {
        "id": 1,
        "name": "jdoe",
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  });

});
