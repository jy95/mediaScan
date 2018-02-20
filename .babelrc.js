// var env = process.env.BABEL_ENV || process.env.NODE_ENV; // Maybe later : for minify stuff
var presets = [
    "@babel/env",
    "@babel/typescript"
];
var plugins = [
    "@babel/proposal-class-properties"
];
var ignore = [];
var comments = false;

module.exports = {
    presets: presets,
    plugins: plugins,
    ignore: ignore,
    comments: comments
};