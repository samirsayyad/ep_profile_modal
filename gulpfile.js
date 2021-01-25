const gulp = require('gulp');
const concat = require('gulp-concat');
const inject = require('gulp-inject-string');
const uglify = require('gulp-uglify-es').default;
const mode = require('gulp-mode')();
const sourcemaps = require('gulp-sourcemaps');
const bump = require('gulp-bump');
const git = require('gulp-git');

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

const gulpifyJs = () => {
	return gulp.src(Object.entries(jsfiles).map(x => x[1]))
	.pipe(mode.production(sourcemaps.init()))
	.pipe(concat('ep.profile.modal.mini.js'))
	.pipe(inject.append(`return {\n${Object.entries(jsfiles).map(x => `${x[0]}\n`)}}\n`))
	.pipe(inject.wrap(`exports.moduleList = (()=>{\n`, '})();'))
	.pipe(mode.production(uglify(/* options */)))
	.pipe(mode.production(sourcemaps.write('.')))
	.pipe(gulp.dest('./static/dist/js'));
}

gulp.task('js', gulpifyJs);

gulp.task('bump', () => {
	return gulp.src('./package.json')
	.pipe(bump())
	.pipe(gulp.dest('./'));
});

gulp.task('git:publish', function(){
  return gulp.src([
		'./static/dist/js/ep.profile.modal.mini.js',
		'./static/dist/js/ep.profile.modal.mini.js.map',
		'./package.json'
	])
	.pipe(git.add())
	.pipe(git.commit('build, version'))
});

gulp.task('git:push', () => {
  git.push('origin', (err) => {
    if (err) throw err;
  });
});

gulp.task('watch', () => {
	gulp.watch(Object.entries(jsfiles).map(x => x[1]), gulp.series(['js']))
});

gulp.task('build', gulp.series(['js', 'bump', 'git:publish', 'git:push']));
