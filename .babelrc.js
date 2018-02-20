// var env = process.env.BABEL_ENV || process.env.NODE_ENV; // Maybe later : for minify stuff
var presets = [
    "@babel/env",
    "@babel/preset-typescript"
];
var plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/proposal-object-rest-spread"
];
var ignore = [];
var comments = false;

module.exports = {
    presets: presets,
    plugins: plugins,
    ignore: ignore,
    comments: comments
};