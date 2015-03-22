var gulp=require('gulp');
var path=require('path');

var plumber=require('gulp-plumber');
var notify=require('gulp-notify');
var cache=require('gulp-cached');
var rename=require('gulp-rename');

var htmlhint=require("gulp-htmlhint");


var path={
  src:'src/',
  build:'build/'
};
var ignorance=['!./node_modules/**','./src/libs/**'];

var htmlrc={
    "tagname-lowercase":true,
    "attr-lowercase":true,
    "attr-value-double-quotes":true,
    "attr-value-not-empty":true,
    "attr-no-duplication":true,
    "doctype-first":true,
    "tag-pair":true,
    "tag-self-close":true,
    "spec-char-escape":true,
    "id-unique":true,
    "src-not-empty":true,
    "head-script-disabled":false,
    "img-alt-require":true,
    "doctype-html5":true,
    "id-class-value":true,
    "style-disabled":true,
    "space-tab-mixed-disabled":true,
    "id-class-ad-disabled":true,
    "href-abs-or-rel":false,
    "attr-unsafe-chars":true
}



gulp.task('hthint',function(){
  return gulp.src([path.src+'**/*.html',ignorance.join()])
      .pipe(cache('hthint'))
      .pipe(plumber({
            errorHandler: notify.onError("HTML lint error: <%= error.message %>")
          }))
      .pipe(htmlhint(htmlrc))
      .pipe(htmlhint.reporter())
      .pipe(htmlhint.failReporter())
});