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
var validExpression = /^(==|>|<|>=|<=)(\d+)$/;
/**
 * Convert the param to valid expression object for filter function
 */
function convertToValidExpression(param) {
    var returnValue;
    switch (typeof param) {
        case "string":
            // if it is a valid number expression like the regex
            /* istanbul ignore else */
            if (validExpression.test(param)) {
                var result = param.match(validExpression);
                returnValue = {
                    number: Number(result[2]),
                    operator: result[1]
                };
            }
            break;
        // if the param is a number
        case "number":
            returnValue = {
                number: param,
                operator: "=="
            };
            break;
    }
    return returnValue;
}
exports.convertToValidExpression = convertToValidExpression;
/**
 * Filter function for filterByNumber
 */
function resolveExpression(property, expressionObject, object) {
    // No : eval is not all evil but you should know what you are doing
    // eslint-disable-next-line no-eval
    return eval("" + object[property] + expressionObject.operator + expressionObject.number);
}
function filterDefaultNumberProperties(searchObject) {
    var propertiesNames = ["season", "episode", "year"];
    return utils_functions_1.filterDefaultProperties(propertiesNames, searchObject, function (value) {
        return meetNumberSpec(value);
    }, function (key, value) { return [key, convertToValidExpression(value)]; });
}
exports.filterDefaultNumberProperties = filterDefaultNumberProperties;
/** Filter the set based on string properties */
// export function filterByNumber(set: Set<TPN>, propertiesMap: Map<string, numberExpressionObject>) : Set<TPN>
function filterByNumber(set, propertiesMap) {
    // first step : get an array so that we can do filter/reduce stuff
    // second step : iterate the propertiesMap and do filter and return the filtered array
    // val[0] : the key ; val[1] : the value
    return new Set(Array.from(propertiesMap.entries()).reduce(
    // eslint-disable-next-line max-len
    function (currentMoviesArray, val) {
        return currentMoviesArray.filter(function (TPN) {
            return resolveExpression(val[0], val[1], TPN);
        });
    }, __spread(set)));
}
exports.filterByNumber = filterByNumber;
// Just for type check this type
function meetNumberSpec(value) {
    if (typeof value === "number") {
        return true;
    }
    else if (typeof value !== "string") {
        return false;
    }
    else {
        return validExpression.test(value);
    }
}
exports.meetNumberSpec = meetNumberSpec;
//# sourceMappingURL=filterNumberProperty.js.map