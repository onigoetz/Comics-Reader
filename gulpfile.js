var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    less = require('gulp-less');

gulp.task('styles', function() {
    return gulp.src(['src/css/jquery.mobile-1.4.0.less', 'src/css/specific.less'])
        .pipe(concat('app.css'))
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('asset/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('asset/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
    gulp.src('src/js/carousel/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));

    gulp.src(['src/js/vendor/modernizr-2.8.1.min.js'])
        .pipe(concat('before-app.js'))
        .pipe(gulp.dest('asset/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('asset/js'));

    return gulp.src([
        'src/js/vendor/zepto-1.1.3.min.js',
        'src/js/vendor/zepto.plugins-1.1.3.js',
        'src/js/vendor/hammer-1.1.2.min.js',
        'src/js/vendor/jquery.unveil.js',
        'src/js/helpers.js',
        'src/js/carousel/carousel-map.js',
        'src/js/carousel/carousel-pane.js',
        'src/js/carousel/carousel.js',
        'src/js/site.js'
    ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('asset/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('asset/js'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts');
});

gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('src/css/**/*.less', ['styles']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

});
