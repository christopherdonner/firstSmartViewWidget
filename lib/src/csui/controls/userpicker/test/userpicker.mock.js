/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/jquery.mockjax', 'csui/lib/jquery.binary.ajax',
  'json!./userpicker.mock.data.json', 'csui/lib/jquery.parse.param'
], function (_, $, mockjax, binaryAjax, mockData) {

  var mocks = [];

  return {

    enable: function () {
      binaryAjax.setOption({
        enabled: false,
        mocked: true
      });
      mocks.push(mockjax({
        url: new RegExp('/api/v1/members(?:\\?(.*))?$'),
        urlParams: ['query'], // limit=10&where_type=0&where_type=1&query=fe
        response: function (settings) {
          var parameters      = $.parseParam(settings.urlParams.query),
              typeFilter      = _.map(parameters.where_type || [], function (type) {
                return parseInt(type, 10);
              }),
              nameFilter      = (parameters.query || '').toLowerCase(),
              members         = mockData.groups.concat(mockData.users),
              filteredResults = _.filter(members, function (member) {
                if (!typeFilter.length || _.contains(typeFilter, member.type)) {
                  if (nameFilter) {
                    var fullName = ((member.first_name || '') + ' ' +
                                    (member.last_name || '')).toLowerCase();
                    return member.name.toLowerCase().indexOf(nameFilter) >= 0 ||
                           fullName.toLowerCase().indexOf(nameFilter) >= 0;
                  }
                  return true;
                }
              }),
              limit           = parseInt(parameters.limit || 10, 10),
              limitedResults  = filteredResults.slice(0, limit);
          this.responseText = {
            data: limitedResults
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('/api/v1/members/([^/?]+)(\\?.*)?$'),
        urlParams: ['memberId', 'query'],
        response: function (settings) {
          var memberId = parseInt(settings.urlParams.memberId, 10),
              members  = mockData.groups.concat(mockData.users),
              member   = _.findWhere(members, {id: memberId});
          if (!member) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.responseText = {
              error: 'Invalid member identifier.'
            };
            return;
          }
          this.responseText = {
            data: member
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('/api/v1/members/([^/?]+)/photo(?:\\?.*)?$'),
        urlParams: ['memberId'],
        response: function (settings, done) {
          var memberId = parseInt(settings.urlParams.memberId, 10),
              user     = _.findWhere(mockData.users, {id: memberId}),
              self     = this;
          if (!user) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.responseText = {
              error: 'Invalid member identifier.'
            };
            return done();
          }
          $.ajax({
            url: './photos/' + user.name.toLowerCase() + '.jpg',
            dataType: 'binary',
            enableBinaryTransport: true,
            success: function (response, statusText, jqxhr) {
              var reader = new FileReader();
              reader.readAsDataURL(response);
              reader.addEventListener('load', function () {
                self.responseText = reader.result;
                self.contentType = self.headers['content-type'] = response.type;
                done();
              });
            },
            error: function (jqxhr, statusText, errorText) {
              console.log(errorText);
              self.status = 404;
              self.statusText = 'Not Found';
              self.responseText = {
                error: 'Missing user picture.'
              };
              done();
            }
          });
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v2/members\\?limit=10&where_type=0&where_type=1&expand=properties{group_id,leader_id}&query=u'),
        responseTime: 0,
        type: 'GET',
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "page": 1,
              "page_total": 1,
              "range_max": 5,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members?limit=5&where_type=0&expand=properties{group_id,leader_id}&query=u",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "deleted": 0,
                  "first_name": null,
                  "gender": null,
                  "group_id": {
                    "deleted": false,
                    "id": 1456,
                    "leader_id": null,
                    "name": "UserGroup",
                    "name_formatted": "UserGroup",
                    "photo_url": "api\/v1\/members\/1001\/photo",
                    "type": 1,
                    "type_name": "Group"
                  },
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1234,
                  "last_name": null,
                  "middle_name": null,
                  "name": "user",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User",
                  "name_formatted": "user",
                  "leader_id": null
                }
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v2/members\\?limit=10&where_type=0&where_type=1&expand=properties{group_id,leader_id}&query=a'),
        responseTime: 0,
        type: 'GET',
        responseText: {
          "collection": {
            "paging": {
              "limit": 20,
              "page": 1,
              "page_total": 1,
              "range_max": 5,
              "range_min": 1,
              "total_count": 5
            }
          },
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members?limit=5&where_type=0&expand=properties{group_id,leader_id}&query=a",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": []
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
      binaryAjax.setOption({
        enabled: true,
        mocked: false
      });
    }

  };

});
