// Check properties
import {access, constants as FsConstants} from "fs";
import PromiseLib from 'bluebird';
// transducers operators
const t = require("transducers.js");
import * as MediaScanTypes from "../MediaScanTypes";

export function checkProperties(obj, properties): boolean {
    return properties.every(x => x in obj && obj[x]);
}

/**
 * Bluebird seems to have an issue with fs.access - Workaround function
 */
export function promisifiedAccess(path) : Promise<any> {
    return new PromiseLib(((resolve, reject) => {
        access(path, FsConstants.F_OK | FsConstants.R_OK, (err) => {
            if (err) reject(err);
            resolve();
        });
    }));
}

// Default implementation to know which category is this file
export function defaultWhichCategoryFunction(object : MediaScanTypes.TPN) : MediaScanTypes.Category{
    // workaround : const string enum aren't compiled correctly with Babel
    return (checkProperties(object, ['season', 'episode']))
        ? MediaScanTypes.Category.TV_SERIES_TYPE : MediaScanTypes.Category.MOVIES_TYPE;
}

// Generic filter for default properties
export function filterDefaultProperties<T>(propertiesNames : string[],
                                           search : MediaScanTypes.SearchParameters, meetSpecFunction : (value) => boolean,
                                           transformFunction : (key : string, value) => MediaScanTypes.filterTuple<T> ) : MediaScanTypes.filterTuple<T>[]  {
    // transformations
    let meetRequirement = (currentProperty) => meetSpecFunction(search[currentProperty]);
    let transformResult = (currentProperty) => transformFunction(currentProperty, search[currentProperty]);
    let transformations = t.compose(t.filter(meetRequirement), t.map(transformResult));
    return t.into([], transformations, propertiesNames);
}