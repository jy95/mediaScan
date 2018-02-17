import {MediaScan} from "../__helpers__/_constants";

const videosExtension = require('video-extensions');


/** @test {TorrentLibrary.MOVIES_TYPE} */
test('Constant MOVIES_TYPE', () => {
    expect(MediaScan.MOVIES_TYPE).toBe('MOVIES');
});

/** @test {TorrentLibrary.TV_SERIES_TYPE} */
test('Constant TV_SERIES', () => {
    expect(MediaScan.TV_SERIES_TYPE).toBe('TV_SERIES');
});

/** @test {TorrentLibrary.listVideosExtension} */
test('List of videos extension', () => {
    expect(MediaScan.listVideosExtension()).toBe(videosExtension);
});
