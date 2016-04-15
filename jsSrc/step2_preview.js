/*
	preview
	liubowen082@163.com
	2016-04-08  19:30
*/

define(function(require, exports, module) {

	var createForm = require('createForm');


	createForm.layCon = '[node-name="layer-window"]';
	createForm.create(GLOBAL.data,GLOBAL.id,GLOBAL.sid);

	$(createForm).on('onSubmitSuccess',function(){
		alert('提交成功!')
	});


})