// mock from jest
'use strict';
jest.mock('fs');
jest.mock('filehound');

// imports
const basename = require('path').basename;
import {folders, files, MediaScan} from '../__helpers__/_constants';
import {parse as nameParser} from 'parse-torrent-title';

describe('allTvSeries', () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockPaths(folders);
        require('filehound').__setResult(files);
    });

// TESTS
    /** @test {TorrentLibrary#allTvSeries} */
    test('Returns the tv-shows', async () => {
        let libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan().resolves);
        expect(new Map([
            [nameParser(basename(files[0])).title, new Set([
                Object.assign(
                    nameParser(basename(files[0])),
                    {filePath: files[0]},
                ),
                Object.assign(
                    nameParser(basename(files[1])),
                    {filePath: files[1]},
                ),
            ])],
        ])).toEqual(libInstance.allTvSeries);
    });

});
