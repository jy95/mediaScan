/** Provides a map with valid default properties */
import * as MediaScanTypes from "../MediaScanTypes";
import { filterDefaultProperties } from "../utils/utils_functions";

export function filterDefaultBooleanProperties(
  searchObject: MediaScanTypes.DefaultSearchParameters,
): Array<MediaScanTypes.filterTuple<boolean>> {
  const propertiesNames = [
    "extended",
    "unrated",
    "proper",
    "repack",
    "convert",
    "hardcoded",
    "retail",
    "remastered",
  ];
  return filterDefaultProperties<boolean>(
    propertiesNames,
    searchObject,
    (value) => {
      return meetBooleanSpec(value);
    },
    (key, value) => [key, value],
  );
}

/** Filter the set based on boolean properties */
export function filterByBoolean(
  set: Set<MediaScanTypes.TPN>,
  propertiesMap: Map<string, boolean>,
): Set<MediaScanTypes.TPN> {
  // first step : get an array so that we can do filter/reduce stuff
  // second step : iterate the propertiesMap and do filter and return the filtered array
  // val[0] : the key ; val[1] : the value
  return new Set(
    Array.from(propertiesMap.entries()).reduce(
      // eslint-disable-next-line max-len
      (currentMoviesArray, val) =>
        currentMoviesArray.filter((TPN) => TPN[val[0]] === val[1]),
      [...set],
    ),
  );
}

// Just for type check this type
export function meetBooleanSpec(value) {
  return value === true || value === false;
}
