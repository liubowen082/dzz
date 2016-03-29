/*
	id生成器
	liubowen082@163.com
	2016-3-29  11:40
*/
define(function(require, exports, module) {
	return function (){
		return 'id'+ new Date().getTime();
	}
});