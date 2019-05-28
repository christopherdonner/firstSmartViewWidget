'use strict';

// Executes the unit tests
module.exports = function (grunt) {
  var environment = process.env,
      time = environment.GRUNT_TIME === 'true',
      notify = environment.GRUNT_NOTIFY === 'true';

  // Report the duration of the tasks run
  if (time) {
    require('time-grunt')(grunt);
  }

  // Declare tasks for the unit test execution
  grunt.initConfig({
    // Set up desktop grunt result notifications
    notify_hooks: {
      options: {
        enabled: notify,
        max_jshint_notifications: 5,
        title: 'donner/test',
        success: true,
        duration: 3
      }
    },

    // Delegate weak static code check to the source directory
    subgrunt: {
      jshint: {
        '../src': ['override', 'jshint']
      },
      jsonlint: {
        '../src': ['jsonlint']
      },
      options: {
        npmInstall: false
      }
    },

    // Remove directories with old reports
    clean: {
      debug: ['debug/coverage/*', 'debug/results/*'],
      release: ['release/results/*']
    },

    // Create report directories
    mkdir: {
      debug: {
        options: {
          create: ['debug/coverage', 'debug/results']
        }
      },
      release: {
        options: {
          create: ['release/results']
        }
      }
    },

    // Run Karma with the default configuration, which runs all test specs once
    karma: {
      debug: {
        configFile: 'karma.debug.js'
      },
      release: {
        configFile: 'karma.release.js'
      }
    }
  });

  // Load grunt plugins used in this Gruntfile
  grunt.loadTasks('../node_modules/grunt-contrib-clean/tasks');
  grunt.loadTasks('../node_modules/grunt-karma/tasks');
  grunt.loadTasks('../node_modules/grunt-mkdir/tasks');
  grunt.loadTasks('../node_modules/grunt-notify/tasks');
  grunt.loadTasks('../node_modules/grunt-subgrunt/tasks');

  // Allow running just "grunt" in this directory to execute the tests
  grunt.registerTask('check', ['subgrunt:jshint', 'subgrunt:jsonlint']);
  grunt.registerTask('debug', [
    'mkdir:debug', 'clean:debug', 'karma:debug']);
  grunt.registerTask('release', [
    'mkdir:release', 'clean:release', 'karma:release']);
  grunt.registerTask('specs', ['debug', 'release']);
  grunt.registerTask('default', ['check', 'specs']);

  // Register desktop notification hooks
  grunt.task.run('notify_hooks');
};
