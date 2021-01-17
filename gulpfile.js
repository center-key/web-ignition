// web-ignition
// Gulp tasks

// Imports
import babel from           'gulp-babel';
import del from             'del';
import css from             'gulp-postcss';
import cssFontMagician from 'postcss-font-magician';
import cssNano from         'cssnano';
import cssPresetEnv from    'postcss-preset-env';
import gap from             'gulp-append-prepend';
import gulp from            'gulp';
import header from          'gulp-header';
import htmlHint from        'gulp-htmlhint';
import less from            'gulp-less';
import mergeStream from     'merge-stream';
import rename from          'gulp-rename';
import replace from         'gulp-replace';
import size from            'gulp-size';
import { htmlValidator } from 'gulp-w3c-html-validator';
import { readFileSync } from 'fs';

// Setup
const pkg =            JSON.parse(readFileSync('./package.json'));
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
         .pipe(htmlValidator.analyzer())
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
