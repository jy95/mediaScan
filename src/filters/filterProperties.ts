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
import MediaScan from "../declaration";

function mapProperties(searchParameters: MediaScan.SearchParameters): {
    booleanFieldsSearchMap: Map<string, boolean>, numberFieldsSearchMap: Map<string, MediaScan.NumberExpressionObject>,
    stringFieldsSearchMap: Map<string, string | string[]>
} {

    // organize search based on field type : boolean - string - number . Now optimized by Me XD
    // add the optional new properties , optionally provided by user
    let additionalProperties = (searchParameters.additionalProperties === undefined) ? [] : searchParameters.additionalProperties;
    const booleanFieldsSearchMap = new Map(
        <[string, boolean][]>
        [
            ...additionalProperties
                .filter(newProperty => newProperty.type === 'boolean' as MediaScan.AdditionalPropertiesType.BOOLEAN)
                .reduce((sub_acc, {name, value}) => {
                    /* istanbul ignore else */
                    if ( meetBooleanSpec(value) )
                        sub_acc.push([name, value]);
                    return sub_acc;
                }, [])
            ,
            ...filterDefaultBooleanProperties(searchParameters)
        ]
    );

    const numberFieldsSearchMap = new Map(
        <[string, MediaScan.NumberExpressionObject][]>
            [
                ...additionalProperties
                    .filter(newProperty => newProperty.type === 'number' as MediaScan.AdditionalPropertiesType.NUMBER)
                    .reduce((sub_acc, {name, value}) => {
                        /* istanbul ignore else */
                        if (meetNumberSpec(value))
                            sub_acc.push([name, convertToValidExpression(value as number|string)]);
                        return sub_acc;
                    }, [])
                ,
                ...filterDefaultNumberProperties(searchParameters)
            ]
    );

    const stringFieldsSearchMap = new Map(
        <[string, string|string[] ][]>
      [
          ...additionalProperties
              .filter(newProperty => newProperty.type === 'string' as MediaScan.AdditionalPropertiesType.STRING)
              .reduce( (sub_acc, {name, value} ) => {
                  /* istanbul ignore else */
                  if (meetStringSpec(value))
                      sub_acc.push([name, value ]);
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
export function filterMoviesByProperties(searchParameters: MediaScan.SearchParameters, allMovies: Set<MediaScan.TPN>): Set<MediaScan.TPN> {
    const {
        booleanFieldsSearchMap, stringFieldsSearchMap,
        numberFieldsSearchMap,
    } = mapProperties(searchParameters);
    const filterStuff : MediaScan.filterFunctionTuple[] = [
        [filterByBoolean, booleanFieldsSearchMap],
        [filterByString , stringFieldsSearchMap],
        [filterByNumber, numberFieldsSearchMap]
    ];

    return filterStuff
        .reduce((processingResult, [filterFunction , propertiesMap ]) => filterFunction(processingResult, propertiesMap)
            , allMovies);
}

/** Filter the tv series based on search parameters */
export function filterTvSeriesByProperties(searchParameters: MediaScan.SearchParameters, allTvSeries: Map<string, Set<MediaScan.TPN>>): Map<string, Set<MediaScan.TPN>> {
    const {
        booleanFieldsSearchMap, stringFieldsSearchMap,
        numberFieldsSearchMap,
    } = mapProperties(searchParameters);
    const propertiesWithAllProperties
        = [booleanFieldsSearchMap, stringFieldsSearchMap, numberFieldsSearchMap];
    let result: Map<string, Set<MediaScan.TPN>> = allTvSeries;
    // filtering stuff
    // it also removes all entries that have an empty Set so that we can clearly see only valid things

    [filterByBoolean, filterByString, filterByNumber]
        .forEach((filterFunction: (set: Set<MediaScan.TPN>, propertiesMap: Map<string, any>) => Set<MediaScan.TPN>, index) => {
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
