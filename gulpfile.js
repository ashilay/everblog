var gulp = require('gulp'),
	vulcanize = require('gulp-vulcanize');


gulp.task('default', function () {
    var DEST_DIR = 'dist';

    return gulp.src('index.html')
        .pipe(vulcanize({
            dest: DEST_DIR,
            strip: true
        }))
        .pipe(gulp.dest(DEST_DIR));
});