/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(function () {
  'use strict';

  var nodeExpands = ['original_id', 'parent_id', 'volume_id'],
      userExpands = ['create_user_id', 'modify_user_id', 'owner_user_id',
                     'reserved_user_id'],
      groupExpands = ['owner_group_id'],
      memberExpands = userExpands.concat(groupExpands);
  function includeExpandsV1toV2(expands) {
    if (Array.isArray(expands)) {
      return expands.reduce(function (result, expand) {
        if (expand === 'node') {
          mergeProperties(result, nodeExpands);
        } else if (expand === 'member') {
          mergeProperties(result, memberExpands);
        } else if (expand === 'user') {
          mergeProperties(result, userExpands);
        } else if (expand === 'group') {
          mergeProperties(result, groupExpands);
        } else {
          result[expand] || (result[expand] = []);
        }
        return result;
      }, {});
    } else if (expands === 'node') {
      return {
        properties: nodeExpands.slice()
      };
    } else if (expands === 'member') {
      return {
        properties: memberExpands.slice()
      };
    } else if (expands === 'user') {
      return {
        properties: userExpands.slice()
      };
    } else if (expands === 'group') {
      return {
        properties: groupExpands.slice()
      };
    }
    return expands;

    function mergeProperties(result, expands) {
      var properties = result.properties || (result.properties = []);
      expands.forEach(function (property) {
        if (properties.indexOf(property) < 0) {
          properties.push(property);
        }
      });
    }
  }
  function excludeExpandsV1toV2(expands) {
    if (Array.isArray(expands)) {
      return expands.reduce(function (result, expand) {
        if (expand === 'node' || expand === 'user'  || expand === 'group' ||
            expand === 'member') {
          expand = 'properties';
        }
        if (result.indexOf(expand) < 0) {
          result.push(expand);
        }
        return result;
      }, []);
    } else if (expands === 'node') {
      return nodeExpands.slice();
    } else if (expands === 'member') {
      return memberExpands.slice();
    } else if (expands === 'user' || expands === 'member') {
      return userExpands.slice();
    } else if (expands === 'group') {
      return groupExpands.slice();
    }
    return expands;
  }
  function expandsV2toV1(expands) {
    if (Array.isArray(expands)) {
      return expands.reduce(function (result, expand) {
        if (nodeExpands.indexOf(expand) >= 0) {
          result.push('node');
        } else if (userExpands.indexOf(expand) >= 0) {
          result.push('user');
        } else if (groupExpands.indexOf(expand) >= 0) {
          result.push('group');
        }
        return result;
      }, []);
    } else if (typeof expands === 'object') {
      var properties = expands.properties;
      if (properties) {
        if (!properties.length) {
          return ['node', 'member'];
        }
        return properties.reduce(function (result, expand) {
          if (nodeExpands.indexOf(expand) >= 0) {
            expand = 'node';
          } else if (userExpands.indexOf(expand) >= 0) {
            expand = 'user';
          } else if (groupExpands.indexOf(expand) >= 0) {
            expand = 'group';
          }
          if (result.indexOf(expand) < 0) {
            result.push(expand);
          }
          return result;
        }, []);
      }
      return [];
    } else if (expands === 'properties') {
      return ['node', 'member'];
    }
    return expands;
  }

  return {
    includeExpandsV1toV2: includeExpandsV1toV2,
    excludeExpandsV1toV2: excludeExpandsV1toV2,
    expandsV2toV1: expandsV2toV1,
    nodeExpands: nodeExpands,
    userExpands: userExpands
  };
});
