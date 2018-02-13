/** Provides a map with valid default properties */
import * as MediaScan from "../custom_types";

export function filterDefaultStringProperties(searchObject: MediaScan.defaultSearchParameters) : Map<string, string|string[]> {
  const {
    title, resolution, codec, audio, group, region, container, language, source,
  } = searchObject;


  const propertiesArray = [title, resolution, codec, audio, group,
    region, container, language, source];
  const propertiesNames = ['title', 'resolution', 'codec', 'audio', 'group',
    'region', 'container', 'language', 'source'];

  return propertiesArray.reduce((propertiesMap, val, index) => {
    if (val !== undefined) {
      propertiesMap.set(propertiesNames[index], val);
    }
    return propertiesMap;
  }, new Map());
}

/** Remove the default string properties */
export function excludeDefaultStringProperties(searchObject: MediaScan.defaultSearchParameters) : MediaScan.defaultSearchParameters {
  let {
    title, resolution, codec, audio, group, region, container, language, source,
    ...rest
  } = searchObject;
  return rest;
}

/** Filter function for filterByString */
function filterFunctionByType(property: string, expected: string[]|string, object: MediaScan.TPN) : boolean {
  if (Array.isArray(expected)) { return expected.includes(object[property]); }
  return object[property] === expected;
}

/** Filter the set based on string properties */
export function filterByString(set: Set<MediaScan.TPN>, propertiesMap: Map<string, string|string[]>) : Set<MediaScan.TPN> {
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
