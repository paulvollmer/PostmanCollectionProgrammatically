module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
          mask: '*.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('default', ['test']);

  // this would be run by typing "grunt test" on the command line
  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
};
