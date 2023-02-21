const { src, dest, watch, series } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const path = require('path');
const logSymbols = require('log-symbols');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

const options = {
  config: {
    tailwindjs: "./tailwind.config.js",
    port: 6789
  },
  paths: {
    root: "/",
    source: "src",
    build: "www"
  }
}
//Load Previews on Browser on dev
function livePreview(done) {
  browserSync.init({
    server: {
      baseDir: options.paths.build
    },
    port: options.config.port || 9000
  });
  done();
}
// Triggers Browser reload
function previewReload(done) {
  console.log("\n\t" + logSymbols.info, "Reloading Browser Preview.\n");
  browserSync.reload();
  done();
}


// Production

function runPug() {
  return src([`${options.paths.source}/pages/**/*.pug`, `!${options.paths.source}/pages/{common,common/**}`, `!${options.paths.source}/pages/{components,components/**}`]).pipe(pug({ pretty: true, basedir: path.resolve(__dirname, './src/pages') })).pipe(dest(options.paths.build));
}
function styles() {
  const tailwindcss = require('tailwindcss');
  return src(`${options.paths.source}/scss/**/*.scss`).pipe(sourcemaps.init()).pipe(sass().on('error', sass.logError))

    .pipe(dest(`${options.paths.source}/scss/`))
    .pipe(postcss([
      tailwindcss(options.config.tailwindjs),
      require('autoprefixer')
    ]))
    .pipe(cssnano({
      convertValues: {
        length: false
      },
      discardComments: {
        removeAll: true
      },
    }))
    .pipe(concat({ path: 'index.css' }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(dest(options.paths.build));
}

function images() {
  return src(`${options.paths.source}/assets/img/**/*`).pipe(imagemin([
    imagemin.gifsicle({ interlaced: true }),
    imagemin.mozjpeg({ quality: 90, progressive: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({
      plugins: [
        { removeViewBox: true },
        { cleanupIDs: false }
      ]
    })
  ])).pipe(dest(options.paths.build + "/img/"));
}
function docs() {
  return src(`${options.paths.source}/assets/doc/**/*`).pipe(dest(options.paths.build + "/doc/"));
}
function files() {
  return src(`${options.paths.source}/assets/files/**/*`).pipe(dest(options.paths.build + "/files/"));
}

function watchChanges() {
  watch(`${options.paths.source}/pages/**/*.pug`, series(runPug, styles, previewReload));
  watch([options.config.tailwindjs, `${options.paths.source}/scss/**/*.scss`], series(styles, previewReload));
  watch(`${options.paths.source}/js/**/*`, series(styles, previewReload));
  watch(`${options.paths.source}/assets/img/**/*`, series(images, previewReload));
  watch(`${options.paths.source}/assets/doc/**/*`, series(docs, previewReload));
  watch(`${options.paths.source}/assets/files/**/*`, series(files, previewReload));
  console.log("\n\t" + logSymbols.info, "Watching for Changes..\n");
}
exports.prod = series(docs, files, images, styles, runPug)
exports.default = series(docs, files, images, styles, runPug, livePreview, watchChanges)
