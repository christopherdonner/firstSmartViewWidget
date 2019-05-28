/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


var fs = require('fs'),
    path = require('path'),
    os = require('os'),
    _ = require('underscore');

var
    csuiPath = path.join(__dirname, '../csui'),
    csuiComponent = require(path.join(csuiPath, '/component')),
    bundlePrefix = 'workflow',
    bundleNames = ['workflow-core','workflow-all'],
    bundlePath = path.join(__dirname, 'bundles');

function loadBundleIndex(bundlePath, bundlePrefix) {
  'use strict';
  var bundleLines = fs.readFileSync(bundlePath)
      .toString()
      .split(/\r?\n/),
      firstLine = _.indexOf(bundleLines, 'define(['),
      lastLine = _.indexOf(bundleLines, '], {});'),
      bundleSource = bundleLines
          .slice(firstLine + 1, lastLine)
          .filter(function (line) {
            return !(/^\s*$/.test(line) || /^\s*\/\//.test(line));
          })
          .join(os.EOL)
          .replace(/'/g, '"')
          .replace(/,\s*$/g, ''),
      bundleName = path.basename(bundlePath).replace(/\.\w+$/, ''),
      bundleIndex = {},
      bundleModules;
  try {
    bundleModules = JSON.parse('[' + bundleSource + ']');
  } catch (error) {
    console.error('Parsing "' + bundlePath + '" failed:', '[' + bundleSource + ']');
    throw error;
  }
  bundleIndex[bundlePrefix + '/bundles/' + bundleName] = bundleModules;
  return bundleIndex;
}

function getAllComponentModules(bundleNames, bundlePath, bundlePrefix) {
  'use strict';
  var modules = _.chain(bundleNames)
      .reduce(function (result, bundleName) {
        var filePath = path.join(bundlePath, bundleName) + '.js',
            bundle = loadBundleIndex(filePath, bundlePrefix);
        _.defaults(result, bundle);
        return result;
      }, {})
      .values()
      .flatten()
      .unique()
      .value();
  return modules;
}
module.exports = {

  getAllComponentModules: getAllComponentModules,
  loadBundleIndex: loadBundleIndex,
  getAllModules: function () {
    'use strict';
    return csuiComponent.getAllComponentModules(bundleNames, bundlePath, bundlePrefix);
  }

};
