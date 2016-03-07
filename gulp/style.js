const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');

gulp.task('sass',function(){
	gulp.src('src/style/**/*.scss')
		.pipe(sass().on('error',sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest('./dist/'))
		.pipe(cssnano())
		.pipe(rename({extname: '.min.css'}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('watch:sass',['sass'],function(){
	gulp.watch('src/style/**/*.scss',['sass']);
});
