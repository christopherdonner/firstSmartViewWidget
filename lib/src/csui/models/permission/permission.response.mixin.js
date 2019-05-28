/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/base'
], function (_, base) {
  'use strict';

  var PermissionResponseMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makePermissionResponse: function (options) {
          return this;
        },
        parsePermissionResponse: function (resp, options, clearEmptyPermissionModel) {
          if (!!resp.results && !!resp.results.data && !!resp.results.data.permissions &&
              !_.isEmpty(resp.results.data.permissions)) {
            var permissionsList = resp.results.data.permissions;
            if (_.isArray(permissionsList)) {
              permissionsList = _.reject(permissionsList,
                  function (child) { return (child.type === 'public' && !child.permissions); });
              var ownerData = _.find(permissionsList, function (item) {
                    return item.type === 'owner';
                  }),
                  groupData = _.find(permissionsList, function (item) {
                    return item.type === 'group';
                  });
              if ((ownerData && ownerData.permissions) && (groupData && !groupData.permissions)) {
                permissionsList = _.reject(permissionsList,
                    function (child) { return (child.type === 'group' && !child.permissions); });
              }
              if ((ownerData && !ownerData.permissions) && (groupData && groupData.permissions)) {
                permissionsList = _.reject(permissionsList,
                    function (child) { return (child.type === 'owner' && !child.permissions); });
              }
              if ((ownerData && !ownerData.permissions) && (groupData && !groupData.permissions)) {
                permissionsList = _.reject(permissionsList,
                    function (child) { return (child.type === 'group' && !child.permissions); });
              }
            } else if (_.isObject(permissionsList)) {
              permissionsList = [];
              if (resp.results.data.permissions &&
                  resp.results.data.permissions.permissions.length > 0) {
                permissionsList.push(resp.results.data.permissions);
              }
            }
            resp.results.data.permissions = permissionsList;
          }
        }
      });
    }
  };

  return PermissionResponseMixin;
});
