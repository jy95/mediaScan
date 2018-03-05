/* eslint-disable no-useless-escape,max-len */
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
    const booleanFieldsSearchMap = new Map(
        <[string, boolean][]>
            [
                ...additionalProperties
                    .filter(newProperty => newProperty.type === 'boolean' as MediaScanTypes.AdditionalPropertiesType.BOOLEAN)
                    .reduce((sub_acc, {name, value}) => {
                        /* istanbul ignore else */
                        if (meetBooleanSpec(value))
                            sub_acc.push([name, value]);
                        return sub_acc;
                    }, [])
                ,
                ...filterDefaultBooleanProperties(searchParameters)
            ]
    );

    const numberFieldsSearchMap = new Map(
        <[string, MediaScanTypes.NumberExpressionObject][]>
            [
                ...additionalProperties
                    .filter(newProperty => newProperty.type === 'number' as MediaScanTypes.AdditionalPropertiesType.NUMBER)
                    .reduce((sub_acc, {name, value}) => {
                        /* istanbul ignore else */
                        if (meetNumberSpec(value))
                            sub_acc.push([name, convertToValidExpression(value as number | string)]);
                        return sub_acc;
                    }, [])
                ,
                ...filterDefaultNumberProperties(searchParameters)
            ]
    );

    const stringFieldsSearchMap = new Map(
        <[string, string | string[]][]>
            [
                ...additionalProperties
                    .filter(newProperty => newProperty.type === 'string' as MediaScanTypes.AdditionalPropertiesType.STRING)
                    .reduce((sub_acc, {name, value}) => {
                        /* istanbul ignore else */
                        if (meetStringSpec(value))
                            sub_acc.push([name, value]);
                        return sub_acc;
                    }, [])
                ,
                ...filterDefaultStringProperties(searchParameters)
            ]
    );

    return {
        booleanFieldsSearchMap,
        numberFieldsSearchMap,
        stringFieldsSearchMap,
    };
}

/** Filter the movies based on search parameters */
export function filterMoviesByProperties(searchParameters: MediaScanTypes.SearchParameters, allMovies: Set<MediaScanTypes.TPN>): Set<MediaScanTypes.TPN> {
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
        .reduce((processingResult, [filterFunction, propertiesMap]) => filterFunction(processingResult, propertiesMap)
            , allMovies);
}

/** Filter the tv series based on search parameters */
export function filterTvSeriesByProperties(searchParameters: MediaScanTypes.SearchParameters, allTvSeries: Map<string, Set<MediaScanTypes.TPN>>): Map<string, Set<MediaScanTypes.TPN>> {
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
