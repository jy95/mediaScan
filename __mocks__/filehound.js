'use strict';

// need to manually mock these function as there is no solution : https://github.com/facebook/jest/issues/5589
// here ; a short truncated copy of babel stuff of this class
function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

// truncated version of this stuff
var FileHound = function () {

    // temp files
    let result;

    function FileHound() {
        var _this = _possibleConstructorReturn(this, (FileHound.__proto__ || Object.getPrototypeOf(FileHound)).call(this));
        return _this;
    }

    _createClass(FileHound, [
        {
            key: 'paths',
            value: function paths() {
                return this;
            }
        },
        {
            key: 'ext',
            value: function ext() {
                return this;
            }
        },
        {
            key: 'find',
            value: function find() {
                if (result !== undefined) {
                    return Promise.resolve(result);
                }
                // if nothing provided , throw error
                return Promise.reject("VAUDOU");
            }
        }], [{
        key: 'create',
        value: function create() {
            return new FileHound();
        }
    }, {
        key: '__setResult',
        value: function (ExpectedResult) {
            result = ExpectedResult;
        }
    }]);

    return FileHound;
}();
module.exports = FileHound;