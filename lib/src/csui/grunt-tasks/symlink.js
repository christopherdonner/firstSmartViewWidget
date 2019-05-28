/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */



'use strict';

module.exports = function(grunt) {

  var fs = require('fs');
  var path = require('path');

  grunt.registerMultiTask('symlink', 'Create symbolic links.', function() {
    var nowrite = grunt.option('no-write');
    var linkCount = 0;
    var options = this.options({
      force: false,
      overwrite: false,
      dirmode: 'dir'
    });
    var force = options.force;
    options.overwrite = grunt.option('overwrite') || options.overwrite;
    options.dirmode = grunt.option('dirmode') || options.dirmode;

    grunt.log.warn('The symlink task is deprecated and will be removed before CS16 2016.06 is released.');

    this.files.forEach(function(f) {
      var mode = grunt.file.isDir(f.src[0]) ? f.dirmode || options.dirmode : 'file';
      var srcpath = mode === 'junction' ? path.resolve(f.src[0]) : f.src[0];
      var destpath = f.dest;
      if (!grunt.file.exists(srcpath)) {
        grunt.log.warn('Source file "' + srcpath + '" not found.');
        return;
      } else if (grunt.file.exists(destpath)) {
        if (!options.overwrite) {
          grunt.log.warn('Destination ' + destpath + ' already exists.');
          return;
        }
        grunt.file['delete'](destpath);
      }
      destpath = destpath.replace(/[\\\/]$/, '');
      var destdir = path.join(destpath, '..');
      if (!grunt.file.isPathAbsolute(srcpath)) {
        srcpath = path.relative(destdir, srcpath) || '.';
      }
      grunt.file.mkdir(destdir);
      grunt.verbose.write((nowrite ? 'Not actually linking ' : 'Linking ') + '(' + mode + ') ' + destpath + ' -> ' + srcpath + '...');
      try {
        if (!nowrite) {
          fs.symlinkSync(srcpath, destpath, mode);
        }
        grunt.verbose.ok();
        linkCount++;
      } catch(e) {
        grunt.verbose.error();
        grunt.log.error(e);
        var warn = force ? grunt.log.warn : grunt.fail.warn;
        warn('Failed to create symlink: ' + '(' + mode + ') ' + destpath + ' -> ' + srcpath + '.');
      }
    });
    grunt.log.ok('Created ' + linkCount + ' symbolic links.');
  });

};
