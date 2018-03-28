"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-useless-escape,max-len */
var lodash_1 = require("lodash");
var fp_1 = require("lodash/fp");
/**
 * Boolean properties filter
 */
var filterBooleanProperty_1 = require("./filterBooleanProperty");
/**
 * Number properties filter
 */
var filterNumberProperty_1 = require("./filterNumberProperty");
/**
 * String properties filter
 */
var MediaScanTypes = require("../MediaScanTypes");
var filterStringProperty_1 = require("./filterStringProperty");
function mapProperties(searchParameters) {
    // organize search based on field type : boolean - string - number . Now optimized by Me XD
    // add the optional new properties , optionally provided by user
    var additionalProperties = searchParameters.additionalProperties === undefined
        ? []
        : searchParameters.additionalProperties;
    var filterAdditionalProperties = function (type) { return function (newProperty) {
        return newProperty.type === type;
    }; };
    var booleanFieldsSearchArray = filterBooleanProperty_1.filterDefaultBooleanProperties(searchParameters);
    var numberFieldsSearchArray = filterNumberProperty_1.filterDefaultNumberProperties(searchParameters);
    var stringFieldsSearchArray = filterStringProperty_1.filterDefaultStringProperties(searchParameters);
    // add additional Properties into the proper array
    Array.prototype.push.apply(booleanFieldsSearchArray, fp_1.compose(fp_1.pluck(function (_a) {
        var name = _a.name, value = _a.value;
        return [name, value];
    }), fp_1.filter(function (_a) {
        var value = _a.value;
        return filterBooleanProperty_1.meetBooleanSpec(value);
    }), fp_1.filter(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.BOOLEAN)))(additionalProperties));
    Array.prototype.push.apply(numberFieldsSearchArray, fp_1.compose(fp_1.pluck(function (_a) {
        var name = _a.name, value = _a.value;
        return [
            name,
            filterNumberProperty_1.convertToValidExpression(value)
        ];
    }), fp_1.filter(function (_a) {
        var value = _a.value;
        return filterNumberProperty_1.meetNumberSpec(value);
    }), fp_1.filter(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.NUMBER)))(additionalProperties));
    Array.prototype.push.apply(stringFieldsSearchArray, fp_1.compose(fp_1.pluck(function (_a) {
        var name = _a.name, value = _a.value;
        return [name, value];
    }), fp_1.filter(function (_a) {
        var value = _a.value;
        return filterStringProperty_1.meetStringSpec(value);
    }), fp_1.filter(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.STRING)))(additionalProperties));
    return {
        booleanFieldsSearchMap: new Map(booleanFieldsSearchArray),
        numberFieldsSearchMap: new Map(numberFieldsSearchArray),
        stringFieldsSearchMap: new Map(stringFieldsSearchArray)
    };
}
/** Filter the movies based on search parameters */
function filterMoviesByProperties(searchParameters, allMovies) {
    // Check if empty - for faster result
    if (lodash_1.isEmpty(searchParameters)) {
        return allMovies;
    }
    var _a = mapProperties(searchParameters), booleanFieldsSearchMap = _a.booleanFieldsSearchMap, stringFieldsSearchMap = _a.stringFieldsSearchMap, numberFieldsSearchMap = _a.numberFieldsSearchMap;
    var filterStuff = [
        [filterBooleanProperty_1.filterByBoolean, booleanFieldsSearchMap],
        [filterStringProperty_1.filterByString, stringFieldsSearchMap],
        [filterNumberProperty_1.filterByNumber, numberFieldsSearchMap]
    ];
    return filterStuff.reduce(function (processingResult, _a) {
        var _b = __read(_a, 2), filterFunction = _b[0], propertiesMap = _b[1];
        return processingResult.size > 0 && propertiesMap.size > 0
            ? filterFunction(processingResult, propertiesMap)
            : processingResult;
    }, allMovies);
}
exports.filterMoviesByProperties = filterMoviesByProperties;
/** Filter the tv series based on search parameters */
function filterTvSeriesByProperties(searchParameters, allTvSeries) {
    // Check if empty for faster result
    if (lodash_1.isEmpty(searchParameters)) {
        return allTvSeries;
    }
    var _a = mapProperties(searchParameters), booleanFieldsSearchMap = _a.booleanFieldsSearchMap, stringFieldsSearchMap = _a.stringFieldsSearchMap, numberFieldsSearchMap = _a.numberFieldsSearchMap;
    var filterStuff = [
        [filterBooleanProperty_1.filterByBoolean, booleanFieldsSearchMap],
        [filterStringProperty_1.filterByString, stringFieldsSearchMap],
        [filterNumberProperty_1.filterByNumber, numberFieldsSearchMap]
    ];
    // apply the filters
    return new Map(__spread(allTvSeries).reduce(function (processingArray, _a) {
        var _b = __read(_a, 2), showName = _b[0], showSet = _b[1];
        // execute the filter functions
        var filteredSet = filterStuff.reduce(function (currentFilteredSet, _a) {
            var _b = __read(_a, 2), filterFunction = _b[0], propertiesMap = _b[1];
            return currentFilteredSet.size > 0 && propertiesMap.size > 0
                ? filterFunction(currentFilteredSet, propertiesMap)
                : currentFilteredSet;
        }, showSet);
        // add this entry if there is soms episode(s) left
        if (filteredSet.size > 0) {
            processingArray.push([showName, filteredSet]);
        }
        // reducer call
        return processingArray;
    }, []));
}
exports.filterTvSeriesByProperties = filterTvSeriesByProperties;
//# sourceMappingURL=filterProperties.js.map