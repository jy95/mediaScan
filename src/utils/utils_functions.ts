// Check properties
import {access, constants as FsConstants} from "fs";
import PromiseLib from 'bluebird';
import MediaScanLib from "../declaration";

// workaround : const string enum aren't compiled correctly with Babel
const MediaScan = require('../MediaScan');

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
export function defaultWhichCategoryFunction(object : MediaScanLib.TPN) : MediaScanLib.Category{
    // workaround : const string enum aren't compiled correctly with Babel
    return (checkProperties(object, ['season', 'episode']))
        ? 'TV_SERIES' as MediaScanLib.Category.TV_SERIES_TYPE : 'MOVIES' as MediaScanLib.Category.MOVIES_TYPE;
}