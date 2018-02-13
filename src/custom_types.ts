// default result object from all the parser I used
// https://github.com/clement-escolano/parse-torrent-title
// https://github.com/jy95/torrent-name-parser
declare namespace MediaScan {

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
    export const enum Category {
        MOVIES_TYPE = 'MOVIES',
        TV_SERIES_TYPE = 'TV_SERIES'
    }

// which category is this file
    export interface whichCategoryFunction {
        (object: TPN): Category
    }

// The sub way to store all kind of media files found in paths
    export type MappedType<T> = Map<string, Set<T>>;
    export type MapSet<T> = Map<Category, MappedType<T> | Set<T>>;

// example '<=25'
    export type numberSearchSyntax = string;

// to handle number operations
    export interface numberExpressionObject {
        operator: "==" | ">" | "<" | ">=" | "<=",
        number: number
    }

    export const enum additionalPropertiesType {
        STRING = 'string',
        NUMBER = 'number',
        BOOLEAN = 'boolean'
    }

// additional Properties
    export interface additionalProperties {
        type: additionalPropertiesType,
        name: string,
        value: boolean | string | string[] | number | numberSearchSyntax
    }

    export interface minimalSearchParameters {
        additionalProperties?: additionalProperties[]
    }

    export interface defaultSearchParameters extends minimalSearchParameters {
        extended?: boolean,
        unrated?: boolean,
        proper?: boolean,
        repack?: boolean,
        convert?: boolean,
        hardcoded?: boolean,
        retail?: boolean,
        remastered?: boolean,
        season?: number | numberSearchSyntax,
        episode?: number | numberSearchSyntax,
        year?: number | numberSearchSyntax,
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
}

export = MediaScan;
