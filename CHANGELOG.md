<a name="1.2.3"></a>
## [1.2.3](https://github.com/jy95/mediaScan/compare/v1.2.2...v1.2.3) (2018-03-23)


### Refactor

* Rewrite default parser integration ([6965bd15b6be2596ab0357cbeabbd4b336d8b010](https://github.com/jy95/mediaScan/commit/6965bd15b6be2596ab0357cbeabbd4b336d8b010))

### Style

* Follows Tslint code conventions ([43dae497e40a27581b59076c57b2caf4d0b67261](https://github.com/jy95/mediaScan/commit/43dae497e40a27581b59076c57b2caf4d0b67261))

<a name="1.2.2"></a>
## [1.2.2](https://github.com/jy95/mediaScan/compare/v1.2.1...v1.2.2) (2018-03-21)


### Perf

* Lodash FP version of removeOldFiles ([5029fd7faafb339fe64694a14a8bb2c0dccaaf03](https://github.com/jy95/mediaScan/commit/5029fd7faafb339fe64694a14a8bb2c0dccaaf03))
* Use Array.prototype.push.apply instead of concat ([047118524790e172df3bb6990403d9e0e24a3a0d](https://github.com/jy95/mediaScan/commit/047118524790e172df3bb6990403d9e0e24a3a0d))

### Upgrade

* Update semantic-release to version 15.1.3 ([da08546df874effc0e71d3d37433bd1fa7541991](https://github.com/jy95/mediaScan/commit/da08546df874effc0e71d3d37433bd1fa7541991)), closes [#21](https://github.com/jy95/mediaScan/issues/21)

<a name="1.2.1"></a>
## [1.2.1](https://github.com/jy95/mediaScan/compare/v1.2.0...v1.2.1) (2018-03-20)


### Perf

* Use babel-minify@canary ([0a05799722e159499cd15e73f69155b7d234c8ea](https://github.com/jy95/mediaScan/commit/0a05799722e159499cd15e73f69155b7d234c8ea))

### Refactor

* Array.prototype.push.apply instead of lodash concat ([cc462c5f9504559d8cadc7a6e16bcc6c5ffe8a76](https://github.com/jy95/mediaScan/commit/cc462c5f9504559d8cadc7a6e16bcc6c5ffe8a76))
* less code version of removeOldFiles ([d6f0fe35d34083f548bef78560bcc3115b61fd36](https://github.com/jy95/mediaScan/commit/d6f0fe35d34083f548bef78560bcc3115b61fd36))

### Upgrade

* Update ALL 20/03/2018 ([9e9df23e26ba5463bf38e249e297e07517e01cf6](https://github.com/jy95/mediaScan/commit/9e9df23e26ba5463bf38e249e297e07517e01cf6))
* Update package-lock ([c604e484f5170efc16bc190977ba39cb8cb18e6e](https://github.com/jy95/mediaScan/commit/c604e484f5170efc16bc190977ba39cb8cb18e6e))

<a name="1.2.0"></a>
# [1.2.0](https://github.com/jy95/mediaScan/compare/v1.1.6...v1.2.0) (2018-03-16)


### CI

* cache only npm and not node modules ([3dbf969d3922c1e70e28278cb8f1b52c1b2b6595](https://github.com/jy95/mediaScan/commit/3dbf969d3922c1e70e28278cb8f1b52c1b2b6595))
* Speed Up Build install step ([a909330eab2b977317c90e86ccf92c08cde8133c](https://github.com/jy95/mediaScan/commit/a909330eab2b977317c90e86ccf92c08cde8133c))

### Feat

* getter allTvSeriesNames ([907e10eee43106faf0a3a3dd96a61aae04e92708](https://github.com/jy95/mediaScan/commit/907e10eee43106faf0a3a3dd96a61aae04e92708))

### Perf

* quick return for filter functions ([5723838147a00398d44b11f7d3904ffedfb05926](https://github.com/jy95/mediaScan/commit/5723838147a00398d44b11f7d3904ffedfb05926))
* simplify toJSONObject series key ([aa1746e36c91bbfb0b5e3d9367f6e0b7ea089f3f](https://github.com/jy95/mediaScan/commit/aa1746e36c91bbfb0b5e3d9367f6e0b7ea089f3f))

### Refactor

* Use Lodash FP instead of transducers ([2ab89f038962e2c0ce8ec56acd2fff806e838671](https://github.com/jy95/mediaScan/commit/2ab89f038962e2c0ce8ec56acd2fff806e838671))

<a name="1.1.6"></a>
## [1.1.6](https://github.com/jy95/mediaScan/compare/v1.1.5...v1.1.6) (2018-03-08)


### Perf

* Transducers for mapProperties ([d9e5d84d4597fe5adb404ca8e4e3aca1ca130355](https://github.com/jy95/mediaScan/commit/d9e5d84d4597fe5adb404ca8e4e3aca1ca130355))
* Transducers version of removeOldFiles ([e40c721f7ed8ad7719eae94843556e882edbdb7c](https://github.com/jy95/mediaScan/commit/e40c721f7ed8ad7719eae94843556e882edbdb7c))
* Use transducers.js to make filter functions faster ([0049824a7c0985a6f1de3f5fc44419b542db1891](https://github.com/jy95/mediaScan/commit/0049824a7c0985a6f1de3f5fc44419b542db1891))

### Test

* Fix coverage issue in removeOldFiles ([b3351829fb91e92d8c6d4ce3fbb3ecffa875368b](https://github.com/jy95/mediaScan/commit/b3351829fb91e92d8c6d4ce3fbb3ecffa875368b))

<a name="1.1.5"></a>
## [1.1.5](https://github.com/jy95/mediaScan/compare/v1.1.4...v1.1.5) (2018-03-07)


### Refactor

* Trying to fix typings for package ([627571c90c003ec94d4dda0cab15dcbeec426a2c](https://github.com/jy95/mediaScan/commit/627571c90c003ec94d4dda0cab15dcbeec426a2c))

<a name="1.1.4"></a>
## [1.1.4](https://github.com/jy95/mediaScan/compare/v1.1.3...v1.1.4) (2018-03-05)


### Chore

* Update DevDependancies ([5a871e2be9b97d6000066f4eb9f3bcc45f098a5b](https://github.com/jy95/mediaScan/commit/5a871e2be9b97d6000066f4eb9f3bcc45f098a5b))

### Docs

* Add TypeScript types for this lib ([46ea8e4a38419f76590a9a2a7676b9c7b25fd665](https://github.com/jy95/mediaScan/commit/46ea8e4a38419f76590a9a2a7676b9c7b25fd665))

### Refactor

* Use implementation of toJSONObject for toJSON() ([a518fdf6639de1ccf4a1191bc2c7879ddde817c0](https://github.com/jy95/mediaScan/commit/a518fdf6639de1ccf4a1191bc2c7879ddde817c0))

<a name="1.1.3"></a>
## [1.1.3](https://github.com/jy95/mediaScan/compare/v1.1.2...v1.1.3) (2018-02-25)


### Perf

* addNewFiles rewritten with Lodash ([3edb2294ce78036c539faad70508c7cdb403e099](https://github.com/jy95/mediaScan/commit/3edb2294ce78036c539faad70508c7cdb403e099))
* removeOldFiles rewritten with Lodash ([95f784690110db972412ccee335eff0e0185fd1c](https://github.com/jy95/mediaScan/commit/95f784690110db972412ccee335eff0e0185fd1c))

### Refactor

* Drop forEach to for ... of ([b2c87c594edb16141fecf36704a0d5b80ba88ed3](https://github.com/jy95/mediaScan/commit/b2c87c594edb16141fecf36704a0d5b80ba88ed3))

<a name="1.1.2"></a>
## [1.1.2](https://github.com/jy95/mediaScan/compare/v1.1.1...v1.1.2) (2018-02-25)


### Perf

* Set specific babel settings ([068aa48b30f45f6057d56b774d5f604dd1f9f88b](https://github.com/jy95/mediaScan/commit/068aa48b30f45f6057d56b774d5f604dd1f9f88b))

### Test

* Fix typo in test name ([592f5e0b8ecdb9884ff14c7066ba358407dfb781](https://github.com/jy95/mediaScan/commit/592f5e0b8ecdb9884ff14c7066ba358407dfb781))

<a name="1.1.1"></a>
## [1.1.1](https://github.com/jy95/mediaScan/compare/v1.1.0...v1.1.1) (2018-02-23)


### Refactor

* filterMoviesByProperties rewritten ([a0a209b96a977e6a941b8a28370e88e5a9ce4ef3](https://github.com/jy95/mediaScan/commit/a0a209b96a977e6a941b8a28370e88e5a9ce4ef3))
* filterTvSeriesByProperties Rewritten ([f0af6d4c9603d471341cba7dd25c6ee358ad97f4](https://github.com/jy95/mediaScan/commit/f0af6d4c9603d471341cba7dd25c6ee358ad97f4))

### Test

* Expect direction ([bc738e49a088ddbf18e8469b44519b8f1d087d51](https://github.com/jy95/mediaScan/commit/bc738e49a088ddbf18e8469b44519b8f1d087d51))

<a name="1.1.0"></a>
# [1.1.0](https://github.com/jy95/mediaScan/compare/v1.0.1...v1.1.0) (2018-02-22)


### Docs

* Add Greenkeeper badge ([afb7bb20b983a55483d9ce5cf2a0dc595322d5ad](https://github.com/jy95/mediaScan/commit/afb7bb20b983a55483d9ce5cf2a0dc595322d5ad))

### Feat

* toJSONObject method ([f625e4a6e46e1430cb0a359fd445ecc9ee1d7969](https://github.com/jy95/mediaScan/commit/f625e4a6e46e1430cb0a359fd445ecc9ee1d7969))

### Perf

* Rewrite filter search Map in ES6 ([5fb3b4328a1e47120afd171a0cfba524cfed7155](https://github.com/jy95/mediaScan/commit/5fb3b4328a1e47120afd171a0cfba524cfed7155))

<a name="1.0.1"></a>
## [1.0.1](https://github.com/jy95/mediaScan/compare/v1.0.0...v1.0.1) (2018-02-22)


### Docs

* add README.md ([964a48fc164bcd23dc0c9c571469452e5fb2f69b](https://github.com/jy95/mediaScan/commit/964a48fc164bcd23dc0c9c571469452e5fb2f69b))

### Perf

* Rewritten filter functions ([9ac0a50ea8da2aafa83b18a699cd10d9968079db](https://github.com/jy95/mediaScan/commit/9ac0a50ea8da2aafa83b18a699cd10d9968079db))

### Style

* change greenkeeper messages with emoji ([9671e75211f271107fb784f18a2451e1a63ca921](https://github.com/jy95/mediaScan/commit/9671e75211f271107fb784f18a2451e1a63ca921))

<a name="1.0.0"></a>
# 1.0.0 (2018-02-21)


### CI

* Set up Codecov ([ad9d8ede49a1f54592b1dc2117dd978d2505e9ad](https://github.com/jy95/mediaScan/commit/ad9d8ede49a1f54592b1dc2117dd978d2505e9ad))

### Fix

* @babel/runtime -prod / @babel/plugin-transform-runtime -dev ([22fa8b5240d6140c169f30116d8a12d624b85db1](https://github.com/jy95/mediaScan/commit/22fa8b5240d6140c169f30116d8a12d624b85db1))
* Fix Babel setup with TypeScript ([f6c31f71f16a6ce4fee1e90b0d3b803b9a0e41cb](https://github.com/jy95/mediaScan/commit/f6c31f71f16a6ce4fee1e90b0d3b803b9a0e41cb))
* Fix Build for Node 6 ([aff1d7480da6b50e4311ef527918097031670e9d](https://github.com/jy95/mediaScan/commit/aff1d7480da6b50e4311ef527918097031670e9d))
* Objects.entries not available in Node 6 - Real Fix ([08bb6a3cdc4222512911c9624b2769aeb18bcbdb](https://github.com/jy95/mediaScan/commit/08bb6a3cdc4222512911c9624b2769aeb18bcbdb))

### Perf

* Add Babel Support (TODO) ([535f81cf9eb4cefc5c8622c7753882cee8ef9a08](https://github.com/jy95/mediaScan/commit/535f81cf9eb4cefc5c8622c7753882cee8ef9a08))
* Rewrite lib in Typescript ([21c03ea65fc33c6408b515c2102e34c9aa9f572d](https://github.com/jy95/mediaScan/commit/21c03ea65fc33c6408b515c2102e34c9aa9f572d))

### Refactor

* Scan method ([f299cedc2fa861686bea506c9f1e3e0d879933a6](https://github.com/jy95/mediaScan/commit/f299cedc2fa861686bea506c9f1e3e0d879933a6))

### Test

* Fix tests ([eef74a80cc1fa1c332fe7bb3360e505c7701d2b5](https://github.com/jy95/mediaScan/commit/eef74a80cc1fa1c332fe7bb3360e505c7701d2b5))
* Rewrite test in proper way ([e49ec418d32b3094ab0ed9b45ea36b0d4a7ccb5d](https://github.com/jy95/mediaScan/commit/e49ec418d32b3094ab0ed9b45ea36b0d4a7ccb5d))
* Rewritten tests in Jest ([e4f7a1abf129384df78689095c5588b900e39bd2](https://github.com/jy95/mediaScan/commit/e4f7a1abf129384df78689095c5588b900e39bd2))
* Trying to fix addNewPath issue ([3e67528bf6d02a1628ea74fdeb3e6898535d434d](https://github.com/jy95/mediaScan/commit/3e67528bf6d02a1628ea74fdeb3e6898535d434d))
* Use toThrowError for rejected promises ([546f5f2aabb4ccdc41390bf315056873609cc292](https://github.com/jy95/mediaScan/commit/546f5f2aabb4ccdc41390bf315056873609cc292))
