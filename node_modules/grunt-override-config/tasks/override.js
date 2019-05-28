module.exports = function(grunt) {
  'use strict';

  var util = require('util');

  var inspect = function (object) {
    return util.inspect(object, false, 4, true);
  };

  grunt.registerMultiTask('override', 'Override grunt config task.', function() {
    // Override grunt config.
    var override = {};
    override[this.target] = grunt.config.getRaw('override.' + this.target);
    grunt.config.merge(override);

    // Show overrided grunt config.
    var overrided = {};
    overrided[this.target] = grunt.config.getRaw(this.target);
    grunt.log.writeln(inspect(overrided));
  });
};
