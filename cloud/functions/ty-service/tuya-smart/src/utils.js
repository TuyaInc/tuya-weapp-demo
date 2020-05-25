exports.filterValue = function filterValue(o, value) {
    for (let key in o) {
        if (o[key] === value) {
            delete o[key]
        }
    }
}

exports.filterUndefined = function (o) {
    return exports.filterValue(o, undefined)
}

exports.filterNull = function (o) {
    return exports.filterValue(o, null)
}

exports.filterEmptyString = function (o) {
    return exports.filterValue(o, '')
}

exports.warpPromise = function warp(fn) {
    return function (...args) {
        // 确保返回 Promise 实例
        return new Promise(function (resolve, reject) {
            try {
                return fn(...args)
                    .then(resolve)
                    .catch(reject)
            } catch (e) {
                reject(e)
            }
        })
    }
}

exports.objKeySort = function (obj) {
    const newkey = Object.keys(obj).sort();
    const newObj = {};
    for (let i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
}