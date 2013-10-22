'use strict';

var path = require('path');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: require('./package.json'),
    sourceDir: 'app',
    buildDir: 'public',
    releaseDir: 'release',
    bowerDir: '<%= sourceDir %>/bower_components',
    buildtag: '-dev-' + grunt.template.today('yyyy-mm-dd'),
    buildFiles: {
      elements: '<%= sourceDir %>/lib/elements/**/*.html'
    },
    meta: {
      banner: '/**\n' +
        ' * @version v<%= pkg.version %><%= buildtag %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
        ' */'
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['<%= sourceDir %>/**/*.js'],
        tasks: ['jshint', 'concat:dev']
      },
      jade: {
        files: ['<%= sourceDir %>/**/*.jade'],
        tasks: ['jade:dev']
      },
      stylus: {
        files: ['<%= sourceDir %>/**/*.styl'],
        tasks: ['stylus:dev']
      },
      html: {
        files: ['<%= sourceDir %>/**/*.html'],
        tasks: ['jshint', 'concat:dev']
      }
    },
    jshint: {
      options: {
        browser: true,
        regexp: true,
        trailing: true,
        strict: true,
        white: true,
        indent: 2,
        ignores: ['<%= bowerDir %>/**/*.js']
      },
      files: ['<%= sourceDir %>/**/*.js']
    },
    connect: {
      options: {
        port: 8080,
        base: '<%= buildDir %>'
      },
      server: {
        options: {
          keepalive: true
        }
      },
      dev: {
        options: {
          keepalive: false
        }
      }
    },
    jade: {
      options: {
        data: false
      },
      dev: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: '<%= sourceDir %>',
          src: './*.jade',
          dest: '<%= buildDir %>',
          ext: '.html'
        }]
      },
      prod: {
        options: {
          pretty: false
        },
        files: [{
          expand: true,
          cwd: '<%= sourceDir %>',
          src: './*.jade',
          dest: '<%= buildDir %>',
          ext: '.html'
        }]
      }
    },
    concat: {
      dev: {
        files: {
          '<%= buildDir %>/<%= pkg.name %>-elements.html': ['<%= buildFiles.elements %>'],
          '<%= buildDir %>/js/lib.js': ['<%= sourceDir %>/bower_components/polymer/polymer.min.js'],
          '<%= buildDir %>/js/demo-app.js': [
            '<%= sourceDir %>/js/demo-app/app.js'
          ]
        }
      },
      prod: {
        files: {
          '<%= releaseDir %>/<%= pkg.name %>-elements.html': ['<%= buildFiles.elements %>'],
        }
      }
    },
    uglify: {
      release: {
        files: [{
          expand: true,
          cwd: '<%= releaseDir %>',
          src: ['./*.js', '!./*.min.js'],
          dest: '<%= releaseDir %>',
          ext: '.min.js'
        }]
      }
    },
    stylus: {
      options: {
        paths: ['<%= sourceDir %>/stylus'],
        use: []
      },
      dev: {
        options: {
          compress: false
        },
        files: [{
          expand: true,
          cwd: '<%= sourceDir %>',
          src: './stylus/**/*.styl',
          dest: '<%= buildDir %>',
          rename: function (dest, matchedSrcPath, options) {
            return path.join(dest, matchedSrcPath.replace('stylus', 'css').replace(/\.styl$/, '.css'));
          }
        }]
      },
      prod: {
        options: {
          compress: true
        },
        files: [{
          expand: true,
          cwd: '<%= sourceDir %>',
          src: './stylus/**/*.styl',
          dest: '<%= releaseDir %>',
          rename: function (dest, matchedSrcPath, options) {
            return path.join(dest, matchedSrcPath.replace('stylus', 'css').replace(/\.styl$/, '.css'));
          }
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('server', ['connect']);
  grunt.registerTask('default', ['build', 'connect:dev', 'watch']);

  grunt.registerTask('build', ['jshint', 'concat:dev', 'jade:dev', 'stylus:dev']);
  grunt.registerTask('build:prod', ['jshint', 'concat:prod', 'uglify', 'jade:prod', 'stylus:prod']);
};
