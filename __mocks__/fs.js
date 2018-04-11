"use strict";
const fs = jest.genMockFromModule("fs");

// temp files
let mockPaths = [];

function access(path, mode, callback) {
  if (!mockPaths.includes(path)) {
    callback(new Error("VAUDOU"));
  }
  callback();
}

function __setMockPaths(pathArray) {
  mockPaths = pathArray;
}

fs.access = access;
fs.__setMockPaths = __setMockPaths;

module.exports = fs;
