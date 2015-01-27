var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass');


function styles_generator(filename, destination) {
    return gulp.src(filename)
        .pipe(rename(destination + '.css'))
        .pipe(sass())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('asset/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('asset/css'))
        .pipe(notify({ message: 'Styles task complete' }));
}

gulp.task('styles', ['styles-base', 'styles-ios', 'styles-android']);

gulp.task('styles-base', function() {
    return styles_generator('src/css/app.scss', 'app');
});

gulp.task('styles-ios', function() {
    return styles_generator('src/css/ratchet/theme-ios.scss', 'theme-ios');
});

gulp.task('styles-android', function() {
    return styles_generator('src/css/ratchet/theme-android.scss', 'theme-android');
});

gulp.task('scripts', function() {
    return gulp.src([
        'src/js/vendor/zepto-1.1.4.min.js',
        'src/js/vendor/zepto.plugins-1.1.4.js',
        'src/js/vendor/jquery.unveil.js',

        //'src/js/vendor/ratchet/modals.js',
        //'src/js/vendor/ratchet/popovers.js',
        'src/js/vendor/ratchet/push.js',
        //'src/js/vendor/ratchet/segmented-controllers.js',
        //'src/js/vendor/ratchet/sliders.js',
        //'src/js/vendor/ratchet/toggles.js',
        //'src/js/vendor/ratchet/fingerblast.js',

        'src/js/photoswipe/photoswipe.js',
        'src/js/photoswipe/photoswipe-ui-default.js',

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
    gulp.watch('src/css/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);
});
