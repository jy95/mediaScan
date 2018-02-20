/* eslint-disable no-useless-escape,max-len */
/**
 * Boolean properties filter
 */
import {
    filterDefaultBooleanProperties,
    filterByBoolean,
    excludeDefaultBooleanProperties,
} from './filterBooleanProperty';

/**
 * Number properties filter
 */
import {
    convertToValidExpression,
    excludeDefaultNumberProperties,
    filterDefaultNumberProperties,
    filterByNumber,
} from './filterNumberProperty';

/**
 * String properties filter
 */
import {
    excludeDefaultStringProperties,
    filterDefaultStringProperties,
    filterByString,
} from './filterStringProperty';
import MediaScan from "../declaration";

/**
 * Handle searchParameters provided by user to maps
 * @param {searchParameters} searchParameters - search parameters.
 * an object that contains mapped properties for search
 */
function mapProperties(searchParameters: MediaScan.SearchParameters): {
    booleanFieldsSearchMap: Map<string, boolean>, numberFieldsSearchMap: Map<string, MediaScan.NumberExpressionObject>,
    stringFieldsSearchMap: Map<string, string | string[]> } {

    // organize search based on field type : boolean - string - number
    const booleanFieldsSearchMap = filterDefaultBooleanProperties(searchParameters);
    let leftSearchParameters = excludeDefaultBooleanProperties(searchParameters);

    const numberFieldsSearchMap = filterDefaultNumberProperties(leftSearchParameters);
    leftSearchParameters = excludeDefaultNumberProperties(leftSearchParameters);

    const stringFieldsSearchMap = filterDefaultStringProperties(leftSearchParameters);
    leftSearchParameters = excludeDefaultStringProperties(leftSearchParameters);

    let {additionalProperties} = leftSearchParameters;
    // add the optional new properties , optionally provided by user
    /* istanbul ignore else */
    if (additionalProperties !== undefined) {
        additionalProperties
            .filter(newProperty => newProperty.type === MediaScan.AdditionalPropertiesType.BOOLEAN)
            .forEach((newProperty) => {
                booleanFieldsSearchMap.set(newProperty.name, newProperty.value as boolean);
            });

        additionalProperties
            .filter(newProperty => newProperty.type === MediaScan.AdditionalPropertiesType.NUMBER)
            .forEach((newProperty) => {
                let expression = convertToValidExpression(newProperty.value as string|number);
                /* istanbul ignore else */
                if (expression !== undefined) {
                    numberFieldsSearchMap.set(newProperty.name, expression);
                }
            });

        additionalProperties
            .filter(newProperty => newProperty.type === MediaScan.AdditionalPropertiesType.STRING)
            .forEach((newProperty) => {
                stringFieldsSearchMap.set(newProperty.name, [...newProperty.value]);
            });
    }

    return {
        booleanFieldsSearchMap,
        numberFieldsSearchMap,
        stringFieldsSearchMap,
    };
}

/** Filter the movies based on search parameters */
export function filterMoviesByProperties(searchParameters: MediaScan.SearchParameters, allMovies: Set<MediaScan.TPN>): Set<MediaScan.TPN> {
    const {
        booleanFieldsSearchMap, stringFieldsSearchMap,
        numberFieldsSearchMap,
    } = mapProperties(searchParameters);
    const propertiesWithAllProperties
        = [booleanFieldsSearchMap, stringFieldsSearchMap, numberFieldsSearchMap];
    let result = allMovies;
    [filterByBoolean, filterByString, filterByNumber]
        .forEach((filterFunction : (set: Set<MediaScan.TPN>, propertiesMap: Map<string, any>) => Set<MediaScan.TPN>, index) => {
            result = filterFunction(result, propertiesWithAllProperties[index]);
        });
    return result;
}

/** Filter the tv series based on search parameters */
export function filterTvSeriesByProperties(searchParameters: MediaScan.SearchParameters, allTvSeries: Map<string, Set<MediaScan.TPN>>): Map<string, Set<MediaScan.TPN>> {
    const {
        booleanFieldsSearchMap, stringFieldsSearchMap,
        numberFieldsSearchMap,
    } = mapProperties(searchParameters);
    const propertiesWithAllProperties
        = [booleanFieldsSearchMap, stringFieldsSearchMap, numberFieldsSearchMap];
    let result : Map<string, Set<MediaScan.TPN>> = allTvSeries;
    // filtering stuff
    // it also removes all entries that have an empty Set so that we can clearly see only valid things

    [filterByBoolean, filterByString, filterByNumber]
        .forEach((filterFunction : (set: Set<MediaScan.TPN>, propertiesMap: Map<string, any>) => Set<MediaScan.TPN>, index) => {
            result = new Map(<[string, Set<MediaScan.TPN>][]>
                Array.from(
                    result.entries(),
                    ([showName, showSet]) => [showName, filterFunction(showSet, propertiesWithAllProperties[index])],
                )
                // eslint-disable-next-line no-unused-vars
                .filter(([showName, showSet]) => (showSet as Set<MediaScan.TPN>).size > 0));
        });

    return result;
}
