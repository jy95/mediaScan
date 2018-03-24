// mock from jest
"use strict";
jest.mock("fs");
jest.mock("filehound");

// imports
import {parse as nameParser} from "parse-torrent-title";
import * as path from "path";
import {files, folders, MediaScan} from "../__helpers__/_constants";

describe("filterTvSeries", () => {

    beforeAll(() => {
        // Set up some mocked out file info before each test
        require("fs").__setMockPaths(folders);
        require("filehound").__setResult(files);
    });

    /** @test {MediaScan#filterTvSeries} */
    test("Should work without parameters", async () => {
        const libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, "scan");
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);
        expect(libInstance.filterTvSeries()).toEqual(
            new Map([
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
            ]),
        );
    });

    /** @test {MediaScan#filterTvSeries} */
    test("default boolean parameters search", async () => {
        const libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, "scan");
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A complex filter that should returns nothing
        expect(libInstance.filterTvSeries({
            additionalProperties: [
                {type: "boolean", name: "AnotherField", value: true},
            ],
            convert: true,
            extended: true,
            hardcoded: true,
            proper: true,
            remastered: true,
            repack: true,
            retail: true,
            unrated: true,
        })).toEqual(new Map());
    });

    /** @test {MediaScan#filterTvSeries} */
    test("default number parameters search", async () => {
        const libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, "scan");
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A simple filter that should returns the two tv series that we have
        expect(libInstance.filterTvSeries({
            season: 4,
        })).toEqual(
            new Map([
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
            ]),
        );

        // A complex filter that should returns nothing
        expect((libInstance.filterTvSeries({
            additionalProperties: [
                {type: "number", name: "whateverFieldThatDoesn'tExist", value: "<50"},
                {type: "number", name: "AnotherField", value: undefined},
                {type: "number", name: "AnotherField2", value: "<=25"},
                {type: "number", name: "AnotherField3", value: ">25"},
                {type: "number", name: "AnotherField4", value: "==25"},
            ],
            season: ">=4",
        }))).toEqual(
            new Map(),
        );
    });

    /** @test {MediaScan#filterTvSeries} */
    test("default string parameters search", async () => {
        const libInstance = new MediaScan();
        const eventSpy = jest.spyOn(libInstance, "scan");
        // whatever path that should exists
        await expect(libInstance.addNewPath(...folders)).resolves;
        await expect(libInstance.scan()).resolves;
        expect(eventSpy).toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalledTimes(1);

        // A simple filter that should returns the only movie that we have
        expect(libInstance.filterTvSeries({
            title: "The Blacklist",
        })).toEqual(
            new Map([
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
            ]),
        );

        // A complex filter that should returns nothing
        expect(libInstance.filterTvSeries({
            additionalProperties: [
                {
                    name: "whateverField",
                    type: "string",
                    value: ["NothingExists"],
                },
                {
                    name: "AnotherField",
                    type: "string",
                    value: ["NothingExists", "NothingExists"],
                },
                { name: "AnotherField2", type: "number", value: "<=25"},
                { name: "AnotherField3", type: "number", value: ">25"},
            ],
            title: "The Blacklist",
        })).toEqual(new Map());
    });

});
