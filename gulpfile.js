// web-ignition
// Gulp tasks

// Imports
const babel =           require('gulp-babel');
const del =             require('del');
const css =             require('gulp-postcss');
const cssFontMagician = require('postcss-font-magician');
const cssNano =         require('cssnano');
const cssPresetEnv =    require('postcss-preset-env');
const gap =             require('gulp-append-prepend');
const gulp =            require('gulp');
const header =          require('gulp-header');
const htmlHint =        require('gulp-htmlhint');
const htmlValidator =   require('gulp-w3c-html-validator');
const less =            require('gulp-less');
const mergeStream =     require('merge-stream');
const rename =          require('gulp-rename');
const replace =         require('gulp-replace');
const size =            require('gulp-size');

// Setup
const pkg =            require('./package.json');
const home =           pkg.homepage.replace('https://', '');
const banner =         'web-ignition v' + pkg.version + ' ~ ' + home + ' ~ MIT License';
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };
const htmlHintConfig = { 'attr-value-double-quotes': false };
const cssPlugins = [
   cssFontMagician({ protocol: 'https:' }),
   cssPresetEnv(),
   cssNano({ autoprefixer: false }),
   ];
const banners = {
   reset:     '/*! reset.css ~ ' + banner + ' */\n',
   blogger:   '/*! Blogger tweaks for Dynamic Views (sidebar) ~ ' + banner + ' */\n',
   library:   '//! library.js ~ ' + banner + '\n',
   layoutCss: '/*! layouts (${filename}) ~ ' + banner + ' */\n',
   layoutJs:  '//! layouts (${filename}) ~ ' + banner + '\n',
   };

// Tasks
const task = {
   validateSpecPages() {
      return gulp.src(['css/*.html', 'js/*.html', 'css/layouts/*.html'])
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter())
         .pipe(size({ showFiles: true }));
      },
   cleanTarget() {
      return del(['dist', '**/.DS_Store']);
      },
   buildCss() {
      const buildReset = () =>
         gulp.src('css/reset.less')
            .pipe(less())
            .pipe(css(cssPlugins))
            .pipe(rename({ extname: '.min.css' }))
            .pipe(header(banners.reset))
            .pipe(gap.appendFile('css/reset-color-overrides.css'))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildBloggerTweaks = () =>
         gulp.src('css/blogger-tweaks/style.less')
            .pipe(less())
            .pipe(css(cssPlugins))
            .pipe(rename('blogger-tweaks.min.css'))
            .pipe(header(banners.blogger))
            .pipe(gap.appendText('\n'))
            .pipe(gap.appendFile('css/blogger-tweaks/instructions.css'))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      return mergeStream(buildReset(), buildBloggerTweaks());
      },
   buildJs() {
      const headerComments = /^\/\/.*\n/gm;
      return gulp.src('js/library.js')
         .pipe(replace('[VERSION]', pkg.version))
         .pipe(replace(headerComments, ''))
         .pipe(header(banners.library))
         .pipe(gulp.dest('dist'))
         .pipe(babel(babelMinifyJs))
         .pipe(rename({ extname: '.min.js' }))
         .pipe(header(banners.library))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(size({ showFiles: true, gzip: true }))
         .pipe(gulp.dest('dist'));
      },
   buildLayouts() {
      const buildCss = () =>
         gulp.src('css/layouts/*.css')
            .pipe(header(banners.layoutCss))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts'));
      const buildJs = () =>
         gulp.src('css/layouts/*.js')
            .pipe(babel(babelMinifyJs))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(header(banners.layoutJs))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts'));
      const copyImages = () =>
         gulp.src('css/layouts/neon/*.jpg')
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts/neon'));
      return mergeStream(buildCss(), buildJs(), copyImages());
      },
   };

// Gulp
gulp.task('validate-specs', task.validateSpecPages);
gulp.task('clean',          task.cleanTarget);
gulp.task('build-css',      task.buildCss);
gulp.task('build-layouts',  task.buildLayouts);
gulp.task('build-js',       task.buildJs);
