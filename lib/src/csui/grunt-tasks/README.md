Custom Grunt Tasts
==================

Tasks in this directory are not available in the NPM registry and cannot be 
downloaded just by their module version from the cloud.  They can be loaded
to the Gruntfile as long as you get access to this directory:
 
    grunt.loadTasks('.../grunt-tasks');

See the comments in the [embed.fonts.js source file](embed.fonts.js)
for more information.

See the comments in the [requirejs.bundle.check.js source file](requirejs.bundle.check.js)
for more information.

See the comments in the [requirejs.bundle.index.js source file](requirejs.bundle.index.js)
for more information.

See the [on-line documentation of the symlink task](https://github.com/prantlf/grunt-contrib-symlink/tree/combined)
for more information.

This directory is under the `src` directory of the CS UI Widgets, because
other components may need to use them too and this directory is currently
the only one exposed outside of the CS UI Widgets package.
