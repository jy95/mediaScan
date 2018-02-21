/** Provides a map with valid default properties */
import MediaScan from "../declaration";

// Object.entries is not available in Node 6
const entries = require('object.entries');

if (!Object.entries) {
    entries.shim();
}

export function filterDefaultBooleanProperties(searchObject: MediaScan.DefaultSearchParameters): Map<string, boolean> {
    const propertiesNames = ['extended', 'unrated', 'proper', 'repack', 'convert',
        'hardcoded', 'retail', 'remastered'];
    return Object.entries(searchObject).reduce((propertiesMap, [key, value]) => {
        if (key in propertiesNames && (value === true || value === false)) {
            propertiesMap.set(key, value);
        }
        return propertiesMap;
    }, new Map());
}

/** Remove the default boolean properties */
export function excludeDefaultBooleanProperties(searchObject: MediaScan.DefaultSearchParameters): MediaScan.DefaultSearchParameters {
    let rest = searchObject;
    ['extended', 'unrated', 'proper', 'repack', 'convert',
        'hardcoded', 'retail', 'remastered'].forEach((propertyName) => {
        if (propertyName in rest)
            delete rest[propertyName];
    });
    return rest;
}

/** Filter the set based on boolean properties */
export function filterByBoolean(set: Set<MediaScan.TPN>, propertiesMap: Map<string, boolean>): Set<MediaScan.TPN> {
    // first step : get an array so that we can do filter/reduce stuff
    // second step : iterate the propertiesMap and do filter and return the filtered array
    // val[0] : the key ; val[1] : the value
    return new Set(Array
        .from(propertiesMap.entries())
        .reduce(
            // eslint-disable-next-line max-len
            (currentMoviesArray, val) => currentMoviesArray.filter(TPN => TPN[val[0]] === val[1])
            , [...set],
        ));
}
