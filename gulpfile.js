// web-ignition
// Gulp tasks

// Imports
const babel =         require('gulp-babel');
const del =           require('del');
const gulp =          require('gulp');
const header =        require('gulp-header');
const htmlHint =      require('gulp-htmlhint');
const htmlValidator = require('gulp-w3c-html-validator');
const rename =        require('gulp-rename');
const replace =       require('gulp-replace');
const size =          require('gulp-size');

// Setup
const pkg = require('./package.json');
const banner = `${pkg.name} v${pkg.version} ~~ ${pkg.homepage} ~~ ${pkg.license} License`;
const htmlHintConfig = { 'attr-value-double-quotes': false };

// Tasks
const task = {
   validateSpecPage: function() {
      return gulp.src('js/spec.html')
         .pipe(htmlHint(htmlHintConfig))
         .pipe(htmlHint.reporter())
         .pipe(htmlValidator())
         .pipe(htmlValidator.reporter());
      },
   cleanTarget: function() {
      return del('dist');
      },
   buildJs: function() {
      const transpileES6 = ['@babel/env', { modules: false }];
      return gulp.src('js/library.js')
         .pipe(replace('[VERSION]', pkg.version))
         .pipe(babel({ presets: [transpileES6, 'minify'], comments: false }))
         .pipe(rename('library.min.js'))
         .pipe(replace(/$/, '\n'))
         .pipe(header('//! library.js ~~ ' + banner + '\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('dist'));
      }
   };

// Gulp
gulp.task('validate-spec', task.validateSpecPage);
gulp.task('clean',         task.cleanTarget);
gulp.task('build-js',      task.buildJs);
