import MediaScan from "../declaration";
import {filterDefaultProperties} from "../utils/utils_functions";

/**
 * Convert the param to valid expression object for filter function
 */
export function convertToValidExpression(param: string | number): MediaScan.NumberExpressionObject {
    const validExpression = /^(==|>|<|>=|<=)(\d+)$/;
    let returnValue;

    switch (typeof param) {
        case "string":
            // if it is a valid number expression like the regex
            /* istanbul ignore else */
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
function resolveExpression(property: string, expressionObject: MediaScan.NumberExpressionObject, object: MediaScan.TPN | MediaScan.TPN_Extended): boolean {
    let {operator, number} = expressionObject;
    // No : eval is not all evil but you should know what you are doing
    // eslint-disable-next-line no-eval
    return eval(`${object[property]}${operator}${number}`);
}

export function filterDefaultNumberProperties(searchObject: MediaScan.DefaultSearchParameters) : MediaScan.filterTuple<number | MediaScan.NumberSearchSyntax>[] {
    const propertiesNames = ['season', 'episode', 'year'];
    return filterDefaultProperties<number | MediaScan.NumberSearchSyntax>(propertiesNames, searchObject, (value) => {
        return meetNumberSpec(value);
    });
}

/** Filter the set based on string properties */
// export function filterByNumber(set: Set<TPN>, propertiesMap: Map<string, numberExpressionObject>) : Set<TPN>
export function filterByNumber(set: Set<MediaScan.TPN>, propertiesMap: Map<string, MediaScan.NumberExpressionObject>): Set<MediaScan.TPN> {
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

// Just for type check this type
export function meetNumberSpec(value) {
    return (typeof value === 'string' || typeof value === 'number');
}