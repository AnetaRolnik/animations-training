const gulp = require("gulp");
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const c = require('ansi-colors');
const notifier = require('node-notifier');

//TEST
// gulp.task("moje", function() {
//   console.log("To jest moje zadanie 1");
//   console.log("To jest moje zadanie 2");
//   console.log("To jest moje zadanie 3");
//   console.log("To jest moje zadanie 4");
// });
//

function showError(err) {
  notifier.notify({
    title: "Blad kompliacji CSS",
    message: "err.messageFormatted",
  })

  console.log(c.red("--------------"));
  console.log(c.red(err.messageFormatted));
  console.log(c.red("--------------"));
  this.emit("end");
}

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        browser: "chrome"
    });
});

gulp.task('sass', function () {
  return gulp.src('./scss/main.scss')
    .pipe(plumber({
      errorHandler: showError //nie ma takiej funkcji, musimy ją stworzyć
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle : "compressed" //nested, expanded, compact, compressed
    }))
    // autoprefixer zawsze wrzucamy ponizej sassa, inaczej nie zadziala!
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./css')) //przy pipe średnik ma być na końcu tylko!
    .pipe(browserSync.stream()); //odświeża css bez przeładowania strony
});

gulp.task("watch", function(){
  gulp.watch("./scss/**/*.scss", ["sass"]);
  gulp.watch("*.html").on('change', browserSync.reload);
})


// task default odpala zadania z tablicy na początku
gulp.task("default", function(){
  console.log(c.bgYellow("=== Rozpoczęcie pracy ===="));
  gulp.start(["sass", "browser-sync", "watch"]);
})
