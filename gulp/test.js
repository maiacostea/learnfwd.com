'use strict';

var gulp = require('gulp');
var _ = require('lodash');

var config = require('./_config.js');
var paths = config.paths;

var karma = require('karma').server;

var browserSync = require('browser-sync');
var pagespeed = require('psi');
var ngrok = require('ngrok');

var karmaConf = {
  browsers: ['PhantomJS'],
  frameworks: ['mocha'],
  preprocessors: {},
  files: [
    paths.tmp + "/js/main.js",
    './node_modules/should/should.min.js',
    paths.test + '/**/*.spec.js'
  ],
  reporters: ['mocha', 'osx', 'coverage'],
  coverageReporter: {
    type : 'lcov',
    dir : 'coverage/',
    subdir: function (browser) {
      return browser.toLowerCase().split(/[ /-]/)[0];
    }
  }
};

karmaConf.preprocessors[paths.tmp + '/js/main.js'] = ['coverage'];

gulp.task('test', function (done) {
  karma.start(karmaConf, done);
});

gulp.task('test:once', ['build'], function () {
  karma.start(_.assign({}, karmaConf, { singleRun: true }));
});

gulp.task('pagespeed', ['build:dist'], function () {
  browserSync({
    server: {
      baseDir: paths.dist
    },
    open: false
  }, function (err, bs) {
    if (err) {
      console.log(err);
      process.exit(0);
    }

    ngrok.connect(bs.options.port, function(err, url) {
      pagespeed({
        url: url,
        strategy: 'mobile'
      }, function () {
        process.exit(0);
      });
    });
  });
});

gulp.task('pagespeed:express', ['build:dist'], function () {
  ngrok.connect(process.env.port, function(err, url) {
    pagespeed({
      url: url,
      strategy: 'mobile'
    }, function () {
      process.exit(0);
    });
  });
});

