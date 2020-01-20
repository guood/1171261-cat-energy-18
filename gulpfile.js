"use strict";

const buildPath = "build";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();

gulp.task("css", function () {
  /* временно добавлены стили, которые задают нужные фоновые изображения для верстки страниц
  *  TODO в финальной версии останется только style.scss*/
  return gulp.src(["source/sass/style.scss",
                    "source/sass/dev/index-dev.scss",
                    "source/sass/dev/catalog-dev.scss",
                    "source/sass/dev/form-dev.scss"
                  ])
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("clean", function() {
  return "";
});

gulp.task("copyCssToBuild", function () {
  return gulp.src("source/css/*.css*")
    .pipe(gulp.dest(buildPath + "/css"));
});

gulp.task("copyHtml", function () {
  return gulp.src("source/*.html")
    .pipe(gulp.dest(buildPath))
});

gulp.task("copyFonts", function () {
  return gulp.src("source/fonts/*.woff*")
    .pipe(gulp.dest(buildPath + "/fonts"))
});

gulp.task("copyImg", function () {
  return gulp.src("source/img/**")
    .pipe(gulp.dest(buildPath + "/img"))
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("css", "server"));

gulp.task("buildAll", gulp.parallel(gulp.series("css", "copyCssToBuild"), "copyHtml", "copyFonts", "copyImg"));
