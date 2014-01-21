module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        files: {
          'dist/index.html': [ 'src/templates/*.jade' ]
        }
      }
    },
    stylus: {
      compile: {
        options: {
          compress: true,
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'dist/stylesheets/style.css': ['src/styles/main.styl']
        }
      }
    },
    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/fonts/',
          src: ['**'],
          dest: 'dist/fonts/'
        },
        {
          expand: true,
          cwd: 'src/libs/ionicons',
          src: ['**'],
          dest: 'dist/fonts/ionicons'
        },
        {
          expand: true,
          cwd: 'src/images/',
          src: ['**'],
          dest: 'dist/images/'
        }]
      }
    },
    watch: {
      html: {
        files: '**/*.jade',
        tasks: ['jade'],
        options: {
          livereload: true,
        },
      },
      css: {
        files: 'src/styles/*.styl',
        tasks: ['stylus'],
        options: {
          livereload: true
        },
      },
      assets: {
        files: ['src/fonts/**', 'src/images/**'],
        tasks: ['copy'],
        options: {
          livereload: true
        }
      }
    }
  });

  // Load all grunt-contrib plugins.
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
  // Default task(s).
  grunt.registerTask('default', ['jade', 'stylus', 'copy', 'watch']);

};