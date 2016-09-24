var gulp = require('gulp');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var connect = require('connect');
var clean = require('gulp-clean');


// Clean
gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

// HTML
gulp.task('html', function() {
  return gulp.src('app/*.html')
  .pipe(gulp.dest('dist'))
});

gulp.task('sjs', function() {
  return gulp.src('app/*.js')
  .pipe(gulp.dest('dist'))
});

gulp.task('pages', function() {
  return gulp.src('app/pages/*')
  .pipe(gulp.dest('dist/pages'))
});

// CSS
gulp.task('css', function() {
  return gulp.src('app/css/*.css')
  //.pipe(cssnano())
  .pipe(gulp.dest('dist/css'))
});
// JS
gulp.task('js', function() {
  return gulp.src('app/js/*.js')
  .pipe(gulp.dest('dist/js'))
});
// Images
gulp.task('images', function(){
    return gulp.src('app/img/*')
        //.pipe(imagemin())
        .pipe(gulp.dest('dist/img'));
});
//Fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/*')
  .pipe(gulp.dest('dist/fonts'))
})

//Fonts
gulp.task('fonts-awesome', function() {
  return gulp.src('app/font-awesome/**/*')
  .pipe(gulp.dest('dist/font-awesome'))
})


// Static Server + watching scss/html files
gulp.task('serve', [], function() {

    browserSync.init({
        server: "./dist",
        port: 9393
    });

    //gulp.watch("app/*.html").on('change', browserSync.reload);
   
});

gulp.task('watch', function(){
  /*  gulp.watch('app/css/*.css').on('change', browserSync.reload);
    gulp.watch('app/js/*.js').on('change', browserSync.reload);*/
    //gulp.watch('app/*').on('change', browserSync.reload);
     gulp.watch('dist/*').on('change', browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence('clean', 
    ['html', 'sjs', 'pages', 'css', 'js','images', 'fonts', 'fonts-awesome'],
    'serve',
    'watch',
    callback
  )
});
gulp.task('default', function (callback) {
  runSequence('clean', 
    ['html', 'sjs', 'pages', 'css', 'js','images', 'fonts', 'fonts-awesome'],
    'serve',
    'watch',
    callback
  )
});
