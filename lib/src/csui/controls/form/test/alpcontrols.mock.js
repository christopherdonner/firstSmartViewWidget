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
        responseTime: 0,
        urlParams: ['query'], // limit=10&where_type=0&where_type=1&query=fe
        response: function (settings) {
          var parameters = $.parseParam(settings.urlParams.query),
              typeFilter = _.map(parameters.where_type || [], function (type) {
                return parseInt(type, 10);
              }),
              nameFilter = (parameters.query || '').toLowerCase(),
              members = mockData.groups.concat(mockData.users),
              filteredResults = _.filter(members, function (member) {
                if (!typeFilter.length || _.contains(typeFilter, member.type)) {
                  var allNames = (member.name + (member.first_name || '') +
                                  (member.last_name || '')).toLowerCase();
                  return allNames.indexOf(nameFilter) >= 0;
                }
              }),
              limit = parseInt(parameters.limit || 10, 10),
              limitedResults = filteredResults.slice(0, limit);
          this.responseText = {
            data: limitedResults
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('/api/v1/members/([^/?]+)(\\?.*)?$'),
        responseTime: 0,
        urlParams: ['memberId', 'query'],
        response: function (settings) {
          var memberId = parseInt(settings.urlParams.memberId, 10),
              members = mockData.groups.concat(mockData.users),
              member = _.findWhere(members, {id: memberId});
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
        responseTime: 0,
        urlParams: ['memberId'],
        response: function (settings, done) {
          var memberId = parseInt(settings.urlParams.memberId, 10),
              user = _.findWhere(mockData.users, {id: memberId}),
              self = this;
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
        url: '/api/v1/nodes/2000/ancestors',
        responseTime: 0,
        responseText: [
          {
            "ancestors": [{
              "id": 2000,
              "name": "Enterprise",
              "volume_id": -2000,
              "parent_id": -1,
              "type": 141,
              "type_name": "Enterprise Workspace"
            }, {
              "id": 69544,
              "name": "Alberi - Demo Content",
              "volume_id": -2000,
              "parent_id": 2000,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68880,
              "name": "Water Management",
              "volume_id": -2000,
              "parent_id": 69544,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68333,
              "name": "Water pumps",
              "volume_id": -2000,
              "parent_id": 68880,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 240231,
              "name": "Classic 3000\/6",
              "volume_id": -2000,
              "parent_id": 68333,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 305354,
              "name": "CS16_versions_spec.pdf",
              "volume_id": -2000,
              "parent_id": 240231,
              "type": 144,
              "type_name": "Document"
            }]
          }
        ]
      }));

      mocks.push(mockjax({
        url: '/api/v1/nodes/69321/ancestors',
        responseTime: 0,
        responseText: [
          {
            "ancestors": [{
              "id": 2000,
              "name": "Enterprise",
              "volume_id": -2000,
              "parent_id": -1,
              "type": 141,
              "type_name": "Enterprise Workspace"
            }, {
              "id": 69544,
              "name": "Alberi - Demo Content",
              "volume_id": -2000,
              "parent_id": 2000,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68880,
              "name": "Water Management",
              "volume_id": -2000,
              "parent_id": 69544,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 68333,
              "name": "Water pumps",
              "volume_id": -2000,
              "parent_id": 68880,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 240231,
              "name": "Classic 3000\/6",
              "volume_id": -2000,
              "parent_id": 68333,
              "type": 0,
              "type_name": "Folder"
            }, {
              "id": 305354,
              "name": "CS16_versions_spec.pdf",
              "volume_id": -2000,
              "parent_id": 240231,
              "type": 144,
              "type_name": "Document"
            }]
          }
        ]
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
