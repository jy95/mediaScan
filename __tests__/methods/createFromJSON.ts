// mock from jest
jest.mock('fs');
jest.mock('filehound');

// imports
import {files, folders, MediaScan} from '../__helpers__/_constants';

beforeAll(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockPaths(folders);
    require('filehound').__setResult([...files]);
});

/** @test {MediaScan.createFromJSON} */
test('create a perfect copy of instance', async () => {
    let libInstance = new MediaScan();
    await expect(libInstance.addNewPath(...folders)).resolves;
    await expect(libInstance.scan()).resolves;
    const jsonFromLib = JSON.parse(libInstance.toJSON());
    const createdInstance = MediaScan.createFromJSON(jsonFromLib);
    expect(createdInstance.allFilesWithCategory).toEqual(libInstance.allFilesWithCategory);
    expect(createdInstance.allMovies).toEqual(libInstance.allMovies);
    expect(createdInstance.allTvSeries).toEqual(libInstance.allTvSeries);
});

// dummy test for ES6 code coverage
/** @test {MediaScan.createFromJSON} */
test('empty instance(s)', async () => {
    expect(MediaScan.createFromJSON({}, {})).toBeInstanceOf(MediaScan);
});
