// Imports
import FileHound from 'filehound';
import {basename, normalize} from 'path';
import {uniq, difference, cloneDeep, reduce, concat, has, forIn, map, filter, some, includes} from 'lodash';
import PromiseLib from 'bluebird';

const videosExtension = require('video-extensions');
const nameParser = require('parse-torrent-title').parse;
import {EventEmitter} from 'events';

import { compose, pluck, filter as filterFP } from 'lodash/fp'

// local import
import {
    filterMoviesByProperties, filterTvSeriesByProperties
}
    from './filters/filterProperties';
import {defaultWhichCategoryFunction, promisifiedAccess} from './utils/utils_functions';
import * as MediaScanTypes from "./MediaScanTypes";

/**
 * Class representing the MediaScan Library
 * @extends {EventEmitter}
 */
class MediaScan extends EventEmitter {

    protected defaultPath: string; // Default path , if paths is empty
    protected parser: MediaScanTypes.ParseFunction; // the parser to extract the useful data from name
    protected whichCategory: MediaScanTypes.WhichCategoryFunction; // Function that tell us what is the category of the TPN
    protected paths: string[]; // all the paths that will be explored
    protected categoryForFile: Map<string, MediaScanTypes.Category>; // the mapping between file and Category
    protected stores: MediaScanTypes.MapSet<MediaScanTypes.TPN | MediaScanTypes.TPN_Extended>; // where I keep the result of Category
    // constants getter for external purposes (example create a custom whichCategory function)
    static readonly MOVIES_TYPE = MediaScanTypes.Category.MOVIES_TYPE;
    static readonly TV_SERIES_TYPE = MediaScanTypes.Category.TV_SERIES_TYPE;

    constructor({
                    defaultPath = process.cwd(),
                    paths = [],
                    allFilesWithCategory = new Map(),
                    movies = new Set(),
                    series = new Map(),
                }: MediaScanTypes.DataParameters = {},
                {
                    parser = nameParser,
                    whichCategory = defaultWhichCategoryFunction,
                }: MediaScanTypes.CustomFunctionsConfig = {}) {
        super();
        this.parser = parser;
        this.whichCategory = whichCategory;
        this.defaultPath = defaultPath;
        this.paths = paths;
        this.stores = new Map();
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
                // transformations for transducers
                let mapCategoryFiles = compose(
                    filterFP( resultObject => resultObject.category !== undefined ),
                    pluck(
                        file => {
                            return {filePath: file, category: this.categoryForFile.get(file)};
                        }
                    )
                );
                let filterContentType = (requestedType) => (file) => file.category === requestedType;

                // processing
                const mappedFiles = mapCategoryFiles(files);

                // movies files
                const moviesFiles = filter(mappedFiles, filterContentType(MediaScan.MOVIES_TYPE));
                const moviesFilePaths = map(moviesFiles, 'filePath');

                // for movies, just an easy removal
                if (moviesFiles.length > 0){
                    // update the filtered Set
                    this.stores.set(
                        MediaScan.MOVIES_TYPE,
                        new Set(
                            filter(...this.allMovies, (movie) => !some(moviesFilePaths, movie.filePath))
                        )
                    );
                }

                // tv-series
                const seriesFiles = filter(mappedFiles, filterContentType(MediaScan.TV_SERIES_TYPE));

                // for series , a bit more complex
                if (seriesFiles.length > 0){

                    // Get the series and their files that will be deleted
                    const seriesShows = reduce(seriesFiles, (result, file) => {
                        const seriesName = this.parser(basename(file.filePath)).title;
                        result[seriesName] = concat((has(result, seriesName)) ? result[seriesName] : [], file.filePath);
                        return result;
                    }, {});

                    let newTvSeries = this.allTvSeries;
                    // check if needed to store new Value
                    let shouldUpdate = false;
                    forIn(seriesShows, (seriesArray, seriesName) => {
                        let previousSet = (newTvSeries.has(seriesName)) ? newTvSeries.get(seriesName) : new Set();
                        let filteredSet: Set<MediaScanTypes.TPN_Extended> = new Set(
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

    get allMovies(): Set<MediaScanTypes.TPN_Extended> {
        return this.stores.get(MediaScan.MOVIES_TYPE) as Set<MediaScanTypes.TPN_Extended>;
    }

    get allTvSeries(): Map<string, Set<MediaScanTypes.TPN_Extended>> {
        return this.stores.get(MediaScan.TV_SERIES_TYPE) as Map<string, Set<MediaScanTypes.TPN_Extended>>;
    }

    get allFilesWithCategory(): Map<string, MediaScanTypes.Category> {
        return cloneDeep(this.categoryForFile);
    }

    get allTvSeriesNames() : string[] {
        return [...this.allTvSeries.keys()];
    }

    // full data of lib as JSON string
    toJSON(): string {
        return JSON.stringify(this.toJSONObject());
    }

    // data as a JSON object
    toJSONObject(looseMode? : boolean) : MediaScanTypes.LibAsJson {
        // if in loose Mode , the objects will only contains the mapping between filepath and Category
        const toBeSerialized = (looseMode)
            ? [ ["allFilesWithCategory", [...this.allFilesWithCategory] ] ]
            : [
                ["paths", [...this.paths] ],
                ["allFilesWithCategory", [...this.allFilesWithCategory] ],
                ["movies", [...this.allMovies]],
                ["series", this.allTvSeriesNames
                    .reduce( (acc, currentSeries) => {
                        acc.push([currentSeries, [...this.allTvSeries.get(currentSeries)] ]);
                        return acc;
                    }, [])
                ]
            ];
        return toBeSerialized.reduce( (result, [key, value] ) => {
            result[key as string] = value;
            return result;
        }, {});
    }

    static createFromJSON(json: MediaScanTypes.LibAsJson, customConfig?: MediaScanTypes.CustomFunctionsConfig): MediaScan {
        let config: MediaScanTypes.DataParameters = {};
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

    filterMovies(searchParameters: MediaScanTypes.SearchParameters = {}) {
        // apply params based on types
        return filterMoviesByProperties(searchParameters, this.allMovies);
    }

    filterTvSeries(searchParameters: MediaScanTypes.SearchParameters = {}) {
        return filterTvSeriesByProperties(searchParameters, this.allTvSeries);
    }
}

// just to be sure Babel doesn't mess up common js
module.exports = MediaScan;