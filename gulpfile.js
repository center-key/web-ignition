// web-ignition
// Gulp tasks

// Imports
import fs      from 'fs';
import gulp    from 'gulp';
import rename  from 'gulp-rename';
import replace from 'gulp-replace';
import size    from 'gulp-size';

// Setup
const pkg =          JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const minorVersion = pkg.version.split('.').slice(0, 2).join('.');
const version =      (name) => pkg.dependencies[name].split('~')[1];
const version1 =     replace('[DNA-ENGINE]',   version('dna-engine'));
const version2 =     replace('[HIGHLIGHTJS]',  version('highlight.js'));
const version3 =     replace('[HLJS-ENHANCE]', version('hljs-enhance'));
const version4 =     replace('[WEB-IGNITION]', minorVersion);

// Tasks
const task = {

   buildLayoutsCss() {
      return gulp.src('src/css/layouts/*.css')
         .pipe(version1).pipe(version2).pipe(version3).pipe(version4)
         .pipe(size({ showFiles: true }))
         .pipe(gulp.dest('build/layouts'));
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
gulp.task('build-layouts-css', task.buildLayoutsCss);
gulp.task('customize-blogger', task.customizeBlogger);
