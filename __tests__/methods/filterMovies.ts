// mock from jest
'use strict';
jest.mock('fs');
jest.mock('filehound');

// imports
import {parse as nameParser} from 'parse-torrent-title';
import * as path from 'path';
import {files, folders, MediaScan} from '../__helpers__/_constants';

describe('filterMovies', () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockPaths(folders);
        require('filehound').__setResult(files);
    });

    /** @test {MediaScan#filterMovies} */
    test('Should work without parameters', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(new Set([
            Object.assign(
                nameParser(path.basename(files[2])),
                {filePath: files[2]},
            ),
        ])).toEqual(libInstance.filterMovies());
    });

    /** @test {MediaScan#filterMovies} */
    test('default boolean parameters search', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A simple filter that should returns the only movie that we have
        expect(new Set([
            Object.assign(
                nameParser(path.basename(files[2])),
                {filePath: files[2]},
            ),
        ])).toEqual(libInstance.filterMovies({
            remastered: true,
        }));

        // A complex filter that should returns nothing
        expect(new Set()).toEqual(libInstance.filterMovies({
            extended: true,
            unrated: true,
            proper: true,
            repack: true,
            convert: true,
            hardcoded: true,
            retail: true,
            remastered: true,
            additionalProperties: [
                {type: 'boolean', name: 'AnotherField', value: true},
            ],
        }));
    });

    /** @test {MediaScan#filterMovies} */
    test('default number parameters search', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A simple filter that should returns the only movie that we have
        expect(new Set([
            Object.assign(
                nameParser(path.basename(files[2])),
                {filePath: files[2]},
            ),
        ])).toEqual(libInstance.filterMovies({
            year: 2012,
        }));

        // A complex filter that should returns nothing
        expect(new Set()).toEqual(libInstance.filterMovies({
            year: '>=2012',
            additionalProperties: [
                {type: 'number', name: "whateverFieldThatDoesn'tExist", value: '<50'},
                {type: 'number', name: 'AnotherField', value: undefined},
                {type: 'number', name: 'AnotherField2', value: '<=25'},
                {type: 'number', name: 'AnotherField3', value: '>25'},
                {type: 'number', name: 'AnotherField4', value: '==25'},
            ],
        }));
    });

    /** @test {MediaScan#filterMovies} */
    test('default string parameters search', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A simple filter that should returns the only movie that we have
        expect(new Set([
            Object.assign(
                nameParser(path.basename(files[2])),
                {filePath: files[2]},
            ),
        ])).toEqual(libInstance.filterMovies({
            title: 'Bad Ass',
        }));

        // A complex filter that should returns nothing
        expect(new Set()).toEqual(libInstance.filterMovies({
            title: 'Bad Ass',
            additionalProperties: [
                {
                    type: 'string',
                    name: 'whateverField',
                    value: ['NothingExists'],
                },
                {
                    type: 'string',
                    name: 'AnotherField',
                    value: ['NothingExists', 'NothingExists'],
                },
                {type: 'string', name: 'AnotherField2', value: '<=25'},
                {type: 'string', name: 'AnotherField3', value: '>25'},
            ],
        }));
    });

});