'use strict';

const gulp = require('gulp');
const bump = require('gulp-bump');
const git = require('gulp-git');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const exec = require('child_process').exec;


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

gulp.task('minify-css', () => gulp
  .src('static/css/**/*.css')
  .pipe(cleanCSS({ compatibility: 'ie8' }))
  .pipe(gulp.dest('static/dist/css'))
);

gulp.task('minify-image', () => gulp.src(
  'static/img/*').pipe(imagemin()).pipe(gulp.dest('static/dist/img'))
);

gulp.task('bump', () => gulp.src('./package.json').pipe(bump()).pipe(gulp.dest('./'))
);

gulp.task('git:publish', () => gulp.src([
  './static/dist/',
  './package.json',
]).pipe(git.add())
  .pipe(git.commit('build, version')));

gulp.task('git:push', (cb) => {
  git.push('origin', (err) => {
    if (err) throw err;
    cb();
  });
});

gulp.task('watch', (cb) => {
  const watchFiles = [
    ...cssFiles,
    ...imageFiles,
    ...jsfilesn,
  ];

  gulp.watch(watchFiles, gulp.series(['minify-css', 'rollup-build']));
});

gulp.task('rollup-build', (cb) => {
  exec('npm run rollup:build', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build', gulp.series([
  'rollup-build',
  'minify-css',
  'minify-image',
  'bump',
  'git:publish',
  'git:push',
]));
