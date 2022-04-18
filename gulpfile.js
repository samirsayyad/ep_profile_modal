/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unpublished-require */
'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const inject = require('gulp-inject-string');
const uglify = require('gulp-uglify-es').default;
const mode = require('gulp-mode')();
const sourcemaps = require('gulp-sourcemaps');
const bump = require('gulp-bump');
const git = require('gulp-git');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

const jsfiles = {
  documentReady: './static/js/admin/admin.js',
  contributors: './static/js/contributors/contributors.js',
  profileForm: './static/js/profileForm/main.js',
  usersProfileSection: './static/js/userProfileSection/userProfileSection.js',
  postAceInit: './static/js/postAceInit.js',
  aceInitialized: './static/js/aceInitialized.js',
  handleClientMessage: './static/js/handleClientMessage.js',
  helper: './static/js/helper.js',
  shared: './static/js/shared.js',
  syncData: './static/js/syncData.js',
};

const cssFiles = ['./static/css/**/*.css'];

const gulpifyJs = () => gulp
    .src(Object.entries(jsfiles).map((x) => x[1]))
    .pipe(mode.production(sourcemaps.init()))
    .pipe(concat('ep.profile.modal.mini.js'))
    .pipe(
        inject.append(
            `return {\n${Object.entries(jsfiles).map((x) => `${x[0]}\n`)}}\n`
        )
    )
    .pipe(inject.wrap('exports.moduleList = (()=>{\n', '})();'))
    .pipe(mode.production(uglify(/* options */)))
    .pipe(mode.production(sourcemaps.write('.')))
    .pipe(gulp.dest('./static/dist/js'));

gulp.task('js', gulpifyJs);

gulp.task('minify-css', () => gulp
    .src('static/css/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('static/dist/css'))
);

gulp.task('minify-image', () => gulp.src(
    'static/img/*').pipe(imagemin()).pipe(gulp.dest('static/dist/img'))
);

gulp.task('bump', () => gulp.src('./package.json').pipe(bump()).pipe(gulp.dest('./'))
);

gulp.task('git:publish', () => gulp
    .src([
      './static/dist/js/ep.profile.modal.mini.js',
      './static/dist/js/ep.profile.modal.mini.js.map',
      './package.json',
    ])
    .pipe(git.add())
    .pipe(git.commit('build, version'))
);

gulp.task('git:push', (cb) => {
  git.push('origin', (err) => {
    if (err) throw err;
    cb();
  });
});

gulp.task('watch', () => {
  const watchFiles = [...Object.entries(jsfiles).map((x) => x[1]), ...cssFiles];
  gulp.watch(watchFiles, gulp.series(['js', 'minify-css']));
});

gulp.task(
    'build',
    gulp.series([
      'js',
      'minify-css',
      'minify-image',
      'bump',
      'git:publish',
      'git:push',
    ])
);
