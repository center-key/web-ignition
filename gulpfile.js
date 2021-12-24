// web-ignition
// Gulp tasks

// Imports
import { readFileSync } from 'fs';
import babel            from 'gulp-babel';
import css              from 'gulp-postcss';
import cssFontMagician  from 'postcss-font-magician';
import cssNano          from 'cssnano';
import cssPresetEnv     from 'postcss-preset-env';
import gap              from 'gulp-append-prepend';
import gulp             from 'gulp';
import less             from 'gulp-less';
import rename           from 'gulp-rename';
import replace          from 'gulp-replace';
import size             from 'gulp-size';

// Setup
const pkg =           JSON.parse(readFileSync('package.json', 'utf8'));
const minorVersion =  pkg.version.split('.').slice(0, 2).join('.');
const version =       (name) => pkg.dependencies[name].split('~')[1];
const version1 =      replace('[DNAJS]',        version('dna.js'));
const version2 =      replace('[HIGHLIGHTJS]',  version('highlight.js'));
const version3 =      replace('[HLJS-ENHANCE]', version('hljs-enhance'));
const version4 =      replace('[WEB-IGNITION]', minorVersion);
const transpileES6 =  ['@babel/env', { modules: false }];
const babelMinifyJs = { presets: [transpileES6, 'minify'], comments: false };
const cssPlugins = [
   cssFontMagician({ protocol: 'https:' }),
   cssPresetEnv(),
   cssNano({ autoprefixer: false }),
   ];

// Tasks
const task = {

   buildResetCss() {
      return gulp.src('css/reset.less')
         .pipe(less())
         .pipe(size({ showFiles: true, gzip: true }))  //workaround to prevent "Error: read ECONNRESET" (revisit with Gulp v5.0)
         .pipe(css(cssPlugins))
         .pipe(rename({ extname: '.min.css' }))
         .pipe(gap.appendFile('css/reset-color-overrides.css'))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'));
      },

   buildLayoutsCss() {
      return gulp.src('css/layouts/*.css')
         .pipe(version1).pipe(version2).pipe(version3).pipe(version4)
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build/layouts'));
      },

   buildBloggerCss() {
      return gulp.src('css/blogger-tweaks/style.less')
         .pipe(less())
         .pipe(css(cssPlugins))
         .pipe(rename('blogger-tweaks.min.css'))
         .pipe(gap.appendText('\n'))
         .pipe(gap.appendFile('css/blogger-tweaks/instructions.css'))
         .pipe(version1).pipe(version2).pipe(version3).pipe(version4)
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'));
      },

   buildLayoutsJs() {
      return gulp.src('css/layouts/*.js')
         .pipe(babel(babelMinifyJs))
         .pipe(rename({ extname: '.min.js' }))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build/layouts'));
      },

   buildLibJs() {
      return gulp.src('build/lib-x.js')
         .pipe(replace(/^import.*\n/m, ''))
         .pipe(replace(/^export.*\n/m, ''))
         .pipe(rename({ extname: '.dev.js' }))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'))
         .pipe(babel(babelMinifyJs))
         .pipe(rename('lib-x.min.js'))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'));
      },

   customizeBlogger() {
      return gulp.src('build/blogger-tweaks.min.css')
         .pipe(rename('blogger-tweaks-custom.css'))
         .pipe(replace('[SHORT-BLOG-NAME]',                'Dem&apos;s Blog'))
         .pipe(replace('[URL-FOR-bookmark.png]',           'https://centerkey.com/graphics/bookmark.png'))
         .pipe(replace('[URL-FOR-mobile-home-screen.png]', 'https://centerkey.com/graphics/mobile-home-screen.png'))
         .pipe(replace('[AUTHORS-URL]',                    'https://centerkey.com/dem'))
         .pipe(replace('[TWITTER-USERNAME]',               'DemPilafian'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'));
      },

   };

// Gulp
gulp.task('build-reset-css',   task.buildResetCss);
gulp.task('build-layouts-css', task.buildLayoutsCss);
gulp.task('build-blogger-css', task.buildBloggerCss);
gulp.task('build-layouts-js',  task.buildLayoutsJs);
gulp.task('build-lib-js',      task.buildLibJs);
gulp.task('customize-blogger', task.customizeBlogger);
