/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    _ = require('underscore');

module.exports = function (grunt) {

  grunt.registerMultiTask('requirejsBundleIndex',
      'Generate an index module defining content of all bundles',
      function () {
        var linefeed = grunt.util.linefeed,
            options = this.options(),
            prefix = options.prefix;

        grunt.log.writeln('Generating bundle index for ' + this.name);
        var bundleDeclarations = this.filesSrc.map(function (bundlePath) {
          grunt.log.writeln('Processing bundle specification module ' +
                            bundlePath);
          try {
            var bundleContent = fs.readFileSync(bundlePath),
                bundleText = bundleContent.toString(),
                bundleLines = bundleText.split(/\r?\n/),
                firstLine = _.indexOf(bundleLines, 'define(['),
                lastLine = _.indexOf(bundleLines, '], {});'),
                dependencyLines = bundleLines
                    .slice(firstLine + 1, lastLine)
                    .filter(function (line) {
                      return !(/^\s*$/.test(line) || /^\s*\/\//.test(line));
                    })
                    .map(function (line) {
                      return line.replace(/^(\s*["'])i18n!/, '$1');
                    }),
                dependencyText = dependencyLines
                    .join(linefeed)
                    .replace(/"/g, '\'')
                    .replace(/,\s*$/g, ''),
                bundleId = bundlePath.replace(/\.\w+$/, '');
            return util.format('\'%s/%s\': [%s%s%s]',
                prefix, bundleId, linefeed, dependencyText, linefeed);
          }
          catch (error) {
            grunt.verbose.error(error.stack);
            grunt.log.error(error);
            grunt.fail.warn('Generating the bundle index for ' +
                            this.name + ' failed');
          }
        }, this);
        var bundleIndexJavaScriptPath = this.data.dest + '.js',
            bundleIndexJavaScriptText = Array.prototype.concat.call(
                [
                  'require.config({',
                  '  bundles: {'
                ], [
                  bundleDeclarations.join(',' + linefeed)
                ], [
                  '  }',
                  '});'
                ])
                .join(linefeed);
        grunt.log.writeln('Writing JavaScript bundle index ' +
                          bundleIndexJavaScriptPath);
        fs.writeFileSync(bundleIndexJavaScriptPath, bundleIndexJavaScriptText);
        var bundleIndexJSONPath = this.data.dest + '.json',
            bundleIndexJSONText = Array.prototype.concat.call(
                ['{'], [
                  bundleDeclarations.join(',' + linefeed)
                ], ['}'])
                .join(linefeed)
                .replace(/'/g, '"');
        grunt.log.writeln('Writing JSON bundle index ' + bundleIndexJSONPath);
        fs.writeFileSync(bundleIndexJSONPath, bundleIndexJSONText);
      });

};
