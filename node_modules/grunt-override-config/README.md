# grunt-override-config v0.1.0
Override grunt config task.


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-override-config --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-override-config');
```


## Using Example

### Override JSHint options
Override grunt config with running CI.

```javascript
grunt.initConfig({
  // Default JSHint options.
  jshint: {
    options: {
      reporter: require('jshint-stylish')
    },
    all: [...]
  },

  // CI JSHint options.
  override: {
    jshint: {
      options: {
        reporter: 'checkstyle',
        reporterOutput: 'checkstyle.xml'
      }
    }
  });
```

Please run the "grunt jshint" always.

```
$ grunt jshint
Running "jshint:all" (jshint) task

app/scripts/main.js
  line 1  col 2  Expected 'hoge' to have an indentation at 1 instead at 2.
  line 1  col 2  Expected an assignment or function call and instead saw an expression.
  line 1  col 2  'hoge' is not defined.

✖ 3 problems

Warning: Task "jshint:all" failed. Use --force to continue.

Aborted due to warnings.
...
```

Please run the `grunt override jshint` If you want to operate with CI.

```
$ grunt override jshint
Running "override:jshint" (override) task
{ jshint: 
   { options: 
      { jshintrc: '.jshintrc',
        reporter: 'checkstyle',
        reporterOutput: 'checkstyle.xml' },
     all: 
      [ 'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js' ] } }

Running "jshint:all" (jshint) task
>> Report "checkstyle.xml" created.
Warning: Task "jshint:all" failed. Use --force to continue.

Aborted due to warnings.
...
```
