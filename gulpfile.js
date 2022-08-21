const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()

function html () {
    return gulp.src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('dist'))
}

function scss () {
    return gulp.src('src/scss/**.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(gulp.dest('dist'))
}

function clear () {
    return del('dist')
}

function serve() {
    sync.init({
        server: './dist'
    })

    gulp.watch('src/**.html', gulp.series(html)).on('change', sync.reload)
    gulp.watch('src/scss/**.scss', gulp.series(scss)).on('change', sync.reload)
    gulp.watch('dist/js/**.js').on('change', sync.reload)
}

exports.html = html
exports.scss = scss
exports.clear = clear
exports.serve = serve

exports.build = gulp.series(clear, scss, html)
exports.ready = gulp.series(clear, scss, html, serve)