// Type definitions for MediaScan
// Project: MediaScan
// Definitions by: jy95

/*~ This is the module template file for class modules.
 *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ Note that ES6 modules cannot directly export class objects.
 *~ This file should be imported using the CommonJS-style:
 *~   import x = require('someLibrary');
 *~
 *~ Refer to the documentation to understand common
 *~ workarounds for this limitation of ES6 modules.
 */

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
import * as MediaScanTypes from "./src/MediaScanTypes";

export = MediaScan;

/*~ Write your module's methods and properties in this class */
declare class MediaScan extends NodeJS.EventEmitter {

    // instance properties
    protected defaultPath: string; // Default path , if paths is empty
    protected parser: MediaScanTypes.ParseFunction; // the parser to extract the useful data from name
    protected whichCategory: MediaScanTypes.WhichCategoryFunction; // Function that tell us what is the category of the TPN
    protected paths: string[]; // all the paths that will be explored
    protected categoryForFile: Map<string, MediaScanTypes.Category>; // the mapping between file and Category
    protected stores: MediaScanTypes.MapSet<MediaScanTypes.TPN | MediaScanTypes.TPN_Extended>; // where I keep the result of Category

    // static properties
    static readonly MOVIES_TYPE : MediaScanTypes.Category.MOVIES_TYPE;
    static readonly TV_SERIES_TYPE : MediaScanTypes.Category.TV_SERIES_TYPE;

    // getters
    allMovies(): Set<MediaScanTypes.TPN_Extended>;
    allTvSeries(): Map<string, Set<MediaScanTypes.TPN_Extended>>;
    allFilesWithCategory(): Map<string, MediaScanTypes.Category>;
    allTvSeriesNames() : string[];

    // constructor
    constructor(dataParameters?: MediaScanTypes.DataParameters, customConfig?: MediaScanTypes.CustomFunctionsConfig);

    // static methods
    static listVideosExtension(): string[];
    createFromJSON(json: MediaScanTypes.LibAsJson, customConfig?: MediaScanTypes.CustomFunctionsConfig): MediaScan;

    // instance methods

    private addNewFiles(files: string[]): Promise<any>;
    addNewPath(...paths: string[]): Promise<any>;
    hasPathsProvidedByUser(): boolean;
    scan(): Promise<any>;
    removeOldFiles(...files: string[]): Promise<any>;
    toJSON(): string;
    toJSONObject(looseMode? : boolean) : MediaScanTypes.LibAsJson;

    // filtering methods
    filterMovies(searchParameters: MediaScanTypes.SearchParameters);
    filterTvSeries(searchParameters: MediaScanTypes.SearchParameters)
}