var Builder     = require('systemjs-builder');
var gutil       = require('gulp-util');
var through     = require('through-gulp');

function systemjsBuilder(baseURL, cfg) {
	var builder = new Builder(baseURL, cfg)

	builder._bundle      = builder.bundle
	builder._buildStatic = builder.buildStatic

	var streamBuilder = function (isStatic, inputFile, outFile, opts) {
		if (outFile && typeof outFile === 'object') {
			opts    = outFile;
			outFile = undefined;
		}
		var buildMethod = isStatic ? '_buildStatic' : '_bundle'

		var stream = through(function (file, encoding, cb) {
			builder[buildMethod](inputFile, opts).then(function (output) {
				var noArithmetic = inputFile.search(/( [-+&] )|[*]/) == -1
				stream.push(new gutil.File({
					cwd:  "",
					base: "",
					path: outFile || noArithmetic && inputFile || 'build.js',
					contents: new Buffer(output.source)
				}));

				cb();
			}).catch(function (err) {
				// be sure to bubble the error up to callback
				cb(err);
			});
		})

		stream.write(new gutil.File({
				cwd:  "",
				base: "",
				path: inputFile,
				contents: ""
			}))

		stream.end()

		return stream
	}

	builder.bundle      = function (inputFile, outFile, opts) { return streamBuilder(false, inputFile, outFile, opts) }
	builder.buildStatic = function (inputFile, outFile, opts) { return streamBuilder(true,  inputFile, outFile, opts) }

	return builder
}

module.exports = systemjsBuilder
