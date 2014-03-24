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
        tasks: ['react'],
        options: {
          livereload: true
        }
      },
      js: {
        files: './source/**/*.js',
        tasks: ['copy:js'],
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
  grunt.registerTask('default', 'Running Clustter-Client Development Mode', [ 'copy', 'stylesheets', 'react', /*'connect',*/ 'watch' ]);
  grunt.registerTask('build', 'Building Clustter', ['copy', 'stylesheets', 'react'/*, 'uglify'*/]);
};