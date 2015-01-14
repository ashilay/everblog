var gulp = require('gulp'),
	vulcanize = require('gulp-vulcanize');

var del = require('del');


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

gulp.task('default', ['clean'], function() {
    gulp.start('vulcanize-csp');
});