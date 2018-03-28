/** Provides a map with valid default properties */
import * as MediaScanTypes from "../MediaScanTypes";
import { filterDefaultProperties } from "../utils/utils_functions";

export function filterDefaultStringProperties(
  searchObject: MediaScanTypes.DefaultSearchParameters
): Array<MediaScanTypes.filterTuple<string | string[]>> {
  const propertiesNames = [
    "title",
    "resolution",
    "codec",
    "audio",
    "group",
    "region",
    "container",
    "language",
    "source"
  ];
  return filterDefaultProperties<string | string[]>(
    propertiesNames,
    searchObject,
    value => {
      return meetStringSpec(value);
    },
    (key, value) => [key, value]
  );
}

/** Filter function for filterByString */
function filterFunctionByType(
  property: string,
  expected: string[] | string,
  object: MediaScanTypes.TPN
): boolean {
  if (Array.isArray(expected)) {
    return expected.includes(object[property]);
  }
  return object[property] === expected;
}

/** Filter the set based on string properties */
export function filterByString(
  set: Set<MediaScanTypes.TPN>,
  propertiesMap: Map<string, string | string[]>
): Set<MediaScanTypes.TPN> {
  // first step : get an array so that we can do filter/reduce stuff
  // second step : iterate the propertiesMap and do filter and return the filtered array
  // val[0] : the key ; val[1] : the value
  return new Set(
    Array.from(propertiesMap.entries()).reduce(
      // eslint-disable-next-line max-len
      (currentMoviesArray, val) =>
        currentMoviesArray.filter(TPN =>
          filterFunctionByType(val[0], val[1], TPN)
        ),
      [...set]
    )
  );
}

// Just for type check this type
export function meetStringSpec(value) {
  if (Array.isArray(value)) {
    return value.every(elem => typeof elem === "string");
  } else {
    return typeof value === "string";
  }
}
