/*
src - путь к файлам
dest - куда сохранять файлы
watch - для наблюдения за функциями
parallel - для одновременного запуска нескольких процессов
series - последовательное выполнение функций
*/
const {src, dest, watch, parallel, series} 	= require('gulp')

// Подключение пакетов
const sass 			= require('gulp-sass')(require('sass'))
const concat 		= require('gulp-concat')
const uglify 		= require('gulp-uglify-es').default
const browserSync	= require('browser-sync').create()
const clean 		= require('gulp-clean')

// Функция для стилей
function styles()
{
	return src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'compressed'})) // делает код в одну строку
	.pipe(concat('style.min.css')) 			 // переименовывает
	.pipe(dest('app/css')) 					 // куда сохранять изменённый файл
	.pipe(browserSync.stream()) 			 // чтобы страница сразу обновлялась
}

// Функция для скриптов
function scripts()
{
	return src('app/js/main.js')
	.pipe(concat('main.min.js')) 	// переименовывает
	.pipe(uglify()) 			 	// делает код в одну строку
	.pipe(dest('app/js')) 		 	// куда сохранять изменённый файл
	.pipe(browserSync.stream()) 	// чтобы страница сразу обновлялась
}

// Функция для watch и browserSync
function watcher()
{
	browserSync.init
	({
		server: {baseDir: "app/"}
	});
	watch(['app/sass/**/*.sass'], styles)					// чтобы следить за изменениями в sass
	watch(['app/js/main.js'], scripts) 						// чтобы следить за изменениями в js
	watch(['app/*.html']).on('change', browserSync.reload) 	// чтобы следить за изменениями в html
}

// Функция для удаления папки dist
function deleteDist()
{
	return src('dist')
	.pipe(clean())
}

// Функция для переноса готовых файлов в dist
function building()
{
	return src
	([
		'app/css/style.min.css',
		'app/js/main.min.js',
		'app/**/*.html'
	],	{base: 'app'}) 		// сохраняет базовую структуру
		.pipe(dest('dist')) // выгружает готовые файлы в dist
}

// Чтобы можно было включать в консоли
exports.styles = styles
exports.scripts = scripts
exports.watcher = watcher
exports.building = building

exports.build = series(deleteDist, building) // удалить папку dist, создать папку dist, перенести в неё готовые файлы
exports.default = parallel(styles, scripts, watcher) // запустить сервер