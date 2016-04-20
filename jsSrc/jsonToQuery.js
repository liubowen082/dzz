define(function () {
    var module = arguments[2];

    var _fdata = function (data, isDecode) {
        data = data == null ? '' : data;
        data = data.toString();
        if (isDecode) {
            return encodeURIComponent(data);
        } else {
            return data;
        }
    };

    module.exports =  function (JSON, isDecode) {

        var _Qstring = [];

        if (typeof JSON == "object") {
            for (var k in JSON) {
                if (k === '$nullName') {
                    _Qstring = _Qstring.concat(JSON[k]);
                    continue;
                }
                if (JSON[k] instanceof Array) {
                    for (var i = 0, len = JSON[k].length; i < len; i++) {
                        _Qstring.push(k + "=" + _fdata(JSON[k][i], isDecode));
                    }
                } else {
                    if (typeof JSON[k] != 'function') {
                        _Qstring.push(k + "=" + _fdata(JSON[k], isDecode));
                    }
                }
            }
        }

        if (_Qstring.length) {
            return _Qstring.join("&");
        } else {
            return "";
        }
    }
});