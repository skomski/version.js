module.exports = function (grunt) {
  'use strict';

  var bannerRegex = /\/\*[\s\S]*?\*\//;

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: grunt.file.read('src/version.js').match(bannerRegex)[0]
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/spec/**/*.js']
    },
    min: {
      all: {
        src: ['<banner>', 'src/version.js'],
        dest: 'build/version.min.js'
      }
    },
    concat: {
      all: {
        src: ['<banner>', '<file_strip_banner:src/version.js:block>'],
        dest: 'build/version.js',
        separator: ''
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    component: {
      main: './build/version.min.js'
    },
    jasmine: {
      all: [
        'http://localhost:8000/test/runner.html',
        'http://localhost:8000/test/runner.html?versionjs=1.6.2'
      ]
    },
    jshint: {
      options: {
        // Enforcing
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        quotmark: 'single',
        regexp: true,
        undef: true,
        unused: true,
        strict: true,
        trailing: true,
        maxlen: 120,
        // Relaxing
        boss: true,
        eqnull: true,
        evil: true,
        sub: true,
        // Environment
        browser: true,
        jquery: true
      },
      globals: {
        describe: true,
        expect: true,
        it: true,
        module: true,
        process: true
      }
    },
    'saucelabs-jasmine': {
      all: {
        testname: 'version.js',
        tags: ['master'],
        urls: '<config:jasmine.all>',
        concurrency: 3,
        browsers: (function () {
          var compact = {
                'chrome': {
                  '*': ['Windows 2008', 'Mac 10.8', 'Linux']
                },
                'firefox': {
                  '3.6': ['Windows 2012', 'Linux'],
                  '*': ['Windows 2012', 'Mac 10.6', 'Linux']
                },
                'internet explorer': {
                  '6': 'Windows 2003',
                  '7': 'Windows 2003',
                  '8': 'Windows 2003',
                  '9': 'Windows 2008',
                  '10': 'Windows 2012'
                },
                'ipad': {
                  '4.3': 'Mac 10.6',
                  '5.1': 'Mac 10.8',
                  '6': 'Mac 10.8'
                },
                'iphone': {
                  '4.3': 'Mac 10.6',
                  '5.1': 'Mac 10.8',
                  '6': 'Mac 10.8'
                },
                'opera': {
                  '11': 'Windows 2008',
                  '12': ['Windows 2008', 'Linux']
                },
                'safari': {
                  '5': ['Windows 2008', 'Mac 10.6'],
                  '6': 'Mac 10.8'
                }
              },
              expanded = [];

          Object.keys(compact).forEach(function (browserName) {
            Object.keys(compact[browserName]).forEach(function (version) {
              var platforms = compact[browserName][version];

              if (!Array.isArray(platforms)) {
                platforms = [platforms];
              }

              platforms.forEach(function (platform) {
                var options = {
                      browserName: browserName
                    };

                if (version !== '*') {
                  options.version = version;
                }

                if (platform) {
                  options.platform = platform;
                }

                expanded.push(options);
              });
            });
          });

          return expanded;
        })()
      }
    },
    server: {
      port: 8000,
      base: '.'
    },
    uglify: {}
  });

  var testTasks = ['lint', 'server', 'jasmine'];

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    grunt.loadNpmTasks('grunt-saucelabs');

    testTasks.push('saucelabs-jasmine');
  }

  grunt.registerTask('test', testTasks.join(' '));
  grunt.registerTask('default', 'test min concat component');

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-pkg-to-component');
};
