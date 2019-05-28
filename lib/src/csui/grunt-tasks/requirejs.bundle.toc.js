/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

var fs = require('fs'),
    parse = require('amodro-trace/lib/parse');

module.exports = function (grunt) {

  grunt.registerMultiTask('requirejsBundleTOC',
      'Generate a complete module list of the specified bundle',
      function () {
        var options = this.options({
              optimize: true,
              force: false
            }),
            data = this.data,
            prefix = data.prefix,
            bundlePath = data.src,
            treePath = data.dest;
        parse.hasDefine = function (node) {
          if (node && node.type === 'CallExpression') {
            var callee = node.callee;
            if (callee) {
              if (callee.type === 'Identifier' && callee.name === 'define') {
                return true;
              }
              if (callee.type === 'MemberExpression' && !callee.computed) {
                var object = callee.object,
                    property = callee.property;
                return object && object.type === 'Identifier' &&
                    object.name === prefix && property &&
                    property.type === 'Identifier' &&
                    property.name === 'define';
              }
            }
          }
        };

        grunt.log.writeln('Reading bundle module ' + bundlePath);
        try {
          var bundleContents = fs.readFileSync(bundlePath),
              bundleText = bundleContents.toString(),
              moduleIds = parse.getAllNamedDefines(bundleText, {}),
              moduleList = JSON.stringify({modules: moduleIds}, undefined,
                                          options.optimize ? undefined : 2);
          grunt.log.writeln('Writing bundle tree ' + treePath);
          fs.writeFileSync(treePath, moduleList);
        } catch (error) {
          var warn = options.force ? grunt.log.warn : grunt.fail.warn;
          grunt.verbose.error(error.stack);
          grunt.log.error(error);
          warn('Generating the bundle tree for ' + this.name + ' failed');
        }
      });
};
