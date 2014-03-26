module.exports = function (grunt) {

  // configure the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'build'
        }
      }
    },
    copy: {
      html: {
        cwd: 'source',
        src: [ 'index.html', '*.manifest'],
        dest: 'build',
        expand: true
      },
      js: {
        cwd: 'source',
        src: ['js/**/*'],
        dest: 'build',
        expand: true
      },
      images: {
        cwd: 'source',
        src: [ 'images/**/*'],
        dest: 'build',
        expand: true
      },
      libraries: {
        cwd: 'source',
        src: [ 'libraries/react/react-with-addons.min.js', 'libraries/director/build/director.min.js' ],
        dest: 'build',
        expand: true
      }
    },
    clean: ['./build'],
    stylus: {
      compile: {
        files: {
          'build/styles/clustter.css': ['source/styles/*.styl'] // compile and concat into single file
        }
      }
    },
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },
    react: {
      files: {
        expand: true,
        cwd: './source/jsx-templates/',
        src: ['app.jsx'],
        dest: './build/js/',
        ext: '.js'
      }
    },
    concat: {
      dist: {
        src: ['./build/js/messages.js', './build/js/app.js'],
        dest: './build/js/clustter.js',
      }
    },
    uglify: {
      build: {
        src: './build/js/clustter.js',
        dest: './build/js/clustter.min.js'
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: './build/styles/',
        src: ['*.css'],
        dest: './build/styles/',
        ext: '.min.css'
      }
    },
    watch: {
      styles: {
        files: './source/**/*.styl',
        tasks: ['stylesheets'],
        options: {
          livereload: true
        }
      },
      react: {
        files: './source/**/*.jsx',
        tasks: ['react', 'concat'],
        options: {
          livereload: true
        }
      },
      js: {
        files: './source/**/*.js',
        tasks: ['copy:js', 'concat'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['./source/**/*.html', './source/**/*.manifest'],
        tasks: ['copy:html'],
        options: {
          livereload: true
        }
      }
    }
  });
 
  // load the tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  // define the tasks
  grunt.registerTask('stylesheets', 'compiles all styles and autoprefixes them', [ 'stylus', 'autoprefixer' ]);
  grunt.registerTask('dev', 'Running Clustter-Client Development Mode', [ 'clean', 'copy', 'stylesheets', 'react', 'concat', 'connect', 'watch' ]);
  grunt.registerTask('build', 'Building Clustter-Client Production', [ 'clean', 'copy', 'stylesheets', 'react', 'concat', 'uglify', 'cssmin' ]);
  grunt.registerTask('default', ['dev']);

};