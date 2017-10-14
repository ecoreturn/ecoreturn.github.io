const del = require('del')
const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const csso = require('gulp-csso')
const less = require('gulp-less')
const gulpSequence = require('gulp-sequence')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const imagemin = require('gulp-imagemin')

const srcPath = './src/'
const destPath = './dest/'
const revPath = './rev/'

const log = console.log


const filter = {
  less: srcPath + '*.less',
  html: srcPath + "*.html",
  img: srcPath + "imgs/*.*"
}


gulp.task('del', (cb) => {
  del(destPath).then(() => {
    log('dest dir clear')
    cb()
  })
})

gulp.task('less', function (cb) {
  gulp.src(filter.less)
    .pipe(less())
    .pipe(csso())
    .pipe(rev())
    .pipe(gulp.dest(destPath))
    .pipe(rev.manifest())
    .pipe(gulp.dest(revPath + '/css'))
    .on('end', cb)
});

gulp.task('image', function (cb) {
  // content
  gulp.src(filter.img)
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest(destPath + '/imgs'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(revPath))
    .on('end', cb)
});

gulp.task('html', function (cb) {
  gulp.src([revPath + '/**/*.json', filter.html])
    .pipe(revCollector())
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(destPath))
    .on('end', cb)
})
gulp.task('delRev', function (cb) {
  del(revPath).then(() => {
    cb()
  })
});


gulp.task('default', gulpSequence('del', 'less', 'image', 'html', 'delRev'))