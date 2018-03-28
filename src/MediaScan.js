"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
var bluebird_1 = require("bluebird");
var filehound_1 = require("filehound");
var lodash_1 = require("lodash");
var path_1 = require("path");
var videosExtension = require("video-extensions");
var events_1 = require("events");
var fp_1 = require("lodash/fp");
// local import
var filterProperties_1 = require("./filters/filterProperties");
var MediaScanTypes = require("./MediaScanTypes");
var utils_functions_1 = require("./utils/utils_functions");
/**
 * Class representing the MediaScan Library
 * @extends {EventEmitter}
 */
var MediaScan = /** @class */ (function (_super) {
    __extends(MediaScan, _super);
    function MediaScan(_a, _b) {
        var _c = _a === void 0 ? {} : _a, _d = _c.defaultPath, defaultPath = _d === void 0 ? process.cwd() : _d, _e = _c.paths, paths = _e === void 0 ? [] : _e, _f = _c.allFilesWithCategory, allFilesWithCategory = _f === void 0 ? new Map() : _f, _g = _c.movies, movies = _g === void 0 ? new Set() : _g, _h = _c.series, series = _h === void 0 ? new Map() : _h;
        var _j = _b === void 0 ? {} : _b, _k = _j.parser, parser = _k === void 0 ? utils_functions_1.defaultParser : _k, _l = _j.whichCategory, whichCategory = _l === void 0 ? utils_functions_1.defaultWhichCategoryFunction : _l;
        var _this = _super.call(this) || this;
        _this.parser = parser;
        _this.whichCategory = whichCategory;
        _this.defaultPath = defaultPath;
        _this.paths = paths;
        _this.stores = new Map();
        _this.stores.set(MediaScan.MOVIES_TYPE, movies);
        _this.stores.set(MediaScan.TV_SERIES_TYPE, series);
        _this.categoryForFile = allFilesWithCategory;
        return _this;
    }
    MediaScan.prototype.addNewFiles = function (files) {
        var _this = this;
        return new bluebird_1.default(function (resolve, reject) {
            try {
                // find the new files to be added
                var alreadyFoundFiles = __spread(_this.categoryForFile.keys());
                var newFiles = lodash_1.difference(files, alreadyFoundFiles);
                // process each file
                var scanningResult = lodash_1.reduce(newFiles, function (result, file) {
                    var jsonFile = _this.parser(file);
                    // extend this object in order to be used by this library
                    Object.assign(jsonFile, { filePath: file });
                    // find out which type of this file
                    // if it has not undefined properties (season and episode) => TV_SERIES , otherwise MOVIE
                    var fileCategory = _this.whichCategory(jsonFile);
                    // add it in found files
                    _this.categoryForFile.set(file, fileCategory);
                    // store the result for next usage
                    if (lodash_1.has(result, fileCategory)) {
                        Array.prototype.push.apply(result[fileCategory], [jsonFile]);
                    }
                    else {
                        result[fileCategory] = [jsonFile];
                    }
                    return result;
                }, {});
                // add the found movies
                if (scanningResult[MediaScan.MOVIES_TYPE] !== undefined) {
                    _this.stores.set(MediaScan.MOVIES_TYPE, new Set(__spread(_this.allMovies, scanningResult[MediaScan.MOVIES_TYPE])));
                }
                // add the found tv-series
                if (scanningResult[MediaScan.TV_SERIES_TYPE] !== undefined) {
                    // mapping for faster result(s)
                    var newSeries = lodash_1.reduce(scanningResult[MediaScan.TV_SERIES_TYPE], function (result, tvSeries) {
                        if (lodash_1.has(result, tvSeries.title)) {
                            Array.prototype.push.apply(result[tvSeries.title], [tvSeries]);
                        }
                        else {
                            result[tvSeries.title] = [tvSeries];
                        }
                        return result;
                    }, {});
                    // fastest way to update things
                    var newTvSeries_1 = _this.allTvSeries;
                    lodash_1.forIn(newSeries, function (seriesArray, seriesName) {
                        var resultSet = newTvSeries_1.has(seriesName)
                            ? newTvSeries_1.get(seriesName)
                            : new Set();
                        newTvSeries_1.set(seriesName, new Set(__spread(resultSet, seriesArray)));
                    });
                    // update the stores var
                    _this.stores.set(MediaScan.TV_SERIES_TYPE, newTvSeries_1);
                }
                resolve();
            }
            catch (err) {
                reject(err);
            }
        }).bind(this);
    };
    MediaScan.listVideosExtension = function () {
        return videosExtension;
    };
    MediaScan.prototype.addNewPath = function () {
        var _this = this;
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        // the user should provide us at lest a path
        if (paths.length === 0) {
            this.emit("missing_parameter", {
                functionName: "addNewPath"
            });
            return Promise.reject(new Error("Missing parameter"));
        }
        return new bluebird_1.default(function (resolve, reject) {
            bluebird_1.default.map(paths, function (path) { return utils_functions_1.promisifiedAccess(path); })
                .then(function () {
                // keep only unique paths
                // use normalize for cross platform's code
                _this.paths = lodash_1.uniq(__spread(_this.paths, paths.map(path_1.normalize)));
                _this.emit("addNewPath", { paths: _this.paths });
                resolve("All paths were added!");
            })
                .catch(function (e) {
                _this.emit("error_in_function", {
                    error: e.message,
                    functionName: "addNewPath"
                });
                reject(e);
            });
        }).bind(this);
    };
    MediaScan.prototype.hasPathsProvidedByUser = function () {
        return this.paths.length !== 0;
    };
    MediaScan.prototype.scan = function () {
        var _this = this;
        return new bluebird_1.default(function (resolve, reject) {
            filehound_1.default.create()
                .paths(_this.paths.length === 0 ? _this.defaultPath : _this.paths)
                .ext(videosExtension)
                .find()
                .then(function (files) {
                return bluebird_1.default.join(_this.addNewFiles(files), function () {
                    return Promise.resolve(files);
                });
            })
                .then(function (files) {
                _this.emit("scan", { files: files });
                resolve("Scanning completed");
            })
                .catch(function (err) {
                _this.emit("error_in_function", {
                    error: err.message,
                    functionName: "scan"
                });
                reject(err);
            });
        }).bind(this);
    };
    MediaScan.prototype.removeOldFiles = function () {
        var _this = this;
        var files = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            files[_i] = arguments[_i];
        }
        return new bluebird_1.default(function (resolve, reject) {
            try {
                // processing
                var mappedFiles = fp_1.compose(fp_1.filter(function (resultObject) { return resultObject.category !== undefined; }), fp_1.pluck(function (file) {
                    return { filePath: file, category: _this.categoryForFile.get(file) };
                }), 
                // to handle platform support paths
                fp_1.pluck(function (file) { return path_1.normalize(file); }))(files);
                var filterContentType = function (requestedType) { return function (file) {
                    return file.category === requestedType;
                }; };
                try {
                    // remove the mapping of each deleted file(s)
                    for (var mappedFiles_1 = __values(mappedFiles), mappedFiles_1_1 = mappedFiles_1.next(); !mappedFiles_1_1.done; mappedFiles_1_1 = mappedFiles_1.next()) {
                        var file = mappedFiles_1_1.value;
                        _this.categoryForFile.delete(file.filePath);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (mappedFiles_1_1 && !mappedFiles_1_1.done && (_a = mappedFiles_1.return)) _a.call(mappedFiles_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // movies files
                var moviesFiles = lodash_1.filter(mappedFiles, filterContentType(MediaScan.MOVIES_TYPE));
                var moviesFilePaths_1 = lodash_1.map(moviesFiles, "filePath");
                // for movies, just an easy removal
                if (moviesFiles.length > 0) {
                    // update the filtered Set
                    _this.stores.set(MediaScan.MOVIES_TYPE, new Set(lodash_1.filter.apply(void 0, __spread(_this.allMovies, [function (movie) { return !lodash_1.some(moviesFilePaths_1, movie.filePath); }]))));
                }
                // tv-series
                var seriesFiles = lodash_1.filter(mappedFiles, filterContentType(MediaScan.TV_SERIES_TYPE));
                // for series , a bit more complex
                if (seriesFiles.length > 0) {
                    // Get the series and their files that will be deleted
                    var seriesShows = fp_1.compose(fp_1.reduce(function (acc, parsedFile) {
                        if (!lodash_1.has(acc, parsedFile.seriesName)) {
                            acc[parsedFile.seriesName] = [];
                        }
                        Array.prototype.push.apply(acc[parsedFile.seriesName], [
                            parsedFile.filePath
                        ]);
                        return acc;
                    }, {}), fp_1.pluck(function (series) {
                        return __assign({}, series, { seriesName: _this.parser(series.filePath).title });
                    }))(seriesFiles);
                    var newTvSeries_2 = _this.allTvSeries;
                    // check if needed to store new Value
                    var shouldUpdate_1 = false;
                    lodash_1.forIn(seriesShows, function (seriesArray, seriesName) {
                        var previousSet = newTvSeries_2.has(seriesName)
                            ? newTvSeries_2.get(seriesName)
                            : new Set();
                        var filteredSet = new Set(lodash_1.filter(__spread(previousSet), function (episode) { return !lodash_1.includes(seriesArray, episode.filePath); }));
                        // should I update later ?
                        if (previousSet.size !== filteredSet.size) {
                            shouldUpdate_1 = true;
                        }
                        // if the filtered set is empty => no more episodes for this series
                        if (filteredSet.size === 0) {
                            newTvSeries_2.delete(seriesName);
                        }
                        else {
                            newTvSeries_2.set(seriesName, filteredSet);
                        }
                    });
                    // save the updated map
                    if (shouldUpdate_1) {
                        _this.stores.set(MediaScan.TV_SERIES_TYPE, newTvSeries_2);
                    }
                }
                _this.emit("removeOldFiles", { files: files });
                resolve({
                    files: files,
                    message: "The files have been deleted from the library"
                });
            }
            catch (err) {
                _this.emit("error_in_function", {
                    error: err.message,
                    functionName: "removeOldFiles"
                });
                reject(err);
            }
            var e_1, _a;
        }).bind(this);
    };
    Object.defineProperty(MediaScan.prototype, "allMovies", {
        get: function () {
            return this.stores.get(MediaScan.MOVIES_TYPE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaScan.prototype, "allTvSeries", {
        get: function () {
            return this.stores.get(MediaScan.TV_SERIES_TYPE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaScan.prototype, "allFilesWithCategory", {
        get: function () {
            return lodash_1.cloneDeep(this.categoryForFile);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaScan.prototype, "allTvSeriesNames", {
        get: function () {
            return __spread(this.allTvSeries.keys());
        },
        enumerable: true,
        configurable: true
    });
    // full data of lib as JSON string
    MediaScan.prototype.toJSON = function () {
        return JSON.stringify(this.toJSONObject());
    };
    // data as a JSON object
    MediaScan.prototype.toJSONObject = function (looseMode) {
        var _this = this;
        // if in loose Mode , the objects will only contains the mapping between filepath and Category
        var toBeSerialized = looseMode
            ? [["allFilesWithCategory", __spread(this.allFilesWithCategory)]]
            : [
                ["paths", __spread(this.paths)],
                ["allFilesWithCategory", __spread(this.allFilesWithCategory)],
                ["movies", __spread(this.allMovies)],
                [
                    "series",
                    this.allTvSeriesNames.reduce(function (acc, currentSeries) {
                        acc.push([
                            currentSeries,
                            __spread(_this.allTvSeries.get(currentSeries))
                        ]);
                        return acc;
                    }, [])
                ]
            ];
        return toBeSerialized.reduce(function (result, _a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            result[key] = value;
            return result;
        }, {});
    };
    MediaScan.createFromJSON = function (json, customConfig) {
        var config = {};
        // transform the param
        /* istanbul ignore else */
        if (json.allFilesWithCategory) {
            config.allFilesWithCategory = new Map(json.allFilesWithCategory);
        }
        /* istanbul ignore else */
        if (json.movies) {
            config.movies = new Set(json.movies);
        }
        /* istanbul ignore else */
        if (json.series) {
            var createdMap = new Map();
            try {
                for (var _a = __values(json.series), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var _c = __read(_b.value, 2), seriesTitle = _c[0], setSeries = _c[1];
                    createdMap.set(seriesTitle, new Set(setSeries));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            config.series = createdMap;
        }
        /* istanbul ignore else */
        if (json.paths) {
            config.paths = json.paths;
        }
        return new MediaScan(config, customConfig);
        var e_2, _d;
    };
    MediaScan.prototype.filterMovies = function (searchParameters) {
        if (searchParameters === void 0) { searchParameters = {}; }
        // apply params based on types
        return filterProperties_1.filterMoviesByProperties(searchParameters, this.allMovies);
    };
    MediaScan.prototype.filterTvSeries = function (searchParameters) {
        if (searchParameters === void 0) { searchParameters = {}; }
        return filterProperties_1.filterTvSeriesByProperties(searchParameters, this.allTvSeries);
    };
    // constants getter for external purposes (example create a custom whichCategory function)
    MediaScan.MOVIES_TYPE = MediaScanTypes.Category.MOVIES_TYPE;
    MediaScan.TV_SERIES_TYPE = MediaScanTypes.Category
        .TV_SERIES_TYPE;
    return MediaScan;
}(events_1.EventEmitter));
// just to be sure Babel doesn't mess up common js
module.exports = MediaScan;
//# sourceMappingURL=MediaScan.js.map