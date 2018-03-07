// mock from jest
'use strict';
jest.mock('fs');
jest.mock('filehound');

// imports
import * as path from 'path';
import {parse as nameParser} from 'parse-torrent-title';
import {files, folders, MediaScan} from '../__helpers__/_constants';
import {basename} from "path";

describe('removeOldFiles', () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockPaths(folders);
        require('filehound').__setResult(files);
    });

    /** @test {MediaScan#removeOldFiles} */
    test('Should not be able to remove not present files', async () => {
        let libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        const wrongFile = path.join(
            __dirname, 'folder1',
            'The.Blacklist.S04E22.FRENCH.WEBRip.XviD.avi',
        );
        const allFiles = libInstance.allFilesWithCategory;
        const expectedTvSeriesMap = libInstance.allTvSeries;
        await expect(libInstance.removeOldFiles(wrongFile)).resolves;
        expect(libInstance.allFilesWithCategory).toEqual(allFiles);
        expect(libInstance.allTvSeries).toEqual(expectedTvSeriesMap);
    });

    /** @test {MediaScan#removeOldFiles} */
    test('Should be able to remove a movie', async () => {
        let libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        const allFilesWithoutMovie = libInstance.allFilesWithCategory;
        // files[2] ; Bad Ass
        allFilesWithoutMovie.delete(files[2]);

        const eventSpy = jest.spyOn(libInstance, 'removeOldFiles');
        // files[2] ; Bad Ass
        await expect(libInstance.removeOldFiles(files[2])).resolves;
        expect(libInstance.allMovies).toEqual(new Set());

        expect(libInstance.allFilesWithCategory).toEqual(allFilesWithoutMovie);
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
    });

    /** @test {MediaScan#removeOldFiles} */
    test('Should be able to remove an tv-serie episode', async () => {
        let libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        const allFilesWithoutIt = libInstance.allFilesWithCategory;
        // files[1] ; The.Blacklist.S04E21
        allFilesWithoutIt.delete(files[1]);

        const eventSpy = jest.spyOn(libInstance, 'removeOldFiles');
        // files[1] ; The.Blacklist.S04E21
        await expect(libInstance.removeOldFiles(files[1])).resolves;
        expect(libInstance.allTvSeries).toEqual(new Map([
            [nameParser(path.basename(files[0])).title, new Set([
                Object.assign(
                    nameParser(path.basename(files[0])),
                    {filePath: files[0]},
                ),
            ])],
        ]));

        expect(libInstance.allFilesWithCategory).toEqual(allFilesWithoutIt);
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
    });

    /** @test {MediaScan#removeOldFiles} */
    test('Should be able to remove multiples files : Tv-serie', async () => {
        let libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        const allFilesWithoutIt = new Map([[files[2], MediaScan.MOVIES_TYPE]]);

        const eventSpy = jest.spyOn(libInstance, 'removeOldFiles');
        await expect(libInstance.removeOldFiles(...files.slice(0, 2))).resolves;
        expect(libInstance.allTvSeries).toEqual(new Map());

        expect(libInstance.allFilesWithCategory).toEqual(allFilesWithoutIt);
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
    });

// test to handle default parameters
    /** @test {MediaScan#removeOldFiles} */
    test('Should not be able to remove files : wrong custom parser', async () => {
        let libInstance = MediaScan.createFromJSON({
            paths: [
                ...folders,
            ],
            allFilesWithCategory: [
                [
                    files[2],
                    'MOVIES',
                ],
                [
                    files[0],
                    'TV_SERIES',
                ],
                [
                    files[1],
                    'TV_SERIES',
                ],
            ],
            movies: [
                Object.assign(nameParser(basename(files[2])), {
                    filePath: files[2],
                }),
            ],
            series: [
                [
                    'The Blacklist',
                    [
                        Object.assign(nameParser(basename(files[0])), {
                            filePath: files[0],
                        }),
                        Object.assign(nameParser(basename(files[1])), {
                            filePath: files[1],
                        }),
                    ],
                ],
            ],
        }, {
            parser : {}
        });
        const eventSpy = jest.spyOn(libInstance, 'removeOldFiles');
        await expect(libInstance.removeOldFiles(...files)).rejects.toThrowError();
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
    });

});
