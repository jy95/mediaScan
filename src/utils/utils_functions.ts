// Check properties
import PromiseLib from "bluebird";
import { access, constants as FsConstants } from "fs";
import { compose, filter as filterFP, pluck } from "lodash/fp";
import { parse as nameParser } from "parse-torrent-title";
import { basename } from "path";
import * as MediaScanTypes from "../MediaScanTypes";

export function checkProperties(obj, properties): boolean {
  return properties.every((x) => x in obj && obj[x]);
}

/**
 * Bluebird seems to have an issue with fs.access - Workaround function
 */
export function promisifiedAccess(path): Promise<any> {
  return new PromiseLib((resolve, reject) => {
    access(path, FsConstants.F_OK | FsConstants.R_OK, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

// Default implementation to know which category is this file
export function defaultWhichCategoryFunction(
  object: MediaScanTypes.TPN,
): MediaScanTypes.Category {
  // workaround : const string enum aren't compiled correctly with Babel
  return checkProperties(object, ["season", "episode"])
    ? MediaScanTypes.Category.TV_SERIES_TYPE
    : MediaScanTypes.Category.MOVIES_TYPE;
}

// Generic filter for default properties
export function filterDefaultProperties<T>(
  propertiesNames: string[],
  search: MediaScanTypes.SearchParameters,
  meetSpecFunction: (value) => boolean,
  transformFunction: (key: string, value) => MediaScanTypes.filterTuple<T>,
): Array<MediaScanTypes.filterTuple<T>> {
  return compose(
    pluck((currentProperty) =>
      transformFunction(currentProperty, search[currentProperty]),
    ),
    filterFP((currentProperty) => meetSpecFunction(search[currentProperty])),
  )(propertiesNames);
}

// default parser
export function defaultParser(fullPathFile: string) {
  return nameParser(basename(fullPathFile));
}
