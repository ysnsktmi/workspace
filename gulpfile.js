var gulp=require('gulp');
var sass=require('gulp-sass');
var less=require('gulp-less');
var autoprefixer=require('gulp-autoprefixer');
var csscomb=require('gulp-csscomb');
var csslint=require('gulp-csslint');
var spritesmith=require('gulp.spritesmith');
var plumber=require('gulp-plumber');
var webserver=require('gulp-webserver');
var notify=require('gulp-notify');
var imagemin=require('gulp-imagemin');
var changed=require('gulp-changed');
var entityconvert=require('gulp-entity-convert');
var prettify=require('gulp-prettify');
var hvalid=require('gulp-html-validator');
var jshint=require('gulp-jshint');

// CONFIGURE>>
var path={
  src:'src/',
  build:'htdocs/',
  docs:'docs/'
};
var config={
  autoprefixer:{
    version:['last 2 version','ie 8','ie 7']
  },
  sprite:{
    srcimg:path.src+'sprite/*',
    imgName:'sprite.png',
    cssName:'sprite.scss'
  },
  prettify:{
    indent_inner_html:false,
    indent_size:2,
    indent_char:" ",
    brace_style:"collapse",//[collapse|expand|end-expand|none]
    indent_scripts:"normal",//[keep|separate|normal]
    wrap_line_length:false,
    wrap_attributes:false,//[auto|force] ["auto"]
    wrap_attributes_indent_size:0,
    preserve_newlines:true,
    max_preserve_newlines:false,
    unformatted:true,
    end_with_newline:true
  }
};
// <<CONFIGURE

gulp.task('default',function(){
  console.log('Hello World');
});

gulp.task('watch',function(){
  gulp.watch([path.build+'*.html'],['html']);
  gulp.watch([path.build+'*.css'],['css']);
  gulp.watch([path.build+'*.js'],['jlint']);
  gulp.watch([path.src+'*.scss'],['sass']);
});

gulp.task('reload',function(){
  gulp.src(['*.html'])
      // .pipe(connect.reload());
});

gulp.task('sass',function(){
  gulp.src(path.src+'*.scss')
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
  .pipe(sass())
  .pipe(autoprefixer(config.autoprefixer.version))
  .pipe(csscomb())
  .pipe(gulp.dest(path.build))
  // .pipe(connect.reload());
});

gulp.task('autoprefixer',function(){
  gulp.src(path.build+'*.css')
  .pipe(autoprefixer(config.autoprefixer.version))
  .pipe(gulp.dest(path.build));
});

gulp.task('sprite',function(){
  var spriteData=gulp.src(config.sprite.srcimg)
  .pipe(spritesmith({
    imgName:config.sprite.imgName,
    cssName:config.sprite.cssName
  }));
  spriteData.img.pipe(gulp.dest(path.build));
  spriteData.css.pipe(gulp.dest(path.src));
});

gulp.task('imagemin',function(){
  var srcGlob=path.src+'/**/*.+(jpg|jpeg|png|gif|svg)';
  var dstGlob=path.build;
  var imageminOptions={
    optimizationLevel:7
  };

  gulp.src(srcGlob)
    .pipe(changed(dstGlob))
    .pipe(imagemin(imageminOptions))
    .pipe(gulp.dest(dstGlob));
});

gulp.task('serve', function(){
  connect.server({
    root:path.build,
    livereload:true
  });
});

gulp.task('webserver',function(){
  gulp.src('htdocs')
      .pipe(webserver({
        port:8000,
        livereload:true,
        // directoryListing:true,
        open:true
      }));
});

gulp.task('entity',function(){
  gulp.src(path.build+'*.html')
      .pipe(entityconvert())
      .pipe(gulp.dest(path.build));
});

gulp.task('prettify', function() {
  gulp.src(path.build+'*.html')
    .pipe(prettify(config.prettify))
    .pipe(gulp.dest(path.build));
});

gulp.task('hlint',function(){
  gulp.src(path.build+'*.html')
      .pipe(hvalid())
      .pipe(gulp.dest(path.docs+'lint/'));
});

gulp.task('jlint',function(){
  return gulp.src(path.build+'*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .on('error',notify.onError({message:'JS hint fail'}));
});

gulp.task('clint',function(){
  gulp.src(path.build+'*.css')
      .pipe(csslint())
      .pipe(csslint.reporter());
});

gulp.task('html',function(){
  gulp.src(path.build+'*.html')
      .pipe(plumber())
      .pipe(entityconvert())
      .pipe(prettify(config.prettify))
      .pipe(gulp.dest(path.build))
      .pipe(hvalid())
      .pipe(gulp.dest(path.docs+'lint/'));
});

gulp.task('build',function(){
  gulp.src(path.build+'*.html')
      .pipe(entityconvert())
      .pipe(prettify(config.prettify))
      .pipe(gulp.dest(path.build))
      .pipe(hvalid())
      .pipe(gulp.dest(path.docs+'lint/'));
  gulp.src(path.build+'*.css')
      .pipe(plumber())
      .pipe(sass())
      .pipe(autoprefixer(config.autoprefixer.version))
      .pipe(csscomb())
      .pipe(csslint())
      .pipe(csslint.reporter())
      .pipe(gulp.dest(path.build));
  gulp.src(path.build+'*.js')
      .pipe(jshint())
      .pipe(notify(jshint.reporter('default')));
});

gulp.task('style',function(){
  gulp.src(path.src+'*.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer(config.autoprefixer.version))
  .pipe(csscomb())
  .pipe(gulp.dest(path.build))
  .pipe(csslint())
  .pipe(csslint.reporter())
});

gulp.task('css',function(){
  gulp.src(path.build+'*.css')
  .pipe(plumber())
  .pipe(autoprefixer(config.autoprefixer.version))
  .pipe(csscomb())
  .pipe(gulp.dest(path.build))
  .pipe(csslint())
  .pipe(csslint.reporter())
});

gulp.task('live',['watch','webserver','reload']);