// jest.config.js
module.exports = {
    verbose: true,
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "transform": {
        "^(?!.*\\.d\\.ts$).*\\.tsx?$": "ts-jest"
    },
    "testMatch": [
        "<rootDir>/__tests__/**/*.(ts|tsx|js)"
    ],
    "testPathIgnorePatterns": ["<rootDir>/node_modules/", "<rootDir>/__tests__/__helpers__/"],
    "collectCoverage": true,
    "globals": {
        "ts-jest": {
            "tsConfigFile": "tsconfig.jest.json"
        }
    }
};