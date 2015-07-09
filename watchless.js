/**
 * Created by alexboyce on 7/7/15.
 */

"use strict";

var fs = require("fs"),
    exec = require("child_process").exec,
    chokidar = require("chokidar"),
    extend = require("extend"),
    path = require("path"),
    less = require("less"),
    watcher = null,
    DEFAULT = {
        source: null,
        destination: null,
        extension: '.css',
    };

function Watchless(opts) {

    var obj = function(opts) {
        var _this = this;

        this.options = {};

        this.watch = function (obj, dest) {
            var sp = fs.realpathSync(obj || _this.options.source),
                dp = dest || _this.options.destination;

            if (!!watcher) {
                watcher.stop();
            }

            var on_change = function(file) {
                console.log("Change File: ", file);

                if (!_this.options.destination) {
                    throw new Error("Destination not defined.");
                }
                if (/\.less$/.test(file)) {
                    fs.readFile(file, function(err, data) {
                        if (err) {throw new Error(err);}

                        var options = {
                            paths         : [path.dirname(file)],
                            outputDir     : _this.options.destination + "/",
                            optimization  : 1,
                            filename      : path.basename(file, '.less'),
                            compress      : _this.options.compress,
                            yuicompress   : _this.options.compress
                        };

                        options.outputfile = options.filename.split(".less")[0] + (options.compress ? ".min" : "") + _this.options.extension;

                        less.render(data.toString(), options, function(err, result) {
                            if (!err) {
                                fs.writeFileSync(options.outputDir + options.outputfile, result.css, 'utf8' );
                            }
                        });
                    });
                }
            };

            fs.exists(sp, function(exists) {
                if (exists) {
                    _this.options.source = sp;

                    fs.exists(dp, function(exists) {
                        if (!exists) {
                            fs.mkdirSync(dp);
                        }

                        _this.options.destination = fs.realpathSync(dp);

                        watcher = chokidar.watch(sp, {ignored: /[\/\\]\./, persistent: true});
                        watcher.on('change', on_change);
                        watcher.on('add', on_change);
                    });
                }
                else {
                    throw new Error("File not found.");
                }
            });

            console.log("Watchless is started. Press Ctrl+C to stop watching.");
        };

        this.stop = function() {
            if (!!watcher) {
                watcher.stop();
            }
        };

        this.init = function (opts) {
            if (!!watcher) {
                watcher.close();
            }

            extend(_this.options, opts);

            if (!!_this.options.source && !!_this.options.destination) {
                _this.watch();
            }
        };

        process.on('exit', function() {
            if (!!watcher) {
                watcher.close();
            }
        });

        extend(this.options, DEFAULT);
        this.init(opts);
    };

    return new obj(opts);
}

module.exports = Watchless;