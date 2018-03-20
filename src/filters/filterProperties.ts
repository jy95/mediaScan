/* eslint-disable no-useless-escape,max-len */
import {compose, pluck, filter as filterFP} from 'lodash/fp'
import {isEmpty} from 'lodash';
/**
 * Boolean properties filter
 */
import {
    filterDefaultBooleanProperties,
    filterByBoolean,
    meetBooleanSpec,
} from './filterBooleanProperty';

/**
 * Number properties filter
 */
import {
    convertToValidExpression,
    filterDefaultNumberProperties,
    filterByNumber, meetNumberSpec,
} from './filterNumberProperty';

/**
 * String properties filter
 */
import {
    filterByString, filterDefaultStringProperties, meetStringSpec,
} from './filterStringProperty';
import * as MediaScanTypes from "../MediaScanTypes";


function mapProperties(searchParameters: MediaScanTypes.SearchParameters): {
    booleanFieldsSearchMap: Map<string, boolean>, numberFieldsSearchMap: Map<string, MediaScanTypes.NumberExpressionObject>,
    stringFieldsSearchMap: Map<string, string | string[]>
} {

    // organize search based on field type : boolean - string - number . Now optimized by Me XD
    // add the optional new properties , optionally provided by user
    let additionalProperties = (searchParameters.additionalProperties === undefined) ? [] : searchParameters.additionalProperties;
    let filterAdditionalProperties = (type) => (newProperty) => newProperty.type === type;
    let booleanFieldsSearchArray = filterDefaultBooleanProperties(searchParameters);
    let numberFieldsSearchArray = filterDefaultNumberProperties(searchParameters);
    let stringFieldsSearchArray = filterDefaultStringProperties(searchParameters);

    // add additional Properties into the proper array
    Array.prototype.push.apply(
        booleanFieldsSearchArray,
        compose(
            pluck(({name, value}) => [name, value]),
            filterFP(({value}) => meetBooleanSpec(value)),
            filterFP(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.BOOLEAN))
        )(additionalProperties)
    );

    Array.prototype.push.apply(
        numberFieldsSearchArray,
        compose(
            pluck(({name, value}) => [name, convertToValidExpression(value as number | string)]),
            filterFP(({value}) => meetNumberSpec(value)),
            filterFP(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.NUMBER))
        )(additionalProperties)
    );

    Array.prototype.push.apply(
        stringFieldsSearchArray,
        compose(
            pluck(({name, value}) => [name, value]),
            filterFP(({value}) => meetStringSpec(value)),
            filterFP(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.STRING))
        )(additionalProperties)
    );

    return {
        booleanFieldsSearchMap: new Map<string, boolean>(booleanFieldsSearchArray),
        numberFieldsSearchMap: new Map<string, MediaScanTypes.NumberExpressionObject>(numberFieldsSearchArray),
        stringFieldsSearchMap: new Map<string, string|string[]>(stringFieldsSearchArray),
    };
}

/** Filter the movies based on search parameters */
export function filterMoviesByProperties(searchParameters: MediaScanTypes.SearchParameters, allMovies: Set<MediaScanTypes.TPN>): Set<MediaScanTypes.TPN> {
    // Check if empty - for faster result
    if (isEmpty(searchParameters))
        return allMovies;

    const {
        booleanFieldsSearchMap, stringFieldsSearchMap,
        numberFieldsSearchMap,
    } = mapProperties(searchParameters);
    const filterStuff: MediaScanTypes.filterFunctionTuple[] = [
        [filterByBoolean, booleanFieldsSearchMap],
        [filterByString, stringFieldsSearchMap],
        [filterByNumber, numberFieldsSearchMap]
    ];

    return filterStuff
        .reduce(
            (processingResult, [filterFunction, propertiesMap]) => {
                return processingResult.size > 0 && propertiesMap.size > 0 ? filterFunction(processingResult, propertiesMap) : processingResult;
            }
            , allMovies
        );
}

/** Filter the tv series based on search parameters */
export function filterTvSeriesByProperties(searchParameters: MediaScanTypes.SearchParameters, allTvSeries: Map<string, Set<MediaScanTypes.TPN>>): Map<string, Set<MediaScanTypes.TPN>> {
    // Check if empty for faster result
    if (isEmpty(searchParameters))
        return allTvSeries;

    const {
        booleanFieldsSearchMap, stringFieldsSearchMap,
        numberFieldsSearchMap,
    } = mapProperties(searchParameters);
    const filterStuff: MediaScanTypes.filterFunctionTuple[] = [
        [filterByBoolean, booleanFieldsSearchMap],
        [filterByString, stringFieldsSearchMap],
        [filterByNumber, numberFieldsSearchMap]
    ];

    // apply the filters
    return new Map(
        [...allTvSeries]
            .reduce((processingArray, [showName, showSet]) => {
                // execute the filter functions
                let filteredSet = filterStuff.reduce((currentFilteredSet, [filterFunction, propertiesMap]) => {
                    return currentFilteredSet.size > 0 && propertiesMap.size > 0 ? filterFunction(currentFilteredSet, propertiesMap) : currentFilteredSet;
                }, showSet);
                // add this entry if there is soms episode(s) left
                if (filteredSet.size > 0)
                    processingArray.push([showName, filteredSet]);
                // reducer call
                return processingArray;
            }, [])
    );
}
