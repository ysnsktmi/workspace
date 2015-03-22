var require_dir=require('require-dir');
var nodepath=require('path');
var sequence=require('run-sequence');
var rimraf=require('rimraf');

var gulp=require('gulp');
var changed=require('gulp-changed');
var cached=require('gulp-cached');
var plumber=require('gulp-plumber');
var webserver=require('gulp-webserver');
var notify=require('gulp-notify');

var sass=require('gulp-sass');
var less=require('gulp-less');
var autoprefixer=require('gulp-autoprefixer');
var csscomb=require('gulp-csscomb');
var csslint=require('gulp-csslint');

var spritesmith=require('gulp.spritesmith');
var imagemin=require('gulp-imagemin');

var htmlhint=require('gulp-htmlhint');
var htmlincluder=require('gulp-htmlincluder');
var entityconvert=require('gulp-entity-convert');
var prettify=require('gulp-prettify');
var jshint=require('gulp-jshint');

var zip=require('gulp-zip');

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
  wrap_line_length:0,
  wrap_attributes:false,//[auto|force] ["auto"]
  wrap_attributes_indent_size:0,
  preserve_newlines:true,
  max_preserve_newlines:false,
  unformatted:['img','span','sub','sup','em','strong','b','i','u','strike','big','small',],//["a", "span", "img", "code", "pre", "sub", "sup", "em", "strong", "b", "i", "u", "strike", "big","small", "pre", "h1", "h2", "h3", "h4", "h5", "h6"],
  end_with_newline:false
}
};
// <<CONFIGURE

gulp.task('default',function(){
 console.log('Hello World');
});

gulp.task('watch',function(){
 gulp.watch([path.src+'**/*.html'],['html']);
 gulp.watch([path.src+'**/*.css'],['css']);
 gulp.watch([path.src+'**/*.js'],['jlint']);
 gulp.watch([path.src+'**/*.scss'],['sass']);
});

gulp.task('reload',function(){
gulp.src(['*.html'])
    // .pipe(connect.reload());
  });




// css>>

gulp.task('sass',function(){
 gulp.src(path.src+'**/*.scss')
 .pipe(plumber({
  errorHandler: notify.onError("Error: <%= error.message %>")
}))
 .pipe(sass())
 .pipe(gulp.dest(path.build));
});

gulp.task('less',function(){
 gulp.src(path.src+'**/*.less')
 .pipe(plumber({
  errorHandler: notify.onError("Error: <%= error.message %>")
}))
 .pipe(less())
 .pipe(gulp.dest(path.build));
});


gulp.task('autoprefixer',function(){
 gulp.src(path.src+'/**/*.css')
 .pipe(autoprefixer(config.autoprefixer.version))
 .pipe(gulp.dest(path.build));
});

gulp.task('csscomb',function(){
 gulp.src(path.src+'/**/*.css')
 .pipe(csscomb())
 .pipe(gulp.dest(path.build));
})

gulp.task('clint',function(){
 gulp.src(path.src+'**/*.css')
 .pipe(plumber({
   errorHandler: notify.onError("LintError: <%= error.message %>")
 }))
 .pipe(csslint())
 .pipe(csslint.reporter())
 .pipe(csslint.failReporter());
});

gulp.task('buildcss',function(){
 gulp.src(path.src+'**/*.css')
 .pipe(plumber({
   errorHandler: notify.onError("Error: <%= error.message %>")
 }))
 .pipe(changed(path.build))
 .pipe(autoprefixer(config.autoprefixer.version))
 .pipe(csscomb())
 .pipe(gulp.dest(path.build))
 .pipe(csslint())
 .pipe(csslint.reporter())
 .pipe(csslint.failReporter());
});
gulp.task('buildsass',function(){
 gulp.src(path.src+'**/*.scss')
 .pipe(plumber({
   errorHandler: notify.onError("Error: <%= error.message %>")
 }))
 .pipe(changed(path.build))
 .pipe(sass())
 .pipe(autoprefixer(config.autoprefixer.version))
 .pipe(csscomb())
 .pipe(gulp.dest(path.build))
 .pipe(csslint())
 .pipe(csslint.reporter())
 .pipe(csslint.failReporter());
});
gulp.task('buildless',function(){
 gulp.src(path.src+'**/*.less')
 .pipe(plumber({
   errorHandler: notify.onError("Error: <%= error.message %>")
 }))
 .pipe(changed(path.build))
 .pipe(less())
 .pipe(autoprefixer(config.autoprefixer.version))
 .pipe(csscomb())
 .pipe(gulp.dest(path.build))
 .pipe(csslint())
 .pipe(csslint.reporter())
 .pipe(csslint.failReporter());
});

// <<css


// image>>

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
 var srcGlob=path.src+'**/*.+(jpg|jpeg|png|gif|svg)';
 var dstGlob=path.build;
 var imageminOptions={
  optimizationLevel:7
};
gulp.src(srcGlob)
.pipe(changed(dstGlob))
.pipe(imagemin(imageminOptions))
.pipe(gulp.dest(dstGlob));
});
gulp.task('imagecopy',function(){
 return gulp.src(path.src+'**/*.+(jpg|jpeg|png|gif|svg)',{base:'src'})
 .pipe(changed(path.build))
 .pipe(gulp.dest(path.build));
});


// html>>

gulp.task('entity',function(){
 gulp.src(path.src+'**/*.+(html|ftl)')
 .pipe(entityconvert())
 .pipe(gulp.dest(path.build));
});

gulp.task('prettify', function() {
 gulp.src(path.src+'**/*.+(html|ftl)')
 .pipe(prettify(config.prettify))
 .pipe(gulp.dest(path.build));
});

gulp.task('hlint',function(){
 gulp.src(path.src+'**/*.+(html|ftl)')
 .pipe(plumber({
   errorHandler: notify.onError("HTML Lint Error: <%= error.message %>")
 }))
 .pipe(htmlhint())
 .pipe(htmlhint.reporter())
 .pipe(htmlhint.failReporter());
});

gulp.task('buildhtml',function(){
 gulp.src(path.src+'**/*.html')
 .pipe(plumber({
   errorHandler: notify.onError("HTML Lint Error: <%= error.message %>")
 }))
 .pipe(changed(path.build))
 .pipe(entityconvert())
 .pipe(prettify(config.prettify))
 .pipe(gulp.dest(path.build))
 .pipe(htmlhint())
 .pipe(htmlhint.reporter())
 .pipe(htmlhint.failReporter());
  });
// <<html

// js>>
gulp.task('jlint',function(){
 return gulp.src(path.src+'**/*.js')
 .pipe(plumber({
   errorHandler: notify.onError("JS Lint Error: <%= error.message %>")
 }))
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(jshint.reporter('fail'));
});

// <<js


gulp.task('buildall',function(){
 gulp.src(path.src+'**/*.+(html|ftl)')
   .pipe(plumber({
     errorHandler: notify.onError("HTML ERROR: <%= error.message %>")
   }))
   .pipe(changed(path.build))
   .pipe(entityconvert())
   .pipe(prettify(config.prettify))
   .pipe(gulp.dest(path.build))
   .pipe(htmlhint())
   .pipe(htmlhint.reporter())
   .pipe(htmlhint.failReporter());
 gulp.src(path.src+'**/*.js')
   .pipe(plumber({
     errorHandler: notify.onError("JS ERROR: <%= error.message %>")
   }))
   .pipe(changed(path.build))
   .pipe(jshint())
   .pipe(jshint.reporter('default'))
   .pipe(jshint.reporter('fail'));
 gulp.src(path.src+'**/*.css')
   .pipe(plumber({
     errorHandler: notify.onError("CSS ERROR: <%= error.message %>")
   }))
   .pipe(changed(path.build))
   .pipe(autoprefixer(config.autoprefixer.version))
   .pipe(csscomb())
   .pipe(gulp.dest(path.build))
   .pipe(csslint())
   .pipe(csslint.reporter())
   .pipe(csslint.failReporter());
 gulp.src(path.src+'**/*.scss')
   .pipe(plumber({
     errorHandler: notify.onError("SCSS ERROR: <%= error.message %>")
   }))
   .pipe(changed(path.build))
   .pipe(sass())
   .pipe(autoprefixer(config.autoprefixer.version))
   .pipe(csscomb())
   .pipe(gulp.dest(path.build))
   .pipe(csslint())
   .pipe(csslint.reporter())
   .pipe(csslint.failReporter());
   gulp.src(path.src+'**/*.less')
 .pipe(plumber({
     errorHandler: notify.onError("LESS ERROR: <%= error.message %>")
   }))
   .pipe(changed(path.build))
   .pipe(less())
   .pipe(autoprefixer(config.autoprefixer.version))
   .pipe(csscomb())
   .pipe(gulp.dest(path.build))
   .pipe(csslint())
   .pipe(csslint.reporter())
   .pipe(csslint.failReporter());
});


//file

var date=new Date();
var mm=(date.getMonth()+1<10)? '0'+(date.getMonth()+1):date.getMonth()+1;
var dd=(date.getDate()<10)? '0'+date.getDate():date.getDate();
var hh=(date.getHours()<10)? '0'+date.getHours():date.getHours();
var min=(date.getMinutes()<10)? '0'+date.getMinutes():date.getMinutes();
var name='ZIP'+date.getFullYear()+mm+dd+hh+min+'55';
gulp.task('pack',function(){
  sequence('date','zip','rimraf');
})

gulp.task('zip',function(){
  return gulp.src(path.build+'/archive/**/*.html')
  .pipe(zip(name+'.zip'))
  .pipe(gulp.dest(path.build));
});

gulp.task('date',function(){
  return gulp.src(path.build+'test/**/*.html')
 .pipe(gulp.dest(path.build+'/archive/'+name+'/'));
});

gulp.task('rimraf',function(ENOENT){
  rimraf(path.build+'/archive','ENOENT');
});

//live

gulp.task('serve',function(){
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

gulp.task('live',['watch','webserver','reload']);