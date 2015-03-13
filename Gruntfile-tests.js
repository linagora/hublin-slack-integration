'use strict';

/**
 *
 * @param {object} grunt
 */
module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      }
    },

    splitfiles: {
      options: {
        chunk: 10
      },
      backend: {
        options: {
          common: ['test/all.js'],
          target: 'mochacli:backend'
        },
        files: {
          src: ['test/**/*.js']
        }
      }
    },
    mochacli: {
      options: {
        require: ['chai', 'mockery'],
        reporter: 'spec',
        timeout: process.env.TEST_TIMEOUT || 20000
      },
      backend: {
        options: {
          files: ['test/all.js', grunt.option('test') || 'test/**/*.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-cli');

  grunt.loadTasks('tasks');

  grunt.registerTask('test-unit-backend', 'run the backend unit tests (to be used with .only)', ['splitfiles:backend']);

  grunt.registerTask('test', ['test-unit-backend']);
  grunt.registerTask('default', ['test']);
};
