// mock from jest
jest.mock('fs');
jest.mock('filehound');

// imports
const basename = require('path').basename;
import {parse as nameParser} from 'parse-torrent-title';
import {folders, files, MediaScan} from '../__helpers__/_constants';

beforeAll(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockPaths(folders);
    require('filehound').__setResult([files[2]]);
});

// TESTS
/** @test {MediaScan#allMovies} */
test('Returns the movies', async () => {
    let libInstance = new MediaScan();
    await expect(libInstance.addNewPath(...folders).resolves);
    await expect(libInstance.scan().resolves);
    expect(new Set([
        Object.assign(
            nameParser(basename(files[2])),
            {filePath: files[2]},
        ),
    ])).toEqual(libInstance.allMovies);
});

