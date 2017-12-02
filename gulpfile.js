const gulp           = require('gulp');
const browserSync    = require('browser-sync');
const sass           = require('gulp-sass');
const notify         = require('gulp-notify');
const autoprefixer   = require('gulp-autoprefixer');
const rename         = require('gulp-rename');
const cleanCSS       = require('gulp-clean-css');
const concat         = require('gulp-concat');
const uglify         = require('gulp-uglify');
const spritesmith    = require('gulp.spritesmith');
const imagemin       = require('gulp-imagemin');
const pngquant       = require('imagemin-pngquant');
const mozjpeg        = require('imagemin-mozjpeg');
const cache          = require('gulp-cache');
const del            = require('del');
const plumber        = require('gulp-plumber');

gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'dev'
		},
		notify: false,
		port: 3000,
		ui: {
			port: 3001,
		}
	})
})

gulp.task('sass', function() {
	return gulp.src('dev/sass/main.sass')
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'SASS ERROR',
					message: err.message
				};
			})
		}))
		.pipe(sass({
				outputStyle: 'expanded',
				indentType: 'tab',
				indentWidth: '1'
			}))
		.pipe(autoprefixer({
			browsers: ['last 10 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('dev/css'))
		.pipe(rename({
			prefix : '',
			basename: 'main',
			suffix: '.min',
			extname: '.css'
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dev/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src([
		'dev/libs/jquery/jquery-3.2.1.min.js',
		'dev/libs/bxslider-4/jquery.bxslider.min.js',
		'dev/libs/mixitup/dist/mixitup.min.js',
		'dev/libs/waypoints/lib/jquery.waypoints.min.js',
		'dev/libs/jquery.counterup/jquery.counterup.js',
		'dev/js/custom.js',
		])
	.pipe(concat('main.js'))
	.pipe(gulp.dest('dev/js'))
	.pipe(rename({
			prefix : '',
			basename: 'main',
			suffix: '.min',
			extname: '.js'
		}))
	.pipe(uglify())
	.pipe(gulp.dest('dev/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('cleansprite', function() {
    return del.sync('dev/img/sprite/sprite.png');
});

gulp.task('spritemade', function() {
	var spriteData =
	gulp.src('dev/img/sprite/*.*')
	.pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.sass',
		imgPath: '../img/sprite/sprite.png',
		padding: 10,
		cssFormat: 'sass',
		algorithm: 'binary-tree',
		cssVarMap: function(sprite) {
			sprite.name = 's-' + sprite.name;
		}
	}));
	spriteData.img.pipe(gulp.dest('dev/img/sprite'));
	spriteData.css.pipe(gulp.dest('dev/sass'));
	});

gulp.task('sprite', ['cleansprite', 'spritemade']);

gulp.task('watch', ['sass', 'js', 'browserSync'], function() {
	gulp.watch('dev/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'dev/js/custom.js'], ['js']);
	gulp.watch('dev/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src(['dev/img/**/*','!dev/img/sprite/!(sprite.png)'])
		.pipe(imagemin([
			pngquant(),
			mozjpeg()
		],{
			verbose: true
		}))
		.pipe(gulp.dest('build/img'));
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('del', function() {
	return del.sync('build');
});

gulp.task('build', ['del', 'imagemin', 'sass', 'js'], function() {

	var buildHtml = gulp.src('dev/*.html')
		.pipe(gulp.dest('build'));

	var buildFonts = gulp.src('dev/fonts/**/*')
		.pipe(gulp.dest('build/fonts'));

	var buildCss = gulp.src('dev/css/main.min.css')
		.pipe(gulp.dest('build/css'));

	var buildJs = gulp.src('dev/js/main.min.js')
		.pipe(gulp.dest('build/js'));

	// var buildImg = gulp.src('dev/img/sprite/sprite.png')
	// 	.pipe(imagemin([
	// 		pngquant()
	// 	],{
	// 		verbose: true
	// 	}))
	// 	.pipe(gulp.dest('build/img/sprite/'));

});

gulp.task('default', ['watch']);