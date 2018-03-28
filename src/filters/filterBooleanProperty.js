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
var utils_functions_1 = require("../utils/utils_functions");
function filterDefaultBooleanProperties(searchObject) {
    var propertiesNames = [
        "extended",
        "unrated",
        "proper",
        "repack",
        "convert",
        "hardcoded",
        "retail",
        "remastered"
    ];
    return utils_functions_1.filterDefaultProperties(propertiesNames, searchObject, function (value) {
        return meetBooleanSpec(value);
    }, function (key, value) { return [key, value]; });
}
exports.filterDefaultBooleanProperties = filterDefaultBooleanProperties;
/** Filter the set based on boolean properties */
function filterByBoolean(set, propertiesMap) {
    // first step : get an array so that we can do filter/reduce stuff
    // second step : iterate the propertiesMap and do filter and return the filtered array
    // val[0] : the key ; val[1] : the value
    return new Set(Array.from(propertiesMap.entries()).reduce(
    // eslint-disable-next-line max-len
    function (currentMoviesArray, val) {
        return currentMoviesArray.filter(function (TPN) { return TPN[val[0]] === val[1]; });
    }, __spread(set)));
}
exports.filterByBoolean = filterByBoolean;
// Just for type check this type
function meetBooleanSpec(value) {
    return value === true || value === false;
}
exports.meetBooleanSpec = meetBooleanSpec;
//# sourceMappingURL=filterBooleanProperty.js.map