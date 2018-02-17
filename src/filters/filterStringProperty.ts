/** Provides a map with valid default properties */
import * as MediaScan from "../custom_types";
import {convertToValidExpression} from "./filterNumberProperty";

export function filterDefaultStringProperties(searchObject: MediaScan.DefaultSearchParameters): Map<string, string | string[]> {
    const propertiesNames = ['title', 'resolution', 'codec', 'audio', 'group',
        'region', 'container', 'language', 'source'];
    return Object.entries(searchObject).reduce((propertiesMap, [key, value]) => {
        if (key in propertiesNames && (value !== undefined)) {
            propertiesMap.set(key, value);
        }
        return propertiesMap;
    }, new Map());
}

/** Remove the default string properties */
export function excludeDefaultStringProperties(searchObject: MediaScan.DefaultSearchParameters): MediaScan.DefaultSearchParameters {
    let rest = searchObject;
    ['title', 'resolution', 'codec', 'audio', 'group',
        'region', 'container', 'language', 'source'].forEach((propertyName) => {
        if (propertyName in rest)
            delete rest[propertyName];
    });
    return rest;
}

/** Filter function for filterByString */
function filterFunctionByType(property: string, expected: string[] | string, object: MediaScan.TPN): boolean {
    if (Array.isArray(expected)) {
        return expected.includes(object[property]);
    }
    return object[property] === expected;
}

/** Filter the set based on string properties */
export function filterByString(set: Set<MediaScan.TPN>, propertiesMap: Map<string, string | string[]>): Set<MediaScan.TPN> {
    // first step : get an array so that we can do filter/reduce stuff
    // second step : iterate the propertiesMap and do filter and return the filtered array
    // val[0] : the key ; val[1] : the value
    return new Set(Array
        .from(propertiesMap.entries())
        .reduce(
            // eslint-disable-next-line max-len
            (currentMoviesArray, val) => currentMoviesArray.filter(TPN => filterFunctionByType(val[0], val[1], TPN))
            , [...set],
        ));
}
