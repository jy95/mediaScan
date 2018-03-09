// mock from jest
'use strict';
jest.mock('fs');
jest.mock('filehound');

// imports
const basename = require('path').basename;
import {folders, files, MediaScan} from '../__helpers__/_constants';
import {parse as nameParser} from 'parse-torrent-title';

describe('allTvSeriesNames', () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockPaths(folders);
        require('filehound').__setResult(files);
    });

    test('Returns all the found tv series names', async () => {
        let libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan().resolves);
        expect(libInstance.allTvSeriesNames).toEqual(
            ['The Blacklist']
        )
    });
});