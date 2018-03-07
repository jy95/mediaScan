# mediascan [![Build Status](https://img.shields.io/travis/jy95/mediaScan.svg)](https://travis-ci.org/jy95/mediaScan)  [![codecov](https://codecov.io/gh/jy95/mediaScan/branch/master/graph/badge.svg)](https://codecov.io/gh/jy95/mediaScan) [![Dependency Status](https://img.shields.io/david/jy95/mediaScan.svg)](https://david-dm.org/jy95/mediaScan)   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)  [![Greenkeeper badge](https://badges.greenkeeper.io/jy95/mediaScan.svg)](https://greenkeeper.io/)  [![Join the chat at https://gitter.im/mediaScan/Lobby](https://badges.gitter.im/mediaScan/Lobby.svg)](https://gitter.im/mediaScan/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

> A scanner for media files that follows a user-provided naming convention

## What to do with this library ?

A lot of things :
* Basic listing purposes :
    * [List found movies](https://github.com/jy95/mediaScan/wiki/List-found-movies)
    * [List each found tv serie](https://github.com/jy95/mediaScan/wiki/List-each-found-tv-serie)
    * [Detect the category of each file](https://github.com/jy95/mediaScan/wiki/Detect-the-category-of-each-file)
* Filtering purposes :
    * [Filter movies based on search parameters](https://github.com/jy95/mediaScan/wiki/Filter-movies-by-parameters)
    * [Filter tv-shown based on search parameters](https://github.com/jy95/mediaScan/wiki/Filter-tv-series-by-parameters)
* Miscellaneous purposes
    * [Create custom playlist(s)](https://github.com/jy95/mediaScan/wiki/Create-custom-playlist(s))
* ...

Don't hesitate to suggest new features : it is always worthy :)

## FAQ

### Which naming convention can I use with this lib ?

**ANYTHING**. All You have to do is to implement a parser function :
A function that takes a single string argument (title) that returns an object that minimal contains a `title` string property.
For example :

```js
const ptt = require("parse-torrent-title");
const information = ptt.parse("Game.of.Thrones.S01E01.720p.HDTV.x264-CTU");

console.log(information.title);      // Game of Thrones
console.log(information.season);     // 1
console.log(information.episode);    // 1
console.log(information.resolution); // 720p
console.log(information.codec);      // x264
console.log(information.source);     // HDTV
console.log(information.group);      // CTU
```

This lib was tested with these parsers that follows torrent naming conventions (see their readme for more info) :

* [parse-torrent-title](https://www.npmjs.com/package/parse-torrent-title) (the default in this lib)
* [torrent-name-parser](https://www.npmjs.com/package/torrent-name-parser)
* [torrent-name-parse](https://www.npmjs.com/package/torrent-name-parse)

### How the library detects the category of a media file ?

The default implementation determines it is a tv-show if there is `season` and `episode` attributes can be found in the information provided by the parser.
Here is a example if you want to implement one :
```ts
// Default implementation to know which category is this file
function defaultWhichCategoryFunction(object : MediaScanLib.TPN) : MediaScanLib.Category{
    // workaround : const string enum aren't compiled correctly with Babel
    return (checkProperties(object, ['season', 'episode']))
        ? 'TV_SERIES' as MediaScanLib.Category.TV_SERIES_TYPE : 'MOVIES' as MediaScanLib.Category.MOVIES_TYPE;
}
```

### Using custom parameters in the lib

Check the [constructor](https://github.com/jy95/mediaScan/blob/master/src/MediaScan.ts#L38) for more detail - a illustration :

```js
const MediaScan = require("mediascan");
let libInstance = new MediaScan({
    defaultPath = process.cwd(), // Default path to explore , if paths is empty
    paths = [], // all the paths that will be explored
    allFilesWithCategory = new Map(), // the mapping between file and Category
    movies = new Set(), // Set<ParserResult> (all the movies)
    series = new Map(), // <tvShowName , Set<ParserResult>> (all the tv-series episodes)
}, {
    parser = nameParser, // the explained parser
    whichCategory = defaultWhichCategoryFunction, // the previously explained detection function
});
```

## Installation

For npm users :

```shell
$ npm install --save mediascan
```

for Yarn :
```shell
$ yarn add mediascan
```

## Test

```shell
npm test
```

# Types definitions

If You want, You can have the types definitions used in this lib :

```shell
npm install @types/mediascan
```

## Contributing

* If you're unsure if a feature would make a good addition, you can always [create an issue](https://github.com/jy95/mediaScan/issues/new) first.
* We aim for 100% test coverage. Please write tests for any new functionality or changes.
* Any API changes should be fully documented.
* Make sure your code meets our linting standards. Run `npm run lint` to check your code.
* Be mindful of others when making suggestions and/or code reviewing.