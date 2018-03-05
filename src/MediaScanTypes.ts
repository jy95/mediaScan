export interface TPN {
    title: string;
    year?: number;
    resolution?: string;
    extended?: boolean;
    unrated?: boolean;
    proper?: boolean;
    repack?: boolean;
    convert?: boolean;
    hardcoded?: boolean;
    retail?: boolean;
    remastered?: boolean;
    region?: string;
    container?: string;
    source?: string;
    codec?: string;
    audio?: string;
    group?: string;
    season?: number;
    episode?: number;
    language?: string;
}

// extended by my own purpose
export interface TPN_Extended extends TPN {
    filePath: string;
}

// A parsing function to be used with this lib
export interface ParseFunction {
    (title: string): TPN | TPN_Extended;
}

// the media files categories
// const enum
export enum Category {
    MOVIES_TYPE = 'MOVIES',
    TV_SERIES_TYPE = 'TV_SERIES'
}

// which category is this file
export interface WhichCategoryFunction {
    (object: TPN): Category
}

// The sub way to store all kind of media files found in paths
export type MappedType<T> = Map<string, Set<T>>;
export type MapSet<T> = Map<Category, MappedType<T> | Set<T>>;

// example '<=25'
export type NumberSearchSyntax = string;

// to handle number operations
export interface NumberExpressionObject {
    operator: "==" | ">" | "<" | ">=" | "<=",
    number: number
}
// const enum
export enum AdditionalPropertiesType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean'
}

// additional Properties
export interface AdditionalProperties {
    type: AdditionalPropertiesType,
    name: string,
    value: boolean | string | string[] | number | NumberSearchSyntax
}

export interface MinimalSearchParameters {
    additionalProperties?: AdditionalProperties[]
}

export interface DefaultSearchParameters extends MinimalSearchParameters {
    extended?: boolean,
    unrated?: boolean,
    proper?: boolean,
    repack?: boolean,
    convert?: boolean,
    hardcoded?: boolean,
    retail?: boolean,
    remastered?: boolean,
    season?: number | NumberSearchSyntax,
    episode?: number | NumberSearchSyntax,
    year?: number | NumberSearchSyntax,
    title?: string | string[],
    resolution?: string | string[],
    codec?: string | string[],
    audio?: string | string[],
    group?: string | string[],
    region?: string | string[],
    container?: string | string[],
    language?: string | string[],
    source?: string | string[],
}

// search parameters for filter functions
export type SearchParameters = Partial<DefaultSearchParameters | MinimalSearchParameters>;

// for filtering tuples inside SearchParameters
export type filterTuple<T> = [string, T];

// for optimized filtering function
export type filterFunctionTuple = [{(set: Set<TPN>, propertiesMap: Map<string, any>)}, Map<string, any>];

// for tuples inside json in createFromJSON
export type mappingStringAndCategory = [string, Category];
export type mappingStringAndTPNArray = [string, TPN[]];

// json result to be used in createFromJSON
export interface LibAsJson {
    allFilesWithCategory?: mappingStringAndCategory[],
    movies?: TPN[],
    series?: mappingStringAndTPNArray[],
    paths?: string[]
}

// the data parameters for constructor (aka first argument)
export interface DataParameters {
    defaultPath?: string, // Default path , if paths is empty
    paths?: string[], // all the paths that will be explored
    allFilesWithCategory?: Map<string, Category>, // the mapping between file and Category
    movies?: Set<TPN | TPN_Extended>, // all the movies
    series?: Map<string, Set<TPN | TPN_Extended>>
}

// the custom functions (in order to have a different behaviour) for constructor (aka second argument)
export interface CustomFunctionsConfig {
    parser?: ParseFunction,
    whichCategory?: WhichCategoryFunction
}