// mock from jest
"use strict";
jest.mock("fs");
jest.mock("filehound");

// imports
const basename = require("path").basename;
import {parse as nameParser} from "parse-torrent-title";
import {files, folders, MediaScan} from "../__helpers__/_constants";

describe("allMovies", () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require("fs").__setMockPaths(folders);
        require("filehound").__setResult(files);
    });

// TESTS
    /** @test {MediaScan#allMovies} */
    test("Returns the movies", async () => {
        const libInstance = new MediaScan();
        await expect(libInstance.addNewPath(...folders).resolves);
        await expect(libInstance.scan().resolves);
        expect(libInstance.allMovies).toEqual(
            new Set([
                Object.assign(
                    nameParser(basename(files[2])),
                    {filePath: files[2]},
                ),
            ]),
        );
    });
});
