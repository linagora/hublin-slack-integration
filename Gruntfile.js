'use strict';

/**
 *
 * @param {object} grunt
 */
module.exports = function(grunt) {
  var CI = grunt.option('ci');

  var testArgs = (function() {
    var opts = ['test', 'chunk'];
    var args = {};
    opts.forEach(function(optName) {
      var opt = grunt.option(optName);
      if (opt) {
        args[optName] = '' + opt;
      }
    });
    return args;
  })();

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: CI && 'checkstyle',
        reporterOutput: CI && 'jshint.xml'
      },
      all: {
        src: [
          'Gruntfile.js',
          'Gruntfile-tests.js',
          'tasks/**/*.js',
          'test/**/*.js',
          'lib/**/*.js'
        ]
      },
      quick: {
        // You must run the prepare-quick-lint target before jshint:quick,
        // files are filled in dynamically.
        src: []
      }
    },
    gjslint: {
      options: {
        flags: [
          '--disable 0110',
          '--nojsdoc',
          '-e test/frontend/karma-include'
        ],
        reporter: {
          name: CI ? 'gjslint_xml' : 'console',
          dest: CI ? 'gjslint.xml' : undefined
        }
      },
      all: {
        src: ['<%= jshint.all.src %>']
      },
      quick: {
        src: ['<%= jshint.quick.src %>']
      }
    },
    lint_pattern: {
      options: {
        rules: [
          { pattern: /(describe|it)\.only/, message: 'Must not use .only in tests' }
        ]
      },
      all: {
        src: ['<%= jshint.all.src %>']
      },
      quick: {
        src: ['<%= jshint.quick.src %>']
      }
    },
    run_grunt: {
      all: {
        options: {
          log: true,
          stdout: function(data) {
            grunt.log.write(data);
          },
          stderr: function(data) {
            grunt.log.error(data);
          },
          args: testArgs,
          process: function(res) {
            if (res.fail) {
              grunt.config.set('esn.tests.success', false);
              grunt.log.writeln('failed');
            } else {
              grunt.config.set('esn.tests.success', true);
              grunt.log.writeln('succeeded');
            }
          }
        },
        src: ['Gruntfile-tests.js']
      },
      unit_backend: {
        options: {
          log: true,
          args: testArgs,
          stdout: function(data) {
            grunt.log.write(data);
          },
          stderr: function(data) {
            grunt.log.error(data);
          },
          process: function(res) {
            if (res.fail) {
              grunt.config.set('esn.tests.success', false);
              grunt.log.writeln('failed');
            } else {
              grunt.config.set('esn.tests.success', true);
              grunt.log.writeln('succeeded');
            }
          },
          task: ['test-unit-backend']
        },
        src: ['Gruntfile-tests.js']
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-gjslint');
  grunt.loadNpmTasks('grunt-run-grunt');
  grunt.loadNpmTasks('grunt-lint-pattern');

  grunt.loadTasks('tasks');

  grunt.registerTask('clean-environment', 'Clean test environment', function() {
    var testsFailed = !grunt.config.get('esn.tests.success');
    if (testsFailed) {
      grunt.log.writeln('Tests failure');
      grunt.fail.fatal('error', 3);
    }
  });

  grunt.registerTask('test-unit-backend', ['run_grunt:unit_backend', 'clean-environment']);
  grunt.registerTask('test', ['linters', 'run_grunt:unit_backend', 'clean-environment']);
  grunt.registerTask('linters', 'Check code for lint', ['jshint:all', 'gjslint:all', 'lint_pattern:all']);

  /**
   * Usage:
   *   grunt linters-dev              # Run linters against files changed in git
   *   grunt linters-dev -r 51c1b6f   # Run linters against a specific changeset
   */
  grunt.registerTask('linters-dev', 'Check changed files for lint', ['prepare-quick-lint', 'jshint:quick', 'gjslint:quick', 'lint_pattern:quick']);

  grunt.registerTask('default', ['test']);
};
