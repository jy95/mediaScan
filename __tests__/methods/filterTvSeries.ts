// mock from jest
'use strict';
jest.mock('fs');
jest.mock('filehound');

// imports
import {parse as nameParser} from 'parse-torrent-title';
import * as path from 'path';
import {files, folders, MediaScan} from '../__helpers__/_constants';

describe('filterTvSeries', () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockPaths(folders);
        require('filehound').__setResult(files);
    });

    /** @test {MediaScan#filterTvSeries} */
    test('Should work without parameters', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(new Map([
            [nameParser(path.basename(files[0])).title, new Set([
                Object.assign(
                    nameParser(path.basename(files[0])),
                    {filePath: files[0]},
                ),
                Object.assign(
                    nameParser(path.basename(files[1])),
                    {filePath: files[1]},
                ),
            ])],
        ])).toEqual(libInstance.filterTvSeries());
    });

    /** @test {MediaScan#filterTvSeries} */
    test('default boolean parameters search', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);


        // A complex filter that should returns nothing
        expect(new Map()).toEqual(libInstance.filterTvSeries({
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

    /** @test {MediaScan#filterTvSeries} */
    test('default number parameters search', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A simple filter that should returns the two tv series that we have
        expect(new Map([
            [nameParser(path.basename(files[0])).title, new Set([
                Object.assign(
                    nameParser(path.basename(files[0])),
                    {filePath: files[0]},
                ),
                Object.assign(
                    nameParser(path.basename(files[1])),
                    {filePath: files[1]},
                ),
            ])],
        ])).toEqual(libInstance.filterTvSeries({
            season: 4,
        }));

        // A complex filter that should returns nothing
        expect(new Map()).toEqual(libInstance.filterTvSeries({
            season: '>=4',
            additionalProperties: [
                {type: 'number', name: "whateverFieldThatDoesn'tExist", value: '<50'},
                {type: 'number', name: 'AnotherField', value: undefined},
                {type: 'number', name: 'AnotherField2', value: '<=25'},
                {type: 'number', name: 'AnotherField3', value: '>25'},
                {type: 'number', name: 'AnotherField4', value: '==25'},
            ],
        }));
    });

    /** @test {MediaScan#filterTvSeries} */
    test('default string parameters search', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'scan');
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A simple filter that should returns the only movie that we have
        expect(new Map([
            [nameParser(path.basename(files[0])).title, new Set([
                Object.assign(
                    nameParser(path.basename(files[0])),
                    {filePath: files[0]},
                ),
                Object.assign(
                    nameParser(path.basename(files[1])),
                    {filePath: files[1]},
                ),
            ])],
        ])).toEqual(libInstance.filterTvSeries({
            title: 'The Blacklist',
        }));

        // A complex filter that should returns nothing
        expect(new Map()).toEqual(libInstance.filterTvSeries({
            title: 'The Blacklist',
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
                {type: 'number', name: 'AnotherField2', value: '<=25'},
                {type: 'number', name: 'AnotherField3', value: '>25'},
            ],
        }));
    });

});