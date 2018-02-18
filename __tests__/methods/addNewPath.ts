// mock from jest
jest.mock('fs');
jest.mock('filehound');

// imports
import * as path from 'path';
import {files, folders, MediaScan} from '../__helpers__/_constants';


describe('addNewPath', () => {
    beforeAll(() => {
        // Set up some mocked out file info before each test
        require('fs').__setMockPaths(folders);
        require('filehound').__setResult(files);
    });

// TESTS
    /** @test {MediaScan#addNewPath} */
    test('missing parameter', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'addNewPath');
        await expect(libInstance.addNewPath()).rejects.toThrowError();
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(libInstance.hasPathsProvidedByUser()).toBe(false);
    });

    /** @test {MediaScan#addNewPath} */
    test('Not an existent path', async () => {
        let libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, 'addNewPath');
        await expect(libInstance.addNewPath(path.join(__dirname, 'wrongPath'))).rejects.toThrowError();
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(libInstance.hasPathsProvidedByUser()).toBe(false);
    });

    /** @test {MediaScan#addNewPath} */
    test('existent paths', async () => {
        let libInstance = new MediaScan();
        const data = await libInstance.addNewPath(...folders);
        await expect(data).resolves;
        expect(libInstance.hasPathsProvidedByUser()).toBe(true);
    });
});

