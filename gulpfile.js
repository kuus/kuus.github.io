// generated on 2016-11-07 using generator-kuus-webapp 2.2.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const lazypipe = require('lazypipe');
const minimist = require('minimist');
const tpl = require('lodash.template');
const pkg = require('./package.json');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const argv = minimist(process.argv.slice(2));
const LICENSE_PLACEHOLDER = '/*! @license credits */';
const IS_DIST = !!argv.dist || !!argv.d;
const UNCSS = typeof argv.dist === 'string' ? argv.dist.split(',').indexOf('uncss') !== -1 : false;
const MANGLE_JS = typeof argv.dist === 'string' ? argv.dist.split(',').indexOf('mangle') !== -1 : false;
const MINIFY_HTML = typeof argv.dist === 'string' ? argv.dist.split(',').indexOf('htmlmin') !== -1 : false;
const INLINE_EVERYTHING = typeof argv.dist === 'string' ? argv.dist.split(',').indexOf('inline') !== -1 : false;
const DIST_STATIC = typeof argv.dist === 'string' ? argv.dist.split(',').indexOf('static') !== -1 : false;
const CACHE_BUST = typeof argv.dist === 'string' ? argv.dist.split(',').indexOf('nobust') === -1 : true;
const banner = tpl([
  '/*!',
  ' * <%- pkg.config.namePretty %> v<%- pkg.version %> (<%- pkg.homepage %>)',
  '<% if (pkg.description) { %> * <%- pkg.description %><% } %>',
  ' *',
  ' * by <%- pkg.author.name %> <<%- pkg.author.email %>> (<%- pkg.author.url %>)',
  ' * <%- pkg.license.type %> <%- pkg.config.startYear %><% if (new Date().getFullYear() > pkg.config.startYear) { %>-<%- new Date().getFullYear() %><% } %><% if (pkg.license.url) { %> (<%- pkg.license.url %>)<% } %>',
  ' */\n'
].join('\n'))({ pkg: pkg });

// Public tasks

gulp.task('inject', gulp.series(gulp.parallel(injectStylesBower, injectScriptsBower), gulp.parallel(injectStyles, injectScripts)));
gulp.task('serve', gulp.series('inject', gulp.parallel(views, styles, scripts, modernizr, fonts), watch));
gulp.task('build', gulp.series(clean, 'inject', gulp.parallel(views, styles, scripts, modernizr, fonts, lint, images, extras), html, optimize, info));
gulp.task('build').description = 'an example of build task: `$ gulp build --dist mangle,htmlmin,static,inline`';
gulp.task('default', gulp.task('serve'));
gulp.task(serveDist);
gulp.task(serveTest, gulp.task(scripts));
gulp.task(deploy);
gulp.task(clean);
gulp.task(info);

// Private tasks

function styles () {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'ie 8']}),
      require('css-mqpacker')({sort: true})
    ]))
    .pipe($.if(IS_DIST, $.base64({
      extensions: ['svg', 'png', 'gif', /\.jpg#datauri$/i],
      // exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
      // maxImageSize: 8*1024, // bytes
      debug: true
    })))
    .pipe($.if(IS_DIST, $.replace(LICENSE_PLACEHOLDER, banner)))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.if(IS_DIST, manageCss('/styles')()))
    .pipe(reload({stream: true}));
}

function scripts () {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
}

function modernizr () {
  var fs = require('fs');
  return gulp.src('app/scripts/vendor.modernizr.json') // dummy
    .pipe($.modernizr('vendor.modernizr.js',
      JSON.parse(fs.readFileSync('./app/scripts/vendor.modernizr.json'))))
    .pipe($.if(IS_DIST, $.uglify({ preserveComments: (node, comment) => {
      return /\*.modernizr v/g.test(comment.value) || LICENSE_PLACEHOLDER === comment.value;
    }})))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
}

function _lintBase(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

function lint () {
  return _lintBase('app/scripts/**/*.js', {
      fix: true
    })
    .pipe(gulp.dest('app/scripts'));
}

function lintTest () {
  return _lintBase('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec'));
}

function manageCss (path) {
  return lazypipe()
    .pipe(() => {
      return $.if(UNCSS, $.uncss({
        html: ['app/*.html', '.tmp/*.html'],
        ignoreSheets: '/bower_components/g'
      }));
    })
    .pipe(() => { return $.if(DIST_STATIC, gulp.dest('dist-static' + path)); })
    .pipe($.cssnano, { safe: true, autoprefixer: false })
    .pipe(gulp.dest, 'dist' + path)
    .pipe($.rename, { suffix: '.min' })
    .pipe(() => { return $.if(DIST_STATIC, gulp.dest('dist-static' + path)); });
}

function manageJs () {
  // https://github.com/mishoo/UglifyJS2#the-simple-way
  var uglifyOpts = {
    preserveComments: 'license', // 'some'
    outSourceMap: true,
    toplevel: true,
    mangle: true,
    compress: {
      unsafe: true,
      drop_console: true,
      global_defs: {
        DEBUG: false
      }
    }
  };
  if (MANGLE_JS) {
    uglifyOpts.mangleProperties = {
      regex: /^_(?!format|default|value|toggleActive|process)(.+)/,
    };
  }
  return lazypipe()
    .pipe($.replace, LICENSE_PLACEHOLDER, banner)
    .pipe(() => { return $.if(DIST_STATIC, gulp.dest('dist-static')); })
    .pipe($.uglify, uglifyOpts)
    .pipe($.replace, LICENSE_PLACEHOLDER, banner)
    .pipe(gulp.dest, 'dist')
    .pipe($.rename, { suffix: '.min' })
    .pipe(() => { return $.if(DIST_STATIC, gulp.dest('dist-static')); });
}

function manageHTML () {
  return lazypipe()
    .pipe(() => {
      return $.if(MINIFY_HTML, $.htmlmin({ removeComments: true, loose: false, minifyJS: true, minifyCSS: true, collapseWhitespace: true }), $.prettify({ indent_size: 2, extra_liners: [] }));
    });
}

function images () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
}

function fonts () {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', (err) => {})
    .concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
}

function extras () {
  return gulp.src([
    '!app/*.njk',
    '!app/layouts',
    'app/data/**/*.json'
  ], {
    dot: true,
    base: 'app'
  }).pipe(gulp.dest('dist'));
}

function injectStyles () {
  return gulp.src(['app/styles/*.scss', '!app/styles/_*.scss', 'app/styles/_config.imports.scss'])
    .pipe($.inject(gulp.src(['app/styles/_*.scss', '!app/styles/_config.*.scss'],
      { read: false }), {
        relative: true,
        empty: true,
        name: 'injectApp',
        starttag: '// {{name}}:{{ext}}',
        endtag: '// endinject',
        transform: function (filepath, file) {
          return '@import "' + file.stem.substr(1, file.stem.length) + '";';
        } }))
    .pipe(gulp.dest('app/styles'))
    .pipe(reload({stream: true}));
}

function injectScripts () {
  return gulp.src('app/_base.njk')
    .pipe($.inject(gulp.src(['app/scripts/**/*.js', '!app/scripts/**/vendor.*.js'], { read: false }), { relative: true }))
    .pipe($.inject(gulp.src('app/scripts/**/vendor.*.js',
      { read: false }), { relative: true, empty: true, name: 'injectAppCustomVendors' }))
    .pipe(gulp.dest('app'))
    .pipe(reload({stream: true}));
}

function injectStylesBower () {
  return gulp.src(['app/styles/*.scss', '!app/styles/_*.scss', 'app/styles/_config.imports.scss'])
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'))
    .pipe(reload({stream: true}));
}

function injectScriptsBower () {
  return gulp.src('app/*.njk')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'))
    .pipe(reload({stream: true}));
}

function views () {
  var extend = require('extend');
  var fs = require('fs');
  var path = require('path');

  return gulp.src(['app/*.njk', '!app/_*.njk'])
    .pipe($.data((file) => {
      var data = {
        common: JSON.parse(fs.readFileSync('./app/data/_common.json')),
        dummy: JSON.parse(fs.readFileSync('./app/data/_dummy.json'))
      };
      var dataFilePath = './app/data/' + path.basename(file.path, '.njk') + '.json';
      try {
        return extend(data, JSON.parse(fs.readFileSync(dataFilePath)));
      } catch(e) {
        $.util.log($.util.colors.yellow('A data file specific for this template is missing at: ' + dataFilePath));
        return data;
      }
    }))
    .pipe($.nunjucksRender({
      path: 'app'
    }))
    .pipe(gulp.dest('.tmp'));
}

function info () {
  var infoTpl = ['',
    'Repository: <%- data.repo %>',
    '',
    'Pages Preview<% data.pages.forEach(function (page) { %>',
    '  <%- page.title %>: <%- page.url %><% }) %>',
    '',
    'Static Files Sources',
    '  Styles: <%- data.pathStaticStyles %>',
    '  Scripts: <%- data.pathStaticScripts %>',
    '',
    'Data Source',
    '  <%- data.pathData %>'
  ].join('\n');
  var pathRepo = pkg.repository.url;
  var pathMaster = pathRepo + '/tree/master';
  var path = require('path');
  var fs = require('fs');
  var filterExt = /\.html$/;
  var capitalize = function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  // @credit http://stackoverflow.com/a/25462405/1938970
  var fromDir = function (startPath, filter, callback) {
    if (!fs.existsSync(startPath)) {
      $.util.log($.util.colors.bgMagenta('no dir: "' + startPath + '"'));
      return;
    }
    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
      var filename = path.join(startPath,files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
        fromDir(filename, filter, callback);
      }
      else if (filter.test(filename)) {
        callback(files[i]);
      }
    }
  };
  var getPages = function () {
    var pages = [];
    fromDir('dist', filterExt, function (filename) {
      var title;
      var url;
      if (filename === 'index.html') {
        title = 'Home';
        url = pkg.repository.preview;
      } else {
        title = capitalize(filename.replace(filterExt, ''));
        url = pkg.repository.preview + filename;
      }
      pages.push({ title: title, url: url });
    });
    return pages;
  };
  var data = {
    repo: pathRepo,
    pages: getPages(),
    pathStaticStyles: pathMaster + '/dist-static/styles',
    pathStaticScripts: pathMaster + '/dist-static/scripts',
    pathData: pathMaster + '/app/data'
  };

  $.util.log($.util.colors.green((tpl(infoTpl)({ data: data }))));

  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
}

function html () {
  return gulp.src(['app/*.html', '.tmp/*.html'])
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.css', manageCss('')()))
    .pipe($.if('*.js', manageJs()()))
    .pipe($.if('*.html', manageHTML()()))
    .pipe($.if('*.html', gulp.dest('dist')));
}

function optimize () {
  return gulp.src('dist/*.html')
    .pipe($.if(INLINE_EVERYTHING, $.inlineSource()))
    .pipe($.if(CACHE_BUST, $.cacheBust()))
    .pipe(gulp.dest('dist'));
}

function clean () {
  return del.bind(null, ['.tmp', 'dist'])();
}

function server (baseDir, routes) {
  browserSync({
    notify: false,
    port: 9000,
    open: (!!argv.o || !!argv.open) || false,
    server: {
      baseDir: baseDir,
      routes: routes
    }
  });
}

function watch () {
  server(['.tmp', 'app'], { '/bower_components': 'bower_components' });

  // watch for changes
  gulp.watch([
    '.tmp/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch(['app/data/*.json', 'app/*.njk', 'app/layouts/**/*.njk']).on('all', views);
  gulp.watch('app/styles/**/*.scss').on('all', styles);
  gulp.watch('app/scripts/**/*.js').on('all', scripts);
  gulp.watch('app/scripts/vendor.modernizr.json').on('all', modernizr);
  gulp.watch('app/fonts/*.*').on('all', fonts);
  gulp.watch('app/scripts/**/*.js').on('add', injectScripts);
  gulp.watch('app/scripts/**/*.js').on('unlink', injectScripts);
  gulp.watch('app/styles/**/*.scss').on('add', injectStyles);
  gulp.watch('app/styles/**/*.scss').on('unlink', injectStyles);
  gulp.watch('bower.json').on('all', gulp.parallel(injectScriptsBower, injectStylesBower, fonts));
}

function serveDist() {
  server('dist');
}

function serveTest() {
  server('test', {'/scripts': '.tmp/scripts', '/bower_components': 'bower_components' });
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js').on('all', lintTest);
  gulp.watch('app/scripts/**/*.js').on('change', scripts);
}

function deploy () {
  return gulp.src(['dist/**/*', '!dist/styles/**/*', '!dist/scripts/**/*'])
    .pipe($.ghPages({
      branch: 'master'
    }));
}
