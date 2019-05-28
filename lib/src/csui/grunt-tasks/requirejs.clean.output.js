/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = function (grunt) {
  grunt.registerMultiTask('requirejsCleanOutput',
    'Remove files and directories, which are not distributed, from the build output.',
    function () {
      function walkDir(file) {
        if (grunt.file.isDir(file)) {
          fs.readdirSync(file)
            .forEach(function (child) {
              if (child !== '.' && child !== '..') {
                var dir = path.join(file, child);
                if (!customProcess({
                  name: child,
                  path: dir
                }, helpers)) {
                  if (child === 'bundles') {
                    processBundles(dir);
                  } else {
                    walkDir(dir);
                  }
                }
              }
            });
          processDir(file);
        } else {
          processFile(file);
        }
      }

      function processBundles(file) {
        fs.readdirSync(file)
          .forEach(function (child) {
            if (/\.src\.js$/.test(child) ||
                /\.md$/.test(child)) {
              deleteFile(path.join(file, child));
            }
          });
      }

      function processDir(file) {
        if (fs.readdirSync(file).length === 0) {
          deleteDir(file);
        }
      }

      function processFile(file) {
        if (/[\/\\]test[\/\\]/.test(file) ||
            !/(\.(svg|png|jpg|jpeg|eot|ttf|woff|woff2))|(-extensions\.json)$/.test(file)) {
          deleteFile(file);
        }
      }

      function deleteDir(file) {
        grunt.verbose.writeln('Deleting directory "' + file + '"...');
        fs.rmdirSync(file);
        ++directoryCount;
      }

      function deleteFullDir(file) {
        if (grunt.file.isDir(file)) {
          fs.readdirSync(file)
            .forEach(function (child) {
              if (child !== '.' && child !== '..') {
                deleteFullDir(path.join(file, child));
              }
            });
          deleteDir(file);
        } else {
          deleteFile(file);
        }
      }

      function deleteFile(file) {
        grunt.verbose.writeln('Deleting file "' + file + '"...');
        fs.unlinkSync(file);
        ++fileCount;
      }

      var options = this.options({
            force: false,
            processItem: function () {}
          }),
          helpers = {
            deleteDir: function (file) {
              if (fs.existsSync(file)) {
                deleteDir(file);
              }
            },
            deleteFile: function (file) {
              if (fs.existsSync(file)) {
                deleteFile(file);
              }
            },
            deleteFullDir: function (file) {
              if (fs.existsSync(file)) {
                deleteFullDir(file);
              }
            },
            walkDir: walkDir
          },
          customProcess = options.processItem,
          src = this.data.src,
          directoryCount = 0,
          fileCount = 0;
      if (src) {
        walkDir(src);
        grunt.log.ok(directoryCount + ' directories and ' +
                     fileCount + ' files deleted.');
      } else {
        var warn = options.force ? grunt.log.warn : grunt.fail.warn;
        warn('Mandatory parameter "src" not set.');
      }
    });
};
