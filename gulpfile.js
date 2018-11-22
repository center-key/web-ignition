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
const pkg = require('./package.json');
const banner = `${pkg.name} v${pkg.version} ~~ ${pkg.homepage} ~~ ${pkg.license} License`;
const htmlHintConfig = { 'attr-value-double-quotes': false };
const cssPlugins = [
   cssFontMagician({ protocol: 'https:' }),
   cssPresetEnv(),
   cssNano({ autoprefixer: false })
   ];

// Tasks
const task = {
   validateSpecPages: function() {
      return gulp.src(['css/*.html', 'js/*.html', 'css/layouts/*.html'])
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter())
         .pipe(size({ showFiles: true }));
      },
   cleanTarget: function() {
      return del('dist');
      },
   buildCss: function() {
      return gulp.src('css/reset.less')
         .pipe(less())
         .pipe(css(cssPlugins))
         .pipe(rename({ extname: '.min.css' }))
         .pipe(header('/*! reset.css ~~ ' + banner + ' */\n'))
         .pipe(gap.appendFile('css/reset-color-overrides.css'))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'));
      },
   buildJs: function() {
      const transpileES6 = ['@babel/env', { modules: false }];
      return gulp.src('js/library.js')
         .pipe(replace('[VERSION]', pkg.version))
         .pipe(babel({ presets: [transpileES6, 'minify'], comments: false }))
         .pipe(rename({ extname: '.min.js' }))
         .pipe(header('//! library.js ~~ ' + banner + '\n'))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'));
      },
   buildLayouts: function() {
      return mergeStream(
         gulp.src('css/layouts/*.css')
            .pipe(header('/*! ' + banner + ' */\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts')),
         gulp.src('css/layouts/neon/*.jpg')
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('dist/layouts/neon'))
         );
      }
   };

// Gulp
gulp.task('validate-specs', task.validateSpecPages);
gulp.task('clean',          task.cleanTarget);
gulp.task('build-css',      task.buildCss);
gulp.task('build-layouts',  task.buildLayouts);
gulp.task('build-js',       task.buildJs);
