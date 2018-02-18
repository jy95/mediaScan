// jest.config.js
module.exports = {
    verbose: true,
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "transform": {
        "^.+\\.(ts|tsx)$": "<rootDir>/__tests__/__helpers__/preprocessor.js"
    },
    "testMatch": [
        "<rootDir>/__tests__/**/*.(ts|tsx|js)"
    ],
    "testPathIgnorePatterns": ["<rootDir>/node_modules/", "<rootDir>/__tests__/__helpers__/"],
    "collectCoverage": true
};