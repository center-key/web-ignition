// web-ignition
// Gulp tasks

// Imports
import css             from 'gulp-postcss';
import cssFontMagician from 'postcss-font-magician';
import cssNano         from 'cssnano';
import cssPresetEnv    from 'postcss-preset-env';
import fs              from 'fs';
import gap             from 'gulp-append-prepend';
import gulp            from 'gulp';
import less            from 'gulp-less';
import rename          from 'gulp-rename';
import replace         from 'gulp-replace';
import size            from 'gulp-size';

// Setup
const pkg =          JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const minorVersion = pkg.version.split('.').slice(0, 2).join('.');
const version =      (name) => pkg.dependencies[name].split('~')[1];
const version1 =     replace('[DNAJS]',        version('dna.js'));
const version2 =     replace('[HIGHLIGHTJS]',  version('highlight.js'));
const version3 =     replace('[HLJS-ENHANCE]', version('hljs-enhance'));
const version4 =     replace('[WEB-IGNITION]', minorVersion);
const cssPlugins = [
   cssFontMagician({ protocol: 'https:' }),
   cssPresetEnv(),
   cssNano({ autoprefixer: false }),
   ];

// Tasks
const task = {

   buildResetCss() {
      return gulp.src('src/css/reset.less')
         .pipe(less())
         .pipe(size({ showFiles: true, gzip: true }))  //workaround to prevent "Error: read ECONNRESET" (revisit with Gulp v5.0)
         .pipe(css(cssPlugins))
         .pipe(rename({ extname: '.min.css' }))
         .pipe(gap.appendFile('src/css/reset-color-overrides.css'))
         .pipe(gap.appendText('\n'))
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build'));
      },

   buildLayoutsCss() {
      return gulp.src('src/css/layouts/*.css')
         .pipe(version1).pipe(version2).pipe(version3).pipe(version4)
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build/layouts'));
      },

   buildBloggerCss() {
      return gulp.src('src/css/blogger-tweaks/style.less')
         .pipe(less())
         .pipe(css(cssPlugins))
         .pipe(rename('blogger-tweaks.min.css'))
         .pipe(gap.appendText('\n'))
         .pipe(gap.appendFile('src/css/blogger-tweaks/instructions.css'))
         .pipe(version1).pipe(version2).pipe(version3).pipe(version4)
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
gulp.task('customize-blogger', task.customizeBlogger);
