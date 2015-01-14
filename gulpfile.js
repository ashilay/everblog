var gulp = require('gulp'),
	vulcanize = require('gulp-vulcanize');

var del = require('del');


gulp.task('default', ['clean'], function() {
    gulp.start('vulcanize-csp');
});


gulp.task('vulcanize-csp', function () {
    var DEST_DIR = 'dist';

    return gulp.src('index.html')
        .pipe(vulcanize({
            dest: DEST_DIR,
            strip: true,
            csp: true
        }))
        .pipe(gulp.dest(DEST_DIR));
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