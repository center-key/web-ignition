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
import less from            'gulp-less';
import mergeStream from     'merge-stream';
import rename from          'gulp-rename';
import replace from         'gulp-replace';
import size from            'gulp-size';

// Setup
const transpileES6 =   ['@babel/env', { modules: false }];
const babelMinifyJs =  { presets: [transpileES6, 'minify'], comments: false };
const cssPlugins = [
   cssFontMagician({ protocol: 'https:' }),
   cssPresetEnv(),
   cssNano({ autoprefixer: false }),
   ];

// Tasks
const task = {

   makeDistribution() {
      const buildReset = () =>
         gulp.src('css/reset.less')
            .pipe(less())
            .pipe(css(cssPlugins))
            .pipe(rename({ extname: '.min.css' }))
            .pipe(gap.appendFile('css/reset-color-overrides.css'))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('build'));
      const buildBloggerTweaks = () =>
         gulp.src('css/blogger-tweaks/style.less')
            .pipe(less())
            .pipe(css(cssPlugins))
            .pipe(rename('blogger-tweaks.min.css'))
            .pipe(gap.appendText('\n'))
            .pipe(gap.appendFile('css/blogger-tweaks/instructions.css'))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('build'));
      const buildLayoutsJs = () =>
         gulp.src('css/layouts/*.js')
            .pipe(babel(babelMinifyJs))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('build/layouts'));
      const buildJs = () =>
         gulp.src('build/lib-x.js')
            .pipe(replace(/^import.*\n/m, ''))
            .pipe(replace(/^export.*\n/m, ''))
            .pipe(rename({ extname: '.dev.js' }))
            .pipe(size({ showFiles: true }))
            .pipe(gulp.dest('build'))
            .pipe(babel(babelMinifyJs))
            .pipe(rename('lib-x.min.js'))
            .pipe(gap.appendText('\n'))
            .pipe(size({ showFiles: true }))
            .pipe(size({ showFiles: true, gzip: true }))
            .pipe(gulp.dest('build'));
      return mergeStream(
         buildReset(),
         buildBloggerTweaks(),
         buildLayoutsJs(),
         buildJs()
         );
      },

   };

// Gulp
gulp.task('build-files', task.makeDistribution);
