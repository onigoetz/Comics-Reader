var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano');

gulp.task('styles', function() {
    var processors = [
        autoprefixer({browsers: ['last 4 version']}),
        cssnano(),
    ];

    return gulp.src('src/css/app.scss')
        .pipe(plumber())
        .pipe(rename('app.css'))
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('asset/css'));
});

gulp.task('default', function() {
    gulp.start('styles');
});

gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('src/css/**/*.scss', ['styles']);
});
