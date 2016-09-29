Gulp SystemJS Build Tool
===
A tiny wrapper around SystemJS builder `.bundle` and `.buildStatic` methods. Based on [SystemJS Builder](https://github.com/systemjs/builder). It allows use `.pipe()` method on output after build.

# Usage
```javascript
var systemjsBuilder = require('gulp-systemjs-builder')

gulp.task('build-sjs', function () {
	var builder = systemjsBuilder()
	builder.loadConfigSync('./system.config.js')

	builder.buildStatic('app/main.js', {
		minify: false,
		mangle: false
	})
	.pipe(gulp.dest('./build'));
})
```

# Options
## Initialize
To create instance of plugin use `systemjsBuilder(baseURL, configFile)`. Works transperent to original SystemJS Builder.
```javascript
var builder = systemjsBuilder('./', './system.config.js')
```

## Load config
You can't return pipe from `.loadConfig().then()` method, so use `.loadConfigSync` to initialize systemjs.config from external file.
```javascript
builder.loadConfigSync('./system.config.js')
```
All other options works exactly as in SystemJS Builder.

## Build
You can use `.bundle` and `.buildStatic` methods like you do it in SystemJS Builder:
```javascript
builder.buildStatic('myModule.js', 'outfile.js', options);
```
If you not set the outputfile, gulp-systemjs-builder will try to use your input filename. When you not set the output file and use arithmetic expressions in input filename, gulp-systemjs-builder will use default output filename `build.js`


# Backward compatibility
Original SystemJS Builder methods aliased to `._bundle()` and `._buildStatic()`