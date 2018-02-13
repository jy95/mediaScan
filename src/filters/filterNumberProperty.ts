import * as MediaScan from "../custom_types";;

/**
 * Convert the param to valid expression object for filter function
 */
export function convertToValidExpression(param: string | number): MediaScan.numberExpressionObject {
    const validExpression = /^(==|>|<|>=|<=)(\d+)$/;
    let returnValue;

    switch (typeof param) {
        case "string":
            // if it is a valid number expression like the regex
            if (validExpression.test(param as string)) {
                let result = (param as string).match(validExpression);
                returnValue = {
                    operator: result[1],
                    number: Number(result[2]),
                };
            }
            break;

        // if the param is a number
        case "number":
            returnValue = {
                operator: '==',
                number: param as number,
            };
            break;
    }

    return returnValue;
}

/**
 * Filter function for filterByNumber
 */
function resolveExpression(property: string, expressionObject: MediaScan.numberExpressionObject, object: MediaScan.TPN | MediaScan.TPN_Extended): boolean {
    let {operator, number} = expressionObject;
    // No : eval is not all evil but you should know what you are doing
    // eslint-disable-next-line no-eval
    return eval(`${object[property]}${operator}${number}`);
}

/**
 * Provides a map with valid default properties
 * @param {searchParameters} searchObject - search parameters
 * @return {Map<string, numberExpressionObject>} the result map
 */
export function filterDefaultNumberProperties(searchObject: MediaScan.defaultSearchParameters) {
    const {
        season, episode, year,
    } = searchObject;


    const propertiesArray = [season, episode, year];
    const propertiesNames = ['season', 'episode', 'year'];

    return propertiesArray.reduce((propertiesMap, val, index) => {
        if (val !== undefined) {
            propertiesMap.set(propertiesNames[index], convertToValidExpression(val));
        }
        return propertiesMap;
    }, new Map());
}

/** Remove the default number properties */
export function excludeDefaultNumberProperties(searchObject: MediaScan.defaultSearchParameters): MediaScan.defaultSearchParameters {
    const {
        season, episode, year,
        ...rest
    } = searchObject;
    return rest;
}

/** Filter the set based on string properties */
// export function filterByNumber(set: Set<TPN>, propertiesMap: Map<string, numberExpressionObject>) : Set<TPN>
export function filterByNumber(set: Set<MediaScan.TPN>, propertiesMap: Map<string, MediaScan.numberExpressionObject>): Set<MediaScan.TPN> {
    // first step : get an array so that we can do filter/reduce stuff
    // second step : iterate the propertiesMap and do filter and return the filtered array
    // val[0] : the key ; val[1] : the value
    return new Set(Array
        .from(propertiesMap.entries())
        .reduce(
            // eslint-disable-next-line max-len
            (currentMoviesArray, val) => currentMoviesArray.filter(TPN => resolveExpression(val[0], val[1], TPN))
            , [...set],
        ));
}
