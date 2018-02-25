// Imports
import FileHound from 'filehound';
import {basename, normalize} from 'path';
import {uniq, difference, partition, cloneDeep, reduce, concat, has, forIn, map, chain, filter, some, includes} from 'lodash';
import PromiseLib from 'bluebird';

const videosExtension = require('video-extensions');
const nameParser = require('parse-torrent-title').parse;
import {EventEmitter} from 'events';

// local import
import {
    filterMoviesByProperties, filterTvSeriesByProperties
}
    from './filters/filterProperties';
import {defaultWhichCategoryFunction, promisifiedAccess} from './utils/utils_functions';

// Typescript types
import mediaScan from "./declaration";

/**
 * Class representing the MediaScan Library
 * @extends {EventEmitter}
 */
module.exports = class MediaScan extends EventEmitter {

    protected defaultPath: string; // Default path , if paths is empty
    protected parser: mediaScan.ParseFunction; // the parser to extract the useful data from name
    protected whichCategory: mediaScan.WhichCategoryFunction; // Function that tell us what is the category of the TPN
    protected paths: string[]; // all the paths that will be explored
    protected categoryForFile: Map<string, mediaScan.Category>; // the mapping between file and Category
    protected stores: mediaScan.MapSet<mediaScan.TPN | mediaScan.TPN_Extended>; // where I keep the result of Category
    // constants getter for external purposes (example create a custom whichCategory function)
    // workaround : const string enum aren't compiled correctly with Babel
    static readonly MOVIES_TYPE = 'MOVIES' as mediaScan.Category.MOVIES_TYPE;
    static readonly TV_SERIES_TYPE = 'TV_SERIES' as mediaScan.Category.TV_SERIES_TYPE;

    constructor({
                    defaultPath = process.cwd(),
                    paths = [],
                    allFilesWithCategory = new Map(),
                    movies = new Set(),
                    series = new Map(),
                }: mediaScan.DataParameters = {},
                {
                    parser = nameParser,
                    whichCategory = defaultWhichCategoryFunction,
                }: mediaScan.CustomFunctionsConfig = {}) {
        super();
        this.parser = parser;
        this.whichCategory = whichCategory;
        this.defaultPath = defaultPath;
        this.paths = paths;
        this.stores = new Map();
        // workaround : const string enum aren't compiled correctly with Babel
        this.stores.set(MediaScan.MOVIES_TYPE, movies);
        this.stores.set(MediaScan.TV_SERIES_TYPE, series);
        this.categoryForFile = allFilesWithCategory;
    }

    private addNewFiles(files: string[]): Promise<any> {
        return new PromiseLib((resolve, reject) => {
            try {
                // find the new files to be added
                const alreadyFoundFiles = [...this.categoryForFile.keys()];
                const newFiles = difference(files, alreadyFoundFiles);

                // process each file
                let scanningResult = reduce(newFiles, (result, file) => {
                    // get data from nameParser lib
                    // what we need is only the basename, not the full path
                    const jsonFile = this.parser(basename(file));
                    // extend this object in order to be used by this library
                    Object.assign(jsonFile, {filePath: file});
                    // find out which type of this file
                    // if it has not undefined properties (season and episode) => TV_SERIES , otherwise MOVIE
                    const fileCategory = this.whichCategory(jsonFile);
                    // add it in found files
                    this.categoryForFile.set(file, fileCategory);
                    // store the result for next usage
                    result[fileCategory] = concat((has(result, fileCategory)) ? result[fileCategory] : [], jsonFile);
                    return result;
                }, {});

                // add the found movies
                if (scanningResult[MediaScan.MOVIES_TYPE] !== undefined) {
                    this.stores.set(MediaScan.MOVIES_TYPE,
                        new Set([...this.allMovies, ...scanningResult[MediaScan.MOVIES_TYPE]]));
                }

                // add the found tv-series
                if (scanningResult[MediaScan.TV_SERIES_TYPE] !== undefined) {
                    // mapping for faster result(s)
                    let newSeries = reduce(scanningResult[MediaScan.TV_SERIES_TYPE], (result, tvSeries) => {
                        result[tvSeries.title] = concat((has(result, tvSeries.title)) ? result[tvSeries.title] : [], tvSeries);
                        return result;
                    }, {});
                    // fastest way to update things
                    let newTvSeries = this.allTvSeries;
                    forIn(newSeries, (seriesArray, seriesName) => {
                        let resultSet = (newTvSeries.has(seriesName)) ? newTvSeries.get(seriesName) : new Set();
                        newTvSeries.set(
                            seriesName,
                            new Set([...resultSet, ...seriesArray]),
                        )
                    });
                    // update the stores var
                    this.stores.set(MediaScan.TV_SERIES_TYPE, newTvSeries);
                }

                resolve();
            } catch (err) {
                reject(err);
            }
        }).bind(this);
    }

    static listVideosExtension(): string[] {
        return videosExtension;
    }

    addNewPath(...paths: string[]): Promise<any> {
        // the user should provide us at lest a path
        if (paths.length === 0) {
            this.emit('missing_parameter', {
                functionName: 'addNewPath',
            });
            return Promise.reject(new Error('Missing parameter'));
        }

        return new PromiseLib(((resolve, reject) => {
            PromiseLib.map(paths, path => promisifiedAccess(path)).then(() => {
                // keep only unique paths
                // use normalize for cross platform's code
                this.paths = uniq([...this.paths, ...paths.map(normalize)]);
                this.emit('addNewPath', {paths: this.paths});
                resolve('All paths were added!');
            }).catch((e) => {
                this.emit('error_in_function', {
                    functionName: 'addNewPath',
                    error: e.message,
                });
                reject(e);
            });
        })).bind(this);
    }

    hasPathsProvidedByUser(): boolean {
        return this.paths.length !== 0;
    }

    scan(): Promise<any> {
        return new PromiseLib((resolve, reject) => {
            FileHound
                .create()
                .paths((this.paths.length === 0) ? this.defaultPath : this.paths)
                .ext(videosExtension)
                .find()
                .then(
                    files => PromiseLib.join(this.addNewFiles(files), () => {
                        return Promise.resolve(files)
                    })
                )
                .then((files) => {
                    this.emit('scan', {files: files});
                    resolve('Scanning completed');
                })
                .catch((err) => {
                    this.emit('error_in_function', {
                        functionName: 'scan',
                        error: err.message,
                    });
                    reject(err);
                });

        }).bind(this);
    }

    removeOldFiles(...files: string[]): Promise<any> {
        return new PromiseLib((resolve, reject) => {
            try {
                // get the data to handle the two cases
                const processData = partition(
                    filter(
                        map(
                            files,
                            (file) => {
                                return {filePath: file, category: this.categoryForFile.get(file)};
                            }
                        ), (resultObject) => resultObject.category !== undefined
                    ), file => file.category === MediaScan.TV_SERIES_TYPE
                );

                // for movies, just an easy removal
                if (processData[1].length > 0){
                    this.stores.set(
                        MediaScan.MOVIES_TYPE,
                        new Set(
                            filter(...this.allMovies, (movie) => !some(map(processData[1], 'filePath'), movie.filePath))
                        )
                    );
                }

                // for series , a bit more complex
                if (processData[0].length > 0){

                    // Get the series and their files that will be deleted
                    const seriesShows = reduce(processData[0], (result, file) => {
                        const seriesName = this.parser(basename(file.filePath)).title;
                        result[seriesName] = concat((has(result, seriesName)) ? result[seriesName] : [], file.filePath);
                        return result;
                    }, {});

                    let newTvSeries = this.allTvSeries;
                    // check if needed to store new Value
                    let shouldUpdate = false;
                    forIn(seriesShows, (seriesArray, seriesName) => {
                        let previousSet = (newTvSeries.has(seriesName)) ? newTvSeries.get(seriesName) : new Set();
                        let filteredSet: Set<mediaScan.TPN_Extended> = new Set(
                            filter([...previousSet], (episode) => !includes(seriesArray, episode.filePath))
                        );
                        // should I update later ?
                        if (previousSet.size !== filteredSet.size)
                            shouldUpdate = true;
                        // if the filtered set is empty => no more episodes for this series
                        if (filteredSet.size === 0) {
                            newTvSeries.delete(seriesName);
                        } else newTvSeries.set(seriesName, filteredSet);
                    });
                    // save the updated map
                    if (shouldUpdate)
                        this.stores.set(MediaScan.TV_SERIES_TYPE, newTvSeries);
                }

                // remove the mapping of each deleted file(s)
                for (const file of files) {
                    this.categoryForFile.delete(file);
                }
                this.emit('removeOldFiles', {files});
                resolve({
                    message: 'The files have been deleted from the library',
                    files,
                });
            } catch (err) {
                this.emit('error_in_function', {
                    functionName: 'removeOldFiles',
                    error: err.message,
                });
                reject(err);
            }
        }).bind(this);
    }

    get allMovies(): Set<mediaScan.TPN_Extended> {
        // workaround : const string enum aren't compiled correctly with Babel
        return cloneDeep(this.stores.get(MediaScan.MOVIES_TYPE));
    }

    get allTvSeries(): Map<string, Set<mediaScan.TPN_Extended>> {
        // workaround : const string enum aren't compiled correctly with Babel
        return cloneDeep(this.stores.get(MediaScan.TV_SERIES_TYPE));
    }

    get allFilesWithCategory(): Map<string, string> {
        return cloneDeep(this.categoryForFile);
    }

    // full data of lib as JSON string
    toJSON(): string {
        const tvSeries = this.allTvSeries;
        return `{
    "paths":${JSON.stringify([...this.paths])},
    "allFilesWithCategory":${JSON.stringify([...this.allFilesWithCategory])},
    "movies":${JSON.stringify([...this.allMovies])},
    "series":${JSON.stringify([...tvSeries].map(serie =>
            // serie[0] contains the title and [1] the wrong JSON (only a tuple of the set) ; let fix it
            [serie[0], [...tvSeries.get(serie[0])]]))}
    }`.trim();
    }

    // data as a JSON object
    toJSONObject(looseMode? : boolean) : mediaScan.LibAsJson {
        // if in loose Mode , the objects will only contains the mapping between filepath and Category
        const toBeSerialized = (looseMode)
            ? [ ["allFilesWithCategory", [...this.allFilesWithCategory] ] ]
            : [
                ["paths", [...this.paths] ],
                ["allFilesWithCategory", [...this.allFilesWithCategory] ],
                ["movies", [...this.allMovies]],
                ["series", [...this.allTvSeries].map(
                    // serie[0] contains the title and [1] the wrong JSON (only a tuple of the set) ; let fix it
                    series => [series[0], [...this.allTvSeries.get(series[0])] ]
                )]
            ];

        return toBeSerialized.reduce( (result, [key, value] ) => {
            result[key as string] = value;
            return result;
        }, {});
    }

    static createFromJSON(json: mediaScan.LibAsJson, customConfig?: mediaScan.CustomFunctionsConfig): MediaScan {
        let config: mediaScan.DataParameters = {};
        // transform the param
        /* istanbul ignore else */
        if (json.allFilesWithCategory) {
            config.allFilesWithCategory = new Map(json.allFilesWithCategory);
        }
        /* istanbul ignore else */
        if (json.movies) {
            config.movies = new Set(json.movies);
        }
        /* istanbul ignore else */
        if (json.series) {
            let createdMap = new Map();
            for (let [series_title, set_series] of json.series) {
                createdMap.set(series_title, new Set(set_series));
            }
            config.series = createdMap;
        }
        /* istanbul ignore else */
        if (json.paths) {
            config.paths = json.paths;
        }
        return new MediaScan(config, customConfig);
    }

    filterMovies(searchParameters: mediaScan.SearchParameters = {}) {
        // apply params based on types
        return filterMoviesByProperties(searchParameters, this.allMovies);
    }

    filterTvSeries(searchParameters: mediaScan.SearchParameters = {}) {
        return filterTvSeriesByProperties(searchParameters, this.allTvSeries);
    }
};
