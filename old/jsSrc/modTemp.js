/**
 * 格式化数据
 */
define(function(require, exports, module) {

    var getData = function(data,str){

        var strArr = str.split('.');
        if(strArr.length == 1){
            return data[str] || '';
        }else{
            var _str = strArr.shift();
            return getData(data[_str] , strArr.join('.') )
        }
    };


    var modTemp = function(template, data) {
        return template.replace(/#\{(.+?)\}/ig, function() {
            var key = arguments[1].replace(/\s/ig, '');
            var ret = arguments[0];
            var list = key.split('||');

            for (var i = 0, len = list.length; i < len; i += 1) {
                if (/^default:.*$/.test(list[i])) {
                    ret = list[i].replace(/^default:/, '');
                    break;
                } else if (data[list[i]] !== undefined) {
                    ret = data[list[i]];
                    break;
                } else if (list[i] && data[list[i]] == undefined){
                    ret = getData(data , list[i]);
                    break;
                }else {
                    ret = '';
                }
            }
            return ret;
        });
    };

    return modTemp
})