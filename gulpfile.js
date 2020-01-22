"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var posthtml = require("gulp-posthtml");
var del = require("del");

var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(sourcemap.write("."))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("html", function () {
  return gulp.src("source/*.html*")
    .pipe(gulp.dest("build"))
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: false},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest("build/img"))
});

gulp.task("webp", function () {
  return gulp.src("build/img/**/*.{png,jpg}")
    .pipe(webp({quality: 98}))
    .pipe(gulp.dest("build/img"))
});

gulp.task("copy", function () {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/js/**/*.js",
      "source/*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));

})

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", gulp.series("html", server.reload));
});

gulp.task("build", gulp.series("clean", "copy", "css", "html", "images", "webp"));

gulp.task("start", gulp.series("build", "server"));
