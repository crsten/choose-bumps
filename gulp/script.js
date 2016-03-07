const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

gulp.task('js',function(){
	gulp.src('src/js/choosebumps.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./dist/'))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('watch:js',['js'],function(){
	gulp.watch('src/js/choosebumps.js',['js']);
});