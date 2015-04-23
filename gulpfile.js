/*global -$ */
'use strict';
// generated on 2015-04-22 using generator-kuus-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var argv = require('minimist')(process.argv.slice(2));
var banner = [
  '/*!',
  ' * <%- pkg.config.namePretty %> v<%- pkg.version %> (<%- pkg.homepage %>)',
  ' * <%- pkg.description %>',
  ' *',
  ' * by <%- pkg.author.name %> <<%- pkg.author.email %>> (<%- pkg.author.url %>)',
  ' * <%- pkg.license.type %> <%- pkg.config.startYear %><% if (new Date().getFullYear() > pkg.config.startYear) { %>-<%- new Date().getFullYear() %><% } %><% if (pkg.license.url) { %> (<%- pkg.license.url %>)<% } %>',
  ' */\n'
].join('\n');

gulp.task('styles', function () {
  return gulp.src('app/styles/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 2 versions', 'ie 8']})
    ]))
    .pipe($.combineMediaQueries()) // { log: true }
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['views', 'styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src(['app/*.html', '.tmp/*.html'])
    .pipe($.cdnizer([
     {
        file: '/bower_components/jquery/dist/jquery.js',
        package: 'jquery',
        cdn: 'https://ajax.googleapis.com/ajax/libs/jquery/${ major }.${ minor }.${ patch }/jquery.min.js'
      }
    ]))
    .pipe(assets)
    .pipe($.if('*.js', $.uglify({ preserveComments: 'some', compress: { drop_console: true } })))
    .pipe($.if('*.js', $.header(banner, { pkg: require('./package.json') })))
    .pipe($.if('*.css', $.minifyCss({ compatibility: 'ie8,+units.rem' }))) // $.csso()
    .pipe($.if('*.css', $.header(banner, { pkg: require('./package.json') })))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    '!app/*.jade'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['views', 'styles', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    open: (!!argv.o || !!argv.open) || false,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch(['app/*.jade', 'app/layouts/**/*.jade'], ['views', reload]);
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', function () {
  browserSync({
    notify: false,
    port: 9000,
    open: (!!argv.o || !!argv.open) || false,
    server: {
      baseDir: ['dist']
    }
  });
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.jade')
    .pipe(wiredep({
      exclude: ['bootstrap-sass-official'],
      ignorePath: /^(\.\.\/)*\.\./,
      overrides: {
        jquery: {
          main: 'jquery.min.map' // trick to exclude jquery from wiredep, it's going to be cdnized
        }
      }
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build-pre', ['jshint', 'html', 'images', 'fonts', 'extras']);

gulp.task('build-optimize', ['build-pre'], function () {
  return gulp.src(['dist/**/*.css', 'dist/**/*.js', 'dist/*.html'])
    // .pipe($.selectors.run())
    .pipe($.if('*.css', $.base64({
      baseDir: 'dist/styles/',
      extensions: ['svg', 'png', 'gif'],
      maxImageSize: 800*1024, // bytes (just inline them all)
      debug: true
    })))
    .pipe($.if('*.html', $.inline({
      base: 'dist/',
      js: $.stripComments({ safe: false }),
      css: $.stripComments({ safe: false })
    })))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build-optimize'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['serve']);

gulp.task('views', function () {
  return gulp.src(['app/*.jade', '!app/_base.jade'])
    .pipe($.jade({
      pretty: true,
      doctype: 'html' // see: http://stackoverflow.com/a/12079081/1938970
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('deploy', function() {
  return gulp.src(['dist/**/*', '!dist/styles/**/*', '!dist/scripts/**/*'])
    .pipe($.ghPages());
});
