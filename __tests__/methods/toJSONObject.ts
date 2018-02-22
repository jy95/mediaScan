// mock from jest
'use strict';
jest.mock('fs');
jest.mock('filehound');

// imports
import {basename} from 'path';
import {parse as nameParser} from 'parse-torrent-title';
import {files, folders, MediaScan} from '../__helpers__/_constants';

describe('toJSONObject', () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockPaths(folders);
        require('filehound').__setResult(files);
    });

    /** @test {MediaScan#toJSONObject} */
    test('return a valid JSON', async () => {
        const expectedJsonString = {
            paths: folders,
            allFilesWithCategory: [
                [
                    files[0],
                    'TV_SERIES',
                ],
                [
                    files[1],
                    'TV_SERIES',
                ],
                [
                    files[2],
                    'MOVIES',
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
        };
        let libInstance = new MediaScan();
        const data = await libInstance.addNewPath(...folders);
        await expect(data).resolves;
        const scan = await libInstance.scan();
        await expect(scan).resolves;
        const dataFromInstance = libInstance.toJSONObject();
        expect(dataFromInstance).toEqual(expectedJsonString);
    });

    test('return a valid JSON | loose mode', async () => {
        const expectedJsonString = JSON.stringify({
            allFilesWithCategory: [
                [
                    files[0],
                    'TV_SERIES',
                ],
                [
                    files[1],
                    'TV_SERIES',
                ],
                [
                    files[2],
                    'MOVIES',
                ],
            ]
        });
        let libInstance = new MediaScan();
        const data = await libInstance.addNewPath(...folders);
        await expect(data).resolves;
        const scan = await libInstance.scan();
        await expect(scan).resolves;
        const dataFromInstance = libInstance.toJSONObject(true);
        expect(JSON.stringify(dataFromInstance)).toEqual(expectedJsonString);
    });
});
