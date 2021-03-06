import * as MediaScanTypes from "../MediaScanTypes";
import { filterDefaultProperties } from "../utils/utils_functions";

const validExpression = /^(==|>|<|>=|<=)(\d+)$/;

// operator functions
const ops = {
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
  "==": (a, b) => a == b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
};

/**
 * Convert the param to valid expression object for filter function
 */
export function convertToValidExpression(
  param: string | number,
): MediaScanTypes.NumberExpressionObject {
  let returnValue;

  switch (typeof param) {
    case "string":
      // if it is a valid number expression like the regex
      /* istanbul ignore else */
      if (validExpression.test(param as string)) {
        const result = (param as string).match(validExpression);
        returnValue = {
          number: Number(result[2]),
          operator: result[1],
        };
      }
      break;

    // if the param is a number
    case "number":
      returnValue = {
        number: param as number,
        operator: "==",
      };
      break;
  }

  return returnValue;
}

/**
 * Filter function for filterByNumber
 */
function resolveExpression(
  property: string,
  expressionObject: MediaScanTypes.NumberExpressionObject,
  object: MediaScanTypes.TPN | MediaScanTypes.TPN_Extended,
): boolean {
  return ops[expressionObject.operator](
    object[property],
    expressionObject.number,
  );
}

export function filterDefaultNumberProperties(
  searchObject: MediaScanTypes.DefaultSearchParameters,
): Array<MediaScanTypes.filterTuple<MediaScanTypes.NumberExpressionObject>> {
  const propertiesNames = ["season", "episode", "year"];
  return filterDefaultProperties<MediaScanTypes.NumberExpressionObject>(
    propertiesNames,
    searchObject,
    (value) => {
      return meetNumberSpec(value);
    },
    (key, value) => [key, convertToValidExpression(value)],
  );
}

/** Filter the set based on string properties */
// export function filterByNumber(set: Set<TPN>, propertiesMap: Map<string, numberExpressionObject>) : Set<TPN>
export function filterByNumber(
  set: Set<MediaScanTypes.TPN>,
  propertiesMap: Map<string, MediaScanTypes.NumberExpressionObject>,
): Set<MediaScanTypes.TPN> {
  // first step : get an array so that we can do filter/reduce stuff
  // second step : iterate the propertiesMap and do filter and return the filtered array
  // val[0] : the key ; val[1] : the value
  return new Set(
    Array.from(propertiesMap.entries()).reduce(
      // eslint-disable-next-line max-len
      (currentMoviesArray, val) =>
        currentMoviesArray.filter((TPN) =>
          resolveExpression(val[0], val[1], TPN),
        ),
      [...set],
    ),
  );
}

// Just for type check this type
export function meetNumberSpec(value) {
  if (typeof value === "number") {
    return true;
  } else if (typeof value !== "string") {
    return false;
  } else {
    return validExpression.test(value as string);
  }
}
