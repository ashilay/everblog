var gulp = require('gulp'),
	  vulcanize = require('gulp-vulcanize'),
    jshint = require('gulp-jshint');

var del = require('del');
var packageJSON  = require('./package');
var jshintConfig = packageJSON.jshintConfig;
var stylish = require('jshint-stylish');;

gulp.task('default', ['clean', 'lint'], function() {
    gulp.start('vulcanize-csp');
});


gulp.task('lint', function() {
    return gulp.src('components/*.html')
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish)); // or 'default'
});


gulp.task('vulcanize-csp', function () {
    var DEST_DIR = 'dist';

    return gulp.src('index.html')
        .pipe(vulcanize({
            dest: DEST_DIR,
            strip: true,
            csp: true
        }))
        .pipe(gulp.dest(DEST_DIR))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function(cb) {
    del(['dist/'], cb)
});


gulp.task('watch', function() {
	// Watch components
	gulp.watch('components/*.html', ['default']);

	// Watch .scss files
  // gulp.watch('components./*css', ['styles']);

  // Watch .js files
  // gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  // gulp.watch('src/images/**/*', ['images']);

});