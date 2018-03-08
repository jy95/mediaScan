/* eslint-disable no-useless-escape,max-len */
// transducers operators
const t = require("transducers.js");
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

    const booleanFieldsSearchMap = new Map(
        <[string, boolean][]>
            t.into(
                filterDefaultBooleanProperties(searchParameters),
                t.compose(
                    t.filter(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.BOOLEAN)),
                    t.filter(({value}) => meetBooleanSpec(value)),
                    t.map(({name, value}) => [name, value])
                ),
                additionalProperties
            )
    );

    const numberFieldsSearchMap = new Map(
        <[string, MediaScanTypes.NumberExpressionObject][]>
            t.into(
                filterDefaultNumberProperties(searchParameters),
                t.compose(
                    t.filter(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.NUMBER)),
                    t.filter(({value}) => meetNumberSpec(value)),
                    t.map(({name, value}) => [name, convertToValidExpression(value as number | string)])
                ),
                additionalProperties
            )
    );

    const stringFieldsSearchMap = new Map(
        <[string, string | string[]][]>
            t.into(
                filterDefaultStringProperties(searchParameters),
                t.compose(
                    t.filter(filterAdditionalProperties(MediaScanTypes.AdditionalPropertiesType.STRING)),
                    t.filter(({value}) => meetStringSpec(value)),
                    t.map(({name, value}) => [name, value])
                ),
                additionalProperties
            )
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
        .reduce(
            (processingResult, [filterFunction, propertiesMap]) => {
                return processingResult.size > 0 && propertiesMap.size > 0 ? filterFunction(processingResult, propertiesMap) : processingResult;
            }
            , allMovies
        );
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
