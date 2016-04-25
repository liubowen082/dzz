/*
	创建申请模板
	liubowen082@163.com
	2016-3-25  22:10
*/
define(function(require, exports, module) {
var moduleList = require('moduleList');
var modTemp = require('modTemp');
var getId = require('getId');// id生成器

var createFormList = function(dom,items,temp){
	temp = temp || moduleList;

	$(items).each(function(i,a){
		var rel = a.input_type;
		var id = getId();
		
		// if(a.option_else != 0 ){
		// 	a.select = a.option + '###othersIsOpen'
		// }else{
		// 	a.select = a.option
		// }

		var optArr = a.option!='' ? a.option.split('###') : [];
		var option = [];
		var value = {};
		if(a.input_type != 'radio' || a.input_type != 'checkbox'){
			$(optArr).each(function(i,a){
				option.push(modTemp(temp[rel].optionTpl || '',{
					title : a
				}))
			})
		}

		if(a.input_type == 'data_list'){
			option= a.data_option.split('|');
			value.value1 = option[0]
			value.value2 = option[1]
		}
		var obj = {
			id:id,
			title: a.title,
			option : option.join(''),
			placeholder : a.placeholder

		};

		obj = $.extend(obj,value);
		
		$(dom).append(modTemp(temp[rel].tpl,obj));

		$('#' + id).data(a)


	});

	$(GLOBAL).trigger('onCreateFormItem')

}

return createFormList

});