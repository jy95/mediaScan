"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Check properties
var bluebird_1 = require("bluebird");
var fs_1 = require("fs");
var fp_1 = require("lodash/fp");
var parse_torrent_title_1 = require("parse-torrent-title");
var path_1 = require("path");
var MediaScanTypes = require("../MediaScanTypes");
function checkProperties(obj, properties) {
    return properties.every(function (x) { return x in obj && obj[x]; });
}
exports.checkProperties = checkProperties;
/**
 * Bluebird seems to have an issue with fs.access - Workaround function
 */
function promisifiedAccess(path) {
    return new bluebird_1.default(function (resolve, reject) {
        fs_1.access(path, fs_1.constants.F_OK | fs_1.constants.R_OK, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
exports.promisifiedAccess = promisifiedAccess;
// Default implementation to know which category is this file
function defaultWhichCategoryFunction(object) {
    // workaround : const string enum aren't compiled correctly with Babel
    return checkProperties(object, ["season", "episode"])
        ? MediaScanTypes.Category.TV_SERIES_TYPE
        : MediaScanTypes.Category.MOVIES_TYPE;
}
exports.defaultWhichCategoryFunction = defaultWhichCategoryFunction;
// Generic filter for default properties
function filterDefaultProperties(propertiesNames, search, meetSpecFunction, transformFunction) {
    return fp_1.compose(fp_1.pluck(function (currentProperty) {
        return transformFunction(currentProperty, search[currentProperty]);
    }), fp_1.filter(function (currentProperty) { return meetSpecFunction(search[currentProperty]); }))(propertiesNames);
}
exports.filterDefaultProperties = filterDefaultProperties;
// default parser
function defaultParser(fullPathFile) {
    return parse_torrent_title_1.parse(path_1.basename(fullPathFile));
}
exports.defaultParser = defaultParser;
//# sourceMappingURL=utils_functions.js.map