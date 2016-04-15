/*
	preview
	liubowen082@163.com
	2016-04-08  19:30
*/

define(function(require, exports, module) {

	var createForm = require('createForm');


	createForm.layCon = '[node-name="layer-window"]';
	createForm.show(GLOBAL.id,GLOBAL.sid,GLOBAL.data);

	$(createForm).on('onSubmitSuccess',function(){
		alert('提交成功!')
	});


})