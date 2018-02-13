/** Provides a map with valid default properties */
import * as MediaScan from "../custom_types";

export function filterDefaultBooleanProperties(searchObject: MediaScan.defaultSearchParameters) : Map<string, boolean> {
  const {
    extended, unrated, proper, repack, convert, hardcoded, retail, remastered,
  } = searchObject;


  const propertiesArray = [extended, unrated, proper,
    repack, convert, hardcoded, retail, remastered];
  const propertiesNames = ['extended', 'unrated', 'proper', 'repack', 'convert',
    'hardcoded', 'retail', 'remastered'];

  return propertiesArray.reduce((propertiesMap, val, index) => {
    // eslint-disable-next-line max-len
    if (val === true || val === false) { propertiesMap.set(propertiesNames[index], val); }
    return propertiesMap;
  }, new Map());
}

/** Remove the default boolean properties */
export function excludeDefaultBooleanProperties(searchObject: MediaScan.defaultSearchParameters) : MediaScan.defaultSearchParameters {
  let {
    extended, unrated, proper, repack, convert, hardcoded, retail, remastered,
    ...rest
  } = searchObject;
  return rest;
}

/** Filter the set based on boolean properties */
export function filterByBoolean(set: Set<MediaScan.TPN>, propertiesMap: Map<string, boolean>) : Set<MediaScan.TPN> {
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
