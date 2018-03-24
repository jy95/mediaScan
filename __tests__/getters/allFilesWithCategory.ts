// mock from jest
"use strict";
jest.mock("fs");
jest.mock("filehound");

import {files, folders, MediaScan} from "../__helpers__/_constants";

describe("allFilesWithCategory", () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require("fs").__setMockPaths(folders);
        require("filehound").__setResult(files);
    });

    /** @test {TorrentLibrary#allFilesWithCategory} */
    test("Should correctly detect the category of each file", async () => {
        const libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(libInstance.allFilesWithCategory).toEqual(new Map([
            [files[2], MediaScan.MOVIES_TYPE],
            [files[0], MediaScan.TV_SERIES_TYPE],
            [files[1], MediaScan.TV_SERIES_TYPE],
        ]));
    });

});
