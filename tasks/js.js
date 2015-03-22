var gulp=require('gulp');
var path=require('path');

var plumber=require('gulp-plumber');
var notify=require('gulp-notify');
var cache=require('gulp-cached');
var rename=require('gulp-rename');

var jshint=require('gulp-jshint');
var stylish=require('jshint-stylish');
var babel=require('gulp-babel');


var path={
  src:'src/',
  build:'build/'
};
var ignorance=['!./node_modules/**','!./src/libs/**'];


gulp.task('jshint',function(){
  return gulp.src([path.src+'**/*.js',ignorance])
      .pipe(cache('jshint'))
      .pipe(plumber({
        errorHandler: notify.onError("JS lint error: <%= error.message %>")
      }))
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('fail'));
});

gulp.task('jsx',function(){
  return gulp.src([path.src+'**/*.jsx',ignorance])
      .pipe(cache('jsx'))
      .pipe(plumber({
        errorHandler:notify.onError('JSX ERROR: <%= error.message %>')
      }))
      .pipe(babel())
      .pipe(rename({extname:'.js'}))
      .pipe(gulp.dest(path.src))
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('fail'));
});