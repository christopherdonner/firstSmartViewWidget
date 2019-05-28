/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'css!csui/widgets/navigation.header/impl/navigation.header.controls'
], function (module, _, Backbone) {
  'use strict';

  var config = module.config();

  var logo = new Backbone.Model(_.extend({
    location: 'center'
  }, config.logo));

  var leftSide = new Backbone.Collection([
    {
      id: 'csui/widgets/navigation.header/controls/help/help.view',
      sequence: 100,
      parentClassName: 'csui-help'
    },
    {
      id: 'csui/widgets/navigation.header/controls/home/home.view',
      sequence: 200,
      parentClassName: 'csui-home-item'
    },
    {
      id: 'csui/widgets/navigation.header/controls/breadcrumbs/breadcrumbs.view',
      sequence: 300,
      parentClassName: 'tile-breadcrumb'
    }
  ], {
    comparator: 'sequence'
  });

  var rightSide = new Backbone.Collection([
    {
      id: 'csui/widgets/navigation.header/controls/search/search.view',
      sequence: 100,
      parentClassName: 'csui-search'
    },
    {
      id: 'csui/widgets/navigation.header/controls/favorites/favorites.view',
      sequence: 200,
      parentClassName: 'csui-favorites'
    },
    {
      id: 'csui/widgets/navigation.header/controls/user.profile/user.profile.view',
      sequence: 300,
      parentClassName: 'csui-profile'
    }
  ], {
    comparator: 'sequence'
  });

  var masks = _.reduce(_.values(config.masks || {}), function (result, mask) {
    return {
      blacklist: result.blacklist.concat(mask.blacklist || []),
      whitelist: result.whitelist.concat(mask.whitelist || [])
    };
  }, {
    blacklist: [],
    whitelist: []
  });
  masks = {
    blacklist: _.unique(masks.blacklist),
    whitelist: _.unique(masks.whitelist)
  };

  function filterComponentByMask(component) {
    return !_.contains(masks.blacklist, component.id) &&
           (!masks.whitelist.length ||
            _.contains(masks.whitelist, component.id));
  }

  leftSide.remove(leftSide.reject(filterComponentByMask));
  rightSide.remove(rightSide.reject(filterComponentByMask));

  return {
    logo: logo,
    leftSide: leftSide,
    rightSide: rightSide
  };
});
