// web-ignition
// Gulp tasks

// Imports
import babel from           'gulp-babel';
import css from             'gulp-postcss';
import cssFontMagician from 'postcss-font-magician';
import cssNano from         'cssnano';
import cssPresetEnv from    'postcss-preset-env';
import gap from             'gulp-append-prepend';
import gulp from            'gulp';
import header from          'gulp-header';
import less from            'gulp-less';
import mergeStream from     'merge-stream';
import rename from          'gulp-rename';
import replace from         'gulp-replace';
import size from            'gulp-size';
import { readFileSync } from 'fs';

// Setup
const pkg =            JSON.parse(readFileSync('./package.json'));
const home =           pkg.homepage.replace('https://', '');
const headerComments = /^\/\/.*\n/gm;
const banner =         'web-ignition v' + pkg.version + ' ~ ' + home + ' ~ MIT License';
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };
const cssPlugins = [
   cssFontMagician({ protocol: 'https:' }),
   cssPresetEnv(),
   cssNano({ autoprefixer: false }),
   ];
const banners = {
   reset:     '/*! reset.css ~ ' + banner + ' */\n',
   blogger:   '/*! Blogger tweaks for Dynamic Views (sidebar) ~ ' + banner + ' */\n',
   library:   '//! lib-x.js ~ ' + banner + '\n',
   layoutCss: '/*! layouts (${filename}) ~ ' + banner + ' */\n',
   layoutJs:  '//! layouts (${filename}) ~ ' + banner + '\n',
   };

// Tasks
const task = {

   makeDistribution() {
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
      const buildLayoutsCss = () =>
         gulp.src('css/layouts/*.css')
            .pipe(header(banners.layoutCss))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts'));
      const buildLayoutsJs = () =>
         gulp.src('css/layouts/*.js')
            .pipe(babel(babelMinifyJs))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(header(banners.layoutJs))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts'));
      const copyLayoutsImages = () =>
         gulp.src('css/layouts/neon/*.jpg')
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts/neon'));
      const buildDts = () =>
         gulp.src('build/lib-x.d.ts')
            .pipe(header(banners.library + '\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'));
      const buildJs = () =>
         gulp.src('build/lib-x.js')
            .pipe(replace('[VERSION]', pkg.version))
            .pipe(replace(headerComments, ''))
            .pipe(header(banners.library + '\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'))
            .pipe(replace(/^import.*\n/m, ''))
            .pipe(replace(/^export.*\n/m, ''))
            .pipe(rename({ extname: '.dev.js' }))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist'))
            .pipe(babel(babelMinifyJs))
            .pipe(rename('lib-x.min.js'))
            .pipe(header(banners.library))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(size({ showFiles: true, gzip: true }))
            .pipe(gulp.dest('dist'));
      return mergeStream(
         buildReset(),
         buildBloggerTweaks(),
         buildLayoutsCss(),
         buildLayoutsJs(),
         copyLayoutsImages(),
         buildDts(),
         buildJs()
         );
      },

   };

// Gulp
gulp.task('make-dist',      task.makeDistribution);
