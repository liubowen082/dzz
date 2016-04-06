/*
	创建申请模板 -- 用户添写
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

		// radio  和 checkbox生成选项
		if(a.input_type == 'select' || a.input_type == 'radio' || a.input_type == 'checkbox'){
			var optArr = a.option.split('###');
			var option = [];
			var name = getId();
			$(optArr).each(function(i,a){
				option.push(modTemp(temp[rel].option , {
					optionTitle : a,
					name : name
				}))

			})
		}
		$(dom).append(modTemp(temp[rel].tpl,{
			id:id,
			isMust : a.must ? '<span style="color:red">*</span>' : '',
			title:a.title,
			value : a.value,
			option : $.isArray(option) ? option.join('') : a.option,
			format : 'YYYY-MM-DD hh:mm:ss' || a.format,
			option_else : a.option_else
		}));
		
		$('#' + id).data(a);

		if(a.option_else != 0 )
			$('#'+id).find('label:last').after(temp[rel].other);
	});

	$(GLOBAL).trigger('onCreateSubmitFormItem')

}

return createFormList

});